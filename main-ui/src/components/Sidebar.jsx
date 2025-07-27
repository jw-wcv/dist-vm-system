// Sidebar.jsx
// 
// Description: Sidebar navigation component for Super VM Dashboard
// 
// This component provides the main navigation sidebar with links to different
// sections of the dashboard, including system status indicators and quick
// action buttons.
// 
// Features:
//   - Responsive navigation menu
//   - System status indicators
//   - Quick action buttons
//   - Collapsible on mobile
//   - Active route highlighting
// 
// Inputs: 
//   - Navigation state and callbacks
//   - System status from context
// Outputs: 
//   - Navigation menu rendering
//   - Status indicators
//   - User interactions
// 
// Dependencies: 
//   - React Router for navigation
//   - Lucide React for icons
//   - Tailwind CSS for styling
//   - Framer Motion for animations

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Server, 
  Activity, 
  Settings, 
  X,
  Play,
  Square,
  Plus,
  Minus,
  Zap,
  Cpu,
  Memory,
  HardDrive
} from 'lucide-react';
import { useSuperVM } from '../context/SuperVMContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { 
    systemStatus, 
    isConnected, 
    resourcePool, 
    activeNodes,
    actions 
  } = useSuperVM();

  const navigation = [
    {
      name: 'System Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'OS-like system overview'
    },
    {
      name: 'Process Manager',
      href: '/process-manager',
      icon: Activity,
      description: 'Task manager for processes'
    },
    {
      name: 'VM Manager',
      href: '/vm-manager',
      icon: Server,
      description: 'Manage virtual machines'
    },
    {
      name: 'Network Monitor',
      href: '/network-monitor',
      icon: Cpu,
      description: 'Network connectivity & traffic'
    },
    {
      name: 'Resource Monitor',
      href: '/resource-monitor',
      icon: Memory,
      description: 'Real-time resource monitoring'
    },
    {
      name: 'Task Manager',
      href: '/task-manager',
      icon: HardDrive,
      description: 'Monitor and manage tasks'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'System configuration'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return 'text-green-500';
      case 'starting':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready':
        return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />;
      case 'starting':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 20 }}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Super VM</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dashboard</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* System Status */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-900 dark:text-white">System Status</h2>
              {getStatusIcon(systemStatus)}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                <span className={`text-sm font-medium ${getStatusColor(systemStatus)}`}>
                  {systemStatus}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Connection</span>
                <span className={`text-sm font-medium ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Active Nodes</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {activeNodes}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => actions.scaleSystem(1)}
                className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Node
              </button>
              <button
                onClick={() => actions.scaleSystem(-1)}
                className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                <Minus className="w-4 h-4 mr-2" />
                Remove Node
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Navigation</h2>
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                      }`}
                      onClick={onClose}
                    >
                      <item.icon className={`w-5 h-5 mr-3 ${
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`} />
                      {item.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Resource Summary */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Resource Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Cpu className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">CPU</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {resourcePool.utilization.cpu.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Memory className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Memory</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {resourcePool.utilization.memory.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HardDrive className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">GPU</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {resourcePool.utilization.gpu.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar; 