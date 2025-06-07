import fs from 'fs';

interface PropertyData {
  // We'll expand this interface as we discover the actual structure
  [key: string]: any;
}

function extractJsonFromScriptTag(htmlContent: string): any | null {
  const scriptTagRegex = /<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/;
  const match = htmlContent.match(scriptTagRegex);
  if (!match || !match[1]) {
    console.error('Could not find __NEXT_DATA__ script tag');
    return null;
  }
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    console.error('Error parsing JSON from script tag:', error);
    return null;
  }
}

function printPropertyData(data: PropertyData) {
  // Helper function to recursively print nested objects
  function printObject(obj: any, indent: string = '', maxDepth: number = 3, currentDepth: number = 0) {
    if (currentDepth >= maxDepth) {
      console.log(`${indent}... (max depth reached)`);
      return;
    }

    if (typeof obj !== 'object' || obj === null) {
      console.log(`${indent}${obj}`);
      return;
    }

    if (Array.isArray(obj)) {
      console.log(`${indent}[`);
      obj.slice(0, 3).forEach((item, index) => {
        console.log(`${indent}  ${index}:`);
        printObject(item, indent + '    ', maxDepth, currentDepth + 1);
      });
      if (obj.length > 3) {
        console.log(`${indent}  ... (${obj.length - 3} more items)`);
      }
      console.log(`${indent}]`);
      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        console.log(`${indent}${key}:`);
        printObject(value, indent + '  ', maxDepth, currentDepth + 1);
      } else {
        console.log(`${indent}${key}: ${value}`);
      }
    }
  }

  console.log('\nFull JSON Structure (first 3 levels):');
  console.log('==================================');
  printObject(data);

  // Also try to find any property-related data
  console.log('\nSearching for property-related data...');
  console.log('==================================');
  
  function searchForPropertyData(obj: any, path: string = ''): void {
    if (typeof obj !== 'object' || obj === null) return;

    // Check if this object might contain property data
    const propertyKeywords = ['property', 'home', 'house', 'listing', 'address', 'price', 'bed', 'bath', 'sqft'];
    const objStr = JSON.stringify(obj).toLowerCase();
    if (propertyKeywords.some(keyword => objStr.includes(keyword))) {
      console.log(`\nFound potential property data at path: ${path}`);
      printObject(obj, '  ', 2);
    }

    // Recursively search through the object
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => searchForPropertyData(item, `${path}[${index}]`));
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        searchForPropertyData(value, path ? `${path}.${key}` : key);
      });
    }
  }

  searchForPropertyData(data);
}

function printPropertySummary(gdpClientCache: any) {
  // gdpClientCache is an object with keys like 'ForSaleShopperPlatformFullRenderQuery{...}': { property: {...}, ... }
  for (const [key, value] of Object.entries(gdpClientCache)) {
    if (
      value &&
      typeof value === 'object' &&
      'property' in value &&
      typeof (value as any).property === 'object'
    ) {
      const prop = (value as any).property;
      const address = prop.streetAddress || prop.address?.streetAddress || 'N/A';
      const city = prop.city || prop.address?.city || 'N/A';
      const state = prop.state || prop.address?.state || 'N/A';
      const zipcode = prop.zipcode || prop.address?.zipcode || 'N/A';
      const price = prop.price || 'N/A';
      const beds = prop.bedrooms || prop.resoFacts?.bedrooms || 'N/A';
      const baths = prop.bathrooms || prop.resoFacts?.bathrooms || 'N/A';
      const yearBuilt = prop.yearBuilt || prop.resoFacts?.yearBuilt || 'N/A';
      const homeType = prop.homeType || prop.resoFacts?.homeType || 'N/A';
      console.log('-----------------------------');
      console.log(`Address: ${address}, ${city}, ${state} ${zipcode}`);
      console.log(`Price: $${price}`);
      console.log(`Beds: ${beds}`);
      console.log(`Baths: ${baths}`);
      console.log(`Year Built: ${yearBuilt}`);
      console.log(`Home Type: ${homeType}`);
      if (prop.lotSize || prop.resoFacts?.lotSize) {
        console.log(`Lot Size: ${prop.lotSize || prop.resoFacts?.lotSize}`);
      }
      if (prop.livingArea || prop.resoFacts?.livingArea) {
        console.log(`Living Area: ${prop.livingArea || prop.resoFacts?.livingArea}`);
      }
      if (prop.zpid) {
        console.log(`ZPID: ${prop.zpid}`);
      }
      if (prop.taxAnnualAmount) {
        console.log(`Annual Tax: $${prop.taxAnnualAmount}`);
      }
      if (prop.priceChange) {
        console.log(`Price Change: $${prop.priceChange}`);
      }
      if (prop.priceChangeDateString) {
        console.log(`Price Change Date: ${prop.priceChangeDateString}`);
      }
      if (prop.homeStatus) {
        console.log(`Status: ${prop.homeStatus}`);
      }
      if (prop.listingProvider) {
        console.log(`Listing Provider: ${prop.listingProvider}`);
      }
      if (prop.formattedChip?.location) {
        console.log('Formatted Location:');
        prop.formattedChip.location.forEach((loc: any) => console.log(`  - ${loc.fullValue}`));
      }
      // Add more fields as needed
    }
  }
}

function printAllGdpClientCacheKeys(gdpClientCache: any) {
  console.log('\nAll keys in gdpClientCache:');
  console.log('==========================');
  
  // Print all top-level keys
  const keys = Object.keys(gdpClientCache);
  console.log(`Found ${keys.length} keys:\n`);
  
  // Print each key and a sample of its value type
  keys.forEach(key => {
    const value = gdpClientCache[key];
    const valueType = typeof value;
    const isObject = valueType === 'object' && value !== null;
    const hasProperty = isObject && 'property' in value;
    
    console.log(`Key: ${key}`);
    console.log(`Type: ${valueType}`);
    if (isObject) {
      console.log(`Contains property data: ${hasProperty ? 'Yes' : 'No'}`);
      if (hasProperty) {
        const prop = value.property;
        console.log('Property fields available:');
        Object.keys(prop).forEach(field => {
          console.log(`  - ${field}: ${typeof prop[field]}`);
        });
      }
    }
    console.log('-------------------');
  });
}

async function main() {
  const htmlFilePath = process.argv[2];
  if (!htmlFilePath) {
    console.error('Please provide the path to the HTML file as an argument');
    process.exit(1);
  }
  try {
    const htmlContent = await fs.promises.readFile(htmlFilePath, 'utf-8');
    const jsonData = extractJsonFromScriptTag(htmlContent);
    if (!jsonData) {
      process.exit(1);
    }
    // Try to access props.pageProps.componentProps.gdpClientCache
    const gdpClientCacheString = jsonData?.props?.pageProps?.componentProps?.gdpClientCache;
    if (typeof gdpClientCacheString === 'string') {
      try {
        const gdpClientCache = JSON.parse(gdpClientCacheString);
        printAllGdpClientCacheKeys(gdpClientCache);
        console.log('\nDetailed property summary:');
        console.log('========================');
        printPropertySummary(gdpClientCache);
      } catch (e) {
        console.error('Failed to parse gdpClientCache as JSON:', e);
      }
    } else {
      console.log('gdpClientCache not found at props.pageProps.componentProps.gdpClientCache');
    }
  } catch (error) {
    console.error('Error reading or processing file:', error);
    process.exit(1);
  }
}

main(); 