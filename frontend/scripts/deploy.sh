#!/usr/bin/env bash

# Build frontend and upload to s3/minio

# Configuration
BUCKET_NAME="frontend"
DIST_PATH="../dist"
ENDPOINT="http://localhost:9000"

# Set credentials for the sub-shell/commands
export AWS_ACCESS_KEY_ID="comethru"
export AWS_SECRET_ACCESS_KEY="comethru-minio-password"

# 0. Package Frontend
npm install >/dev/null
npm run build

if pgrep -f "kubectl port-forward svc/comethru-minio" > /dev/null; then
    TEMP_TUNNEL=false
else
    TEMP_TUNNEL=true
    echo "Starting port-forward..."
    kubectl port-forward svc/comethru-minio 9000:9000 >/dev/null &
fi

if ! aws --endpoint-url "$ENDPOINT" s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
  echo "Creating bucket..."
  aws --endpoint-url $ENDPOINT s3 mb s3://$BUCKET_NAME 2>/dev/null || true

  POLICY='{
      "Version": "2012-10-17",
      "Statement": [{
          "Effect": "Allow",
          "Principal": {"AWS": ["*"]},
          "Action": ["s3:GetObject"],
          "Resource": ["arn:aws:s3:::'$BUCKET_NAME'/*"]
      }]
  }'

  echo "Applying public policy..."
  aws --endpoint-url $ENDPOINT s3api put-bucket-policy \
      --bucket $BUCKET_NAME \
      --policy "$POLICY"
fi

echo "Uploading files to bucket..."
aws --endpoint-url $ENDPOINT s3 sync $DIST_PATH s3://$BUCKET_NAME --acl public-read

if $TEMP_TUNNEL; then
  echo "Stopping port-forward..."
  pkill -f "kubectl port-forward svc/comethru-minio"
fi