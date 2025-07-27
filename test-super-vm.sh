#!/bin/bash
# test-super-vm.sh
# 
# Description: Simple test script for the Super VM system
# 
# This script provides a step-by-step testing approach for the Super VM system.
# It includes both quick component tests and full system tests.
# 
# Usage: ./test-super-vm.sh [option]
# Options:
#   quick    - Run quick component tests only
#   full     - Run full system tests (requires system to be running)
#   install  - Install dependencies and setup
#   start    - Start the Super VM system
#   status   - Check system status

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

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
    echo -e "${MAGENTA}$1${NC}"
}

# Check if we're in the right directory
check_directory() {
    if [ ! -f "cluster-manager/package.json" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    cd cluster-manager
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing Node.js dependencies..."
        npm install
        print_success "Dependencies installed"
    else
        print_status "Dependencies already installed"
    fi
    
    cd ..
}

# Quick component test
quick_test() {
    print_header "Running Quick Component Tests"
    
    cd cluster-manager
    
    if [ -f "quick-test.js" ]; then
        print_status "Running quick component validation..."
        node quick-test.js
    else
        print_error "Quick test file not found"
        return 1
    fi
    
    cd ..
}

# Check system status
check_status() {
    print_header "Checking System Status"
    
    # Check if Node.js is available
    if command -v node &> /dev/null; then
        print_success "Node.js is available: $(node --version)"
    else
        print_error "Node.js is not installed"
        return 1
    fi
    
    # Check if npm is available
    if command -v npm &> /dev/null; then
        print_success "npm is available: $(npm --version)"
    else
        print_error "npm is not installed"
        return 1
    fi
    
    # Check if Docker is available
    if command -v docker &> /dev/null; then
        print_success "Docker is available: $(docker --version)"
    else
        print_warning "Docker is not installed (required for full functionality)"
    fi
    
    # Check if the cluster manager is running
    if curl -s http://localhost:3000/api/health &> /dev/null; then
        print_success "Cluster manager is running on port 3000"
        
        # Get Super VM status
        SUPER_VM_STATUS=$(curl -s http://localhost:3000/api/super-vm/status 2>/dev/null || echo "{}")
        if echo "$SUPER_VM_STATUS" | grep -q "ready"; then
            print_success "Super VM is ready"
        else
            print_warning "Super VM is not ready"
        fi
    else
        print_warning "Cluster manager is not running"
    fi
}

# Start the system
start_system() {
    print_header "Starting Super VM System"
    
    if [ -f "cluster-manager/start-super-vm.sh" ]; then
        print_status "Starting Super VM system..."
        ./cluster-manager/start-super-vm.sh
    else
        print_error "Start script not found"
        return 1
    fi
}

# Full system test
full_test() {
    print_header "Running Full System Tests"
    
    # Check if system is running
    if ! curl -s http://localhost:3000/api/health &> /dev/null; then
        print_error "System is not running. Please start it first with: ./test-super-vm.sh start"
        return 1
    fi
    
    cd cluster-manager
    
    if [ -f "test-super-vm.js" ]; then
        print_status "Running full system tests..."
        node test-super-vm.js
    else
        print_error "Full test file not found"
        return 1
    fi
    
    cd ..
}

# Manual API tests
manual_api_tests() {
    print_header "Manual API Tests"
    
    BASE_URL="http://localhost:3000"
    
    print_status "Testing health endpoint..."
    if curl -s "$BASE_URL/api/health" | grep -q "healthy"; then
        print_success "Health endpoint working"
    else
        print_error "Health endpoint failed"
    fi
    
    print_status "Testing Super VM status..."
    if curl -s "$BASE_URL/api/super-vm/status" | grep -q "status"; then
        print_success "Super VM status endpoint working"
    else
        print_error "Super VM status endpoint failed"
    fi
    
    print_status "Testing resource pool..."
    if curl -s "$BASE_URL/api/super-vm/resources" | grep -q "totalCPU"; then
        print_success "Resource pool endpoint working"
    else
        print_error "Resource pool endpoint failed"
    fi
    
    print_status "Testing data processing..."
    PROCESS_RESULT=$(curl -s -X POST "$BASE_URL/api/super-vm/process" \
        -H "Content-Type: application/json" \
        -d '{"inputData":[5,2,8,1,9],"operation":"sort"}' 2>/dev/null || echo "{}")
    
    if echo "$PROCESS_RESULT" | grep -q "success"; then
        print_success "Data processing endpoint working"
    else
        print_error "Data processing endpoint failed"
    fi
}

# Show usage
show_usage() {
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  quick    - Run quick component tests only"
    echo "  full     - Run full system tests (requires system to be running)"
    echo "  install  - Install dependencies and setup"
    echo "  start    - Start the Super VM system"
    echo "  status   - Check system status"
    echo "  api      - Run manual API tests"
    echo "  help     - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install    # Install dependencies"
    echo "  $0 quick      # Run quick tests"
    echo "  $0 start      # Start the system"
    echo "  $0 status     # Check status"
    echo "  $0 api        # Test API endpoints"
}

# Main script logic
main() {
    check_directory
    
    case "${1:-help}" in
        "install")
            install_dependencies
            ;;
        "quick")
            quick_test
            ;;
        "full")
            full_test
            ;;
        "start")
            start_system
            ;;
        "status")
            check_status
            ;;
        "api")
            manual_api_tests
            ;;
        "help"|*)
            show_usage
            ;;
    esac
}

# Run main function
main "$@" 