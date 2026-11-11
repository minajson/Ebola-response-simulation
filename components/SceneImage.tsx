"use client";

import Image from "next/image";
import { useState } from "react";
import { getScene, type SceneSlug } from "@/data/scenes";
import { PhotoIcon } from "@/components/ui/icons";

/** `sizes` must match between the strip and the preloader so the same file is cached. */
export const SCENE_STRIP_SIZES = "(min-width: 1024px) 72vw, 100vw";
export const SCENE_HERO_SIZES = "(min-width: 1024px) 42vw, 100vw";

interface SceneImageProps {
  slug: SceneSlug;
  className?: string;
  sizes?: string;
  priority?: boolean;
  showCaption?: boolean;
}

/**
 * Atmospheric scene photo. Falls back to a neutral illustrated placard if the
 * scene has no photo or the file fails to load — gameplay never waits on it.
 */
export default function SceneImage({
  slug,
  className = "",
  sizes = SCENE_STRIP_SIZES,
  priority = false,
  showCaption = true,
}: SceneImageProps) {
  const scene = getScene(slug);
  const [failed, setFailed] = useState(false);
  const usePhoto = scene.image && !failed;

  return (
    <div className={`relative overflow-hidden rounded-xl border border-line bg-sunken ${className}`}>
      {usePhoto && scene.image ? (
        <Image
          src={scene.image}
          alt={scene.alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          className="object-cover"
          style={{ objectPosition: scene.focus }}
          onError={() => setFailed(true)}
        />
      ) : (
        <ScenePlacard label={scene.label} />
      )}
      {showCaption && usePhoto && (
        <span className="absolute bottom-2 left-2 inline-flex max-w-[calc(100%-1rem)] items-center gap-1.5 truncate rounded-md bg-white/90 px-2 py-1 text-[12px] font-semibold text-ink-2">
          {scene.label}
        </span>
      )}
    </div>
  );
}

function ScenePlacard({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        backgroundColor: "#EFECE6",
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(30,34,38,0.035) 0 2px, transparent 2px 14px)",
      }}
      role="img"
      aria-label={`${label} (illustration)`}
    >
      <div className="flex items-center gap-2 text-ink-3">
        <PhotoIcon className="h-5 w-5" />
        <span className="text-[13px] font-semibold uppercase tracking-[0.12em]">{label}</span>
      </div>
    </div>
  );
}

/** Loads scene photos off-screen ahead of a round so gameplay has no image waits. */
export function ScenePreloader({ slugs }: { slugs: SceneSlug[] }) {
  const unique = Array.from(new Set(slugs));
  return (
    <div aria-hidden="true" className="pointer-events-none fixed -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0">
      {unique.map((slug) => {
        const scene = getScene(slug);
        if (!scene.image) return null;
        return (
          <div key={slug} className="relative h-px w-px">
            <Image src={scene.image} alt="" fill sizes={SCENE_STRIP_SIZES} loading="eager" />
          </div>
        );
      })}
    </div>
  );
}
