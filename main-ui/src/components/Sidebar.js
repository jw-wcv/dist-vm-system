// Sidebar.jsx
import React, { useState } from 'react';
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
  Database,
  HardDrive,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Key
} from 'lucide-react';
import { useSuperVM } from '../context/SuperVMContext.js';
import { useWeb3 } from '../context/Web3Context.js';

const Sidebar = ({ isOpen, onClose }) => {
  console.log('Sidebar rendering with isOpen:', isOpen);
  const location = useLocation();
  const [isCreatingVM, setIsCreatingVM] = useState(false);
  const { 
    systemStatus, 
    isConnected, 
    resourcePool, 
    activeNodes,
    actions 
  } = useSuperVM();

  const { 
    isConnected: walletConnected, 
    walletInfo, 
    connectionType,
    actions: web3Actions 
  } = useWeb3();

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
      name: 'SSH Keys',
      href: '/ssh-keys',
      icon: Key,
      description: 'Manage SSH keys for VM access'
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
      icon: Database,
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
        return React.createElement('div', { className: 'w-2 h-2 bg-green-500 rounded-full animate-pulse' });
      case 'starting':
        return React.createElement('div', { className: 'w-2 h-2 bg-yellow-500 rounded-full animate-pulse' });
      case 'error':
        return React.createElement('div', { className: 'w-2 h-2 bg-red-500 rounded-full' });
      default:
        return React.createElement('div', { className: 'w-2 h-2 bg-gray-500 rounded-full' });
    }
  };

  // Create VM with wallet
  const handleAddNode = async () => {
    if (!walletConnected || !walletInfo?.address) {
      alert('Please connect your wallet first to create VMs');
      return;
    }

    setIsCreatingVM(true);
    try {
      // Get wallet credentials using the new function
      const credentials = await web3Actions.getWalletCredentials();
      
      // Create VM with default configuration
      const vmConfig = {
        name: `Worker-Node-${Date.now()}`,
        vcpus: 4,
        memory: 8192,
        storage: 80,
        image: 'aleph/node'
      };

      // Call the API with the appropriate method
      const response = await fetch('http://localhost:3000/api/vms/create-with-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: credentials.walletAddress,
          privateKey: credentials.privateKey,
          signature: credentials.signature,
          message: credentials.message,
          method: credentials.method,
          vmConfig: vmConfig,
          paymentMethod: 'aleph'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create VM');
      }

      const result = await response.json();
      console.log('VM created successfully:', result);
      alert(`VM created successfully! ID: ${result.item_hash}`);
      
    } catch (error) {
      console.error('Failed to create VM:', error);
      alert(`Failed to create VM: ${error.message}`);
    } finally {
      setIsCreatingVM(false);
    }
  };

  return React.createElement(React.Fragment, null,
    React.createElement(AnimatePresence, null,
      isOpen && React.createElement(motion.div, {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: 'fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden',
        onClick: onClose
      })
    ),
    React.createElement('div', {
      className: `fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex-shrink-0 sidebar-desktop`,
      style: { transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }
    },
      React.createElement('div', { className: 'flex flex-col h-full' },
        React.createElement('div', { className: 'flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700' },
          React.createElement('div', { className: 'flex items-center space-x-3' },
            React.createElement('div', { className: 'w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center' },
              React.createElement(Zap, { className: 'w-5 h-5 text-white' })
            ),
            React.createElement('div', null,
              React.createElement('h1', { className: 'text-lg font-bold text-gray-900 dark:text-white' }, 'Orchestra'),
              React.createElement('p', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Dashboard')
            )
          ),
          React.createElement('button', {
            onClick: onClose,
            className: 'lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
          },
            React.createElement(X, { className: 'w-5 h-5' })
          )
        ),
        React.createElement('div', { className: 'p-6 border-b border-gray-200 dark:border-gray-700' },
          React.createElement('div', { className: 'flex items-center justify-between mb-4' },
            React.createElement('h2', { className: 'text-sm font-medium text-gray-900 dark:text-white' }, 'System Status'),
            getStatusIcon(systemStatus)
          ),
          React.createElement('div', { className: 'space-y-3' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('span', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Status'),
              React.createElement('span', { className: `text-sm font-medium ${getStatusColor(systemStatus)}` }, systemStatus)
            ),
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('span', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Connection'),
              React.createElement('span', { className: `text-sm font-medium ${isConnected ? 'text-green-500' : 'text-red-500'}` },
                isConnected ? 'Connected' : 'Disconnected'
              )
            ),
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('span', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Active Nodes'),
              React.createElement('span', { className: 'text-sm font-medium text-gray-900 dark:text-white' }, activeNodes)
            )
          )
        ),
        React.createElement('div', { className: 'p-6 border-b border-gray-200 dark:border-gray-700' },
          React.createElement('h2', { className: 'text-sm font-medium text-gray-900 dark:text-white mb-4' }, 'Quick Actions'),
          React.createElement('div', { className: 'space-y-2' },
            React.createElement('button', {
              onClick: handleAddNode,
              disabled: isCreatingVM || !walletConnected,
              className: `w-full flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isCreatingVM || !walletConnected
                  ? 'text-gray-400 bg-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                  : 'text-white bg-blue-600 hover:bg-blue-700'
              }`
            },
              isCreatingVM ? 
                React.createElement(React.Fragment, null,
                  React.createElement('div', { className: 'w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin' }),
                  'Creating VM...'
                ) :
                React.createElement(React.Fragment, null,
                  React.createElement(Plus, { className: 'w-4 h-4 mr-2' }),
                  walletConnected ? 'Create VM' : 'Connect Wallet First'
                )
            ),
            React.createElement('button', {
              onClick: () => actions.scaleSystem(-1),
              className: 'w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors'
            },
              React.createElement(Minus, { className: 'w-4 h-4 mr-2' }),
              'Remove Node'
            )
          )
        ),
        React.createElement('nav', { className: 'flex-1 p-6' },
          React.createElement('h2', { className: 'text-sm font-medium text-gray-900 dark:text-white mb-4' }, 'Navigation'),
          React.createElement('ul', { className: 'space-y-2' },
            navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return React.createElement('li', { key: item.name },
                React.createElement(NavLink, {
                  to: item.href,
                  className: `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                  }`,
                  onClick: onClose
                },
                  React.createElement(item.icon, { className: `w-5 h-5 mr-3 ${
                    isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }` }),
                  item.name
                )
              );
            })
          )
        ),
        React.createElement('div', { className: 'p-6 border-t border-gray-200 dark:border-gray-700' },
          React.createElement('h2', { className: 'text-sm font-medium text-gray-900 dark:text-white mb-4' }, 'Resource Summary'),
          React.createElement('div', { className: 'space-y-3' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('div', { className: 'flex items-center' },
                React.createElement(Cpu, { className: 'w-4 h-4 text-gray-400 mr-2' }),
                React.createElement('span', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'CPU')
              ),
              React.createElement('span', { className: 'text-sm font-medium text-gray-900 dark:text-white' },
                `${(resourcePool.utilization?.cpu || 0).toFixed(1)}%`
              )
            ),
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('div', { className: 'flex items-center' },
                React.createElement(Database, { className: 'w-4 h-4 text-gray-400 mr-2' }),
                React.createElement('span', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'Memory')
              ),
              React.createElement('span', { className: 'text-sm font-medium text-gray-900 dark:text-white' },
                `${(resourcePool.utilization?.memory || 0).toFixed(1)}%`
              )
            ),
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('div', { className: 'flex items-center' },
                React.createElement(HardDrive, { className: 'w-4 h-4 text-gray-400 mr-2' }),
                React.createElement('span', { className: 'text-sm text-gray-500 dark:text-gray-400' }, 'GPU')
              ),
              React.createElement('span', { className: 'text-sm font-medium text-gray-900 dark:text-white' },
                `${(resourcePool.utilization?.gpu || 0).toFixed(1)}%`
              )
            )
          )
        )
      )
    )
  );
};

export default Sidebar; 