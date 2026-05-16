# 问心三十二相 · Heart Mirror

一面照见自己的中式人格之镜。融合中国传统文化与现代心理学，38 道题、7 个维度、32 种画像。

## 目录结构

```
my-test-website/
├── index.html              首页（开场）
├── test.html               答题页（38 题）
├── result.html             结果页（含 PDF 导出）
├── about.html              关于页
│
├── css/
│   └── style.css           全站样式
│
├── js/
│   ├── main.js             本地存储 / fetch 工具
│   ├── scoring.js          计分引擎
│   ├── matching.js         画像匹配引擎
│   ├── share.js            PDF / 图片导出
│   └── vendor/
│       ├── html2canvas.min.js
│       └── jspdf.umd.min.js
│
├── data/
│   ├── questions.json      38 题题库
│   ├── types.json          32 种主相画像
│   ├── traits.json         4 种副标签
│   ├── matches.json        三种关系匹配
│   ├── relations.json      （备用）
│   └── wuxing.json         （备用）
│
└── assets/
    └── images/             （预留图片目录）
```

## 技术栈

- 原生 HTML / CSS / JavaScript
- [Alpine.js 3.x](https://alpinejs.dev/)（CDN：unpkg）— 响应式数据绑定
- [Chart.js 4.x](https://www.chartjs.org/)（CDN：jsdelivr）— 雷达图
- [html2canvas](https://html2canvas.hertzen.com/) + [jsPDF](https://github.com/parallax/jsPDF)（**本地托管**）— 卡片截图 / PDF 导出
- Noto Serif SC / Noto Sans SC（CDN：Google Fonts）

> Alpine.js、Chart.js、Google Fonts 来自 CDN；如果服务器在内网或国内 CDN 受限，可下载到 `js/vendor/` 改为本地引用（参考 html2canvas / jsPDF 的做法）。

## 核心功能

| 页面 | 功能 |
|---|---|
| `index.html` | 开场介绍，进入测试 |
| `test.html` | 38 道题，分情境/单题/复合/终章四类，含断点续答 |
| `result.html` | 计算人格画像，五常 + 五行雷达图，男女代表人物切换，PDF 导出 |
| `about.html` | 测试原理、维度说明、隐私声明 |

## 部署

### 方式 A：静态托管（推荐）

任何静态文件服务器都可直接托管整个目录。注意：

1. 所有文件必须通过 **HTTP/HTTPS** 访问，不能直接打开 `file://`（fetch JSON 会被浏览器拦截）
2. 默认入口为 `index.html`

#### Nginx 示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/my-test-website;
    index index.html;

    # SPA 兜底（非必需，但便于直接访问子页）
    location / {
        try_files $uri $uri/ =404;
    }
}
```

#### Apache 示例

把整个项目上传到 `htdocs` 或 `www` 目录即可，无需额外配置。

#### 宝塔 / 1Panel

新建站点 → 上传所有文件到站点根目录 → 完成。

### 方式 B：GitHub Pages

仓库设置 → Pages → Source 选择 `main` 分支根目录 → 等待 1-3 分钟自动部署。

### 方式 C：Vercel / Netlify

把整个目录拖到 Vercel / Netlify 的 Drop Zone 即可，无需构建步骤。

## 本地预览

由于使用了 `fetch()`，必须用本地 HTTP 服务器预览，不能双击打开 HTML。

```bash
# Python 内置（推荐）
python3 -m http.server 8000

# 或 Node.js
npx serve .
```

打开 `http://localhost:8000/`。

## 数据隐私

测试在浏览器本地运行，答题数据存于 `localStorage`，**不上传任何服务器**。清浏览器数据即可彻底删除记录。

## License

私人项目，未授权请勿商用。
