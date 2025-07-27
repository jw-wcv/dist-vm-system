// VMManager.jsx
// 
// Description: VM Manager page for Super VM system
// 
// This component provides comprehensive VM management capabilities including
// VM creation, monitoring, scaling, and individual VM control operations.
// 
// Features:
//   - VM list with detailed status
//   - VM creation and deletion
//   - Resource allocation management
//   - Individual VM monitoring
//   - Bulk operations
//   - Performance metrics per VM
// 
// Inputs: 
//   - VM data from Super VM context
//   - User interactions for VM management
// Outputs: 
//   - VM management interface
//   - VM creation/deletion operations
//   - Resource allocation updates
// 
// Dependencies: 
//   - Lucide React for icons
//   - Tailwind CSS for styling
//   - Framer Motion for animations

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Plus, 
  Trash2, 
  Play, 
  Square, 
  RefreshCw,
  Cpu,
  Memory,
  HardDrive,
  Wifi,
  WifiOff,
  Settings,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical
} from 'lucide-react';
import { useSuperVM } from '../context/SuperVMContext';

const VMManager = () => {
  const { nodes, actions } = useSuperVM();
  const [selectedVMs, setSelectedVMs] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sample VM data (in real app, this would come from the backend)
  const sampleVMs = [
    {
      id: 'vm-1',
      name: 'Worker-Node-01',
      status: 'running',
      ip: '192.168.1.101',
      cpu: { cores: 4, usage: 65 },
      memory: { total: 8192, used: 5120, unit: 'MB' },
      gpu: { count: 1, usage: 45 },
      uptime: '2d 14h 32m',
      tasks: { completed: 156, active: 2, failed: 1 },
      lastSeen: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      id: 'vm-2',
      name: 'Worker-Node-02',
      status: 'running',
      ip: '192.168.1.102',
      cpu: { cores: 8, usage: 78 },
      memory: { total: 16384, used: 10240, unit: 'MB' },
      gpu: { count: 2, usage: 82 },
      uptime: '1d 8h 15m',
      tasks: { completed: 234, active: 1, failed: 0 },
      lastSeen: new Date(Date.now() - 120000) // 2 minutes ago
    },
    {
      id: 'vm-3',
      name: 'Worker-Node-03',
      status: 'stopped',
      ip: '192.168.1.103',
      cpu: { cores: 4, usage: 0 },
      memory: { total: 8192, used: 0, unit: 'MB' },
      gpu: { count: 1, usage: 0 },
      uptime: '0d 0h 0m',
      tasks: { completed: 89, active: 0, failed: 3 },
      lastSeen: new Date(Date.now() - 3600000) // 1 hour ago
    }
  ];

  const vmList = nodes.length > 0 ? nodes : sampleVMs;

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'starting':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'stopped':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'error':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />;
      case 'starting':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />;
      case 'stopped':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  const formatUptime = (uptime) => {
    return uptime;
  };

  const formatLastSeen = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return timestamp.toLocaleDateString();
  };

  const handleSelectVM = (vmId) => {
    setSelectedVMs(prev => 
      prev.includes(vmId) 
        ? prev.filter(id => id !== vmId)
        : [...prev, vmId]
    );
  };

  const handleSelectAll = () => {
    setSelectedVMs(prev => 
      prev.length === vmList.length ? [] : vmList.map(vm => vm.id)
    );
  };

  const handleBulkAction = async (action) => {
    setIsLoading(true);
    try {
      // In real app, this would call the backend API
      console.log(`Bulk action: ${action} on VMs:`, selectedVMs);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVMAction = async (vmId, action) => {
    setIsLoading(true);
    try {
      // In real app, this would call the backend API
      console.log(`VM action: ${action} on VM: ${vmId}`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    } catch (error) {
      console.error('VM action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">VM Manager</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage virtual machines and compute resources
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create VM
          </button>
          <button
            onClick={() => actions.refreshData()}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Server className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total VMs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {vmList.length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Running</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {vmList.filter(vm => vm.status === 'running').length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {vmList.reduce((sum, vm) => sum + vm.tasks.active, 0)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Cpu className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total CPU</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {vmList.reduce((sum, vm) => sum + vm.cpu.cores, 0)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bulk Actions */}
      {selectedVMs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {selectedVMs.length} VM{selectedVMs.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('start')}
                disabled={isLoading}
                className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                <Play className="w-3 h-3 mr-1" />
                Start
              </button>
              <button
                onClick={() => handleBulkAction('stop')}
                disabled={isLoading}
                className="flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                <Square className="w-3 h-3 mr-1" />
                Stop
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={isLoading}
                className="flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* VM List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Virtual Machines
            </h3>
            <div className="flex items-center space-x-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedVMs.length === vmList.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Select All</span>
              </label>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  VM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Resources
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tasks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Uptime
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Seen
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {vmList.map((vm, index) => (
                <motion.tr
                  key={vm.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedVMs.includes(vm.id)}
                        onChange={() => handleSelectVM(vm.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {vm.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {vm.ip}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(vm.status)}
                      <span className={`ml-2 text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(vm.status)}`}>
                        {vm.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Cpu className="w-4 h-4 text-blue-500 mr-1" />
                          <span>{vm.cpu.cores} cores ({vm.cpu.usage}%)</span>
                        </div>
                        <div className="flex items-center">
                          <Memory className="w-4 h-4 text-green-500 mr-1" />
                          <span>{Math.round(vm.memory.used / 1024)}/{Math.round(vm.memory.total / 1024)} GB</span>
                        </div>
                        {vm.gpu.count > 0 && (
                          <div className="flex items-center">
                            <HardDrive className="w-4 h-4 text-purple-500 mr-1" />
                            <span>{vm.gpu.count} GPU ({vm.gpu.usage}%)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">{vm.tasks.completed}</span>
                        <span className="text-blue-600">{vm.tasks.active}</span>
                        <span className="text-red-600">{vm.tasks.failed}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatUptime(vm.uptime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatLastSeen(vm.lastSeen)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {vm.status === 'stopped' ? (
                        <button
                          onClick={() => handleVMAction(vm.id, 'start')}
                          disabled={isLoading}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Start VM"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVMAction(vm.id, 'stop')}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Stop VM"
                        >
                          <Square className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleVMAction(vm.id, 'restart')}
                        disabled={isLoading}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                        title="Restart VM"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleVMAction(vm.id, 'delete')}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Delete VM"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default VMManager; 