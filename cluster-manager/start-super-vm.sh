#!/bin/bash
# start-super-vm.sh
# 
# Description: Startup script for the distributed VM system and Super VM
# 
# This script initializes the entire distributed VM system, including
# VM provisioning, worker node setup, and Super VM initialization.
# It provides a one-command solution to get the distributed system running.
# 
# Process:
#   1. Check system prerequisites
#   2. Initialize Aleph network connection
#   3. Create worker VMs if needed
#   4. Setup worker node APIs
#   5. Start cluster manager with Super VM
#   6. Display system status and usage information
# 
# Inputs: None (uses configuration from constants.js)
# Outputs: 
#   - Running distributed VM system
#   - Active Super VM with aggregated resources
#   - Ready for distributed computing tasks
# 
# Prerequisites:
#   - Node.js installed
#   - Docker installed and running
#   - Internet connectivity
#   - Aleph network access
# 
# Usage: ./start-super-vm.sh

set -e  # Exit on any error

echo "🚀 Starting Distributed VM System and Super VM..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking system prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

print_success "Prerequisites check passed"

# Install dependencies
print_status "Installing Node.js dependencies..."
if [ -f "package.json" ]; then
    npm install
    print_success "Dependencies installed"
else
    print_warning "No package.json found, skipping dependency installation"
fi

# Build Docker images
print_status "Building Docker images for distributed applications..."

# Build render engine
if [ -d "distributed-apps/render-engine" ]; then
    print_status "Building render engine image..."
    cd distributed-apps/render-engine
    docker build -t render-engine .
    cd ../..
    print_success "Render engine image built"
fi

# Build file manager
if [ -d "distributed-apps/distributed-file-manager" ]; then
    print_status "Building file manager image..."
    cd distributed-apps/distributed-file-manager
    docker build -t file-manager .
    cd ../..
    print_success "File manager image built"
fi

# Build browser automation
if [ -d "distributed-apps/browser" ]; then
    print_status "Building browser automation image..."
    cd distributed-apps/browser
    docker build -t browser-automation .
    cd ../..
    print_success "Browser automation image built"
fi

# Initialize Aleph network connection
print_status "Initializing Aleph network connection..."
cd cluster-manager

# Check if we have SSH keys
print_status "Checking SSH key management..."
node -e "
    import('../config/keys/keyManager.js').then(async (keyManager) => {
        try {
            const keys = await keyManager.listKeys();
            if (keys.length === 0) {
                console.log('No SSH keys found. Creating new SSH key pair...');
                await keyManager.generateKey('cluster-vm-key');
                console.log('SSH key created successfully');
            } else {
                console.log('Found', keys.length, 'existing SSH keys');
            }
        } catch (error) {
            console.error('SSH key management error:', error);
            process.exit(1);
        }
    });
"

# Discover existing VMs
print_status "Discovering existing VMs..."
node -e "
    import('./vmManager.js').then(async (vmManager) => {
        try {
            const vms = await vmManager.listVMInstances();
            console.log('Found', vms.length, 'existing VMs');
            if (vms.length === 0) {
                console.log('No VMs found. Creating new VM...');
                await vmManager.createVMInstance();
                console.log('New VM created successfully');
            }
        } catch (error) {
            console.error('Error discovering VMs:', error);
        }
    });
"

# Wait for VMs to be ready
print_status "Waiting for VMs to be ready..."
sleep 30

# Start worker node APIs (in background)
print_status "Starting worker node APIs..."
# In a real implementation, you would start the worker APIs on each VM
# For now, we'll simulate this
print_warning "Worker APIs would be started on each VM in production"

# Start the cluster manager with Super VM
print_status "Starting cluster manager with Super VM..."
print_status "The Super VM will be available at http://localhost:3000"

# Start the server
node index.js &
CLUSTER_PID=$!

# Wait a moment for the server to start
sleep 5

# Check if the server started successfully
if kill -0 $CLUSTER_PID 2>/dev/null; then
    print_success "Cluster manager started successfully (PID: $CLUSTER_PID)"
else
    print_error "Failed to start cluster manager"
    exit 1
fi

# Display system information
echo ""
echo "🎉 Distributed VM System Started Successfully!"
echo "=============================================="
echo ""
echo "📊 System Status:"
echo "   Cluster Manager: http://localhost:3000"
echo "   Super VM API: http://localhost:3000/api/super-vm/status"
echo "   Health Check: http://localhost:3000/api/health"
echo ""
echo "🔧 Available Endpoints:"
echo "   GET  /api/super-vm/status     - Super VM status"
echo "   GET  /api/super-vm/resources  - Resource pool information"
echo "   GET  /api/super-vm/metrics    - Performance metrics"
echo "   POST /api/super-vm/render     - Distributed rendering"
echo "   POST /api/super-vm/process    - Data processing"
echo "   POST /api/super-vm/browser    - Browser automation"
echo "   POST /api/super-vm/sync       - File synchronization"
echo "   POST /api/super-vm/scale      - Scale the system"
echo ""
echo "💡 Example Usage:"
echo "   # Check Super VM status"
echo "   curl http://localhost:3000/api/super-vm/status"
echo ""
echo "   # Render a scene across multiple nodes"
echo "   curl -X POST http://localhost:3000/api/super-vm/render \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"sceneFile\":\"/path/to/scene.blend\",\"frameStart\":1,\"frameEnd\":100}'"
echo ""
echo "   # Process data in parallel"
echo "   curl -X POST http://localhost:3000/api/super-vm/process \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"inputData\":[1,2,3,4,5],\"operation\":\"sort\"}'"
echo ""
echo "   # Scale the system"
echo "   curl -X POST http://localhost:3000/api/super-vm/scale \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"nodes\":2}'"
echo ""
echo "🛑 To stop the system:"
echo "   kill $CLUSTER_PID"
echo ""

# Function to handle shutdown
cleanup() {
    print_status "Shutting down distributed VM system..."
    if kill -0 $CLUSTER_PID 2>/dev/null; then
        kill $CLUSTER_PID
        print_success "Cluster manager stopped"
    fi
    print_success "Distributed VM system shutdown complete"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep the script running
print_status "System is running. Press Ctrl+C to stop."
while true; do
    sleep 10
    # Check if the cluster manager is still running
    if ! kill -0 $CLUSTER_PID 2>/dev/null; then
        print_error "Cluster manager stopped unexpectedly"
        exit 1
    fi
done 