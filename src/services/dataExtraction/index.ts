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

export class DataExtractionService {
    private propertyJsonExtractor: PropertyJsonExtractor;

    private extractors: {
        price: PriceExtractor;
        propertyTax: PropertyTaxExtractor;
        bedBath: BedBathExtractor;
        propertyType: PropertyTypeExtractor;
        zipCode: ZipCodeExtractor;
        rentZestimate: RentZestimateExtractor;
        hoaFees: HoaFeesExtractor;
        units: UnitsExtractor;
    };

    constructor() {
        this.propertyJsonExtractor = new PropertyJsonExtractor();
        this.extractors = {
            price: new PriceExtractor(),
            propertyTax: new PropertyTaxExtractor(),
            bedBath: new BedBathExtractor(),
            propertyType: new PropertyTypeExtractor(),
            zipCode: new ZipCodeExtractor(),
            rentZestimate: new RentZestimateExtractor(),
            hoaFees: new HoaFeesExtractor(),
            units: new UnitsExtractor()
        };
    }

    async extractPropertyData(): Promise<PropertyData> {
        console.log('Starting property data extraction...');

        try {
            // Extract property JSON once
            const property = await this.propertyJsonExtractor.getPropertyJson();
            
            // Extract all data in parallel using the same property JSON
            const [
                price,
                propertyTax,
                bedBath,
                propertyType,
                zipCode,
                rentZestimate,
                hoaFees,
                units
            ] = await Promise.all([
                this.extractors.price.extract(property),
                this.extractors.propertyTax.extract(property),
                this.extractors.bedBath.extract(property),
                this.extractors.propertyType.extract(property),
                this.extractors.zipCode.extract(property),
                this.extractors.rentZestimate.extract(property),
                this.extractors.hoaFees.extract(property),
                this.extractors.units.extract(property)
            ]);

            const propertyData: PropertyData = {
                price: price ?? undefined,
                propertyTaxRate: propertyTax?.rate ?? undefined,
                monthlyPropertyTaxes: propertyTax?.monthlyAmount ?? undefined,
                bedrooms: bedBath?.bedrooms ?? undefined,
                bathrooms: bedBath?.bathrooms ?? undefined,
                propertyType: propertyType ?? undefined,
                zipCode: zipCode ?? undefined,
                rentZestimate: rentZestimate ?? undefined,
                hoaFees: hoaFees ?? undefined,
                units: units ?? undefined
            };

            console.log('About to extract rent from HUD data', propertyData.zipCode, propertyData.bedrooms);
            if (propertyData.zipCode && propertyData.bedrooms) {
                let rentalData = await hudDataService.getRentalData(propertyData.zipCode, propertyData.bedrooms) as HUDRentalData | null;
                propertyData.hudRentEstimate = rentalData?.rent;
            }

            console.log('Property data extraction completed successfully');
            return propertyData;

        } catch (error) {
            console.error('Error extracting property data:', error);
            throw error;
        }
    }
}

export default DataExtractionService; 