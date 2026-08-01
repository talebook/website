# Docker 部署

Talebook 提供 Docker 镜像，可快速在任何支持 Docker 的系统上启动。

地址：[talebook/talebook](https://hub.docker.com/r/talebook/talebook)

![Docker Pulls](https://img.shields.io/docker/pulls/talebook/talebook.svg)

## Docker Compose（推荐）

```bash
wget https://raw.githubusercontent.com/talebook/talebook/master/docker-compose.yml
docker-compose -f docker-compose.yml up -d
```

如需修改挂载目录或端口，编辑 `docker-compose.yml` 即可。

## Docker 命令行

```bash
docker run -d --name talebook -p <本机端口>:80 -v <本机data目录>:/data talebook/talebook
```

例如：

```bash
docker run -d --name talebook -p 8080:80 -v /tmp/demo:/data talebook/talebook
```

## 初始化

启动后访问 `http://localhost:8080`，按网页指引完成初始化配置。

## NAS 安装

群晖等 NAS 用户可参考社区教程：

- [群晖 Docker 安装教程一](https://post.smzdm.com/p/a992p6e0/)
- [群晖 Docker 安装教程二](https://post.smzdm.com/p/a3d7ox0k/)
- [UNAS 安装教程](https://odcn.top/2019/02/26/2734/)
