import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Sidebar } from '../components/sidebar/sidebar';
import { FloatingButton } from '../components/sidebar/floating-button';
import { InvestmentAnalysisPanel } from '../components/sidebar/investment-analysis-panel';
import '../styles/globals.css';
import './styles.css';

console.log('[RIA] Content script starting...');

let sharedState = {
  isSidebarOpen: false,
  setSidebarOpen: (isOpen: boolean) => {
    sharedState.isSidebarOpen = isOpen;
    // Notify all components of state change
    window.dispatchEvent(new CustomEvent('ria-sidebar-state-change', { detail: { isOpen } }));
  }
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(sharedState.isSidebarOpen);

  useEffect(() => {
    const handleStateChange = (event: CustomEvent) => {
      setIsSidebarOpen(event.detail.isOpen);
    };

    window.addEventListener('ria-sidebar-state-change', handleStateChange as EventListener);
    return () => {
      window.removeEventListener('ria-sidebar-state-change', handleStateChange as EventListener);
    };
  }, []);

  const handleSidebarClose = () => {
    sharedState.setSidebarOpen(false);
  };

  const handleFloatingButtonClick = () => {
    sharedState.setSidebarOpen(true);
  };

  return (
    <>
      <div id="ria-sidebar-container" className="ria-sidebar-container">
        <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      </div>
      <div id="ria-floating-btn-container" className="ria-floating-btn-container">
        <FloatingButton onClick={handleFloatingButtonClick} />
      </div>
    </>
  );
}

function injectContainers() {
  console.log('[RIA Debug] Starting container injection...');
  
  // Check if containers already exist
  const existingSidebar = document.getElementById('ria-sidebar-container');
  const existingFloatingBtn = document.getElementById('ria-floating-btn-container');
  const existingRoot = document.getElementById('ria-root-container');
  
  console.log('[RIA Debug] Existing containers:', {
    sidebar: !!existingSidebar,
    floatingBtn: !!existingFloatingBtn,
    root: !!existingRoot
  });

  if (existingSidebar || existingFloatingBtn || existingRoot) {
    console.log('[RIA Debug] Containers already exist, cleaning up...');
    if (existingSidebar) existingSidebar.remove();
    if (existingFloatingBtn) existingFloatingBtn.remove();
    if (existingRoot) existingRoot.remove();
  }

  // Create containers
  console.log('[RIA Debug] Creating new containers...');
  const sidebarContainer = document.createElement('div');
  sidebarContainer.id = 'ria-sidebar-container';
  sidebarContainer.className = 'ria-sidebar-container';
  console.log('[RIA Debug] Created sidebar container:', sidebarContainer);

  const floatingBtnContainer = document.createElement('div');
  floatingBtnContainer.id = 'ria-floating-btn-container';
  floatingBtnContainer.className = 'ria-floating-btn-container';
  console.log('[RIA Debug] Created floating button container:', floatingBtnContainer);

  const rootContainer = document.createElement('div');
  rootContainer.id = 'ria-root-container';
  console.log('[RIA Debug] Created root container:', rootContainer);

  // Add containers to the page
  console.log('[RIA Debug] Adding containers to document.body...');
  document.body.appendChild(sidebarContainer);
  document.body.appendChild(floatingBtnContainer);
  document.body.appendChild(rootContainer);
  console.log('[RIA Debug] Containers added to document.body');

  // Create root and render App
  console.log('[RIA Debug] Creating React root...');
  const root = createRoot(rootContainer);
  console.log('[RIA Debug] Rendering App component...');
  root.render(<App />);
  console.log('[RIA Debug] App component rendered');

  // Cleanup function
  return () => {
    console.log('[RIA Debug] Running cleanup...');
    root.unmount();
    sidebarContainer.remove();
    floatingBtnContainer.remove();
    rootContainer.remove();
    console.log('[RIA Debug] Cleanup complete');
  };
}

// Add debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Add utility to check if we're on a listing page
function isListingPage(): boolean {
  return (
    window.location.href.includes('zillow.com/homedetails/') &&
    (
      document.querySelector('[data-testid="home-details-summary"]') ||
      document.querySelector('[data-testid="home-details-price"]') ||
      document.querySelector('.ds-home-details-chip') ||
      document.querySelector('.ds-price') ||
      document.querySelector('.ds-bed-bath-living-area-container')
    ) !== null
  );
}

// Initial injection
console.log('[RIA Debug] Starting initial injection...');
let cleanup = injectContainers();
console.log('[RIA Debug] Initial injection complete');

// Track last URL to prevent unnecessary reinjections
let lastUrl = window.location.href;
let isCurrentlyOnListingPage = isListingPage();

// Debounced injection function
const debouncedInject = debounce(() => {
  const currentUrl = window.location.href;
  const isNowOnListingPage = isListingPage();
  
  // Only reinject if:
  // 1. URL has changed AND we're on a listing page, or
  // 2. We've just entered a listing page
  if ((currentUrl !== lastUrl && isNowOnListingPage) || (!isCurrentlyOnListingPage && isNowOnListingPage)) {
    console.log('[RIA Debug] Page change detected, reinjecting...');
    lastUrl = currentUrl;
    isCurrentlyOnListingPage = isNowOnListingPage;
    cleanup = injectContainers();
  }
}, 500); // 500ms debounce

// Handle SPA navigation
const observer = new MutationObserver((mutations) => {
  // Only process mutations that might indicate a page change
  const hasRelevantChanges = mutations.some(mutation => {
    // Check if the mutation is in a relevant part of the page
    const target = mutation.target as Element;
    return (
      target.closest('[data-testid="home-details-summary"]') ||
      target.closest('[data-testid="home-details-price"]') ||
      target.closest('.ds-home-details-chip') ||
      target.closest('.ds-price') ||
      target.closest('.ds-bed-bath-living-area-container')
    ) !== null;
  });

  if (hasRelevantChanges) {
    debouncedInject();
  }
});

// Start observing with more specific configuration
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false, // We don't need to watch attributes
  characterData: false // We don't need to watch text changes
});

// Also watch for URL changes
const urlObserver = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    debouncedInject();
  }
});

urlObserver.observe(document, { subtree: true, childList: true });

// Cleanup on page unload
window.addEventListener('unload', () => {
  observer.disconnect();
  urlObserver.disconnect();
  if (cleanup) {
    cleanup();
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[RIA] Content script received message:', message);
  if (message.type === 'TOGGLE_SIDEBAR') {
    cleanup = injectContainers();
  }
  sendResponse({ received: true });
  return true;
}); 