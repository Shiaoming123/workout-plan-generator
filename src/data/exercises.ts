import { Exercise } from '../types';

/**
 * 动作数据库
 *
 * 扩展方式：
 * 1. 添加新动作：在对应分类数组中添加新的 Exercise 对象
 * 2. requiredEquipment: 标注需要的器械（空数组表示徒手）
 * 3. contraindications: 列出禁忌症（哪些身体问题应避免此动作）
 * 4. isHighImpact: 标记是否高冲击（膝盖不适者应避免）
 */

// ========== 热身动作 ==========
export const warmupExercises: Exercise[] = [
  {
    id: 'warmup_1',
    name: 'Jumping Jacks',
    nameZh: '开合跳',
    category: 'warmup',
    requiredEquipment: [],
    targetMuscles: ['全身'],
    difficulty: 'beginner',
    contraindications: ['knee_issue'],
    isHighImpact: true,
  },
  {
    id: 'warmup_2',
    name: 'Arm Circles',
    nameZh: '手臂环绕',
    category: 'warmup',
    requiredEquipment: [],
    targetMuscles: ['肩'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'warmup_3',
    name: 'Leg Swings',
    nameZh: '腿部摆动',
    category: 'warmup',
    requiredEquipment: [],
    targetMuscles: ['髋', '腿'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'warmup_4',
    name: 'Cat-Cow Stretch',
    nameZh: '猫牛式',
    category: 'warmup',
    requiredEquipment: [],
    targetMuscles: ['脊柱', '核心'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'warmup_5',
    name: 'Inch Worms',
    nameZh: '毛毛虫爬行',
    category: 'warmup',
    requiredEquipment: [],
    targetMuscles: ['全身', '核心'],
    difficulty: 'beginner',
    contraindications: ['back_issue'],
    isHighImpact: false,
  },
];

// ========== 上肢力量 ==========
export const upperStrengthExercises: Exercise[] = [
  {
    id: 'upper_1',
    name: 'Push-ups',
    nameZh: '俯卧撑',
    category: 'strength_upper',
    requiredEquipment: [],
    targetMuscles: ['胸', '肩', '三头'],
    difficulty: 'beginner',
    contraindications: ['shoulder_issue'],
    isHighImpact: false,
  },
  {
    id: 'upper_2',
    name: 'Dumbbell Bench Press',
    nameZh: '哑铃卧推',
    category: 'strength_upper',
    requiredEquipment: ['dumbbells'],
    targetMuscles: ['胸', '肩', '三头'],
    difficulty: 'intermediate',
    contraindications: ['shoulder_issue'],
    isHighImpact: false,
  },
  {
    id: 'upper_3',
    name: 'Dumbbell Rows',
    nameZh: '哑铃划船',
    category: 'strength_upper',
    requiredEquipment: ['dumbbells'],
    targetMuscles: ['背', '二头'],
    difficulty: 'beginner',
    contraindications: ['back_issue'],
    isHighImpact: false,
  },
  {
    id: 'upper_4',
    name: 'Overhead Press',
    nameZh: '过头推举',
    category: 'strength_upper',
    requiredEquipment: ['dumbbells', 'barbell'],
    targetMuscles: ['肩', '三头'],
    difficulty: 'intermediate',
    contraindications: ['shoulder_issue'],
    isHighImpact: false,
  },
  {
    id: 'upper_5',
    name: 'Pull-ups / Assisted Pull-ups',
    nameZh: '引体向上',
    category: 'strength_upper',
    requiredEquipment: ['full_gym'],
    targetMuscles: ['背', '二头'],
    difficulty: 'intermediate',
    contraindications: ['shoulder_issue'],
    isHighImpact: false,
  },
  {
    id: 'upper_6',
    name: 'Pike Push-ups',
    nameZh: '派克俯卧撑',
    category: 'strength_upper',
    requiredEquipment: [],
    targetMuscles: ['肩', '三头'],
    difficulty: 'intermediate',
    contraindications: ['shoulder_issue'],
    isHighImpact: false,
  },
  {
    id: 'upper_7',
    name: 'Dumbbell Shoulder Press',
    nameZh: '哑铃肩推',
    category: 'strength_upper',
    requiredEquipment: ['dumbbells'],
    targetMuscles: ['肩', '三头'],
    difficulty: 'beginner',
    contraindications: ['shoulder_issue'],
    isHighImpact: false,
  },
];

// ========== 下肢力量 ==========
export const lowerStrengthExercises: Exercise[] = [
  {
    id: 'lower_1',
    name: 'Bodyweight Squats',
    nameZh: '徒手深蹲',
    category: 'strength_lower',
    requiredEquipment: [],
    targetMuscles: ['股四头', '臀'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'lower_2',
    name: 'Goblet Squats',
    nameZh: '高脚杯深蹲',
    category: 'strength_lower',
    requiredEquipment: ['dumbbells', 'kettlebell'],
    targetMuscles: ['股四头', '臀'],
    difficulty: 'beginner',
    contraindications: ['knee_issue'],
    isHighImpact: false,
  },
  {
    id: 'lower_3',
    name: 'Lunges',
    nameZh: '弓步蹲',
    category: 'strength_lower',
    requiredEquipment: [],
    targetMuscles: ['股四头', '臀', '腘绳肌'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'lower_4',
    name: 'Romanian Deadlift',
    nameZh: '罗马尼亚硬拉',
    category: 'strength_lower',
    requiredEquipment: ['dumbbells', 'barbell'],
    targetMuscles: ['腘绳肌', '臀', '背'],
    difficulty: 'intermediate',
    contraindications: ['back_issue'],
    isHighImpact: false,
  },
  {
    id: 'lower_5',
    name: 'Glute Bridges',
    nameZh: '臀桥',
    category: 'strength_lower',
    requiredEquipment: [],
    targetMuscles: ['臀', '腘绳肌'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'lower_6',
    name: 'Bulgarian Split Squats',
    nameZh: '保加利亚分腿蹲',
    category: 'strength_lower',
    requiredEquipment: [],
    targetMuscles: ['股四头', '臀'],
    difficulty: 'intermediate',
    contraindications: ['knee_issue'],
    isHighImpact: false,
  },
  {
    id: 'lower_7',
    name: 'Step-ups',
    nameZh: '箱式登阶',
    category: 'strength_lower',
    requiredEquipment: [],
    targetMuscles: ['股四头', '臀'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'lower_8',
    name: 'Calf Raises',
    nameZh: '提踵',
    category: 'strength_lower',
    requiredEquipment: [],
    targetMuscles: ['小腿'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
];

// ========== 核心力量 ==========
export const coreStrengthExercises: Exercise[] = [
  {
    id: 'core_1',
    name: 'Plank',
    nameZh: '平板支撑',
    category: 'strength_core',
    requiredEquipment: [],
    targetMuscles: ['核心', '腹'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'core_2',
    name: 'Side Plank',
    nameZh: '侧平板',
    category: 'strength_core',
    requiredEquipment: [],
    targetMuscles: ['核心', '腹斜肌'],
    difficulty: 'beginner',
    contraindications: ['shoulder_issue'],
    isHighImpact: false,
  },
  {
    id: 'core_3',
    name: 'Dead Bug',
    nameZh: '死虫式',
    category: 'strength_core',
    requiredEquipment: [],
    targetMuscles: ['核心', '腹'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'core_4',
    name: 'Bird Dog',
    nameZh: '鸟狗式',
    category: 'strength_core',
    requiredEquipment: [],
    targetMuscles: ['核心', '背'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'core_5',
    name: 'Russian Twists',
    nameZh: '俄罗斯转体',
    category: 'strength_core',
    requiredEquipment: [],
    targetMuscles: ['腹斜肌', '核心'],
    difficulty: 'intermediate',
    contraindications: ['back_issue'],
    isHighImpact: false,
  },
  {
    id: 'core_6',
    name: 'Mountain Climbers',
    nameZh: '登山跑',
    category: 'strength_core',
    requiredEquipment: [],
    targetMuscles: ['核心', '全身'],
    difficulty: 'intermediate',
    contraindications: ['knee_issue'],
    isHighImpact: true,
  },
];

// ========== 有氧运动 ==========
export const cardioExercises: Exercise[] = [
  {
    id: 'cardio_1',
    name: 'Brisk Walking',
    nameZh: '快走',
    category: 'cardio',
    requiredEquipment: [],
    targetMuscles: ['全身', '心肺'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'cardio_2',
    name: 'Jogging',
    nameZh: '慢跑',
    category: 'cardio',
    requiredEquipment: [],
    targetMuscles: ['腿', '心肺'],
    difficulty: 'beginner',
    contraindications: ['knee_issue'],
    isHighImpact: true,
  },
  {
    id: 'cardio_3',
    name: 'Cycling',
    nameZh: '骑行',
    category: 'cardio',
    requiredEquipment: [],
    targetMuscles: ['腿', '心肺'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'cardio_4',
    name: 'Jump Rope',
    nameZh: '跳绳',
    category: 'cardio',
    requiredEquipment: [],
    targetMuscles: ['全身', '心肺'],
    difficulty: 'intermediate',
    contraindications: ['knee_issue'],
    isHighImpact: true,
  },
  {
    id: 'cardio_5',
    name: 'Elliptical',
    nameZh: '椭圆机',
    category: 'cardio',
    requiredEquipment: ['full_gym'],
    targetMuscles: ['全身', '心肺'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'cardio_6',
    name: 'Rowing Machine',
    nameZh: '划船机',
    category: 'cardio',
    requiredEquipment: ['full_gym'],
    targetMuscles: ['全身', '心肺', '背'],
    difficulty: 'intermediate',
    contraindications: ['back_issue'],
    isHighImpact: false,
  },
];

// ========== HIIT 动作 ==========
export const hiitExercises: Exercise[] = [
  {
    id: 'hiit_1',
    name: 'Burpees',
    nameZh: '波比跳',
    category: 'hiit',
    requiredEquipment: [],
    targetMuscles: ['全身'],
    difficulty: 'intermediate',
    contraindications: ['knee_issue', 'back_issue'],
    isHighImpact: true,
  },
  {
    id: 'hiit_2',
    name: 'High Knees',
    nameZh: '高抬腿',
    category: 'hiit',
    requiredEquipment: [],
    targetMuscles: ['腿', '核心'],
    difficulty: 'beginner',
    contraindications: ['knee_issue'],
    isHighImpact: true,
  },
  {
    id: 'hiit_3',
    name: 'Squat Jumps',
    nameZh: '深蹲跳',
    category: 'hiit',
    requiredEquipment: [],
    targetMuscles: ['腿', '臀'],
    difficulty: 'intermediate',
    contraindications: ['knee_issue'],
    isHighImpact: true,
  },
  {
    id: 'hiit_4',
    name: 'Kettlebell Swings',
    nameZh: '壶铃摇摆',
    category: 'hiit',
    requiredEquipment: ['kettlebell'],
    targetMuscles: ['臀', '腿', '核心'],
    difficulty: 'intermediate',
    contraindications: ['back_issue'],
    isHighImpact: false,
  },
];

// ========== 拉伸与放松 ==========
export const stretchExercises: Exercise[] = [
  {
    id: 'stretch_1',
    name: 'Hamstring Stretch',
    nameZh: '腘绳肌拉伸',
    category: 'stretch',
    requiredEquipment: [],
    targetMuscles: ['腘绳肌'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'stretch_2',
    name: 'Quad Stretch',
    nameZh: '股四头拉伸',
    category: 'stretch',
    requiredEquipment: [],
    targetMuscles: ['股四头'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'stretch_3',
    name: 'Child Pose',
    nameZh: '婴儿式',
    category: 'stretch',
    requiredEquipment: [],
    targetMuscles: ['背', '肩'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'stretch_4',
    name: 'Shoulder Stretch',
    nameZh: '肩部拉伸',
    category: 'stretch',
    requiredEquipment: [],
    targetMuscles: ['肩'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'stretch_5',
    name: 'Hip Flexor Stretch',
    nameZh: '髋屈肌拉伸',
    category: 'stretch',
    requiredEquipment: [],
    targetMuscles: ['髋'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'stretch_6',
    name: 'Cat-Cow Stretch',
    nameZh: '猫牛式拉伸',
    category: 'stretch',
    requiredEquipment: [],
    targetMuscles: ['脊柱'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
];

// ========== 活动度动作 ==========
export const mobilityExercises: Exercise[] = [
  {
    id: 'mobility_1',
    name: 'Hip Circles',
    nameZh: '髋关节环绕',
    category: 'mobility',
    requiredEquipment: [],
    targetMuscles: ['髋'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'mobility_2',
    name: 'Shoulder Dislocations',
    nameZh: '肩关节活动',
    category: 'mobility',
    requiredEquipment: ['resistance_bands'],
    targetMuscles: ['肩'],
    difficulty: 'beginner',
    contraindications: ['shoulder_issue'],
    isHighImpact: false,
  },
  {
    id: 'mobility_3',
    name: 'Ankle Circles',
    nameZh: '踝关节环绕',
    category: 'mobility',
    requiredEquipment: [],
    targetMuscles: ['踝'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
  {
    id: 'mobility_4',
    name: 'Thoracic Rotations',
    nameZh: '胸椎旋转',
    category: 'mobility',
    requiredEquipment: [],
    targetMuscles: ['胸椎', '背'],
    difficulty: 'beginner',
    contraindications: [],
    isHighImpact: false,
  },
];

// ========== 汇总所有动作 ==========
export const allExercises: Exercise[] = [
  ...warmupExercises,
  ...upperStrengthExercises,
  ...lowerStrengthExercises,
  ...coreStrengthExercises,
  ...cardioExercises,
  ...hiitExercises,
  ...stretchExercises,
  ...mobilityExercises,
];

// ========== 辅助函数：根据条件筛选动作 ==========

/**
 * 根据用户器械筛选可用动作
 */
export function filterByEquipment(
  exercises: Exercise[],
  availableEquipment: string[]
): Exercise[] {
  return exercises.filter((ex) => {
    if (ex.requiredEquipment.length === 0) return true;
    return ex.requiredEquipment.some((eq) => availableEquipment.includes(eq));
  });
}

/**
 * 排除有禁忌症的动作
 */
export function filterByConstraints(
  exercises: Exercise[],
  userConstraints: string[]
): Exercise[] {
  return exercises.filter((ex) => {
    return !ex.contraindications.some((contra) =>
      userConstraints.includes(contra)
    );
  });
}

/**
 * 排除高冲击动作（膝盖问题）
 */
export function filterHighImpact(
  exercises: Exercise[],
  avoidHighImpact: boolean
): Exercise[] {
  if (!avoidHighImpact) return exercises;
  return exercises.filter((ex) => !ex.isHighImpact);
}

/**
 * 综合筛选：同时考虑器械、禁忌、冲击
 */
export function getAvailableExercises(
  exercises: Exercise[],
  availableEquipment: string[],
  userConstraints: string[]
): Exercise[] {
  let filtered = filterByEquipment(exercises, availableEquipment);
  filtered = filterByConstraints(filtered, userConstraints);
  const hasKneeIssue = userConstraints.includes('knee_issue');
  filtered = filterHighImpact(filtered, hasKneeIssue);
  return filtered;
}
