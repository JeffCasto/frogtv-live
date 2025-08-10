#!/bin/bash
set -e

echo "🐸 Deploying FrogTV to the world..."

# Build the web app
cd web
npm install
npm run build
cd ..

# Deploy Firebase Functions  
cd functions
npm install
npm run build
firebase deploy --only functions
cd ..

# Deploy to Vercel
cd web  
vercel --prod
cd ..

# Initialize Firebase data
echo "Initializing frog data..."
curl -X POST https://your-region-your-project.cloudfunctions.net/initializeFrogs

echo "🎉 FrogTV is LIVE! The frogs await their audience..."