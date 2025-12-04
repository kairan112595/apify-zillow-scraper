# Zillow Pending & Under Contract Scraper

An Apify actor that extracts only **Pending** and **Under Contract** properties from Zillow, excluding all regular "For Sale" listings.

## 🚀 Features

- **Exclusive Status Filtering**: Only extracts properties with "Pending" and "Under Contract" statuses
- **Comprehensive Filters**: Price, bedrooms, bathrooms, home type, square footage, lot size, year built
- **Configurable**: Easy-to-use input form in Apify Console
- **Multiple Outputs**: JSON and CSV format support
- **Proxy Support**: Built-in proxy rotation for reliable scraping

## 📋 Critical Requirement

This scraper specifically addresses the issue where Zillow's frontend shows both "For Sale" and "Pending/Under Contract" properties when you select "Pending & Under Contract". 

**This scraper excludes ALL regular "For Sale" listings** and returns **ONLY**:
- ✅ Pending
- ✅ Under Contract
- ✅ Contingent
- ✅ Pending Offer
- ✅ Contingent Offer

## 🛠️ Setup Instructions

### Option 1: Upload to Apify Console

1. **Create New Actor**:
   - Go to [Apify Console](https://console.apify.com)
   - Click "Create new" → "Actor"
   - Choose "Empty Node.js + Playwright template"

2. **Upload Files**:
   - Copy all files from this project to your actor
   - Ensure the file structure matches exactly:
   ```
   /
   ├── .actor/
   │   └── actor.json
   ├── src/
   │   ├── main.js
   │   └── test.js
   ├── Dockerfile
   ├── input_schema.json
   ├── package.json
   └── README.md
   ```

3. **Build and Run**:
   - Click "Build"
   - Once built, click "Start" and configure your inputs

### Option 2: Deploy via Apify CLI

1. **Install Apify CLI**:
   ```bash
   npm install -g apify-cli
   ```

2. **Login to Apify**:
   ```bash
   apify login
   ```

3. **Deploy**:
   ```bash
   cd /path/to/this/project
   apify push
   ```

## ⚙️ Input Configuration

### Required Fields
- **Search Location**: City, state, ZIP code (e.g., "Los Angeles, CA", "90210")

### Optional Filters
- **Price Range**: Min/Max price in USD
- **Bedrooms**: Min/Max number of bedrooms
- **Bathrooms**: Min/Max number of bathrooms
- **Home Types**: Select from house, condo, townhouse, multi-family, land, manufactured
- **Square Footage**: Min/Max property size
- **Lot Size**: Min/Max lot size in square feet
- **Year Built**: Min/Max year built
- **Max Results**: Maximum number of properties to scrape (default: 100)
- **Output Format**: JSON or CSV

### Example Input Configuration

```json
{
  "searchLocation": "Miami, FL",
  "minPrice": 300000,
  "maxPrice": 800000,
  "minBedrooms": 2,
  "maxBedrooms": 4,
  "minBathrooms": 2,
  "homeTypes": ["house", "condo"],
  "maxResults": 50,
  "outputFormat": "json"
}
```

## 📊 Output Data

Each property includes:

```json
{
  "address": "123 Main St, Los Angeles, CA 90210",
  "price": "$750,000",
  "bedrooms": 3,
  "bathrooms": 2.5,
  "squareFeet": 1800,
  "propertyType": "House",
  "listingStatus": "Pending",
  "zillowPropertyId": "12345678",
  "listingUrl": "https://www.zillow.com/homedetails/...",
  "scrapedAt": "2024-12-04T10:30:00.000Z"
}
```

## 🔧 How to Change Filters

### In Apify Console:
1. Go to your actor
2. Click "Input" tab
3. Modify the form fields
4. Click "Start" to run with new settings

### Programmatically:
1. Modify the input JSON in the actor configuration
2. Save and restart the actor

## 📈 Usage Examples

### Example 1: Luxury Homes in Beverly Hills
```json
{
  "searchLocation": "Beverly Hills, CA",
  "minPrice": 2000000,
  "homeTypes": ["house"],
  "maxResults": 25
}
```

### Example 2: Condos in Downtown Miami
```json
{
  "searchLocation": "Miami Beach, FL",
  "minPrice": 400000,
  "maxPrice": 1200000,
  "homeTypes": ["condo"],
  "minBedrooms": 1,
  "maxBedrooms": 3,
  "maxResults": 50
}
```

### Example 3: Family Homes in Suburbs
```json
{
  "searchLocation": "Plano, TX",
  "minBedrooms": 3,
  "minBathrooms": 2,
  "homeTypes": ["house", "townhouse"],
  "minSquareFeet": 1500,
  "maxResults": 100
}
```

## 🛡️ Status Filtering Logic

The scraper uses sophisticated filtering to ensure only genuine pending/under contract properties are returned:

- **Pending**: Properties with "pending" or "pending offer" status
- **Under Contract**: Properties with "under contract", "contingent", or "contingent offer" status
- **Excluded**: All "For Sale", "Active", "New", "Price Changed" and other non-pending statuses

## 🔍 Troubleshooting

### No Results Found
1. **Check Location**: Ensure the search location is valid
2. **Expand Filters**: Try wider price ranges or fewer restrictions
3. **Market Conditions**: Some areas may have very few pending properties

### Actor Fails to Start
1. **Check Input**: Ensure search location is provided
2. **Review Logs**: Check the actor run logs for specific error messages
3. **Proxy Issues**: Try different proxy settings if blocked

### Unexpected Results
1. **Verify Status**: Check that scraped properties have correct statuses
2. **Update Filters**: Adjust your search criteria
3. **Contact Support**: Report any consistent issues

## 📝 Technical Details

- **Runtime**: Node.js 18 with Playwright
- **Browser**: Firefox (more reliable for Zillow)
- **Proxy**: Residential proxies recommended
- **Rate Limiting**: Built-in delays and request limiting
- **Data Storage**: Apify Dataset for results, Key-Value Store for quick access

## 🆘 Support

For issues or questions:
1. Check the actor run logs first
2. Verify your input configuration
3. Test with a simpler search (fewer filters)
4. Contact the actor developer if problems persist

## 📄 License

MIT License - feel free to modify and adapt for your needs.

---

**Note**: This scraper is designed to respect Zillow's terms of service. Use responsibly and in accordance with applicable laws and website terms.
