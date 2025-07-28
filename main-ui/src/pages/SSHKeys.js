// SSHKeys.js
// 
// Description: SSH Key management page for the Super VM dashboard
// 
// This component provides a comprehensive interface for managing SSH keys
// used for VM access. It leverages the existing SSH key management system
// in the config/keys directory and provides a user-friendly interface.
// 
// Features:
//   - View all available SSH keys
//   - Generate new SSH keys
//   - Set active SSH key for VM creation
//   - View key details and validation status
//   - Delete SSH keys (with confirmation)
// 
// Inputs: None (fetches data from backend API)
// Outputs: SSH key management interface with CRUD operations

import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Plus, 
  Trash2, 
  Copy, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';

const SSHKeys = () => {
  const [sshKeys, setSshKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [showPrivateKey, setShowPrivateKey] = useState({});
  const [error, setError] = useState(null);

  // Fetch SSH keys from backend
  const fetchSSHKeys = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/ssh-keys');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch SSH keys: ${response.status}`);
      }
      
      const data = await response.json();
      setSshKeys(data.keys || []);
      
      // Set the first valid key as active if none is set
      if (!activeKey && data.keys && data.keys.length > 0) {
        setActiveKey(data.keys[0].name);
      }
      
    } catch (error) {
      console.error('Error fetching SSH keys:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate new SSH key
  const generateSSHKey = async (keyName = '') => {
    try {
      setGenerating(true);
      setError(null);
      
      const name = keyName || `ssh-key-${Date.now()}`;
      
      const response = await fetch('http://localhost:3000/api/ssh-keys/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyName: name })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate SSH key');
      }
      
      const result = await response.json();
      console.log('SSH key generated successfully:', result);
      
      // Refresh the keys list
      await fetchSSHKeys();
      
      // Set the newly generated key as active
      setActiveKey(name);
      
      alert(`SSH key '${name}' generated successfully!`);
      
    } catch (error) {
      console.error('Error generating SSH key:', error);
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  };

  // Copy SSH key to clipboard
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${type} copied to clipboard!`);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard. Please copy manually.');
    }
  };

  // Toggle private key visibility
  const togglePrivateKeyVisibility = (keyName) => {
    setShowPrivateKey(prev => ({
      ...prev,
      [keyName]: !prev[keyName]
    }));
  };

  // Set active SSH key
  const setActiveSSHKey = (keyName) => {
    setActiveKey(keyName);
    // Store in localStorage for persistence
    localStorage.setItem('activeSSHKey', keyName);
  };

  // Download SSH key
  const downloadSSHKey = (keyName, keyType, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${keyName}_${keyType}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Delete SSH key
  const deleteSSHKey = async (keyName) => {
    if (!confirm(`Are you sure you want to delete SSH key '${keyName}'? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setError(null);
      
      const response = await fetch(`http://localhost:3000/api/ssh-keys/${encodeURIComponent(keyName)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete SSH key');
      }
      
      const result = await response.json();
      console.log('SSH key deleted successfully:', result);
      
      // Remove the key from the active key if it was deleted
      if (activeKey === keyName) {
        setActiveKey(null);
        localStorage.removeItem('activeSSHKey');
      }
      
      // Refresh the keys list
      await fetchSSHKeys();
      
      alert(`SSH key '${keyName}' deleted successfully!`);
      
    } catch (error) {
      console.error('Error deleting SSH key:', error);
      setError(error.message);
    }
  };

  // Load active key from localStorage on component mount
  useEffect(() => {
    const savedActiveKey = localStorage.getItem('activeSSHKey');
    if (savedActiveKey) {
      setActiveKey(savedActiveKey);
    }
  }, []);

  // Fetch SSH keys on component mount
  useEffect(() => {
    fetchSSHKeys();
  }, []);

  if (loading) {
    return React.createElement('div', { className: 'flex items-center justify-center h-64' },
      React.createElement('div', { className: 'flex items-center space-x-2' },
        React.createElement(RefreshCw, { className: 'w-5 h-5 animate-spin text-blue-500' }),
        React.createElement('span', { className: 'text-gray-600' }, 'Loading SSH keys...')
      )
    );
  }

  return React.createElement('div', { className: 'p-6' },
    // Header
    React.createElement('div', { className: 'mb-8' },
      React.createElement('div', { className: 'flex items-center justify-between' },
        React.createElement('div', null,
          React.createElement('h1', { className: 'text-2xl font-bold text-gray-900 dark:text-white' }, 'SSH Key Management'),
          React.createElement('p', { className: 'text-gray-600 dark:text-gray-400 mt-1' }, 
            'Manage SSH keys for VM access and authentication'
          )
        ),
        React.createElement('button', {
          onClick: () => generateSSHKey(),
          disabled: generating,
          className: `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            generating
              ? 'text-gray-400 bg-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              : 'text-white bg-blue-600 hover:bg-blue-700'
          }`
        },
          generating ? 
            React.createElement(React.Fragment, null,
              React.createElement(RefreshCw, { className: 'w-4 h-4 mr-2 animate-spin' }),
              'Generating...'
            ) :
            React.createElement(React.Fragment, null,
              React.createElement(Plus, { className: 'w-4 h-4 mr-2' }),
              'Generate New Key'
            )
        )
      )
    ),

    // Error display
    error && React.createElement('div', { className: 'mb-6 p-4 bg-red-50 border border-red-200 rounded-md' },
      React.createElement('div', { className: 'flex items-center' },
        React.createElement(AlertCircle, { className: 'w-5 h-5 text-red-400 mr-2' }),
        React.createElement('span', { className: 'text-red-800' }, error)
      )
    ),

    // Active key indicator
    activeKey && React.createElement('div', { className: 'mb-6 p-4 bg-green-50 border border-green-200 rounded-md' },
      React.createElement('div', { className: 'flex items-center' },
        React.createElement(CheckCircle, { className: 'w-5 h-5 text-green-400 mr-2' }),
        React.createElement('span', { className: 'text-green-800' },
          `Active SSH Key: ${activeKey}`
        )
      )
    ),

    // SSH Keys list
    React.createElement('div', { className: 'space-y-4' },
      sshKeys.length === 0 ? 
        React.createElement('div', { className: 'text-center py-12' },
          React.createElement(Key, { className: 'w-12 h-12 text-gray-400 mx-auto mb-4' }),
          React.createElement('h3', { className: 'text-lg font-medium text-gray-900 dark:text-white mb-2' }, 'No SSH Keys Found'),
          React.createElement('p', { className: 'text-gray-600 dark:text-gray-400 mb-4' }, 
            'Generate your first SSH key to get started with VM creation.'
          ),
          React.createElement('button', {
            onClick: () => generateSSHKey(),
            className: 'inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
          },
            React.createElement(Plus, { className: 'w-4 h-4 mr-2' }),
            'Generate First Key'
          )
        ) :
        sshKeys.map((key) => 
          React.createElement('div', { 
            key: key.name,
            className: `p-6 border rounded-lg ${
              activeKey === key.name 
                ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
            }`
          },
            React.createElement('div', { className: 'flex items-center justify-between mb-4' },
              React.createElement('div', { className: 'flex items-center space-x-3' },
                React.createElement(Key, { className: 'w-5 h-5 text-gray-400' }),
                React.createElement('div', null,
                  React.createElement('h3', { className: 'text-lg font-medium text-gray-900 dark:text-white' }, key.name),
                  React.createElement('p', { className: 'text-sm text-gray-500 dark:text-gray-400' },
                    `Created: ${key.createdAt ? new Date(key.createdAt).toLocaleString() : 'Unknown'}`
                  )
                )
              ),
              React.createElement('div', { className: 'flex items-center space-x-2' },
                key.valid ? 
                  React.createElement('span', { className: 'inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full' },
                    React.createElement(CheckCircle, { className: 'w-3 h-3 mr-1' }),
                    'Valid'
                  ) :
                  React.createElement('span', { className: 'inline-flex items-center px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full' },
                    React.createElement(XCircle, { className: 'w-3 h-3 mr-1' }),
                    'Invalid'
                  ),
                activeKey === key.name &&
                  React.createElement('span', { className: 'inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full' },
                    'Active'
                  )
              )
            ),

            // Key actions
            React.createElement('div', { className: 'flex items-center space-x-2 mb-4' },
              activeKey !== key.name &&
                React.createElement('button', {
                  onClick: () => setActiveSSHKey(key.name),
                  className: 'px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors'
                }, 'Set Active'),
              React.createElement('button', {
                onClick: () => copyToClipboard(key.publicKey, 'Public Key'),
                className: 'px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors'
              },
                React.createElement(Copy, { className: 'w-4 h-4 mr-1' }),
                'Copy Public Key'
              ),
              React.createElement('button', {
                onClick: () => downloadSSHKey(key.name, 'public', key.publicKey),
                className: 'px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors'
              },
                React.createElement(Download, { className: 'w-4 h-4 mr-1' }),
                'Download Public Key'
              ),
              React.createElement('button', {
                onClick: () => deleteSSHKey(key.name),
                className: 'px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors'
              },
                React.createElement(Trash2, { className: 'w-4 h-4 mr-1' }),
                'Delete'
              )
            ),

            // Public key display
            React.createElement('div', { className: 'mb-4' },
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'Public Key'),
              React.createElement('div', { className: 'relative' },
                React.createElement('textarea', {
                  readOnly: true,
                  value: key.publicKey || 'No public key available',
                  className: 'w-full p-3 text-sm font-mono bg-gray-50 border border-gray-200 rounded-md resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300',
                  rows: 3
                }),
                React.createElement('button', {
                  onClick: () => copyToClipboard(key.publicKey, 'Public Key'),
                  className: 'absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded'
                },
                  React.createElement(Copy, { className: 'w-4 h-4' })
                )
              )
            ),

            // Private key path (if available)
            key.privateKeyPath && React.createElement('div', { className: 'mb-4' },
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2' }, 'Private Key Path'),
              React.createElement('div', { className: 'flex items-center space-x-2' },
                React.createElement('input', {
                  type: 'text',
                  readOnly: true,
                  value: key.privateKeyPath,
                  className: 'flex-1 p-2 text-sm font-mono bg-gray-50 border border-gray-200 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                }),
                React.createElement('button', {
                  onClick: () => copyToClipboard(key.privateKeyPath, 'Private Key Path'),
                  className: 'p-2 text-gray-400 hover:text-gray-600 rounded'
                },
                  React.createElement(Copy, { className: 'w-4 h-4' })
                )
              )
            )
          )
        )
    )
  );
};

export default SSHKeys; 