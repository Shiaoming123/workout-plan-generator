import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReasoningDisplayProps {
  reasoning: string;
}

/**
 * 思考过程展示组件
 *
 * 用于展示 DeepSeek Reasoner 模型的推理过程
 * 可折叠展开，默认折叠，支持 Markdown 渲染
 */
export default function ReasoningDisplay({ reasoning }: ReasoningDisplayProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-6 border-2 border-purple-300 rounded-lg overflow-hidden bg-purple-50 print:border print:border-purple-200">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 bg-purple-100 hover:bg-purple-200 flex items-center justify-between transition-colors print:hidden"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <h4 className="font-bold text-purple-900">
            AI 推理过程 (Reasoning Process)
          </h4>
        </div>
        <svg
          className={`w-5 h-5 text-purple-700 transform transition-transform ${
            expanded ? 'rotate-180' : ''
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

      {/* Print: always show header */}
      <div className="hidden print:block px-4 py-2 bg-purple-100">
        <h4 className="font-bold text-purple-900 flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          AI 推理过程 (Reasoning Process)
        </h4>
      </div>

      {expanded && (
        <div className="p-4 print:block print:p-4">
          <div className="bg-white rounded-lg p-4 border border-purple-200 max-h-96 overflow-y-auto">
            <div className="prose prose-sm max-w-none prose-purple">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {reasoning}
              </ReactMarkdown>
            </div>
          </div>
          <p className="text-xs text-purple-700 mt-3">
            💡 这是 AI 在生成训练计划时的思考过程，展示了它如何分析你的情况并制定方案。
          </p>
        </div>
      )}
    </div>
  );
}
