#!/usr/bin/env node
// config/keys/manage-keys.js
// 
// Description: SSH Key Management Script
// 
// This script provides a command-line interface for managing SSH keys
// in the distributed VM system. It allows users to generate, validate,
// backup, and manage their SSH keys easily.
// 
// Usage:
//   node manage-keys.js [command] [options]
// 
// Commands:
//   generate    - Generate new SSH key pair
//   validate    - Validate existing key pair
//   backup      - Backup existing keys
//   list        - List all keys in directory
//   info        - Show key information
// 
// Inputs: Command line arguments
// Outputs: Key management operations and results
// 
// Dependencies: 
//   - keyManager.js (key management utilities)

import keyManager from './keyManager.js';

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

function showHelp() {
    log('\n🔑 SSH Key Management Tool', 'magenta');
    log('==========================', 'magenta');
    log('\nUsage: node manage-keys.js [command] [keyName]', 'cyan');
    log('\nCommands:', 'cyan');
    log('  generate    - Generate new SSH key pair', 'blue');
    log('  validate    - Validate existing key pair', 'blue');
    log('  backup      - Backup existing keys', 'blue');
    log('  list        - List all keys in directory', 'blue');
    log('  info        - Show detailed key information', 'blue');
    log('  help        - Show this help message', 'blue');
    log('\nExamples:', 'cyan');
    log('  node manage-keys.js generate', 'blue');
    log('  node manage-keys.js generate worker-key', 'blue');
    log('  node manage-keys.js validate cluster-vm-key', 'blue');
    log('  node manage-keys.js backup', 'blue');
    log('  node manage-keys.js list', 'blue');
    log('  node manage-keys.js info', 'blue');
}

async function main() {
    const command = process.argv[2] || 'help';
    const keyName = process.argv[3] || 'cluster-vm-key'; // Default key name

    switch (command) {
        case 'generate':
            await generateKeys(keyName);
            break;
        case 'validate':
            await validateKeys(keyName);
            break;
        case 'backup':
            await backupKeys(keyName);
            break;
        case 'list':
            await listKeys();
            break;
        case 'info':
            await showKeyInfo();
            break;
        case 'help':
        default:
            showHelp();
            break;
    }
}

async function generateKeys(keyName = 'cluster-vm-key') {
    log(`\n🔑 Generating new SSH key pair: ${keyName}`, 'cyan');
    
    try {
        const result = await keyManager.generateKey(keyName);
        
        if (result.success) {
            log('✅ SSH key pair generated successfully!', 'green');
            log(`   Key name:    ${keyName}`, 'blue');
            log(`   Private key: ${result.privateKeyPath}`, 'blue');
            log(`   Public key:  ${result.publicKeyPath}`, 'blue');
            
            // Show public key content
            const publicKey = keyManager.getPublicKey(keyName);
            if (publicKey) {
                log('\n📋 Public key content:', 'cyan');
                log(publicKey, 'yellow');
            }
        } else {
            log(`❌ Failed to generate keys: ${result.error}`, 'red');
        }
    } catch (error) {
        log(`❌ Error generating keys: ${error.message}`, 'red');
    }
}

async function validateKeys(keyName = 'cluster-vm-key') {
    log(`\n🔍 Validating SSH key pair: ${keyName}`, 'cyan');
    
    try {
        const validation = keyManager.validateKeyPair(keyName);
        
        if (validation.valid) {
            log('✅ SSH key pair is valid!', 'green');
            log(`   Key name:    ${keyName}`, 'blue');
            log(`   Private key: ${validation.privateKeyPath}`, 'blue');
            log(`   Public key:  ${validation.publicKeyPath}`, 'blue');
            
            // Show key fingerprint
            const publicKey = keyManager.getPublicKey(keyName);
            if (publicKey) {
                log('\n📋 Public key fingerprint:', 'cyan');
                log(publicKey.split(' ')[1].substring(0, 20) + '...', 'yellow');
            }
        } else {
            log(`❌ SSH key pair is invalid: ${validation.error}`, 'red');
        }
    } catch (error) {
        log(`❌ Error validating keys: ${error.message}`, 'red');
    }
}

async function backupKeys(keyName = 'cluster-vm-key') {
    log(`\n💾 Backing up SSH keys: ${keyName}`, 'cyan');
    
    try {
        const result = keyManager.backupKeys(keyName);
        
        if (result.success) {
            log('✅ SSH keys backed up successfully!', 'green');
            log(`   Key name:        ${keyName}`, 'blue');
            log(`   Backup location: ${result.backupPath}`, 'blue');
        } else {
            log(`❌ Failed to backup keys: ${result.error}`, 'red');
        }
    } catch (error) {
        log(`❌ Error backing up keys: ${error.message}`, 'red');
    }
}

async function listKeys() {
    log('\n📁 Listing SSH keys...', 'cyan');
    
    try {
        const keyGroups = keyManager.listKeys();
        
        if (keyGroups.length === 0) {
            log('No SSH keys found in the directory.', 'yellow');
        } else {
            log(`Found ${keyGroups.length} key pair(s):`, 'green');
            keyGroups.forEach(group => {
                const status = group.files.length === 2 ? '✅ Complete' : '⚠️ Incomplete';
                log(`   ${group.name} (${status})`, 'blue');
                group.files.forEach(file => {
                    log(`     - ${file}`, 'cyan');
                });
            });
        }
    } catch (error) {
        log(`❌ Error listing keys: ${error.message}`, 'red');
    }
}

async function showKeyInfo() {
    log('\n📋 Detailed Key Information', 'cyan');
    log('==========================', 'cyan');
    
    try {
        const keysInfo = keyManager.getKeysInfo();
        
        if (keysInfo.length === 0) {
            log('No SSH keys found in the directory.', 'yellow');
            return;
        }
        
        log(`\n📁 Keys directory: ${keyManager.keysDir}`, 'blue');
        log(`📊 Total key pairs: ${keysInfo.length}`, 'blue');
        
        keysInfo.forEach(keyInfo => {
            log(`\n🔑 Key: ${keyInfo.name}`, 'magenta');
            log(`   Files: ${keyInfo.files.join(', ')}`, 'blue');
            log(`   Complete: ${keyInfo.isComplete ? '✅ Yes' : '❌ No'}`, keyInfo.isComplete ? 'green' : 'red');
            
            if (keyInfo.validation.valid) {
                log('   Status: ✅ Valid', 'green');
                log(`   Private key: ${keyInfo.validation.privateKeyPath}`, 'blue');
                log(`   Public key:  ${keyInfo.validation.publicKeyPath}`, 'blue');
                
                // Show first 50 characters of public key
                const publicKeyPreview = keyInfo.validation.publicKey.substring(0, 50) + '...';
                log(`   Public key preview: ${publicKeyPreview}`, 'cyan');
            } else {
                log(`   Status: ❌ Invalid - ${keyInfo.validation.error}`, 'red');
            }
        });
    } catch (error) {
        log(`❌ Error showing key info: ${error.message}`, 'red');
    }
}

// Run the script
main().catch(error => {
    log(`❌ Script failed: ${error.message}`, 'red');
    process.exit(1);
}); 