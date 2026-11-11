// ─────────────────────────────────────────────────────────────────────────────
// SCENE SETTINGS — shown as an illustrated status panel (icon + label) above
// each scenario. No photographs are used; icons are inline SVG.
// ─────────────────────────────────────────────────────────────────────────────

export type SceneSlug =
  | "ppe-team"
  | "clinic-waiting"
  | "decon-station"
  | "ppe-donning"
  | "canteen"
  | "ambulance"
  | "kitchen"
  | "locker-room"
  | "contact-tracing"
  | "industrial-site";

export interface Scene {
  label: string;
}

export const SCENES: Record<SceneSlug, Scene> = {
  "ppe-team": { label: "Site clinic · triage" },
  "clinic-waiting": { label: "Site clinic · waiting area" },
  "decon-station": { label: "Controlled decontamination point" },
  "ppe-donning": { label: "Site clinic · PPE station" },
  canteen: { label: "Staff canteen" },
  ambulance: { label: "Patient transport" },
  kitchen: { label: "Catering kitchen" },
  "locker-room": { label: "Staff locker room" },
  "contact-tracing": { label: "Contact tracing" },
  "industrial-site": { label: "Industrial site" },
};

export function getScene(slug: SceneSlug): Scene {
  return SCENES[slug];
}
