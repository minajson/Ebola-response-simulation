import type { Team } from "@/data/questions";
import { TEAM_INFO } from "@/lib/config";

/** Abstract containment-ring mark. Deliberately not a medical cross or real logo. */
export function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="0.5" y="0.5" width="31" height="31" rx="7" fill="#A3171C" />
      <circle cx="16" cy="16" r="8.6" fill="none" stroke="#fff" strokeWidth="2.2" strokeDasharray="10.5 3" />
      <circle cx="16" cy="16" r="3.4" fill="#fff" />
    </svg>
  );
}

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <BrandMark className="h-8 w-8 flex-none" />
      <div className="min-w-0 leading-tight">
        <p className="truncate text-[15px] font-bold tracking-[-0.01em] text-ink">Ebola Response</p>
        {!compact && <p className="truncate text-[13px] font-medium text-ink-3">Contain or Collapse</p>}
      </div>
    </div>
  );
}

const TEAM_STYLES: Record<Team, { chip: string; dot: string; text: string }> = {
  A: { chip: "bg-teamA-soft border-teamA-line", dot: "bg-teamA", text: "text-teamA" },
  B: { chip: "bg-teamB-soft border-teamB-line", dot: "bg-teamB", text: "text-teamB" },
};

export function teamText(team: Team): string {
  return TEAM_STYLES[team].text;
}

export function TeamChip({
  team,
  showRound = true,
  size = "md",
}: {
  team: Team;
  showRound?: boolean;
  size?: "md" | "lg";
}) {
  const s = TEAM_STYLES[team];
  const info = TEAM_INFO[team];
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-lg border ${s.chip} ${
        size === "lg" ? "px-4 py-2" : "px-3 py-1.5"
      }`}
    >
      <span className={`h-2.5 w-2.5 rounded-sm ${s.dot}`} aria-hidden="true" />
      <span className={`font-bold uppercase tracking-[0.08em] ${s.text} ${size === "lg" ? "text-[17px]" : "text-[14px]"}`}>
        {info.name}
      </span>
      {showRound && (
        <span className={`font-medium text-ink-2 ${size === "lg" ? "text-[17px]" : "text-[14px]"}`}>
          {info.round}
        </span>
      )}
    </span>
  );
}

export function Kicker({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[13px] font-bold uppercase tracking-[0.16em] text-alert sm:text-[14px] ${className}`}>
      {children}
    </p>
  );
}
