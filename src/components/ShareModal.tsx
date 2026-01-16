import { useState, useRef, useMemo } from 'react';
import { TrainingPlan, WorkoutSession } from '../types';
import { toPng } from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';

interface ShareModalProps {
  plan: TrainingPlan;
  isOpen: boolean;
  onClose: () => void;
}

// 用于展开所有训练日以获取详细信息
function getAllSessions(plan: TrainingPlan): WorkoutSession[] {
  const sessions: WorkoutSession[] = [];

  if (plan.period === 'week' || plan.period === 'custom') {
    plan.weeks?.forEach((week) => {
      sessions.push(...week.sessions);
    });
  } else if (plan.period === 'month' || plan.period === 'quarter') {
    plan.months?.forEach((month) => {
      month.weeks.forEach((week) => {
        sessions.push(...week.sessions);
      });
    });
  }

  return sessions;
}

export default function ShareModal({ plan, isOpen, onClose }: ShareModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportQuality, setExportQuality] = useState<'high' | 'medium' | 'low'>('high');
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set());
  const exportRef = useRef<HTMLDivElement>(null);

  // 获取所有训练日
  const allSessions = useMemo(() => getAllSessions(plan), [plan]);

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedDays.size === allSessions.length) {
      setSelectedDays(new Set());
    } else {
      setSelectedDays(new Set(allSessions.map((_, index) => index)));
    }
  };

  // 切换单个选择
  const toggleDay = (index: number) => {
    const newSelected = new Set(selectedDays);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedDays(newSelected);
  };

  // 获取选中的训练日
  const selectedSessions = useMemo(() => {
    return Array.from(selectedDays).map((index) => allSessions[index]);
  }, [selectedDays, allSessions]);

  if (!isOpen) return null;

  // 获取质量对应的 pixelRatio
  const getPixelRatio = () => {
    switch (exportQuality) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 2;
    }
  };

  // 导出为图片
  const handleExport = async () => {
    if (!exportRef.current || selectedSessions.length === 0) {
      alert('请至少选择一天的训练计划');
      return;
    }

    setIsExporting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(exportRef.current, {
        pixelRatio: getPixelRatio(),
        quality: exportQuality === 'low' ? 0.7 : exportQuality === 'medium' ? 0.85 : 0.95,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `训练计划-${plan.summary.goalZh}-${selectedSessions.length}天-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();

      onClose();
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请稍后重试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">导出训练计划</h2>
            <p className="text-sm text-gray-600 mt-1">
              选择要导出的训练日，生成精美的分享图片
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：选择要导出的天数 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">选择训练日</h3>
                <button
                  onClick={toggleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {selectedDays.size === allSessions.length ? '取消全选' : '全选'}
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-[400px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {allSessions.map((session, index) => {
                    const isSelected = selectedDays.has(index);
                    return (
                      <button
                        key={index}
                        onClick={() => toggleDay(index)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="font-semibold text-sm">{session.dayName}</div>
                        <div className="text-xs text-gray-600 mt-1">{session.focus}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-gray-500">
                已选择 <span className="font-semibold text-blue-600">{selectedDays.size}</span> 天
              </p>
            </div>

            {/* 右侧：预览和选项 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">预览</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div
                  ref={exportRef}
                  className="bg-white mx-auto overflow-hidden"
                  style={{ width: '600px', minHeight: '600px', maxHeight: '800px', overflow: 'hidden' }}
                >
                  {selectedSessions.length > 0 ? (
                    <ExportView plan={plan} sessions={selectedSessions} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      请选择要导出的训练日
                    </div>
                  )}
                </div>
              </div>

              {/* 质量选择 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">图片质量</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'high', label: '高清', size: '~3-5MB' },
                    { value: 'medium', label: '标准', size: '~1-2MB' },
                    { value: 'low', label: '压缩', size: '~500KB' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        exportQuality === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="quality"
                        value={option.value}
                        checked={exportQuality === option.value}
                        onChange={(e) => setExportQuality(e.target.value as any)}
                        className="sr-only"
                      />
                      <span className="font-medium text-sm text-gray-900">{option.label}</span>
                      <span className="text-xs text-gray-500 mt-1">{option.size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 导出按钮 */}
              <button
                onClick={handleExport}
                disabled={isExporting || selectedSessions.length === 0}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                  isExporting || selectedSessions.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                }`}
              >
                {isExporting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    生成中...
                  </span>
                ) : (
                  `📷 生成并下载图片 (${selectedSessions.length}天)`
                )}
              </button>

              {/* 提示信息 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 flex-shrink-0">💡</span>
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">使用提示</p>
                    <ul className="space-y-1 text-xs text-blue-800">
                      <li>• 图片尺寸：1200×1200 像素（方形，适合社交媒体）</li>
                      <li>• 推荐选择"标准"质量，平衡清晰度和文件大小</li>
                      <li>• 包含详细的训练动作、组数、次数等信息</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 导出视图组件（专门为图片导出优化）
function ExportView({ plan, sessions }: { plan: TrainingPlan; sessions: WorkoutSession[] }) {
  const { summary } = plan;

  // 根据目标类型选择渐变色
  const goalGradients: Record<string, string> = {
    fat_loss: 'from-orange-500 to-red-500',
    muscle_gain: 'from-blue-500 to-purple-600',
    fitness: 'from-cyan-500 to-blue-500',
    rehab: 'from-green-500 to-cyan-500',
    general: 'from-cyan-500 to-blue-500',
  };

  const gradientClass = summary.goal
    ? goalGradients[summary.goal] || goalGradients.fitness
    : goalGradients.fitness;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 顶部标题区域 */}
      <div className={`bg-gradient-to-br ${gradientClass} px-6 py-4 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold mb-0.5">个性化训练计划</h1>
            <p className="text-xs opacity-90">AI 智能生成 · 科学训练</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{sessions.length}</div>
            <div className="text-xs opacity-90">天训练</div>
          </div>
        </div>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-4 gap-2 px-4 py-3 border-b-2 border-gray-200">
        <MetricItem icon="🎯" label="目标" value={summary.goalZh} />
        <MetricItem icon="📅" label="频率" value={`${summary.daysPerWeek}天/周`} />
        <MetricItem icon="⏱️" label="时长" value={`${summary.sessionMinutes}分钟`} />
        <MetricItem icon="📊" label="周数" value={`${summary.totalWeeks}周`} />
      </div>

      {/* 训练详情区域 - 可滚动 */}
      <div className="flex-1 px-4 py-3 overflow-hidden">
        <div className="space-y-3">
          {sessions.slice(0, 4).map((session, index) => (
            <div
              key={session.dayNumber}
              className={`border-2 rounded-lg p-3 ${
                index < 2 ? 'border-blue-200 bg-blue-50' : 'border-purple-200 bg-purple-50'
              }`}
            >
              {/* 训练日标题 */}
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-gray-900 text-sm">{session.dayName}</div>
                <div className="text-xs px-2 py-0.5 bg-white rounded-full font-medium text-gray-600">
                  {session.totalMinutes}分钟
                </div>
              </div>

              {/* 训练重点 */}
              <div className="text-xs text-gray-700 mb-2">{session.focus}</div>

              {/* 训练内容 - 显示前2个阶段 */}
              <div className="space-y-1.5">
                {session.phases.warmup.length > 0 && (
                  <div className="text-xs">
                    <span className="font-medium text-orange-600">🔥 热身：</span>
                    <span className="text-gray-600">
                      {session.phases.warmup.slice(0, 2).map((s) => s.nameZh || s.exerciseId).join('、')}
                      {session.phases.warmup.length > 2 && '等'}
                    </span>
                  </div>
                )}
                {session.phases.main.length > 0 && (
                  <div className="text-xs">
                    <span className="font-medium text-blue-600">💪 主训练：</span>
                    <span className="text-gray-600">
                      {session.phases.main.slice(0, 2).map((s) => {
                        const details = s.reps ? `${s.sets}组×${s.reps}次` : `${s.duration}秒`;
                        return `${s.nameZh || s.exerciseId}（${details}）`;
                      }).join('、')}
                      {session.phases.main.length > 2 && '等'}
                    </span>
                  </div>
                )}
                {session.phases.cooldown.length > 0 && (
                  <div className="text-xs">
                    <span className="font-medium text-green-600">🧘 拉伸：</span>
                    <span className="text-gray-600">
                      {session.phases.cooldown.slice(0, 2).map((s) => s.nameZh || s.exerciseId).join('、')}
                      {session.phases.cooldown.length > 2 && '等'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* 如果选中超过4天，显示提示 */}
          {sessions.length > 4 && (
            <div className="text-center text-xs text-gray-500 py-2">
              还有 {sessions.length - 4} 天训练计划...
            </div>
          )}
        </div>
      </div>

      {/* 底部信息和二维码 */}
      <div className="px-4 py-3 border-t-2 border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-600">
            <div className="font-medium text-gray-900">Workout Plan Generator</div>
            <div className="mt-1">{new Date().toLocaleDateString('zh-CN')}</div>
          </div>

          {/* 二维码 */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-1 rounded border border-gray-200">
              <QRCodeSVG
                value={typeof window !== 'undefined' ? window.location.href : 'https://github.com/Shiaoming123/workout-plan-generator'}
                size={60}
                level="L"
                includeMargin={false}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">扫码访问</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 指标项组件
function MetricItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-sm mb-0.5">{icon}</div>
      <div className="text-[9px] text-gray-600 mb-0.5">{label}</div>
      <div className="font-semibold text-xs text-gray-900 leading-tight">{value}</div>
    </div>
  );
}
