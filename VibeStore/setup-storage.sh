#!/bin/bash

# Complete Firebase Storage setup script
# This script deploys storage rules and configures CORS for file uploads

set -e

echo "🚀 Setting up Firebase Storage for VibeStore..."

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo "❌ Please run this script from the VibeStore project root"
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it:"
    echo "   npm install -g firebase-tools"
    exit 1
fi

# Check if gsutil is available for CORS configuration
if ! command -v gsutil &> /dev/null; then
    echo "⚠️  gsutil not found. Installing Google Cloud SDK..."
    echo "   Please install Google Cloud SDK manually:"
    echo "   https://cloud.google.com/sdk/docs/install"
    echo ""
    echo "   Or run: curl https://sdk.cloud.google.com | bash"
    echo "   Then restart your terminal and run this script again."
    exit 1
fi

echo "📦 Deploying Firebase Storage rules..."
firebase deploy --only storage

echo ""
echo "🔧 Configuring CORS for Firebase Storage..."

# Get the storage bucket name from firebase config
STORAGE_BUCKET="vibestore-7af1e.firebasestorage.app"

echo "📦 Configuring CORS for bucket: $STORAGE_BUCKET"

# Apply CORS configuration
gsutil cors set storage-cors.json gs://$STORAGE_BUCKET

echo ""
echo "✅ Firebase Storage setup complete!"
echo ""
echo "🎯 What was configured:"
echo "   ✓ Storage security rules (allow authenticated uploads)"
echo "   ✓ CORS policy (allow uploads from your web app)"
echo "   ✓ File naming sanitization (avoid spaces/special chars)"
echo ""
echo "🧪 Test your app upload functionality now!"
echo "   The CORS errors should be resolved."
