"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function NewChatButton() {
  const { open } = useSidebar();

  return (
    <AnimatePresence>
      {!open && (
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, delay: 0.5 }}
            >
              <Link href="/">
                <Button size="icon" variant="outline">
                  <Plus className="size-4" />
                </Button>
              </Link>
            </motion.div>
          </TooltipTrigger>

          <TooltipContent>Novo chat</TooltipContent>
        </Tooltip>
      )}
    </AnimatePresence>
  );
}
