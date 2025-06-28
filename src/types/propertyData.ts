// Raw data from Zillow listing
export interface PropertyData {
  price: number;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  units?: number;
  zipCode?: string;
  rentZestimate?: number;
  hudRentEstimate?: number;
  monthlyPropertyTaxes?: number;  // Monthly property taxes
  propertyTaxRate?: number;  // Property tax rate as a percentage
  hoaFees?: number;
  // New fields for export functionality
  address?: string;
  url?: string;
}

export interface HUDRentalData {
    rent: number;
    areaName: string;
    areaCode: string;
    source: string;
    lastUpdated: string;
} 