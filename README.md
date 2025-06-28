# DealWise - Rental Investment Analyzer

A Chrome extension that provides real-time investment analysis for rental properties on Zillow. Transform your Zillow browsing into smart investment analysis with instant financial insights.

## 🚀 Features

- **Real-time Analysis**: Get instant cash flow, cap rate, and ROI calculations
- **Smart Data Extraction**: Automatically pulls property details from Zillow listings
- **Customizable Parameters**: Adjust mortgage rates, down payments, and more
- **Professional Interface**: Clean, intuitive sidebar with DealWise branding
- **Local Processing**: All calculations happen locally - your data stays private

## 📦 Installation

### From Chrome Web Store (Recommended)
1. Visit the Chrome Web Store
2. Search for "DealWise - Rental Investment Analyzer"
3. Click "Add to Chrome"
4. Navigate to any Zillow property listing to start analyzing

### Manual Installation (Development)
1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the extension
4. Load the `dist` folder as an unpacked extension in Chrome

## 🎯 How to Use

1. **Navigate to Zillow**: Go to any Zillow property listing
2. **Activate DealWise**: Click the floating green button in the bottom-right corner
3. **View Analysis**: See instant investment metrics in the sidebar
4. **Customize Parameters**: Adjust investment criteria to match your strategy
5. **Make Decisions**: Use the metrics to evaluate investment potential

## 📊 Investment Metrics

- **Monthly Cash Flow**: Primary metric with color coding (green/red)
- **Cap Rate**: Property return independent of financing
- **Cash-on-Cash Return**: Return on actual cash invested
- **Total Cash Needed**: Complete investment requirement

## 🛠️ Development

### Prerequisites
- Node.js 16+
- npm or yarn
- Chrome browser

### Setup
```bash
# Clone the repository
git clone https://github.com/your-username/rental-investment-analyzer-chrome.git
cd rental-investment-analyzer-chrome

# Install dependencies
npm install

# Build the extension
npm run build

# Development mode with watch
npm run dev

# Run tests
npm test
```

### Project Structure
```
src/
├── components/          # React components
│   ├── sidebar/        # Sidebar and floating button
│   ├── investment/     # Investment analysis components
│   └── ui/            # Shared UI components
├── services/           # Business logic
│   ├── calculator.ts   # Investment calculations
│   └── dataExtraction/ # Property data extraction
├── types/             # TypeScript definitions
├── constants/         # Configuration
└── utils/            # Helper functions
```

### Key Technologies
- **React 18+** with TypeScript
- **Tailwind CSS** for styling
- **Chrome Extension Manifest V3**
- **Webpack 5** for building

## 📚 Documentation

- [Technical Architecture](docs/architecture/tech-architecture.md)
- [Product Specifications](docs/specs/product-specs.md)
- [Task Breakdown](docs/tasks/task-breakdown.md)
- [Chrome Web Store Description](docs/chrome-webstore-description.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: dealwise.contact@gmail.com
- **Issues**: [GitHub Issues](https://github.com/your-username/rental-investment-analyzer-chrome/issues)
- **Documentation**: See the `docs/` folder for comprehensive guides

## 🙏 Acknowledgments

- Built for real estate investors by real estate investors
- Special thanks to the Chrome Extension development community
- Inspired by the need for better investment analysis tools

---

**DealWise** - Making real estate investment analysis simple and accessible.

*Last Updated: December 2024* 