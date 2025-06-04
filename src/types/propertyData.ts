// Raw data from Zillow listing
export interface PropertyData {
  price: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  squareFeet: number;
  zipCode: string;
  rentZestimate?: number;
  propertyTaxes?: number;
  hoaFees?: number;
} 