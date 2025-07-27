// LoadingSpinner.jsx
import React from 'react';
import { Zap, Server, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

// LoadingSpinner.jsx
// 
// Description: Loading spinner component for Super VM Dashboard
// 
// This component provides a full-screen loading animation with the
// Super VM branding and loading indicators.
// 
// Features:
//   - Full-screen loading overlay
//   - Animated spinner
//   - Super VM branding
//   - Loading progress indicator
// 
// Inputs: None
// Outputs: 
//   - Loading screen rendering
// 
// Dependencies: 
//   - Lucide React for icons
//   - Tailwind CSS for styling
//   - Framer Motion for animations


const LoadingSpinner = () => {
  return React.createElement(
    'div',
    {
      className:
        'min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center',
    },
    React.createElement(
      'div',
      { className: 'text-center' },
      // Logo and Title
      React.createElement(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
          className: 'mb-8',
        },
        React.createElement(
          'div',
          { className: 'flex items-center justify-center mb-4' },
          React.createElement(
            motion.div,
            {
              animate: {
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              },
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              className:
                'w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg',
            },
            React.createElement(Zap, {
              className: 'w-8 h-8 text-white',
            })
          )
        ),
        React.createElement(
          'h1',
          { className: 'text-3xl font-bold text-gray-900 dark:text-white mb-2' },
          'Orchestra - Create Super VMs'
        ),
        React.createElement(
          'p',
          { className: 'text-gray-600 dark:text-gray-400' },
          'Distributed Computing Dashboard'
        )
      ),

      // Loading Spinner
      React.createElement(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 0.3, duration: 0.5 },
          className: 'mb-6',
        },
        React.createElement(
          'div',
          { className: 'relative' },
          React.createElement(motion.div, {
            animate: { rotate: 360 },
            transition: { duration: 2, repeat: Infinity, ease: 'linear' },
            className:
              'w-12 h-12 border-4 border-blue-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-500 rounded-full mx-auto',
          }),
          React.createElement(
            motion.div,
            {
              animate: {
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              },
              transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              className: 'absolute inset-0 flex items-center justify-center',
            },
            React.createElement(Activity, {
              className: 'w-6 h-6 text-blue-600 dark:text-blue-500',
            })
          )
        )
      ),

      // Loading Text
      React.createElement(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 0.6, duration: 0.5 },
          className: 'space-y-2',
        },
        React.createElement(
          'p',
          { className: 'text-gray-600 dark:text-gray-400 font-medium' },
          'Initializing Super VM System...'
        ),
        React.createElement(
          'div',
          {
            className:
              'flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-500',
          },
          ...[
            ['Discovering VMs', Server, 0],
            ['Loading Resources', Activity, 0.5],
            ['Starting Services', Zap, 1],
          ].map(([text, Icon, delay], index) =>
            React.createElement(
              motion.div,
              {
                key: index,
                animate: { opacity: [0.5, 1, 0.5] },
                transition: { duration: 1.5, repeat: Infinity, delay },
                className: 'flex items-center',
              },
              React.createElement(Icon, { className: 'w-4 h-4 mr-1' }),
              React.createElement('span', null, text)
            )
          )
        )
      ),

      // Progress Bar
      React.createElement(
        motion.div,
        {
          initial: { opacity: 0, width: 0 },
          animate: { opacity: 1, width: '100%' },
          transition: { delay: 0.9, duration: 0.5 },
          className: 'mt-8 max-w-md mx-auto',
        },
        React.createElement(
          'div',
          { className: 'w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2' },
          React.createElement(motion.div, {
            initial: { width: 0 },
            animate: { width: '100%' },
            transition: { duration: 3, ease: 'easeInOut' },
            className:
              'bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full',
          })
        )
      )
    )
  );
};

export default LoadingSpinner;