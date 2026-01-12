# Vercel 部署指南

## 环境变量配置

### 方式 1: Vercel Dashboard（推荐）

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加以下变量：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `VITE_DEEPSEEK_API_KEY` | `sk-*******************9e4a7` | Production, Preview, Development |
| `VITE_DEEPSEEK_BASE_URL` | `https://api.deepseek.com` | Production, Preview, Development |

5. 点击 **Save** 保存
6. 重新部署项目（Vercel 会自动触发）

### 方式 2: Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 设置环境变量
vercel env add VITE_DEEPSEEK_API_KEY
# 输入值: sk-*******************9e4a7
# 选择环境: Production, Preview, Development (全选)

vercel env add VITE_DEEPSEEK_BASE_URL
# 输入值: https://api.deepseek.com
# 选择环境: Production, Preview, Development (全选)

# 重新部署
vercel --prod
```

### 方式 3: 不使用环境变量（推荐用户使用自定义配置）

如果不想在 Vercel 配置环境变量，可以：

1. **不设置** `VITE_DEEPSEEK_API_KEY` 和 `VITE_DEEPSEEK_BASE_URL`
2. 部署后，用户在应用中打开 **"自定义 API 配置"** 区域
3. 输入自己的 API Key 和 Base URL
4. 配置保存在浏览器 LocalStorage，无需环境变量

## 部署流程

### 首次部署

```bash
# 1. 确保代码已提交到 Git
git add .
git commit -m "Ready for deployment"
git push

# 2. 连接 Vercel（如果未连接）
vercel link

# 3. 部署到生产环境
vercel --prod
```

### 后续更新

每次推送到 `main` 分支，Vercel 会自动部署：

```bash
git add .
git commit -m "Update feature"
git push origin main
```

## 验证部署

部署成功后，访问 Vercel 提供的 URL：

1. 打开应用
2. 填写训练计划表单
3. 选择 AI 模型
4. 点击 "生成训练计划"
5. 查看浏览器控制台（F12）确认 API 调用成功

## 常见问题

### Q1: 部署后显示 "未配置 API Key"

**原因**: 环境变量未正确设置

**解决方案**:
1. 检查 Vercel Dashboard → Settings → Environment Variables
2. 确认变量名拼写正确（大小写敏感）
3. 确认选择了正确的环境（Production）
4. 重新部署项目

### Q2: API 调用 CORS 错误

**原因**: DeepSeek API 不支持浏览器直接调用

**解决方案**:
- 短期：使用支持 CORS 的 API 提供商（如 OpenAI）
- 长期：搭建后端代理服务

### Q3: 环境变量更新后不生效

**原因**: Vercel 需要重新构建

**解决方案**:
1. 修改环境变量后
2. 进入 Deployments 页面
3. 点击最新部署的 "..." 菜单
4. 选择 "Redeploy"

## 安全建议

⚠️ **重要**: 前端应用无法完全隐藏 API Key

- ✅ **推荐做法**: 引导用户使用自定义 API 配置（LocalStorage）
- ✅ **推荐做法**: 搭建后端 API 代理（Vercel Serverless Functions）
- ❌ **不推荐**: 将私人 API Key 直接写入环境变量（可被他人滥用）

### 可选：使用 Vercel Serverless Functions（高级）

创建 `/api/generate.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { messages } = req.body;

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`, // 服务器端环境变量
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
    }),
  });

  const data = await response.json();
  res.json(data);
}
```

前端调用 `/api/generate` 而非直接调用 DeepSeek API。

## 自定义 API 配置功能

应用支持用户配置自己的 LLM API（OpenAI、Azure、DeepSeek 等）：

### 使用步骤

1. 在表单中找到 "🔧 自定义 API 配置" 区域
2. 点击展开配置面板
3. 勾选 "使用自定义 API 配置"
4. 填写以下信息：
   - API 提供商（OpenAI/Azure/DeepSeek/其他）
   - API Base URL
   - API Key
   - 模型名称

### 支持的提供商

| 提供商 | Base URL 示例 | 模型示例 |
|--------|--------------|---------|
| OpenAI | `https://api.openai.com` | `gpt-4`, `gpt-3.5-turbo` |
| Azure OpenAI | `https://<resource>.openai.azure.com` | `gpt-4` |
| DeepSeek | `https://api.deepseek.com` | `deepseek-chat`, `deepseek-reasoner` |
| 本地模型 | `http://localhost:11434` | `llama2`, `mistral` |

### 配置存储

- 配置保存在浏览器 LocalStorage
- 不会上传到服务器
- 清除浏览器数据会删除配置
- 可随时点击 "清除保存的配置" 重置

## 监控与调试

### 查看 API 调用日志

在浏览器控制台（F12 → Console）查看详细日志：

```
[LLM API] 配置检查:
  - 配置来源: 用户自定义 / 环境变量
  - API_KEY: 已配置 (sk-97fe73...)
  - BASE_URL: https://api.deepseek.com
  - Model: deepseek-chat

[LLM API] 发起请求:
  - URL: https://api.deepseek.com/v1/chat/completions
  - Messages 数量: 2
  - 总字符数: 2456

[LLM API] 响应收到 (耗时: 5234ms, 状态: 200)

[LLM API] 成功接收响应:
  - 内容长度: 3456
  - 推理内容: 有
  - Token 使用: { prompt_tokens: 1234, completion_tokens: 2345, total_tokens: 3579 }
```

### 降级机制

如果 AI API 调用失败，系统会自动降级到规则引擎：

- ✅ 用户仍能获得训练计划
- ℹ️ 计划顶部会显示降级原因
- 📋 使用规则引擎标识

## 性能优化建议

### API 调用优化

- 使用 Chat 模型（`deepseek-chat`）速度更快
- Reasoner 模型（`deepseek-reasoner`）耗时更长但提供思考过程
- 避免同时发起多个 API 请求

### 成本控制

- 平均每次生成消耗 2000-4000 tokens
- 建议监控 API 使用量
- 可以设置月度预算提醒

## 故障排查

### 1. API 调用超时

**症状**: 等待很久后显示"API 请求超时（60秒）"

**检查**:
- 网络连接是否正常
- API Base URL 是否正确
- API Key 是否有效
- 是否超出了 API 配额

### 2. CORS 错误

**症状**: 控制台显示 "NetworkError" 或 "Failed to fetch"

**原因**: API 不支持浏览器直接调用

**解决方案**:
1. 使用支持 CORS 的 API（如 OpenAI）
2. 搭建后端代理（Vercel Serverless Functions）

### 3. 响应格式错误

**症状**: "AI 响应结构验证失败"

**原因**: 不同 API 返回格式可能略有差异

**解决方案**:
- 确认使用 OpenAI 兼容格式的 API
- 检查模型名称是否正确
- 查看控制台详细错误信息

## 技术栈

- **前端框架**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS
- **API 格式**: OpenAI 兼容
- **状态管理**: React useState/useEffect
- **持久化**: LocalStorage

## 联系支持

如遇到问题，请提供：
1. 浏览器控制台完整日志
2. 使用的 API 提供商和模型
3. 错误发生的具体步骤
4. 浏览器版本信息
