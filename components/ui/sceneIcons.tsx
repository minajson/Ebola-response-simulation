import type { SceneSlug } from "@/data/scenes";

// Line icons for each scene setting (inline SVG — no image files, no network).
const PATHS: Record<SceneSlug, React.ReactNode> = {
  "ppe-team": (
    <>
      <path d="M7.5 10.5V9a4.5 4.5 0 0 1 9 0v1.5" />
      <rect x="8.5" y="8.5" width="7" height="4" rx="1.5" />
      <path d="M5.5 21v-3.5a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5V21" />
      <path d="M12 15.5V21" />
    </>
  ),
  "clinic-waiting": (
    <>
      <path d="M5 6v9h6M5 15v4M11 15v4" />
      <path d="M14 6v9h6M14 15v4M20 15v4" />
    </>
  ),
  "decon-station": (
    <>
      <path d="M12 3.5s-5 5.6-5 9.2a5 5 0 0 0 10 0c0-3.6-5-9.2-5-9.2z" />
      <path d="M9.8 13.2l1.6 1.6 3-3" />
    </>
  ),
  "ppe-donning": (
    <>
      <path d="M4 10.5C4 9.1 5.1 8 6.5 8h11C18.9 8 20 9.1 20 10.5v1.5a3.5 3.5 0 0 1-3.5 3.5h-1.4a2 2 0 0 1-1.6-.8l-.7-.9a1 1 0 0 0-1.6 0l-.7.9a2 2 0 0 1-1.6.8H7.5A3.5 3.5 0 0 1 4 12z" />
      <path d="M4 11H2.5M21.5 11H20" />
    </>
  ),
  canteen: (
    <>
      <path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M9 3v5" />
      <path d="M16 21V3c2 1.5 3 4 3 7v3h-3" />
    </>
  ),
  ambulance: (
    <>
      <path d="M3 7.5h11v9H3zM14 10.5h3.8l3.2 3.2v2.8h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
      <path d="M7 4.5h3" />
    </>
  ),
  kitchen: (
    <>
      <path d="M4 10.5h16v5.5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
      <path d="M2 11.5h2M20 11.5h2M7 10.5a5 5 0 0 1 10 0" />
      <path d="M10 4c0 1 1 1 1 2M13.5 4c0 1 1 1 1 2" />
    </>
  ),
  "locker-room": (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M12 3v18M7 7h2M15 7h2M7 9.5h2M15 9.5h2M9.5 13v2M14.5 13v2" />
    </>
  ),
  "contact-tracing": (
    <>
      <circle cx="12" cy="6" r="2.3" />
      <circle cx="5.5" cy="17.5" r="2.3" />
      <circle cx="18.5" cy="17.5" r="2.3" />
      <path d="M10.9 8.1l-4.2 7.3M13.1 8.1l4.2 7.3M7.8 17.5h8.4" />
    </>
  ),
  "industrial-site": (
    <>
      <path d="M3 20V10.5l5 3v-3l5 3v-3l5 3V5h3v15z" />
      <path d="M2.5 20h19" />
    </>
  ),
};

export function SceneIcon({ slug, className = "h-6 w-6" }: { slug: SceneSlug; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[slug]}
    </svg>
  );
}
