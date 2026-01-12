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
