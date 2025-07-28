# Wallet Connection Feature

## Overview

The Super VM Dashboard now supports wallet connection functionality, allowing users to connect their own wallets (MetaMask, WalletConnect, etc.) instead of relying on hardcoded keys. The system supports both connected wallets and fallback to hardcoded configuration.

## Features

### 🔗 **MetaMask Integration**

- Connect to MetaMask wallet
- Auto-detect network and balance
- Handle account and network changes
- Transaction signing capabilities

### ⚙️ **Hardcoded Configuration Fallback**

- Fallback to system-configured wallets
- Environment variable support (Vite-compatible)
- Secure private key management
- Multiple network support

### 🎯 **Unified Interface**

- Single wallet connection component
- Connection type indication
- Balance and network display
- Quick actions (copy address, view on Etherscan)

## Usage

### For Users

1. **Connect MetaMask:**

   - Click "Connect Wallet" in the header
   - Select "MetaMask" from the dropdown
   - Approve the connection in MetaMask
   - Your wallet address and balance will be displayed

2. **Use Hardcoded Config:**

   - Click "Connect Wallet" in the header
   - Select "Hardcoded Config" from the dropdown
   - System will use configured wallet automatically

3. **Wallet Actions:**
   - Click on your connected wallet address to open dropdown
   - Copy address to clipboard
   - View on Etherscan
   - Disconnect wallet

### For Developers

#### Environment Configuration

Create a `.env` file in the `main-ui` directory:

```bash
# Ethereum Configuration
VITE_ETH_PRIVATE_KEY=your_ethereum_private_key_here
VITE_ETH_RPC_URL=https://mainnet.infura.io/v3/your_project_id

# Polygon Configuration
VITE_POLYGON_PRIVATE_KEY=your_polygon_private_key_here
VITE_POLYGON_RPC_URL=https://polygon-rpc.com

# Arbitrum Configuration
VITE_ARBITRUM_PRIVATE_KEY=your_arbitrum_private_key_here
VITE_ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc

# Aleph Network Configuration
VITE_ALEPH_PRIVATE_KEY=your_aleph_private_key_here
VITE_ALEPH_RPC_URL=https://46.255.204.193

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_REFRESH_INTERVAL=5000

# Development Configuration
VITE_DEV_MODE=true
VITE_DEBUG_WEB3=false
```

**Important Notes:**

- Use `VITE_` prefix for all environment variables (required by Vite)
- Never commit the `.env` file to version control
- The system uses `import.meta.env` instead of `process.env` for Vite compatibility

#### Using Web3 Context

```javascript
import { useWeb3 } from "../context/Web3Context.js";

const MyComponent = () => {
  const { isConnected, walletInfo, balance, network, actions } = useWeb3();

  const handleTransaction = async () => {
    if (isConnected) {
      try {
        const receipt = await actions.sendTransaction(
          "0x...", // to address
          "0.1", // amount in ETH
          "0x" // optional data
        );
        console.log("Transaction successful:", receipt);
      } catch (error) {
        console.error("Transaction failed:", error);
      }
    }
  };

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected: {walletInfo.address}</p>
          <p>Balance: {balance} ETH</p>
          <p>Network: {network}</p>
        </div>
      ) : (
        <button onClick={actions.connectMetaMask}>Connect Wallet</button>
      )}
    </div>
  );
};
```

## Components

### WalletConnect

- Main wallet connection component
- Handles connection UI and state
- Displays wallet information
- Provides connection options

### Web3Context

- Manages wallet state globally
- Provides connection methods
- Handles provider management
- Supports multiple connection types
- Uses Vite-compatible environment variables

## Security Considerations

1. **Private Keys:** Never commit private keys to version control
2. **Environment Variables:** Use `.env` files for sensitive configuration
3. **Network Security:** Use HTTPS RPC endpoints in production
4. **User Consent:** Always request user approval for connections
5. **Error Handling:** Implement proper error handling for failed transactions
6. **Vite Compatibility:** Use `VITE_` prefix for environment variables

## Supported Networks

- Ethereum Mainnet (Chain ID: 1)
- Polygon (Chain ID: 137)
- Binance Smart Chain (Chain ID: 56)
- Arbitrum One (Chain ID: 42161)
- Aleph Network
- Testnets (Goerli, Mumbai, etc.)

## Dependencies

- `ethers` v6.15.0 - Web3 library
- `react` - UI framework
- `framer-motion` - Animations
- `lucide-react` - Icons

## Installation

```bash
cd main-ui
npm install
```

The wallet connection feature is automatically available once the dependencies are installed.

## Troubleshooting

### MetaMask Not Detected

- Ensure MetaMask is installed and unlocked
- Check if the site is running on HTTPS (required for MetaMask)
- Try refreshing the page

### Connection Failed

- Check browser console for errors
- Ensure MetaMask is not locked
- Verify network connectivity

### Balance Not Updating

- Check RPC endpoint configuration
- Verify network connection
- Wait for blockchain confirmations

### Environment Variable Issues

- Ensure all environment variables use `VITE_` prefix
- Check that `.env` file is in the `main-ui` directory
- Restart the development server after changing environment variables
- Use `import.meta.env` instead of `process.env` in Vite

### Process is Not Defined Error

This error occurs when using `process.env` in Vite. The fix is to:

1. Use `import.meta.env` instead of `process.env`
2. Prefix environment variables with `VITE_`
3. Restart the development server

## Future Enhancements

- [ ] WalletConnect v2 support
- [ ] Multi-wallet support (Coinbase Wallet, etc.)
- [ ] Transaction history
- [ ] Network switching UI
- [ ] Gas estimation
- [ ] Contract interaction helpers
- [ ] Integration with existing web3 config directory
