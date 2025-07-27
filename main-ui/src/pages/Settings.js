// Settings.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  RotateCcw, 
  Settings as SettingsIcon,
  Server,
  Network,
  Shield,
  Database,
  Monitor,
  Bell,
  Palette,
  Globe,
  Lock,
  Key,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Clock,
  Zap,
  Activity,
  HardDrive,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useSuperVM } from '../context/SuperVMContext.js';

const Settings = () => {
  const { actions } = useSuperVM();
  const [settings, setSettings] = useState({
    // System Settings
    autoRefresh: true,
    refreshInterval: 5000,
    theme: 'dark',
    language: 'en',
    
    // Network Settings
    apiEndpoint: 'http://localhost:3000',
    timeout: 30000,
    retryAttempts: 3,
    enableSSL: false,
    
    // Security Settings
    enableAuth: false,
    sessionTimeout: 3600,
    enableLogging: true,
    logLevel: 'info',
    
    // Performance Settings
    maxConcurrentTasks: 10,
    resourceThreshold: 80,
    enableAutoScaling: true,
    scalingThreshold: 70,
    
    // Notification Settings
    enableNotifications: true,
    emailNotifications: false,
    desktopNotifications: true,
    notificationSound: true,
    
    // Storage Settings
    enableBackup: true,
    backupInterval: 24,
    maxBackups: 7,
    compressionLevel: 'medium'
  });

  const [activeTab, setActiveTab] = useState('system');
  const [isSaving, setIsSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('super-vm-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('super-vm-settings', JSON.stringify(settings));
      
      // Apply settings to the system
      await actions.refreshData();
      
      // Show success message
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        autoRefresh: true,
        refreshInterval: 5000,
        theme: 'dark',
        language: 'en',
        apiEndpoint: 'http://localhost:3000',
        timeout: 30000,
        retryAttempts: 3,
        enableSSL: false,
        enableAuth: false,
        sessionTimeout: 3600,
        enableLogging: true,
        logLevel: 'info',
        maxConcurrentTasks: 10,
        resourceThreshold: 80,
        enableAutoScaling: true,
        scalingThreshold: 70,
        enableNotifications: true,
        emailNotifications: false,
        desktopNotifications: true,
        notificationSound: true,
        enableBackup: true,
        backupInterval: 24,
        maxBackups: 7,
        compressionLevel: 'medium'
      });
    }
  };

  const tabs = [
    { id: 'system', name: 'System', icon: SettingsIcon },
    { id: 'network', name: 'Network', icon: Network },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'performance', name: 'Performance', icon: Activity },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'storage', name: 'Storage', icon: Database }
  ];

  const renderSystemSettings = () => (
    React.createElement('div', { className: 'space-y-6' },
      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('h4', { className: 'text-lg font-medium text-gray-900 dark:text-white' }, 'General'),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'flex items-center' },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: settings.autoRefresh,
                  onChange: (e) => handleSettingChange('autoRefresh', e.target.checked),
                  className: 'rounded border-gray-300 dark:border-gray-600'
                }),
                React.createElement('span', { className: 'ml-2 text-sm text-gray-700 dark:text-gray-300' }, 'Auto Refresh')
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'Refresh Interval (ms)'),
              React.createElement('input', {
                type: 'number',
                value: settings.refreshInterval,
                onChange: (e) => handleSettingChange('refreshInterval', parseInt(e.target.value)),
                className: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'Theme'),
              React.createElement('select', {
                value: settings.theme,
                onChange: (e) => handleSettingChange('theme', e.target.value),
                className: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              },
                React.createElement('option', { value: 'light' }, 'Light'),
                React.createElement('option', { value: 'dark' }, 'Dark'),
                React.createElement('option', { value: 'auto' }, 'Auto')
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'Language'),
              React.createElement('select', {
                value: settings.language,
                onChange: (e) => handleSettingChange('language', e.target.value),
                className: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              },
                React.createElement('option', { value: 'en' }, 'English'),
                React.createElement('option', { value: 'es' }, 'Spanish'),
                React.createElement('option', { value: 'fr' }, 'French'),
                React.createElement('option', { value: 'de' }, 'German')
              )
            )
          )
        ),
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('h4', { className: 'text-lg font-medium text-gray-900 dark:text-white' }, 'Advanced'),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'flex items-center' },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: showAdvanced,
                  onChange: (e) => setShowAdvanced(e.target.checked),
                  className: 'rounded border-gray-300 dark:border-gray-600'
                }),
                React.createElement('span', { className: 'ml-2 text-sm text-gray-700 dark:text-gray-300' }, 'Show Advanced Settings')
              )
            ),
            showAdvanced && React.createElement('div', { className: 'space-y-4' },
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'Debug Mode'),
                React.createElement('input', {
                  type: 'checkbox',
                  className: 'rounded border-gray-300 dark:border-gray-600'
                })
              ),
              React.createElement('div', null,
                React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'Log Level'),
                React.createElement('select', {
                  value: settings.logLevel,
                  onChange: (e) => handleSettingChange('logLevel', e.target.value),
                  className: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                },
                  React.createElement('option', { value: 'error' }, 'Error'),
                  React.createElement('option', { value: 'warn' }, 'Warning'),
                  React.createElement('option', { value: 'info' }, 'Info'),
                  React.createElement('option', { value: 'debug' }, 'Debug')
                )
              )
            )
          )
        )
      )
    )
  );

  const renderNetworkSettings = () => (
    React.createElement('div', { className: 'space-y-6' },
      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('h4', { className: 'text-lg font-medium text-gray-900 dark:text-white' }, 'API Configuration'),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'API Endpoint'),
              React.createElement('input', {
                type: 'text',
                value: settings.apiEndpoint,
                onChange: (e) => handleSettingChange('apiEndpoint', e.target.value),
                className: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'Timeout (ms)'),
              React.createElement('input', {
                type: 'number',
                value: settings.timeout,
                onChange: (e) => handleSettingChange('timeout', parseInt(e.target.value)),
                className: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'Retry Attempts'),
              React.createElement('input', {
                type: 'number',
                value: settings.retryAttempts,
                onChange: (e) => handleSettingChange('retryAttempts', parseInt(e.target.value)),
                className: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              })
            )
          )
        ),
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('h4', { className: 'text-lg font-medium text-gray-900 dark:text-white' }, 'Security'),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'flex items-center' },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: settings.enableSSL,
                  onChange: (e) => handleSettingChange('enableSSL', e.target.checked),
                  className: 'rounded border-gray-300 dark:border-gray-600'
                }),
                React.createElement('span', { className: 'ml-2 text-sm text-gray-700 dark:text-gray-300' }, 'Enable SSL/TLS')
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'flex items-center' },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: settings.enableAuth,
                  onChange: (e) => handleSettingChange('enableAuth', e.target.checked),
                  className: 'rounded border-gray-300 dark:border-gray-600'
                }),
                React.createElement('span', { className: 'ml-2 text-sm text-gray-700 dark:text-gray-300' }, 'Enable Authentication')
              )
            )
          )
        )
      )
    )
  );

  const renderSecuritySettings = () => (
    React.createElement('div', { className: 'space-y-6' },
      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('h4', { className: 'text-lg font-medium text-gray-900 dark:text-white' }, 'Authentication'),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'Session Timeout (seconds)'),
              React.createElement('input', {
                type: 'number',
                value: settings.sessionTimeout,
                onChange: (e) => handleSettingChange('sessionTimeout', parseInt(e.target.value)),
                className: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'flex items-center' },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: settings.enableLogging,
                  onChange: (e) => handleSettingChange('enableLogging', e.target.checked),
                  className: 'rounded border-gray-300 dark:border-gray-600'
                }),
                React.createElement('span', { className: 'ml-2 text-sm text-gray-700 dark:text-gray-300' }, 'Enable Security Logging')
              )
            )
          )
        ),
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('h4', { className: 'text-lg font-medium text-gray-900 dark:text-white' }, 'Access Control'),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('button', {
              className: 'w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700'
            }, 'Manage API Keys'),
            React.createElement('button', {
              className: 'w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700'
            }, 'View Access Logs'),
            React.createElement('button', {
              className: 'w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30'
            }, 'Revoke All Sessions')
          )
        )
      )
    )
  );

  const renderPerformanceSettings = () => (
    React.createElement('div', { className: 'space-y-6' },
      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('h4', { className: 'text-lg font-medium text-gray-900 dark:text-white' }, 'Task Management'),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'Max Concurrent Tasks'),
              React.createElement('input', {
                type: 'number',
                value: settings.maxConcurrentTasks,
                onChange: (e) => handleSettingChange('maxConcurrentTasks', parseInt(e.target.value)),
                className: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'Resource Threshold (%)'),
              React.createElement('input', {
                type: 'number',
                value: settings.resourceThreshold,
                onChange: (e) => handleSettingChange('resourceThreshold', parseInt(e.target.value)),
                className: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              })
            )
          )
        ),
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('h4', { className: 'text-lg font-medium text-gray-900 dark:text-white' }, 'Auto Scaling'),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'flex items-center' },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: settings.enableAutoScaling,
                  onChange: (e) => handleSettingChange('enableAutoScaling', e.target.checked),
                  className: 'rounded border-gray-300 dark:border-gray-600'
                }),
                React.createElement('span', { className: 'ml-2 text-sm text-gray-700 dark:text-gray-300' }, 'Enable Auto Scaling')
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'Scaling Threshold (%)'),
              React.createElement('input', {
                type: 'number',
                value: settings.scalingThreshold,
                onChange: (e) => handleSettingChange('scalingThreshold', parseInt(e.target.value)),
                className: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              })
            )
          )
        )
      )
    )
  );

  const renderNotificationSettings = () => (
    React.createElement('div', { className: 'space-y-6' },
      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('h4', { className: 'text-lg font-medium text-gray-900 dark:text-white' }, 'General Notifications'),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'flex items-center' },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: settings.enableNotifications,
                  onChange: (e) => handleSettingChange('enableNotifications', e.target.checked),
                  className: 'rounded border-gray-300 dark:border-gray-600'
                }),
                React.createElement('span', { className: 'ml-2 text-sm text-gray-700 dark:text-gray-300' }, 'Enable Notifications')
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'flex items-center' },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: settings.desktopNotifications,
                  onChange: (e) => handleSettingChange('desktopNotifications', e.target.checked),
                  className: 'rounded border-gray-300 dark:border-gray-600'
                }),
                React.createElement('span', { className: 'ml-2 text-sm text-gray-700 dark:text-gray-300' }, 'Desktop Notifications')
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'flex items-center' },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: settings.notificationSound,
                  onChange: (e) => handleSettingChange('notificationSound', e.target.checked),
                  className: 'rounded border-gray-300 dark:border-gray-600'
                }),
                React.createElement('span', { className: 'ml-2 text-sm text-gray-700 dark:text-gray-300' }, 'Notification Sound')
              )
            )
          )
        ),
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('h4', { className: 'text-lg font-medium text-gray-900 dark:text-white' }, 'Email Notifications'),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'flex items-center' },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: settings.emailNotifications,
                  onChange: (e) => handleSettingChange('emailNotifications', e.target.checked),
                  className: 'rounded border-gray-300 dark:border-gray-600'
                }),
                React.createElement('span', { className: 'ml-2 text-sm text-gray-700 dark:text-gray-300' }, 'Email Notifications')
              )
            ),
            settings.emailNotifications && React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'Email Address'),
              React.createElement('input', {
                type: 'email',
                placeholder: 'your@email.com',
                className: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              })
            )
          )
        )
      )
    )
  );

  const renderStorageSettings = () => (
    React.createElement('div', { className: 'space-y-6' },
      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('h4', { className: 'text-lg font-medium text-gray-900 dark:text-white' }, 'Backup Settings'),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'flex items-center' },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: settings.enableBackup,
                  onChange: (e) => handleSettingChange('enableBackup', e.target.checked),
                  className: 'rounded border-gray-300 dark:border-gray-600'
                }),
                React.createElement('span', { className: 'ml-2 text-sm text-gray-700 dark:text-gray-300' }, 'Enable Auto Backup')
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'Backup Interval (hours)'),
              React.createElement('input', {
                type: 'number',
                value: settings.backupInterval,
                onChange: (e) => handleSettingChange('backupInterval', parseInt(e.target.value)),
                className: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'Max Backups'),
              React.createElement('input', {
                type: 'number',
                value: settings.maxBackups,
                onChange: (e) => handleSettingChange('maxBackups', parseInt(e.target.value)),
                className: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              })
            )
          )
        ),
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('h4', { className: 'text-lg font-medium text-gray-900 dark:text-white' }, 'Storage Management'),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'Compression Level'),
              React.createElement('select', {
                value: settings.compressionLevel,
                onChange: (e) => handleSettingChange('compressionLevel', e.target.value),
                className: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              },
                React.createElement('option', { value: 'low' }, 'Low'),
                React.createElement('option', { value: 'medium' }, 'Medium'),
                React.createElement('option', { value: 'high' }, 'High')
              )
            ),
            React.createElement('button', {
              className: 'w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700'
            }, 'Clean Old Backups'),
            React.createElement('button', {
              className: 'w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30'
            }, 'Create Manual Backup')
          )
        )
      )
    )
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'system':
        return renderSystemSettings();
      case 'network':
        return renderNetworkSettings();
      case 'security':
        return renderSecuritySettings();
      case 'performance':
        return renderPerformanceSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'storage':
        return renderStorageSettings();
      default:
        return renderSystemSettings();
    }
  };

  return React.createElement('div', { className: 'space-y-6' },
    React.createElement('div', { className: 'flex items-center justify-between' },
      React.createElement('div', null,
        React.createElement('h1', { className: 'text-2xl font-bold text-gray-900 dark:text-white' }, 'Settings'),
        React.createElement('p', { className: 'text-gray-500 dark:text-gray-400' },
          'Configure system preferences and behavior'
        )
      ),
      React.createElement('div', { className: 'flex items-center space-x-2' },
        React.createElement('button', {
          onClick: handleReset,
          className: 'flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700'
        },
          React.createElement(RotateCcw, { className: 'w-4 h-4 mr-2' }),
          'Reset'
        ),
        React.createElement('button', {
          onClick: handleSave,
          disabled: isSaving,
          className: 'flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
        },
          isSaving ? React.createElement(RefreshCw, { className: 'w-4 h-4 mr-2 animate-spin' }) : React.createElement(Save, { className: 'w-4 h-4 mr-2' }),
          isSaving ? 'Saving...' : 'Save Changes'
        )
      )
    ),
    React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700' },
      React.createElement('div', { className: 'border-b border-gray-200 dark:border-gray-700' },
        React.createElement('nav', { className: 'flex space-x-8 px-6' },
          tabs.map((tab) => {
            const TabIcon = tab.icon;
            return React.createElement('button', {
              key: tab.id,
              onClick: () => setActiveTab(tab.id),
              className: `flex items-center px-1 py-4 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`
            },
              React.createElement(TabIcon, { className: 'w-4 h-4 mr-2' }),
              tab.name
            );
          })
        )
      ),
      React.createElement('div', { className: 'p-6' },
        renderTabContent()
      )
    )
  );
};

export default Settings; 