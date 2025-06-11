#!/bin/bash

echo "Rental Investment Analyzer Extension Installer"
echo "=============================================="

# Check if Chrome is installed
if ! command -v google-chrome &> /dev/null && ! command -v chromium-browser &> /dev/null; then
    echo "Error: Chrome browser not found. Please install Chrome first."
    exit 1
fi

# Create extension directory
EXTENSION_DIR="$HOME/.config/google-chrome/Default/Extensions/rental-investment-analyzer"
mkdir -p "$EXTENSION_DIR"

# Copy extension files
echo "Installing extension files..."
cp -r . "$EXTENSION_DIR/"

echo "Installation complete!"
echo ""
echo "To enable the extension:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' in the top right"
echo "3. Click 'Load unpacked' and select: $EXTENSION_DIR"
echo "4. The extension should now be active!"
echo ""
echo "Note: You may need to refresh Zillow pages for the extension to work." 