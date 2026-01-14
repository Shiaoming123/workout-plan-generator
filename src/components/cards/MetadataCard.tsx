import { GenerationMetadata } from '../../types';

interface MetadataCardProps {
  metadata: GenerationMetadata;
}

export default function MetadataCard({ metadata }: MetadataCardProps) {
  const isAI = metadata.method === 'ai';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card p-5 transition-all duration-200 hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        {/* 左侧：生成方式 */}
        <div className="flex items-center space-x-3">
          <div
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm ${
              isAI
                ? 'bg-purple-100 text-purple-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <span className="text-lg">{isAI ? '🤖' : '📋'}</span>
            <span>
              {isAI
                ? `AI 驱动${metadata.model ? ` · ${metadata.model}` : ''}`
                : '规则引擎'}
            </span>
          </div>

          {/* 降级原因（如果有）*/}
          {metadata.fallbackReason && (
            <div className="flex items-center space-x-2 text-amber-700 text-sm">
              <span>ℹ️</span>
              <span>{metadata.fallbackReason}</span>
            </div>
          )}
        </div>

        {/* 右侧：耗时信息 */}
        {metadata.apiCallDuration && (
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              耗时 {(metadata.apiCallDuration / 1000).toFixed(2)}秒
            </span>
          </div>
        )}
      </div>

      {/* 生成时间 */}
      {metadata.generatedAt && (
        <div className="mt-3 text-xs text-gray-500">
          生成时间：{new Date(metadata.generatedAt).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      )}
    </div>
  );
}
