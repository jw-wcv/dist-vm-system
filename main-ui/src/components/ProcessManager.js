// ProcessManager.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
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
  Eye,
  EyeOff
} from 'lucide-react';
import { useSuperVM } from '../context/SuperVMContext.js';

const ProcessManager = () => {
  const { tasks, nodes, actions } = useSuperVM();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('cpu');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedProcesses, setSelectedProcesses] = useState([]);
  const [showDetails, setShowDetails] = useState({});

  // Sample process data (in real app, this would come from the backend)
  const sampleProcesses = [
    {
      id: 'proc-1',
      name: 'render-engine',
      type: 'rendering',
      status: 'running',
      pid: 1234,
      node: 'Worker-Node-01',
      cpu: 45.2,
      memory: 2048,
      gpu: 85.5,
      network: 12.3,
      disk: 156.7,
      uptime: '2h 15m',
      priority: 'normal',
      user: 'system',
      command: '/usr/bin/render-engine --scene=scene.blend',
      children: []
    },
    {
      id: 'proc-2',
      name: 'data-processor',
      type: 'processing',
      status: 'running',
      pid: 1235,
      node: 'Worker-Node-02',
      cpu: 78.9,
      memory: 4096,
      gpu: 0,
      network: 45.2,
      disk: 89.1,
      uptime: '1h 30m',
      priority: 'high',
      user: 'system',
      command: '/usr/bin/data-processor --input=dataset.csv',
      children: []
    },
    {
      id: 'proc-3',
      name: 'file-sync',
      type: 'sync',
      status: 'sleeping',
      pid: 1236,
      node: 'Worker-Node-01',
      cpu: 2.1,
      memory: 512,
      gpu: 0,
      network: 8.7,
      disk: 23.4,
      uptime: '4h 20m',
      priority: 'low',
      user: 'system',
      command: '/usr/bin/file-sync --watch=/data',
      children: []
    },
    {
      id: 'proc-4',
      name: 'monitoring-agent',
      type: 'monitoring',
      status: 'running',
      pid: 1237,
      node: 'Worker-Node-03',
      cpu: 5.3,
      memory: 1024,
      gpu: 0,
      network: 3.2,
      disk: 12.8,
      uptime: '6h 45m',
      priority: 'normal',
      user: 'system',
      command: '/usr/bin/monitoring-agent --config=monitor.conf',
      children: []
    }
  ];

  const processes = tasks.length > 0 ? tasks.map(task => ({
    id: task.id,
    name: task.type,
    type: task.type,
    status: task.status,
    pid: Math.floor(Math.random() * 9999) + 1000,
    node: task.node || 'Unknown',
    cpu: Math.random() * 100,
    memory: Math.random() * 8192,
    gpu: task.type === 'render' ? Math.random() * 100 : 0,
    network: Math.random() * 100,
    disk: Math.random() * 500,
    uptime: `${Math.floor(Math.random() * 10)}h ${Math.floor(Math.random() * 60)}m`,
    priority: ['low', 'normal', 'high'][Math.floor(Math.random() * 3)],
    user: 'system',
    command: `/usr/bin/${task.type}-engine`,
    children: []
  })) : sampleProcesses;

  // Filter and sort processes
  const filteredProcesses = processes
    .filter(process => {
      const matchesSearch = process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           process.command.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || process.status === filterStatus;
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

  // Process statistics
  const processStats = {
    total: processes.length,
    running: processes.filter(p => p.status === 'running').length,
    sleeping: processes.filter(p => p.status === 'sleeping').length,
    stopped: processes.filter(p => p.status === 'stopped').length,
    totalCpu: processes.reduce((sum, p) => sum + p.cpu, 0),
    totalMemory: processes.reduce((sum, p) => sum + p.memory, 0),
    totalGpu: processes.reduce((sum, p) => sum + p.gpu, 0)
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'sleeping':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'stopped':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'normal':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'low':
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const handleProcessAction = async (processId, action) => {
    try {
      switch (action) {
        case 'start':
          await actions.executeTask('custom', { processId });
          break;
        case 'stop':
          // Implement stop logic
          console.log(`Stopping process ${processId}`);
          break;
        case 'kill':
          // Implement kill logic
          console.log(`Killing process ${processId}`);
          break;
        case 'restart':
          // Implement restart logic
          console.log(`Restarting process ${processId}`);
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} process:`, error);
    }
  };

  const handleSelectProcess = (processId) => {
    setSelectedProcesses(prev => 
      prev.includes(processId) 
        ? prev.filter(id => id !== processId)
        : [...prev, processId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProcesses(
      selectedProcesses.length === filteredProcesses.length 
        ? [] 
        : filteredProcesses.map(p => p.id)
    );
  };

  const handleBulkAction = async (action) => {
    for (const processId of selectedProcesses) {
      await handleProcessAction(processId, action);
    }
    setSelectedProcesses([]);
  };

  return React.createElement('div', { className: 'space-y-6' },
    React.createElement('div', { className: 'flex items-center justify-between' },
      React.createElement('div', null,
        React.createElement('h1', { className: 'text-2xl font-bold text-gray-900 dark:text-white' }, 'Process Manager'),
        React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' },
          'Monitor and control system processes across all nodes'
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
    React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4' },
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-blue-600' }, processStats.total),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Total Processes')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-green-600' }, processStats.running),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Running')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-yellow-600' }, processStats.sleeping),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Sleeping')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-red-600' }, processStats.stopped),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Stopped')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-purple-600' }, processStats.totalCpu.toFixed(1)),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Total CPU')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-orange-600' }, (processStats.totalMemory / 1024).toFixed(1)),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Total Memory')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-cyan-600' }, processStats.totalGpu.toFixed(1)),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Total GPU')
      )
    ),
    React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
      React.createElement('div', { className: 'flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0' },
        React.createElement('div', { className: 'flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4' },
          React.createElement('div', { className: 'relative' },
            React.createElement(Search, { className: 'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' }),
            React.createElement('input', {
              type: 'text',
              placeholder: 'Search processes...',
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
            React.createElement('option', { value: 'sleeping' }, 'Sleeping'),
            React.createElement('option', { value: 'stopped' }, 'Stopped')
          ),
          React.createElement('select', {
            value: sortBy,
            onChange: (e) => setSortBy(e.target.value),
            className: 'px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          },
            React.createElement('option', { value: 'cpu' }, 'Sort by CPU'),
            React.createElement('option', { value: 'memory' }, 'Sort by Memory'),
            React.createElement('option', { value: 'name' }, 'Sort by Name'),
            React.createElement('option', { value: 'status' }, 'Sort by Status')
          )
        ),
        selectedProcesses.length > 0 && React.createElement('div', { className: 'flex items-center space-x-2' },
          React.createElement('span', { className: 'text-sm text-gray-500 dark:text-gray-400' },
            `${selectedProcesses.length} selected`
          ),
          React.createElement('button', {
            onClick: () => handleBulkAction('stop'),
            className: 'px-3 py-1 text-sm text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 rounded hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
          }, 'Stop'),
          React.createElement('button', {
            onClick: () => handleBulkAction('kill'),
            className: 'px-3 py-1 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/30'
          }, 'Kill')
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
                  checked: selectedProcesses.length === filteredProcesses.length,
                  onChange: handleSelectAll,
                  className: 'rounded border-gray-300 dark:border-gray-600'
                })
              ),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Process'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Status'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'CPU'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Memory'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'GPU'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Node'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Uptime'),
              React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Actions')
            )
          ),
          React.createElement('tbody', { className: 'bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700' },
            filteredProcesses.map((process) => 
              React.createElement(motion.tr, {
                key: process.id,
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                className: 'hover:bg-gray-50 dark:hover:bg-gray-700'
              },
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement('input', {
                    type: 'checkbox',
                    checked: selectedProcesses.includes(process.id),
                    onChange: () => handleSelectProcess(process.id),
                    className: 'rounded border-gray-300 dark:border-gray-600'
                  })
                ),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement('div', { className: 'flex items-center' },
                    React.createElement('div', { className: 'flex-shrink-0 h-8 w-8' },
                      React.createElement('div', { className: 'h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center' },
                        React.createElement(Activity, { className: 'w-4 h-4 text-blue-600' })
                      )
                    ),
                    React.createElement('div', { className: 'ml-4' },
                      React.createElement('div', { className: 'text-sm font-medium text-gray-900 dark:text-white' }, process.name),
                      React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, `PID: ${process.pid}`)
                    )
                  )
                ),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement('span', { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(process.status)}` }, process.status)
                ),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement('div', { className: 'flex items-center' },
                    React.createElement(Cpu, { className: 'w-4 h-4 text-blue-600 mr-2' }),
                    React.createElement('span', { className: 'text-sm text-gray-900 dark:text-white' }, `${process.cpu.toFixed(1)}%`)
                  )
                ),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement('div', { className: 'flex items-center' },
                    React.createElement(Database, { className: 'w-4 h-4 text-green-600 mr-2' }),
                    React.createElement('span', { className: 'text-sm text-gray-900 dark:text-white' }, `${(process.memory / 1024).toFixed(1)}GB`)
                  )
                ),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                  React.createElement('div', { className: 'flex items-center' },
                    React.createElement(HardDrive, { className: 'w-4 h-4 text-purple-600 mr-2' }),
                    React.createElement('span', { className: 'text-sm text-gray-900 dark:text-white' }, `${process.gpu.toFixed(1)}%`)
                  )
                ),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white' }, process.node),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400' }, process.uptime),
                React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm font-medium' },
                  React.createElement('div', { className: 'flex items-center space-x-2' },
                    React.createElement('button', {
                      onClick: () => handleProcessAction(process.id, 'start'),
                      className: 'text-green-600 hover:text-green-900 dark:hover:text-green-400',
                      title: 'Start'
                    }, React.createElement(Play, { className: 'w-4 h-4' })),
                    React.createElement('button', {
                      onClick: () => handleProcessAction(process.id, 'stop'),
                      className: 'text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400',
                      title: 'Stop'
                    }, React.createElement(Pause, { className: 'w-4 h-4' })),
                    React.createElement('button', {
                      onClick: () => handleProcessAction(process.id, 'kill'),
                      className: 'text-red-600 hover:text-red-900 dark:hover:text-red-400',
                      title: 'Kill'
                    }, React.createElement(Square, { className: 'w-4 h-4' })),
                    React.createElement('button', {
                      onClick: () => setShowDetails(prev => ({ ...prev, [process.id]: !prev[process.id] })),
                      className: 'text-blue-600 hover:text-blue-900 dark:hover:text-blue-400',
                      title: 'Details'
                    }, showDetails[process.id] ? React.createElement(EyeOff, { className: 'w-4 h-4' }) : React.createElement(Eye, { className: 'w-4 h-4' }))
                  )
                )
              )
            )
          )
        )
      )
    ),
    Object.keys(showDetails).some(key => showDetails[key]) && React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto' },
        React.createElement('div', { className: 'p-6' },
          React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Process Details'),
          filteredProcesses.filter(p => showDetails[p.id]).map(process => 
            React.createElement('div', { key: process.id, className: 'space-y-4' },
              React.createElement('div', { className: 'grid grid-cols-2 gap-4' },
                React.createElement('div', null,
                  React.createElement('label', { className: 'block text-sm font-medium text-gray-500 dark:text-gray-400' }, 'Name'),
                  React.createElement('p', { className: 'text-sm text-gray-900 dark:text-white' }, process.name)
                ),
                React.createElement('div', null,
                  React.createElement('label', { className: 'block text-sm font-medium text-gray-500 dark:text-gray-400' }, 'PID'),
                  React.createElement('p', { className: 'text-sm text-gray-900 dark:text-white' }, process.pid)
                ),
                React.createElement('div', null,
                  React.createElement('label', { className: 'block text-sm font-medium text-gray-500 dark:text-gray-400' }, 'Status'),
                  React.createElement('p', { className: 'text-sm text-gray-900 dark:text-white' }, process.status)
                ),
                React.createElement('div', null,
                  React.createElement('label', { className: 'block text-sm font-medium text-gray-500 dark:text-gray-400' }, 'Priority'),
                  React.createElement('p', { className: 'text-sm text-gray-900 dark:text-white' }, process.priority)
                ),
                React.createElement('div', null,
                  React.createElement('label', { className: 'block text-sm font-medium text-gray-500 dark:text-gray-400' }, 'User'),
                  React.createElement('p', { className: 'text-sm text-gray-900 dark:text-white' }, process.user)
                ),
                React.createElement('div', null,
                  React.createElement('label', { className: 'block text-sm font-medium text-gray-500 dark:text-gray-400' }, 'Uptime'),
                  React.createElement('p', { className: 'text-sm text-gray-900 dark:text-white' }, process.uptime)
                )
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-500 dark:text-gray-400' }, 'Command'),
                React.createElement('p', { className: 'text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded' }, process.command)
              )
            )
          ),
          React.createElement('div', { className: 'mt-6 flex justify-end' },
            React.createElement('button', {
              onClick: () => setShowDetails({}),
              className: 'px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600'
            }, 'Close')
          )
        )
      )
    )
  );
};

export default ProcessManager; 