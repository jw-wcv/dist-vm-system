# main.tf
# 
# Description: Main Terraform configuration for distributed compute infrastructure
# 
# This file defines the primary infrastructure resources for the distributed VM
# system using the Aleph provider. It creates multiple worker compute instances
# with consistent configuration for distributed processing workloads.
# 
# Inputs: 
#   - var.ssh_public_key: SSH public key for VM access
#   - count = 3: Number of worker instances to create
# Outputs: 
#   - 3 Aleph compute instances with:
#     - 4 vCPUs each
#     - 8GB RAM each
#     - 80GB storage each
#     - IPv6 network interfaces
#     - SSH access configured
# 
# Dependencies:
#   - Aleph Terraform provider
#   - variables.tf (for SSH key variable)
#   - outputs.tf (for output definitions)

provider "aleph" {}

resource "aleph_compute_instance" "worker" {
  count = 3
  name  = "DistributedComputeWorker"
  image = "aleph/node"
  cpu   = 4
  memory = 8192
  storage = 80

  authorized_keys = ["${var.ssh_public_key}"]

  network_interface {
    ipv6 = true
  }
}