import { PriceExtractor } from './extractors/PriceExtractor';
import { PropertyTaxExtractor } from './extractors/PropertyTaxExtractor';
import { BedBathExtractor } from './extractors/BedBathExtractor';
import { PropertyTypeExtractor } from './extractors/PropertyTypeExtractor';
import { SquareFeetExtractor } from './extractors/SquareFeetExtractor';
import { ZipCodeExtractor } from './extractors/ZipCodeExtractor';
import { RentZestimateExtractor } from './extractors/RentZestimateExtractor';
import { HoaFeesExtractor } from './extractors/HoaFeesExtractor';
import { PropertyData } from '@/types/propertyData';

export class DataExtractor {
    private priceExtractor: PriceExtractor;
    private propertyTaxExtractor: PropertyTaxExtractor;
    private bedBathExtractor: BedBathExtractor;
    private propertyTypeExtractor: PropertyTypeExtractor;
    private squareFeetExtractor: SquareFeetExtractor;
    private zipCodeExtractor: ZipCodeExtractor;
    private rentZestimateExtractor: RentZestimateExtractor;
    private hoaFeesExtractor: HoaFeesExtractor;

    constructor() {
        this.priceExtractor = new PriceExtractor();
        this.propertyTaxExtractor = new PropertyTaxExtractor();
        this.bedBathExtractor = new BedBathExtractor();
        this.propertyTypeExtractor = new PropertyTypeExtractor();
        this.squareFeetExtractor = new SquareFeetExtractor();
        this.zipCodeExtractor = new ZipCodeExtractor();
        this.rentZestimateExtractor = new RentZestimateExtractor();
        this.hoaFeesExtractor = new HoaFeesExtractor();
    }

    async extractPropertyData(): Promise<PropertyData> {
        console.log('Starting property data extraction...');

        try {
            // Extract all data in parallel
            const [
                price,
                propertyTax,
                bedBath,
                propertyType,
                squareFeet,
                zipCode,
                rentZestimate,
                hoaFees
            ] = await Promise.all([
                this.priceExtractor.extract(),
                this.propertyTaxExtractor.extract(),
                this.bedBathExtractor.extract(),
                this.propertyTypeExtractor.extract(),
                this.squareFeetExtractor.extract(),
                this.zipCodeExtractor.extract(),
                this.rentZestimateExtractor.extract(),
                this.hoaFeesExtractor.extract()
            ]);

            const propertyData: PropertyData = {
                price: price ?? undefined,
                propertyTaxRate: propertyTax.rate ?? undefined,
                monthlyPropertyTaxes: propertyTax.monthlyAmount ?? undefined,
                bedrooms: bedBath.bedrooms ?? undefined,
                bathrooms: bedBath.bathrooms ?? undefined,
                propertyType: propertyType ?? undefined,
                squareFeet: squareFeet ?? undefined,
                zipCode: zipCode ?? undefined,
                rentZestimate: rentZestimate ?? undefined,
                hoaFees: hoaFees ?? undefined
            };

            console.log('Property data extraction completed successfully');
            return propertyData;

        } catch (error) {
            console.error('Error extracting property data:', error);
            throw error;
        }
    }
}

export default DataExtractor; 