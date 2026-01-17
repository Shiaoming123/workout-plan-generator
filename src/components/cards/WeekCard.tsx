import { useState } from 'react';
import { WeekPlan } from '../../types';
import DayCard from './DayCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface WeekCardProps {
  week: WeekPlan;
  showExpanded?: boolean;
  index?: number; // 用于错峰动画
}

export default function WeekCard({ week, showExpanded = true, index = 0 }: WeekCardProps) {
  const [expanded, setExpanded] = useState(showExpanded);
  const prefersReducedMotion = useReducedMotion();

  // 🎨 根据周数生成不同颜色（循环使用）
  const colorSchemes = [
    { border: 'border-l-blue-500', badge: 'bg-blue-500', gradient: 'from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150' },
    { border: 'border-l-green-500', badge: 'bg-green-500', gradient: 'from-green-50 to-green-100 hover:from-green-100 hover:to-green-150' },
    { border: 'border-l-purple-500', badge: 'bg-purple-500', gradient: 'from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-150' },
    { border: 'border-l-pink-500', badge: 'bg-pink-500', gradient: 'from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-150' },
    { border: 'border-l-orange-500', badge: 'bg-orange-500', gradient: 'from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-150' },
    { border: 'border-l-indigo-500', badge: 'bg-indigo-500', gradient: 'from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-150' },
  ];

  // 安全地获取颜色方案（防止 weekNumber 为 undefined）
  const colorIndex = week.weekNumber ? (week.weekNumber - 1) % colorSchemes.length : 0;
  const colors = colorSchemes[colorIndex] || colorSchemes[0];

  // 进入动画（错峰效果）
  const animationProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: {
          duration: 0.5,
          delay: index * 0.1 // 错峰延迟
        }
      };

  return (
    <motion.div
      className={`bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden border-l-4 ${colors.border}`}
      {...animationProps}
    >
      {/* 周卡片头部 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full px-6 py-4 bg-gradient-to-r ${colors.gradient} transition-colors flex items-center justify-between text-left border-b border-gray-200`}
      >
        <div className="flex items-center space-x-3">
          {/* 周数徽章 */}
          <div className={`flex items-center justify-center w-10 h-10 ${colors.badge} text-white rounded-lg font-bold text-sm shadow-sm`}>
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

      {/* 周卡片内容 - 带动画 */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
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

              {/* 日训练卡片 - 纵向堆叠 */}
              <div className="space-y-4">
                {week.sessions && week.sessions.map((session) => (
                  <DayCard key={session.dayNumber} session={session} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
