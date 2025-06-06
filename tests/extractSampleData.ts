import { PriceExtractor } from '../src/services/dataExtraction/extractors/PriceExtractor';
import { PropertyTaxExtractor } from '../src/services/dataExtraction/extractors/PropertyTaxExtractor';
import { BedBathExtractor } from '../src/services/dataExtraction/extractors/BedBathExtractor';
import { PropertyTypeExtractor } from '../src/services/dataExtraction/extractors/PropertyTypeExtractor';
import { SquareFeetExtractor } from '../src/services/dataExtraction/extractors/SquareFeetExtractor';
import { ZipCodeExtractor } from '../src/services/dataExtraction/extractors/ZipCodeExtractor';
import { RentZestimateExtractor } from '../src/services/dataExtraction/extractors/RentZestimateExtractor';
import { HoaFeesExtractor } from '../src/services/dataExtraction/extractors/HoaFeesExtractor';
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';

async function testExtractor(htmlPath: string) {
    console.log(`\nTesting extractors on: ${path.basename(htmlPath)}`);
    console.log('----------------------------------------');
    
    // Read the HTML file
    const html = fs.readFileSync(htmlPath, 'utf-8');
    
    // Create a DOM from the HTML using jsdom
    const dom = new JSDOM(html);
    
    // Replace the global document with our test document
    const originalDocument = global.document;
    (global as any).document = dom.window.document;
    
    const extractors = [
        { name: "Price", extractor: new PriceExtractor() },
        { name: "Property Tax", extractor: new PropertyTaxExtractor() },
        { name: "Bed Bath", extractor: new BedBathExtractor() },
        { name: "Property Type", extractor: new PropertyTypeExtractor() },
        { name: "Square Feet", extractor: new SquareFeetExtractor() },
        { name: "Zip Code", extractor: new ZipCodeExtractor() },
        { name: "Rent Zestimate", extractor: new RentZestimateExtractor() },
        { name: "HOA Fees", extractor: new HoaFeesExtractor() }
    ];
    
    const results: Record<string, any> = {};
    for (const { name, extractor } of extractors) {
        let extractedData: any = null;
        let extractionError: Error | null = null;
        try {
            extractedData = await extractor.extract();
        } catch (err) {
            extractionError = err instanceof Error ? err : new Error(String(err));
        }
        if (extractionError) {
            results[name] = { error: extractionError.message };
        } else if (extractedData === null) {
            results[name] = { status: "not found" };
        } else {
            results[name] = extractedData;
        }
    }
    console.table(results);
    
    // Restore the original document
    (global as any).document = originalDocument;
}

// Test all sample listings
const sampleDir = path.join(__dirname, '../sample/listings');
const files = [
    'listing1.html',
    'listing_without_bed_bath.html',
    'listing2.html'
];

async function runTests() {
    for (const file of files) {
        await testExtractor(path.join(sampleDir, file));
    }
}

runTests().catch(console.error); 