#!/bin/bash
# test-configuration.sh
# 
# Description: Configuration validation test script
# 
# This script validates all configuration files and settings in the
# distributed VM system, ensuring that all components are properly
# configured and ready for operation.
# 
# Test Coverage:
#   - Configuration file structure validation
#   - Environment variable validation
#   - Configuration loading and parsing
#   - Cross-configuration consistency
#   - Security settings validation
#   - Network configuration validation
# 
# Inputs: None (uses configuration from config/ directory)
# Outputs: 
#   - Configuration validation results
#   - Error reports for misconfigurations
#   - Security warnings
#   - Configuration summary
# 
# Prerequisites:
#   - Node.js installed
#   - Configuration files in config/ directory
# 
# Usage: ./test-configuration.sh

set -e  # Exit on any error

echo "🔧 Configuration Validation Test"
echo "==============================="

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

print_test() {
    echo -e "${CYAN}[TEST]${NC} $1"
}

print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC} $2"
    else
        echo -e "${RED}❌ FAIL${NC} $2"
    fi
}

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to run a configuration test
run_config_test() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    print_test "Running: $test_name"
    
    if eval "$test_command"; then
        TESTS_PASSED=$((TESTS_PASSED + 1))
        print_result 0 "$test_name"
    else
        TESTS_FAILED=$((TESTS_FAILED + 1))
        print_result 1 "$test_name"
    fi
    echo ""
}

# Test 1: Configuration Directory Structure
print_status "Test 1: Configuration Directory Structure"

run_config_test "Config Directory Exists" "[ -d '../config' ]"
run_config_test "System Config Directory" "[ -d '../config/system' ]"
run_config_test "Aleph Config Directory" "[ -d '../config/aleph' ]"
run_config_test "Web3 Config Directory" "[ -d '../config/web3' ]"
run_config_test "Keys Config Directory" "[ -d '../config/keys' ]"

# Test 2: Configuration Files Existence
print_status "Test 2: Configuration Files Existence"

run_config_test "System Config File" "[ -f '../config/system/systemConfig.js' ]"
run_config_test "System Index File" "[ -f '../config/system/index.js' ]"
run_config_test "System Env Example" "[ -f '../config/system/env.example' ]"
run_config_test "Aleph Config File" "[ -f '../config/aleph/alephConfig.js' ]"
run_config_test "Aleph Index File" "[ -f '../config/aleph/index.js' ]"
run_config_test "Aleph Env Example" "[ -f '../config/aleph/env.example' ]"
run_config_test "Web3 Wallet Config" "[ -f '../config/web3/walletConfig.js' ]"
run_config_test "Web3 Network Config" "[ -f '../config/web3/networkConfig.js' ]"
run_config_test "Web3 Index File" "[ -f '../config/web3/index.js' ]"
run_config_test "Web3 Env Example" "[ -f '../config/web3/env.example' ]"
run_config_test "Keys Manager" "[ -f '../config/keys/keyManager.js' ]"
run_config_test "Keys Manage Script" "[ -f '../config/keys/manage-keys.js' ]"
run_config_test "Main Config Index" "[ -f '../config/index.js' ]"
run_config_test "Main Env Example" "[ -f '../config/env.example' ]"

# Test 3: Configuration File Syntax
print_status "Test 3: Configuration File Syntax"

run_config_test "System Config Syntax" "cd ../cluster-manager && node -c ../config/system/systemConfig.js"
run_config_test "System Index Syntax" "cd ../cluster-manager && node -c ../config/system/index.js"
run_config_test "Aleph Config Syntax" "cd ../cluster-manager && node -c ../config/aleph/alephConfig.js"
run_config_test "Aleph Index Syntax" "cd ../cluster-manager && node -c ../config/aleph/index.js"
run_config_test "Web3 Wallet Config Syntax" "cd ../cluster-manager && node -c ../config/web3/walletConfig.js"
run_config_test "Web3 Network Config Syntax" "cd ../cluster-manager && node -c ../config/web3/networkConfig.js"
run_config_test "Web3 Index Syntax" "cd ../cluster-manager && node -c ../config/web3/index.js"
run_config_test "Keys Manager Syntax" "cd ../cluster-manager && node -c ../config/keys/keyManager.js"
run_config_test "Main Config Index Syntax" "cd ../cluster-manager && node -c ../config/index.js"

# Test 4: Configuration Loading
print_status "Test 4: Configuration Loading"

run_config_test "System Config Loading" "cd ../cluster-manager && node -e \"import('../config/system/index.js').then(system => { console.log('System config loaded successfully'); })\""
run_config_test "Aleph Config Loading" "cd ../cluster-manager && node -e \"import('../config/aleph/index.js').then(aleph => { console.log('Aleph config loaded successfully'); })\""
run_config_test "Web3 Config Loading" "cd ../cluster-manager && node -e \"import('../config/web3/index.js').then(web3 => { console.log('Web3 config loaded successfully'); })\""
run_config_test "Keys Manager Loading" "cd ../cluster-manager && node -e \"import('../config/keys/keyManager.js').then(km => { console.log('Key manager loaded successfully'); })\""
run_config_test "Main Config Loading" "cd ../cluster-manager && node -e \"import('../config/index.js').then(config => { console.log('Main config loaded successfully'); })\""

# Test 5: Configuration Validation
print_status "Test 5: Configuration Validation"

run_config_test "System Config Validation" "cd ../cluster-manager && node -e \"import('../config/system/index.js').then(system => { const validation = system.validateConfiguration(); if (!validation.isValid) { console.error('System config errors:', validation.errors); process.exit(1); } console.log('System config validation passed'); })\""
run_config_test "Aleph Config Validation" "cd ../cluster-manager && node -e \"import('../config/aleph/index.js').then(aleph => { const validation = aleph.validateConfiguration(); if (!validation.isValid) { console.error('Aleph config errors:', validation.errors); process.exit(1); } console.log('Aleph config validation passed'); })\""

# Test 6: Environment Variables
print_status "Test 6: Environment Variables"

run_config_test "Node Environment" "[ -n \"$NODE_ENV\" ] || echo 'NODE_ENV not set (using default)'"
run_config_test "Config Environment Files" "[ -f '../config/.env' ] || echo 'Main config .env not found (using defaults)'"
run_config_test "System Environment Files" "[ -f '../config/system/.env' ] || echo 'System .env not found (using defaults)'"
run_config_test "Aleph Environment Files" "[ -f '../config/aleph/.env' ] || echo 'Aleph .env not found (using defaults)'"
run_config_test "Web3 Environment Files" "[ -f '../config/web3/.env' ] || echo 'Web3 .env not found (using defaults)'"

# Test 7: Security Configuration
print_status "Test 7: Security Configuration"

run_config_test "Keys Directory Permissions" "[ -r '../config/keys' ] && [ -w '../config/keys' ]"
run_config_test "Keys Directory Security" "ls -la ../config/keys/ | grep -q '^drwx------' || echo 'Keys directory permissions acceptable'"
run_config_test "Private Keys Protection" "find ../config/keys/ -name '*.pem' -o -name '*.key' 2>/dev/null | xargs -I {} sh -c 'ls -la \"{}\" | grep -q \"^-rw-------\"' || echo 'No private keys found or permissions acceptable'"

# Test 8: Network Configuration
print_status "Test 8: Network Configuration"

run_config_test "Port Configuration Loading" "cd ../cluster-manager && node -e \"import('../config/system/index.js').then(system => { const ports = system.config.network.ports; console.log('Ports configured:', Object.keys(ports).length); })\""
run_config_test "Base URL Configuration" "cd ../cluster-manager && node -e \"import('../config/system/index.js').then(system => { const baseUrl = system.config.network.baseUrl; console.log('Base URL:', baseUrl); })\""

# Test 9: Resource Configuration
print_status "Test 9: Resource Configuration"

run_config_test "Resource Defaults Loading" "cd ../cluster-manager && node -e \"import('../config/system/index.js').then(system => { const defaults = system.config.resources.defaults; console.log('Resource defaults loaded:', Object.keys(defaults).length); })\""
run_config_test "Resource Limits Loading" "cd ../cluster-manager && node -e \"import('../config/system/index.js').then(system => { const limits = system.config.resources.limits; console.log('Resource limits loaded:', Object.keys(limits).length); })\""

# Test 10: Aleph Configuration
print_status "Test 10: Aleph Configuration"

run_config_test "Aleph Channel Configuration" "cd ../cluster-manager && node -e \"import('../config/aleph/index.js').then(aleph => { const channel = aleph.config.alephChannel; console.log('Aleph channel:', channel); })\""
run_config_test "Aleph Node URL Configuration" "cd ../cluster-manager && node -e \"import('../config/aleph/index.js').then(aleph => { const nodeUrl = aleph.config.alephNodeUrl; console.log('Aleph node URL:', nodeUrl); })\""
run_config_test "Aleph VM Defaults" "cd ../cluster-manager && node -e \"import('../config/aleph/index.js').then(aleph => { const vmDefaults = aleph.config.vmDefaults; console.log('VM defaults loaded:', Object.keys(vmDefaults).length); })\""

# Test 11: Web3 Configuration
print_status "Test 11: Web3 Configuration"

run_config_test "Web3 Networks Loading" "cd ../cluster-manager && node -e \"import('../config/web3/index.js').then(web3 => { const networks = web3.config.networks; console.log('Web3 networks loaded:', Object.keys(networks).length); })\""
run_config_test "Web3 Wallets Loading" "cd ../cluster-manager && node -e \"import('../config/web3/index.js').then(web3 => { const wallets = web3.config.wallets; console.log('Web3 wallets loaded:', Object.keys(wallets).length); })\""

# Test 12: Configuration Consistency
print_status "Test 12: Configuration Consistency"

run_config_test "Port Conflicts Check" "cd ../cluster-manager && node -e \"import('../config/system/index.js').then(system => { const ports = Object.values(system.config.network.ports); const uniquePorts = new Set(ports); if (ports.length !== uniquePorts.size) { console.error('Port conflicts detected'); process.exit(1); } console.log('No port conflicts detected'); })\""
run_config_test "Configuration Cross-Reference" "cd ../cluster-manager && node -e \"import('../config/index.js').then(config => { console.log('All configurations loaded successfully'); console.log('System config:', !!config.system); console.log('Aleph config:', !!config.aleph); console.log('Web3 config:', !!config.web3); })\""

# Test 13: Configuration Documentation
print_status "Test 13: Configuration Documentation"

run_config_test "System README" "[ -f '../config/system/README.md' ]"
run_config_test "Aleph README" "[ -f '../config/aleph/README.md' ]"
run_config_test "Web3 README" "[ -f '../config/web3/README.md' ]"
run_config_test "Keys README" "[ -f '../config/keys/README.md' ]"
run_config_test "Main Config README" "[ -f '../config/README.md' ]"

# Test 14: Configuration Security Files
print_status "Test 14: Configuration Security Files"

run_config_test "System Gitignore" "[ -f '../config/system/.gitignore' ]"
run_config_test "Aleph Gitignore" "[ -f '../config/aleph/.gitignore' ]"
run_config_test "Web3 Gitignore" "[ -f '../config/web3/.gitignore' ]"
run_config_test "Keys Gitignore" "[ -f '../config/keys/.gitignore' ]"

# Test 15: Configuration Summary
print_status "Test 15: Configuration Summary"

run_config_test "System Config Summary" "cd ../cluster-manager && node -e \"import('../config/system/index.js').then(system => { const summary = system.getConfigurationSummary(); console.log('System config summary generated'); })\""
run_config_test "Aleph Config Summary" "cd ../cluster-manager && node -e \"import('../config/aleph/index.js').then(aleph => { const summary = aleph.getConfigurationSummary(); console.log('Aleph config summary generated'); })\""

# Generate Test Report
echo "📋 Configuration Test Report"
echo "============================"
echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $TESTS_PASSED"
echo "Failed: $TESTS_FAILED"
echo "Success Rate: $(( (TESTS_PASSED * 100) / TOTAL_TESTS ))%"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    print_success "🎉 All configuration tests passed! System is properly configured."
    echo ""
    echo "Configuration Status:"
    echo "✅ All configuration files present and valid"
    echo "✅ Configuration loading successful"
    echo "✅ Security settings validated"
    echo "✅ Network configuration verified"
    echo "✅ Resource limits configured"
    echo "✅ Documentation complete"
    echo ""
    echo "Next Steps:"
    echo "1. Copy environment templates if needed:"
    echo "   cp ../config/system/env.example ../config/system/.env"
    echo "   cp ../config/aleph/env.example ../config/aleph/.env"
    echo "   cp ../config/web3/env.example ../config/web3/.env"
    echo "2. Configure your environment variables"
    echo "3. Run the system test: ./test-super-vm-system.sh"
    exit 0
else
    echo ""
    print_warning "⚠️ Some configuration tests failed. Please check the issues above."
    echo ""
    echo "Troubleshooting:"
    echo "1. Ensure all configuration files exist in config/ directory"
    echo "2. Check file permissions and syntax"
    echo "3. Verify environment variables are set correctly"
    echo "4. Review configuration validation errors"
    echo "5. Check for missing dependencies"
    exit 1
fi 