# 部署指南 | Deployment Guide

本文档介绍如何将训练计划生成器部署到公网，让其他人可以访问。

## 🚀 推荐方案对比

| 方案 | 难度 | 费用 | 自动部署 | 自定义域名 | 推荐度 |
|------|------|------|----------|------------|--------|
| **Vercel** | ⭐ 极简 | 免费 | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| **Netlify** | ⭐ 极简 | 免费 | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| **GitHub Pages** | ⭐⭐ 简单 | 免费 | ✅ | ✅ | ⭐⭐⭐⭐ |
| **Cloudflare Pages** | ⭐⭐ 简单 | 免费 | ✅ | ✅ | ⭐⭐⭐⭐ |

---

## 方案 1：Vercel 部署（最推荐）

### 为什么选择 Vercel？
- ✅ **零配置**：自动识别 Vite 项目
- ✅ **免费额度充足**：个人项目完全够用
- ✅ **全球 CDN**：访问速度快
- ✅ **自动 HTTPS**：安全证书自动配置
- ✅ **Git 集成**：每次 push 自动重新部署
- ✅ **预览部署**：PR 自动生成预览链接

### 部署步骤

#### 1. 创建 GitHub 仓库

```bash
# 初始化 Git（如果还没有）
git init
git add .
git commit -m "feat: initial commit - workout plan generator"

# 在 GitHub 上创建新仓库，然后推送
git remote add origin https://github.com/你的用户名/workout-plan-generator.git
git branch -M main
git push -u origin main
```

#### 2. 注册并导入到 Vercel

1. 访问 https://vercel.com
2. 用 GitHub 账号登录（授权访问）
3. 点击右上角 **"New Project"**
4. 选择 "Import Git Repository"
5. 找到你的 `workout-plan-generator` 仓库
6. 点击 **"Import"**

#### 3. 配置项目（通常无需修改）

Vercel 会自动检测到 Vite 项目，默认配置：
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 4. 部署

点击 **"Deploy"** 按钮，等待 1-2 分钟。

#### 5. 完成！

部署成功后，你会得到一个 URL：
```
https://workout-plan-generator-xxx.vercel.app
```

### 后续更新

以后每次修改代码并推送：
```bash
git add .
git commit -m "feat: 添加新功能"
git push
```

Vercel 会自动检测到更新并重新部署（约 1-2 分钟）。

### 自定义域名（可选）

1. 在 Vercel 项目设置中点击 **"Domains"**
2. 输入你的域名（如 `workout.yourdomain.com`）
3. 按照提示在域名 DNS 设置中添加 CNAME 记录
4. 等待生效（几分钟到几小时）

---

## 方案 2：Netlify 部署

### 部署步骤

#### 1. 推送到 GitHub（同 Vercel）

```bash
git init
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/你的用户名/workout-plan-generator.git
git push -u origin main
```

#### 2. 导入到 Netlify

1. 访问 https://app.netlify.com
2. 注册/登录（推荐用 GitHub）
3. 点击 **"Add new site"** → **"Import an existing project"**
4. 选择 GitHub，授权后选择你的仓库

#### 3. 构建设置

```
Build command: npm run build
Publish directory: dist
```

#### 4. 部署

点击 **"Deploy site"**，等待构建完成。

你会得到一个 URL：
```
https://random-name-123456.netlify.app
```

可以在设置中修改二级域名为：
```
https://workout-plan-generator.netlify.app
```

---

## 方案 3：GitHub Pages 部署

### 部署步骤

#### 1. 修改 `package.json` 添加部署脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "sh deploy.sh"
  }
}
```

#### 2. 编辑 `deploy.sh` 修改仓库地址

打开 `deploy.sh`，将其中的：
```bash
git push -f git@github.com:你的用户名/workout-plan-generator.git main:gh-pages
```

改为你的实际 GitHub 用户名。

#### 3. 推送到 GitHub

```bash
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/你的用户名/workout-plan-generator.git
git push -u origin main
```

#### 4. 运行部署脚本

```bash
npm run deploy
```

#### 5. 启用 GitHub Pages

1. 打开你的 GitHub 仓库
2. 进入 **Settings** → **Pages**
3. Source 选择 `gh-pages` 分支
4. 点击 **Save**

#### 6. 访问网站

几分钟后，访问：
```
https://你的用户名.github.io/workout-plan-generator/
```

### 后续更新

每次修改后运行：
```bash
npm run deploy
```

---

## 方案 4：Cloudflare Pages

### 部署步骤

1. 访问 https://pages.cloudflare.com
2. 登录/注册 Cloudflare 账号
3. 点击 **"Create a project"**
4. 连接 GitHub 仓库
5. 构建设置：
   ```
   Build command: npm run build
   Build output directory: dist
   ```
6. 点击 **"Save and Deploy"**

你会得到：
```
https://workout-plan-generator.pages.dev
```

---

## 本地测试生产构建

部署前建议先本地测试：

```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

访问 `http://localhost:4173` 查看生产版本效果。

---

## 环境变量配置（如果需要）

如果将来需要添加 API Key 等敏感信息：

### Vercel
1. 项目设置 → **Environment Variables**
2. 添加变量名和值
3. 在代码中使用 `import.meta.env.VITE_API_KEY`

### Netlify
1. Site settings → **Environment variables**
2. 添加变量（同样用 `VITE_` 前缀）

### GitHub Pages
需要使用 GitHub Secrets + Actions，相对复杂，不推荐存储敏感信息。

---

## 部署常见问题

### Q: 部署后页面空白？
A: 检查浏览器控制台，可能是路径问题。确保 `vite.config.ts` 中设置了：
```typescript
base: './'
```

### Q: 部署后样式丢失？
A: 确保构建命令正确执行了 `npm run build`，检查 `dist` 目录是否包含 CSS 文件。

### Q: GitHub Pages 404 错误？
A: 确保在仓库设置中启用了 Pages，并选择了正确的分支（`gh-pages`）。

### Q: 想要自己的域名？
A:
- **Vercel/Netlify**: 直接在平台设置中添加自定义域名
- **GitHub Pages**: 在 `public/` 目录添加 `CNAME` 文件，内容为你的域名

---

## 推荐配置

对于大多数用户，我推荐：

**🥇 首选：Vercel**
- 最简单、最快
- 国内访问速度较好
- 适合个人项目和小团队

**🥈 备选：Netlify**
- 功能更丰富（表单处理、函数等）
- 界面友好

**🥉 备选：GitHub Pages**
- 完全免费
- 与 GitHub 深度集成
- 适合开源项目

---

## 下一步

1. 选择一个部署方案
2. 按照步骤操作
3. 分享你的网站链接！

需要帮助？提 Issue 或联系我。

祝部署顺利！🚀
