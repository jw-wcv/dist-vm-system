// WalletConnect.js
// 
// Description: Wallet connection component for Super VM Dashboard
// 
// This component provides wallet connection functionality allowing users
// to connect their own wallets (MetaMask, WalletConnect, etc.) instead
// of relying on hardcoded keys. It supports both connected wallets and
// fallback to hardcoded configuration.
// 
// Features:
//   - MetaMask connection
//   - WalletConnect support
//   - Connection status display
//   - Network switching
//   - Balance display
//   - Fallback to hardcoded config
// 
// Inputs: None (uses global wallet state)
// Outputs: 
//   - Wallet connection UI
//   - Connection status
//   - Network information
// 
// Dependencies: 
//   - React hooks
//   - Web3 providers
//   - Lucide React icons

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  ChevronDown, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  Settings,
  Database
} from 'lucide-react';
import { useWeb3 } from '../context/Web3Context.js';

const WalletConnect = () => {
  const { 
    isConnected, 
    isConnecting, 
    walletInfo, 
    balance, 
    tokenBalances,
    network, 
    connectionType, 
    error, 
    actions 
  } = useWeb3();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showConnectionOptions, setShowConnectionOptions] = useState(false);

  const isMetaMaskAvailable = () => {
    return typeof window !== 'undefined' && window.ethereum;
  };

  // Connect to MetaMask
  const connectMetaMask = async () => {
    setShowConnectionOptions(false);
    await actions.connectMetaMask();
  };

  // Connect using hardcoded config
  const connectHardcoded = async () => {
    setShowConnectionOptions(false);
    await actions.connectHardcoded();
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    actions.disconnect();
    setShowDropdown(false);
  };

  // Format address for display with intelligent truncation
  // 
  // Modes:
  // - 'full': Shows the complete address (for dropdowns, tooltips)
  // - 'short': Very compact format for tight spaces (0x123...456)
  // - 'medium': Medium length for dropdown headers (0x12345...6789)
  // - 'compact': Standard format that adapts based on address length
  //   - ≤8 chars: Shows full address
  //   - ≤12 chars: Shows 6 chars + ... + 4 chars
  //   - >12 chars: Shows 4 chars + ... + 4 chars
  const formatAddress = (address, mode = 'compact') => {
    if (!address) return '';
    
    // Remove '0x' prefix for calculation
    const cleanAddress = address.startsWith('0x') ? address.slice(2) : address;
    
    switch (mode) {
      case 'full':
        return address;
      case 'short':
        // Very short for tight spaces
        return `0x${cleanAddress.slice(0, 3)}...${cleanAddress.slice(-3)}`;
      case 'medium':
        // Medium length for dropdown headers
        return `0x${cleanAddress.slice(0, 5)}...${cleanAddress.slice(-4)}`;
      case 'compact':
      default:
        // Standard compact format
        if (cleanAddress.length <= 8) {
          return address;
        } else if (cleanAddress.length <= 12) {
          return `0x${cleanAddress.slice(0, 6)}...${cleanAddress.slice(-4)}`;
        } else {
          return `0x${cleanAddress.slice(0, 4)}...${cleanAddress.slice(-4)}`;
        }
    }
  };

  // Get full address for tooltips and copy operations
  const getFullAddress = (address) => {
    return address || '';
  };

  // Copy address to clipboard
  const copyAddress = async () => {
    if (walletInfo?.address) {
      try {
        await navigator.clipboard.writeText(walletInfo.address);
        // You could add a toast notification here
      } catch (error) {
        console.error('Failed to copy address:', error);
      }
    }
  };

  // Get custom token balance
  const getCustomTokenBalance = () => {
    const tokenAddress = '0x27702a26126e0B3702af63Ee09aC4d1A084EF628';
    return tokenBalances[tokenAddress];
  };

  return React.createElement('div', { className: 'relative' },
    // Wallet Connect Button
    React.createElement('button', {
      onClick: isConnected ? () => setShowDropdown(!showDropdown) : () => setShowConnectionOptions(!showConnectionOptions),
      disabled: isConnecting,
      title: isConnected ? `Full address: ${getFullAddress(walletInfo?.address)}` : 'Connect your wallet',
      className: `flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
        isConnected 
          ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/30'
          : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30'
      } ${isConnecting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`
    },
      isConnecting ? React.createElement(RefreshCw, { 
        className: 'w-4 h-4 animate-spin' 
      }) : React.createElement(Wallet, { 
        className: 'w-4 h-4' 
      }),
      React.createElement('span', { className: 'text-sm font-medium' },
        isConnected ? formatAddress(walletInfo?.address, 'compact') : 'Connect Wallet'
      ),
      isConnected && React.createElement(ChevronDown, { 
        className: `w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}` 
      })
    ),

    // Connection Options Dropdown
    React.createElement(AnimatePresence, null,
      showConnectionOptions && !isConnected && React.createElement(motion.div, {
        initial: { opacity: 0, y: -10, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.95 },
        transition: { duration: 0.15 },
        className: 'absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50'
      },
        React.createElement('div', { className: 'p-4' },
          React.createElement('h3', { className: 'text-sm font-medium text-gray-900 dark:text-white mb-3' }, 'Choose Connection Method'),
          React.createElement('div', { className: 'space-y-2' },
            isMetaMaskAvailable() && React.createElement('button', {
              onClick: connectMetaMask,
              className: 'w-full flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
            },
              React.createElement(Wallet, { className: 'w-5 h-5 text-orange-500' }),
              React.createElement('div', null,
                React.createElement('div', { className: 'text-sm font-medium text-gray-900 dark:text-white' }, 'MetaMask'),
                React.createElement('div', { className: 'text-xs text-gray-500 dark:text-gray-400' }, 'Connect your MetaMask wallet')
              )
            ),
            React.createElement('button', {
              onClick: connectHardcoded,
              className: 'w-full flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
            },
              React.createElement(Database, { className: 'w-5 h-5 text-blue-500' }),
              React.createElement('div', null,
                React.createElement('div', { className: 'text-sm font-medium text-gray-900 dark:text-white' }, 'Hardcoded Config'),
                React.createElement('div', { className: 'text-xs text-gray-500 dark:text-gray-400' }, 'Use system configuration')
              )
            )
          )
        )
      )
    ),

    // Dropdown Menu
    React.createElement(AnimatePresence, null,
      showDropdown && isConnected && React.createElement(motion.div, {
        initial: { opacity: 0, y: -10, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.95 },
        transition: { duration: 0.15 },
        className: 'absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50'
      },
        // Wallet Info Header
        React.createElement('div', { className: 'p-4 border-b border-gray-200 dark:border-gray-700' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('div', { className: 'flex items-center space-x-2' },
              React.createElement(CheckCircle, { className: 'w-4 h-4 text-green-500' }),
              React.createElement('span', { className: 'text-sm font-medium text-gray-900 dark:text-white' }, 'Connected')
            ),
            React.createElement('button', {
              onClick: disconnectWallet,
              className: 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            },
              React.createElement(XCircle, { className: 'w-4 h-4' })
            )
          ),
          React.createElement('div', { className: 'mt-2' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('span', { className: 'text-xs text-gray-500 dark:text-gray-400' }, 'Address'),
              React.createElement('button', {
                onClick: copyAddress,
                className: 'text-blue-500 hover:text-blue-600 text-xs flex items-center space-x-1'
              },
                React.createElement(Copy, { className: 'w-3 h-3' }),
                React.createElement('span', null, 'Copy')
              )
            ),
            React.createElement('div', { className: 'text-sm font-mono text-gray-900 dark:text-white mt-1 break-all' },
              walletInfo?.address
            )
          )
        ),

        // Network Info
        React.createElement('div', { className: 'p-4 border-b border-gray-200 dark:border-gray-700' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('span', { className: 'text-xs text-gray-500 dark:text-gray-400' }, 'Network'),
            React.createElement('span', { className: 'text-sm font-medium text-gray-900 dark:text-white' },
              network
            )
          ),
          balance !== null && React.createElement('div', { className: 'mt-2' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('span', { className: 'text-xs text-gray-500 dark:text-gray-400' }, 'ETH Balance'),
              React.createElement('span', { className: 'text-sm font-medium text-gray-900 dark:text-white' },
                `${parseFloat(balance).toFixed(4)} ETH`
              )
            )
          ),
          // Custom Token Balance
          getCustomTokenBalance() && React.createElement('div', { className: 'mt-2' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('span', { className: 'text-xs text-gray-500 dark:text-gray-400' }, 'Aleph Balance'),
              React.createElement('span', { className: 'text-sm font-medium text-gray-900 dark:text-white' },
                `${parseFloat(getCustomTokenBalance().formatted).toFixed(4)} ${getCustomTokenBalance().symbol}`
              )
            )
          ),
          React.createElement('div', { className: 'mt-2' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('span', { className: 'text-xs text-gray-500 dark:text-gray-400' }, 'Type'),
              React.createElement('span', { className: 'text-sm font-medium text-gray-900 dark:text-white' },
                connectionType === 'metamask' ? 'MetaMask' : 'Hardcoded Config'
              )
            )
          )
        ),

        // Quick Actions
        React.createElement('div', { className: 'p-4' },
          React.createElement('div', { className: 'text-xs text-gray-500 dark:text-gray-400 mb-2' }, 'Quick Actions'),
          React.createElement('div', { className: 'space-y-2' },
            React.createElement('button', {
              onClick: () => window.open(`https://etherscan.io/address/${walletInfo?.address}`, '_blank'),
              className: 'w-full flex items-center justify-between p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors'
            },
              React.createElement('span', null, 'View on Etherscan'),
              React.createElement(ExternalLink, { className: 'w-4 h-4' })
            ),
            React.createElement('button', {
              onClick: () => console.log('Open wallet settings'),
              className: 'w-full flex items-center justify-between p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors'
            },
              React.createElement('span', null, 'Wallet Settings'),
              React.createElement(Settings, { className: 'w-4 h-4' })
            )
          )
        )
      )
    ),

    // Error Message
    error && React.createElement(motion.div, {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      className: 'absolute right-0 top-full mt-2 w-80 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3 z-50'
    },
      React.createElement('div', { className: 'flex items-start space-x-2' },
        React.createElement(AlertCircle, { className: 'w-4 h-4 text-red-500 mt-0.5 flex-shrink-0' }),
        React.createElement('div', { className: 'text-sm text-red-700 dark:text-red-400' }, error)
      )
    )
  );
};

export default WalletConnect; 