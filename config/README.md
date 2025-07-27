# Configuration Directory

This directory contains all configuration files for the distributed VM system. The configuration is organized into logical modules and can be easily imported throughout the system.

## Files

### `alephConfig.js`

Aleph Network configuration including:

- Account authentication
- Network channel settings
- Node URLs and endpoints
- Docker image hashes

### `systemConfig.js`

System-wide configuration including:

- Network ports and endpoints
- API settings and timeouts
- Resource limits and defaults
- Monitoring and logging settings
- Development vs production settings
- Security configuration
- Storage paths

### `env.example`

Comprehensive environment variables template with all available configuration options.

### `index.js`

Main configuration index that provides:

- Unified configuration object
- Individual module exports
- Convenience getters for common settings

## Usage

### Basic Import

```javascript
import { alephConfig, systemConfig } from "../config/index.js";
```

### Unified Config Object

```javascript
import config from "../config/index.js";

// Access Aleph settings
const channel = config.aleph.alephChannel;
const nodeUrl = config.aleph.alephNodeUrl;

// Access system settings
const port = config.port.clusterManager;
const timeout = config.timeouts.vmCreation;
```

### Convenience Getters

```javascript
import config from "../config/index.js";

// These are equivalent:
const ports = config.port;
const ports = config.system.ports;

const api = config.api;
const api = config.system.api;
```

## Environment Variables

Copy `env.example` to `.env` and configure your settings:

```bash
cp config/env.example .env
```

### Required Variables

- `ALEPH_ACCOUNT_PRIVATE_KEY` - Your Aleph account private key for authenticated operations

### Optional Variables

All other variables have sensible defaults and are optional.

## Configuration Categories

### Aleph Network

- Account authentication
- Channel and node settings
- Scheduler endpoints
- Docker image configuration

### Network

- Port assignments for all services
- API endpoints
- CORS settings

### Resources

- Default CPU, memory, and GPU allocations
- Maximum instance limits
- Concurrent task limits

### Timeouts

- VM creation timeouts
- Task execution timeouts
- Health check intervals
- Node discovery timeouts

### Monitoring

- Health check intervals
- Resource update frequencies
- Log levels
- Metrics collection

### Development

- Environment mode
- Hot reload settings
- Debug logging
- Aleph network simulation

### Security

- SSL configuration
- Authentication settings
- JWT secrets
- Rate limiting

### Storage

- Data directories
- Log directories
- Temporary file locations
- Backup locations

## Best Practices

1. **Never commit `.env` files** - They contain sensitive information
2. **Use environment-specific configs** - Different settings for dev/staging/prod
3. **Validate required configs** - Check for required variables on startup
4. **Use type-safe access** - Leverage the convenience getters
5. **Document custom configs** - Add comments for non-standard settings

## Adding New Configuration

1. Add the setting to `systemConfig.js` or `alephConfig.js`
2. Add the corresponding environment variable to `env.example`
3. Update this README if needed
4. Test the configuration in all environments
