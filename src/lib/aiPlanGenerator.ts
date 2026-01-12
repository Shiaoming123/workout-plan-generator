import type { UserProfile, TrainingPlan } from '../types';
import { callDeepSeek, parseAIResponse, isAPIConfigured } from './deepseekClient';
import { buildSystemPrompt, buildUserPrompt } from './promptTemplates';
import {
  validateTrainingPlan,
  enrichPlanWithMetadata,
  checkPlanCompleteness,
} from './validators';
import { generateRuleBasedPlan } from './planGenerator';

/**
 * 使用 AI 生成训练计划（主入口）
 *
 * 工作流程：
 * 1. 检查 API 配置
 * 2. 构建 System + User Prompt
 * 3. 调用 DeepSeek API
 * 4. 解析和验证响应
 * 5. 成功返回 AI 计划，失败自动降级到规则引擎
 *
 * @param profile - 用户资料
 * @returns 完整的训练计划（包含元数据）
 */
export async function generateAIPlan(profile: UserProfile): Promise<TrainingPlan> {
  // 检查 API 配置（优先检查自定义配置）
  if (!isAPIConfigured(profile.customAPI)) {
    console.warn('API 未配置，降级到规则引擎');
    return generateRuleBasedPlan(profile, {
      method: 'rule-based',
      fallbackReason: 'API Key 未配置',
      generatedAt: new Date().toISOString(),
    });
  }

  try {
    // 构建 Prompt
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(profile);

    console.log('🤖 开始调用 LLM API...');
    console.log('模型:', profile.aiModel);

    // 调用 API（支持自定义配置）
    const result = await callDeepSeek(
      profile.aiModel,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      undefined,
      profile.customAPI // ✅ 传递自定义配置
    );

    console.log('✅ API 调用成功');
    console.log('耗时:', result.duration, 'ms');
    console.log('Token 使用:', result.usage.total_tokens);
    if (result.reasoning) {
      console.log('🧠 Reasoning 长度:', result.reasoning.length, '字符');
    }

    // 解析响应
    const parsed = parseAIResponse(result.content);

    // 验证结构
    if (!validateTrainingPlan(parsed)) {
      console.error('❌ AI 响应结构验证失败，降级到规则引擎');
      return generateRuleBasedPlan(profile, {
        method: 'rule-based',
        fallbackReason: 'AI 响应结构验证失败',
        generatedAt: new Date().toISOString(),
      });
    }

    // 完整性检查（宽松，仅警告）
    const completenessCheck = checkPlanCompleteness(parsed);
    if (!completenessCheck.isComplete) {
      console.warn('⚠️  计划完整性警告:', completenessCheck.warnings);
    }

    // 添加元数据
    const plan = enrichPlanWithMetadata(parsed, {
      method: 'ai',
      model: profile.aiModel,
      reasoningProcess: result.reasoning,
      generatedAt: new Date().toISOString(),
      apiCallDuration: result.duration,
    });

    console.log('🎉 AI 计划生成成功！');
    return plan;
  } catch (error: any) {
    console.error('❌ AI 生成失败:', error.message);
    console.warn('⚙️  自动降级到规则引擎');

    // 降级到规则引擎
    return generateRuleBasedPlan(profile, {
      method: 'rule-based',
      fallbackReason: `AI 失败: ${error.message}`,
      generatedAt: new Date().toISOString(),
    });
  }
}
