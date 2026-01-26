"use client";

import ReactMarkdown from "react-markdown";

interface SafeMarkdownProps {
  children: string;
  className?: string;
  components?: React.ComponentProps<typeof ReactMarkdown>["components"];
}

/**
 * Safe markdown renderer that prevents XSS attacks
 * Uses react-markdown's built-in security (doesn't render raw HTML by default)
 * For additional security, consider using rehype-sanitize plugin
 */
export function SafeMarkdown({ children, className = "", components }: SafeMarkdownProps) {
  // react-markdown by default doesn't render raw HTML, which provides basic XSS protection
  // We disallow dangerous elements and ensure links have proper security attributes
  const safeComponents = {
    ...components,
    // Ensure all links have security attributes
    a: ({ href, children, ...props }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#1e4e79] hover:underline"
        {...props}
      >
        {children}
      </a>
    ),
    // Prevent script execution
    script: () => null,
    iframe: () => null,
    object: () => null,
    embed: () => null,
  };

  return (
    <div className={className}>
      <ReactMarkdown components={safeComponents}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

