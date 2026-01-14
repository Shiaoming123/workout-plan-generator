import { TrainingPlan } from '../types';
import SummaryCard from './cards/SummaryCard';
import MetadataCard from './cards/MetadataCard';
import WeekCard from './cards/WeekCard';
import ExportButtons from './ExportButtons';
import ReasoningDisplay from './ReasoningDisplay';

interface PlanDisplayProps {
  plan: TrainingPlan;
}

export default function PlanDisplay({ plan }: PlanDisplayProps) {
  return (
    <div className="space-y-6">
      {/* 概览卡片 */}
      <SummaryCard plan={plan} />

      {/* 元数据卡片 */}
      <MetadataCard metadata={plan.metadata} />

      {/* 推理过程（Reasoner 模型专属）*/}
      {plan.metadata.reasoningProcess && (
        <ReasoningDisplay reasoning={plan.metadata.reasoningProcess} />
      )}

      {/* 导出按钮 */}
      <ExportButtons plan={plan} />

      {/* 训练计划内容 */}
      <div className="space-y-6">
        {/* 周计划 */}
        {plan.period === 'week' && plan.weeks && (
          <div className="space-y-6">
            {plan.weeks.map((week) => (
              <WeekCard key={week.weekNumber} week={week} />
            ))}
          </div>
        )}

        {/* 月计划 */}
        {plan.period === 'month' && plan.weeks && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-card-lg">
              <h2 className="text-2xl font-bold mb-2">月度训练计划</h2>
              <p className="text-blue-100">
                4周渐进式训练，包含基础期、增长期、高峰期和恢复期
              </p>
            </div>
            {plan.weeks.map((week) => (
              <WeekCard key={week.weekNumber} week={week} />
            ))}
          </div>
        )}

        {/* 季度计划 */}
        {plan.period === 'quarter' && plan.months && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-card-lg">
              <h2 className="text-2xl font-bold mb-2">季度训练计划</h2>
              <p className="text-purple-100">
                12周系统化训练，分为{plan.months.length}个月度阶段
              </p>
            </div>

            {plan.months.map((month) => (
              <div key={month.monthNumber} className="space-y-6">
                {/* 月度标题卡片 */}
                <div className="bg-white rounded-xl border-l-4 border-purple-500 shadow-card p-6">
                  <h3 className="text-xl font-bold text-purple-900 mb-2">
                    {month.monthName}
                  </h3>
                  {month.notes && (
                    <p className="text-gray-700 leading-relaxed">
                      {month.notes}
                    </p>
                  )}
                </div>

                {/* 月内周计划 */}
                <div className="ml-6 space-y-4">
                  {month.weeks.map((week) => (
                    <WeekCard
                      key={week.weekNumber}
                      week={week}
                      showExpanded={false}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
