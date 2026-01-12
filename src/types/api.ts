/**
 * DeepSeek API 类型定义
 */

export type DeepSeekModel = 'deepseek-chat' | 'deepseek-reasoner';

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
      reasoning_content?: string; // reasoner 模型独有
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface DeepSeekError {
  error: {
    message: string;
    type: string;
    code: string;
  };
}

export interface APIConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number; // milliseconds
}

export interface APICallResult {
  content: string;
  reasoning?: string; // reasoner 模型的思考过程
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  duration: number; // API 调用耗时 (ms)
}

// ✅ 新增：通用 API 配置类型
export interface CustomAPIConfig {
  enabled: boolean;           // 是否使用自定义配置
  baseUrl: string;            // API 基础 URL
  apiKey: string;             // API Key
  model: string;              // 模型名称（任意字符串）
  provider: 'openai' | 'azure' | 'deepseek' | 'other'; // 提供商
}

// ✅ 新增：统一的 API 配置（环境变量 or 自定义）
export interface ResolvedAPIConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  source: 'env' | 'custom';   // 配置来源
}

// ✅ 新增：扩展消息类型别名
export type ChatMessage = DeepSeekMessage;

// ✅ 新增：通用 API 响应类型别名（OpenAI 兼容格式）
export type ChatCompletionResponse = DeepSeekResponse;
