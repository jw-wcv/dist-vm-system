#!/bin/bash
virt-install \
  --name aleph-vm \
  --vcpus 4 \
  --memory 8192 \
  --disk size=80 \
  --os-variant ubuntu20.04 \
  --network bridge=virbr0 \
  --graphics none \
  --console pty,target_type=serial
