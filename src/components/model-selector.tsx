"use client";

import { usePathname } from "next/navigation";
import { startTransition, useMemo, useOptimistic } from "react";

import { saveModelId } from "@/app/(chat)/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { models } from "@/lib/ai/models";

export function ModelSelector({
  selectedModelId,
}: {
  selectedModelId: string;
} & React.ComponentProps<typeof Select>) {
  const [optimisticModelId, setOptimisticModelId] = useOptimistic(selectedModelId);
  const selectedModel = useMemo(() => models.find((model) => model.id === optimisticModelId), [optimisticModelId]);
  const pathname = usePathname();

  return (
    <Select
      value={optimisticModelId}
      onValueChange={(value) => {
        startTransition(() => {
          setOptimisticModelId(value);
          saveModelId(value);
        });
      }}
    >
      <SelectTrigger className="max-w-[170px] md:max-w-none">
        <SelectValue>
          <div className="flex items-center gap-2">
            {selectedModel?.icon && <selectedModel.icon className="size-4" />}
            <span className="text-sm">{selectedModel?.label}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {models
          .sort((a, b) => Number(a.disabled) - Number(b.disabled))
          .map((model) => (
            <SelectItem key={model.id} value={model.id} disabled={model.disabled || pathname !== "/"} className="gap-4">
              <div className="flex items-center gap-2">
                <model.icon className="size-4" />
                <div className="flex flex-col gap-1">
                  <span>{model.label}</span>
                  {model.description && <span className="text-xs text-muted-foreground">{model.description}</span>}
                </div>
              </div>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
