"use client";
import { Trophy } from "lucide-react";
import { useProgress } from "@/features/progress/use-progress";
export function LocalBest() { const { summary, loaded } = useProgress(); if (!loaded || summary.gamesPlayed === 0) return null; return <div className="surface mt-6 flex items-center justify-between p-5 text-left"><div><p className="text-xs text-slate-500">Your local personal best</p><p className="mt-1 text-lg font-bold">Number Recall</p></div><div className="flex items-center gap-2 text-xl font-bold text-amber-300"><Trophy size={20}/>{summary.personalBest}</div></div>; }
