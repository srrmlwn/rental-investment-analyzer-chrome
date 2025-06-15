import { ZillowPropertyJson } from '@/types/zillowPropertyJson';

export class PropertyJsonExtractor {
    async getPropertyJson(): Promise<ZillowPropertyJson | null> {
        try {
            const scriptTag = document.querySelector('script#__NEXT_DATA__');
            if (!scriptTag?.textContent) {
                console.log('No __NEXT_DATA__ script tag found');
                return null;
            }
            
            const jsonData = JSON.parse(scriptTag.textContent);
            const gdpClientCacheString = jsonData?.props?.pageProps?.componentProps?.gdpClientCache;
            if (!gdpClientCacheString) {
                console.log('No gdpClientCache found in JSON data');
                return null;
            }
            
            const gdpClientCache = JSON.parse(gdpClientCacheString);
            // Find the property data in gdpClientCache
            for (const value of Object.values(gdpClientCache)) {
                if (value && typeof value === 'object' && 'property' in value) {
                    const property = value.property as ZillowPropertyJson;
                    console.log('Successfully extracted property JSON');
                    console.log('Property details:', JSON.stringify(property, null, 2));
                    return property;
                }
            }
            
            console.log('No property data found in gdpClientCache');
            return null;
        } catch (error) {
            console.error('Error extracting property JSON:', error);
            return null;
        }
    }
} 