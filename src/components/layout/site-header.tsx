"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/games", label: "Games" },
  { href: "/progress", label: "Progress" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/[.07] bg-[#080b14]/85 backdrop-blur-xl">
      <div className="container-shell flex h-16 items-center justify-between">
        <Link href="/" className="focus-ring flex items-center gap-2 rounded-lg" aria-label="FocusForge home">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-blue-400 to-violet-500 text-sm font-black text-white shadow-lg shadow-blue-500/20">F</span>
          <span className="text-[15px] font-bold tracking-tight text-white">Focus<span className="text-blue-400">Forge</span></span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {links.map((link) => <Link key={link.href} href={link.href} className={cn("focus-ring rounded-lg px-3 py-2 text-sm transition", pathname.startsWith(link.href) ? "bg-white/[.07] text-white" : "text-slate-400 hover:text-white")}>{link.label}</Link>)}
        </nav>
        <Link href="/games/number-recall" className="focus-ring hidden rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 md:block">Play now</Link>
        <button className="focus-ring rounded-lg p-2 text-slate-300 md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="container-shell flex flex-col gap-1 border-t border-white/[.07] py-3 md:hidden" aria-label="Mobile navigation">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="focus-ring rounded-lg px-3 py-3 text-sm text-slate-200">{link.label}</Link>)}</nav>}
    </header>
  );
}
