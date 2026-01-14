import { useState } from 'react';
import { TrainingPlan, WorkoutSet, WorkoutSession, WeekPlan } from '../types';
import { getExerciseById } from '../lib/planGenerator';
import ExportButtons from './ExportButtons';
import ReasoningDisplay from './ReasoningDisplay';

interface PlanDisplayProps {
  plan: TrainingPlan;
}

export default function PlanDisplay({ plan }: PlanDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">训练计划</h2>

      {/* Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-bold text-lg mb-2 text-blue-900">计划概览</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-semibold">目标：</span>
            <span className="text-gray-700">{plan.summary.goalZh}</span>
          </div>
          <div>
            <span className="font-semibold">频率：</span>
            <span className="text-gray-700">{plan.summary.daysPerWeek}天/周</span>
          </div>
          <div>
            <span className="font-semibold">时长：</span>
            <span className="text-gray-700">{plan.summary.sessionMinutes}分钟/次</span>
          </div>
          <div>
            <span className="font-semibold">总周数：</span>
            <span className="text-gray-700">{plan.summary.totalWeeks}周</span>
          </div>
        </div>
        <div className="mt-3">
          <span className="font-semibold">说明：</span>
          <span className="text-gray-700">{plan.summary.phaseDescription}</span>
        </div>
        {plan.summary.safetyNotes && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-300 rounded">
            <p className="text-amber-900 text-sm">
              <span className="font-semibold">⚠️ 安全提示：</span>
              {plan.summary.safetyNotes}
            </p>
          </div>
        )}
      </div>

      {/* Generation Metadata */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-gray-700">生成方式：</span>
            <span
              className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                plan.metadata.method === 'ai'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {plan.metadata.method === 'ai'
                ? `🤖 AI 驱动 (${plan.metadata.model})`
                : '📋 规则引擎'}
            </span>
          </div>
          {plan.metadata.apiCallDuration && (
            <span className="text-sm text-gray-600">
              耗时: {(plan.metadata.apiCallDuration / 1000).toFixed(2)}秒
            </span>
          )}
        </div>
        {plan.metadata.fallbackReason && (
          <div className="mt-2 text-sm text-amber-700">
            ℹ️ {plan.metadata.fallbackReason}
          </div>
        )}
      </div>

      {/* Reasoning Process (Reasoner Model Only) */}
      {plan.metadata.reasoningProcess && (
        <ReasoningDisplay reasoning={plan.metadata.reasoningProcess} />
      )}

      {/* Export Buttons */}
      <ExportButtons plan={plan} />

      {/* Plan Content */}
      <div className="mt-8">
        {plan.period === 'week' && plan.weeks && (
          <div>
            {plan.weeks.map((week) => (
              <WeekDisplay key={week.weekNumber} week={week} />
            ))}
          </div>
        )}

        {plan.period === 'month' && plan.weeks && (
          <div>
            {plan.weeks.map((week) => (
              <WeekDisplay key={week.weekNumber} week={week} />
            ))}
          </div>
        )}

        {plan.period === 'quarter' && plan.months && (
          <div>
            {plan.months.map((month) => (
              <div key={month.monthNumber} className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-purple-700 border-b-2 border-purple-300 pb-2">
                  {month.monthName}
                </h3>
                {month.weeks.map((week) => (
                  <WeekDisplay key={week.weekNumber} week={week} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WeekDisplay({ week }: { week: WeekPlan }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors print:hidden"
      >
        <h4 className="font-bold text-lg text-gray-800">{week.weekName}</h4>
        <svg
          className={`w-5 h-5 transform transition-transform ${
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

      {/* Print: always show */}
      <div className="hidden print:block px-4 py-2 bg-gray-50">
        <h4 className="font-bold text-lg text-gray-800">{week.weekName}</h4>
      </div>

      {expanded && (
        <div className="p-4 print:block">
          {week.sessions.map((session) => (
            <SessionDisplay key={session.dayNumber} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}

function SessionDisplay({ session }: { session: WorkoutSession }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-4 border-l-4 border-blue-400 pl-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left flex items-center justify-between print:hidden"
      >
        <div>
          <h5 className="font-semibold text-gray-800">{session.dayName}</h5>
          <p className="text-sm text-gray-600">
            {session.focus} · {session.totalMinutes}分钟
          </p>
        </div>
        <svg
          className={`w-4 h-4 transform transition-transform ${
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

      {/* Print: always show header */}
      <div className="hidden print:block mb-2">
        <h5 className="font-semibold text-gray-800">{session.dayName}</h5>
        <p className="text-sm text-gray-600">
          {session.focus} · {session.totalMinutes}分钟
        </p>
      </div>

      {expanded && (
        <div className="mt-3 print:block print:mt-2">
          <PhaseDisplay title="热身" sets={session.phases.warmup} />
          <PhaseDisplay title="主训练" sets={session.phases.main} />
          <PhaseDisplay title="辅助训练" sets={session.phases.accessory} />
          <PhaseDisplay title="放松拉伸" sets={session.phases.cooldown} />
        </div>
      )}
    </div>
  );
}

function PhaseDisplay({ title, sets }: { title: string; sets: WorkoutSet[] }) {
  if (sets.length === 0) return null;

  return (
    <div className="mb-3">
      <h6 className="font-semibold text-sm text-gray-700 mb-2">{title}</h6>
      <div className="space-y-2">
        {sets.map((set, idx) => (
          <SetDisplay key={idx} set={set} />
        ))}
      </div>
    </div>
  );
}

function SetDisplay({ set }: { set: WorkoutSet }) {
  // 优先使用 set 中的动作名称（AI 生成时包含），否则从数据库查找（规则引擎）
  let name = set.name;
  let nameZh = set.nameZh;

  if (!name || !nameZh) {
    const exercise = getExerciseById(set.exerciseId);
    if (exercise) {
      name = exercise.name;
      nameZh = exercise.nameZh;
    }
  }

  // 如果还是找不到名称，返回 null（不应该发生）
  if (!name || !nameZh) {
    console.error('无法找到动作信息，exerciseId:', set.exerciseId);
    return null;
  }

  return (
    <div className="text-sm bg-gray-50 p-2 rounded">
      <div className="font-medium text-gray-800">
        {nameZh}{' '}
        <span className="text-gray-500 text-xs">({name})</span>
      </div>
      <div className="text-gray-600 mt-1">
        {set.sets && <span>{set.sets}组</span>}
        {set.reps && <span> × {set.reps}次</span>}
        {set.duration && <span> {set.duration}秒</span>}
        {set.restSec > 0 && <span> | 休息{set.restSec}秒</span>}
        {set.rpe && <span> | RPE {set.rpe}</span>}
      </div>
      {set.notes && (
        <div className="text-xs text-gray-500 mt-1">💡 {set.notes}</div>
      )}
    </div>
  );
}
