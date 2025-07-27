// config/systemConfig.js
// 
// Description: General system configuration for the distributed VM system
// 
// This file contains system-wide configuration settings including
// ports, timeouts, resource limits, and other operational parameters.
// It's designed to be shared across all components of the system.
// 
// Configuration:
//   - Network ports and endpoints
//   - Timeout settings
//   - Resource limits
//   - Logging configuration
//   - Development vs production settings
// 
// Inputs: Environment variables for configuration
// Outputs: System configuration object
// 
// Dependencies: Environment variables

export const systemConfig = {
    // Network Configuration
    ports: {
        clusterManager: process.env.CLUSTER_MANAGER_PORT || 3000,
        dashboard: process.env.DASHBOARD_PORT || 5173,
        workerAPI: process.env.WORKER_API_PORT || 8080,
        healthCheck: process.env.HEALTH_CHECK_PORT || 3001
    },

    // API Configuration
    api: {
        timeout: parseInt(process.env.API_TIMEOUT) || 300000, // 5 minutes
        maxPayloadSize: process.env.MAX_PAYLOAD_SIZE || '100mb',
        corsOrigin: process.env.CORS_ORIGIN || '*',
        rateLimit: {
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
            max: parseInt(process.env.RATE_LIMIT_MAX) || 100 // limit each IP to 100 requests per windowMs
        }
    },

    // Resource Configuration
    resources: {
        defaultCPU: parseInt(process.env.DEFAULT_CPU) || 4,
        defaultMemory: parseInt(process.env.DEFAULT_MEMORY) || 8192, // MB
        defaultGPU: parseInt(process.env.DEFAULT_GPU) || 0,
        maxInstances: parseInt(process.env.MAX_INSTANCES) || 10,
        maxConcurrentTasks: parseInt(process.env.MAX_CONCURRENT_TASKS) || 50
    },

    // Timeout Configuration
    timeouts: {
        vmCreation: parseInt(process.env.VM_CREATION_TIMEOUT) || 300000, // 5 minutes
        taskExecution: parseInt(process.env.TASK_EXECUTION_TIMEOUT) || 1800000, // 30 minutes
        healthCheck: parseInt(process.env.HEALTH_CHECK_TIMEOUT) || 30000, // 30 seconds
        nodeDiscovery: parseInt(process.env.NODE_DISCOVERY_TIMEOUT) || 60000 // 1 minute
    },

    // Monitoring Configuration
    monitoring: {
        healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000, // 30 seconds
        resourceUpdateInterval: parseInt(process.env.RESOURCE_UPDATE_INTERVAL) || 30000, // 30 seconds
        logLevel: process.env.LOG_LEVEL || 'info',
        enableMetrics: process.env.ENABLE_METRICS !== 'false'
    },

    // Development Configuration
    development: {
        mode: process.env.NODE_ENV || 'development',
        enableHotReload: process.env.ENABLE_HOT_RELOAD !== 'false',
        enableDebugLogs: process.env.ENABLE_DEBUG_LOGS === 'true',
        simulateAlephNetwork: process.env.SIMULATE_ALEPH_NETWORK === 'true'
    },

    // Security Configuration
    security: {
        enableSSL: process.env.ENABLE_SSL === 'true',
        sslKeyPath: process.env.SSL_KEY_PATH,
        sslCertPath: process.env.SSL_CERT_PATH,
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
        enableAuth: process.env.ENABLE_AUTH === 'true'
    },

    // Storage Configuration
    storage: {
        dataDirectory: process.env.DATA_DIRECTORY || './data',
        logsDirectory: process.env.LOGS_DIRECTORY || './logs',
        tempDirectory: process.env.TEMP_DIRECTORY || './temp',
        backupDirectory: process.env.BACKUP_DIRECTORY || './backups',
        keysDirectory: process.env.KEYS_DIRECTORY || './config/keys'
    }
};

export default systemConfig; 