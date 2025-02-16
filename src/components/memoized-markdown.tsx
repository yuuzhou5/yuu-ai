import { marked } from "marked";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";

import CodeDisplayBlock from "./code-display-block";
import { Separator } from "./ui/separator";

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);

  return tokens.map((token) => token.raw);
}

const MemoizedMarkdownBlock = memo(
  ({ content, className }: { content: string; className?: string }) => {
    return (
      <ReactMarkdown
        components={{
          code: CodeDisplayBlock,
          pre: ({ children }) => <>{children}</>,
          hr: () => <Separator className="my-2" />,
        }}
        className={cn(
          "prose prose-neutral dark:prose-invert max-w-none text-foreground prose-headings:mt-4 prose-headings:mb-2",
          className
        )}
      >
        {content}
      </ReactMarkdown>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  }
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MemoizedMarkdown = memo(
  ({ content, id, className }: { content: string; id: string; className?: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} className={className} />
    ));
  }
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";
