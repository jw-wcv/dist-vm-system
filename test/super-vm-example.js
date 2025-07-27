// super-vm-example.js
// 
// Description: Example usage of the Super VM for distributed computing
// 
// This file demonstrates how to use the Super VM interface to perform
// various distributed computing tasks across multiple VMs. It shows
// practical examples of rendering, data processing, and browser automation.
// 
// Examples:
//   - Distributed 3D rendering
//   - Large-scale data processing
//   - Parallel browser automation
//   - File synchronization across nodes
// 
// Inputs: None (demonstration purposes)
// Outputs: Console logs showing distributed task execution
// 
// Usage: node super-vm-example.js

import superVM from './super-vm.js';

async function runSuperVMExamples() {
    console.log('🚀 Starting Super VM Examples...\n');

    try {
        // Initialize the Super VM
        console.log('1. Initializing Super VM...');
        await superVM.initialize();
        
        // Display initial status
        const status = superVM.getStatus();
        console.log('Super VM Status:', status);
        console.log('Resource Pool:', superVM.getResourceInfo());
        console.log('');

        // Example 1: Distributed 3D Rendering
        console.log('2. Example: Distributed 3D Rendering');
        const renderResult = await superVM.renderScene(
            '/path/to/scene.blend',
            1,  // frameStart
            100, // frameEnd
            {
                quality: 'high',
                resolution: '1920x1080',
                cpu: 2,
                memory: 4096
            }
        );
        console.log('Render Result:', renderResult);
        console.log('');

        // Example 2: Large-scale Data Processing
        console.log('3. Example: Large-scale Data Processing');
        const largeDataset = Array.from({ length: 100000 }, (_, i) => Math.random() * 1000);
        
        const processResult = await superVM.processData(
            largeDataset,
            'sort',
            {
                cpu: 1,
                memory: 2048
            }
        );
        console.log('Process Result:', processResult);
        console.log('');

        // Example 3: Parallel Browser Automation
        console.log('4. Example: Parallel Browser Automation');
        const browserResult = await superVM.automateBrowser(
            'https://example.com',
            [
                { action: 'click', selector: '#button' },
                { action: 'wait', time: 2000 },
                { action: 'screenshot', filename: 'result.png' }
            ],
            {
                screenshot: true,
                headless: true
            }
        );
        console.log('Browser Result:', browserResult);
        console.log('');

        // Example 4: File Synchronization
        console.log('5. Example: File Synchronization');
        const syncResult = await superVM.syncFiles(
            'upload',
            ['/path/to/file1.txt', '/path/to/file2.txt'],
            {
                destinationPath: '/shared/storage'
            }
        );
        console.log('Sync Result:', syncResult);
        console.log('');

        // Example 5: Scale the Super VM
        console.log('6. Example: Scaling Super VM');
        await superVM.scale(2); // Add 2 more nodes
        console.log('Scaled Super VM. New resource pool:', superVM.getResourceInfo());
        console.log('');

        // Example 6: Performance Monitoring
        console.log('7. Example: Performance Monitoring');
        const metrics = superVM.getPerformanceMetrics();
        console.log('Performance Metrics:', metrics);
        console.log('');

        // Example 7: Complex Workflow
        console.log('8. Example: Complex Workflow');
        await runComplexWorkflow();
        console.log('');

        // Final status
        console.log('9. Final Super VM Status');
        const finalStatus = superVM.getStatus();
        console.log('Final Status:', finalStatus);

    } catch (error) {
        console.error('❌ Error in Super VM examples:', error);
    } finally {
        // Cleanup
        console.log('10. Shutting down Super VM...');
        await superVM.shutdown();
        console.log('✅ Super VM examples completed');
    }
}

// Example of a complex workflow using multiple Super VM features
async function runComplexWorkflow() {
    console.log('Running complex workflow...');
    
    // Step 1: Upload files to shared storage
    const files = ['data1.csv', 'data2.csv', 'config.json'];
    await superVM.syncFiles('upload', files, {
        destinationPath: '/shared/workflow'
    });
    
    // Step 2: Process data in parallel
    const dataProcessingTasks = [
        superVM.processData([1, 2, 3, 4, 5], 'sort'),
        superVM.processData([10, 20, 30, 40, 50], 'map', { transform: 'item * 2' }),
        superVM.processData([100, 200, 300], 'reduce', { reducer: 'acc + item', initialValue: 0 })
    ];
    
    const processingResults = await Promise.all(dataProcessingTasks);
    console.log('Data processing results:', processingResults);
    
    // Step 3: Generate a report using browser automation
    const reportResult = await superVM.automateBrowser(
        'https://report-generator.example.com',
        [
            { action: 'input', selector: '#data', value: JSON.stringify(processingResults) },
            { action: 'click', selector: '#generate' },
            { action: 'wait', time: 5000 },
            { action: 'download', selector: '#download-link' }
        ],
        { screenshot: true }
    );
    
    console.log('Report generation result:', reportResult);
    
    // Step 4: Download results
    await superVM.syncFiles('download', ['report.pdf'], {
        destinationPath: '/local/results'
    });
    
    console.log('Complex workflow completed successfully');
}

// Example of monitoring and metrics
async function monitorSuperVM() {
    console.log('📊 Super VM Monitoring Dashboard');
    console.log('================================');
    
    setInterval(() => {
        const status = superVM.getStatus();
        const resources = superVM.getResourceInfo();
        const metrics = superVM.getPerformanceMetrics();
        
        console.clear();
        console.log('Super VM Status:', status.status);
        console.log('Active Tasks:', status.activeTasks);
        console.log('Uptime:', Math.floor(status.uptime / 1000), 'seconds');
        console.log('');
        console.log('Resource Utilization:');
        console.log('  CPU:', resources.utilization.cpu.toFixed(1) + '%');
        console.log('  Memory:', resources.utilization.memory.toFixed(1) + '%');
        console.log('  GPU:', resources.utilization.gpu.toFixed(1) + '%');
        console.log('');
        console.log('Performance:');
        console.log('  Tasks Executed:', metrics.totalTasksExecuted);
        console.log('  Average Execution Time:', metrics.averageExecutionTime.toFixed(0), 'ms');
        console.log('  System Efficiency:', metrics.efficiency.toFixed(1) + '%');
        console.log('  Current Load:', metrics.currentLoad.toFixed(1) + '%');
        console.log('');
        console.log('Nodes:', resources.nodeCount, 'active');
    }, 2000);
}

// Export functions for use in other modules
export { runSuperVMExamples, monitorSuperVM, runComplexWorkflow };

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runSuperVMExamples();
} 