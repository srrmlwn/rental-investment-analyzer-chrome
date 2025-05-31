import rentalEstimator from '../../../src/services/rentalEstimator.js';
import { ERROR_MESSAGES } from '../../../src/constants/selectors.js';

// Mock chrome.runtime.sendMessage
global.chrome = {
    runtime: {
        sendMessage: jest.fn()
    }
};

// Mock document.querySelector
document.querySelector = jest.fn();

describe('RentalEstimator', () => {
    beforeEach(() => {
        // Reset service state
        rentalEstimator.jsonData = null;
        jest.clearAllMocks();
    });

    describe('getRentalEstimate', () => {
        const mockPropertyData = {
            zipCode: '12345',
            bedrooms: 2
        };

        it('should return Zestimate data when available', async () => {
            const mockZestimate = {
                rent: 2000,
                lastUpdated: '2024-03-01'
            };
            rentalEstimator.jsonData = { rentZestimate: 2000, lastUpdated: '2024-03-01' };

            const result = await rentalEstimator.getRentalEstimate(mockPropertyData);
            expect(result).toEqual({
                ...mockZestimate,
                source: 'Zestimate'
            });
        });

        it('should fall back to HUD data when Zestimate is not available', async () => {
            // Mock no Zestimate data
            rentalEstimator.jsonData = null;
            document.querySelector.mockReturnValue(null);

            // Mock HUD data response
            const mockHudData = {
                rent: 1800,
                areaName: 'Test Area',
                areaCode: 'CA001',
                lastUpdated: '2024-03-01'
            };
            chrome.runtime.sendMessage.mockImplementation((message, callback) => {
                callback({ status: 'success', data: mockHudData });
            });

            const result = await rentalEstimator.getRentalEstimate(mockPropertyData);
            expect(result).toEqual({
                ...mockHudData,
                source: 'HUD'
            });
        });

        it('should throw error when both sources fail', async () => {
            // Mock no Zestimate data
            rentalEstimator.jsonData = null;
            document.querySelector.mockReturnValue(null);

            // Mock HUD data failure
            chrome.runtime.sendMessage.mockImplementation((message, callback) => {
                callback({ status: 'error', error: 'No data available' });
            });

            await expect(rentalEstimator.getRentalEstimate(mockPropertyData))
                .rejects.toThrow(ERROR_MESSAGES.MISSING_RENTAL_ESTIMATE);
        });
    });

    describe('getZestimate', () => {
        it('should get Zestimate from JSON data', async () => {
            const mockZestimate = {
                rentZestimate: 2000,
                lastUpdated: '2024-03-01'
            };
            rentalEstimator.jsonData = mockZestimate;

            const result = await rentalEstimator.getZestimate();
            expect(result).toEqual({
                rent: 2000,
                lastUpdated: '2024-03-01'
            });
        });

        it('should get Zestimate from DOM when JSON data is not available', async () => {
            rentalEstimator.jsonData = null;
            const mockElement = {
                textContent: 'Rent Zestimate: $2,000'
            };
            document.querySelector.mockReturnValue(mockElement);

            const result = await rentalEstimator.getZestimate();
            expect(result).toEqual({
                rent: 2000,
                lastUpdated: expect.any(String)
            });
        });

        it('should return null when no Zestimate data is available', async () => {
            rentalEstimator.jsonData = null;
            document.querySelector.mockReturnValue(null);

            const result = await rentalEstimator.getZestimate();
            expect(result).toBeNull();
        });
    });

    describe('getHudData', () => {
        const mockZipCode = '12345';
        const mockBedrooms = 2;

        it('should return HUD data on successful response', async () => {
            const mockHudData = {
                rent: 1800,
                areaName: 'Test Area',
                areaCode: 'CA001',
                lastUpdated: '2024-03-01'
            };

            chrome.runtime.sendMessage.mockImplementation((message, callback) => {
                expect(message).toEqual({
                    type: 'GET_HUD_DATA',
                    data: { zipCode: mockZipCode, bedrooms: mockBedrooms }
                });
                callback({ status: 'success', data: mockHudData });
            });

            const result = await rentalEstimator.getHudData(mockZipCode, mockBedrooms);
            expect(result).toEqual(mockHudData);
        });

        it('should reject on error response', async () => {
            chrome.runtime.sendMessage.mockImplementation((message, callback) => {
                callback({ status: 'error', error: 'No data available' });
            });

            await expect(rentalEstimator.getHudData(mockZipCode, mockBedrooms))
                .rejects.toThrow('No data available');
        });
    });
}); 