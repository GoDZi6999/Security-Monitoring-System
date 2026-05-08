#!/bin/bash

# Security Monitoring SaaS - Quick Start Script
# This script automates the setup and launch process

set -e

echo "🔒 Security Monitoring SaaS - Quick Start"
echo "========================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"
echo ""

# Setup Backend
echo -e "${YELLOW}Setting up Backend...${NC}"
cd server

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install > /dev/null 2>&1
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

echo -e "${GREEN}✓ Backend ready${NC}"
cd ..

# Setup Frontend
echo ""
echo -e "${YELLOW}Setting up Frontend...${NC}"
cd client

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install > /dev/null 2>&1
fi

echo -e "${GREEN}✓ Frontend ready${NC}"
cd ..

# Display next steps
echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "To start the application:"
echo ""
echo -e "${YELLOW}Terminal 1 - Backend:${NC}"
echo "  cd server && npm start"
echo ""
echo -e "${YELLOW}Terminal 2 - Frontend:${NC}"
echo "  cd client && npm start"
echo ""
echo -e "${YELLOW}Or use Docker:${NC}"
echo "  docker-compose up --build"
echo ""
echo "Demo Credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo "URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo ""
echo "Documentation:"
echo "  Setup:       cat SETUP.md"
echo "  Architecture: cat ARCHITECTURE.md"
echo "  README:      cat README.md"
echo ""
