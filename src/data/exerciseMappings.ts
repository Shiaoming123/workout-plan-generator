/**
 * 运动演示映射表
 *
 * 将我们的运动 ID 映射到 ExerciseDB API 的搜索关键词
 *
 * 匹配策略：
 * 1. exactMatch: 精确匹配（使用运动名称）
 * 2. keywordMatch: 关键词匹配（使用多个候选关键词）
 * 3. targetMuscleMatch: 目标肌群匹配（备选方案）
 */

export interface ExerciseMapping {
  ourExerciseId: string;
  ourExerciseName: string;
  ourExerciseNameZh: string;

  // 匹配策略
  matchStrategy: 'exact' | 'keyword' | 'target';

  // 搜索关键词（keyword 模式使用）
  searchKeywords?: string[];

  // 备用搜索词（如果第一个失败）
  fallbackKeywords?: string[];

  // 是否已验证（通过 API 测试）
  verified?: boolean;

  // 匹配到的 API 运动信息（测试后填充）
  apiExerciseId?: string;
  apiExerciseName?: string;
  gifUrl?: string;
}

/**
 * 运动映射表
 *
 * 使用说明：
 * 1. 精确匹配：直接使用运动英文名称搜索
 * 2. 关键词匹配：使用多个候选词，直到找到匹配
 * 3. 目标肌群匹配：按肌群搜索，然后找到最相似的
 */
export const exerciseMappings: ExerciseMapping[] = [
  // ========== 热身运动 ==========
  {
    ourExerciseId: 'warmup_1',
    ourExerciseName: 'Jumping Jacks',
    ourExerciseNameZh: '开合跳',
    matchStrategy: 'exact',
  },
  {
    ourExerciseId: 'warmup_2',
    ourExerciseName: 'Arm Circles',
    ourExerciseNameZh: '手臂环绕',
    matchStrategy: 'keyword',
    searchKeywords: ['arm circles', 'shoulder circles'],
  },
  {
    ourExerciseId: 'warmup_3',
    ourExerciseName: 'Leg Swings',
    ourExerciseNameZh: '腿部摆动',
    matchStrategy: 'keyword',
    searchKeywords: ['leg swings', 'side leg swings', 'forward leg swings'],
  },
  {
    ourExerciseId: 'warmup_4',
    ourExerciseName: 'Cat-Cow Stretch',
    ourExerciseNameZh: '猫牛式',
    matchStrategy: 'keyword',
    searchKeywords: ['cat cow', 'cat-cow stretch', 'marjariasana'],
  },
  {
    ourExerciseId: 'warmup_5',
    ourExerciseName: 'Inch Worms',
    ourExerciseNameZh: '毛毛虫爬行',
    matchStrategy: 'keyword',
    searchKeywords: ['inch worms', 'inchworm', 'walkout'],
  },

  // ========== 上肢力量 ==========
  {
    ourExerciseId: 'upper_1',
    ourExerciseName: 'Push-ups',
    ourExerciseNameZh: '俯卧撑',
    matchStrategy: 'exact',
  },
  {
    ourExerciseId: 'upper_2',
    ourExerciseName: 'Dumbbell Bench Press',
    ourExerciseNameZh: '哑铃卧推',
    matchStrategy: 'keyword',
    searchKeywords: ['dumbbell bench press', 'dumbbell chest press'],
  },
  {
    ourExerciseId: 'upper_3',
    ourExerciseName: 'Dumbbell Rows',
    ourExerciseNameZh: '哑铃划船',
    matchStrategy: 'keyword',
    searchKeywords: ['dumbbell rows', 'dumbbell row', 'single arm dumbbell row'],
  },
  {
    ourExerciseId: 'upper_4',
    ourExerciseName: 'Overhead Press',
    ourExerciseNameZh: '过头推举',
    matchStrategy: 'keyword',
    searchKeywords: ['overhead press', 'shoulder press', 'military press'],
  },
  {
    ourExerciseId: 'upper_5',
    ourExerciseName: 'Pull-ups / Assisted Pull-ups',
    ourExerciseNameZh: '引体向上',
    matchStrategy: 'keyword',
    searchKeywords: ['pull ups', 'pullups', 'pull up', 'assisted pull up'],
  },
  {
    ourExerciseId: 'upper_6',
    ourExerciseName: 'Pike Push-ups',
    ourExerciseNameZh: '派克俯卧撑',
    matchStrategy: 'exact',
  },
  {
    ourExerciseId: 'upper_7',
    ourExerciseName: 'Dumbbell Shoulder Press',
    ourExerciseNameZh: '哑铃肩推',
    matchStrategy: 'keyword',
    searchKeywords: ['dumbbell shoulder press', 'seated dumbbell shoulder press'],
  },

  // ========== 下肢力量 ==========
  {
    ourExerciseId: 'lower_1',
    ourExerciseName: 'Bodyweight Squats',
    ourExerciseNameZh: '徒手深蹲',
    matchStrategy: 'keyword',
    searchKeywords: ['squats', 'bodyweight squats', 'air squats'],
  },
  {
    ourExerciseId: 'lower_2',
    ourExerciseName: 'Goblet Squats',
    ourExerciseNameZh: '高脚杯深蹲',
    matchStrategy: 'exact',
  },
  {
    ourExerciseId: 'lower_3',
    ourExerciseName: 'Lunges',
    ourExerciseNameZh: '弓步蹲',
    matchStrategy: 'keyword',
    searchKeywords: ['lunges', 'forward lunges', 'walking lunges'],
  },
  {
    ourExerciseId: 'lower_4',
    ourExerciseName: 'Romanian Deadlift',
    ourExerciseNameZh: '罗马尼亚硬拉',
    matchStrategy: 'keyword',
    searchKeywords: ['romanian deadlift', 'rdl', 'dumbbell romanian deadlift'],
  },
  {
    ourExerciseId: 'lower_5',
    ourExerciseName: 'Glute Bridges',
    ourExerciseNameZh: '臀桥',
    matchStrategy: 'keyword',
    searchKeywords: ['glute bridges', 'glute bridge', 'hip thrust'],
  },
  {
    ourExerciseId: 'lower_6',
    ourExerciseName: 'Bulgarian Split Squats',
    ourExerciseNameZh: '保加利亚分腿蹲',
    matchStrategy: 'exact',
  },
  {
    ourExerciseId: 'lower_7',
    ourExerciseName: 'Step-ups',
    ourExerciseNameZh: '箱式登阶',
    matchStrategy: 'keyword',
    searchKeywords: ['step ups', 'step-ups', 'box step ups'],
  },
  {
    ourExerciseId: 'lower_8',
    ourExerciseName: 'Calf Raises',
    ourExerciseNameZh: '提踵',
    matchStrategy: 'keyword',
    searchKeywords: ['calf raises', 'standing calf raise'],
  },

  // ========== 核心力量 ==========
  {
    ourExerciseId: 'core_1',
    ourExerciseName: 'Plank',
    ourExerciseNameZh: '平板支撑',
    matchStrategy: 'exact',
  },
  {
    ourExerciseId: 'core_2',
    ourExerciseName: 'Side Plank',
    ourExerciseNameZh: '侧平板',
    matchStrategy: 'exact',
  },
  {
    ourExerciseId: 'core_3',
    ourExerciseName: 'Dead Bug',
    ourExerciseNameZh: '死虫式',
    matchStrategy: 'exact',
  },
  {
    ourExerciseId: 'core_4',
    ourExerciseName: 'Bird Dog',
    ourExerciseNameZh: '鸟狗式',
    matchStrategy: 'exact',
  },
  {
    ourExerciseId: 'core_5',
    ourExerciseName: 'Russian Twists',
    ourExerciseNameZh: '俄罗斯转体',
    matchStrategy: 'exact',
  },
  {
    ourExerciseId: 'core_6',
    ourExerciseName: 'Mountain Climbers',
    ourExerciseNameZh: '登山跑',
    matchStrategy: 'exact',
  },

  // ========== 有氧运动 ==========
  {
    ourExerciseId: 'cardio_1',
    ourExerciseName: 'Brisk Walking',
    ourExerciseNameZh: '快走',
    matchStrategy: 'keyword',
    searchKeywords: ['walking', 'brisk walk'],
  },
  {
    ourExerciseId: 'cardio_2',
    ourExerciseName: 'Jogging',
    ourExerciseNameZh: '慢跑',
    matchStrategy: 'keyword',
    searchKeywords: ['jogging', 'running'],
  },
  {
    ourExerciseId: 'cardio_3',
    ourExerciseName: 'Cycling',
    ourExerciseNameZh: '骑行',
    matchStrategy: 'keyword',
    searchKeywords: ['cycling', 'bike', 'bicycle'],
  },
  {
    ourExerciseId: 'cardio_4',
    ourExerciseName: 'Jump Rope',
    ourExerciseNameZh: '跳绳',
    matchStrategy: 'exact',
  },
  {
    ourExerciseId: 'cardio_5',
    ourExerciseName: 'Elliptical',
    ourExerciseNameZh: '椭圆机',
    matchStrategy: 'keyword',
    searchKeywords: ['elliptical', 'elliptical machine'],
  },
  {
    ourExerciseId: 'cardio_6',
    ourExerciseName: 'Rowing Machine',
    ourExerciseNameZh: '划船机',
    matchStrategy: 'keyword',
    searchKeywords: ['rowing', 'rowing machine'],
  },

  // ========== HIIT 动作 ==========
  {
    ourExerciseId: 'hiit_1',
    ourExerciseName: 'Burpees',
    ourExerciseNameZh: '波比跳',
    matchStrategy: 'exact',
  },
  {
    ourExerciseId: 'hiit_2',
    ourExerciseName: 'High Knees',
    ourExerciseNameZh: '高抬腿',
    matchStrategy: 'exact',
  },
  {
    ourExerciseId: 'hiit_3',
    ourExerciseName: 'Squat Jumps',
    ourExerciseNameZh: '深蹲跳',
    matchStrategy: 'exact',
  },
  {
    ourExerciseId: 'hiit_4',
    ourExerciseName: 'Kettlebell Swings',
    ourExerciseNameZh: '壶铃摇摆',
    matchStrategy: 'exact',
  },

  // ========== 拉伸与放松 ==========
  {
    ourExerciseId: 'stretch_1',
    ourExerciseName: 'Hamstring Stretch',
    ourExerciseNameZh: '腘绳肌拉伸',
    matchStrategy: 'keyword',
    searchKeywords: ['hamstring stretch', 'seated hamstring stretch'],
  },
  {
    ourExerciseId: 'stretch_2',
    ourExerciseName: 'Quad Stretch',
    ourExerciseNameZh: '股四头拉伸',
    matchStrategy: 'keyword',
    searchKeywords: ['quad stretch', 'quadriceps stretch', 'standing quad stretch'],
  },
  {
    ourExerciseId: 'stretch_3',
    ourExerciseName: 'Child Pose',
    ourExerciseNameZh: '婴儿式',
    matchStrategy: 'keyword',
    searchKeywords: ['child pose', 'child\'s pose', 'balasana'],
  },
  {
    ourExerciseId: 'stretch_4',
    ourExerciseName: 'Shoulder Stretch',
    ourExerciseNameZh: '肩部拉伸',
    matchStrategy: 'keyword',
    searchKeywords: ['shoulder stretch', 'cross body shoulder stretch'],
  },
  {
    ourExerciseId: 'stretch_5',
    ourExerciseName: 'Hip Flexor Stretch',
    ourExerciseNameZh: '髋屈肌拉伸',
    matchStrategy: 'keyword',
    searchKeywords: ['hip flexor stretch', 'lunge stretch'],
  },
  {
    ourExerciseId: 'stretch_6',
    ourExerciseName: 'Cat-Cow Stretch',
    ourExerciseNameZh: '猫牛式拉伸',
    matchStrategy: 'keyword',
    searchKeywords: ['cat cow stretch', 'cat-cow', 'marjaryasana bitilasana'],
  },

  // ========== 活动度动作 ==========
  {
    ourExerciseId: 'mobility_1',
    ourExerciseName: 'Hip Circles',
    ourExerciseNameZh: '髋关节环绕',
    matchStrategy: 'keyword',
    searchKeywords: ['hip circles', 'hip rotations'],
  },
  {
    ourExerciseId: 'mobility_2',
    ourExerciseName: 'Shoulder Dislocations',
    ourExerciseNameZh: '肩关节活动',
    matchStrategy: 'keyword',
    searchKeywords: ['shoulder dislocations', 'shoulder mobility', 'shoulder stretch band'],
  },
  {
    ourExerciseId: 'mobility_3',
    ourExerciseName: 'Ankle Circles',
    ourExerciseNameZh: '踝关节环绕',
    matchStrategy: 'keyword',
    searchKeywords: ['ankle circles', 'ankle rotations'],
  },
  {
    ourExerciseId: 'mobility_4',
    ourExerciseName: 'Thoracic Rotations',
    ourExerciseNameZh: '胸椎旋转',
    matchStrategy: 'keyword',
    searchKeywords: ['thoracic rotation', 'thoracic spine rotation', 't-spine rotation'],
  },
];

/**
 * 创建运动 ID 到映射的快速查找表
 */
export const exerciseMappingMap = new Map<string, ExerciseMapping>(
  exerciseMappings.map((mapping) => [mapping.ourExerciseId, mapping])
);

/**
 * 根据我们的运动 ID 获取映射信息
 */
export function getExerciseMapping(exerciseId: string): ExerciseMapping | undefined {
  return exerciseMappingMap.get(exerciseId);
}

/**
 * 获取所有未验证的映射（用于批量测试）
 */
export function getUnverifiedMappings(): ExerciseMapping[] {
  return exerciseMappings.filter((m) => !m.verified);
}
