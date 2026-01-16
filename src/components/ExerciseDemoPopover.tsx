/**
 * 运动演示悬浮框组件
 *
 * 点击运动卡片显示该运动的图片/视频演示
 *
 * 特性：
 * - 点击卡片显示演示弹窗（桌面端和移动端统一）
 * - 点击弹窗外部关闭
 * - 弹窗常驻在右下角，直到用户点击外部区域
 * - 懒加载 + 缓存
 * - 加载状态指示
 * - 错误处理
 * - 固定在网页右下角
 */

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { loadExerciseDemo, type ExerciseDemo } from '../lib/exerciseDemoService';

interface ExerciseDemoPopoverProps {
  /** 运动 ID */
  exerciseId: string;

  /** 运动名称（英文） */
  exerciseName: string;

  /** 运动名称（中文） */
  exerciseNameZh: string;

  /** 触发元素（卡片本身） */
  children: React.ReactNode;
}

export default function ExerciseDemoPopover({
  exerciseId,
  exerciseName,
  exerciseNameZh,
  children,
}: ExerciseDemoPopoverProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [demo, setDemo] = useState<ExerciseDemo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const popoverRef = useRef<HTMLDivElement>(null);

  // 点击卡片切换显示/隐藏
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isVisible) {
      // 如果已显示，则隐藏
      setIsVisible(false);
      setDemo(null);
      setIsLoading(false);
    } else {
      // 显示演示
      setIsVisible(true);
      setIsLoading(true);

      loadExerciseDemo(exerciseId, {
        loadVideo: true,
        exerciseName,
        exerciseNameZh,
      }).then((loadedDemo) => {
        setDemo(loadedDemo);
        setIsLoading(false);
      });
    }
  };

  // 点击外部关闭弹窗
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsVisible(false);
        setDemo(null);
        setIsLoading(false);
      }
    };

    // 添加延迟，避免立即触发
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  // 首次加载时显示日志帮助（仅一次）
  useEffect(() => {
    const hasShownHelp = sessionStorage.getItem('demoLogHelpShown');
    if (!hasShownHelp) {
      console.log(`
💡 运动演示日志系统已启用
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
所有演示请求都会被自动记录。
在控制台输入以下命令查看日志：

• printDemoLogStats() - 显示统计信息
• printMismatchedLogs() - 显示不匹配的映射
• exportDemoLogs() - 导出完整日志

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
      sessionStorage.setItem('demoLogHelpShown', 'true');
    }
  }, []);

  return (
    <div
      className="relative inline-block cursor-pointer group"
      onClick={handleClick}
    >
      {children}

      {/* 悬浮框 - 使用 Portal 渲染到 body */}
      {isVisible && createPortal(
        <div
          ref={popoverRef}
          className="fixed z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200"
          style={{
            right: '20px',
            bottom: '20px',
            maxHeight: '70vh',
            overflowY: 'auto',
          }}
        >
          {/* 标题栏 */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-lg truncate">
                {exerciseNameZh}
              </h3>
              <p className="text-blue-100 text-xs truncate">{exerciseName}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(false);
                setDemo(null);
                setIsLoading(false);
              }}
              className="ml-3 flex-shrink-0 text-white hover:text-white/80 transition-colors p-1 hover:bg-white/10 rounded"
              aria-label="关闭"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 内容区 */}
          <div className="p-4">
            {isLoading && (
              // 加载状态
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 text-sm">加载演示中...</p>
              </div>
            )}

            {!isLoading && demo && demo.loadStatus === 'loaded' && (
              // 已加载 - 显示图片/视频/文字描述
              <div className="space-y-3">
                {/* 优先显示视频 */}
                {demo.videoUrl ? (
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <video
                      src={demo.videoUrl}
                      className="w-full h-auto"
                      controls
                      preload="metadata"
                      poster={demo.imageUrl}
                    >
                      您的浏览器不支持视频播放
                    </video>
                  </div>
                ) : demo.imageUrl ? (
                  // 没有视频，显示图片
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={demo.imageUrl}
                      alt={`${demo.exerciseNameZh} 演示`}
                      className="w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  // 没有视频也没有图片，显示占位符
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-6 flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="w-16 h-16 mx-auto text-gray-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-gray-600 text-sm font-medium">暂无演示视频</p>
                      <p className="text-gray-500 text-xs mt-1">请参考下方文字说明</p>
                    </div>
                  </div>
                )}

                {/* 概述 */}
                {demo.overview && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-700 leading-relaxed">{demo.overview}</p>
                  </div>
                )}

                {/* 目标肌肉 */}
                {demo.targetMuscles && demo.targetMuscles.length > 0 && (
                  <div className="text-xs text-gray-700">
                    <p className="font-semibold mb-1">🎯 目标肌肉:</p>
                    <div className="flex flex-wrap gap-1">
                      {demo.targetMuscles.map((muscle, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 器械要求 */}
                {demo.equipment && demo.equipment.length > 0 && (
                  <div className="text-xs text-gray-700">
                    <p className="font-semibold mb-1">🏋️ 所需器械:</p>
                    <div className="flex flex-wrap gap-1">
                      {demo.equipment.map((eq, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 附加信息 */}
                {demo.bodyPart && !demo.targetMuscles && (
                  <div className="text-xs text-gray-600">
                    <p>
                      <span className="font-semibold">目标部位:</span> {demo.bodyPart}
                    </p>
                  </div>
                )}

                {/* 动作指导 */}
                {demo.instructions && demo.instructions.length > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs font-semibold text-green-900 mb-2">📝 动作步骤</p>
                    <ol className="text-xs text-green-800 space-y-1.5 list-decimal list-inside">
                      {demo.instructions.slice(0, 5).map((instruction, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* 动作提示 */}
                {demo.tips && demo.tips.length > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-semibold text-blue-900 mb-2">💡 动作提示</p>
                    <ul className="text-xs text-blue-800 space-y-1">
                      {demo.tips.slice(0, 3).map((tip, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-1 flex-shrink-0">•</span>
                          <span className="leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!isLoading && demo && demo.loadStatus === 'error' && (
              // 错误状态
              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-red-500 mb-3">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-red-600 text-sm text-center font-medium mb-1">
                  演示加载失败
                </p>
                <p className="text-gray-500 text-xs text-center px-4">
                  {demo.error || '未知错误'}
                </p>
              </div>
            )}
          </div>

          {/* 底部提示 */}
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              💡 点击外部区域或关闭按钮退出
            </p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
