# Super VM Distributed Computing System

A comprehensive distributed computing system that aggregates multiple virtual machines into a unified "Super VM" for high-performance computing tasks.

## 🚀 Quick Start

### One-Command Startup

```bash
./start-super-vm-system.sh
```

This single command will:

- Start the cluster manager (Super VM API) on port 3000
- Start the web dashboard on port 5173
- Open the dashboard in your browser
- Display complete system information

### Manual Startup

```bash
# Terminal 1: Start Cluster Manager
cd cluster-manager
npm install
node index.js

# Terminal 2: Start Dashboard
cd main-ui
npm install
npm run dev
```

## 🏗️ System Architecture

### Core Components

1. **Cluster Manager** (`cluster-manager/`)

   - Super VM API server (port 3000)
   - Distributed task scheduler
   - VM management and orchestration
   - Resource pooling and allocation

2. **Web Dashboard** (`main-ui/`)

   - Modern React-based interface
   - Real-time monitoring and control
   - Task management and execution
   - Resource visualization

3. **Distributed Applications** (`distributed-apps/`)

   - Render engine for 3D rendering
   - File manager for synchronization
   - Browser automation tools

4. **Worker VM Setup** (`worker-vm-setup/`)
   - KVM virtualization setup
   - GPU passthrough configuration
   - VM creation and management scripts

## 📊 Dashboard Features

### 🏠 Dashboard Overview

- **Real-time System Status**: Live monitoring of Super VM health
- **Resource Utilization**: CPU, Memory, and GPU usage charts
- **Performance Metrics**: Task execution statistics and efficiency
- **Quick Actions**: One-click access to common operations
- **Recent Activity**: Latest task history and system events

### 🖥️ VM Manager

- **Complete VM Overview**: List all virtual machines in the cluster
- **Status Monitoring**: Real-time status (running, stopped, error)
- **Resource Allocation**: Per-VM CPU, memory, and GPU usage
- **Bulk Operations**: Start, stop, or delete multiple VMs
- **Individual Control**: Fine-grained VM management
- **Performance Tracking**: Uptime, task completion rates, health metrics

### ⚡ Task Manager

- **Task Monitoring**: Real-time view of all tasks (running, completed, failed)
- **Task Execution**: Submit new processing, rendering, or automation tasks
- **Performance Analytics**: Execution time, success rates, resource usage
- **Task History**: Complete audit trail of system activities
- **Filtering & Search**: Find tasks by type, status, or time range

### 📊 Resource Monitor

- **Real-time Charts**: Live resource utilization graphs
- **Historical Data**: Performance trends over time
- **Resource Allocation**: Detailed CPU, memory, and GPU breakdown
- **Performance Alerts**: Automatic notifications for thresholds
- **Capacity Planning**: Insights for scaling decisions

### ⚙️ Settings

- **System Configuration**: API endpoints, timeouts, connection settings
- **Performance Tuning**: Refresh intervals, monitoring options
- **User Preferences**: Theme, notifications, display options
- **Security Settings**: Authentication and access control

## 🔧 API Endpoints

### Core Super VM Endpoints

```bash
# System Status
GET /api/super-vm/status          # System status and health
GET /api/super-vm/resources       # Resource pool information
GET /api/super-vm/metrics         # Performance metrics

# Task Execution
POST /api/super-vm/process        # Data processing tasks
POST /api/super-vm/render         # 3D rendering tasks
POST /api/super-vm/browser        # Browser automation tasks
POST /api/super-vm/sync           # File synchronization tasks

# System Scaling
POST /api/super-vm/scale          # Scale the system
```

### VM Management

```bash
GET /api/vms                      # List all VMs
POST /api/vms                     # Create new VM
DELETE /api/vms/:id               # Delete VM
```

### Task Management

```bash
GET /api/tasks                    # List all tasks
GET /api/tasks/:id                # Get specific task details
```

### Node Management

```bash
GET /api/nodes                    # List all nodes
GET /api/nodes/:id                # Get specific node details
```

### Health Check

```bash
GET /api/health                   # System health status
```

## 💻 Usage Examples

### Data Processing

```bash
curl -X POST http://localhost:3000/api/super-vm/process \
  -H 'Content-Type: application/json' \
  -d '{
    "inputData": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "operation": "sort",
    "parameters": {
      "cpu": 2,
      "memory": 2048
    }
  }'
```

### 3D Rendering

```bash
curl -X POST http://localhost:3000/api/super-vm/render \
  -H 'Content-Type: application/json' \
  -d '{
    "sceneFile": "/path/to/scene.blend",
    "frameStart": 1,
    "frameEnd": 100,
    "options": {
      "quality": "high",
      "resolution": "1920x1080"
    }
  }'
```

### Browser Automation

```bash
curl -X POST http://localhost:3000/api/super-vm/browser \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "https://example.com",
    "actions": [
      {"action": "click", "selector": "#button"},
      {"action": "wait", "time": 2000},
      {"action": "screenshot", "filename": "result.png"}
    ],
    "options": {
      "headless": true,
      "screenshot": true
    }
  }'
```

### System Scaling

```bash
curl -X POST http://localhost:3000/api/super-vm/scale \
  -H 'Content-Type: application/json' \
  -d '{"nodes": 2}'
```

## 🛠️ Development

### Project Structure

```
dist-vm-system/
├── cluster-manager/           # Super VM API and orchestration
│   ├── index.js              # Main API server
│   ├── super-vm.js           # Super VM interface
│   ├── distributed-scheduler.js # Task scheduling
│   ├── vmManager.js          # VM management
│   ├── worker-api.js         # Worker node API
│   └── ansible/              # Infrastructure automation
├── main-ui/                  # Web dashboard
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/           # Dashboard pages
│   │   ├── context/         # State management
│   │   └── App.jsx          # Main app
│   └── package.json
├── distributed-apps/         # Distributed applications
│   ├── render-engine/        # 3D rendering
│   ├── browser/             # Browser automation
│   └── distributed-file-manager/ # File sync
├── worker-vm-setup/          # VM setup scripts
└── start-super-vm-system.sh  # Complete startup script
```

### Key Technologies

#### Backend (Cluster Manager)

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client
- **UUID** - Unique identifiers
- **Node Forge** - Cryptography

#### Frontend (Dashboard)

- **React 18** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications

#### Infrastructure

- **Docker** - Containerization
- **KVM** - Virtualization
- **Ansible** - Automation
- **Terraform** - Infrastructure as Code

## 🔍 Monitoring and Debugging

### Dashboard Monitoring

- Real-time resource utilization
- Task execution progress
- System health indicators
- Performance metrics

### API Health Checks

```bash
# Check system health
curl http://localhost:3000/api/health

# Check Super VM status
curl http://localhost:3000/api/super-vm/status

# Check resource pool
curl http://localhost:3000/api/super-vm/resources
```

### Logs and Debugging

- Cluster manager logs: Check terminal output
- Dashboard logs: Browser developer console
- API logs: HTTP response headers and status codes

## 🚀 Deployment

### Local Development

1. Clone the repository
2. Install dependencies: `npm install` in both `cluster-manager/` and `main-ui/`
3. Start the system: `./start-super-vm-system.sh`

### Production Deployment

1. Build the dashboard: `cd main-ui && npm run build`
2. Set up reverse proxy (nginx) for the dashboard
3. Use PM2 or similar for process management
4. Configure environment variables for production settings

### Docker Deployment

```bash
# Build and run cluster manager
cd cluster-manager
docker build -t super-vm-cluster .
docker run -p 3000:3000 super-vm-cluster

# Build and run dashboard
cd main-ui
docker build -t super-vm-dashboard .
docker run -p 5173:5173 super-vm-dashboard
```

## 🔧 Configuration

### Environment Variables

```bash
# Cluster Manager
SUPER_VM_API_PORT=3000
SUPER_VM_REFRESH_INTERVAL=5000
SUPER_VM_MAX_RETRIES=3

# Dashboard
VITE_API_BASE_URL=http://localhost:3000/api
VITE_REFRESH_INTERVAL=5000
```

### Customization

- **API Endpoints**: Modify `cluster-manager/index.js`
- **Dashboard UI**: Edit `main-ui/src/` components
- **Task Types**: Add new task handlers in `cluster-manager/`
- **VM Configuration**: Update `cluster-manager/ansible/` scripts

## 🛡️ Security

### Authentication

- SSH key-based VM access
- API authentication (configurable)
- Secure communication between nodes

### Network Security

- Firewall configuration for VM access
- Secure API endpoints
- Encrypted data transmission

## 📈 Performance Optimization

### Resource Management

- Dynamic resource allocation
- Load balancing across nodes
- Automatic scaling based on demand

### Task Optimization

- Parallel task execution
- Resource-aware scheduling
- Fault tolerance and recovery

## 🔄 Updates and Maintenance

### System Updates

1. Pull latest changes: `git pull origin main`
2. Update dependencies: `npm install` in both directories
3. Restart the system: `./start-super-vm-system.sh`

### Backup and Recovery

- Regular VM snapshots
- Configuration backups
- Task history preservation

## 📞 Support and Troubleshooting

### Common Issues

#### Dashboard Won't Load

- Check if cluster manager is running on port 3000
- Verify API endpoints are accessible
- Check browser console for errors

#### Tasks Not Executing

- Verify VM nodes are running and accessible
- Check network connectivity between nodes
- Review task logs for specific errors

#### Resource Issues

- Monitor resource utilization in dashboard
- Scale system if needed: `POST /api/super-vm/scale`
- Check individual VM resource usage

### Getting Help

1. Check the logs in the terminal
2. Review the dashboard for error messages
3. Test API endpoints directly with curl
4. Check system health: `GET /api/health`

## 🎯 Use Cases

### Data Processing

- Large-scale data analysis
- Machine learning model training
- Scientific computing
- Batch processing workflows

### 3D Rendering

- Animation rendering
- Architectural visualization
- Product design rendering
- Gaming asset creation

### Web Automation

- Web scraping at scale
- Automated testing
- Content generation
- Social media management

### File Operations

- Large file synchronization
- Backup operations
- Data migration
- Content distribution

## 🔮 Future Enhancements

### Planned Features

- **GPU Acceleration**: Enhanced GPU support for compute tasks
- **Machine Learning**: Built-in ML model training and inference
- **Container Orchestration**: Kubernetes integration
- **Multi-cloud Support**: AWS, Azure, GCP integration
- **Advanced Analytics**: Predictive scaling and optimization
- **Mobile App**: Native mobile dashboard

### Scalability Improvements

- **Auto-scaling**: Automatic VM provisioning based on demand
- **Load Balancing**: Advanced load distribution algorithms
- **Fault Tolerance**: Enhanced error recovery and redundancy
- **Performance Monitoring**: Advanced metrics and alerting

---

## 📄 License

This project is part of the Super VM distributed computing system. See the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

For more information, see the individual component README files and documentation.
