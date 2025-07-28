// Web3Context.js
// 
// Description: Web3 context for managing wallet connections and blockchain interactions
// 
// This context provides a unified interface for web3 functionality, supporting
// both connected wallets (MetaMask, WalletConnect) and fallback to hardcoded
// configuration. It manages wallet state, network information, and provides
// methods for blockchain interactions.
// 
// Features:
//   - Wallet connection management
//   - Network switching
//   - Balance tracking (ETH + ERC-20 tokens)
//   - Transaction signing
//   - Fallback to hardcoded config
//   - Multi-wallet support
// 
// Inputs: None (manages internal state)
// Outputs: 
//   - Wallet connection state
//   - Network information
//   - Web3 interaction methods
// 
// Dependencies: 
//   - React Context API
//   - Web3 providers
//   - Hardcoded web3 config

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ethers } from 'ethers';

// ERC-20 Token ABI (minimal for balance checking)
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
];

// Import hardcoded web3 config as fallback
// Note: Using import.meta.env for Vite environment variables
const hardcodedConfig = {
  ethereum: {
    privateKey: import.meta.env.VITE_ETH_PRIVATE_KEY || '',
    rpcUrl: import.meta.env.VITE_ETH_RPC_URL || 'https://mainnet.infura.io/v3/your-project-id'
  },
  polygon: {
    privateKey: import.meta.env.VITE_POLYGON_PRIVATE_KEY || '',
    rpcUrl: import.meta.env.VITE_POLYGON_RPC_URL || 'https://polygon-rpc.com'
  }
};

// Token configuration
const TOKEN_CONFIG = {
  '0x27702a26126e0B3702af63Ee09aC4d1A084EF628': {
    name: 'Custom Token',
    symbol: 'CTKN',
    decimals: 18,
    address: '0x27702a26126e0B3702af63Ee09aC4d1A084EF628'
  }
};

const initialState = {
  // Connection state
  isConnected: false,
  isConnecting: false,
  connectionType: null, // 'metamask', 'walletconnect', 'hardcoded'
  
  // Wallet information
  walletInfo: null,
  address: null,
  balance: null,
  
  // Token balances
  tokenBalances: {},
  
  // Network information
  network: null,
  chainId: null,
  
  // Providers
  provider: null,
  signer: null,
  
  // Error state
  error: null,
  
  // Fallback configuration
  useHardcodedConfig: false,
  hardcodedProvider: null
};

const ACTION_TYPES = {
  SET_CONNECTING: 'SET_CONNECTING',
  SET_CONNECTED: 'SET_CONNECTED',
  SET_WALLET_INFO: 'SET_WALLET_INFO',
  SET_NETWORK: 'SET_NETWORK',
  SET_BALANCE: 'SET_BALANCE',
  SET_TOKEN_BALANCE: 'SET_TOKEN_BALANCE',
  SET_PROVIDER: 'SET_PROVIDER',
  SET_ERROR: 'SET_ERROR',
  DISCONNECT: 'DISCONNECT',
  SET_HARDCODED_CONFIG: 'SET_HARDCODED_CONFIG'
};

const web3Reducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_CONNECTING:
      return { ...state, isConnecting: action.payload, error: null };
    
    case ACTION_TYPES.SET_CONNECTED:
      return { 
        ...state, 
        isConnected: action.payload.connected,
        connectionType: action.payload.type,
        isConnecting: false,
        error: null
      };
    
    case ACTION_TYPES.SET_WALLET_INFO:
      return { 
        ...state, 
        walletInfo: action.payload.walletInfo,
        address: action.payload.address
      };
    
    case ACTION_TYPES.SET_NETWORK:
      return { 
        ...state, 
        network: action.payload.network,
        chainId: action.payload.chainId
      };
    
    case ACTION_TYPES.SET_BALANCE:
      return { ...state, balance: action.payload };
    
    case ACTION_TYPES.SET_TOKEN_BALANCE:
      return { 
        ...state, 
        tokenBalances: {
          ...state.tokenBalances,
          [action.payload.tokenAddress]: action.payload.balance
        }
      };
    
    case ACTION_TYPES.SET_PROVIDER:
      return { 
        ...state, 
        provider: action.payload.provider,
        signer: action.payload.signer
      };
    
    case ACTION_TYPES.SET_ERROR:
      return { 
        ...state, 
        error: action.payload,
        isConnecting: false
      };
    
    case ACTION_TYPES.DISCONNECT:
      return {
        ...initialState,
        useHardcodedConfig: state.useHardcodedConfig,
        hardcodedProvider: state.hardcodedProvider
      };
    
    case ACTION_TYPES.SET_HARDCODED_CONFIG:
      return {
        ...state,
        useHardcodedConfig: action.payload.useHardcodedConfig,
        hardcodedProvider: action.payload.provider
      };
    
    default:
      return state;
  }
};

const Web3Context = createContext(initialState);

export const Web3Provider = ({ children }) => {
  const [state, dispatch] = useReducer(web3Reducer, initialState);

  // Initialize hardcoded provider as fallback
  useEffect(() => {
    const initializeHardcodedProvider = async () => {
      try {
        if (hardcodedConfig.ethereum.privateKey && hardcodedConfig.ethereum.rpcUrl) {
          const provider = new ethers.providers.JsonRpcProvider(hardcodedConfig.ethereum.rpcUrl);
          const wallet = new ethers.Wallet(hardcodedConfig.ethereum.privateKey, provider);
          
          dispatch({
            type: ACTION_TYPES.SET_HARDCODED_CONFIG,
            payload: {
              useHardcodedConfig: true,
              provider: { provider, wallet }
            }
          });
        }
      } catch (error) {
        console.error('Failed to initialize hardcoded provider:', error);
      }
    };

    initializeHardcodedProvider();
  }, []);

  // Fetch token balance
  const fetchTokenBalance = async (tokenAddress, walletAddress) => {
    if (!state.provider || !walletAddress) return null;

    try {
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, state.provider);
      const balance = await tokenContract.balanceOf(walletAddress);
      const decimals = await tokenContract.decimals();
      const symbol = await tokenContract.symbol();
      
      const formattedBalance = ethers.utils.formatUnits(balance, decimals);
      
      dispatch({
        type: ACTION_TYPES.SET_TOKEN_BALANCE,
        payload: {
          tokenAddress,
          balance: {
            raw: balance.toString(),
            formatted: formattedBalance,
            symbol: symbol,
            decimals: decimals
          }
        }
      });

      return formattedBalance;
    } catch (error) {
      console.error(`Failed to fetch token balance for ${tokenAddress}:`, error);
      return null;
    }
  };

  // Fetch all token balances
  const fetchAllTokenBalances = async () => {
    if (!state.address) return;

    const promises = Object.keys(TOKEN_CONFIG).map(tokenAddress =>
      fetchTokenBalance(tokenAddress, state.address)
    );

    await Promise.allSettled(promises);
  };

  // Connect to MetaMask
  const connectMetaMask = async () => {
    if (!window.ethereum) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: 'MetaMask is not installed. Please install MetaMask to connect your wallet.'
      });
      return;
    }

    dispatch({ type: ACTION_TYPES.SET_CONNECTING, payload: true });

    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length > 0) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        const network = await provider.getNetwork();

        dispatch({
          type: ACTION_TYPES.SET_CONNECTED,
          payload: { connected: true, type: 'metamask' }
        });

        dispatch({
          type: ACTION_TYPES.SET_WALLET_INFO,
          payload: {
            walletInfo: {
              address,
              type: 'metamask',
              connected: true
            },
            address
          }
        });

        dispatch({
          type: ACTION_TYPES.SET_NETWORK,
          payload: {
            network: getNetworkName(network.chainId),
            chainId: Number(network.chainId)
          }
        });

        dispatch({
          type: ACTION_TYPES.SET_BALANCE,
          payload: ethers.utils.formatEther(balance)
        });

        dispatch({
          type: ACTION_TYPES.SET_PROVIDER,
          payload: { provider, signer }
        });

        // Fetch token balances
        await fetchAllTokenBalances();

        // Set up event listeners
        setupEventListeners();
      }
    } catch (error) {
      console.error('MetaMask connection error:', error);
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: 'Failed to connect to MetaMask. Please try again.'
      });
    }
  };

  // Connect using hardcoded configuration
  const connectHardcoded = async () => {
    if (!state.hardcodedProvider) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: 'Hardcoded configuration not available.'
      });
      return;
    }

    dispatch({ type: ACTION_TYPES.SET_CONNECTING, payload: true });

    try {
      const { provider, wallet } = state.hardcodedProvider;
      const address = wallet.address;
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();

      dispatch({
        type: ACTION_TYPES.SET_CONNECTED,
        payload: { connected: true, type: 'hardcoded' }
      });

      dispatch({
        type: ACTION_TYPES.SET_WALLET_INFO,
        payload: {
          walletInfo: {
            address,
            type: 'hardcoded',
            connected: true
          },
          address
        }
      });

      dispatch({
        type: ACTION_TYPES.SET_NETWORK,
        payload: {
          network: getNetworkName(network.chainId),
          chainId: Number(network.chainId)
        }
      });

      dispatch({
        type: ACTION_TYPES.SET_BALANCE,
        payload: ethers.utils.formatEther(balance)
      });

      dispatch({
        type: ACTION_TYPES.SET_PROVIDER,
        payload: { provider, signer: wallet }
      });

      // Fetch token balances
      await fetchAllTokenBalances();
    } catch (error) {
      console.error('Hardcoded connection error:', error);
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: 'Failed to connect using hardcoded configuration.'
      });
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    dispatch({ type: ACTION_TYPES.DISCONNECT });
  };

  // Switch network
  const switchNetwork = async (targetChainId) => {
    if (!state.isConnected || state.connectionType !== 'metamask') {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: 'Network switching is only available with MetaMask.'
      });
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }]
      });
    } catch (error) {
      console.error('Failed to switch network:', error);
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: 'Failed to switch network. Please try switching manually in MetaMask.'
      });
    }
  };

  // Send transaction
  const sendTransaction = async (to, value, data = '0x') => {
    if (!state.isConnected || !state.signer) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: 'Wallet not connected. Please connect your wallet first.'
      });
      return;
    }

    try {
      const tx = await state.signer.sendTransaction({
        to,
        value: ethers.utils.parseEther(value.toString()),
        data
      });

      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Transaction error:', error);
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: `Transaction failed: ${error.message}`
      });
      throw error;
    }
  };

  // Get network name from chain ID
  const getNetworkName = (chainId) => {
    const networks = {
      1: 'Ethereum Mainnet',
      3: 'Ropsten Testnet',
      4: 'Rinkeby Testnet',
      5: 'Goerli Testnet',
      42: 'Kovan Testnet',
      56: 'Binance Smart Chain',
      137: 'Polygon',
      80001: 'Mumbai Testnet',
      42161: 'Arbitrum One',
      421611: 'Arbitrum Rinkeby'
    };
    return networks[chainId] || `Chain ID ${chainId}`;
  };

  // Set up event listeners for MetaMask
  const setupEventListeners = () => {
    if (window.ethereum && state.connectionType === 'metamask') {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          // Reconnect with new account
          connectMetaMask();
        }
      };

      const handleChainChanged = (chainId) => {
        // Reconnect to get updated network info
        connectMetaMask();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  };

  // Auto-connect if previously connected
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            connectMetaMask();
          }
        })
        .catch(console.error);
    }
  }, []);

  // Update balance periodically
  useEffect(() => {
    if (state.isConnected && state.provider && state.address) {
      const updateBalances = async () => {
        try {
          // Update ETH balance
          const balance = await state.provider.getBalance(state.address);
          dispatch({
            type: ACTION_TYPES.SET_BALANCE,
            payload: ethers.utils.formatEther(balance)
          });

          // Update token balances
          await fetchAllTokenBalances();
        } catch (error) {
          console.error('Failed to update balances:', error);
        }
      };

      updateBalances();
      const interval = setInterval(updateBalances, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [state.isConnected, state.provider, state.address]);

  // Get wallet credentials for VM creation
  const getWalletCredentials = async () => {
    if (!state.isConnected || !state.walletInfo?.address) {
      throw new Error('Wallet not connected');
    }

    if (state.connectionType === 'metamask') {
      // For MetaMask, we'll use the signer to sign a message
      if (!state.signer) {
        throw new Error('MetaMask signer not available');
      }
      
      // Sign a message to prove wallet ownership
      const message = `Create VM on Aleph Network - ${Date.now()}`;
      const signature = await state.signer.signMessage(message);
      
      return {
        walletAddress: state.walletInfo.address,
        signature: signature,
        message: message,
        method: 'metamask'
      };
    } else if (state.connectionType === 'hardcoded') {
      // For hardcoded config, return the private key
      const privateKey = import.meta.env.VITE_ETH_PRIVATE_KEY;
      if (!privateKey) {
        throw new Error('No private key configured for hardcoded wallet');
      }
      
      return {
        walletAddress: state.walletInfo.address,
        privateKey: privateKey,
        method: 'hardcoded'
      };
    } else {
      throw new Error('Unsupported wallet connection type');
    }
  };

  const value = {
    ...state,
    actions: {
      connectMetaMask,
      connectHardcoded,
      disconnect,
      switchNetwork,
      sendTransaction,
      fetchTokenBalance,
      fetchAllTokenBalances,
      getWalletCredentials
    }
  };

  return React.createElement(Web3Context.Provider, { value }, children);
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export { Web3Context }; 