import { useState } from 'react';
import { WeekPlan } from '../../types';
import DayCard from './DayCard';

interface WeekCardProps {
  week: WeekPlan;
  showExpanded?: boolean;
}

export default function WeekCard({ week, showExpanded = true }: WeekCardProps) {
  const [expanded, setExpanded] = useState(showExpanded);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden">
      {/* 周卡片头部 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 transition-colors flex items-center justify-between text-left border-b border-gray-200"
      >
        <div className="flex items-center space-x-3">
          {/* 周数徽章 */}
          <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-lg font-bold text-sm">
            W{week.weekNumber}
          </div>

          {/* 周名称 */}
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              {week.weekName}
            </h3>
            <p className="text-sm text-gray-600">
              {week.sessions.length}天训练
            </p>
          </div>
        </div>

        {/* 展开/收起图标 */}
        <svg
          className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
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

      {/* 周卡片内容 */}
      {expanded && (
        <div className="p-6 space-y-4">
          {/* 周说明（如有）*/}
          {week.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 text-lg flex-shrink-0">ℹ️</span>
                <p className="text-sm text-blue-900 leading-relaxed">
                  {week.notes}
                </p>
              </div>
            </div>
          )}

          {/* 日训练卡片 - 响应式网格（最多3列，根据屏幕宽度自适应）*/}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {week.sessions.map((session) => (
              <DayCard key={session.dayNumber} session={session} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
