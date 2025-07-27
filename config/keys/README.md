# SSH Keys Directory

This directory contains SSH keys used for VM access and authentication in the distributed VM system.

## Structure

```
keys/
├── README.md              # This file
├── .gitignore            # Prevents committing private keys
├── cluster-vm-key.pem    # Private key for cluster VM access
├── cluster-vm-key.pub    # Public key for cluster VM access
└── templates/            # Key templates and examples
    └── key-template.txt  # Template for new keys
```

## Security

⚠️ **IMPORTANT**: Never commit private keys to version control!

- Private keys (`.pem` files) are automatically ignored by `.gitignore`
- Only public keys (`.pub` files) should be shared
- Keep private keys secure and restrict access

## Key Management

### Automatic Key Generation

The system automatically generates SSH keys when needed:

- Keys are created in this directory
- Private keys are saved with `.pem` extension
- Public keys are saved with `.pub` extension

### Manual Key Management

To use existing SSH keys:

1. Copy your private key to this directory
2. Name it `cluster-vm-key.pem`
3. Ensure proper permissions: `chmod 600 cluster-vm-key.pem`

### Key Rotation

To rotate SSH keys:

1. Generate new keys using the system
2. Update VM instances with new public keys
3. Remove old keys after migration

## Usage

The system automatically uses keys from this directory for:

- VM instance creation
- SSH access to worker nodes
- Authentication with Aleph network

## Permissions

Ensure proper file permissions:

```bash
chmod 600 *.pem    # Private keys - owner read/write only
chmod 644 *.pub    # Public keys - owner read/write, others read
```
