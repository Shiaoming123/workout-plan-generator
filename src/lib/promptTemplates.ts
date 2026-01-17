import type { UserProfile } from '../types';
import { generateExerciseNamesForAI } from '../data/verifiedExerciseMappings';

// ============ 常量标签映射（避免每次调用时重复创建） ============

/** 目标标签 */
const GOAL_LABELS: Record<string, string> = {
  fat_loss: '减脂',
  muscle_gain: '增肌',
  fitness: '体能提升',
  rehab: '康复训练',
  general: '综合健康',
};

/** 性别标签 */
const GENDER_LABELS: Record<string, string> = {
  male: '男',
  female: '女',
  prefer_not_to_say: '不透露',
  other: '其他',
};

/** 经验水平标签 */
const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: '新手（0-1年）',
  intermediate: '进阶（1-3年）',
  advanced: '老手（3年以上）',
};

/** 训练场地标签 */
const LOCATION_LABELS: Record<string, string> = {
  home: '家庭训练',
  gym: '健身房',
  outdoor: '户外',
};

/** 器械标签 */
const EQUIPMENT_LABELS: Record<string, string> = {
  none: '无器械（徒手）',
  dumbbells: '哑铃',
  barbell: '杠铃',
  kettlebell: '壶铃',
  resistance_bands: '弹力带',
  full_gym: '器械齐全',
};

/** 身体限制标签 */
const CONSTRAINT_LABELS: Record<string, string> = {
  knee_issue: '膝盖不适',
  back_issue: '腰背不适',
  shoulder_issue: '肩部不适',
  postpartum: '产后恢复',
  hypertension: '高血压',
  other: '其他',
};

/** 用餐频率标签 */
const MEAL_FREQUENCY_LABELS: Record<string, string> = {
  '2meals': '2餐/天',
  '3meals': '3餐/天',
  '4meals': '4餐/天',
  '5meals': '5餐/天',
  '6meals': '6餐/天',
  irregular: '不规律',
};

/** 饮食偏好标签 */
const DIETARY_PREFERENCE_LABELS: Record<string, string> = {
  omnivore: '杂食',
  vegetarian: '素食',
  vegan: '纯素',
  pescatarian: '鱼素',
  keto: '生酮饮食',
  paleo: '原始人饮食',
  other: '其他',
};

/** 食物过敏标签 */
const FOOD_ALLERGY_LABELS: Record<string, string> = {
  dairy: '乳制品',
  gluten: '麸质',
  nuts: '坚果',
  eggs: '鸡蛋',
  soy: '大豆',
  shellfish: '海鲜',
  other: '其他',
};

/** 烹饪能力标签 */
const COOKING_ABILITY_LABELS: Record<string, string> = {
  cannot_cook: '不会做饭',
  basic: '基础（简单炒菜、煮蛋）',
  intermediate: '进阶（多种烹饪方式）',
  advanced: '精通（复杂菜谱）',
};

// ============ 单周计划专用标签（与主计划略有不同） ============

/** 单周计划目标标签 */
const SINGLE_WEEK_GOAL_LABELS: Record<string, string> = {
  fat_loss: '减脂（Fat Loss）',
  muscle_gain: '增肌（Muscle Gain）',
  fitness: '综合体能提升（General Fitness）',
  strength: '力量提升（Strength）',
  endurance: '耐力提升（Endurance）',
  rehabilitation: '康复训练（Rehabilitation）',
};

/** 单周计划经验标签 */
const SINGLE_WEEK_EXPERIENCE_LABELS: Record<string, string> = {
  beginner: '初学者（0-6个月）',
  intermediate: '中级（6个月-2年）',
  advanced: '高级（2年以上）',
};

/** 单周计划场地标签 */
const SINGLE_WEEK_LOCATION_LABELS: Record<string, string> = {
  gym: '健身房',
  home: '家庭',
  outdoor: '户外',
};

/** 单周计划器械标签 */
const SINGLE_WEEK_EQUIPMENT_LABELS: Record<string, string> = {
  bodyweight: '自重',
  dumbbells: '哑铃',
  barbell: '杠铃',
  resistance_bands: '弹力带',
  kettlebell: '壶铃',
  pull_up_bar: '引体向上杆',
  bench: '卧推凳',
  yoga_mat: '瑜伽垫',
};

/**
 * 构建系统 Prompt - 定义 AI 的角色和任务
 */
export function buildSystemPrompt(): string {
  // 生成精确运动名称列表
  const exerciseNamesList = generateExerciseNamesForAI();

  return `你是一位拥有15年经验的认证私人健身教练、运动生理学专家和注册营养师。

## 专长领域
- 减脂、增肌、体能提升、康复训练的运动处方设计
- 生物力学分析和伤害预防策略
- 渐进超负荷和周期化训练编程
- 针对身体限制和禁忌症的动作适配与修正
- 运动营养学：宏量营养素配比、餐食规划、补剂建议
- 恢复策略：睡眠优化、休息日安排、恢复性训练

## 核心任务
根据用户的个人资料、训练目标和身体条件，生成科学、安全、个性化的训练计划。

**如果用户提供了饮食信息，则额外提供：**
1. 个性化营养建议（热量、蛋白质、碳水、脂肪摄入量）
2. 每日餐食安排（根据用餐频率）
3. 简单实用的食谱推荐（考虑烹饪能力）
4. 水分摄入建议
5. 恢复建议（睡眠、休息日、恢复技巧）

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

${exerciseNamesList}

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
  "nutritionAdvice": {
    "dailyCalories": 2000,
    "proteinGrams": 150,
    "carbsGrams": 200,
    "fatGrams": 67,
    "proteinRatio": "30%",
    "carbsRatio": "40%",
    "fatRatio": "30%",
    "mealPlan": [
      {
        "mealType": "早餐",
        "timing": "7:00-8:00",
        "foods": ["燕麦粥", "鸡蛋2个", "牛奶"],
        "calories": 450,
        "protein": "鸡蛋、牛奶"
      },
      {
        "mealType": "午餐",
        "timing": "12:00-13:00",
        "foods": ["鸡胸肉", "糙米饭", "西兰花"],
        "calories": 600,
        "protein": "鸡胸肉"
      }
    ],
    "waterIntake": {
      "dailyLiters": 2.5
    },
    "recipes": [
      {
        "name": "香煎鸡胸肉",
        "ingredients": ["鸡胸肉 200g", "橄榄油 10ml", "黑胡椒", "大蒜"],
        "instructions": ["鸡胸肉切片", "热锅加橄榄油", "煎至两面金黄", "调味出锅"],
        "prepTime": 15,
        "calories": 250,
        "protein": "高蛋白"
      }
    ]
  },
  "recoveryAdvice": {
    "sleep": {
      "hours": 8,
      "tips": ["保持规律作息", "睡前避免蓝光", "保持卧室凉爽"]
    },
    "restDays": {
      "frequency": "每周1-2天",
      "activities": ["轻度散步", "瑜伽拉伸", "泡沫轴放松"]
    },
    "recoveryTechniques": {
      "stretching": ["训练后静态拉伸15分钟", "重点拉伸训练肌群"],
      "foamRolling": ["滚压大腿外侧", "滚压背部", "每部位1-2分钟"],
      "massage": ["自我按摩放松紧张肌肉", "或考虑专业按摩"],
      "other": ["冷热水交替浴", "充足睡眠"]
    },
    "warningSigns": ["持续关节疼痛", "睡眠质量下降", "持续疲劳感"]
  },
  "generatedAt": "${new Date().toISOString()}"
}
\`\`\`

**重要说明：**
1. **nutritionAdvice 和 recoveryAdvice 是可选的**，仅在用户提供了饮食信息时才生成
2. 如果用户未提供饮食信息，则不需要包含这两个字段
3. 营养建议必须基于用户的：目标、体重、训练强度、饮食偏好、过敏情况、烹饪能力
4. 食谱推荐必须考虑用户的烹饪水平和时间限制

请严格按照此格式输出，不要添加任何额外的文字说明或 markdown 标记。`;
}

/**
 * 构建用户 Prompt - 整合所有用户输入
 */
export function buildUserPrompt(profile: UserProfile): string {
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
- **主要目标**：${GOAL_LABELS[profile.goal]}${profile.goalNotes ? `\n- **目标补充说明**：${profile.goalNotes}` : ''}

## 💪 训练经验
- **经验水平**：${EXPERIENCE_LABELS[profile.experience]}${profile.experienceNotes ? `\n- **经验补充说明**：${profile.experienceNotes}` : ''}

## 📅 训练安排
- **每周训练天数**：${profile.daysPerWeek} 天
- **每次训练时长**：${profile.sessionMinutes} 分钟

## 🏋️ 场地与器械
- **训练场地**：${LOCATION_LABELS[profile.location]}
- **可用器械**：${profile.equipment.map((e) => EQUIPMENT_LABELS[e]).join('、')}${profile.equipmentNotes ? `\n- **器械补充说明**：${profile.equipmentNotes}` : ''}

## ⚠️ 身体限制与约束
${
  profile.constraints.length > 0
    ? `- **限制项**：${profile.constraints.map((c) => CONSTRAINT_LABELS[c]).join('、')}
${profile.constraintNotes ? `- **详细说明**：${profile.constraintNotes}` : ''}`
    : '- **无特殊限制**'
}

${profile.preferencesNotes ? `## 🎨 其他偏好\n${profile.preferencesNotes}\n` : ''}

${
  profile.includeNutritionAndRecovery
    ? (profile.dietProfile
        ? buildDietProfileSection(profile.dietProfile)
        : '\n## 🍽️ 营养与恢复要求\n用户希望获取营养建议和恢复建议，但未提供详细饮食信息。请根据以下基本信息生成通用建议：\n' +
          `- **训练目标**：${GOAL_LABELS[profile.goal] || profile.goal}\n` +
          `- **性别**：${GENDER_LABELS[profile.gender] || profile.gender}\n` +
          `- **年龄**：${profile.age}岁\n` +
          `- **体重**：${profile.weight}kg\n` +
          `- **训练频率**：每周${profile.daysPerWeek}天，每次${profile.sessionMinutes}分钟\n` +
          `- **训练经验**：${EXPERIENCE_LABELS[profile.experience] || profile.experience}\n\n` +
          '请基于以上信息生成适合的营养建议（热量、蛋白质、碳水、脂肪）和恢复建议（睡眠、休息日、恢复技巧）。'
      )
    : ''
}
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

/**
 * 构建单周计划的用户 Prompt（用于分批生成）
 */
export function buildSingleWeekUserPrompt(
  profile: UserProfile,
  weekNumber: number,
  totalWeeks: number,
  previousWeekSummary?: string
): string {
  return `# 用户资料

## 🎯 训练目标
- **主要目标**：${SINGLE_WEEK_GOAL_LABELS[profile.goal]}${profile.goalNotes ? `\n- **目标补充说明**：${profile.goalNotes}` : ''}

## 💪 训练经验
- **经验水平**：${SINGLE_WEEK_EXPERIENCE_LABELS[profile.experience]}${profile.experienceNotes ? `\n- **经验补充说明**：${profile.experienceNotes}` : ''}

## 📅 训练安排
- **每周训练天数**：${profile.daysPerWeek} 天
- **每次训练时长**：${profile.sessionMinutes} 分钟

## 🏋️ 场地与器械
- **训练场地**：${SINGLE_WEEK_LOCATION_LABELS[profile.location]}
- **可用器械**：${profile.equipment.map((e) => SINGLE_WEEK_EQUIPMENT_LABELS[e] || e).join('、')}${profile.equipmentNotes ? `\n- **器械补充说明**：${profile.equipmentNotes}` : ''}

## ⚠️ 身体限制与约束
${
  profile.constraints.length > 0
    ? `- **限制项**：${profile.constraints.map((c) => CONSTRAINT_LABELS[c]).join('、')}
${profile.constraintNotes ? `- **详细说明**：${profile.constraintNotes}` : ''}`
    : '- **无特殊限制**'
}

${profile.preferencesNotes ? `## 🎨 其他偏好\n${profile.preferencesNotes}\n` : ''}
## 📋 本周计划要求
- **当前周次**：第 ${weekNumber} 周（共 ${totalWeeks} 周）
- **周期定位**：${getWeekPhaseDescription(weekNumber, totalWeeks)}
${previousWeekSummary ? `\n## 📊 上周训练总结\n${previousWeekSummary}\n` : ''}
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
**仅返回单周计划的 JSON 对象，格式如下：**
\`\`\`json
{
  "weekNumber": ${weekNumber},
  "weekName": "Week ${weekNumber} - [阶段名称]",
  "notes": "[本周训练重点说明]",
  "sessions": [
    {
      "dayNumber": 1,
      "dayName": "Day 1 - [训练主题]",
      "focus": "[训练重点]",
      "totalMinutes": ${profile.sessionMinutes},
      "phases": {
        "warmup": [...],
        "main": [...],
        "accessory": [...],
        "cooldown": [...]
      }
    }
  ]
}
\`\`\`

**仅返回纯 JSON 对象，不要任何额外文本、解释或 markdown 标记。**`;
}

/**
 * 获取周次的阶段描述
 */
function getWeekPhaseDescription(weekNumber: number, totalWeeks: number): string {
  if (totalWeeks === 1) {
    return '单周完整训练';
  }

  const progress = weekNumber / totalWeeks;

  if (progress <= 0.25) {
    return '适应期 - 建立基础，学习动作模式';
  } else if (progress <= 0.5) {
    return '积累期 - 逐步增加训练量';
  } else if (progress <= 0.75) {
    return '强化期 - 提高训练强度';
  } else if (weekNumber === totalWeeks) {
    return '减量周 - 恢复调整，为下一周期做准备';
  } else {
    return '冲刺期 - 达到训练高峰';
  }
}

/**
 * 构建饮食资料部分的 Prompt
 */
function buildDietProfileSection(dietProfile: NonNullable<UserProfile['dietProfile']>): string {
  let section = `## 🍽️ 饮食信息（用户已提供）
- **每日用餐频率**：${MEAL_FREQUENCY_LABELS[dietProfile.mealFrequency]}`;

  if (dietProfile.dietaryPreference) {
    section += `\n- **饮食偏好**：${DIETARY_PREFERENCE_LABELS[dietProfile.dietaryPreference]}`;
  }

  if (dietProfile.foodAllergies && dietProfile.foodAllergies.length > 0) {
    section += `\n- **食物过敏/不耐受**：${dietProfile.foodAllergies.map((a) => FOOD_ALLERGY_LABELS[a]).join('、')}`;
    if (dietProfile.allergyNotes) {
      section += `\n  - **详细说明**：${dietProfile.allergyNotes}`;
    }
  }

  if (dietProfile.currentDiet) {
    section += `\n- **当前饮食习惯**：${dietProfile.currentDiet}`;
  }

  if (dietProfile.waterIntake) {
    section += `\n- **当前每日饮水量**：约 ${dietProfile.waterIntake} 升`;
  }

  if (dietProfile.supplementUsage) {
    section += `\n- **当前使用的补剂**：${dietProfile.supplementUsage}`;
  }

  section += `\n- **烹饪能力**：${COOKING_ABILITY_LABELS[dietProfile.cookingAbility]}`;

  if (dietProfile.cookingTime) {
    section += `\n- **愿意花费的烹饪时间**：每餐约 ${dietProfile.cookingTime} 分钟`;
  }

  if (dietProfile.dietGoal) {
    section += `\n- **饮食目标**：${dietProfile.dietGoal}`;
  }

  if (dietProfile.dietNotes) {
    section += `\n- **饮食备注**：${dietProfile.dietNotes}`;
  }

  section += `\n\n**营养建议要求：**
1. 根据用户的训练目标、体重和训练强度，计算合理的热量和宏量营养素摄入
2. 考虑用户的饮食偏好和过敏情况，提供合适的食物选择
3. 根据用户的用餐频率，安排每日餐食计划
4. 根据用户的烹饪能力，推荐简单易做的食谱（不会做饭则推荐极简食谱或外卖建议）
5. 提供实用的恢复建议，包括睡眠、休息日和恢复技巧
6. 如果用户当前饮水量不足，提供逐步增加的建议\n`;

  return section;
}
