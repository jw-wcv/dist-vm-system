// config/system/index.js
// 
// Description: System Configuration Index for the distributed VM system
// 
// This file provides a centralized way to import all system-wide configuration
// modules including network settings, API configuration, monitoring, and security.
// It exports all system objects and provides a unified interface for
// accessing system-related settings.
// 
// Usage:
//   import { systemConfig } from '../config/system/index.js';
//   or
//   import system from '../config/system/index.js';
// 
// Inputs: None (imports from other system config files)
// Outputs: All system configuration objects and a unified system config object
// 
// Dependencies: 
//   - systemConfig.js (system-wide configuration)

import systemConfig from './systemConfig.js';

// Unified system configuration object
export const system = {
    config: systemConfig,
    
    // Convenience getters
    get network() {
        return this.config.network;
    },
    
    get api() {
        return this.config.api;
    },
    
    get resources() {
        return this.config.resources;
    },
    
    get timeouts() {
        return this.config.timeouts;
    },
    
    get monitoring() {
        return this.config.monitoring;
    },
    
    get development() {
        return this.config.development;
    },
    
    get security() {
        return this.config.security;
    },
    
    get storage() {
        return this.config.storage;
    },
    
    get performance() {
        return this.config.performance;
    },
    
    get integrations() {
        return this.config.integrations;
    },
    
    // Convenience methods
    isDevelopment() {
        return this.config.development.mode === 'development';
    },
    
    isProduction() {
        return this.config.development.mode === 'production';
    },
    
    isTestMode() {
        return this.config.development.testMode;
    },
    
    isDebugMode() {
        return this.config.development.enableDebugLogs;
    },
    
    isAuthEnabled() {
        return this.config.security.authentication.enabled;
    },
    
    isMetricsEnabled() {
        return this.config.monitoring.metrics.enabled;
    },
    
    isBackupEnabled() {
        return this.config.storage.backup.enabled;
    },
    
    // Network helpers
    getPort(service) {
        return this.config.network.ports[service];
    },
    
    getBaseUrl() {
        return this.config.network.baseUrl;
    },
    
    isHttpsEnabled() {
        return this.config.network.enableHttps;
    },
    
    // Resource helpers
    getDefaultResources() {
        return this.config.resources.defaults;
    },
    
    getResourceLimits() {
        return this.config.resources.limits;
    },
    
    getScalingConfig() {
        return this.config.resources.scaling;
    },
    
    // Storage helpers
    getDataDirectory() {
        return this.config.storage.data.directory;
    },
    
    getLogsDirectory() {
        return this.config.storage.logs.directory;
    },
    
    getTempDirectory() {
        return this.config.storage.temp.directory;
    },
    
    getBackupDirectory() {
        return this.config.storage.backup.directory;
    },
    
    getKeysDirectory() {
        return this.config.storage.keys.directory;
    },
    
    // Monitoring helpers
    getHealthCheckConfig() {
        return this.config.monitoring.healthCheck;
    },
    
    getMetricsConfig() {
        return this.config.monitoring.metrics;
    },
    
    getLoggingConfig() {
        return this.config.monitoring.logging;
    },
    
    getAlertsConfig() {
        return this.config.monitoring.alerts;
    },
    
    // Security helpers
    getAuthConfig() {
        return this.config.security.authentication;
    },
    
    getAuthzConfig() {
        return this.config.security.authorization;
    },
    
    getEncryptionConfig() {
        return this.config.security.encryption;
    },
    
    getNetworkSecurityConfig() {
        return this.config.security.network;
    },
    
    // Performance helpers
    getCachingConfig() {
        return this.config.performance.caching;
    },
    
    getOptimizationConfig() {
        return this.config.performance.optimization;
    },
    
    getDatabaseConfig() {
        return this.config.performance.database;
    },
    
    // Integration helpers
    isDockerEnabled() {
        return this.config.integrations.docker.enabled;
    },
    
    isKubernetesEnabled() {
        return this.config.integrations.kubernetes.enabled;
    },
    
    isTerraformEnabled() {
        return this.config.integrations.terraform.enabled;
    },
    
    // Configuration validation
    validateConfiguration() {
        const errors = [];
        const warnings = [];
        
        // Check required ports
        const requiredPorts = ['clusterManager', 'dashboard', 'workerAPI'];
        for (const port of requiredPorts) {
            if (!this.config.network.ports[port]) {
                errors.push(`Required port ${port} not configured`);
            }
        }
        
        // Check for conflicting ports
        const ports = Object.values(this.config.network.ports);
        const uniquePorts = new Set(ports);
        if (ports.length !== uniquePorts.size) {
            errors.push('Port conflicts detected - multiple services using same port');
        }
        
        // Check resource limits
        if (this.config.resources.limits.maxInstances < 1) {
            errors.push('Max instances must be at least 1');
        }
        
        if (this.config.resources.defaults.memory < 512) {
            errors.push('Default memory must be at least 512 MB');
        }
        
        // Check security settings
        if (this.config.security.authentication.enabled && 
            this.config.security.authentication.jwtSecret === 'your-super-secret-jwt-key-change-this-in-production') {
            warnings.push('JWT secret is using default value - change in production');
        }
        
        // Check storage directories
        const storageDirs = [
            this.config.storage.data.directory,
            this.config.storage.logs.directory,
            this.config.storage.temp.directory,
            this.config.storage.backup.directory
        ];
        
        for (const dir of storageDirs) {
            if (!dir || dir.trim() === '') {
                errors.push('Storage directory not configured');
            }
        }
        
        // Check development settings
        if (this.isProduction() && this.config.development.enableDebugLogs) {
            warnings.push('Debug logs enabled in production mode');
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
            environment: {
                mode: this.config.development.mode,
                isDevelopment: this.isDevelopment(),
                isProduction: this.isProduction(),
                isTestMode: this.isTestMode()
            },
            network: {
                ports: this.config.network.ports,
                host: this.config.network.host,
                baseUrl: this.config.network.baseUrl,
                enableHttps: this.config.network.enableHttps
            },
            resources: {
                defaults: this.config.resources.defaults,
                limits: this.config.resources.limits,
                scaling: this.config.resources.scaling
            },
            security: {
                authEnabled: this.isAuthEnabled(),
                encryptionEnabled: this.config.security.encryption.enableEncryption,
                firewallEnabled: this.config.security.network.enableFirewall
            },
            monitoring: {
                metricsEnabled: this.isMetricsEnabled(),
                healthCheckInterval: this.config.monitoring.healthCheck.interval,
                logLevel: this.config.monitoring.logging.level
            },
            storage: {
                dataDirectory: this.config.storage.data.directory,
                logsDirectory: this.config.storage.logs.directory,
                backupEnabled: this.isBackupEnabled()
            },
            integrations: {
                docker: this.isDockerEnabled(),
                kubernetes: this.isKubernetesEnabled(),
                terraform: this.isTerraformEnabled()
            },
            validation,
            timestamp: new Date().toISOString()
        };
    }
};

// Individual exports
export { systemConfig };

// Default export
export default system; 