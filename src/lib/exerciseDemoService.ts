/**
 * 运动演示服务
 *
 * 整合 API 调用、映射匹配、缓存管理的统一服务层
 * 为 UI 组件提供简洁的接口
 */

import type { AscendExercise } from './exerciseDBClient';
import {
  searchExerciseByName,
  getExerciseById,
  isExerciseDBConfigured,
} from './exerciseDBClient';
import { getExerciseMapping } from '../data/exerciseMappings';
import {
  getCachedDemo,
  saveCachedDemo,
} from './exerciseDemoCache';

/**
 * 运动演示加载状态
 */
export type DemoLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * 运动演示数据
 */
export interface ExerciseDemo {
  exerciseId: string;
  exerciseName: string;
  exerciseNameZh: string;
  imageUrl: string;
  videoUrl?: string;
  apiExerciseId: string;
  bodyPart: string;
  instructions?: string[];
  tips?: string[];
  loadStatus: DemoLoadStatus;
  error?: string;
}

/**
 * 运动演示加载选项
 */
export interface LoadDemoOptions {
  /** 是否使用缓存（默认 true） */
  useCache?: boolean;

  /** 是否保存到缓存（默认 true） */
  saveToCache?: boolean;

  /** 是否加载视频（默认 true，如果有的话） */
  loadVideo?: boolean;

  /** 加载超时时间（毫秒） */
  timeout?: number;
}

/**
 * 加载运动演示
 *
 * @param exerciseId - 运动 ID
 * @param options - 加载选项
 * @returns 运动演示数据
 */
export async function loadExerciseDemo(
  exerciseId: string,
  options: LoadDemoOptions = {}
): Promise<ExerciseDemo> {
  const {
    useCache = true,
    saveToCache = true,
    loadVideo = true,
    timeout = 10000,
  } = options;

  // 1. 检查缓存
  if (useCache) {
    const cached = getCachedDemo(exerciseId);
    if (cached) {
      return {
        exerciseId: cached.exerciseId,
        exerciseName: cached.name,
        exerciseNameZh: '', // 需要从映射表获取
        imageUrl: cached.imageUrl,
        videoUrl: cached.videoUrl,
        apiExerciseId: cached.apiExerciseId,
        bodyPart: cached.bodyPart,
        instructions: cached.instructions,
        tips: cached.tips,
        loadStatus: 'loaded',
      };
    }
  }

  // 2. 检查 API 配置
  if (!isExerciseDBConfigured()) {
    return {
      exerciseId,
      exerciseName: '',
      exerciseNameZh: '',
      imageUrl: '',
      videoUrl: '',
      apiExerciseId: '',
      bodyPart: '',
      loadStatus: 'error',
      error: 'RapidAPI Key 未配置。请在 .env 文件中设置 VITE_RAPIDAPI_KEY',
    };
  }

  // 3. 获取映射信息
  const mapping = getExerciseMapping(exerciseId);
  if (!mapping) {
    return {
      exerciseId,
      exerciseName: '',
      exerciseNameZh: '',
      imageUrl: '',
      videoUrl: '',
      apiExerciseId: '',
      bodyPart: '',
      loadStatus: 'error',
      error: `未找到运动 "${exerciseId}" 的映射配置`,
    };
  }

  try {
    // 4. 调用 API 搜索
    const apiExercise = await searchWithTimeout(mapping, timeout);

    if (!apiExercise) {
      return {
        exerciseId,
        exerciseName: mapping.ourExerciseName,
        exerciseNameZh: mapping.ourExerciseNameZh,
        imageUrl: '',
        videoUrl: '',
        apiExerciseId: '',
        bodyPart: '',
        loadStatus: 'error',
        error: `未找到 "${mapping.ourExerciseName}" 的演示资源`,
      };
    }

    // 5. 如果需要视频且当前有 ID，获取详细信息
    let finalApiExercise = apiExercise;
    if (loadVideo && apiExercise.exerciseId && !apiExercise.videoUrl) {
      const detailed = await getExerciseById(apiExercise.exerciseId);
      if (detailed && detailed.videoUrl) {
        finalApiExercise = detailed;
      }
    }

    // 6. 构建演示数据
    const demo: ExerciseDemo = {
      exerciseId,
      exerciseName: mapping.ourExerciseName,
      exerciseNameZh: mapping.ourExerciseNameZh,
      imageUrl: finalApiExercise.imageUrl || '',
      videoUrl: finalApiExercise.videoUrl,
      apiExerciseId: finalApiExercise.exerciseId,
      bodyPart: finalApiExercise.bodyParts?.[0] || '',
      instructions: finalApiExercise.instructions,
      tips: finalApiExercise.exerciseTips,
      loadStatus: 'loaded',
    };

    // 7. 保存到缓存
    if (saveToCache) {
      saveCachedDemo({
        exerciseId: demo.exerciseId,
        imageUrl: demo.imageUrl,
        videoUrl: demo.videoUrl,
        apiExerciseId: demo.apiExerciseId,
        name: demo.exerciseName,
        bodyPart: demo.bodyPart,
        instructions: demo.instructions || [],
        tips: demo.tips,
        cachedAt: new Date().toISOString(),
      });
    }

    console.log(`✅ 成功加载运动演示: ${mapping.ourExerciseNameZh}`);
    return demo;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    console.error(`❌ 加载运动演示失败 (${exerciseId}):`, error);

    return {
      exerciseId,
      exerciseName: mapping.ourExerciseName,
      exerciseNameZh: mapping.ourExerciseNameZh,
      imageUrl: '',
      videoUrl: '',
      apiExerciseId: '',
      bodyPart: '',
      loadStatus: 'error',
      error: errorMessage,
    };
  }
}

/**
 * 带超时的搜索
 *
 * @param mapping - 运动映射信息
 * @param timeout - 超时时间（毫秒）
 * @returns API 运动数据或 null
 */
async function searchWithTimeout(
  mapping: ReturnType<typeof getExerciseMapping>,
  timeout: number
): Promise<AscendExercise | null> {
  if (!mapping) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    let result: AscendExercise | null = null;

    // 根据匹配策略搜索
    if (mapping.matchStrategy === 'exact') {
      // 精确匹配
      const exercises = await searchExerciseByName(mapping.ourExerciseName);
      result = exercises[0] || null;
    } else if (mapping.matchStrategy === 'keyword') {
      // 关键词匹配（依次尝试）
      const keywords = mapping.searchKeywords || [mapping.ourExerciseName];

      for (const keyword of keywords) {
        const exercises = await searchExerciseByName(keyword);
        if (exercises.length > 0) {
          result = exercises[0];
          break;
        }
      }
    }

    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('API 请求超时');
    }
    throw error;
  }
}

/**
 * 批量加载运动演示（用于预加载）
 *
 * @param exerciseIds - 运动 ID 列表
 * @returns 加载结果映射
 */
export async function loadExerciseDemosBatch(
  exerciseIds: string[]
): Promise<Map<string, ExerciseDemo>> {
  const results = new Map<string, ExerciseDemo>();

  console.log(`🔄 批量加载 ${exerciseIds.length} 个运动演示...`);

  for (const exerciseId of exerciseIds) {
    const demo = await loadExerciseDemo(exerciseId);
    results.set(exerciseId, demo);

    // 添加延迟，避免 API 限流
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  const loadedCount = Array.from(results.values()).filter(
    (d) => d.loadStatus === 'loaded'
  ).length;
  const errorCount = Array.from(results.values()).filter(
    (d) => d.loadStatus === 'error'
  ).length;

  console.log(
    `✅ 批量加载完成: 成功 ${loadedCount}, 失败 ${errorCount}, 总计 ${exerciseIds.length}`
  );

  return results;
}

/**
 * 检查 API 是否已配置
 */
export function checkAPIConfiguration(): boolean {
  return isExerciseDBConfigured();
}
