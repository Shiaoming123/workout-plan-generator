/**
 * API 运动名称映射器
 *
 * 为我们的运动数据库找到 API 中最匹配的运动
 * 生成精确的映射表，供大模型使用
 */

import { searchExerciseByName } from './exerciseDBClient';
import { allExercises } from '../data/exercises';

/**
 * 映射结果
 */
export interface ExerciseNameMapping {
  /** 我们的运动 ID */
  ourId: string;
  /** 我们的运动名称（英文） */
  ourName: string;
  /** 我们的运动名称（中文） */
  ourNameZh: string;
  /** API 中的精确名称 */
  apiName: string;
  /** API ID */
  apiId: string;
  /** 是否有视频 */
  hasVideo: boolean;
  /** 是否精确匹配 */
  isExactMatch: boolean;
}

/**
 * 为单个运动查找 API 中的最佳匹配
 */
async function findBestMatch(
  ourExercise: any
): Promise<ExerciseNameMapping | null> {
  const ourName = ourExercise.name.toLowerCase().trim();

  try {
    // 尝试精确搜索
    const results = await searchExerciseByName(ourExercise.name);

    if (results.length === 0) {
      console.warn(`⚠️ 未找到匹配: ${ourExercise.nameZh} (${ourExercise.name})`);
      return null;
    }

    // 查找精确匹配
    const exactMatch = results.find(
      (r) => r.name.toLowerCase() === ourName
    );

    if (exactMatch) {
      console.log(`✅ 精确匹配: ${ourExercise.nameZh} → ${exactMatch.name}`);

      return {
        ourId: ourExercise.id,
        ourName: ourExercise.name,
        ourNameZh: ourExercise.nameZh,
        apiName: exactMatch.name,
        apiId: exactMatch.exerciseId,
        hasVideo: !!exactMatch.videoUrl,
        isExactMatch: true,
      };
    }

    // 没有精确匹配，使用第一个结果（可能不准确）
    const bestMatch = results[0];
    console.log(
      `⚠️ 部分匹配: ${ourExercise.nameZh} → ${bestMatch.name} (不精确)`
    );

    return {
      ourId: ourExercise.id,
      ourName: ourExercise.name,
      ourNameZh: ourExercise.nameZh,
      apiName: bestMatch.name,
      apiId: bestMatch.exerciseId,
      hasVideo: !!bestMatch.videoUrl,
      isExactMatch: false,
    };
  } catch (error) {
    console.error(`❌ 搜索失败: ${ourExercise.name}`, error);
    return null;
  }
}

/**
 * 为所有运动创建映射
 *
 * 注意：这个函数会消耗大量 API 调用
 * 建议在需要更新映射时手动运行
 */
export async function createExerciseNameMappings(): Promise<
  ExerciseNameMapping[]
> {
  console.log('🔄 开始创建运动名称映射...\n');

  const mappings: ExerciseNameMapping[] = [];
  const errors: string[] = [];

  for (let i = 0; i < allExercises.length; i++) {
    const exercise = allExercises[i];
    console.log(
      `[${i + 1}/${allExercises.length}] 搜索: ${exercise.nameZh}...`
    );

    try {
      const mapping = await findBestMatch(exercise);
      if (mapping) {
        mappings.push(mapping);
      } else {
        errors.push(`${exercise.nameZh} (${exercise.name})`);
      }

      // 添加延迟，避免 API 限流
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`❌ 处理失败: ${exercise.name}`, error);
      errors.push(`${exercise.nameZh} (${exercise.name})`);
    }
  }

  // 输出统计
  console.log('\n📊 映射创建完成！');
  console.log(`✅ 成功: ${mappings.length}`);
  console.log(`❌ 失败: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\n未找到映射的运动:');
    errors.forEach((err) => console.log(`  - ${err}`));
  }

  const exactMatches = mappings.filter((m) => m.isExactMatch).length;
  console.log(`\n精确匹配: ${exactMatches}/${mappings.length}`);

  return mappings;
}

/**
 * 生成用于大模型提示词的运动名称列表
 */
export function generatePromptExerciseNames(
  mappings: ExerciseNameMapping[]
): string {
  // 按类别分组
  const byCategory = mappings.reduce((acc, mapping) => {
    // 从我们的 ID 中提取类别
    const category = mapping.ourId.split('_')[0]; // warmup, upper, lower, etc.

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(mapping);
    return acc;
  }, {} as Record<string, ExerciseNameMapping[]>);

  // 生成提示词文本
  let prompt = '请使用以下精确的运动名称（来自演示资源库）：\n\n';

  const categoryNames: Record<string, string> = {
    warmup: '热身运动',
    upper: '上肢训练',
    lower: '下肢训练',
    core: '核心训练',
    cardio: '有氧训练',
    hiit: 'HIIT训练',
    stretch: '拉伸运动',
  };

  for (const [category, categoryMappings] of Object.entries(byCategory)) {
    if (categoryMappings.length === 0) continue;

    const categoryZh = categoryNames[category] || category;

    prompt += `## ${categoryZh}\n`;

    // 只显示精确匹配的
    const exactMatches = categoryMappings.filter((m) => m.isExactMatch);

    if (exactMatches.length > 0) {
      exactMatches.forEach((m) => {
        prompt += `- ${m.ourNameZh}（英文名必须使用：**${m.apiName}**）\n`;
      });
    } else {
      prompt += `（暂无精确匹配的运动）\n`;
    }

    prompt += '\n';
  }

  // 添加使用说明
  prompt += `**重要说明：**
1. 生成训练计划时，请**严格使用**上述列表中指定的英文名称
2. 这样可以确保用户能查看正确的演示视频和图片
3. 如果某个运动不在列表中，请选择最接近的替代运动
4. 中文翻译可以调整，但英文名必须与列表一致`;

  return prompt;
}

/**
 * 导出映射为 JSON
 */
export function exportMappingsAsJSON(mappings: ExerciseNameMapping[]): string {
  return JSON.stringify(mappings, null, 2);
}

/**
 * 从 JSON 导入映射
 */
export function importMappingsFromJSON(json: string): ExerciseNameMapping[] {
  return JSON.parse(json);
}
