// config/system/systemConfig.js
// 
// Description: System-wide configuration for the distributed VM system
// 
// This module provides comprehensive system configuration including
// network settings, API configuration, resource management, monitoring,
// security, and development settings. It's designed to be the central
// configuration hub for all system components.
// 
// Features:
//   - Network and port configuration
//   - API and service settings
//   - Resource limits and defaults
//   - Monitoring and health checks
//   - Security and authentication
//   - Development and production modes
//   - Storage and file management
// 
// Inputs: Environment variables for configuration
// Outputs: System configuration object with all settings
// 
// Dependencies: Environment variables

export const systemConfig = {
    // Network Configuration
    network: {
        ports: {
            clusterManager: parseInt(process.env.CLUSTER_MANAGER_PORT) || 3000,
            dashboard: parseInt(process.env.DASHBOARD_PORT) || 5173,
            workerAPI: parseInt(process.env.WORKER_API_PORT) || 8080,
            healthCheck: parseInt(process.env.HEALTH_CHECK_PORT) || 3001,
            metrics: parseInt(process.env.METRICS_PORT) || 9090
        },
        host: process.env.HOST || 'localhost',
        baseUrl: process.env.BASE_URL || 'http://localhost:3000',
        corsOrigin: process.env.CORS_ORIGIN || '*',
        enableHttps: process.env.ENABLE_HTTPS === 'true',
        sslKeyPath: process.env.SSL_KEY_PATH,
        sslCertPath: process.env.SSL_CERT_PATH
    },

    // API Configuration
    api: {
        timeout: parseInt(process.env.API_TIMEOUT) || 300000, // 5 minutes
        maxPayloadSize: process.env.MAX_PAYLOAD_SIZE || '100mb',
        rateLimit: {
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
            max: parseInt(process.env.RATE_LIMIT_MAX) || 100 // limit each IP to 100 requests per windowMs
        },
        compression: process.env.ENABLE_COMPRESSION !== 'false',
        enableCaching: process.env.ENABLE_CACHING === 'true',
        cacheTimeout: parseInt(process.env.CACHE_TIMEOUT) || 300000 // 5 minutes
    },

    // Resource Configuration
    resources: {
        defaults: {
            cpu: parseInt(process.env.DEFAULT_CPU) || 4,
            memory: parseInt(process.env.DEFAULT_MEMORY) || 8192, // MB
            gpu: parseInt(process.env.DEFAULT_GPU) || 0,
            storage: parseInt(process.env.DEFAULT_STORAGE) || 20000 // MB
        },
        limits: {
            maxInstances: parseInt(process.env.MAX_INSTANCES) || 10,
            maxConcurrentTasks: parseInt(process.env.MAX_CONCURRENT_TASKS) || 50,
            maxMemoryPerInstance: parseInt(process.env.MAX_MEMORY_PER_INSTANCE) || 32768, // 32GB
            maxCPUPerInstance: parseInt(process.env.MAX_CPU_PER_INSTANCE) || 16
        },
        scaling: {
            autoScale: process.env.AUTO_SCALE === 'true',
            minInstances: parseInt(process.env.MIN_INSTANCES) || 1,
            maxInstances: parseInt(process.env.MAX_INSTANCES) || 10,
            scaleUpThreshold: parseFloat(process.env.SCALE_UP_THRESHOLD) || 0.8, // 80% load
            scaleDownThreshold: parseFloat(process.env.SCALE_DOWN_THRESHOLD) || 0.3 // 30% load
        }
    },

    // Timeout Configuration
    timeouts: {
        vmCreation: parseInt(process.env.VM_CREATION_TIMEOUT) || 300000, // 5 minutes
        taskExecution: parseInt(process.env.TASK_EXECUTION_TIMEOUT) || 1800000, // 30 minutes
        healthCheck: parseInt(process.env.HEALTH_CHECK_TIMEOUT) || 30000, // 30 seconds
        nodeDiscovery: parseInt(process.env.NODE_DISCOVERY_TIMEOUT) || 60000, // 1 minute
        connection: parseInt(process.env.CONNECTION_TIMEOUT) || 10000, // 10 seconds
        request: parseInt(process.env.REQUEST_TIMEOUT) || 30000 // 30 seconds
    },

    // Monitoring Configuration
    monitoring: {
        healthCheck: {
            interval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000, // 30 seconds
            timeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT) || 10000, // 10 seconds
            retries: parseInt(process.env.HEALTH_CHECK_RETRIES) || 3
        },
        metrics: {
            enabled: process.env.ENABLE_METRICS !== 'false',
            port: parseInt(process.env.METRICS_PORT) || 9090,
            collectionInterval: parseInt(process.env.METRICS_COLLECTION_INTERVAL) || 60000, // 1 minute
            retention: parseInt(process.env.METRICS_RETENTION_DAYS) || 30
        },
        logging: {
            level: process.env.LOG_LEVEL || 'info',
            format: process.env.LOG_FORMAT || 'json',
            enableConsole: process.env.LOG_CONSOLE !== 'false',
            enableFile: process.env.LOG_FILE === 'true',
            filePath: process.env.LOG_FILE_PATH || './logs/app.log',
            maxSize: process.env.LOG_MAX_SIZE || '10MB',
            maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5
        },
        alerts: {
            enabled: process.env.ENABLE_ALERTS === 'true',
            email: process.env.ALERT_EMAIL,
            webhook: process.env.ALERT_WEBHOOK,
            slack: process.env.ALERT_SLACK_WEBHOOK
        }
    },

    // Development Configuration
    development: {
        mode: process.env.NODE_ENV || 'development',
        enableHotReload: process.env.ENABLE_HOT_RELOAD !== 'false',
        enableDebugLogs: process.env.ENABLE_DEBUG_LOGS === 'true',
        enableProfiling: process.env.ENABLE_PROFILING === 'true',
        simulateNetworks: process.env.SIMULATE_NETWORKS === 'true',
        mockResponses: process.env.MOCK_RESPONSES === 'true',
        testMode: process.env.TEST_MODE === 'true'
    },

    // Security Configuration
    security: {
        authentication: {
            enabled: process.env.ENABLE_AUTH === 'true',
            jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
            jwtExpiry: process.env.JWT_EXPIRY || '24h',
            bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
        },
        authorization: {
            enableRBAC: process.env.ENABLE_RBAC === 'true',
            defaultRole: process.env.DEFAULT_ROLE || 'user',
            adminRole: process.env.ADMIN_ROLE || 'admin'
        },
        encryption: {
            enableEncryption: process.env.ENABLE_ENCRYPTION === 'true',
            encryptionKey: process.env.ENCRYPTION_KEY,
            algorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-gcm'
        },
        network: {
            enableFirewall: process.env.ENABLE_FIREWALL === 'true',
            allowedIPs: process.env.ALLOWED_IPS ? process.env.ALLOWED_IPS.split(',') : [],
            blockedIPs: process.env.BLOCKED_IPS ? process.env.BLOCKED_IPS.split(',') : []
        }
    },

    // Storage Configuration
    storage: {
        data: {
            directory: process.env.DATA_DIRECTORY || './data',
            maxSize: process.env.DATA_MAX_SIZE || '10GB',
            cleanupInterval: parseInt(process.env.DATA_CLEANUP_INTERVAL) || 86400000 // 24 hours
        },
        logs: {
            directory: process.env.LOGS_DIRECTORY || './logs',
            maxSize: process.env.LOGS_MAX_SIZE || '1GB',
            retention: parseInt(process.env.LOGS_RETENTION_DAYS) || 30
        },
        temp: {
            directory: process.env.TEMP_DIRECTORY || './temp',
            maxSize: process.env.TEMP_MAX_SIZE || '5GB',
            cleanupInterval: parseInt(process.env.TEMP_CLEANUP_INTERVAL) || 3600000 // 1 hour
        },
        backup: {
            directory: process.env.BACKUP_DIRECTORY || './backups',
            enabled: process.env.ENABLE_BACKUP === 'true',
            frequency: parseInt(process.env.BACKUP_FREQUENCY_HOURS) || 24,
            retention: parseInt(process.env.BACKUP_RETENTION_DAYS) || 7,
            compression: process.env.BACKUP_COMPRESSION !== 'false'
        },
        keys: {
            directory: process.env.KEYS_DIRECTORY || './config/keys',
            permissions: process.env.KEYS_PERMISSIONS || '600'
        }
    },

    // Performance Configuration
    performance: {
        caching: {
            enabled: process.env.ENABLE_CACHING === 'true',
            type: process.env.CACHE_TYPE || 'memory', // memory, redis, file
            ttl: parseInt(process.env.CACHE_TTL) || 300000, // 5 minutes
            maxSize: parseInt(process.env.CACHE_MAX_SIZE) || 1000
        },
        optimization: {
            enableCompression: process.env.ENABLE_COMPRESSION !== 'false',
            enableMinification: process.env.ENABLE_MINIFICATION === 'true',
            enableGzip: process.env.ENABLE_GZIP !== 'false',
            workerThreads: parseInt(process.env.WORKER_THREADS) || 4
        },
        database: {
            connectionPool: parseInt(process.env.DB_CONNECTION_POOL) || 10,
            queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT) || 30000,
            enableQueryCache: process.env.DB_QUERY_CACHE === 'true'
        }
    },

    // Integration Configuration
    integrations: {
        docker: {
            enabled: process.env.ENABLE_DOCKER === 'true',
            socket: process.env.DOCKER_SOCKET || '/var/run/docker.sock',
            registry: process.env.DOCKER_REGISTRY || 'https://registry.hub.docker.com'
        },
        kubernetes: {
            enabled: process.env.ENABLE_KUBERNETES === 'true',
            config: process.env.KUBERNETES_CONFIG,
            namespace: process.env.KUBERNETES_NAMESPACE || 'default'
        },
        terraform: {
            enabled: process.env.ENABLE_TERRAFORM === 'true',
            stateFile: process.env.TERRAFORM_STATE_FILE || './terraform.tfstate',
            workspace: process.env.TERRAFORM_WORKSPACE || 'default'
        }
    }
};

export default systemConfig; 