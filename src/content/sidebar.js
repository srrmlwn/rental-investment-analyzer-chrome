// Sidebar component for Rental Investment Analyzer
// Handles rendering, updating, and basic interactivity

import { DataExtractor } from '../services/dataExtractor.js';
import { SELECTORS } from '../constants/selectors.js';
import rentalEstimator from '../services/rentalEstimator.js';
import configManager from '../services/configManager.js';
import cashFlowAnalyzer from '../services/cashFlowAnalyzer.js';
import { PropertyCard } from './components/PropertyCard.js';

class Sidebar {
    constructor() {
        console.log('[RIA] Initializing sidebar...');
        this.sidebarId = 'rental-investment-analyzer-sidebar';
        this.isInModal = this.detectModalContext();
        console.log('[RIA] Modal context:', this.isInModal);
        
        this.isListingPage = this.detectListingPage();
        console.log('[RIA] Is listing page:', this.isListingPage);
        
        // Initialize data extractor
        this.dataExtractor = new DataExtractor();
        // Find JSON data in the page
        this.dataExtractor.findJsonData();
        // Set JSON data in rental estimator
        rentalEstimator.setJsonData(this.dataExtractor.jsonData);
        
        // Always inject into document.body for proper stacking context
        this.targetContainer = document.body;
        console.log('[RIA] Target container:', this.targetContainer);
        
        this.observer = null;
        this.modalObserver = null;
        
        // Always initialize the observer to watch for listing pages
        this.setupModalObserver();
        
        // If we're already on a listing page, show the sidebar
        if (this.isListingPage) {
            console.log('[RIA] Already on listing page, showing sidebar...');
            this.injectSidebar();
            // Wait for next tick to ensure DOM is updated
            setTimeout(() => {
                this.addEventListeners();
                this.loadPropertyData();
            }, 0);
        }

        this.isConfigPanelVisible = false;
    }

    detectListingPage() {
        // Check if we're on a listing page (either modal or direct)
        const isModalListing = this.isInModal && (
            document.querySelector('.modal-container [data-testid="home-details-summary"]') ||
            document.querySelector('.modal-container [data-testid="home-details-price"]') ||
            document.querySelector('.modal-container .ds-home-details-chip') ||
            document.querySelector('.modal-container .ds-price') ||
            document.querySelector('.modal-container .ds-bed-bath-living-area-container')
        );
        
        const isDirectListing = !this.isInModal && (
            // Check for listing page indicators
            document.querySelector('[data-testid="home-details-summary"]') ||
            document.querySelector('[data-testid="home-details-price"]') ||
            document.querySelector('.ds-home-details-chip') ||
            document.querySelector('.ds-price') ||
            document.querySelector('.ds-bed-bath-living-area-container') ||
            document.querySelector('.ds-address-container') ||
            window.location.pathname.includes('/homedetails/')
        );
        
        console.log('[RIA] Modal listing check:', isModalListing);
        console.log('[RIA] Direct listing check:', isDirectListing);
        console.log('[RIA] Current URL:', window.location.href);
        
        return isModalListing || isDirectListing;
    }

    detectModalContext() {
        // Check if we're in a Zillow listing modal
        const modalContainer = document.querySelector('.modal-container');
        if (modalContainer) {
            // Check if this is a listing modal (not a different type of modal)
            const hasListingContent = modalContainer.querySelector('[data-testid="home-details-summary"]') ||
                                    modalContainer.querySelector('[data-testid="home-details-price"]') ||
                                    modalContainer.querySelector('.ds-home-details-chip');
            return hasListingContent;
        }
        return false;
    }

    setupModalObserver() {
        console.log('[RIA] Setting up modal observer...');
        // Watch for modal changes
        this.observer = new MutationObserver((mutations) => {
            // Only process if we see relevant changes
            const hasRelevantChanges = mutations.some(mutation => {
                // Check if the change is in a modal container
                if (mutation.target.classList?.contains('modal-container')) return true;
                
                // Check if the change is to a listing-related element
                const listingSelectors = [
                    SELECTORS.PRICE,
                    SELECTORS.BED_BATH_SECTION,
                    SELECTORS.SQUARE_FEET,
                    SELECTORS.RENT_ZESTIMATE,
                    SELECTORS.ADDRESS
                ].join(', ');
                
                if (mutation.target.matches?.(listingSelectors)) return true;
                
                // Check if any added nodes are listing-related
                if (mutation.addedNodes) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && 
                            (node.matches(listingSelectors) || node.querySelector(listingSelectors))) {
                            return true;
                        }
                    }
                }
                return false;
            });

            if (!hasRelevantChanges) return;

            const modalContainer = document.querySelector('.modal-container');
            const wasListingPage = this.isListingPage;
            this.isInModal = this.detectModalContext();
            this.isListingPage = this.detectListingPage();

            // Only log if there's an actual change in context
            if (wasListingPage !== this.isListingPage || this.isInModal !== this.detectModalContext()) {
                console.log('[RIA] Context change detected:', {
                    wasListingPage,
                    isListingPage: this.isListingPage,
                    isInModal: this.isInModal,
                    hasModalContainer: !!modalContainer
                });

                // Handle transitions between contexts
                if (this.isListingPage) {
                    if (!wasListingPage) {
                        console.log('[RIA] Entering listing page, showing sidebar...');
                        this.injectSidebar();
                        this.addEventListeners();
                        this.loadPropertyData();
                    }
                    // Update sidebar position and z-index
                    this.updateSidebarPosition();
                } else if (wasListingPage) {
                    console.log('[RIA] Leaving listing page, removing sidebar...');
                    this.destroy();
                }
            }
        });

        // Start observing the document body for changes, but only for childList and subtree
        // We don't need to watch attributes or characterData for our use case
        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Also observe URL changes for direct listing pages
        let lastUrl = window.location.href;
        new MutationObserver(() => {
            if (window.location.href !== lastUrl) {
                console.log('[RIA] URL changed:', window.location.href);
                lastUrl = window.location.href;
                this.isListingPage = this.detectListingPage();
                if (this.isListingPage && !document.getElementById(this.sidebarId)) {
                    console.log('[RIA] URL change detected listing page, showing sidebar...');
                    this.injectSidebar();
                    this.addEventListeners();
                    this.loadPropertyData();
                }
            }
        }).observe(document, { subtree: true, childList: true });
    }

    updateSidebarPosition() {
        const sidebar = document.getElementById(this.sidebarId);
        if (!sidebar) return;

        // Always position relative to viewport
        sidebar.style.position = 'fixed';
        sidebar.style.right = '0';
        sidebar.style.top = this.isInModal ? '0' : '60px';
        sidebar.style.height = this.isInModal ? '100vh' : 'calc(100vh - 60px)';
        
        // Set z-index to be above everything
        sidebar.style.zIndex = '2147483647'; // Maximum z-index value
        
        // Ensure proper stacking context
        sidebar.style.isolation = 'isolate';
        
        // Add backdrop if in modal context
        if (this.isInModal) {
            sidebar.style.backgroundColor = 'var(--md-background)';
            sidebar.style.boxShadow = 'var(--md-elevation-3)';
        }
    }

    injectSidebar() {
        console.log('[RIA] Injecting sidebar...');
        if (document.getElementById(this.sidebarId)) {
            console.log('[RIA] Sidebar already exists, skipping injection');
            return;
        }
        
        const sidebar = document.createElement('div');
        sidebar.id = this.sidebarId;
        sidebar.className = 'ria-sidebar';
        
        // Set initial styles
        Object.assign(sidebar.style, {
            position: 'fixed',
            right: '0',
            top: this.isInModal ? '0' : '60px',
            width: '380px',
            height: this.isInModal ? '100vh' : 'calc(100vh - 60px)',
            zIndex: '2147483647',
            backgroundColor: 'var(--md-background)',
            boxShadow: 'var(--md-elevation-3)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            isolation: 'isolate'
        });
        
        // Create sidebar content
        sidebar.innerHTML = `
            <div class="ria-header">
                <h2>Rental Investment Analyzer</h2>
                <button class="ria-close-btn" title="Close sidebar" type="button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                    </svg>
                </button>
            </div>
            <div class="ria-content">
                <div class="ria-property-data">
                    <div class="ria-loading">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ria-spinner">
                            <path d="M12 4V2C6.48 2 2 6.48 2 12h2c0-4.42 3.58-8 8-8z" fill="currentColor"/>
                        </svg>
                        Loading property data...
                    </div>
                </div>
                <div class="ria-config-panel hidden">
                    <h3 class="ria-text-primary">Investment Settings</h3>
                    <form id="ria-config-form" class="ria-form">
                        <div class="ria-form-group">
                            <label for="mortgageRate">Mortgage Rate (%)</label>
                            <input type="number" id="mortgageRate" name="mortgageRate" step="0.1" min="0" max="100" required>
                        </div>
                        <div class="ria-form-group">
                            <label for="downPaymentPercent">Down Payment (%)</label>
                            <input type="number" id="downPaymentPercent" name="downPaymentPercent" step="1" min="0" max="100" required>
                        </div>
                        <div class="ria-form-group">
                            <label for="propertyManagementFee">Property Management Fee (%)</label>
                            <input type="number" id="propertyManagementFee" name="propertyManagementFee" step="0.1" min="0" max="100" required>
                        </div>
                        <div class="ria-form-group">
                            <label for="maintenanceReserve">Maintenance Reserve (%)</label>
                            <input type="number" id="maintenanceReserve" name="maintenanceReserve" step="0.1" min="0" max="100" required>
                        </div>
                        <div class="ria-form-group">
                            <label for="insuranceRate">Insurance Rate (%)</label>
                            <input type="number" id="insuranceRate" name="insuranceRate" step="0.1" min="0" max="100" required>
                        </div>
                        <div class="ria-form-group">
                            <label for="propertyTaxRate">Property Tax Rate (%)</label>
                            <input type="number" id="propertyTaxRate" name="propertyTaxRate" step="0.1" min="0" max="100" required>
                        </div>
                        <div class="ria-form-group">
                            <label for="hoaFees">Monthly HOA Fees ($)</label>
                            <input type="number" id="hoaFees" name="hoaFees" step="1" min="0" required>
                        </div>
                        <div class="ria-form-group">
                            <label for="vacancyRate">Vacancy Rate (%)</label>
                            <input type="number" id="vacancyRate" name="vacancyRate" step="0.1" min="0" max="100" required>
                        </div>
                        <div class="ria-form-actions">
                            <button type="submit" class="ria-btn ria-btn-primary">Save Settings</button>
                            <button type="button" class="ria-btn ria-btn-secondary" id="ria-reset-config">Reset to Defaults</button>
                        </div>
                    </form>
                </div>
                <div class="ria-cash-flow-analysis">
                    <h3 class="ria-text-primary">Cash Flow Analysis</h3>
                    <div class="ria-loading">Analysis coming soon...</div>
                </div>
                <div class="ria-action-buttons">
                    <button class="ria-btn ria-btn-primary" id="ria-refresh-btn" type="button">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
                            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/>
                        </svg>
                        Refresh
                    </button>
                    <button class="ria-btn ria-btn-secondary" id="ria-config-btn" title="Settings" type="button">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        this.targetContainer.appendChild(sidebar);
        this.updateSidebarPosition();
        console.log('[RIA] Sidebar injected successfully');
    }

    addEventListeners() {
        console.log('[RIA] Adding event listeners...');
        const sidebar = document.getElementById(this.sidebarId);
        if (!sidebar) {
            console.error('[RIA] Sidebar element not found when adding event listeners');
            return;
        }

        const closeBtn = sidebar.querySelector('.ria-close-btn');
        const refreshBtn = sidebar.querySelector('#ria-refresh-btn');
        const configBtn = sidebar.querySelector('#ria-config-btn');
        const configForm = sidebar.querySelector('#ria-config-form');
        const resetConfigBtn = sidebar.querySelector('#ria-reset-config');

        if (closeBtn) {
            closeBtn.onclick = () => this.hide();
        } else {
            console.error('[RIA] Close button not found');
        }

        if (refreshBtn) {
            refreshBtn.onclick = () => {
                console.log('[RIA] Refresh button clicked');
                this.refreshPropertyData();
            };
        } else {
            console.error('[RIA] Refresh button not found');
        }

        if (configBtn) {
            configBtn.onclick = () => this.toggleConfigPanel();
        }

        if (configForm) {
            configForm.onsubmit = async (e) => {
                e.preventDefault();
                const formData = new FormData(configForm);
                const config = {};
                for (const [key, value] of formData.entries()) {
                    config[key] = parseFloat(value);
                }
                const success = await configManager.saveConfig(config);
                if (success) {
                    this.loadPropertyData();
                    this.toggleConfigPanel();
                }
            };
        }

        if (resetConfigBtn) {
            resetConfigBtn.onclick = async () => {
                const success = await configManager.resetToDefaults();
                if (success) {
                    this.loadConfigValues();
                    this.loadPropertyData();
                }
            };
        }

        console.log('[RIA] Event listeners added successfully');
    }

    show() {
        const sidebar = document.getElementById(this.sidebarId);
        if (sidebar) {
            sidebar.classList.remove('hidden');
            // Add animation class
            sidebar.style.transform = 'translateX(0)';
        }
    }

    hide() {
        const sidebar = document.getElementById(this.sidebarId);
        if (sidebar) {
            sidebar.classList.add('hidden');
            // Add animation class
            sidebar.style.transform = 'translateX(100%)';
        }
    }

    toggle() {
        const sidebar = document.getElementById(this.sidebarId);
        if (sidebar) {
            if (sidebar.classList.contains('hidden')) {
                this.show();
            } else {
                this.hide();
            }
        }
    }

    updatePropertyData(html) {
        const dataDiv = document.querySelector('.ria-property-data');
        if (dataDiv) {
            dataDiv.innerHTML = html;
        }
    }

    updateCashFlowAnalysis(html) {
        const cashFlowDiv = document.querySelector('.ria-cash-flow-analysis');
        if (cashFlowDiv) {
            cashFlowDiv.innerHTML = `
                <h3 class="ria-text-primary">Cash Flow Analysis</h3>
                ${html}
            `;
        }
    }

    toggleConfigPanel() {
        const configPanel = document.querySelector('.ria-config-panel');
        if (configPanel) {
            this.isConfigPanelVisible = !this.isConfigPanelVisible;
            configPanel.classList.toggle('hidden');
            if (this.isConfigPanelVisible) {
                this.loadConfigValues();
            }
        }
    }

    loadConfigValues() {
        const config = configManager.getConfig();
        const form = document.getElementById('ria-config-form');
        if (form) {
            for (const [key, value] of Object.entries(config)) {
                const input = form.elements[key];
                if (input) {
                    input.value = value;
                }
            }
        }
    }

    async loadPropertyData() {
        console.log('[RIA] Loading property data...');
        try {
            // Ensure we have the latest JSON data
            this.dataExtractor.findJsonData();
            rentalEstimator.setJsonData(this.dataExtractor.jsonData);
            
            const propertyData = await this.dataExtractor.extractPropertyData();
            console.log('[RIA] Property data extracted:', propertyData);
            
            if (!propertyData) {
                throw new Error('Failed to extract property data');
            }

            // Get rental estimate with HUD fallback
            const rentalEstimate = await rentalEstimator.getRentalEstimate(propertyData);
            console.log('[RIA] Rental estimate:', rentalEstimate);
            
            // Analyze property
            const analysis = cashFlowAnalyzer.analyzeProperty(propertyData, rentalEstimate);
            console.log('[RIA] Property analysis:', analysis);
            
            // Update UI with property data and analysis
            this.updatePropertyData(this.formatPropertyData(propertyData, rentalEstimate));
            this.updateCashFlowAnalysis(this.formatCashFlowAnalysis(analysis));
        } catch (error) {
            console.error('[RIA] Error loading property data:', error);
            this.updatePropertyData(`
                <div class="ria-error">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: var(--md-error); margin-right: 8px;">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                    </svg>
                    <span style="color: var(--md-error);">${error.message}</span>
                </div>
            `);
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
        `;
    }

    formatCashFlowAnalysis(analysis) {
        const { expenses, income, metrics, rentSource } = analysis;
        const { formatCurrency, formatPercentage } = cashFlowAnalyzer;

        return `
            <div class="ria-card">
                <h4 class="ria-text-primary">Monthly Income</h4>
                <ul>
                    <li>
                        <span class="ria-text-secondary">Gross Rent</span>
                        <span class="ria-text-primary">${formatCurrency(income.grossRent)}</span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">Vacancy Allowance</span>
                        <span class="ria-text-primary">-${formatCurrency(income.vacancyAllowance)}</span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">Net Income</span>
                        <span class="ria-text-primary">${formatCurrency(income.netIncome)}</span>
                    </li>
                </ul>
            </div>
            <div class="ria-card">
                <h4 class="ria-text-primary">Monthly Expenses</h4>
                <ul>
                    <li>
                        <span class="ria-text-secondary">Mortgage Payment</span>
                        <span class="ria-text-primary">${formatCurrency(expenses.mortgagePayment)}</span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">Property Taxes</span>
                        <span class="ria-text-primary">${formatCurrency(expenses.propertyTaxes)}</span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">Insurance</span>
                        <span class="ria-text-primary">${formatCurrency(expenses.insurance)}</span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">Property Management</span>
                        <span class="ria-text-primary">${formatCurrency(expenses.propertyManagement)}</span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">Maintenance Reserve</span>
                        <span class="ria-text-primary">${formatCurrency(expenses.maintenanceReserve)}</span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">HOA Fees</span>
                        <span class="ria-text-primary">${formatCurrency(expenses.hoaFees)}</span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">Total Expenses</span>
                        <span class="ria-text-primary">${formatCurrency(expenses.total)}</span>
                    </li>
                </ul>
            </div>
            <div class="ria-card">
                <h4 class="ria-text-primary">Investment Metrics</h4>
                <ul>
                    <li>
                        <span class="ria-text-secondary">Monthly Cash Flow</span>
                        <span class="ria-text-primary ${metrics.monthlyCashFlow >= 0 ? 'ria-text-success' : 'ria-text-error'}">
                            ${formatCurrency(metrics.monthlyCashFlow)}
                        </span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">Annual Cash Flow</span>
                        <span class="ria-text-primary ${metrics.annualCashFlow >= 0 ? 'ria-text-success' : 'ria-text-error'}">
                            ${formatCurrency(metrics.annualCashFlow)}
                        </span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">Cash on Cash Return</span>
                        <span class="ria-text-primary">${formatPercentage(metrics.cashOnCashReturn)}</span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">Cap Rate</span>
                        <span class="ria-text-primary">${formatPercentage(metrics.capRate)}</span>
                    </li>
                </ul>
            </div>
            <div class="ria-card">
                <h4 class="ria-text-primary">Property Details</h4>
                <ul>
                    <li>
                        <span class="ria-text-secondary">Price per Sq Ft</span>
                        <span class="ria-text-primary">${formatCurrency(analysis.propertyDetails.pricePerSqFt)}</span>
                    </li>
                    <li>
                        <span class="ria-text-secondary">Rent Source</span>
                        <span class="ria-text-primary">${rentSource}</span>
                    </li>
                </ul>
            </div>
        `;
    }

    refreshPropertyData() {
        console.log('[RIA] Refreshing property data...');
        this.loadPropertyData();
    }

    destroy() {
        // Remove sidebar if it exists
        const sidebar = document.getElementById(this.sidebarId);
        if (sidebar) {
            sidebar.remove();
        }

        // Clean up observers
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        if (this.modalObserver) {
            this.modalObserver.disconnect();
            this.modalObserver = null;
        }
    }
}

// Create and export a singleton instance
const sidebar = new Sidebar();
export default sidebar; 