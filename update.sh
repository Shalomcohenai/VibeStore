#!/bin/bash

# VibeStore Update & Deploy Script
echo "🔄 Updating VibeStore..."

# Move to project directory
cd /Users/shalom/Desktop/vibestore/VibeStore

# Build Jekyll site
echo "📦 Building site..."
bundle exec jekyll build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Firebase
    echo "🚀 Deploying to Firebase..."
    firebase deploy --only hosting
    
    if [ $? -eq 0 ]; then
        echo "✅ Deploy successful!"
        echo "🌍 Your site is updated at: https://vibestore-7af1e.web.app"
    else
        echo "❌ Deploy failed!"
    fi
else
    echo "❌ Build failed! Please check your changes."
fi
