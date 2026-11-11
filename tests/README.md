# Regression tests

```bash
npx playwright install chromium   # first run on a new machine only
npm test                          # unit + end-to-end (starts the dev server on port 3417)
npm run test:unit                 # logic and content-integrity checks only (no browser)
npm run test:e2e                  # browser tests only
```

To test a production build instead of the dev server:

```bash
npm run build && npx next start -p 3417      # terminal 1
BASE_URL=http://localhost:3417 npm run test:e2e   # terminal 2
```

Set `PORT` to use a different port, or `PW_CHROMIUM_PATH` to use an existing Chromium binary.

## What is covered

- **Content integrity** (`unit/logic.spec.ts`)
  - 14 scenarios in the original order, 7 per team.
  - The answer key and scenario titles are pinned.
  - Each scenario has 4 distinct options and complete feedback text.
  - No "Occupational Health" wording remains, and none of the corrected phrases has crept back in.
  - No photographs are bundled or referenced; scenes are illustrated with inline icons.
- **Scoring** (`unit/logic.spec.ts`)
  - +10 correct, −5 incorrect, 0 unanswered.
  - The +5 speed bonus applies only when all 7 are answered in time, and the rule is identical for both teams.
  - Ties produce no invented winner.
  - The 150-second timer and the warning thresholds are checked.
- **End to end** (`e2e/game.spec.ts`), using a fake clock:
  - A complete game with early completion and a sealed hand-over between rounds.
  - Team B never starts automatically.
  - The After-Action Review walk-through, winner reveal and restart.
  - Timeout with zero answers, ending in a tie.
  - A partly answered round, and a tie that includes the speed bonus.
  - An answer locked half a second before time-out is kept.
  - Mute, Reduce Motion, fullscreen, touch taps, and the A–D / 1–4 keys.
  - Each timer sound plays exactly once: 45 s, 20 s, the 10→4 beeps, the 3→1 beeps and the timeout alarm.
  - The high-risk shake happens once, and alarms never overlap.
  - Only same-origin network requests are made, no images are downloaded, and every scenario shows an illustrated scene panel.
- **Projector layout** (`e2e/layout.spec.ts`), run in real time at 1366×768, 1920×1080 and 1280×720:
  - Every screen is checked: welcome, all 14 scenarios, both hand-overs, all 15 review steps and the winner screen.
  - Nothing scrolls, and all four options are always visible.
  - Scenario text is at least 24px (22px at 1280 wide), options at least 19px, and the timer at least 34px.
