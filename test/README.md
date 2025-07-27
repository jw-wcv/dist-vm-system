# Test Directory

This directory contains comprehensive testing scripts for the distributed VM system, designed to validate all components, configurations, and functionality.

## 🧪 Test Scripts Overview

### `test-super-vm-system.sh` - Comprehensive System Test

**Description**: End-to-end testing of the entire distributed VM system

- **Coverage**: System prerequisites, configuration, VM management, Super VM, API endpoints
- **Duration**: 5-10 minutes
- **Usage**: `./test-super-vm-system.sh`
- **Prerequisites**: Node.js, Docker, Internet connectivity

### `quick-api-test.sh` - API Endpoint Test

**Description**: Rapid testing of cluster manager API endpoints

- **Coverage**: API connectivity, endpoints, response validation, performance
- **Duration**: 1-2 minutes
- **Usage**: `./quick-api-test.sh`
- **Prerequisites**: Cluster manager running on port 3000, curl

### `test-configuration.sh` - Configuration Validation Test

**Description**: Comprehensive configuration file and settings validation

- **Coverage**: Config files, environment variables, security, consistency
- **Duration**: 2-3 minutes
- **Usage**: `./test-configuration.sh`
- **Prerequisites**: Node.js, configuration files in place

### `test-super-vm.sh` - Legacy Super VM Test

**Description**: Original Super VM testing script (legacy)

- **Coverage**: Basic Super VM functionality testing
- **Duration**: 2-3 minutes
- **Usage**: `./test-super-vm.sh`
- **Prerequisites**: Node.js, basic system setup

### `test-super-vm.js` - Node.js Super VM Test Suite

**Description**: Comprehensive Node.js test suite for Super VM

- **Coverage**: All Super VM components, API testing, performance validation
- **Duration**: 3-5 minutes
- **Usage**: `node test-super-vm.js`
- **Prerequisites**: Node.js, all dependencies installed

### `quick-test.js` - Quick Component Test

**Description**: Rapid validation of Super VM components

- **Coverage**: Module imports, basic functionality, component integration
- **Duration**: 30 seconds
- **Usage**: `node quick-test.js`
- **Prerequisites**: Node.js, basic dependencies

### `super-vm-example.js` - Super VM Examples

**Description**: Example usage and demonstration of Super VM features

- **Coverage**: Practical examples of distributed computing tasks
- **Duration**: 2-3 minutes
- **Usage**: `node super-vm-example.js`
- **Prerequisites**: Node.js, Super VM system running

### `MANUAL_TESTING_GUIDE.md` - Manual Testing Documentation

**Description**: Comprehensive guide for manual testing procedures

- **Coverage**: Step-by-step testing instructions, troubleshooting
- **Usage**: Reference document for manual testing
- **Prerequisites**: None (documentation only)

### `TESTING_SUMMARY.md` - Testing Summary Documentation

**Description**: Summary of all testing procedures and results

- **Coverage**: Test overview, results tracking, best practices
- **Usage**: Reference document for testing overview
- **Prerequisites**: None (documentation only)

### `test-key-manager.js` - SSH Key Manager Test Suite

**Description**: Comprehensive test suite for SSH key management system

- **Coverage**: Key generation, validation, backup, multi-key support, permissions, error handling
- **Duration**: 1-2 minutes
- **Usage**: `node test-key-manager.js` or `./test-key-manager.sh`
- **Prerequisites**: Node.js, config/keys/keyManager.js

### `test-key-manager.sh` - SSH Key Manager Test Runner

**Description**: Shell script to run SSH key manager tests

- **Coverage**: Automated test execution with colored output
- **Duration**: 1-2 minutes
- **Usage**: `./test-key-manager.sh`
- **Prerequisites**: Node.js, test-key-manager.js

## 🚀 Quick Start Testing

### 1. Configuration Test (Recommended First)

```bash
cd test
chmod +x test-configuration.sh
./test-configuration.sh
```

### 2. System Test (After Configuration)

```bash
chmod +x test-super-vm-system.sh
./test-super-vm-system.sh
```

### 3. API Test (After Starting Cluster Manager)

```bash
# First start the cluster manager
cd ../cluster-manager
npm start

# In another terminal, run API test
cd ../test
chmod +x quick-api-test.sh
./quick-api-test.sh
```

### 4. Node.js Component Tests

```bash
# Quick component validation
node quick-test.js

# Comprehensive Super VM test suite
node test-super-vm.js

# Super VM examples and demonstrations
node super-vm-example.js
```

### 5. SSH Key Manager Tests

```bash
# Run comprehensive key manager tests
./test-key-manager.sh

# Or run directly with Node.js
node test-key-manager.js
```

### 6. Legacy Tests (Optional)

```bash
# Legacy Super VM test script
chmod +x test-super-vm.sh
./test-super-vm.sh
```

## 📋 Test Coverage

### System Prerequisites

- ✅ Node.js installation and version
- ✅ npm availability
- ✅ Docker installation and running status
- ✅ Git installation
- ✅ curl availability
- ✅ Internet connectivity

### Configuration Validation

- ✅ Configuration directory structure
- ✅ Configuration file existence and syntax
- ✅ Configuration loading and parsing
- ✅ Environment variable validation
- ✅ Security settings validation
- ✅ Network configuration validation
- ✅ Cross-configuration consistency

### VM Management

- ✅ SSH key generation and management
- ✅ VM manager functionality
- ✅ VM instance creation and listing
- ✅ Aleph network integration

### Super VM Functionality

- ✅ Super VM initialization
- ✅ Distributed scheduler setup
- ✅ Resource pool management
- ✅ Task execution capabilities

### API Endpoints

- ✅ Health check endpoint
- ✅ Cluster status endpoint
- ✅ Super VM status and resources
- ✅ VM management endpoints
- ✅ Task management endpoints
- ✅ Node management endpoints
- ✅ Error handling and CORS

### Performance and Security

- ✅ Response time validation
- ✅ CORS headers verification
- ✅ File permissions validation
- ✅ Security configuration checks

## 🎯 Test Results

### Success Indicators

- **All tests passed**: System is ready for production use
- **Configuration tests passed**: System is properly configured
- **API tests passed**: Cluster manager is functioning correctly

### Common Issues and Solutions

#### Configuration Issues

```bash
# Missing configuration files
./test-configuration.sh
# Check output for missing files and create them

# Environment variables not set
cp ../config/system/env.example ../config/system/.env
cp ../config/aleph/env.example ../config/aleph/.env
cp ../config/web3/env.example ../config/web3/.env
```

#### System Issues

```bash
# Docker not running
sudo systemctl start docker
sudo systemctl enable docker

# Node.js version too old
# Install Node.js 16+ from https://nodejs.org/

# Port conflicts
# Check what's using port 3000: lsof -i :3000
# Kill conflicting process or change port in config
```

#### API Issues

```bash
# Cluster manager not running
cd ../cluster-manager
npm install
npm start

# Super VM not initialized
# Check cluster manager logs for initialization errors
# Ensure Aleph configuration is correct
```

## 🔧 Test Customization

### Environment Variables

Set these environment variables to customize test behavior:

```bash
export NODE_ENV=development
export TEST_TIMEOUT=30000
export API_BASE_URL=http://localhost:3000
```

### Test Selection

Run specific test categories by modifying the scripts:

```bash
# Test only configuration
./test-configuration.sh

# Test only API (requires cluster manager running)
./quick-api-test.sh

# Test everything
./test-super-vm-system.sh
```

## 📊 Test Reports

### Sample Success Report

```
📋 Test Report
=============
Total Tests: 45
Passed: 45
Failed: 0
Success Rate: 100%

🎉 All tests passed! System is ready for use.
```

### Sample Failure Report

```
📋 Test Report
=============
Total Tests: 45
Passed: 42
Failed: 3
Success Rate: 93%

⚠️ Some tests failed. Please check the issues above.
```

## 🛠️ Troubleshooting

### Debug Mode

Enable debug output by setting:

```bash
export DEBUG=true
./test-super-vm-system.sh
```

### Verbose Output

Get detailed test information:

```bash
export VERBOSE=true
./test-configuration.sh
```

### Test Logs

Test logs are saved to:

```bash
# System test logs
./test-super-vm-system.sh 2>&1 | tee test-system.log

# API test logs
./quick-api-test.sh 2>&1 | tee test-api.log

# Configuration test logs
./test-configuration.sh 2>&1 | tee test-config.log
```

## 🔄 Continuous Testing

### Automated Testing

Set up automated testing in CI/CD:

```bash
#!/bin/bash
# ci-test.sh
set -e

echo "Running configuration tests..."
./test-configuration.sh

echo "Running system tests..."
./test-super-vm-system.sh

echo "Starting cluster manager..."
cd ../cluster-manager
npm start &
CLUSTER_PID=$!

echo "Waiting for cluster manager to start..."
sleep 10

echo "Running API tests..."
cd ../test
./quick-api-test.sh

echo "Stopping cluster manager..."
kill $CLUSTER_PID

echo "All tests completed successfully!"
```

### Pre-commit Testing

Add to your pre-commit hooks:

```bash
#!/bin/bash
# .git/hooks/pre-commit
cd test
./test-configuration.sh
```

## 📈 Performance Testing

### Load Testing

Test system performance under load:

```bash
# Test API response times
for i in {1..100}; do
  curl -s -w "%{time_total}\n" -o /dev/null http://localhost:3000/api/health
done | awk '{sum+=$1} END {print "Average response time:", sum/NR "s"}'
```

### Stress Testing

Test system limits:

```bash
# Concurrent API requests
for i in {1..50}; do
  curl -s http://localhost:3000/api/super-vm/status &
done
wait
```

## 🔒 Security Testing

### Security Validation

The configuration test includes security checks:

- ✅ File permissions validation
- ✅ Private key protection
- ✅ Environment variable security
- ✅ Network security settings

### Security Best Practices

```bash
# Check for exposed secrets
grep -r "password\|secret\|key" ../config/ --exclude="*.example" --exclude="*.md"

# Validate SSL certificates (if using HTTPS)
openssl x509 -in ../config/system/ssl/cert.pem -text -noout

# Check for weak permissions
find ../config/ -type f -exec ls -la {} \; | grep -E "^-rw-rw-rw-|^-rwxrwxrwx"
```

## 📚 Additional Resources

### Manual Testing Guide

For manual testing procedures, see the main project documentation.

### API Documentation

API endpoint documentation is available in the cluster manager README.

### Configuration Guide

Detailed configuration documentation is available in each config directory.

## 🤝 Contributing

### Adding New Tests

To add new tests:

1. **Create test script** in the test directory
2. **Follow naming convention**: `test-{component}.sh`
3. **Include proper documentation** in script header
4. **Add to README** with description and usage
5. **Update main test script** to include new test

### Test Script Template

```bash
#!/bin/bash
# test-{component}.sh
#
# Description: Brief description of what this test does
#
# Test Coverage:
#   - What this test covers
#
# Inputs: What inputs the test expects
# Outputs: What outputs the test produces
#
# Prerequisites: What needs to be available
#
# Usage: ./test-{component}.sh

set -e

# Colors and functions (copy from existing scripts)
# Test implementation
# Report generation
```

### Reporting Issues

When reporting test failures:

1. **Include test output** with error messages
2. **Specify environment** (OS, Node.js version, etc.)
3. **Provide reproduction steps**
4. **Include relevant configuration** (without secrets)
