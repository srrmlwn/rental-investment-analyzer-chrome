import { DataExtractionService } from '../../../src/services/dataExtraction';
import { PropertyData } from '../../../src/types/propertyData';
import fs from 'fs';
import path from 'path';

// Helper to load HTML file
function loadHtmlFile(filename: string): string {
    return fs.readFileSync(path.join(__dirname, '../../resources', filename), 'utf-8');
}

// Helper to print property data in a tabular format
function printPropertyData(data: PropertyData): void {
    console.log('\nExtracted Property Data:');
    console.log('------------------------');
    const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));
    const maxKeyLength = Math.max(...entries.map(([key]) => key.length));
    
    entries.forEach(([key, value]) => {
        const paddedKey = key.padEnd(maxKeyLength);
        console.log(`${paddedKey}: ${value ?? 'undefined'}`);
    });
    console.log('------------------------\n');
}

describe('DataExtractionService', () => {
    let service: DataExtractionService;

    beforeEach(() => {
        // Clear the document for each test
        document.documentElement.innerHTML = '';
        service = new DataExtractionService();
    });

    afterEach(() => {
        service.clearCache();
    });

    test('extracts property data from listing1.html', async () => {
        // Load test HTML
        const html = loadHtmlFile('listing1.html');
        document.documentElement.innerHTML = html;

        // Extract property data
        const propertyData = await service.extractPropertyData();
        
        // Print extracted data for debugging
        printPropertyData(propertyData);

        // Expected data based on listing1.html
        const expectedData: PropertyData = {
            price: 250000,
            bedrooms: undefined,
            bathrooms: undefined,
            propertyType: undefined,
            zipCode: undefined,
            rentZestimate: 1901,
            monthlyPropertyTaxes: undefined,
            propertyTaxRate: undefined,
            hoaFees: undefined,
            units: undefined
        };

        // Assert entire object matches
        expect(propertyData).toEqual(expectedData);
    });

    test('extracts property data from listing_without_bed_bath.html', async () => {
        // Load test HTML
        const html = loadHtmlFile('listing_without_bed_bath.html');
        document.documentElement.innerHTML = html;

        // Extract property data
        const propertyData = await service.extractPropertyData();
        
        // Print extracted data for debugging
        printPropertyData(propertyData);

        // Expected data based on listing_without_bed_bath.html
        const expectedData: PropertyData = {
            price: 419900,
            bedrooms: 4,
            bathrooms: 2,
            propertyType: 'Condo',
            zipCode: '43205',
            rentZestimate: undefined,
            monthlyPropertyTaxes: undefined,
            propertyTaxRate: 1.37,
            hoaFees: undefined,
            units: 2
        };

        // Assert entire object matches
        expect(propertyData).toEqual(expectedData);
    });
}); 