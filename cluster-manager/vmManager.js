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

import { alephChannel, alephNodeUrl, alephImage } from './constants.js';
import forge from 'node-forge';
const axios = require('axios');
const { execSync } = require('child_process');
const fs = require('fs');

// Create SSH Key for VM Access
export async function createSSHKey() {
    console.log('Starting SSH key generation for cluster...');
    let keyPair = forge.pki.rsa.generateKeyPair({ bits: 4096 });
    let privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
    let publicKeyOpenSSH = forge.ssh.publicKeyToOpenSSH(
        keyPair.publicKey,
        "ALEPH_VM_ACCESS"
    );

    const label = 'ClusterVMKey';

    const message = await axios.post(`${alephNodeUrl}/api/create-ssh`, {
        key: publicKeyOpenSSH,
        label: label,
        channel: alephChannel,
    });

    console.log('SSH Key created and uploaded:', message.data);

    fs.writeFileSync(`${label}_private_key.pem`, privateKeyPem);
    console.log('Private key saved locally.');

    return {
        privateKeyPem,
        publicKeyOpenSSH
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
    const instance = await axios.post(`${alephNodeUrl}/api/create-vm`, {
        authorized_keys: [selectedKey],
        resources: { vcpus: 4, memory: 8192, seconds: 14400 },
        payment: { chain: "ETH", type: "hold" },
        channel: alephChannel,
        metadata: { name: label },
        image: alephImage,
    });

    console.log(`VM created successfully:`, instance.data);
    return instance.data;
}

// List Aleph VM Instances for the Cluster
export async function listVMInstances() {
    const response = await axios.get(`${alephNodeUrl}/api/list-vms`);

    const nodes = response.data.map((msg) => ({
        id: msg.item_hash,
        name: msg.content.metadata.name,
        ipv6: msg.content.network_interface[0]?.ipv6 || 'N/A',
        status: msg.confirmed ? 'Running' : 'Pending'
    }));

    console.log('Cluster VM Instances:', nodes);
    return nodes;
}
