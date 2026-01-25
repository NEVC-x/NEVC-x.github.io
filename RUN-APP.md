# 🚀 随文识字应用 - 本地运行指南

## 🎯 最简单的方式：双击运行

### 步骤1：双击启动脚本
在项目文件夹 `D:\my-react-app` 中找到并双击：
- **`start-app.bat`** - Windows 用户首选

### 步骤2：等待应用启动
- 会自动安装依赖（第一次）
- 会自动打开浏览器
- 看到 "Compiled successfully!" 表示启动成功

### 步骤3：开始使用
- 访问地址：http://localhost:3000
- 在文本框中输入中文课文
- 点击蓝色生字查看详情

---

## 📝 手动运行方式（如果脚本无法运行）

### 方式1：使用命令提示符（CMD）

1. **打开命令提示符**
   - 按 `Win + R`，输入 `cmd`，回车

2. **进入项目目录**
   ```cmd
   cd D:\my-react-app
   ```

3. **安装依赖（只需第一次）**
   ```cmd
   npm install
   ```

4. **启动应用**
   ```cmd
   npm start
   ```
   或者（如果上面的命令有问题）：
   ```cmd
   set BROWSER=none
   npm start
   ```

5. **访问应用**
   浏览器会自动打开 http://localhost:3000

### 方式2：使用 PowerShell

1. **打开 PowerShell**
   - 按 `Win + X`，选择 "Windows PowerShell"

2. **进入项目目录**
   ```powershell
   cd D:\my-react-app
   ```

3. **安装依赖**
   ```powershell
   npm install
   ```

4. **启动应用**
   ```powershell
   npm start
   ```

---

## 🔧 常见问题解决

### 问题1：npm 不是内部或外部命令
**原因**：Node.js 没有添加到系统环境变量

**解决**：
1. 重新安装 Node.js：https://nodejs.org/
2. 安装时勾选 "Add to PATH"
3. 重启电脑后再试

### 问题2：端口 3000 被占用
**解决方案1**：换个端口
```cmd
set PORT=3001
npm start
```

**解决方案2**：停止占用端口的程序
1. 按 `Ctrl + Shift + Esc` 打开任务管理器
2. 找到 node.exe 或相关程序
3. 结束任务

### 问题3：依赖安装失败
**解决方案**：
```cmd
npm install --force
```

或者使用国内镜像：
```cmd
npm install --registry=https://registry.npmmirror.com
```

### 问题4：浏览器没有自动打开
**手动访问**：
- 在浏览器地址栏输入：http://localhost:3000

**检查防火墙**：
- 确保防火墙没有阻止 Node.js

---

## 📱 使用说明

### 基本操作
1. **输入课文** - 在上方文本框输入中文
2. **查看生字** - 课文中的生字会变蓝，点击查看详情
3. **学习进度** - 双击生字标记已掌握
4. **切换主题** - 点击右上角按钮切换白天/夜间模式
5. **快速搜索** - 使用搜索框查询汉字

### 功能特点
- 🎨 主题切换（白天/夜间）
- 📊 学习进度追踪
- ✨ 丰富的动画效果
- 🔊 中文语音发音
- 📱 完美适配移动端

---

## 🎉 成功标志

当你看到以下内容时，表示启动成功：
```
Compiled successfully!

You can now view chinese-literacy-app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://[你的IP]:3000
```

---

## 💡 提示

- 第一次运行需要安装依赖，可能需要几分钟
- 如果遇到问题，请参考上面的解决方案
- 应用完全在前端运行，无需联网即可使用

---

现在就开始使用吧！🎉