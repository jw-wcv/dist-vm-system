# Super VM Dashboard

A modern, responsive web interface for managing the distributed Super VM system. This dashboard provides comprehensive monitoring, management, and control capabilities for the distributed virtual machine infrastructure.

## Features

### 🏠 Dashboard

- **Real-time System Overview**: Live status of the Super VM system
- **Resource Utilization**: CPU, Memory, and GPU usage with visual charts
- **Performance Metrics**: Task execution statistics and system efficiency
- **Quick Actions**: One-click access to common operations
- **Recent Activity**: Latest task history and system events

### 🖥️ VM Manager

- **VM Overview**: Complete list of all virtual machines in the cluster
- **Status Monitoring**: Real-time status of each VM (running, stopped, error)
- **Resource Allocation**: CPU, memory, and GPU usage per VM
- **Bulk Operations**: Start, stop, or delete multiple VMs at once
- **Individual Control**: Fine-grained control over each VM
- **Performance Tracking**: Uptime, task completion rates, and health metrics

### ⚡ Task Manager

- **Task Monitoring**: Real-time view of all running, completed, and failed tasks
- **Task Execution**: Submit new tasks for processing, rendering, or automation
- **Performance Analytics**: Execution time, success rates, and resource usage
- **Task History**: Complete audit trail of all system activities
- **Filtering & Search**: Find specific tasks by type, status, or time range

### 📊 Resource Monitor

- **Real-time Charts**: Live resource utilization graphs
- **Historical Data**: Performance trends over time
- **Resource Allocation**: Detailed breakdown of CPU, memory, and GPU usage
- **Performance Alerts**: Automatic notifications for resource thresholds
- **Capacity Planning**: Insights for scaling decisions

### ⚙️ Settings

- **System Configuration**: API endpoints, timeouts, and connection settings
- **Performance Tuning**: Refresh intervals, monitoring options
- **User Preferences**: Theme, notifications, and display options
- **Security Settings**: Authentication and access control

## Getting Started

### Prerequisites

- Node.js 16+ installed
- The Super VM cluster manager running on port 3000
- Modern web browser with JavaScript enabled

### Installation

1. **Install Dependencies**

   ```bash
   cd main-ui
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Build for Production**

   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

### Configuration

The dashboard automatically connects to the Super VM API at `http://localhost:3000/api`. To change this:

1. Edit `src/context/SuperVMContext.jsx`
2. Update the `API_BASE_URL` constant
3. Restart the development server

## Usage Guide

### Dashboard Overview

The dashboard provides a comprehensive overview of your Super VM system:

1. **System Status**: Check if the system is ready, starting, or experiencing errors
2. **Resource Utilization**: Monitor CPU, memory, and GPU usage across all nodes
3. **Quick Actions**: Execute common tasks with one click
4. **Recent Tasks**: View the latest task executions and their results

### Managing Virtual Machines

1. **View All VMs**: Navigate to VM Manager to see all virtual machines
2. **Monitor Status**: Each VM shows its current status, resource usage, and uptime
3. **Control VMs**: Start, stop, restart, or delete individual VMs
4. **Bulk Operations**: Select multiple VMs for batch operations
5. **Create New VMs**: Add new compute nodes to scale your system

### Task Management

1. **Submit Tasks**: Use the Task Manager to submit new processing tasks
2. **Monitor Progress**: Track task execution in real-time
3. **View Results**: Access task outputs and error messages
4. **Analyze Performance**: Review execution times and success rates

### Resource Monitoring

1. **Real-time Charts**: View live resource utilization graphs
2. **Historical Trends**: Analyze performance over time
3. **Capacity Planning**: Use insights to plan system scaling
4. **Alert Management**: Configure and monitor performance alerts

## API Integration

The dashboard integrates with the Super VM API endpoints:

### Core Endpoints

- `GET /api/super-vm/status` - System status
- `GET /api/super-vm/resources` - Resource pool information
- `GET /api/super-vm/metrics` - Performance metrics

### Task Endpoints

- `POST /api/super-vm/process` - Data processing tasks
- `POST /api/super-vm/render` - 3D rendering tasks
- `POST /api/super-vm/browser` - Browser automation tasks
- `POST /api/super-vm/sync` - File synchronization tasks

### VM Management

- `GET /api/vms` - List all VMs
- `POST /api/vms` - Create new VM
- `DELETE /api/vms/:id` - Delete VM

### Task Management

- `GET /api/tasks` - List all tasks
- `GET /api/tasks/:id` - Get specific task details

### Node Management

- `GET /api/nodes` - List all nodes
- `GET /api/nodes/:id` - Get specific node details

## Customization

### Themes

The dashboard supports both light and dark themes. Toggle between them using the theme button in the header.

### Styling

The interface uses Tailwind CSS for styling. Customize the appearance by modifying:

- `tailwind.config.js` - Tailwind configuration
- `src/styles.css` - Global styles
- Component-specific classes in each component

### Adding New Features

1. Create new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update the sidebar navigation in `src/components/Sidebar.jsx`
4. Add new API endpoints to the context in `src/context/SuperVMContext.jsx`

## Troubleshooting

### Connection Issues

- Ensure the Super VM cluster manager is running on port 3000
- Check network connectivity between the dashboard and API
- Verify API endpoint configuration in the context

### Performance Issues

- Reduce the refresh interval in settings for better performance
- Disable unnecessary monitoring features
- Check browser console for JavaScript errors

### Display Issues

- Clear browser cache and reload the page
- Check browser compatibility (Chrome, Firefox, Safari, Edge)
- Verify that JavaScript is enabled

## Development

### Project Structure

```
main-ui/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Main application pages
│   ├── context/       # React context for state management
│   ├── hooks/         # Custom React hooks
│   ├── App.jsx        # Main application component
│   └── index.js       # Application entry point
├── public/            # Static assets
├── package.json       # Dependencies and scripts
└── README.md         # This file
```

### Key Technologies

- **React 18** - UI framework
- **React Router** - Navigation and routing
- **Tailwind CSS** - Styling framework
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Contributing

1. Follow the existing code style and patterns
2. Add proper documentation for new features
3. Test changes thoroughly before submitting
4. Update this README for significant changes

## License

This project is part of the Super VM distributed computing system. See the main project LICENSE for details.
