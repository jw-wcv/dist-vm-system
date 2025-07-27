#!/bin/bash
# test/test-key-manager.sh
#
# Description: SSH Key Manager Test Runner
#
# This script runs the comprehensive SSH key manager test suite
# to validate all aspects of the key management system.
#
# Usage: ./test-key-manager.sh
#
# Inputs: None
# Outputs: Test results and validation
#
# Dependencies:
#   - test/test-key-manager.js
#   - config/keys/keyManager.js

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Print functions
print_header() {
    echo -e "${MAGENTA}$1${NC}"
}

print_status() {
    echo -e "${CYAN}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# Main execution
main() {
    print_header "SSH Key Manager Test Suite"
    print_header "=========================="
    echo ""

    # Check if we're in the right directory
    if [ ! -f "test-key-manager.js" ]; then
        print_error "Test file not found. Please run this script from the test directory."
        exit 1
    fi

    # Check if keyManager.js exists
    if [ ! -f "../config/keys/keyManager.js" ]; then
        print_error "Key manager not found. Please ensure config/keys/keyManager.js exists."
        exit 1
    fi

    print_status "Running SSH Key Manager Tests..."
    echo ""

    # Run the test suite
    if node test-key-manager.js; then
        echo ""
        print_success "SSH Key Manager test suite completed successfully!"
    else
        echo ""
        print_error "SSH Key Manager test suite failed!"
        exit 1
    fi
}

# Run main function
main "$@" 