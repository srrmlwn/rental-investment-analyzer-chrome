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
  insuranceCost: number;  // Monthly insurance cost in dollars
  maintenanceCost: number;  // Monthly maintenance cost in dollars
  vacancyRate: number;
  managementRate: number;
  hoaFees: number;  // Monthly HOA fees
  
  // Income Parameters
  rentEstimate: number;  // Monthly rent estimate
  otherIncome: number;   // Additional monthly income
}

import { PropertyData } from './propertyData';
import { DEFAULT_CONFIG_VALUES } from '@/constants/userParams';

function getRentEstimate(propertyData: PropertyData) {
  let rentPerUnit = propertyData.rentZestimate || propertyData.hudRentEstimate || 0;
  return rentPerUnit * (propertyData.units ?? 1);
}

function getPropertyTaxes(propertyData: PropertyData) {
  return (propertyData.price ?? 0) * (propertyData.propertyTaxRate ?? 0) / (12 * 100);
}

// Create initial calculation inputs from extracted property data
export function createInitialInputs(propertyData: PropertyData): CalculationInputs {
  const rentEstimate = getRentEstimate(propertyData);
  
  return {
    // Listing-specific values
    purchasePrice: propertyData.price || 0,
    rentEstimate: rentEstimate,
    propertyTaxes: getPropertyTaxes(propertyData),
    hoaFees: propertyData.hoaFees || 0,
    closingCosts: propertyData.price ? propertyData.price * 0.03 : 0,
    rehabCosts: DEFAULT_CONFIG_VALUES.rehabCosts,
    afterRepairValue: propertyData.price || 0, 
    downPaymentPercentage: DEFAULT_CONFIG_VALUES.downPaymentPercentage,
    interestRate: DEFAULT_CONFIG_VALUES.interestRate,
    loanTerm: DEFAULT_CONFIG_VALUES.loanTerm,
    managementRate: DEFAULT_CONFIG_VALUES.managementRate,
    maintenanceCost: Math.round((rentEstimate * 0.01) / 25) * 25, // Round to nearest $25
    insuranceCost: Math.round((rentEstimate * 0.005) / 25) * 25, // Round to nearest $25
    vacancyRate: DEFAULT_CONFIG_VALUES.vacancyRate,
    otherIncome: DEFAULT_CONFIG_VALUES.otherIncome
  };
} 