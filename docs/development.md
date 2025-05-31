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

### Common Issues
1. **Extension not loading**
   - Check manifest.json
   - Verify build output
   - Check console for errors

2. **Data extraction failing**
   - Verify selectors
   - Check Zillow page structure
   - Monitor network requests

3. **UI not updating**
   - Check mutation observer
   - Verify event listeners
   - Inspect DOM changes

### Debug Tools
- Chrome DevTools
- Extension background page
- Content script console
- Network tab for requests
- Storage tab for Chrome storage

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
