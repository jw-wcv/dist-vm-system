// distributed-scheduler.js
// 
// Description: Distributed task scheduler for super VM compute coordination
// 
// This module orchestrates compute tasks across multiple VMs to create
// a unified "super VM" that aggregates resources from all worker nodes.
// It handles task distribution, resource allocation, and result aggregation.
// 
// Functions:
//   - scheduleTask(): Distributes tasks across available VMs
//   - getResourcePool(): Aggregates available resources from all nodes
//   - monitorNodeHealth(): Tracks VM health and availability
//   - aggregateResults(): Combines results from distributed tasks
// 
// Inputs: 
//   - Task definitions with resource requirements
//   - Available VM nodes and their capabilities
// Outputs: 
//   - Distributed task assignments
//   - Aggregated compute results
//   - Resource utilization metrics
// 
// Dependencies: 
//   - vmManager.js (VM management)
//   - Network communication between nodes
//   - Shared storage for task coordination

import { listVMInstances } from './vmManager.js';
import alephConfig from '../config/aleph/index.js';
import axios from 'axios';

class DistributedScheduler {
    constructor() {
        this.workerNodes = new Map();
        this.taskQueue = [];
        this.results = new Map();
        this.resourcePool = {
            totalCPU: 0,
            totalMemory: 0,
            totalGPU: 0,
            availableCPU: 0,
            availableMemory: 0,
            availableGPU: 0
        };
    }

    // Initialize the distributed scheduler
    async initialize() {
        console.log('Initializing distributed scheduler...');
        await this.discoverNodes();
        await this.updateResourcePool();
        this.startHealthMonitoring();
        console.log('Distributed scheduler ready');
    }

    // Discover available worker nodes
    async discoverNodes() {
        try {
            const vms = await listVMInstances();
            for (const vm of vms) {
                if (vm.status === 'Running') {
                    this.workerNodes.set(vm.id, {
                        id: vm.id,
                        name: vm.name,
                        ipv6: vm.ipv6,
                        status: vm.status,
                        resources: {
                            cpu: 4, // Default CPU cores per VM
                            memory: 8192, // Default memory in MB
                            gpu: 0 // Will be updated if GPU passthrough is available
                        },
                        currentLoad: 0,
                        lastSeen: Date.now()
                    });
                }
            }
            console.log(`Discovered ${this.workerNodes.size} worker nodes`);
        } catch (error) {
            console.error('Error discovering nodes:', error);
        }
    }

    // Update the aggregated resource pool
    async updateResourcePool() {
        this.resourcePool = {
            totalCPU: 0,
            totalMemory: 0,
            totalGPU: 0,
            availableCPU: 0,
            availableMemory: 0,
            availableGPU: 0
        };

        for (const [nodeId, node] of this.workerNodes) {
            this.resourcePool.totalCPU += node.resources.cpu;
            this.resourcePool.totalMemory += node.resources.memory;
            this.resourcePool.totalGPU += node.resources.gpu;
            
            // Calculate available resources based on current load
            const loadFactor = 1 - (node.currentLoad / 100);
            this.resourcePool.availableCPU += Math.floor(node.resources.cpu * loadFactor);
            this.resourcePool.availableMemory += Math.floor(node.resources.memory * loadFactor);
            this.resourcePool.availableGPU += Math.floor(node.resources.gpu * loadFactor);
        }

        console.log('Resource pool updated:', this.resourcePool);
    }

    // Schedule a task across available nodes
    async scheduleTask(taskDefinition) {
        const {
            id,
            type, // 'render', 'compute', 'browser', 'file-sync'
            priority = 'normal',
            resourceRequirements = {},
            data = {}
        } = taskDefinition;

        console.log(`Scheduling task ${id} of type ${type}`);

        // Find best available nodes for this task
        const suitableNodes = this.findSuitableNodes(resourceRequirements);
        
        if (suitableNodes.length === 0) {
            throw new Error('No suitable nodes available for task');
        }

        // Distribute task across nodes
        const taskAssignments = this.distributeTask(taskDefinition, suitableNodes);
        
        // Execute tasks on assigned nodes
        const promises = taskAssignments.map(assignment => 
            this.executeTaskOnNode(assignment)
        );

        // Wait for all tasks to complete
        const results = await Promise.allSettled(promises);
        
        // Aggregate results
        const aggregatedResult = this.aggregateResults(results, taskDefinition);
        
        return aggregatedResult;
    }

    // Find nodes suitable for the task requirements
    findSuitableNodes(requirements) {
        const { cpu = 1, memory = 1024, gpu = 0 } = requirements;
        
        return Array.from(this.workerNodes.values())
            .filter(node => 
                node.status === 'Running' &&
                node.currentLoad < 90 && // Less than 90% loaded
                node.resources.cpu >= cpu &&
                node.resources.memory >= memory &&
                node.resources.gpu >= gpu
            )
            .sort((a, b) => a.currentLoad - b.currentLoad); // Prefer less loaded nodes
    }

    // Distribute task across multiple nodes
    distributeTask(taskDefinition, nodes) {
        const { type, data } = taskDefinition;
        
        switch (type) {
            case 'render':
                return this.distributeRenderTask(taskDefinition, nodes);
            case 'compute':
                return this.distributeComputeTask(taskDefinition, nodes);
            case 'browser':
                return this.distributeBrowserTask(taskDefinition, nodes);
            default:
                return [{ nodeId: nodes[0].id, task: taskDefinition }];
        }
    }

    // Distribute rendering tasks (split frames across nodes)
    distributeRenderTask(taskDefinition, nodes) {
        const { data } = taskDefinition;
        const { frameStart, frameEnd, sceneFile } = data;
        const totalFrames = frameEnd - frameStart + 1;
        const framesPerNode = Math.ceil(totalFrames / nodes.length);
        
        const assignments = [];
        for (let i = 0; i < nodes.length; i++) {
            const nodeStart = frameStart + (i * framesPerNode);
            const nodeEnd = Math.min(nodeStart + framesPerNode - 1, frameEnd);
            
            if (nodeStart <= nodeEnd) {
                assignments.push({
                    nodeId: nodes[i].id,
                    task: {
                        ...taskDefinition,
                        data: {
                            ...data,
                            frameStart: nodeStart,
                            frameEnd: nodeEnd
                        }
                    }
                });
            }
        }
        
        return assignments;
    }

    // Distribute compute tasks (split data across nodes)
    distributeComputeTask(taskDefinition, nodes) {
        const { data } = taskDefinition;
        const { inputData, chunkSize = 1000 } = data;
        
        const assignments = [];
        const chunks = this.chunkArray(inputData, chunkSize);
        
        for (let i = 0; i < Math.min(chunks.length, nodes.length); i++) {
            assignments.push({
                nodeId: nodes[i].id,
                task: {
                    ...taskDefinition,
                    data: {
                        ...data,
                        inputData: chunks[i]
                    }
                }
            });
        }
        
        return assignments;
    }

    // Execute task on a specific node
    async executeTaskOnNode(assignment) {
        const { nodeId, task } = assignment;
        const node = this.workerNodes.get(nodeId);
        
        if (!node) {
            throw new Error(`Node ${nodeId} not found`);
        }

        console.log(`Executing task on node ${node.name} (${node.ipv6})`);

        try {
            // Update node load
            node.currentLoad += 20; // Estimate 20% load increase
            
            // Send task to node via HTTP API
            const response = await axios.post(`http://[${node.ipv6}]:8080/execute-task`, {
                task: task,
                timestamp: Date.now()
            }, {
                timeout: 300000 // 5 minute timeout
            });

            return {
                nodeId,
                success: true,
                result: response.data,
                executionTime: Date.now() - task.timestamp
            };
        } catch (error) {
            console.error(`Task execution failed on node ${nodeId}:`, error);
            return {
                nodeId,
                success: false,
                error: error.message,
                executionTime: Date.now() - task.timestamp
            };
        } finally {
            // Update node load
            node.currentLoad = Math.max(0, node.currentLoad - 20);
        }
    }

    // Aggregate results from multiple nodes
    aggregateResults(results, taskDefinition) {
        const successfulResults = results
            .filter(r => r.status === 'fulfilled' && r.value.success)
            .map(r => r.value);

        const failedResults = results
            .filter(r => r.status === 'rejected' || !r.value.success)
            .map(r => r.value || { error: r.reason });

        switch (taskDefinition.type) {
            case 'render':
                return this.aggregateRenderResults(successfulResults, taskDefinition);
            case 'compute':
                return this.aggregateComputeResults(successfulResults, taskDefinition);
            default:
                return {
                    success: successfulResults.length > 0,
                    results: successfulResults,
                    failures: failedResults,
                    totalExecutionTime: successfulResults.reduce((sum, r) => sum + r.executionTime, 0)
                };
        }
    }

    // Aggregate rendering results (combine rendered frames)
    aggregateRenderResults(results, taskDefinition) {
        const frames = [];
        for (const result of results) {
            if (result.result && result.result.frames) {
                frames.push(...result.result.frames);
            }
        }
        
        return {
            success: frames.length > 0,
            type: 'render',
            frames: frames.sort((a, b) => a.frameNumber - b.frameNumber),
            totalFrames: frames.length,
            results: results,
            aggregatedAt: Date.now()
        };
    }

    // Aggregate compute results (combine processed data)
    aggregateComputeResults(results, taskDefinition) {
        const processedData = [];
        for (const result of results) {
            if (result.result && result.result.processedData) {
                processedData.push(...result.result.processedData);
            }
        }
        
        return {
            success: processedData.length > 0,
            type: 'compute',
            processedData: processedData,
            totalProcessed: processedData.length,
            results: results,
            aggregatedAt: Date.now()
        };
    }

    // Utility function to chunk arrays
    chunkArray(array, chunkSize) {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }

    // Start health monitoring of nodes
    startHealthMonitoring() {
        setInterval(async () => {
            await this.checkNodeHealth();
            await this.updateResourcePool();
        }, 30000); // Check every 30 seconds
    }

    // Check health of all nodes
    async checkNodeHealth() {
        for (const [nodeId, node] of this.workerNodes) {
            try {
                const response = await axios.get(`http://[${node.ipv6}]:8080/health`, {
                    timeout: 5000
                });
                
                node.lastSeen = Date.now();
                node.currentLoad = response.data.load || 0;
                node.status = 'Running';
            } catch (error) {
                console.warn(`Node ${node.name} health check failed:`, error.message);
                node.status = 'Unreachable';
            }
        }
    }

    // Get current resource pool status
    getResourcePool() {
        return { ...this.resourcePool };
    }

    // Get super VM status (aggregated view)
    getSuperVMStatus() {
        return {
            totalNodes: this.workerNodes.size,
            activeNodes: Array.from(this.workerNodes.values()).filter(n => n.status === 'Running').length,
            resourcePool: this.resourcePool,
            currentTasks: this.taskQueue.length,
            uptime: Date.now() - this.startTime
        };
    }

    // Get task history for UI
    getTaskHistory() {
        return Array.from(this.activeTasks.values()).map(task => ({
            id: task.id,
            type: task.type,
            status: task.status,
            startTime: task.startTime,
            endTime: task.endTime,
            executionTime: task.executionTime,
            result: task.result,
            error: task.error
        }));
    }

    // Get specific task by ID
    getTaskById(taskId) {
        const task = this.activeTasks.get(taskId);
        if (!task) return null;
        
        return {
            id: task.id,
            type: task.type,
            status: task.status,
            startTime: task.startTime,
            endTime: task.endTime,
            executionTime: task.executionTime,
            result: task.result,
            error: task.error,
            data: task.data
        };
    }

    // Get node details for UI
    getNodeDetails() {
        return Array.from(this.workerNodes.values()).map(node => ({
            id: node.id,
            name: node.name,
            status: node.status,
            ipv6: node.ipv6,
            resources: node.resources,
            currentLoad: node.currentLoad,
            lastSeen: node.lastSeen,
            uptime: Date.now() - node.lastSeen
        }));
    }
}

// Create and export singleton instance
const scheduler = new DistributedScheduler();
export default scheduler; 