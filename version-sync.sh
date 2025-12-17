#!/bin/bash

# VibeStore Version Synchronization System
# This script ensures all version numbers are consistent across all files

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/Users/shalom/Desktop/vibestore/VibeStore"
VERSION_FILE="$PROJECT_DIR/_data/site.yml"
CONFIG_FILE="$PROJECT_DIR/_config.yml"
PACKAGE_FILE="$PROJECT_DIR/package.json"
DEPLOYMENT_FILE="$PROJECT_DIR/DEPLOYMENT_STATUS.md"

echo -e "${BLUE}🔄 VibeStore Version Synchronization System${NC}"
echo "================================================"

# Function to get current version from _data/site.yml
get_current_version() {
    if [ -f "$VERSION_FILE" ]; then
        grep '^version:' "$VERSION_FILE" | sed 's/version: *"\(.*\)"/\1/' | tr -d ' '
    else
        echo "1.0.0"
    fi
}

# Function to update version in a file
update_version_in_file() {
    local file="$1"
    local new_version="$2"
    local pattern="$3"
    
    if [ -f "$file" ]; then
        if [[ "$file" == *.json ]]; then
            # JSON file
            sed -i.bak "s/\"version\": *\"[^\"]*\"/\"version\": \"$new_version\"/g" "$file"
            rm -f "$file.bak"
        elif [[ "$file" == *.yml ]] || [[ "$file" == *.yaml ]]; then
            # YAML file
            sed -i.bak "s/^version: *\"[^\"]*\"/version: \"$new_version\"/g" "$file"
            rm -f "$file.bak"
        elif [[ "$file" == *.md ]]; then
            # Markdown file
            sed -i.bak "s/Version [0-9]\+\.[0-9]\+/Version $new_version/g" "$file"
            sed -i.bak "s/v[0-9]\+\.[0-9]\+/v$new_version/g" "$file"
            rm -f "$file.bak"
        fi
        echo -e "  ✅ Updated: $(basename "$file")"
    else
        echo -e "  ⚠️  File not found: $(basename "$file")"
    fi
}

# Function to validate version consistency
validate_versions() {
    echo -e "\n${YELLOW}🔍 Validating Version Consistency...${NC}"
    
    local current_version=$(get_current_version)
    local errors=0
    
    # Check _config.yml
    local config_version=$(grep '^version:' "$CONFIG_FILE" 2>/dev/null | sed 's/version: *"\(.*\)"/\1/' | tr -d ' ' || echo "")
    if [ "$config_version" != "$current_version" ]; then
        echo -e "  ${RED}❌ _config.yml version mismatch: $config_version vs $current_version${NC}"
        errors=$((errors + 1))
    else
        echo -e "  ${GREEN}✅ _config.yml: $config_version${NC}"
    fi
    
    # Check package.json
    local package_version=$(grep '"version":' "$PACKAGE_FILE" 2>/dev/null | sed 's/.*"version": *"\([^"]*\)".*/\1/' || echo "")
    if [ "$package_version" != "$current_version" ]; then
        echo -e "  ${RED}❌ package.json version mismatch: $package_version vs $current_version${NC}"
        errors=$((errors + 1))
    else
        echo -e "  ${GREEN}✅ package.json: $package_version${NC}"
    fi
    
    # Check DEPLOYMENT_STATUS.md
    local deployment_version=$(grep '^# VibeStore Deployment Status - Version [0-9]\+\.[0-9]\+' "$DEPLOYMENT_FILE" 2>/dev/null | grep -o '[0-9]\+\.[0-9]\+' || echo "")
    if [ "$deployment_version" != "$current_version" ]; then
        echo -e "  ${RED}❌ DEPLOYMENT_STATUS.md version mismatch: $deployment_version vs $current_version${NC}"
        errors=$((errors + 1))
    else
        echo -e "  ${GREEN}✅ DEPLOYMENT_STATUS.md: $deployment_version${NC}"
    fi
    
    if [ $errors -eq 0 ]; then
        echo -e "\n${GREEN}🎉 All versions are consistent!${NC}"
        return 0
    else
        echo -e "\n${RED}❌ Found $errors version inconsistencies${NC}"
        return 1
    fi
}

# Function to sync all versions
sync_versions() {
    local new_version="$1"
    
    if [ -z "$new_version" ]; then
        echo -e "${RED}❌ Error: Version number required${NC}"
        echo "Usage: $0 sync <version>"
        exit 1
    fi
    
    echo -e "\n${YELLOW}🔄 Synchronizing all versions to: $new_version${NC}"
    
    # Update all version files
    update_version_in_file "$CONFIG_FILE" "$new_version"
    update_version_in_file "$PACKAGE_FILE" "$new_version"
    update_version_in_file "$DEPLOYMENT_FILE" "$new_version"
    
    # Update cache bust in _data/site.yml
    local current_date=$(date +"%Y%m%d")
    local cache_bust="${current_date}-$(date +%H%M)-v${new_version//./}"
    
    if [ -f "$VERSION_FILE" ]; then
        sed -i.bak "s/cache_bust: *\"[^\"]*\"/cache_bust: \"$cache_bust\"/g" "$VERSION_FILE"
        sed -i.bak "s/last_updated: *\"[^\"]*\"/last_updated: \"$(date +"%Y-%m-%d")\"/g" "$VERSION_FILE"
        rm -f "$VERSION_FILE.bak"
        echo -e "  ✅ Updated: _data/site.yml (cache_bust: $cache_bust)"
    fi
    
    echo -e "\n${GREEN}✅ Version synchronization complete!${NC}"
}

# Function to build and deploy
build_and_deploy() {
    echo -e "\n${YELLOW}🏗️  Building and Deploying...${NC}"
    
    cd "$PROJECT_DIR"
    
    # Build Jekyll site
    echo "📦 Building Jekyll site..."
    if bundle exec jekyll build; then
        echo -e "  ${GREEN}✅ Build successful!${NC}"
    else
        echo -e "  ${RED}❌ Build failed!${NC}"
        exit 1
    fi
    
    # Deploy to Firebase
    echo "🚀 Deploying to Firebase..."
    if firebase deploy --only hosting; then
        echo -e "  ${GREEN}✅ Deploy successful!${NC}"
        echo -e "  ${BLUE}🌍 Site: https://vibestore-7af1e.web.app${NC}"
    else
        echo -e "  ${RED}❌ Deploy failed!${NC}"
        exit 1
    fi
}

# Function to show current status
show_status() {
    echo -e "\n${YELLOW}📊 Current Version Status:${NC}"
    
    local current_version=$(get_current_version)
    echo -e "  Current Version: ${BLUE}$current_version${NC}"
    
    validate_versions
}

# Main script logic
case "${1:-}" in
    "sync")
        sync_versions "$2"
        ;;
    "validate"|"check")
        validate_versions
        ;;
    "deploy")
        if validate_versions; then
            build_and_deploy
        else
            echo -e "${RED}❌ Cannot deploy with inconsistent versions!${NC}"
            echo "Run '$0 sync <version>' to fix version inconsistencies first."
            exit 1
        fi
        ;;
    "status")
        show_status
        ;;
    "help"|"-h"|"--help")
        echo "VibeStore Version Synchronization System"
        echo ""
        echo "Usage: $0 <command> [options]"
        echo ""
        echo "Commands:"
        echo "  sync <version>    - Synchronize all version numbers to specified version"
        echo "  validate          - Check if all versions are consistent"
        echo "  deploy            - Build and deploy (only if versions are consistent)"
        echo "  status            - Show current version status"
        echo "  help              - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 sync 6.3       - Update all files to version 6.3"
        echo "  $0 validate       - Check version consistency"
        echo "  $0 deploy         - Build and deploy if versions are consistent"
        ;;
    *)
        echo -e "${RED}❌ Unknown command: ${1:-}${NC}"
        echo "Run '$0 help' for usage information."
        exit 1
        ;;
esac
