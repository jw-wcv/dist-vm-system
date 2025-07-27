#!/bin/bash
# start-dashboard.sh
# 
# Description: Startup script for the Super VM Dashboard
# 
# This script initializes and starts the Super VM Dashboard web interface,
# providing a user-friendly way to manage the distributed VM system.
# 
# Process:
#   1. Check prerequisites (Node.js, dependencies)
#   2. Install dependencies if needed
#   3. Start the development server
#   4. Open the dashboard in the default browser
# 
# Inputs: None (uses default configuration)
# Outputs: 
#   - Running Super VM Dashboard on http://localhost:5173
#   - Browser window opened to the dashboard
# 
# Prerequisites:
#   - Node.js 16+ installed
#   - Super VM cluster manager running on port 3000
#   - Internet connectivity for dependency installation
# 
# Usage: ./start-dashboard.sh

set -e  # Exit on any error

echo "🚀 Starting Super VM Dashboard..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js $(node -v) is installed"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the main-ui directory."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_status "Dependencies already installed"
fi

# Check if cluster manager is running
print_status "Checking cluster manager connection..."
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    print_success "Cluster manager is running on port 3000"
else
    print_warning "Cluster manager is not running on port 3000"
    print_warning "Please start the cluster manager first: cd ../cluster-manager && node index.js"
    print_warning "The dashboard will still start but won't be able to connect to the API"
fi

# Start the development server
print_status "Starting Super VM Dashboard..."
print_status "The dashboard will be available at: http://localhost:5173"

# Start the development server in the background
npm run dev &
DASHBOARD_PID=$!

# Wait a moment for the server to start
sleep 5

# Check if the server started successfully
if kill -0 $DASHBOARD_PID 2>/dev/null; then
    print_success "Dashboard started successfully (PID: $DASHBOARD_PID)"
else
    print_error "Failed to start dashboard"
    exit 1
fi

# Try to open the dashboard in the default browser
print_status "Opening dashboard in browser..."
if command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:5173 &
elif command -v open &> /dev/null; then
    # macOS
    open http://localhost:5173 &
elif command -v start &> /dev/null; then
    # Windows
    start http://localhost:5173 &
else
    print_warning "Could not automatically open browser. Please visit: http://localhost:5173"
fi

# Display dashboard information
echo ""
echo "🎉 Super VM Dashboard Started Successfully!"
echo "==========================================="
echo ""
echo "📊 Dashboard URL: http://localhost:5173"
echo "🔧 API Endpoint: http://localhost:3000/api"
echo "📱 Mobile Friendly: Yes (responsive design)"
echo "🌙 Dark Mode: Available (toggle in header)"
echo ""
echo "📋 Available Features:"
echo "   • Real-time system monitoring"
echo "   • VM management and control"
echo "   • Task execution and monitoring"
echo "   • Resource utilization charts"
echo "   • Performance analytics"
echo "   • System configuration"
echo ""
echo "💡 Quick Start:"
echo "   1. Check the Dashboard for system overview"
echo "   2. Use VM Manager to control virtual machines"
echo "   3. Submit tasks via Task Manager"
echo "   4. Monitor resources in Resource Monitor"
echo "   5. Configure settings in Settings page"
echo ""
echo "🛑 To stop the dashboard:"
echo "   kill $DASHBOARD_PID"
echo ""

# Function to handle shutdown
cleanup() {
    print_status "Shutting down Super VM Dashboard..."
    if kill -0 $DASHBOARD_PID 2>/dev/null; then
        kill $DASHBOARD_PID
        print_success "Dashboard stopped"
    fi
    print_success "Super VM Dashboard shutdown complete"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep the script running
print_status "Dashboard is running. Press Ctrl+C to stop."
while true; do
    sleep 10
    # Check if the dashboard is still running
    if ! kill -0 $DASHBOARD_PID 2>/dev/null; then
        print_error "Dashboard stopped unexpectedly"
        exit 1
    fi
done 