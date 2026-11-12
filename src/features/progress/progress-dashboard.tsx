"use client";

import { useState } from "react";
import { BarChart3, Brain, Gamepad2, RotateCcw, Trophy } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { formatDuration } from "@/lib/utils";
import { useProgress } from "./use-progress";

export function ProgressDashboard() {
  const { data, summary, loaded, reset } = useProgress();
  const [confirming, setConfirming] = useState(false);
  if (!loaded) return <div className="surface h-64 animate-pulse" aria-label="Loading progress" />;
  if (data.sessions.length === 0) return <div className="surface grid min-h-80 place-items-center p-8 text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-blue-500/10 text-blue-300"><BarChart3/></span><h2 className="mt-5 text-2xl font-bold">Your first run starts here</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">Complete a Number Recall Classic run and your results will appear here. Your history stays in this browser.</p><ButtonLink className="mt-6" href="/games/number-recall">Play Number Recall</ButtonLink></div></div>;
  const maxScore = Math.max(1, ...data.sessions.filter((s) => s.mode === "classic").map((s) => s.score));
  return <>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Metric icon={Gamepad2} label="Games played" value={summary.gamesPlayed}/><Metric icon={Trophy} label="Personal best" value={summary.personalBest}/><Metric icon={BarChart3} label="Highest level" value={summary.highestCompletedLevel}/><Metric icon={Brain} label="Longest sequence" value={summary.longestSequence}/></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><section className="surface p-6"><h2 className="text-lg font-bold">Performance history</h2><p className="mt-1 text-xs text-slate-500">Classic score, most recent on the right</p><div className="mt-8 flex h-44 items-end gap-2" role="img" aria-label="Recent classic scores bar chart">{data.sessions.filter((s) => s.mode === "classic").slice(0, 12).reverse().map((session) => <div key={session.id} className="group relative flex h-full flex-1 items-end"><div className="w-full min-w-2 rounded-t bg-gradient-to-t from-blue-600 to-blue-400 transition hover:brightness-125" style={{ height: `${Math.max(5, session.score / maxScore * 100)}%` }} title={`${session.score} points`} /></div>)}</div></section>
      <section className="surface p-6"><h2 className="text-lg font-bold">Recent sessions</h2><div className="mt-4 divide-y divide-white/[.07]">{data.sessions.slice(0, 5).map((s) => <div className="flex items-center justify-between py-3" key={s.id}><div><p className="text-sm font-medium">Number Recall <span className="ml-1 text-xs capitalize text-slate-500">{s.mode}</span></p><p className="mt-1 text-xs text-slate-500">{new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(s.completedAt))} · {formatDuration(s.durationSeconds)}</p></div><strong className="text-sm">{s.mode === "classic" ? `${s.score} pts` : `${s.longestSequence} digits`}</strong></div>)}</div></section></div>
    <div className="mt-8 flex justify-end">{confirming ? <div className="flex items-center gap-3 rounded-xl border border-red-400/20 bg-red-500/[.07] p-3"><span className="text-sm text-red-100">Delete all local progress?</span><Button variant="danger" onClick={() => { reset(); setConfirming(false); }}>Delete</Button><Button variant="ghost" onClick={() => setConfirming(false)}>Cancel</Button></div> : <Button variant="ghost" onClick={() => setConfirming(true)}><RotateCcw size={16}/> Reset progress</Button>}</div>
  </>;
}

function Metric({ icon: Icon, label, value }: { icon: typeof Brain; label: string; value: number }) { return <div className="surface p-5"><Icon size={18} className="text-blue-300"/><strong className="mt-5 block text-3xl">{value}</strong><span className="mt-1 block text-xs text-slate-500">{label}</span></div>; }
