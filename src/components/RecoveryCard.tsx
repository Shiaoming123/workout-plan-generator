import { RecoveryAdvice } from '../types';

interface RecoveryCardProps {
  recoveryAdvice: RecoveryAdvice;
}

export default function RecoveryCard({ recoveryAdvice }: RecoveryCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-card border-l-4 border-purple-500 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-purple-900">恢复建议</h2>
      </div>

      {/* 睡眠建议 */}
      <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <h3 className="font-semibold text-indigo-900">睡眠建议</h3>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-3xl font-bold text-indigo-700">{recoveryAdvice.sleep.hours}</span>
          <span className="text-gray-600">小时/天</span>
        </div>
        {recoveryAdvice.sleep.tips && recoveryAdvice.sleep.tips.length > 0 && (
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-700">改善睡眠质量的建议：</div>
            <ul className="text-sm text-gray-600 space-y-1">
              {recoveryAdvice.sleep.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 休息日建议 */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="font-semibold text-blue-900">休息日安排</h3>
        </div>
        <div className="mb-3">
          <span className="text-sm text-gray-600">频率：</span>
          <span className="font-semibold text-blue-700 ml-1">{recoveryAdvice.restDays.frequency}</span>
        </div>
        {recoveryAdvice.restDays.activities && recoveryAdvice.restDays.activities.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">推荐活动：</div>
            <div className="flex flex-wrap gap-2">
              {recoveryAdvice.restDays.activities.map((activity, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {activity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 恢复技巧 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-semibold text-gray-900">恢复技巧</h3>
        </div>

        <div className="space-y-4">
          {/* 拉伸 */}
          {recoveryAdvice.recoveryTechniques.stretching && recoveryAdvice.recoveryTechniques.stretching.length > 0 && (
            <div className="border-l-2 border-green-500 pl-3">
              <div className="font-medium text-gray-800 mb-2">🧘 拉伸放松</div>
              <ul className="text-sm text-gray-600 space-y-1">
                {recoveryAdvice.recoveryTechniques.stretching.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 筋膜放松 */}
          {recoveryAdvice.recoveryTechniques.foamRolling && recoveryAdvice.recoveryTechniques.foamRolling.length > 0 && (
            <div className="border-l-2 border-blue-500 pl-3">
              <div className="font-medium text-gray-800 mb-2">🔵 筋膜放松（Foam Rolling）</div>
              <ul className="text-sm text-gray-600 space-y-1">
                {recoveryAdvice.recoveryTechniques.foamRolling.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 按摩 */}
          {recoveryAdvice.recoveryTechniques.massage && recoveryAdvice.recoveryTechniques.massage.length > 0 && (
            <div className="border-l-2 border-purple-500 pl-3">
              <div className="font-medium text-gray-800 mb-2">💆 按摩</div>
              <ul className="text-sm text-gray-600 space-y-1">
                {recoveryAdvice.recoveryTechniques.massage.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 其他恢复方法 */}
          {recoveryAdvice.recoveryTechniques.other && recoveryAdvice.recoveryTechniques.other.length > 0 && (
            <div className="border-l-2 border-orange-500 pl-3">
              <div className="font-medium text-gray-800 mb-2">🌟 其他恢复方法</div>
              <ul className="text-sm text-gray-600 space-y-1">
                {recoveryAdvice.recoveryTechniques.other.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 需要警惕的信号 */}
      {recoveryAdvice.warningSigns && recoveryAdvice.warningSigns.length > 0 && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="font-semibold text-red-900">需要警惕的信号</h3>
          </div>
          <p className="text-sm text-red-700 mb-2">如果出现以下情况，请考虑减少训练强度或休息：</p>
          <ul className="text-sm text-red-600 space-y-1">
            {recoveryAdvice.warningSigns.map((sign, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">⚠️</span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-red-600 mt-3 italic">
            💡 及时休息可以避免受伤，帮助身体更好地恢复和适应训练
          </p>
        </div>
      )}
    </div>
  );
}
