import { useState, useEffect, useRef } from 'react';

interface StreamingDisplayProps {
  content: string;
  reasoning: string;
}

/**
 * 流式输出显示组件
 *
 * 用于实时显示 AI 生成的流式内容
 */
export default function StreamingDisplay({ content, reasoning }: StreamingDisplayProps) {
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
      <div className="flex items-center gap-2 mb-4">
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <h2 className="text-xl font-bold text-gray-800">AI 正在生成训练计划...</h2>
      </div>

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
