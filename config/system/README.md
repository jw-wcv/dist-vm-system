# System Configuration Directory

This directory contains all system-wide configuration for the distributed VM system, including network settings, API configuration, monitoring, security, and performance tuning.

## 🚨 Security Warning

**NEVER commit sensitive system data to version control!**

- Environment files are automatically ignored by `.gitignore`
- SSL certificates and keys are protected
- Keep system-specific credentials secure

## Files

### `systemConfig.js`

Comprehensive system configuration including:

- Network and port configuration
- API and service settings
- Resource management and limits
- Monitoring and health checks
- Security and authentication
- Development and production modes
- Storage and file management
- Performance optimization
- Integration settings

### `env.example`

Comprehensive system environment variables template with all available configuration options.

### `index.js`

Main system configuration index that provides:

- Unified system configuration object
- Individual module exports
- Convenience methods for common operations

## Usage

### Basic Import

```javascript
import { systemConfig } from "../config/system/index.js";
```

### Unified System Config Object

```javascript
import system from "../config/system/index.js";

// Check environment
const isDev = system.isDevelopment();
const isProd = system.isProduction();
const isTest = system.isTestMode();

// Access network settings
const clusterPort = system.getPort("clusterManager");
const baseUrl = system.getBaseUrl();
const isHttps = system.isHttpsEnabled();

// Access resource settings
const defaults = system.getDefaultResources();
const limits = system.getResourceLimits();
const scaling = system.getScalingConfig();
```

### Network Configuration

```javascript
import system from "../config/system/index.js";

// Get all ports
const ports = system.network.ports;
console.log("Cluster Manager Port:", ports.clusterManager);
console.log("Dashboard Port:", ports.dashboard);
console.log("Worker API Port:", ports.workerAPI);

// Check HTTPS status
if (system.isHttpsEnabled()) {
  console.log("HTTPS is enabled");
}
```

### Resource Management

```javascript
import system from "../config/system/index.js";

// Get default resources
const defaults = system.getDefaultResources();
console.log("Default CPU:", defaults.cpu);
console.log("Default Memory:", defaults.memory);

// Get resource limits
const limits = system.getResourceLimits();
console.log("Max Instances:", limits.maxInstances);
console.log("Max Concurrent Tasks:", limits.maxConcurrentTasks);

// Get scaling configuration
const scaling = system.getScalingConfig();
console.log("Auto Scale:", scaling.autoScale);
console.log("Scale Up Threshold:", scaling.scaleUpThreshold);
```

### Storage Configuration

```javascript
import system from "../config/system/index.js";

// Get storage directories
const dataDir = system.getDataDirectory();
const logsDir = system.getLogsDirectory();
const tempDir = system.getTempDirectory();
const backupDir = system.getBackupDirectory();
const keysDir = system.getKeysDirectory();

// Check backup status
if (system.isBackupEnabled()) {
  console.log("Backup is enabled");
}
```

### Security Configuration

```javascript
import system from "../config/system/index.js";

// Check authentication
if (system.isAuthEnabled()) {
  console.log("Authentication is enabled");
  const authConfig = system.getAuthConfig();
  console.log("JWT Expiry:", authConfig.jwtExpiry);
}

// Get security settings
const authzConfig = system.getAuthzConfig();
const encryptionConfig = system.getEncryptionConfig();
const networkSecurity = system.getNetworkSecurityConfig();
```

### Monitoring Configuration

```javascript
import system from "../config/system/index.js";

// Check metrics
if (system.isMetricsEnabled()) {
  console.log("Metrics are enabled");
  const metricsConfig = system.getMetricsConfig();
  console.log("Metrics Port:", metricsConfig.port);
}

// Get monitoring settings
const healthCheck = system.getHealthCheckConfig();
const logging = system.getLoggingConfig();
const alerts = system.getAlertsConfig();
```

## Environment Variables

Copy `env.example` to `.env` and configure your settings:

```bash
cp config/system/env.example .env
```

### Required Variables

- `CLUSTER_MANAGER_PORT` - Port for cluster manager API
- `DASHBOARD_PORT` - Port for dashboard UI
- `WORKER_API_PORT` - Port for worker API

### Optional Variables

- `NODE_ENV` - Environment mode (development/production)
- `LOG_LEVEL` - Logging level
- `ENABLE_METRICS` - Enable metrics collection
- Various network, security, and performance settings

## Network Configuration

### Port Management

- **Cluster Manager**: 3000 (default)
- **Dashboard**: 5173 (default)
- **Worker API**: 8080 (default)
- **Health Check**: 3001 (default)
- **Metrics**: 9090 (default)

### SSL/HTTPS Support

```javascript
import system from "../config/system/index.js";

// Enable HTTPS
// Set ENABLE_HTTPS=true in environment
// Configure SSL_KEY_PATH and SSL_CERT_PATH

if (system.isHttpsEnabled()) {
  console.log("Running with HTTPS");
}
```

## Resource Management

### Default Resources

- **CPU**: 4 cores
- **Memory**: 8GB (8192 MB)
- **GPU**: 0 (disabled)
- **Storage**: 20GB (20000 MB)

### Resource Limits

- **Max Instances**: 10
- **Max Concurrent Tasks**: 50
- **Max Memory Per Instance**: 32GB
- **Max CPU Per Instance**: 16 cores

### Auto-scaling

- **Enabled**: Disabled by default
- **Min Instances**: 1
- **Max Instances**: 10
- **Scale Up Threshold**: 80% load
- **Scale Down Threshold**: 30% load

## Security Features

### Authentication

- JWT-based authentication
- Configurable expiry times
- Bcrypt password hashing
- Role-based access control (RBAC)

### Encryption

- AES-256-GCM encryption
- Configurable encryption keys
- Secure key management

### Network Security

- IP allowlisting/blocklisting
- Firewall configuration
- CORS settings

## Monitoring and Logging

### Health Checks

- **Interval**: 30 seconds (configurable)
- **Timeout**: 10 seconds (configurable)
- **Retries**: 3 attempts (configurable)

### Metrics

- **Enabled**: Enabled by default
- **Port**: 9090 (configurable)
- **Collection Interval**: 1 minute
- **Retention**: 30 days

### Logging

- **Level**: info (configurable)
- **Format**: JSON (configurable)
- **Console**: Enabled by default
- **File**: Disabled by default
- **Rotation**: 10MB max size, 5 files

### Alerts

- **Email**: Configurable
- **Webhook**: Configurable
- **Slack**: Configurable

## Storage Management

### Data Storage

- **Directory**: `./data`
- **Max Size**: 10GB
- **Cleanup**: 24 hours

### Log Storage

- **Directory**: `./logs`
- **Max Size**: 1GB
- **Retention**: 30 days

### Temporary Storage

- **Directory**: `./temp`
- **Max Size**: 5GB
- **Cleanup**: 1 hour

### Backup Storage

- **Directory**: `./backups`
- **Enabled**: Disabled by default
- **Frequency**: 24 hours
- **Retention**: 7 days
- **Compression**: Enabled

## Performance Optimization

### Caching

- **Type**: Memory (configurable)
- **TTL**: 5 minutes
- **Max Size**: 1000 entries

### Compression

- **Enabled**: Enabled by default
- **Gzip**: Enabled by default
- **Minification**: Disabled by default

### Worker Threads

- **Count**: 4 (configurable)
- **Optimization**: Automatic

## Integration Support

### Docker

- **Enabled**: Enabled by default
- **Socket**: `/var/run/docker.sock`
- **Registry**: Docker Hub

### Kubernetes

- **Enabled**: Disabled by default
- **Config**: Configurable
- **Namespace**: default

### Terraform

- **Enabled**: Disabled by default
- **State File**: `./terraform.tfstate`
- **Workspace**: default

## Development Features

### Development Mode

```javascript
import system from "../config/system/index.js";

// Check development mode
if (system.isDevelopment()) {
  console.log("Running in development mode");
  console.log("Hot reload:", system.development.enableHotReload);
  console.log("Debug logs:", system.development.enableDebugLogs);
}
```

### Test Mode

```javascript
import system from "../config/system/index.js";

// Check test mode
if (system.isTestMode()) {
  console.log("Running in test mode");
  // Disable external services
  // Use mock responses
  // Enable test-specific features
}
```

## Configuration Validation

```javascript
import system from "../config/system/index.js";

// Validate configuration
const validation = system.validateConfiguration();
if (!validation.isValid) {
  console.error("Configuration errors:", validation.errors);
}

// Get configuration summary
const summary = system.getConfigurationSummary();
console.log("Environment:", summary.environment);
console.log("Network:", summary.network);
console.log("Resources:", summary.resources);
```

## Troubleshooting

### Common Issues

1. **Port conflicts**

   - Check for duplicate port assignments
   - Verify no other services using same ports
   - Use `system.validateConfiguration()` to detect conflicts

2. **Resource limits**

   - Ensure default resources are reasonable
   - Check max instance limits
   - Verify memory and CPU allocations

3. **Security issues**
   - Change default JWT secret in production
   - Enable authentication if needed
   - Configure SSL certificates properly

### Debug Mode

Enable debug logging by setting:

```bash
NODE_ENV=development
ENABLE_DEBUG_LOGS=true
LOG_LEVEL=debug
```

## Security Checklist

- [ ] Environment variables are properly set
- [ ] JWT secret is changed from default
- [ ] SSL certificates are configured (if using HTTPS)
- [ ] Authentication is enabled (if required)
- [ ] Firewall rules are configured
- [ ] Backup and recovery are configured
- [ ] Monitoring and alerts are enabled
- [ ] Log rotation is configured
- [ ] Development features are disabled in production
