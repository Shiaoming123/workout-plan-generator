import { useState, useEffect, useRef } from 'react';

interface StreamingDisplayProps {
  content: string;
  reasoning: string;
  progress?: { current: number; total: number } | null;
  onCancel?: () => void;
}

/**
 * 流式输出显示组件
 *
 * 用于实时显示 AI 生成的流式内容
 * 支持显示进度条和中断按钮
 */
export default function StreamingDisplay({
  content,
  reasoning,
  progress,
  onCancel
}: StreamingDisplayProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const reasoningRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部（跟随最新内容）
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [content]);

  useEffect(() => {
    if (reasoningRef.current) {
      reasoningRef.current.scrollTop = reasoningRef.current.scrollHeight;
    }
  }, [reasoning]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* 标题栏和中断按钮 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="animate-pulse flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <h2 className="text-xl font-bold text-gray-800">AI 正在生成训练计划...</h2>
        </div>

        {/* 中断按钮 */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            title="中断生成"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>中断生成</span>
          </button>
        )}
      </div>

      {/* 进度条（如果是按周生成）*/}
      {progress && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-900">
              正在生成第 {progress.current}/{progress.total} 周
            </span>
            <span className="text-sm text-blue-700">
              {Math.round((progress.current / progress.total) * 100)}%
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            💡 提示：每周计划单独生成，避免超出 token 限制
          </p>
        </div>
      )}

      {/* 推理过程（如果有）*/}
      {reasoning && (
        <div className="mb-6 border-2 border-purple-300 rounded-lg overflow-hidden bg-purple-50">
          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="w-full px-4 py-3 bg-purple-100 hover:bg-purple-200 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              <h4 className="font-bold text-purple-900">
                AI 推理过程（实时）
              </h4>
            </div>
            <svg
              className={`w-5 h-5 text-purple-700 transform transition-transform ${
                showReasoning ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showReasoning && (
            <div className="p-4">
              <div
                ref={reasoningRef}
                className="bg-white rounded-lg p-4 border border-purple-200 max-h-64 overflow-y-auto"
              >
                <div className="prose prose-sm max-w-none prose-purple whitespace-pre-wrap">
                  {reasoning}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 生成内容（实时显示）*/}
      <div className="border-2 border-blue-300 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-blue-100">
          <h4 className="font-bold text-blue-900">生成内容（实时）</h4>
        </div>
        <div
          ref={contentRef}
          className="p-4 bg-white max-h-[32rem] overflow-y-auto"
        >
          <div className="prose prose-sm max-w-none font-mono text-xs whitespace-pre-wrap break-words">
            {content || '等待 AI 响应...'}
          </div>
          {/* 光标动画 */}
          <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse ml-1"></span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
        <p className="text-sm text-yellow-800">
          ⏳ 正在实时接收 AI 生成的内容，请稍候...生成完成后将自动解析并显示完整的训练计划。
        </p>
      </div>
    </div>
  );
}
