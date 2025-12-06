# Deployment Guide for Apify Zillow Scraper

## Quick Start for Apify Console

### Step 1: Create New Actor
1. Log into [Apify Console](https://console.apify.com)
2. Click "Actors" in the sidebar
3. Click "Create new" button
4. Select "Empty Node.js + Playwright template"
5. Name it "zillow-pending-scraper"

### Step 2: Upload Project Files
Copy and paste the following files into your Apify actor:

#### File: `.actor/actor.json`
```json
{
    "actorSpecification": 1,
    "name": "zillow-pending-scraper",
    "title": "Zillow Pending & Under Contract Scraper",
    "description": "Extracts only Pending and Under Contract properties from Zillow with customizable filters",
    "version": "1.0",
    "meta": {
        "templateId": "node-playwright"
    },
    "input": "./input_schema.json",
    "output": "./output_schema.json"
}
```

#### File: `package.json`
Copy the package.json content from the project.

#### File: `input_schema.json`
Copy the input_schema.json content from the project.

#### File: `output_schema.json`
Copy the output_schema.json content from the project.

#### File: `src/main.js`
Copy the main.js content from the project.

### Step 3: Build the Actor
1. Click "Build" button in Apify Console
2. Wait for the build to complete (usually 2-5 minutes)
3. Check the build log for any errors

### Step 4: Test the Actor
1. Click "Start" button
2. Enter test configuration:
   ```json
   {
     "searchLocation": "Los Angeles, CA",
     "minPrice": 500000,
     "maxPrice": 1000000,
     "maxResults": 10
   }
   ```
3. Click "Start" to run the test

## Alternative: Deploy via Apify CLI

### Prerequisites
```bash
npm install -g apify-cli
```

### Login and Deploy
```bash
# Login to your Apify account
apify login

# Navigate to project directory
cd path/to/zillow-scraper

# Create and push the actor
apify create --template node-playwright
apify push
```

## Configuration in Apify Console

Once deployed, you can easily modify the scraper settings through the web interface:

### Input Tab Configuration
- **Search Location**: Enter city, state, or ZIP
- **Price Filters**: Set min/max price ranges
- **Property Filters**: Choose bedrooms, bathrooms, home types
- **Advanced**: Square footage, lot size, year built
- **Output**: Choose JSON or CSV format

### Running Multiple Searches
To run the scraper with different parameters:

1. Go to your actor in Apify Console
2. Click "Start"
3. Modify the input parameters
4. Click "Start" to begin scraping
5. View results in the "Storage" tab

## Scheduled Runs

To set up regular scraping:

1. Click "Schedules" in your actor
2. Click "Create schedule"
3. Set frequency (daily, weekly, etc.)
4. Configure input parameters
5. Save the schedule

## Monitoring and Results

### Viewing Results
- **Dataset**: All scraped properties
- **Key-Value Store**: Quick access to latest results
- **Logs**: Detailed execution information

### Downloading Data
- JSON format: Direct download from Dataset
- CSV format: Export option available
- API access: Use Apify API to retrieve data programmatically

## Troubleshooting Common Issues

### Build Fails
- Check package.json syntax
- Verify all required files are present
- Review build logs for specific errors

### No Results
- Verify search location is valid
- Check if any pending properties exist in that area
- Expand search criteria (price range, property types)

### Rate Limiting
- Enable proxy configuration
- Reduce maxResults to process fewer pages
- Add delays between requests

### Memory Issues
- Reduce maxResults
- Enable proxy rotation
- Use smaller batch sizes

## API Integration

Once deployed, you can integrate the scraper into your applications:

```javascript
const ApifyClient = require('apify-client');

const client = new ApifyClient({
    token: 'YOUR_APIFY_TOKEN'
});

// Start a scraping run
const run = await client.actor('your-actor-id').call({
    searchLocation: 'Miami, FL',
    minPrice: 400000,
    maxPrice: 800000,
    maxResults: 50
});

// Get results
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(items);
```

## Best Practices

1. **Start Small**: Begin with limited results to test
2. **Use Proxies**: Always enable proxy rotation for production
3. **Monitor Logs**: Check execution logs regularly
4. **Respect Limits**: Don't overload with too many concurrent runs
5. **Backup Data**: Export important results regularly

## Support

If you encounter issues:
1. Check the actor execution logs
2. Verify input configuration
3. Test with minimal parameters
4. Contact support if problems persist
