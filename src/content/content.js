// Content script for Rental Investment Analyzer
console.log('Content script loaded');

import { DataExtractor } from '../services/dataExtractor.js';
import rentalEstimator from '../services/rentalEstimator.js';
import Sidebar from './sidebar.js';

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
            // TODO: Use rentalEstimator and mortgage calculator for analysis
            // For now, just display property data
            this.sidebar.updatePropertyData(this.formatPropertyData(propertyData));
        } catch (error) {
            console.error('Error in content script:', error);
            this.sidebar.updatePropertyData(`<span style="color:red;">${error.message}</span>`);
        }
    }

    formatPropertyData(data) {
        return `
            <ul style="list-style:none;padding:0;">
                <li><b>Price:</b> $${data.price.toLocaleString()}</li>
                <li><b>Bedrooms:</b> ${data.bedrooms}</li>
                <li><b>Bathrooms:</b> ${data.bathrooms}</li>
                <li><b>Type:</b> ${data.propertyType}</li>
                <li><b>Sqft:</b> ${data.squareFeet.toLocaleString()}</li>
                <li><b>Zip Code:</b> ${data.zipCode}</li>
                <li><b>Rent Estimate:</b> ${data.rentZestimate ? `$${data.rentZestimate.toLocaleString()}/mo` : 'N/A'}</li>
            </ul>
            <div style="margin-top:12px;">
                <i>Analysis and user controls coming soon...</i>
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
  const sidebarManager = new SidebarManager();
  
  // Inject sidebar
  sidebarManager.injectSidebar();
  
  // Add keyboard shortcut (Ctrl/Cmd + Shift + R)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
      e.preventDefault();
      sidebarManager.toggleSidebar();
    }
  });

  // TODO: Implement property data extraction
  console.log('Content script initialized');
}); 