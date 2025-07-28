# SSH Key Management System

## Overview

The SSH Key Management system provides a comprehensive interface for managing SSH keys used for VM access in the Super VM dashboard. It leverages the existing SSH key management infrastructure in the `config/keys` directory and provides a user-friendly web interface.

## Features

### 🔑 Key Management

- **View All Keys**: Display all available SSH keys with their details
- **Generate New Keys**: Create new SSH key pairs with custom names
- **Set Active Key**: Designate which SSH key to use for VM creation
- **Delete Keys**: Remove SSH keys with confirmation (cannot be undone)
- **Key Validation**: Visual indicators for valid/invalid keys

### 📋 Key Information Display

- **Public Key**: Full public key content in readable format
- **Private Key Path**: File system location of the private key
- **Creation Date**: When the key was generated
- **Validation Status**: Whether the key pair is valid and usable
- **Active Status**: Which key is currently selected for VM creation

### 🔧 Key Operations

- **Copy to Clipboard**: One-click copying of public keys and paths
- **Download Keys**: Save public keys as text files
- **Set as Active**: Choose which key to use for new VMs
- **Delete with Confirmation**: Safe deletion with user confirmation

## Integration with VM Creation

### Automatic Key Selection

When creating VMs, the system automatically uses the **active SSH key** (stored in localStorage). If no active key is set, it uses the first available key.

### Key Priority

1. **Active Key**: Key explicitly set as active by the user
2. **First Available**: First valid key found in the system
3. **Auto-Generation**: Creates a new key if none exist

### VM Creation Flow

1. User clicks "Create VM" in VM Manager
2. System checks for active SSH key in localStorage
3. If active key exists and is valid, use it
4. If not, use first available key or generate new one
5. SSH key is included in VM creation payload to Aleph network

## Backend API Endpoints

### GET `/api/ssh-keys`

Returns all available SSH keys with their details.

**Response:**

```json
{
  "keys": [
    {
      "name": "cluster-vm-key",
      "publicKey": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC...",
      "privateKeyPath": "/path/to/private/key.pem",
      "publicKeyPath": "/path/to/public/key.pub",
      "valid": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST `/api/ssh-keys/generate`

Generates a new SSH key pair.

**Request:**

```json
{
  "keyName": "my-new-key"
}
```

**Response:**

```json
{
  "success": true,
  "message": "SSH key 'my-new-key' generated successfully",
  "keyInfo": {
    "name": "my-new-key",
    "publicKey": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC...",
    "privateKeyPath": "/path/to/private/key.pem",
    "publicKeyPath": "/path/to/public/key.pub"
  }
}
```

### DELETE `/api/ssh-keys/:keyName`

Deletes an SSH key pair.

**Response:**

```json
{
  "success": true,
  "message": "SSH key 'my-key' deleted successfully (private key, public key)"
}
```

## File System Structure

The SSH keys are stored in the `config/keys` directory:

```
config/keys/
├── cluster-vm-key.pem      # Private key
├── cluster-vm-key.pub      # Public key
├── worker-key.pem          # Private key
├── worker-key.pub          # Public key
├── keyManager.js           # Key management utilities
├── manage-keys.js          # CLI key management
└── backups/                # Key backups
```

## Security Considerations

### Key Storage

- Private keys are stored with restricted permissions (600)
- Public keys are stored with standard permissions (644)
- Keys are backed up automatically when generated

### Key Validation

- All keys are validated before use
- Invalid keys are clearly marked in the interface
- Only valid keys can be set as active

### Key Deletion

- Deletion requires user confirmation
- Both private and public key files are removed
- Active key is cleared if deleted

## Usage Examples

### Setting Up SSH Keys for VM Creation

1. **Navigate to SSH Keys page** in the dashboard
2. **Generate a new key** or use existing keys
3. **Set an active key** by clicking "Set Active"
4. **Create VMs** - the system will automatically use the active key

### Managing Multiple Keys

1. **Generate multiple keys** for different purposes
2. **Set appropriate active key** for current VM creation
3. **Switch active keys** as needed for different VM types
4. **Delete unused keys** to keep the system clean

### Troubleshooting

**No SSH Keys Available:**

- Generate a new key using the "Generate New Key" button
- The system will automatically set it as active

**Invalid Key:**

- Check if the key files exist and have correct permissions
- Regenerate the key if necessary

**VM Creation Fails:**

- Verify the active SSH key is valid
- Check that the key is properly formatted for Aleph network
- Ensure the key has the correct permissions

## Integration Points

### With VM Manager

- Automatically uses active SSH key for VM creation
- Falls back to first available key if no active key set
- Generates new key if none exist

### With Backend Key Management

- Uses existing `keyManager.js` utilities
- Leverages established file system structure
- Maintains compatibility with CLI tools

### With Aleph Network

- Includes SSH public key in VM creation payload
- Ensures proper key format for Aleph requirements
- Handles key validation and error cases

## Future Enhancements

### Planned Features

- **Key Import**: Import existing SSH keys from files
- **Key Export**: Export keys in various formats
- **Key Rotation**: Automatic key rotation for security
- **Multi-Key Support**: Use different keys for different VM types
- **Key Backup**: Enhanced backup and recovery options

### Security Improvements

- **Encrypted Storage**: Encrypt private keys at rest
- **Key Expiration**: Set expiration dates for keys
- **Access Logging**: Log key usage and access attempts
- **Audit Trail**: Track key creation, modification, and deletion
