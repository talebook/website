# Docker Deployment

Talebook provides Docker images for quick setup on any Docker-capable system.

Image: [talebook/talebook](https://hub.docker.com/r/talebook/talebook)

![Docker Pulls](https://img.shields.io/docker/pulls/talebook/talebook.svg)

## Docker Compose (Recommended)

```bash
wget https://raw.githubusercontent.com/talebook/talebook/master/docker-compose.yml
docker-compose -f docker-compose.yml up -d
```

To change mount directories or ports, edit `docker-compose.yml`.

## Docker CLI

```bash
docker run -d --name talebook -p <host_port>:80 -v <host_data_dir>:/data talebook/talebook
```

Example:

```bash
docker run -d --name talebook -p 8080:80 -v /tmp/demo:/data talebook/talebook
```

## Initialization

After startup, visit `http://localhost:8080` and follow the web wizard to complete setup.

## NAS Installation

Synology and other NAS users can refer to community guides:

- [Synology Docker Guide 1](https://post.smzdm.com/p/a992p6e0/)
- [Synology Docker Guide 2](https://post.smzdm.com/p/a3d7ox0k/)
- [UNAS Guide](https://odcn.top/2019/02/26/2734/)
