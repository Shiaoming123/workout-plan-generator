/**
 * 运动卡片骨架屏组件
 *
 * 用于在运动卡片数据加载时显示占位符
 * 提供视觉反馈，改善感知性能
 */
export default function ExerciseSkeleton() {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-pulse">
      {/* 标题栏 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
      </div>

      {/* 属性标签 */}
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-14 bg-gray-200 rounded-full"></div>
      </div>

      {/* 组数和次数 */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>

      {/* 提示文本 */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}
