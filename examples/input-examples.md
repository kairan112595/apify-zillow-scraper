# Example input configurations for testing

## Basic Configuration
```json
{
  "searchLocation": "Los Angeles, CA",
  "maxResults": 20
}
```

## Advanced Configuration with All Filters
```json
{
  "searchLocation": "Miami, FL",
  "minPrice": 400000,
  "maxPrice": 1200000,
  "minBedrooms": 2,
  "maxBedrooms": 4,
  "minBathrooms": 2,
  "maxBathrooms": 3,
  "homeTypes": ["house", "condo", "townhouse"],
  "minSquareFeet": 1200,
  "maxSquareFeet": 3000,
  "minLotSize": 2000,
  "maxLotSize": 10000,
  "minYearBuilt": 2000,
  "maxYearBuilt": 2023,
  "maxResults": 50,
  "outputFormat": "json",
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

## Luxury Properties Example
```json
{
  "searchLocation": "Beverly Hills, CA",
  "minPrice": 2000000,
  "homeTypes": ["house"],
  "minBedrooms": 4,
  "minBathrooms": 3,
  "minSquareFeet": 3000,
  "maxResults": 25,
  "outputFormat": "json"
}
```

## Budget-Friendly Condos
```json
{
  "searchLocation": "Austin, TX",
  "maxPrice": 600000,
  "homeTypes": ["condo"],
  "minBedrooms": 1,
  "maxBedrooms": 2,
  "maxResults": 30,
  "outputFormat": "csv"
}
```

## Family Homes in Suburbs
```json
{
  "searchLocation": "Plano, TX",
  "minPrice": 300000,
  "maxPrice": 800000,
  "minBedrooms": 3,
  "minBathrooms": 2,
  "homeTypes": ["house", "townhouse"],
  "minSquareFeet": 1500,
  "maxResults": 40,
  "outputFormat": "json"
}
```
