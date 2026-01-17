/**
 * 动画配置统一管理
 *
 * 集中管理 Framer Motion 动画配置
 * 确保动画一致性和性能优化
 */

/**
 * 基础动画变体
 */
export const baseVariants = {
  // 淡入动画
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },
  // 滑入动画（从右侧）
  slideInRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
    transition: { duration: 0.2 }
  },
  // 滑入动画（从下方）
  slideInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.25 }
  },
  // 缩放动画
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2 }
  },
  // 展开动画（用于折叠面板）
  expand: {
    initial: { height: 0, opacity: 0 },
    animate: { height: 'auto', opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: { duration: 0.3 }
  }
};

/**
 * 过渡配置预设
 */
export const transitions = {
  // 快速过渡（150ms）
  fast: { duration: 0.15 },
  // 标准过渡（200ms）
  normal: { duration: 0.2 },
  // 慢速过渡（300ms）
  slow: { duration: 0.3 },
  // 弹性过渡
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 10
  },
  // 平滑过渡
  smooth: {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3
  }
} as const;

/**
 * 性能优化的布局动画配置
 */
export const layoutAnimation = {
  layout: true,
  transition: { duration: 0.2 }
};

/**
 * 考虑用户偏好的动画配置
 *
 * @param prefersReducedMotion - 用户是否偏好减少动画
 * @param variants - 动画变体
 * @returns 考虑用户偏好后的动画配置
 */
export function getAccessibleAnimation<T extends Record<string, any>>(
  prefersReducedMotion: boolean | null,
  variants: T
): T {
  if (prefersReducedMotion === true) {
    return Object.fromEntries(
      Object.keys(variants).map(key => [key, {}])
    ) as T;
  }
  return variants;
}

/**
 * 列表项动画（stagger children）
 */
export const listVariants = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }
};
