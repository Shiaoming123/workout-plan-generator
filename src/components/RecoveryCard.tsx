import { RecoveryAdvice } from '../types';

interface RecoveryCardProps {
  recoveryAdvice: RecoveryAdvice;
}

export default function RecoveryCard({ recoveryAdvice }: RecoveryCardProps) {
  // 计算睡眠百分比（以8小时为100%）
  const sleepPercentage = Math.min(100, (recoveryAdvice.sleep.hours / 8) * 100);

  return (
    <div className="bg-white rounded-xl shadow-card border-l-4 border-purple-500 overflow-hidden">
      {/* 标题栏 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">恢复建议</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 睡眠建议 - 可视化图表 */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            睡眠建议
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 睡眠时长可视化 */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-center mb-3">
                <div className="text-4xl font-bold text-indigo-700 mb-1">{recoveryAdvice.sleep.hours}</div>
                <div className="text-sm text-gray-600">小时/天</div>
              </div>

              {/* 睡眠时长进度条 */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>睡眠时长</span>
                  <span>{sleepPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
                    style={{ width: `${sleepPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* 睡眠时钟可视化 */}
              <div className="flex items-center justify-center mt-4">
                <div className="relative">
                  <svg className="w-24 h-24" viewBox="0 0 100 100">
                    {/* 背景圆 */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    {/* 进度圆 */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${sleepPercentage * 2.51} 251`}
                      transform="rotate(-90 50 50)"
                    />
                    {/* 渐变定义 */}
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-12 h-12 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 9.06 9.06 0 00-4.4-2.26c-.06.44-.1.9-.1 1.36a9 9 0 109 9z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* 睡眠质量建议表格 */}
            {recoveryAdvice.sleep.tips && recoveryAdvice.sleep.tips.length > 0 && (
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="bg-indigo-100 px-4 py-2">
                  <div className="font-semibold text-indigo-900 text-sm">改善睡眠质量</div>
                </div>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-200">
                    {recoveryAdvice.sleep.tips.map((tip, index) => (
                      <tr key={index} className="hover:bg-indigo-50">
                        <td className="px-4 py-3 text-gray-700">
                          <div className="flex items-start gap-2">
                            <span className="text-indigo-500 font-bold">{index + 1}.</span>
                            <span>{tip}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* 休息日安排 - 表格展示 */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            休息日安排
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">项目</th>
                  <th className="px-4 py-3 text-left">详情</th>
                  <th className="px-4 py-3 text-left">说明</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-white">
                  <td className="px-4 py-3 font-semibold text-gray-800">休息频率</td>
                  <td className="px-4 py-3 text-blue-700 font-bold">{recoveryAdvice.restDays.frequency}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">建议每周安排 1-2 天休息日</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800" colSpan={3}>
                    推荐的休息日活动
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3" colSpan={3}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {recoveryAdvice.restDays.activities.map((activity, index) => (
                        <div
                          key={index}
                          className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-center text-sm text-blue-800 hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex items-center justify-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {activity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 恢复技巧对比表格 */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            恢复技巧对比
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">技巧类型</th>
                  <th className="px-4 py-3 text-left">图标</th>
                  <th className="px-4 py-3 text-left">具体方法</th>
                  <th className="px-4 py-3 text-center">频率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recoveryAdvice.recoveryTechniques.stretching && recoveryAdvice.recoveryTechniques.stretching.length > 0 && (
                  <tr className="bg-white hover:bg-green-50">
                    <td className="px-4 py-3 font-semibold text-gray-800">拉伸放松</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-2xl">🧘</span>
                    </td>
                    <td className="px-4 py-3">
                      <ul className="text-sm text-gray-600 space-y-1">
                        {recoveryAdvice.recoveryTechniques.stretching.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        每天
                      </span>
                    </td>
                  </tr>
                )}

                {recoveryAdvice.recoveryTechniques.foamRolling && recoveryAdvice.recoveryTechniques.foamRolling.length > 0 && (
                  <tr className="bg-gray-50 hover:bg-blue-50">
                    <td className="px-4 py-3 font-semibold text-gray-800">筋膜放松</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-2xl">🔵</span>
                    </td>
                    <td className="px-4 py-3">
                      <ul className="text-sm text-gray-600 space-y-1">
                        {recoveryAdvice.recoveryTechniques.foamRolling.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        2-3次/周
                      </span>
                    </td>
                  </tr>
                )}

                {recoveryAdvice.recoveryTechniques.massage && recoveryAdvice.recoveryTechniques.massage.length > 0 && (
                  <tr className="bg-white hover:bg-purple-50">
                    <td className="px-4 py-3 font-semibold text-gray-800">按摩</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-2xl">💆</span>
                    </td>
                    <td className="px-4 py-3">
                      <ul className="text-sm text-gray-600 space-y-1">
                        {recoveryAdvice.recoveryTechniques.massage.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-purple-500">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                        1-2次/周
                      </span>
                    </td>
                  </tr>
                )}

                {recoveryAdvice.recoveryTechniques.other && recoveryAdvice.recoveryTechniques.other.length > 0 && (
                  <tr className="bg-gray-50 hover:bg-orange-50">
                    <td className="px-4 py-3 font-semibold text-gray-800">其他方法</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-2xl">🌟</span>
                    </td>
                    <td className="px-4 py-3">
                      <ul className="text-sm text-gray-600 space-y-1">
                        {recoveryAdvice.recoveryTechniques.other.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                        按需
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 需要警惕的信号 - 警告表格 */}
        {recoveryAdvice.warningSigns && recoveryAdvice.warningSigns.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-5 border-2 border-red-200">
            <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              需要警惕的信号
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-red-500 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">警示信号</th>
                    <th className="px-4 py-3 text-left">可能原因</th>
                    <th className="px-4 py-3 text-left">建议措施</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recoveryAdvice.warningSigns.map((sign, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-red-50' : 'bg-red-50 hover:bg-red-50'}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-red-500 text-lg">⚠️</span>
                          <span className="font-semibold text-gray-800">{sign}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {sign.includes('疼痛') && '过度训练或动作不标准'}
                        {sign.includes('疲劳') && '恢复不足或训练强度过高'}
                        {sign.includes('睡眠') && '训练时间过晚或压力过大'}
                        {!sign.includes('疼痛') && !sign.includes('疲劳') && !sign.includes('睡眠') && '需要调整训练计划'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                          立即休息 / 减少强度
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 bg-white/50 rounded-lg px-4 py-3 text-sm text-red-700">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <strong>重要提醒：</strong>及时休息可以避免受伤，帮助身体更好地恢复和适应训练。如果症状持续，请咨询专业教练或医生。
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
