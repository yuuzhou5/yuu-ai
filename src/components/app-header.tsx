import ChatModelSelect from "./chat/chat-model-select";
import HeaderSidebarTrigger from "./header-sidebar-trigger";
import UserProfile from "./user-profile";

export default function AppHeader() {
  return (
    <header className="flex h-16 bg-background shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-4">
        <HeaderSidebarTrigger />

        <ChatModelSelect />
      </div>

      <div className="flex items-center gap-2">
        <UserProfile />
      </div>
    </header>
  );
}
