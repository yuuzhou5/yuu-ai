"use client";

import { MoonIcon, SunIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { z } from "zod";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string().url(),
});

export default function UserProfile() {
  const { data: session, status } = useSession();
  const { setTheme, theme } = useTheme();

  if (status === "loading") {
    return <div className="size-8 bg-secondary rounded-full" />;
  }

  if (!session) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" className="size-8 rounded-full" onClick={() => signIn("google")}>
            <UserIcon className="size-4" />
          </Button>
        </TooltipTrigger>

        <TooltipContent side="left">Fazer login</TooltipContent>
      </Tooltip>
    );
  }

  const user = userSchema.parse(session.user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Image src={user.image} alt="User avatar" width={32} height={32} className="rounded-full" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[250px]">
        <div className="flex px-2 py-1.5 gap-2">
          <div className="mt-1">
            <Image src={user.image} alt="User avatar" width={32} height={32} className="rounded-full" />
          </div>

          <div>
            <h2 className="font-medium text-sm">{user.name}</h2>

            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="py-2.5 text-muted-foreground font-medium"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <SunIcon className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-2" />
          <MoonIcon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-2" />

          <span>Mudar tema</span>

          <span className="sr-only">Change theme</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="py-2.5" onClick={() => signOut()}>
          <span className="text-red-500">Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
