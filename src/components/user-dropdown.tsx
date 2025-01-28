"use client";

import Image from "next/image";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { z } from "zod";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "./ui/button";

type UserDropdownProps = {
  session: Session;
};

const userSchema = z.object({
  user: z.object({
    name: z.string(),
    email: z.string().email(),
    image: z.string().url(),
  }),
});

export function UserDropdown({ session }: UserDropdownProps) {
  const user = userSchema.parse(session).user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="rounded-full">
          <Image
            src={user.image}
            alt={user.name}
            width={32}
            height={32}
            className="rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[250px]">
        <div className="flex px-2 py-1.5 gap-2">
          <div className="relative size-8 mt-1">
            <Image
              src={user.image}
              alt={user.name}
              fill
              className="object-cover rounded-full"
            />
          </div>

          <div>
            <h2 className="font-medium">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="py-2.5 cursor-pointer"
          onClick={() => signOut()}
        >
          <span className="text-red-500">Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
