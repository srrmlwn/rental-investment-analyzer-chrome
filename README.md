# Rental Investment Analyzer Chrome Extension

A Chrome extension that helps real estate investors analyze rental properties on Zillow by providing key investment metrics and rental estimates.

## Features

### Core Features (Implemented)
- 🟢 Property data extraction from Zillow listings
- 🟢 Rental income estimation with HUD data fallback
- 🟢 Cash flow analysis with configurable parameters
- 🟢 Investment metrics (cap rate, cash-on-cash return)
- 🟢 Material Design UI with responsive sidebar
- 🟢 Configuration management with Chrome storage
- 🟢 Offline operation with bundled HUD data

### Coming Soon
- 🟡 Improved UI/UX with collapsible sections
- 🟡 Enhanced error handling and loading states
- 🟡 Keyboard shortcuts and accessibility features
- 🟡 Performance optimizations
- 🟡 Unit and integration tests

## Quick Start

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
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist` directory from this project

5. Visit a Zillow property listing page to see the analyzer in action!

## Development

### Available Scripts
- `npm run dev` - Start development mode with watch
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run generate-icons` - Generate extension icons

### Project Structure
```
rental-investment-analyzer/
├── docs/                   # Documentation
│   ├── architecture/      # Technical architecture docs
│   ├── specs/            # Product specifications
│   └── tasks/            # Task breakdown and tracking
├── src/                   # Source code
│   ├── manifest.json     # Chrome extension manifest
│   ├── content/          # Content scripts
│   │   ├── content.tsx   # Main content script
│   │   └── styles.css    # Content styles
│   ├── components/       # React components
│   │   ├── investment/   # Investment analysis
│   │   │   ├── config-panel.tsx
│   │   │   └── investment-analysis-panel.tsx
│   │   ├── ui/           # Shared UI components
│   │   └── sidebar/      # Sidebar components
│   ├── services/         # Business logic
│   │   ├── calculator.ts # Investment calculations
│   │   └── dataExtractionService.ts    # Zillow data extraction
│   ├── background/       # Background scripts
│   ├── utils/            # Utility functions
│   └── constants/        # Constants and configs
├── public/               # Static assets
│   └── icons/           # Extension icons
├── tests/               # Test files
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
├── scripts/            # Build and utility scripts
└── dist/               # Built extension
```

### Key Components
1. **Data Extraction**
   - Extracts property details from Zillow listings
   - Uses HUD data for rental estimates when Zestimate is unavailable
   - Validates and processes all input data

2. **Analysis Engine**
   - Calculates monthly and annual cash flow
   - Computes key investment metrics
   - Handles all financial calculations with proper validation

3. **Configuration Management**
   - User-configurable investment parameters
   - Persistent settings via Chrome storage
   - Default values for quick analysis

4. **User Interface**
   - Material Design implementation
   - Responsive sidebar layout
   - Clear metrics display with visual indicators
   - Configuration panel for custom analysis

## Documentation
- [Technical Architecture](docs/architecture/tech-architecture.md)
- [Product Specifications](docs/specs/product-specs.md)
- [Task Breakdown](docs/tasks/task-breakdown.md)
- [Development Guide](docs/development.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Status
- Current Phase: 4 (UI Refinement)
- Completed Features: 35/85
- Next Focus: Sidebar enhancement and UX improvements 