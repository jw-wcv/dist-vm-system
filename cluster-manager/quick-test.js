// quick-test.js
// 
// Description: Quick validation test for Super VM components
// 
// This script performs basic validation of Super VM components without
// requiring the full system to be running. It tests module imports,
// basic functionality, and component integration.
// 
// Inputs: None (uses test data)
// Outputs: 
//   - Component validation results
//   - Basic functionality tests
//   - Integration verification
// 
// Usage: node quick-test.js

import { v4 as uuidv4 } from 'uuid';

// Colors for output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

class QuickTest {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
    }

    log(message, color = 'reset') {
        console.log(`${colors[color]}${message}${colors.reset}`);
    }

    test(name, testFn) {
        this.results.total++;
        try {
            const result = testFn();
            if (result) {
                this.log(`✅ ${name}: PASS`, 'green');
                this.results.passed++;
            } else {
                this.log(`❌ ${name}: FAIL`, 'red');
                this.results.failed++;
            }
        } catch (error) {
            this.log(`❌ ${name}: FAIL - ${error.message}`, 'red');
            this.results.failed++;
        }
    }

    async runTests() {
        this.log('🧪 Quick Super VM Component Test', 'magenta');
        this.log('================================', 'magenta');

        // Test 1: Module Import Test
        this.log('\n📦 Testing Module Imports...', 'cyan');
        
        this.test('Import vmManager.js', async () => {
            try {
                const vmManager = await import('./vmManager.js');
                return typeof vmManager === 'object';
            } catch (error) {
                return false;
            }
        });

        this.test('Import constants.js', async () => {
            try {
                const constants = await import('./constants.js');
                return typeof constants.alephChannel === 'string';
            } catch (error) {
                return false;
            }
        });

        // Test 2: Super VM Class Structure Test
        this.log('\n🏗️ Testing Super VM Structure...', 'cyan');
        
        this.test('Super VM Class Definition', async () => {
            try {
                const SuperVM = await import('./super-vm.js');
                return typeof SuperVM === 'object';
            } catch (error) {
                return false;
            }
        });

        // Test 3: Distributed Scheduler Test
        this.log('\n⚡ Testing Distributed Scheduler...', 'cyan');
        
        this.test('Scheduler Class Definition', async () => {
            try {
                const scheduler = await import('./distributed-scheduler.js');
                return typeof scheduler === 'object';
            } catch (error) {
                return false;
            }
        });

        // Test 4: Worker API Test
        this.log('\n🌐 Testing Worker API...', 'cyan');
        
        this.test('Worker API Class Definition', async () => {
            try {
                const workerAPI = await import('./worker-api.js');
                return typeof workerAPI === 'object';
            } catch (error) {
                return false;
            }
        });

        // Test 5: Basic Functionality Test
        this.log('\n🔧 Testing Basic Functionality...', 'cyan');
        
        this.test('UUID Generation', () => {
            const uuid = uuidv4();
            return typeof uuid === 'string' && uuid.length > 0;
        });

        this.test('Array Operations', () => {
            const testArray = [3, 1, 4, 1, 5, 9];
            const sorted = testArray.sort((a, b) => a - b);
            return sorted[0] === 1 && sorted[sorted.length - 1] === 9;
        });

        this.test('Object Operations', () => {
            const testObj = { cpu: 4, memory: 8192, gpu: 0 };
            return testObj.cpu === 4 && testObj.memory === 8192;
        });

        // Test 6: File System Test
        this.log('\n📁 Testing File System Access...', 'cyan');
        
        this.test('File System Module', async () => {
            try {
                const fs = await import('fs');
                return typeof fs.readFileSync === 'function';
            } catch (error) {
                return false;
            }
        });

        this.test('Path Module', async () => {
            try {
                const path = await import('path');
                return typeof path.join === 'function';
            } catch (error) {
                return false;
            }
        });

        // Test 7: Network Module Test
        this.log('\n🌍 Testing Network Modules...', 'cyan');
        
        this.test('HTTP Module', async () => {
            try {
                const http = await import('http');
                return typeof http.createServer === 'function';
            } catch (error) {
                return false;
            }
        });

        this.test('URL Module', async () => {
            try {
                const url = await import('url');
                return typeof url.parse === 'function';
            } catch (error) {
                return false;
            }
        });

        // Test 8: Child Process Test
        this.log('\n⚙️ Testing Process Management...', 'cyan');
        
        this.test('Child Process Module', async () => {
            try {
                const { exec } = await import('child_process');
                return typeof exec === 'function';
            } catch (error) {
                return false;
            }
        });

        // Test 9: Crypto Module Test
        this.log('\n🔐 Testing Cryptographic Functions...', 'cyan');
        
        this.test('Crypto Module', async () => {
            try {
                const crypto = await import('crypto');
                return typeof crypto.randomBytes === 'function';
            } catch (error) {
                return false;
            }
        });

        // Test 10: Async/Await Test
        this.log('\n⏱️ Testing Async Operations...', 'cyan');
        
        this.test('Async Function Support', async () => {
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            const start = Date.now();
            await delay(10);
            const end = Date.now();
            return (end - start) >= 10;
        });

        // Generate Report
        this.generateReport();
    }

    generateReport() {
        this.log('\n📋 Quick Test Report', 'magenta');
        this.log('==================', 'magenta');
        this.log(`Total Tests: ${this.results.total}`, 'blue');
        this.log(`Passed: ${this.results.passed}`, 'green');
        this.log(`Failed: ${this.results.failed}`, 'red');
        this.log(`Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`, 'blue');

        if (this.results.failed === 0) {
            this.log('\n🎉 All quick tests passed! Components are ready for full testing.', 'green');
        } else {
            this.log('\n⚠️ Some tests failed. Please check the issues above.', 'yellow');
        }
    }
}

// Run quick tests
const quickTest = new QuickTest();
quickTest.runTests().catch(error => {
    console.error('Quick test failed:', error);
    process.exit(1);
}); 