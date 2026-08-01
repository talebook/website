# Talebook Website

Talebook 官网通过 GitHub Actions 构建并部署到 GitHub Pages。

## 目录

- `site/`：当前官网源码，包括 React 首页与 VitePress 文档。
- `legacy/`：替换前的旧版主页及其静态资源。
- `.github/workflows/pages.yml`：GitHub Pages 构建与部署流程。

## 本地开发

```bash
npm install --prefix site
npm run dev --prefix site
```

官网默认运行在 `http://localhost:5173/`，文档默认运行在
`http://localhost:5174/docs/`。

## 构建

```bash
npm ci --prefix site --ignore-scripts
npm ci --prefix site/docs
npm run build:all --prefix site
```

完整发布产物位于 `site/dist/`：

- `site/dist/index.html` 发布到 `/`。
- `site/dist/docs/` 发布到 `/docs/`。
- `site/dist/legacy/` 发布到 `/legacy/`。

`site/dist/` 是生成目录，不提交到 Git；`main` 分支更新后由 GitHub
Actions 自动构建和部署。
