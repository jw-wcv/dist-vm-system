// TaskManager.js
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
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Settings,
  Eye,
  EyeOff,
  Download,
  Upload,
  Server,
  Cpu,
  Database,
  HardDrive,
  Network,
  Zap,
  TrendingUp,
  TrendingDown,
  Calendar,
  Timer,
  Target,
  BarChart3,
  List,
  Grid,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useSuperVM } from '../context/SuperVMContext.js';

const TaskManager = () => {
  const { tasks, actions } = useSuperVM();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('startTime');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showDetails, setShowDetails] = useState({});
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Sample task data (in real app, this would come from the backend)
  const sampleTasks = [
    {
      id: 'task-1',
      type: 'render',
      status: 'completed',
      name: 'Scene Rendering',
      description: 'Rendering animation frames 1-100',
      startTime: new Date(Date.now() - 3600000),
      endTime: new Date(Date.now() - 1800000),
      executionTime: 1800000,
      progress: 100,
      node: 'Worker-Node-01',
      priority: 'high',
      resources: {
        cpu: 85.2,
        memory: 4096,
        gpu: 95.8
      },
      result: {
        frames: 100,
        outputPath: '/renders/scene_001-100/',
        fileSize: '2.4GB'
      }
    },
    {
      id: 'task-2',
      type: 'process',
      status: 'running',
      name: 'Data Processing',
      description: 'Processing large dataset for analysis',
      startTime: new Date(Date.now() - 1800000),
      endTime: null,
      executionTime: 1800000,
      progress: 65,
      node: 'Worker-Node-02',
      priority: 'normal',
      resources: {
        cpu: 78.9,
        memory: 8192,
        gpu: 0
      },
      result: null
    },
    {
      id: 'task-3',
      type: 'browser',
      status: 'queued',
      name: 'Web Automation',
      description: 'Automated testing of web application',
      startTime: null,
      endTime: null,
      executionTime: 0,
      progress: 0,
      node: 'Worker-Node-03',
      priority: 'low',
      resources: {
        cpu: 25.0,
        memory: 2048,
        gpu: 0
      },
      result: null
    },
    {
      id: 'task-4',
      type: 'sync',
      status: 'failed',
      name: 'File Synchronization',
      description: 'Synchronizing files across nodes',
      startTime: new Date(Date.now() - 7200000),
      endTime: new Date(Date.now() - 6900000),
      executionTime: 300000,
      progress: 45,
      node: 'Worker-Node-01',
      priority: 'normal',
      resources: {
        cpu: 15.3,
        memory: 1024,
        gpu: 0
      },
      result: {
        error: 'Network timeout',
        filesProcessed: 45,
        filesFailed: 12
      }
    }
  ];

  const taskList = tasks.length > 0 ? tasks.map(task => ({
    id: task.id,
    type: task.type,
    status: task.status,
    name: `${task.type.charAt(0).toUpperCase() + task.type.slice(1)} Task`,
    description: `Task ${task.id} execution`,
    startTime: new Date(task.startTime || Date.now() - Math.random() * 3600000),
    endTime: task.endTime ? new Date(task.endTime) : null,
    executionTime: task.executionTime || Math.random() * 3000000,
    progress: task.status === 'completed' ? 100 : task.status === 'running' ? Math.random() * 100 : 0,
    node: task.node || 'Unknown',
    priority: ['low', 'normal', 'high'][Math.floor(Math.random() * 3)],
    resources: {
      cpu: Math.random() * 100,
      memory: Math.random() * 8192,
      gpu: task.type === 'render' ? Math.random() * 100 : 0
    },
    result: task.result || null
  })) : sampleTasks;

  // Filter and sort tasks
  const filteredTasks = taskList
    .filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesType = filterType === 'all' || task.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
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

  // Task statistics
  const taskStats = {
    total: taskList.length,
    completed: taskList.filter(t => t.status === 'completed').length,
    running: taskList.filter(t => t.status === 'running').length,
    queued: taskList.filter(t => t.status === 'queued').length,
    failed: taskList.filter(t => t.status === 'failed').length,
    totalExecutionTime: taskList.reduce((sum, t) => sum + t.executionTime, 0),
    averageExecutionTime: taskList.filter(t => t.status === 'completed').length > 0 
      ? taskList.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.executionTime, 0) / taskList.filter(t => t.status === 'completed').length 
      : 0
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'running':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'queued':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'failed':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'running':
        return Activity;
      case 'queued':
        return Clock;
      case 'failed':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'render':
        return Server;
      case 'process':
        return Cpu;
      case 'browser':
        return Network;
      case 'sync':
        return Upload;
      default:
        return Activity;
    }
  };

  const formatDuration = (ms) => {
    if (ms === 0) return '0s';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleSelectTask = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTasks(
      selectedTasks.length === filteredTasks.length 
        ? [] 
        : filteredTasks.map(t => t.id)
    );
  };

  const handleBulkAction = async (action) => {
    for (const taskId of selectedTasks) {
      await handleTaskAction(taskId, action);
    }
    setSelectedTasks([]);
  };

  const handleTaskAction = async (taskId, action) => {
    try {
      switch (action) {
        case 'start':
          await actions.executeTask('custom', { taskId });
          break;
        case 'stop':
          // Implement stop logic
          console.log(`Stopping task ${taskId}`);
          break;
        case 'delete':
          // Implement delete logic
          console.log(`Deleting task ${taskId}`);
          break;
        case 'retry':
          // Implement retry logic
          console.log(`Retrying task ${taskId}`);
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} task:`, error);
    }
  };

  return React.createElement('div', { className: 'space-y-6' },
    React.createElement('div', { className: 'flex items-center justify-between' },
      React.createElement('div', null,
        React.createElement('h1', { className: 'text-2xl font-bold text-gray-900 dark:text-white' }, 'Task Manager'),
        React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' },
          'Monitor and manage distributed computing tasks'
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
          onClick: () => setViewMode(viewMode === 'list' ? 'grid' : 'list'),
          className: 'flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700'
        },
          viewMode === 'list' ? React.createElement(Grid, { className: 'w-4 h-4 mr-2' }) : React.createElement(List, { className: 'w-4 h-4 mr-2' }),
          viewMode === 'list' ? 'Grid' : 'List'
        )
      )
    ),
    React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4' },
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-blue-600' }, taskStats.total),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Total Tasks')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-green-600' }, taskStats.completed),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Completed')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-blue-600' }, taskStats.running),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Running')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-yellow-600' }, taskStats.queued),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Queued')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-red-600' }, taskStats.failed),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Failed')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-purple-600' }, formatDuration(taskStats.totalExecutionTime)),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Total Time')
      ),
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
        React.createElement('div', { className: 'text-2xl font-bold text-orange-600' }, formatDuration(taskStats.averageExecutionTime)),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Avg Time')
      )
    ),
    React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4' },
      React.createElement('div', { className: 'flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0' },
        React.createElement('div', { className: 'flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4' },
          React.createElement('div', { className: 'relative' },
            React.createElement(Search, { className: 'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' }),
            React.createElement('input', {
              type: 'text',
              placeholder: 'Search tasks...',
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
            React.createElement('option', { value: 'completed' }, 'Completed'),
            React.createElement('option', { value: 'running' }, 'Running'),
            React.createElement('option', { value: 'queued' }, 'Queued'),
            React.createElement('option', { value: 'failed' }, 'Failed')
          ),
          React.createElement('select', {
            value: filterType,
            onChange: (e) => setFilterType(e.target.value),
            className: 'px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          },
            React.createElement('option', { value: 'all' }, 'All Types'),
            React.createElement('option', { value: 'render' }, 'Render'),
            React.createElement('option', { value: 'process' }, 'Process'),
            React.createElement('option', { value: 'browser' }, 'Browser'),
            React.createElement('option', { value: 'sync' }, 'Sync')
          ),
          React.createElement('select', {
            value: sortBy,
            onChange: (e) => setSortBy(e.target.value),
            className: 'px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          },
            React.createElement('option', { value: 'startTime' }, 'Sort by Start Time'),
            React.createElement('option', { value: 'executionTime' }, 'Sort by Duration'),
            React.createElement('option', { value: 'status' }, 'Sort by Status'),
            React.createElement('option', { value: 'type' }, 'Sort by Type')
          )
        ),
        selectedTasks.length > 0 && React.createElement('div', { className: 'flex items-center space-x-2' },
          React.createElement('span', { className: 'text-sm text-gray-500 dark:text-gray-400' },
            `${selectedTasks.length} selected`
          ),
          React.createElement('button', {
            onClick: () => handleBulkAction('start'),
            className: 'px-3 py-1 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded hover:bg-green-100 dark:hover:bg-green-900/30'
          }, 'Start'),
          React.createElement('button', {
            onClick: () => handleBulkAction('stop'),
            className: 'px-3 py-1 text-sm text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 rounded hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
          }, 'Stop'),
          React.createElement('button', {
            onClick: () => handleBulkAction('delete'),
            className: 'px-3 py-1 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/30'
          }, 'Delete')
        )
      )
    ),
    viewMode === 'list' ? 
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden' },
        React.createElement('div', { className: 'overflow-x-auto' },
          React.createElement('table', { className: 'min-w-full divide-y divide-gray-200 dark:divide-gray-700' },
            React.createElement('thead', { className: 'bg-gray-50 dark:bg-gray-700' },
              React.createElement('tr', null,
                React.createElement('th', { className: 'px-6 py-3 text-left' },
                  React.createElement('input', {
                    type: 'checkbox',
                    checked: selectedTasks.length === filteredTasks.length,
                    onChange: handleSelectAll,
                    className: 'rounded border-gray-300 dark:border-gray-600'
                  })
                ),
                React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Task'),
                React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Status'),
                React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Progress'),
                React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Duration'),
                React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Node'),
                React.createElement('th', { className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider' }, 'Actions')
              )
            ),
            React.createElement('tbody', { className: 'bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700' },
              filteredTasks.map((task) => {
                const StatusIcon = getStatusIcon(task.status);
                const TypeIcon = getTypeIcon(task.type);
                return React.createElement(motion.tr, {
                  key: task.id,
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: 'hover:bg-gray-50 dark:hover:bg-gray-700'
                },
                  React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                    React.createElement('input', {
                      type: 'checkbox',
                      checked: selectedTasks.includes(task.id),
                      onChange: () => handleSelectTask(task.id),
                      className: 'rounded border-gray-300 dark:border-gray-600'
                    })
                  ),
                  React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                    React.createElement('div', { className: 'flex items-center' },
                      React.createElement('div', { className: 'flex-shrink-0 h-8 w-8' },
                        React.createElement('div', { className: 'h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center' },
                          React.createElement(TypeIcon, { className: 'w-4 h-4 text-blue-600' })
                        )
                      ),
                      React.createElement('div', { className: 'ml-4' },
                        React.createElement('div', { className: 'text-sm font-medium text-gray-900 dark:text-white' }, task.name),
                        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' }, task.description)
                      )
                    )
                  ),
                  React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                    React.createElement('div', { className: 'flex items-center' },
                      React.createElement(StatusIcon, { className: 'w-4 h-4 mr-2 text-gray-400' }),
                      React.createElement('span', { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}` }, task.status)
                    )
                  ),
                  React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap' },
                    React.createElement('div', { className: 'flex items-center' },
                      React.createElement('div', { className: 'w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2' },
                        React.createElement('div', {
                          className: 'bg-blue-600 h-2 rounded-full transition-all duration-300',
                          style: { width: `${task.progress}%` }
                        })
                      ),
                      React.createElement('span', { className: 'text-sm text-gray-900 dark:text-white' }, `${task.progress}%`)
                    )
                  ),
                  React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white' },
                    formatDuration(task.executionTime)
                  ),
                  React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white' }, task.node),
                  React.createElement('td', { className: 'px-6 py-4 whitespace-nowrap text-sm font-medium' },
                    React.createElement('div', { className: 'flex items-center space-x-2' },
                      React.createElement('button', {
                        onClick: () => handleTaskAction(task.id, 'start'),
                        className: 'text-green-600 hover:text-green-900 dark:hover:text-green-400',
                        title: 'Start'
                      }, React.createElement(Play, { className: 'w-4 h-4' })),
                      React.createElement('button', {
                        onClick: () => handleTaskAction(task.id, 'stop'),
                        className: 'text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400',
                        title: 'Stop'
                      }, React.createElement(Pause, { className: 'w-4 h-4' })),
                      React.createElement('button', {
                        onClick: () => handleTaskAction(task.id, 'delete'),
                        className: 'text-red-600 hover:text-red-900 dark:hover:text-red-400',
                        title: 'Delete'
                      }, React.createElement(Trash2, { className: 'w-4 h-4' })),
                      React.createElement('button', {
                        onClick: () => setShowDetails(prev => ({ ...prev, [task.id]: !prev[task.id] })),
                        className: 'text-blue-600 hover:text-blue-900 dark:hover:text-blue-400',
                        title: 'Details'
                      }, showDetails[task.id] ? React.createElement(EyeOff, { className: 'w-4 h-4' }) : React.createElement(Eye, { className: 'w-4 h-4' }))
                    )
                  )
                );
              })
            )
          )
        )
      ) :
      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
        filteredTasks.map((task) => {
          const StatusIcon = getStatusIcon(task.status);
          const TypeIcon = getTypeIcon(task.type);
          return React.createElement(motion.div, {
            key: task.id,
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'
          },
            React.createElement('div', { className: 'flex items-center justify-between mb-4' },
              React.createElement('div', { className: 'flex items-center' },
                React.createElement('div', { className: 'p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg' },
                  React.createElement(TypeIcon, { className: 'w-5 h-5 text-blue-600' })
                ),
                React.createElement('div', { className: 'ml-3' },
                  React.createElement('h3', { className: 'text-sm font-medium text-gray-900 dark:text-white' }, task.name),
                  React.createElement('p', { className: 'text-xs text-gray-500 dark:text-gray-400' }, task.description)
                )
              ),
              React.createElement('span', { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}` }, task.status)
            ),
            React.createElement('div', { className: 'space-y-3' },
              React.createElement('div', null,
                React.createElement('div', { className: 'flex justify-between text-xs mb-1' },
                  React.createElement('span', { className: 'text-gray-500 dark:text-gray-400' }, 'Progress'),
                  React.createElement('span', { className: 'text-gray-900 dark:text-white' }, `${task.progress}%`)
                ),
                React.createElement('div', { className: 'w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2' },
                  React.createElement('div', {
                    className: 'bg-blue-600 h-2 rounded-full transition-all duration-300',
                    style: { width: `${task.progress}%` }
                  })
                )
              ),
              React.createElement('div', { className: 'grid grid-cols-2 gap-2 text-xs' },
                React.createElement('div', null,
                  React.createElement('span', { className: 'text-gray-500 dark:text-gray-400' }, 'Duration: '),
                  React.createElement('span', { className: 'text-gray-900 dark:text-white' }, formatDuration(task.executionTime))
                ),
                React.createElement('div', null,
                  React.createElement('span', { className: 'text-gray-500 dark:text-gray-400' }, 'Node: '),
                  React.createElement('span', { className: 'text-gray-900 dark:text-white' }, task.node)
                )
              )
            ),
            React.createElement('div', { className: 'flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700' },
              React.createElement('div', { className: 'flex items-center space-x-2' },
                React.createElement('button', {
                  onClick: () => handleTaskAction(task.id, 'start'),
                  className: 'text-green-600 hover:text-green-900 dark:hover:text-green-400',
                  title: 'Start'
                }, React.createElement(Play, { className: 'w-3 h-3' })),
                React.createElement('button', {
                  onClick: () => handleTaskAction(task.id, 'stop'),
                  className: 'text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400',
                  title: 'Stop'
                }, React.createElement(Pause, { className: 'w-3 h-3' })),
                React.createElement('button', {
                  onClick: () => setShowDetails(prev => ({ ...prev, [task.id]: !prev[task.id] })),
                  className: 'text-blue-600 hover:text-blue-900 dark:hover:text-blue-400',
                  title: 'Details'
                }, showDetails[task.id] ? React.createElement(EyeOff, { className: 'w-3 h-3' }) : React.createElement(Eye, { className: 'w-3 h-3' }))
              ),
              React.createElement('input', {
                type: 'checkbox',
                checked: selectedTasks.includes(task.id),
                onChange: () => handleSelectTask(task.id),
                className: 'rounded border-gray-300 dark:border-gray-600'
              })
            )
          );
        })
      )
  );
};

export default TaskManager; 