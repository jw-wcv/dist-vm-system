// index.js
// 
// Description: Main entry point for the cluster manager API server with Super VM integration
// 
// This file sets up an Express.js server that provides REST API endpoints
// for cluster management, monitoring, and Super VM distributed computing functionality.
// 
// Inputs: HTTP requests to various API endpoints
// Outputs: JSON responses with cluster status, Super VM operations, and task results
// 
// Dependencies: 
//   - express (Node.js web framework)
//   - super-vm.js (distributed computing interface)
//   - vmManager.js (VM management)

import express from 'express';
import { listVMInstances, createVMInstance, createVMInstanceWithWallet } from './vmManager.js';
import { default as Scheduler } from './distributed-scheduler.js';
import systemConfig from '../config/system/index.js';

const app = express();

// CORS middleware to allow requests from the frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Import Super VM and scheduler
let superVM;
let scheduler;
async function initializeSuperVM() {
    try {
        const { default: SuperVM } = await import('./super-vm.js');
        superVM = SuperVM;
        scheduler = Scheduler;
        await superVM.initialize();
        console.log('Super VM initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Super VM:', error);
    }
}

// Initialize Super VM on startup
initializeSuperVM();

// Middleware
app.use(express.json({ limit: systemConfig.config.api.maxPayloadSize }));
app.use(express.urlencoded({ extended: true }));

// Basic cluster status endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'Cluster Running', 
    nodes: 10,
    superVM: superVM ? superVM.getStatus() : { status: 'initializing' }
  });
});

// Super VM endpoints
app.get('/api/super-vm/status', (req, res) => {
  if (!superVM) {
    return res.status(503).json({ error: 'Super VM not initialized' });
  }
  res.json(superVM.getStatus());
});

app.get('/api/super-vm/resources', (req, res) => {
  if (!superVM) {
    return res.status(503).json({ error: 'Super VM not initialized' });
  }
  res.json(superVM.getResourceInfo());
});

app.get('/api/super-vm/metrics', (req, res) => {
  if (!superVM) {
    return res.status(503).json({ error: 'Super VM not initialized' });
  }
  res.json(superVM.getPerformanceMetrics());
});

// Task execution endpoints
app.post('/api/super-vm/render', async (req, res) => {
  if (!superVM) {
    return res.status(503).json({ error: 'Super VM not initialized' });
  }
  
  try {
    const { sceneFile, frameStart, frameEnd, options } = req.body;
    const result = await superVM.renderScene(sceneFile, frameStart, frameEnd, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/super-vm/process', async (req, res) => {
  if (!superVM) {
    return res.status(503).json({ error: 'Super VM not initialized' });
  }
  
  try {
    const { inputData, operation, parameters } = req.body;
    const result = await superVM.processData(inputData, operation, parameters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/super-vm/browser', async (req, res) => {
  if (!superVM) {
    return res.status(503).json({ error: 'Super VM not initialized' });
  }
  
  try {
    const { url, actions, options } = req.body;
    const result = await superVM.automateBrowser(url, actions, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/super-vm/sync', async (req, res) => {
  if (!superVM) {
    return res.status(503).json({ error: 'Super VM not initialized' });
  }
  
  try {
    const { operation, files, options } = req.body;
    const result = await superVM.syncFiles(operation, files, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Scaling endpoint
app.post('/api/super-vm/scale', async (req, res) => {
  if (!superVM) {
    return res.status(503).json({ error: 'Super VM not initialized' });
  }
  
  try {
    const { nodes } = req.body;
    await superVM.scale(nodes || 1);
    res.json({ success: true, message: `Scaled by ${nodes} nodes` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// VM management endpoints with wallet integration
app.get('/api/vms', async (req, res) => {
  if (!superVM) {
    return res.status(503).json({ error: 'Super VM not initialized' });
  }
  
  try {
    const vms = await listVMInstances();
    res.json(vms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/vms', async (req, res) => {
  if (!superVM) {
    return res.status(503).json({ error: 'Super VM not initialized' });
  }
  
  try {
    const newVM = await createVMInstance();
    res.json(newVM);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New endpoint for wallet-connected VM creation
app.post('/api/vms/create-with-wallet', async (req, res) => {
  if (!superVM) {
    return res.status(503).json({ error: 'Super VM not initialized' });
  }
  
  try {
    const { 
      walletAddress, 
      privateKey, 
      signature,
      message,
      method = 'hardcoded',
      vmConfig = {},
      paymentMethod = 'aleph'
    } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ 
        error: 'Wallet address is required for VM creation' 
      });
    }

    let newVM;
    
    if (method === 'metamask') {
      // Handle MetaMask signature-based VM creation
      if (!signature || !message) {
        return res.status(400).json({ 
          error: 'Signature and message are required for MetaMask VM creation' 
        });
      }
      
      const { createVMInstanceWithMetaMask } = await import('./vmManager.js');
      newVM = await createVMInstanceWithMetaMask(walletAddress, signature, message, vmConfig);
    } else {
      // Handle private key-based VM creation
      if (!privateKey) {
        return res.status(400).json({ 
          error: 'Private key is required for VM creation' 
        });
      }
      
      newVM = await createVMInstanceWithWallet(walletAddress, privateKey, vmConfig, paymentMethod);
    }
    
    res.json(newVM);
  } catch (error) {
    console.error('Wallet-connected VM creation failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get VM creation status
app.get('/api/vms/:id/status', async (req, res) => {
  if (!superVM) {
    return res.status(503).json({ error: 'Super VM not initialized' });
  }
  
  try {
    const vmId = req.params.id;
    const vms = await listVMInstances();
    const vm = vms.find(v => v.id === vmId);
    
    if (!vm) {
      return res.status(404).json({ error: 'VM not found' });
    }
    
    res.json({
      id: vm.id,
      status: vm.status,
      ipv6: vm.ipv6,
      name: vm.name,
      createdAt: vm.createdAt,
      lastSeen: vm.lastSeen
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/vms/:id', async (req, res) => {
  if (!superVM) {
    return res.status(503).json({ error: 'Super VM not initialized' });
  }
  
  try {
    // In a real implementation, you would delete the VM
    res.json({ success: true, message: `VM ${req.params.id} deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Task management endpoints
app.get('/api/tasks', (req, res) => {
  if (!superVM) {
    return res.status(503).json({ error: 'Super VM not initialized' });
  }
  
  try {
    // Get tasks from scheduler with fallback
    let tasks = [];
    if (scheduler && typeof scheduler.getTaskHistory === 'function') {
      tasks = scheduler.getTaskHistory();
    }
    
    // Return tasks in the expected format
    res.json({
      tasks: tasks,
      activeTasks: tasks.filter(t => t.status === 'running').length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      failedTasks: tasks.filter(t => t.status === 'failed').length
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tasks/:id', (req, res) => {
  if (!superVM) {
    return res.status(503).json({ error: 'Super VM not initialized' });
  }
  
  try {
    // Get specific task details
    const task = scheduler.getTaskById ? scheduler.getTaskById(req.params.id) : null;
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Node management endpoints
app.get('/api/nodes', (req, res) => {
  if (!superVM) {
    return res.status(503).json({ error: 'Super VM not initialized' });
  }
  
  try {
    // Get nodes from scheduler with fallback
    let nodes = [];
    if (scheduler && typeof scheduler.getNodeDetails === 'function') {
      nodes = scheduler.getNodeDetails();
    }
    
    // Return nodes in the expected format
    res.json({
      nodes: nodes,
      activeNodes: nodes.filter(n => n.status === 'Running').length
    });
  } catch (error) {
    console.error('Error fetching nodes:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/nodes/:id', (req, res) => {
  if (!superVM) {
    return res.status(503).json({ error: 'Super VM not initialized' });
  }
  
  try {
    const nodes = scheduler.getNodeDetails ? scheduler.getNodeDetails() : [];
    const node = nodes.find(n => n.id === req.params.id);
    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }
    res.json(node);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SSH key management endpoints
app.get('/api/ssh-keys', async (req, res) => {
  try {
    const keyManager = await import('../config/keys/keyManager.js');
    const keys = keyManager.default.getKeysInfo();
    
    res.json({
      keys: keys.map(key => ({
        name: key.name,
        publicKey: key.validation?.publicKey || null,
        privateKeyPath: key.validation?.privateKeyPath || null,
        publicKeyPath: key.validation?.publicKeyPath || null,
        valid: key.validation?.valid || false,
        createdAt: key.createdAt || null
      })).filter(key => key.valid && key.publicKey) // Only return valid keys with public keys
    });
  } catch (error) {
    console.error('Error fetching SSH keys:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ssh-keys/generate', async (req, res) => {
  try {
    const { keyName = 'cluster-vm-key' } = req.body;
    const keyManager = await import('../config/keys/keyManager.js');
    
    const result = await keyManager.default.generateKey(keyName);
    
    if (result.success) {
      res.json({
        success: true,
        message: `SSH key '${keyName}' generated successfully`,
        keyInfo: result.keyInfo
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error generating SSH key:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/ssh-keys/:keyName', async (req, res) => {
  try {
    const { keyName } = req.params;
    const keyManager = await import('../config/keys/keyManager.js');
    
    // Get the key paths
    const keyPaths = keyManager.default.getKeyPaths(keyName);
    
    // Delete the key files
    const fs = await import('fs');
    const path = await import('path');
    
    let deletedFiles = [];
    
    if (fs.existsSync(keyPaths.privateKey)) {
      fs.unlinkSync(keyPaths.privateKey);
      deletedFiles.push('private key');
    }
    
    if (fs.existsSync(keyPaths.publicKey)) {
      fs.unlinkSync(keyPaths.publicKey);
      deletedFiles.push('public key');
    }
    
    if (deletedFiles.length === 0) {
      return res.status(404).json({
        success: false,
        error: `SSH key '${keyName}' not found`
      });
    }
    
    res.json({
      success: true,
      message: `SSH key '${keyName}' deleted successfully (${deletedFiles.join(', ')})`
    });
  } catch (error) {
    console.error('Error deleting SSH key:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cluster: { status: 'running' },
    superVM: superVM ? superVM.getStatus() : { status: 'initializing' }
  };
  res.json(health);
});

app.listen(systemConfig.config.network.ports.clusterManager, () => {
  console.log(`Cluster Manager API with Super VM running on port ${systemConfig.config.network.ports.clusterManager}`);
});