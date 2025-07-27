// Dashboard.js
import React, { useState } from 'react';
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
  Play, 
  Server, 
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useSuperVM } from '../context/SuperVMContext.js';
import SystemOverview from '../components/SystemOverview.js';

const Dashboard = () => {
  console.log('Dashboard component rendering');
  
  const { 
    resourcePool, 
    performanceMetrics, 
    tasks, 
    systemStatus, 
    isConnected,
    actions 
  } = useSuperVM();

  console.log('Dashboard data:', { resourcePool, performanceMetrics, tasks, systemStatus, isConnected });

  const [isExecutingTask, setIsExecutingTask] = useState(false);

  // Fallback for debugging - render a simple div if there are issues
  if (!resourcePool || !performanceMetrics) {
    console.log('Dashboard: Missing data, rendering fallback');
    return React.createElement('div', { 
      className: 'p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700' 
    },
      React.createElement('h1', { className: 'text-2xl font-bold text-gray-900 dark:text-white mb-4' }, 'Dashboard Loading...'),
      React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' }, 'Waiting for data from Super VM system...'),
      React.createElement('div', { className: 'mt-4' },
        React.createElement('p', { className: 'text-sm text-gray-600 dark:text-gray-500' }, `System Status: ${systemStatus || 'unknown'}`),
        React.createElement('p', { className: 'text-sm text-gray-600 dark:text-gray-500' }, `Connected: ${isConnected ? 'Yes' : 'No'}`)
      )
    );
  }

  // Sample data for charts (in real app, this would come from historical data)
  const resourceHistory = [
    { time: '00:00', cpu: 45, memory: 60, gpu: 20 },
    { time: '04:00', cpu: 55, memory: 65, gpu: 25 },
    { time: '08:00', cpu: 75, memory: 80, gpu: 40 },
    { time: '12:00', cpu: 85, memory: 85, gpu: 60 },
    { time: '16:00', cpu: 70, memory: 75, gpu: 45 },
    { time: '20:00', cpu: 50, memory: 65, gpu: 30 },
  ];

  const taskDistribution = [
    { name: 'Completed', value: performanceMetrics.totalTasksExecuted, color: '#10B981' },
    { name: 'Active', value: performanceMetrics.totalTasksExecuted > 0 ? 2 : 0, color: '#3B82F6' },
    { name: 'Failed', value: 0, color: '#EF4444' },
  ];

  const quickActions = [
    {
      name: 'Data Processing',
      description: 'Process large datasets',
      icon: Activity,
      action: () => executeSampleTask('process', {
        inputData: Array.from({ length: 10000 }, (_, i) => Math.random() * 1000),
        operation: 'sort',
        parameters: { cpu: 2, memory: 2048 }
      })
    },
    {
      name: '3D Rendering',
      description: 'Distributed rendering task',
      icon: Server,
      action: () => executeSampleTask('render', {
        sceneFile: '/sample/scene.blend',
        frameStart: 1,
        frameEnd: 50,
        options: { quality: 'high', resolution: '1920x1080' }
      })
    },
    {
      name: 'Scale Up',
      description: 'Add compute nodes',
      icon: TrendingUp,
      action: () => actions.scaleSystem(1)
    }
  ];

  const executeSampleTask = async (taskType, taskData) => {
    setIsExecutingTask(true);
    try {
      await actions.executeTask(taskType, taskData);
    } catch (error) {
      console.error('Task execution failed:', error);
    } finally {
      setIsExecutingTask(false);
    }
  };

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

  return React.createElement('div', { className: 'space-y-6 w-full max-w-none' },
    React.createElement(SystemOverview),
          React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6' },
      React.createElement(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1 },
        className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'
      },
        React.createElement('div', { className: 'flex items-center' },
          React.createElement('div', { className: 'p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg' },
            React.createElement(Cpu, { className: 'w-6 h-6 text-blue-600' })
          ),
          React.createElement('div', { className: 'ml-4' },
            React.createElement('p', { className: 'text-sm font-medium text-gray-500 dark:text-gray-400' }, 'CPU Utilization'),
            React.createElement('p', { className: 'text-2xl font-bold text-gray-900 dark:text-white' },
              `${(resourcePool.utilization?.cpu || 0).toFixed(1)}%`
            )
          )
        )
      ),
      React.createElement(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.2 },
        className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'
      },
        React.createElement('div', { className: 'flex items-center' },
          React.createElement('div', { className: 'p-2 bg-green-50 dark:bg-green-900/20 rounded-lg' },
            React.createElement(Database, { className: 'w-6 h-6 text-green-600' })
          ),
          React.createElement('div', { className: 'ml-4' },
            React.createElement('p', { className: 'text-sm font-medium text-gray-500 dark:text-gray-400' }, 'Memory Usage'),
            React.createElement('p', { className: 'text-2xl font-bold text-gray-900 dark:text-white' },
              `${(resourcePool.utilization?.memory || 0).toFixed(1)}%`
            )
          )
        )
      ),
      React.createElement(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.3 },
        className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'
      },
        React.createElement('div', { className: 'flex items-center' },
          React.createElement('div', { className: 'p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg' },
            React.createElement(HardDrive, { className: 'w-6 h-6 text-purple-600' })
          ),
          React.createElement('div', { className: 'ml-4' },
            React.createElement('p', { className: 'text-sm font-medium text-gray-500 dark:text-gray-400' }, 'GPU Usage'),
            React.createElement('p', { className: 'text-2xl font-bold text-gray-900 dark:text-white' },
              `${(resourcePool.utilization?.gpu || 0).toFixed(1)}%`
            )
          )
        )
      ),
      React.createElement(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.4 },
        className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'
      },
        React.createElement('div', { className: 'flex items-center' },
          React.createElement('div', { className: 'p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg' },
            React.createElement(Zap, { className: 'w-6 h-6 text-orange-600' })
          ),
          React.createElement('div', { className: 'ml-4' },
            React.createElement('p', { className: 'text-sm font-medium text-gray-500 dark:text-gray-400' }, 'Tasks Executed'),
            React.createElement('p', { className: 'text-2xl font-bold text-gray-900 dark:text-white' },
              performanceMetrics.totalTasksExecuted
            )
          )
        )
      )
    ),
    React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
      React.createElement(motion.div, {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: 0.5 },
        className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'
      },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Resource Utilization'),
        React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
          React.createElement(AreaChart, { data: resourceHistory },
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
            React.createElement(Area, {
              type: 'monotone',
              dataKey: 'cpu',
              stackId: '1',
              stroke: '#3B82F6',
              fill: '#3B82F6',
              fillOpacity: 0.6
            }),
            React.createElement(Area, {
              type: 'monotone',
              dataKey: 'memory',
              stackId: '1',
              stroke: '#10B981',
              fill: '#10B981',
              fillOpacity: 0.6
            }),
            React.createElement(Area, {
              type: 'monotone',
              dataKey: 'gpu',
              stackId: '1',
              stroke: '#8B5CF6',
              fill: '#8B5CF6',
              fillOpacity: 0.6
            })
          )
        )
      ),
      React.createElement(motion.div, {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: 0.6 },
        className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'
      },
        React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Task Distribution'),
        React.createElement(ResponsiveContainer, { width: '100%', height: 300 },
          React.createElement(PieChart, null,
            React.createElement(Pie, {
              data: taskDistribution,
              cx: '50%',
              cy: '50%',
              innerRadius: 60,
              outerRadius: 100,
              paddingAngle: 5,
              dataKey: 'value'
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
        ),
        React.createElement('div', { className: 'flex justify-center space-x-4 mt-4' },
          taskDistribution.map((item, index) => 
            React.createElement('div', { key: index, className: 'flex items-center' },
              React.createElement('div', {
                className: 'w-3 h-3 rounded-full mr-2',
                style: { backgroundColor: item.color }
              }),
              React.createElement('span', { className: 'text-sm text-gray-600 dark:text-gray-400' },
                `${item.name}: ${item.value}`
              )
            )
          )
        )
      )
    ),
    React.createElement(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.7 },
      className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'
    },
      React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Quick Actions'),
      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
        quickActions.map((action, index) => 
          React.createElement('button', {
            key: index,
            onClick: action.action,
            disabled: isExecutingTask,
            className: 'flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          },
            React.createElement('div', { className: 'p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg' },
              React.createElement(action.icon, { className: 'w-5 h-5 text-blue-600' })
            ),
            React.createElement('div', { className: 'ml-3 text-left' },
              React.createElement('p', { className: 'text-sm font-medium text-gray-900 dark:text-white' }, action.name),
              React.createElement('p', { className: 'text-xs text-gray-500 dark:text-gray-400' }, action.description)
            )
          )
        )
      )
    ),
    React.createElement(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.8 },
      className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'
    },
      React.createElement('h3', { className: 'text-lg font-semibold text-gray-900 dark:text-white mb-4' }, 'Recent Tasks'),
      React.createElement('div', { className: 'space-y-3' },
        tasks.slice(-5).reverse().map((task, index) => 
          React.createElement('div', { key: task.id, className: 'flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg' },
            React.createElement('div', { className: 'flex items-center space-x-3' },
              React.createElement('div', { className: 'p-1 bg-blue-50 dark:bg-blue-900/20 rounded' },
                React.createElement(Activity, { className: 'w-4 h-4 text-blue-600' })
              ),
              React.createElement('div', null,
                React.createElement('p', { className: 'text-sm font-medium text-gray-900 dark:text-white' },
                  `${task.type} Task`
                ),
                React.createElement('p', { className: 'text-xs text-gray-500 dark:text-gray-400' },
                  new Date(task.startTime).toLocaleString()
                )
              )
            ),
            React.createElement('div', { className: 'flex items-center space-x-2' },
              React.createElement('span', { className: 'text-xs text-gray-500 dark:text-gray-400' },
                `${task.executionTime}ms`
              ),
              task.status === 'completed' ? 
                React.createElement(CheckCircle, { className: 'w-4 h-4 text-green-500' }) :
                task.status === 'failed' ?
                  React.createElement(XCircle, { className: 'w-4 h-4 text-red-500' }) :
                  React.createElement(Clock, { className: 'w-4 h-4 text-yellow-500' })
            )
          )
        ),
        tasks.length === 0 && React.createElement('div', { className: 'text-center py-8 text-gray-500 dark:text-gray-400' },
          React.createElement(Activity, { className: 'w-12 h-12 mx-auto mb-4 opacity-50' }),
          React.createElement('p', null, 'No tasks executed yet'),
          React.createElement('p', { className: 'text-sm' }, 'Execute a task to see it here')
        )
      )
    )
  );
};

export default Dashboard; 