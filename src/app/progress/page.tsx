import type { Metadata } from "next";
import { ProgressDashboard } from "@/features/progress/progress-dashboard";
export const metadata: Metadata = { title: "Your Progress", description: "Review your private, locally stored FocusForge game history and personal bests.", alternates: { canonical: "/progress" } };
export default function ProgressPage() { return <div className="container-shell py-16"><p className="eyebrow">Private to this device</p><h1 className="mt-3 text-4xl font-bold tracking-tight">Your progress</h1><p className="mb-10 mt-4 max-w-2xl text-sm leading-6 text-slate-400">See completed sessions and personal milestones. FocusForge stores this information only in your browser during Phase 1.</p><ProgressDashboard/></div>; }
