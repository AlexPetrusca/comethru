#!/usr/bin/env bash

# Port-forward to access postgres and minio running in kubernetes.

pkill -f "kubectl port-forward svc/comethru-backend"
pkill -f "kubectl port-forward svc/comethru-postgresql"
pkill -f "kubectl port-forward svc/comethru-minio"
pkill -f "kubectl port-forward svc/comethru-minio-console"
pkill -f "kubectl port-forward svc/comethru-kafka"
pkill -f "kubectl port-forward svc/comethru-redis-master"
pkill -f "kubectl port-forward svc/comethru-prometheus-server"
pkill -f "kubectl port-forward svc/comethru-grafana"

kubectl port-forward svc/comethru-backend 8081:80 &
kubectl port-forward svc/comethru-postgresql 5432:5432 &
kubectl port-forward svc/comethru-minio 9000:9000 &
kubectl port-forward svc/comethru-minio-console 9001:9001 &
kubectl port-forward svc/comethru-kafka 9092:9092 &
kubectl port-forward svc/comethru-redis-master 6379:6379 &
kubectl port-forward svc/comethru-prometheus-server 9090:80 &
kubectl port-forward svc/comethru-grafana 3000:80