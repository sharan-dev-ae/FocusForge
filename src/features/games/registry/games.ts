import { Brain, Grid3X3, ScanEye, type LucideIcon } from "lucide-react";

export type GameDefinition = {
  slug: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  available: boolean;
  icon: LucideIcon;
};

export const games: GameDefinition[] = [
  { slug: "number-recall", title: "Number Recall", description: "Hold an expanding sequence of digits in mind, then reproduce it from memory.", category: "Memory", duration: "2–5 min", difficulty: "Adaptive", available: true, icon: Brain },
  { slug: "pattern-shift", title: "Pattern Shift", description: "Notice which tile changed inside an evolving visual grid.", category: "Attention", duration: "3–5 min", difficulty: "Adaptive", available: false, icon: Grid3X3 },
  { slug: "signal-focus", title: "Signal Focus", description: "Respond to the right signal while filtering out visual distractions.", category: "Focus", duration: "2–4 min", difficulty: "Progressive", available: false, icon: ScanEye },
];

export function getGame(slug: string) { return games.find((game) => game.slug === slug); }
