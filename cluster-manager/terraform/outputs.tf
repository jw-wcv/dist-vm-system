output "worker_ips" {
  value = aleph_compute_instance.worker[*].network_interface[0].ipv6
}