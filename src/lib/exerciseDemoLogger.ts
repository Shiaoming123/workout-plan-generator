/**
 * 运动演示请求日志系统
 *
 * 用于记录每次动作演示 API 请求的详细信息
 * 方便后续优化映射配置
 */

import type { AscendExercise } from './exerciseDBClient';

/**
 * 单次演示请求日志
 */
export interface DemoRequestLog {
  /** 请求时间戳 */
  timestamp: string;

  /** 卡片信息（来自我们系统） */
  cardInfo: {
    exerciseId: string;
    exerciseName: string;
    exerciseNameZh: string;
  };

  /** API 搜索信息 */
  searchInfo: {
    searchTerms: string[];  // 使用的搜索关键词
    found: boolean;          // 是否找到结果
    resultCount?: number;    // 搜索结果数量
  };

  /** API 返回的匹配动作（如果找到） */
  matchedExercise?: {
    apiExerciseId: string;
    name: string;
    imageUrl: string;
    hasVideo: boolean;
    bodyParts: string[];
    targetMuscles: string[];
    equipments: string[];
  };

  /** 匹配质量评估 */
  matchQuality: {
    nameExactMatch: boolean;      // 名称是否完全匹配
    namePartialMatch: boolean;    // 名称是否部分匹配
    confidence: 'high' | 'medium' | 'low';  // 匹配置信度
  };

  /** 错误信息（如果有） */
  error?: string;
}

const LOG_KEY = 'exercise_demo_requests_log';
const MAX_LOG_ENTRIES = 500; // 最多保存 500 条日志

/**
 * 获取所有日志
 */
export function getDemoLogs(): DemoRequestLog[] {
  try {
    const logsJson = localStorage.getItem(LOG_KEY);
    return logsJson ? JSON.parse(logsJson) : [];
  } catch {
    return [];
  }
}

/**
 * 清空所有日志
 */
export function clearDemoLogs(): void {
  localStorage.removeItem(LOG_KEY);
  console.log('🗑️ 已清空演示请求日志');
}

/**
 * 导出日志为 JSON 文件
 */
export function exportDemoLogs(): void {
  const logs = getDemoLogs();

  if (logs.length === 0) {
    console.warn('⚠️ 没有日志可导出');
    return;
  }

  const dataStr = JSON.stringify(logs, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `exercise-demo-logs-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  console.log(`✅ 已导出 ${logs.length} 条日志`);
}

/**
 * 记录一次演示请求
 */
export function logDemoRequest(
  exerciseId: string,
  exerciseName: string,
  exerciseNameZh: string,
  searchTerms: string[],
  apiExercise: AscendExercise | null,
  error?: string
): void {
  const logs = getDemoLogs();

  // 评估匹配质量
  const nameExactMatch = apiExercise
    ? apiExercise.name.toLowerCase() === exerciseName.toLowerCase()
    : false;

  const namePartialMatch = apiExercise
    ? exerciseName.toLowerCase().includes(apiExercise.name.toLowerCase()) ||
      apiExercise.name.toLowerCase().includes(exerciseName.toLowerCase())
    : false;

  let confidence: 'high' | 'medium' | 'low' = 'low';
  if (nameExactMatch) {
    confidence = 'high';
  } else if (namePartialMatch) {
    confidence = 'medium';
  }

  const logEntry: DemoRequestLog = {
    timestamp: new Date().toISOString(),
    cardInfo: {
      exerciseId,
      exerciseName,
      exerciseNameZh,
    },
    searchInfo: {
      searchTerms,
      found: !!apiExercise,
    },
    matchQuality: {
      nameExactMatch,
      namePartialMatch,
      confidence,
    },
  };

  if (apiExercise) {
    logEntry.matchedExercise = {
      apiExerciseId: apiExercise.exerciseId,
      name: apiExercise.name,
      imageUrl: apiExercise.imageUrl,
      hasVideo: !!apiExercise.videoUrl,
      bodyParts: apiExercise.bodyParts || [],
      targetMuscles: apiExercise.targetMuscles || [],
      equipments: apiExercise.equipments || [],
    };
  }

  if (error) {
    logEntry.error = error;
  }

  logs.push(logEntry);

  // 限制日志数量，移除最旧的
  if (logs.length > MAX_LOG_ENTRIES) {
    logs.splice(0, logs.length - MAX_LOG_ENTRIES);
  }

  localStorage.setItem(LOG_KEY, JSON.stringify(logs));

  // 在控制台输出简要信息
  const status = apiExercise ? '✅' : '❌';
  const matchInfo = apiExercise
    ? `${apiExercise.name} (${logEntry.matchQuality.confidence})`
    : '未找到';
  console.log(
    `${status} [${exerciseId}] ${exerciseNameZh} → ${matchInfo}`
  );
}

/**
 * 获取日志统计信息
 */
export function getDemoLogStats(): {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  highConfidenceMatches: number;
  lowConfidenceMatches: number;
  uniqueExercises: number;
} {
  const logs = getDemoLogs();

  return {
    totalRequests: logs.length,
    successfulRequests: logs.filter((l) => l.searchInfo.found).length,
    failedRequests: logs.filter((l) => !l.searchInfo.found).length,
    highConfidenceMatches: logs.filter(
      (l) => l.matchQuality.confidence === 'high'
    ).length,
    lowConfidenceMatches: logs.filter(
      (l) => l.matchQuality.confidence === 'low'
    ).length,
    uniqueExercises: new Set(logs.map((l) => l.cardInfo.exerciseId)).size,
  };
}

/**
 * 打印日志统计到控制台
 */
export function printDemoLogStats(): void {
  const stats = getDemoLogStats();

  console.log(`
📊 运动演示请求统计
━━━━━━━━━━━━━━━━━━━━━━
总请求数: ${stats.totalRequests}
成功: ${stats.successfulRequests} | 失败: ${stats.failedRequests}
高置信度匹配: ${stats.highConfidenceMatches}
低置信度匹配: ${stats.lowConfidenceMatches}
唯一动作数: ${stats.uniqueExercises}
━━━━━━━━━━━━━━━━━━━━━━
💡 提示: 使用 exportDemoLogs() 导出完整日志
  `);
}

/**
 * 在控制台显示最近的不匹配日志
 */
export function printMismatchedLogs(limit: number = 10): void {
  const logs = getDemoLogs();
  const mismatched = logs.filter(
    (l) => !l.matchQuality.nameExactMatch && l.searchInfo.found
  );

  console.log(
    `⚠️ 找到 ${mismatched.length} 条名称不匹配的日志（显示最近 ${limit} 条）：`
  );

  mismatched
    .slice(-limit)
    .reverse()
    .forEach((log) => {
      console.log(`
━━━━━━━━━━━━━━━━━━━━━━
卡片: ${log.cardInfo.exerciseNameZh} (${log.cardInfo.exerciseName})
API:  ${log.matchedExercise?.name} [${log.matchQuality.confidence}]
ID:   ${log.cardInfo.exerciseId}
━━━━━━━━━━━━━━━━━━━━━━`);
    });
}
