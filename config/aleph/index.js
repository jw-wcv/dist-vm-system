// config/aleph/index.js
// 
// Description: Aleph Configuration Index for the distributed VM system
// 
// This file provides a centralized way to import all Aleph-specific configuration
// modules including VM settings, network parameters, and account management.
// It exports all Aleph objects and provides a unified interface for
// accessing Aleph-related settings.
// 
// Usage:
//   import { alephConfig } from '../config/aleph/index.js';
//   or
//   import alephConfig from '../config/aleph/index.js';
// 
// Inputs: None (imports from other Aleph config files)
// Outputs: All Aleph configuration objects and a unified Aleph config object
// 
// Dependencies: 
//   - alephConfig.js (Aleph network and VM configuration)

import alephConfig from './alephConfig.js';

// Unified Aleph configuration object
export const aleph = {
    config: alephConfig,
    
    // Convenience getters
    get account() {
        return this.config.alephAccount;
    },
    
    get channel() {
        return this.config.alephChannel;
    },
    
    get nodeUrl() {
        return this.config.alephNodeUrl;
    },
    
    get wsUrl() {
        return this.config.alephWsUrl;
    },
    
    get image() {
        return this.config.alephImage;
    },
    
    get schedulerUrl() {
        return this.config.schedulerUrl;
    },
    
    get vmDefaults() {
        return this.config.vmDefaults;
    },
    
    get payment() {
        return this.config.payment;
    },
    
    get networkInterface() {
        return this.config.networkInterface;
    },
    
    get security() {
        return this.config.security;
    },
    
    get monitoring() {
        return this.config.monitoring;
    },
    
    get development() {
        return this.config.development;
    },
    
    // Convenience methods
    isAuthenticated() {
        return this.config.alephAccount !== null;
    },
    
    isTestMode() {
        return this.config.development.testMode;
    },
    
    isDebugMode() {
        return this.config.development.debugMode;
    },
    
    isSimulationMode() {
        return this.config.development.simulateNetwork;
    },
    
    // VM creation helper
    getVMConfig(customConfig = {}) {
        return {
            ...this.config.vmDefaults,
            ...customConfig,
            payment: this.config.payment,
            environment: {
                name: customConfig.name || 'ClusterNode',
                internet: this.config.vmDefaults.internet,
                hypervisor: this.config.vmDefaults.hypervisor
            },
            rootfs: {
                use_latest: true,
                persistence: "host",
                size_mib: this.config.vmDefaults.storage
            }
        };
    },
    
    // Network interface helper
    getNetworkConfig() {
        const config = [];
        
        if (this.config.networkInterface.ipv6) {
            config.push({ ipv6: true });
        }
        
        if (this.config.networkInterface.ipv4) {
            config.push({ ipv4: true });
        }
        
        if (this.config.networkInterface.publicIp) {
            config.push({ public_ip: true });
        }
        
        return config;
    },
    
    // Security helper
    getSecurityConfig() {
        return {
            sshKeyDirectory: this.config.security.sshKeyDirectory,
            enableFirewall: this.config.security.enableFirewall,
            allowedPorts: this.config.security.allowedPorts
        };
    },
    
    // Configuration validation
    validateConfiguration() {
        const errors = [];
        const warnings = [];
        
        // Check if account is configured
        if (!this.isAuthenticated()) {
            warnings.push('Aleph account not configured - using unauthenticated mode');
        }
        
        // Check required URLs
        if (!this.config.alephNodeUrl) {
            errors.push('Aleph node URL not configured');
        }
        
        if (!this.config.schedulerUrl) {
            errors.push('Aleph scheduler URL not configured');
        }
        
        // Check VM defaults
        if (this.config.vmDefaults.vcpus < 1) {
            errors.push('VM CPU cores must be at least 1');
        }
        
        if (this.config.vmDefaults.memory < 512) {
            errors.push('VM memory must be at least 512 MB');
        }
        
        // Check monitoring settings
        if (this.config.monitoring.healthCheckInterval < 5000) {
            warnings.push('Health check interval is very short (< 5 seconds)');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    },
    
    // Get configuration summary
    getConfigurationSummary() {
        const validation = this.validateConfiguration();
        
        return {
            account: {
                authenticated: this.isAuthenticated(),
                address: this.config.alephAccount?.address || 'Not configured'
            },
            network: {
                channel: this.config.alephChannel,
                nodeUrl: this.config.alephNodeUrl,
                schedulerUrl: this.config.schedulerUrl
            },
            vmDefaults: this.config.vmDefaults,
            security: this.config.security,
            monitoring: this.config.monitoring,
            development: this.config.development,
            validation,
            timestamp: new Date().toISOString()
        };
    }
};

// Individual exports
export { alephConfig };

// Default export
export default aleph; 