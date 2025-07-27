// Header.js
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
import { useSuperVM } from '../context/SuperVMContext.js';
import SystemTray from './SystemTray.js';

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

  return React.createElement('header', { className: 'bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700' },
    React.createElement('div', { className: 'flex items-center justify-between px-6 py-4' },
      React.createElement('div', { className: 'flex items-center space-x-4' },
        React.createElement('button', {
          onClick: onMenuClick,
          className: 'lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
        },
          React.createElement(Menu, { className: 'w-6 h-6' })
        ),
        React.createElement('div', { className: 'flex items-center space-x-3' },
          React.createElement('div', { className: 'w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center' },
            React.createElement(Zap, { className: 'w-5 h-5 text-white' })
          ),
          React.createElement('div', { className: 'hidden sm:block' },
            React.createElement('h1', { className: 'text-xl font-bold text-gray-900 dark:text-white' }, 'Orchestra'),
            React.createElement('p', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Distributed Computing Dashboard')
          )
        )
      ),
      React.createElement('div', { className: 'hidden md:flex items-center space-x-6' },
        React.createElement('div', { className: 'flex items-center space-x-2' },
          isConnected ? React.createElement(Wifi, { className: 'w-4 h-4 text-green-500' }) : React.createElement(WifiOff, { className: 'w-4 h-4 text-red-500' }),
          React.createElement('span', { className: `text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}` },
            isConnected ? 'Connected' : 'Disconnected'
          )
        ),
        React.createElement('div', { className: 'flex items-center space-x-2' },
          React.createElement('div', { className: `w-2 h-2 rounded-full ${
            systemStatus === 'ready' ? 'bg-green-500' :
            systemStatus === 'starting' ? 'bg-yellow-500' :
            systemStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
          }` }),
          React.createElement('span', { className: `text-sm font-medium ${getStatusColor(systemStatus)}` }, systemStatus)
        ),
        React.createElement('div', { className: 'text-sm text-gray-500 dark:text-gray-400' },
          `Updated: ${formatLastUpdate(lastUpdate)}`
        )
      ),
      React.createElement('div', { className: 'flex items-center space-x-4' },
        React.createElement('button', {
          onClick: actions.refreshData,
          disabled: isLoading,
          className: 'p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed',
          title: 'Refresh data'
        },
          React.createElement(motion.div, {
            animate: { rotate: isLoading ? 360 : 0 },
            transition: { duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }
          },
            React.createElement(RefreshCw, { className: 'w-5 h-5' })
          )
        ),
        React.createElement(SystemTray),
        React.createElement('button', {
          onClick: onThemeToggle,
          className: 'p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700',
          title: `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`
        },
          theme === 'dark' ? React.createElement(Sun, { className: 'w-5 h-5' }) : React.createElement(Moon, { className: 'w-5 h-5' })
        )
      )
    ),
    React.createElement('div', { className: 'md:hidden px-6 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700' },
      React.createElement('div', { className: 'flex items-center justify-between text-sm' },
        React.createElement('div', { className: 'flex items-center space-x-4' },
          React.createElement('div', { className: 'flex items-center space-x-1' },
            isConnected ? React.createElement(Wifi, { className: 'w-3 h-3 text-green-500' }) : React.createElement(WifiOff, { className: 'w-3 h-3 text-red-500' }),
            React.createElement('span', { className: isConnected ? 'text-green-600' : 'text-red-600' },
              isConnected ? 'Online' : 'Offline'
            )
          ),
          React.createElement('span', { className: getStatusColor(systemStatus) }, systemStatus)
        ),
        React.createElement('span', { className: 'text-gray-500' }, formatLastUpdate(lastUpdate))
      )
    )
  );
};

export default Header; 