const { Actor, log } = require('apify');
const { PlaywrightCrawler, Dataset } = require('apify');
const { firefox } = require('playwright');

const LISTING_STATUSES = {
    PENDING: ['pending', 'pending offer'],
    UNDER_CONTRACT: ['under contract', 'contingent', 'contingent offer']
};

class ZillowScraper {
    constructor(input) {
        this.input = input;
        this.results = [];
    }

    buildZillowUrl() {
        const baseUrl = 'https://www.zillow.com/homes/';
        const params = new URLSearchParams();
        
        // Location
        if (this.input.searchLocation) {
            params.append('searchQueryState', JSON.stringify({
                filterState: this.buildFilterState(),
                isListVisible: true,
                isMapVisible: true,
                region: {
                    regionValue: this.input.searchLocation,
                    regionType: 6
                }
            }));
        }

        return `${baseUrl}?${params.toString()}`;
    }

    buildFilterState() {
        const filterState = {
            // Critical: Only show pending and under contract
            isForSaleByAgent: { value: false },
            isForSaleByOwner: { value: false },
            isNewConstruction: { value: false },
            isComingSoon: { value: false },
            isAuction: { value: false },
            isForRent: { value: false },
            // Show pending and contingent
            isSoldInLast6Months: { value: false },
            isPreMarketForeclosure: { value: false },
            isPreMarketPreForeclosure: { value: false },
            isAllHomes: { value: true }
        };

        // Price range
        if (this.input.minPrice || this.input.maxPrice) {
            filterState.price = {};
            if (this.input.minPrice) filterState.price.min = this.input.minPrice;
            if (this.input.maxPrice) filterState.price.max = this.input.maxPrice;
        }

        // Bedrooms
        if (this.input.minBedrooms || this.input.maxBedrooms) {
            filterState.beds = {};
            if (this.input.minBedrooms) filterState.beds.min = this.input.minBedrooms;
            if (this.input.maxBedrooms) filterState.beds.max = this.input.maxBedrooms;
        }

        // Bathrooms
        if (this.input.minBathrooms || this.input.maxBathrooms) {
            filterState.baths = {};
            if (this.input.minBathrooms) filterState.baths.min = this.input.minBathrooms;
            if (this.input.maxBathrooms) filterState.baths.max = this.input.maxBathrooms;
        }

        // Home types
        if (this.input.homeTypes && this.input.homeTypes.length > 0) {
            filterState.homeTypes = {};
            this.input.homeTypes.forEach(type => {
                filterState.homeTypes[type] = { value: true };
            });
        }

        // Square footage
        if (this.input.minSquareFeet || this.input.maxSquareFeet) {
            filterState.sqft = {};
            if (this.input.minSquareFeet) filterState.sqft.min = this.input.minSquareFeet;
            if (this.input.maxSquareFeet) filterState.sqft.max = this.input.maxSquareFeet;
        }

        // Lot size
        if (this.input.minLotSize || this.input.maxLotSize) {
            filterState.lotSize = {};
            if (this.input.minLotSize) filterState.lotSize.min = this.input.minLotSize;
            if (this.input.maxLotSize) filterState.lotSize.max = this.input.maxLotSize;
        }

        // Year built
        if (this.input.minYearBuilt || this.input.maxYearBuilt) {
            filterState.built = {};
            if (this.input.minYearBuilt) filterState.built.min = this.input.minYearBuilt;
            if (this.input.maxYearBuilt) filterState.built.max = this.input.maxYearBuilt;
        }

        return filterState;
    }

    isValidPropertyStatus(status) {
        if (!status) return false;
        
        const normalizedStatus = status.toLowerCase().trim();
        
        // Check if it's a pending status
        const isPending = LISTING_STATUSES.PENDING.some(pendingStatus => 
            normalizedStatus.includes(pendingStatus)
        );
        
        // Check if it's an under contract status
        const isUnderContract = LISTING_STATUSES.UNDER_CONTRACT.some(contractStatus => 
            normalizedStatus.includes(contractStatus)
        );
        
        return isPending || isUnderContract;
    }

    extractPropertyData(propertyElement, page) {
        try {
            // Extract basic property information
            const address = propertyElement.$eval('[data-test="property-card-addr"]', 
                el => el?.textContent?.trim()) || null;
            
            const price = propertyElement.$eval('[data-test="property-card-price"]', 
                el => el?.textContent?.trim()) || null;
            
            const beds = propertyElement.$eval('[data-test="property-card-meta"]', 
                el => {
                    const text = el?.textContent || '';
                    const match = text.match(/(\d+)\s*bd/i);
                    return match ? parseInt(match[1]) : null;
                }) || null;
            
            const baths = propertyElement.$eval('[data-test="property-card-meta"]', 
                el => {
                    const text = el?.textContent || '';
                    const match = text.match(/(\d+(?:\.\d+)?)\s*ba/i);
                    return match ? parseFloat(match[1]) : null;
                }) || null;
            
            const sqft = propertyElement.$eval('[data-test="property-card-meta"]', 
                el => {
                    const text = el?.textContent || '';
                    const match = text.match(/(\d+(?:,\d+)*)\s*sqft/i);
                    return match ? parseInt(match[1].replace(/,/g, '')) : null;
                }) || null;
            
            const status = propertyElement.$eval('[data-test="property-card-status"]', 
                el => el?.textContent?.trim()) || 
                propertyElement.$eval('.list-card-statusText', 
                el => el?.textContent?.trim()) || null;
            
            const propertyUrl = propertyElement.$eval('a[data-test="property-card-link"]', 
                el => el?.href) || null;
            
            // Extract Zillow property ID from URL
            const zillowId = propertyUrl ? 
                propertyUrl.match(/\/(\d+)_zpid/)?.[1] : null;
            
            // Extract property type
            const propertyType = propertyElement.$eval('[data-test="property-card-type"]', 
                el => el?.textContent?.trim()) || null;
            
            return {
                address,
                price,
                bedrooms: beds,
                bathrooms: baths,
                squareFeet: sqft,
                propertyType,
                listingStatus: status,
                zillowPropertyId: zillowId,
                listingUrl: propertyUrl,
                scrapedAt: new Date().toISOString()
            };
        } catch (error) {
            log.warning(`Error extracting property data: ${error.message}`);
            return null;
        }
    }

    async scrapeProperties() {
        const crawler = new PlaywrightCrawler({
            launchContext: {
                launcher: firefox,
                launchOptions: {
                    headless: true,
                }
            },
            proxyConfiguration: this.input.proxyConfiguration,
            maxRequestsPerCrawl: 50,
            requestHandler: async ({ page, request, log: crawlerLog }) => {
                crawlerLog.info(`Scraping page: ${request.loadedUrl}`);
                
                try {
                    // Wait for the listings to load
                    await page.waitForSelector('[data-test="property-card"]', { 
                        timeout: 30000 
                    });
                    
                    // Wait a bit more for all content to load
                    await page.waitForTimeout(3000);
                    
                    // Get all property cards
                    const propertyCards = await page.$$('[data-test="property-card"]');
                    crawlerLog.info(`Found ${propertyCards.length} property cards`);
                    
                    let validProperties = 0;
                    
                    for (const card of propertyCards) {
                        if (this.results.length >= (this.input.maxResults || 100)) {
                            break;
                        }
                        
                        const propertyData = await this.extractPropertyData(card, page);
                        
                        if (propertyData && this.isValidPropertyStatus(propertyData.listingStatus)) {
                            crawlerLog.info(`Valid property found: ${propertyData.address} - Status: ${propertyData.listingStatus}`);
                            this.results.push(propertyData);
                            validProperties++;
                        } else if (propertyData) {
                            crawlerLog.debug(`Skipping property with status: ${propertyData.listingStatus}`);
                        }
                    }
                    
                    crawlerLog.info(`Found ${validProperties} valid pending/under contract properties`);
                    
                    // Try to find and click next page if we need more results
                    if (this.results.length < (this.input.maxResults || 100)) {
                        const nextButton = await page.$('[aria-label="Next page"]');
                        if (nextButton && await nextButton.isEnabled()) {
                            await nextButton.click();
                            await page.waitForTimeout(2000);
                            
                            // Add the next page URL to the queue
                            const currentUrl = page.url();
                            await crawler.addRequests([currentUrl]);
                        }
                    }
                    
                } catch (error) {
                    crawlerLog.error(`Error scraping page: ${error.message}`);
                }
            },
        });

        const startUrl = this.buildZillowUrl();
        log.info(`Starting scraping with URL: ${startUrl}`);
        
        await crawler.run([startUrl]);
        
        return this.results;
    }
}

Actor.main(async () => {
    try {
        log.info('Zillow Pending & Under Contract Scraper started');
        
        const input = await Actor.getInput();
        
        if (!input?.searchLocation) {
            throw new Error('Search location is required');
        }
        
        log.info('Input configuration:', input);
        
        const scraper = new ZillowScraper(input);
        const properties = await scraper.scrapeProperties();
        
        log.info(`Scraped ${properties.length} pending/under contract properties`);
        
        // Filter results one more time to ensure we only have valid statuses
        const filteredProperties = properties.filter(property => 
            scraper.isValidPropertyStatus(property.listingStatus)
        );
        
        log.info(`Final count after filtering: ${filteredProperties.length} properties`);
        
        // Save results to dataset
        if (filteredProperties.length > 0) {
            await Dataset.pushData(filteredProperties);
        }
        
        // Also save as key-value store for easy access
        await Actor.setValue('OUTPUT', filteredProperties);
        
        log.info('Scraper completed successfully');
        
    } catch (error) {
        log.error(`Actor failed with error: ${error.message}`);
        log.error('Stack trace:', error.stack);
        throw error;
    }
});
