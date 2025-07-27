// config/aleph/alephConfig.js
// 
// Description: Aleph Network Configuration for the distributed VM system
// 
// This module provides Aleph-specific configuration including VM settings,
// network parameters, and Aleph account management. It's designed to be
// separate from general web3 configurations to maintain clear separation
// of concerns.
// 
// Features:
//   - Aleph account management
//   - VM instance configuration
//   - Network channel settings
//   - Scheduler and node URLs
//   - Aleph-specific environment variables
// 
// Inputs: Environment variables and web3 wallet configuration
// Outputs: Configured Aleph account and network settings
// 
// Dependencies:
//   - @aleph-sdk/ethereum (account management)
//   - web3Config (wallet management)
//   - Environment variables for configuration

import { web3Config } from '../web3/index.js';

// Get Aleph account from web3 configuration
let alephAccount = null;
try {
    if (web3Config.wallet.hasWallet('aleph')) {
        const alephWallet = web3Config.wallet.getWallet('aleph');
        // Import account using the private key from web3 config
        const { importAccountFromPrivateKey } = await import("@aleph-sdk/ethereum");
        alephAccount = importAccountFromPrivateKey(alephWallet.privateKey);
        console.log('Aleph account loaded successfully from web3 config');
    } else {
        console.warn("No Aleph wallet found in web3 configuration - using unauthenticated mode");
    }
} catch (error) {
    console.error('Failed to load Aleph account from web3 config:', error.message);
}

export const alephConfig = {
    // Account configuration
    alephAccount,
    
    // Network configuration
    alephChannel: process.env.ALEPH_CHANNEL || "ALEPH-CLOUDSOLUTIONS",
    alephNodeUrl: process.env.ALEPH_NODE_URL || "https://46.255.204.193",
    alephWsUrl: process.env.ALEPH_WS_URL || "wss://46.255.204.193/ws",
    
    // VM configuration
    alephImage: process.env.ALEPH_IMAGE || "4a0f62da42f4478544616519e6f5d58adb1096e069b392b151d47c3609492d0c",
    schedulerUrl: process.env.SCHEDULER_URL || "https://scheduler.api.aleph.cloud",
    
    // VM resource defaults
    vmDefaults: {
        vcpus: parseInt(process.env.ALEPH_VM_VCPUS) || 4,
        memory: parseInt(process.env.ALEPH_VM_MEMORY) || 8192, // MB
        storage: parseInt(process.env.ALEPH_VM_STORAGE) || 20000, // MB
        seconds: parseInt(process.env.ALEPH_VM_SECONDS) || 14400, // 4 hours
        internet: process.env.ALEPH_VM_INTERNET !== 'false',
        hypervisor: process.env.ALEPH_VM_HYPERVISOR || "qemu"
    },
    
    // Payment configuration
    payment: {
        chain: process.env.ALEPH_PAYMENT_CHAIN || "ETH",
        type: process.env.ALEPH_PAYMENT_TYPE || "hold"
    },
    
    // Network interface configuration
    networkInterface: {
        ipv6: process.env.ALEPH_ENABLE_IPV6 !== 'false',
        ipv4: process.env.ALEPH_ENABLE_IPV4 === 'true',
        publicIp: process.env.ALEPH_PUBLIC_IP === 'true'
    },
    
    // Security configuration
    security: {
        sshKeyDirectory: process.env.ALEPH_SSH_KEY_DIRECTORY || "../keys",
        enableFirewall: process.env.ALEPH_ENABLE_FIREWALL === 'true',
        allowedPorts: process.env.ALEPH_ALLOWED_PORTS ? 
            process.env.ALEPH_ALLOWED_PORTS.split(',').map(p => parseInt(p.trim())) : 
            [22, 80, 443, 8080, 3000]
    },
    
    // Monitoring and health checks
    monitoring: {
        healthCheckInterval: parseInt(process.env.ALEPH_HEALTH_CHECK_INTERVAL) || 30000, // 30 seconds
        vmTimeout: parseInt(process.env.ALEPH_VM_TIMEOUT) || 300000, // 5 minutes
        maxRetries: parseInt(process.env.ALEPH_MAX_RETRIES) || 3,
        enableLogging: process.env.ALEPH_ENABLE_LOGGING !== 'false'
    },
    
    // Development and testing
    development: {
        simulateNetwork: process.env.ALEPH_SIMULATE_NETWORK === 'true',
        mockResponses: process.env.ALEPH_MOCK_RESPONSES === 'true',
        testMode: process.env.ALEPH_TEST_MODE === 'true',
        debugMode: process.env.ALEPH_DEBUG_MODE === 'true'
    }
};

export default alephConfig; 