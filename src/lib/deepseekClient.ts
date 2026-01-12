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

  // 在开发环境中使用代理避免 CORS 问题
  const isDevelopment = import.meta.env.DEV;
  const PROXY_URL = '/api/deepseek';

  return {
    API_KEY,
    BASE_URL: isDevelopment ? PROXY_URL : BASE_URL,
    isDevelopment
  };
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
    stream?: boolean;
  }
): Promise<APICallResult> {
  const { API_KEY, BASE_URL, isDevelopment } = getAPIConfig();

  // 详细的环境检查
  console.log('[DeepSeek API] 环境检查:');
  console.log('  - API_KEY:', API_KEY ? `已配置 (${API_KEY.substring(0, 10)}...)` : '未配置');
  console.log('  - BASE_URL:', BASE_URL);
  console.log('  - Model:', model);
  console.log('  - 开发模式:', isDevelopment);

  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('DeepSeek API Key 未配置，请在 .env 文件中设置 VITE_DEEPSEEK_API_KEY');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000); // 增加到120秒超时

  const startTime = Date.now();
  const url = `${BASE_URL}/v1/chat/completions`;

  const requestBody = {
    model,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.max_tokens ?? 8000,
    stream: options?.stream ?? false,
  };

  console.log('[DeepSeek API] 发起请求:');
  console.log('  - URL:', url);
  console.log('  - Messages 数量:', messages.length);
  console.log('  - 总字符数:', JSON.stringify(messages).length);

  try {
    // 在开发环境中，代理会添加 Authorization header
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // 在生产环境中，直接添加 Authorization header
    if (!isDevelopment) {
      headers['Authorization'] = `Bearer ${API_KEY}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    const duration = Date.now() - startTime;
    console.log(`[DeepSeek API] 响应收到 (耗时: ${duration}ms, 状态: ${response.status})`);

    if (!response.ok) {
      let errorMessage = response.statusText;
      let errorDetails = '';

      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
        errorDetails = JSON.stringify(errorData, null, 2);
        console.error('[DeepSeek API] 错误详情:', errorDetails);
      } catch (e) {
        console.error('[DeepSeek API] 无法解析错误响应');
      }

      throw new Error(
        `DeepSeek API 错误 (${response.status}): ${errorMessage}`
      );
    }

    const data: DeepSeekResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      console.error('[DeepSeek API] 响应数据:', JSON.stringify(data, null, 2));
      throw new Error('DeepSeek API 返回了空响应');
    }

    const choice = data.choices[0];
    console.log('[DeepSeek API] 成功接收响应:');
    console.log('  - 内容长度:', choice.message.content.length);
    console.log('  - 推理内容:', choice.message.reasoning_content ? '有' : '无');
    console.log('  - Token 使用:', data.usage);

    return {
      content: choice.message.content,
      reasoning: choice.message.reasoning_content, // reasoner 模型独有
      usage: data.usage,
      model: data.model,
      duration,
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[DeepSeek API] 请求失败 (耗时: ${duration}ms)`);
    console.error('  - 错误类型:', error.name);
    console.error('  - 错误消息:', error.message);
    console.error('  - 完整错误:', error);

    if (error.name === 'AbortError') {
      throw new Error('DeepSeek API 请求超时（120秒）- 请检查网络连接或稍后重试');
    }

    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('网络连接失败 - 请检查网络连接或代理设置');
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
