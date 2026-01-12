import { GoalTemplate, ExperienceModifier } from '../types';

/**
 * 目标模板：定义不同训练目标的训练类型占比
 */
export const goalTemplates: Record<string, GoalTemplate> = {
  fat_loss: {
    goal: 'fat_loss',
    strengthRatio: 0.3,
    cardioRatio: 0.4,
    hiitRatio: 0.2,
    mobilityRatio: 0.1,
    description: 'Fat Loss - Focus on cardio and HIIT with strength maintenance',
    descriptionZh: '减脂 - 以有氧和HIIT为主，维持力量',
  },
  muscle_gain: {
    goal: 'muscle_gain',
    strengthRatio: 0.7,
    cardioRatio: 0.1,
    hiitRatio: 0.05,
    mobilityRatio: 0.15,
    description: 'Muscle Gain - Heavy emphasis on strength training',
    descriptionZh: '增肌 - 力量训练为主',
  },
  fitness: {
    goal: 'fitness',
    strengthRatio: 0.4,
    cardioRatio: 0.3,
    hiitRatio: 0.15,
    mobilityRatio: 0.15,
    description: 'General Fitness - Balanced approach',
    descriptionZh: '体能提升 - 均衡发展',
  },
  rehab: {
    goal: 'rehab',
    strengthRatio: 0.3,
    cardioRatio: 0.2,
    hiitRatio: 0,
    mobilityRatio: 0.5,
    description: 'Rehabilitation - Low impact, focus on mobility and stability',
    descriptionZh: '康复 - 低冲击，注重活动度与稳定性',
  },
  general: {
    goal: 'general',
    strengthRatio: 0.35,
    cardioRatio: 0.3,
    hiitRatio: 0.15,
    mobilityRatio: 0.2,
    description: 'General Health - Well-rounded program',
    descriptionZh: '综合健康 - 全面发展',
  },
};

/**
 * 经验水平修正器：影响训练容量、强度、休息时间
 */
export const experienceModifiers: Record<string, ExperienceModifier> = {
  beginner: {
    experience: 'beginner',
    volumeMultiplier: 0.7, // 70% 容量
    intensityLevel: 'low',
    restMultiplier: 1.5, // 更长休息
  },
  intermediate: {
    experience: 'intermediate',
    volumeMultiplier: 1.0, // 标准容量
    intensityLevel: 'medium',
    restMultiplier: 1.0,
  },
  advanced: {
    experience: 'advanced',
    volumeMultiplier: 1.3, // 130% 容量
    intensityLevel: 'high',
    restMultiplier: 0.8, // 更短休息
  },
};

/**
 * 周期化训练模板：月度/季度的进展策略
 */
export interface ProgressionTemplate {
  weekNumber: number;
  volumeMultiplier: number; // 相对于基础容量的倍数
  intensityNote: string;
  intensityNoteZh: string;
}

/**
 * 月度进阶（4周）
 */
export const monthlyProgression: ProgressionTemplate[] = [
  {
    weekNumber: 1,
    volumeMultiplier: 0.9,
    intensityNote: 'Week 1 - Adaptation Phase',
    intensityNoteZh: '第1周 - 适应期',
  },
  {
    weekNumber: 2,
    volumeMultiplier: 1.0,
    intensityNote: 'Week 2 - Base Volume',
    intensityNoteZh: '第2周 - 基础容量',
  },
  {
    weekNumber: 3,
    volumeMultiplier: 1.1,
    intensityNote: 'Week 3 - Volume Push',
    intensityNoteZh: '第3周 - 容量提升',
  },
  {
    weekNumber: 4,
    volumeMultiplier: 0.7,
    intensityNote: 'Week 4 - Deload',
    intensityNoteZh: '第4周 - 减量周',
  },
];

/**
 * 季度进阶（3个月）
 */
export interface MonthProgressionTemplate {
  monthNumber: number;
  phaseNote: string;
  phaseNoteZh: string;
  volumeMultiplier: number;
}

export const quarterlyProgression: MonthProgressionTemplate[] = [
  {
    monthNumber: 1,
    phaseNote: 'Month 1 - Foundation Building',
    phaseNoteZh: '第1月 - 基础构建',
    volumeMultiplier: 0.9,
  },
  {
    monthNumber: 2,
    phaseNote: 'Month 2 - Intensity Increase',
    phaseNoteZh: '第2月 - 强度提升',
    volumeMultiplier: 1.1,
  },
  {
    monthNumber: 3,
    phaseNote: 'Month 3 - Peak and Consolidate',
    phaseNoteZh: '第3月 - 峰值与巩固',
    volumeMultiplier: 1.15,
  },
];

/**
 * 训练分布模板：根据每周天数决定训练安排
 */
export interface TrainingSplit {
  daysPerWeek: number;
  splitPattern: string[];
  splitPatternZh: string[];
  description: string;
  descriptionZh: string;
}

export const trainingSplits: TrainingSplit[] = [
  {
    daysPerWeek: 2,
    splitPattern: ['Full Body', 'Full Body'],
    splitPatternZh: ['全身训练', '全身训练'],
    description: '2x per week - Full body workouts',
    descriptionZh: '每周2次 - 全身训练',
  },
  {
    daysPerWeek: 3,
    splitPattern: ['Upper Body', 'Lower Body', 'Full Body'],
    splitPatternZh: ['上肢', '下肢', '全身'],
    description: '3x per week - Upper/Lower/Full split',
    descriptionZh: '每周3次 - 上下肢分化',
  },
  {
    daysPerWeek: 4,
    splitPattern: ['Upper Push', 'Lower', 'Upper Pull', 'Core & Cardio'],
    splitPatternZh: ['上肢推', '下肢', '上肢拉', '核心+有氧'],
    description: '4x per week - Push/Pull/Legs variation',
    descriptionZh: '每周4次 - 推拉腿变式',
  },
  {
    daysPerWeek: 5,
    splitPattern: ['Upper Push', 'Lower', 'Upper Pull', 'Lower', 'Full Body'],
    splitPatternZh: ['上肢推', '下肢', '上肢拉', '下肢', '全身'],
    description: '5x per week - Upper/Lower split with extra day',
    descriptionZh: '每周5次 - 上下肢分化+全身',
  },
  {
    daysPerWeek: 6,
    splitPattern: [
      'Push',
      'Pull',
      'Legs',
      'Push',
      'Pull',
      'Legs & Core',
    ],
    splitPatternZh: ['推', '拉', '腿', '推', '拉', '腿+核心'],
    description: '6x per week - Push/Pull/Legs twice',
    descriptionZh: '每周6次 - 推拉腿两轮',
  },
];

/**
 * 根据每周天数获取训练分布
 */
export function getTrainingSplit(daysPerWeek: number): TrainingSplit {
  const split = trainingSplits.find((s) => s.daysPerWeek === daysPerWeek);
  if (!split) {
    return trainingSplits[0];
  }
  return split;
}

/**
 * 安全提示：根据约束条件生成
 */
export function getSafetyNotes(constraints: string[]): string {
  const notes: string[] = [];

  if (constraints.includes('knee_issue')) {
    notes.push(
      '膝盖不适：避免高冲击跳跃动作，深蹲不要过深，优先臀桥和单腿训练。'
    );
  }
  if (constraints.includes('back_issue')) {
    notes.push(
      '腰背不适：避免大重量深屈髋动作，加强核心稳定性训练，优先分腿动作。'
    );
  }
  if (constraints.includes('shoulder_issue')) {
    notes.push(
      '肩部不适：避免过头推举和宽握下拉，优先划船和肩胛稳定性训练。'
    );
  }
  if (constraints.includes('postpartum')) {
    notes.push(
      '产后恢复：优先盆底肌和核心重建，避免高冲击和腹压过大动作，循序渐进。'
    );
  }
  if (constraints.includes('hypertension')) {
    notes.push('高血压：避免憋气用力，保持呼吸顺畅，优先中低强度有氧。');
  }

  if (notes.length === 0) {
    return '请在训练前充分热身，训练后进行拉伸。如有不适请立即停止。';
  }

  return notes.join(' ');
}
