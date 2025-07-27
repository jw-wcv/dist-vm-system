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

const express = require('express');
const app = express();

// Import Super VM (using dynamic import for ES modules)
let superVM;
async function initializeSuperVM() {
    try {
        const { default: SuperVM } = await import('./super-vm.js');
        superVM = SuperVM;
        await superVM.initialize();
        console.log('Super VM initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Super VM:', error);
    }
}

// Initialize Super VM on startup
initializeSuperVM();

// Middleware
app.use(express.json({ limit: '100mb' }));
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

app.listen(3000, () => {
  console.log('Cluster Manager API with Super VM running on port 3000');
});