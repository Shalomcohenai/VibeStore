#!/bin/bash

# VibeStore Deployment Script
echo "🚀 Building and deploying VibeStore..."

# Move to project directory
cd /Users/shalom/Desktop/vibestore/VibeStore

# Build Jekyll site
echo "📦 Building Jekyll site..."
bundle exec jekyll build

# Deploy to Firebase Hosting (without functions for now)
echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "🌍 Your site is live at: https://vibestore-7af1e.web.app"
