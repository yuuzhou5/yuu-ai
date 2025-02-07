"use client";

import { Check, ChevronDownIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { startTransition, useMemo, useOptimistic, useState } from "react";

import { saveModelId } from "@/app/(chat)/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { models } from "@/lib/ai/models";
import { cn } from "@/lib/utils";

export function ModelSelector({
  selectedModelId,
  className,
}: {
  selectedModelId: string;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const [optimisticModelId, setOptimisticModelId] = useOptimistic(selectedModelId);

  const selectedModel = useMemo(
    () => models.find((model) => model.id === optimisticModelId),
    [optimisticModelId]
  );

  const pathname = usePathname();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          "w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
          className
        )}
      >
        <div
          tabIndex={0}
          role="button"
          className="px-2 h-[34px] border rounded-md flex items-center gap-2 cursor-pointer"
        >
          {selectedModel?.icon && <selectedModel.icon className="size-4" />}

          <span className="text-sm">{selectedModel?.label}</span>

          <ChevronDownIcon className="size-4" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-[300px]">
        {models
          .sort((a, b) => Number(a.disabled) - Number(b.disabled))
          .map((model) => (
            <DropdownMenuItem
              key={model.id}
              onSelect={() => {
                setOpen(false);

                startTransition(() => {
                  setOptimisticModelId(model.id);
                  saveModelId(model.id);
                });
              }}
              className="gap-4 group/item flex flex-row justify-between items-center"
              data-active={model.id === optimisticModelId}
              disabled={model.disabled || pathname !== "/"}
            >
              <div className="flex gap-2">
                <div className="py-1">
                  <model.icon className="size-4" />
                </div>

                <div className="flex flex-col gap-1 items-start">
                  {model.label}

                  {model.description && (
                    <div className="text-xs text-muted-foreground">{model.description}</div>
                  )}
                </div>
              </div>

              <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
                <Check className="size-4" />
              </div>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
