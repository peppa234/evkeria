/**
 * Input sanitization utilities
 * Basic XSS protection - for production, use a library like DOMPurify
 */

/**
 * Sanitize HTML string to prevent XSS
 * @param input - HTML string to sanitize
 * @returns Sanitized HTML with special characters escaped
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize plain text (remove HTML tags)
 * @param input - Text string that may contain HTML
 * @returns Plain text with HTML tags removed
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim();
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 * @param url - URL string to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  const trimmed = url.trim().toLowerCase();
  
  // Block dangerous protocols
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:') ||
    trimmed.startsWith('onload=') ||
    trimmed.startsWith('onerror=')
  ) {
    return '';
  }
  
  // Only allow http, https, mailto, tel
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return url.trim();
  }
  
  return '';
}

/**
 * Strip markdown syntax from text and return plain text
 * @param markdown - Markdown string to strip
 * @returns Plain text without markdown syntax
 */
export function stripMarkdown(markdown: string): string {
  return markdown
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^---$/gm, '')
    // Clean up extra whitespace
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Truncate text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation (default: 100)
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get a plain text preview from markdown (strips markdown and truncates)
 * @param markdown - Markdown string to process
 * @param maxLength - Maximum length of the preview (default: 100)
 * @returns Plain text preview truncated to maxLength
 */
export function getMarkdownPreview(markdown: string, maxLength: number = 100): string {
  const plainText = stripMarkdown(markdown);
  return truncateText(plainText, maxLength);
}

/**
 * Sanitize object with string values
 * @param obj - Object to sanitize
 * @param fieldsToSanitize - Array of field names to sanitize
 * @returns New object with specified fields sanitized
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  fieldsToSanitize: (keyof T)[]
): T {
  const sanitized = { ...obj };
  
  for (const field of fieldsToSanitize) {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeText(sanitized[field] as string) as T[keyof T];
    }
  }
  
  return sanitized;
}

