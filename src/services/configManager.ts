import { CalculationInputs } from '@/types/calculationInputs';
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

type ConfigChangeListener = (config: CalculationInputs) => void;

export class ConfigManager {
  private static instance: ConfigManager;
  private config: CalculationInputs;
  private listeners: Set<ConfigChangeListener>;
  private debouncedSave: () => void;
  private isSaving: boolean = false;
  private isInitialLoad: boolean = true;

  private constructor() {
    // Initialize with zeros, actual values will be set from storage or property data
    const initialConfig = {} as CalculationInputs;
    for (const param of CONFIG_PARAMETERS) {
      initialConfig[param.id] = 0;
    }
    this.config = initialConfig;
    
    this.listeners = new Set();
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
        // Preserve any listing-specific values when loading from storage
        const listingValues = {
          purchasePrice: this.config.purchasePrice,
          rentEstimate: this.config.rentEstimate,
          propertyTaxes: this.config.propertyTaxes,
          hoaFees: this.config.hoaFees
        };
        
        this.config = { 
          ...stored.userCalculationInputs,
          ...listingValues // Ensure listing values are preserved
        };
        
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

    // Validate updates using parameter getters
    for (const [key, value] of Object.entries(filteredUpdates)) {
      const param = getParameterByKey(key as keyof CalculationInputs);
      if (!param) continue;

      const min = param.getMin(this.config);
      const max = param.getMax(this.config);
      
      if (value < min || value > max) {
        throw new Error(
          `Invalid value for ${param.label}: must be between ${
            param.type === 'currency' ? '$' : ''
          }${min.toLocaleString()} and ${
            param.type === 'currency' ? '$' : ''
          }${max.toLocaleString()}`
        );
      }
    }

    // Update config with filtered updates
    this.config = { ...this.config, ...filteredUpdates };
    
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
    
    // Reset to zeros except for listing values
    const resetConfig = {} as CalculationInputs;
    for (const param of CONFIG_PARAMETERS) {
      resetConfig[param.id] = 0;
    }
    this.config = { ...resetConfig, ...listingValues };
    
    await this.saveConfig();
    this.notifyListeners();
  }

  public subscribe(listener: ConfigChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
} 