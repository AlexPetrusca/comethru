#!/bin/bash

# Top-level script to deploy all application components to Kubernetes
# Usage: IMAGE_TAG=<tag> ./deploy.sh
# If IMAGE_TAG is not provided, defaults to "latest"

set -e  # Exit immediately if a command exits with a non-zero status

# Use provided IMAGE_TAG or default to "latest"
IMAGE_TAG="${IMAGE_TAG:-latest}"
NAMESPACE="comethru"

echo "Deploying application to Kubernetes with image tag: $IMAGE_TAG"

# Check prerequisites
if ! command -v kubectl &> /dev/null; then
  echo "Error: kubectl is not installed or not in PATH"
  exit 1
fi

if ! command -v helm &> /dev/null; then
  echo "Error: Helm is not installed or not in PATH"
  exit 1
fi

# Build Helm dependencies
echo "Updating Helm dependencies..."
helm dependency build comethru-chart

# Deploy using Helm
echo "Deploying to Kubernetes namespace: $NAMESPACE"
helm upgrade --install comethru ./comethru-chart \
  --namespace "$NAMESPACE" \
  --create-namespace \
  --set backend.enabled=true \
  --set backend.image=alexpetrusca/comethru-backend \
  --set backend.imageTag="$IMAGE_TAG" \
  --set backend.pullPolicy=Always \
  --set frontend.image=alexpetrusca/comethru-frontend \
  --set frontend.imageTag="$IMAGE_TAG" \
  --set frontend.pullPolicy=Always \
  --set postgresql.enabled=true \
  --wait

echo "Restarting deployments to ensure latest images are pulled..."
kubectl rollout restart deployment/comethru-backend -n "$NAMESPACE"
kubectl rollout restart deployment/comethru -n "$NAMESPACE" # Frontend deployment name from chart

echo "Waiting for rollout to complete..."
kubectl rollout status deployment/comethru-backend -n "$NAMESPACE" --timeout=300s
kubectl rollout status deployment/comethru -n "$NAMESPACE" --timeout=300s

echo "Deployment completed successfully!"
echo "Namespace: $NAMESPACE"
echo "Release: comethru"
echo ""
echo "Services:"
kubectl get svc -n "$NAMESPACE"
echo ""
echo "Ingress:"
kubectl get ingress -n "$NAMESPACE"