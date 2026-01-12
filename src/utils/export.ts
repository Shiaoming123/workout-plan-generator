import { TrainingPlan, WorkoutSet } from '../types';
import { getExerciseById } from '../lib/planGenerator';

/**
 * 导出为 JSON 文件
 */
export function downloadJSON(plan: TrainingPlan) {
  const dataStr = JSON.stringify(plan, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `workout-plan-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(plan: TrainingPlan) {
  const text = formatPlanAsText(plan);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * 格式化计划为纯文本
 */
function formatPlanAsText(plan: TrainingPlan): string {
  let text = '========== 训练计划 ==========\n\n';
  text += `目标: ${plan.summary.goalZh}\n`;
  text += `频率: ${plan.summary.daysPerWeek}天/周\n`;
  text += `时长: ${plan.summary.sessionMinutes}分钟/次\n`;
  text += `总周数: ${plan.summary.totalWeeks}周\n`;
  text += `说明: ${plan.summary.phaseDescription}\n`;
  if (plan.summary.safetyNotes) {
    text += `\n⚠️  安全提示: ${plan.summary.safetyNotes}\n`;
  }
  text += '\n';

  if (plan.period === 'week' && plan.weeks) {
    plan.weeks.forEach((week) => {
      text += formatWeek(week);
    });
  }

  if (plan.period === 'month' && plan.weeks) {
    plan.weeks.forEach((week) => {
      text += `\n========== ${week.weekName} ==========\n`;
      text += formatWeek(week);
    });
  }

  if (plan.period === 'quarter' && plan.months) {
    plan.months.forEach((month) => {
      text += `\n\n########## ${month.monthName} ##########\n`;
      month.weeks.forEach((week) => {
        text += `\n---------- ${week.weekName} ----------\n`;
        text += formatWeek(week);
      });
    });
  }

  text += '\n\n生成时间: ' + new Date(plan.generatedAt).toLocaleString('zh-CN');
  return text;
}

/**
 * 格式化单周
 */
function formatWeek(week: any): string {
  let text = '';
  week.sessions.forEach((session: any) => {
    text += `\n--- ${session.dayName} ---\n`;
    text += `重点: ${session.focus}\n`;
    text += `时长: ${session.totalMinutes}分钟\n\n`;

    text += '【热身】\n';
    session.phases.warmup.forEach((set: WorkoutSet) => {
      text += formatSet(set);
    });

    text += '\n【主训练】\n';
    session.phases.main.forEach((set: WorkoutSet) => {
      text += formatSet(set);
    });

    text += '\n【辅助训练】\n';
    session.phases.accessory.forEach((set: WorkoutSet) => {
      text += formatSet(set);
    });

    text += '\n【放松拉伸】\n';
    session.phases.cooldown.forEach((set: WorkoutSet) => {
      text += formatSet(set);
    });

    text += '\n';
  });
  return text;
}

/**
 * 格式化单个动作组
 */
function formatSet(set: WorkoutSet): string {
  const exercise = getExerciseById(set.exerciseId);
  if (!exercise) return '';

  let line = `  • ${exercise.nameZh} (${exercise.name})`;

  if (set.sets) {
    line += ` - ${set.sets}组`;
  }
  if (set.reps) {
    line += ` × ${set.reps}次`;
  }
  if (set.duration) {
    line += ` ${set.duration}秒`;
  }
  if (set.restSec > 0) {
    line += ` | 休息${set.restSec}秒`;
  }
  if (set.rpe) {
    line += ` | RPE ${set.rpe}`;
  }
  if (set.notes) {
    line += ` (${set.notes})`;
  }

  return line + '\n';
}

/**
 * 打印计划
 */
export function printPlan() {
  window.print();
}
