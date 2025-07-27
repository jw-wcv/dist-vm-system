# Dockerfile
# 
# Description: Docker container configuration for distributed file manager
# 
# This Dockerfile creates a containerized file synchronization service for
# the distributed VM system. It provides a Flask-based API for file
# management and synchronization across worker VMs.
# 
# Base Image: python:3.8 (Python runtime environment)
# Working Directory: /app/
# 
# Build Process:
#   1. Use Python 3.8 base image
#   2. Copy sync service script to /app/ directory
#   3. Install Flask web framework
#   4. Execute sync service on container start
# 
# Inputs: 
#   - sync-service.py (Flask file synchronization API)
# Outputs: 
#   - Containerized file synchronization service
#   - REST API for file operations
#   - Cross-VM file management capabilities
# 
# Usage: docker build -t file-manager . && docker run -p 5000:5000 file-manager

FROM python:3.8
COPY sync-service.py /app/
RUN pip install flask
CMD ["python", "/app/sync-service.py"]