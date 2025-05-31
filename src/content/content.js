// Content script for Rental Investment Analyzer
console.log('Content script loaded');

import { DataExtractor } from '../services/dataExtractor.js';
import rentalEstimator from '../services/rentalEstimator.js';
import sidebar from './sidebar.js';

class SidebarManager {
  constructor() {
    this.sidebar = null;
    this.isVisible = false;
  }

  createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.className = 'ria-sidebar hidden';
    sidebar.innerHTML = `
      <div class="ria-header">
        <h2>Rental Investment Analyzer</h2>
        <button class="ria-close-btn">×</button>
      </div>
      <div class="ria-content">
        <div class="ria-loading">Loading property data...</div>
      </div>
    `;

    // Add close button handler
    const closeBtn = sidebar.querySelector('.ria-close-btn');
    closeBtn.addEventListener('click', () => this.hideSidebar());

    return sidebar;
  }

  injectSidebar() {
    if (!this.sidebar) {
      this.sidebar = this.createSidebar();
      document.body.appendChild(this.sidebar);
    }
  }

  showSidebar() {
    if (this.sidebar) {
      this.sidebar.classList.remove('hidden');
      this.isVisible = true;
    }
  }

  hideSidebar() {
    if (this.sidebar) {
      this.sidebar.classList.add('hidden');
      this.isVisible = false;
    }
  }

  toggleSidebar() {
    if (this.isVisible) {
      this.hideSidebar();
    } else {
      this.showSidebar();
    }
  }
}

class ContentScript {
    constructor() {
        this.dataExtractor = new DataExtractor();
        this.sidebar = null;
    }

    async initialize() {
        console.log('🚀 Initializing Rental Investment Analyzer content script...');
        this.sidebar = new Sidebar();
        this.sidebar.show();
        try {
            const propertyData = await this.dataExtractor.extractPropertyData();
            // Get rental estimate with HUD fallback
            const rentalEstimate = await rentalEstimator.getRentalEstimate(propertyData);
            this.sidebar.updatePropertyData(this.formatPropertyData(propertyData, rentalEstimate));
        } catch (error) {
            console.error('Error in content script:', error);
            this.sidebar.updatePropertyData(`<span style="color:red;">${error.message}</span>`);
        }
    }

    formatPropertyData(data, rentalEstimate) {
        return `
            <div class="ria-card">
                <h3 class="ria-text-primary">Property Details</h3>
                <ul>
                    <li>
                        <span class="ria-text-secondary">Price</span>
                        <span class="ria-text-primary">$${data.price.toLocaleString()}</span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">Bedrooms</span>
                        <span class="ria-text-primary">${data.bedrooms}</span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">Bathrooms</span>
                        <span class="ria-text-primary">${data.bathrooms}</span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">Property Type</span>
                        <span class="ria-text-primary">${data.propertyType}</span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">Square Feet</span>
                        <span class="ria-text-primary">${data.squareFeet.toLocaleString()}</span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">Zip Code</span>
                        <span class="ria-text-primary">${data.zipCode}</span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">Rent Estimate</span>
                        <span class="ria-text-primary">$${rentalEstimate.rent.toLocaleString()}/mo</span>
                        <span class="ria-text-secondary" style="font-size: 0.8em;">(${rentalEstimate.source})</span>
                    </li>
                </ul>
            </div>
            <div class="ria-card">
                <h3 class="ria-text-primary">Investment Metrics</h3>
                <div class="ria-loading">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ria-spinner">
                        <path d="M12 4V2C6.48 2 2 6.48 2 12h2c0-4.42 3.58-8 8-8z" fill="currentColor"/>
                    </svg>
                    Not Available Yet
                </div>
            </div>
        `;
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ContentScript().initialize());
} else {
    new ContentScript().initialize();
}

// Export for testing
export { ContentScript };

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('[RIA] Content script initialized');
  
  // Add keyboard shortcut (Ctrl/Cmd + Shift + R)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
      e.preventDefault();
      sidebar.toggle();
    }
  });
}); 