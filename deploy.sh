#!/bin/bash

# Top-level script to deploy all application components to Kubernetes
# Usage: IMAGE_TAG=<tag> ./deploy.sh
# If IMAGE_TAG is not provided, defaults to "latest"

set -e  # Exit immediately if a command exits with a non-zero status

# Use provided IMAGE_TAG or default to "latest"
IMAGE_TAG="${IMAGE_TAG:-latest}"
NAMESPACE="comethru"
RELEASE_NAME="comethru"

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

# Create namespace first if it doesn't exist
echo "Ensuring namespace exists..."
kubectl create namespace "$NAMESPACE" 2>/dev/null || echo "Namespace $NAMESPACE already exists"
kubectl label namespace "$NAMESPACE"  app.kubernetes.io/managed-by=Helm --overwrite
kubectl annotate namespace "$NAMESPACE" meta.helm.sh/release-name="$RELEASE_NAME" meta.helm.sh/release-namespace="$NAMESPACE" --overwrite

# Build Helm dependencies
echo "Updating Helm dependencies..."
helm dependency build comethru-chart

# Render and apply secrets separately using Helm template
echo "Rendering and applying secrets..."
helm template "$RELEASE_NAME" ./comethru-chart \
  --namespace "$NAMESPACE" \
  --show-only templates/secrets.yaml \
  | kubectl apply -f -

# Deploy using Helm
echo "Deploying to Kubernetes namespace: $NAMESPACE"
helm upgrade --install "$RELEASE_NAME" ./comethru-chart \
  --namespace "$NAMESPACE" \
  --set backend.image=alexpetrusca/comethru-backend \
  --set backend.imageTag="$IMAGE_TAG" \
  --set backend.pullPolicy=Always \
  --set frontend.image=alexpetrusca/comethru-frontend \
  --set frontend.imageTag="$IMAGE_TAG" \
  --set frontend.pullPolicy=Always \
  --wait

echo "Restarting deployments to ensure latest images are pulled..."
kubectl rollout restart deployment/comethru-backend -n "$NAMESPACE" 2>/dev/null || true
kubectl rollout restart deployment/comethru-frontend -n "$NAMESPACE" 2>/dev/null || true

echo "Waiting for rollout to complete..."
kubectl rollout status deployment/comethru-backend -n "$NAMESPACE" --timeout=300s
kubectl rollout status deployment/comethru-frontend -n "$NAMESPACE" --timeout=300s

echo "Deployment completed successfully!"
echo "Namespace: $NAMESPACE"
echo "Release: $RELEASE_NAME"
echo ""
echo "Services:"
kubectl get svc -n "$NAMESPACE"
echo ""
echo "Ingress:"
kubectl get ingress -n "$NAMESPACE"