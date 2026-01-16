// ============ User Input Types ============

import type { CustomAPIConfig } from './api';

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

export type PeriodType = 'week' | 'month' | 'quarter' | 'custom';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// ✅ 新增：饮食相关类型
export type MealFrequency = '2meals' | '3meals' | '4meals' | '5meals' | '6meals' | 'irregular';
export type DietaryPreference = 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo' | 'other';
export type FoodAllergy = 'dairy' | 'gluten' | 'nuts' | 'eggs' | 'soy' | 'shellfish' | 'other';
export type CookingAbility = 'cannot_cook' | 'basic' | 'intermediate' | 'advanced';

export interface DietProfile {
  // 用餐习惯
  mealFrequency: MealFrequency;
  dietaryPreference?: DietaryPreference;
  foodAllergies?: FoodAllergy[];
  allergyNotes?: string;

  // 当前饮食状况
  currentDiet?: string; // 当前饮食习惯描述
  waterIntake?: number; // 每日饮水量（杯/L）
  supplementUsage?: string; // 当前使用的补剂

  // 烹饪能力
  cookingAbility: CookingAbility;
  cookingTime?: number; // 每餐愿意花费的时间（分钟）

  // 饮食目标
  dietGoal?: string; // 饮食相关目标（增肌、减脂、维持等）

  // 备注
  dietNotes?: string;
}

export interface NutritionAdvice {
  // 基础营养建议
  dailyCalories?: number; // 每日建议热量
  proteinGrams: number; // 每日蛋白质摄入
  carbsGrams: number; // 每日碳水摄入
  fatGrams: number; // 每日脂肪摄入

  // 营养比例
  proteinRatio: string; // 蛋白质比例（如"30%"）
  carbsRatio: string;
  fatRatio: string;

  // 餐食安排
  mealPlan: MealPlan[];

  // 水分摄入
  waterIntake: {
    dailyLiters: number; // 每日建议升数
  };

  // 食谱推荐
  recipes: Recipe[];
}

export interface MealPlan {
  mealType: string; // 早餐、午餐、晚餐、加餐
  timing: string; // 建议用餐时间（如"7:00-8:00"）
  foods: string[]; // 推荐食物
  calories?: number; // 预估热量
  protein?: string; // 蛋白质来源
}

export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number; // 准备时间（分钟）
  calories?: number;
  protein?: string;
  notes?: string;
}

export interface RecoveryAdvice {
  // 睡眠建议
  sleep: {
    hours: number; // 建议睡眠时长
    tips: string[]; // 睡眠质量建议
  };

  // 休息日建议
  restDays: {
    frequency: string; // 休息频率
    activities: string[]; // 推荐的休息日活动
  };

  // 恢复技巧
  recoveryTechniques: {
    stretching: string[]; // 拉伸建议
    foamRolling: string[]; // 筋膜放松建议
    massage: string[]; // 按摩建议
    other: string[]; // 其他恢复方法
  };

  // 注意事项
  warningSigns: string[]; // 需要注意的信号（过度训练等）
}

export interface UserProfile {
  goal: Goal;
  gender: Gender;
  age: number;
  height: number; // cm
  weight: number; // kg
  experience: Experience;
  daysPerWeek: number; // 1-7
  sessionMinutes: number; // 15-120
  location: Location;
  equipment: Equipment[];
  constraints: Constraint[];
  constraintNotes?: string;
  likes: ActivityPreference[];
  dislikes: ActivityPreference[];
  period: PeriodType;
  // ✅ 新增：更灵活的配置选项
  customWeeks?: number; // 自定义周数（当 period 为 'custom' 时使用）
  customSessionMinutes?: number; // 自定义训练时长（当选择"自定义"时使用）
  trainingDays?: DayOfWeek[]; // 选择具体的星期几训练（可选，例如：[1, 3, 5] 表示周一、三、五）
  // ============ AI Integration Fields ============
  aiModel: 'deepseek-chat' | 'deepseek-reasoner'; // AI 模型选择
  goalNotes?: string; // 目标补充说明
  experienceNotes?: string; // 经验补充说明
  equipmentNotes?: string; // 器械补充说明
  preferencesNotes?: string; // 其他偏好说明
  customAPI?: CustomAPIConfig; // ✅ 新增：自定义 API 配置

  // ✅ 新增：饮食情况（可选）
  dietProfile?: DietProfile;
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
  name?: string; // 动作英文名（AI 生成时会包含）
  nameZh?: string; // 动作中文名（AI 生成时会包含）
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

  // ✅ 新增：饮食建议
  nutritionAdvice?: NutritionAdvice;

  // ✅ 新增：恢复建议
  recoveryAdvice?: RecoveryAdvice;

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
