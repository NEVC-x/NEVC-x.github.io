# 📚 随文识字学习应用

一个现代化的中文学习应用，帮助学习者在课文中轻松识别和掌握生字。

## ✨ 功能特色

- 🎨 **主题切换** - 支持白天/夜间模式
- 📊 **学习进度** - 追踪学习进度，标记已掌握的汉字
- 🎯 **互动学习** - 点击生字查看拼音、释义和笔顺动画
- 📱 **响应式设计** - 完美适配桌面端和移动端
- ✨ **炫酷效果** - 丰富的动画和交互反馈
- 🔊 **发音功能** - 自动播放汉字读音

## 🚀 快速开始

### 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start
```

访问：http://localhost:3000

### 构建生产版本

```bash
# 构建项目
npm run build

# 使用静态服务器运行
npm install -g serve
serve -s build
```

## 🌐 在线部署

### Netlify 部署（推荐）

1. Fork 此项目到你的 GitHub
2. 访问 [netlify.com](https://netlify.com)
3. 点击 "New site from Git"
4. 选择你的 GitHub 仓库
5. 设置：
   - Build command: `npm run build`
   - Publish directory: `build`
6. 点击 "Deploy site"

### 其他部署选项

- [Vercel](https://vercel.com)
- [GitHub Pages](https://pages.github.com)
- 任何支持静态网站的托管服务

## 📱 使用说明

1. **输入课文** - 在文本框中输入要学习的中文课文
2. **点击生字** - 课文中的生字会高亮显示，点击查看详情
3. **查看信息** - 查看拼音、释义、笔顺动画和例词
4. **标记进度** - 双击生字标记为已掌握
5. **切换主题** - 使用右上角按钮切换主题
6. **快速搜索** - 使用搜索框快速查询汉字

## 🛠️ 技术栈

- **Frontend**: React 19, Styled JSX
- **Animations**: CSS Animations, Hanzi Writer
- **Deployment**: Netlify/Vercel
- **Speech**: Web Speech API

## 🎨 界面预览

![随文识字界面](public/screenshot.png)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**享受学习中文的乐趣！** 🎉