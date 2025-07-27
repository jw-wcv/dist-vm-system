# Dockerfile
# 
# Description: Docker container configuration for the main UI application
# 
# This Dockerfile creates a containerized version of the main UI application
# for the distributed VM system. It sets up a Node.js environment and
# serves the React frontend application.
# 
# Base Image: node:14 (Node.js runtime)
# Working Directory: /usr/src/app
# 
# Build Process:
#   1. Copy package.json and install dependencies
#   2. Copy all source code
#   3. Start the application with npm start
# 
# Inputs: 
#   - package.json (for dependencies)
#   - Source code files
# Outputs: 
#   - Containerized React application
#   - Development server running on port 3000
# 
# Usage: docker build -t main-ui . && docker run -p 3000:3000 main-ui

FROM node:14

WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY . .

CMD [ "npm", "start" ]