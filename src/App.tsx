import { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import PlanDisplay from './components/PlanDisplay';
import StreamingDisplay from './components/StreamingDisplay';
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

  // 表单折叠状态（生成后默认折叠）
  const [formCollapsed, setFormCollapsed] = useState(false);

  const handleGenerate = async (profile: UserProfile) => {
    setLoading(true);
    setIsStreaming(true);
    setError(null);
    setPlan(null);
    setStreamContent('');
    setStreamReasoning('');
    setFormCollapsed(false); // 生成时展开（显示流式输出）

    try {
      const newPlan = await generateAIPlanStreaming(profile, (content, reasoning) => {
        // 实时更新流式内容
        setStreamContent(content);
        setStreamReasoning(reasoning);
      });

      setPlan(newPlan);
      setFormCollapsed(true); // 生成成功后自动折叠表单
    } catch (error: any) {
      console.error('生成计划失败:', error);
      setError(error.message || '生成计划失败，请稍后重试');
    } finally {
      setLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* 根据是否有计划，切换布局 */}
        {!plan ? (
          /* 未生成时：左右布局 */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Input Form */}
            <div>
              <InputForm onGenerate={handleGenerate} />
            </div>

            {/* Right: Empty State or Streaming */}
            <div>
              {/* 流式生成中 */}
              {isStreaming && (
                <StreamingDisplay
                  content={streamContent}
                  reasoning={streamReasoning}
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
                    还没有生成计划
                  </h3>
                  <p className="text-gray-500">
                    填写左侧表单，点击「生成训练计划」按钮开始
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 生成后：表单折叠 + 训练计划全宽显示 */
          <div className="space-y-6">
            {/* 可折叠的表单卡片 */}
            <div className="bg-white rounded-xl shadow-card border border-gray-200 overflow-hidden print:hidden">
              <button
                onClick={() => setFormCollapsed(!formCollapsed)}
                className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">个人信息与目标</h3>
                    <p className="text-sm text-gray-600">
                      {formCollapsed ? '点击展开修改参数' : '点击收起'}
                    </p>
                  </div>
                </div>

                {/* 展开/收起图标 */}
                <svg
                  className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                    formCollapsed ? '' : 'rotate-180'
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

              {/* 表单内容（可折叠）*/}
              {!formCollapsed && (
                <div className="p-6 border-t border-gray-200">
                  <div className="max-w-3xl mx-auto">
                    <InputForm onGenerate={handleGenerate} />
                  </div>
                </div>
              )}
            </div>

            {/* 训练计划全宽显示 */}
            <div className="max-w-7xl mx-auto">
              <PlanDisplay plan={plan} />
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
    </div>
  );
}
