# port-forward.sh
#
# Port-forward to access postgres and minio running in kubernetes.

pkill -f "kubectl port-forward svc/comethru-postgresql"
pkill -f "kubectl port-forward svc/comethru-minio"
pkill -f "kubectl port-forward svc/comethru-minio-console"

kubectl port-forward svc/comethru-postgresql 5432:5432 &
kubectl port-forward svc/comethru-minio 9000:9000 &
kubectl port-forward svc/comethru-minio-console 9001:9001