// SystemOverview.jsx
//
// Description: System Overview Component for VM OS Management Panel
//
// This component provides a comprehensive system overview similar to an operating system
// dashboard, showing real-time system status, resource utilization, active processes,
// network status, and system health indicators.
//
// Features:
//   - Real-time system metrics
//   - Resource utilization charts
//   - Active processes/tasks monitoring
//   - Network connectivity status
//   - System health indicators
//   - Quick system actions
//   - Performance alerts
//
// Inputs: System data from SuperVM context
// Outputs: System overview interface with metrics and controls
//
// Dependencies:
//   - Recharts for data visualization
//   - Lucide React for icons
//   - Tailwind CSS for styling
//   - Framer Motion for animations

import React, { useState, useEffect } from 'react';
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Cpu, 
  Memory, 
  HardDrive, 
  Activity, 
  Server, 
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Database,
  Network,
  Shield,
  Settings,
  Power,
  RefreshCw,
  Play,
  Square,
  Pause
} from 'lucide-react';
import { useSuperVM } from '../context/SuperVMContext';

const SystemOverview = () => {
  const { 
    resourcePool, 
    performanceMetrics, 
    tasks, 
    systemStatus, 
    isConnected,
    nodes,
    actions 
  } = useSuperVM();

  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Real-time system metrics
  const systemMetrics = {
    cpu: {
      current: resourcePool.utilization.cpu,
      total: resourcePool.totalCPU,
      available: resourcePool.availableCPU,
      cores: nodes.reduce((sum, node) => sum + (node.cpu?.cores || 0), 0)
    },
    memory: {
      current: resourcePool.utilization.memory,
      total: resourcePool.totalMemory,
      available: resourcePool.availableMemory,
      used: resourcePool.totalMemory - resourcePool.availableMemory
    },
    gpu: {
      current: resourcePool.utilization.gpu,
      total: resourcePool.totalGPU,
      available: resourcePool.availableGPU
    },
    network: {
      activeConnections: nodes.length,
      bandwidth: performanceMetrics.currentLoad * 100,
      latency: Math.random() * 50 + 10 // Simulated
    },
    storage: {
      total: 1000, // GB
      used: 350,   // GB
      available: 650 // GB
    }
  };

  // Sample historical data for charts
  const resourceHistory = [
    { time: '00:00', cpu: 45, memory: 60, gpu: 20, network: 30 },
    { time: '04:00', cpu: 55, memory: 65, gpu: 25, network: 35 },
    { time: '08:00', cpu: 75, memory: 80, gpu: 40, network: 60 },
    { time: '12:00', cpu: 85, memory: 85, gpu: 60, network: 80 },
    { time: '16:00', cpu: 70, memory: 75, gpu: 45, network: 55 },
    { time: '20:00', cpu: 50, memory: 65, gpu: 30, network: 40 },
  ];

  const taskDistribution = [
    { name: 'Completed', value: performanceMetrics.totalTasksExecuted, color: '#10B981' },
    { name: 'Active', value: tasks.filter(t => t.status === 'running').length, color: '#3B82F6' },
    { name: 'Queued', value: tasks.filter(t => t.status === 'queued').length, color: '#F59E0B' },
    { name: 'Failed', value: tasks.filter(t => t.status === 'failed').length, color: '#EF4444' },
  ];

  const storageData = [
    { name: 'Used', value: systemMetrics.storage.used, color: '#3B82F6' },
    { name: 'Available', value: systemMetrics.storage.available, color: '#10B981' },
  ];

  // System health indicators
  const healthIndicators = [
    {
      name: 'System Status',
      status: systemStatus,
      icon: systemStatus === 'ready' ? CheckCircle : AlertCircle,
      color: systemStatus === 'ready' ? 'text-green-500' : 'text-yellow-500',
      bgColor: systemStatus === 'ready' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      name: 'Network',
      status: isConnected ? 'Connected' : 'Disconnected',
      icon: isConnected ? Wifi : WifiOff,
      color: isConnected ? 'text-green-500' : 'text-red-500',
      bgColor: isConnected ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
    },
    {
      name: 'Active Nodes',
      status: `${nodes.length} nodes`,
      icon: Server,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      name: 'Security',
      status: 'Protected',
      icon: Shield,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    }
  ];

  // Quick system actions
  const systemActions = [
    {
      name: 'Refresh System',
      icon: RefreshCw,
      action: () => actions.refreshData(),
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
    },
    {
      name: 'Scale Up',
      icon: TrendingUp,
      action: () => actions.scaleSystem(1),
      color: 'text-green-600 bg-green-50 dark:bg-green-900/20'
    },
    {
      name: 'Emergency Stop',
      icon: Square,
      action: () => console.log('Emergency stop'),
      color: 'text-red-600 bg-red-50 dark:bg-red-900/20'
    },
    {
      name: 'System Settings',
      icon: Settings,
      action: () => console.log('Open settings'),
      color: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'starting':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'error':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Overview</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Distributed VM Operating System - {new Date().toLocaleString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {isConnected ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(systemStatus)}`}>
            {systemStatus}
          </div>
        </div>
      </div>

      {/* System Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthIndicators.map((indicator, index) => (
          <motion.div
            key={indicator.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${indicator.bgColor}`}>
                <indicator.icon className={`w-5 h-5 ${indicator.color}`} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{indicator.name}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{indicator.status}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resource Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU and Memory */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resource Utilization</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 dark:text-gray-400">CPU</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {systemMetrics.cpu.current.toFixed(1)}% ({systemMetrics.cpu.cores} cores)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${systemMetrics.cpu.current}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 dark:text-gray-400">Memory</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {systemMetrics.memory.current.toFixed(1)}% ({systemMetrics.memory.used}GB / {systemMetrics.memory.total}GB)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${systemMetrics.memory.current}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 dark:text-gray-400">GPU</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {systemMetrics.gpu.current.toFixed(1)}% ({systemMetrics.gpu.total} units)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${systemMetrics.gpu.current}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Storage and Network */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Storage & Network</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 dark:text-gray-400">Storage</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {systemMetrics.storage.used}GB / {systemMetrics.storage.total}GB
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(systemMetrics.storage.used / systemMetrics.storage.total) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 dark:text-gray-400">Network</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {systemMetrics.network.bandwidth.toFixed(1)}% ({systemMetrics.network.activeConnections} connections)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${systemMetrics.network.bandwidth}%` }}
                />
              </div>
            </div>
            <div className="pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Latency</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {systemMetrics.network.latency.toFixed(1)}ms
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource History Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resource History</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={resourceHistory}>
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
              <Line type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="memory" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="gpu" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Task Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {taskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {systemActions.map((action, index) => (
            <motion.button
              key={action.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={action.action}
              className={`flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 ${action.color}`}
            >
              <action.icon className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">{action.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{performanceMetrics.totalTasksExecuted}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{performanceMetrics.averageExecutionTime.toFixed(1)}s</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Avg Execution</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{performanceMetrics.efficiency.toFixed(1)}%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Efficiency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{performanceMetrics.uptime.toFixed(1)}h</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview; 