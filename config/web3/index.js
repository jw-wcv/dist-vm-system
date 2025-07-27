// config/web3/index.js
// 
// Description: Web3 Configuration Index for the distributed VM system
// 
// This file provides a centralized way to import all web3 configuration
// modules including wallet management and network configurations.
// It exports all web3 objects and provides a unified interface for
// accessing blockchain-related settings.
// 
// Usage:
//   import { walletConfig, networkConfig } from '../config/web3/index.js';
//   or
//   import web3Config from '../config/web3/index.js';
// 
// Inputs: None (imports from other web3 config files)
// Outputs: All web3 configuration objects and a unified web3 config object
// 
// Dependencies: 
//   - walletConfig.js (wallet management)
//   - networkConfig.js (network configurations)

import walletConfig from './walletConfig.js';
import networkConfig from './networkConfig.js';

// Unified web3 configuration object
export const web3Config = {
    wallet: walletConfig,
    network: networkConfig,
    
    // Convenience getters
    get wallets() {
        return this.wallet.getAllWallets();
    },
    
    get networks() {
        return this.network.getAllNetworks();
    },
    
    get mainnets() {
        return this.network.getNetworksByType('mainnet');
    },
    
    get testnets() {
        return this.network.getNetworksByType('testnet');
    },
    
    // Wallet convenience methods
    getWallet(network) {
        return this.wallet.getWallet(network);
    },
    
    getAddress(network) {
        return this.wallet.getAddress(network);
    },
    
    hasWallet(network) {
        return this.wallet.hasWallet(network);
    },
    
    // Network convenience methods
    getNetwork(network) {
        return this.network.getNetwork(network);
    },
    
    async checkNetworkHealth(network) {
        return await this.network.checkNetworkHealth(network);
    },
    
    async checkAllNetworksHealth() {
        return await this.network.checkAllNetworksHealth();
    },
    
    // Configuration validation
    validateConfiguration() {
        const walletValidation = this.wallet.validateConfiguration();
        const networkValidation = this.network.validateConfiguration();
        
        return {
            isValid: walletValidation.isValid && networkValidation.isValid,
            wallet: walletValidation,
            network: networkValidation,
            errors: [...walletValidation.errors, ...networkValidation.errors],
            warnings: [...walletValidation.warnings, ...networkValidation.warnings]
        };
    },
    
    // Get configuration summary
    getConfigurationSummary() {
        const wallets = this.wallet.exportWalletInfo();
        const networks = this.network.getNetworkStatus();
        const validation = this.validateConfiguration();
        
        return {
            wallets,
            networks,
            validation,
            timestamp: new Date().toISOString()
        };
    }
};

// Individual exports
export { walletConfig, networkConfig };

// Default export
export default web3Config; 