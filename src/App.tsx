import { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import PlanDisplay from './components/PlanDisplay';
import StreamingDisplay from './components/StreamingDisplay';
import UserProfileCard from './components/UserProfileCard';
import DonationsModal from './components/DonationsModal';
import { UserProfile, TrainingPlan } from './types';
import { generateAIPlanStreaming } from './lib/aiPlanGenerator';

export default function App() {
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 流式内容状态
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const [streamReasoning, setStreamReasoning] = useState('');

  // ✅ 新增：保存最近的用户资料（用于显示汇总信息）
  const [lastProfile, setLastProfile] = useState<UserProfile | null>(null);

  // 中断控制
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // 进度状态（用于按周生成）
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  // 感谢弹窗状态
  const [showDonationModal, setShowDonationModal] = useState(false);

  const handleGenerate = async (profile: UserProfile) => {
    setLoading(true);
    setIsStreaming(true);
    setError(null);
    setPlan(null);
    setStreamContent('');
    setStreamReasoning('');
    setProgress(null); // 重置进度

    // ✅ 保存用户资料
    setLastProfile(profile);

    // 创建新的中断控制器
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const newPlan = await generateAIPlanStreaming(
        profile,
        (content, reasoning) => {
          // 实时更新流式内容
          setStreamContent(content);
          setStreamReasoning(reasoning);
        },
        (current, total) => {
          // 更新进度
          setProgress({ current, total });
        },
        controller.signal // 传递中断信号
      );

      setPlan(newPlan);
      setProgress(null); // 完成后清空进度
      setShowDonationModal(true); // ✅ 显示感谢弹窗
    } catch (error: any) {
      console.error('生成计划失败:', error);
      setError(error.message || '生成计划失败，请稍后重试');
    } finally {
      setLoading(false);
      setIsStreaming(false);
      setAbortController(null); // 清空控制器
    }
  };

  const handleCancel = () => {
    if (abortController) {
      console.log('用户请求中断生成');
      abortController.abort();
    }
  };

  // ✅ 新增：重新生成（返回表单填写界面）
  const handleRegenerate = () => {
    // 清空当前计划，返回到表单填写界面
    setPlan(null);
    setLastProfile(null);
    setStreamContent('');
    setStreamReasoning('');
    setError(null);
    setProgress(null);

    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* 根据是否有计划，切换布局 */}
        {!plan ? (
          /* 未生成时：上下布局（与生成后风格统一） */
          <div className="max-w-7xl mx-auto space-y-6">
            {/* 表单区域 */}
            <div>
              <InputForm onGenerate={handleGenerate} />
            </div>

            {/* 状态显示区域 */}
            <div>
              {/* 流式生成中 */}
              {isStreaming && (
                <StreamingDisplay
                  content={streamContent}
                  reasoning={streamReasoning}
                  progress={progress}
                  onCancel={handleCancel}
                />
              )}

              {/* 非流式加载中（降级到规则引擎时）*/}
              {loading && !isStreaming && (
                <div className="bg-white rounded-lg shadow-md p-12 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">正在生成训练计划...</p>
                  </div>
                </div>
              )}

              {!loading && error && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center print:hidden">
                  <svg
                    className="w-24 h-24 mx-auto text-red-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-red-700 mb-2">
                    生成失败
                  </h3>
                  <p className="text-gray-600">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    重新尝试
                  </button>
                </div>
              )}

              {!loading && !error && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center print:hidden">
                  <svg
                    className="w-24 h-24 mx-auto text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    准备开始
                  </h3>
                  <p className="text-gray-500">
                    填写上方表单，点击「生成训练计划」按钮开始
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 生成后：用户信息卡片 + 训练计划 */
          <div className="space-y-6">
            {/* ✅ 用户信息汇总卡片（始终显示） */}
            {lastProfile && (
              <div className="max-w-7xl mx-auto print:hidden">
                <UserProfileCard profile={lastProfile} onRegenerate={handleRegenerate} />
              </div>
            )}

            {/* 训练计划全宽显示 */}
            <div className="max-w-7xl mx-auto">
              <PlanDisplay
                plan={plan}
                profile={lastProfile || undefined}
                onOpenDonationModal={() => setShowDonationModal(true)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12 print:hidden">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            训练计划生成器 | Workout Plan Generator MVP
          </p>
          <p className="text-xs text-gray-400 mt-2">
            仅供参考，训练前请咨询专业教练或医生
          </p>
        </div>
      </footer>

      {/* ✅ 感谢弹窗 */}
      <DonationsModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
      />
    </div>
  );
}
