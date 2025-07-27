# variables.tf
# 
# Description: Terraform variables definition for the distributed VM system
# 
# This file defines input variables used throughout the Terraform configuration
# for the distributed VM system. These variables allow for flexible configuration
# and secure credential management.
# 
# Variables:
#   - ssh_public_key: SSH public key string for VM access authentication
#     Type: string
#     Description: Public key used for SSH access to created VMs
#     Required: Yes
# 
# Usage: Set this variable when running terraform apply or via terraform.tfvars

variable "ssh_public_key" {
  description = "SSH public key for VM access"
}