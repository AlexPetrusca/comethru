#!/bin/bash

# Script to deploy the frontend application to Kubernetes
# Usage: IMAGE_TAG=<tag> ./deploy.sh
# If IMAGE_TAG is not provided, defaults to "latest"

set -e  # Exit immediately if a command exits with a non-zero status

# Use provided IMAGE_TAG or default to "latest"
IMAGE_TAG="${IMAGE_TAG:-latest}"

echo "Deploying frontend with image tag: $IMAGE_TAG"

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
  echo "kubectl is not installed or not in PATH"
  exit 1
fi

# Check if Helm is available
if ! command -v helm &> /dev/null; then
  echo "Helm is not installed or not in PATH"
  exit 1
fi

# Update Helm dependencies
echo "Updating Helm dependencies..."
helm dependency build ../comethru-chart

# Deploy using Helm
echo "Deploying to Kubernetes namespace: comethru"
helm upgrade --install comethru ../comethru-chart \
  --namespace comethru \
  --set frontend.image=alexpetrusca/comethru-frontend \
  --set frontend.imageTag=$IMAGE_TAG \
  --create-namespace

echo "Restarting deployment to pull latest image..."
kubectl rollout restart deployment/comethru -n comethru
kubectl rollout status deployment/comethru -n comethru --timeout=300s

echo "Deployment completed!"
echo "Image: alexpetrusca/comethru-frontend:$IMAGE_TAG"
echo "Namespace: comethru"
echo "Release: comethru"

# Show deployment status
kubectl get pods -n comethru
kubectl get svc -n comethru
kubectl get ingress -n comethru