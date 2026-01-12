import type { TrainingPlan, GenerationMetadata } from '../types';

/**
 * 验证训练计划的基本结构
 *
 * @param data - 待验证的数据
 * @returns 是否为有效的训练计划
 */
export function validateTrainingPlan(data: unknown): data is TrainingPlan {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const plan = data as Partial<TrainingPlan>;

  // 验证必需字段
  if (!plan.period || !plan.summary || !plan.generatedAt) {
    return false;
  }

  // 验证 period 类型
  if (!['week', 'month', 'quarter'].includes(plan.period)) {
    return false;
  }

  // 验证 summary
  if (
    !plan.summary.goal ||
    !plan.summary.goalZh ||
    typeof plan.summary.daysPerWeek !== 'number' ||
    typeof plan.summary.sessionMinutes !== 'number' ||
    typeof plan.summary.totalWeeks !== 'number'
  ) {
    return false;
  }

  // 根据 period 验证结构
  if (plan.period === 'week' || plan.period === 'month') {
    if (!Array.isArray(plan.weeks) || plan.weeks.length === 0) {
      return false;
    }
  } else if (plan.period === 'quarter') {
    if (!Array.isArray(plan.months) || plan.months.length === 0) {
      return false;
    }
  }

  return true;
}

/**
 * 为训练计划添加元数据
 *
 * @param plan - 原始训练计划
 * @param metadata - 生成元数据
 * @returns 包含元数据的完整训练计划
 */
export function enrichPlanWithMetadata(
  plan: Omit<TrainingPlan, 'metadata'>,
  metadata: GenerationMetadata
): TrainingPlan {
  return {
    ...plan,
    metadata,
  };
}

/**
 * 基本的计划完整性检查（宽松）
 *
 * @param plan - 训练计划
 * @returns 检查结果和警告信息
 */
export function checkPlanCompleteness(plan: TrainingPlan): {
  isComplete: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  // 检查 weeks 或 months
  if (plan.period === 'quarter') {
    if (!plan.months || plan.months.length === 0) {
      warnings.push('季度计划缺少月份数据');
    } else {
      plan.months.forEach((month, idx) => {
        if (!month.weeks || month.weeks.length === 0) {
          warnings.push(`第 ${idx + 1} 月缺少周数据`);
        }
      });
    }
  } else {
    if (!plan.weeks || plan.weeks.length === 0) {
      warnings.push('计划缺少周数据');
    }
  }

  // 检查 sessions
  const allWeeks =
    plan.period === 'quarter'
      ? plan.months?.flatMap((m) => m.weeks) || []
      : plan.weeks || [];

  allWeeks.forEach((week, idx) => {
    if (!week.sessions || week.sessions.length === 0) {
      warnings.push(`第 ${idx + 1} 周缺少训练日数据`);
    }
  });

  return {
    isComplete: warnings.length === 0,
    warnings,
  };
}
