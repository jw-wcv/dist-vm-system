import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000/api';

const initialState = {
  systemStatus: 'initializing',
  isConnected: false,
  lastUpdate: null,
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
  nodes: [],
  activeNodes: 0,
  tasks: [],
  activeTasks: 0,
  completedTasks: 0,
  failedTasks: 0,
  performanceMetrics: {
    totalTasksExecuted: 0,
    averageExecutionTime: 0,
    totalComputeTime: 0,
    uptime: 0,
    efficiency: 0,
    currentLoad: 0
  },
  isLoading: false,
  error: null,
  refreshInterval: 5000
};

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
        isConnected: action.payload.isConnected,
        lastUpdate: new Date().toISOString()
      };
    case ACTION_TYPES.UPDATE_RESOURCE_POOL:
      return { 
        ...state, 
        resourcePool: { ...action.payload },
        lastUpdate: new Date().toISOString()
      };
    case ACTION_TYPES.UPDATE_NODES:
      return { 
        ...state, 
        nodes: action.payload.nodes,
        activeNodes: action.payload.activeNodes,
        lastUpdate: new Date().toISOString()
      };
    case ACTION_TYPES.UPDATE_TASKS:
      return { 
        ...state, 
        tasks: action.payload.tasks,
        activeTasks: action.payload.activeTasks,
        completedTasks: action.payload.completedTasks,
        failedTasks: action.payload.failedTasks,
        lastUpdate: new Date().toISOString()
      };
    case ACTION_TYPES.UPDATE_PERFORMANCE:
      return { 
        ...state, 
        performanceMetrics: { ...action.payload },
        lastUpdate: new Date().toISOString()
      };
    case ACTION_TYPES.ADD_TASK:
      return { 
        ...state, 
        tasks: [...state.tasks, action.payload],
        lastUpdate: new Date().toISOString()
      };
    case ACTION_TYPES.UPDATE_TASK:
      return { 
        ...state, 
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
        lastUpdate: new Date().toISOString()
      };
    case ACTION_TYPES.SET_CONNECTION_STATUS:
      return { 
        ...state, 
        isConnected: action.payload,
        lastUpdate: new Date().toISOString()
      };
    default:
      return state;
  }
};

const SuperVMContext = createContext(initialState);

export const SuperVMProvider = ({ children }) => {
  const [state, dispatch] = useReducer(superVMReducer, initialState);

  const apiCall = async (endpoint, options = {}) => {
    console.log(`Making API call to: ${API_BASE_URL}${endpoint}`);
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: null });
    try {
      const response = await axios({
        url: `${API_BASE_URL}${endpoint}`,
        method: options.method || 'GET',
        data: options.data
      });
      console.log(`API call successful: ${endpoint}`, response.data);
      dispatch({ type: ACTION_TYPES.SET_CONNECTION_STATUS, payload: true });
      return response.data;
    } catch (error) {
      console.error(`API call failed: ${endpoint}`, error);
      dispatch({ type: ACTION_TYPES.SET_CONNECTION_STATUS, payload: false });
      throw error;
    } finally {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const data = await apiCall('/super-vm/status');
      dispatch({ type: ACTION_TYPES.UPDATE_SYSTEM_STATUS, payload: data });
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error.message });
    }
  };

  const fetchResourcePool = async () => {
    try {
      const data = await apiCall('/super-vm/resources');
      dispatch({ type: ACTION_TYPES.UPDATE_RESOURCE_POOL, payload: data });
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: 'Failed to fetch resource pool' });
    }
  };

  const fetchPerformanceMetrics = async () => {
    try {
      const data = await apiCall('/super-vm/metrics');
      dispatch({ type: ACTION_TYPES.UPDATE_PERFORMANCE, payload: data });
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: 'Failed to fetch performance metrics' });
    }
  };

  const fetchNodes = async () => {
    try {
      const data = await apiCall('/nodes');
      dispatch({ type: ACTION_TYPES.UPDATE_NODES, payload: data });
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: 'Failed to fetch nodes' });
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await apiCall('/tasks');
      dispatch({ type: ACTION_TYPES.UPDATE_TASKS, payload: data });
    } catch (error) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: 'Failed to fetch tasks' });
    }
  };

  const executeTask = async (taskType, taskData) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: null });
    
    try {
      const result = await apiCall('/super-vm/execute-task', {
        method: 'POST',
        data: { taskType, taskData }
      });
      
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

  const scaleSystem = async (nodes) => {
    try {
      const response = await apiCall('/super-vm/scale', {
        method: 'POST',
        body: JSON.stringify({ nodes })
      });
      
      if (response.success) {
        await refreshData();
        console.log(`System scaled by ${nodes} nodes`);
      }
    } catch (error) {
      console.error('Failed to scale system:', error);
    }
  };

  // Create VM with wallet credentials
  const createVMWithWallet = async (credentials, vmConfig = {}) => {
    try {
      const response = await apiCall('/vms/create-with-wallet', {
        method: 'POST',
        body: JSON.stringify({
          walletAddress: credentials.walletAddress,
          privateKey: credentials.privateKey,
          signature: credentials.signature,
          message: credentials.message,
          method: credentials.method,
          vmConfig,
          paymentMethod: 'aleph'
        })
      });
      
      if (response.item_hash) {
        await refreshData();
        console.log('VM created successfully:', response);
        return response;
      } else {
        throw new Error('Failed to create VM: No item hash returned');
      }
    } catch (error) {
      console.error('Failed to create VM with wallet:', error);
      throw error;
    }
  };

  // Get VM status
  const getVMStatus = async (vmId) => {
    try {
      const response = await apiCall(`/vms/${vmId}/status`);
      return response;
    } catch (error) {
      console.error('Failed to get VM status:', error);
      throw error;
    }
  };

  // Delete VM
  const deleteVM = async (vmId) => {
    try {
      const response = await apiCall(`/vms/${vmId}`, {
        method: 'DELETE'
      });
      
      if (response.success) {
        await refreshData();
        console.log(`VM ${vmId} deleted successfully`);
      }
    } catch (error) {
      console.error('Failed to delete VM:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    await Promise.all([
      fetchSystemStatus(),
      fetchResourcePool(),
      fetchPerformanceMetrics(),
      fetchNodes(),
      fetchTasks()
    ]);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, state.refreshInterval);
    return () => clearInterval(interval);
  }, [state.refreshInterval]);

  const value = {
    ...state,
    actions: {
      executeTask,
      scaleSystem,
      refreshData,
      fetchSystemStatus,
      fetchResourcePool,
      fetchPerformanceMetrics,
      fetchNodes,
      fetchTasks,
      createVMWithWallet,
      getVMStatus,
      deleteVM
    }
  };

  return React.createElement(SuperVMContext.Provider, { value }, children);
};

export const useSuperVM = () => {
  const context = useContext(SuperVMContext);
  if (!context) {
    throw new Error('useSuperVM must be used within a SuperVMProvider');
  }
  return context;
};

export { SuperVMContext }; 