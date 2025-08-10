#!/bin/bash

echo "🐸 Setting up FrogTV development environment..."

# Install dependencies
cd web && npm install && cd ..
cd functions && npm install && cd ..

# Start Firebase emulators
firebase emulators:start --only database,functions &

# Start Next.js dev server
cd web && npm run dev &

# Wait for services to start
sleep 5

echo "🎉 Dev environment ready!"
echo "📺 OBS Browser Source: http://localhost:3000/stage"  
echo "🌐 Main site: http://localhost:3000"
echo "🔧 Firebase UI: http://localhost:4000"