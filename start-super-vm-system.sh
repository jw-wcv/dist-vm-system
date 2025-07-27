#!/bin/bash
# start-super-vm-system.sh
# 
# Description: Complete startup script for the Super VM distributed system
# 
# This script initializes and starts the entire Super VM system including:
# - Cluster manager with Super VM API
# - Web dashboard interface
# - All necessary services and dependencies
# 
# Process:
#   1. Check system prerequisites
#   2. Start cluster manager (Super VM API)
#   3. Start web dashboard
#   4. Open dashboard in browser
#   5. Display system status and usage information
# 
# Inputs: None (uses default configuration)
# Outputs: 
#   - Running Super VM cluster manager on port 3000
#   - Running Super VM dashboard on port 5173
#   - Browser window opened to the dashboard
#   - Complete distributed computing system ready
# 
# Prerequisites:
#   - Node.js 16+ installed
#   - Docker installed and running
#   - Internet connectivity
#   - Aleph network access
# 
# Usage: ./start-super-vm-system.sh

set -e  # Exit on any error

echo "🚀 Starting Super VM Distributed System..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
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

print_header() {
    echo -e "${MAGENTA}[HEADER]${NC} $1"
}

print_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

# Check prerequisites
print_header "Checking System Prerequisites"

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

# Check Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

print_success "Docker is installed and running"

# Check if we're in the right directory
if [ ! -d "cluster-manager" ] || [ ! -d "main-ui" ]; then
    print_error "Required directories not found. Please run this script from the project root."
    exit 1
fi

print_success "Project structure verified"

# Step 1: Start Cluster Manager
print_step "Step 1: Starting Cluster Manager (Super VM API)"

cd cluster-manager

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing cluster manager dependencies..."
    npm install
    print_success "Cluster manager dependencies installed"
else
    print_status "Cluster manager dependencies already installed"
fi

# Start cluster manager in background
print_status "Starting Super VM cluster manager..."
print_status "API will be available at: http://localhost:3000/api"

node index.js &
CLUSTER_PID=$!

# Wait for cluster manager to start
sleep 10

# Check if cluster manager started successfully
if kill -0 $CLUSTER_PID 2>/dev/null; then
    print_success "Cluster manager started successfully (PID: $CLUSTER_PID)"
else
    print_error "Failed to start cluster manager"
    exit 1
fi

# Wait a bit more for initialization
sleep 5

# Test API connection
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    print_success "Cluster manager API is responding"
else
    print_warning "Cluster manager API is not responding yet, but process is running"
fi

cd ..

# Step 2: Start Dashboard
print_step "Step 2: Starting Web Dashboard"

cd main-ui

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dashboard dependencies..."
    npm install
    print_success "Dashboard dependencies installed"
else
    print_status "Dashboard dependencies already installed"
fi

# Start dashboard in background
print_status "Starting Super VM dashboard..."
print_status "Dashboard will be available at: http://localhost:5173"

npm run dev &
DASHBOARD_PID=$!

# Wait for dashboard to start
sleep 10

# Check if dashboard started successfully
if kill -0 $DASHBOARD_PID 2>/dev/null; then
    print_success "Dashboard started successfully (PID: $DASHBOARD_PID)"
else
    print_error "Failed to start dashboard"
    # Clean up cluster manager
    kill $CLUSTER_PID 2>/dev/null || true
    exit 1
fi

cd ..

# Step 3: Open Dashboard in Browser
print_step "Step 3: Opening Dashboard in Browser"

# Wait a bit more for dashboard to be ready
sleep 5

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

# Step 4: Display System Information
print_header "Super VM System Started Successfully!"
echo ""
echo "🎉 Complete Super VM Distributed System is Running!"
echo "=================================================="
echo ""
echo "📊 Dashboard URL: http://localhost:5173"
echo "🔧 API Endpoint: http://localhost:3000/api"
echo "📱 Mobile Friendly: Yes (responsive design)"
echo "🌙 Dark Mode: Available (toggle in header)"
echo ""
echo "🖥️ System Components:"
echo "   • Cluster Manager (PID: $CLUSTER_PID) - Port 3000"
echo "   • Web Dashboard (PID: $DASHBOARD_PID) - Port 5173"
echo "   • Super VM API - Distributed computing interface"
echo "   • Real-time monitoring - System status and metrics"
echo ""
echo "📋 Available Features:"
echo "   • Real-time system monitoring and metrics"
echo "   • VM management and control (create, start, stop, delete)"
echo "   • Task execution and monitoring (process, render, browser, sync)"
echo "   • Resource utilization charts and analytics"
echo "   • Performance monitoring and optimization"
echo "   • System configuration and settings"
echo "   • Distributed computing across multiple VMs"
echo ""
echo "💡 Quick Start Guide:"
echo "   1. Dashboard: View system overview and quick actions"
echo "   2. VM Manager: Control virtual machines and monitor status"
echo "   3. Task Manager: Submit and monitor distributed computing tasks"
echo "   4. Resource Monitor: Analyze performance and resource usage"
echo "   5. Settings: Configure system parameters and preferences"
echo ""
echo "🔗 API Endpoints:"
echo "   • GET  /api/super-vm/status     - System status"
echo "   • GET  /api/super-vm/resources  - Resource information"
echo "   • GET  /api/super-vm/metrics    - Performance metrics"
echo "   • POST /api/super-vm/process    - Data processing tasks"
echo "   • POST /api/super-vm/render     - 3D rendering tasks"
echo "   • POST /api/super-vm/browser    - Browser automation tasks"
echo "   • POST /api/super-vm/sync       - File synchronization tasks"
echo "   • POST /api/super-vm/scale      - Scale the system"
echo "   • GET  /api/vms                 - List all VMs"
echo "   • GET  /api/tasks               - List all tasks"
echo "   • GET  /api/nodes               - List all nodes"
echo ""
echo "🛑 To stop the entire system:"
echo "   kill $CLUSTER_PID $DASHBOARD_PID"
echo "   or press Ctrl+C in this terminal"
echo ""
echo "📞 System Status:"
echo "   • Cluster Manager: Running on port 3000"
echo "   • Dashboard: Running on port 5173"
echo "   • Super VM: Ready for distributed computing"
echo "   • Browser: Dashboard should be open automatically"
echo ""

# Function to handle shutdown
cleanup() {
    print_header "Shutting down Super VM System..."
    
    print_status "Stopping dashboard..."
    if kill -0 $DASHBOARD_PID 2>/dev/null; then
        kill $DASHBOARD_PID
        print_success "Dashboard stopped"
    fi
    
    print_status "Stopping cluster manager..."
    if kill -0 $CLUSTER_PID 2>/dev/null; then
        kill $CLUSTER_PID
        print_success "Cluster manager stopped"
    fi
    
    print_success "Super VM System shutdown complete"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep the script running and monitor processes
print_status "System is running. Press Ctrl+C to stop all services."
print_status "Monitoring system health..."

while true; do
    sleep 30
    
    # Check if cluster manager is still running
    if ! kill -0 $CLUSTER_PID 2>/dev/null; then
        print_error "Cluster manager stopped unexpectedly"
        cleanup
        exit 1
    fi
    
    # Check if dashboard is still running
    if ! kill -0 $DASHBOARD_PID 2>/dev/null; then
        print_error "Dashboard stopped unexpectedly"
        cleanup
        exit 1
    fi
    
    # Test API health
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        print_status "System health check: OK"
    else
        print_warning "API health check failed, but processes are running"
    fi
done 