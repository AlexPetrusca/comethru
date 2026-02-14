#!/usr/bin/env bash

# Top-level script to deploy all application components to Kubernetes
# Usage: IMAGE_TAG=<tag> ./deploy.sh
# If IMAGE_TAG is not provided, defaults to "latest"

set -e  # Exit immediately if a command exits with a non-zero status

# Use provided IMAGE_TAG or default to "latest"
IMAGE_TAG="${IMAGE_TAG:-latest}"
NAMESPACE="comethru"
RELEASE_NAME="comethru"
FORCE_RECREATE=false

# Parse flags
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -f|--force) FORCE_RECREATE=true ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

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

# Wipe the namespace (if requested)
if [ "$FORCE_RECREATE" = true ]; then
    echo "Uninstalling previous release..."
    helm uninstall $RELEASE_NAME --namespace comethru --ignore-not-found --wait
fi

# Build Helm dependencies
echo "Updating Helm dependencies..."
helm dependency build comethru-chart

# Deploy using Helm
echo "Deploying to Kubernetes namespace: $NAMESPACE"
helm upgrade --install "$RELEASE_NAME" ./comethru-chart \
  --namespace "$NAMESPACE" --create-namespace \
  -f ./comethru-chart/values.yaml -f ./comethru-chart/values.secret.yaml \
  --set backend.image=alexpetrusca/comethru-backend \
  --set backend.imageTag="$IMAGE_TAG" \
  --set backend.pullPolicy=Always \
  --wait

#echo "Restarting deployments to ensure latest images are pulled..."
#kubectl rollout restart deployment/comethru-backend -n "$NAMESPACE" 2>/dev/null || true
#kubectl rollout status deployment/comethru-backend -n "$NAMESPACE" --timeout=300s

# Build and upload frontend to s3/minio
echo "Building frontend..."
(cd ./frontend/scripts && ./deploy.sh)

echo "Deployment completed successfully!"
echo "Namespace: $NAMESPACE"
echo "Release: $RELEASE_NAME"
echo ""
echo "Services:"
kubectl get svc -n "$NAMESPACE"