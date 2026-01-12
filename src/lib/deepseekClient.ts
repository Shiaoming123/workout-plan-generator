import type {
  DeepSeekModel,
  DeepSeekMessage,
  DeepSeekResponse,
  APICallResult,
  CustomAPIConfig,
  ResolvedAPIConfig,
} from '../types/api';

/**
 * 解析 API 配置（优先使用自定义配置）
 */
function resolveAPIConfig(customConfig?: CustomAPIConfig): ResolvedAPIConfig {
  // 1. 优先使用自定义配置
  if (customConfig?.enabled && customConfig.apiKey) {
    console.log('[API Config] 使用自定义配置');
    return {
      baseUrl: customConfig.baseUrl,
      apiKey: customConfig.apiKey,
      model: customConfig.model,
      source: 'custom',
    };
  }

  // 2. 回退到环境变量
  const envApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  const envBaseUrl = import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

  if (!envApiKey || envApiKey === 'your_api_key_here') {
    throw new Error('未配置 API Key - 请使用自定义配置或设置环境变量');
  }

  console.log('[API Config] 使用环境变量配置');
  return {
    baseUrl: envBaseUrl,
    apiKey: envApiKey,
    model: 'deepseek-chat', // 默认模型
    source: 'env',
  };
}

/**
 * 获取 API 配置（保留用于向后兼容）
 */
function getAPIConfig() {
  const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
  const BASE_URL = import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

  return {
    API_KEY,
    BASE_URL,
  };
}

/**
 * 检查 API 是否已配置
 */
export function isAPIConfigured(customConfig?: CustomAPIConfig): boolean {
  try {
    resolveAPIConfig(customConfig);
    return true;
  } catch {
    return false;
  }
}

/**
 * 调用 LLM API（OpenAI 兼容格式）
 *
 * @param model - 模型类型 (deepseek-chat 或 deepseek-reasoner)
 * @param messages - 对话消息数组
 * @param options - 可选配置
 * @param customConfig - 用户自定义 API 配置（优先级最高）
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
  },
  customConfig?: CustomAPIConfig
): Promise<APICallResult> {
  const config = resolveAPIConfig(customConfig);
  const startTime = Date.now();

  // 如果使用自定义配置，使用自定义的模型名称
  const finalModel = config.source === 'custom' ? config.model : model;

  // 详细的环境检查
  console.log('[LLM API] 配置检查:');
  console.log('  - 配置来源:', config.source === 'custom' ? '用户自定义' : '环境变量');
  console.log('  - API_KEY:', config.apiKey ? `已配置 (${config.apiKey.substring(0, 10)}...)` : '未配置');
  console.log('  - BASE_URL:', config.baseUrl);
  console.log('  - Model:', finalModel);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 调整为60秒超时

  const url = `${config.baseUrl}/v1/chat/completions`;

  const requestBody = {
    model: finalModel,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.max_tokens ?? 8000,
    stream: options?.stream ?? false,
  };

  console.log('[LLM API] 发起请求:');
  console.log('  - URL:', url);
  console.log('  - Messages 数量:', messages.length);
  console.log('  - 总字符数:', JSON.stringify(messages).length);

  try {
    // 所有环境都添加 Authorization header
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    const duration = Date.now() - startTime;
    console.log(`[LLM API] 响应收到 (耗时: ${duration}ms, 状态: ${response.status})`);

    // 打印响应头信息用于调试
    console.log('[LLM API] 响应头:', {
      'content-type': response.headers.get('content-type'),
      'content-length': response.headers.get('content-length'),
      'transfer-encoding': response.headers.get('transfer-encoding'),
    });

    // 🔧 关键修复：收到响应头后立即清除超时，避免读取响应体时被 abort
    clearTimeout(timeout);

    if (!response.ok) {
      let errorMessage = response.statusText;
      let errorDetails = '';

      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
        errorDetails = JSON.stringify(errorData, null, 2);
        console.error('[LLM API] 错误详情:', errorDetails);
      } catch (e) {
        console.error('[LLM API] 无法解析错误响应');
      }

      throw new Error(
        `API 错误 (${response.status}): ${errorMessage}`
      );
    }

    console.log('[LLM API] 开始读取响应体...');
    const data: DeepSeekResponse = await response.json();
    console.log('[LLM API] 响应体读取完成');

    if (!data.choices || data.choices.length === 0) {
      console.error('[LLM API] 响应数据:', JSON.stringify(data, null, 2));
      throw new Error('API 返回了空响应');
    }

    const choice = data.choices[0];
    console.log('[LLM API] 成功接收响应:');
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
    console.error(`[LLM API] 请求失败 (耗时: ${duration}ms)`);
    console.error('  - 错误类型:', error.name);
    console.error('  - 错误消息:', error.message);
    console.error('  - 完整错误:', error);

    if (error.name === 'AbortError') {
      throw new Error('API 请求超时（60秒）- 请检查网络连接或更换模型');
    }

    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('网络连接失败 - 请检查 API Base URL 是否正确或尝试启用 CORS 代理');
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
