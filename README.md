# Zone Slogger 个人站 + 简易内容管理

访客看到的是 **纯静态 HTML**（`index.html` + `articles/*.html` + `assets/`）。首页分区为 Hero / About / 精选项目 / 文章与笔记 / 工作之外 / 联系；文章详情页样式独立。  
本机可用管理后台改文案与图片，再「保存并发布」生成静态文件。

## 如何启动

```bash
cd zone-personal-site
python3 server.py
```

默认：

- 公共站点：http://127.0.0.1:8770/
- 管理后台：http://127.0.0.1:8770/admin

可用环境变量 `PORT` / `HOST` 修改监听地址。

仅重新生成静态文件（不启管理端）：

```bash
python3 build.py
```

## 首次设置密码

密码以加盐哈希存放在 `content/.admin-hash`（**不存明文**）。

- **已有哈希**：直接 `python3 server.py`，用你之前设好的密码登录。
- **首次 / 无哈希时**：
  - 交互终端会提示输入两次密码；或
  - `ADMIN_PASSWORD='你的密码' python3 server.py`（仅在尚无 `content/.admin-hash` 时写入）；或
  - 非交互环境会生成临时密码到项目根目录的 `.admin-password-initial.txt`（权限 600）。

改密码：删掉 `content/.admin-hash` 后重启，按提示重设；或用上面的 `ADMIN_PASSWORD` 在无哈希时写入新哈希。

## 各分区如何替换内容

登录 `/admin` 后，左侧导航与首页分区同名：

| 后台分区 | 对应首页 | 可编辑内容 |
| --- | --- | --- |
| **Hero** | 顶部 | 姓名、头像上传、一句话、简介；社交链接（邮箱 / X / LinkedIn / GitHub / **即刻**） |
| **About** | 关于 | 区头说明、正文段落；角色 / 领域 / 方法 |
| **精选项目** | 精选项目 | 标题、眉题/元信息、徽章、描述、链接、配图 |
| **文章与笔记** | 文章列表 | 新建 / 编辑 / 删除 Markdown 文章；入口可进「文章地图」（星图） |
| **工作之外** | 照片墙 | 区标题；每张：地点、可选备注、图片、排序 |
| **联系** | 联系 + 页脚 | 区标题、说明、邮箱、页脚左右文案 |

书架、兴趣表、旧标签已从后台导航隐藏（首页也不再渲染）。

流程：改字段 → **保存** 或 **保存并发布**（写入 `content/`、备份到 `content/.history/`、跑 `build.py`）。

## 如何上传照片

- **头像**：Hero →「上传头像」
- **项目配图**：精选项目 → 各项目「上传配图」
- **照片墙**：工作之外 → 各格「上传图片」（可先「添加照片」）

格式：JPG / PNG / WebP / GIF；**单文件上限 10 MB**。首页用 `object-fit: cover` 铺满头像与照片画框。上传文件落在 `assets/uploads/`。

## 如何去掉「示例」标记

示例不再塞进正文里转义，而是独立勾选：

- **工作之外**：每张照片的「显示『示例 ·』前缀」
- **About**：区头旁的「显示『示例 ·』前缀」
- **精选项目**：每项的「显示『 · 示例』标记」
- **文章**：编辑页的「显示『示例正文』提示」

取消勾选 → 保存并发布即可。

## 备份在哪

每次「保存并发布」会把当时的 `content/` 快照写入：

```
content/.history/<时间戳>/
```

可从该目录拷回 `site.json` 或文章 Markdown 做回滚。

## 导出静态站做托管

发布后，把公共文件放到任意静态托管（GitHub Pages / Cloudflare Pages / Netlify / Nginx / 对象存储）即可。至少需要：

```
index.html
articles/
assets/          # home.css styles.css site.js media/ uploads/
```

**不要**上传：`content/.admin-hash`、`.admin-password-initial.txt`、以及不必公开的 `server.py` / `build.py` / `content/` / `admin/`（除非你也要在服务器上继续用 CMS）。

常见做法：本机跑 CMS → 发布 → 只把静态文件推到 Pages；或 VPS 上跑 `python3 server.py` 并限制 `/admin`。

## 目录结构（简）

```
zone-personal-site/
  index.html          # 生成的首页
  articles/           # 生成的文章 HTML
  assets/             # 样式、脚本、媒体、uploads/
  content/
    site.json         # 站点内容
    articles/*.md     # 文章源
    .admin-hash       # 密码哈希（勿公开）
    .history/         # 发布备份
  build.py            # 静态生成
  server.py           # 静态托管 + 管理后台
  cms_*.py / admin/   # CMS 实现
```
