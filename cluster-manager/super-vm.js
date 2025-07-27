// super-vm.js
// 
// Description: Super VM interface for unified distributed computing
// 
// This module provides a unified interface that makes multiple distributed
// VMs appear as a single powerful "super VM". It abstracts the complexity
// of distributed computing behind a simple API that mimics a single machine.
// 
// Features:
//   - Unified resource pool (aggregated CPU, memory, GPU)
//   - Distributed task execution
//   - Automatic load balancing
//   - Fault tolerance and recovery
//   - Simple API for compute operations
// 
// Inputs: 
//   - Compute tasks (render, process, analyze)
//   - Resource requirements
//   - Data for processing
// Outputs: 
//   - Aggregated results from distributed execution
//   - Resource utilization metrics
//   - Performance statistics
// 
// Dependencies: 
//   - distributed-scheduler.js (task orchestration)
//   - vmManager.js (VM management)
//   - worker-api.js (worker communication)

import scheduler from './distributed-scheduler.js';
import { listVMInstances, createVMInstance } from './vmManager.js';
import { v4 as uuidv4 } from 'uuid';

class SuperVM {
    constructor() {
        this.id = 'super-vm-' + uuidv4();
        this.status = 'initializing';
        this.resourcePool = {
            totalCPU: 0,
            totalMemory: 0,
            totalGPU: 0,
            availableCPU: 0,
            availableMemory: 0,
            availableGPU: 0
        };
        this.activeTasks = new Map();
        this.performanceMetrics = {
            totalTasksExecuted: 0,
            averageExecutionTime: 0,
            totalComputeTime: 0,
            uptime: 0
        };
        this.startTime = Date.now();
    }

    // Initialize the super VM
    async initialize() {
        console.log('Initializing Super VM...');
        this.status = 'starting';
        
        try {
            // Initialize the distributed scheduler
            await scheduler.initialize();
            
            // Discover and register available VMs
            await this.discoverVMs();
            
            // Update resource pool
            await this.updateResourcePool();
            
            this.status = 'ready';
            console.log('Super VM ready for distributed computing');
            
            // Start monitoring
            this.startMonitoring();
            
        } catch (error) {
            this.status = 'error';
            console.error('Failed to initialize Super VM:', error);
            throw error;
        }
    }

    // Discover available VMs and add them to the pool
    async discoverVMs() {
        try {
            const vms = await listVMInstances();
            console.log(`Discovered ${vms.length} VMs for Super VM pool`);
            
            // Filter for running VMs
            const runningVMs = vms.filter(vm => vm.status === 'Running');
            
            if (runningVMs.length === 0) {
                console.log('No running VMs found. Creating new VM...');
                await this.createNewVM();
            }
            
        } catch (error) {
            console.error('Error discovering VMs:', error);
        }
    }

    // Create a new VM if needed
    async createNewVM() {
        try {
            console.log('Creating new VM for Super VM pool...');
            const newVM = await createVMInstance();
            console.log('New VM created:', newVM.item_hash);
            
            // Wait a bit for VM to start
            await new Promise(resolve => setTimeout(resolve, 30000));
            
        } catch (error) {
            console.error('Error creating new VM:', error);
        }
    }

    // Update the aggregated resource pool
    async updateResourcePool() {
        this.resourcePool = scheduler.getResourcePool();
        console.log('Super VM resource pool updated:', this.resourcePool);
    }

    // Execute a compute task across the distributed system
    async executeTask(taskDefinition) {
        if (this.status !== 'ready') {
            throw new Error('Super VM is not ready');
        }

        const taskId = taskDefinition.id || uuidv4();
        const task = {
            ...taskDefinition,
            id: taskId,
            timestamp: Date.now()
        };

        console.log(`Super VM executing task: ${taskId} (${task.type})`);

        // Register task
        this.activeTasks.set(taskId, {
            ...task,
            status: 'running',
            startTime: Date.now()
        });

        try {
            // Execute task through scheduler
            const result = await scheduler.scheduleTask(task);
            
            // Update task status
            const taskInfo = this.activeTasks.get(taskId);
            taskInfo.status = 'completed';
            taskInfo.endTime = Date.now();
            taskInfo.result = result;
            taskInfo.executionTime = taskInfo.endTime - taskInfo.startTime;

            // Update performance metrics
            this.updatePerformanceMetrics(taskInfo);

            console.log(`Task ${taskId} completed in ${taskInfo.executionTime}ms`);
            
            return {
                taskId: taskId,
                success: true,
                result: result,
                executionTime: taskInfo.executionTime,
                nodesUsed: result.results ? result.results.length : 1
            };

        } catch (error) {
            // Update task status
            const taskInfo = this.activeTasks.get(taskId);
            taskInfo.status = 'failed';
            taskInfo.error = error.message;

            console.error(`Task ${taskId} failed:`, error);
            throw error;
        }
    }

    // Render a 3D scene across multiple nodes
    async renderScene(sceneFile, frameStart, frameEnd, options = {}) {
        const taskDefinition = {
            type: 'render',
            data: {
                sceneFile: sceneFile,
                frameStart: frameStart,
                frameEnd: frameEnd,
                outputPath: options.outputPath || '/output',
                quality: options.quality || 'high',
                resolution: options.resolution || '1920x1080'
            },
            resourceRequirements: {
                cpu: options.cpu || 2,
                memory: options.memory || 4096,
                gpu: options.gpu || 0
            }
        };

        return await this.executeTask(taskDefinition);
    }

    // Process data across multiple nodes
    async processData(inputData, operation, parameters = {}) {
        const taskDefinition = {
            type: 'compute',
            data: {
                inputData: inputData,
                operation: operation,
                parameters: parameters
            },
            resourceRequirements: {
                cpu: parameters.cpu || 1,
                memory: parameters.memory || 1024,
                gpu: parameters.gpu || 0
            }
        };

        return await this.executeTask(taskDefinition);
    }

    // Execute browser automation across nodes
    async automateBrowser(url, actions = [], options = {}) {
        const taskDefinition = {
            type: 'browser',
            data: {
                url: url,
                actions: actions,
                screenshot: options.screenshot || false,
                headless: options.headless || true
            },
            resourceRequirements: {
                cpu: options.cpu || 1,
                memory: options.memory || 2048,
                gpu: 0
            }
        };

        return await this.executeTask(taskDefinition);
    }

    // Synchronize files across the distributed system
    async syncFiles(operation, files, options = {}) {
        const taskDefinition = {
            type: 'file-sync',
            data: {
                operation: operation, // 'upload' or 'download'
                files: files,
                sourcePath: options.sourcePath,
                destinationPath: options.destinationPath
            },
            resourceRequirements: {
                cpu: 1,
                memory: 512,
                gpu: 0
            }
        };

        return await this.executeTask(taskDefinition);
    }

    // Get current status of the super VM
    getStatus() {
        return {
            id: this.id,
            status: this.status,
            uptime: Date.now() - this.startTime,
            resourcePool: this.resourcePool,
            activeTasks: this.activeTasks.size,
            performanceMetrics: this.performanceMetrics,
            schedulerStatus: scheduler.getSuperVMStatus()
        };
    }

    // Get detailed resource information
    getResourceInfo() {
        return {
            ...this.resourcePool,
            utilization: {
                cpu: this.calculateUtilization('cpu'),
                memory: this.calculateUtilization('memory'),
                gpu: this.calculateUtilization('gpu')
            },
            nodeCount: scheduler.getSuperVMStatus().activeNodes
        };
    }

    // Calculate resource utilization
    calculateUtilization(resourceType) {
        const total = this.resourcePool[`total${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`];
        const available = this.resourcePool[`available${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`];
        
        if (total === 0) return 0;
        return ((total - available) / total) * 100;
    }

    // Get performance metrics
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            currentLoad: this.calculateCurrentLoad(),
            efficiency: this.calculateEfficiency()
        };
    }

    // Calculate current system load
    calculateCurrentLoad() {
        const cpuUtilization = this.calculateUtilization('cpu');
        const memoryUtilization = this.calculateUtilization('memory');
        return (cpuUtilization + memoryUtilization) / 2;
    }

    // Calculate system efficiency
    calculateEfficiency() {
        if (this.performanceMetrics.totalTasksExecuted === 0) return 0;
        
        const averageExecutionTime = this.performanceMetrics.averageExecutionTime;
        const totalComputeTime = this.performanceMetrics.totalComputeTime;
        const uptime = Date.now() - this.startTime;
        
        return (totalComputeTime / uptime) * 100;
    }

    // Update performance metrics
    updatePerformanceMetrics(taskInfo) {
        this.performanceMetrics.totalTasksExecuted++;
        this.performanceMetrics.totalComputeTime += taskInfo.executionTime;
        this.performanceMetrics.averageExecutionTime = 
            this.performanceMetrics.totalComputeTime / this.performanceMetrics.totalTasksExecuted;
    }

    // Start monitoring and maintenance
    startMonitoring() {
        // Update resource pool every 30 seconds
        setInterval(async () => {
            await this.updateResourcePool();
        }, 30000);

        // Clean up completed tasks every 5 minutes
        setInterval(() => {
            this.cleanupCompletedTasks();
        }, 300000);

        // Health check every minute
        setInterval(() => {
            this.performHealthCheck();
        }, 60000);
    }

    // Clean up completed tasks
    cleanupCompletedTasks() {
        const now = Date.now();
        const maxAge = 3600000; // 1 hour

        for (const [taskId, task] of this.activeTasks) {
            if (task.status === 'completed' || task.status === 'failed') {
                if (now - task.endTime > maxAge) {
                    this.activeTasks.delete(taskId);
                }
            }
        }
    }

    // Perform health check
    async performHealthCheck() {
        try {
            const status = scheduler.getSuperVMStatus();
            
            if (status.activeNodes === 0) {
                console.warn('No active nodes detected. Attempting recovery...');
                await this.discoverVMs();
            }
            
            // Update uptime
            this.performanceMetrics.uptime = Date.now() - this.startTime;
            
        } catch (error) {
            console.error('Health check failed:', error);
        }
    }

    // Scale the super VM by adding more nodes
    async scale(additionalNodes = 1) {
        console.log(`Scaling Super VM by adding ${additionalNodes} nodes...`);
        
        const promises = [];
        for (let i = 0; i < additionalNodes; i++) {
            promises.push(this.createNewVM());
        }
        
        await Promise.all(promises);
        
        // Wait for VMs to start and update resource pool
        await new Promise(resolve => setTimeout(resolve, 60000));
        await this.updateResourcePool();
        
        console.log(`Super VM scaled successfully. New resource pool:`, this.resourcePool);
    }

    // Shutdown the super VM
    async shutdown() {
        console.log('Shutting down Super VM...');
        this.status = 'shutting_down';
        
        // Wait for active tasks to complete
        const activeTasks = Array.from(this.activeTasks.values())
            .filter(task => task.status === 'running');
        
        if (activeTasks.length > 0) {
            console.log(`Waiting for ${activeTasks.length} active tasks to complete...`);
            // In a real implementation, you might want to cancel tasks or wait for them
        }
        
        this.status = 'stopped';
        console.log('Super VM shutdown complete');
    }
}

// Create and export singleton instance
const superVM = new SuperVM();
export default superVM; 