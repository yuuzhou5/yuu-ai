// "use client";
// import { useTheme } from "next-themes";
// import React from "react";
// import { CodeBlock, dracula, github } from "react-code-blocks";
// import { toast } from "sonner";

// import { Button } from "./ui/button";

// import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

// interface ButtonCodeblockProps {
//   code: string;
//   lang: string;
// }

// export default function CodeDisplayBlock({ code }: ButtonCodeblockProps) {
//   const [isCopied, setisCopied] = React.useState(false);
//   const { theme } = useTheme();

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(code);
//     setisCopied(true);
//     toast.success("Code copied to clipboard!");
//     setTimeout(() => {
//       setisCopied(false);
//     }, 1500);
//   };

//   return (
//     <div className="relative flex flex-col   text-start  ">
//       <Button onClick={copyToClipboard} variant="ghost" size="icon" className="h-5 w-5 absolute top-2 right-2">
//         {isCopied ? (
//           <CheckIcon className="w-4 h-4 scale-100 transition-all" />
//         ) : (
//           <CopyIcon className="w-4 h-4 scale-100 transition-all" />
//         )}
//       </Button>
//       <CodeBlock
//         customStyle={theme === "dark" ? { background: "#303033" } : { background: "#fcfcfc" }}
//         text={code}
//         language="tsx"
//         showLineNumbers={false}
//         theme={theme === "dark" ? dracula : github}
//       />
//     </div>
//   );
// }

import { Copy } from "lucide-react";
import { useTheme } from "next-themes";
import { Code, CodeBlock, dracula, github } from "react-code-blocks";
import { toast } from "sonner";

import { copyToClipboard } from "@/lib/utils";

import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function CodeDisplayBLock({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { theme } = useTheme();

  const match = /language-(\w+)/.exec(className || "");

  const codeLanguage = match ? match[1] : "javascript";
  const inline = !match;

  async function handleCopyCode() {
    await copyToClipboard(children as string);

    toast.success("Copiado!");
  }

  return inline ? (
    <Code
      language={codeLanguage === "javascript" ? "jsx" : codeLanguage}
      customStyle={
        theme === "dark"
          ? { background: "#2A2A2A", "font-size": "14px" }
          : { background: "#F5F5F5", "font-size": "14px" }
      }
      text={children as string}
      theme={theme === "dark" ? dracula : github}
    />
  ) : (
    <div className="font-mono my-2 border rounded-md w-full text-sm">
      <div className="font-sans py-1 px-2 bg-secondary flex items-center justify-between">
        <span>{codeLanguage}</span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleCopyCode}
              size="icon"
              className="size-6"
              variant="ghost"
            >
              <Copy className="size-3" />
            </Button>
          </TooltipTrigger>

          <TooltipContent>Copiar</TooltipContent>
        </Tooltip>
      </div>

      <CodeBlock
        customStyle={{ background: "transparent" }}
        language={codeLanguage === "javascript" ? "jsx" : codeLanguage}
        text={children as string}
        showLineNumbers={false}
        theme={theme === "dark" ? dracula : github}
      />
    </div>
  );
}
