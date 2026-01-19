import { useState, useRef, useMemo } from 'react';
import { TrainingPlan, WorkoutSession, UserProfile } from '../types';
import { toPng } from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';
import { getGoalGradient } from '../constants/colors';
import { useToast } from './Toast';

interface ShareModalProps {
  plan: TrainingPlan;
  profile: UserProfile; // ✅ 新增：用户资料
  isOpen: boolean;
  onClose: () => void;
}

// 用于展开所有训练日以获取详细信息
function getAllSessions(plan: TrainingPlan): WorkoutSession[] {
  const sessions: WorkoutSession[] = [];

  if (plan.period === 'week' || plan.period === 'custom') {
    plan.weeks?.forEach((week) => {
      if (week.sessions && Array.isArray(week.sessions)) {
        sessions.push(...week.sessions);
      }
    });
  } else if (plan.period === 'month' || plan.period === 'quarter') {
    plan.months?.forEach((month) => {
      month.weeks?.forEach((week) => {
        if (week.sessions && Array.isArray(week.sessions)) {
          sessions.push(...week.sessions);
        }
      });
    });
  }

  return sessions;
}

export default function ShareModal({ plan, profile, isOpen, onClose }: ShareModalProps) {
  const toast = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [exportQuality, setExportQuality] = useState<'high' | 'medium' | 'low'>('high');
  const [exportMode, setExportMode] = useState<'simple' | 'detailed'>('simple');
  const [showUserProfile, setShowUserProfile] = useState(false); // ✅ 新增：是否显示用户信息
  const [includeNutrition, setIncludeNutrition] = useState(false); // ✅ 新增：是否包含营养建议
  const [includeRecovery, setIncludeRecovery] = useState(false); // ✅ 新增：是否包含恢复建议
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set());
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExportingView, setIsExportingView] = useState(false); // ✅ 新增：是否正在导出（用于控制缩放）
  const [isCopying, setIsCopying] = useState(false); // ✅ 新增：是否正在复制到剪贴板

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

  // 获取选中的训练日（按 dayNumber 排序，确保顺序一致）
  const selectedSessions = useMemo(() => {
    // 使用 Set 去重，防止快速点击时出现重复
    const uniqueIndices = Array.from(new Set(Array.from(selectedDays)));
    return uniqueIndices
      .filter(index => index >= 0 && index < allSessions.length) // 过滤无效索引
      .sort((a, b) => a - b) // 先对索引排序
      .map((index) => allSessions[index]);
  }, [selectedDays, allSessions]);

  // 检测浏览器是否支持剪贴板 API
  const supportsClipboardItem = useMemo(() => {
    return 'clipboard' in navigator && 'ClipboardItem' in window;
  }, []);

  // 复制图片到剪贴板
  const copyToClipboard = async (dataUrl: string) => {
    if (!supportsClipboardItem) {
      toast.error('您的浏览器不支持复制图片到剪贴板，请使用下载功能');
      return false;
    }

    try {
      setIsCopying(true);

      // 将 dataUrl 转换为 Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // 使用 Clipboard API 复制图片
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);

      toast.success('✅ 图片已复制到剪贴板，可直接粘贴到微信、QQ等应用');
      return true;
    } catch (error) {
      console.error('复制到剪贴板失败:', error);
      toast.error('复制失败，请尝试下载功能');
      return false;
    } finally {
      setIsCopying(false);
    }
  };

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

  // 导出为图片（支持下载和复制到剪贴板）
  const handleExport = async (downloadMode: 'download' | 'clipboard' = 'download') => {
    if (!exportRef.current || selectedSessions.length === 0) {
      toast.error('请至少选择一天的训练计划');
      return;
    }

    setIsExporting(true);
    setIsExportingView(true); // ✅ 设置为导出模式，移除缩放

    try {
      // 等待状态更新和重新渲染
      await new Promise(resolve => setTimeout(resolve, 200));

      const dataUrl = await toPng(exportRef.current, {
        pixelRatio: getPixelRatio(),
        quality: exportQuality === 'low' ? 0.7 : exportQuality === 'medium' ? 0.85 : 0.95,
        backgroundColor: '#ffffff',
        cacheBust: true,
        width: 600,
        height: exportRef.current.scrollHeight,
      });

      if (downloadMode === 'download') {
        // 下载图片
        const link = document.createElement('a');
        const modeLabel = exportMode === 'simple' ? '简略' : '详细';
        link.download = `训练计划-${plan.summary.goalZh}-${modeLabel}-${selectedSessions.length}天-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = dataUrl;
        link.click();
        toast.success('✅ 图片下载成功！');
      } else {
        // 复制到剪贴板
        const success = await copyToClipboard(dataUrl);
        if (success) {
          onClose(); // 复制成功后关闭弹窗
        }
      }
    } catch (error) {
      console.error('导出失败:', error);
      toast.error('导出失败，请稍后重试');
    } finally {
      setIsExportingView(false); // ✅ 恢复预览模式
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
            {/* 左侧：选择训练日 + 导出模式 + 附加选项 */}
            <div className="space-y-4">
              {/* 选择训练日 */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">选择训练日</h3>
                  <button
                    onClick={toggleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {selectedDays.size === allSessions.length ? '取消全选' : '全选'}
                  </button>
                </div>

                <div className="max-h-[240px] overflow-y-auto">
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

                <p className="text-xs text-gray-500 mt-3">
                  已选择 <span className="font-semibold text-blue-600">{selectedDays.size}</span> 天
                </p>
              </div>

              {/* 导出模式选择 */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <h3 className="font-semibold text-gray-900 mb-3">导出模式</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'simple', label: '简略版', desc: '显示概要信息' },
                    { value: 'detailed', label: '详细版', desc: '显示所有动作详情' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        exportMode === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="mode"
                        value={option.value}
                        checked={exportMode === option.value}
                        onChange={(e) => setExportMode(e.target.value as any)}
                        className="sr-only"
                      />
                      <span className="font-medium text-sm text-gray-900">{option.label}</span>
                      <span className="text-xs text-gray-500 mt-1">{option.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 附加选项 */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <h3 className="font-semibold text-gray-900 mb-3">附加选项</h3>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-300">
                    <input
                      type="checkbox"
                      checked={showUserProfile}
                      onChange={(e) => setShowUserProfile(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-sm text-gray-900">显示个人信息</div>
                      <div className="text-xs text-gray-500">在图片顶部显示年龄、体重、目标等基本信息</div>
                    </div>
                  </label>

                  {/* ✅ 营养建议选项（仅当有数据时显示）*/}
                  {plan.nutritionAdvice && (
                    <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-300 ${
                      includeNutrition ? 'border-green-500 bg-green-50' : ''
                    }`}>
                      <input
                        type="checkbox"
                        checked={includeNutrition}
                        onChange={(e) => setIncludeNutrition(e.target.checked)}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-sm text-gray-900">🍊 包含营养建议</div>
                        <div className="text-xs text-gray-500">显示营养目标、餐食安排和食谱推荐</div>
                      </div>
                    </label>
                  )}

                  {/* ✅ 恢复建议选项（仅当有数据时显示）*/}
                  {plan.recoveryAdvice && (
                    <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-gray-300 ${
                      includeRecovery ? 'border-purple-500 bg-purple-50' : ''
                    }`}>
                      <input
                        type="checkbox"
                        checked={includeRecovery}
                        onChange={(e) => setIncludeRecovery(e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-sm text-gray-900">🌙 包含恢复建议</div>
                        <div className="text-xs text-gray-500">显示睡眠建议、休息日安排和恢复技巧</div>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* 右侧：预览 + 质量选择 + 导出按钮 */}
            <div className="space-y-4">
              {/* 预览 */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-3">预览</h3>
                <div className="overflow-auto max-h-[500px] flex justify-center border-2 border-dashed border-gray-300 rounded-lg bg-white shadow-inner">
                  <div
                    ref={exportRef}
                    className="bg-white origin-top transition-transform"
                    style={{
                      width: '600px',
                      transform: isExportingView ? 'none' : 'scale(0.55)',
                      transformOrigin: 'top center',
                    }}
                  >
                    {selectedSessions.length > 0 ? (
                      exportMode === 'simple' ? (
                        <SimpleExportView
                          plan={plan}
                          sessions={selectedSessions}
                          profile={profile}
                          showUserProfile={showUserProfile}
                          includeNutrition={includeNutrition}
                          includeRecovery={includeRecovery}
                        />
                      ) : (
                        <DetailedExportView
                          plan={plan}
                          sessions={selectedSessions}
                          profile={profile}
                          showUserProfile={showUserProfile}
                          includeNutrition={includeNutrition}
                          includeRecovery={includeRecovery}
                        />
                      )
                    ) : (
                      <div className="flex items-center justify-center text-gray-400" style={{ minHeight: '400px' }}>
                        请选择要导出的训练日
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 质量选择 */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
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

              {/* 导出按钮组 */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* 复制到剪贴板按钮 */}
                {supportsClipboardItem && (
                  <button
                    onClick={() => handleExport('clipboard')}
                    disabled={isCopying || isExporting || selectedSessions.length === 0}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                      isCopying || isExporting || selectedSessions.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                    }`}
                  >
                    {isCopying ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        复制中...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        复制到剪贴板
                      </span>
                    )}
                  </button>
                )}

                {/* 下载图片按钮 */}
                <button
                  onClick={() => handleExport('download')}
                  disabled={isExporting || isCopying || selectedSessions.length === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                    isExporting || isCopying || selectedSessions.length === 0
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
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      下载图片
                    </span>
                  )}
                </button>
              </div>

              {/* 提示信息 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 flex-shrink-0">💡</span>
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">使用提示</p>
                    <ul className="space-y-1 text-xs text-blue-800">
                      <li>• 简略版：显示每天的训练概要，适合快速分享</li>
                      <li>• 详细版：显示所有训练动作详情，适合保存使用</li>
                      <li>• 复制到剪贴板：可直接粘贴到微信、QQ等应用（支持的浏览器）</li>
                      <li>• 下载图片：保存到本地，适合长期存档</li>
                      <li>• 图片高度会根据选择的日期自动调整</li>
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

// 简略版导出视图
function SimpleExportView({ plan, sessions, profile, showUserProfile, includeNutrition, includeRecovery }: {
  plan: TrainingPlan;
  sessions: WorkoutSession[];
  profile: UserProfile; // ✅ 新增
  showUserProfile: boolean; // ✅ 新增
  includeNutrition: boolean; // ✅ 新增
  includeRecovery: boolean; // ✅ 新增
}) {
  const { summary } = plan;
  const gradientClass = getGoalGradient(summary.goal);

  return (
    <div className="flex flex-col bg-white" style={{ width: '600px', minHeight: '600px' }}>
      {/* ✅ 顶部标题区域 - 包含用户信息或仅计划标题 */}
      <div className={`bg-gradient-to-br ${gradientClass} px-6 py-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-0.5">个性化训练计划</h1>
            <p className="text-xs opacity-90">AI 智能生成 · 科学训练</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold">{sessions.length}</div>
              <div className="text-xs opacity-90">天训练</div>
            </div>
            {/* ✅ 二维码移到顶部 */}
            <div className="bg-white p-1.5 rounded border border-white border-opacity-30">
              <QRCodeSVG
                value="https://workout-plan-generator-three.vercel.app"
                size={48}
                level="L"
                includeMargin={false}
              />
            </div>
          </div>
        </div>

        {/* ✅ 显示用户基本信息 */}
        {showUserProfile && (
          <div className="mt-3 pt-3 border-t border-white border-opacity-20">
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <span>👤</span>
                <span>{profile.gender === 'male' ? '男' : profile.gender === 'female' ? '女' : '其他'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🎂</span>
                <span>{profile.age}岁</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>📏</span>
                <span>{profile.height}cm</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>⚖️</span>
                <span>{profile.weight}kg</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-4 gap-2 px-4 py-3 border-b-2 border-gray-200">
        <MetricItem icon="🎯" label="目标" value={summary.goalZh} />
        <MetricItem icon="📅" label="频率" value={`${summary.daysPerWeek}天/周`} />
        <MetricItem icon="⏱️" label="时长" value={`${summary.sessionMinutes}分钟`} />
        <MetricItem icon="📊" label="周数" value={`${summary.totalWeeks}周`} />
      </div>

      {/* ✅ 营养建议（简化版） - 移到训练计划前面 */}
      {includeNutrition && plan.nutritionAdvice && (
        <div className="px-4 py-3 border-t-2 border-green-200 bg-gradient-to-r from-green-50 to-teal-50">
          <div className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
            <span>🍊</span>
            <span>营养建议</span>
          </div>
          <div className="space-y-2">
            {/* 营养目标 */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white rounded-lg p-2 border border-blue-200">
                <div className="font-semibold text-blue-700">蛋白质</div>
                <div className="font-bold text-blue-900 mt-1">{plan.nutritionAdvice.proteinGrams}g</div>
                <div className="text-[9px] text-gray-600">{plan.nutritionAdvice.proteinRatio}</div>
              </div>
              <div className="bg-white rounded-lg p-2 border border-yellow-200">
                <div className="font-semibold text-yellow-700">碳水</div>
                <div className="font-bold text-yellow-900 mt-1">{plan.nutritionAdvice.carbsGrams}g</div>
                <div className="text-[9px] text-gray-600">{plan.nutritionAdvice.carbsRatio}</div>
              </div>
              <div className="bg-white rounded-lg p-2 border border-red-200">
                <div className="font-semibold text-red-700">脂肪</div>
                <div className="font-bold text-red-900 mt-1">{plan.nutritionAdvice.fatGrams}g</div>
                <div className="text-[9px] text-gray-600">{plan.nutritionAdvice.fatRatio}</div>
              </div>
            </div>
            {/* 总热量 */}
            {plan.nutritionAdvice.dailyCalories && (
              <div className="bg-green-100 rounded-lg px-3 py-2 text-center">
                <div className="text-xs text-green-800">每日总热量</div>
                <div className="font-bold text-green-900">{plan.nutritionAdvice.dailyCalories} 千卡</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ 恢复建议（简化版） - 移到训练计划前面 */}
      {includeRecovery && plan.recoveryAdvice && (
        <div className="px-4 py-3 border-t-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
            <span>🌙</span>
            <span>恢复建议</span>
          </div>
          <div className="space-y-2">
            {/* 睡眠建议 */}
            <div className="bg-white rounded-lg p-3 border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-700">
                  <div className="font-semibold text-purple-900">建议睡眠时长</div>
                  <div className="text-[9px] text-gray-600 mt-0.5">每天保证充足休息</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-700">{plan.recoveryAdvice.sleep.hours}</div>
                  <div className="text-[9px] text-gray-600">小时/天</div>
                </div>
              </div>
            </div>
            {/* 休息日频率 */}
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-700">
                  <div className="font-semibold text-blue-900">休息日频率</div>
                  <div className="text-[9px] text-gray-600 mt-0.5">建议每周安排</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-700">{plan.recoveryAdvice.restDays.frequency}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 训练详情区域 */}
      <div className="flex-1 px-4 py-3">
        <div className="space-y-3">
          {sessions.slice(0, 4).map((session, index) => (
            <div
              key={`${session.dayNumber}-${index}`}
              className={`border-2 rounded-lg p-3 ${
                index < 2 ? 'border-blue-200 bg-blue-50' : 'border-purple-200 bg-purple-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-gray-900 text-sm">{session.dayName}</div>
                <div className="text-xs px-2 py-0.5 bg-white rounded-full font-medium text-gray-600">
                  {session.totalMinutes}分钟
                </div>
              </div>
              <div className="text-xs text-gray-700 mb-2">{session.focus}</div>
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
          {sessions.length > 4 && (
            <div className="text-center text-xs text-gray-500 py-2">
              还有 {sessions.length - 4} 天训练计划...
            </div>
          )}
        </div>
      </div>

      {/* 底部信息（无二维码） */}
      <div className="px-4 py-3 border-t-2 border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-600">
            <div className="font-medium text-gray-900">Workout Plan Generator</div>
            <div className="mt-1">{new Date().toLocaleDateString('zh-CN')}</div>
          </div>
          <div className="text-xs text-gray-500">
            扫码上方二维码访问
          </div>
        </div>
      </div>
    </div>
  );
}

// 详细版导出视图
function DetailedExportView({ plan, sessions, profile, showUserProfile, includeNutrition, includeRecovery }: {
  plan: TrainingPlan;
  sessions: WorkoutSession[];
  profile: UserProfile; // ✅ 新增
  showUserProfile: boolean; // ✅ 新增
  includeNutrition: boolean; // ✅ 新增
  includeRecovery: boolean; // ✅ 新增
}) {
  const { summary } = plan;
  const gradientClass = getGoalGradient(summary.goal);

  return (
    <div className="flex flex-col bg-white" style={{ width: '600px' }}>
      {/* 顶部标题区域 */}
      <div className={`bg-gradient-to-br ${gradientClass} px-6 py-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-0.5">个性化训练计划（详细版）</h1>
            <p className="text-xs opacity-90">AI 智能生成 · 科学训练</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold">{sessions.length}</div>
              <div className="text-xs opacity-90">天训练</div>
            </div>
            {/* ✅ 二维码移到顶部 */}
            <div className="bg-white p-1.5 rounded border border-white border-opacity-30">
              <QRCodeSVG
                value="https://workout-plan-generator-three.vercel.app"
                size={48}
                level="L"
                includeMargin={false}
              />
            </div>
          </div>
        </div>

        {/* ✅ 显示用户基本信息 */}
        {showUserProfile && (
          <div className="mt-3 pt-3 border-t border-white border-opacity-20">
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="flex items-center space-x-1">
                <span>👤</span>
                <span>{profile.gender === 'male' ? '男' : profile.gender === 'female' ? '女' : '其他'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🎂</span>
                <span>{profile.age}岁</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>📏</span>
                <span>{profile.height}cm</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>⚖️</span>
                <span>{profile.weight}kg</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-4 gap-2 px-4 py-3 border-b-2 border-gray-200">
        <MetricItem icon="🎯" label="目标" value={summary.goalZh} />
        <MetricItem icon="📅" label="频率" value={`${summary.daysPerWeek}天/周`} />
        <MetricItem icon="⏱️" label="时长" value={`${summary.sessionMinutes}分钟`} />
        <MetricItem icon="📊" label="周数" value={`${summary.totalWeeks}周`} />
      </div>

      {/* ✅ 营养建议（简化版） - 移到训练计划前面 */}
      {includeNutrition && plan.nutritionAdvice && (
        <div className="px-4 py-3 border-t-2 border-green-200 bg-gradient-to-r from-green-50 to-teal-50">
          <div className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
            <span>🍊</span>
            <span>营养建议</span>
          </div>
          <div className="space-y-2">
            {/* 营养目标 */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white rounded-lg p-2 border border-blue-200">
                <div className="font-semibold text-blue-700">蛋白质</div>
                <div className="font-bold text-blue-900 mt-1">{plan.nutritionAdvice.proteinGrams}g</div>
                <div className="text-[9px] text-gray-600">{plan.nutritionAdvice.proteinRatio}</div>
              </div>
              <div className="bg-white rounded-lg p-2 border border-yellow-200">
                <div className="font-semibold text-yellow-700">碳水</div>
                <div className="font-bold text-yellow-900 mt-1">{plan.nutritionAdvice.carbsGrams}g</div>
                <div className="text-[9px] text-gray-600">{plan.nutritionAdvice.carbsRatio}</div>
              </div>
              <div className="bg-white rounded-lg p-2 border border-red-200">
                <div className="font-semibold text-red-700">脂肪</div>
                <div className="font-bold text-red-900 mt-1">{plan.nutritionAdvice.fatGrams}g</div>
                <div className="text-[9px] text-gray-600">{plan.nutritionAdvice.fatRatio}</div>
              </div>
            </div>
            {/* 总热量 */}
            {plan.nutritionAdvice.dailyCalories && (
              <div className="bg-green-100 rounded-lg px-3 py-2 text-center">
                <div className="text-xs text-green-800">每日总热量</div>
                <div className="font-bold text-green-900">{plan.nutritionAdvice.dailyCalories} 千卡</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ 恢复建议（简化版） - 移到训练计划前面 */}
      {includeRecovery && plan.recoveryAdvice && (
        <div className="px-4 py-3 border-t-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
            <span>🌙</span>
            <span>恢复建议</span>
          </div>
          <div className="space-y-2">
            {/* 睡眠建议 */}
            <div className="bg-white rounded-lg p-3 border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-700">
                  <div className="font-semibold text-purple-900">建议睡眠时长</div>
                  <div className="text-[9px] text-gray-600 mt-0.5">每天保证充足休息</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-700">{plan.recoveryAdvice.sleep.hours}</div>
                  <div className="text-[9px] text-gray-600">小时/天</div>
                </div>
              </div>
            </div>
            {/* 休息日频率 */}
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-700">
                  <div className="font-semibold text-blue-900">休息日频率</div>
                  <div className="text-[9px] text-gray-600 mt-0.5">建议每周安排</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-700">{plan.recoveryAdvice.restDays.frequency}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 详细训练内容 */}
      <div className="px-4 py-3 space-y-4">
        {sessions.map((session, index) => (
          <div
            key={`${session.dayNumber}-${index}`}
            className={`border-2 rounded-lg overflow-hidden ${
              index % 2 === 0 ? 'border-blue-200' : 'border-purple-200'
            }`}
          >
            {/* 训练日标题 */}
            <div className={`px-4 py-2 text-white ${
              index % 2 === 0 ? 'bg-blue-500' : 'bg-purple-500'
            }`}>
              <div className="flex items-center justify-between">
                <div className="font-bold text-base">{session.dayName}</div>
                <div className="text-xs px-2 py-0.5 bg-white bg-opacity-20 rounded-full">
                  {session.totalMinutes}分钟
                </div>
              </div>
              <div className="text-xs opacity-90 mt-1">{session.focus}</div>
            </div>

            {/* 训练阶段 */}
            <div className="p-3 space-y-3 bg-white">
              {/* 热身 */}
              {session.phases.warmup.length > 0 && (
                <PhaseSection
                  title="热身"
                  icon="🔥"
                  color="orange"
                  sets={session.phases.warmup}
                />
              )}

              {/* 主训练 */}
              {session.phases.main.length > 0 && (
                <PhaseSection
                  title="主训练"
                  icon="💪"
                  color="blue"
                  sets={session.phases.main}
                />
              )}

              {/* 辅助训练 */}
              {session.phases.accessory.length > 0 && (
                <PhaseSection
                  title="辅助训练"
                  icon="⚡"
                  color="purple"
                  sets={session.phases.accessory}
                />
              )}

              {/* 放松拉伸 */}
              {session.phases.cooldown.length > 0 && (
                <PhaseSection
                  title="放松拉伸"
                  icon="🧘"
                  color="green"
                  sets={session.phases.cooldown}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 底部信息（无二维码） */}
      <div className="px-4 py-3 border-t-2 border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-600">
            <div className="font-medium text-gray-900">Workout Plan Generator</div>
            <div className="mt-1">{new Date().toLocaleDateString('zh-CN')}</div>
          </div>
          <div className="text-xs text-gray-500">
            扫码上方二维码访问
          </div>
        </div>
      </div>
    </div>
  );
}

// 训练阶段组件
function PhaseSection({ title, icon, color, sets }: {
  title: string;
  icon: string;
  color: string;
  sets: Array<{
    exerciseId?: string;
    name?: string;
    nameZh?: string;
    sets?: number;
    reps?: number | string;
    duration?: number;
    restSec?: number;
    rpe?: number;
    notes?: string;
  }>;
}) {
  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div>
      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg mb-2 ${colors.bg} ${colors.border} border`}>
        <span>{icon}</span>
        <span className={`font-semibold text-sm ${colors.text}`}>{title}</span>
        <span className={`text-xs ${colors.text} opacity-75`}>({sets.length}个动作)</span>
      </div>
      <div className="space-y-1.5">
        {sets.map((set, index) => (
          <div key={index} className={`text-xs p-2 rounded ${colors.bg} ${colors.border} border`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className={`font-medium ${colors.text}`}>
                  {index + 1}. {set.nameZh || set.exerciseId}
                </div>
                <div className="text-gray-600 mt-1 space-x-2">
                  {set.sets && <span>{set.sets}组</span>}
                  {set.reps && <span>{set.reps}次</span>}
                  {set.duration && <span>{set.duration}秒</span>}
                  {set.restSec && <span>休息{set.restSec}秒</span>}
                  {set.rpe && <span>RPE{set.rpe}</span>}
                </div>
                {set.notes && (
                  <div className="text-gray-500 mt-1 italic">{set.notes}</div>
                )}
              </div>
            </div>
          </div>
        ))}
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
