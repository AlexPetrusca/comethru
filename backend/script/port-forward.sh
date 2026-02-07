# port-forward.sh
#
# Port-forward to access postgres running in kubernetes.

kubectl port-forward svc/comethru-postgresql 5432:5432