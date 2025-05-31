// Configuration manager for rental investment analyzer
// Handles user settings, defaults, and persistence

const DEFAULT_CONFIG = {
    mortgageRate: 7.5, // Annual interest rate in percentage
    downPaymentPercent: 20, // Down payment as percentage of property value
    propertyManagementFee: 8, // Property management fee as percentage of rent
    maintenanceReserve: 1, // Maintenance reserve as percentage of property value
    insuranceRate: 0.5, // Annual insurance rate as percentage of property value
    propertyTaxRate: 1.1, // Annual property tax rate as percentage of property value
    hoaFees: 0, // Monthly HOA fees in dollars
    vacancyRate: 5, // Vacancy rate as percentage of annual rent
    loanTermYears: 30, // Standard 30-year mortgage
};

class ConfigManager {
    constructor() {
        this.config = { ...DEFAULT_CONFIG };
        this.loadConfig();
    }

    async loadConfig() {
        try {
            const result = await chrome.storage.sync.get('riaConfig');
            if (result.riaConfig) {
                this.config = { ...DEFAULT_CONFIG, ...result.riaConfig };
            }
            console.log('[RIA] Configuration loaded:', this.config);
        } catch (error) {
            console.error('[RIA] Error loading configuration:', error);
            // Fall back to defaults
            this.config = { ...DEFAULT_CONFIG };
        }
    }

    async saveConfig(newConfig) {
        try {
            // Validate and merge with existing config
            const validatedConfig = this.validateConfig(newConfig);
            this.config = { ...this.config, ...validatedConfig };
            
            // Save to Chrome storage
            await chrome.storage.sync.set({ riaConfig: this.config });
            console.log('[RIA] Configuration saved:', this.config);
            return true;
        } catch (error) {
            console.error('[RIA] Error saving configuration:', error);
            return false;
        }
    }

    async resetToDefaults() {
        try {
            this.config = { ...DEFAULT_CONFIG };
            await chrome.storage.sync.set({ riaConfig: this.config });
            console.log('[RIA] Configuration reset to defaults');
            return true;
        } catch (error) {
            console.error('[RIA] Error resetting configuration:', error);
            return false;
        }
    }

    validateConfig(config) {
        const validated = {};
        
        // Helper function to validate percentage values
        const validatePercentage = (value, key) => {
            const num = parseFloat(value);
            if (isNaN(num) || num < 0 || num > 100) {
                throw new Error(`Invalid ${key}: must be between 0 and 100`);
            }
            return num;
        };

        // Helper function to validate dollar values
        const validateDollars = (value, key) => {
            const num = parseFloat(value);
            if (isNaN(num) || num < 0) {
                throw new Error(`Invalid ${key}: must be a positive number`);
            }
            return num;
        };

        // Validate each config value if present
        if (config.mortgageRate !== undefined) {
            validated.mortgageRate = validatePercentage(config.mortgageRate, 'mortgage rate');
        }
        if (config.downPaymentPercent !== undefined) {
            validated.downPaymentPercent = validatePercentage(config.downPaymentPercent, 'down payment percentage');
        }
        if (config.propertyManagementFee !== undefined) {
            validated.propertyManagementFee = validatePercentage(config.propertyManagementFee, 'property management fee');
        }
        if (config.maintenanceReserve !== undefined) {
            validated.maintenanceReserve = validatePercentage(config.maintenanceReserve, 'maintenance reserve');
        }
        if (config.insuranceRate !== undefined) {
            validated.insuranceRate = validatePercentage(config.insuranceRate, 'insurance rate');
        }
        if (config.propertyTaxRate !== undefined) {
            validated.propertyTaxRate = validatePercentage(config.propertyTaxRate, 'property tax rate');
        }
        if (config.hoaFees !== undefined) {
            validated.hoaFees = validateDollars(config.hoaFees, 'HOA fees');
        }
        if (config.vacancyRate !== undefined) {
            validated.vacancyRate = validatePercentage(config.vacancyRate, 'vacancy rate');
        }
        if (config.loanTermYears !== undefined) {
            const years = parseInt(config.loanTermYears);
            if (isNaN(years) || years < 1 || years > 50) {
                throw new Error('Invalid loan term: must be between 1 and 50 years');
            }
            validated.loanTermYears = years;
        }

        return validated;
    }

    getConfig() {
        return { ...this.config };
    }

    // Helper method to calculate monthly mortgage payment
    calculateMonthlyMortgage(propertyValue) {
        const loanAmount = propertyValue * (1 - this.config.downPaymentPercent / 100);
        const monthlyRate = this.config.mortgageRate / 100 / 12;
        const numberOfPayments = this.config.loanTermYears * 12;
        
        // Standard mortgage payment formula
        const monthlyPayment = loanAmount * 
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        return monthlyPayment;
    }
}

// Create and export a singleton instance
const configManager = new ConfigManager();
export default configManager; 