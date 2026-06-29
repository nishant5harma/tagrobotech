import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: "orange" | "navy" | "violet" | "teal";
  delay?: number;
};

const accents = {
  orange: {
    icon: "bg-[#fff1eb] text-[#f15a24] dark:bg-[#3a2218] dark:text-[#f59e6e]",
    ring: "ring-[#f15a24]/20",
    glow: "from-[#f15a24]/10 to-transparent",
  },
  navy: {
    icon: "bg-[#e8eaf5] text-[#2b2e5d] dark:bg-[#252847] dark:text-[#a8acd4]",
    ring: "ring-[#2b2e5d]/15",
    glow: "from-[#2b2e5d]/10 to-transparent",
  },
  violet: {
    icon: "bg-[#f0ecfa] text-[#5b4d8a] dark:bg-[#2a2540] dark:text-[#b8a8e8]",
    ring: "ring-[#5b4d8a]/15",
    glow: "from-[#5b4d8a]/10 to-transparent",
  },
  teal: {
    icon: "bg-[#e6f5f2] text-[#2d7a6e] dark:bg-[#1a2e2a] dark:text-[#6ec4b4]",
    ring: "ring-[#2d7a6e]/15",
    glow: "from-[#2d7a6e]/10 to-transparent",
  },
};

export default function StatCard({ label, value, icon: Icon, accent, delay = 0 }: StatCardProps) {
  const style = accents[accent];

  return (
    <div
      className={`stat-card login-fade-up relative overflow-hidden rounded-2xl border border-border bg-card p-5 ring-1 ${style.ring}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${style.glow}`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-muted">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${style.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
