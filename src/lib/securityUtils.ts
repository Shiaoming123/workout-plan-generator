/**
 * 安全工具函数
 * 用于防止 XSS 攻击和其他安全问题
 */

/**
 * 转义 HTML 特殊字符，防止 XSS 攻击
 *
 * @param input - 用户输入的字符串
 * @returns 转义后的安全字符串
 */
export function escapeHtml(input: string): string {
  if (!input) return '';

  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => htmlEscapes[char]);
}

/**
 * 验证字符串是否包含潜在的 XSS 攻击代码
 *
 * @param input - 待验证的字符串
 * @returns 如果检测到潜在攻击返回 true
 */
export function containsXSS(input: string): boolean {
  if (!input) return false;

  // 常见的 XSS 攻击模式
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // 事件处理器如 onclick=
    /<iframe/i,
    /<embed/i,
    /<object/i,
    /<link/i,
    /<meta/i,
    /<style/i,
    /@import/i,
    /expression\s*\(/i,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * 清理用户输入，移除潜在的恶意代码
 *
 * @param input - 用户输入的字符串
 * @returns 清理后的安全字符串
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  // 如果检测到 XSS，返回空字符串或转义后的字符串
  if (containsXSS(input)) {
    console.warn('⚠️  检测到潜在的 XSS 攻击，输入已被转义');
    return escapeHtml(input);
  }

  // 移除危险的控制字符
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * 验证 URL 是否安全
 *
 * @param url - 待验证的 URL
 * @returns 如果 URL 安全返回 true
 */
export function isSafeUrl(url: string): boolean {
  if (!url) return false;

  try {
    const parsed = new URL(url);

    // 只允许 http 和 https 协议
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }

    // 防止 javascript: 和 data: 等危险协议
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    if (dangerousProtocols.some((proto) => url.toLowerCase().startsWith(proto))) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
