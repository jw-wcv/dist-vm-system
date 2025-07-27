// worker-api.js
// 
// Description: Worker node API for executing distributed tasks
// 
// This module provides the API endpoints that worker nodes expose to receive
// and execute tasks from the distributed scheduler. It manages task execution,
// resource monitoring, and result reporting back to the scheduler.
// 
// API Endpoints:
//   - POST /execute-task: Execute a distributed task
//   - GET /health: Report node health and resource status
//   - GET /status: Get current node status and capabilities
//   - POST /upload-file: Upload files for task processing
//   - GET /download-result: Download task results
// 
// Inputs: 
//   - Task definitions from scheduler
//   - File uploads for processing
// Outputs: 
//   - Task execution results
//   - Health and status information
//   - Resource utilization metrics
// 
// Dependencies: 
//   - Docker containers for task execution
//   - File system for temporary storage
//   - Network communication with scheduler

import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';
import multer from 'multer';

const execAsync = promisify(exec);

class WorkerAPI {
    constructor() {
        this.app = express();
        this.port = process.env.WORKER_PORT || 8080;
        this.nodeId = process.env.NODE_ID || 'worker-' + Math.random().toString(36).substr(2, 9);
        this.currentTasks = new Map();
        this.resourceStats = {
            cpu: 0,
            memory: 0,
            gpu: 0,
            load: 0
        };
        
        this.setupMiddleware();
        this.setupRoutes();
        this.startResourceMonitoring();
    }

    // Setup Express middleware
    setupMiddleware() {
        this.app.use(express.json({ limit: '100mb' }));
        this.app.use(express.urlencoded({ extended: true }));
        
        // Setup file upload middleware
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const uploadDir = path.join(os.tmpdir(), 'worker-uploads');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                cb(null, uploadDir);
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`);
            }
        });
        
        this.upload = multer({ storage });
    }

    // Setup API routes
    setupRoutes() {
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                nodeId: this.nodeId,
                timestamp: Date.now(),
                load: this.resourceStats.load,
                resources: this.resourceStats
            });
        });

        // Node status endpoint
        this.app.get('/status', (req, res) => {
            res.json({
                nodeId: this.nodeId,
                status: 'running',
                capabilities: {
                    render: true,
                    compute: true,
                    browser: true,
                    fileSync: true
                },
                resources: this.resourceStats,
                currentTasks: this.currentTasks.size,
                uptime: process.uptime()
            });
        });

        // Task execution endpoint
        this.app.post('/execute-task', async (req, res) => {
            try {
                const { task } = req.body;
                console.log(`Received task: ${task.id} of type ${task.type}`);
                
                const result = await this.executeTask(task);
                res.json(result);
            } catch (error) {
                console.error('Task execution error:', error);
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });

        // File upload endpoint
        this.app.post('/upload-file', this.upload.single('file'), (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ error: 'No file uploaded' });
                }
                
                res.json({
                    success: true,
                    filename: req.file.filename,
                    path: req.file.path,
                    size: req.file.size
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Result download endpoint
        this.app.get('/download-result/:taskId', (req, res) => {
            const { taskId } = req.params;
            const task = this.currentTasks.get(taskId);
            
            if (!task || !task.resultPath) {
                return res.status(404).json({ error: 'Result not found' });
            }
            
            res.download(task.resultPath);
        });

        // Error handling middleware
        this.app.use((error, req, res, next) => {
            console.error('API Error:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: error.message
            });
        });
    }

    // Execute a task based on its type
    async executeTask(task) {
        const taskId = task.id;
        const taskType = task.type;
        
        // Register task
        this.currentTasks.set(taskId, {
            id: taskId,
            type: taskType,
            startTime: Date.now(),
            status: 'running'
        });

        try {
            let result;
            
            switch (taskType) {
                case 'render':
                    result = await this.executeRenderTask(task);
                    break;
                case 'compute':
                    result = await this.executeComputeTask(task);
                    break;
                case 'browser':
                    result = await this.executeBrowserTask(task);
                    break;
                case 'file-sync':
                    result = await this.executeFileSyncTask(task);
                    break;
                default:
                    throw new Error(`Unknown task type: ${taskType}`);
            }

            // Update task status
            const taskInfo = this.currentTasks.get(taskId);
            taskInfo.status = 'completed';
            taskInfo.endTime = Date.now();
            taskInfo.result = result;

            return {
                success: true,
                taskId: taskId,
                result: result,
                executionTime: taskInfo.endTime - taskInfo.startTime
            };

        } catch (error) {
            // Update task status
            const taskInfo = this.currentTasks.get(taskId);
            taskInfo.status = 'failed';
            taskInfo.error = error.message;

            throw error;
        }
    }

    // Execute rendering task using Blender container
    async executeRenderTask(task) {
        const { data } = task;
        const { frameStart, frameEnd, sceneFile, outputPath } = data;
        
        console.log(`Executing render task: frames ${frameStart}-${frameEnd}`);

        // Create output directory
        const outputDir = path.join(os.tmpdir(), 'render-output', task.id);
        fs.mkdirSync(outputDir, { recursive: true });

        const frames = [];
        
        // Render each frame
        for (let frame = frameStart; frame <= frameEnd; frame++) {
            const frameOutputPath = path.join(outputDir, `frame_${frame.toString().padStart(4, '0')}.png`);
            
            // Execute Blender render command
            const command = `docker run --rm -v "${outputDir}:/output" render-engine python /app/render-script.py "${sceneFile}" "${frameOutputPath}" --frame ${frame}`;
            
            try {
                await execAsync(command);
                frames.push({
                    frameNumber: frame,
                    path: frameOutputPath,
                    size: fs.statSync(frameOutputPath).size
                });
            } catch (error) {
                console.error(`Failed to render frame ${frame}:`, error);
            }
        }

        return {
            type: 'render',
            frames: frames,
            totalFrames: frames.length,
            outputDirectory: outputDir
        };
    }

    // Execute compute task using Python processing
    async executeComputeTask(task) {
        const { data } = task;
        const { inputData, operation, parameters = {} } = data;
        
        console.log(`Executing compute task: ${operation} on ${inputData.length} items`);

        let processedData = [];

        switch (operation) {
            case 'sort':
                processedData = inputData.sort((a, b) => a - b);
                break;
            case 'filter':
                const { condition } = parameters;
                processedData = inputData.filter(item => eval(condition));
                break;
            case 'map':
                const { transform } = parameters;
                processedData = inputData.map(item => eval(transform));
                break;
            case 'reduce':
                const { reducer, initialValue = 0 } = parameters;
                processedData = [inputData.reduce((acc, item) => eval(reducer), initialValue)];
                break;
            default:
                throw new Error(`Unknown operation: ${operation}`);
        }

        return {
            type: 'compute',
            operation: operation,
            processedData: processedData,
            inputCount: inputData.length,
            outputCount: processedData.length
        };
    }

    // Execute browser automation task
    async executeBrowserTask(task) {
        const { data } = task;
        const { url, actions = [], screenshot = false } = data;
        
        console.log(`Executing browser task: ${url}`);

        // Create output directory
        const outputDir = path.join(os.tmpdir(), 'browser-output', task.id);
        fs.mkdirSync(outputDir, { recursive: true });

        // Execute browser automation
        const command = `docker run --rm -v "${outputDir}:/output" browser-automation python /app/browser-script.py "${url}" "${JSON.stringify(actions)}" ${screenshot}`;
        
        try {
            const { stdout } = await execAsync(command);
            const result = JSON.parse(stdout);
            
            return {
                type: 'browser',
                url: url,
                actions: actions,
                result: result,
                outputDirectory: outputDir
            };
        } catch (error) {
            throw new Error(`Browser automation failed: ${error.message}`);
        }
    }

    // Execute file synchronization task
    async executeFileSyncTask(task) {
        const { data } = task;
        const { operation, sourcePath, destinationPath, files = [] } = data;
        
        console.log(`Executing file sync task: ${operation}`);

        switch (operation) {
            case 'upload':
                // Upload files to shared storage
                const uploadResults = [];
                for (const file of files) {
                    try {
                        const result = await this.uploadToSharedStorage(file, destinationPath);
                        uploadResults.push(result);
                    } catch (error) {
                        console.error(`Failed to upload ${file}:`, error);
                    }
                }
                return {
                    type: 'file-sync',
                    operation: 'upload',
                    results: uploadResults
                };

            case 'download':
                // Download files from shared storage
                const downloadResults = [];
                for (const file of files) {
                    try {
                        const result = await this.downloadFromSharedStorage(file, destinationPath);
                        downloadResults.push(result);
                    } catch (error) {
                        console.error(`Failed to download ${file}:`, error);
                    }
                }
                return {
                    type: 'file-sync',
                    operation: 'download',
                    results: downloadResults
                };

            default:
                throw new Error(`Unknown file sync operation: ${operation}`);
        }
    }

    // Upload file to shared storage
    async uploadToSharedStorage(filePath, destinationPath) {
        // Implementation would connect to shared storage (NFS, S3, etc.)
        // For now, simulate the upload
        return {
            source: filePath,
            destination: destinationPath,
            success: true,
            size: fs.statSync(filePath).size
        };
    }

    // Download file from shared storage
    async downloadFromSharedStorage(filePath, destinationPath) {
        // Implementation would connect to shared storage (NFS, S3, etc.)
        // For now, simulate the download
        return {
            source: filePath,
            destination: destinationPath,
            success: true
        };
    }

    // Start resource monitoring
    startResourceMonitoring() {
        setInterval(() => {
            this.updateResourceStats();
        }, 5000); // Update every 5 seconds
    }

    // Update resource statistics
    async updateResourceStats() {
        try {
            // Get CPU usage
            const { stdout: cpuInfo } = await execAsync('top -bn1 | grep "Cpu(s)" | awk \'{print $2}\' | cut -d\'%\' -f1');
            this.resourceStats.cpu = parseFloat(cpuInfo);

            // Get memory usage
            const { stdout: memInfo } = await execAsync('free | grep Mem | awk \'{print $3/$2 * 100.0}\'');
            this.resourceStats.memory = parseFloat(memInfo);

            // Get system load
            const { stdout: loadInfo } = await execAsync('uptime | awk -F\'load average:\' \'{print $2}\' | awk \'{print $1}\' | sed \'s/,//\'');
            this.resourceStats.load = parseFloat(loadInfo);

            // Check for GPU (if available)
            try {
                const { stdout: gpuInfo } = await execAsync('nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits');
                this.resourceStats.gpu = parseFloat(gpuInfo);
            } catch (error) {
                this.resourceStats.gpu = 0; // No GPU available
            }

        } catch (error) {
            console.error('Error updating resource stats:', error);
        }
    }

    // Start the API server
    start() {
        this.app.listen(this.port, () => {
            console.log(`Worker API running on port ${this.port}`);
            console.log(`Node ID: ${this.nodeId}`);
        });
    }
}

// Create and export worker API instance
const workerAPI = new WorkerAPI();
export default workerAPI; 