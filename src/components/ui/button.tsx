import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const styles = {
  primary: "bg-blue-500 text-white shadow-[0_12px_40px_-12px_rgba(59,130,246,.8)] hover:bg-blue-400",
  secondary: "border border-white/12 bg-white/[.055] text-white hover:border-white/25 hover:bg-white/[.09]",
  ghost: "text-slate-300 hover:bg-white/[.06] hover:text-white",
  danger: "border border-red-400/25 bg-red-500/10 text-red-200 hover:bg-red-500/20",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof styles;
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return <button className={cn("focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-45", styles[variant], className)} {...props} />;
}

export function ButtonLink({ href, children, variant = "primary", className }: { href: string; children: ReactNode; variant?: keyof typeof styles; className?: string }) {
  return <Link href={href} className={cn("focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition", styles[variant], className)}>{children}</Link>;
}
