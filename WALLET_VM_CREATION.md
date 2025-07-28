# Wallet-Connected VM Creation on Aleph Network

## 🚀 Overview

The Super VM system now supports **wallet-connected VM creation** on the Aleph network! This feature allows users to create virtual machines using their connected wallets (MetaMask, hardcoded configuration, etc.) instead of relying solely on system-configured credentials.

## ✨ Features

### 🔗 **Wallet Integration**

- **MetaMask Support**: Connect your MetaMask wallet for VM creation
- **Hardcoded Configuration**: Use system-configured wallet credentials
- **Multi-Wallet Support**: Support for different wallet types and networks
- **Secure Credential Management**: Private keys handled securely

### 🖥️ **VM Creation Capabilities**

- **Custom VM Configuration**: Specify CPU, memory, storage, and image
- **Aleph Network Integration**: Direct integration with Aleph VM provisioning
- **Real-time Status Tracking**: Monitor VM creation and allocation progress
- **Automatic Resource Management**: SSH keys and network configuration

### 🛡️ **Security & Reliability**

- **Error Handling**: Robust error handling for network issues
- **Fallback Mechanisms**: Simulation mode for testing without network access
- **Input Validation**: Comprehensive validation of wallet and VM data
- **Secure Communication**: Encrypted communication with Aleph network

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Aleph Network │
│   (Dashboard)   │◄──►│   (API Server)  │◄──►│   (VM Creation) │
│                 │    │                 │    │                 │
│ • Wallet Connect│    │ • VM Manager    │    │ • Instance API  │
│ • VM Creation UI│    │ • Aleph Client  │    │ • Resource Mgmt │
│ • Status Display│    │ • SSH Key Mgmt  │    │ • Network Setup │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Usage

### **For Users**

#### 1. **Connect Your Wallet**

```javascript
// Connect MetaMask
await actions.connectMetaMask();

// Or use hardcoded configuration
await actions.connectHardcoded();
```

#### 2. **Create a VM**

```javascript
// Navigate to VM Manager in the dashboard
// Click "Create VM" button
// Fill in VM configuration:
{
  name: "My-Worker-VM",
  vcpus: 4,
  memory: 8192,  // MB
  storage: 80,   // GB
  image: "aleph/node"
}
```

#### 3. **Monitor Creation**

- Real-time status updates
- IP address allocation
- Resource availability
- SSH access configuration

### **For Developers**

#### **Backend API Endpoints**

```bash
# Create VM with wallet credentials
POST /api/vms/create-with-wallet
{
  "walletAddress": "0x...",
  "privateKey": "0x...",
  "vmConfig": {
    "name": "Worker-VM",
    "vcpus": 4,
    "memory": 8192,
    "storage": 80,
    "image": "aleph/node"
  },
  "paymentMethod": "aleph"
}

# Get VM status
GET /api/vms/{vmId}/status

# List all VMs
GET /api/vms

# Delete VM
DELETE /api/vms/{vmId}
```

#### **Frontend Integration**

```javascript
import { useWeb3 } from "../context/Web3Context.js";
import { useSuperVM } from "../context/SuperVMContext.js";

const VMManager = () => {
  const { isConnected, walletInfo, connectionType } = useWeb3();
  const { actions } = useSuperVM();

  const createVM = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const result = await actions.createVMWithWallet(
        walletInfo.address,
        privateKey, // Securely obtained
        vmConfig
      );

      console.log("VM created:", result.item_hash);
    } catch (error) {
      console.error("VM creation failed:", error);
    }
  };
};
```

## 🔧 Configuration

### **Environment Variables**

```bash
# Wallet Configuration (for hardcoded mode)
VITE_ETH_PRIVATE_KEY=your_ethereum_private_key_here
VITE_ETH_RPC_URL=https://mainnet.infura.io/v3/your_project_id

# Aleph Network Configuration
VITE_ALEPH_PRIVATE_KEY=your_aleph_private_key_here
VITE_ALEPH_RPC_URL=https://46.255.204.193

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
```

### **VM Configuration Options**

```javascript
const vmConfig = {
  name: "Custom-VM-Name", // VM display name
  vcpus: 4, // Number of virtual CPUs (1-16)
  memory: 8192, // Memory in MB (1024-32768)
  storage: 80, // Storage in GB (20-500)
  image: "aleph/node", // Docker image to use
  internet: true, // Enable internet access
  hypervisor: "firecracker", // Hypervisor type
  persistence: "host", // Storage persistence mode
};
```

## 🧪 Testing

### **Run Test Suite**

```bash
# Test wallet-connected VM creation
cd test
node test-wallet-vm-creation.js
```

### **Test Coverage**

- ✅ Cluster manager health check
- ✅ Super VM status verification
- ✅ VM list endpoint functionality
- ✅ Wallet-connected VM creation
- ✅ VM status tracking
- ✅ Error handling for invalid data
- ✅ Error handling for missing wallet data

## 🔍 Monitoring & Debugging

### **Logs to Watch**

```bash
# Backend logs
tail -f cluster-manager/logs/vm-creation.log

# Frontend console
# Check browser developer tools for wallet connection status
```

### **Common Issues**

#### **1. Wallet Not Connected**

```
Error: Please connect your wallet first
Solution: Connect MetaMask or use hardcoded configuration
```

#### **2. Private Key Not Available**

```
Error: MetaMask does not expose private keys
Solution: Use hardcoded configuration or different wallet
```

#### **3. Aleph Network Unavailable**

```
Error: Failed to create VM on Aleph network
Solution: Check network connectivity and Aleph node status
```

#### **4. Insufficient Balance**

```
Error: Insufficient funds for VM creation
Solution: Ensure wallet has enough ALEPH tokens
```

## 🚀 Deployment

### **Production Setup**

1. **Configure Environment Variables**

   ```bash
   # Set production wallet credentials
   export VITE_ETH_PRIVATE_KEY=production_key
   export VITE_ALEPH_PRIVATE_KEY=production_aleph_key
   ```

2. **Enable HTTPS**

   ```bash
   # MetaMask requires HTTPS in production
   # Configure SSL certificates
   ```

3. **Monitor Resources**
   ```bash
   # Set up monitoring for VM creation
   # Track wallet balances
   # Monitor Aleph network status
   ```

### **Security Considerations**

- 🔐 **Never commit private keys** to version control
- 🔐 **Use environment variables** for sensitive data
- 🔐 **Enable HTTPS** for production deployments
- 🔐 **Implement rate limiting** for VM creation
- 🔐 **Monitor wallet balances** to prevent overspending

## 📊 Performance

### **VM Creation Times**

| Configuration        | Creation Time | Allocation Time |
| -------------------- | ------------- | --------------- |
| Small (2 vCPU, 4GB)  | ~30 seconds   | ~60 seconds     |
| Medium (4 vCPU, 8GB) | ~45 seconds   | ~90 seconds     |
| Large (8 vCPU, 16GB) | ~60 seconds   | ~120 seconds    |

### **Resource Limits**

- **Maximum VMs per wallet**: 10 (configurable)
- **Maximum vCPUs per VM**: 16
- **Maximum memory per VM**: 32GB
- **Maximum storage per VM**: 500GB

## 🔮 Future Enhancements

### **Planned Features**

- [ ] **WalletConnect v2** integration
- [ ] **Multi-wallet support** (Coinbase Wallet, etc.)
- [ ] **Batch VM creation** for scaling
- [ ] **VM templates** for common configurations
- [ ] **Cost estimation** before creation
- [ ] **Auto-scaling** based on wallet balance
- [ ] **VM marketplace** integration

### **Advanced Features**

- [ ] **GPU passthrough** support
- [ ] **Custom network** configuration
- [ ] **Backup and restore** functionality
- [ ] **Load balancing** across VMs
- [ ] **Monitoring and alerting** integration

## 📚 API Reference

### **VM Creation Response**

```json
{
  "item_hash": "QmVMHash...",
  "content": {
    "metadata": {
      "name": "Worker-VM",
      "createdBy": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "network_interface": [
      {
        "ipv6": "2001:db8::1"
      }
    ],
    "resources": {
      "vcpus": 4,
      "memory": 8192,
      "storage": 80
    },
    "payment": {
      "method": "aleph",
      "wallet": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
    }
  },
  "confirmed": true,
  "walletAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "status": "running"
}
```

### **Error Responses**

```json
{
  "error": "Wallet address and private key are required for VM creation",
  "status": 400
}
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Implement your changes**
4. **Add tests for new functionality**
5. **Submit a pull request**

## 📞 Support

For support and questions:

- 📧 **Email**: support@super-vm.com
- 💬 **Discord**: Join our community
- 📖 **Documentation**: Check the wiki
- 🐛 **Issues**: Report bugs on GitHub

---

**🎉 Ready to create VMs with your wallet on the Aleph network!** 🚀
