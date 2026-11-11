import { getScene, type SceneSlug } from "@/data/scenes";
import { SceneIcon } from "@/components/ui/sceneIcons";
import { formatClock, ROUND_SECONDS, TEAM_INFO } from "@/lib/config";

/** Compact illustrated scene status panel shown above each scenario (no photographs). */
export default function ScenePanel({ slug, className = "" }: { slug: SceneSlug; className?: string }) {
  const scene = getScene(slug);
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border border-line bg-canvas px-4 py-2.5 [@media(max-height:760px)]:py-1.5 [@media(min-height:900px)]:py-4 ${className}`}
      role="note"
      aria-label={`Scene: ${scene.label}`}
    >
      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-lg border border-alert-line bg-alert-soft text-alert [@media(max-height:760px)]:h-9 [@media(max-height:760px)]:w-9 [@media(min-height:900px)]:h-14 [@media(min-height:900px)]:w-14">
        <SceneIcon slug={slug} className="h-6 w-6 [@media(min-height:900px)]:h-7 [@media(min-height:900px)]:w-7" />
      </span>
      <div className="min-w-0 leading-tight">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-3">Scene</p>
        <p className="mt-0.5 truncate text-[17px] font-semibold text-ink [@media(min-height:900px)]:text-[20px]">{scene.label}</p>
      </div>
      <div className="ml-auto hidden items-center gap-2 text-[13px] font-semibold text-ink-3 sm:flex">
        <span className="h-2 w-2 rounded-full bg-alert" aria-hidden="true" />
        Active incident
      </div>
    </div>
  );
}

/** Illustrated "incident board" used on the cover and welcome screens in place of a photo. */
export function IncidentBoard({ className = "" }: { className?: string }) {
  const rows: Array<[string, string]> = [
    ["Teams", `${TEAM_INFO.A.name} · ${TEAM_INFO.B.name}`],
    ["Scenarios", "7 per team · 14 in total"],
    ["Round clock", `${formatClock(ROUND_SECONDS)} per team`],
    ["Review", "Combined after-action review"],
  ];
  const settings: SceneSlug[] = ["ppe-team", "ambulance", "kitchen", "contact-tracing", "decon-station", "industrial-site"];
  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card ${className}`}>
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-ink-3">Incident board</p>
        <span className="inline-flex items-center gap-2 rounded-md border border-caution-line bg-caution-soft px-2.5 py-1 text-[13px] font-bold text-caution">
          <span className="h-2 w-2 rounded-full bg-caution-fill" aria-hidden="true" />
          Standby
        </span>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center px-6 py-6"
        style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(30,34,38,0.03) 0 2px, transparent 2px 14px)" }}
      >
        <svg viewBox="0 0 200 200" className="h-[clamp(120px,22vh,220px)] w-auto" aria-hidden="true">
          <circle cx="100" cy="100" r="92" fill="none" stroke="#EBC4C1" strokeWidth="2" strokeDasharray="6 8" />
          <circle cx="100" cy="100" r="66" fill="none" stroke="#A3171C" strokeWidth="5" strokeDasharray="60 14" />
          <circle cx="100" cy="100" r="40" fill="#FBEDEC" stroke="#EBC4C1" strokeWidth="2" />
          <circle cx="100" cy="100" r="16" fill="#A3171C" />
        </svg>
        <div className="absolute inset-x-6 bottom-4 flex flex-wrap justify-center gap-2" aria-label="Scenario settings">
          {settings.map((s) => (
            <span
              key={s}
              title={getScene(s).label}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-ink-2"
            >
              <SceneIcon slug={s} className="h-5 w-5" />
            </span>
          ))}
        </div>
      </div>

      <dl className="divide-y divide-line border-t border-line">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-4 px-6 py-2.5">
            <dt className="text-[13px] font-bold uppercase tracking-[0.12em] text-ink-3">{k}</dt>
            <dd className="text-right text-[16px] font-semibold text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
