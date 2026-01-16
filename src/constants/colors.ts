/**
 * 颜色常量定义
 * 统一管理应用中的颜色配置，避免硬编码和重复
 */

/**
 * 训练目标对应的渐变色配置
 * 用于标题栏、按钮等视觉元素
 */
export const GOAL_GRADIENTS: Record<string, string> = {
  fat_loss: 'from-orange-500 to-red-500',
  muscle_gain: 'from-blue-500 to-purple-600',
  fitness: 'from-cyan-500 to-blue-500',
  rehabilitation: 'from-green-500 to-cyan-500',
  general: 'from-cyan-500 to-blue-500',
  strength: 'from-indigo-500 to-purple-600',
  endurance: 'from-teal-500 to-green-600',
  rehab: 'from-green-500 to-cyan-500',
} as const;

/**
 * 训练目标的中文名称映射
 */
export const GOAL_LABELS_ZH: Record<string, string> = {
  fat_loss: '减脂',
  muscle_gain: '增肌',
  fitness: '综合体能',
  rehabilitation: '康复训练',
  general: '综合训练',
  strength: '力量提升',
  endurance: '耐力提升',
  rehab: '康复训练',
} as const;

/**
 * 训练日颜色配置
 * 用于训练日卡片的边框颜色
 */
export const DAY_COLORS = [
  { name: 'blue', border: 'border-blue-200', bg: 'bg-blue-50', header: 'bg-blue-500' },
  { name: 'green', border: 'border-green-200', bg: 'bg-green-50', header: 'bg-green-500' },
  { name: 'purple', border: 'border-purple-200', bg: 'bg-purple-50', header: 'bg-purple-500' },
  { name: 'orange', border: 'border-orange-200', bg: 'bg-orange-50', header: 'bg-orange-500' },
  { name: 'pink', border: 'border-pink-200', bg: 'bg-pink-50', header: 'bg-pink-500' },
  { name: 'indigo', border: 'border-indigo-200', bg: 'bg-indigo-50', header: 'bg-indigo-500' },
  { name: 'cyan', border: 'border-cyan-200', bg: 'bg-cyan-50', header: 'bg-cyan-500' },
] as const;

/**
 * 训练阶段颜色配置
 */
export const PHASE_COLORS = {
  warmup: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  main: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  accessory: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  cooldown: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
} as const;

/**
 * 获取目标对应的渐变类名
 */
export function getGoalGradient(goal: string): string {
  return GOAL_GRADIENTS[goal] || GOAL_GRADIENTS.general;
}

/**
 * 获取目标对应的中文名称
 */
export function getGoalLabelZh(goal: string): string {
  return GOAL_LABELS_ZH[goal] || goal;
}
