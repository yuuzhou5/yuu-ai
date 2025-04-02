import { ExternalLink } from "lucide-react";
import { marked } from "marked";
import Link from "next/link";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";

import CodeDisplayBlock from "./code-display-block";
import { Separator } from "./ui/separator";

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);

  return tokens.map((token) => token.raw);
}

function PureMarkdownBlock({ content, className }: { content: string; className?: string }) {
  return (
    <ReactMarkdown
      components={{
        code: CodeDisplayBlock,
        pre: ({ children }) => <>{children}</>,
        hr: () => <Separator className="my-2" />,
        a: ({ children, href }) => {
          return (
            <Link target="_blank" rel="noopener noreferrer" href={href as string} className="flex items-center">
              {children} <ExternalLink className="size-4 ml-1" />
            </Link>
          );
        },
      }}
      className={className}
    >
      {content}
    </ReactMarkdown>
  );
}

export const MemoizedMarkdownBlock = memo(PureMarkdownBlock, (prevProps, nextProps) => {
  if (prevProps.content !== nextProps.content) return false;
  return true;
});

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MemoizedMarkdown = memo(
  ({ content, id, className }: { content: string; id: string; className?: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock
        content={block}
        key={`${id}-block_${index}`}
        className={cn(
          "prose prose-neutral dark:prose-invert max-w-none text-foreground prose-headings:mt-3 prose-headings:mb-1 prose-li:my-0",
          className
        )}
      />
    ));
  }
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";
