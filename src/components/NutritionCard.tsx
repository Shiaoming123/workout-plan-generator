import { NutritionAdvice } from '../types';

interface NutritionCardProps {
  nutritionAdvice: NutritionAdvice;
}

export default function NutritionCard({ nutritionAdvice }: NutritionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-card border-l-4 border-green-500 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-green-900">营养建议</h2>
      </div>

      {/* 每日营养目标 */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-3">每日营养目标</h3>
        {nutritionAdvice.dailyCalories && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-700">每日热量</span>
              <span className="font-bold text-green-700">{nutritionAdvice.dailyCalories} 千卡</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{nutritionAdvice.proteinGrams}g</div>
            <div className="text-xs text-gray-600">蛋白质</div>
            <div className="text-xs text-gray-500 mt-1">{nutritionAdvice.proteinRatio}</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{nutritionAdvice.carbsGrams}g</div>
            <div className="text-xs text-gray-600">碳水</div>
            <div className="text-xs text-gray-500 mt-1">{nutritionAdvice.carbsRatio}</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="text-2xl font-bold text-red-600">{nutritionAdvice.fatGrams}g</div>
            <div className="text-xs text-gray-600">脂肪</div>
            <div className="text-xs text-gray-500 mt-1">{nutritionAdvice.fatRatio}</div>
          </div>
        </div>
      </div>

      {/* 水分摄入 */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">水分摄入建议</h3>
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h2.5L8 2h8l2.5 2H18a2 2 0 012 2v8.66l-1 1.34zm-5-5.34a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-lg font-semibold text-blue-700">
            每日 {nutritionAdvice.waterIntake.dailyLiters} 升
          </span>
        </div>
        <p className="text-sm text-blue-600 mt-2">
          💡 分次饮用，运动前后各补充 200-300ml
        </p>
      </div>

      {/* 餐食安排 */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">每日餐食安排</h3>
        <div className="space-y-3">
          {nutritionAdvice.mealPlan.map((meal, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800">{meal.mealType}</h4>
                {meal.calories && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {meal.calories} 千卡
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 mb-2">⏰ {meal.timing}</div>
              <div className="flex flex-wrap gap-2">
                {meal.foods.map((food, foodIndex) => (
                  <span
                    key={foodIndex}
                    className="inline-block px-2 py-1 bg-green-100 text-green-800 text-sm rounded"
                  >
                    {food}
                  </span>
                ))}
              </div>
              {meal.protein && (
                <div className="text-xs text-gray-500 mt-2">
                  🥩 蛋白质来源: {meal.protein}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 食谱推荐 */}
      {nutritionAdvice.recipes && nutritionAdvice.recipes.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">推荐食谱</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nutritionAdvice.recipes.map((recipe, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{recipe.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {recipe.prepTime} 分钟
                  </div>
                </div>
                {recipe.calories && (
                  <div className="text-xs text-gray-500 mb-2">{recipe.calories} 千卡</div>
                )}
                {recipe.protein && (
                  <div className="text-xs text-blue-600 mb-2">{recipe.protein}</div>
                )}

                <div className="text-sm text-gray-700 mb-2">
                  <strong>食材：</strong>
                  <ul className="list-disc list-inside mt-1">
                    {recipe.ingredients.map((ingredient, ingIndex) => (
                      <li key={ingIndex} className="text-xs">{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-sm text-gray-700">
                  <strong>步骤：</strong>
                  <ol className="list-decimal list-inside mt-1">
                    {recipe.instructions.map((instruction, instIndex) => (
                      <li key={instIndex} className="text-xs">{instruction}</li>
                    ))}
                  </ol>
                </div>

                {recipe.notes && (
                  <div className="text-xs text-gray-500 mt-2 italic">💡 {recipe.notes}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
