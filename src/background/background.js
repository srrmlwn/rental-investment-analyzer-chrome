// Background script for Rental Investment Analyzer
console.log('Background script loaded');

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_HUD_DATA') {
    // TODO: Implement HUD data retrieval
    sendResponse({ status: 'not_implemented' });
  }
  return true; // Required for async sendResponse
}); 