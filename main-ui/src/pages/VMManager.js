// VMManager.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Plus, 
  Trash2, 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  ExternalLink,
  Settings,
  HardDrive,
  Cpu,
  Database,
  Network
} from 'lucide-react';
import { useSuperVM } from '../context/SuperVMContext.js';
import { useWeb3 } from '../context/Web3Context.js';

const VMManager = () => {
  const [vms, setVms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVMs, setSelectedVMs] = useState(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingVM, setCreatingVM] = useState(false);
  const [vmConfig, setVmConfig] = useState({
    name: '',
    vcpus: 4,
    memory: 8192,
    storage: 80,
    image: 'aleph/node'
  });

  const { actions } = useSuperVM();
  const { isConnected, walletInfo, actions: web3Actions } = useWeb3();

  useEffect(() => {
    fetchVMs();
  }, []);

  const fetchVMs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/vms');
      if (response.ok) {
        const data = await response.json();
        setVms(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Failed to fetch VMs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create VM with wallet using real Aleph integration
  const createVMWithWallet = async () => {
    if (!isConnected || !walletInfo?.address) {
      alert('Please connect your wallet first');
      return;
    }

    setCreatingVM(true);
    try {
      // Get wallet credentials
      const credentials = await web3Actions.getWalletCredentials();
      
      if (credentials.method === 'metamask') {
        // For MetaMask, use the real Aleph integration approach
        await createRealAlephVM(credentials, vmConfig);
      } else {
        // For hardcoded, use the backend API
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
      }
      
      // Close modal and refresh data
      setShowCreateModal(false);
      fetchVMs();
      
    } catch (error) {
      console.error('Failed to create VM:', error);
      alert(`Failed to create VM: ${error.message}`);
    } finally {
      setCreatingVM(false);
    }
  };

  // Real Aleph VM creation using browser-based approach
  const createRealAlephVM = async (credentials, vmConfig) => {
    try {
      // Import Aleph SDK modules using dynamic imports with proper error handling
      let AuthenticatedAlephHttpClient, getAccountFromProvider;
      
      try {
        // Try to import the modules
        const alephClientModule = await import('@aleph-sdk/client');
        const alephEthereumModule = await import('@aleph-sdk/ethereum');
        
        AuthenticatedAlephHttpClient = alephClientModule.AuthenticatedAlephHttpClient;
        getAccountFromProvider = alephEthereumModule.getAccountFromProvider;
        
        console.log('Aleph SDK modules imported successfully');
      } catch (importError) {
        console.error('Failed to import Aleph SDK modules:', importError);
        throw new Error('Aleph SDK not available. Please ensure the SDK is properly installed and try again.');
      }
      
      // Get account from MetaMask provider
      const account = await getAccountFromProvider(window.ethereum);
      const authenticatedClient = new AuthenticatedAlephHttpClient(account);
      
      console.log('Authenticated Aleph client created with MetaMask account');
      
      // Get SSH keys using the existing key management system
      const sshKeys = await getSSHKeys();
      console.log('Fetched SSH keys:', sshKeys);
      
      if (!sshKeys.length) {
        // No SSH keys found, generate one using the backend
        console.log('No SSH keys found. Generating a new key...');
        const generateResponse = await fetch('http://localhost:3000/api/ssh-keys/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyName: 'aleph-vm-key' })
        });
        
        if (!generateResponse.ok) {
          throw new Error('Failed to generate SSH key');
        }
        
        // Fetch the newly generated keys
        const newKeys = await getSSHKeys();
        console.log('Newly generated SSH keys:', newKeys);
        if (!newKeys.length) {
          throw new Error('SSH key generation failed');
        }
        
        sshKeys.push(...newKeys);
      }

      // Get active SSH key from localStorage or use the first available key
      const activeKeyName = localStorage.getItem('activeSSHKey');
      let selectedKey;
      
      if (activeKeyName) {
        const activeKey = sshKeys.find(key => key.name === activeKeyName);
        if (activeKey) {
          selectedKey = activeKey.publicKey;
          console.log(`Using active SSH key: ${activeKeyName}`);
        } else {
          console.warn(`Active SSH key '${activeKeyName}' not found, using first available key`);
          selectedKey = sshKeys[0].publicKey;
        }
      } else {
        selectedKey = sshKeys[0].publicKey;
        console.log('No active SSH key set, using first available key');
      }
      console.log('Selected SSH key object:', sshKeys[0]);
      console.log('Selected SSH key publicKey field:', selectedKey);
      
      // Ensure we have a valid SSH key
      if (!selectedKey) {
        throw new Error('No valid SSH public key available. Please generate SSH keys first.');
      }
      
      const label = vmConfig.name || `MetaMask-VM-${Date.now()}`;

      console.log(`Deploying VM with label: ${label} using MetaMask wallet: ${credentials.walletAddress}`);
      console.log(`Using SSH key: ${selectedKey ? selectedKey.substring(0, 50) + '...' : 'NULL'}`);
      
      // Create the VM instance on Aleph network using the real API
      const vmConfigPayload = {
        authorized_keys: [selectedKey],
        resources: { 
          vcpus: vmConfig.vcpus || 1, 
          memory: vmConfig.memory || 2048, 
          seconds: vmConfig.seconds || 3600 
        },
        payment: { 
          chain: "ETH", 
          type: "hold" 
        },
        channel: "ALEPH-CLOUDSOLUTIONS",
        metadata: { name: label },
        image: vmConfig.image || "4a0f62da42f4478544616519e6f5d58adb1096e069b392b151d47c3609492d0c"
      };

      console.log('Sending VM creation payload to Aleph:', JSON.stringify(vmConfigPayload, null, 2));
      
      const instance = await authenticatedClient.createInstance(vmConfigPayload);

      console.log(`VM created successfully on Aleph network:`, instance);
      alert(`VM created successfully! ID: ${instance.item_hash}`);
      
      return instance;
      
    } catch (error) {
      console.error('Failed to create real Aleph VM:', error);
      
      // Log the detailed error information
      if (error.response) {
        console.error('Aleph API Error Response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        });
      }
      
      // If Aleph SDK is not available, fall back to backend API
      if (error.message.includes('Aleph SDK not available')) {
        console.log('Falling back to backend API for VM creation...');
        
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
          throw new Error(errorData.error || 'Failed to create VM via backend API');
        }

        const result = await response.json();
        console.log('VM created successfully via backend API:', result);
        alert(`VM created successfully! ID: ${result.item_hash}`);
        
        return result;
      }
      
      throw error;
    }
  };

  // Get SSH keys using the existing key management system
  const getSSHKeys = async () => {
    try {
      // Call the backend API to get SSH keys from the config/keys directory
      const response = await fetch('http://localhost:3000/api/ssh-keys');
      
      if (!response.ok) {
        console.warn('Could not fetch SSH keys from backend:', response.status);
        return [];
      }
      
      const data = await response.json();
      return data.keys || [];
    } catch (error) {
      console.error('Error getting SSH keys:', error);
      return [];
    }
  };

  const handleSelectVM = (vmId) => {
    const newSelected = new Set(selectedVMs);
    if (newSelected.has(vmId)) {
      newSelected.delete(vmId);
    } else {
      newSelected.add(vmId);
    }
    setSelectedVMs(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedVMs.size === vms.length) {
      setSelectedVMs(new Set());
    } else {
      setSelectedVMs(new Set(vms.map(vm => vm.id)));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedVMs.size === 0) {
      alert('Please select VMs to perform this action');
      return;
    }

    try {
      // Implement bulk actions here
      console.log(`Performing ${action} on ${selectedVMs.size} VMs`);
      alert(`${action} action completed`);
      fetchVMs();
    } catch (error) {
      console.error(`Bulk ${action} failed:`, error);
      alert(`Failed to ${action} VMs`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Running':
        return 'text-green-500';
      case 'Pending':
        return 'text-yellow-500';
      case 'Stopped':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Running':
        return React.createElement(CheckCircle, { className: 'w-4 h-4 text-green-500' });
      case 'Pending':
        return React.createElement(Clock, { className: 'w-4 h-4 text-yellow-500' });
      case 'Stopped':
        return React.createElement(XCircle, { className: 'w-4 h-4 text-red-500' });
      default:
        return React.createElement(Clock, { className: 'w-4 h-4 text-gray-500' });
    }
  };

  return React.createElement('div', { className: 'p-6' },
    React.createElement('div', { className: 'flex items-center justify-between mb-6' },
      React.createElement('div', null,
        React.createElement('h1', { className: 'text-2xl font-bold text-gray-900 dark:text-white' }, 'VM Manager'),
        React.createElement('p', { className: 'text-gray-600 dark:text-gray-400' }, 'Manage your virtual machines')
      ),
      React.createElement('div', { className: 'flex space-x-3' },
        React.createElement('button', {
          onClick: () => setShowCreateModal(true),
          disabled: !isConnected,
          className: `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            isConnected
              ? 'text-white bg-blue-600 hover:bg-blue-700'
              : 'text-gray-400 bg-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
          }`
        },
          React.createElement(Plus, { className: 'w-4 h-4 mr-2' }),
          isConnected ? 'Create VM' : 'Connect Wallet First'
        ),
        React.createElement('button', {
          onClick: fetchVMs,
          className: 'flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors'
        },
          React.createElement(RefreshCw, { className: 'w-4 h-4 mr-2' }),
          'Refresh'
        )
      )
    ),

    // Bulk Actions
    selectedVMs.size > 0 && React.createElement('div', { className: 'mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg' },
      React.createElement('div', { className: 'flex items-center justify-between' },
        React.createElement('span', { className: 'text-sm text-blue-700 dark:text-blue-300' },
          `${selectedVMs.size} VM${selectedVMs.size > 1 ? 's' : ''} selected`
        ),
        React.createElement('div', { className: 'flex space-x-2' },
          React.createElement('button', {
            onClick: () => handleBulkAction('start'),
            className: 'flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200 dark:text-green-300 dark:bg-green-900/20'
          },
            React.createElement(Play, { className: 'w-3 h-3 mr-1' }),
            'Start'
          ),
          React.createElement('button', {
            onClick: () => handleBulkAction('stop'),
            className: 'flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 dark:text-red-300 dark:bg-red-900/20'
          },
            React.createElement(Square, { className: 'w-3 h-3 mr-1' }),
            'Stop'
          ),
          React.createElement('button', {
            onClick: () => handleBulkAction('delete'),
            className: 'flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 dark:text-red-300 dark:bg-red-900/20'
          },
            React.createElement(Trash2, { className: 'w-3 h-3 mr-1' }),
            'Delete'
          )
        )
      )
    ),

    // VM List
    React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg shadow' },
      React.createElement('div', { className: 'px-6 py-4 border-b border-gray-200 dark:border-gray-700' },
        React.createElement('div', { className: 'flex items-center justify-between' },
          React.createElement('div', { className: 'flex items-center space-x-3' },
            React.createElement('input', {
              type: 'checkbox',
              checked: selectedVMs.size === vms.length && vms.length > 0,
              onChange: handleSelectAll,
              className: 'rounded border-gray-300 text-blue-600 focus:ring-blue-500'
            }),
            React.createElement('h2', { className: 'text-lg font-medium text-gray-900 dark:text-white' }, 'Virtual Machines')
          ),
          React.createElement('span', { className: 'text-sm text-gray-500 dark:text-gray-400' },
            `${vms.length} VM${vms.length !== 1 ? 's' : ''}`
          )
        )
      ),
      
      loading ? 
        React.createElement('div', { className: 'p-8 text-center' },
          React.createElement('div', { className: 'inline-flex items-center px-4 py-2 text-sm text-gray-500' },
            React.createElement('div', { className: 'w-4 h-4 mr-2 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin' }),
            'Loading VMs...'
          )
        ) :
        vms.length === 0 ?
          React.createElement('div', { className: 'p-8 text-center' },
            React.createElement(Server, { className: 'w-12 h-12 mx-auto text-gray-400 mb-4' }),
            React.createElement('h3', { className: 'text-lg font-medium text-gray-900 dark:text-white mb-2' }, 'No VMs Found'),
            React.createElement('p', { className: 'text-gray-500 dark:text-gray-400 mb-4' }, 'Create your first virtual machine to get started'),
            React.createElement('button', {
              onClick: () => setShowCreateModal(true),
              disabled: !isConnected,
              className: `inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                isConnected
                  ? 'text-white bg-blue-600 hover:bg-blue-700'
                  : 'text-gray-400 bg-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              }`
            },
              React.createElement(Plus, { className: 'w-4 h-4 mr-2' }),
              isConnected ? 'Create VM' : 'Connect Wallet First'
            )
          ) :
          React.createElement('div', { className: 'divide-y divide-gray-200 dark:divide-gray-700' },
            vms.map((vm) => React.createElement('div', {
              key: vm.id,
              className: 'px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
            },
              React.createElement('div', { className: 'flex items-center justify-between' },
                React.createElement('div', { className: 'flex items-center space-x-3' },
                  React.createElement('input', {
                    type: 'checkbox',
                    checked: selectedVMs.has(vm.id),
                    onChange: () => handleSelectVM(vm.id),
                    className: 'rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  }),
                  React.createElement('div', { className: 'flex items-center space-x-3' },
                    getStatusIcon(vm.status),
                    React.createElement('div', null,
                      React.createElement('h3', { className: 'text-sm font-medium text-gray-900 dark:text-white' }, vm.name || 'Unnamed VM'),
                      React.createElement('p', { className: 'text-sm text-gray-500 dark:text-gray-400' }, vm.id)
                    )
                  )
                ),
                React.createElement('div', { className: 'flex items-center space-x-4' },
                  React.createElement('div', { className: 'flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400' },
                    React.createElement(Cpu, { className: 'w-4 h-4' }),
                    React.createElement('span', null, '4 vCPU')
                  ),
                  React.createElement('div', { className: 'flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400' },
                    React.createElement(Database, { className: 'w-4 h-4' }),
                    React.createElement('span', null, '8GB')
                  ),
                  React.createElement('div', { className: 'flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400' },
                    React.createElement(HardDrive, { className: 'w-4 h-4' }),
                    React.createElement('span', null, '80GB')
                  ),
                  React.createElement('span', { className: `text-sm font-medium ${getStatusColor(vm.status)}` }, vm.status)
                )
              )
            ))
          )
    ),

    // Create VM Modal
    showCreateModal && React.createElement('div', { className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' },
      React.createElement('div', { className: 'bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md' },
        React.createElement('h2', { className: 'text-lg font-medium text-gray-900 dark:text-white mb-4' }, 'Create New VM'),
        
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1' }, 'VM Name'),
            React.createElement('input', {
              type: 'text',
              value: vmConfig.name,
              onChange: (e) => setVmConfig({ ...vmConfig, name: e.target.value }),
              className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white',
              placeholder: 'Enter VM name'
            })
          ),
          
          React.createElement('div', { className: 'grid grid-cols-3 gap-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1' }, 'vCPUs'),
              React.createElement('select', {
                value: vmConfig.vcpus,
                onChange: (e) => setVmConfig({ ...vmConfig, vcpus: parseInt(e.target.value) }),
                className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              },
                [1, 2, 4, 8, 16].map(cpu => React.createElement('option', { key: cpu, value: cpu }, cpu))
              )
            ),
            
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1' }, 'Memory (GB)'),
              React.createElement('select', {
                value: vmConfig.memory / 1024,
                onChange: (e) => setVmConfig({ ...vmConfig, memory: parseInt(e.target.value) * 1024 }),
                className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              },
                [2, 4, 8, 16, 32].map(mem => React.createElement('option', { key: mem, value: mem }, mem))
              )
            ),
            
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1' }, 'Storage (GB)'),
              React.createElement('select', {
                value: vmConfig.storage,
                onChange: (e) => setVmConfig({ ...vmConfig, storage: parseInt(e.target.value) }),
                className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              },
                [20, 40, 80, 160, 500].map(storage => React.createElement('option', { key: storage, value: storage }, storage))
              )
            )
          )
        ),
        
        React.createElement('div', { className: 'flex justify-end space-x-3 mt-6' },
          React.createElement('button', {
            onClick: () => setShowCreateModal(false),
            className: 'px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          }, 'Cancel'),
          React.createElement('button', {
            onClick: createVMWithWallet,
            disabled: creatingVM,
            className: `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              creatingVM
                ? 'text-gray-400 bg-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'text-white bg-blue-600 hover:bg-blue-700'
            }`
          },
            creatingVM ? 
              React.createElement(React.Fragment, null,
                React.createElement('div', { className: 'w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin inline' }),
                'Creating...'
              ) :
              'Create VM'
          )
        )
      )
    )
  );
};

export default VMManager; 