import { TrainingPlan, UserProfile } from '../types';
import SummaryCard from './cards/SummaryCard';
import MetadataCard from './cards/MetadataCard';
import WeekCard from './cards/WeekCard';
import ExportButtons from './ExportButtons';
import ReasoningDisplay from './ReasoningDisplay';
import DonationTip from './DonationTip';

interface PlanDisplayProps {
  plan: TrainingPlan;
  profile?: UserProfile; // ✅ 新增：用户资料（可选）
  onOpenDonationModal?: () => void; // ✅ 新增：打开打赏弹窗回调
}

export default function PlanDisplay({ plan, profile, onOpenDonationModal }: PlanDisplayProps) {
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
      <ExportButtons plan={plan} profile={profile} />

      {/* 训练计划内容 */}
      <div className="space-y-6">
        {/* 周计划 / 自定义周数计划 */}
        {(plan.period === 'week' || plan.period === 'custom') && plan.weeks && (
          <div className="space-y-6">
            <div className={`rounded-xl p-6 text-white shadow-card-lg ${
              plan.period === 'custom'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-600'
                : 'bg-gradient-to-r from-blue-500 to-purple-600'
            }`}>
              <h2 className="text-2xl font-bold mb-2">
                {plan.period === 'custom'
                  ? `${plan.summary.totalWeeks}周自定义训练计划`
                  : '周训练计划'
                }
              </h2>
              <p className={plan.period === 'custom' ? 'text-teal-100' : 'text-blue-100'}>
                {plan.period === 'custom'
                  ? `${plan.summary.totalWeeks}周渐进式训练，每周${plan.summary.daysPerWeek}天，每次${plan.summary.sessionMinutes}分钟`
                  : '完整的单周训练安排'
                }
              </p>
            </div>
            {plan.weeks.map((week, index) => (
              <WeekCard key={week.weekNumber} week={week} index={index} />
            ))}
          </div>
        )}

        {/* 月计划 */}
        {plan.period === 'month' && plan.months && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-card-lg">
              <h2 className="text-2xl font-bold mb-2">月度训练计划</h2>
              <p className="text-blue-100">
                4周渐进式训练，包含基础期、增长期、高峰期和恢复期
              </p>
            </div>
            {plan.months[0].weeks.map((week, index) => (
              <WeekCard key={week.weekNumber} week={week} index={index} />
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

            {plan.months.map((month, monthIndex) => (
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

                {/* 月内周计划 - 优化间距 */}
                <div className="space-y-4">
                  {month.weeks.map((week, weekIndex) => (
                    <WeekCard
                      key={week.weekNumber}
                      week={week}
                      showExpanded={false}
                      index={monthIndex * 4 + weekIndex} // 全局索引，确保错峰
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ 打赏提示（在训练计划最后） */}
      <DonationTip onOpenModal={onOpenDonationModal} />
    </div>
  );
}
