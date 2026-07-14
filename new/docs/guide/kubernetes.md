# Kubernetes 部署

Talebook 提供 Kubernetes 部署配置文件，位于仓库 `kubernetes/` 目录下。

## 部署文件

| 文件 | 说明 |
|------|------|
| `talebook-deployment.yaml` | Talebook 主服务 Deployment |
| `talebook-service.yaml` | Talebook 主服务 Service |
| `talebook-claim0-persistentvolumeclaim.yaml` | 数据持久化存储 PVC |
| `douban-rs-api-deployment.yaml` | douban-api-rs Deployment（可选） |
| `douban-rs-api-service.yaml` | douban-api-rs Service（可选） |

## 快速部署

```bash
kubectl apply -f kubernetes/
```

## 配置说明

部署前请根据实际情况修改：

- `talebook-deployment.yaml` 中的环境变量和存储配置
- `talebook-service.yaml` 中的 Service 类型（默认 ClusterIP，如需外部访问可改为 NodePort 或 LoadBalancer）
- 数据持久化建议使用支持 ReadWriteOnce 的 StorageClass

## 初始化

部署完成后访问 Service 对应地址，按网页指引完成初始化配置。
