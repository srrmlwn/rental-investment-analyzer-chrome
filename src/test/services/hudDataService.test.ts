import hudDataService from '@/services/hudDataService';
import { HUDRentalData } from '@/types/propertyData';

describe('HUD Data Service', () => {
    beforeEach(async () => {
        // Clear cache before each test
        hudDataService.clearCache();
        // Ensure service is initialized
        await hudDataService.initialize();
    });

    it('should return rental data for valid zip code and bedrooms', async () => {
        const rentalData = await hudDataService.getRentalData('43205', 3) as HUDRentalData;
        
        expect(rentalData).toBeDefined();
        expect(rentalData.rent).toBeGreaterThan(0);
        expect(rentalData.source).toBe('HUD');
        expect(rentalData.areaName).toBeDefined();
        expect(rentalData.areaCode).toBeDefined();
        expect(rentalData.lastUpdated).toBeDefined();
    });

    it('should return null for invalid zip code', async () => {
        const rentalData = await hudDataService.getRentalData('99999', 3);
        expect(rentalData).toBeNull();
    });

    it('should return null for invalid bedroom count', async () => {
        const rentalData = await hudDataService.getRentalData('43205', 10);
        expect(rentalData).toBeNull();
    });

    it('should cache results for repeated lookups', async () => {
        const startTime = Date.now();
        await hudDataService.getRentalData('43205', 3);
        const firstLookupTime = Date.now() - startTime;

        const cacheStartTime = Date.now();
        await hudDataService.getRentalData('43205', 3);
        const cachedLookupTime = Date.now() - cacheStartTime;

        expect(cachedLookupTime).toBeLessThan(firstLookupTime);
    });
}); 