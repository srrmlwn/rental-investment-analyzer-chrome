import React, { useEffect, useState } from 'react';
import { PropertyHeader } from './PropertyHeader';
import { PropertyDetailsGrid } from './PropertyDetailsGrid';
import { DataExtractor } from '../services/dataExtractor';
import rentalEstimator from '../services/rentalEstimator';

interface RentalEstimate {
  rent: number;
  lastUpdated: string;
  source: 'Zestimate' | 'HUD';
}

interface PropertyData {
  price: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  squareFeet: number;
  zipCode: string;
  rentZestimate: number | null;
}

interface PropertyDataDisplayProps {
  onDataUpdate?: (data: { price: number; rentZestimate: number | null }) => void;
}

export const PropertyDataDisplay: React.FC<PropertyDataDisplayProps> = ({
  onDataUpdate,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize data extractor
        const dataExtractor = new DataExtractor();

        // Extract property data
        const extractedData = await dataExtractor.extractPropertyData();
        
        // Get rental estimate using the singleton instance
        const rentalEstimate = await rentalEstimator.getRentalEstimate({
          zipCode: extractedData.zipCode,
          bedrooms: extractedData.bedrooms,
        }) as RentalEstimate;

        const newPropertyData = {
          ...extractedData,
          rentZestimate: rentalEstimate.rent,
        };

        setPropertyData(newPropertyData);
        onDataUpdate?.({
          price: newPropertyData.price,
          rentZestimate: newPropertyData.rentZestimate,
        });
      } catch (err) {
        console.error('Error fetching property data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load property data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyData();
  }, [onDataUpdate]);

  if (!propertyData && !isLoading && !error) {
    return null;
  }

  return (
    <div className="space-y-4">
      <PropertyHeader
        price={propertyData?.price ?? 0}
        bedrooms={propertyData?.bedrooms ?? 0}
        bathrooms={propertyData?.bathrooms ?? 0}
        propertyType={propertyData?.propertyType ?? ''}
        squareFeet={propertyData?.squareFeet ?? 0}
        rentZestimate={propertyData?.rentZestimate ?? null}
        isLoading={isLoading}
        error={error}
      />
      <PropertyDetailsGrid
        price={propertyData?.price ?? 0}
        squareFeet={propertyData?.squareFeet ?? 0}
        rentZestimate={propertyData?.rentZestimate ?? null}
        pricePerSqFt={propertyData ? propertyData.price / propertyData.squareFeet : 0}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}; 