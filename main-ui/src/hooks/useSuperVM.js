// useSuperVM.js
// 
// Description: Custom hook for accessing Super VM context
// 
// This hook provides a convenient way to access the Super VM context
// throughout the application. It includes error handling and ensures
// the hook is used within the proper context provider.
// 
// Inputs: None (uses React context)
// Outputs: 
//   - Super VM context state and actions
//   - Error handling for improper usage
// 
// Dependencies: 
//   - React useContext hook
//   - SuperVMContext

import { useContext } from 'react';
import { SuperVMContext } from '../context/SuperVMContext';

export const useSuperVM = () => {
  const context = useContext(SuperVMContext);
  if (!context) {
    throw new Error('useSuperVM must be used within a SuperVMProvider');
  }
  return context;
}; 