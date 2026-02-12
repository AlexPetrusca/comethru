#!/usr/bin/env bash

# Top-level script to push all application components to Docker Hub
# Usage: ./push.sh [--dev|--prod]
# Default is --dev if no flag is provided

set -e  # Exit immediately if a command exits with a non-zero status

# Default environment
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

# Function to build and push
build_and_push() {
  local service_name=$1
  local image_name=$2
  local build_context=$3
  local dockerfile=$4

  echo "----------------------------------------------------------------"
  echo "Processing $service_name..."
  echo "Building Docker image: $image_name:$IMAGE_TAG"
  
  if [ -n "$dockerfile" ]; then
    docker build -t "$image_name:$IMAGE_TAG" -f "$dockerfile" "$build_context"
  else
    docker build -t "$image_name:$IMAGE_TAG" "$build_context"
  fi

  # For prod, also tag as latest
  if [ "$ENVIRONMENT" == "prod" ]; then
    echo "Tagging as latest for production"
    docker tag "$image_name:$IMAGE_TAG" "$image_name:latest"
  fi

  echo "Pushing image(s) to Docker Hub..."
  docker push "$image_name:$IMAGE_TAG"

  if [ "$ENVIRONMENT" == "prod" ]; then
    docker push "$image_name:latest"
  fi
  
  echo "$service_name pushed successfully!"
}

build_and_push "Backend" "alexpetrusca/comethru-backend" "./backend" ""
build_and_push "Frontend" "alexpetrusca/comethru-frontend" "./frontend" ""

echo "----------------------------------------------------------------"
echo "All components processed successfully!"
echo "Environment: $ENVIRONMENT"
echo "Backend Image: alexpetrusca/comethru-backend:$IMAGE_TAG"
echo "Frontend Image: alexpetrusca/comethru-frontend:$IMAGE_TAG"
if [ "$ENVIRONMENT" == "prod" ]; then
  echo "Also tagged as: latest"
fi