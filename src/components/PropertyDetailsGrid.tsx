import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

interface PropertyDetailsGridProps {
  price: number;
  squareFeet: number;
  rentZestimate: number | null;
  pricePerSqFt: number;
  isLoading?: boolean;
  error?: string | null;
}

export const PropertyDetailsGrid: React.FC<PropertyDetailsGridProps> = ({
  price,
  squareFeet,
  rentZestimate,
  pricePerSqFt,
  isLoading = false,
  error = null,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Details</CardTitle>
        </CardHeader>
        <CardContent>{error}</CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      title: 'Price per Sq Ft',
      value: formatCurrency(pricePerSqFt),
      description: 'Based on total square footage',
    },
    {
      title: 'Monthly Rent',
      value: rentZestimate ? formatCurrency(rentZestimate) : 'N/A',
      description: 'Estimated monthly rental income',
    },
    {
      title: 'Annual Rent',
      value: rentZestimate ? formatCurrency(rentZestimate * 12) : 'N/A',
      description: 'Estimated annual rental income',
    },
    {
      title: 'Gross Rent Multiplier',
      value: rentZestimate ? (price / (rentZestimate * 12)).toFixed(2) : 'N/A',
      description: 'Price to annual rent ratio',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-sm text-gray-500 mt-1">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 