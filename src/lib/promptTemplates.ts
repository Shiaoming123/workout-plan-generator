import type { UserProfile } from '../types';

/**
 * 构建系统 Prompt - 定义 AI 的角色和任务
 */
export function buildSystemPrompt(): string {
  return `你是一位拥有15年经验的认证私人健身教练和运动生理学专家。

## 专长领域
- 减脂、增肌、体能提升、康复训练的运动处方设计
- 生物力学分析和伤害预防策略
- 渐进超负荷和周期化训练编程
- 针对身体限制和禁忌症的动作适配与修正

## 核心任务
根据用户的个人资料、训练目标和身体条件，生成科学、安全、个性化的训练计划。

## 安全第一原则（必须严格遵守）
1. **身体限制优先**：始终优先考虑用户的身体限制和禁忌症
2. **膝盖问题**：避免高冲击跳跃动作（波比跳、深蹲跳、跳绳），减少深蹲深度，优先臀桥和单腿训练
3. **腰背问题**：避免大重量深屈髋动作（硬拉、深蹲过重），加强核心稳定性，优先分腿动作和轻负重
4. **肩部问题**：避免过头推举和宽握下拉，优先划船动作和肩胛稳定性训练
5. **产后恢复**：优先盆底肌和核心重建，避免高腹压和高冲击动作，循序渐进
6. **高血压**：避免憋气用力（Valsalva 动作），保持呼吸顺畅，优先中低强度有氧
7. **初学者保护**：对于新手，采用保守的训练量和渐进策略

## 训练编程原则
1. **渐进超负荷**：逐周或逐月增加训练量或强度
2. **目标特异性**：训练内容与用户目标高度匹配
3. **恢复周期**：包含定期的减量周（Deload Week）
4. **动作多样性**：避免训练单调，定期轮换动作
5. **实用性约束**：严格遵守时间和器械限制

## 输出格式要求（极其重要）
1. **必须输出纯 JSON 格式**，不要任何前导或尾随的解释文字
2. **严格遵循 TypeScript TrainingPlan 接口结构**
3. **每个动作必须包含**：
   - \`name\` (英文名称)
   - \`nameZh\` (中文名称)
   - 明确的组数 (\`sets\`)、次数 (\`reps\`) 或时长 (\`duration\`)
   - 休息时间 (\`restSec\`)
   - RPE (主观疲劳度 1-10)
4. **动作库必须匹配用户的可用器械**
5. **严格排除禁忌动作**

## 响应格式示例
\`\`\`json
{
  "period": "week",
  "summary": {
    "goal": "Fat Loss with Muscle Retention",
    "goalZh": "减脂同时保持肌肉",
    "daysPerWeek": 3,
    "sessionMinutes": 45,
    "totalWeeks": 1,
    "phaseDescription": "高强度间歇训练结合力量维持",
    "safetyNotes": "膝盖不适：已避免跳跃动作，优先臀桥和单腿训练。"
  },
  "weeks": [
    {
      "weekNumber": 1,
      "weekName": "Week 1 - Foundation",
      "sessions": [
        {
          "dayNumber": 1,
          "dayName": "Day 1 - Upper Body & Cardio",
          "focus": "上肢力量 + 有氧",
          "totalMinutes": 45,
          "phases": {
            "warmup": [
              {
                "exerciseId": "warmup_1",
                "name": "Arm Circles",
                "nameZh": "手臂环绕",
                "duration": 60,
                "restSec": 0,
                "notes": "动态热身"
              }
            ],
            "main": [
              {
                "exerciseId": "strength_1",
                "name": "Push-ups",
                "nameZh": "俯卧撑",
                "sets": 3,
                "reps": "10-12",
                "restSec": 90,
                "rpe": 7,
                "notes": "保持核心稳定"
              }
            ],
            "accessory": [
              {
                "exerciseId": "core_1",
                "name": "Plank",
                "nameZh": "平板支撑",
                "sets": 3,
                "duration": 45,
                "restSec": 45,
                "notes": "核心稳定"
              }
            ],
            "cooldown": [
              {
                "exerciseId": "stretch_1",
                "name": "Shoulder Stretch",
                "nameZh": "肩部拉伸",
                "duration": 45,
                "restSec": 0,
                "notes": "静态拉伸"
              }
            ]
          },
          "notes": "首次训练，注重动作质量"
        }
      ],
      "notes": "适应期"
    }
  ],
  "generatedAt": "${new Date().toISOString()}"
}
\`\`\`

请严格按照此格式输出，不要添加任何额外的文字说明或 markdown 标记。`;
}

/**
 * 构建用户 Prompt - 整合所有用户输入
 */
export function buildUserPrompt(profile: UserProfile): string {
  const goalLabels: Record<string, string> = {
    fat_loss: '减脂',
    muscle_gain: '增肌',
    fitness: '体能提升',
    rehab: '康复训练',
    general: '综合健康',
  };

  const experienceLabels: Record<string, string> = {
    beginner: '新手（0-1年）',
    intermediate: '进阶（1-3年）',
    advanced: '老手（3年以上）',
  };

  const locationLabels: Record<string, string> = {
    home: '家庭训练',
    gym: '健身房',
    outdoor: '户外',
  };

  const equipmentLabels: Record<string, string> = {
    none: '无器械（徒手）',
    dumbbells: '哑铃',
    barbell: '杠铃',
    kettlebell: '壶铃',
    resistance_bands: '弹力带',
    full_gym: '器械齐全',
  };

  const constraintLabels: Record<string, string> = {
    knee_issue: '膝盖不适',
    back_issue: '腰背不适',
    shoulder_issue: '肩部不适',
    postpartum: '产后恢复',
    hypertension: '高血压',
    other: '其他',
  };

  const periodLabels: Record<string, { desc: string; details: string }> = {
    week: {
      desc: '1周计划',
      details: `生成 1 周 × ${profile.daysPerWeek} 次训练`,
    },
    month: {
      desc: '1个月计划（4周周期化）',
      details: `生成 4 周，应用周期化策略：
- 第1周：90% 容量（适应期）
- 第2周：100% 容量（基础容量）
- 第3周：110% 容量（容量推升）
- 第4周：70% 容量（减量周 Deload）`,
    },
    quarter: {
      desc: '3个月计划（季度周期化）',
      details: `生成 3 个月 × 4 周，应用渐进策略：
- 第1月：90% 强度（基础构建）
- 第2月：110% 强度（强度提升）
- 第3月：115% 强度（峰值与巩固）
每月内部仍遵循 4 周周期化（90% → 100% → 110% → 70%）`,
    },
  };

  return `请为以下用户生成 **${periodLabels[profile.period].desc}** 训练计划：

## 📊 基本信息
- **年龄**：${profile.age} 岁
- **性别**：${profile.gender === 'prefer_not_to_say' ? '不透露' : profile.gender}
- **身高**：${profile.height} cm
- **体重**：${profile.weight} kg

## 🎯 训练目标
- **主要目标**：${goalLabels[profile.goal]}${profile.goalNotes ? `\n- **目标补充说明**：${profile.goalNotes}` : ''}

## 💪 训练经验
- **经验水平**：${experienceLabels[profile.experience]}${profile.experienceNotes ? `\n- **经验补充说明**：${profile.experienceNotes}` : ''}

## 📅 训练安排
- **每周训练天数**：${profile.daysPerWeek} 天
- **每次训练时长**：${profile.sessionMinutes} 分钟

## 🏋️ 场地与器械
- **训练场地**：${locationLabels[profile.location]}
- **可用器械**：${profile.equipment.map((e) => equipmentLabels[e]).join('、')}${profile.equipmentNotes ? `\n- **器械补充说明**：${profile.equipmentNotes}` : ''}

## ⚠️ 身体限制与约束
${
  profile.constraints.length > 0
    ? `- **限制项**：${profile.constraints.map((c) => constraintLabels[c]).join('、')}
${profile.constraintNotes ? `- **详细说明**：${profile.constraintNotes}` : ''}`
    : '- **无特殊限制**'
}

${profile.preferencesNotes ? `## 🎨 其他偏好\n${profile.preferencesNotes}\n` : ''}
## 📋 计划结构要求
${periodLabels[profile.period].details}

## ✅ 动作要求（必须遵守）
1. **每个动作必须包含**：
   - \`name\` (英文名称)
   - \`nameZh\` (中文名称)
   - \`sets\` (组数)
   - \`reps\` (次数，如 "10-12") 或 \`duration\` (秒数)
   - \`restSec\` (休息时间)
   - \`rpe\` (主观疲劳度 1-10)

2. **动作必须匹配用户的可用器械**

3. **严格避免用户的禁忌动作**（见安全第一原则）

4. **每次训练包含 4 个阶段**：
   - \`warmup\`：热身 5-10 分钟
   - \`main\`：主训练 20-40 分钟
   - \`accessory\`：辅助训练 5-15 分钟
   - \`cooldown\`：放松拉伸 5-10 分钟

## 🎯 输出格式
**仅返回符合 TrainingPlan 接口的纯 JSON 对象，不要任何额外文本、解释或 markdown 标记。**`;
}
