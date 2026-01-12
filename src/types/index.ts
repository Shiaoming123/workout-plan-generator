// ============ User Input Types ============

export type Goal = 'fat_loss' | 'muscle_gain' | 'fitness' | 'rehab' | 'general';
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type Experience = 'beginner' | 'intermediate' | 'advanced';
export type Location = 'home' | 'gym' | 'outdoor';
export type Equipment =
  | 'none'
  | 'dumbbells'
  | 'barbell'
  | 'kettlebell'
  | 'resistance_bands'
  | 'full_gym';

export type Constraint =
  | 'knee_issue'
  | 'back_issue'
  | 'shoulder_issue'
  | 'postpartum'
  | 'hypertension'
  | 'other';

export type ActivityPreference =
  | 'strength'
  | 'running'
  | 'hiit'
  | 'yoga_stretch'
  | 'mixed';

export type PeriodType = 'week' | 'month' | 'quarter';

export interface UserProfile {
  goal: Goal;
  gender: Gender;
  age: number;
  height: number; // cm
  weight: number; // kg
  experience: Experience;
  daysPerWeek: number; // 2-6
  sessionMinutes: number; // 20, 30, 45, 60, 90
  location: Location;
  equipment: Equipment[];
  constraints: Constraint[];
  constraintNotes?: string;
  likes: ActivityPreference[];
  dislikes: ActivityPreference[];
  period: PeriodType;
  // ============ AI Integration Fields ============
  aiModel: 'deepseek-chat' | 'deepseek-reasoner'; // AI 模型选择
  goalNotes?: string; // 目标补充说明
  experienceNotes?: string; // 经验补充说明
  equipmentNotes?: string; // 器械补充说明
  preferencesNotes?: string; // 其他偏好说明
}

// ============ Exercise & Workout Types ============

export type ExerciseCategory =
  | 'warmup'
  | 'strength_upper'
  | 'strength_lower'
  | 'strength_core'
  | 'cardio'
  | 'hiit'
  | 'mobility'
  | 'stretch';

export interface Exercise {
  id: string;
  name: string;
  nameZh: string;
  category: ExerciseCategory;
  requiredEquipment: Equipment[];
  targetMuscles: string[];
  difficulty: Experience;
  contraindications: Constraint[]; // 禁忌症：哪些约束条件下应避免
  isHighImpact: boolean; // 是否高冲击（膝盖/关节压力大）
}

export interface WorkoutSet {
  exerciseId: string;
  sets?: number;
  reps?: number | string; // "10-12" or "AMRAP"
  duration?: number; // seconds
  restSec: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  notes?: string;
}

export type SessionPhase = 'warmup' | 'main' | 'accessory' | 'cooldown';

export interface WorkoutSession {
  dayNumber: number;
  dayName: string; // e.g., "Day 1 - Upper Body"
  focus: string; // e.g., "上肢力量 + 核心"
  totalMinutes: number;
  phases: {
    warmup: WorkoutSet[];
    main: WorkoutSet[];
    accessory: WorkoutSet[];
    cooldown: WorkoutSet[];
  };
  notes?: string;
}

// ============ Plan Structure Types ============

export interface WeekPlan {
  weekNumber: number;
  weekName: string; // e.g., "Week 1 - Foundation"
  sessions: WorkoutSession[];
  notes?: string;
}

export interface MonthPlan {
  monthNumber: number;
  monthName: string; // e.g., "Month 1 - Base Building"
  weeks: WeekPlan[];
  notes?: string;
}

export interface PlanSummary {
  goal: string;
  goalZh: string;
  daysPerWeek: number;
  sessionMinutes: number;
  totalWeeks: number;
  phaseDescription: string;
  safetyNotes?: string;
}

export interface TrainingPlan {
  period: PeriodType;
  summary: PlanSummary;
  // 根据 period 不同，使用不同结构
  weeks?: WeekPlan[]; // for week plan
  months?: MonthPlan[]; // for month/quarter plan
  generatedAt: string;
  // ============ AI Integration Metadata ============
  metadata: GenerationMetadata;
}

// ============ Template Types ============

export interface GoalTemplate {
  goal: Goal;
  strengthRatio: number; // 0-1
  cardioRatio: number;
  hiitRatio: number;
  mobilityRatio: number;
  description: string;
  descriptionZh: string;
}

export interface ExperienceModifier {
  experience: Experience;
  volumeMultiplier: number; // 训练容量倍数
  intensityLevel: 'low' | 'medium' | 'high';
  restMultiplier: number; // 休息时间倍数
}

// ============ AI Generation Metadata ============

export interface GenerationMetadata {
  method: 'ai' | 'rule-based'; // 生成方式
  model?: 'deepseek-chat' | 'deepseek-reasoner'; // 使用的 AI 模型
  reasoningProcess?: string; // Reasoner 模型的思考过程
  generatedAt: string; // ISO 时间戳
  apiCallDuration?: number; // API 调用耗时（毫秒）
  fallbackReason?: string; // 降级到规则引擎的原因
}
