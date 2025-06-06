import { PROPERTY_TYPE_SELECTORS } from '../src/services/dataExtraction/selectors/propertyTypeSelectors';
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';

async function debugPropertyTypeExtractor(htmlPath: string) {
    console.log(`\nDebugging property type extraction on: ${path.basename(htmlPath)}`);
    console.log('----------------------------------------');
    
    // Read the HTML file
    const html = fs.readFileSync(htmlPath, 'utf-8');
    
    // Create a DOM from the HTML using jsdom
    const dom = new JSDOM(html);
    
    // Replace the global document with our test document
    const originalDocument = global.document;
    (global as any).document = dom.window.document;
    
    const metaDescEl = document.querySelector(PROPERTY_TYPE_SELECTORS.META_DESCRIPTION);
    const propTypeEl = document.querySelector(PROPERTY_TYPE_SELECTORS.PROPERTY_TYPE);
    
    console.log("Meta description (text content):", metaDescEl ? metaDescEl.textContent : "not found");
    console.log("Property type element (text content):", propTypeEl ? propTypeEl.textContent : "not found");
    
    // Restore the original document
    (global as any).document = originalDocument;
}

const sampleDir = path.join(__dirname, '../sample/listings');
const files = [
    'listing1.html',
    'listing_without_bed_bath.html',
    'listing2.html'
];

async function runDebug() {
    for (const file of files) {
        await debugPropertyTypeExtractor(path.join(sampleDir, file));
    }
}

runDebug().catch(console.error); 