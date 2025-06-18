// Background script for DealWise
import { DataExtractionService } from '../services/dataExtraction';
// @ts-ignore - Import JavaScript module
import hudDataService from '../services/hudDataService.js';

console.log('DealWise background script loaded');

// Initialize HUD data service when background script loads
(hudDataService as any).initialize().catch((error: Error) => {
    console.error('Failed to initialize HUD data service:', error);
});

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed');
    // Initialize default settings
    chrome.storage.sync.set({
      settings: {
        mortgageRate: 7.5,
        downPaymentPercent: 20,
        propertyManagementFee: 8,
        maintenanceReserve: 1,
        insuranceRate: 0.5,
        propertyTaxRate: 1.1,
        hoaFees: 0,
        vacancyRate: 5,
        loanTermYears: 30
      }
    });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  // Handle HUD data requests
  if (request.type === 'GET_HUD_DATA' && request.data) {
    const { zipCode, bedrooms } = request.data;
    
    // Get rental data asynchronously
    (hudDataService as any).getRentalData(zipCode, bedrooms)
      .then((data: any) => {
        if (data) {
          sendResponse({ status: 'success', data });
        } else {
          sendResponse({ 
            status: 'error', 
            error: 'No rental data available for this zip code and bedroom count'
          });
        }
      })
      .catch((error: Error) => {
        sendResponse({ 
          status: 'error', 
          error: error.message || 'Failed to get rental data'
        });
      });
    
    return true; // Required for async sendResponse
  }
  
  // Handle other messages
  sendResponse({ received: true });
}); 