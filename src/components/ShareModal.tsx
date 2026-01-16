import { useState, useRef } from 'react';
import { TrainingPlan } from '../types';
import { toPng } from 'html-to-image';

interface ShareModalProps {
  plan: TrainingPlan;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ plan, isOpen, onClose }: ShareModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportQuality, setExportQuality] = useState<'high' | 'medium' | 'low'>('high');
  const exportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // 获取质量对应的 pixelRatio
  const getPixelRatio = () => {
    switch (exportQuality) {
      case 'high': return 3; // 高清
      case 'medium': return 2; // 标准
      case 'low': return 1; // 压缩
      default: return 2;
    }
  };

  // 导出为图片
  const handleExport = async () => {
    if (!exportRef.current) return;

    setIsExporting(true);

    try {
      // 等待一小段时间确保渲染完成
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(exportRef.current, {
        pixelRatio: getPixelRatio(),
        quality: exportQuality === 'low' ? 0.7 : exportQuality === 'medium' ? 0.85 : 0.95,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });

      // 下载图片
      const link = document.createElement('a');
      link.download = `训练计划-${plan.summary.goalZh}-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();

      // 关闭弹窗
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">导出训练计划</h2>
            <p className="text-sm text-gray-600 mt-1">
              选择导出质量，生成精美的分享图片
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
            {/* 导出预览 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">预览</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                {/* 导出容器 - 固定尺寸确保导出质量 */}
                <div
                  ref={exportRef}
                  className="bg-white"
                  style={{ width: '600px', height: '600px' }}
                >
                  <ExportView plan={plan} />
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                预览已缩小显示，实际导出为高清图片
              </p>
            </div>

            {/* 导出选项 */}
            <div className="space-y-6">
              {/* 质量选择 */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">图片质量</h3>
                <div className="space-y-2">
                  {[
                    { value: 'high', label: '高清', size: '~3-5MB', desc: '适合打印和高质量分享' },
                    { value: 'medium', label: '标准', size: '~1-2MB', desc: '平衡质量和文件大小' },
                    { value: 'low', label: '压缩', size: '~500KB-1MB', desc: '快速分享，节省流量' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
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
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{option.label}</span>
                          <span className="text-xs text-gray-500">{option.size}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 导出按钮 */}
              <button
                onClick={handleExport}
                disabled={isExporting}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                  isExporting
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
                  '📷 生成并下载图片'
                )}
              </button>

              {/* 提示信息 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 text-lg flex-shrink-0">💡</span>
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">使用提示</p>
                    <ul className="space-y-1 text-xs text-blue-800">
                      <li>• 图片尺寸：1200×1200 像素（方形，适合社交媒体）</li>
                      <li>• 推荐选择"标准"质量，平衡清晰度和文件大小</li>
                      <li>• 导出后可直接分享到微信、Instagram 等平台</li>
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
function ExportView({ plan }: { plan: TrainingPlan }) {
  const { summary } = plan;

  // 获取第一周的训练日（最多显示 6 天）
  const getSessions = () => {
    if (plan.period === 'week' && plan.weeks) {
      return plan.weeks[0]?.sessions || [];
    }
    if (plan.period === 'month' && plan.months) {
      return plan.months[0]?.weeks[0]?.sessions || [];
    }
    if (plan.period === 'quarter' && plan.months) {
      return plan.months[0]?.weeks[0]?.sessions || [];
    }
    return [];
  };

  const sessions = getSessions();

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
      <div className={`bg-gradient-to-br ${gradientClass} px-8 py-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">个性化训练计划</h1>
            <p className="text-sm opacity-90">AI 智能生成 · 科学训练</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{summary.totalWeeks}</div>
            <div className="text-xs opacity-90">周计划</div>
          </div>
        </div>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-4 gap-3 px-6 py-4 border-b-2 border-gray-200">
        <MetricItem icon="🎯" label="目标" value={summary.goalZh} />
        <MetricItem icon="📅" label="频率" value={`${summary.daysPerWeek}天/周`} />
        <MetricItem icon="⏱️" label="时长" value={`${summary.sessionMinutes}分钟`} />
        <MetricItem icon="📊" label="周数" value={`${summary.totalWeeks}周`} />
      </div>

      {/* 训练日网格（最多6天） */}
      <div className="flex-1 px-6 py-4 overflow-hidden">
        <div className="grid grid-cols-2 gap-3 h-full">
          {sessions.slice(0, 6).map((session, index) => (
            <div
              key={session.dayNumber}
              className={`border-2 rounded-lg p-3 flex flex-col ${
                index < 4 ? 'border-blue-200 bg-blue-50' : 'border-purple-200 bg-purple-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-gray-900">{session.dayName}</div>
                <div className="text-xs px-2 py-0.5 bg-white rounded-full font-medium text-gray-600">
                  {session.totalMinutes}分钟
                </div>
              </div>
              <div className="text-xs text-gray-700 mb-1">{session.focus}</div>
              <div className="text-xs text-gray-600 flex-1">
                {session.phases.main.length > 0 && (
                  <div>主要：{session.phases.main.length} 个动作</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部信息 */}
      <div className="px-6 py-3 border-t-2 border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div>生成时间：{new Date().toLocaleDateString('zh-CN')}</div>
          <div>Workout Plan Generator</div>
        </div>
      </div>
    </div>
  );
}

// 指标项组件
function MetricItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-[10px] text-gray-600 mb-0.5">{label}</div>
      <div className="font-semibold text-sm text-gray-900 leading-tight">{value}</div>
    </div>
  );
}
