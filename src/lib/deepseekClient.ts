import type {
  DeepSeekModel,
  DeepSeekMessage,
  DeepSeekResponse,
  APICallResult,
} from '../types/api';

/**
 * 获取 API 配置
 */
function getAPIConfig() {
  const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
  const BASE_URL = import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

  return { API_KEY, BASE_URL };
}

/**
 * 检查 API 是否已配置
 */
export function isAPIConfigured(): boolean {
  const { API_KEY } = getAPIConfig();
  return !!API_KEY && API_KEY !== 'your_api_key_here';
}

/**
 * 调用 DeepSeek API
 *
 * @param model - 模型类型 (deepseek-chat 或 deepseek-reasoner)
 * @param messages - 对话消息数组
 * @param options - 可选配置
 * @returns API 调用结果，包含内容、推理过程（如有）、使用情况和耗时
 * @throws 如果 API 调用失败或超时
 */
export async function callDeepSeek(
  model: DeepSeekModel,
  messages: DeepSeekMessage[],
  options?: {
    temperature?: number;
    max_tokens?: number;
  }
): Promise<APICallResult> {
  const { API_KEY, BASE_URL } = getAPIConfig();

  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('DeepSeek API Key 未配置，请在 .env 文件中设置 VITE_DEEPSEEK_API_KEY');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60秒超时

  const startTime = Date.now();

  try {
    const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.max_tokens ?? 8000,
      }),
      signal: controller.signal,
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `DeepSeek API 错误 (${response.status}): ${
          errorData.error?.message || response.statusText
        }`
      );
    }

    const data: DeepSeekResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('DeepSeek API 返回了空响应');
    }

    const choice = data.choices[0];

    return {
      content: choice.message.content,
      reasoning: choice.message.reasoning_content, // reasoner 模型独有
      usage: data.usage,
      model: data.model,
      duration,
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('DeepSeek API 请求超时（60秒）');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * 解析 AI 响应内容，提取 JSON 数据
 *
 * 支持多种格式：
 * 1. 直接的 JSON 字符串
 * 2. 包含在 ```json ... ``` 代码块中的 JSON
 * 3. 混合文本中的第一个 JSON 对象
 *
 * @param content - AI 返回的文本内容
 * @returns 解析后的 JavaScript 对象
 * @throws 如果无法找到或解析有效的 JSON
 */
export function parseAIResponse(content: string): unknown {
  // 1. 尝试直接解析整个内容
  try {
    return JSON.parse(content);
  } catch {}

  // 2. 提取 ```json ... ``` 代码块
  const jsonBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/i);
  if (jsonBlockMatch) {
    try {
      return JSON.parse(jsonBlockMatch[1]);
    } catch (error) {
      throw new Error(`JSON 代码块解析失败: ${error}`);
    }
  }

  // 3. 提取第一个 { ... } 对象
  const objectMatch = content.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0]);
    } catch (error) {
      throw new Error(`JSON 对象解析失败: ${error}`);
    }
  }

  throw new Error('AI 响应中未找到有效的 JSON 数据');
}
