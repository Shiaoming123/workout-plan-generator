# 训练计划生成器 | Workout Plan Generator

一个智能健身训练计划生成器，结合 **AI 大模型**（DeepSeek）和规则引擎，根据用户的目标、身体条件、场地器械等信息，自动生成量身定制的周/月/季度训练计划。

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## ✨ 功能特性

### 🤖 AI 智能生成
- **双模型支持**：
  - `deepseek-chat`：快速生成（10-30秒），适合日常使用
  - `deepseek-reasoner`：深度推理（5-10分钟），提供详细思考过程
- **实时流式输出**：类似 ChatGPT 的打字效果，无需长时间等待
- **推理过程可视化**：Reasoner 模型展示完整思考链路
- **自动降级机制**：API 失败时自动切换到规则引擎，确保可用性

### 🔧 灵活配置
- **自定义 API 配置**：支持 OpenAI、Azure、DeepSeek、本地模型等
- **环境变量支持**：可配置默认 API Key 和 Base URL
- **多提供商兼容**：OpenAI 兼容格式，支持各种 LLM 提供商

### 📋 核心功能
- **多维度输入**：支持目标、经验、场地、器械、身体限制等多种参数
- **多周期支持**：可生成周计划（1周）、月计划（4周）、季度计划（12周）
- **安全优先**：根据身体限制自动避开高风险动作
- **100+ 动作库**：涵盖热身、力量、有氧、HIIT、拉伸等多种类型

### 💾 导出与分享
- **多种导出格式**：复制文本、下载 JSON、打印友好
- **响应式设计**：完美适配桌面和移动端
- **离线可用**：纯前端应用，无需后端

## 🎥 功能演示

### AI 生成示例
```
用户输入：
- 目标：减脂
- 经验：新手
- 频率：每周3天，每次45分钟
- 器械：徒手
- 限制：膝盖不适

AI 生成（流式输出）：
🧠 推理过程：分析用户为新手且有膝盖问题，应避免跳跃...
📋 训练计划：Day 1 - 全身力量与有氧...
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 配置 API（可选）

创建 `.env` 文件（如果想提供默认 API Key）：

```env
VITE_DEEPSEEK_API_KEY=your_api_key_here
VITE_DEEPSEEK_BASE_URL=https://api.deepseek.com
```

**注意**：用户也可以在界面中配置自己的 API，无需环境变量。

### 运行开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist/` 目录。

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
workout-plan-generator/
├── src/
│   ├── components/              # React 组件
│   │   ├── Header.tsx           # 页面头部
│   │   ├── InputForm.tsx        # 输入表单（含 API 配置）
│   │   ├── PlanDisplay.tsx      # 计划展示
│   │   ├── StreamingDisplay.tsx # 流式内容显示
│   │   ├── ReasoningDisplay.tsx # 推理过程显示
│   │   └── ExportButtons.tsx    # 导出按钮
│   ├── data/                    # 数据与模板
│   │   ├── exercises.ts         # 动作数据库（100+ 动作）
│   │   └── templates.ts         # 训练模板与周期化策略
│   ├── lib/                     # 核心逻辑
│   │   ├── aiPlanGenerator.ts   # AI 生成器（流式 + 降级）
│   │   ├── planGenerator.ts     # 规则引擎生成器
│   │   ├── deepseekClient.ts    # LLM API 客户端
│   │   ├── promptTemplates.ts   # AI Prompt 模板
│   │   ├── validators.ts        # 响应验证器
│   │   └── storageUtils.ts      # LocalStorage 工具
│   ├── types/                   # TypeScript 类型
│   │   ├── index.ts             # 核心类型定义
│   │   └── api.ts               # API 相关类型
│   ├── utils/                   # 工具函数
│   │   └── export.ts            # 导出功能
│   ├── App.tsx                  # 主应用组件
│   ├── main.tsx                 # 入口文件
│   └── index.css                # 全局样式
├── docs/                        # 文档
│   └── DEPLOYMENT.md            # Vercel 部署指南
├── CLAUDE.md                    # 开发者文档（架构说明）
├── DEVELOPMENT_LOG.md           # 开发日志（变更记录）
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🏗️ 技术架构

### 技术栈
- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式**: Tailwind CSS
- **AI 集成**: OpenAI 兼容 API（支持 DeepSeek、OpenAI、Azure 等）
- **架构**: 纯前端，无后端依赖

### 双生成系统

```
用户输入 → generateAIPlanStreaming()
              ↓
         ┌────┴────┐
         ↓         ↓
    AI 生成    规则引擎
   (主系统)    (降级)
         ↓         ↓
         └────┬────┘
              ↓
        训练计划输出
```

**工作流程**：
1. 优先尝试 AI 生成（流式输出，实时显示）
2. 如果 API 未配置或调用失败，自动降级到规则引擎
3. 所有计划包含元数据，标注生成方式（`ai` 或 `rule-based`）

### AI 生成逻辑

**流式输出流程**：
```typescript
// 1. 构建 Prompt
const systemPrompt = buildSystemPrompt(); // 角色定义 + 输出格式
const userPrompt = buildUserPrompt(profile); // 用户资料

// 2. 流式调用 API
await callDeepSeekStreaming(model, messages, config, (delta, isReasoning) => {
  // 3. 实时回调更新 UI
  if (isReasoning) {
    显示推理过程
  } else {
    显示实际内容
  }
});

// 4. 解析 JSON 并验证
const plan = parseAIResponse(content);
validateTrainingPlan(plan);

// 5. 添加元数据并返回
return enrichPlanWithMetadata(plan, { method: 'ai', model, ... });
```

**超时机制**：
- 智能空闲超时：120 秒无数据才中断
- 支持 Reasoner 模型任意长的推理时间
- 只要有数据流入就持续等待

### 规则引擎逻辑

**动作筛选流程**：
```typescript
getAvailableExercises(profile)
  ↓
按器械筛选（equipment）
  ↓
按限制筛选（constraints）
  ↓
按目标分类（goal）
  ↓
可用动作库
```

**周期化策略**：
- **周计划**：单周，标准容量
- **月计划**：4 周循环（Week 1-3 递增，Week 4 减量）
- **季度计划**：3 个月阶梯式进阶

## 🔧 核心模块说明

### 1. AI 生成器 (`src/lib/aiPlanGenerator.ts`)

**主函数**：
```typescript
async function generateAIPlanStreaming(
  profile: UserProfile,
  onStreamUpdate: (content: string, reasoning: string) => void
): Promise<TrainingPlan>
```

**特性**：
- ✅ 流式输出，实时更新 UI
- ✅ 自动降级到规则引擎
- ✅ 完整的错误处理和验证
- ✅ 支持推理过程（Reasoner 模型）

### 2. LLM API 客户端 (`src/lib/deepseekClient.ts`)

**核心函数**：
```typescript
// 流式版本（推荐）
async function callDeepSeekStreaming(
  model: DeepSeekModel,
  messages: DeepSeekMessage[],
  options?: {...},
  customConfig?: CustomAPIConfig,
  onChunk: (delta: string, isReasoning: boolean) => void
): Promise<APICallResult>

// 非流式版本
async function callDeepSeek(...): Promise<APICallResult>
```

**支持的 API 提供商**：
| 提供商 | Base URL | 模型示例 |
|--------|----------|---------|
| DeepSeek | `https://api.deepseek.com` | `deepseek-chat`, `deepseek-reasoner` |
| OpenAI | `https://api.openai.com` | `gpt-4`, `gpt-3.5-turbo` |
| Azure OpenAI | `https://<resource>.openai.azure.com` | `gpt-4` |
| 本地模型 | `http://localhost:11434` | `llama2`, `mistral` |

### 3. 规则引擎生成器 (`src/lib/planGenerator.ts`)

**主函数**：
```typescript
function generateRuleBasedPlan(
  profile: UserProfile,
  metadata?: GenerationMetadata
): TrainingPlan
```

**生成流程**：
1. 根据 `period` 决定周/月/季度结构
2. 应用经验修正器（新手减量，高级增量）
3. 根据目标模板分配训练类型占比
4. 生成每日训练（热身 → 主训练 → 辅助 → 放松）
5. 应用周期化进阶（volume multiplier）

### 4. 动作数据库 (`src/data/exercises.ts`)

**动作分类**：
- `warmup`：动态热身（10+ 动作）
- `strength_upper`：上肢力量（20+ 动作）
- `strength_lower`：下肢力量（20+ 动作）
- `strength_core`：核心力量（15+ 动作）
- `cardio`：有氧训练（10+ 动作）
- `hiit`：HIIT 训练（10+ 动作）
- `stretch`：静态拉伸（15+ 动作）

**每个动作包含**：
```typescript
{
  id: string;                    // 唯一标识
  name: string;                  // 英文名
  nameZh: string;                // 中文名
  category: Category;            // 分类
  requiredEquipment: Equipment[]; // 需要的器械
  targetMuscles: string[];       // 目标肌群
  difficulty: Difficulty;        // 难度
  contraindications: Constraint[]; // 禁忌症
  isHighImpact: boolean;         // 是否高冲击
}
```

## 🎯 使用指南

### 基础使用

1. **选择 AI 模型**：
   - `deepseek-chat`：日常使用，快速生成
   - `deepseek-reasoner`：深度分析，查看推理过程

2. **填写基本信息**：
   - 训练目标、性别、年龄、身高、体重
   - 训练经验、频率、时长

3. **配置场地与器械**：
   - 家庭/健身房/户外
   - 可用器械（徒手/哑铃/杠铃等）

4. **标注身体限制**（如有）：
   - 膝盖问题、腰背问题、肩部问题等
   - 系统会自动避开高风险动作

5. **生成计划**：
   - 实时查看 AI 生成过程
   - 查看推理过程（Reasoner 模型）
   - 获取完整训练计划

### 自定义 API 配置

如果不想使用默认 API，可以配置自己的：

1. 展开表单中的 **"🔧 自定义 API 配置"** 区域
2. 勾选 **"使用自定义 API 配置"**
3. 填写：
   - API 提供商（OpenAI/Azure/DeepSeek/其他）
   - API Base URL
   - API Key
   - 模型名称

配置保存在浏览器 LocalStorage，安全且持久化。

### 导出与分享

- **📄 复制为文本**：适合分享到笔记或打印
- **💾 下载 JSON**：保存完整数据，可重新导入
- **🖨️ 打印**：优化的打印样式，适合纸质记录

## 🔧 开发指南

### 添加新动作

在 `src/data/exercises.ts` 中对应数组添加：

```typescript
export const upperStrengthExercises: Exercise[] = [
  // 现有动作...
  {
    id: 'upper_new_exercise',
    name: 'New Exercise',
    nameZh: '新动作',
    category: 'strength_upper',
    requiredEquipment: ['dumbbells'],
    targetMuscles: ['chest', 'triceps'],
    difficulty: 'intermediate',
    contraindications: ['shoulder_issue'],
    isHighImpact: false,
  },
];
```

### 添加新训练目标

1. 更新 `src/types/index.ts`：
```typescript
export type Goal = 'fat_loss' | 'muscle_gain' | 'fitness' | 'rehab' | 'general' | 'your_goal';
```

2. 添加模板到 `src/data/templates.ts`：
```typescript
export const goalTemplates: Record<string, GoalTemplate> = {
  your_goal: {
    goal: 'your_goal',
    strengthRatio: 0.5,
    cardioRatio: 0.3,
    hiitRatio: 0.1,
    mobilityRatio: 0.1,
    description: 'Your Goal',
    descriptionZh: '你的目标',
  },
};
```

3. 更新 `src/components/InputForm.tsx` 添加表单选项

### 自定义 AI Prompt

编辑 `src/lib/promptTemplates.ts`：

```typescript
export function buildSystemPrompt(): string {
  return `你是一位拥有15年经验的认证私人健身教练...

  ## 输出格式要求
  必须输出纯 JSON 格式，严格遵循 TrainingPlan 接口...
  `;
}
```

**Prompt 优化建议**：
- 明确输出格式（JSON 结构）
- 强调安全原则（身体限制优先）
- 提供示例输出
- 要求包含中英文名称

### 修改生成逻辑

**规则引擎**（`src/lib/planGenerator.ts`）：
- `generateWeekPlan()`：修改周计划结构
- `generateWorkoutSession()`：修改单次训练结构
- `createStrengthSet()`：调整组数、次数、休息时间

**AI 生成**（`src/lib/aiPlanGenerator.ts`）：
- `buildSystemPrompt()`：修改 AI 角色和规则
- `buildUserPrompt()`：调整输入信息格式
- `validateTrainingPlan()`：修改验证逻辑

## 📊 性能与监控

### API 调用统计

查看浏览器控制台（F12 → Console）：

```
[LLM API Streaming] 配置检查:
  - 配置来源: 用户自定义
  - Model: deepseek-chat

[LLM API Streaming] 响应收到 (状态: 200)

[LLM API Streaming] 流式接收完成:
  - 内容长度: 3456
  - 推理长度: 0
  - 耗时: 5234 ms
  - Token 使用: 3579
```

### 降级监控

如果 AI 生成失败，计划顶部会显示：

```
🔧 生成方式: 规则引擎 (rule-based)
⚠️  降级原因: API 请求超时
```

## 🚀 部署

### Vercel（推荐）

1. 连接 GitHub 仓库到 Vercel
2. 设置环境变量（可选）：
   - `VITE_DEEPSEEK_API_KEY`
   - `VITE_DEEPSEEK_BASE_URL`
3. 构建命令：`npm run build`
4. 输出目录：`dist`

详细部署指南见 [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)。

### 其他静态托管平台

支持：Netlify、GitHub Pages、Cloudflare Pages 等

```bash
npm run build
# 将 dist/ 目录部署到任意静态服务器
```

### Docker（可选）

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📚 文档

- **[CLAUDE.md](CLAUDE.md)**：完整架构文档，开发者指南
- **[DEVELOPMENT_LOG.md](DEVELOPMENT_LOG.md)**：详细变更记录
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**：Vercel 部署指南

## ⚠️ 注意事项

### 免责声明
- 本工具仅供参考，不构成专业医疗或训练建议
- 开始任何训练计划前，请咨询医生或专业教练
- 训练中如有不适请立即停止

### 安全建议
- ✅ 引导用户使用自定义 API 配置（LocalStorage）
- ✅ 不要将私人 API Key 写入环境变量部署到公开网站
- ✅ 建议使用 Vercel Serverless Functions 作为 API 代理（高级用法）

### API 成本控制
- 每次生成约消耗 2000-4000 tokens
- Chat 模型更快更省，Reasoner 模型成本稍高
- 建议监控 API 使用量并设置预算提醒

## 🎯 路线图

### ✅ 已完成
- [x] AI 大模型集成（DeepSeek Chat + Reasoner）
- [x] 流式输出功能
- [x] 自定义 API 配置
- [x] 自动降级机制
- [x] 推理过程可视化
- [x] 智能超时机制

### 🚧 进行中
- [ ] 单元测试覆盖
- [ ] E2E 测试（Playwright）
- [ ] 性能优化（懒加载、代码分割）

### 📋 计划中
- [ ] 训练进度跟踪功能
- [ ] 计划历史记录（LocalStorage）
- [ ] 视频示范集成
- [ ] 多语言支持（i18n）
- [ ] 后端 API + 用户系统
- [ ] 社区分享功能
- [ ] 移动端 App（React Native）

## 🤝 贡献指南

欢迎提交 Pull Request！

**贡献流程**：
1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

**代码规范**：
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 添加必要的注释和文档
- 更新 `DEVELOPMENT_LOG.md` 记录更改

## 📄 开源协议

[MIT License](LICENSE)

## 🙏 致谢

- [DeepSeek](https://www.deepseek.com/) - AI 大模型支持
- [React](https://reactjs.org/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Vite](https://vitejs.dev/) - 构建工具

## 📧 联系方式

如有问题或建议，欢迎：
- 提交 [Issue](https://github.com/Shiaoming123/workout-plan-generator/issues)
- 发送邮件至项目维护者

---

**Enjoy your personalized AI-powered workout journey! 💪🤖**
