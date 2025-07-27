// test/test-key-manager.js
//
// Description: Comprehensive test suite for SSH Key Management System
//
// This test suite validates all aspects of the key management system including:
// - Key generation with custom names
// - Key validation for different formats
// - Backup functionality
// - Multi-key support
// - Error handling
// - File permissions
//
// Inputs: None (creates test keys)
// Outputs: Test results and validation
//
// Dependencies:
//   - config/keys/keyManager.js
//   - fs (file system operations)
//   - path (path utilities)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the key manager
import keyManager from '../config/keys/keyManager.js';

// Test configuration
const TEST_KEYS = ['test-key-1', 'test-key-2', 'test-key-3'];
const TEST_DIR = path.join(__dirname, 'test-keys');

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

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, passed, details = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? 'green' : 'red';
    log(`${status} ${testName}${details ? ` - ${details}` : ''}`, color);
}

// Test utilities
function cleanupTestKeys() {
    try {
        if (fs.existsSync(TEST_DIR)) {
            fs.rmSync(TEST_DIR, { recursive: true, force: true });
        }
    } catch (error) {
        console.warn('Cleanup warning:', error.message);
    }
}

function setupTestEnvironment() {
    try {
        if (!fs.existsSync(TEST_DIR)) {
            fs.mkdirSync(TEST_DIR, { recursive: true });
        }
    } catch (error) {
        console.error('Setup error:', error.message);
        throw error;
    }
}

// Test 1: Basic Key Manager Initialization
function testKeyManagerInitialization() {
    log('\n🔧 Test 1: Key Manager Initialization', 'cyan');
    
    try {
        // Test that keyManager is properly imported
        if (keyManager && typeof keyManager === 'object') {
            logTest('Key Manager Import', true);
        } else {
            logTest('Key Manager Import', false, 'keyManager is not properly imported');
            return false;
        }

        // Test that required methods exist
        const requiredMethods = [
            'generateKey', 'validateKeyPair', 'getPublicKey', 'getPrivateKey',
            'listKeys', 'getKeysInfo', 'backupKeys', 'keysExist', 'getKeyPaths'
        ];

        let allMethodsExist = true;
        requiredMethods.forEach(method => {
            if (typeof keyManager[method] !== 'function') {
                logTest(`Method ${method}`, false, 'Method not found');
                allMethodsExist = false;
            }
        });

        if (allMethodsExist) {
            logTest('Required Methods', true, `${requiredMethods.length} methods found`);
        }

        // Test keys directory
        if (keyManager.keysDir && fs.existsSync(keyManager.keysDir)) {
            logTest('Keys Directory', true, keyManager.keysDir);
        } else {
            logTest('Keys Directory', false, 'Keys directory not found or invalid');
            return false;
        }

        return true;
    } catch (error) {
        logTest('Key Manager Initialization', false, error.message);
        return false;
    }
}

// Test 2: Key Generation
async function testKeyGeneration() {
    log('\n🔑 Test 2: Key Generation', 'cyan');
    
    try {
        setupTestEnvironment();
        
        // Test generating a single key
        const result = await keyManager.generateKey('test-single-key');
        
        if (result.success) {
            logTest('Single Key Generation', true, result.privateKeyPath);
            
            // Verify files exist
            const privateKeyExists = fs.existsSync(result.privateKeyPath);
            const publicKeyExists = fs.existsSync(result.publicKeyPath);
            
            logTest('Private Key File', privateKeyExists, result.privateKeyPath);
            logTest('Public Key File', publicKeyExists, result.publicKeyPath);
            
            // Test key content
            const privateKey = fs.readFileSync(result.privateKeyPath, 'utf8');
            const publicKey = fs.readFileSync(result.publicKeyPath, 'utf8');
            
            const hasPrivateKeyHeader = privateKey.includes('-----BEGIN') && 
                                      (privateKey.includes('RSA PRIVATE KEY') || 
                                       privateKey.includes('OPENSSH PRIVATE KEY'));
            const hasPublicKeyHeader = publicKey.startsWith('ssh-rsa ');
            
            logTest('Private Key Format', hasPrivateKeyHeader, 'Valid PEM/OpenSSH format');
            logTest('Public Key Format', hasPublicKeyHeader, 'Valid SSH public key format');
            
        } else {
            logTest('Single Key Generation', false, result.error);
            return false;
        }

        return true;
    } catch (error) {
        logTest('Key Generation', false, error.message);
        return false;
    }
}

// Test 3: Multi-Key Generation
async function testMultiKeyGeneration() {
    log('\n🔑🔑 Test 3: Multi-Key Generation', 'cyan');
    
    try {
        const results = [];
        
        // Generate multiple keys
        for (const keyName of TEST_KEYS) {
            const result = await keyManager.generateKey(keyName);
            results.push({ keyName, result });
            
            if (result.success) {
                logTest(`Generate ${keyName}`, true, result.privateKeyPath);
            } else {
                logTest(`Generate ${keyName}`, false, result.error);
                return false;
            }
        }

        // Test listing all keys
        const keyGroups = keyManager.listKeys();
        const testKeysFound = TEST_KEYS.every(keyName => 
            keyGroups.some(group => group.name === keyName)
        );
        
        logTest('Multi-Key Listing', testKeysFound, `Found ${keyGroups.length} key groups`);

        // Test keys info
        const keysInfo = keyManager.getKeysInfo();
        const testKeysInfo = keysInfo.filter(info => TEST_KEYS.includes(info.name));
        
        logTest('Keys Info', testKeysInfo.length === TEST_KEYS.length, 
                `${testKeysInfo.length}/${TEST_KEYS.length} keys have info`);

        return true;
    } catch (error) {
        logTest('Multi-Key Generation', false, error.message);
        return false;
    }
}

// Test 4: Key Validation
async function testKeyValidation() {
    log('\n🔍 Test 4: Key Validation', 'cyan');
    
    try {
        // Test validation for each test key
        for (const keyName of TEST_KEYS) {
            const validation = keyManager.validateKeyPair(keyName);
            
            if (validation.valid) {
                logTest(`Validate ${keyName}`, true, 'Key pair is valid');
                
                // Test individual key retrieval
                const publicKey = keyManager.getPublicKey(keyName);
                const privateKey = keyManager.getPrivateKey(keyName);
                
                logTest(`Get Public Key ${keyName}`, !!publicKey, 
                        publicKey ? `${publicKey.substring(0, 20)}...` : 'No public key');
                logTest(`Get Private Key ${keyName}`, !!privateKey, 
                        privateKey ? 'Private key retrieved' : 'No private key');
                
            } else {
                logTest(`Validate ${keyName}`, false, validation.error);
                return false;
            }
        }

        // Test validation of non-existent key
        const nonExistentValidation = keyManager.validateKeyPair('non-existent-key');
        logTest('Non-existent Key Validation', !nonExistentValidation.valid, 
                'Correctly reports non-existent key as invalid');

        return true;
    } catch (error) {
        logTest('Key Validation', false, error.message);
        return false;
    }
}

// Test 5: Key Backup Functionality
async function testKeyBackup() {
    log('\n💾 Test 5: Key Backup Functionality', 'cyan');
    
    try {
        // Test backup of existing key
        const backupResult = keyManager.backupKeys(TEST_KEYS[0]);
        
        if (backupResult.success) {
            logTest('Key Backup', true, backupResult.backupPath);
            
            // Verify backup files exist
            const backupPrivateKey = path.join(backupResult.backupPath, `${TEST_KEYS[0]}.pem`);
            const backupPublicKey = path.join(backupResult.backupPath, `${TEST_KEYS[0]}.pub`);
            
            const backupPrivateExists = fs.existsSync(backupPrivateKey);
            const backupPublicExists = fs.existsSync(backupPublicKey);
            
            logTest('Backup Private Key', backupPrivateExists, backupPrivateKey);
            logTest('Backup Public Key', backupPublicExists, backupPublicKey);
            
        } else {
            logTest('Key Backup', false, backupResult.error);
            return false;
        }

        // Test backup of non-existent key
        const nonExistentBackup = keyManager.backupKeys('non-existent-key');
        logTest('Non-existent Key Backup', !nonExistentBackup.success, 
                'Correctly reports no keys to backup');

        return true;
    } catch (error) {
        logTest('Key Backup', false, error.message);
        return false;
    }
}

// Test 6: File Permissions
function testFilePermissions() {
    log('\n🔐 Test 6: File Permissions', 'cyan');
    
    try {
        const keyName = TEST_KEYS[0];
        const keyPaths = keyManager.getKeyPaths(keyName);
        
        // Check private key permissions (should be 600)
        const privateKeyStats = fs.statSync(keyPaths.privateKey);
        const privateKeyMode = privateKeyStats.mode & 0o777;
        const privateKeyCorrect = privateKeyMode === 0o600;
        
        logTest('Private Key Permissions', privateKeyCorrect, 
                `Mode: ${privateKeyMode.toString(8)} (should be 600)`);
        
        // Check public key permissions (should be 644)
        const publicKeyStats = fs.statSync(keyPaths.publicKey);
        const publicKeyMode = publicKeyStats.mode & 0o777;
        const publicKeyCorrect = publicKeyMode === 0o644;
        
        logTest('Public Key Permissions', publicKeyCorrect, 
                `Mode: ${publicKeyMode.toString(8)} (should be 644)`);

        return privateKeyCorrect && publicKeyCorrect;
    } catch (error) {
        logTest('File Permissions', false, error.message);
        return false;
    }
}

// Test 7: Error Handling
function testErrorHandling() {
    log('\n⚠️ Test 7: Error Handling', 'cyan');
    
    try {
        // Test getting public key of non-existent key
        const nonExistentPublicKey = keyManager.getPublicKey('non-existent-key');
        logTest('Non-existent Public Key', nonExistentPublicKey === null, 
                'Returns null for non-existent key');
        
        // Test getting private key of non-existent key
        const nonExistentPrivateKey = keyManager.getPrivateKey('non-existent-key');
        logTest('Non-existent Private Key', nonExistentPrivateKey === null, 
                'Returns null for non-existent key');
        
        // Test keysExist for non-existent key
        const nonExistentExists = keyManager.keysExist('non-existent-key');
        logTest('Non-existent Keys Exist', !nonExistentExists, 
                'Correctly reports non-existent keys as not existing');

        return true;
    } catch (error) {
        logTest('Error Handling', false, error.message);
        return false;
    }
}

// Test 8: Key Paths and Utilities
function testKeyPathsAndUtilities() {
    log('\n🗂️ Test 8: Key Paths and Utilities', 'cyan');
    
    try {
        const keyName = TEST_KEYS[0];
        
        // Test getKeyPaths
        const keyPaths = keyManager.getKeyPaths(keyName);
        const expectedKeys = ['privateKey', 'publicKey', 'directory', 'keyName'];
        
        const hasAllKeys = expectedKeys.every(key => key in keyPaths);
        logTest('Get Key Paths', hasAllKeys, 
                `Keys: ${Object.keys(keyPaths).join(', ')}`);
        
        // Test default key paths
        const defaultPaths = keyManager.getDefaultKeyPaths();
        logTest('Default Key Paths', !!defaultPaths, 
                `Default key: ${defaultPaths.keyName}`);
        
        // Test keysExist
        const exists = keyManager.keysExist(keyName);
        logTest('Keys Exist Check', exists, `Key ${keyName} exists`);

        return true;
    } catch (error) {
        logTest('Key Paths and Utilities', false, error.message);
        return false;
    }
}

// Main test runner
async function runAllTests() {
    log('\n🚀 Starting SSH Key Manager Test Suite', 'magenta');
    log('=====================================', 'magenta');
    
    const tests = [
        { name: 'Key Manager Initialization', fn: testKeyManagerInitialization },
        { name: 'Key Generation', fn: testKeyGeneration },
        { name: 'Multi-Key Generation', fn: testMultiKeyGeneration },
        { name: 'Key Validation', fn: testKeyValidation },
        { name: 'Key Backup Functionality', fn: testKeyBackup },
        { name: 'File Permissions', fn: testFilePermissions },
        { name: 'Error Handling', fn: testErrorHandling },
        { name: 'Key Paths and Utilities', fn: testKeyPathsAndUtilities }
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (const test of tests) {
        try {
            const result = await test.fn();
            if (result) passedTests++;
        } catch (error) {
            logTest(test.name, false, `Test failed with error: ${error.message}`);
        }
    }

    // Summary
    log('\n📊 Test Summary', 'cyan');
    log('==============', 'cyan');
    log(`Total Tests: ${totalTests}`, 'blue');
    log(`Passed: ${passedTests}`, passedTests === totalTests ? 'green' : 'yellow');
    log(`Failed: ${totalTests - passedTests}`, passedTests === totalTests ? 'green' : 'red');
    
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);
    log(`Success Rate: ${successRate}%`, passedTests === totalTests ? 'green' : 'yellow');

    if (passedTests === totalTests) {
        log('\n🎉 All tests passed! SSH Key Manager is working correctly.', 'green');
    } else {
        log('\n⚠️ Some tests failed. Please review the output above.', 'yellow');
    }

    // Cleanup
    cleanupTestKeys();
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests().catch(error => {
        log(`\n❌ Test suite failed: ${error.message}`, 'red');
        process.exit(1);
    });
}

export {
    testKeyManagerInitialization,
    testKeyGeneration,
    testMultiKeyGeneration,
    testKeyValidation,
    testKeyBackup,
    testFilePermissions,
    testErrorHandling,
    testKeyPathsAndUtilities,
    runAllTests
}; 