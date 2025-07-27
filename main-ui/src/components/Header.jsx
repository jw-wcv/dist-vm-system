// Header.jsx
// 
// Description: Header component for Super VM Dashboard
// 
// This component provides the top navigation bar with menu controls, theme
// toggle, system status indicators, and user actions.
// 
// Features:
//   - Mobile menu toggle
//   - Theme switching (dark/light mode)
//   - System status indicators
//   - Real-time connection status
//   - User notifications
// 
// Inputs: 
//   - Menu toggle callback
//   - Theme state and toggle
//   - System status from context
// Outputs: 
//   - Header rendering with controls
//   - Theme changes
//   - Menu interactions
// 
// Dependencies: 
//   - Lucide React for icons
//   - Tailwind CSS for styling
//   - Framer Motion for animations

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Sun, 
  Moon, 
  Wifi, 
  WifiOff, 
  Bell,
  RefreshCw,
  Zap
} from 'lucide-react';
import { useSuperVM } from '../hooks/useSuperVM';
import SystemTray from './SystemTray';

const Header = ({ onMenuClick, theme, onThemeToggle }) => {
  const { 
    isConnected, 
    systemStatus, 
    lastUpdate, 
    actions,
    isLoading 
  } = useSuperVM();

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

  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo and title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Super VM</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Distributed Computing Dashboard</p>
            </div>
          </div>
        </div>

        {/* Center - Status indicators */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Connection status */}
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* System status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              systemStatus === 'ready' ? 'bg-green-500' :
              systemStatus === 'starting' ? 'bg-yellow-500' :
              systemStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
            }`} />
            <span className={`text-sm font-medium ${getStatusColor(systemStatus)}`}>
              {systemStatus}
            </span>
          </div>

          {/* Last update */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Updated: {formatLastUpdate(lastUpdate)}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Refresh button */}
          <button
            onClick={actions.refreshData}
            disabled={isLoading}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh data"
          >
            <motion.div
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="w-5 h-5" />
            </motion.div>
          </button>

          {/* System Tray */}
          <SystemTray />

          {/* Theme toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile status bar */}
      <div className="md:hidden px-6 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {isConnected ? (
                <Wifi className="w-3 h-3 text-green-500" />
              ) : (
                <WifiOff className="w-3 h-3 text-red-500" />
              )}
              <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>
            <span className={`${getStatusColor(systemStatus)}`}>
              {systemStatus}
            </span>
          </div>
          <span className="text-gray-500">
            {formatLastUpdate(lastUpdate)}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header; 