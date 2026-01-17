import type { CustomAPIConfig } from '../types/api';

const STORAGE_KEY = 'workout_generator_api_config';

/**
 * API 密钥验证结果
 */
export interface APIKeyValidation {
  valid: boolean;
  error?: string;
}

/**
 * 验证 API 密钥强度
 */
export function validateAPIKey(apiKey: string): APIKeyValidation {
  if (!apiKey || apiKey.trim() === '') {
    return { valid: false, error: 'API Key 不能为空' };
  }

  const trimmedKey = apiKey.trim();

  // 检查格式（大多数 API 密钥以 sk- 开头）
  if (trimmedKey.length < 20) {
    return { valid: false, error: 'API Key 长度不足（至少需要 20 个字符）' };
  }

  if (trimmedKey.length > 200) {
    return { valid: false, error: 'API Key 长度过长' };
  }

  // 检查是否包含非法字符
  const validKeyPattern = /^[a-zA-Z0-9._-]+$/;
  if (!validKeyPattern.test(trimmedKey)) {
    return { valid: false, error: 'API Key 包含非法字符' };
  }

  return { valid: true };
}

/**
 * 验证 Base URL
 */
export function validateBaseUrl(baseUrl: string): APIKeyValidation {
  if (!baseUrl || baseUrl.trim() === '') {
    return { valid: false, error: 'Base URL 不能为空' };
  }

  const trimmedUrl = baseUrl.trim();

  try {
    const url = new URL(trimmedUrl);

    // 只支持 HTTP/HTTPS 协议
    if (!['http:', 'https:'].includes(url.protocol)) {
      return { valid: false, error: '只支持 HTTP/HTTPS 协议' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: '无效的 URL 格式' };
  }
}

/**
 * 验证完整的 API 配置
 */
export function validateAPIConfig(config: CustomAPIConfig): APIKeyValidation {
  if (!config.enabled) {
    return { valid: true }; // 未启用时不需要验证
  }

  // 验证 API Key
  if (config.enabled && !config.apiKey) {
    return { valid: false, error: '启用自定义配置后必须提供 API Key' };
  }

  const keyValidation = validateAPIKey(config.apiKey);
  if (!keyValidation.valid) {
    return keyValidation;
  }

  // 验证 Base URL
  const urlValidation = validateBaseUrl(config.baseUrl);
  if (!urlValidation.valid) {
    return urlValidation;
  }

  return { valid: true };
}

/**
 * 保存 API 配置到 SessionStorage（浏览器关闭后自动清除，更安全）
 */
export function saveAPIConfig(config: CustomAPIConfig): boolean {
  // 先验证配置
  const validation = validateAPIConfig(config);
  if (!validation.valid) {
    console.error('API 配置验证失败:', validation.error);
    return false;
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('保存 API 配置失败:', error);

    // 检查是否是配额超限错误
    if (error instanceof DOMException) {
      if (error.name === 'QuotaExceededError') {
        console.error('SessionStorage 配额已满，请清理浏览器数据');
      }
    }

    return false;
  }
}

/**
 * 从 SessionStorage 加载 API 配置
 */
export function loadAPIConfig(): CustomAPIConfig | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
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
  sessionStorage.removeItem(STORAGE_KEY);
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
