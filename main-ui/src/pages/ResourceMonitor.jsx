// ResourceMonitor.jsx
// 
// Description: Resource Monitor page for Super VM system
// 
// This component provides real-time resource monitoring and analytics
// for the distributed VM system.
// 
// Features:
//   - Real-time resource utilization
//   - Historical performance data
//   - Resource allocation tracking
//   - Performance alerts
// 
// Inputs: 
//   - Resource data from Super VM context
// Outputs: 
//   - Resource monitoring interface
//   - Performance analytics
// 
// Dependencies: 
//   - Recharts for data visualization
//   - Lucide React for icons
//   - Tailwind CSS for styling

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Cpu, 
  Database, 
  HardDrive, 
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { useSuperVM } from '../hooks/useSuperVM';

const ResourceMonitor = () => {
  const { resourcePool, performanceMetrics } = useSuperVM();

  // Sample historical data
  const historicalData = [
    { time: '00:00', cpu: 45, memory: 60, gpu: 20, network: 30 },
    { time: '04:00', cpu: 55, memory: 65, gpu: 25, network: 35 },
    { time: '08:00', cpu: 75, memory: 80, gpu: 40, network: 50 },
    { time: '12:00', cpu: 85, memory: 85, gpu: 60, network: 70 },
    { time: '16:00', cpu: 70, memory: 75, gpu: 45, network: 55 },
    { time: '20:00', cpu: 50, memory: 65, gpu: 30, network: 40 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resource Monitor</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Real-time resource utilization and performance analytics
        </p>
      </div>

      {/* Current Resource Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CPU Usage</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {resourcePool.utilization.cpu.toFixed(1)}%
              </p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Cpu className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${resourcePool.utilization.cpu}%` }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Memory Usage</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {resourcePool.utilization.memory.toFixed(1)}%
              </p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <Database className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${resourcePool.utilization.memory}%` }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">GPU Usage</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {resourcePool.utilization.gpu.toFixed(1)}%
              </p>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <HardDrive className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${resourcePool.utilization.gpu}%` }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">System Load</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {performanceMetrics.currentLoad.toFixed(1)}%
              </p>
            </div>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${performanceMetrics.currentLoad}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Resource Utilization Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Resource Utilization Over Time
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="cpu" 
              stackId="1" 
              stroke="#3B82F6" 
              fill="#3B82F6" 
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="memory" 
              stackId="1" 
              stroke="#10B981" 
              fill="#10B981" 
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="gpu" 
              stackId="1" 
              stroke="#8B5CF6" 
              fill="#8B5CF6" 
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Tasks Executed</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {performanceMetrics.totalTasksExecuted}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Average Execution Time</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {performanceMetrics.averageExecutionTime.toFixed(0)}ms
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">System Efficiency</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {performanceMetrics.efficiency.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Compute Time</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {Math.round(performanceMetrics.totalComputeTime / 1000)}s
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Resource Allocation
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total CPU Cores</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {resourcePool.totalCPU}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Available CPU</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {resourcePool.availableCPU}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Memory</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {Math.round(resourcePool.totalMemory / 1024)} GB
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Available Memory</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {Math.round(resourcePool.availableMemory / 1024)} GB
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResourceMonitor; 