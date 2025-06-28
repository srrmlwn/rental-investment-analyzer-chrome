import { PriceExtractor } from './extractors/PriceExtractor';
import { PropertyTaxExtractor } from './extractors/PropertyTaxExtractor';
import { BedBathExtractor } from './extractors/BedBathExtractor';
import { PropertyTypeExtractor } from './extractors/PropertyTypeExtractor';
import { ZipCodeExtractor } from './extractors/ZipCodeExtractor';
import { RentZestimateExtractor } from './extractors/RentZestimateExtractor';
import { HoaFeesExtractor } from './extractors/HoaFeesExtractor';
import { UnitsExtractor } from './extractors/UnitsExtractor';
import { PropertyData, HUDRentalData } from '@/types/propertyData';
import { PropertyJsonExtractor } from './PropertyJsonExtractor';
import hudDataService from "@/services/hudDataService";
import { AddressExtractor } from './extractors/AddressExtractor';

export class DataExtractionService {
    private propertyJsonExtractor: PropertyJsonExtractor;
    private priceExtractor: PriceExtractor;
    private bedBathExtractor: BedBathExtractor;
    private propertyTypeExtractor: PropertyTypeExtractor;
    private rentZestimateExtractor: RentZestimateExtractor;
    private propertyTaxExtractor: PropertyTaxExtractor;
    private hoaFeesExtractor: HoaFeesExtractor;
    private zipCodeExtractor: ZipCodeExtractor;
    private unitsExtractor: UnitsExtractor;
    private addressExtractor: AddressExtractor;

    constructor() {
        this.propertyJsonExtractor = new PropertyJsonExtractor();
        this.priceExtractor = new PriceExtractor();
        this.bedBathExtractor = new BedBathExtractor();
        this.propertyTypeExtractor = new PropertyTypeExtractor();
        this.rentZestimateExtractor = new RentZestimateExtractor();
        this.propertyTaxExtractor = new PropertyTaxExtractor();
        this.hoaFeesExtractor = new HoaFeesExtractor();
        this.zipCodeExtractor = new ZipCodeExtractor();
        this.unitsExtractor = new UnitsExtractor();
        this.addressExtractor = new AddressExtractor();
    }

    async extractPropertyData(): Promise<PropertyData> {
        console.log('Starting property data extraction...');

        try {
            // Extract JSON data first
            const propertyJson = await this.propertyJsonExtractor.getPropertyJson();
            
            // Extract all property data
            const [
                price,
                bedBath,
                propertyType,
                rentZestimate,
                propertyTax,
                hoaFees,
                zipCode,
                units,
                address
            ] = await Promise.all([
                this.priceExtractor.extract(propertyJson),
                this.bedBathExtractor.extract(propertyJson),
                this.propertyTypeExtractor.extract(propertyJson),
                this.rentZestimateExtractor.extract(propertyJson),
                this.propertyTaxExtractor.extract(propertyJson),
                this.hoaFeesExtractor.extract(propertyJson),
                this.zipCodeExtractor.extract(propertyJson),
                this.unitsExtractor.extract(propertyJson),
                this.addressExtractor.extract(propertyJson)
            ]);

            // Get HUD rental estimate if Zestimate is not available
            let hudRentEstimate: number | undefined;
            if (!rentZestimate && zipCode && bedBath?.bedrooms) {
                hudRentEstimate = await this.getHudRentalEstimate(zipCode, bedBath.bedrooms);
            }

            // Get current URL
            const url = window.location.href;

            const propertyData: PropertyData = {
                price: price || 0,
                propertyType: propertyType || 'Single Family',
                bedrooms: bedBath?.bedrooms || undefined,
                bathrooms: bedBath?.bathrooms || undefined,
                units: units || undefined,
                zipCode: zipCode || undefined,
                rentZestimate: rentZestimate || undefined,
                hudRentEstimate: hudRentEstimate,
                propertyTaxRate: propertyTax?.rate || undefined,
                hoaFees: hoaFees || undefined,
                address: address || undefined,
                url: url
            };

            console.log('About to extract rent from HUD data', propertyData.zipCode, propertyData.bedrooms);
            if (propertyData.zipCode && propertyData.bedrooms) {
                let rentalData = await hudDataService.getRentalData(propertyData.zipCode, propertyData.bedrooms) as HUDRentalData | null;
                propertyData.hudRentEstimate = rentalData?.rent;
            }

            console.log('Property data extraction completed successfully');
            return propertyData;

        } catch (error) {
            console.error('❌ Error extracting property data:', error);
            throw new Error('Failed to extract property data');
        }
    }

    private async getHudRentalEstimate(zipCode: string, bedrooms: number): Promise<number | undefined> {
        // Implementation of getHudRentalEstimate method
        // This is a placeholder and should be implemented based on your specific requirements
        return undefined;
    }
}

export default DataExtractionService; 