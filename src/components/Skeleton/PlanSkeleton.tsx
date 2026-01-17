import DaySkeleton from './DaySkeleton';

/**
 * 训练计划骨架屏组件
 *
 * 用于在训练计划加载时显示占位符
 * 模拟真实计划结构，提供更好的加载体验
 */
interface PlanSkeletonProps {
  dayCount?: number;
  exercisesPerDay?: number;
}

export default function PlanSkeleton({
  dayCount = 3,
  exercisesPerDay = 3
}: PlanSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* 元数据卡片骨架屏 */}
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-7 bg-gray-300 rounded w-64 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>

      {/* 训练日骨架屏列表 */}
      {Array.from({ length: dayCount }).map((_, index) => (
        <DaySkeleton key={index} exerciseCount={exercisesPerDay} />
      ))}

      {/* 加载提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-800 font-medium">正在生成训练计划...</p>
        </div>
        <p className="text-blue-600 text-sm mt-2">
          AI 正在分析您的需求，这可能需要几秒钟时间
        </p>
      </div>
    </div>
  );
}
