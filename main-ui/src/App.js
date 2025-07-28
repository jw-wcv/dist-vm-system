// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Sidebar from './components/Sidebar.js';
import Header from './components/Header.js';
import Dashboard from './pages/Dashboard.js';
import VMManager from './pages/VMManager.js';
import SSHKeys from './pages/SSHKeys.js';
import TaskManager from './pages/TaskManager.js';
import ResourceMonitor from './pages/ResourceMonitor.js';
import Settings from './pages/Settings.js';
import ProcessManager from './components/ProcessManager.js';
import NetworkMonitor from './components/NetworkMonitor.js';
import LoadingSpinner from './components/LoadingSpinner.js';

// Context
import { SuperVMProvider } from './context/SuperVMContext.js';
import { Web3Provider } from './context/Web3Context.js';

// Hooks
import { useSuperVM } from './context/SuperVMContext.js';

// Styles
import './styles.css';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('dark');

  // Initialize app
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('super-vm-theme') || 'dark';
    setTheme(savedTheme);
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    
    // Simulate loading time
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Handle theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('super-vm-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (isLoading) {
    return React.createElement(LoadingSpinner);
  }

  console.log('App rendering with theme:', theme);

  return React.createElement(Web3Provider, null,
    React.createElement(SuperVMProvider, null,
      React.createElement(Router, { 
        future: {
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }
      },
      React.createElement('div', { className: `min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${theme} flex overflow-hidden` },
        React.createElement(Sidebar, { 
          isOpen: sidebarOpen, 
          onClose: () => setSidebarOpen(false) 
        }),
        React.createElement('div', { className: 'flex-1' },
          React.createElement(Header, { 
            onMenuClick: () => setSidebarOpen(true),
            theme: theme,
            onThemeToggle: toggleTheme
          }),
          React.createElement('main', { className: 'p-4 w-full' },
            React.createElement(AnimatePresence, { mode: 'wait' },
              React.createElement(Routes, null,
                React.createElement(Route, { path: '/', element: React.createElement(Navigate, { to: '/dashboard', replace: true }) }),
                React.createElement(Route, { path: '/index.html', element: React.createElement(Navigate, { to: '/dashboard', replace: true }) }),
                React.createElement(Route, { path: '/dashboard', element: React.createElement(Dashboard) }),
                React.createElement(Route, { path: '/process-manager', element: React.createElement(ProcessManager) }),
                React.createElement(Route, { path: '/vm-manager', element: React.createElement(VMManager) }),
                React.createElement(Route, { path: '/ssh-keys', element: React.createElement(SSHKeys) }),
                React.createElement(Route, { path: '/network-monitor', element: React.createElement(NetworkMonitor) }),
                React.createElement(Route, { path: '/resource-monitor', element: React.createElement(ResourceMonitor) }),
                React.createElement(Route, { path: '/task-manager', element: React.createElement(TaskManager) }),
                React.createElement(Route, { path: '/settings', element: React.createElement(Settings) }),
                React.createElement(Route, { path: '*', element: React.createElement(Navigate, { to: '/dashboard', replace: true }) })
              )
            )
          )
        ),
        React.createElement(Toaster, {
          position: 'top-right',
          toastOptions: {
            duration: 4000,
            style: {
              background: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000',
              border: `1px solid ${theme === 'dark' ? '#4B5563' : '#E5E7EB'}`,
            },
          },
        }        )
      )
    )
  )
  );
};

export default App; 