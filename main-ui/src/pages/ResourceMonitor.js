// ResourceMonitor.js
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
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Network,
  Shield,
  Settings,
  Power,
  RefreshCw,
  Play,
  Square,
  Pause,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon
} from 'lucide-react';
import { useSuperVM } from '../context/SuperVMContext.js';

const ResourceMonitor = () => {
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
  const [selectedResource, setSelectedResource] = useState('cpu');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [viewMode, setViewMode] = useState('charts'); // 'charts' or 'table'

  // Real-time resource metrics
  const resourceMetrics = {
    cpu: {
      current: resourcePool.utilization.cpu,
      total: resourcePool.totalCPU,
      available: resourcePool.availableCPU,
      cores: nodes.reduce((sum, node) => sum + (node.cpu?.cores || 0), 0),
      history: [
        { time: '00:00', usage: 45, load: 2.3 },
        { time: '04:00', usage: 55, load: 3.1 },
        { time: '08:00', usage: 75, load: 4.8 },
        { time: '12:00', usage: 85, load: 6.2 },
        { time: '16:00', usage: 70, load: 4.5 },
        { time: '20:00', usage: 50, load: 2.8 },
      ]
    },
    memory: {
      current: resourcePool.utilization.memory,
      total: resourcePool.totalMemory,
      available: resourcePool.availableMemory,
      used: resourcePool.totalMemory - resourcePool.availableMemory,
      history: [
        { time: '00:00', usage: 60, available: 40 },
        { time: '04:00', usage: 65, available: 35 },
        { time: '08:00', usage: 80, available: 20 },
        { time: '12:00', usage: 85, available: 15 },
        { time: '16:00', usage: 75, available: 25 },
        { time: '20:00', usage: 65, available: 35 },
      ]
    },
    gpu: {
      current: resourcePool.utilization.gpu,
      total: resourcePool.totalGPU,
      available: resourcePool.availableGPU,
      history: [
        { time: '00:00', usage: 20, temperature: 45 },
        { time: '04:00', usage: 25, temperature: 52 },
        { time: '08:00', usage: 40, temperature: 68 },
        { time: '12:00', usage: 60, temperature: 75 },
        { time: '16:00', usage: 45, temperature: 62 },
        { time: '20:00', usage: 30, temperature: 48 },
      ]
    },
    network: {
      bandwidth: performanceMetrics.currentLoad * 100,
      connections: nodes.length,
      latency: Math.random() * 50 + 10,
      history: [
        { time: '00:00', incoming: 45, outgoing: 38 },
        { time: '04:00', incoming: 52, outgoing: 44 },
        { time: '08:00', incoming: 78, outgoing: 65 },
        { time: '12:00', incoming: 95, outgoing: 82 },
        { time: '16:00', incoming: 87, outgoing: 73 },
        { time: '20:00', incoming: 62, outgoing: 51 },
      ]
    }
  };

  // Resource distribution data
  const resourceDistribution = [
    { name: 'CPU', value: resourceMetrics.cpu.current, color: '#3B82F6', total: resourceMetrics.cpu.total },
    { name: 'Memory', value: resourceMetrics.memory.current, color: '#10B981', total: resourceMetrics.memory.total },
    { name: 'GPU', value: resourceMetrics.gpu.current, color: '#8B5CF6', total: resourceMetrics.gpu.total },
    { name: 'Network', value: resourceMetrics.network.bandwidth, color: '#F59E0B', total: 100 },
  ];

  // Performance alerts
  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'CPU usage is above 80%',
      resource: 'cpu',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      type: 'info',
      message: 'Memory usage is optimal',
      resource: 'memory',
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: 3,
      type: 'error',
      message: 'GPU temperature is high',
      resource: 'gpu',
      timestamp: new Date(Date.now() - 900000)
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

  const getAlertColor = (type) => {
    switch (type) {
      case 'error':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'info':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return XCircle;
      case 'warning':
        return AlertCircle;
      case 'info':
        return CheckCircle;
      default:
        return Info;
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`;
    }
    return `${minutes}m ago`;
  };

  return React.createElement('div', { className: 'space-y-6' },
    React.createElement('div', { className: 'flex items-center justify-between' },
      React.createElement('div', null,
        React.createElement('h1', { className: 'text-2xl font-bold text-gray-900 dark:text-white' }, 'Resource Monitor'),
        React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' },
          'Real-time monitoring of system resources and performance'
        )
      ),
      React.createElement('div', { className: 'flex items-center space-x-2' },
        React.createElement('button', {
          onClick: () => actions.refreshData(),
          className: 'flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700'
        },
          React.createElement(RefreshCw, { className: 'w-4 h-4 mr-2' }),
          'Refresh'
        ),
        React.createElement('button', {
          onClick: () => setViewMode(viewMode === 'charts' ? 'table' : 'charts'),
          className: 'flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700'
        },
          viewMode === 'charts' ? React.createElement(BarChart3, { className: 'w-4 h-4 mr-2' }) : React.createElement(LineChartIcon, { className: 'w-4 h-4 mr-2' }),
          viewMode === 'charts' ? 'Table View' : 'Chart View'
        )
      )
    ),
    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' },
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'flex items-center' },
          React.createElement('div', { className: 'p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg' },
            React.createElement(Cpu, { className: 'w-5 h-5 text-blue-600' })
          ),
          React.createElement('div', { className: 'ml-3' },
            React.createElement('p', { className: 'text-sm font-medium text-gray-500 dark:text-gray-400' }, 'CPU Usage'),
            React.createElement('p', { className: 'text-lg font-bold text-gray-900 dark:text-white' },
              `${resourceMetrics.cpu.current.toFixed(1)}%`
            )
          )
        ),
        React.createElement('div', { className: 'mt-3' },
          React.createElement('div', { className: 'w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2' },
            React.createElement('div', {
              className: 'bg-blue-600 h-2 rounded-full transition-all duration-300',
              style: { width: `${resourceMetrics.cpu.current}%` }
            })
          )
        )
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'flex items-center' },
          React.createElement('div', { className: 'p-2 bg-green-50 dark:bg-green-900/20 rounded-lg' },
            React.createElement(Database, { className: 'w-5 h-5 text-green-600' })
          ),
          React.createElement('div', { className: 'ml-3' },
            React.createElement('p', { className: 'text-sm font-medium text-gray-500 dark:text-gray-400' }, 'Memory Usage'),
            React.createElement('p', { className: 'text-lg font-bold text-gray-900 dark:text-white' },
              `${resourceMetrics.memory.current.toFixed(1)}%`
            )
          )
        ),
        React.createElement('div', { className: 'mt-3' },
          React.createElement('div', { className: 'w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2' },
            React.createElement('div', {
              className: 'bg-green-600 h-2 rounded-full transition-all duration-300',
              style: { width: `${resourceMetrics.memory.current}%` }
            })
          )
        )
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'flex items-center' },
          React.createElement('div', { className: 'p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg' },
            React.createElement(HardDrive, { className: 'w-5 h-5 text-purple-600' })
          ),
          React.createElement('div', { className: 'ml-3' },
            React.createElement('p', { className: 'text-sm font-medium text-gray-500 dark:text-gray-400' }, 'GPU Usage'),
            React.createElement('p', { className: 'text-lg font-bold text-gray-900 dark:text-white' },
              `${resourceMetrics.gpu.current.toFixed(1)}%`
            )
          )
        ),
        React.createElement('div', { className: 'mt-3' },
          React.createElement('div', { className: 'w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2' },
            React.createElement('div', {
              className: 'bg-purple-600 h-2 rounded-full transition-all duration-300',
              style: { width: `${resourceMetrics.gpu.current}%` }
            })
          )
        )
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'flex items-center' },
          React.createElement('div', { className: 'p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg' },
            React.createElement(Network, { className: 'w-5 h-5 text-orange-600' })
          ),
          React.createElement('div', { className: 'ml-3' },
            React.createElement('p', { className: 'text-sm font-medium text-gray-500 dark:text-gray-400' }, 'Network'),
            React.createElement('p', { className: 'text-lg font-bold text-gray-900 dark:text-white' },
              `${resourceMetrics.network.bandwidth.toFixed(1)}%`
            )
          )
        ),
        React.createElement('div', { className: 'mt-3' },
          React.createElement('div', { className: 'w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2' },
            React.createElement('div', {
              className: 'bg-orange-600 h-2 rounded-full transition-all duration-300',
              style: { width: `${resourceMetrics.network.bandwidth}%` }
            })
          )
        )
      )
    ),
    React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6' },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Resource Distribution'),
        React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
          React.createElement(PieChart, null,
            React.createElement(Pie, {
              data: resourceDistribution,
              cx: '50%',
              cy: '50%',
              outerRadius: 80,
              dataKey: 'value',
              label: ({ name, value }) => `${name}: ${value.toFixed(1)}%`
            },
              resourceDistribution.map((entry, index) => 
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
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6' },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Resource History'),
        React.createElement('div', { className: 'mb-4' },
          React.createElement('select', {
            value: selectedResource,
            onChange: (e) => setSelectedResource(e.target.value),
            className: 'px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          },
            React.createElement('option', { value: 'cpu' }, 'CPU'),
            React.createElement('option', { value: 'memory' }, 'Memory'),
            React.createElement('option', { value: 'gpu' }, 'GPU'),
            React.createElement('option', { value: 'network' }, 'Network')
          )
        ),
        React.createElement(ResponsiveContainer, { width: '100%', height: 250 },
          React.createElement(LineChart, { data: resourceMetrics[selectedResource].history },
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
            React.createElement(Line, { type: 'monotone', dataKey: 'usage', stroke: '#3B82F6', strokeWidth: 2 })
          )
        )
      )
    ),
    React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6' },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Performance Alerts'),
        React.createElement('div', { className: 'space-y-3' },
          alerts.map((alert) => {
            const AlertIcon = getAlertIcon(alert.type);
            return React.createElement('div', {
              key: alert.id,
              className: `flex items-center p-3 rounded-lg border ${getAlertColor(alert.type)}`
            },
              React.createElement(AlertIcon, { className: 'w-4 h-4 mr-3' }),
              React.createElement('div', { className: 'flex-1' },
                React.createElement('p', { className: 'text-sm font-medium' }, alert.message),
                React.createElement('p', { className: 'text-xs text-gray-500 dark:text-gray-400' }, formatTime(alert.timestamp))
              )
            );
          })
        )
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6' },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'System Status'),
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('span', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'System Status'),
            React.createElement('span', { className: `px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(systemStatus)}` }, systemStatus)
          ),
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('span', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Network Connection'),
            React.createElement('span', { className: `px-2 py-1 text-xs font-medium rounded-full ${isConnected ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-red-500 bg-red-50 dark:bg-red-900/20'}` },
              isConnected ? 'Connected' : 'Disconnected'
            )
          ),
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('span', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Active Nodes'),
            React.createElement('span', { className: 'text-sm font-medium text-gray-900 dark:text-white' }, nodes.length)
          ),
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('span', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Total Tasks'),
            React.createElement('span', { className: 'text-sm font-medium text-gray-900 dark:text-white' }, performanceMetrics.totalTasksExecuted)
          ),
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('span', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Average Execution'),
            React.createElement('span', { className: 'text-sm font-medium text-gray-900 dark:text-white' }, `${performanceMetrics.averageExecutionTime.toFixed(1)}ms`)
          )
        )
      )
    ),
    React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6' },
      React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Resource Actions'),
      React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
        React.createElement('button', {
          onClick: () => actions.refreshData(),
          className: 'flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
        },
          React.createElement(RefreshCw, { className: 'w-6 h-6 mb-2' }),
          React.createElement('span', { className: 'text-sm font-medium' }, 'Refresh Data')
        ),
        React.createElement('button', {
          onClick: () => console.log('Export data'),
          className: 'flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-green-600 bg-green-50 dark:bg-green-900/20'
        },
          React.createElement(Download, { className: 'w-6 h-6 mb-2' }),
          React.createElement('span', { className: 'text-sm font-medium' }, 'Export Data')
        ),
        React.createElement('button', {
          onClick: () => console.log('Set alerts'),
          className: 'flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-purple-600 bg-purple-50 dark:bg-purple-900/20'
        },
          React.createElement(AlertCircle, { className: 'w-6 h-6 mb-2' }),
          React.createElement('span', { className: 'text-sm font-medium' }, 'Set Alerts')
        ),
        React.createElement('button', {
          onClick: () => console.log('Open settings'),
          className: 'flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-gray-600 bg-gray-50 dark:bg-gray-900/20'
        },
          React.createElement(Settings, { className: 'w-6 h-6 mb-2' }),
          React.createElement('span', { className: 'text-sm font-medium' }, 'Settings')
        )
      )
    )
  );
};

export default ResourceMonitor; 