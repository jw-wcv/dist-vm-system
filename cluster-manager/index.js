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
import { listVMInstances, createVMInstance } from './vmManager.js';
import { default as Scheduler } from './distributed-scheduler.js';
import systemConfig from '../config/system/index.js';

const app = express();

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

// VM management endpoints
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
    // Get tasks from scheduler
    const tasks = scheduler.getTaskHistory ? scheduler.getTaskHistory() : [];
    res.json(tasks);
  } catch (error) {
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
    const nodes = scheduler.getNodeDetails ? scheduler.getNodeDetails() : [];
    res.json(nodes);
  } catch (error) {
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