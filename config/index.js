// config/index.js
// 
// Description: Configuration index file for the distributed VM system
// 
// This file provides a centralized way to import all configuration
// modules. It exports all configuration objects and provides
// a unified interface for accessing system settings.
// 
// Usage:
//   import { alephConfig, systemConfig } from '../config/index.js';
//   or
//   import config from '../config/index.js';
// 
// Inputs: None (imports from other config files)
// Outputs: All configuration objects and a unified config object
// 
// Dependencies: 
//   - alephConfig.js (Aleph network configuration)
//   - systemConfig.js (System-wide configuration)

import alephConfig from './alephConfig.js';
import systemConfig from './systemConfig.js';

// Unified configuration object
export const config = {
    aleph: alephConfig,
    system: systemConfig,
    
    // Convenience getters
    get port() {
        return this.system.ports;
    },
    
    get api() {
        return this.system.api;
    },
    
    get resources() {
        return this.system.resources;
    },
    
    get timeouts() {
        return this.system.timeouts;
    },
    
    get monitoring() {
        return this.system.monitoring;
    },
    
    get development() {
        return this.system.development;
    },
    
    get security() {
        return this.system.security;
    },
    
    get storage() {
        return this.system.storage;
    }
};

// Individual exports
export { alephConfig, systemConfig };

// Default export
export default config; 