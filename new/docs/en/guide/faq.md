# FAQ

## Site loads but shows `500: internal server error`

Usually caused by runtime exceptions. Common reasons: incorrect directory permissions, uninitialized database, or code bugs.

**Most often due to incorrect `data` directory permissions.** Check the log file at `/data/log/talebook.log`, find the last traceback, and [file an issue](https://github.com/talebook/talebook/issues).

## supervisord failed to start

If you changed supervisord config (port, directory), run `sudo supervisorctl reload all` to reload.

If you see `talebook:tornado-8000: ERROR(spawn error)`, check `/data/log/talebook.log` for the traceback.

## Moon+ Reader can't access the library

Moon+ Reader doesn't support cookies, causing login failures. The latest version allows browsing without login and only checks permissions on download. Recommended config:

- Disable "Private Library" mode

## Upload file size limit

- App exception: Tornado default limit is 100MB, increase in admin settings
- `413` error: Usually Nginx `client_max_body_size` limit, adjust the config

## How to configure Douban plugin

Enable the [douban-api-rs](https://github.com/cxfksword/douban-api-rs) service and fill its URL in advanced settings. With `docker-compose`, use `http://douban-rs-api:80/`.

## Kindle delivery (QQ Mail)

Go to [QQ Mail settings](http://service.mail.qq.com/cgi-bin/help?subtype=1&&no=1001256&&id=28), apply for an SMTP auth code, and configure in the admin panel. The username must include the email suffix (e.g. `@qq.com`).

## More questions

If the above doesn't solve your issue, please [file a GitHub Issue](https://github.com/talebook/talebook/issues).
