import Link from "next/link";
import TopBar from "@/components/TopBar";
import SceneImage, { SCENE_HERO_SIZES } from "@/components/SceneImage";
import { HeroIntro, PhotoCredits, TrainingFootnote } from "@/components/Hero";
import { ArrowRightIcon } from "@/components/ui/icons";

/** Cover / holding screen — useful while participants join in the room or online. */
export default function Home() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-canvas">
      <TopBar />
      <main className="mx-auto grid w-full max-w-[1680px] flex-1 grid-cols-1 items-center gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 lg:px-12">
        <div className="flex flex-col gap-8">
          <HeroIntro size="xl" />
          <div>
            <Link
              href="/game"
              className="inline-flex min-h-[64px] items-center justify-center gap-3 rounded-xl border border-alert bg-alert px-9 text-[20px] font-semibold text-white transition-colors hover:bg-alert-strong"
            >
              Enter Simulation
              <ArrowRightIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
        <figure className="hidden h-[min(74vh,720px)] min-h-[380px] lg:block">
          <SceneImage slug="industrial-site" sizes={SCENE_HERO_SIZES} priority className="h-full w-full" />
        </figure>
      </main>
      <footer className="flex flex-col gap-2 border-t border-line px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <TrainingFootnote />
        <PhotoCredits />
      </footer>
    </div>
  );
}
