import Link from "next/link";
import { ArrowUpRight, Clock3, Gauge } from "lucide-react";
import type { GameDefinition } from "@/features/games/registry/games";

export function GameCard({ game, featured = false }: { game: GameDefinition; featured?: boolean }) {
  const Icon = game.icon;
  return <article className={`surface group flex h-full flex-col p-6 transition duration-300 ${game.available ? "hover:-translate-y-1 hover:border-blue-400/25" : "opacity-70"}`}>
    <div className="flex items-start justify-between"><span className={`grid size-11 place-items-center rounded-xl ${featured ? "bg-blue-500/15 text-blue-300" : "bg-white/[.06] text-slate-300"}`}><Icon size={21} /></span><span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${game.available ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-white/10 text-slate-500"}`}>{game.available ? "Available" : "Coming soon"}</span></div>
    <p className="eyebrow mt-6">{game.category}</p><h3 className="mt-2 text-xl font-bold">{game.title}</h3><p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{game.description}</p>
    <div className="mt-6 flex gap-4 text-xs text-slate-500"><span className="flex items-center gap-1.5"><Clock3 size={14} />{game.duration}</span><span className="flex items-center gap-1.5"><Gauge size={14} />{game.difficulty}</span></div>
    {game.available && <Link href={`/games/${game.slug}`} className="focus-ring mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/[.045] px-4 py-3 text-sm font-semibold transition hover:border-blue-400/30 hover:bg-blue-500/10">Play {game.title}<ArrowUpRight size={17} /></Link>}
  </article>;
}
