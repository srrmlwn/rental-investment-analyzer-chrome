#!/bin/bash

echo "Packaging DealWise Extension for Chrome Web Store"
echo "=============================================="

# Set variables
EXTENSION_NAME="dealwise-rental-investment-analyzer"
VERSION="1.0.0"
DIST_DIR="dist"
PACKAGE_NAME="${EXTENSION_NAME}-v${VERSION}"

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf "$DIST_DIR"
rm -f "${PACKAGE_NAME}.zip"

# Build the extension
echo "Building extension..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi

# Create distribution directory
mkdir -p "$DIST_DIR"

# Copy built files and necessary assets
echo "Copying built files..."
cp -r dist/* "$DIST_DIR/" 2>/dev/null || true
cp manifest.json "$DIST_DIR/"
cp -r public/* "$DIST_DIR/" 2>/dev/null || true

# Copy required documentation
echo "Copying documentation..."
cp README.md "$DIST_DIR/"
cp docs/chrome-webstore-description.md "$DIST_DIR/" 2>/dev/null || true
cp privacy-policy.html "$DIST_DIR/" 2>/dev/null || true

# Remove development files and unnecessary files
echo "Cleaning up distribution files..."
rm -rf "$DIST_DIR/node_modules" 2>/dev/null || true
rm -rf "$DIST_DIR/.git" 2>/dev/null || true
rm -f "$DIST_DIR/.DS_Store" 2>/dev/null || true
rm -f "$DIST_DIR/package-extension.sh" 2>/dev/null || true
rm -f "$DIST_DIR/install.sh" 2>/dev/null || true
rm -f "$DIST_DIR/package.json" 2>/dev/null || true
rm -f "$DIST_DIR/tsconfig.json" 2>/dev/null || true
rm -f "$DIST_DIR/webpack.config.js" 2>/dev/null || true
rm -f "$DIST_DIR/tailwind.config.js" 2>/dev/null || true
rm -f "$DIST_DIR/postcss.config.js" 2>/dev/null || true
rm -f "$DIST_DIR/babel.config.js" 2>/dev/null || true
rm -f "$DIST_DIR/jest.config.js" 2>/dev/null || true

# Remove source files (keep only built files)
echo "Removing source files..."
rm -rf "$DIST_DIR/src" 2>/dev/null || true
rm -rf "$DIST_DIR/tests" 2>/dev/null || true
rm -rf "$DIST_DIR/scripts" 2>/dev/null || true
rm -rf "$DIST_DIR/docs" 2>/dev/null || true

# Create ZIP package
echo "Creating ZIP package..."
cd "$DIST_DIR"
zip -r "../${PACKAGE_NAME}.zip" . -x "*.git*" "node_modules/*" "*.DS_Store" "*.log"
cd ..

echo ""
echo "✅ Extension packaged successfully!"
echo "📦 Package: ${PACKAGE_NAME}.zip"
echo "📁 Distribution files: $DIST_DIR/"
echo ""
echo "Chrome Web Store Deployment:"
echo "1. Go to https://chrome.google.com/webstore/devconsole/"
echo "2. Click 'Add new item'"
echo "3. Upload the ${PACKAGE_NAME}.zip file"
echo "4. Fill in the store listing details"
echo "5. Submit for review"
echo ""
echo "Package size: $(du -h "${PACKAGE_NAME}.zip" | cut -f1)" 