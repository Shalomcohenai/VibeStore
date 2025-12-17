#!/bin/bash

# VibeStore Complete Hard Reset Script
# This script performs a complete system reset: stops all processes, updates to latest version, and restarts everything

set -e  # Exit on any error

echo "🔄 Starting VibeStore Complete Hard Reset..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

# Function to kill processes on specific ports
kill_port_processes() {
    local port=$1
    echo -e "${YELLOW}🔍 Checking for processes on port $port...${NC}"
    
    # Find and kill processes on the port
    local pids=$(lsof -ti:$port 2>/dev/null || true)
    if [ ! -z "$pids" ]; then
        echo -e "${YELLOW}⚠️  Found processes on port $port: $pids${NC}"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        echo -e "${GREEN}✅ Killed processes on port $port${NC}"
    else
        echo -e "${GREEN}✅ No processes found on port $port${NC}"
    fi
}

# Function to stop all Jekyll processes
stop_jekyll_processes() {
    echo -e "${YELLOW}🛑 Step 1: Stopping all Jekyll processes...${NC}"
    
    # Kill common Jekyll ports
    kill_port_processes 4000
    kill_port_processes 3000
    kill_port_processes 8080
    
    # Kill any Jekyll processes
    pkill -f "jekyll" 2>/dev/null || true
    pkill -f "bundle exec jekyll" 2>/dev/null || true
    
    echo -e "${GREEN}✅ All Jekyll processes stopped${NC}"
}

# Function to stop all Node.js processes
stop_node_processes() {
    echo -e "${YELLOW}🛑 Step 2: Stopping all Node.js processes...${NC}"
    
    # Kill Node.js processes (but keep system processes)
    pkill -f "node.*vibestore" 2>/dev/null || true
    pkill -f "npm.*start" 2>/dev/null || true
    pkill -f "npm.*dev" 2>/dev/null || true
    
    echo -e "${GREEN}✅ All Node.js processes stopped${NC}"
}

# Function to stop Firebase emulators
stop_firebase_processes() {
    echo -e "${YELLOW}🛑 Step 3: Stopping Firebase emulators...${NC}"
    
    # Kill Firebase emulator ports
    kill_port_processes 5000  # Functions
    kill_port_processes 5001  # Firestore
    kill_port_processes 9000  # Hosting
    kill_port_processes 8085  # Auth
    
    # Kill Firebase processes
    pkill -f "firebase" 2>/dev/null || true
    pkill -f "firebase-tools" 2>/dev/null || true
    
    echo -e "${GREEN}✅ All Firebase processes stopped${NC}"
}

# Function to clear all caches
clear_all_caches() {
    echo -e "${YELLOW}🧹 Step 4: Clearing all caches...${NC}"
    
    # Remove Jekyll generated files and caches
    echo -e "${BLUE}📦 Clearing Jekyll caches...${NC}"
    rm -rf _site .jekyll-cache .sass-cache .jekyll-metadata
    echo -e "${GREEN}✅ Jekyll cache cleared${NC}"
    
    # Clear npm cache
    if command -v npm &> /dev/null; then
        echo -e "${BLUE}📦 Clearing npm cache...${NC}"
        npm cache clean --force 2>/dev/null || echo "npm cache clean skipped"
        echo -e "${GREEN}✅ npm cache cleared${NC}"
    fi
    
    # Clear Firebase cache
    if command -v firebase &> /dev/null; then
        echo -e "${BLUE}🔥 Clearing Firebase cache...${NC}"
        firebase hosting:channel:delete preview --force 2>/dev/null || echo "No preview channel to delete"
        echo -e "${GREEN}✅ Firebase cache cleared${NC}"
    fi
    
    # Clear system caches
    echo -e "${BLUE}🧹 Clearing system caches...${NC}"
    rm -rf ~/.cache/jekyll 2>/dev/null || true
    rm -rf ~/.npm/_cacache 2>/dev/null || true
    echo -e "${GREEN}✅ System caches cleared${NC}"
}

# Function to update dependencies
update_dependencies() {
    echo -e "${YELLOW}📦 Step 5: Updating all dependencies...${NC}"
    
    # Update Ruby gems
    if [ -f "Gemfile" ]; then
        echo -e "${BLUE}💎 Updating Ruby gems...${NC}"
        bundle update
        echo -e "${GREEN}✅ Ruby gems updated${NC}"
    fi
    
    # Update Node.js dependencies
    if [ -f "package.json" ]; then
        echo -e "${BLUE}📦 Updating Node.js dependencies...${NC}"
        rm -rf node_modules package-lock.json
        npm install
        echo -e "${GREEN}✅ Node.js dependencies updated${NC}"
    fi
    
    # Update Firebase functions dependencies
    if [ -d "functions" ] && [ -f "functions/package.json" ]; then
        echo -e "${BLUE}🔥 Updating Firebase functions dependencies...${NC}"
        cd functions
        rm -rf node_modules package-lock.json
        npm install
        cd ..
        echo -e "${GREEN}✅ Firebase functions dependencies updated${NC}"
    fi
}

# Function to pull latest changes
pull_latest_changes() {
    echo -e "${YELLOW}📥 Step 6: Pulling latest changes from Git...${NC}"
    
    # Go to root directory
    cd "$SCRIPT_DIR"
    
    # Check if we're in a git repository
    if [ -d ".git" ]; then
        echo -e "${BLUE}📥 Pulling latest changes...${NC}"
        git fetch --all
        git reset --hard HEAD
        git pull origin main
        echo -e "${GREEN}✅ Latest changes pulled${NC}"
    else
        echo -e "${YELLOW}⚠️  Not a git repository - skipping git pull${NC}"
    fi
    
    # Return to VibeStore directory
    cd "$VIBESTORE_DIR"
}

# Function to rebuild everything
rebuild_everything() {
    echo -e "${YELLOW}🔨 Step 7: Rebuilding everything...${NC}"
    
    # Clean Jekyll
    echo -e "${BLUE}🧹 Cleaning Jekyll...${NC}"
    if command -v bundle &> /dev/null; then
        bundle exec jekyll clean
    else
        jekyll clean
    fi
    echo -e "${GREEN}✅ Jekyll cleaned${NC}"
    
    # Build Jekyll site
    echo -e "${BLUE}🔨 Building Jekyll site...${NC}"
    if command -v bundle &> /dev/null; then
        bundle exec jekyll build --force_polling
    else
        jekyll build --force_polling
    fi
    echo -e "${GREEN}✅ Jekyll site built${NC}"
    
    # Build Firebase functions
    if [ -d "functions" ]; then
        echo -e "${BLUE}🔥 Building Firebase functions...${NC}"
        cd functions
        npm run build 2>/dev/null || echo "No build script found"
        cd ..
        echo -e "${GREEN}✅ Firebase functions built${NC}"
    fi
}

# Function to start development server
start_development_server() {
    echo -e "${YELLOW}🚀 Step 8: Starting development server...${NC}"
    
    echo -e "${BLUE}🌐 Starting Jekyll development server...${NC}"
    echo -e "${YELLOW}The server will start in the background.${NC}"
    echo -e "${YELLOW}Visit http://localhost:4000 to see your site.${NC}"
    echo ""
    
    # Start Jekyll server in background
    if command -v bundle &> /dev/null; then
        nohup bundle exec jekyll serve --host 0.0.0.0 --port 4000 --livereload > jekyll.log 2>&1 &
    else
        nohup jekyll serve --host 0.0.0.0 --port 4000 --livereload > jekyll.log 2>&1 &
    fi
    
    # Wait a moment for server to start
    sleep 3
    
    # Check if server started successfully
    if lsof -ti:4000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Jekyll development server started successfully!${NC}"
        echo -e "${BLUE}🌍 Your site is available at: http://localhost:4000${NC}"
        echo -e "${BLUE}📝 Server logs: tail -f jekyll.log${NC}"
    else
        echo -e "${RED}❌ Failed to start Jekyll server${NC}"
        echo -e "${YELLOW}Check jekyll.log for details${NC}"
    fi
}

# Function to show completion message
show_completion_message() {
    echo ""
    echo -e "${GREEN}🎉 Complete Hard Reset Finished!${NC}"
    echo "=============================================="
    echo -e "${BLUE}✅ All processes stopped${NC}"
    echo -e "${BLUE}✅ All caches cleared${NC}"
    echo -e "${BLUE}✅ Dependencies updated${NC}"
    echo -e "${BLUE}✅ Latest changes pulled${NC}"
    echo -e "${BLUE}✅ Everything rebuilt${NC}"
    echo -e "${BLUE}✅ Development server started${NC}"
    echo ""
    echo -e "${YELLOW}🌐 Your site is now running at: http://localhost:4000${NC}"
    echo ""
    echo -e "${YELLOW}📋 Next steps:${NC}"
    echo "1. Clear your browser cache (Ctrl+Shift+Delete)"
    echo "2. Visit http://localhost:4000"
    echo "3. Check server logs: tail -f jekyll.log"
    echo "4. Stop server: pkill -f jekyll"
    echo ""
    echo -e "${PURPLE}💡 Pro tip: Use 'tail -f jekyll.log' to monitor server logs${NC}"
    echo ""
    echo -e "${GREEN}Happy coding! 🚀${NC}"
}

# Main execution
main() {
    # Stop all processes
    stop_jekyll_processes
    stop_node_processes
    stop_firebase_processes
    
    # Clear everything
    clear_all_caches
    
    # Update dependencies
    update_dependencies
    
    # Pull latest changes
    pull_latest_changes
    
    # Rebuild everything
    rebuild_everything
    
    # Start development server
    start_development_server
    
    # Show completion message
    show_completion_message
}

# Run main function
main "$@"
