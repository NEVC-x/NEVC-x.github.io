# 随文识字应用部署指南

## 🌐 在线部署选项

### 方法一：Netlify 部署（推荐）

1. **创建 GitHub 仓库**
   - 已完成：项目已初始化 Git 仓库

2. **推送到 GitHub**
   ```bash
   git remote add origin https://github.com/你的用户名/chinese-literacy-app.git
   git branch -M main
   git push -u origin main
   ```

3. **部署到 Netlify**
   - 访问 [netlify.com](https://netlify.com)
   - 点击 "New site from Git"
   - 选择 GitHub 仓库
   - 构建设置：
     - Build command: `npm run build`
     - Publish directory: `build`
   - 点击 "Deploy site"

4. **自定义域名（可选）**
   - 在 Netlify 设置中添加自定义域名

### 方法二：Vercel 部署

1. **创建 Vercel 账户**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 配置：
     - Build Command: `npm run build`
     - Output Directory: `build`
   - 点击 "Deploy"

### 方法三：GitHub Pages 部署

1. **更新 package.json**
   ```json
   "homepage": "https://你的用户名.github.io/chinese-literacy-app"
   ```

2. **推送代码**
   ```bash
   git push origin main
   ```

3. **启用 GitHub Pages**
   - 进入仓库 Settings
   - 找到 Pages 部分
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "main"
   - Folder 选择 "/ (root)"

## 📱 本地访问方式

### 使用静态服务器

```bash
# 安装 serve
npm install -g serve

# 启动服务器
serve -s build
```

访问：http://localhost:3000

### 使用 Python

```bash
# Python 3
python -m http.server 3000 build

# Python 2
python -m SimpleHTTPServer 3000 build
```

## 🚀 快速部署命令

一键部署到 Netlify：

```bash
# 安装 netlify-cli
npm install -g netlify-cli

# 登录 Netlify
netlify login

# 部署
netlify deploy --prod
```

## 📝 注意事项

1. 所有功能都在前端完成，无需后端服务器
2. 应用使用了 localStorage 保存学习进度
3. 汉字数据包含在代码中，无需外部 API
4. 支持所有现代浏览器
5. 移动端友好，响应式设计