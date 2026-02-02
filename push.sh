#!/bin/bash

# Top-level script to push all application components to Docker Hub
# Usage: ./push.sh [--dev|--prod]
# Default is --dev if no flag is provided

set -e  # Exit immediately if a command exits with a non-zero status

# Default environment
ENVIRONMENT="dev"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dev)
      ENVIRONMENT="dev"
      shift
      ;;
    --prod)
      ENVIRONMENT="prod"
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--dev|--prod]"
      exit 1
      ;;
  esac
done

echo "Pushing all application components to Docker Hub in $ENVIRONMENT mode..."

# Push frontend
echo "Pushing frontend..."
cd frontend
./push.sh --$ENVIRONMENT
cd ..

# Push backend
echo "Pushing backend..."
cd backend
./push.sh --$ENVIRONMENT
cd ..

echo "All components pushed successfully!"