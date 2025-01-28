import { auth } from "@/auth";

import { OpenLoginDialog } from "./login-dialog";
import { UserDropdown } from "./user-dropdown";

export default async function UserProfile() {
  const session = await auth();

  return session ? <UserDropdown session={session} /> : <OpenLoginDialog />;
}
