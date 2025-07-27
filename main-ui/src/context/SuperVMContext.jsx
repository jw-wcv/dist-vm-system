// SuperVMContext.jsx
// 
// Description: React Context for Super VM state management
// 
// This context provides global state management for the Super VM dashboard,
// including system status, resource metrics, task management, and real-time
// data updates. It centralizes all Super VM related state and operations.
// 
// Features:
//   - Global state management
//   - Real-time data polling
//   - Task execution and monitoring
//   - Resource utilization tracking
//   - Error handling and notifications
// 
// Inputs: 
//   - API calls to Super VM backend
//   - User interactions and commands
// Outputs: 
//   - Global state updates
//   - Real-time data streams
//   - Task execution results
// 
// Dependencies: 
//   - React Context API
//   - Axios for API calls
//   - React Hot Toast for notifications

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Initial state
const initialState = {
  // System status
  systemStatus: 'initializing',
  isConnected: false,
  lastUpdate: null,
  
  // Resource pool
  resourcePool: {
    totalCPU: 0,
    totalMemory: 0,
    totalGPU: 0,
    availableCPU: 0,
    availableMemory: 0,
    availableGPU: 0,
    utilization: {
      cpu: 0,
      memory: 0,
      gpu: 0
    }
  },
  
  // VM nodes
  nodes: [],
  activeNodes: 0,
  
  // Tasks
  tasks: [],
  activeTasks: 0,
  completedTasks: 0,
  failedTasks: 0,
  
  // Performance metrics
  performanceMetrics: {
    totalTasksExecuted: 0,
    averageExecutionTime: 0,
    totalComputeTime: 0,
    uptime: 0,
    efficiency: 0,
    currentLoad: 0
  },
  
  // UI state
  isLoading: false,
  error: null,
  refreshInterval: 5000 // 5 seconds
};

// Action types
const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_SYSTEM_STATUS: 'UPDATE_SYSTEM_STATUS',
  UPDATE_RESOURCE_POOL: 'UPDATE_RESOURCE_POOL',
  UPDATE_NODES: 'UPDATE_NODES',
  UPDATE_TASKS: 'UPDATE_TASKS',
  UPDATE_PERFORMANCE: 'UPDATE_PERFORMANCE',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS'
};

// Reducer function
const superVMReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, isLoading: action.payload };
      
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
      
    case ACTION_TYPES.UPDATE_SYSTEM_STATUS:
      return { 
        ...state, 
        systemStatus: action.payload.status,
        lastUpdate: new Date().toISOString()
      };
      
    case ACTION_TYPES.UPDATE_RESOURCE_POOL:
      return { 
        ...state, 
        resourcePool: { ...state.resourcePool, ...action.payload }
      };
      
    case ACTION_TYPES.UPDATE_NODES:
      return { 
        ...state, 
        nodes: action.payload.nodes,
        activeNodes: action.payload.activeNodes
      };
      
    case ACTION_TYPES.UPDATE_TASKS:
      return { 
        ...state, 
        tasks: action.payload.tasks,
        activeTasks: action.payload.activeTasks,
        completedTasks: action.payload.completedTasks,
        failedTasks: action.payload.failedTasks
      };
      
    case ACTION_TYPES.UPDATE_PERFORMANCE:
      return { 
        ...state, 
        performanceMetrics: { ...state.performanceMetrics, ...action.payload }
      };
      
    case ACTION_TYPES.ADD_TASK:
      return { 
        ...state, 
        tasks: [...state.tasks, action.payload],
        activeTasks: state.activeTasks + 1
      };
      
    case ACTION_TYPES.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        )
      };
      
    case ACTION_TYPES.SET_CONNECTION_STATUS:
      return { ...state, isConnected: action.payload };
      
    default:
      return state;
  }
};

// Create context
const SuperVMContext = createContext();

// Provider component
export const SuperVMProvider = ({ children }) => {
  const [state, dispatch] = useReducer(superVMReducer, initialState);

  // API helper functions
  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await axios({
        url: `${API_BASE_URL}${endpoint}`,
        timeout: 10000,
        ...options
      });
      return response.data;
    } catch (error) {
      console.error(`API call failed: ${endpoint}`, error);
      throw error;
    }
  };

  // Fetch system status
  const fetchSystemStatus = async () => {
    try {
      const data = await apiCall('/super-vm/status');
      dispatch({ type: ACTION_TYPES.UPDATE_SYSTEM_STATUS, payload: data });
      dispatch({ type: ACTION_TYPES.SET_CONNECTION_STATUS, payload: true });
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_CONNECTION_STATUS, payload: false });
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: 'Failed to fetch system status' });
    }
  };

  // Fetch resource pool
  const fetchResourcePool = async () => {
    try {
      const data = await apiCall('/super-vm/resources');
      dispatch({ type: ACTION_TYPES.UPDATE_RESOURCE_POOL, payload: data });
    } catch (error) {
      console.error('Failed to fetch resource pool:', error);
    }
  };

  // Fetch performance metrics
  const fetchPerformanceMetrics = async () => {
    try {
      const data = await apiCall('/super-vm/metrics');
      dispatch({ type: ACTION_TYPES.UPDATE_PERFORMANCE, payload: data });
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
    }
  };

  // Execute task
  const executeTask = async (taskType, taskData) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    
    try {
      const endpoint = `/super-vm/${taskType}`;
      const result = await apiCall(endpoint, {
        method: 'POST',
        data: taskData
      });
      
      // Add task to list
      const newTask = {
        id: result.taskId || Date.now().toString(),
        type: taskType,
        status: 'completed',
        result: result,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        executionTime: result.executionTime || 0
      };
      
      dispatch({ type: ACTION_TYPES.ADD_TASK, payload: newTask });
      toast.success(`Task ${taskType} completed successfully`);
      
      return result;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: errorMessage });
      toast.error(`Task ${taskType} failed: ${errorMessage}`);
      throw error;
    } finally {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  };

  // Scale system
  const scaleSystem = async (nodes) => {
    try {
      const result = await apiCall('/super-vm/scale', {
        method: 'POST',
        data: { nodes }
      });
      
      toast.success(`System scaled by ${nodes} nodes`);
      return result;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(`Scaling failed: ${errorMessage}`);
      throw error;
    }
  };

  // Refresh all data
  const refreshData = async () => {
    await Promise.all([
      fetchSystemStatus(),
      fetchResourcePool(),
      fetchPerformanceMetrics()
    ]);
  };

  // Set up polling
  useEffect(() => {
    // Initial data fetch
    refreshData();
    
    // Set up polling interval
    const interval = setInterval(refreshData, state.refreshInterval);
    
    return () => clearInterval(interval);
  }, [state.refreshInterval]);

  // Context value
  const value = {
    ...state,
    actions: {
      executeTask,
      scaleSystem,
      refreshData,
      fetchSystemStatus,
      fetchResourcePool,
      fetchPerformanceMetrics
    }
  };

  return (
    <SuperVMContext.Provider value={value}>
      {children}
    </SuperVMContext.Provider>
  );
};

// Custom hook to use Super VM context
export const useSuperVM = () => {
  const context = useContext(SuperVMContext);
  if (!context) {
    throw new Error('useSuperVM must be used within a SuperVMProvider');
  }
  return context;
};

export default SuperVMContext; 