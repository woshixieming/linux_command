# Linux 命令学习站

一个系统化学习 Linux 命令的在线平台，提供命令速查、分类学习和交互式练习。

## 技术栈

| 技术 | 说明 |
|------|------|
| **React 18** | UI 框架 |
| **TypeScript** | 类型安全 |
| **Vite** | 快速构建工具 |
| **Tailwind CSS** | 原子化 CSS |
| **shadcn/ui** | UI 组件库 |
| **Lucide React** | 图标库 |
| **React Router** | 路由管理 |

## 快速开始

### 安装依赖

```bash
cd app
npm install
```

### 开发模式

```bash
cd app
npm run dev
```

访问 http://localhost:4567

### 构建生产版本

```bash
npm run build
```

构建产物输出到 `app/dist` 目录。

### 预览生产版本

```bash
npm run preview
```

## 部署

### 自动部署

使用项目提供的部署脚本：

```bash
# 1. 编辑 deploy.sh 配置服务器信息
vim deploy.sh

# 2. 配置示例（SSH 密钥登录）
SSH_HOST="your-server.com"
SSH_USER="root"
SSH_KEY="~/.ssh/id_rsa"
SSH_PATH="/var/www/html"

# 3. 执行部署
./deploy.sh
```

### 手动部署

```bash
# 1. 构建
cd app && npm run build && cd ..

# 2. 同步到服务器
rsync -avz --delete \
  -e "ssh -i ~/.ssh/id_rsa" \
  app/dist/ \
  user@server:/var/www/html/
```

## 项目结构

```
linux/
├── app/
│   ├── src/
│   │   ├── components/     # UI 组件
│   │   ├── pages/           # 页面组件
│   │   ├── data/            # 命令数据
│   │   ├── App.tsx          # 主应用
│   │   └── main.tsx         # 入口文件
│   ├── public/              # 静态资源
│   ├── dist/                # 构建输出
│   ├── package.json
│   └── vite.config.ts
├── deploy.sh                # 部署脚本
└── README.md
```

## 页面说明

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | 命令分类展示 |
| 分类页 | `/category/:id` | 分类下所有命令 |
| 命令详情 | `/command/:id` | 单个命令详情 |
| Vim教程 | `/vim` | Vim 详细命令 |

## 命令分类

| 分类 | 说明 |
|------|------|
| 终端基础 | 文件管理、查看、搜索 |
| 系统管理 | 系统信息、进程、权限 |
| 网络工具 | 网络连接与传输 |
| 文本处理 | 文本编辑与压缩 |
| 软件包管理 | 包管理命令 |
| Vim编辑器 | Vim 命令教程 |
| Shell脚本 | Bash 脚本编程 |

## 更新日志

### v1.0.1 (2026-04-17)
- 优化首页导航栏自适应
- 修复 Vim 页面锚点跳转被遮挡问题
- 添加 Shell 脚本分类
- 完善 .gitignore 配置
- 新增部署脚本

### v1.0.0 (2026-04-14)
- 首页全新改版，支持分类浏览
- 命令详情页优化
- Vim 命令列表支持展开/收起
- 响应式设计优化
- 生产环境构建支持

## 常用命令

```bash
# 安装依赖
npm install

# 开发调试
npm run dev

# 类型检查
npm run lint

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## License

MIT
