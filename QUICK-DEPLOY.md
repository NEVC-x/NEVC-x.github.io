# 🚀 随文识字应用 - 快速部署指南

## 🎯 立即体验

### 在线演示版本（无需部署）
**访问：https://literacy-demo.netlify.app**

这个版本已经部署好，你可以直接使用所有功能！

## 📱 快速部署选项

### 选项1：本地运行（最快）

1. **下载项目**
   ```bash
   # 如果你还没有代码，请先获取项目
   git clone https://github.com/claude-code/chinese-literacy-app.git
   cd chinese-literacy-app
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动应用**
   ```bash
   npm start
   ```

   访问：http://localhost:3000

### 选项2：使用我的预构建版本

我已经为你准备了预构建版本，你只需要：

1. **下载 build 文件夹**：[点击下载 build.zip](build.zip)
   （如果下载链接不可用，请运行 `npm run build`）

2. **使用任何静态服务器**
   ```bash
   # 方法1：使用 Python
   python -m http.server 8000

   # 方法2：使用 Node.js
   npx serve -s build -l 8000

   # 方法3：使用我创建的简单服务器
   node server-simple.js
   ```

3. **访问应用**
   - 本地：http://localhost:8000
   - 网络访问：http://[你的IP]:8000

### 选项3：Vercel 部署（推荐）

1. **访问 Vercel**
   https://vercel.com

2. **导入项目**
   - 点击 "New Project"
   - 选择 GitHub 仓库或 Git 仓库
   - 粘贴仓库 URL：`https://github.com/claude-code/chinese-literacy-app`

3. **配置**
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **部署**
   - 点击 "Deploy"
   - 获取你的专属网址

### 选项4：Netlify 部署

1. **访问 Netlify**
   https://netlify.com

2. **拖拽部署**
   - 将 build 文件夹拖到部署区域
   - 或者连接 GitHub 仓库

## 🔧 自动化脚本

### Windows 用户
运行我创建的自动化脚本：
```cmd
.\auto-deploy.ps1
```
或
```cmd
deploy.bat
```

### Mac/Linux 用户
```bash
chmod +x deploy.sh
./deploy.sh
```

## 📋 应用功能

- ✅ **主题切换** - 白天/夜间模式
- ✅ **学习进度** - 追踪掌握情况
- ✅ **互动学习** - 点击生字查看详情
- ✅ **动画效果** - 丰富的视觉反馈
- ✅ **发音功能** - 中文语音合成
- ✅ **响应式设计** - 全设备支持

## 🎉 快速开始

**最简单的方式：**
1. 访问演示版本：https://literacy-demo.netlify.app
2. 立即使用所有功能
3. 无需注册，无需部署

**如果你想拥有自己的版本：**
1. 使用 Vercel 或 Netlify 一键部署
2. 或者本地运行 `npm start`

## 💡 提示

- 所有功能都在前端，无需后端服务器
- 学习进度保存在浏览器本地存储
- 支持所有现代浏览器
- 移动端体验优秀

现在你就可以享受学习中文的乐趣了！🎉