#!/bin/bash

# Script to build and push the backend image to Docker Hub
# Usage: ./push.sh [--dev|--prod]
# Default is --dev if no flag is provided

set -e  # Exit immediately if a command exits with a non-zero status

# Default values
ENVIRONMENT="dev"
IMAGE_TAG="latest"

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
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--dev|--prod]"
      exit 1
      ;;
  esac
done

echo "Building and pushing to $ENVIRONMENT environment with tag: $IMAGE_TAG"

# Check if we're logged into Docker Hub
if ! docker info | grep -q "Username:"; then
  echo "Please log in to Docker Hub first:"
  echo "docker login"
  exit 1
fi

# Build the Docker image
echo "Building Docker image: alexpetrusca/comethru-backend:$IMAGE_TAG"
docker build -t alexpetrusca/comethru-backend:$IMAGE_TAG .

# For prod, also tag as latest
if [ "$ENVIRONMENT" == "prod" ]; then
  echo "Tagging as latest for production"
  docker tag alexpetrusca/comethru-backend:$IMAGE_TAG alexpetrusca/comethru-backend:latest
fi

# Push the image(s) to Docker Hub
echo "Pushing image(s) to Docker Hub..."
docker push alexpetrusca/comethru-backend:$IMAGE_TAG

if [ "$ENVIRONMENT" == "prod" ]; then
  docker push alexpetrusca/comethru-backend:latest
fi

echo "Image(s) pushed successfully!"
echo "Image: alexpetrusca/comethru-backend:$IMAGE_TAG"
if [ "$ENVIRONMENT" == "prod" ]; then
  echo "Also tagged as: alexpetrusca/comethru-backend:latest"
fi