// SystemTray.jsx
//
// Description: System Tray Component for VM OS Management Panel
//
// This component provides a system tray interface similar to an operating system,
// showing system notifications, quick actions, and real-time status indicators.
//
// Features:
//   - System notifications
//   - Quick action buttons
//   - Real-time status indicators
//   - Notification history
//   - System alerts
//   - Time and date display
//
// Inputs: System data from SuperVM context
// Outputs: System tray interface with notifications
//
// Dependencies:
//   - Lucide React for icons
//   - Tailwind CSS for styling
//   - Framer Motion for animations

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Wifi, 
  WifiOff, 
  Server, 
  Activity, 
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Power,
  RefreshCw,
  X,
  Volume2,
  VolumeX,
  Battery,
  BatteryCharging,
  Sun,
  Moon,
  MoreHorizontal
} from 'lucide-react';
import { useSuperVM } from '../hooks/useSuperVM';

const SystemTray = () => {
  const { 
    systemStatus, 
    isConnected, 
    nodes, 
    tasks, 
    actions 
  } = useSuperVM();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMuted, setIsMuted] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Sample notifications
  const sampleNotifications = [
    {
      id: 1,
      type: 'info',
      title: 'System Update',
      message: 'System is running optimally',
      time: new Date(Date.now() - 300000), // 5 minutes ago
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'High CPU Usage',
      message: 'CPU usage is above 80%',
      time: new Date(Date.now() - 600000), // 10 minutes ago
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Task Completed',
      message: 'Rendering task completed successfully',
      time: new Date(Date.now() - 900000), // 15 minutes ago
      read: true
    }
  ];

  const systemIndicators = [
    {
      name: 'Network',
      status: isConnected,
      icon: isConnected ? Wifi : WifiOff,
      color: isConnected ? 'text-green-500' : 'text-red-500',
      bgColor: isConnected ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
    },
    {
      name: 'System',
      status: systemStatus === 'ready',
      icon: systemStatus === 'ready' ? CheckCircle : AlertCircle,
      color: systemStatus === 'ready' ? 'text-green-500' : 'text-yellow-500',
      bgColor: systemStatus === 'ready' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      name: 'Nodes',
      status: nodes.length > 0,
      icon: Server,
      color: nodes.length > 0 ? 'text-blue-500' : 'text-gray-500',
      bgColor: nodes.length > 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-900/20'
    }
  ];

  const quickActions = [
    {
      name: 'Refresh System',
      icon: RefreshCw,
      action: () => actions.refreshData(),
      color: 'text-blue-600'
    },
    {
      name: 'System Settings',
      icon: Settings,
      action: () => console.log('Open settings'),
      color: 'text-gray-600'
    },
    {
      name: 'Emergency Stop',
      icon: Power,
      action: () => console.log('Emergency stop'),
      color: 'text-red-600'
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertCircle;
      case 'error':
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'error':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ago`;
    }
    return `${minutes}m ago`;
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="relative">
      {/* System Tray Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
      >
        <Bell className="w-4 h-4" />
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </button>

      {/* System Tray Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">System Tray</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {currentTime.toLocaleTimeString()}
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* System Indicators */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                System Status
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {systemIndicators.map((indicator) => (
                  <div
                    key={indicator.name}
                    className={`flex flex-col items-center p-2 rounded-lg ${indicator.bgColor}`}
                  >
                    <indicator.icon className={`w-4 h-4 ${indicator.color} mb-1`} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {indicator.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Quick Actions
              </h4>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    onClick={() => {
                      action.action();
                      setIsOpen(false);
                    }}
                    className="flex items-center w-full p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                  >
                    <action.icon className={`w-4 h-4 mr-3 ${action.color}`} />
                    {action.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Notifications
                </h4>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              {sampleNotifications.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {sampleNotifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-lg border-l-4 ${getNotificationColor(notification.type)} ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start">
                          <Icon className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {formatTime(notification.time)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Active Nodes: {nodes.length}</span>
                <span>Tasks: {tasks.length}</span>
                <span>{currentTime.toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SystemTray; 