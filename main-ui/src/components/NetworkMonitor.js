// NetworkMonitor.js
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
  Wifi, 
  WifiOff, 
  Network, 
  Activity, 
  Server, 
  Globe,
  Download,
  Upload,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useSuperVM } from '../context/SuperVMContext.js';

const NetworkMonitor = () => {
  const { nodes, isConnected, actions } = useSuperVM();
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [showTrafficDetails, setShowTrafficDetails] = useState(false);

  // Network metrics
  const networkMetrics = {
    totalNodes: nodes.length,
    connectedNodes: nodes.filter(node => node.status === 'running').length,
    totalBandwidth: 1000, // Mbps
    usedBandwidth: 450,   // Mbps
    latency: {
      average: 25.5,
      min: 12.3,
      max: 89.7
    },
    packetLoss: 0.02, // 2%
    connections: {
      active: 156,
      established: 142,
      listening: 14
    }
  };

  // Sample network traffic data
  const trafficHistory = [
    { time: '00:00', incoming: 45, outgoing: 38, total: 83 },
    { time: '04:00', incoming: 52, outgoing: 44, total: 96 },
    { time: '08:00', incoming: 78, outgoing: 65, total: 143 },
    { time: '12:00', incoming: 95, outgoing: 82, total: 177 },
    { time: '16:00', incoming: 87, outgoing: 73, total: 160 },
    { time: '20:00', incoming: 62, outgoing: 51, total: 113 },
  ];

  const bandwidthData = [
    { name: 'Used', value: networkMetrics.usedBandwidth, color: '#3B82F6' },
    { name: 'Available', value: networkMetrics.totalBandwidth - networkMetrics.usedBandwidth, color: '#10B981' },
  ];

  const connectionTypes = [
    { name: 'Established', value: networkMetrics.connections.established, color: '#10B981' },
    { name: 'Listening', value: networkMetrics.connections.listening, color: '#F59E0B' },
    { name: 'Active', value: networkMetrics.connections.active - networkMetrics.connections.established, color: '#3B82F6' },
  ];

  // Node connectivity data
  const nodeConnectivity = nodes.map(node => ({
    id: node.id,
    name: node.name || `Node-${node.id}`,
    status: node.status,
    ip: node.ip || '192.168.1.100',
    latency: Math.random() * 50 + 10,
    bandwidth: Math.random() * 100 + 50,
    connections: Math.floor(Math.random() * 20) + 5,
    lastSeen: new Date(Date.now() - Math.random() * 300000)
  }));

  // Network health indicators
  const healthIndicators = [
    {
      name: 'Overall Status',
      status: isConnected ? 'Connected' : 'Disconnected',
      icon: isConnected ? Wifi : WifiOff,
      color: isConnected ? 'text-green-500' : 'text-red-500',
      bgColor: isConnected ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
    },
    {
      name: 'Active Nodes',
      status: `${networkMetrics.connectedNodes}/${networkMetrics.totalNodes}`,
      icon: Server,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      name: 'Bandwidth Usage',
      status: `${((networkMetrics.usedBandwidth / networkMetrics.totalBandwidth) * 100).toFixed(1)}%`,
      icon: Activity,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      name: 'Average Latency',
      status: `${networkMetrics.latency.average.toFixed(1)}ms`,
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  const getSignalStrength = (latency) => {
    if (latency < 20) return { icon: SignalHigh, color: 'text-green-500' };
    if (latency < 50) return { icon: SignalMedium, color: 'text-yellow-500' };
    return { icon: SignalLow, color: 'text-red-500' };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'stopped':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'starting':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
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
        React.createElement('h1', { className: 'text-2xl font-bold text-gray-900 dark:text-white' }, 'Network Monitor'),
        React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' },
          'Monitor network connectivity and traffic across all nodes'
        )
      ),
      React.createElement('div', { className: 'flex items-center space-x-2' },
        React.createElement('button', {
          onClick: () => actions.refreshData(),
          className: 'flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700'
        },
          React.createElement(RefreshCw, { className: 'w-4 h-4 mr-2' }),
          'Refresh'
        )
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
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Traffic Overview'),
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('div', null,
            React.createElement('div', { className: 'flex justify-between text-sm mb-2' },
              React.createElement('span', { className: 'text-gray-500 dark:text-gray-400' }, 'Bandwidth Usage'),
              React.createElement('span', { className: 'font-medium text-gray-900 dark:text-white' },
                `${networkMetrics.usedBandwidth} / ${networkMetrics.totalBandwidth} Mbps`
              )
            ),
            React.createElement('div', { className: 'w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2' },
              React.createElement('div', {
                className: 'bg-blue-600 h-2 rounded-full transition-all duration-300',
                style: { width: `${(networkMetrics.usedBandwidth / networkMetrics.totalBandwidth) * 100}%` }
              })
            )
          ),
          React.createElement('div', { className: 'grid grid-cols-2 gap-4' },
            React.createElement('div', { className: 'text-center' },
              React.createElement('div', { className: 'text-2xl font-bold text-green-600' },
                networkMetrics.latency.average.toFixed(1)
              ),
              React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Avg Latency')
            ),
            React.createElement('div', { className: 'text-center' },
              React.createElement('div', { className: 'text-2xl font-bold text-red-600' },
                (networkMetrics.packetLoss * 100).toFixed(2)
              ),
              React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Packet Loss')
            )
          )
        )
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6' },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Connection Statistics'),
        React.createElement(ResponsiveContainer, { width: '100%', height: 200 },
          React.createElement(PieChart, null,
            React.createElement(Pie, {
              data: connectionTypes,
              cx: '50%',
              cy: '50%',
              outerRadius: 60,
              dataKey: 'value',
              label: ({ name, value }) => `${name}: ${value}`
            },
              connectionTypes.map((entry, index) => 
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
    React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6' },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Traffic History'),
        React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
          React.createElement(AreaChart, { data: trafficHistory },
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
            React.createElement(Area, { type: 'monotone', dataKey: 'incoming', stackId: '1', stroke: '#3B82F6', fill: '#3B82F6', fillOpacity: 0.6 }),
            React.createElement(Area, { type: 'monotone', dataKey: 'outgoing', stackId: '1', stroke: '#10B981', fill: '#10B981', fillOpacity: 0.6 })
          )
        )
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6' },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Bandwidth Distribution'),
        React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
          React.createElement(BarChart, { data: trafficHistory },
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
            React.createElement(Bar, { dataKey: 'total', fill: '#8B5CF6' })
          )
        )
      )
    ),
    React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden' },
      React.createElement('div', { className: 'px-6 py-4 border-b border-gray-200 dark:border-gray-700' },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white' }, 'Node Connectivity')
      ),
      React.createElement('div', { className: 'overflow-x-auto' },
        React.createElement('table', { className: 'min-w-full divide-y divide-gray-200 dark:divide-gray-700' },
          React.createElement('thead', { className: 'bg-gray-50 dark:bg-gray-700' },
            React.createElement('tr', null,
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Node'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Status'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'IP Address'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Latency'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Bandwidth'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Connections'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Last Seen')
            )
          ),
          React.createElement('tbody', { className: 'bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700' },
            nodeConnectivity.map((node) => {
              const signal = getSignalStrength(node.latency);
              return React.createElement(motion.tr, {
                key: node.id,
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                className: 'hover:bg-gray-50 dark:hover:bg-gray-700'
              },
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement('div', { className: 'flex items-center' },
                    React.createElement('div', { className: 'flex-shrink-0 h-8 w-8' },
                      React.createElement('div', { className: 'h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center' },
                        React.createElement(Server, { className: 'w-4 h-4 text-blue-600' })
                      )
                    ),
                    React.createElement('div', { className: 'ml-4' },
                      React.createElement('div', { className: 'text-sm font-medium text-gray-900 dark:text-white' }, node.name)
                    )
                  )
                ),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement('span', { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(node.status)}` }, node.status)
                ),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white' }, node.ip),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement('div', { className: 'flex items-center' },
                    React.createElement(signal.icon, { className: `w-4 h-4 mr-2 ${signal.color}` }),
                    React.createElement('span', { className: 'text-sm text-gray-900 dark:text-white' },
                      `${node.latency.toFixed(1)}ms`
                    )
                  )
                ),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white' },
                  `${node.bandwidth.toFixed(1)} Mbps`
                ),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white' }, node.connections),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400' },
                  formatTime(node.lastSeen)
                )
              );
            })
          )
        )
      )
    ),
    React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6' },
      React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Network Actions'),
      React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4' },
        React.createElement('button', {
          className: 'flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
        },
          React.createElement(RefreshCw, { className: 'w-6 h-6 mb-2' }),
          React.createElement('span', { className: 'text-sm font-medium' }, 'Refresh Network')
        ),
        React.createElement('button', {
          className: 'flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-green-600 bg-green-50 dark:bg-green-900/20'
        },
          React.createElement(Network, { className: 'w-6 h-6 mb-2' }),
          React.createElement('span', { className: 'text-sm font-medium' }, 'Test Connectivity')
        ),
        React.createElement('button', {
          className: 'flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-purple-600 bg-purple-50 dark:bg-purple-900/20'
        },
          React.createElement(Activity, { className: 'w-6 h-6 mb-2' }),
          React.createElement('span', { className: 'text-sm font-medium' }, 'Traffic Analysis')
        ),
        React.createElement('button', {
          className: 'flex flex-col items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-gray-600 bg-gray-50 dark:bg-gray-900/20'
        },
          React.createElement(Settings, { className: 'w-6 h-6 mb-2' }),
          React.createElement('span', { className: 'text-sm font-medium' }, 'Network Settings')
        )
      )
    )
  );
};

export default NetworkMonitor; 