# Aleph Configuration Directory

This directory contains all Aleph-specific configuration for the distributed VM system, including VM management, network settings, and Aleph account configuration.

## 🚨 Security Warning

**NEVER commit sensitive Aleph data to version control!**

- Environment files are automatically ignored by `.gitignore`
- Private keys are managed in the web3 configuration
- Keep Aleph-specific credentials secure

## Files

### `alephConfig.js`

Aleph-specific configuration including:

- Aleph account management (integrated with web3 config)
- VM instance configuration and defaults
- Network channel and node settings
- Payment and security configuration
- Monitoring and development settings

### `env.example`

Comprehensive Aleph environment variables template with all available configuration options.

### `index.js`

Main Aleph configuration index that provides:

- Unified Aleph configuration object
- Individual module exports
- Convenience methods for common operations

## Usage

### Basic Import

```javascript
import { alephConfig } from "../config/aleph/index.js";
```

### Unified Aleph Config Object

```javascript
import aleph from "../config/aleph/index.js";

// Access Aleph account
const account = aleph.account;
const isAuthenticated = aleph.isAuthenticated();

// Access network settings
const channel = aleph.channel;
const nodeUrl = aleph.nodeUrl;
const schedulerUrl = aleph.schedulerUrl;

// Access VM defaults
const vmDefaults = aleph.vmDefaults;
const vmConfig = aleph.getVMConfig({ name: "CustomVM" });
```

### VM Configuration

```javascript
import aleph from "../config/aleph/index.js";

// Get default VM configuration
const defaultConfig = aleph.getVMConfig();

// Get custom VM configuration
const customConfig = aleph.getVMConfig({
  name: "HighPerformanceVM",
  vcpus: 8,
  memory: 16384,
  seconds: 28800, // 8 hours
});

// Get network interface configuration
const networkConfig = aleph.getNetworkConfig();
```

### Security Configuration

```javascript
import aleph from "../config/aleph/index.js";

// Get security settings
const security = aleph.getSecurityConfig();
console.log("SSH Key Directory:", security.sshKeyDirectory);
console.log("Firewall Enabled:", security.enableFirewall);
console.log("Allowed Ports:", security.allowedPorts);
```

## Environment Variables

Copy `env.example` to `.env` and configure your settings:

```bash
cp config/aleph/env.example .env
```

### Required Variables

- `ALEPH_CHANNEL` - Your Aleph channel for instances
- `SCHEDULER_URL` - Aleph scheduler URL

### Optional Variables

- `ALEPH_NODE_URL` - Custom Aleph node URL
- `ALEPH_IMAGE` - Custom Docker image hash
- `ALEPH_VM_VCPUS` - Default VM CPU cores
- `ALEPH_VM_MEMORY` - Default VM memory in MB
- Various VM and network configuration options

## VM Configuration

### Default VM Settings

- **CPU**: 4 vCPUs
- **Memory**: 8GB (8192 MB)
- **Storage**: 20GB (20000 MB)
- **Runtime**: 4 hours (14400 seconds)
- **Internet**: Enabled
- **Hypervisor**: QEMU

### Custom VM Configuration

```javascript
import aleph from "../config/aleph/index.js";

// Create a high-performance VM
const highPerfVM = aleph.getVMConfig({
  name: "HighPerformanceVM",
  vcpus: 8,
  memory: 16384,
  storage: 50000,
  seconds: 28800,
});

// Create a lightweight VM
const lightVM = aleph.getVMConfig({
  name: "LightweightVM",
  vcpus: 2,
  memory: 4096,
  storage: 10000,
  seconds: 7200,
});
```

## Network Configuration

### Supported Network Interfaces

- **IPv6**: Enabled by default
- **IPv4**: Optional (disabled by default)
- **Public IP**: Optional (disabled by default)

### Network Configuration Example

```javascript
import aleph from "../config/aleph/index.js";

// Get network interface configuration
const networkConfig = aleph.getNetworkConfig();
// Returns: [{ ipv6: true }] by default

// Enable IPv4 as well
// Set ALEPH_ENABLE_IPV4=true in environment
```

## Security Features

### SSH Key Management

- SSH keys are managed in `../keys/` directory
- Automatic key generation and validation
- Secure key storage and permissions

### Firewall Configuration

- Configurable firewall rules
- Allowed ports management
- Network security policies

### Access Control

- Private key authentication
- Channel-based access control
- Network interface restrictions

## Monitoring and Health Checks

### Health Check Configuration

- **Interval**: 30 seconds (configurable)
- **Timeout**: 5 minutes (configurable)
- **Retries**: 3 attempts (configurable)
- **Logging**: Enabled by default

### Monitoring Features

- VM health monitoring
- Resource utilization tracking
- Performance metrics collection
- Automatic recovery mechanisms

## Development and Testing

### Test Mode

```javascript
import aleph from "../config/aleph/index.js";

// Check if in test mode
if (aleph.isTestMode()) {
  console.log("Running in test mode");
}

// Check if in debug mode
if (aleph.isDebugMode()) {
  console.log("Debug logging enabled");
}

// Check if in simulation mode
if (aleph.isSimulationMode()) {
  console.log("Aleph network simulation enabled");
}
```

### Development Settings

- **Test Mode**: Simulate Aleph operations
- **Debug Mode**: Enable detailed logging
- **Simulation Mode**: Mock network responses
- **Mock Responses**: Use fake API responses

## Configuration Validation

```javascript
import aleph from "../config/aleph/index.js";

// Validate configuration
const validation = aleph.validateConfiguration();
if (!validation.isValid) {
  console.error("Configuration errors:", validation.errors);
}

// Get configuration summary
const summary = aleph.getConfigurationSummary();
console.log("Account:", summary.account);
console.log("Network:", summary.network);
console.log("VM Defaults:", summary.vmDefaults);
```

## Integration with Web3 Configuration

The Aleph configuration integrates with the web3 configuration for wallet management:

```javascript
import aleph from "../config/aleph/index.js";
import { web3Config } from "../web3/index.js";

// Check if Aleph wallet is configured
if (web3Config.wallet.hasWallet("aleph")) {
  const alephWallet = web3Config.wallet.getWallet("aleph");
  console.log("Aleph wallet address:", alephWallet.address);
}

// Check if Aleph account is authenticated
if (aleph.isAuthenticated()) {
  console.log("Aleph account is authenticated");
}
```

## Performance Tuning

### Connection Settings

- **Pool Size**: 10 connections (configurable)
- **Timeout**: 30 seconds (configurable)
- **Retry Delay**: 1 second (configurable)
- **Backoff Multiplier**: 2x (configurable)

### Resource Limits

- **CPU Limit**: 100% (configurable)
- **Memory Limit**: 100% (configurable)
- **Disk Limit**: 100% (configurable)

## Backup and Recovery

### Backup Configuration

- **Enabled**: Disabled by default
- **Frequency**: 24 hours (configurable)
- **Retention**: 7 days (configurable)
- **Location**: `./backups` (configurable)

### Recovery Features

- Automatic VM state backup
- Configuration backup
- Disaster recovery procedures

## Troubleshooting

### Common Issues

1. **Authentication failures**

   - Check web3 wallet configuration
   - Verify private key format
   - Ensure Aleph account has sufficient balance

2. **VM creation failures**

   - Check resource availability
   - Verify network connectivity
   - Review payment configuration

3. **Network connectivity issues**
   - Check Aleph node URL
   - Verify scheduler URL
   - Review firewall settings

### Debug Mode

Enable debug logging by setting:

```bash
ALEPH_DEBUG_MODE=true
ALEPH_LOG_LEVEL=debug
```

## Security Checklist

- [ ] Environment variables are properly set
- [ ] Private keys are managed securely
- [ ] Network URLs are secure (HTTPS/WSS)
- [ ] Firewall rules are configured
- [ ] SSH keys have correct permissions
- [ ] Test mode is disabled in production
- [ ] Backup and recovery are configured
- [ ] Monitoring is enabled
