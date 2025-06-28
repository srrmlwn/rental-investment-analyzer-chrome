# DealWise Technical Architecture

## Overview

DealWise is a Chrome extension built with React and TypeScript that provides real-time rental investment analysis on Zillow property listings. The extension extracts property data, calculates financial metrics, and provides a customizable interface for real estate investors.

## Technology Stack

### Frontend
- **React 18+**: Component-based UI architecture
- **TypeScript 5+**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Component library for consistent design

### Build Tools
- **Webpack 5**: Module bundling and optimization
- **Babel**: JavaScript transpilation
- **PostCSS**: CSS processing and optimization

### Chrome Extension
- **Manifest V3**: Latest Chrome extension manifest
- **Content Scripts**: Page injection and DOM manipulation
- **Background Scripts**: Extension lifecycle management
- **Chrome Storage API**: Data persistence

## Architecture Components

### 1. Content Script (`src/content/content.tsx`)
The main entry point that injects the React application into Zillow pages.

**Key Features:**
- React app injection with container management
- URL change detection and navigation handling
- Modal context awareness
- State management for sidebar visibility

**State Management:**
```typescript
let sharedState = {
  isSidebarOpen: boolean,
  setSidebarOpen: (isOpen: boolean) => void
};
```

### 2. Sidebar Component (`src/components/sidebar/sidebar.tsx`)
The main investment analysis interface displayed as a resizable sidebar.

**Features:**
- Resizable width (400px - 90vw)
- Drag handle for manual resizing
- Responsive design for different screen sizes
- Investment analysis panel integration

### 3. Floating Button (`src/components/sidebar/floating-button.tsx`)
Quick access button that appears when sidebar is closed.

**Features:**
- Animated pulsing effect
- Hover animations and scale effects
- DealWise icon integration
- Modal-aware positioning

### 4. Investment Analysis Panel (`src/components/investment-analysis-panel.tsx`)
Core analysis interface displaying property metrics and calculations.

**Components:**
- Property data display
- Investment metrics (cash flow, cap rate, cash-on-cash return)
- Configuration panel for user parameters
- Real-time calculation updates

### 5. Configuration Panel (`src/components/investment/config-panel.tsx`)
User-configurable parameters for investment analysis.

**Parameters:**
- Purchase price and down payment
- Loan terms (interest rate, loan term)
- Operating expenses (management, maintenance, insurance)
- Rental income adjustments

## Data Flow

### 1. Property Data Extraction
```
Zillow Page → PropertyDataExtractor → PropertyData Interface
```

**Extractors:**
- `PriceExtractor`: Purchase price from listing
- `BedBathExtractor`: Bedroom and bathroom count
- `PropertyTaxExtractor`: Annual property taxes
- `HoaFeesExtractor`: HOA fees if applicable
- `RentZestimateExtractor`: Rental estimates from Zillow
- `ZipCodeExtractor`: Property location data

### 2. Investment Calculations
```
PropertyData + UserParameters → Calculator Service → CalculatedMetrics
```

**Key Metrics:**
- Monthly Cash Flow
- Cap Rate
- Cash-on-Cash Return
- Total Cash Needed

### 3. State Management
```
User Input → ConfigManager → Chrome Storage → UI Updates
```

## UI/UX Architecture

### Design System
- **Color Scheme**: DealWise green (#47A779) with supporting colors
- **Typography**: System fonts with consistent sizing
- **Spacing**: Tailwind CSS utility classes
- **Animations**: Smooth transitions and hover effects

### Responsive Design
- **Desktop**: Full sidebar with resizing capabilities
- **Tablet**: Adaptive sidebar width
- **Mobile**: Full-width sidebar with touch-friendly controls

### Accessibility
- **Keyboard Navigation**: Tab order and focus management
- **Screen Readers**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG compliant color combinations
- **Touch Targets**: Minimum 44px touch targets

## Chrome Extension Specifics

### Manifest V3 Configuration
```json
{
  "manifest_version": 3,
  "permissions": ["storage", "activeTab"],
  "content_scripts": [{
    "matches": ["*://*.zillow.com/*"],
    "js": ["content.js"],
    "css": ["styles.css"]
  }]
}
```

### Content Script Injection
- **Target Pages**: Zillow property listings
- **Injection Method**: DOM manipulation with React root
- **Cleanup**: Proper unmounting and container removal
- **Navigation**: URL change detection and reinjection

### Storage Management
- **Chrome Storage**: User preferences and configuration
- **Data Persistence**: Automatic saving of user parameters
- **Real-time Updates**: Instant recalculation on parameter changes

## Performance Considerations

### Bundle Optimization
- **Code Splitting**: Lazy loading of components
- **Tree Shaking**: Unused code elimination
- **Minification**: Production build optimization
- **Asset Optimization**: Image and icon compression

### Runtime Performance
- **Debounced Updates**: Prevent excessive recalculations
- **Memoization**: React.memo for expensive components
- **Efficient Rendering**: Minimal re-renders
- **Memory Management**: Proper cleanup and garbage collection

## Testing Strategy

### Unit Testing
- **Jest**: Test framework with jsdom environment
- **Component Testing**: Individual component behavior
- **Service Testing**: Business logic validation
- **Utility Testing**: Helper function coverage

### Integration Testing
- **Data Extraction**: End-to-end property data extraction
- **Calculation Accuracy**: Financial metric validation
- **User Interactions**: Complete user workflow testing
- **Chrome API**: Extension-specific functionality

## Security Considerations

### Content Security Policy
- **No eval()**: Safe JavaScript execution
- **Resource Restrictions**: Limited external resource access
- **Data Privacy**: Local processing only
- **Permission Minimization**: Minimal required permissions

### Data Handling
- **Local Storage**: No external data transmission
- **Input Validation**: Sanitized user inputs
- **Error Boundaries**: Graceful error handling
- **Secure Communication**: Safe message passing

## Future Architecture Considerations

### Scalability
- **Component Modularity**: Easy feature additions
- **Service Layer**: Extensible business logic
- **Plugin Architecture**: Potential for extensions
- **API Integration**: Future external service support

### Maintainability
- **Type Safety**: Comprehensive TypeScript coverage
- **Documentation**: Inline code documentation
- **Code Standards**: Consistent formatting and patterns
- **Version Control**: Semantic versioning and changelog

---

*Last Updated: December 2024*
*Architecture Version: 1.0* 