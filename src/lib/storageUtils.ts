import type { CustomAPIConfig } from '../types/api';

const STORAGE_KEY = 'workout_generator_api_config';

/**
 * 保存 API 配置到 LocalStorage
 */
export function saveAPIConfig(config: CustomAPIConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save API config:', error);
  }
}

/**
 * 从 LocalStorage 加载 API 配置
 */
export function loadAPIConfig(): CustomAPIConfig | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load API config:', error);
    return null;
  }
}

/**
 * 清除保存的 API 配置
 */
export function clearAPIConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 获取默认 API 配置
 */
export function getDefaultAPIConfig(): CustomAPIConfig {
  return {
    enabled: false,
    baseUrl: 'https://api.openai.com',
    apiKey: '',
    model: 'gpt-4',
    provider: 'openai',
  };
}
