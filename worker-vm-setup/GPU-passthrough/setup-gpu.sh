#!/bin/bash
# setup-gpu.sh
# 
# Description: GPU passthrough setup script for worker VMs
# 
# This script configures GPU passthrough for KVM virtual machines, enabling
# direct access to NVIDIA GPUs for compute-intensive tasks in the distributed
# VM system. It sets up the VFIO (Virtual Function I/O) framework for PCI
# device passthrough.
# 
# Process:
#   1. Load vfio-pci kernel module
#   2. Detect NVIDIA GPU device ID
#   3. Configure driver override for GPU
#   4. Bind GPU to vfio-pci driver
# 
# Inputs: None (automatically detects GPU)
# Outputs: 
#   - GPU bound to vfio-pci driver
#   - Console output with GPU ID
#   - Ready for VM passthrough configuration
# 
# Prerequisites:
#   - Root/sudo privileges
#   - NVIDIA GPU installed
#   - KVM/QEMU with VFIO support
#   - IOMMU enabled in BIOS
# 
# Usage: sudo ./setup-gpu.sh

modprobe vfio-pci
GPU_ID=$(lspci | grep -i nvidia | cut -d ' ' -f 1)
echo "GPU ID: $GPU_ID"
echo "vfio-pci" > /sys/bus/pci/devices/0000:$GPU_ID/driver_override
modprobe -i vfio-pci