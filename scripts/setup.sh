#!/bin/bash

# ============================================
# LearnHub LMS - Linux/macOS Setup Script
# ============================================

set -e

echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║     LearnHub LMS - Setup Script           ║"
echo "║     Linux / macOS                         ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# Check for Node.js
echo "🔍 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v) detected"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✅ npm $(npm -v) detected"

# Create .env if not exists
echo ""
echo "📝 Setting up environment..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
MONGO_URI=mongodb://localhost:27017/lms
JWT_SECRET=your-super-secret-key-change-in-production
PORT=5000
EOF
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd server
npm install
echo "✅ Backend dependencies installed"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd ../client
npm install
echo "✅ Frontend dependencies installed"

# Go back to root
cd ..

# Offer to seed database
echo ""
echo "🌱 Would you like to seed the database with demo data? (y/n)"
read -r SEED_CHOICE
if [ "$SEED_CHOICE" = "y" ] || [ "$SEED_CHOICE" = "Y" ]; then
    echo "Seeding database..."
    cd server
    npm run seed
    cd ..
    echo "✅ Database seeded with demo data"
fi

# Done
echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║     ✅ Setup Complete!                    ║"
echo "╚═══════════════════════════════════════════╝"
echo ""
echo "To start the application, run:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd server && npm run dev"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd client && npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "Demo login: admin@company.com / password123"
echo ""
