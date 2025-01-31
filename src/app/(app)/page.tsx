import { cookies } from "next/headers";

import Chat from "@/components/chat";

export default async function Page() {
  const cookiesStore = await cookies();

  const chatModel = cookiesStore.get("chat-model");

  return <Chat model={chatModel?.value || "gpt-4o-mini"} />;
}
