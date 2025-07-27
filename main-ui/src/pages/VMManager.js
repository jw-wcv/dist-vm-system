// VMManager.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Play, 
  Square, 
  Pause, 
  Trash2, 
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  Cpu,
  Database,
  HardDrive,
  Network,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Settings,
  Plus,
  Download,
  Upload,
  Wifi,
  WifiOff,
  Zap,
  TrendingUp,
  TrendingDown,
  Shield,
  Globe,
  Monitor,
  Power,
  PowerOff,
  RotateCcw,
  Copy,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react';
import { useSuperVM } from '../context/SuperVMContext.js';

const VMManager = () => {
  const { nodes, actions } = useSuperVM();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedVMs, setSelectedVMs] = useState([]);
  const [showDetails, setShowDetails] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Sample VM data (in real app, this would come from the backend)
  const sampleVMs = [
    {
      id: 'vm-1',
      name: 'Worker-Node-01',
      status: 'running',
      type: 'worker',
      ip: '192.168.1.101',
      ipv6: '2001:db8::1',
      cpu: { cores: 4, usage: 65.2 },
      memory: { total: 8192, used: 5120, available: 3072 },
      gpu: { count: 1, usage: 45.8 },
      storage: { total: 100, used: 35, available: 65 },
      network: { bandwidth: 1000, usage: 450 },
      uptime: '2d 15h 30m',
      lastSeen: new Date(Date.now() - 300000),
      tasks: 12,
      completedTasks: 156,
      failedTasks: 2,
      health: 'healthy',
      location: 'US-East',
      tags: ['rendering', 'compute']
    },
    {
      id: 'vm-2',
      name: 'Worker-Node-02',
      status: 'running',
      type: 'worker',
      ip: '192.168.1.102',
      ipv6: '2001:db8::2',
      cpu: { cores: 8, usage: 78.9 },
      memory: { total: 16384, used: 10240, available: 6144 },
      gpu: { count: 2, usage: 85.2 },
      storage: { total: 200, used: 120, available: 80 },
      network: { bandwidth: 1000, usage: 650 },
      uptime: '1d 8h 45m',
      lastSeen: new Date(Date.now() - 120000),
      tasks: 8,
      completedTasks: 89,
      failedTasks: 1,
      health: 'healthy',
      location: 'US-West',
      tags: ['gpu', 'high-performance']
    },
    {
      id: 'vm-3',
      name: 'Worker-Node-03',
      status: 'stopped',
      type: 'worker',
      ip: '192.168.1.103',
      ipv6: '2001:db8::3',
      cpu: { cores: 4, usage: 0 },
      memory: { total: 8192, used: 0, available: 8192 },
      gpu: { count: 0, usage: 0 },
      storage: { total: 100, used: 25, available: 75 },
      network: { bandwidth: 0, usage: 0 },
      uptime: '0h 0m',
      lastSeen: new Date(Date.now() - 3600000),
      tasks: 0,
      completedTasks: 45,
      failedTasks: 3,
      health: 'offline',
      location: 'EU-West',
      tags: ['storage', 'backup']
    }
  ];

  const vms = nodes.length > 0 ? nodes.map(node => ({
    id: node.id,
    name: node.name || `Node-${node.id}`,
    status: node.status || 'unknown',
    type: 'worker',
    ip: node.ip || '192.168.1.100',
    ipv6: node.ipv6 || '2001:db8::100',
    cpu: { cores: node.cpu?.cores || 4, usage: Math.random() * 100 },
    memory: { total: node.memory?.total || 8192, used: Math.random() * 8192, available: Math.random() * 8192 },
    gpu: { count: node.gpu?.count || 0, usage: Math.random() * 100 },
    storage: { total: 100, used: Math.random() * 100, available: Math.random() * 100 },
    network: { bandwidth: 1000, usage: Math.random() * 1000 },
    uptime: `${Math.floor(Math.random() * 10)}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
    lastSeen: new Date(Date.now() - Math.random() * 3600000),
    tasks: Math.floor(Math.random() * 20),
    completedTasks: Math.floor(Math.random() * 200),
    failedTasks: Math.floor(Math.random() * 10),
    health: ['healthy', 'warning', 'critical'][Math.floor(Math.random() * 3)],
    location: ['US-East', 'US-West', 'EU-West'][Math.floor(Math.random() * 3)],
    tags: ['compute', 'rendering', 'storage'].slice(0, Math.floor(Math.random() * 3) + 1)
  })) : sampleVMs;

  // Filter and sort VMs
  const filteredVMs = vms
    .filter(vm => {
      const matchesSearch = vm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vm.ip.includes(searchTerm) ||
                           vm.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || vm.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // VM statistics
  const vmStats = {
    total: vms.length,
    running: vms.filter(vm => vm.status === 'running').length,
    stopped: vms.filter(vm => vm.status === 'stopped').length,
    starting: vms.filter(vm => vm.status === 'starting').length,
    totalCpu: vms.reduce((sum, vm) => sum + vm.cpu.cores, 0),
    totalMemory: vms.reduce((sum, vm) => sum + vm.memory.total, 0),
    totalGpu: vms.reduce((sum, vm) => sum + vm.gpu.count, 0),
    totalTasks: vms.reduce((sum, vm) => sum + vm.tasks, 0)
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return Play;
      case 'stopped':
        return Square;
      case 'starting':
        return Clock;
      default:
        return AlertCircle;
    }
  };

  const formatUptime = (uptime) => {
    return uptime;
  };

  const formatLastSeen = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ${hours % 24}h ago`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`;
    } else {
      return `${minutes}m ago`;
    }
  };

  const handleSelectVM = (vmId) => {
    setSelectedVMs(prev => 
      prev.includes(vmId) 
        ? prev.filter(id => id !== vmId)
        : [...prev, vmId]
    );
  };

  const handleSelectAll = () => {
    setSelectedVMs(
      selectedVMs.length === filteredVMs.length 
        ? [] 
        : filteredVMs.map(vm => vm.id)
    );
  };

  const handleBulkAction = async (action) => {
    for (const vmId of selectedVMs) {
      await handleVMAction(vmId, action);
    }
    setSelectedVMs([]);
  };

  const handleVMAction = async (vmId, action) => {
    try {
      switch (action) {
        case 'start':
          await actions.startVM(vmId);
          break;
        case 'stop':
          await actions.stopVM(vmId);
          break;
        case 'restart':
          await actions.restartVM(vmId);
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this VM?')) {
            await actions.deleteVM(vmId);
          }
          break;
        case 'clone':
          await actions.cloneVM(vmId);
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} VM:`, error);
    }
  };

  return React.createElement('div', { className: 'space-y-6' },
    React.createElement('div', { className: 'flex items-center justify-between' },
      React.createElement('div', null,
        React.createElement('h1', { className: 'text-2xl font-bold text-gray-900 dark:text-white' }, 'VM Manager'),
        React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' },
          'Manage virtual machines across the distributed system'
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
          onClick: () => setShowCreateModal(true),
          className: 'flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700'
        },
          React.createElement(Plus, { className: 'w-4 h-4 mr-2' }),
          'Create VM'
        )
      )
    ),
    React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4' },
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-blue-600' }, vmStats.total),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Total VMs')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-green-600' }, vmStats.running),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Running')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-red-600' }, vmStats.stopped),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Stopped')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-yellow-600' }, vmStats.starting),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Starting')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-purple-600' }, vmStats.totalCpu),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Total CPU')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-orange-600' }, `${(vmStats.totalMemory / 1024).toFixed(0)}GB`),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Total Memory')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-cyan-600' }, vmStats.totalGpu),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Total GPU')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-indigo-600' }, vmStats.totalTasks),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Active Tasks')
      )
    ),
    React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
      React.createElement('div', { className: 'flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0' },
        React.createElement('div', { className: 'flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4' },
          React.createElement('div', { className: 'relative' },
            React.createElement(Search, { className: 'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' }),
            React.createElement('input', {
              type: 'text',
              placeholder: 'Search VMs...',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: 'pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            })
          ),
          React.createElement('select', {
            value: filterStatus,
            onChange: (e) => setFilterStatus(e.target.value),
            className: 'px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          },
            React.createElement('option', { value: 'all' }, 'All Status'),
            React.createElement('option', { value: 'running' }, 'Running'),
            React.createElement('option', { value: 'stopped' }, 'Stopped'),
            React.createElement('option', { value: 'starting' }, 'Starting')
          ),
          React.createElement('select', {
            value: sortBy,
            onChange: (e) => setSortBy(e.target.value),
            className: 'px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          },
            React.createElement('option', { value: 'name' }, 'Sort by Name'),
            React.createElement('option', { value: 'status' }, 'Sort by Status'),
            React.createElement('option', { value: 'cpu' }, 'Sort by CPU'),
            React.createElement('option', { value: 'memory' }, 'Sort by Memory')
          )
        ),
        selectedVMs.length > 0 && React.createElement('div', { className: 'flex items-center space-x-2' },
          React.createElement('span', { className: 'text-sm text-gray-500 dark:text-gray-400' },
            `${selectedVMs.length} selected`
          ),
          React.createElement('button', {
            onClick: () => handleBulkAction('start'),
            className: 'px-3 py-1 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded hover:bg-green-100 dark:hover:bg-green-900/30'
          }, 'Start'),
          React.createElement('button', {
            onClick: () => handleBulkAction('stop'),
            className: 'px-3 py-1 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/30'
          }, 'Stop'),
          React.createElement('button', {
            onClick: () => handleBulkAction('delete'),
            className: 'px-3 py-1 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/30'
          }, 'Delete')
        )
      )
    ),
    React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden' },
      React.createElement('div', { className: 'overflow-x-auto' },
        React.createElement('table', { className: 'min-w-full divide-y divide-gray-200 dark:divide-gray-700' },
          React.createElement('thead', { className: 'bg-gray-50 dark:bg-gray-700' },
            React.createElement('tr', null,
              React.createElement('th', { className: 'px-6 py-3 text-left' },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: selectedVMs.length === filteredVMs.length,
                  onChange: handleSelectAll,
                  className: 'rounded border-gray-300 dark:border-gray-600'
                })
              ),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'VM'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Status'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Resources'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Network'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Uptime'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Tasks'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Actions')
            )
          ),
          React.createElement('tbody', { className: 'bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700' },
            filteredVMs.map((vm) => {
              const StatusIcon = getStatusIcon(vm.status);
              return React.createElement(motion.tr, {
                key: vm.id,
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                className: 'hover:bg-gray-50 dark:hover:bg-gray-700'
              },
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement('input', {
                    type: 'checkbox',
                    checked: selectedVMs.includes(vm.id),
                    onChange: () => handleSelectVM(vm.id),
                    className: 'rounded border-gray-300 dark:border-gray-600'
                  })
                ),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement('div', { className: 'flex items-center' },
                    React.createElement('div', { className: 'flex-shrink-0 h-8 w-8' },
                      React.createElement('div', { className: 'h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center' },
                        React.createElement(Server, { className: 'w-4 h-4 text-blue-600' })
                      )
                    ),
                    React.createElement('div', { className: 'ml-4' },
                      React.createElement('div', { className: 'text-sm font-medium text-gray-900 dark:text-white' }, vm.name),
                      React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, vm.ip)
                    )
                  )
                ),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement('div', { className: 'flex items-center' },
                    React.createElement(StatusIcon, { className: 'w-4 h-4 mr-2 text-gray-400' }),
                    React.createElement('span', { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vm.status)}` }, vm.status)
                  )
                ),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement('div', { className: 'space-y-1' },
                    React.createElement('div', { className: 'flex items-center text-sm' },
                      React.createElement(Cpu, { className: 'w-3 h-3 mr-1 text-blue-600' }),
                      React.createElement('span', { className: 'text-gray-900 dark:text-white' }, `${vm.cpu.cores} cores (${vm.cpu.usage.toFixed(1)}%)`)
                    ),
                    React.createElement('div', { className: 'flex items-center text-sm' },
                      React.createElement(Database, { className: 'w-3 h-3 mr-1 text-green-600' }),
                      React.createElement('span', { className: 'text-gray-900 dark:text-white' }, `${(vm.memory.total / 1024).toFixed(0)}GB`)
                    ),
                    vm.gpu.count > 0 && React.createElement('div', { className: 'flex items-center text-sm' },
                      React.createElement(HardDrive, { className: 'w-3 h-3 mr-1 text-purple-600' }),
                      React.createElement('span', { className: 'text-gray-900 dark:text-white' }, `${vm.gpu.count} GPU (${vm.gpu.usage.toFixed(1)}%)`)
                    )
                  )
                ),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement('div', { className: 'space-y-1' },
                    React.createElement('div', { className: 'flex items-center text-sm' },
                      React.createElement(Network, { className: 'w-3 h-3 mr-1 text-cyan-600' }),
                      React.createElement('span', { className: 'text-gray-900 dark:text-white' }, `${vm.network.bandwidth}Mbps`)
                    ),
                    React.createElement('div', { className: 'text-xs text-gray-500 dark:text-gray-400' }, vm.ipv6)
                  )
                ),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement('div', { className: 'space-y-1' },
                    React.createElement('div', { className: 'text-sm text-gray-900 dark:text-white' }, formatUptime(vm.uptime)),
                    React.createElement('div', { className: 'text-xs text-gray-500 dark:text-gray-400' }, formatLastSeen(vm.lastSeen))
                  )
                ),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement('div', { className: 'space-y-1' },
                    React.createElement('div', { className: 'text-sm text-gray-900 dark:text-white' }, `${vm.tasks} active`),
                    React.createElement('div', { className: 'text-xs text-gray-500 dark:text-gray-400' }, `${vm.completedTasks} completed`)
                  )
                ),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm font-medium' },
                  React.createElement('div', { className: 'flex items-center space-x-2' },
                    React.createElement('button', {
                      onClick: () => handleVMAction(vm.id, 'start'),
                      className: 'text-green-600 hover:text-green-900 dark:hover:text-green-400',
                      title: 'Start'
                    }, React.createElement(Play, { className: 'w-4 h-4' })),
                    React.createElement('button', {
                      onClick: () => handleVMAction(vm.id, 'stop'),
                      className: 'text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400',
                      title: 'Stop'
                    }, React.createElement(Pause, { className: 'w-4 h-4' })),
                    React.createElement('button', {
                      onClick: () => handleVMAction(vm.id, 'restart'),
                      className: 'text-blue-600 hover:text-blue-900 dark:hover:text-blue-400',
                      title: 'Restart'
                    }, React.createElement(RotateCcw, { className: 'w-4 h-4' })),
                    React.createElement('button', {
                      onClick: () => setShowDetails(prev => ({ ...prev, [vm.id]: !prev[vm.id] })),
                      className: 'text-gray-600 hover:text-gray-900 dark:hover:text-gray-400',
                      title: 'Details'
                    }, showDetails[vm.id] ? React.createElement(EyeOff, { className: 'w-4 h-4' }) : React.createElement(Eye, { className: 'w-4 h-4' }))
                  )
                )
              );
            })
          )
        )
      )
    )
  );
};

export default VMManager; 