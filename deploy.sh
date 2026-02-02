#!/bin/bash

# Top-level script to deploy all application components to Kubernetes
# Usage: IMAGE_TAG=<tag> ./deploy.sh
# If IMAGE_TAG is not provided, defaults to "latest"

set -e  # Exit immediately if a command exits with a non-zero status

# Use provided IMAGE_TAG or default to "latest"
IMAGE_TAG="${IMAGE_TAG:-latest}"

echo "Deploying all application components to Kubernetes with image tag: $IMAGE_TAG"

# Deploy backend first (so frontend can connect to it)
echo "Deploying backend..."
cd backend
IMAGE_TAG=$IMAGE_TAG ./deploy.sh
cd ..

# Deploy frontend
echo "Deploying frontend..."
cd frontend
IMAGE_TAG=$IMAGE_TAG ./deploy.sh
cd ..

echo "All components deployed successfully!"