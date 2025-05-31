import hudDataService from '../../../src/services/hudDataService.js';

// Mock chrome.runtime.getURL
global.chrome = {
    runtime: {
        getURL: jest.fn(url => url)
    }
};

// Mock fetch
global.fetch = jest.fn();

describe('HudDataService', () => {
    let mockHudData;

    beforeEach(() => {
        // Reset service state
        hudDataService.hudData = null;
        hudDataService.initialized = false;
        hudDataService.clearCache();

        // Mock HUD data
        mockHudData = {
            metadata: {
                lastUpdated: '2024-03-01',
                version: '1.0',
                source: 'HUD FY2025 SAFMRs'
            },
            data: {
                zip_codes: {
                    '12345': {
                        area_code: 'CA001',
                        area_name: 'Test Area',
                        rents: {
                            '0BR': 1000,
                            '1BR': 1200,
                            '2BR': 1500,
                            '3BR': 1800,
                            '4BR': 2100
                        }
                    },
                    '67890': {
                        area_code: 'CA002',
                        area_name: 'Another Area',
                        rents: {
                            '1BR': 1300,
                            '2BR': 1600,
                            '3BR': 1900
                        }
                    }
                }
            }
        };

        // Mock fetch response
        global.fetch.mockResolvedValue({
            json: () => Promise.resolve(mockHudData)
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('initialize', () => {
        it('should load HUD data successfully', async () => {
            await hudDataService.initialize();
            expect(hudDataService.initialized).toBe(true);
            expect(hudDataService.hudData).toEqual(mockHudData);
        });

        it('should not reload data if already initialized', async () => {
            await hudDataService.initialize();
            const firstData = hudDataService.hudData;
            await hudDataService.initialize();
            expect(hudDataService.hudData).toBe(firstData);
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        it('should handle fetch errors', async () => {
            global.fetch.mockRejectedValue(new Error('Network error'));
            await expect(hudDataService.initialize()).rejects.toThrow('Failed to load HUD rental data');
            expect(hudDataService.initialized).toBe(false);
        });
    });

    describe('getRentalData', () => {
        beforeEach(async () => {
            await hudDataService.initialize();
        });

        it('should return rental data for valid zip code and bedrooms', async () => {
            const data = await hudDataService.getRentalData('12345', 2);
            expect(data).toEqual({
                rent: 1500,
                areaName: 'Test Area',
                areaCode: 'CA001',
                source: 'HUD',
                lastUpdated: '2024-03-01'
            });
        });

        it('should normalize zip codes with leading zeros', async () => {
            const data = await hudDataService.getRentalData('12345', 2);
            const dataWithLeadingZero = await hudDataService.getRentalData('012345', 2);
            expect(data).toEqual(dataWithLeadingZero);
        });

        it('should return null for non-existent zip code', async () => {
            const data = await hudDataService.getRentalData('99999', 2);
            expect(data).toBeNull();
        });

        it('should return null for non-existent bedroom count', async () => {
            const data = await hudDataService.getRentalData('67890', 4);
            expect(data).toBeNull();
        });

        it('should cache results', async () => {
            // First call should fetch from data
            const firstCall = await hudDataService.getRentalData('12345', 2);
            expect(firstCall).toBeTruthy();

            // Modify the data to ensure we're using cache
            hudDataService.hudData.data.zip_codes['12345'].rents['2BR'] = 9999;

            // Second call should use cache
            const secondCall = await hudDataService.getRentalData('12345', 2);
            expect(secondCall.rent).toBe(1500); // Should still be original value
        });
    });

    describe('getMetadata', () => {
        it('should return null if not initialized', () => {
            expect(hudDataService.getMetadata()).toBeNull();
        });

        it('should return metadata after initialization', async () => {
            await hudDataService.initialize();
            expect(hudDataService.getMetadata()).toEqual(mockHudData.metadata);
        });
    });
}); 