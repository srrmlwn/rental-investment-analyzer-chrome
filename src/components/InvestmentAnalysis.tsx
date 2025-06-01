import React from 'react';
import { PropertyDataDisplay } from './PropertyDataDisplay';
import { InvestmentCalculator, InvestmentCalculations } from './InvestmentCalculator';

export const InvestmentAnalysis: React.FC = () => {
  const [propertyData, setPropertyData] = React.useState<{
    price: number;
    rentZestimate: number | null;
  } | null>(null);

  const handlePropertyDataUpdate = (data: { price: number; rentZestimate: number | null }) => {
    setPropertyData(data);
  };

  const handleCalculationsUpdate = (calculations: InvestmentCalculations) => {
    // Here you could implement additional features like:
    // - Saving calculations to Chrome storage
    // - Sending data to a backend
    // - Updating other components
    console.log('Investment calculations updated:', calculations);
  };

  return (
    <div className="space-y-6">
      <PropertyDataDisplay onDataUpdate={handlePropertyDataUpdate} />
      {propertyData && (
        <InvestmentCalculator
          propertyPrice={propertyData.price}
          rentZestimate={propertyData.rentZestimate}
          onCalculationsUpdate={handleCalculationsUpdate}
        />
      )}
    </div>
  );
}; 