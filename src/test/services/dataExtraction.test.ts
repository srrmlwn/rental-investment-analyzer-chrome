import { DataExtractionService } from '@/services/dataExtraction';
import { PropertyData } from '@/types/propertyData';
import { JSDOM } from 'jsdom';
import * as fs from 'fs';
import * as path from 'path';

// Mock the HUD data service
jest.mock('@/services/hudDataService', () => ({
    __esModule: true,
    default: {
        getRentalData: jest.fn().mockImplementation((zipCode: string, bedrooms: number) => {
            if (zipCode === '43205' && bedrooms === 3) {
                return Promise.resolve({
                    rent: 1500,
                    areaName: 'Columbus',
                    areaCode: 'OH',
                    source: 'HUD',
                    lastUpdated: '2024-03-01'
                });
            }
            return Promise.resolve(null);
        }),
        initialize: jest.fn().mockResolvedValue(undefined),
        clearCache: jest.fn()
    }
}));

describe('Data Extraction Service', () => {
    let extractor: DataExtractionService;
    let originalDocument: Document;

    beforeEach(() => {
        extractor = new DataExtractionService();
        // Save original document
        originalDocument = global.document;
    });

    afterEach(() => {
        // Restore original document
        (global as any).document = originalDocument;
        jest.clearAllMocks();
    });

    const loadTestHtml = (filename: string) => {
        const htmlPath = path.join(__dirname, '../../sample/listings', filename);
        const html = fs.readFileSync(htmlPath, 'utf-8');
        const dom = new JSDOM(html);
        (global as any).document = dom.window.document;
    };

    it('should extract property data with HUD rent estimate for valid zip and bedrooms', async () => {
        loadTestHtml('215 Stockbridge Rd, Columbus, OH 43207 _ MLS #225018443 _ Zillow.html');
        
        const data = await extractor.extractPropertyData();
        
        expect(data).toBeDefined();
        expect(data.zipCode).toBe('43205');
        expect(data.bedrooms).toBe(3);
        expect(data.hudRentEstimate).toBe(1500);
    });

    it('should not include HUD rent estimate for invalid zip code', async () => {
        loadTestHtml('listing_without_bed_bath.html');
        
        const data = await extractor.extractPropertyData();
        
        expect(data).toBeDefined();
        expect(data.hudRentEstimate).toBeUndefined();
    });

    it('should handle missing bedroom data gracefully', async () => {
        loadTestHtml('listing_without_bed_bath.html');
        
        const data = await extractor.extractPropertyData();
        
        expect(data).toBeDefined();
        expect(data.bedrooms).toBeUndefined();
        expect(data.hudRentEstimate).toBeUndefined();
    });

    it('should extract all required property data fields', async () => {
        loadTestHtml('215 Stockbridge Rd, Columbus, OH 43207 _ MLS #225018443 _ Zillow.html');
        
        const data = await extractor.extractPropertyData();
        
        // Check all required fields
        const requiredFields: (keyof PropertyData)[] = [
            'price',
            'propertyType',
            'zipCode',
            'bedrooms',
            'bathrooms',
            'rentZestimate',
            'hudRentEstimate',
            'monthlyPropertyTaxes',
            'propertyTaxRate',
            'hoaFees',
            'units'
        ];

        requiredFields.forEach(field => {
            expect(data).toHaveProperty(field);
        });
    });
}); 