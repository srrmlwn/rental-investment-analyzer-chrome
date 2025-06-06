import { DataExtractor } from '../services/dataExtraction';
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';

async function testExtractor(htmlPath: string) {
    console.log(`\nTesting extractor on: ${path.basename(htmlPath)}`);
    console.log('----------------------------------------');
    
    // Read the HTML file
    const html = fs.readFileSync(htmlPath, 'utf-8');
    
    // Create a DOM from the HTML using jsdom
    const dom = new JSDOM(html);
    
    // Replace the global document with our test document
    const originalDocument = global.document;
    (global as any).document = dom.window.document;
    
    try {
        const extractor = new DataExtractor();
        const data = await extractor.extractPropertyData();
        console.log('Extracted Data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Extraction failed:', error);
    } finally {
        // Restore the original document
        (global as any).document = originalDocument;
    }
}

// Test all sample listings
const sampleDir = path.join(__dirname, '../../sample/listings');
const files = [
    '215 Stockbridge Rd, Columbus, OH 43207 _ MLS #225018443 _ Zillow.html',
    'listing_without_bed_bath.html',
    'zillow_listing_page.html'
];

async function runTests() {
    for (const file of files) {
        await testExtractor(path.join(sampleDir, file));
    }
}

runTests().catch(console.error); 