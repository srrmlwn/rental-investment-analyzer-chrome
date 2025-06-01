# Component Injection and Modal Handling

## Overview
The Rental Investment Analyzer injects an investment analysis card into Zillow listing pages, specifically targeting the property details section. The component can appear in both the main listing page and modal contexts.

## Injection Strategy

### Target Location
The investment analysis card is injected:
1. After the property details section
2. Before the "what's special" section
3. Within the `.layout-content-container` element

### Modal Context Detection
The extension uses multiple selectors to detect modal contexts:
```javascript
const modalSelectors = [
    '.ds-modal-content',
    '.ds-modal-container',
    '[data-testid="modal-content"]',
    '.modal-container',
    '.modal-content',
    '[data-testid="modal"]'
];
```

### Property Details Detection
The extension searches for property details using a hierarchical approach:
1. First within modal context (if present)
2. Then in main content
3. Finally using fallback selectors

Key selectors for property details:
```javascript
const propertyDetailsSelectors = [
    '[data-testid="home-details-summary"]',
    '.ds-home-details-chip',
    '.ds-bed-bath-living-area-container',
    '.ds-home-details-chip-container',
    '.ds-home-details-chip-wrapper',
    '[data-testid="home-details"]',
    '.ds-home-details',
    '.ds-home-details-container',
    '.ds-home-details-wrapper'
];
```

## Implementation Details

### Observer Pattern
The extension uses MutationObserver to detect DOM changes and ensure proper injection:
```javascript
this.observer = new MutationObserver((mutations) => {
    // Debounced check for property details
    // Inject card if needed
});
```

### Injection Process
1. Check if card already exists
2. Find property details section
3. Create card element
4. Insert after property details
5. Add event listeners
6. Load property data

### Error Handling
- Logs detailed information about DOM structure
- Provides fallback selectors
- Handles missing elements gracefully
- Maintains state across modal transitions

## Debugging

### Common Issues
1. Modal not detected
   - Check modal selectors
   - Verify modal structure
   - Check console logs

2. Property details not found
   - Verify selectors
   - Check DOM structure
   - Review console logs

3. Card injection fails
   - Check for existing card
   - Verify parent element
   - Review mutation observer

### Debug Tools
- Console logs with `[RIA]` prefix
- DOM structure logging
- Selector testing
- Modal detection logging

## Best Practices

### DOM Manipulation
- Use efficient selectors
- Minimize DOM operations
- Clean up observers
- Handle edge cases

### Performance
- Debounce observer callbacks
- Cache DOM queries
- Clean up event listeners
- Optimize selectors

### User Experience
- Smooth transitions
- Proper error messages
- Consistent positioning
- Responsive design

## Future Improvements
1. Enhanced modal detection
2. Better fallback strategies
3. Improved error handling
4. Performance optimizations
5. Additional injection contexts 