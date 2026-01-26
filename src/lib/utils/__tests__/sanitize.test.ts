import {
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  stripMarkdown,
  truncateText,
  getMarkdownPreview,
  sanitizeObject,
} from '../sanitize';

describe('sanitizeHtml', () => {
  it('should escape HTML special characters', () => {
    expect(sanitizeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
    );
  });

  it('should handle empty strings', () => {
    expect(sanitizeHtml('')).toBe('');
    expect(sanitizeHtml(null as any)).toBe('');
  });

  it('should escape all dangerous characters', () => {
    expect(sanitizeHtml('<div>Test</div>')).toBe('&lt;div&gt;Test&lt;&#x2F;div&gt;');
  });
});

describe('sanitizeText', () => {
  it('should remove HTML tags', () => {
    expect(sanitizeText('<p>Hello World</p>')).toBe('Hello World');
    expect(sanitizeText('<div><span>Test</span></div>')).toBe('Test');
  });

  it('should handle empty strings', () => {
    expect(sanitizeText('')).toBe('');
    expect(sanitizeText(null as any)).toBe('');
  });

  it('should trim whitespace', () => {
    expect(sanitizeText('  Hello  ')).toBe('Hello');
  });
});

describe('sanitizeUrl', () => {
  it('should allow http URLs', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
  });

  it('should allow https URLs', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
  });

  it('should allow mailto URLs', () => {
    expect(sanitizeUrl('mailto:test@example.com')).toBe('mailto:test@example.com');
  });

  it('should block javascript: protocol', () => {
    expect(sanitizeUrl('javascript:alert("xss")')).toBe('');
  });

  it('should block data: protocol', () => {
    expect(sanitizeUrl('data:text/html,<script>alert("xss")</script>')).toBe('');
  });

  it('should handle empty strings', () => {
    expect(sanitizeUrl('')).toBe('');
  });

  it('should return empty string for invalid URLs', () => {
    expect(sanitizeUrl('invalid-url')).toBe('');
  });
});

describe('stripMarkdown', () => {
  it('should remove markdown headers', () => {
    expect(stripMarkdown('# Header')).toBe('Header');
    expect(stripMarkdown('## Header')).toBe('Header');
  });

  it('should remove bold and italic', () => {
    expect(stripMarkdown('**bold** text')).toBe('bold text');
    expect(stripMarkdown('*italic* text')).toBe('italic text');
  });

  it('should remove links but keep text', () => {
    expect(stripMarkdown('[Link](https://example.com)')).toBe('Link');
  });

  it('should remove code blocks', () => {
    expect(stripMarkdown('```code```')).toBe('');
    expect(stripMarkdown('`code`')).toBe('code');
  });

  it('should remove list markers', () => {
    expect(stripMarkdown('- Item 1\n- Item 2')).toBe('Item 1 Item 2');
  });
});

describe('truncateText', () => {
  it('should truncate long text', () => {
    const longText = 'a'.repeat(150);
    const truncated = truncateText(longText, 100);
    expect(truncated.length).toBe(103); // 100 + '...'
    expect(truncated.endsWith('...')).toBe(true);
  });

  it('should not truncate short text', () => {
    expect(truncateText('Short text', 100)).toBe('Short text');
  });

  it('should use default maxLength of 100', () => {
    const longText = 'a'.repeat(150);
    const truncated = truncateText(longText);
    expect(truncated.length).toBe(103);
  });
});

describe('getMarkdownPreview', () => {
  it('should strip markdown and truncate', () => {
    const markdown = '# Header\n\n**Bold** text with [link](url)';
    const preview = getMarkdownPreview(markdown, 20);
    expect(preview.length).toBeLessThanOrEqual(23); // 20 + '...'
    expect(preview).not.toContain('#');
    expect(preview).not.toContain('**');
  });
});

describe('sanitizeObject', () => {
  it('should sanitize specified fields', () => {
    const obj = {
      name: '<script>alert("xss")</script>',
      email: 'test@example.com',
      bio: '<p>Bio</p>',
    };
    const sanitized = sanitizeObject(obj, ['name', 'bio']);
    expect(sanitized.name).toBe('alert("xss")');
    expect(sanitized.bio).toBe('Bio');
    expect(sanitized.email).toBe('test@example.com');
  });

  it('should not modify non-string fields', () => {
    const obj = {
      name: '<p>Test</p>',
      count: 42,
      active: true,
    };
    const sanitized = sanitizeObject(obj, ['name']);
    expect(sanitized.name).toBe('Test');
    expect(sanitized.count).toBe(42);
    expect(sanitized.active).toBe(true);
  });
});
