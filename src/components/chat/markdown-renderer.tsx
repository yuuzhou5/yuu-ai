import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} className={className}>
      {content}
    </ReactMarkdown>
  );
}

export default memo(MarkdownRenderer, (prevProps, nextProps) => {
  if (prevProps.content !== nextProps.content) return false;
  return true;
});
