import type { UserProfile, TrainingPlan } from '../types';
import { callDeepSeek, callDeepSeekStreaming, parseAIResponse, isAPIConfigured } from './deepseekClient';
import { buildSystemPrompt, buildUserPrompt, buildSingleWeekUserPrompt } from './promptTemplates';
import {
  validateTrainingPlan,
  enrichPlanWithMetadata,
  checkPlanCompleteness,
} from './validators';
import { generateRuleBasedPlan } from './planGenerator';

/**
 * 使用 AI 生成训练计划（流式版本）
 *
 * @param profile - 用户资料
 * @param onStreamUpdate - 流式更新回调函数，用于实时显示生成内容
 * @returns 完整的训练计划（包含元数据）
 */
export async function generateAIPlanStreaming(
  profile: UserProfile,
  onStreamUpdate: (content: string, reasoning: string) => void
): Promise<TrainingPlan> {
  // 检查 API 配置
  if (!isAPIConfigured(profile.customAPI)) {
    console.warn('API 未配置，降级到规则引擎');
    return generateRuleBasedPlan(profile, {
      method: 'rule-based',
      fallbackReason: 'API Key 未配置',
      generatedAt: new Date().toISOString(),
    });
  }

  // 判断是否需要分批生成（月计划或季度计划）
  if (profile.period === 'month' || profile.period === 'quarter') {
    console.log('📋 检测到长周期计划，使用按周分批生成策略');
    return generatePlanByWeek(profile, onStreamUpdate);
  }

  try {
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(profile);

    console.log('🤖 开始调用 LLM API（流式模式）...');
    console.log('模型:', profile.aiModel);

    let streamedContent = '';
    let streamedReasoning = '';

    // 调用流式 API
    const result = await callDeepSeekStreaming(
      profile.aiModel,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      undefined,
      profile.customAPI,
      (delta: string, isReasoning: boolean) => {
        // 实时更新回调
        if (isReasoning) {
          streamedReasoning += delta;
        } else {
          streamedContent += delta;
        }
        onStreamUpdate(streamedContent, streamedReasoning);
      }
    );

    console.log('✅ 流式 API 调用成功');
    console.log('耗时:', result.duration, 'ms');
    console.log('Token 使用:', result.usage.total_tokens);

    // 解析响应
    console.log('📝 开始解析 AI 响应...');
    console.log('原始内容长度:', result.content.length);
    const parsed = parseAIResponse(result.content) as any;
    console.log('✅ 解析成功，数据结构:', {
      period: parsed.period,
      hasWeeks: !!parsed.weeks,
      weeksLength: parsed.weeks?.length,
      hasMonths: !!parsed.months,
      monthsLength: parsed.months?.length,
      hasSummary: !!parsed.summary,
    });

    // 验证结构
    if (!validateTrainingPlan(parsed)) {
      console.error('❌ AI 响应结构验证失败，降级到规则引擎');
      console.error('验证失败的数据:', JSON.stringify(parsed, null, 2));
      return generateRuleBasedPlan(profile, {
        method: 'rule-based',
        fallbackReason: 'AI 响应结构验证失败',
        generatedAt: new Date().toISOString(),
      });
    }

    // 完整性检查
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

    console.log('🎉 AI 计划生成成功（流式）！');
    return plan;
  } catch (error: any) {
    console.error('❌ AI 生成失败:', error.message);
    console.warn('⚙️  自动降级到规则引擎');

    return generateRuleBasedPlan(profile, {
      method: 'rule-based',
      fallbackReason: `AI 失败: ${error.message}`,
      generatedAt: new Date().toISOString(),
    });
  }
}

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
    console.log('📝 开始解析 AI 响应...');
    console.log('原始内容长度:', result.content.length);
    const parsed = parseAIResponse(result.content) as any;
    console.log('✅ 解析成功，数据结构:', {
      period: parsed.period,
      hasWeeks: !!parsed.weeks,
      weeksLength: parsed.weeks?.length,
      hasMonths: !!parsed.months,
      monthsLength: parsed.months?.length,
      hasSummary: !!parsed.summary,
    });

    // 验证结构
    if (!validateTrainingPlan(parsed)) {
      console.error('❌ AI 响应结构验证失败，降级到规则引擎');
      console.error('验证失败的数据:', JSON.stringify(parsed, null, 2));
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

/**
 * 生成单周计划（用于分批生成）
 */
async function generateSingleWeekPlan(
  profile: UserProfile,
  weekNumber: number,
  totalWeeks: number,
  previousWeekSummary?: string,
  onStreamUpdate?: (content: string, reasoning: string) => void
): Promise<any> {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildSingleWeekUserPrompt(
    profile,
    weekNumber,
    totalWeeks,
    previousWeekSummary
  );

  console.log(`🤖 开始生成第 ${weekNumber}/${totalWeeks} 周...`);

  let streamedContent = '';
  let streamedReasoning = '';

  const result = await callDeepSeekStreaming(
    profile.aiModel,
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    undefined,
    profile.customAPI,
    (delta: string, isReasoning: boolean) => {
      if (isReasoning) {
        streamedReasoning += delta;
      } else {
        streamedContent += delta;
      }
      if (onStreamUpdate) {
        onStreamUpdate(streamedContent, streamedReasoning);
      }
    }
  );

  console.log(`✅ 第 ${weekNumber} 周生成成功`);
  const parsed = parseAIResponse(result.content);
  return parsed;
}

/**
 * 按周分批生成完整计划（月计划或季度计划）
 */
export async function generatePlanByWeek(
  profile: UserProfile,
  onStreamUpdate: (content: string, reasoning: string) => void,
  onProgressUpdate?: (current: number, total: number) => void
): Promise<TrainingPlan> {
  const totalWeeks = profile.period === 'month' ? 4 : 12;
  const weeks: any[] = [];

  console.log(`📋 开始按周分批生成 ${totalWeeks} 周计划...`);

  try {
    for (let weekNum = 1; weekNum <= totalWeeks; weekNum++) {
      // 更新进度
      if (onProgressUpdate) {
        onProgressUpdate(weekNum, totalWeeks);
      }

      // 生成单周计划
      const weekPlan = await generateSingleWeekPlan(
        profile,
        weekNum,
        totalWeeks,
        undefined,
        onStreamUpdate
      );

      weeks.push(weekPlan);
      console.log(`✅ 已完成 ${weekNum}/${totalWeeks} 周`);
    }

    // 组装完整计划
    const plan = assemblePlan(profile, weeks);
    console.log('🎉 按周分批生成完成！');
    return plan;
  } catch (error: any) {
    console.error('❌ 按周生成失败:', error.message);
    console.warn('⚙️  降级到规则引擎');
    return generateRuleBasedPlan(profile, {
      method: 'rule-based',
      fallbackReason: `按周生成失败: ${error.message}`,
      generatedAt: new Date().toISOString(),
    });
  }
}

/**
 * 组装完整计划（从多个周计划）
 */
function assemblePlan(profile: UserProfile, weeks: any[]): TrainingPlan {
  const period = profile.period === 'month' ? 'month' : 'quarter';

  // 创建计划摘要
  const summary = {
    goal: profile.goal,
    goalZh: getGoalLabel(profile.goal),
    daysPerWeek: profile.daysPerWeek,
    sessionMinutes: profile.sessionMinutes,
    totalWeeks: weeks.length,
    phaseDescription: `${weeks.length}周渐进式训练计划`,
    safetyNotes: profile.constraints.length > 0
      ? `已根据身体限制调整训练内容`
      : undefined,
  };

  // 根据周期类型组装
  if (period === 'month') {
    return enrichPlanWithMetadata(
      {
        period: 'month',
        summary,
        generatedAt: new Date().toISOString(),
        months: [
          {
            monthNumber: 1,
            monthName: '第1月',
            weeks,
          },
        ],
      },
      {
        method: 'ai',
        model: profile.aiModel,
        generatedAt: new Date().toISOString(),
      }
    );
  } else {
    // 季度计划：分成3个月
    return enrichPlanWithMetadata(
      {
        period: 'quarter',
        summary,
        generatedAt: new Date().toISOString(),
        months: [
          {
            monthNumber: 1,
            monthName: '第1月 - 适应期',
            weeks: weeks.slice(0, 4),
          },
          {
            monthNumber: 2,
            monthName: '第2月 - 积累期',
            weeks: weeks.slice(4, 8),
          },
          {
            monthNumber: 3,
            monthName: '第3月 - 强化期',
            weeks: weeks.slice(8, 12),
          },
        ],
      },
      {
        method: 'ai',
        model: profile.aiModel,
        generatedAt: new Date().toISOString(),
      }
    );
  }
}

/**
 * 获取目标标签
 */
function getGoalLabel(goal: string): string {
  const labels: Record<string, string> = {
    fat_loss: '减脂',
    muscle_gain: '增肌',
    fitness: '综合体能',
    strength: '力量提升',
    endurance: '耐力提升',
    rehabilitation: '康复训练',
  };
  return labels[goal] || goal;
}
