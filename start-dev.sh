#!/bin/bash

echo "🚀 Starting Budget Tracker Development Environment"
echo ""

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client && npm install && cd ..
fi

echo ""
echo "✅ All dependencies installed!"
echo ""
echo "🌐 Starting development servers..."
echo "   - Backend API: http://localhost:3000"
echo "   - Frontend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start both servers concurrently
npm run dev
