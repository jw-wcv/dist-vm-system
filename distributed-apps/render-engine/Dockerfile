# Dockerfile
# 
# Description: Docker container configuration for distributed render engine
# 
# This Dockerfile creates a containerized Blender-based render engine for
# distributed 3D rendering tasks in the VM system. It provides a complete
# rendering environment with Blender and custom render scripts.
# 
# Base Image: blender:latest (Blender with Python environment)
# Working Directory: /app/
# 
# Build Process:
#   1. Use Blender base image with Python support
#   2. Copy render script to /app/ directory
#   3. Execute render script on container start
# 
# Inputs: 
#   - render-script.py (Blender rendering automation)
# Outputs: 
#   - Containerized Blender render engine
#   - Automated rendering pipeline
# 
# Usage: docker build -t render-engine . && docker run render-engine

FROM blender:latest
COPY render-script.py /app/
CMD ["python", "/app/render-script.py"]