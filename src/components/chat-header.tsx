import { memo } from "react";

import { ModelSelector } from "./model-selector";
import { SidebarToggle } from "./sidebar-toggle";
import UserProfile from "./user-profile";

type ChatHeaderProps = {
  chatId: string;
  selectedModelId: string;
};

function PureChatHeader({ chatId, selectedModelId }: ChatHeaderProps) {
  console.log(chatId);

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center justify-between px-2 md:px-2 gap-2">
      <div className="flex items-center gap-2">
        <SidebarToggle />

        <ModelSelector selectedModelId={selectedModelId} />
      </div>

      <UserProfile />
    </header>
  );
}

export default memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
