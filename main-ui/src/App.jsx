// App.jsx
// 
// Description: Main App component for the Super VM Dashboard
// 
// This component provides the main layout and routing for the Super VM dashboard,
// including navigation, sidebar, and main content area. It manages the overall
// application state and provides context for child components.
// 
// Features:
//   - Responsive layout with sidebar navigation
//   - Route-based component rendering
//   - Global state management
//   - Real-time data updates
//   - Theme and styling management
// 
// Inputs: None (uses internal state and context)
// Outputs: 
//   - Rendered dashboard interface
//   - Navigation and routing
//   - Global application state
// 
// Dependencies: 
//   - React Router for navigation
//   - Tailwind CSS for styling
//   - Framer Motion for animations
//   - React Hot Toast for notifications

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import VMManager from './pages/VMManager';
import TaskManager from './pages/TaskManager';
import ResourceMonitor from './pages/ResourceMonitor';
import Settings from './pages/Settings';
import ProcessManager from './components/ProcessManager';
import NetworkMonitor from './components/NetworkMonitor';
import LoadingSpinner from './components/LoadingSpinner';

// Context
import { SuperVMProvider } from './context/SuperVMContext';

// Hooks
import { useSuperVM } from './hooks/useSuperVM';

// Styles
import './styles.css';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    return <LoadingSpinner />;
  }

  return (
    <SuperVMProvider>
      <Router>
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 ${theme}`}>
          {/* Sidebar */}
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
          
          {/* Main Content */}
          <div className="lg:pl-64">
            {/* Header */}
            <Header 
              onMenuClick={() => setSidebarOpen(true)}
              theme={theme}
              onThemeToggle={toggleTheme}
            />
            
            {/* Page Content */}
            <main className="p-6">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/process-manager" element={<ProcessManager />} />
                  <Route path="/vm-manager" element={<VMManager />} />
                  <Route path="/network-monitor" element={<NetworkMonitor />} />
                  <Route path="/resource-monitor" element={<ResourceMonitor />} />
                  <Route path="/task-manager" element={<TaskManager />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: theme === 'dark' ? '#374151' : '#ffffff',
                color: theme === 'dark' ? '#ffffff' : '#000000',
                border: `1px solid ${theme === 'dark' ? '#4B5563' : '#E5E7EB'}`,
              },
            }}
          />
        </div>
      </Router>
    </SuperVMProvider>
  );
};

export default App; 