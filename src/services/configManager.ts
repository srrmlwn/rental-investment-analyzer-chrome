import { InvestmentConfig, InvestmentParams, ConfigValidation, PropertyData } from '@/types/investment';
import { CONFIG_PARAMETERS, getParameterByKey } from '@/constants/configParameters';

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

export interface ConfigPreset {
  name: string;
  description: string;
  params: Partial<InvestmentParams>;
}

export const DEFAULT_PRESETS: Record<string, ConfigPreset> = {
  conservative: {
    name: 'Conservative',
    description: 'Lower risk, higher down payment, higher reserves',
    params: {
      downPaymentPercent: 25,
      vacancyRatePercent: 8,
      propertyManagementPercent: 10,
      monthlyMaintenance: 250,
      annualAppreciation: 2,
      annualRentGrowth: 1.5,
      annualExpenseGrowth: 2.5,
    },
  },
  moderate: {
    name: 'Moderate',
    description: 'Balanced approach with standard assumptions',
    params: {
      downPaymentPercent: 20,
      vacancyRatePercent: 5,
      propertyManagementPercent: 8,
      monthlyMaintenance: 200,
      annualAppreciation: 3,
      annualRentGrowth: 2,
      annualExpenseGrowth: 2,
    },
  },
  aggressive: {
    name: 'Aggressive',
    description: 'Higher risk, lower down payment, optimistic growth',
    params: {
      downPaymentPercent: 15,
      vacancyRatePercent: 3,
      propertyManagementPercent: 6,
      monthlyMaintenance: 150,
      annualAppreciation: 4,
      annualRentGrowth: 3,
      annualExpenseGrowth: 1.5,
    },
  },
};

// Create default config from parameters (only listing-agnostic settings)
const DEFAULT_CONFIG: InvestmentConfig = CONFIG_PARAMETERS
  .filter(param => !param.isListingSpecific)
  .reduce((config, param) => ({
    ...config,
    [param.key]: param.default ?? 0,
  }), {} as InvestmentConfig);

type ConfigChangeListener = (config: InvestmentParams) => void;

export class ConfigManager {
  private static instance: ConfigManager;
  private config: InvestmentConfig;
  private originalConfig: InvestmentConfig | null = null; // Store original values
  private propertyData: PropertyData | null = null;
  private listeners: Set<ConfigChangeListener>;
  private debouncedSave: () => void;
  private saveTimeout: NodeJS.Timeout | null = null;
  private isSaving: boolean = false;

  private constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.listeners = new Set();
    // Debounce save operations to once per second
    this.debouncedSave = debounce(() => {
      if (!this.isSaving) {
        this.saveConfig().catch(console.error);
      }
    }, 1000);
    this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private async loadConfig(): Promise<void> {
    try {
      const stored = await chrome.storage.sync.get('investmentConfig');
      if (stored.investmentConfig) {
        this.config = { ...DEFAULT_CONFIG, ...stored.investmentConfig };
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  }

  private async saveConfig(): Promise<void> {
    if (this.isSaving) return;
    
    try {
      this.isSaving = true;
      // Only save listing-agnostic settings
      await chrome.storage.sync.set({ investmentConfig: this.config });
    } catch (error) {
      console.error('Error saving config:', error);
      // If we hit the quota limit, wait a bit and try again
      if (error instanceof Error && error.message.includes('MAX_WRITE_OPERATIONS_PER_MINUTE')) {
        console.log('Storage quota exceeded, will retry in 1 minute...');
        setTimeout(() => this.debouncedSave(), 60000);
      }
    } finally {
      this.isSaving = false;
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getConfig()));
  }

  public getConfig(): InvestmentParams {
    if (!this.propertyData) {
      throw new Error('Property data not set. Call setPropertyData first.');
    }

    // Calculate property tax rate if we have actual taxes
    let propertyTaxRate = this.config.propertyTaxRate;
    if (this.propertyData.propertyTaxes) {
      // Calculate effective tax rate from actual taxes
      propertyTaxRate = (this.propertyData.propertyTaxes / this.propertyData.price) * 100;
      console.log(`📊 Using actual property tax rate: ${propertyTaxRate.toFixed(2)}%`);
    }

    // Combine listing-agnostic config with property data
    return {
      ...this.config,
      propertyPrice: this.propertyData.price,
      monthlyRent: this.propertyData.rentEstimate,
      propertyTaxRate, // Use calculated rate if available
      // Calculate derived values
      monthlyMaintenance: this.calculateMonthlyMaintenance(),
      propertyTaxesAnnual: this.propertyData.propertyTaxes || this.calculateAnnualPropertyTaxes(),
      insuranceMonthly: this.calculateMonthlyInsurance(),
      hoaFeesMonthly: this.config.hoaFees,
      otherExpensesMonthly: 0, // Additional expenses can be added here
    };
  }

  public setPropertyData(data: PropertyData): void {
    this.propertyData = data;
    // Store original values when property data is set
    this.originalConfig = {
      ...this.config,
      propertyPrice: data.price,
      monthlyRent: data.rentEstimate,
      propertyTaxRate: data.propertyTaxes ? (data.propertyTaxes / data.price) * 100 : this.config.propertyTaxRate,
      hoaFees: data.hoaFees || this.config.hoaFees,
    };
    this.notifyListeners();
  }

  private calculateMonthlyMaintenance(): number {
    if (!this.propertyData) return 0;
    
    const baseRate = this.config.maintenanceReservePercent / 100;
    const propertyTypeMultiplier = {
      'Single Family': 1.0,
      'Condo': 0.8,
      'Multi Family': 1.2,
    }[this.propertyData.propertyType] || 1.0;

    return (this.propertyData.price * baseRate * propertyTypeMultiplier) / 12;
  }

  private calculateAnnualPropertyTaxes(): number {
    if (!this.propertyData) return 0;
    return this.propertyData.price * (this.config.propertyTaxRate / 100);
  }

  private calculateMonthlyInsurance(): number {
    if (!this.propertyData) return 0;
    return (this.propertyData.price * (this.config.insuranceRate / 100)) / 12;
  }

  public async updateConfig(updates: Partial<InvestmentConfig>): Promise<void> {
    // Validate updates (only listing-agnostic settings)
    for (const [key, value] of Object.entries(updates)) {
      const param = getParameterByKey(key as keyof InvestmentConfig);
      if (!param || param.isListingSpecific) continue;

      const validation = this.validateValue(key as keyof InvestmentConfig, value);
      if (!validation.isValid) {
        throw new Error(`Invalid value for ${param.label}: ${validation.error}`);
      }
    }

    this.config = { ...this.config, ...updates };
    // Use debounced save instead of immediate save
    this.debouncedSave();
    this.notifyListeners();
  }

  public async applyPreset(presetKey: keyof typeof DEFAULT_PRESETS): Promise<void> {
    const preset = DEFAULT_PRESETS[presetKey];
    if (!preset) {
      throw new Error(`Preset ${presetKey} not found`);
    }

    await this.updateConfig(preset.params);
  }

  public async resetToOriginal(): Promise<void> {
    if (!this.originalConfig) {
      throw new Error('No original values available. Set property data first.');
    }
    this.config = { ...this.originalConfig };
    await this.saveConfig();
    this.notifyListeners();
  }

  public async resetToDefaults(): Promise<void> {
    this.config = { ...DEFAULT_CONFIG };
    await this.saveConfig();
    this.notifyListeners();
  }

  public subscribe(listener: ConfigChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public validateValue(key: keyof InvestmentConfig, value: number): ConfigValidation {
    const param = getParameterByKey(key);
    if (!param) {
      return { isValid: false, error: 'Invalid parameter' };
    }

    if (param.type === 'percentage') {
      return this.validatePercentage(value, param.min, param.max);
    } else if (param.type === 'currency') {
      return this.validateCurrency(value, param.min);
    } else if (param.type === 'integer') {
      return this.validateInteger(value, param.min || 0, param.max || 100);
    }

    return { isValid: true };
  }

  private validatePercentage(value: number, min?: number, max?: number): ConfigValidation {
    if (isNaN(value)) {
      return { isValid: false, error: 'Value must be a number' };
    }
    if (min !== undefined && value < min) {
      return { isValid: false, error: `Value must be at least ${min}%` };
    }
    if (max !== undefined && value > max) {
      return { isValid: false, error: `Value must be at most ${max}%` };
    }
    return { isValid: true };
  }

  private validateCurrency(value: number, min?: number): ConfigValidation {
    if (isNaN(value)) {
      return { isValid: false, error: 'Value must be a number' };
    }
    if (value < 0) {
      return { isValid: false, error: 'Value must be positive' };
    }
    if (min !== undefined && value < min) {
      return { isValid: false, error: `Value must be at least $${min}` };
    }
    return { isValid: true };
  }

  private validateInteger(value: number, min: number, max: number): ConfigValidation {
    if (isNaN(value)) {
      return { isValid: false, error: 'Value must be a number' };
    }
    if (!Number.isInteger(value)) {
      return { isValid: false, error: 'Value must be a whole number' };
    }
    if (value < min) {
      return { isValid: false, error: `Value must be at least ${min}` };
    }
    if (value > max) {
      return { isValid: false, error: `Value must be at most ${max}` };
    }
    return { isValid: true };
  }

  /**
   * Updates property data and recalculates derived values
   */
  public async updateFromPropertyData(propertyData: PropertyData): Promise<void> {
    this.setPropertyData(propertyData);
  }
} 