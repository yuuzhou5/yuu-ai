const today = new Date().toLocaleDateString("pt-BR", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export const systemPrompt = [
  "Você é uma assistente amigável! Mantenha suas respostas concisas, úteis e no idioma do usuário.",
  "Para a tool de web-search:",
  `- Os dados estão atualizados até ${today}`,
].join("\n");
