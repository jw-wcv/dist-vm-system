// vmManager.js
// 
// Description: Virtual Machine management module for the main UI application
// 
// This module provides the frontend VM management functionality for the distributed
// VM system. It handles SSH key generation, VM creation, listing, and management
// through the Aleph network, with user-friendly UI interactions and modal dialogs.
// 
// Functions:
//   - createSSHKey(): Generates and uploads SSH key pairs for VM access
//     Inputs: User prompt for key label
//     Outputs: Private key download, public key uploaded to Aleph
// 
//   - createVMInstance(): Creates a new VM instance on Aleph network
//     Inputs: User prompt for VM name, existing SSH keys
//     Outputs: New VM instance with specified configuration
// 
//   - listVMInstances(): Lists all VM instances owned by the user
//     Inputs: None
//     Outputs: Array of VM objects with id, name, ipv6, and status
// 
// Features:
//   - Modal dialogs for user feedback
//   - Automatic private key download
//   - Real-time status updates
//   - Error handling with user alerts
// 
// Dependencies: 
//   - constants.js (Aleph configuration)
//   - client.js (Aleph client setup)
//   - node-forge (cryptography)
//   - Modal components (UI feedback)

import { alephChannel, alephNodeUrl, alephImage } from './constants.js';
import { account, alephClient, getOrInitializeAlephClient } from './client.js';
import forge from 'node-forge';

// Create SSH Key for VM Access
export async function createSSHKey() {
    const spinnerModal = createModal({
        title: 'Creating SSH Key',
        body: '<p>Generating a 4096-bit RSA key. Please wait...</p>',
        showSpinner: true
    });

    setTimeout(async () => {
        try {
            const client = await getOrInitializeAlephClient();
            let keyPair = forge.pki.rsa.generateKeyPair({ bits: 4096 });
            let privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
            let publicKeyOpenSSH = forge.ssh.publicKeyToOpenSSH(
                keyPair.publicKey,
                "ALEPH_VM_ACCESS"
            );

            const label = prompt("Enter a label for your SSH key:", "AlephVMKey");
            if (!label) throw new Error("SSH Key label is required.");

            const message = await client.createPost({
                content: {
                    type: "ALEPH-SSH",
                    content: {
                        key: publicKeyOpenSSH,
                        label: label,
                    },
                },
                postType: "POST",
                channel: alephChannel,
            });

            let blob = new Blob([privateKeyPem], { type: "text/plain" });
            let url = URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = `${label}_private_key.pem`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            alert("SSH Key created and saved.");
        } catch (error) {
            console.error("SSH Key creation error:", error);
            alert("Error creating SSH Key.");
        } finally {
            removeModal(spinnerModal);
        }
    }, 0);
}

// Create Aleph VM Instance
export async function createVMInstance() {
    const client = await getOrInitializeAlephClient();
    const sshKeys = await getSSHKeys();
    if (!sshKeys.length) {
        alert("No SSH keys found. Please create one.");
        return;
    }

    const selectedKey = sshKeys[0].key;
    const label = prompt("Enter a name for the VM:", "AlephVM");
    if (!label) return;

    const creationModal = createModal({
        title: 'Creating VM Instance',
        body: '<p>Deploying a new Aleph VM. Please wait...</p>',
        showSpinner: true
    });

    try {
        const instance = await client.createInstance({
            authorized_keys: [selectedKey],
            resources: { vcpus: 2, memory: 4096, seconds: 7200 },
            payment: { chain: "ETH", type: "hold" },
            channel: alephChannel,
            metadata: { name: label },
            image: alephImage,
        });

        alert(`VM ${instance.item_hash} created successfully!`);
    } catch (error) {
        console.error("VM creation failed:", error);
        alert("Error creating VM.");
    } finally {
        removeModal(creationModal);
    }
}

// List and Manage Aleph VMs
export async function listVMInstances() {
    const client = await getOrInitializeAlephClient();
    const response = await client.getMessages({ types: ['INSTANCE'], addresses: [account.address] });

    const nodes = response.messages.map((msg) => ({
        id: msg.item_hash,
        name: msg.content.metadata.name,
        ipv6: msg.content.network_interface[0]?.ipv6 || 'N/A',
        status: msg.confirmed ? 'Running' : 'Pending'
    }));

    return nodes;
}
