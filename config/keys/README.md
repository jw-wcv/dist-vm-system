# SSH Key Management

This directory contains SSH key management utilities for the distributed VM system, supporting multiple SSH keys for different purposes.

## Features

- **Multi-key Support**: Generate and manage multiple SSH keys (e.g., cluster-vm-key, worker-key, backup-key)
- **Automatic Backups**: Keys are automatically backed up before overwriting
- **Key Validation**: Comprehensive validation of key pairs
- **Flexible Naming**: Custom key names for different use cases
- **Security**: Proper file permissions and secure key generation

## Structure

```
config/keys/
├── README.md              # This file
├── .gitignore            # Prevents committing private keys
├── keyManager.js         # Key management utilities (multi-key support)
├── manage-keys.js        # Command-line key management tool
├── package.json          # ES module configuration
├── cluster-vm-key.pem    # Private key for cluster VM access
├── cluster-vm-key.pub    # Public key for cluster VM access
├── worker-key.pem        # Private key for worker nodes
├── worker-key.pub        # Public key for worker nodes
├── templates/            # Key templates and examples
│   └── key-template.txt  # Template for new keys
└── backups/              # Key backups (auto-created)
    └── [timestamp]/      # Timestamped backup directories
```

## Security

⚠️ **IMPORTANT**: Never commit private keys to version control!

- Private keys (`.pem` files) are automatically ignored by `.gitignore`
- Only public keys (`.pub` files) should be shared
- Keep private keys secure and restrict access
- Automatic permission setting (600 for private, 644 for public)

## Key Types and Use Cases

- **cluster-vm-key**: Default key for cluster management
- **worker-key**: Keys for worker nodes
- **backup-key**: Keys for backup operations
- **custom-name**: Any custom key name for specific purposes

## Usage

### Command Line Interface

```bash
# Generate a new SSH key pair (default: cluster-vm-key)
node manage-keys.js generate

# Generate a key with custom name
node manage-keys.js generate worker-key
node manage-keys.js generate backup-key

# Validate existing keys
node manage-keys.js validate
node manage-keys.js validate worker-key

# Backup keys
node manage-keys.js backup
node manage-keys.js backup cluster-vm-key

# List all keys with status
node manage-keys.js list

# Show detailed key information
node manage-keys.js info

# Show help
node manage-keys.js help
```

### Programmatic Usage

```javascript
import keyManager from "./keyManager.js";

// Generate a new key
const result = await keyManager.generateKey("worker-key");

// Validate a specific key
const validation = keyManager.validateKeyPair("worker-key");

// Get public key content for a specific key
const publicKey = keyManager.getPublicKey("worker-key");

// List all keys
const keyGroups = keyManager.listKeys();

// Get detailed information about all keys
const keysInfo = keyManager.getKeysInfo();

// Get key paths for a specific key
const paths = keyManager.getKeyPaths("worker-key");

// Check if a specific key exists
const exists = keyManager.keysExist("worker-key");
```

## Automatic Key Management

The system automatically:

- Generates keys when needed
- Backs up existing keys before overwriting
- Validates key integrity
- Sets proper file permissions
- Supports both RSA and OpenSSH key formats

## Key Rotation

To rotate SSH keys:

1. Generate new keys using the system
2. Update VM instances with new public keys
3. Remove old keys after migration
4. Use the backup feature to preserve old keys

## Permissions

The system automatically sets proper file permissions:

```bash
chmod 600 *.pem    # Private keys - owner read/write only
chmod 644 *.pub    # Public keys - owner read/write, others read
```

## Integration

The key management system integrates with:

- VM instance creation
- SSH access to worker nodes
- Authentication with Aleph network
- Distributed scheduler
- Cluster manager API
