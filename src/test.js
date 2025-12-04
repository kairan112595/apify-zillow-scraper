const { Actor } = require('apify');
const fs = require('fs');
const path = require('path');

// Load test configurations from JSON file
let testConfigs = {};
try {
    const testConfigPath = path.join(__dirname, '..', 'test-inputs.json');
    if (fs.existsSync(testConfigPath)) {
        testConfigs = JSON.parse(fs.readFileSync(testConfigPath, 'utf8'));
    }
} catch (error) {
    console.log('Could not load test-inputs.json, using default config');
}

// Default test input
const defaultTestInput = {
    searchLocation: "Los Angeles, CA",
    minPrice: 500000,
    maxPrice: 1500000,
    minBedrooms: 2,
    maxBedrooms: 4,
    minBathrooms: 2,
    homeTypes: ["house", "condo"],
    maxResults: 10,
    outputFormat: "json"
};

// Get test configuration (use command line argument or default)
const testName = process.argv[2] || 'default';
const testInput = testConfigs[testName] || defaultTestInput;

async function runTest() {
    console.log(`Testing Zillow Pending & Under Contract Scraper with "${testName}" configuration...`);
    console.log('Test input:', JSON.stringify(testInput, null, 2));
    
    // Show available test configurations
    if (Object.keys(testConfigs).length > 0) {
        console.log('\nAvailable test configurations:', Object.keys(testConfigs).join(', '));
        console.log('Usage: npm test [config_name]');
    }
    
    // Mock the Actor.getInput() function
    Actor.getInput = async () => testInput;
    
    try {
        // Import and run the main scraper
        require('./main.js');
        console.log('Test completed successfully!');
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

// Only run test if this file is executed directly
if (require.main === module) {
    runTest();
}

module.exports = { testConfigs, defaultTestInput };
