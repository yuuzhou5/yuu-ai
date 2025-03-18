"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface ExpandableButtonProps {
  title: string;
  icon: LucideIcon;
  className?: string;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  expanded: boolean;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isExpanded: boolean) => ({
    gap: isExpanded ? ".5rem" : 0,
    paddingLeft: isExpanded ? "1rem" : ".5rem",
    paddingRight: isExpanded ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

export function ExpandableButton({ title, icon: Icon, className, expanded, setExpanded }: ExpandableButtonProps) {
  return (
    <Tooltip delayDuration={expanded ? 9999 : 0}>
      <TooltipTrigger asChild>
        <motion.button
          variants={buttonVariants}
          initial={false}
          animate="animate"
          custom={expanded}
          onClick={() => setExpanded(!expanded)}
          transition={transition}
          type="button"
          className={cn(
            "relative flex items-center rounded-md p-[7px] h-fit text-sm font-medium transition-colors duration-300",
            expanded
              ? "border-2 border-blue-500 text-blue-500 rounded-xl px-2! py-1"
              : "text-foreground dark:border-zinc-700 dark:hover:bg-zinc-900 hover:bg-zinc-200",
            className
          )}
        >
          <Icon className="size-4" />

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.span
                variants={spanVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
                className="overflow-hidden"
              >
                {title}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </TooltipTrigger>

      <TooltipContent>Pesquisas na internet</TooltipContent>
    </Tooltip>
  );
}
