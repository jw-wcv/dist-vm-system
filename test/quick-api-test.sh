#!/bin/bash
# quick-api-test.sh
# 
# Description: Quick API testing script for Super VM system
# 
# This script performs basic API endpoint testing to verify
# the Super VM system is working correctly.
# 
# Usage: ./quick-api-test.sh

echo "🔍 Quick API Test for Super VM System"
echo "====================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test counter
TESTS=0
PASSED=0
FAILED=0

# Test function
test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    
    TESTS=$((TESTS + 1))
    echo -n "Testing $name... "
    
    local response
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "http://localhost:3000$endpoint")
    else
        response=$(curl -s -w "%{http_code}" "http://localhost:3000$endpoint")
    fi
    
    local status_code="${response: -3}"
    local body="${response%???}"
    
    if [ "$status_code" = "200" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}❌ FAIL (HTTP $status_code)${NC}"
        echo "   Response: $body"
        FAILED=$((FAILED + 1))
    fi
}

# Check if cluster manager is running
echo "Checking if cluster manager is running..."
if ! curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${RED}❌ Cluster manager is not running on port 3000${NC}"
    echo "Please start the cluster manager first:"
    echo "  cd cluster-manager && node index.js"
    exit 1
fi

echo -e "${GREEN}✅ Cluster manager is running${NC}"
echo ""

# Run tests
echo "Running API tests..."
echo "==================="

test_endpoint "Health Check" "GET" "/api/health"
test_endpoint "Super VM Status" "GET" "/api/super-vm/status"
test_endpoint "Resources" "GET" "/api/super-vm/resources"
test_endpoint "Metrics" "GET" "/api/super-vm/metrics"
test_endpoint "VMs List" "GET" "/api/vms"
test_endpoint "Nodes List" "GET" "/api/nodes"
test_endpoint "Tasks List" "GET" "/api/tasks"

test_endpoint "Data Processing" "POST" "/api/super-vm/process" '{"inputData":[5,2,8,1,9],"operation":"sort","parameters":{"cpu":1,"memory":512}}'
test_endpoint "System Scaling" "POST" "/api/super-vm/scale" '{"nodes":1}'

echo ""
echo "Test Results"
echo "============"
echo "Total Tests: $TESTS"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All API tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start the dashboard: cd main-ui && npm run dev"
    echo "2. Open http://localhost:5173 in your browser"
    echo "3. Test the web interface"
else
    echo -e "\n${RED}⚠️ $FAILED tests failed. Please check the issues above.${NC}"
fi

echo ""
echo "System URLs:"
echo "- API: http://localhost:3000/api"
echo "- Health: http://localhost:3000/api/health"
echo "- Dashboard: http://localhost:5173 (if running)" 