"use client";

import { ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import { memo, useEffect, useState } from "react";

import { Button } from "./ui/button";

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}

function drawActions(
  array: {
    title: string;
    label: string;
    action: string;
  }[],
  quantity: number
) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, quantity);
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const suggestedActions = [
    {
      title: "Astronautas na Idade Média",
      label: "como explicariam um foguete?",
      action: "Astronautas na Idade Média: como explicariam um foguete?",
    },
    {
      title: "Filósofos gregos em um podcast",
      label: "sobre o que discutiriam?",
      action: "Filósofos gregos em um podcast: sobre o que discutiriam?",
    },
    {
      title: "Samurais em um concurso de dança",
      label: "qual estilo eles dominariam?",
      action: "Samurais em um concurso de dança: qual estilo eles dominariam?",
    },
    {
      title: "Dragões em uma cafeteria",
      label: "que bebidas eles prefeririam?",
      action: "Dragões em uma cafeteria: que bebidas eles prefeririam?",
    },
    {
      title: "Gladiadores em um estádio moderno",
      label: "como seriam seus espetáculos?",
      action: "Gladiadores em um estádio moderno: como seriam seus espetáculos?",
    },
    {
      title: "Artistas renascentistas usando NFTs",
      label: "como venderiam suas obras?",
      action: "Artistas renascentistas usando NFTs: como venderiam suas obras?",
    },
    {
      title: "Vikings em uma viagem espacial",
      label: "quais planetas explorariam?",
      action: "Vikings em uma viagem espacial: quais planetas explorariam?",
    },
    {
      title: "Egípcios antigos com emojis",
      label: "quais símbolos criariam?",
      action: "Egípcios antigos com emojis: quais símbolos criariam?",
    },
    {
      title: "Napoleão em um aplicativo de encontros",
      label: "como seria seu perfil?",
      action: "Napoleão em um aplicativo de encontros: como seria seu perfil?",
    },
    {
      title: "O que os Inventores da Revolução Industrial",
      label: "fabricariam com um impressoras 3D?",
      action: "O que os Inventores da Revolução Industrial fabricariam com um impressoras 3D?",
    },
    {
      title: "Quais lugares da China",
      label: "que você acha que todo mundo deveria ir?",
      action: "O que os Inventores da Revolução Industrial fabricariam com um impressoras 3D?",
    },
  ];

  const drawnSuggestedActions = drawActions(suggestedActions, 4);

  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full">
      {mounted &&
        drawnSuggestedActions.map((suggestedAction, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.05 * index }}
            key={`suggested-action-${suggestedAction.title}-${index}`}
            className={index > 1 ? "hidden sm:block" : "block"}
          >
            <Button
              variant="ghost"
              onClick={async () => {
                window.history.replaceState({}, "", `/chat/${chatId}`);

                append({
                  role: "user",
                  content: suggestedAction.action,
                });
              }}
              className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
            >
              <span className="font-medium">{suggestedAction.title}</span>
              <span className="text-muted-foreground">{suggestedAction.label}</span>
            </Button>
          </motion.div>
        ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
