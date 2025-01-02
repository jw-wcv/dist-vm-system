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