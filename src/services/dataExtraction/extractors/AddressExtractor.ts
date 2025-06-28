import { PropertyDataExtractor } from '../base/PropertyDataExtractor';
import { ADDRESS_SELECTORS } from '../../../constants/selectors';
import { ZillowPropertyJson } from '../../../types/zillowPropertyJson';

export class AddressExtractor extends PropertyDataExtractor<string> {
  async extract(property: ZillowPropertyJson | null): Promise<string | null> {
    // Try to extract from JSON data first
    if (property) {
      const jsonAddress = this.extractFromJson(property);
      if (jsonAddress) {
        return jsonAddress;
      }
    }

    // Try to extract from DOM elements
    const domAddress = await this.extractFromDOM();
    if (domAddress) {
      return domAddress;
    }

    return null;
  }

  getFallbackValue(): string {
    return 'N/A';
  }

  extractFromJson(property: ZillowPropertyJson): string | null {
    try {
      if (property?.address) {
        const address = property.address;
        const parts = [];
        
        if (address.streetAddress) parts.push(address.streetAddress);
        if (address.city) parts.push(address.city);
        if (address.state) parts.push(address.state);
        if (address.zipcode) parts.push(address.zipcode);
        
        return parts.length > 0 ? parts.join(', ') : null;
      }
      return null;
    } catch (error) {
      console.log('🔍 Error extracting address from JSON:', error);
      return null;
    }
  }

  async extractFromDOM(): Promise<string | null> {
    try {
      for (const selector of ADDRESS_SELECTORS) {
        const element = document.querySelector(selector);
        if (element) {
          const text = element.textContent?.trim();
          if (text && text.length > 0) {
            return text;
          }
        }
      }
      return null;
    } catch (error) {
      console.log('🔍 Error extracting address from DOM:', error);
      return null;
    }
  }
} 