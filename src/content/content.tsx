import React from 'react';
import { createRoot } from 'react-dom/client';
import { Sidebar } from '../components/sidebar/sidebar';

console.log('Rental Investment Analyzer content script loaded');

// Create and inject sidebar container
function injectSidebar() {
  const container = document.createElement('div');
  container.id = 'rental-investment-analyzer-sidebar';
  document.body.appendChild(container);

  // Create React root and render sidebar
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Sidebar isOpen={true} />
    </React.StrictMode>
  );
}

// Initialize sidebar when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectSidebar);
} else {
  injectSidebar();
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  // Handle messages here
  sendResponse({ received: true });
}); 