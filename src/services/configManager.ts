import { CalculationInputs } from '@/types/calculationInputs';
import { ConfigValidation } from '@/types/configTypes';
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

// Create default config from parameters
const DEFAULT_CONFIG: CalculationInputs = CONFIG_PARAMETERS
  .reduce((config, param) => ({
    ...config,
    [param.id]: param.default ?? 0,
  }), {} as CalculationInputs);

type ConfigChangeListener = (config: CalculationInputs) => void;

export class ConfigManager {
  private static instance: ConfigManager;
  private config: CalculationInputs;
  private listeners: Set<ConfigChangeListener>;
  private debouncedSave: () => void;
  private isSaving: boolean = false;
  private isInitialLoad: boolean = true;

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
      const stored = await chrome.storage.sync.get('userCalculationInputs');
      if (stored.userCalculationInputs) {
        // Preserve any listing-specific values (like purchase price) when loading from storage
        const listingValues = {
          purchasePrice: this.config.purchasePrice,
          rentEstimate: this.config.rentEstimate,
          propertyTaxes: this.config.propertyTaxes,
          hoaFees: this.config.hoaFees
        };
        
        this.config = { 
          ...DEFAULT_CONFIG, 
          ...stored.userCalculationInputs,
          ...listingValues // Ensure listing values are preserved
        };
        
        // Only notify listeners if this isn't the initial load
        if (!this.isInitialLoad) {
          this.notifyListeners();
        }
        this.isInitialLoad = false;
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  }

  private async saveConfig(): Promise<void> {
    if (this.isSaving) return;
    this.isSaving = true;

    try {
      await chrome.storage.sync.set({ userCalculationInputs: this.config });
      console.log('Config saved:', this.config);
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      this.isSaving = false;
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getConfig()));
  }

  public getConfig(): CalculationInputs {
    return { ...this.config };
  }

  public async updateConfig(updates: Partial<CalculationInputs>): Promise<void> {
    // Don't update listing-specific values from storage
    const listingKeys = ['purchasePrice', 'rentEstimate', 'propertyTaxes', 'hoaFees'] as const;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => !listingKeys.includes(key as typeof listingKeys[number]))
    ) as Partial<CalculationInputs>;

    // Validate updates
    for (const [key, value] of Object.entries(filteredUpdates)) {
      const param = getParameterByKey(key as keyof CalculationInputs);
      if (!param) continue;

      const validation = this.validateValue(key as keyof CalculationInputs, value as number);
      if (!validation.isValid) {
        throw new Error(`Invalid value for ${param.label}: ${validation.error}`);
      }
    }

    // Update config with filtered updates
    this.config = { ...this.config, ...filteredUpdates };
    
    // Use debounced save instead of immediate save
    this.debouncedSave();
    this.notifyListeners();
  }

  public async resetToDefaults(): Promise<void> {
    // Preserve listing-specific values when resetting
    const listingValues = {
      purchasePrice: this.config.purchasePrice,
      rentEstimate: this.config.rentEstimate,
      propertyTaxes: this.config.propertyTaxes,
      hoaFees: this.config.hoaFees
    };
    
    this.config = { ...DEFAULT_CONFIG, ...listingValues };
    await this.saveConfig();
    this.notifyListeners();
  }

  public subscribe(listener: ConfigChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public validateValue(key: keyof CalculationInputs, value: number): ConfigValidation {
    const param = getParameterByKey(key);
    if (!param) {
      return { isValid: false, error: 'Invalid parameter' };
    }

    if (param.type === 'percentage') {
      return this.validatePercentage(value, param.min, param.max);
    } else if (param.type === 'currency') {
      return this.validateCurrency(value, param.min, param.max);
    } else if (param.type === 'number') {
      return this.validateNumber(value, param.min || 0, param.max || 100);
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

  private validateCurrency(value: number, min?: number, max?: number): ConfigValidation {
    if (isNaN(value)) {
      return { isValid: false, error: 'Value must be a number' };
    }
    if (min !== undefined && value < min) {
      return { isValid: false, error: `Value must be at least $${min.toLocaleString()}` };
    }
    if (max !== undefined && value > max) {
      return { isValid: false, error: `Value must be at most $${max.toLocaleString()}` };
    }
    return { isValid: true };
  }

  private validateNumber(value: number, min: number, max: number): ConfigValidation {
    if (isNaN(value)) {
      return { isValid: false, error: 'Value must be a number' };
    }
    if (value < min) {
      return { isValid: false, error: `Value must be at least ${min}` };
    }
    if (value > max) {
      return { isValid: false, error: `Value must be at most ${max}` };
    }
    return { isValid: true };
  }
} 