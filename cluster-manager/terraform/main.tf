provider "aleph" {}

resource "aleph_compute_instance" "worker" {
  count = 3
  name  = "DistributedComputeWorker"
  image = "aleph/node"
  cpu   = 2
  memory = 4096
  storage = 50

  authorized_keys = ["${var.ssh_public_key}"]

  network_interface {
    ipv6 = true
  }
}