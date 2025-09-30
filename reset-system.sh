#!/bin/bash

# VibeStore System Reset Script
# This script clears all caches and regenerates the site for fresh development

set -e  # Exit on any error

echo "🔄 Starting VibeStore System Reset..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VIBESTORE_DIR="$SCRIPT_DIR/VibeStore"

echo -e "${BLUE}📁 Working directory: $VIBESTORE_DIR${NC}"

# Check if VibeStore directory exists
if [ ! -d "$VIBESTORE_DIR" ]; then
    echo -e "${RED}❌ Error: VibeStore directory not found at $VIBESTORE_DIR${NC}"
    exit 1
fi

cd "$VIBESTORE_DIR"

echo -e "${YELLOW}🧹 Step 1: Clearing Jekyll caches and generated files...${NC}"
# Remove Jekyll generated files and caches
rm -rf _site .jekyll-cache .sass-cache .jekyll-metadata
echo -e "${GREEN}✅ Jekyll cache cleared${NC}"

echo -e "${YELLOW}🧹 Step 2: Running Jekyll clean command...${NC}"
# Use Jekyll's built-in clean command
if command -v bundle &> /dev/null; then
    bundle exec jekyll clean
else
    jekyll clean
fi
echo -e "${GREEN}✅ Jekyll clean completed${NC}"

echo -e "${YELLOW}🔨 Step 3: Rebuilding Jekyll site...${NC}"
# Rebuild the site with force polling
if command -v bundle &> /dev/null; then
    bundle exec jekyll build --force_polling
else
    jekyll build --force_polling
fi
echo -e "${GREEN}✅ Jekyll site rebuilt${NC}"

echo -e "${YELLOW}🧹 Step 4: Clearing Node.js caches...${NC}"
# Clear npm cache if npm is available
if command -v npm &> /dev/null; then
    npm cache clean --force 2>/dev/null || echo "npm cache clean skipped"
fi

# Clear node_modules and reinstall if package.json exists
if [ -f "package.json" ]; then
    echo -e "${BLUE}📦 Reinstalling Node.js dependencies...${NC}"
    rm -rf node_modules package-lock.json
    npm install
    echo -e "${GREEN}✅ Node.js dependencies reinstalled${NC}"
fi

echo -e "${YELLOW}🔥 Step 5: Firebase cache clearing...${NC}"
# Clear Firebase hosting cache if firebase-tools is available
if command -v firebase &> /dev/null; then
    echo -e "${BLUE}🔥 Clearing Firebase hosting cache...${NC}"
    firebase hosting:channel:delete preview --force 2>/dev/null || echo "No preview channel to delete"
    echo -e "${GREEN}✅ Firebase cache operations completed${NC}"
else
    echo -e "${YELLOW}⚠️  Firebase CLI not found - skipping Firebase cache clear${NC}"
fi

echo -e "${YELLOW}🌐 Step 6: Browser cache instructions...${NC}"
echo -e "${BLUE}To complete the reset, please clear your browser cache:${NC}"
echo ""
echo -e "${YELLOW}Chrome/Edge:${NC}"
echo "  • Press Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)"
echo "  • Select 'All time' and check all boxes"
echo "  • Click 'Clear data'"
echo ""
echo -e "${YELLOW}Firefox:${NC}"
echo "  • Press Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)"
echo "  • Select 'Everything' and check all boxes"
echo "  • Click 'Clear Now'"
echo ""
echo -e "${YELLOW}Safari:${NC}"
echo "  • Press Cmd+Option+E"
echo "  • Or Safari > Clear History > All History"
echo ""
echo -e "${YELLOW}Alternative - Hard Refresh:${NC}"
echo "  • Press Ctrl+F5 (Cmd+Shift+R on Mac)"
echo "  • Or Ctrl+Shift+R (Cmd+Shift+R on Mac)"
echo ""

echo -e "${GREEN}🎉 System Reset Complete!${NC}"
echo "=================================="
echo -e "${BLUE}Your VibeStore development environment has been reset.${NC}"
echo -e "${BLUE}All caches cleared and site regenerated.${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Clear your browser cache (see instructions above)"
echo "2. Start your development server:"
echo "   cd VibeStore && bundle exec jekyll serve"
echo "3. Visit http://localhost:4000 to see fresh changes"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"

