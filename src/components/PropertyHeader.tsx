import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface PropertyHeaderProps {
  price: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  squareFeet: number;
  rentZestimate?: number | null;
  isLoading?: boolean;
  error?: string | null;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  price,
  bedrooms,
  bathrooms,
  propertyType,
  squareFeet,
  rentZestimate,
  isLoading = false,
  error = null,
}) => {
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Property Data</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">
              {formatCurrency(price)}
            </CardTitle>
            <CardDescription className="mt-1">
              {propertyType} • {formatNumber(squareFeet)} sqft
            </CardDescription>
          </div>
          {rentZestimate && (
            <Badge variant="secondary" className="text-sm">
              Rent Zestimate: {formatCurrency(rentZestimate)}/mo
            </Badge>
          )}
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{bedrooms}</span>
            <span className="text-sm text-gray-500">beds</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{bathrooms}</span>
            <span className="text-sm text-gray-500">baths</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{formatNumber(squareFeet)}</span>
            <span className="text-sm text-gray-500">sqft</span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}; 