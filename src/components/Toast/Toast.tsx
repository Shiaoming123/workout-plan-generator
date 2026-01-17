import { useToast } from './index';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

/**
 * Toast 通知组件
 *
 * 显示所有激活的 Toast 通知，支持不同类型和自动消失
 */
export default function Toast() {
  const { toasts, removeToast } = useToast();
  const prefersReducedMotion = useReducedMotion();

  // 类型对应的样式配置
  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: '✅',
      iconBg: 'bg-green-100',
      text: 'text-green-800',
      title: '成功',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: '❌',
      iconBg: 'bg-red-100',
      text: 'text-red-800',
      title: '错误',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'ℹ️',
      iconBg: 'bg-blue-100',
      text: 'text-blue-800',
      title: '提示',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: '⚠️',
      iconBg: 'bg-yellow-100',
      text: 'text-yellow-800',
      title: '警告',
    },
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const styles = typeStyles[toast.type];

          return (
            <motion.div
              key={toast.id}
              initial={prefersReducedMotion ? {} : { opacity: 0, x: 100, scale: 0.9 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, x: 0, scale: 1 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`${styles.bg} ${styles.border} ${styles.text} pointer-events-auto rounded-lg border shadow-lg p-4 min-w-[300px] max-w-md`}
            >
              <div className="flex items-start gap-3">
                {/* 图标 */}
                <div className={`${styles.iconBg} flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg`}>
                  {styles.icon}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{styles.title}</p>
                  <p className="text-sm mt-1 break-words">{toast.message}</p>
                </div>

                {/* 关闭按钮 */}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label="关闭通知"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
