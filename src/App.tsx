import { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import PlanDisplay from './components/PlanDisplay';
import { UserProfile, TrainingPlan } from './types';
import { generatePlan } from './lib/planGenerator';

export default function App() {
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = (profile: UserProfile) => {
    setLoading(true);
    setTimeout(() => {
      try {
        const newPlan = generatePlan(profile);
        setPlan(newPlan);
      } catch (error) {
        console.error('生成计划失败:', error);
        alert('生成计划失败，请检查输入参数');
      } finally {
        setLoading(false);
      }
    }, 500);
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
                </div>
              </div>
            )}

            {!loading && !plan && (
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

            {!loading && plan && <PlanDisplay plan={plan} />}
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
