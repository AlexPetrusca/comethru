#!/bin/bash

# Script to build, push, and deploy the frontend application to Kubernetes
# Usage: ./deploy.sh [--dev|--prod]
# Default is --dev if no flag is provided

set -e  # Exit immediately if a command exits with a non-zero status

# Default values
ENVIRONMENT="dev"
IMAGE_TAG="latest"
HELM_VALUES_FILE=""
NAMESPACE="comethru"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dev)
      ENVIRONMENT="dev"
      IMAGE_TAG="latest"
      shift
      ;;
    --prod)
      ENVIRONMENT="prod"
      IMAGE_TAG="v$(date +%Y%m%d)-$(git rev-parse --short HEAD)"
      HELM_VALUES_FILE="--values ../comethru-chart/values-prod.yaml"
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--dev|--prod]"
      exit 1
      ;;
  esac
done

echo "Deploying to $ENVIRONMENT environment with tag: $IMAGE_TAG"

# Check if we're logged into Docker Hub
if ! docker info | grep -q "Username:"; then
  echo "Please log in to Docker Hub first:"
  echo "docker login"
  exit 1
fi

# Build the Docker image
echo "Building Docker image: alexpetrusca/comethru-frontend:$IMAGE_TAG"
docker build -t alexpetrusca/comethru-frontend:$IMAGE_TAG .. --file ../Dockerfile

# Tag the image for Docker Hub
docker tag alexpetrusca/comethru-frontend:$IMAGE_TAG alexpetrusca/comethru-frontend:$IMAGE_TAG

# Push the image to Docker Hub
echo "Pushing image to Docker Hub..."
docker push alexpetrusca/comethru-frontend:$IMAGE_TAG

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

# Deploy using Helm
RELEASE_NAME="comethru-frontend-$ENVIRONMENT"

echo "Deploying to Kubernetes namespace: $NAMESPACE"
if [ "$ENVIRONMENT" = "prod" ]; then
  helm upgrade --install $RELEASE_NAME ../comethru-chart \
    --namespace $NAMESPACE \
    --set frontend.image=alexpetrusca/comethru-frontend \
    --set frontend.imageTag=$IMAGE_TAG \
    $HELM_VALUES_FILE \
    --create-namespace
else
  helm upgrade --install $RELEASE_NAME ../comethru-chart \
    --namespace $NAMESPACE \
    --set frontend.image=alexpetrusca/comethru-frontend \
    --set frontend.imageTag=$IMAGE_TAG \
    --create-namespace
fi

echo "Deployment completed!"
echo "Environment: $ENVIRONMENT"
echo "Image: alexpetrusca/comethru-frontend:$IMAGE_TAG"
echo "Namespace: $NAMESPACE"
echo "Release: $RELEASE_NAME"

# Show deployment status
kubectl get pods -n $NAMESPACE