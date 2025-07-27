// Dashboard.jsx
// 
// Description: Main Dashboard page for Super VM system overview
// 
// This component provides a comprehensive overview of the Super VM system,
// including resource utilization, performance metrics, recent tasks, and
// quick action buttons for common operations.
// 
// Features:
//   - Real-time resource monitoring
//   - Performance metrics visualization
//   - Recent task history
//   - Quick action buttons
//   - System health indicators
//   - Responsive layout
// 
// Inputs: 
//   - System data from Super VM context
//   - User interactions for task execution
// Outputs: 
//   - Dashboard rendering with metrics
//   - Task execution results
//   - System status updates
// 
// Dependencies: 
//   - Recharts for data visualization
//   - Lucide React for icons
//   - Tailwind CSS for styling
//   - Framer Motion for animations

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
import { useSuperVM } from '../hooks/useSuperVM';
import SystemOverview from '../components/SystemOverview';

const Dashboard = () => {
  const { 
    resourcePool, 
    performanceMetrics, 
    tasks, 
    systemStatus, 
    isConnected,
    actions 
  } = useSuperVM();

  const [isExecutingTask, setIsExecutingTask] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Use the new SystemOverview component */}
      <SystemOverview />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Cpu className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CPU Utilization</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {resourcePool.utilization.cpu.toFixed(1)}%
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
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <Database className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Memory Usage</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {resourcePool.utilization.memory.toFixed(1)}%
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
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <HardDrive className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">GPU Usage</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {resourcePool.utilization.gpu.toFixed(1)}%
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
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks Executed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {performanceMetrics.totalTasksExecuted}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Utilization Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Resource Utilization
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={resourceHistory}>
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

        {/* Task Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Task Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
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
          <div className="flex justify-center space-x-4 mt-4">
            {taskDistribution.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              disabled={isExecutingTask}
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <action.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3 text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {action.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Tasks
        </h3>
        <div className="space-y-3">
          {tasks.slice(-5).reverse().map((task, index) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-1 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {task.type} Task
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(task.startTime).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {task.executionTime}ms
                </span>
                {task.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : task.status === 'failed' ? (
                  <XCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-500" />
                )}
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tasks executed yet</p>
              <p className="text-sm">Execute a task to see it here</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 