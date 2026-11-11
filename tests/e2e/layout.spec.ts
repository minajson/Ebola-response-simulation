// Projector / screen-share readability. Real clock (no fake timers), so the
// measurements reflect what an audience actually sees.
import { expect, test, type Page } from "@playwright/test";
import { getQuestionsForTeam } from "../../data/questions";

const TEAMS = { A: getQuestionsForTeam("A"), B: getQuestionsForTeam("B") };
const VIEWPORTS = [
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
  { width: 1280, height: 720 },
];

async function noPageScroll(page: Page, where: string) {
  const m = await page.evaluate(() => ({
    h: document.documentElement.scrollHeight - innerHeight,
    w: document.documentElement.scrollWidth - innerWidth,
    main: [...document.querySelectorAll("main")].map((e) => e.scrollHeight - e.clientHeight),
  }));
  expect(m.h, `${where}: page scrolls vertically`).toBeLessThanOrEqual(1);
  expect(m.w, `${where}: page scrolls horizontally`).toBeLessThanOrEqual(1);
  for (const over of m.main) expect(over, `${where}: content area overflows`).toBeLessThanOrEqual(2);
}

for (const vp of VIEWPORTS) {
  test.describe(`${vp.width}×${vp.height}`, () => {
    test.use({ viewport: vp });

    test("every screen fits without scrolling, with projector-size type", async ({ page }) => {
      test.setTimeout(150_000);
      await page.goto("/game");
      await page.getByRole("button", { name: /Start Team A Round/ }).waitFor();
      await noPageScroll(page, "welcome");

      for (const team of ["A", "B"] as const) {
        await page.getByRole("button", { name: new RegExp(`Start Team ${team} Round`) }).click();
        for (const q of TEAMS[team]) {
          await page.locator(`#scenario-${q.id}-text`).waitFor();
          await page.waitForTimeout(450); // let the entry animation settle
          const m = await page.evaluate((id) => {
            const fs = (el: Element | null) => (el ? parseFloat(getComputedStyle(el).fontSize) : 0);
            const section = document.querySelector("main section")!;
            const opts = [...document.querySelectorAll('[aria-label="Response options"] button')];
            return {
              cardOverflow: section.scrollHeight - section.clientHeight,
              optionsOnScreen: opts.every((b) => {
                const r = b.getBoundingClientRect();
                return r.top >= 0 && r.bottom <= innerHeight;
              }),
              optionCount: opts.length,
              questionPx: fs(document.getElementById(`scenario-${id}-text`)),
              optionPx: Math.min(...opts.map((b) => fs(b.querySelector("span.flex-1")))),
              timerPx: fs(document.querySelector('[role="timer"] .font-mono')),
            };
          }, q.id);
          const where = `Q${q.id}`;
          expect(m.optionCount, where).toBe(4);
          expect(m.optionsOnScreen, `${where}: all four options visible`).toBe(true);
          expect(m.cardOverflow, `${where}: scenario card overflows`).toBeLessThanOrEqual(2);
          expect(m.questionPx, `${where}: scenario text size`).toBeGreaterThanOrEqual(vp.width >= 1366 ? 24 : 22);
          expect(m.optionPx, `${where}: option text size`).toBeGreaterThanOrEqual(19);
          expect(m.timerPx, `${where}: timer size`).toBeGreaterThanOrEqual(34);
          await noPageScroll(page, where);
          await page.keyboard.press("A");
          await page.waitForTimeout(150);
        }
        await page.getByText(`Team ${team} decisions recorded and sealed.`).waitFor();
        await noPageScroll(page, `Team ${team} hand-over`);
      }

      await page.getByRole("button", { name: /Open After-Action Review/ }).click();
      await page.waitForTimeout(400);
      await noPageScroll(page, "AAR overview");
      for (let step = 1; step <= 14; step++) {
        await page.keyboard.press("ArrowRight");
        await page.waitForTimeout(380);
        await noPageScroll(page, `AAR step ${step}`);
      }
      await page.getByRole("button", { name: "Reveal Winner" }).click();
      await page.getByText(/wins|It’s a tie/).first().waitFor({ timeout: 6000 });
      await page.waitForTimeout(800);
      await noPageScroll(page, "winner");
      await expect(page.getByRole("button", { name: /Replay Game/ })).toBeInViewport();
    });
  });
}
