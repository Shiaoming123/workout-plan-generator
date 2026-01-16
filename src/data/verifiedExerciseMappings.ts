/**
 * 验证过的运动名称映射
 *
 * 这个文件包含已经验证过的精确映射
 * 在生成训练计划时使用，确保能匹配到正确的演示资源
 */

export interface VerifiedExerciseMapping {
  ourId: string;
  ourName: string;
  ourNameZh: string;
  apiName: string; // API 中的精确名称
  category: string;
}

/**
 * 已验证的精确映射
 *
 * 这些是从日志中验证过的精确匹配
 * 大模型生成训练计划时应该使用这些 apiName
 */
export const VERIFIED_EXERCISE_MAPPINGS: VerifiedExerciseMapping[] = [
  // 热身运动
  {
    ourId: 'warmup_1',
    ourName: 'Jumping Jacks',
    ourNameZh: '开合跳',
    apiName: 'Jumping Jacks',
    category: 'warmup',
  },
  {
    ourId: 'warmup_2',
    ourName: 'Arm Circles',
    ourNameZh: '手臂环绕',
    apiName: 'Arm Circles',
    category: 'warmup',
  },
  {
    ourId: 'warmup_3',
    ourName: 'Bodyweight Squats',
    ourNameZh: '自重深蹲',
    apiName: 'Bodyweight Squats',
    category: 'warmup',
  },

  // 上肢训练
  {
    ourId: 'upper_1',
    ourName: 'Push-ups',
    ourNameZh: '俯卧撑',
    apiName: 'Push-up',
    category: 'upper',
  },
  {
    ourId: 'upper_2',
    ourName: 'Incline Push-ups',
    ourNameZh: '上斜俯卧撑',
    apiName: 'Incline Push-up',
    category: 'upper',
  },
  {
    ourId: 'upper_3',
    ourName: 'Dumbbell Rows',
    ourNameZh: '哑铃划船',
    apiName: 'Dumbbell Row',
    category: 'upper',
  },

  // 下肢训练
  {
    ourId: 'lower_1',
    ourName: 'Bodyweight Squats',
    ourNameZh: '自重深蹲',
    apiName: 'Bodyweight Squats',
    category: 'lower',
  },
  {
    ourId: 'lower_2',
    ourName: 'Goblet Squats',
    ourNameZh: '高脚杯深蹲',
    apiName: 'Goblet Squat',
    category: 'lower',
  },
  {
    ourId: 'lower_3',
    ourName: 'Lunges',
    ourNameZh: '弓步蹲',
    apiName: 'Lunge',
    category: 'lower',
  },

  // 核心训练
  {
    ourId: 'core_1',
    ourName: 'Plank',
    ourNameZh: '平板支撑',
    apiName: 'Plank',
    category: 'core',
  },
  {
    ourId: 'core_2',
    ourName: 'Side Plank',
    ourNameZh: '侧平板支撑',
    apiName: 'Side Plank',
    category: 'core',
  },
  {
    ourId: 'core_6',
    ourName: 'Mountain Climbers',
    ourNameZh: '登山跑',
    apiName: 'Mountain Climber',
    category: 'core',
  },

  // HIIT
  {
    ourId: 'hiit_1',
    ourName: 'Burpees',
    ourNameZh: '波比跳',
    apiName: 'Burpee',
    category: 'hiit',
  },
  {
    ourId: 'hiit_2',
    ourName: 'High Knees',
    ourNameZh: '高抬腿',
    apiName: 'High Knees',
    category: 'hiit',
  },

  // 拉伸
  {
    ourId: 'stretch_1',
    ourName: 'Childs Pose',
    ourNameZh: '婴儿式',
    apiName: 'Childs Pose',
    category: 'stretch',
  },
];

/**
 * 生成用于 AI 提示词的运动名称列表
 *
 * 这个函数会生成一个格式化的字符串，告诉大模型应该使用哪些精确的英文名称
 */
export function generateExerciseNamesForAI(): string {
  let prompt = `\n═══════════════════════════════════════════════════════════
📋 运动演示资源库 - 请使用以下精确的运动名称
═══════════════════════════════════════════════════════════

**重要说明：**
为了确保用户能查看正确的演示视频和图片，生成训练计划时请**严格使用**下列运动名称（英文名）。

`;

  // 按类别分组
  const categories = new Map<string, VerifiedExerciseMapping[]>();

  for (const mapping of VERIFIED_EXERCISE_MAPPINGS) {
    if (!categories.has(mapping.category)) {
      categories.set(mapping.category, []);
    }
    categories.get(mapping.category)!.push(mapping);
  }

  const categoryNames: Record<string, string> = {
    warmup: '🔥 热身运动',
    upper: '💪 上肢训练',
    lower: '🦵 下肢训练',
    core: '🎯 核心训练',
    hiit: '⚡ HIIT训练',
    stretch: '🧘 拉伸运动',
  };

  // 生成每个类别的列表
  for (const [category, mappings] of categories.entries()) {
    const categoryName = categoryNames[category] || category;

    prompt += `\n${categoryName}\n`;
    prompt += `${'─'.repeat(50)}\n`;

    for (const m of mappings) {
      prompt += `• ${m.ourNameZh.padEnd(12, '　')} → 英文名: **${m.apiName}**\n`;
    }
  }

  prompt += `
═══════════════════════════════════════════════════════════
**使用规则：**
1. 生成训练计划时，英文名必须使用上述列表中的精确名称
2. 中文名可以调整，但英文名必须一致
3. 如果需要其他运动，请优先从上述列表中选择最接近的
4. 这样可以确保用户能查看正确的演示视频和图片
═══════════════════════════════════════════════════════════\n`;

  return prompt;
}

/**
 * 通过我们的运动 ID 查找 API 精确名称
 */
export function findAPIName(ourId: string, ourName: string): string {
  const mapping = VERIFIED_EXERCISE_MAPPINGS.find(
    (m) => m.ourId === ourId || m.ourName === ourName
  );

  return mapping?.apiName || ourName;
}

/**
 * 检查运动是否有验证过的映射
 */
export function hasVerifiedMapping(ourId: string, ourName: string): boolean {
  return VERIFIED_EXERCISE_MAPPINGS.some(
    (m) => m.ourId === ourId || m.ourName === ourName
  );
}
