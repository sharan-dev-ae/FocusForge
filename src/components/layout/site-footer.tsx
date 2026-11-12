import Link from "next/link";

export function SiteFooter() {
  return <footer className="border-t border-white/[.07] py-10"><div className="container-shell flex flex-col justify-between gap-5 text-sm text-slate-500 sm:flex-row"><div><p className="font-semibold text-slate-300">FocusForge</p><p className="mt-1">Train your attention. One challenge at a time.</p></div><div className="flex gap-5"><Link className="hover:text-white" href="/games">Games</Link><Link className="hover:text-white" href="/progress">Progress</Link><Link className="hover:text-white" href="/leaderboard">Leaderboard</Link></div></div></footer>;
}
