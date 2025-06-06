// User-configurable calculation parameters
export interface CalculationInputs {
  // Purchase Parameters
  purchasePrice: number;
  closingCosts: number;
  rehabCosts: number;
  afterRepairValue: number;
  
  // Loan Parameters
  downPaymentPercentage: number;
  interestRate: number;
  loanTerm: number;
  
  // Operating Expenses
  propertyTaxes: number;  // Annual property taxes
  insuranceRate: number;
  maintenanceRate: number;
  vacancyRate: number;
  managementRate: number;
  hoaFees: number;  // Monthly HOA fees
  
  // Income Parameters
  rentEstimate: number;  // Monthly rent estimate
  otherIncome: number;   // Additional monthly income
}

import { PropertyData } from './propertyData';
import { DEFAULT_CONFIG_VALUES } from '@/constants/userParams';

// Create initial calculation inputs from extracted property data
export function createInitialInputs(propertyData: PropertyData): CalculationInputs {
  return {
    // Listing-specific values
    purchasePrice: propertyData.price || 0,
    rentEstimate: propertyData.rentZestimate || 0,
    propertyTaxes: propertyData.monthlyPropertyTaxes || 0,
    hoaFees: propertyData.hoaFees || 0,
    // Use defaults from DEFAULT_CONFIG_VALUES for other values
    closingCosts: DEFAULT_CONFIG_VALUES.closingCosts,
    rehabCosts: DEFAULT_CONFIG_VALUES.rehabCosts,
    afterRepairValue: propertyData.price || 0, 
    downPaymentPercentage: DEFAULT_CONFIG_VALUES.downPaymentPercentage,
    interestRate: DEFAULT_CONFIG_VALUES.interestRate,
    loanTerm: DEFAULT_CONFIG_VALUES.loanTerm,
    managementRate: DEFAULT_CONFIG_VALUES.managementRate,
    maintenanceRate: DEFAULT_CONFIG_VALUES.maintenanceRate,
    insuranceRate: DEFAULT_CONFIG_VALUES.insuranceRate,
    vacancyRate: DEFAULT_CONFIG_VALUES.vacancyRate,
    otherIncome: DEFAULT_CONFIG_VALUES.otherIncome
  };
} 