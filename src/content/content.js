// Content script for Rental Investment Analyzer
console.log('Content script loaded');

import { DataExtractor } from '../services/dataExtractor.js';
import rentalEstimator from '../services/rentalEstimator.js';

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
        this.sidebar = null; // We'll implement this later
    }

    async initialize() {
        console.log('🎯 Rental Investment Analyzer: Content script initialized');
        
        try {
            // Extract property data
            console.log('📊 Extracting property data...');
            const propertyData = await this.dataExtractor.extractPropertyData();
            console.log('✅ Property data extracted:', propertyData);

            // Get rental estimate
            console.log('💰 Getting rental estimate...');
            try {
                const rentalEstimate = await rentalEstimator.getRentalEstimate(propertyData);
                console.log('✅ Rental estimate:', rentalEstimate);
            } catch (error) {
                console.error('❌ Error getting rental estimate:', error.message);
            }

            // Log what we would calculate (to be implemented)
            console.log('📈 Would calculate:');
            console.log('- Monthly cash flow');
            console.log('- Annual cash flow');
            console.log('- Cap rate');
            console.log('- Cash-on-cash return');

        } catch (error) {
            console.error('❌ Error in content script:', error.message);
            if (error.message.includes('Required information is missing')) {
                console.log('💡 Tip: Make sure you are on a valid Zillow listing page');
            }
        }
    }
}

// Initialize when the page is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const contentScript = new ContentScript();
        contentScript.initialize();
    });
} else {
    const contentScript = new ContentScript();
    contentScript.initialize();
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