#!/bin/bash
# create-vm.sh
# 
# Description: Creates a new virtual machine using virt-install with predefined configuration
# 
# Inputs: None (uses hardcoded configuration)
# Outputs: Creates a new VM named 'aleph-vm' with the following specifications:
#   - 4 virtual CPUs
#   - 8GB RAM (8192 MB)
#   - 80GB disk size
#   - Ubuntu 20.04 OS variant
#   - Network bridge connection (virbr0)
#   - No graphics (headless)
#   - Serial console for access
#
# Prerequisites: 
#   - KVM/QEMU must be installed and configured
#   - virt-install command must be available
#   - virbr0 bridge must be configured
#   - Appropriate permissions to create VMs

virt-install \
  --name aleph-vm \
  --vcpus 4 \
  --memory 8192 \
  --disk size=80 \
  --os-variant ubuntu20.04 \
  --network bridge=virbr0 \
  --graphics none \
  --console pty,target_type=serial
