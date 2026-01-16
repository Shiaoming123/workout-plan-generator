import { useState } from 'react';
import { WorkoutSession } from '../../types';
import ExerciseCard from './ExerciseCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface DayCardProps {
  session: WorkoutSession;
}

export default function DayCard({ session }: DayCardProps) {
  const [expanded, setExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // 统计各阶段动作数量
  const phaseStats = {
    warmup: session.phases.warmup.length,
    main: session.phases.main.length,
    accessory: session.phases.accessory.length,
    cooldown: session.phases.cooldown.length,
  };

  const totalExercises = Object.values(phaseStats).reduce((a, b) => a + b, 0);

  // 🎨 根据日期生成不同颜色边框
  const dayColors = [
    'border-l-blue-400',
    'border-l-green-400',
    'border-l-purple-400',
    'border-l-orange-400',
    'border-l-pink-400',
    'border-l-indigo-400',
    'border-l-teal-400',
  ];
  const dayColorClass = dayColors[(session.dayNumber - 1) % dayColors.length];

  // 悬浮效果配置
  const hoverProps = prefersReducedMotion
    ? {}
    : {
        whileHover: { scale: 1.01, y: -2 },
        whileTap: { scale: 0.99 },
        transition: { duration: 0.2 }
      };

  return (
    <motion.div
      className={`bg-white rounded-xl border border-gray-200 shadow-card overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:border-gray-300 border-l-4 ${dayColorClass}`}
      {...hoverProps}
    >
      {/* 卡片头部 - 可点击 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          {/* 标题 */}
          <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">
            {session.dayName}
          </h4>

          {/* 副标题信息 */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <span>🎯</span>
              <span>{session.focus}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>⏱️</span>
              <span>{session.totalMinutes}分钟</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>💪</span>
              <span>{totalExercises}个动作</span>
            </span>
          </div>
        </div>

        {/* 展开/收起图标 */}
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4 ${
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

      {/* 卡片内容 - 带动画 */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
            animate={prefersReducedMotion ? {} : { height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-100">
              {/* 四个阶段横向排列 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {/* 热身 */}
                {phaseStats.warmup > 0 && (
                  <PhaseSection
                    title="热身"
                    icon="🔥"
                    color="warmup"
                    sets={session.phases.warmup}
                  />
                )}

                {/* 主训练 */}
                {phaseStats.main > 0 && (
                  <PhaseSection
                    title="主训练"
                    icon="💪"
                    color="main"
                    sets={session.phases.main}
                  />
                )}

                {/* 辅助训练 */}
                {phaseStats.accessory > 0 && (
                  <PhaseSection
                    title="辅助训练"
                    icon="⚡"
                    color="accessory"
                    sets={session.phases.accessory}
                  />
                )}

                {/* 放松拉伸 */}
                {phaseStats.cooldown > 0 && (
                  <PhaseSection
                    title="放松拉伸"
                    icon="🧘"
                    color="cooldown"
                    sets={session.phases.cooldown}
                  />
                )}
              </div>

              {/* 备注（如有）*/}
              {session.notes && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600 flex-shrink-0">💡</span>
                    <p className="text-sm text-blue-900 leading-relaxed">
                      {session.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// 阶段区域组件
interface PhaseSectionProps {
  title: string;
  icon: string;
  color: 'warmup' | 'main' | 'accessory' | 'cooldown';
  sets: any[];
}

function PhaseSection({ title, icon, color, sets }: PhaseSectionProps) {
  // 颜色映射
  const colorClasses = {
    warmup: {
      bg: 'bg-phase-warmup-50',
      border: 'border-phase-warmup-300',
      text: 'text-phase-warmup-600',
    },
    main: {
      bg: 'bg-phase-main-50',
      border: 'border-phase-main-300',
      text: 'text-phase-main-600',
    },
    accessory: {
      bg: 'bg-phase-accessory-50',
      border: 'border-phase-accessory-300',
      text: 'text-phase-accessory-600',
    },
    cooldown: {
      bg: 'bg-phase-cooldown-50',
      border: 'border-phase-cooldown-300',
      text: 'text-phase-cooldown-600',
    },
  };

  const colors = colorClasses[color];

  return (
    <div>
      {/* 阶段标题 */}
      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg mb-3 ${colors.bg} ${colors.border} border`}>
        <span>{icon}</span>
        <span className={`font-semibold text-sm ${colors.text}`}>
          {title}
        </span>
        <span className={`text-xs ${colors.text} opacity-75`}>
          ({sets.length}个动作)
        </span>
      </div>

      {/* 动作列表 */}
      <div className="space-y-2">
        {sets.map((set, index) => (
          <ExerciseCard key={index} set={set} />
        ))}
      </div>
    </div>
  );
}
