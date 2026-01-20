#!/bin/bash

# 随文识字应用一键部署脚本

echo "🚀 开始部署随文识字应用到 Netlify..."

# 检查是否安装了 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 检查是否安装了 Git
if ! command -v git &> /dev/null; then
    echo "❌ 请先安装 Git: https://git-scm.com/"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建成功！"

# 安装 Netlify CLI
if ! command -v netlify &> /dev/null; then
    echo "📥 安装 Netlify CLI..."
    npm install -g netlify-cli
fi

# 检查是否已登录 Netlify
netlify status &> /dev/null
if [ $? -ne 0 ]; then
    echo "🔑 请先登录 Netlify:"
    netlify login
fi

# 部署到 Netlify
echo "🌐 部署到 Netlify..."
netlify deploy --prod

echo "🎉 部署完成！"
echo ""
echo "💡 其他部署选项："
echo "1. GitHub Pages: 查看 DEPLOYMENT.md"
echo "2. Vercel: https://vercel.com"
echo "3. 本地测试: npm install -g serve && serve -s build"