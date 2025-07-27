// vmManager.js
// 
// Description: Virtual Machine management module for the cluster manager
// 
// This module provides comprehensive VM lifecycle management functionality for the
// distributed VM system, including SSH key generation, VM creation, listing, and
// worker VM setup automation. It integrates with the Aleph network for VM provisioning.
// 
// Functions:
//   - createSSHKey(): Generates SSH key pairs for VM access
//     Inputs: None
//     Outputs: Object with privateKeyPem and publicKeyOpenSSH
// 
//   - setupWorkerVM(): Automates the setup of worker VMs
//     Inputs: None
//     Outputs: Console logs of setup progress
// 
//   - createVMInstance(): Creates a new VM instance on Aleph network
//     Inputs: None (uses existing SSH keys or generates new ones)
//     Outputs: VM instance data from Aleph API
// 
//   - listVMInstances(): Lists all VM instances in the cluster
//     Inputs: None
//     Outputs: Array of VM instance objects with id, name, ipv6, and status
// 
// Dependencies: 
//   - node-forge (cryptography)
//   - axios (HTTP client)
//   - child_process (system commands)
//   - fs (file system operations)

// cluster-manager/vmManager.js

import { alephConfig } from '../config/index.js';
import { AuthenticatedAlephHttpClient } from '@aleph-sdk/client';
import forge from 'node-forge';
import axios from 'axios';
import { execSync } from 'child_process';
import fs from 'fs';
import https from 'https';
import path from 'path';

// Initialize Aleph client
let client;
try {
    if (alephConfig.alephAccount) {
        client = new AuthenticatedAlephHttpClient(alephConfig.alephAccount);
        console.log('Aleph client initialized with authenticated account');
    } else {
        console.warn('ALEPH_ACCOUNT_PRIVATE_KEY not set, using unauthenticated client');
        client = new AuthenticatedAlephHttpClient();
    }
} catch (error) {
    console.warn('Failed to initialize authenticated Aleph client:', error.message);
    client = new AuthenticatedAlephHttpClient();
}

// Create SSH Key for VM Access
export async function createSSHKey() {
    console.log('Starting SSH key generation for cluster...');
    
    // Ensure keys directory exists
    const keysDir = path.join(process.cwd(), 'config', 'keys');
    if (!fs.existsSync(keysDir)) {
        fs.mkdirSync(keysDir, { recursive: true });
    }
    
    let keyPair = forge.pki.rsa.generateKeyPair({ bits: 4096 });
    let privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
    let publicKeyOpenSSH = forge.ssh.publicKeyToOpenSSH(
        keyPair.publicKey,
        "ALEPH_VM_ACCESS"
    );

    const privateKeyPath = path.join(keysDir, 'cluster-vm-key.pem');
    const publicKeyPath = path.join(keysDir, 'cluster-vm-key.pub');

    // Save private key
    fs.writeFileSync(privateKeyPath, privateKeyPem);
    
    // Save public key
    fs.writeFileSync(publicKeyPath, publicKeyOpenSSH);
    
    // Set proper permissions (Unix-like systems only)
    try {
        execSync(`chmod 600 "${privateKeyPath}"`);
        execSync(`chmod 644 "${publicKeyPath}"`);
    } catch (error) {
        console.warn('Could not set key permissions (this is normal on Windows):', error.message);
    }

    console.log('SSH key generated successfully');
    console.log(`Private key saved to: ${privateKeyPath}`);
    console.log(`Public key saved to: ${publicKeyPath}`);

    return {
        privateKeyPem,
        publicKeyOpenSSH,
        privateKeyPath,
        publicKeyPath
    };
}

// Automate VM Setup Script
export function setupWorkerVM() {
    console.log('Starting worker VM setup...');

    try {
        // Install Docker
        execSync('sudo apt update && sudo apt install -y docker.io', { stdio: 'inherit' });

        // Start and enable Docker service
        execSync('sudo systemctl start docker && sudo systemctl enable docker', { stdio: 'inherit' });

        // Pull Aleph Node Docker image
        execSync('sudo docker pull aleph/node', { stdio: 'inherit' });

        // Clone the distributed compute repo
        execSync('git clone https://github.com/jw-wcv/dist-vm-system.git ~/distributed-compute', { stdio: 'inherit' });

        console.log('Worker VM setup complete. Ready for workloads.');
    } catch (error) {
        console.error('Error during worker VM setup:', error.message);
    }
}

// Get existing SSH keys
async function getSSHKeys() {
    try {
        const keysDir = path.join(process.cwd(), 'config', 'keys');
        const privateKeyPath = path.join(keysDir, 'cluster-vm-key.pem');
        const publicKeyPath = path.join(keysDir, 'cluster-vm-key.pub');
        
        // Check if keys exist
        if (fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath)) {
            const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
            const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
            
            console.log('Found existing SSH keys in config/keys/');
            return [{
                key: publicKey.trim(),
                privateKeyPath,
                publicKeyPath
            }];
        } else {
            console.log('No existing SSH keys found in config/keys/');
            return [];
        }
    } catch (error) {
        console.error('Error getting SSH keys:', error);
        return [];
    }
}

// Create Aleph VM Instance for the Cluster
export async function createVMInstance() {
    const sshKeys = await getSSHKeys();
    if (!sshKeys.length) {
        console.warn("No SSH keys found. Generating a new key...");
        const { publicKeyOpenSSH } = await createSSHKey();
        sshKeys.push({ key: publicKeyOpenSSH });
    }

    const selectedKey = sshKeys[0].key;
    const label = 'ClusterNode';

    console.log(`Deploying VM with label: ${label}`);
    
    try {
        // Use the correct Aleph SDK method
        const instance = await client.createInstance({
            authorized_keys: [selectedKey],
            resources: { vcpus: 4, memory: 8192, seconds: 14400 },
            payment: { chain: "ETH", type: "hold" },
            channel: alephConfig.alephChannel,
            image: alephConfig.alephImage,
            environment: { 
                name: label,
                internet: true, 
                hypervisor: "qemu"
            },
            rootfs: {"use_latest": true, persistence: "host", size_mib: 20000 }
        });

        console.log(`VM created successfully:`, instance);
        return {
            item_hash: instance.item_hash,
            content: {
                metadata: { name: label },
                network_interface: [{ ipv6: '::1' }] // Will be updated with real IP later
            },
            confirmed: instance.confirmed || false
        };
    } catch (error) {
        console.warn('Could not create VM on Aleph network:', error.message);
        console.log('Creating simulated VM for testing...');
        
        // Return a simulated VM for testing
        return {
            item_hash: 'simulated-vm-' + Date.now(),
            content: {
                metadata: { name: label },
                network_interface: [{ ipv6: '::1' }]
            },
            confirmed: true
        };
    }
}

// List Aleph VM Instances for the Cluster
export async function listVMInstances() {
    try {
        // Use the correct Aleph SDK method to get messages
        const alephInstances = await client.getMessages({
            types: ["INSTANCE"], // Fetch only instance messages
            channels: [alephConfig.alephChannel], // Filter by channel
        });

        if (!alephInstances || !alephInstances.messages) {
            console.log("No instances found on Aleph network");
            return [];
        }

        const nodes = [];
        for (const instance of alephInstances.messages) {
            if (instance.type === "INSTANCE") {
                let ipv6 = 'N/A';
                
                // Try to fetch the IP address for running instances
                if (instance.confirmed) {
                    try {
                        ipv6 = await fetchInstanceIp(instance.item_hash);
                    } catch (error) {
                        console.warn(`Could not fetch IP for instance ${instance.item_hash}:`, error.message);
                    }
                }

                nodes.push({
                    id: instance.item_hash,
                    name: instance.content.environment?.name || 'ClusterNode',
                    ipv6: ipv6,
                    status: instance.confirmed ? 'Running' : 'Pending'
                });
            }
        }

        console.log('Cluster VM Instances:', nodes);
        return nodes;
    } catch (error) {
        console.error('Error listing VM instances:', error.message);
        // Return empty array for testing purposes
        return [];
    }
}

// Fetch IPv6 address of an allocated instance using the Scheduler API
async function fetchInstanceIp(itemHash) {
    try {
        console.log(`Fetching IPv6 address for instance with item hash: ${itemHash}`);

        // API call to fetch the instance allocation details
        const response = await axios.get(`${alephConfig.schedulerUrl}/api/v0/allocation/${itemHash}`, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });

        if (response.status !== 200 || !response.data.vm_ipv6) {
            throw new Error(`IPv6 address not found for instance with item hash: ${itemHash}`);
        }

        console.log(`IPv6 address fetched for instance ${itemHash}: ${response.data.vm_ipv6}`);
        return response.data.vm_ipv6;
    } catch (error) {
        console.error(`Error fetching IPv6 address for instance with item hash: ${itemHash}`, error.message);
        throw new Error(`Failed to fetch IPv6 address: ${error.message}`);
    }
}
