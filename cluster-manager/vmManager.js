// cluster-manager/vmManager.js

import { alephChannel, alephNodeUrl, alephImage } from './constants.js';
import { account, alephClient, getOrInitializeAlephClient } from './client.js';
import forge from 'node-forge';

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

    const client = await getOrInitializeAlephClient();
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

    console.log('SSH Key created and uploaded to Aleph:', message.item_hash);

    return {
        privateKeyPem,
        publicKeyOpenSSH
    };
}

// Create Aleph VM Instance for the Cluster
export async function createVMInstance() {
    const client = await getOrInitializeAlephClient();
    const sshKeys = await getSSHKeys();
    if (!sshKeys.length) {
        console.warn("No SSH keys found. Generating a new key...");
        const { publicKeyOpenSSH } = await createSSHKey();
        sshKeys.push({ key: publicKeyOpenSSH });
    }

    const selectedKey = sshKeys[0].key;
    const label = 'ClusterNode';

    console.log(`Deploying VM with label: ${label}`);
    const instance = await client.createInstance({
        authorized_keys: [selectedKey],
        resources: { vcpus: 4, memory: 8192, seconds: 14400 },
        payment: { chain: "ETH", type: "hold" },
        channel: alephChannel,
        metadata: { name: label },
        image: alephImage,
    });

    console.log(`VM ${instance.item_hash} created successfully.`);
    return instance;
}

// List Aleph VM Instances for the Cluster
export async function listVMInstances() {
    const client = await getOrInitializeAlephClient();
    const response = await client.getMessages({ types: ['INSTANCE'], addresses: [account.address] });

    const nodes = response.messages.map((msg) => ({
        id: msg.item_hash,
        name: msg.content.metadata.name,
        ipv6: msg.content.network_interface[0]?.ipv6 || 'N/A',
        status: msg.confirmed ? 'Running' : 'Pending'
    }));

    console.log('Cluster VM Instances:', nodes);
    return nodes;
}