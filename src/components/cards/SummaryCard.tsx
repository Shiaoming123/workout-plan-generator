import { TrainingPlan } from '../../types';

interface SummaryCardProps {
  plan: TrainingPlan;
}

export default function SummaryCard({ plan }: SummaryCardProps) {
  const { summary } = plan;

  // 根据目标类型选择渐变色
  const goalGradients: Record<string, string> = {
    fat_loss: 'bg-gradient-to-br from-orange-500 to-red-500',
    muscle_gain: 'bg-gradient-to-br from-blue-500 to-purple-600',
    fitness: 'bg-gradient-to-br from-cyan-500 to-blue-500',
    rehab: 'bg-gradient-to-br from-green-500 to-cyan-500',
    general: 'bg-gradient-to-br from-cyan-500 to-blue-500',
  };

  // 获取对应的渐变色（默认为 fitness 风格）
  const gradientClass = summary.goal
    ? goalGradients[summary.goal] || goalGradients.fitness
    : goalGradients.fitness;

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-card-lg">
      {/* 渐变背景 */}
      <div className={`${gradientClass} px-6 py-8 text-white`}>
        <div className="relative z-10">
          {/* 标题 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">训练计划概览</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm opacity-90">
                {plan.period === 'week' && '周计划'}
                {plan.period === 'month' && '月计划'}
                {plan.period === 'quarter' && '季度计划'}
              </span>
            </div>
          </div>

          {/* 核心指标 - Grid 布局 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricItem
              icon="🎯"
              label="训练目标"
              value={summary.goalZh}
            />
            <MetricItem
              icon="📅"
              label="频率"
              value={`${summary.daysPerWeek}天/周`}
            />
            <MetricItem
              icon="⏱️"
              label="时长"
              value={`${summary.sessionMinutes}分钟`}
            />
            <MetricItem
              icon="📊"
              label="总周数"
              value={`${summary.totalWeeks}周`}
            />
          </div>

          {/* 说明文字 */}
          {summary.phaseDescription && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm leading-relaxed opacity-95">
                {summary.phaseDescription}
              </p>
            </div>
          )}
        </div>

        {/* 装饰性背景图案 */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.3C64.8,55.4,53.8,67,40.3,73.8C26.8,80.6,10.8,82.6,-4.6,80.1C-20,77.6,-40,70.6,-56.4,59.3C-72.8,48,-85.6,32.4,-89.9,15.1C-94.2,-2.2,-90,-21.2,-80.8,-37.5C-71.6,-53.8,-57.4,-67.4,-41.5,-73.9C-25.6,-80.4,-7.9,-79.8,5.4,-77.7C18.7,-75.6,30.6,-83.6,44.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
      </div>

      {/* 安全提示（如有）*/}
      {summary.safetyNotes && (
        <div className="bg-amber-50 border-t-4 border-amber-400 px-6 py-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">安全提示</h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                {summary.safetyNotes}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 指标项组件
function MetricItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs opacity-80 mb-1">{label}</div>
      <div className="font-semibold text-lg">{value}</div>
    </div>
  );
}
