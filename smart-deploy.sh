#!/bin/bash

# VibeStore Smart Deployment System
# This script ensures version consistency before deployment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/Users/shalom/Desktop/vibestore/VibeStore"
VERSION_SYNC_SCRIPT="/Users/shalom/Desktop/vibestore/version-sync.sh"

echo -e "${BLUE}🚀 VibeStore Smart Deployment System${NC}"
echo "=========================================="

# Function to check if version sync script exists
check_version_sync() {
    if [ ! -f "$VERSION_SYNC_SCRIPT" ]; then
        echo -e "${RED}❌ Version sync script not found: $VERSION_SYNC_SCRIPT${NC}"
        exit 1
    fi
}

# Function to validate versions before deployment
validate_before_deploy() {
    echo -e "${YELLOW}🔍 Validating versions before deployment...${NC}"
    
    if "$VERSION_SYNC_SCRIPT" validate; then
        echo -e "${GREEN}✅ Version validation passed!${NC}"
        return 0
    else
        echo -e "${RED}❌ Version validation failed!${NC}"
        return 1
    fi
}

# Function to show deployment options
show_options() {
    echo -e "\n${YELLOW}📋 Deployment Options:${NC}"
    echo "1. Quick Deploy (validate + build + deploy)"
    echo "2. Sync Version + Deploy (update version + validate + build + deploy)"
    echo "3. Force Deploy (skip validation - not recommended)"
    echo "4. Show Current Status"
    echo "5. Exit"
    echo ""
    read -p "Choose option (1-5): " choice
}

# Function for quick deploy
quick_deploy() {
    echo -e "\n${YELLOW}⚡ Quick Deploy${NC}"
    
    if validate_before_deploy; then
        echo -e "${YELLOW}🏗️  Building and deploying...${NC}"
        "$VERSION_SYNC_SCRIPT" deploy
    else
        echo -e "${RED}❌ Cannot deploy with inconsistent versions!${NC}"
        echo -e "${YELLOW}💡 Try option 2 to sync versions first.${NC}"
        return 1
    fi
}

# Function for sync and deploy
sync_and_deploy() {
    echo -e "\n${YELLOW}🔄 Sync Version + Deploy${NC}"
    
    # Get current version
    local current_version=$("$VERSION_SYNC_SCRIPT" status 2>/dev/null | grep "Current Version:" | sed 's/.*: //' || echo "")
    
    echo -e "Current version: ${BLUE}$current_version${NC}"
    read -p "Enter new version (or press Enter to keep current): " new_version
    
    if [ -n "$new_version" ]; then
        echo -e "${YELLOW}🔄 Syncing to version: $new_version${NC}"
        "$VERSION_SYNC_SCRIPT" sync "$new_version"
    fi
    
    echo -e "${YELLOW}🏗️  Building and deploying...${NC}"
    "$VERSION_SYNC_SCRIPT" deploy
}

# Function for force deploy
force_deploy() {
    echo -e "\n${YELLOW}⚠️  Force Deploy (Skipping Validation)${NC}"
    echo -e "${RED}Warning: This may deploy with inconsistent versions!${NC}"
    read -p "Are you sure? (y/N): " confirm
    
    if [[ $confirm =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🏗️  Building and deploying...${NC}"
        cd "$PROJECT_DIR"
        bundle exec jekyll build
        firebase deploy --only hosting
        echo -e "${GREEN}✅ Force deploy complete!${NC}"
    else
        echo -e "${YELLOW}Deploy cancelled.${NC}"
    fi
}

# Function to show status
show_status() {
    echo -e "\n${YELLOW}📊 Current Status:${NC}"
    "$VERSION_SYNC_SCRIPT" status
}

# Main script logic
main() {
    check_version_sync
    
    while true; do
        show_options
        
        case $choice in
            1)
                quick_deploy
                break
                ;;
            2)
                sync_and_deploy
                break
                ;;
            3)
                force_deploy
                break
                ;;
            4)
                show_status
                echo ""
                ;;
            5)
                echo -e "${YELLOW}Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid option. Please choose 1-5.${NC}"
                ;;
        esac
    done
}

# Run main function
main
