# Kubernetes Deployment

Talebook provides Kubernetes deployment configs in the `kubernetes/` directory of the repository.

## Deployment Files

| File | Description |
|------|-------------|
| `talebook-deployment.yaml` | Talebook main service Deployment |
| `talebook-service.yaml` | Talebook main service Service |
| `talebook-claim0-persistentvolumeclaim.yaml` | Data persistent storage PVC |
| `douban-rs-api-deployment.yaml` | douban-api-rs Deployment (optional) |
| `douban-rs-api-service.yaml` | douban-api-rs Service (optional) |

## Quick Deploy

```bash
kubectl apply -f kubernetes/
```

## Configuration

Adjust before deploying:

- Environment variables and storage config in `talebook-deployment.yaml`
- Service type in `talebook-service.yaml` (default ClusterIP, change to NodePort or LoadBalancer for external access)
- Use a StorageClass that supports ReadWriteOnce for data persistence

## Initialization

After deployment, access the Service address and follow the web wizard to complete setup.
