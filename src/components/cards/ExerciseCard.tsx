import { WorkoutSet } from '../../types';
import { getExerciseById } from '../../lib/planGenerator';

interface ExerciseCardProps {
  set: WorkoutSet;
}

export default function ExerciseCard({ set }: ExerciseCardProps) {
  // 优先使用 set 中的动作名称（AI 生成时包含），否则从数据库查找
  let name = set.name;
  let nameZh = set.nameZh;

  if (!name || !nameZh) {
    const exercise = getExerciseById(set.exerciseId);
    if (exercise) {
      name = exercise.name;
      nameZh = exercise.nameZh;
    }
  }

  // 如果还是找不到名称，返回 null
  if (!name || !nameZh) {
    console.error('无法找到动作信息，exerciseId:', set.exerciseId);
    return null;
  }

  return (
    <div className="group bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all duration-150">
      {/* 动作名称 */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h5 className="font-medium text-gray-900 leading-tight">
            {nameZh}
          </h5>
          <p className="text-xs text-gray-500 mt-0.5">{name}</p>
        </div>

        {/* RPE 指示器（如有）*/}
        {set.rpe && (
          <div
            className="flex-shrink-0 ml-3 px-2 py-1 rounded-md text-xs font-semibold"
            style={{
              backgroundColor: getRPEColor(set.rpe),
              color: '#fff',
            }}
          >
            RPE {set.rpe}
          </div>
        )}
      </div>

      {/* 训练参数 */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-700">
        {/* 组数 */}
        {set.sets && (
          <span className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="font-medium">{set.sets}组</span>
          </span>
        )}

        {/* 次数 */}
        {set.reps && (
          <span className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>{set.reps}次</span>
          </span>
        )}

        {/* 时长 */}
        {set.duration && (
          <span className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{set.duration}秒</span>
          </span>
        )}

        {/* 休息时间 */}
        {set.restSec > 0 && (
          <span className="flex items-center space-x-1 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">休息{set.restSec}秒</span>
          </span>
        )}
      </div>

      {/* 备注（如有）*/}
      {set.notes && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-600 leading-relaxed flex items-start space-x-1">
            <span className="text-blue-500 flex-shrink-0 mt-0.5">💡</span>
            <span>{set.notes}</span>
          </p>
        </div>
      )}
    </div>
  );
}

// 根据 RPE 值返回对应的颜色
function getRPEColor(rpe: number): string {
  if (rpe <= 3) return '#22c55e'; // green-500
  if (rpe <= 5) return '#3b82f6'; // blue-500
  if (rpe <= 7) return '#f59e0b'; // amber-500
  if (rpe <= 9) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
}
