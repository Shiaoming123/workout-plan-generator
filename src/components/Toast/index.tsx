import { createContext, useContext, useCallback, useState, ReactNode } from 'react';

/**
 * Toast 消息类型
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast 消息接口
 */
export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

/**
 * Toast 上下文接口
 */
interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

// 创建 Toast 上下文
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Toast Provider 组件
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { id, type, message, duration };

    setToasts((prev) => [...prev, newToast]);

    // 自动移除
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value: ToastContextType = {
    toasts,
    showToast,
    removeToast,
    success: (message, duration) => showToast('success', message, duration),
    error: (message, duration) => showToast('error', message, duration),
    info: (message, duration) => showToast('info', message, duration),
    warning: (message, duration) => showToast('warning', message, duration),
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

/**
 * 使用 Toast Hook
 */
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
