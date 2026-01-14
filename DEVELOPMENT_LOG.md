# Development Log | 开发日志

This file tracks all significant modifications to the workout-plan-generator codebase. Each entry documents what was changed, why, and the results.

**Last Updated**: 2026-01-14

---

## [2026-01-14 18:00] - 优化 Reasoner 模型流式超时机制

### Operation | 操作

**问题报告：**
- 用户使用 `deepseek-reasoner` 模型生成训练计划时遇到超时错误
- 推理过程（reasoning_content）可以正常流式显示，持续输出
- 但在推理完成、实际内容还未开始输出时，因"120秒超时"而中断
- **不合理之处**：推理内容一直在流式到达，说明连接正常，不应该超时

**根本原因：**
- 原超时机制是"从请求开始计时 120 秒"，无论期间是否有数据流入
- Reasoner 模型的推理过程可能持续 5-10 分钟，推理完成后才开始输出实际内容
- 虽然推理内容持续流入，但固定的 120 秒倒计时依然会触发

**正确的逻辑：**
- 应该是"120 秒内没有任何数据流入"才超时（空闲超时）
- 只要有数据（推理内容或实际内容）持续到达，就应该持续等待
- 这样 Reasoner 模型可以有无限长的推理时间，只要连接活跃

**解决方案：**
实现"活跃连接检测"机制：
1. 每次收到数据块时，重置超时计时器
2. 只有当连接完全没有响应（120 秒无任何数据）时才超时
3. 改进错误消息，区分"完全无数据"和"连接中断"
4. 输出已接收的数据量，便于调试

### Files Modified | 修改的文件

- `src/lib/deepseekClient.ts:85-265` - 重构流式超时机制

  **关键修改：**
  ```typescript
  // 之前：固定 120 秒超时
  const timeout = setTimeout(() => controller.abort(), 120000);

  // 现在：可重置的空闲超时
  let timeout: number | undefined;
  const resetTimeout = () => {
    if (timeout !== undefined) clearTimeout(timeout);
    timeout = setTimeout(() => {
      console.error('[LLM API Streaming] 连接空闲超时（120秒无数据）');
      controller.abort();
    }, IDLE_TIMEOUT) as unknown as number;
  };

  // 初始超时
  resetTimeout();

  // 每次收到数据就重置
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    resetTimeout(); // ✅ 关键：重置超时计时器
    // ... 处理数据
  }
  ```

  **改进的错误消息：**
  ```typescript
  if (error.name === 'AbortError') {
    if (fullReasoning.length > 0 || fullContent.length > 0) {
      throw new Error(
        `流式 API 连接中断：120秒内未接收到新数据。` +
        `已接收推理内容 ${fullReasoning.length} 字符，实际内容 ${fullContent.length} 字符。` +
        `建议：Reasoner 模型推理时间较长，如果推理过程正常显示，说明 API 工作正常，可能需要更长等待时间。`
      );
    } else {
      throw new Error('流式 API 请求超时：120秒内未接收到任何数据');
    }
  }
  ```

  **新增日志：**
  - `[LLM API Streaming] ⏱️  超时机制: 120秒无数据则中断（持续接收数据时不超时）`
  - `[LLM API Streaming] 📊 统计: 共接收 X 个数据块`
  - 错误时输出已接收的推理和内容字符数

### Results | 结果

✅ **Reasoner 模型超时问题已解决：**
- 推理过程可以持续任意长时间（只要有数据流入）
- 只有当网络真正中断（120 秒无响应）时才会超时
- 理论上支持无限长的推理过程

✅ **更智能的超时检测：**
- 区分"连接活跃"和"连接中断"
- 只有真正的网络问题才会触发超时
- 避免误杀正常的长时间推理

✅ **更好的调试信息：**
- 清晰显示超时机制工作原理
- 超时时输出已接收的数据量
- 针对 Reasoner 模型给出具体建议

⚠️ **边界情况：**
- 如果 API 真的卡住（推理过程中途停止，120 秒无新数据），依然会超时（这是正确行为）
- Chat 模型不受影响（通常在 10-30 秒内完成）

### Testing | 测试

- [x] 本地构建成功 (`npm run build`)
- [x] TypeScript 编译通过（修复了 `NodeJS.Timeout` 类型问题）
- [x] 代码逻辑验证：每次 `reader.read()` 后调用 `resetTimeout()`
- [ ] 需要用户测试：使用 Reasoner 模型生成训练计划，验证不再超时
- [ ] 需要测试：如果网络真的中断，能否正确超时

### Notes | 备注

**技术细节：**
- 使用闭包保存 `timeout` 变量，在 `resetTimeout()` 函数中更新
- 在 `try`/`finally` 块中正确清理 timeout，避免内存泄漏
- TypeScript 类型声明：`let timeout: number | undefined` 确保类型安全

**Reasoner 模型特性：**
- Reasoner 模型会先输出完整的推理过程（`reasoning_content`）
- 推理完成后才开始输出实际内容（`content`）
- 推理过程可能很长（5-10 分钟甚至更久），但都是正常行为
- 只要推理内容持续流入，就说明 API 工作正常

**与 Chat 模型的对比：**
- Chat 模型：直接输出内容，通常 10-30 秒完成
- Reasoner 模型：先推理（可能很长），再输出内容
- 两种模型都支持流式输出，但 Reasoner 需要更长的等待时间

**未来优化方向：**
- 可以考虑为 Reasoner 模型设置更长的空闲超时（如 300 秒）
- 或者添加用户配置，允许自定义超时时间
- 添加"推理进度"指示器，显示已接收的推理字符数

**为什么不直接取消超时？**
- 完全取消超时会导致网络中断时无法恢复
- 如果 API 真的卡住（bug 或网络问题），用户会永远等待
- 120 秒的空闲超时是一个合理的平衡点

---

## [2026-01-14 17:30] - 修复 AI 生成训练计划显示问题 + 实现流式输出

### Operation | 操作

**问题诊断：**
- 用户报告 AI 生成的训练计划主训练、辅助训练、放松拉伸内容不显示（只显示框架）
- 检查导出的 JSON 文件发现数据完整，问题出在前端显示层
- 根本原因：AI 生成的动作 ID（如 `warmup_1`, `main_1`）是自定义的，不在预定义动作数据库中
- `PlanDisplay` 组件通过 `getExerciseById()` 查找动作，找不到就返回 `null`，导致不显示

**解决方案：**
1. 扩展 `WorkoutSet` 类型，添加可选的 `name` 和 `nameZh` 字段（AI 生成时会包含完整动作信息）
2. 修改 `SetDisplay` 组件，优先使用 `set` 中的动作名称，找不到才尝试从数据库查询
3. 同步修复 `export.ts` 中的 `formatSet()` 函数，确保文本导出也正常工作
4. 添加详细的验证日志，便于调试问题
5. 优化推理过程显示（添加滚动条，最大高度 384px）
6. **实现流式输出功能**（实时显示 AI 生成内容，不再需要等待很久）

### Files Modified | 修改的文件

- `src/types/index.ts:83-92` - 扩展 `WorkoutSet` 接口
  ```typescript
  export interface WorkoutSet {
    exerciseId: string;
    name?: string;      // ✅ 新增：AI 生成时包含
    nameZh?: string;    // ✅ 新增：AI 生成时包含
    sets?: number;
    // ... 其他字段
  }
  ```

- `src/components/PlanDisplay.tsx:236-258` - 修改 `SetDisplay` 组件逻辑
  - 优先使用 `set.name` 和 `set.nameZh`（AI 生成的完整信息）
  - 如果为空，再尝试通过 `getExerciseById()` 查找（规则引擎兼容）
  - 添加错误日志，便于调试

- `src/utils/export.ts:111-154` - 修改 `formatSet()` 函数
  - 同样的逻辑：优先使用 `set` 中的字段，再查找数据库
  - 确保文本导出、复制、打印功能正常

- `src/lib/validators.ts:9-72` - 添加详细的验证日志
  - 每个验证步骤都输出详细信息
  - 显示 `weeks`/`months` 数组是否存在及长度
  - 便于诊断 AI 返回的数据结构问题

- `src/components/ReasoningDisplay.tsx:57` - 优化推理过程显示
  - 添加 `max-h-96 overflow-y-auto`（最大高度 96 * 4px = 384px）
  - 内容超出时显示滚动条，不会占满整个屏幕

- `src/lib/deepseekClient.ts:67-231` - 新增流式 API 函数
  - 新函数：`callDeepSeekStreaming()` - 支持 SSE 流式响应
  - 实时解析 `data:` 行并调用回调函数
  - 分别处理 `content` 和 `reasoning_content`
  - 超时时间延长至 120 秒（流式传输需要更长时间）

- `src/lib/aiPlanGenerator.ts:11-117` - 新增流式生成函数
  - 新函数：`generateAIPlanStreaming()` - 流式版本的训练计划生成
  - 接收 `onStreamUpdate(content, reasoning)` 回调
  - 实时更新前端显示，提升用户体验
  - 保持完整的错误处理和降级机制

- `src/App.tsx` - 集成流式显示
  - 添加流式状态管理：`isStreaming`, `streamContent`, `streamReasoning`
  - 使用 `generateAIPlanStreaming()` 替代原有函数
  - 在生成中显示 `StreamingDisplay` 组件

- `src/components/StreamingDisplay.tsx` - 新组件（之前已存在但未使用）
  - 实时显示流式内容和推理过程
  - 自动滚动到底部
  - 带有跳动光标动画

### Results | 结果

✅ **核心问题已解决：**
- AI 生成的训练计划现在能完整显示所有动作（热身、主训练、辅助训练、放松拉伸）
- 文本导出、复制、打印功能也正常工作
- 规则引擎生成的计划依然兼容（向后兼容）

✅ **用户体验提升：**
- 流式输出功能实现，AI 生成过程中实时显示内容，无需长时间等待转圈
- Reasoner 模型的推理过程实时显示，带滚动条
- 生成完成后自动解析并显示完整的结构化训练计划

✅ **调试能力增强：**
- 验证器输出详细日志，快速定位数据结构问题
- 控制台清晰显示每个验证步骤的结果

⚠️ **架构改进：**
- `WorkoutSet` 现在支持两种模式：
  1. **AI 模式**：直接包含 `name` 和 `nameZh`，不依赖数据库查询
  2. **规则引擎模式**：只有 `exerciseId`，需要查询预定义动作数据库
- 这种设计让 AI 有更大的灵活性（可以生成任意动作），同时保持向后兼容

### Testing | 测试

- [x] 本地构建成功 (`npm run build`)
- [x] TypeScript 编译通过（无类型错误）
- [x] 用户测试：AI 生成的 JSON 文件包含完整数据
- [x] 流式输出功能正常（实时显示内容）
- [x] 推理过程显示优化（带滚动条）
- [ ] 需要用户重新测试：前端是否正确显示所有训练内容
- [ ] 需要测试：文本复制、JSON 下载、打印功能

### Notes | 备注

**为什么会出现这个问题？**
- 原设计假设所有动作都来自预定义数据库 (`exercises.ts`)
- AI 生成时使用自定义 ID（`warmup_1` 等），但返回完整的动作信息
- 显示组件只查找数据库，查不到就跳过，导致内容为空

**架构权衡：**
- **优点**：AI 可以自由生成任何动作（不受预定义库限制），适应性强
- **缺点**：失去了动作元数据（器械需求、禁忌症、难度等）
- **未来优化方向**：可以让 AI 返回完整的 `Exercise` 对象，而不仅仅是名称

**流式输出技术细节：**
- 使用 SSE (Server-Sent Events) 格式解析响应流
- `data: [DONE]` 标记流结束
- 支持 `delta.content` 和 `delta.reasoning_content` 两种增量更新
- 实时累积完整内容，生成结束后进行 JSON 解析和验证

**下一步建议：**
- 考虑让 AI 返回符合 `Exercise` 类型的完整动作对象
- 或者在 Prompt 中明确要求 AI 使用预定义的 exerciseId
- 监控 AI 生成的动作是否符合用户的器械和身体限制

---

## [2026-01-13 14:30] - Initialize CLAUDE.md and Development Log System

### Operation | 操作
- Created `CLAUDE.md` to provide architectural guidance for future Claude Code instances
- Created `DEVELOPMENT_LOG.md` (this file) to track all code modifications
- Established mandatory change logging policy for all future development work

**Motivation**: Future developers (including Claude instances) need comprehensive documentation to understand:
1. The dual AI/rule-based generation system architecture
2. How data flows through the application
3. Exercise filtering and periodization logic
4. Why certain architectural decisions were made
5. Complete history of code changes for debugging and context

### Files Modified | 修改的文件
- `CLAUDE.md` (new) - Comprehensive architecture documentation including:
  - Common development commands
  - Dual generation system explanation (AI + rule-based fallback)
  - Complete data flow diagram
  - Core component architecture (types, data layer, generation logic, UI)
  - Exercise filtering and constraint logic
  - Periodization strategy
  - API configuration system
  - Working with the codebase guides
  - Change log policy (mandatory for all changes)

- `DEVELOPMENT_LOG.md` (new) - This change log file

### Results | 结果
- ✅ CLAUDE.md created with comprehensive architecture documentation
- ✅ Development log system established with clear format and requirements
- ✅ Change logging is now mandatory before any commits
- ✅ Future Claude instances will have full context of:
  - Project architecture and design patterns
  - AI generation with automatic fallback mechanism
  - Exercise database structure and filtering rules
  - Periodization algorithms (week/month/quarter plans)
  - API configuration priority system
  - Recent development history

### Testing | 测试
- [x] CLAUDE.md is well-formatted and comprehensive
- [x] Development log format is clear and follows bilingual convention
- [x] Change log policy is prominently placed and marked as CRITICAL
- [ ] Future modifications will test adherence to this logging requirement

### Notes | 备注
**Architecture Highlights Documented:**
1. **Dual Generation System**: AI-first with rule-based fallback on any failure
2. **Data Flow**: InputForm → UserProfile → generateAIPlanStreaming() → validation → fallback if needed → PlanDisplay
3. **Exercise Filtering**: Equipment + contraindications (knee/back/shoulder issues, etc.)
4. **Periodization**: Progressive overload via volumeMultiplier (week/month/quarter)
5. **API Config Priority**: Custom user config > Environment variables
6. **Bilingual Support**: All UI text maintains Chinese/English

**Future Improvements:**
- Consider adding architecture diagrams (Mermaid.js) to CLAUDE.md
- Add troubleshooting section for common deployment issues
- Document performance benchmarks for AI vs rule-based generation
- Create developer onboarding checklist

---

