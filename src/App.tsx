import { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import PlanDisplay from './components/PlanDisplay';
import { UserProfile, TrainingPlan } from './types';
import { generateAIPlan } from './lib/aiPlanGenerator';

export default function App() {
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (profile: UserProfile) => {
    setLoading(true);
    setError(null);

    try {
      const newPlan = await generateAIPlan(profile);
      setPlan(newPlan);
    } catch (error: any) {
      console.error('生成计划失败:', error);
      setError(error.message || '生成计划失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input Form */}
          <div>
            <InputForm onGenerate={handleGenerate} />
          </div>

          {/* Right: Plan Display */}
          <div>
            {loading && (
              <div className="bg-white rounded-lg shadow-md p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">正在生成训练计划...</p>
                  <p className="text-xs text-gray-500 mt-2">
                    使用 AI 生成可能需要 5-15 秒，请耐心等待
                  </p>
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

            {!loading && !error && !plan && (
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

            {!loading && !error && plan && <PlanDisplay plan={plan} />}
          </div>
        </div>
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
