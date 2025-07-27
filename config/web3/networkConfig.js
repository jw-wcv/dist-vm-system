// config/web3/networkConfig.js
// 
// Description: Blockchain Network Configuration for the distributed VM system
// 
// This module manages blockchain network configurations including RPC endpoints,
// chain IDs, explorers, and network-specific settings. It provides a centralized
// way to configure and manage multiple blockchain networks.
// 
// Features:
//   - Multi-network support (Ethereum, Polygon, Arbitrum, etc.)
//   - RPC endpoint management
//   - Network validation and health checks
//   - Gas estimation and fee management
//   - Network-specific configurations
// 
// Inputs: Environment variables and network configurations
// Outputs: Network configuration objects and connection status
// 
// Dependencies: 
//   - axios (for network health checks)
//   - Environment variables for RPC URLs

import axios from 'axios';

class NetworkConfig {
    constructor() {
        this.networks = new Map();
        this.healthStatus = new Map();
        this.initializeNetworks();
    }

    // Initialize supported networks
    initializeNetworks() {
        // Ethereum Mainnet
        this.networks.set('ethereum', {
            name: 'Ethereum',
            chainId: 1,
            rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/your-project-id',
            wsUrl: process.env.ETHEREUM_WS_URL || 'wss://mainnet.infura.io/ws/v3/your-project-id',
            explorer: 'https://etherscan.io',
            currency: 'ETH',
            decimals: 18,
            blockTime: 12,
            gasLimit: 21000,
            maxPriorityFee: '2', // Gwei
            maxFeePerGas: '50', // Gwei
            isTestnet: false
        });

        // Ethereum Goerli Testnet
        this.networks.set('ethereum-goerli', {
            name: 'Ethereum Goerli',
            chainId: 5,
            rpcUrl: process.env.ETHEREUM_GOERLI_RPC_URL || 'https://goerli.infura.io/v3/your-project-id',
            wsUrl: process.env.ETHEREUM_GOERLI_WS_URL || 'wss://goerli.infura.io/ws/v3/your-project-id',
            explorer: 'https://goerli.etherscan.io',
            currency: 'ETH',
            decimals: 18,
            blockTime: 12,
            gasLimit: 21000,
            maxPriorityFee: '1.5',
            maxFeePerGas: '30',
            isTestnet: true
        });

        // Polygon Mainnet
        this.networks.set('polygon', {
            name: 'Polygon',
            chainId: 137,
            rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
            wsUrl: process.env.POLYGON_WS_URL || 'wss://polygon-rpc.com',
            explorer: 'https://polygonscan.com',
            currency: 'MATIC',
            decimals: 18,
            blockTime: 2,
            gasLimit: 21000,
            maxPriorityFee: '30', // Gwei
            maxFeePerGas: '100', // Gwei
            isTestnet: false
        });

        // Polygon Mumbai Testnet
        this.networks.set('polygon-mumbai', {
            name: 'Polygon Mumbai',
            chainId: 80001,
            rpcUrl: process.env.POLYGON_MUMBAI_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
            wsUrl: process.env.POLYGON_MUMBAI_WS_URL || 'wss://rpc-mumbai.maticvigil.com',
            explorer: 'https://mumbai.polygonscan.com',
            currency: 'MATIC',
            decimals: 18,
            blockTime: 2,
            gasLimit: 21000,
            maxPriorityFee: '1',
            maxFeePerGas: '30',
            isTestnet: true
        });

        // Arbitrum One
        this.networks.set('arbitrum', {
            name: 'Arbitrum One',
            chainId: 42161,
            rpcUrl: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
            wsUrl: process.env.ARBITRUM_WS_URL || 'wss://arb1.arbitrum.io/ws',
            explorer: 'https://arbiscan.io',
            currency: 'ETH',
            decimals: 18,
            blockTime: 1,
            gasLimit: 21000,
            maxPriorityFee: '0.1',
            maxFeePerGas: '0.1',
            isTestnet: false
        });

        // Arbitrum Goerli
        this.networks.set('arbitrum-goerli', {
            name: 'Arbitrum Goerli',
            chainId: 421613,
            rpcUrl: process.env.ARBITRUM_GOERLI_RPC_URL || 'https://goerli-rollup.arbitrum.io/rpc',
            wsUrl: process.env.ARBITRUM_GOERLI_WS_URL || 'wss://goerli-rollup.arbitrum.io/ws',
            explorer: 'https://goerli.arbiscan.io',
            currency: 'ETH',
            decimals: 18,
            blockTime: 1,
            gasLimit: 21000,
            maxPriorityFee: '0.1',
            maxFeePerGas: '0.1',
            isTestnet: true
        });

        // Aleph Network
        this.networks.set('aleph', {
            name: 'Aleph Network',
            chainId: 'aleph',
            rpcUrl: process.env.ALEPH_RPC_URL || 'https://46.255.204.193',
            wsUrl: process.env.ALEPH_WS_URL || 'wss://46.255.204.193/ws',
            explorer: 'https://explorer.aleph.im',
            currency: 'ALEPH',
            decimals: 18,
            blockTime: 15,
            gasLimit: 21000,
            maxPriorityFee: '0',
            maxFeePerGas: '0',
            isTestnet: false
        });

        // Optimism
        this.networks.set('optimism', {
            name: 'Optimism',
            chainId: 10,
            rpcUrl: process.env.OPTIMISM_RPC_URL || 'https://mainnet.optimism.io',
            wsUrl: process.env.OPTIMISM_WS_URL || 'wss://mainnet.optimism.io',
            explorer: 'https://optimistic.etherscan.io',
            currency: 'ETH',
            decimals: 18,
            blockTime: 2,
            gasLimit: 21000,
            maxPriorityFee: '0.001',
            maxFeePerGas: '0.001',
            isTestnet: false
        });

        // Base
        this.networks.set('base', {
            name: 'Base',
            chainId: 8453,
            rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
            wsUrl: process.env.BASE_WS_URL || 'wss://mainnet.base.org',
            explorer: 'https://basescan.org',
            currency: 'ETH',
            decimals: 18,
            blockTime: 2,
            gasLimit: 21000,
            maxPriorityFee: '0.001',
            maxFeePerGas: '0.001',
            isTestnet: false
        });
    }

    // Get network configuration
    getNetwork(network) {
        return this.networks.get(network);
    }

    // Get all networks
    getAllNetworks() {
        return Array.from(this.networks.values());
    }

    // Get networks by type
    getNetworksByType(type) {
        return Array.from(this.networks.values()).filter(network => {
            switch (type) {
                case 'mainnet':
                    return !network.isTestnet;
                case 'testnet':
                    return network.isTestnet;
                case 'ethereum':
                    return network.name.toLowerCase().includes('ethereum');
                case 'polygon':
                    return network.name.toLowerCase().includes('polygon');
                case 'arbitrum':
                    return network.name.toLowerCase().includes('arbitrum');
                default:
                    return true;
            }
        });
    }

    // Check network health
    async checkNetworkHealth(network) {
        const config = this.networks.get(network);
        if (!config) {
            return { healthy: false, error: 'Network not found' };
        }

        try {
            const startTime = Date.now();
            const response = await axios.post(config.rpcUrl, {
                jsonrpc: '2.0',
                method: 'eth_blockNumber',
                params: [],
                id: 1
            }, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const responseTime = Date.now() - startTime;
            const isHealthy = response.status === 200 && response.data.result;

            this.healthStatus.set(network, {
                healthy: isHealthy,
                responseTime,
                lastChecked: new Date().toISOString(),
                blockNumber: isHealthy ? parseInt(response.data.result, 16) : null
            });

            return this.healthStatus.get(network);
        } catch (error) {
            this.healthStatus.set(network, {
                healthy: false,
                error: error.message,
                lastChecked: new Date().toISOString()
            });

            return this.healthStatus.get(network);
        }
    }

    // Check health of all networks
    async checkAllNetworksHealth() {
        const promises = Array.from(this.networks.keys()).map(network => 
            this.checkNetworkHealth(network)
        );

        const results = await Promise.allSettled(promises);
        return results.map((result, index) => {
            const network = Array.from(this.networks.keys())[index];
            return {
                network,
                status: result.status === 'fulfilled' ? result.value : { healthy: false, error: result.reason }
            };
        });
    }

    // Get gas estimation for network
    async estimateGas(network, transaction) {
        const config = this.networks.get(network);
        if (!config) {
            throw new Error('Network not found');
        }

        try {
            const response = await axios.post(config.rpcUrl, {
                jsonrpc: '2.0',
                method: 'eth_estimateGas',
                params: [transaction],
                id: 1
            }, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.error) {
                throw new Error(response.data.error.message);
            }

            return parseInt(response.data.result, 16);
        } catch (error) {
            throw new Error(`Gas estimation failed: ${error.message}`);
        }
    }

    // Get gas price for network
    async getGasPrice(network) {
        const config = this.networks.get(network);
        if (!config) {
            throw new Error('Network not found');
        }

        try {
            const response = await axios.post(config.rpcUrl, {
                jsonrpc: '2.0',
                method: 'eth_gasPrice',
                params: [],
                id: 1
            }, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.error) {
                throw new Error(response.data.error.message);
            }

            return parseInt(response.data.result, 16);
        } catch (error) {
            throw new Error(`Gas price fetch failed: ${error.message}`);
        }
    }

    // Get network status summary
    getNetworkStatus() {
        const status = {};
        for (const [network, config] of this.networks) {
            const health = this.healthStatus.get(network);
            status[network] = {
                name: config.name,
                chainId: config.chainId,
                currency: config.currency,
                isTestnet: config.isTestnet,
                healthy: health ? health.healthy : false,
                lastChecked: health ? health.lastChecked : null,
                responseTime: health ? health.responseTime : null,
                blockNumber: health ? health.blockNumber : null
            };
        }
        return status;
    }

    // Validate network configuration
    validateConfiguration() {
        const errors = [];
        const warnings = [];

        for (const [network, config] of this.networks) {
            if (!config.rpcUrl || config.rpcUrl.includes('your-project-id')) {
                warnings.push(`${network} RPC URL not configured or using default`);
            }

            if (!config.rpcUrl.startsWith('http')) {
                errors.push(`${network} RPC URL is invalid: ${config.rpcUrl}`);
            }
        }

        return { errors, warnings, isValid: errors.length === 0 };
    }

    // Add custom network
    addCustomNetwork(networkId, config) {
        if (this.networks.has(networkId)) {
            throw new Error(`Network ${networkId} already exists`);
        }

        // Validate required fields
        const requiredFields = ['name', 'chainId', 'rpcUrl', 'currency'];
        for (const field of requiredFields) {
            if (!config[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        this.networks.set(networkId, {
            ...config,
            decimals: config.decimals || 18,
            blockTime: config.blockTime || 12,
            gasLimit: config.gasLimit || 21000,
            isTestnet: config.isTestnet || false
        });

        console.log(`Custom network ${networkId} added successfully`);
    }

    // Remove custom network
    removeCustomNetwork(networkId) {
        if (!this.networks.has(networkId)) {
            throw new Error(`Network ${networkId} not found`);
        }

        // Don't allow removal of built-in networks
        const builtInNetworks = ['ethereum', 'polygon', 'arbitrum', 'aleph'];
        if (builtInNetworks.includes(networkId)) {
            throw new Error(`Cannot remove built-in network: ${networkId}`);
        }

        this.networks.delete(networkId);
        this.healthStatus.delete(networkId);
        console.log(`Custom network ${networkId} removed successfully`);
    }
}

// Create and export singleton instance
const networkConfig = new NetworkConfig();
export default networkConfig; 