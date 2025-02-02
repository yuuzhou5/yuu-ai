import ChatModelSelect from "./chat-a/chat-model-select";
import { SidebarTrigger } from "./ui/sidebar";
import UserProfile from "./user-profile";

export default function AppHeader() {
  return (
    <header className="flex h-16 bg-background shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />

        <ChatModelSelect />
      </div>

      <div className="flex items-center gap-2">
        <UserProfile />
      </div>
    </header>
  );
}
