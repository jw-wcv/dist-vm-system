// config/web3/walletConfig.js
// 
// Description: Web3 Wallet Configuration for the distributed VM system
// 
// This module securely manages wallet configurations for various blockchain
// networks including Ethereum, Aleph, and other supported networks. It
// provides a centralized way to handle private keys, addresses, and network
// configurations without exposing sensitive data in the main environment.
// 
// Features:
//   - Secure private key management
//   - Multi-network wallet support
//   - Address derivation and validation
//   - Network-specific configurations
//   - Environment variable abstraction
// 
// Inputs: Environment variables and wallet files
// Outputs: Configured wallet objects and network settings
// 
// Dependencies: 
//   - @aleph-sdk/ethereum (Aleph account management)
//   - crypto (for address validation)
//   - fs (file system operations)

import { importAccountFromPrivateKey } from '@aleph-sdk/ethereum';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

class WalletConfig {
    constructor() {
        this.wallets = new Map();
        this.networks = new Map();
        this.initializeNetworks();
    }

    // Initialize supported networks
    initializeNetworks() {
        this.networks.set('ethereum', {
            name: 'Ethereum',
            chainId: 1,
            rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/your-project-id',
            explorer: 'https://etherscan.io',
            currency: 'ETH',
            decimals: 18
        });

        this.networks.set('aleph', {
            name: 'Aleph Network',
            chainId: 'aleph',
            rpcUrl: process.env.ALEPH_RPC_URL || 'https://46.255.204.193',
            explorer: 'https://explorer.aleph.im',
            currency: 'ALEPH',
            decimals: 18
        });

        this.networks.set('polygon', {
            name: 'Polygon',
            chainId: 137,
            rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
            explorer: 'https://polygonscan.com',
            currency: 'MATIC',
            decimals: 18
        });

        this.networks.set('arbitrum', {
            name: 'Arbitrum One',
            chainId: 42161,
            rpcUrl: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
            explorer: 'https://arbiscan.io',
            currency: 'ETH',
            decimals: 18
        });
    }

    // Load wallet from environment variable
    loadWalletFromEnv(network, envKey) {
        try {
            const privateKey = process.env[envKey];
            if (!privateKey) {
                console.warn(`No private key found for ${network} in environment variable ${envKey}`);
                return null;
            }

            return this.createWallet(network, privateKey);
        } catch (error) {
            console.error(`Error loading ${network} wallet from environment:`, error.message);
            return null;
        }
    }

    // Load wallet from file
    loadWalletFromFile(network, filePath) {
        try {
            if (!fs.existsSync(filePath)) {
                console.warn(`Wallet file not found: ${filePath}`);
                return null;
            }

            const privateKey = fs.readFileSync(filePath, 'utf8').trim();
            return this.createWallet(network, privateKey);
        } catch (error) {
            console.error(`Error loading ${network} wallet from file:`, error.message);
            return null;
        }
    }

    // Create wallet object
    createWallet(network, privateKey) {
        try {
            // Remove common prefixes
            const cleanPrivateKey = privateKey.replace(/^0x/, '').replace(/^0X/, '');
            
            // Validate private key format
            if (!this.isValidPrivateKey(cleanPrivateKey)) {
                throw new Error('Invalid private key format');
            }

            let wallet;
            switch (network) {
                case 'aleph':
                    wallet = importAccountFromPrivateKey(cleanPrivateKey);
                    break;
                case 'ethereum':
                case 'polygon':
                case 'arbitrum':
                    wallet = this.createEthereumWallet(cleanPrivateKey);
                    break;
                default:
                    throw new Error(`Unsupported network: ${network}`);
            }

            const walletInfo = {
                network,
                address: wallet.address,
                privateKey: cleanPrivateKey,
                publicKey: wallet.publicKey,
                type: network === 'aleph' ? 'aleph' : 'ethereum',
                createdAt: new Date().toISOString()
            };

            this.wallets.set(network, walletInfo);
            console.log(`Wallet loaded for ${network}: ${walletInfo.address}`);
            
            return walletInfo;
        } catch (error) {
            console.error(`Error creating ${network} wallet:`, error.message);
            return null;
        }
    }

    // Create Ethereum-compatible wallet
    createEthereumWallet(privateKey) {
        // For Ethereum networks, we'll use a simple address derivation
        // In a production environment, you might want to use ethers.js or web3.js
        const publicKey = crypto.createPublicKey({
            key: Buffer.from(privateKey, 'hex'),
            format: 'der',
            type: 'sec1'
        });

        const address = this.deriveAddress(publicKey.export({ format: 'der', type: 'spki' }));
        
        return {
            address,
            publicKey: publicKey.export({ format: 'der', type: 'spki' }).toString('hex')
        };
    }

    // Derive Ethereum address from public key
    deriveAddress(publicKey) {
        const hash = crypto.createHash('sha256').update(publicKey).digest();
        const ripemd160 = crypto.createHash('ripemd160').update(hash).digest();
        
        // Add version byte (0x00 for mainnet)
        const versioned = Buffer.concat([Buffer.from([0x00]), ripemd160]);
        
        // Double SHA256 for checksum
        const checksum = crypto.createHash('sha256')
            .update(crypto.createHash('sha256').update(versioned).digest())
            .digest()
            .slice(0, 4);
        
        // Combine and encode as base58
        const binaryAddr = Buffer.concat([versioned, checksum]);
        return this.base58Encode(binaryAddr);
    }

    // Base58 encoding (simplified)
    base58Encode(buffer) {
        const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        let num = BigInt('0x' + buffer.toString('hex'));
        let str = '';
        
        while (num > 0) {
            str = alphabet[Number(num % 58n)] + str;
            num = num / 58n;
        }
        
        // Add leading zeros
        for (let i = 0; i < buffer.length && buffer[i] === 0; i++) {
            str = '1' + str;
        }
        
        return str;
    }

    // Validate private key format
    isValidPrivateKey(privateKey) {
        // Check if it's a valid hex string of correct length
        if (!/^[0-9a-fA-F]{64}$/.test(privateKey)) {
            return false;
        }
        
        // Check if it's not zero or all ones
        const key = BigInt('0x' + privateKey);
        return key > 0n && key < BigInt('0x' + 'f'.repeat(64));
    }

    // Get wallet for specific network
    getWallet(network) {
        return this.wallets.get(network);
    }

    // Get all wallets
    getAllWallets() {
        return Array.from(this.wallets.values());
    }

    // Get network configuration
    getNetwork(network) {
        return this.networks.get(network);
    }

    // Get all networks
    getAllNetworks() {
        return Array.from(this.networks.values());
    }

    // Check if wallet exists for network
    hasWallet(network) {
        return this.wallets.has(network);
    }

    // Get wallet address for network
    getAddress(network) {
        const wallet = this.wallets.get(network);
        return wallet ? wallet.address : null;
    }

    // Get private key for network (use with caution)
    getPrivateKey(network) {
        const wallet = this.wallets.get(network);
        return wallet ? wallet.privateKey : null;
    }

    // Validate wallet configuration
    validateConfiguration() {
        const errors = [];
        const warnings = [];

        // Check for required wallets
        if (!this.hasWallet('aleph')) {
            errors.push('Aleph wallet is required but not configured');
        }

        // Check network configurations
        for (const [network, config] of this.networks) {
            if (!config.rpcUrl || config.rpcUrl.includes('your-project-id')) {
                warnings.push(`${network} RPC URL not configured or using default`);
            }
        }

        return { errors, warnings, isValid: errors.length === 0 };
    }

    // Export wallet info (without private keys)
    exportWalletInfo() {
        const info = {};
        for (const [network, wallet] of this.wallets) {
            info[network] = {
                address: wallet.address,
                network: wallet.network,
                type: wallet.type,
                createdAt: wallet.createdAt
            };
        }
        return info;
    }
}

// Create and export singleton instance
const walletConfig = new WalletConfig();

// Auto-load wallets from environment variables
if (process.env.ALEPH_ACCOUNT_PRIVATE_KEY) {
    walletConfig.loadWalletFromEnv('aleph', 'ALEPH_ACCOUNT_PRIVATE_KEY');
}

if (process.env.ETHEREUM_PRIVATE_KEY) {
    walletConfig.loadWalletFromEnv('ethereum', 'ETHEREUM_PRIVATE_KEY');
}

if (process.env.POLYGON_PRIVATE_KEY) {
    walletConfig.loadWalletFromEnv('polygon', 'POLYGON_PRIVATE_KEY');
}

if (process.env.ARBITRUM_PRIVATE_KEY) {
    walletConfig.loadWalletFromEnv('arbitrum', 'ARBITRUM_PRIVATE_KEY');
}

export default walletConfig; 