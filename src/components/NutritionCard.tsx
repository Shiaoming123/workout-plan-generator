import { NutritionAdvice } from '../types';

interface NutritionCardProps {
  nutritionAdvice: NutritionAdvice;
}

export default function NutritionCard({ nutritionAdvice }: NutritionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-card border-l-4 border-green-500 overflow-hidden">
      {/* 标题栏 */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">营养建议</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 营养目标总览表格 */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            每日营养目标
          </h3>

          {/* 营养素对比表格 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">营养素</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">摄入量</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">占比</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">进度</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-blue-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">蛋白质</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-blue-600">{nutritionAdvice.proteinGrams}g</td>
                  <td className="px-4 py-3 text-right text-gray-600">{nutritionAdvice.proteinRatio}</td>
                  <td className="px-4 py-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: nutritionAdvice.proteinRatio }}
                      ></div>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-yellow-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">碳水化合物</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-yellow-600">{nutritionAdvice.carbsGrams}g</td>
                  <td className="px-4 py-3 text-right text-gray-600">{nutritionAdvice.carbsRatio}</td>
                  <td className="px-4 py-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all"
                        style={{ width: nutritionAdvice.carbsRatio }}
                      ></div>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-red-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-medium">脂肪</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-red-600">{nutritionAdvice.fatGrams}g</td>
                  <td className="px-4 py-3 text-right text-gray-600">{nutritionAdvice.fatRatio}</td>
                  <td className="px-4 py-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all"
                        style={{ width: nutritionAdvice.fatRatio }}
                      ></div>
                    </div>
                  </td>
                </tr>
                {nutritionAdvice.dailyCalories && (
                  <tr className="bg-green-50 font-semibold">
                    <td className="px-4 py-3" colSpan={2}>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                        总热量
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-green-700" colSpan={2}>
                      {nutritionAdvice.dailyCalories} 千卡/天
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 水分摄入卡片 */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h2.5L8 2h8l2.5 2H18a2 2 0 012 2v8.66l-1 1.34zm-5-5.34a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                每日水分摄入
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-blue-700">{nutritionAdvice.waterIntake.dailyLiters}</span>
                <span className="text-lg text-gray-600">升/天</span>
              </div>
            </div>
            <div className="flex gap-1 ml-4">
              {[...Array(Math.min(8, Math.ceil(nutritionAdvice.waterIntake.dailyLiters)))].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-12 bg-blue-500 rounded-t-lg flex items-end justify-center pb-1"
                >
                  <svg className="w-4 h-4 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 text-sm text-blue-700 bg-blue-100/50 px-3 py-2 rounded-lg">
            💡 分次饮用，运动前后各补充 200-300ml
          </div>
        </div>

        {/* 每日餐食安排表格 */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            每日餐食安排
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">餐次</th>
                  <th className="px-4 py-3 text-left">时间</th>
                  <th className="px-4 py-3 text-left">推荐食物</th>
                  <th className="px-4 py-3 text-right">热量</th>
                  <th className="px-4 py-3 text-left">蛋白质来源</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {nutritionAdvice.mealPlan.map((meal, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-semibold text-gray-800">{meal.mealType}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {meal.timing}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {meal.foods.map((food, foodIndex) => (
                          <span
                            key={foodIndex}
                            className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                          >
                            {food}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {meal.calories ? (
                        <span className="font-semibold">{meal.calories}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {meal.protein || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 推荐食谱表格 */}
        {nutritionAdvice.recipes && nutritionAdvice.recipes.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              推荐食谱
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">食谱名称</th>
                    <th className="px-4 py-3 text-left">食材</th>
                    <th className="px-4 py-3 text-left">制作步骤</th>
                    <th className="px-4 py-3 text-center">用时</th>
                    <th className="px-4 py-3 text-right">热量</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {nutritionAdvice.recipes.map((recipe, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-orange-50' : 'bg-gray-50 hover:bg-orange-50'}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800">{recipe.name}</div>
                        {recipe.protein && (
                          <div className="text-xs text-blue-600 mt-1">{recipe.protein}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <ul className="text-sm text-gray-600 space-y-1">
                          {recipe.ingredients.map((ingredient, ingIndex) => (
                            <li key={ingIndex} className="flex items-start gap-2">
                              <span className="text-orange-500">•</span>
                              <span>{ingredient}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3">
                        <ol className="text-sm text-gray-600 space-y-1">
                          {recipe.instructions.map((instruction, instIndex) => (
                            <li key={instIndex} className="flex items-start gap-2">
                              <span className="text-orange-500 font-semibold">{instIndex + 1}.</span>
                              <span>{instruction}</span>
                            </li>
                          ))}
                        </ol>
                        {recipe.notes && (
                          <div className="text-xs text-gray-500 mt-2 italic">💡 {recipe.notes}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {recipe.prepTime} 分钟
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {recipe.calories ? (
                          <span className="font-semibold">{recipe.calories}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
