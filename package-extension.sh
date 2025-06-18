#!/bin/bash

echo "Packaging DealWise Extension"
echo "=============================================="

# Set variables
EXTENSION_NAME="rental-investment-analyzer"
VERSION="1.0.0"
DIST_DIR="dist"
PACKAGE_NAME="${EXTENSION_NAME}-v${VERSION}"

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf "$DIST_DIR"
rm -f "${PACKAGE_NAME}.zip"

# Create distribution directory
mkdir -p "$DIST_DIR"

# Copy necessary files
echo "Copying extension files..."
cp -r src/* "$DIST_DIR/"
cp -r public/* "$DIST_DIR/" 2>/dev/null || true
cp manifest.json "$DIST_DIR/" 2>/dev/null || true
cp README.md "$DIST_DIR/"
cp install.sh "$DIST_DIR/"

# Remove development files
echo "Removing development files..."
rm -rf "$DIST_DIR/node_modules" 2>/dev/null || true
rm -rf "$DIST_DIR/.git" 2>/dev/null || true
rm -f "$DIST_DIR/.DS_Store" 2>/dev/null || true
rm -f "$DIST_DIR/package-extension.sh" 2>/dev/null || true

# Create ZIP package
echo "Creating ZIP package..."
cd "$DIST_DIR"
zip -r "../${PACKAGE_NAME}.zip" . -x "*.git*" "node_modules/*" "*.DS_Store"
cd ..

echo ""
echo "✅ Extension packaged successfully!"
echo "📦 Package: ${PACKAGE_NAME}.zip"
echo "📁 Distribution files: $DIST_DIR/"
echo ""
echo "To share with others:"
echo "1. Send them the ${PACKAGE_NAME}.zip file"
echo "2. Have them extract it and follow the README.md instructions"
echo "3. Or share the GitHub repository URL" 