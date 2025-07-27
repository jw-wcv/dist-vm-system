// config/keys/keyManager.js
// 
// Description: SSH Key Management Utility
// 
// This module provides utilities for managing SSH keys in the distributed VM system.
// It handles key generation, validation, storage, and retrieval operations.
// 
// Functions:
//   - generateKeyPair(): Creates new RSA key pair
//   - validateKeyPair(): Validates existing key pair
//   - getKeyPaths(): Returns paths to key files
//   - backupKeys(): Creates backup of existing keys
//   - rotateKeys(): Handles key rotation process
// 
// Inputs: None (uses file system operations)
// Outputs: Key management operations and validation results
// 
// Dependencies: 
//   - fs (file system operations)
//   - path (path utilities)
//   - child_process (system commands)

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class KeyManager {
    constructor() {
        // Get the directory where keyManager.js is located
        const currentDir = path.dirname(new URL(import.meta.url).pathname);
        this.keysDir = currentDir;
        this.defaultKeyName = 'cluster-vm-key';
        this.privateKeyPath = path.join(this.keysDir, `${this.defaultKeyName}.pem`);
        this.publicKeyPath = path.join(this.keysDir, `${this.defaultKeyName}.pub`);
    }

    // Ensure keys directory exists
    ensureKeysDirectory() {
        if (!fs.existsSync(this.keysDir)) {
            fs.mkdirSync(this.keysDir, { recursive: true });
            console.log(`Created keys directory: ${this.keysDir}`);
        }
    }

    // Check if keys exist
    keysExist(keyName = this.defaultKeyName) {
        const privateKeyPath = path.join(this.keysDir, `${keyName}.pem`);
        const publicKeyPath = path.join(this.keysDir, `${keyName}.pub`);
        return fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath);
    }

    // Get key paths for a specific key
    getKeyPaths(keyName = this.defaultKeyName) {
        return {
            privateKey: path.join(this.keysDir, `${keyName}.pem`),
            publicKey: path.join(this.keysDir, `${keyName}.pub`),
            directory: this.keysDir,
            keyName: keyName
        };
    }

    // Get default key paths (backward compatibility)
    getDefaultKeyPaths() {
        return this.getKeyPaths(this.defaultKeyName);
    }

    // Validate existing key pair
    validateKeyPair(keyName = this.defaultKeyName) {
        try {
            if (!this.keysExist(keyName)) {
                return { valid: false, error: `Keys for '${keyName}' do not exist` };
            }

            const keyPaths = this.getKeyPaths(keyName);
            const privateKey = fs.readFileSync(keyPaths.privateKey, 'utf8');
            const publicKey = fs.readFileSync(keyPaths.publicKey, 'utf8');

            // Basic validation - support both RSA and OpenSSH formats
            if (!privateKey.includes('-----BEGIN RSA PRIVATE KEY-----') && 
                !privateKey.includes('-----BEGIN OPENSSH PRIVATE KEY-----')) {
                return { valid: false, error: 'Invalid private key format' };
            }

            if (!publicKey.startsWith('ssh-rsa ')) {
                return { valid: false, error: 'Invalid public key format' };
            }

            // Check permissions (Unix-like systems only)
            try {
                const privateKeyStats = fs.statSync(keyPaths.privateKey);
                const publicKeyStats = fs.statSync(keyPaths.publicKey);
                
                // Check if private key has restricted permissions (600)
                const privateKeyMode = privateKeyStats.mode & 0o777;
                if (privateKeyMode !== 0o600) {
                    console.warn(`Private key '${keyName}' has incorrect permissions. Setting to 600...`);
                    fs.chmodSync(keyPaths.privateKey, 0o600);
                }

                // Check if public key has correct permissions (644)
                const publicKeyMode = publicKeyStats.mode & 0o777;
                if (publicKeyMode !== 0o644) {
                    console.warn(`Public key '${keyName}' has incorrect permissions. Setting to 644...`);
                    fs.chmodSync(keyPaths.publicKey, 0o644);
                }
            } catch (error) {
                console.warn('Could not check/set permissions (this is normal on Windows):', error.message);
            }

            return { 
                valid: true, 
                privateKeyPath: keyPaths.privateKey,
                publicKeyPath: keyPaths.publicKey,
                publicKey: publicKey.trim(),
                keyName: keyName
            };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    // Backup existing keys
    backupKeys(keyName = this.defaultKeyName) {
        try {
            if (!this.keysExist(keyName)) {
                return { success: false, error: `No keys for '${keyName}' to backup` };
            }

            const keyPaths = this.getKeyPaths(keyName);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupDir = path.join(this.keysDir, 'backups', timestamp);
            
            fs.mkdirSync(backupDir, { recursive: true });
            
            fs.copyFileSync(keyPaths.privateKey, path.join(backupDir, `${keyName}.pem`));
            fs.copyFileSync(keyPaths.publicKey, path.join(backupDir, `${keyName}.pub`));
            
            console.log(`Keys for '${keyName}' backed up to: ${backupDir}`);
            return { success: true, backupPath: backupDir, keyName: keyName };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Generate new key pair using ssh-keygen
    generateKeyPairWithSSHKeygen() {
        try {
            this.ensureKeysDirectory();
            
            // Backup existing keys if they exist
            if (this.keysExist()) {
                this.backupKeys();
            }

            // Generate new key pair
            const keyPath = path.join(this.keysDir, 'cluster-vm-key');
            execSync(`ssh-keygen -t rsa -b 4096 -C "ALEPH_VM_ACCESS" -f "${keyPath}" -N ""`, { stdio: 'inherit' });

            // Rename files to standard names
            if (fs.existsSync(keyPath)) {
                fs.renameSync(keyPath, this.privateKeyPath);
            }
            if (fs.existsSync(`${keyPath}.pub`)) {
                fs.renameSync(`${keyPath}.pub`, this.publicKeyPath);
            }

            // Set permissions
            try {
                execSync(`chmod 600 "${this.privateKeyPath}"`);
                execSync(`chmod 644 "${this.publicKeyPath}"`);
            } catch (error) {
                console.warn('Could not set key permissions (this is normal on Windows):', error.message);
            }

            console.log('SSH key pair generated successfully using ssh-keygen');
            return { success: true, privateKeyPath: this.privateKeyPath, publicKeyPath: this.publicKeyPath };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get public key content
    getPublicKey(keyName = this.defaultKeyName) {
        try {
            const keyPaths = this.getKeyPaths(keyName);
            if (!fs.existsSync(keyPaths.publicKey)) {
                return null;
            }
            return fs.readFileSync(keyPaths.publicKey, 'utf8').trim();
        } catch (error) {
            console.error(`Error reading public key '${keyName}':`, error.message);
            return null;
        }
    }

    // Get private key content
    getPrivateKey(keyName = this.defaultKeyName) {
        try {
            const keyPaths = this.getKeyPaths(keyName);
            if (!fs.existsSync(keyPaths.privateKey)) {
                return null;
            }
            return fs.readFileSync(keyPaths.privateKey, 'utf8');
        } catch (error) {
            console.error(`Error reading private key '${keyName}':`, error.message);
            return null;
        }
    }

    // List all keys in directory
    listKeys() {
        try {
            if (!fs.existsSync(this.keysDir)) {
                return [];
            }

            const files = fs.readdirSync(this.keysDir);
            const keyFiles = files.filter(file => 
                file.endsWith('.pem') || 
                file.endsWith('.pub') || 
                file.endsWith('.key')
            );

            // Group by key name (remove extension)
            const keyGroups = {};
            keyFiles.forEach(file => {
                const keyName = file.replace(/\.(pem|pub|key)$/, '');
                if (!keyGroups[keyName]) {
                    keyGroups[keyName] = { name: keyName, files: [] };
                }
                keyGroups[keyName].files.push(file);
            });

            return Object.values(keyGroups);
        } catch (error) {
            console.error('Error listing keys:', error.message);
            return [];
        }
    }

    // Get detailed information about all keys
    getKeysInfo() {
        try {
            const keyGroups = this.listKeys();
            const keysInfo = [];

            keyGroups.forEach(group => {
                const keyInfo = {
                    name: group.name,
                    files: group.files,
                    hasPrivateKey: group.files.some(f => f.endsWith('.pem')),
                    hasPublicKey: group.files.some(f => f.endsWith('.pub')),
                    isComplete: group.files.some(f => f.endsWith('.pem')) && group.files.some(f => f.endsWith('.pub')),
                    validation: this.validateKeyPair(group.name)
                };
                keysInfo.push(keyInfo);
            });

            return keysInfo;
        } catch (error) {
            console.error('Error getting keys info:', error.message);
            return [];
        }
    }

    // Generate a new key with custom name
    async generateKey(keyName = 'cluster-vm-key') {
        try {
            this.ensureKeysDirectory();
            
            // Update paths for custom key name
            this.privateKeyPath = path.join(this.keysDir, `${keyName}.pem`);
            this.publicKeyPath = path.join(this.keysDir, `${keyName}.pub`);
            
            // Backup existing keys if they exist
            if (this.keysExist()) {
                this.backupKeys();
            }

            // Generate new key pair
            const keyPath = path.join(this.keysDir, keyName);
            execSync(`ssh-keygen -t rsa -b 4096 -C "ALEPH_VM_ACCESS" -f "${keyPath}" -N ""`, { stdio: 'inherit' });

            // Rename files to standard names
            if (fs.existsSync(keyPath)) {
                fs.renameSync(keyPath, this.privateKeyPath);
            }
            if (fs.existsSync(`${keyPath}.pub`)) {
                fs.renameSync(`${keyPath}.pub`, this.publicKeyPath);
            }

            // Set permissions
            try {
                execSync(`chmod 600 "${this.privateKeyPath}"`);
                execSync(`chmod 644 "${this.publicKeyPath}"`);
            } catch (error) {
                console.warn('Could not set key permissions (this is normal on Windows):', error.message);
            }

            console.log(`SSH key pair '${keyName}' generated successfully`);
            return { success: true, privateKeyPath: this.privateKeyPath, publicKeyPath: this.publicKeyPath };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Create and export singleton instance
const keyManager = new KeyManager();
export default keyManager; 