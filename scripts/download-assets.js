/**
 * 下载常用运动演示资源到本地
 *
 * 运行方式：npm run download-assets
 *
 * 此脚本会：
 * 1. 从 API 获取常用运动的演示数据
 * 2. 下载图片和视频到 public/assets/exercises/
 * 3. 生成本地资源映射表
 */

import { searchExerciseByName } from '../src/lib/exerciseDBClient.js';
import { downloadExerciseAssets, initLocalAssetDirectories, generateLocalAssetMapping } from '../src/lib/localAssetManager.js';
import { exerciseMappings } from '../src/data/exerciseMappings.js';

// 常用运动列表（高频使用的运动）
const PRIORITY_EXERCISES = [
  'warmup_1',   // Jumping Jacks
  'upper_1',    // Push-ups
  'upper_2',    // Dumbbell Bench Press
  'upper_3',    // Dumbbell Rows
  'lower_1',    // Bodyweight Squats
  'lower_2',    // Goblet Squats
  'lower_3',    // Lunges
  'core_1',     // Plank
  'core_2',     // Side Plank
  'core_6',     // Mountain Climbers
  'hiit_1',     // Burpees
  'hiit_2',     // High Knees
];

// API 调用延迟（避免限流）
const API_DELAY = 300;

/**
 * 延迟函数
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始下载常用运动演示资源...\n');

  // 1. 初始化本地目录
  console.log('📁 初始化本地资源目录...');
  initLocalAssetDirectories();

  // 2. 下载每个运动的资源
  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
  };

  for (const exerciseId of PRIORITY_EXERCISES) {
    const mapping = exerciseMappings.find(m => m.ourExerciseId === exerciseId);

    if (!mapping) {
      console.log(`⚠️  跳过 ${exerciseId}：未找到映射配置`);
      results.skipped++;
      continue;
    }

    console.log(`\n📋 处理: ${mapping.ourExerciseNameZh} (${mapping.ourExerciseName})`);

    try {
      // 搜索运动
      const searchKeywords = mapping.matchStrategy === 'keyword'
        ? mapping.searchKeywords || [mapping.ourExerciseName]
        : [mapping.ourExerciseName];

      let exerciseData = null;

      // 尝试每个关键词
      for (const keyword of searchKeywords) {
        const exercises = await searchExerciseByName(keyword);
        if (exercises.length > 0) {
          exerciseData = exercises[0];
          console.log(`✅ 找到匹配: ${exerciseData.name}`);
          break;
        }
      }

      if (!exerciseData) {
        console.log(`❌ 未找到: ${mapping.ourExerciseName}`);
        results.failed++;
        continue;
      }

      // 下载资源
      await downloadExerciseAssets(exerciseId, exerciseData);
      results.success++;

      // 延迟，避免 API 限流
      await delay(API_DELAY);

    } catch (error) {
      console.error(`❌ 失败: ${error.message}`);
      results.failed++;
    }
  }

  // 3. 输出结果
  console.log('\n' + '='.repeat(50));
  console.log('📊 下载结果统计:');
  console.log(`  ✅ 成功: ${results.success}`);
  console.log(`  ❌ 失败: ${results.failed}`);
  console.log(`  ⚠️  跳过: ${results.skipped}`);
  console.log('='.repeat(50));

  if (results.success > 0) {
    console.log('\n🎉 资源已保存到 public/assets/exercises/');
    console.log('💡 提示：运行 `npm run build` 后，这些资源会被打包到应用中');
  }
}

// 运行主函数
main().catch(error => {
  console.error('❌ 脚本执行失败:', error);
  process.exit(1);
});
