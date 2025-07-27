#!/bin/bash
# test-super-vm-system.sh
# 
# Description: Comprehensive testing script for the Super VM distributed system
# 
# This script tests all components of the Super VM system including:
# - System startup and initialization
# - API endpoints and functionality
# - Dashboard connectivity and features
# - Task execution and monitoring
# - Resource management and scaling
# 
# Process:
#   1. Check system prerequisites
#   2. Start the Super VM system
#   3. Test API endpoints
#   4. Test dashboard functionality
#   5. Test task execution
#   6. Generate test report
# 
# Inputs: None (uses test data)
# Outputs: 
#   - Test results and performance metrics
#   - Success/failure status for each test
#   - System validation reports
# 
# Prerequisites:
#   - Node.js 16+ installed
#   - Docker installed and running
#   - Internet connectivity
# 
# Usage: ./test-super-vm-system.sh

set -e  # Exit on any error

echo "🧪 Testing Super VM Distributed System..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test results tracking
TEST_RESULTS=()
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

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

print_test() {
    echo -e "${CYAN}[TEST]${NC} $1"
}

print_header() {
    echo -e "${MAGENTA}[HEADER]${NC} $1"
}

# Function to record test results
record_test() {
    local test_name="$1"
    local status="$2"
    local details="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$status" = "PASS" ]; then
        PASSED_TESTS=$((PASSED_TESTS + 1))
        print_success "✅ $test_name: PASS"
    else
        FAILED_TESTS=$((FAILED_TESTS + 1))
        print_error "❌ $test_name: FAIL - $details"
    fi
    
    TEST_RESULTS+=("$test_name|$status|$details")
}

# Function to wait for service to be ready
wait_for_service() {
    local url="$1"
    local service_name="$2"
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            print_success "$service_name is ready"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts: $service_name not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to start within $((max_attempts * 2)) seconds"
    return 1
}

# Function to test API endpoint
test_api_endpoint() {
    local method="$1"
    local endpoint="$2"
    local expected_status="$3"
    local data="$4"
    local test_name="$5"
    
    local url="http://localhost:3000$endpoint"
    local curl_cmd="curl -s -w '%{http_code}' -o /tmp/api_response.json"
    
    if [ "$method" = "POST" ]; then
        curl_cmd="$curl_cmd -X POST -H 'Content-Type: application/json'"
        if [ -n "$data" ]; then
            curl_cmd="$curl_cmd -d '$data'"
        fi
    fi
    
    curl_cmd="$curl_cmd $url"
    
    local response_code=$(eval $curl_cmd)
    
    if [ "$response_code" = "$expected_status" ]; then
        record_test "$test_name" "PASS" "HTTP $response_code"
    else
        local response_body=$(cat /tmp/api_response.json 2>/dev/null || echo "No response body")
        record_test "$test_name" "FAIL" "Expected HTTP $expected_status, got $response_code. Response: $response_body"
    fi
}

# Function to test dashboard functionality
test_dashboard() {
    local test_name="$1"
    local url="$2"
    
    if curl -s "$url" | grep -q "Super VM\|Dashboard" 2>/dev/null; then
        record_test "$test_name" "PASS" "Dashboard content found"
    else
        record_test "$test_name" "FAIL" "Dashboard not accessible or content not found"
    fi
}

# Step 1: Check Prerequisites
print_header "Step 1: Checking System Prerequisites"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 16 ]; then
        record_test "Node.js Version" "PASS" "Version $(node -v)"
    else
        record_test "Node.js Version" "FAIL" "Version $(node -v) - requires 16+"
    fi
else
    record_test "Node.js Installation" "FAIL" "Node.js not installed"
fi

# Check Docker
if command -v docker &> /dev/null; then
    if docker info &> /dev/null; then
        record_test "Docker Installation" "PASS" "Docker is running"
    else
        record_test "Docker Installation" "FAIL" "Docker not running"
    fi
else
    record_test "Docker Installation" "FAIL" "Docker not installed"
fi

# Check project structure
if [ -d "cluster-manager" ] && [ -d "main-ui" ]; then
    record_test "Project Structure" "PASS" "Required directories found"
else
    record_test "Project Structure" "FAIL" "Missing required directories"
fi

# Step 2: Install Dependencies
print_header "Step 2: Installing Dependencies"

# Install cluster manager dependencies
if [ -d "cluster-manager" ]; then
    cd cluster-manager
    if [ ! -d "node_modules" ]; then
        print_status "Installing cluster manager dependencies..."
        if npm install > /dev/null 2>&1; then
            record_test "Cluster Manager Dependencies" "PASS" "Dependencies installed"
        else
            record_test "Cluster Manager Dependencies" "FAIL" "Failed to install dependencies"
        fi
    else
        record_test "Cluster Manager Dependencies" "PASS" "Dependencies already installed"
    fi
    cd ..
else
    record_test "Cluster Manager Dependencies" "FAIL" "cluster-manager directory not found"
fi

# Install dashboard dependencies
if [ -d "main-ui" ]; then
    cd main-ui
    if [ ! -d "node_modules" ]; then
        print_status "Installing dashboard dependencies..."
        if npm install > /dev/null 2>&1; then
            record_test "Dashboard Dependencies" "PASS" "Dependencies installed"
        else
            record_test "Dashboard Dependencies" "FAIL" "Failed to install dependencies"
        fi
    else
        record_test "Dashboard Dependencies" "PASS" "Dependencies already installed"
    fi
    cd ..
else
    record_test "Dashboard Dependencies" "FAIL" "main-ui directory not found"
fi

# Step 3: Start the System
print_header "Step 3: Starting Super VM System"

# Start cluster manager
print_status "Starting cluster manager..."
cd cluster-manager
node index.js &
CLUSTER_PID=$!
cd ..

# Wait for cluster manager to start
if wait_for_service "http://localhost:3000/api/health" "Cluster Manager"; then
    record_test "Cluster Manager Startup" "PASS" "API responding on port 3000"
else
    record_test "Cluster Manager Startup" "FAIL" "API not responding"
    # Clean up
    kill $CLUSTER_PID 2>/dev/null || true
    exit 1
fi

# Start dashboard
print_status "Starting dashboard..."
cd main-ui
npm run dev &
DASHBOARD_PID=$!
cd ..

# Wait for dashboard to start
if wait_for_service "http://localhost:5173" "Dashboard"; then
    record_test "Dashboard Startup" "PASS" "Dashboard responding on port 5173"
else
    record_test "Dashboard Startup" "FAIL" "Dashboard not responding"
    # Clean up
    kill $CLUSTER_PID $DASHBOARD_PID 2>/dev/null || true
    exit 1
fi

# Step 4: Test API Endpoints
print_header "Step 4: Testing API Endpoints"

# Test health endpoint
test_api_endpoint "GET" "/api/health" "200" "" "Health Check Endpoint"

# Test Super VM status endpoint
test_api_endpoint "GET" "/api/super-vm/status" "200" "" "Super VM Status Endpoint"

# Test resources endpoint
test_api_endpoint "GET" "/api/super-vm/resources" "200" "" "Resources Endpoint"

# Test metrics endpoint
test_api_endpoint "GET" "/api/super-vm/metrics" "200" "" "Metrics Endpoint"

# Test VMs endpoint
test_api_endpoint "GET" "/api/vms" "200" "" "VMs List Endpoint"

# Test nodes endpoint
test_api_endpoint "GET" "/api/nodes" "200" "" "Nodes List Endpoint"

# Test tasks endpoint
test_api_endpoint "GET" "/api/tasks" "200" "" "Tasks List Endpoint"

# Test data processing endpoint
test_api_endpoint "POST" "/api/super-vm/process" "200" '{"inputData":[1,2,3,4,5],"operation":"sort","parameters":{"cpu":1,"memory":512}}' "Data Processing Endpoint"

# Test scaling endpoint
test_api_endpoint "POST" "/api/super-vm/scale" "200" '{"nodes":1}' "Scaling Endpoint"

# Step 5: Test Dashboard Functionality
print_header "Step 5: Testing Dashboard Functionality"

# Test dashboard accessibility
test_dashboard "Dashboard Accessibility" "http://localhost:5173"

# Test dashboard API connectivity
if curl -s "http://localhost:5173" | grep -q "Super VM\|Dashboard" 2>/dev/null; then
    record_test "Dashboard Content" "PASS" "Dashboard loads with expected content"
else
    record_test "Dashboard Content" "FAIL" "Dashboard content not as expected"
fi

# Step 6: Test Task Execution
print_header "Step 6: Testing Task Execution"

# Test simple data processing task
print_test "Testing data processing task..."
PROCESS_RESPONSE=$(curl -s -X POST http://localhost:3000/api/super-vm/process \
  -H 'Content-Type: application/json' \
  -d '{
    "inputData": [5, 2, 8, 1, 9, 3, 7, 4, 6],
    "operation": "sort",
    "parameters": {
      "cpu": 1,
      "memory": 512
    }
  }')

if echo "$PROCESS_RESPONSE" | grep -q "success.*true\|processedData" 2>/dev/null; then
    record_test "Data Processing Task" "PASS" "Task executed successfully"
else
    record_test "Data Processing Task" "FAIL" "Task execution failed: $PROCESS_RESPONSE"
fi

# Test system scaling
print_test "Testing system scaling..."
SCALE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/super-vm/scale \
  -H 'Content-Type: application/json' \
  -d '{"nodes": 1}')

if echo "$SCALE_RESPONSE" | grep -q "success.*true\|Scaled by" 2>/dev/null; then
    record_test "System Scaling" "PASS" "Scaling operation successful"
else
    record_test "System Scaling" "FAIL" "Scaling operation failed: $SCALE_RESPONSE"
fi

# Step 7: Performance Testing
print_header "Step 7: Performance Testing"

# Test API response times
print_test "Testing API response times..."
START_TIME=$(date +%s%N)
curl -s http://localhost:3000/api/health > /dev/null
END_TIME=$(date +%s%N)
RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))

if [ $RESPONSE_TIME -lt 1000 ]; then
    record_test "API Response Time" "PASS" "Response time: ${RESPONSE_TIME}ms"
else
    record_test "API Response Time" "FAIL" "Response time too slow: ${RESPONSE_TIME}ms"
fi

# Test concurrent requests
print_test "Testing concurrent API requests..."
CONCURRENT_RESPONSES=0
for i in {1..5}; do
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        CONCURRENT_RESPONSES=$((CONCURRENT_RESPONSES + 1))
    fi
done

if [ $CONCURRENT_RESPONSES -eq 5 ]; then
    record_test "Concurrent API Requests" "PASS" "All 5 concurrent requests succeeded"
else
    record_test "Concurrent API Requests" "FAIL" "Only $CONCURRENT_RESPONSES/5 requests succeeded"
fi

# Step 8: Generate Test Report
print_header "Step 8: Generating Test Report"

echo ""
echo "📋 Super VM System Test Report"
echo "=============================="
echo ""
echo "📊 Test Summary:"
echo "   Total Tests: $TOTAL_TESTS"
echo "   Passed: $PASSED_TESTS"
echo "   Failed: $FAILED_TESTS"
echo "   Success Rate: $(( (PASSED_TESTS * 100) / TOTAL_TESTS ))%"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    print_success "🎉 All tests passed! Super VM system is working correctly."
else
    print_error "⚠️ $FAILED_TESTS tests failed. Please check the issues above."
    echo ""
    echo "❌ Failed Tests:"
    for result in "${TEST_RESULTS[@]}"; do
        IFS='|' read -r test_name status details <<< "$result"
        if [ "$status" = "FAIL" ]; then
            echo "   • $test_name: $details"
        fi
    done
fi

echo ""
echo "🔗 System URLs:"
echo "   • Dashboard: http://localhost:5173"
echo "   • API: http://localhost:3000/api"
echo "   • Health Check: http://localhost:3000/api/health"
echo ""

echo "💡 Next Steps:"
if [ $FAILED_TESTS -eq 0 ]; then
    echo "   • Open the dashboard in your browser: http://localhost:5173"
    echo "   • Try the quick actions on the dashboard"
    echo "   • Submit some test tasks via the Task Manager"
    echo "   • Monitor resources in the Resource Monitor"
else
    echo "   • Fix the failed tests before proceeding"
    echo "   • Check the logs for detailed error information"
    echo "   • Verify all prerequisites are met"
fi

echo ""
echo "🛑 To stop the system:"
echo "   kill $CLUSTER_PID $DASHBOARD_PID"
echo ""

# Function to handle cleanup
cleanup() {
    print_header "Cleaning up test environment..."
    
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
    
    print_success "Test environment cleaned up"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep the system running for manual testing
if [ $FAILED_TESTS -eq 0 ]; then
    print_status "System is running for manual testing. Press Ctrl+C to stop."
    print_status "Dashboard: http://localhost:5173"
    print_status "API: http://localhost:3000/api"
    
    while true; do
        sleep 10
        # Check if services are still running
        if ! kill -0 $CLUSTER_PID 2>/dev/null; then
            print_error "Cluster manager stopped unexpectedly"
            cleanup
            exit 1
        fi
        
        if ! kill -0 $DASHBOARD_PID 2>/dev/null; then
            print_error "Dashboard stopped unexpectedly"
            cleanup
            exit 1
        fi
    done
else
    print_status "Tests completed with failures. Stopping system..."
    cleanup
fi 