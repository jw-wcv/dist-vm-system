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
        this.keysDir = path.join(process.cwd(), 'config', 'keys');
        this.privateKeyPath = path.join(this.keysDir, 'cluster-vm-key.pem');
        this.publicKeyPath = path.join(this.keysDir, 'cluster-vm-key.pub');
    }

    // Ensure keys directory exists
    ensureKeysDirectory() {
        if (!fs.existsSync(this.keysDir)) {
            fs.mkdirSync(this.keysDir, { recursive: true });
            console.log(`Created keys directory: ${this.keysDir}`);
        }
    }

    // Check if keys exist
    keysExist() {
        return fs.existsSync(this.privateKeyPath) && fs.existsSync(this.publicKeyPath);
    }

    // Get key paths
    getKeyPaths() {
        return {
            privateKey: this.privateKeyPath,
            publicKey: this.publicKeyPath,
            directory: this.keysDir
        };
    }

    // Validate existing key pair
    validateKeyPair() {
        try {
            if (!this.keysExist()) {
                return { valid: false, error: 'Keys do not exist' };
            }

            const privateKey = fs.readFileSync(this.privateKeyPath, 'utf8');
            const publicKey = fs.readFileSync(this.publicKeyPath, 'utf8');

            // Basic validation
            if (!privateKey.includes('-----BEGIN RSA PRIVATE KEY-----')) {
                return { valid: false, error: 'Invalid private key format' };
            }

            if (!publicKey.startsWith('ssh-rsa ')) {
                return { valid: false, error: 'Invalid public key format' };
            }

            // Check permissions (Unix-like systems only)
            try {
                const privateKeyStats = fs.statSync(this.privateKeyPath);
                const publicKeyStats = fs.statSync(this.publicKeyPath);
                
                // Check if private key has restricted permissions (600)
                const privateKeyMode = privateKeyStats.mode & 0o777;
                if (privateKeyMode !== 0o600) {
                    console.warn('Private key has incorrect permissions. Setting to 600...');
                    fs.chmodSync(this.privateKeyPath, 0o600);
                }

                // Check if public key has correct permissions (644)
                const publicKeyMode = publicKeyStats.mode & 0o777;
                if (publicKeyMode !== 0o644) {
                    console.warn('Public key has incorrect permissions. Setting to 644...');
                    fs.chmodSync(this.publicKeyPath, 0o644);
                }
            } catch (error) {
                console.warn('Could not check/set permissions (this is normal on Windows):', error.message);
            }

            return { 
                valid: true, 
                privateKeyPath: this.privateKeyPath,
                publicKeyPath: this.publicKeyPath,
                publicKey: publicKey.trim()
            };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    // Backup existing keys
    backupKeys() {
        try {
            if (!this.keysExist()) {
                return { success: false, error: 'No keys to backup' };
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupDir = path.join(this.keysDir, 'backups', timestamp);
            
            fs.mkdirSync(backupDir, { recursive: true });
            
            fs.copyFileSync(this.privateKeyPath, path.join(backupDir, 'cluster-vm-key.pem'));
            fs.copyFileSync(this.publicKeyPath, path.join(backupDir, 'cluster-vm-key.pub'));
            
            console.log(`Keys backed up to: ${backupDir}`);
            return { success: true, backupPath: backupDir };
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
    getPublicKey() {
        try {
            if (!fs.existsSync(this.publicKeyPath)) {
                return null;
            }
            return fs.readFileSync(this.publicKeyPath, 'utf8').trim();
        } catch (error) {
            console.error('Error reading public key:', error.message);
            return null;
        }
    }

    // Get private key content
    getPrivateKey() {
        try {
            if (!fs.existsSync(this.privateKeyPath)) {
                return null;
            }
            return fs.readFileSync(this.privateKeyPath, 'utf8');
        } catch (error) {
            console.error('Error reading private key:', error.message);
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
            return files.filter(file => 
                file.endsWith('.pem') || 
                file.endsWith('.pub') || 
                file.endsWith('.key')
            );
        } catch (error) {
            console.error('Error listing keys:', error.message);
            return [];
        }
    }
}

// Create and export singleton instance
const keyManager = new KeyManager();
export default keyManager; 