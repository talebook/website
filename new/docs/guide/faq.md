# 常见问题

## 网站能打开，但是提示 `500: internal server error`

一般是服务运行时出现异常，常见原因有目录权限未正确配置、数据库未创建好、或触发了代码 BUG。

**大多是因为 data 目录权限设置不正确导致启动异常**，请排查用户名、UID、目录权限等。

打开日志文件 `/data/log/talebook.log`，查看最后一次 Traceback，提 Issue 联系开发者排查。

## supervisord 启动失败

如果调整过 supervisord 配置（端口、目录），必须执行 `sudo supervisorctl reload all` 重新读取配置。

如果提示 `talebook:tornado-8000: ERROR(spawn error)`，说明环境未正确配置。查看 `/data/log/talebook.log` 中的 Traceback。

## 「静读天下」APP 访问书库失败

静读天下 APP 不支持 Cookie，导致登录失败。最新版系统已调整逻辑，无需登录即可浏览，仅在下载时检测权限。建议配置：

- 关闭「私人图书馆」模式

## 上传文件大小限制

- 程序抛出异常：Tornado 框架默认限制 100M，进入管理员配置中调大
- 提示 `413` 错误：一般是前置 Nginx 限制了上传大小，调整 `client_max_body_size` 配置

## 如何配置豆瓣插件

需启用 [douban-api-rs](https://github.com/cxfksword/douban-api-rs) 服务，将 URL 地址填写到高级配置项中。使用 `docker-compose` 启动的，URL 为 `http://douban-rs-api:80/`。

## Kindle 推送配置（QQ 邮箱）

进入 [QQ 邮箱设置](http://service.mail.qq.com/cgi-bin/help?subtype=1&&no=1001256&&id=28)，申请 SMTP 授权码，在管理员界面中配置。注意用户名须包含邮箱后缀（如 `@qq.com`）。

## 更多问题

如以上未能解决你的问题，请提交 [GitHub Issue](https://github.com/talebook/talebook/issues)。
