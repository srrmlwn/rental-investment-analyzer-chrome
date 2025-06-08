// Raw data from Zillow listing
export interface PropertyData {
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  zipCode?: string;
  rentZestimate?: number;
  monthlyPropertyTaxes?: number;  // Monthly property taxes
  propertyTaxRate?: number;  // Property tax rate as a percentage
  hoaFees?: number;
  units?: number;  // Number of units for multi-family properties
} 