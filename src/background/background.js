// Background script for Rental Investment Analyzer
console.log('Background script loaded');

import hudDataService from '../services/hudDataService.js';

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Initialize HUD data service when background script loads
hudDataService.initialize().catch(error => {
    console.error('Failed to initialize HUD data service:', error);
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_HUD_DATA') {
        const { zipCode, bedrooms } = request.data;
        
        // Get rental data asynchronously
        hudDataService.getRentalData(zipCode, bedrooms)
            .then(data => {
                if (data) {
                    sendResponse({ status: 'success', data });
                } else {
                    sendResponse({ 
                        status: 'error', 
                        error: 'No rental data available for this zip code and bedroom count'
                    });
                }
            })
            .catch(error => {
                sendResponse({ 
                    status: 'error', 
                    error: error.message || 'Failed to get rental data'
                });
            });
        
        return true; // Required for async sendResponse
    }
}); 