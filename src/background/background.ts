// Background script for Rental Investment Analyzer
// Handles extension initialization and message passing

console.log('Rental Investment Analyzer background script loaded');

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
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  // Handle messages here
  sendResponse({ received: true });
}); 