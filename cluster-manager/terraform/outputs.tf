# outputs.tf
# 
# Description: Terraform outputs for the distributed VM system
# 
# This file defines the output values that Terraform will provide after
# successfully creating the infrastructure. These outputs can be used by
# other systems or scripts to interact with the created resources.
# 
# Outputs:
#   - worker_ips: Array of IPv6 addresses for all created worker instances
#     Type: list(string)
#     Description: Network interface IPv6 addresses for SSH access
#     Usage: Can be used for connection scripts or monitoring
# 
# Dependencies: main.tf (aleph_compute_instance.worker resources)

output "worker_ips" {
  value = aleph_compute_instance.worker[*].network_interface[0].ipv6
}