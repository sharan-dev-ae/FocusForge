"use client";

import { useCallback, useEffect, useRef } from "react";
import { ArrowRight, Brain, Check, RotateCcw, Settings2, Trophy, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDifficulty } from "../engine/difficulty";
import { useNumberRecall } from "../hooks/use-number-recall";
import { useProgress } from "@/features/progress/use-progress";

export function NumberRecallGame() {
  const { data, loaded, addSession, update } = useProgress();
  const onComplete = useCallback((session: Parameters<typeof addSession>[0]) => addSession(session), [addSession]);
  const { state, dispatch, start, restart, submit, next, remainingMs } = useNumberRecall(onComplete);
  const inputRef = useRef<HTMLInputElement>(null);
  const config = state.mode === "classic" ? getDifficulty(state.level) : { level: state.level, ...state.practice };
  const soundEnabled = loaded && data.preferences.soundEnabled;

  useEffect(() => { if (state.phase === "recalling") inputRef.current?.focus(); }, [state.phase]);
  useEffect(() => { if (loaded && state.phase === "idle" && (state.practice.digits !== data.practice.digits || state.practice.displayMs !== data.practice.displayMs)) dispatch({ type: "SET_PRACTICE", settings: data.practice }); }, [data.practice, dispatch, loaded, state.phase, state.practice]);
  useEffect(() => {
    if (!soundEnabled || (state.phase !== "success" && state.phase !== "game-over")) return;
    const AudioContext = window.AudioContext;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = state.lastAnswerCorrect ? 620 : 220;
    gain.gain.setValueAtTime(0.045, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.14);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.14);
    oscillator.addEventListener("ended", () => void context.close(), { once: true });
    return () => { oscillator.disconnect(); gain.disconnect(); void context.close(); };
  }, [soundEnabled, state.lastAnswerCorrect, state.phase]);

  const toggleSound = () => update({ ...data, preferences: { soundEnabled: !soundEnabled } });
  const savePractice = (digits: number, displayMs: number) => { const practice = { digits, displayMs }; dispatch({ type: "SET_PRACTICE", settings: practice }); update({ ...data, practice }); };
  const countdown = Math.max(1, Math.ceil(remainingMs / 1000));

  return (
    <section className="surface overflow-hidden" aria-label="Number Recall game">
      <div className="flex min-h-[34rem] flex-col">
        <div className="flex items-center justify-between border-b border-white/[.07] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-5">
            <div><span className="text-xs text-slate-500">Mode</span><p className="text-sm font-semibold capitalize text-slate-200">{state.mode}</p></div>
            {state.phase !== "idle" && <div><span className="text-xs text-slate-500">{state.mode === "classic" ? "Level" : "Digits"}</span><p className="text-sm font-semibold text-slate-200">{state.mode === "classic" ? state.level : state.practice.digits}</p></div>}
            {state.mode === "classic" && state.phase !== "idle" && <div><span className="text-xs text-slate-500">Score</span><p className="text-sm font-semibold text-slate-200">{state.score}</p></div>}
          </div>
          <button className="focus-ring rounded-lg p-2 text-slate-400 transition hover:bg-white/[.06] hover:text-white" onClick={toggleSound} aria-label={soundEnabled ? "Disable sound" : "Enable sound"}>{soundEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}</button>
        </div>

        <div className="relative flex flex-1 items-center justify-center p-5 sm:p-8">
          {state.phase === "idle" && <div className="animate-rise mx-auto max-w-xl text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300"><Brain /></span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight">Remember. Rebuild. Advance.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">A number appears briefly. Hold it in mind, then type it exactly—including any leading zeros.</p>
            <div className="mx-auto mt-7 grid max-w-sm grid-cols-2 rounded-xl border border-white/[.08] bg-black/20 p-1" role="group" aria-label="Game mode">
              {(["classic", "practice"] as const).map((mode) => <button key={mode} onClick={() => dispatch({ type: "SET_MODE", mode })} className={`focus-ring rounded-lg px-4 py-2.5 text-sm font-semibold capitalize transition ${state.mode === mode ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}>{mode}</button>)}
            </div>
            {state.mode === "practice" && <div className="mx-auto mt-4 grid max-w-sm grid-cols-2 gap-3 text-left">
              <label className="text-xs text-slate-400">Sequence length<select className="focus-ring mt-1.5 w-full rounded-lg border border-white/10 bg-[#101521] px-3 py-2.5 text-sm text-white" value={state.practice.digits} onChange={(e) => savePractice(Number(e.target.value), state.practice.displayMs)}>{Array.from({ length: 11 }, (_, i) => i + 2).map((n) => <option key={n}>{n}</option>)}</select></label>
              <label className="text-xs text-slate-400">Display time<select className="focus-ring mt-1.5 w-full rounded-lg border border-white/10 bg-[#101521] px-3 py-2.5 text-sm text-white" value={state.practice.displayMs} onChange={(e) => savePractice(state.practice.digits, Number(e.target.value))}>{[3000,4000,5000,6000,8000,10000].map((ms) => <option key={ms} value={ms}>{ms / 1000} sec</option>)}</select></label>
            </div>}
            <Button className="mt-7 min-w-40" onClick={start}>Start challenge <ArrowRight size={17} /></Button>
            <p className="mt-4 text-xs text-slate-500">{state.mode === "classic" ? "One mistake ends the run · 10 points per digit" : "Unlimited retries · No competitive score"}</p>
          </div>}

          {state.phase === "countdown" && <div className="text-center" aria-live="polite"><p className="eyebrow">Get ready</p><div className="mt-3 font-mono text-8xl font-bold tabular-nums text-white">{countdown}</div><p className="mt-4 text-sm text-slate-500">Level {state.level} · {config.digits} digits</p></div>}
          {state.phase === "memorizing" && <div className="w-full text-center"><p className="eyebrow">Remember this number</p><div className="mt-8 overflow-x-auto py-2 font-mono text-[clamp(2.5rem,10vw,6rem)] font-semibold tracking-[.12em] tabular-nums text-white" aria-label={`Number to remember: ${state.sequence.split("").join(" ")}`}>{state.sequence}</div><div className="mx-auto mt-8 h-1 max-w-sm overflow-hidden rounded-full bg-white/10"><div className="h-full bg-blue-400 transition-[width] duration-100 ease-linear" style={{ width: `${Math.max(0, Math.min(100, (remainingMs / config.displayMs) * 100))}%` }} /></div></div>}
          {(state.phase === "recalling" || state.phase === "validating") && <form className="w-full max-w-xl text-center" onSubmit={(e) => { e.preventDefault(); submit(); }}><p className="eyebrow">Now recall</p><label htmlFor="recall-input" className="mt-3 block text-2xl font-bold">What was the number?</label><input ref={inputRef} id="recall-input" inputMode="numeric" autoComplete="off" pattern="[0-9]*" value={state.input} disabled={state.phase === "validating"} onChange={(e) => dispatch({ type: "INPUT", value: e.target.value })} className="focus-ring mt-8 w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-5 text-center font-mono text-4xl tracking-[.15em] text-white placeholder:text-slate-700" placeholder="Enter the digits" aria-describedby="recall-help" /><p id="recall-help" className="mt-3 text-xs text-slate-500">Type every digit in order, then press Enter.</p><Button className="mt-6 min-w-36" type="submit" disabled={!state.input || state.phase === "validating"}>Submit answer</Button></form>}
          {state.phase === "success" && <div className="animate-rise max-w-md text-center" aria-live="polite"><span className={`mx-auto grid size-14 place-items-center rounded-full ${state.lastAnswerCorrect ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>{state.lastAnswerCorrect ? <Check /> : <X />}</span><h2 className="mt-5 text-3xl font-bold">{state.lastAnswerCorrect ? "Perfect recall" : "Not quite—keep training"}</h2><p className="mt-3 text-sm text-slate-400">{state.mode === "classic" ? `+${config.digits * 10} points. The next sequence adds another digit.` : state.lastAnswerCorrect ? "You recalled every digit correctly." : "Practice has unlimited retries. Take another look when you’re ready."}</p><Button className="mt-7" onClick={next}>{state.mode === "classic" ? "Next level" : "Try again"}<ArrowRight size={17} /></Button></div>}
          {(state.phase === "game-over" || state.phase === "results") && <div className="animate-rise w-full max-w-lg text-center" aria-live="polite"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-violet-500/15 text-violet-300"><Trophy /></span><p className="eyebrow mt-5">Run complete</p><h2 className="mt-2 text-4xl font-bold">{state.score} points</h2><div className="mt-7 grid grid-cols-3 gap-2"><Stat label="Levels" value={Math.max(0, state.level - 1)} /><Stat label="Longest" value={state.longestSequence} /><Stat label="Correct" value={state.correctAttempts} /></div><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Button onClick={start}>Play again <RotateCcw size={17} /></Button><Button variant="secondary" onClick={restart}><Settings2 size={17} /> Change mode</Button></div></div>}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) { return <div className="rounded-xl border border-white/[.07] bg-white/[.035] px-3 py-4"><strong className="block text-xl text-white">{value}</strong><span className="mt-1 block text-xs text-slate-500">{label}</span></div>; }
