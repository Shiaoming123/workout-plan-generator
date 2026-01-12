# 🧪 测试指南

## 问题诊断与修复

### 原问题
用户报告 DeepSeek API 请求超时（60秒），导致生成失败。

### 根本原因分析
通过直接 API 测试（test-api.js）发现：
- ✅ DeepSeek API 本身工作正常（响应时间 ~229ms）
- ❌ 浏览器中存在 **CORS（跨域资源共享）** 问题
- 浏览器的同源策略阻止了直接从前端调用 DeepSeek API

### 已实施的修复

#### 1. 增强错误日志 ✅
**文件**: `src/lib/deepseekClient.ts`

添加了详细的诊断日志：
- 环境配置检查（API Key、Base URL、模型）
- 请求详情（URL、消息数量、字符总数）
- 响应状态（耗时、HTTP状态码）
- 错误详情（错误类型、消息、完整堆栈）

**查看日志**: 打开浏览器开发者工具的 Console 标签页

#### 2. 配置开发环境代理 ✅
**文件**: `vite.config.ts`

添加了 Vite 代理配置：
```typescript
server: {
  proxy: {
    '/api/deepseek': {
      target: 'https://api.deepseek.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
      // 自动添加 Authorization header
    }
  }
}
```

**工作原理**:
- 开发环境：浏览器 → Vite Dev Server (代理) → DeepSeek API
- 生产环境：浏览器 → DeepSeek API (直接调用)

#### 3. 增加超时时间 ✅
- 从 **60秒** 增加到 **120秒**
- 给复杂的训练计划生成更多时间

#### 4. Markdown 渲染支持 ✅
**新增依赖**:
- `react-markdown` - Markdown 渲染库
- `remark-gfm` - GitHub Flavored Markdown 支持
- `@tailwindcss/typography` - 排版样式

**应用位置**:
- `src/components/ReasoningDisplay.tsx` - AI 推理过程使用 Markdown 渲染

---

## 🚀 测试步骤

### 前提条件
1. 开发服务器已启动（`npm run dev`）
2. 浏览器访问: http://localhost:5173
3. 打开浏览器开发者工具（F12 或 Cmd+Option+I）

### 测试场景 1: Chat 模型生成

1. **选择 Chat 模型**
   - 在表单中选择 "Chat 模型 - 快速生成"

2. **填写基本信息**
   - 年龄: 30
   - 身高: 170cm
   - 体重: 70kg
   - 训练经验: 进阶
   - 每周训练: 3天
   - 每次时长: 45分钟
   - 训练场地: 健身房
   - 可用器械: 器械齐全

3. **点击"生成训练计划"**

4. **观察控制台日志**
   ```
   [DeepSeek API] 环境检查:
     - API_KEY: 已配置 (sk-97fe73...)
     - BASE_URL: /api/deepseek
     - Model: deepseek-chat
     - 开发模式: true

   [DeepSeek API] 发起请求:
     - URL: /api/deepseek/v1/chat/completions
     - Messages 数量: 2
     - 总字符数: XXXX

   [DeepSeek API] 响应收到 (耗时: XXXXms, 状态: 200)

   [DeepSeek API] 成功接收响应:
     - 内容长度: XXXX
     - 推理内容: 无
     - Token 使用: {...}
   ```

5. **验证结果**
   - ✅ 页面显示训练计划
   - ✅ 元数据显示 "🤖 AI 驱动 (deepseek-chat)"
   - ✅ 显示耗时（例如: "耗时: 5.23秒"）
   - ✅ 没有 "思考过程" 区域（Chat 模型特有）

### 测试场景 2: Reasoner 模型生成

1. **选择 Reasoner 模型**
   - 在表单中选择 "Reasoner 模型 - 展示详细思考过程"

2. **填写相同的基本信息**

3. **点击"生成训练计划"**

4. **观察控制台日志**
   ```
   [DeepSeek API] 环境检查:
     - Model: deepseek-reasoner
     ...

   [DeepSeek API] 成功接收响应:
     - 推理内容: 有  <-- 注意这里
   ```

5. **验证结果**
   - ✅ 页面显示训练计划
   - ✅ 元数据显示 "🤖 AI 驱动 (deepseek-reasoner)"
   - ✅ **有 "🧠 AI 推理过程" 区域**
   - ✅ 点击可展开查看 AI 的思考过程（Markdown 格式）

### 测试场景 3: 额外说明框

1. **测试所有额外说明框**
   - 目标补充说明: "主要想减掉腹部脂肪，保持手臂肌肉"
   - 经验补充说明: "有3个月的健身房训练经验"
   - 器械补充说明: "哑铃最大30kg"
   - 其他偏好: "喜欢力量训练，不喜欢有氧"

2. **查看控制台日志中的请求内容**
   - 这些额外说明应该被包含在发送给 AI 的 prompt 中

3. **验证生成的计划**
   - AI 应该根据这些额外说明调整训练内容

### 测试场景 4: 降级机制

1. **模拟 API 失败**
   - 临时修改 `.env` 文件，将 API Key 改为无效值
   - 或者断开网络连接

2. **尝试生成计划**

3. **验证降级**
   - ✅ 页面仍然显示训练计划（规则引擎生成）
   - ✅ 元数据显示 "📋 规则引擎"
   - ✅ 显示降级原因（例如: "ℹ️ AI 失败: DeepSeek API Key 未配置"）

### 测试场景 5: Markdown 渲染

1. **选择 Reasoner 模型并生成计划**

2. **展开 "AI 推理过程"**

3. **验证 Markdown 功能**
   - ✅ 标题格式化（# ## ###）
   - ✅ 列表渲染（- 或 1.）
   - ✅ 粗体/斜体（**text** 或 *text*）
   - ✅ 代码块（\`code\` 或 \`\`\`...```）
   - ✅ 表格支持（如果有）

---

## 🐛 常见问题排查

### 问题 1: 仍然超时

**检查清单**:
1. ✅ 环境变量是否正确加载？
   - 控制台日志应显示 "API_KEY: 已配置 (sk-97fe73...)"
   - 如果显示 "未配置"，检查 `.env` 文件

2. ✅ 是否使用了代理？
   - 控制台日志应显示 "开发模式: true"
   - BASE_URL 应该是 "/api/deepseek"

3. ✅ Vite 开发服务器是否重启？
   - 修改配置后需要重启: `npm run dev`

4. ✅ 浏览器缓存是否清除？
   - 硬刷新: Ctrl+Shift+R (Windows) 或 Cmd+Shift+R (Mac)

### 问题 2: 代理错误

**症状**: 控制台显示 404 或 502 错误

**解决方案**:
1. 检查 `vite.config.ts` 中的代理配置
2. 确认 DeepSeek API 端点正确: `https://api.deepseek.com`
3. 查看 Vite 终端输出的代理日志

### 问题 3: Markdown 不渲染

**症状**: 推理过程显示原始文本，没有格式化

**解决方案**:
1. 确认依赖已安装:
   ```bash
   npm ls react-markdown remark-gfm @tailwindcss/typography
   ```

2. 如果缺失，重新安装:
   ```bash
   npm install react-markdown remark-gfm
   npm install -D @tailwindcss/typography
   ```

3. 重启开发服务器

---

## 📊 性能基准

### 预期响应时间

| 模型 | 请求类型 | 预期耗时 | 备注 |
|------|---------|---------|------|
| deepseek-chat | 周计划 | 3-8秒 | 最快 |
| deepseek-chat | 月计划 | 8-15秒 | 中等 |
| deepseek-chat | 季度计划 | 15-30秒 | 较慢 |
| deepseek-reasoner | 任何计划 | +50% | 包含推理时间 |

### Token 使用估算

- **输入**: ~2000-4000 tokens（取决于额外说明的详细程度）
- **输出**: ~2000-8000 tokens（取决于计划周期）

---

## 🔧 调试命令

### 查看实时日志
```bash
# 浏览器控制台（推荐）
# 打开开发者工具 → Console 标签页

# Vite 终端输出
# 查看代理请求日志
```

### 测试 API 连接
```bash
# 直接测试（绕过浏览器）
node test-api.js

# 预期输出:
# 开始测试 DeepSeek API...
# 响应收到 (耗时: ~200-500ms)
# 成功! 响应内容: {...}
```

### 清理重置
```bash
# 清理构建产物和缓存
rm -rf dist node_modules/.vite

# 重新安装依赖（如果需要）
rm -rf node_modules package-lock.json
npm install

# 重启开发服务器
npm run dev
```

---

## ✅ 测试完成检查清单

- [ ] Chat 模型生成成功
- [ ] Reasoner 模型生成成功
- [ ] 推理过程正确显示（Reasoner 模型）
- [ ] Markdown 正确渲染
- [ ] 额外说明框内容被使用
- [ ] 降级机制正常工作
- [ ] 控制台日志清晰易读
- [ ] 无浏览器错误
- [ ] 响应时间在预期范围内
- [ ] 元数据正确显示

---

## 📞 需要帮助？

如果遇到问题，请提供以下信息：

1. **浏览器控制台完整日志**（复制所有 `[DeepSeek API]` 开头的日志）
2. **Vite 终端输出**
3. **测试场景**（使用的模型、输入数据、操作步骤）
4. **错误消息**（完整的错误堆栈）
5. **环境信息**:
   - 浏览器版本
   - Node.js 版本（`node -v`）
   - npm 版本（`npm -v`）
