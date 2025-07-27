// SystemOverview.js
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
  Database, 
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
  Database as DatabaseIcon,
  Network,
  Shield,
  Settings,
  Power,
  RefreshCw,
  Play,
  Square,
  Pause
} from 'lucide-react';
import { useSuperVM } from '../context/SuperVMContext.js';

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

  return React.createElement('div', { className: 'space-y-6' },
    React.createElement('div', { className: 'flex items-center justify-between' },
      React.createElement('div', null,
        React.createElement('h1', { className: 'text-3xl font-bold text-gray-900 dark:text-white' }, 'System Overview'),
        React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' },
          `Distributed VM Operating System - ${new Date().toLocaleString()}`
        )
      ),
      React.createElement('div', { className: 'flex items-center space-x-4' },
        React.createElement('div', { className: 'flex items-center space-x-2' },
          React.createElement('div', { className: `w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}` }),
          React.createElement('span', { className: 'text-sm text-gray-500 dark:text-gray-400' },
            isConnected ? 'Online' : 'Offline'
          )
        ),
        React.createElement('div', { className: `px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(systemStatus)}` }, systemStatus)
      )
    ),
    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' },
      healthIndicators.map((indicator, index) => 
        React.createElement(motion.div, {
          key: indicator.name,
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: index * 0.1 },
          className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4'
        },
          React.createElement('div', { className: 'flex items-center' },
            React.createElement('div', { className: `p-2 rounded-lg ${indicator.bgColor}` },
              React.createElement(indicator.icon, { className: `w-5 h-5 ${indicator.color}` })
            ),
            React.createElement('div', { className: 'ml-3' },
              React.createElement('p', { className: 'text-sm font-medium text-gray-500 dark:text-gray-400' }, indicator.name),
              React.createElement('p', { className: 'text-sm font-semibold text-gray-900 dark:text-white' }, indicator.status)
            )
          )
        )
      )
    ),
    React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6' },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Resource Utilization'),
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('div', null,
            React.createElement('div', { className: 'flex justify-between text-sm mb-2' },
              React.createElement('span', { className: 'text-gray-500 dark:text-gray-400' }, 'CPU'),
              React.createElement('span', { className: 'font-medium text-gray-900 dark:text-white' },
                `${systemMetrics.cpu.current.toFixed(1)}% (${systemMetrics.cpu.cores} cores)`
              )
            ),
            React.createElement('div', { className: 'w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2' },
              React.createElement('div', {
                className: 'bg-blue-600 h-2 rounded-full transition-all duration-300',
                style: { width: `${systemMetrics.cpu.current}%` }
              })
            )
          ),
          React.createElement('div', null,
            React.createElement('div', { className: 'flex justify-between text-sm mb-2' },
              React.createElement('span', { className: 'text-gray-500 dark:text-gray-400' }, 'Memory'),
              React.createElement('span', { className: 'font-medium text-gray-900 dark:text-white' },
                `${systemMetrics.memory.current.toFixed(1)}% (${systemMetrics.memory.used}GB / ${systemMetrics.memory.total}GB)`
              )
            ),
            React.createElement('div', { className: 'w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2' },
              React.createElement('div', {
                className: 'bg-green-600 h-2 rounded-full transition-all duration-300',
                style: { width: `${systemMetrics.memory.current}%` }
              })
            )
          ),
          React.createElement('div', null,
            React.createElement('div', { className: 'flex justify-between text-sm mb-2' },
              React.createElement('span', { className: 'text-gray-500 dark:text-gray-400' }, 'GPU'),
              React.createElement('span', { className: 'font-medium text-gray-900 dark:text-white' },
                `${systemMetrics.gpu.current.toFixed(1)}% (${systemMetrics.gpu.total} units)`
              )
            ),
            React.createElement('div', { className: 'w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2' },
              React.createElement('div', {
                className: 'bg-purple-600 h-2 rounded-full transition-all duration-300',
                style: { width: `${systemMetrics.gpu.current}%` }
              })
            )
          )
        )
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6' },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Storage & Network'),
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('div', null,
            React.createElement('div', { className: 'flex justify-between text-sm mb-2' },
              React.createElement('span', { className: 'text-gray-500 dark:text-gray-400' }, 'Storage'),
              React.createElement('span', { className: 'font-medium text-gray-900 dark:text-white' },
                `${systemMetrics.storage.used}GB / ${systemMetrics.storage.total}GB`
              )
            ),
            React.createElement('div', { className: 'w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2' },
              React.createElement('div', {
                className: 'bg-orange-600 h-2 rounded-full transition-all duration-300',
                style: { width: `${(systemMetrics.storage.used / systemMetrics.storage.total) * 100}%` }
              })
            )
          ),
          React.createElement('div', null,
            React.createElement('div', { className: 'flex justify-between text-sm mb-2' },
              React.createElement('span', { className: 'text-gray-500 dark:text-gray-400' }, 'Network'),
              React.createElement('span', { className: 'font-medium text-gray-900 dark:text-white' },
                `${systemMetrics.network.bandwidth.toFixed(1)}% (${systemMetrics.network.activeConnections} connections)`
              )
            ),
            React.createElement('div', { className: 'w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2' },
              React.createElement('div', {
                className: 'bg-cyan-600 h-2 rounded-full transition-all duration-300',
                style: { width: `${systemMetrics.network.bandwidth}%` }
              })
            )
          ),
          React.createElement('div', { className: 'pt-2' },
            React.createElement('div', { className: 'flex justify-between text-sm' },
              React.createElement('span', { className: 'text-gray-500 dark:text-gray-400' }, 'Latency'),
              React.createElement('span', { className: 'font-medium text-gray-900 dark:text-white' },
                `${systemMetrics.network.latency.toFixed(1)}ms`
              )
            )
          )
        )
      )
    ),
    React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6' },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Resource History'),
        React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
          React.createElement(LineChart, { data: resourceHistory },
            React.createElement(CartesianGrid, { strokeDasharray: '3 3', stroke: '#374151' }),
            React.createElement(XAxis, { dataKey: 'time', stroke: '#9CA3AF' }),
            React.createElement(YAxis, { stroke: '#9CA3AF' }),
            React.createElement(Tooltip, {
              contentStyle: {
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px'
              }
            }),
            React.createElement(Line, { type: 'monotone', dataKey: 'cpu', stroke: '#3B82F6', strokeWidth: 2 }),
            React.createElement(Line, { type: 'monotone', dataKey: 'memory', stroke: '#10B981', strokeWidth: 2 }),
            React.createElement(Line, { type: 'monotone', dataKey: 'gpu', stroke: '#8B5CF6', strokeWidth: 2 })
          )
        )
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6' },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Task Distribution'),
        React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
          React.createElement(PieChart, null,
            React.createElement(Pie, {
              data: taskDistribution,
              cx: '50%',
              cy: '50%',
              outerRadius: 80,
              dataKey: 'value',
              label: ({ name, value }) => `${name}: ${value}`
            },
              taskDistribution.map((entry, index) => 
                React.createElement(Cell, { key: `cell-${index}`, fill: entry.color })
              )
            ),
            React.createElement(Tooltip, {
              contentStyle: {
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px'
              }
            })
          )
        )
      )
    ),
    React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6' },
      React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'System Actions'),
      React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
        systemActions.map((action, index) => 
          React.createElement(motion.button, {
            key: action.name,
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: index * 0.1 },
            onClick: action.action,
            className: `flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 ${action.color}`
          },
            React.createElement(action.icon, { className: 'w-6 h-6 mb-2' }),
            React.createElement('span', { className: 'text-sm font-medium' }, action.name)
          )
        )
      )
    ),
    React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6' },
      React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Performance Summary'),
      React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
        React.createElement('div', { className: 'text-center' },
          React.createElement('div', { className: 'text-2xl font-bold text-blue-600' }, performanceMetrics.totalTasksExecuted),
          React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Total Tasks')
        ),
        React.createElement('div', { className: 'text-center' },
          React.createElement('div', { className: 'text-2xl font-bold text-green-600' }, performanceMetrics.averageExecutionTime.toFixed(1)),
          React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Avg Execution')
        ),
        React.createElement('div', { className: 'text-center' },
          React.createElement('div', { className: 'text-2xl font-bold text-purple-600' }, performanceMetrics.efficiency.toFixed(1)),
          React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Efficiency')
        ),
        React.createElement('div', { className: 'text-center' },
          React.createElement('div', { className: 'text-2xl font-bold text-orange-600' }, performanceMetrics.uptime.toFixed(1)),
          React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Uptime')
        )
      )
    )
  );
};

export default SystemOverview; 