## Data Extraction via Script Tag

In our test script (test/parseListingData.ts), we extract property data by parsing the __NEXT_DATA__ script tag (using a regex) and then parsing the JSON contained therein. In particular, we extract the "gdpClientCache" (a JSON string) from the parsed JSON (at props.pageProps.componentProps.gdpClientCache) and then parse that string into an object. (This object is an aggregate of property data, with keys (for example, "ForSaleShopperPlatformFullRenderQuery{…}") whose values (if they are objects and have a "property" key) contain the property details.) 

Below is a sample snippet (in TypeScript) that illustrates the extraction and summary printing logic:

-----------------------------------------------------------
import fs from 'fs';

function extractJsonFromScriptTag(htmlContent: string): any | null {
  const scriptTagRegex = /<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/;
  const match = htmlContent.match(scriptTagRegex);
  if (!match || !match[1]) {
    console.error("Could not find __NEXT_DATA__ script tag");
    return null;
  }
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    console.error("Error parsing JSON from script tag:", error);
    return null;
  }
}

function printPropertySummary(gdpClientCache: any) {
  // gdpClientCache is an object with keys (e.g. "ForSaleShopperPlatformFullRenderQuery{…}") whose values (if they are objects and have a "property" key) contain the property details.
  for (const [key, value] of Object.entries(gdpClientCache)) {
    if (value && typeof value === "object" && "property" in value && typeof (value as any).property === "object") {
      const prop = (value as any).property;
      const address = prop.streetAddress || prop.address?.streetAddress || "N/A";
      const city = prop.city || prop.address?.city || "N/A";
      const state = prop.state || prop.address?.state || "N/A";
      const zipcode = prop.zipcode || prop.address?.zipcode || "N/A";
      const price = prop.price || "N/A";
      const beds = prop.bedrooms || prop.resoFacts?.bedrooms || "N/A";
      const baths = prop.bathrooms || prop.resoFacts?.bathrooms || "N/A";
      const yearBuilt = prop.yearBuilt || prop.resoFacts?.yearBuilt || "N/A";
      const homeType = prop.homeType || prop.resoFacts?.homeType || "N/A";
      console.log("-----------------------------");
      console.log(`Address: ${address}, ${city}, ${state} ${zipcode}`);
      console.log(`Price: $${price}`);
      console.log(`Beds: ${beds}`);
      console.log(`Baths: ${baths}`);
      console.log(`Year Built: ${yearBuilt}`);
      console.log(`Home Type: ${homeType}`);
      if (prop.lotSize || prop.resoFacts?.lotSize) {
         console.log(`Lot Size: ${prop.lotSize || prop.resoFacts?.lotSize}`);
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
         console.log("Formatted Location:");
         prop.formattedChip.location.forEach((loc: any) => console.log(`  - ${loc.fullValue}`));
      }
      // (Additional fields can be added as needed.)
    }
  }
}

async function main() {
  const htmlFilePath = process.argv[2];
  if (!htmlFilePath) {
    console.error("Please provide the path to the HTML file as an argument");
    process.exit(1);
  }
  try {
    const htmlContent = await fs.promises.readFile(htmlFilePath, "utf-8");
    const jsonData = extractJsonFromScriptTag(htmlContent);
    if (!jsonData) {
      process.exit(1);
    }
    // Access props.pageProps.componentProps.gdpClientCache (a JSON string) and parse it.
    const gdpClientCacheString = jsonData?.props?.pageProps?.componentProps?.gdpClientCache;
    if (typeof gdpClientCacheString === "string") {
      try {
         const gdpClientCache = JSON.parse(gdpClientCacheString);
         printPropertySummary(gdpClientCache);
      } catch (e) {
         console.error("Failed to parse gdpClientCache as JSON:", e);
      }
    } else {
      console.log("gdpClientCache not found at props.pageProps.componentProps.gdpClientCache");
    }
  } catch (error) {
    console.error("Error reading or processing file:", error);
    process.exit(1);
  }
}

main();

-----------------------------------------------------------

This logic (extracting the __NEXT_DATA__ script tag, parsing its JSON, and then parsing the "gdpClientCache" string) can be refactored (for example, in a new chat) so that our services/dataExtraction (or a new module) follows a similar approach. (No code changes are made here.) 