/**
 * ExerciseDB API 客户端（使用 AscendAPI 版本）
 *
 * 从 AscendAPI 的 ExerciseDB 获取运动演示资源（图片和视频）
 *
 * API 文档：https://rapidapi.com/ascendapi-verticals-exercise-db-with-videos-and-images-by-ascendapi
 * 特点：包含图片和视频 URL
 */

/**
 * AscendAPI ExerciseDB 返回的运动数据结构
 */
export interface AscendExercise {
  exerciseId: string;
  name: string;
  imageUrl: string;
  imageUrls?: {
    '360p'?: string;
    '480p'?: string;
    '720p'?: string;
    '1080p'?: string;
  };
  videoUrl?: string;
  equipments: string[];
  bodyParts: string[];
  exerciseType: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  keywords?: string[];
  overview?: string;
  instructions?: string[];
  exerciseTips?: string[];
  variations?: string[];
  relatedExerciseIds?: string[];
}

/**
 * API 响应结构
 */
export interface AscendAPIResponse {
  success: boolean;
  data?: AscendExercise[];
  message?: string;
}

/**
 * 单个运动详情响应
 */
export interface AscendExerciseDetailResponse {
  success: boolean;
  data?: AscendExercise;
}

/**
 * 缓存的运动演示数据
 */
export interface CachedExerciseDemo {
  exerciseId: string;
  imageUrl: string;
  videoUrl?: string;
  apiExerciseId: string;
  name: string;
  bodyPart: string;
  instructions: string[];
  tips?: string[];
  cachedAt: string;
}

/**
 * API 配置
 */
const API_CONFIG = {
  // AscendAPI 端点
  baseUrl: 'https://exercise-db-with-videos-and-images-by-ascendapi.p.rapidapi.com',

  // 请求超时时间
  timeout: 10000,

  // 缓存过期时间（7天）
  cacheExpiration: 7 * 24 * 60 * 60 * 1000,
};

/**
 * 从环境变量或 LocalStorage 获取 API Key
 */
function getAPIKey(): string | null {
  // 优先从环境变量读取
  if (import.meta.env.VITE_RAPIDAPI_KEY) {
    return import.meta.env.VITE_RAPIDAPI_KEY;
  }

  // 从 LocalStorage 读取用户配置的 API Key
  const customKey = localStorage.getItem('rapidapi_key');
  if (customKey) {
    return customKey;
  }

  return null;
}

/**
 * 调用 AscendAPI ExerciseDB
 *
 * @param endpoint - API 端点路径
 * @param params - 查询参数
 * @returns API 响应数据
 */
async function callAscendAPI<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  const apiKey = getAPIKey();

  if (!apiKey) {
    throw new Error('RapidAPI Key 未配置。请在 .env 文件中设置 VITE_RAPIDAPI_KEY');
  }

  const url = new URL(`${API_CONFIG.baseUrl}${endpoint}`);

  // 添加查询参数
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'exercise-db-with-videos-and-images-by-ascendapi.p.rapidapi.com',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API 请求失败：${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('API 请求超时');
      }
      throw error;
    }

    throw new Error('未知错误');
  }
}

/**
 * 根据运动名称搜索演示资源
 *
 * @param name - 运动名称（英文）
 * @returns 匹配的运动数据
 */
export async function searchExerciseByName(name: string): Promise<AscendExercise[]> {
  try {
    const result = await callAscendAPI<AscendAPIResponse>('/api/v1/exercises/search', {
      search: name,
    });

    if (result.success && result.data) {
      return result.data;
    }

    return [];
  } catch (error) {
    console.error(`搜索运动 "${name}" 失败:`, error);
    return [];
  }
}

/**
 * 根据运动 ID 获取详细信息
 *
 * @param exerciseId - 运动 ID
 * @returns 运动详细信息
 */
export async function getExerciseById(exerciseId: string): Promise<AscendExercise | null> {
  try {
    const result = await callAscendAPI<AscendExerciseDetailResponse>(`/api/v1/exercises/${exerciseId}`);

    if (result.success && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error(`获取运动详情 "${exerciseId}" 失败:`, error);
    return null;
  }
}

/**
 * 设置自定义 API Key
 *
 * @param apiKey - RapidAPI Key
 */
export function setExerciseDBAPIKey(apiKey: string): void {
  localStorage.setItem('rapidapi_key', apiKey);
}

/**
 * 清除保存的 API Key
 */
export function clearExerciseDBAPIKey(): void {
  localStorage.removeItem('rapidapi_key');
}

/**
 * 检查 API Key 是否已配置
 */
export function isExerciseDBConfigured(): boolean {
  return getAPIKey() !== null;
}
