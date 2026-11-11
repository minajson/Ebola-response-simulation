// ─────────────────────────────────────────────────────────────────────────────
// SCENE IMAGES — atmospheric context only, bundled locally (no external image
// requests during gameplay). Photos are real, licensed Wikimedia Commons images;
// none show patients. A scene with `image: null`, or an image that fails to
// load, renders the built-in illustrated placard instead.
// ─────────────────────────────────────────────────────────────────────────────

import type { StaticImageData } from "next/image";
import ambulance from "@/assets/scenes/ambulance.jpg";
import canteen from "@/assets/scenes/canteen.jpg";
import clinicWaiting from "@/assets/scenes/clinic-waiting.jpg";
import contactTracing from "@/assets/scenes/contact-tracing.jpg";
import deconStation from "@/assets/scenes/decon-station.jpg";
import industrialSite from "@/assets/scenes/industrial-site.jpg";
import kitchen from "@/assets/scenes/kitchen.jpg";
import lockerRoom from "@/assets/scenes/locker-room.jpg";
import ppeDonning from "@/assets/scenes/ppe-donning.jpg";
import ppeTeam from "@/assets/scenes/ppe-team.jpg";

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

export interface SceneCredit {
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
}

export interface Scene {
  label: string;
  alt: string;
  image: StaticImageData | null;
  /** CSS object-position used for wide crops */
  focus: string;
  credit: SceneCredit | null;
}

const CC_BY_2 = "https://creativecommons.org/licenses/by/2.0/";
const CC_BY_SA_4 = "https://creativecommons.org/licenses/by-sa/4.0/";

export const SCENES: Record<SceneSlug, Scene> = {
  "ppe-team": {
    label: "Site clinic · PPE response team",
    alt: "Health workers in protective coveralls, goggles and aprons outside a clinic building in Lagos.",
    image: ppeTeam,
    focus: "58% 62%",
    credit: {
      title: "WHO in PPE",
      author: "CDC Global (photo: Bryan Christensen)",
      license: "CC BY 2.0",
      licenseUrl: CC_BY_2,
      sourceUrl: "https://commons.wikimedia.org/wiki/File:WHO_in_PPE.jpg",
    },
  },
  "clinic-waiting": {
    label: "Site clinic · waiting area",
    alt: "A clinic waiting area with a reception window and blue chairs.",
    image: clinicWaiting,
    focus: "center 45%",
    credit: {
      title: "Waiting room1",
      author: "JoshuaOpemipo20",
      license: "CC BY-SA 4.0",
      licenseUrl: CC_BY_SA_4,
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Waiting_room1.jpg",
    },
  },
  "decon-station": {
    label: "Controlled decontamination point",
    alt: "Two health workers in face shields, aprons and heavy gloves inside a decontamination tent.",
    image: deconStation,
    focus: "center 40%",
    credit: {
      title: "The student sprayers keeping medics safe from Ebola in Makeni, Sierra Leone",
      author: "Jessica Seldon / DFID",
      license: "CC BY 2.0",
      licenseUrl: CC_BY_2,
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:The_student_sprayers_keeping_medics_safe_from_Ebola_in_Makeni,_Sierra_Leone_(16341476412).jpg",
    },
  },
  "ppe-donning": {
    label: "PPE donning check",
    alt: "A trainer adjusts a colleague's goggles during PPE donning training.",
    image: ppeDonning,
    focus: "center 25%",
    credit: {
      title: "Training on the Use of PPE",
      author: "CDC Global (photo: Patrick Adams, RTI)",
      license: "CC BY 2.0",
      licenseUrl: CC_BY_2,
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Training_on_the_Use_of_PPE_(36526123486).jpg",
    },
  },
  canteen: {
    label: "Staff canteen",
    alt: "People queuing at the serving counters of a canteen.",
    image: canteen,
    focus: "center 45%",
    credit: {
      title: "Mountain Top University Nigeria Students Canteen",
      author: "Haykinz001",
      license: "CC BY-SA 4.0",
      licenseUrl: CC_BY_SA_4,
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Mountain_Top_University_Nigeria_Students_Canteen.jpg",
    },
  },
  ambulance: {
    label: "Patient transport",
    alt: "A yellow ambulance parked under a covered bay.",
    image: ambulance,
    focus: "center 62%",
    credit: {
      title: "Ambulance at the Rivers State Fire Service Headquarters",
      author: "Simon Ojelabi",
      license: "CC0 1.0",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Ambulance_at_the_Rivers_State_Fire_Service_Headquarters_be.jpg",
    },
  },
  kitchen: {
    label: "Catering kitchen",
    alt: "A commercial catering kitchen with stainless steel equipment and utensil racks.",
    image: kitchen,
    // Cropped high: shows the kitchen, not the individual cooks or their name tapes.
    focus: "center 22%",
    credit: {
      title: "Food service specialists provide quality meals for Fort Bliss personnel",
      author: "Sgt. Richard Andrade, U.S. Army",
      license: "Public domain",
      licenseUrl: "https://commons.wikimedia.org/wiki/Template:PD-USGov-Military-Army",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Food_service_specialists_provide_quality_meals_for_Fort_Bliss_personnel_DVIDS626130.jpg",
    },
  },
  "locker-room": {
    label: "Staff locker room",
    alt: "An empty staff locker room with benches between rows of lockers.",
    image: lockerRoom,
    focus: "center 78%",
    credit: {
      title: "Locker room - lockers closed",
      author: "W.carter",
      license: "Public domain",
      licenseUrl: "https://commons.wikimedia.org/wiki/Template:PD-self",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Locker_room_-_lockers_closed.jpg",
    },
  },
  "contact-tracing": {
    label: "Contact tracing follow-up",
    alt: "Two contact tracers with backpacks walking along a path on a follow-up visit.",
    image: contactTracing,
    focus: "center 55%",
    credit: {
      title: "Contact tracing 2",
      author: "CDC Global",
      license: "CC BY 2.0",
      licenseUrl: CC_BY_2,
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Contact_tracing_2.jpg",
    },
  },
  "industrial-site": {
    label: "Industrial site · Ogun State",
    alt: "A cement plant with kilns, ducting and steel stairways under an overcast sky.",
    image: industrialSite,
    focus: "center 60%",
    credit: {
      title: "Lafarge cement factory in Ewekoro Ogun state - Nigeria",
      author: "Fachab",
      license: "CC BY-SA 4.0",
      licenseUrl: CC_BY_SA_4,
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lafarge_cement_factory_in_Ewekoro_Ogun_state_-Nigeria.jpg",
    },
  },
};

export function getScene(slug: SceneSlug): Scene {
  return SCENES[slug];
}

export function sceneCredits(): Array<{ slug: SceneSlug; label: string; credit: SceneCredit }> {
  return (Object.keys(SCENES) as SceneSlug[]).flatMap((slug) => {
    const s = SCENES[slug];
    return s.image && s.credit ? [{ slug, label: s.label, credit: s.credit }] : [];
  });
}
