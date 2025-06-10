# Rental Investment Analyzer Chrome Extension

## Project Overview

The **Rental Investment Analyzer** is a Chrome extension (Manifest V3) that provides real-time investment analysis for rental properties on Zillow. It extracts property data and calculates key financial metrics with customizable parameters to help real estate investors make informed decisions.

## Tech Stack & Dependencies

- **Frontend**: React 18+ with TypeScript 5+
- **Styling**: Tailwind CSS + Shadcn UI components
- **Build Tools**: Webpack 5, Babel, PostCSS
- **Testing**: Jest 29+ with jsdom, ts-jest
- **Browser**: Chrome 88+ (Manifest V3)
- **Icons**: Lucide React icons

## Code Style & Naming Conventions

### File Naming
- **Components**: `kebab-case.tsx` → `investment-analysis-panel.tsx`
- **Services**: `camelCase.ts` → `dataExtraction.ts`
- **Types**: `camelCase.ts` → `propertyData.ts`
- **Tests**: `*.test.ts` for unit tests

### Code Naming
- **Components**: `PascalCase` → `InvestmentAnalysisPanel`
- **Functions/Variables**: `camelCase` → `calculateInvestmentMetrics`
- **Constants**: `SCREAMING_SNAKE_CASE` → `DEFAULT_CONFIG_VALUES`
- **Types/Interfaces**: `PascalCase` → `PropertyData`, `CalculationInputs`

### TypeScript Patterns
- Extensive use of optional properties with `?`
- `as const` for type-safe constants
- Generic abstract base classes for extensibility
- Proper use of `React.forwardRef` for all UI components
- Interface segregation for clear responsibilities

## Architecture Patterns

### Directory Structure
```
src/
├── components/          # React UI components
├── services/           # Business logic & integrations
├── types/             # TypeScript interfaces
├── hooks/             # Custom React hooks  
├── utils/             # Pure utility functions
├── constants/         # Configuration constants
└── lib/               # Third-party configurations
```

### Service Layer Architecture
- **Abstract base classes**: `PropertyDataExtractor<T>` pattern
- **Strategy pattern**: Individual extractors per data type
- **Fallback mechanisms**: JSON extraction → DOM parsing
- **Error handling**: Consistent logging with emojis for visibility

### Component Patterns
- **Compound components**: Card system (`Card`, `CardHeader`, `CardContent`)
- **Variant-based styling**: Using `class-variance-authority` (cva)
- **Forwarded refs**: All components use `React.forwardRef`
- **Custom hooks**: `useChromeStorage` for extension storage

## Key Services & Data Flow

### Data Extraction Pipeline
1. **Zillow Page** → Extract from `__NEXT_DATA__` script tag
2. **Fallback** → DOM parsing with CSS selectors
3. **HUD Data Service** → Rental estimates when Zestimate unavailable
4. **Property Data** → Structured interface for calculations

### Configuration Management
- **UserParams class**: Manages 28+ configurable parameters
- **Config categories**: Purchase, Loan, Rental Income, Operating Expenses
- **Chrome Storage**: Persists user preferences
- **Real-time updates**: Instant recalculation on parameter changes

### Financial Calculations
- **Monthly Cash Flow**: Primary metric (color-coded green/red)
- **Cap Rate**: Property return independent of financing
- **Cash-on-Cash Return**: Return on actual cash invested
- **Annual Cash Flow**: Yearly net income

## UI/UX Patterns

### Layout & Positioning
- **Sidebar**: Fixed right position, 300px-600px width
- **Sticky metrics**: Key metrics remain visible while scrolling
- **Floating button**: Quick access when collapsed
- **Responsive design**: Adapts to different screen sizes

### Styling Conventions
- **Tailwind CSS**: Utility-first approach
- **Shadcn/ui**: Consistent component library
- **Custom scrollbars**: Branded styling
- **Color coding**: Green for positive cash flow, red for negative

## Chrome Extension Specifics

### Manifest V3 Requirements
- Service worker background script
- Content script injection
- Web accessible resources for HUD data
- Proper CSP and permissions

### Content Script Architecture
- React app injection into Zillow pages
- MutationObserver for SPA navigation
- Custom event system for cross-component communication
- Isolated execution context

## Testing Approach

### Framework & Setup
- **Jest** with jsdom environment
- **TypeScript integration** via ts-jest
- **Chrome API mocking** in `tests/setup.js`
- **HTML fixtures** for realistic testing

### Testing Patterns
- **Unit tests**: Individual service testing
- **Integration tests**: End-to-end data extraction
- **Mock strategies**: Chrome APIs, external services
- **Real data testing**: HTML fixtures from actual Zillow pages

### Test Organization
```
tests/
├── setup.js                    # Global mocks & config
├── resources/                  # HTML fixtures
└── services/                   # Service tests

src/test/
├── extractSampleData.ts        # Manual testing utility
└── services/                   # Unit tests
```

## Development Commands

### Build & Development
- `npm run build` - Production build
- `npm run dev` - Development mode with watch
- `npm test` - Run Jest tests
- `npm run lint` - ESLint (if configured)
- `npm run typecheck` - TypeScript checking

### File Structure for New Features
1. **Types first**: Define interfaces in `src/types/`
2. **Service layer**: Implement business logic in `src/services/`
3. **Components**: Create UI in `src/components/`
4. **Tests**: Add tests following existing patterns
5. **Integration**: Wire up in main components

## Error Handling Patterns

### Graceful Degradation
- Always provide fallback values
- Handle missing data gracefully  
- Log errors with context for debugging
- Continue operation even with partial failures

### Chrome Extension Error Handling
- Proper error boundaries for React components
- Chrome API error handling with retries
- Network request fallbacks
- Storage access error recovery

## Performance Considerations

### Optimization Strategies
- Strategic `useCallback` and `useMemo` usage
- Lazy component loading
- Efficient DOM updates
- Chrome storage caching

### Memory Management
- Proper cleanup in useEffect hooks
- Event listener cleanup
- Component unmounting handling
- Avoid memory leaks in content scripts

## Configuration & Constants

### Default Values
Located in `src/constants/userParams.ts`:
- Management Rate: 8%
- Maintenance Rate: 1% 
- Insurance Rate: 0.5%
- Vacancy Rate: 5%
- Other Income: $0

### Selectors & Data Extraction
- CSS selectors in `src/constants/selectors.ts`
- Modular extractor services for different data types
- Robust fallback mechanisms for data extraction

## Security & Privacy

### Data Handling
- Local processing only - no external API calls for calculations
- Minimal data storage (user preferences only)
- No sensitive data logging or storage
- Proper content security policy

### Chrome Extension Security
- Minimal permissions requested
- Secure content script injection
- Proper message passing validation
- No eval() or unsafe operations

This project follows modern React/TypeScript best practices while addressing the specific needs of a Chrome extension for real estate investment analysis. Focus on type safety, user experience, and reliable data extraction when making changes.