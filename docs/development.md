# Development Guide

## Development Environment Setup

1. **Prerequisites**
   - Node.js (v18 or later)
   - npm (v9 or later)
   - Chrome browser (latest version)
   - Git

2. **Initial Setup**
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/rental-investment-analyzer-chrome.git
   cd rental-investment-analyzer-chrome

   # Install dependencies
   npm install

   # Build the extension
   npm run build
   ```

3. **Development Workflow**
   - Use `npm run dev` for development with watch mode
   - The extension will automatically rebuild on file changes
   - Reload the extension in Chrome to see changes
   - Use Chrome DevTools for debugging (right-click extension icon → Inspect)

## Code Organization

### Directory Structure
- `src/` - Source code
  - `content/` - Content scripts and UI
  - `background/` - Background scripts
  - `services/` - Business logic
  - `utils/` - Utility functions
  - `constants/` - Constants and configs
- `public/` - Static assets
- `tests/` - Test files
- `docs/` - Documentation
- `scripts/` - Build and utility scripts

### Key Files
- `src/manifest.json` - Extension manifest
- `src/content/content.js` - Main content script
- `src/content/sidebar.js` - Sidebar UI management
- `src/services/` - Core business logic
- `src/constants/selectors.js` - Zillow selectors

## Development Guidelines

### Code Style
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Document complex functions and components

### Testing
- Write unit tests for services and utilities
- Test UI components in isolation
- Verify extension behavior on different Zillow pages
- Test offline functionality

### Chrome Extension Best Practices
- Keep background scripts minimal
- Use message passing for communication
- Handle errors gracefully
- Respect user privacy
- Follow Chrome Web Store guidelines

### Performance Considerations
- Minimize DOM operations
- Use efficient selectors
- Cache data when appropriate
- Optimize asset loading
- Monitor memory usage

## Debugging

### Component Injection Debugging
The extension uses a comprehensive logging system for debugging component injection:

1. **Console Logging**
   - All logs are prefixed with `[RIA]` for easy filtering
   - Detailed logging of modal detection
   - DOM structure logging
   - Property details section detection
   - Component injection status

2. **Common Debug Scenarios**
   ```javascript
   // Filter RIA logs in console
   console.filter('[RIA]')
   
   // Check modal detection
   // Look for logs like:
   [RIA] Searching for property details section...
   [RIA] Modal content found: true/false
   [RIA] Layout container found in modal/main content
   ```

3. **DOM Structure Logging**
   - Container details (classes, attributes)
   - Child element hierarchy
   - Property details elements
   - Modal structure

4. **Error Handling**
   - Detailed error messages
   - Fallback strategies
   - State management
   - Cleanup procedures

### Debug Tools

1. **Chrome DevTools**
   - Console filtering with `[RIA]`
   - DOM inspection
   - Network monitoring
   - Performance profiling

2. **Extension Context**
   - Content script debugging
   - Background page inspection
   - Storage inspection
   - Event listener debugging

3. **Component Inspection**
   - Card element inspection
   - Modal context verification
   - Property details section validation
   - Observer behavior monitoring

### Common Issues and Solutions

1. **Modal Detection Issues**
   ```javascript
   // Check modal selectors
   const modalSelectors = [
       '.ds-modal-content',
       '.ds-modal-container',
       '[data-testid="modal-content"]',
       // ... other selectors
   ];
   
   // Verify modal structure
   console.log('[RIA] Modal structure:', {
       found: !!modalContent,
       classes: modalContent?.className,
       children: modalContent?.children.length
   });
   ```

2. **Property Details Issues**
   ```javascript
   // Check property details selectors
   const propertyDetailsSelectors = [
       '[data-testid="home-details-summary"]',
       '.ds-home-details-chip',
       // ... other selectors
   ];
   
   // Verify property details
   console.log('[RIA] Property details:', {
       found: !!propertyDetails,
       text: propertyDetails?.textContent,
       parent: propertyDetails?.parentElement?.className
   });
   ```

3. **Component Injection Issues**
   ```javascript
   // Check card injection
   console.log('[RIA] Card injection:', {
       exists: !!document.getElementById('ria-investment-card'),
       parent: document.getElementById('ria-investment-card')?.parentElement?.className,
       position: document.getElementById('ria-investment-card')?.nextElementSibling?.className
   });
   ```

### Performance Monitoring

1. **DOM Operations**
   - Monitor mutation observer callbacks
   - Track DOM queries
   - Measure injection time
   - Profile reflows/repaints

2. **Memory Usage**
   - Check for memory leaks
   - Monitor observer cleanup
   - Track event listener cleanup
   - Profile component lifecycle

3. **Error Tracking**
   - Monitor error frequency
   - Track fallback usage
   - Log recovery attempts
   - Measure success rate

## Deployment

### Building for Production
```bash
# Build the extension
npm run build

# Verify the build
ls dist/
```

### Chrome Web Store Submission
1. Create a ZIP file of the `dist` directory
2. Prepare store listing materials
3. Submit through Chrome Developer Dashboard
4. Wait for review

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Chrome Web Store Guidelines](https://developer.chrome.com/docs/webstore/program_policies)
- [Material Design Guidelines](https://material.io/design)
- [Chrome Extension Best Practices](https://developer.chrome.com/docs/extensions/mv3/devguide/best_practices/)
