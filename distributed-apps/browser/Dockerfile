# Dockerfile
# 
# Description: Docker container configuration for browser automation
# 
# This Dockerfile creates a containerized browser environment for web
# automation tasks in the distributed VM system. It provides Firefox
# with X11 support for headless browser operations.
# 
# Base Image: ubuntu:20.04 (Ubuntu Linux)
# Working Directory: /app
# 
# Build Process:
#   1. Use Ubuntu 20.04 base image
#   2. Install Firefox browser and X11 applications
#   3. Copy application files to /app directory
#   4. Launch Firefox on container start
# 
# Inputs: 
#   - app/ directory (browser automation scripts)
# Outputs: 
#   - Containerized Firefox browser environment
#   - Web automation capabilities
#   - X11 display support for GUI operations
# 
# Usage: docker build -t browser-automation . && docker run browser-automation
# 
# Note: Requires X11 forwarding or virtual display for GUI operations

FROM ubuntu:20.04
RUN apt-get update && apt-get install -y firefox x11-apps
COPY app /app
CMD ["firefox"]