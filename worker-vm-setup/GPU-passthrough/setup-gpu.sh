#!/bin/bash

modprobe vfio-pci
GPU_ID=$(lspci | grep -i nvidia | cut -d ' ' -f 1)
echo "GPU ID: $GPU_ID"
echo "vfio-pci" > /sys/bus/pci/devices/0000:$GPU_ID/driver_override
modprobe -i vfio-pci