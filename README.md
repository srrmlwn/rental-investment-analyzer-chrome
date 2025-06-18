# DealWise Chrome Extension

A Chrome extension that provides smart rental deal analysis for Zillow properties, offering real-time cash flow analysis, cap rates, and other investment metrics to help you make informed investment decisions.

## Features

- **Smart Deal Analysis**: Instantly analyze any Zillow property listing for investment potential
- **Investment Metrics**: Calculate cash flow, cap rate, cash-on-cash return, and more
- **Customizable Parameters**: Adjust down payment, interest rates, maintenance costs, etc.
- **Property Data Extraction**: Automatically extracts property details from Zillow
- **Investment Dashboard**: Clean, professional interface for deal analysis

## Installation (Without Chrome Web Store)

### Method 1: Manual Installation (Recommended)

1. **Download the Extension**:
   - Download the ZIP file from the releases or clone this repository
   - Extract the ZIP file to a folder on your computer

2. **Enable Developer Mode**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Toggle on "Developer mode" in the top right corner

3. **Load the Extension**:
   - Click "Load unpacked" button
   - Select the folder containing the extension files
   - The extension should now appear in your extensions list

4. **Verify Installation**:
   - Navigate to any Zillow property listing
   - You should see the "DealWise" panel on the right side

### Method 2: Using the Installer Script (macOS/Linux)

1. **Download and Run**:
   ```bash
   # Make the installer executable
   chmod +x install.sh
   
   # Run the installer
   ./install.sh
   ```

2. **Follow the Prompts**:
   - The script will guide you through the installation process
   - Follow the on-screen instructions to complete setup

### Method 3: From Source Code

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/dealwise-chrome.git
   cd dealwise-chrome
   ```

2. **Install Dependencies** (if building from source):
   ```bash
   npm install
   npm run build
   ```

3. **Load in Chrome**:
   - Follow Method 1 steps 2-4 above

## Usage

1. **Navigate to Zillow**: Go to any property listing on Zillow.com
2. **Open the Extension**: The investment analysis panel will appear on the right side
3. **Review Metrics**: See key investment metrics like:
   - Monthly Cash Flow
   - Cap Rate
   - Cash-on-Cash Return
   - Total Cash Needed
4. **Customize Parameters**: Click "Advanced Settings" to adjust:
   - Down payment percentage
   - Interest rates
   - Maintenance costs
   - Insurance costs
   - Property management fees
5. **Analyze**: The metrics will update in real-time as you adjust parameters

## Key Metrics Explained

- **Monthly Cash Flow**: Net income after all expenses
- **Cap Rate**: Net Operating Income / Property Value
- **Cash-on-Cash Return**: Annual Cash Flow / Total Investment
- **Total Cash Needed**: Down payment + closing costs + rehab costs

## Troubleshooting

### Extension Not Loading
- Ensure Developer mode is enabled in Chrome extensions
- Try refreshing the Zillow page
- Check that all extension files are present in the folder

### No Data Appearing
- Make sure you're on a valid Zillow property listing page
- Refresh the page and try again
- Check the browser console for any error messages

### Extension Disappears After Restart
- This is normal for unpacked extensions
- You'll need to reload the extension after Chrome updates or restarts
- Consider using the installer script for easier reinstallation

## Development

### Building from Source
```bash
# Install dependencies
npm install

# Build the extension
npm run build

# Watch for changes (development)
npm run dev
```

### Project Structure
```
src/
├── components/          # React components
├── services/           # Business logic
├── types/             # TypeScript definitions
└── constants/         # Configuration
```

## Security Note

⚠️ **Important**: This extension runs in developer mode, which means:
- Chrome may show security warnings
- The extension needs to be reloaded after Chrome updates
- Users should only install extensions from trusted sources

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Create an issue in the GitHub repository

## License

[Your License Here]

---

**Note**: This extension is not published on the Chrome Web Store and is intended for personal use or sharing with trusted individuals. 