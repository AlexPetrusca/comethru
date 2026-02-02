#!/bin/bash

set -e  # Exit on any error

# Parse command line arguments
ENVIRONMENT=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --prod|--production)
      ENVIRONMENT="prod"
      shift
      ;;
    --dev|--development)
      ENVIRONMENT="dev"
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--dev|--prod]"
      exit 1
      ;;
  esac
done

# Set defaults if not provided
if [ -z "$ENVIRONMENT" ]; then
  ENVIRONMENT="dev"
fi

echo "Deploying to $ENVIRONMENT environment"

# Set image tag based on environment
if [ "$ENVIRONMENT" == "prod" ]; then
  TAG="latest"
else
  TAG="latest"
fi

IMAGE_NAME="alexpetrusca/comethru-backend:$TAG"

echo "Building Docker image: $IMAGE_NAME"

# Build the Docker image
docker build -t $IMAGE_NAME .

echo "Pushing image to Docker Hub..."
docker push $IMAGE_NAME

echo "Updating Helm dependencies..."
helm repo update

echo "Deploying to Kubernetes namespace: comethru"

# Deploy using Helm
if [ "$ENVIRONMENT" == "prod" ]; then
  helm upgrade --install comethru-backend-dev ./comethru-backend-chart \
    --namespace comethru \
    --create-namespace \
    --set image.repository=alexpetrusca/comethru-backend \
    --set image.tag=$TAG \
    --set image.pullPolicy=Always \
    --set replicaCount=1 \
    --set service.type=ClusterIP \
    --set service.port=80 \
    --set service.targetPort=8080 \
    --wait
else
  # For dev environment
  helm upgrade --install comethru-backend-dev ./comethru-backend-chart \
    --namespace comethru \
    --create-namespace \
    --set image.repository=alexpetrusca/comethru-backend \
    --set image.tag=$TAG \
    --set image.pullPolicy=Always \
    --set replicaCount=1 \
    --set service.type=ClusterIP \
    --set service.port=80 \
    --set service.targetPort=8080 \
    --wait
fi

echo "Deployment completed!"
echo "Environment: $ENVIRONMENT"
echo "Image: $IMAGE_NAME"
echo "Namespace: comethru"
echo "Release: comethru-backend-dev"

# Show deployment status
kubectl get pods -n comethru
kubectl get svc -n comethru