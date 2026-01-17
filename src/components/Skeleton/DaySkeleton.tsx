import ExerciseSkeleton from './ExerciseSkeleton';

/**
 * 训练日骨架屏组件
 *
 * 用于在训练日数据加载时显示占位符
 * 包含多个运动卡片骨架屏
 */
interface DaySkeletonProps {
  exerciseCount?: number;
}

export default function DaySkeleton({ exerciseCount = 3 }: DaySkeletonProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-gray-300">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
          </div>
          <div>
            <div className="h-6 bg-gray-300 rounded w-48 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
      </div>

      {/* 运动列表骨架屏 */}
      <div className="space-y-3">
        {Array.from({ length: exerciseCount }).map((_, index) => (
          <ExerciseSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
