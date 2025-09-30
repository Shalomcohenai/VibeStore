#!/bin/bash

# Deploy Firebase Storage CORS configuration
# This fixes CORS errors when uploading files from the web app

set -e

echo "🔧 Deploying Firebase Storage CORS configuration..."

# Check if gsutil is available
if ! command -v gsutil &> /dev/null; then
    echo "❌ gsutil not found. Please install Google Cloud SDK:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get the storage bucket name from firebase config
STORAGE_BUCKET="vibestore-7af1e.firebasestorage.app"

echo "📦 Configuring CORS for bucket: $STORAGE_BUCKET"

# Apply CORS configuration
gsutil cors set storage-cors.json gs://$STORAGE_BUCKET

echo "✅ CORS configuration deployed successfully!"
echo ""
echo "🚀 Next steps:"
echo "   1. Deploy storage rules: npx firebase deploy --only storage"
echo "   2. Test file upload in your app"
echo ""
echo "📝 CORS configuration allows:"
echo "   - Origins: https://vibestore-7af1e.web.app, https://vibestore-7af1e.firebaseapp.com"
echo "   - Methods: GET, POST, PUT, DELETE, OPTIONS"
echo "   - Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin"
