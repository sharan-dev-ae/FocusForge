import type { Metadata } from "next";
import { GameCard } from "@/components/shared/game-card";
import { games } from "@/features/games/registry/games";
export const metadata: Metadata = { title: "Games", description: "Explore short attention and memory games from FocusForge.", alternates: { canonical: "/games" } };
export default function GamesPage() { return <div className="container-shell py-16 sm:py-20"><p className="eyebrow">Game library</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Choose your challenge</h1><p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">Short sessions, clear rules, and difficulty that grows with you. New games appear here only when they’re ready to play.</p><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{games.map((game) => <GameCard game={game} key={game.slug}/>)}</div></div>; }
