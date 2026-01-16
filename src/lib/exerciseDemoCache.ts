/**
 * 运动演示缓存管理
 *
 * 用于缓存从 ExerciseDB API 获取的运动演示资源（图片 URL、视频 URL 等）
 * 使用 LocalStorage 存储，支持过期时间管理
 */

import type { CachedExerciseDemo } from './exerciseDBClient';

const CACHE_KEY_PREFIX = 'exercise_demo_';
const CACHE_VERSION = 'v1';
const FULL_CACHE_KEY = `${CACHE_KEY_PREFIX}${CACHE_VERSION}`;
const CACHE_INDEX_KEY = `${FULL_CACHE_KEY}_index`;

/**
 * 缓存配置
 */
const CACHE_CONFIG = {
  // 默认缓存过期时间（7天）
  defaultExpiration: 7 * 24 * 60 * 60 * 1000,

  // 最大缓存数量
  maxCacheSize: 200,

  // 缓存清理阈值（当缓存达到此数量时，清理最旧的）
  cleanupThreshold: 180,
};

/**
 * 缓存索引结构
 */
interface CacheIndex {
  exerciseIds: string[];
  lastCleanup: string;
}

/**
 * 获取缓存的运动演示
 *
 * @param exerciseId - 运动 ID
 * @returns 缓存的演示数据，如果不存在或已过期则返回 null
 */
export function getCachedDemo(exerciseId: string): CachedExerciseDemo | null {
  try {
    const cacheKey = `${FULL_CACHE_KEY}_${exerciseId}`;
    const cached = localStorage.getItem(cacheKey);

    if (!cached) {
      return null;
    }

    const demo: CachedExerciseDemo = JSON.parse(cached);

    // 检查是否过期
    const cachedAt = new Date(demo.cachedAt).getTime();
    const now = Date.now();
    const age = now - cachedAt;

    if (age > CACHE_CONFIG.defaultExpiration) {
      // 过期，删除缓存
      removeCachedDemo(exerciseId);
      return null;
    }

    console.log(`✅ 从缓存加载运动演示: ${exerciseId}`);
    return demo;
  } catch (error) {
    console.error('读取缓存失败:', error);
    return null;
  }
}

/**
 * 保存运动演示到缓存
 *
 * @param demo - 演示数据
 */
export function saveCachedDemo(demo: CachedExerciseDemo): void {
  try {
    const cacheKey = `${FULL_CACHE_KEY}_${demo.exerciseId}`;
    const cacheData = {
      ...demo,
      cachedAt: new Date().toISOString(),
    };

    // 保存到 LocalStorage
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));

    // 更新索引
    updateCacheIndex(demo.exerciseId);

    // 检查是否需要清理
    const index = getCacheIndex();
    if (index.exerciseIds.length >= CACHE_CONFIG.cleanupThreshold) {
      cleanupOldCacheEntries();
    }

    console.log(`💾 已缓存运动演示: ${demo.exerciseId}`);
  } catch (error) {
    console.error('保存缓存失败:', error);

    // 检查是否是配额超限错误
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('⚠️  LocalStorage 配额已满，清理旧缓存...');
      cleanupOldCacheEntries();

      // 重试保存
      try {
        localStorage.setItem(`${FULL_CACHE_KEY}_${demo.exerciseId}`, JSON.stringify({
          ...demo,
          cachedAt: new Date().toISOString(),
        }));
        updateCacheIndex(demo.exerciseId);
      } catch (retryError) {
        console.error('重试保存缓存仍然失败:', retryError);
      }
    }
  }
}

/**
 * 删除指定的缓存
 *
 * @param exerciseId - 运动 ID
 */
export function removeCachedDemo(exerciseId: string): void {
  try {
    const cacheKey = `${FULL_CACHE_KEY}_${exerciseId}`;
    localStorage.removeItem(cacheKey);

    // 从索引中移除
    const index = getCacheIndex();
    index.exerciseIds = index.exerciseIds.filter((id) => id !== exerciseId);
    saveCacheIndex(index);

    console.log(`🗑️  已删除缓存: ${exerciseId}`);
  } catch (error) {
    console.error('删除缓存失败:', error);
  }
}

/**
 * 清空所有缓存
 */
export function clearAllCache(): void {
  try {
    const index = getCacheIndex();

    // 删除所有缓存项
    index.exerciseIds.forEach((exerciseId) => {
      const cacheKey = `${FULL_CACHE_KEY}_${exerciseId}`;
      localStorage.removeItem(cacheKey);
    });

    // 清空索引
    localStorage.removeItem(CACHE_INDEX_KEY);

    console.log('🗑️  已清空所有运动演示缓存');
  } catch (error) {
    console.error('清空缓存失败:', error);
  }
}

/**
 * 获取缓存索引
 */
function getCacheIndex(): CacheIndex {
  try {
    const indexData = localStorage.getItem(CACHE_INDEX_KEY);
    if (!indexData) {
      return { exerciseIds: [], lastCleanup: new Date().toISOString() };
    }
    return JSON.parse(indexData);
  } catch (error) {
    console.error('读取缓存索引失败:', error);
    return { exerciseIds: [], lastCleanup: new Date().toISOString() };
  }
}

/**
 * 保存缓存索引
 */
function saveCacheIndex(index: CacheIndex): void {
  try {
    localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
  } catch (error) {
    console.error('保存缓存索引失败:', error);
  }
}

/**
 * 更新缓存索引
 *
 * @param exerciseId - 新增的运动 ID
 */
function updateCacheIndex(exerciseId: string): void {
  const index = getCacheIndex();

  // 如果已存在，先移除（将移到末尾）
  index.exerciseIds = index.exerciseIds.filter((id) => id !== exerciseId);

  // 添加到末尾（最新的）
  index.exerciseIds.push(exerciseId);

  saveCacheIndex(index);
}

/**
 * 清理旧的缓存条目
 *
 * 删除最旧的缓存，直到缓存数量低于阈值
 */
function cleanupOldCacheEntries(): void {
  const index = getCacheIndex();
  const targetSize = CACHE_CONFIG.maxCacheSize * 0.8; // 清理到 80%

  if (index.exerciseIds.length <= targetSize) {
    return; // 无需清理
  }

  const toRemove = index.exerciseIds.length - Math.floor(targetSize);
  const removedIds: string[] = [];

  // 删除最旧的缓存
  for (let i = 0; i < toRemove; i++) {
    const exerciseId = index.exerciseIds[i];
    const cacheKey = `${FULL_CACHE_KEY}_${exerciseId}`;
    localStorage.removeItem(cacheKey);
    removedIds.push(exerciseId);
  }

  // 更新索引
  index.exerciseIds = index.exerciseIds.slice(toRemove);
  index.lastCleanup = new Date().toISOString();
  saveCacheIndex(index);

  console.log(`🧹 已清理 ${removedIds.length} 个旧缓存: ${removedIds.join(', ')}`);
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats(): {
  totalCached: number;
  oldestEntry: string | null;
  newestEntry: string | null;
  estimatedSize: string;
} {
  const index = getCacheIndex();
  const totalCached = index.exerciseIds.length;

  let oldestEntry: string | null = null;
  let newestEntry: string | null = null;
  let totalSize = 0;

  index.exerciseIds.forEach((exerciseId) => {
    const cacheKey = `${FULL_CACHE_KEY}_${exerciseId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      totalSize += cached.length;

      const demo: CachedExerciseDemo = JSON.parse(cached);
      const cachedAt = demo.cachedAt;

      if (!oldestEntry || cachedAt < oldestEntry) {
        oldestEntry = cachedAt;
      }
      if (!newestEntry || cachedAt > newestEntry) {
        newestEntry = cachedAt;
      }
    }
  });

  // 估算大小（字节）
  const estimatedSizeBytes = totalSize;
  const estimatedSizeKB = (estimatedSizeBytes / 1024).toFixed(2);
  const estimatedSizeMB = (estimatedSizeBytes / 1024 / 1024).toFixed(2);

  return {
    totalCached,
    oldestEntry,
    newestEntry,
    estimatedSize: estimatedSizeBytes > 1024 * 1024
      ? `${estimatedSizeMB} MB`
      : `${estimatedSizeKB} KB`,
  };
}

/**
 * 预加载运动演示（批量）
 *
 * @param exerciseIds - 运动 ID 列表
 * @param loadFn - 加载函数
 */
export async function preloadExerciseDemos(
  exerciseIds: string[],
  loadFn: (exerciseId: string) => Promise<CachedExerciseDemo | null>
): Promise<void> {
  console.log(`🔄 开始预加载 ${exerciseIds.length} 个运动演示...`);

  let loaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const exerciseId of exerciseIds) {
    // 检查是否已缓存
    const cached = getCachedDemo(exerciseId);
    if (cached) {
      skipped++;
      continue;
    }

    // 加载并缓存
    try {
      const demo = await loadFn(exerciseId);
      if (demo) {
        saveCachedDemo(demo);
        loaded++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`预加载 ${exerciseId} 失败:`, error);
      failed++;
    }

    // 添加延迟，避免 API 限流
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(
    `✅ 预加载完成: 已加载 ${loaded}, 跳过 ${skipped}, 失败 ${failed}`
  );
}
