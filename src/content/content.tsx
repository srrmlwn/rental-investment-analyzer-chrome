import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Sidebar } from '../components/sidebar/sidebar';
import { FloatingButton } from '../components/sidebar/floating-button';
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
    console.log('[RIA Debug] Sidebar close triggered');
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
      {!isSidebarOpen && (
        <div id="ria-floating-btn-container" className="ria-floating-btn-container">
          <FloatingButton onClick={handleFloatingButtonClick} />
        </div>
      )}
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
  return window.location.href.includes('zillow.com/homedetails/');
}

// Extract listing ID from Zillow URL
function extractListingId(url: string): string | null {
  const match = url.match(/\/homedetails\/[^\/]+\/(\d+)/);
  return match ? match[1] : null;
}

// Check if we need to force a reload for fresh __NEXT_DATA__
function checkAndForceReload() {
  const currentListingId = extractListingId(window.location.href);
  
  if (!currentListingId) {
    console.log('[RIA Debug] Not on a listing page, skipping reload check');
    return;
  }
  
  // Check if we've already reloaded for this URL to prevent infinite loops
  if (window.location.search.includes('ria_force_reload=1')) {
    console.log('[RIA Debug] Already reloaded once for this URL, skipping');
    return;
  }
  
  console.log('[RIA Debug] Current listing ID:', currentListingId);
  
  // Force reload to get fresh __NEXT_DATA__
  console.log('[RIA Debug] Forcing reload for fresh __NEXT_DATA__');
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set('ria_force_reload', '1');
  
  // If sidebar is open, add auto-open parameter
  if (sharedState.isSidebarOpen) {
    newUrl.searchParams.set('ria_auto_open', '1');
    console.log('[RIA Debug] Sidebar is open, will auto-open after reload');
  }
  
  window.location.href = newUrl.toString();
}

// Initial injection
console.log('[RIA Debug] Starting initial injection...');

// Check if we should auto-open sidebar after reload
const urlParams = new URLSearchParams(window.location.search);
const shouldAutoOpen = urlParams.get('ria_auto_open') === '1';
const wasForceReload = urlParams.get('ria_force_reload') === '1';

// Clean up URL parameters
if (shouldAutoOpen || wasForceReload) {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.delete('ria_auto_open');
  newUrl.searchParams.delete('ria_force_reload');
  window.history.replaceState({}, '', newUrl.toString());
  console.log('[RIA Debug] Cleaned up URL parameters');
}

let cleanup = injectContainers();

// Auto-open sidebar if requested
if (shouldAutoOpen) {
  console.log('[RIA Debug] Auto-opening sidebar after reload');
  setTimeout(() => {
    sharedState.setSidebarOpen(true);
  }, 1000); // Small delay to ensure page is fully loaded
}

console.log('[RIA Debug] Initial injection complete');

// Track last URL to prevent unnecessary reinjections
let lastUrl = window.location.href;
let isCurrentlyOnListingPage = isListingPage();
let lastListingId = extractListingId(window.location.href);

// Debounced injection function
const debouncedInject = debounce(() => {
  const currentUrl = window.location.href;
  const isNowOnListingPage = isListingPage();
  const currentListingId = extractListingId(currentUrl);
  
  console.log('[RIA Debug] URL change detected:', {
    currentUrl,
    isNowOnListingPage,
    currentListingId,
    lastListingId
  });
  
  // Check if we've navigated to a new listing page
  if (isNowOnListingPage && currentListingId && currentListingId !== lastListingId) {
    console.log('[RIA Debug] New listing detected, checking if reload needed');
    checkAndForceReload();
    return; // Don't continue with injection, let reload handle it
  }
  
  // Check if sidebar is open and we're not on a listing page
  if (!isNowOnListingPage && sharedState.isSidebarOpen) {
    console.log('[RIA Debug] Not on listing page and sidebar is open, closing sidebar...');
    sharedState.setSidebarOpen(false);
  }
  
  // Only reinject if:
  // 1. URL has changed AND we're on a listing page, or
  // 2. We've just entered a listing page
  if ((currentUrl !== lastUrl && isNowOnListingPage) || (!isCurrentlyOnListingPage && isNowOnListingPage)) {
    console.log('[RIA Debug] Page change detected, reinjecting...');
    lastUrl = currentUrl;
    isCurrentlyOnListingPage = isNowOnListingPage;
    lastListingId = currentListingId;
    cleanup = injectContainers();
  } else if (currentUrl !== lastUrl) {
    // Update URL tracking even if we're not on a listing page
    lastUrl = currentUrl;
    isCurrentlyOnListingPage = isNowOnListingPage;
    lastListingId = currentListingId;
  }
}, 250); // 250ms debounce

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

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
  console.log('[RIA Debug] Popstate event detected');
  debouncedInject();
});

// Handle pushstate/replacestate (SPA navigation)
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function(...args) {
  originalPushState.apply(history, args);
  console.log('[RIA Debug] PushState detected');
  debouncedInject();
};

history.replaceState = function(...args) {
  originalReplaceState.apply(history, args);
  console.log('[RIA Debug] ReplaceState detected');
  debouncedInject();
};

// Cleanup on page unload
window.addEventListener('unload', () => {
  observer.disconnect();
  urlObserver.disconnect();
  if (cleanup) {
    cleanup();
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('[RIA] Content script received message:', message);
  if (message.type === 'TOGGLE_SIDEBAR') {
    cleanup = injectContainers();
  }
  sendResponse({ received: true });
  return true;
}); 