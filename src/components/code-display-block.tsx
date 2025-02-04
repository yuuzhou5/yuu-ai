"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

// import { useTheme } from "next-themes";
// import { Code, CodeBlock, github } from "react-code-blocks";
// import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
// import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { copyToClipboard } from "@/lib/utils";

import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

// TODO: add syntax highlight withou break the whole screen size

export default function CodeDisplayBLock({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  // const { theme } = useTheme();

  const [copied, setCopied] = useState(false);

  const match = /language-(\w+)/.exec(className || "");

  const codeLanguage = match ? match[1] : "javascript";
  const inline = !match;

  async function handleCopyCode() {
    await copyToClipboard(children as string);

    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  }

  return inline ? (
    <code className="font-mono bg-secondary rounded-md p-1 text-sm">{children}</code>
  ) : (
    <div className="not-prose flex flex-col border rounded-md">
      <div className="font-sans text-sm py-1 px-2 bg-secondary flex items-center justify-between w-full">
        <span>{codeLanguage}</span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleCopyCode} size="icon" className="size-6" variant="ghost">
              {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{copied ? "Copiado!" : "Copiar"}</TooltipContent>
        </Tooltip>
      </div>

      <pre className="text-sm w-full overflow-x-auto p-4 border font-mono">
        <code className="whitespace-pre-wrap break-words">{children}</code>
      </pre>
    </div>
  );

  // return inline ? (
  //   <code className="font-mono bg-secondary rounded-md p-1 text-sm">{children}</code>
  // ) : (
  //   <div className="overflow-x-auto flex max-w-[calc(100vh_-_16px)]">
  //     <pre className="font-mono whitespace-pre overflow-x-scroll">{children}</pre>
  //   </div>
  // );

  // return inline ? (
  //   <Code
  //     language={codeLanguage === "javascript" ? "jsx" : codeLanguage}
  //     customStyle={
  //       theme === "dark" ? { background: "#2A2A2A", fontSize: "14px" } : { background: "#F5F5F5", fontSize: "14px" }
  //     }
  //     text={children as string}
  //     theme={theme === "dark" ? dracula : github}
  //   />
  // ) : (
  //   <div className="font-mono my-2 border rounded-md text-sm w-full max-w-[calc(736px-38px)] md:max-w-[calc(736px-44px)]">
  //     <div className="font-sans py-1 px-2 bg-secondary flex items-center justify-between w-full">
  //       <span>{codeLanguage}</span>

  //       <Tooltip>
  //         <TooltipTrigger asChild>
  //           <Button onClick={handleCopyCode} size="icon" className="size-6" variant="ghost">
  //             <Copy className="size-3" />
  //           </Button>
  //         </TooltipTrigger>

  //         <TooltipContent>Copiar</TooltipContent>
  //       </Tooltip>
  //     </div>

  //     <div className="overflow-x-auto w-full">
  //       <CodeBlock
  //         customStyle={{ background: "transparent" }}
  //         language={codeLanguage === "javascript" ? "jsx" : codeLanguage}
  //         text={children as string}
  //         showLineNumbers={false}
  //         theme={theme === "dark" ? dracula : github}
  //       />
  //     </div>
  //   </div>
  // );
}
