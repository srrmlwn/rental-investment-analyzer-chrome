# Rental Investment Analyzer Chrome Extension

A Chrome extension that helps real estate investors analyze rental properties on Zillow by providing key investment metrics and rental estimates.

## Features

- Extracts property data from Zillow listings
- Calculates potential rental income using HUD data
- Analyzes cash flow based on user-configurable parameters
- Provides investment metrics like cap rate and cash-on-cash return
- Works offline with bundled HUD rental data

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/rental-investment-analyzer-chrome.git
   cd rental-investment-analyzer-chrome
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory from this project

## Development

- `npm run dev` - Start development mode with watch
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
rental-investment-analyzer/
├── src/                    # Source code
│   ├── manifest.json      # Chrome extension manifest
│   ├── content/           # Content scripts
│   ├── background/        # Background scripts
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── constants/         # Constants and configs
├── public/                # Static assets
├── tests/                 # Test files
└── dist/                  # Built extension
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 