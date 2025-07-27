# sync-service.py
# 
# Description: Flask-based file synchronization service for distributed VMs
# 
# This script provides a REST API for file synchronization across worker VMs
# in the distributed system. It allows VMs to upload and share files through
# a centralized service endpoint.
# 
# API Endpoints:
#   - POST /sync: Upload and save files to shared directory
#     Inputs: Multipart form data with 'file' field
#     Outputs: Success message with HTTP 200 status
# 
# Configuration:
#   - Host: 0.0.0.0 (binds to all interfaces)
#   - Port: 5000 (Flask default)
#   - Shared directory: /shared (for file storage)
# 
# Inputs: 
#   - HTTP POST requests with file uploads
#   - Multipart form data containing files
# Outputs: 
#   - Files saved to /shared directory
#   - HTTP response with status message
# 
# Dependencies:
#   - Flask web framework
#   - Write permissions to /shared directory
#   - Network access on port 5000

from flask import Flask, request
import os

app = Flask(__name__)

@app.route('/sync', methods=['POST'])
def sync_file():
    file = request.files['file']
    file.save(os.path.join('/shared', file.filename))
    return 'File synced successfully', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)