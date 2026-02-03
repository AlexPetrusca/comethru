#!/bin/bash

# Script to deploy the backend application to Kubernetes
# Usage: IMAGE_TAG=<tag> ./deploy.sh
# If IMAGE_TAG is not provided, defaults to "latest"

set -e  # Exit on any error

# Use provided IMAGE_TAG or default to "latest"
IMAGE_TAG="${IMAGE_TAG:-latest}"

echo "Deploying backend with image tag: $IMAGE_TAG"

# Check if Helm is available
if ! command -v helm &> /dev/null; then
  echo "Helm is not installed or not in PATH"
  exit 1
fi

# Deploy using Helm with the main chart
echo "Deploying backend to Kubernetes namespace: comethru"
helm upgrade --install comethru ../comethru-chart \
  --namespace comethru \
  --set backend.enabled=true \
  --set backend.image=alexpetrusca/comethru-backend \
  --set backend.imageTag=$IMAGE_TAG \
  --set backend.pullPolicy=Always \
  --set backend.replicaCount=1 \
  --set backend.service.type=ClusterIP \
  --set backend.service.port=80 \
  --set backend.service.targetPort=8080 \
  --set postgresql.enabled=true \
  --wait

echo "Deployment completed!"
echo "Image: alexpetrusca/comethru-backend:$IMAGE_TAG"
echo "Namespace: comethru"
echo "Release: comethru"

# Show deployment status
kubectl get pods -n comethru
kubectl get svc -n comethru