# Web3 Configuration Directory

This directory contains all web3-related configuration for the distributed VM system, including wallet management, blockchain network configurations, and secure private key handling.

## 🚨 Security Warning

**NEVER commit private keys or sensitive wallet data to version control!**

- Private keys are automatically ignored by `.gitignore`
- Only public keys and configuration templates should be shared
- Keep private keys secure and restrict access

## Files

### `walletConfig.js`

Secure wallet management including:

- Multi-network wallet support (Ethereum, Polygon, Arbitrum, Aleph)
- Private key validation and management
- Address derivation and validation
- Environment variable abstraction
- Wallet backup and recovery

### `networkConfig.js`

Blockchain network configuration including:

- Multi-network support (Ethereum, Polygon, Arbitrum, Optimism, Base, etc.)
- RPC endpoint management
- Network health monitoring
- Gas estimation and fee management
- Network-specific configurations

### `env.example`

Comprehensive web3 environment variables template with all available configuration options.

### `index.js`

Main web3 configuration index that provides:

- Unified web3 configuration object
- Individual module exports
- Convenience methods for common operations

## Usage

### Basic Import

```javascript
import { walletConfig, networkConfig } from "../config/web3/index.js";
```

### Unified Web3 Config Object

```javascript
import web3Config from "../config/web3/index.js";

// Access wallet information
const alephWallet = web3Config.getWallet("aleph");
const ethereumAddress = web3Config.getAddress("ethereum");

// Access network information
const ethereumNetwork = web3Config.getNetwork("ethereum");
const networkHealth = await web3Config.checkNetworkHealth("polygon");
```

### Wallet Management

```javascript
import { walletConfig } from "../config/web3/index.js";

// Check if wallet exists
if (walletConfig.hasWallet("aleph")) {
  const wallet = walletConfig.getWallet("aleph");
  console.log("Aleph address:", wallet.address);
}

// Get all wallets
const allWallets = walletConfig.getAllWallets();
```

### Network Management

```javascript
import { networkConfig } from "../config/web3/index.js";

// Get network configuration
const ethereum = networkConfig.getNetwork("ethereum");
console.log("Ethereum RPC:", ethereum.rpcUrl);

// Check network health
const health = await networkConfig.checkNetworkHealth("polygon");
console.log("Polygon healthy:", health.healthy);

// Get all mainnets
const mainnets = networkConfig.getNetworksByType("mainnet");
```

## Environment Variables

Copy `env.example` to `.env` and configure your settings:

```bash
cp config/web3/env.example .env
```

### Required Variables

- `ALEPH_ACCOUNT_PRIVATE_KEY` - Your Aleph account private key for VM operations

### Optional Variables

- `ETHEREUM_PRIVATE_KEY` - Ethereum private key for additional operations
- `POLYGON_PRIVATE_KEY` - Polygon private key for Polygon network operations
- `ARBITRUM_PRIVATE_KEY` - Arbitrum private key for Arbitrum operations
- Various RPC URLs for different networks

## Supported Networks

### Mainnets

- **Ethereum** - Main Ethereum network
- **Polygon** - Polygon PoS network
- **Arbitrum One** - Arbitrum L2 network
- **Optimism** - Optimism L2 network
- **Base** - Coinbase L2 network
- **Aleph** - Aleph Network

### Testnets

- **Ethereum Goerli** - Ethereum testnet
- **Polygon Mumbai** - Polygon testnet
- **Arbitrum Goerli** - Arbitrum testnet

## Wallet Security

### Private Key Management

- Private keys are validated for correct format
- Keys are stored securely in memory
- Automatic backup functionality available
- Support for encrypted wallets

### Best Practices

1. **Never share private keys** - Keep them secure
2. **Use environment variables** - Don't hardcode keys
3. **Regular backups** - Backup your wallets regularly
4. **Test on testnets** - Test operations on testnets first
5. **Monitor transactions** - Keep track of all transactions

## Network Configuration

### RPC Endpoints

Each network supports both HTTP and WebSocket endpoints:

- HTTP RPC for standard operations
- WebSocket for real-time updates
- Configurable timeouts and retries

### Health Monitoring

- Automatic network health checks
- Response time monitoring
- Block number tracking
- Connection status reporting

### Gas Management

- Automatic gas estimation
- Configurable gas limits
- Priority fee management
- Gas price optimization

## Configuration Validation

```javascript
import web3Config from "../config/web3/index.js";

// Validate entire configuration
const validation = web3Config.validateConfiguration();
if (!validation.isValid) {
  console.error("Configuration errors:", validation.errors);
}

// Get configuration summary
const summary = web3Config.getConfigurationSummary();
console.log("Wallets:", summary.wallets);
console.log("Networks:", summary.networks);
```

## Development

### Adding New Networks

```javascript
import { networkConfig } from "../config/web3/index.js";

networkConfig.addCustomNetwork("my-network", {
  name: "My Custom Network",
  chainId: 12345,
  rpcUrl: "https://my-rpc-endpoint.com",
  currency: "MYTOKEN",
  decimals: 18,
  isTestnet: false,
});
```

### Adding New Wallets

```javascript
import { walletConfig } from "../config/web3/index.js";

// Load from environment variable
walletConfig.loadWalletFromEnv("my-network", "MY_NETWORK_PRIVATE_KEY");

// Load from file
walletConfig.loadWalletFromFile("my-network", "./path/to/private-key.pem");
```

## Troubleshooting

### Common Issues

1. **Invalid private key format**

   - Ensure private key is 64-character hex string
   - Remove any '0x' prefix if present

2. **Network connection issues**

   - Check RPC URL configuration
   - Verify network is accessible
   - Check firewall settings

3. **Wallet not found**
   - Ensure private key is set in environment
   - Check file permissions for wallet files
   - Verify wallet file exists

### Debug Mode

Enable debug logging by setting:

```bash
WEB3_LOG_LEVEL=debug
```

## Security Checklist

- [ ] Private keys are not committed to version control
- [ ] Environment variables are properly set
- [ ] Wallet files have correct permissions
- [ ] Network RPC URLs are secure (HTTPS/WSS)
- [ ] Regular backups are configured
- [ ] Testnet testing is completed
- [ ] Transaction monitoring is enabled
