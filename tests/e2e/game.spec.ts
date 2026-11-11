// End-to-end regression tests. A fake clock drives the 150-second timer.
// Runs against `next dev` by default (React StrictMode on), which also guards
// against duplicated timers and sounds.
import { expect, test, type Page } from "@playwright/test";
import { getQuestionsForTeam, type OptionKey, type Question } from "../../data/questions";

const TEAM = { A: getQuestionsForTeam("A"), B: getQuestionsForTeam("B") };
const ROUND = 150;
const LOCK = 900;
const KEYS: OptionKey[] = ["A", "B", "C", "D"];
const wrongKey = (q: Question) => KEYS.find((k) => k !== q.correctAnswer)!;

type Cue = { cue: string; muted: boolean; played: boolean; t: number };

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    // net::ERR_FAILED only comes from requests a test deliberately aborts.
    if (m.type() === "error" && !/favicon|Download the React DevTools|net::ERR_FAILED/.test(m.text())) errors.push(m.text());
  });
  (page as Page & { __errors?: string[] }).__errors = errors;

  await page.addInitScript(() => {
    const w = window as unknown as { __cues: unknown[]; __fs: string[] };
    w.__cues = [];
    window.addEventListener("ebola:sound", (e) => {
      const d = (e as CustomEvent).detail;
      w.__cues.push({ cue: d.cue, muted: d.muted, played: d.played, t: performance.now() });
    });
    // Headless browsers have no real fullscreen: record calls and fire the change event.
    w.__fs = [];
    let fsEl: Element | null = null;
    Object.defineProperty(Document.prototype, "fullscreenElement", { get: () => fsEl, configurable: true });
    Element.prototype.requestFullscreen = function () {
      w.__fs.push("enter");
      fsEl = this;
      document.dispatchEvent(new Event("fullscreenchange"));
      return Promise.resolve();
    };
    Document.prototype.exitFullscreen = function () {
      w.__fs.push("exit");
      fsEl = null;
      document.dispatchEvent(new Event("fullscreenchange"));
      return Promise.resolve();
    };
  });
  await page.clock.install();
});

test.afterEach(async ({ page }) => {
  expect((page as Page & { __errors?: string[] }).__errors ?? []).toEqual([]);
});

// ── helpers ─────────────────────────────────────────────────────────────────
const bodyText = (page: Page) => page.evaluate(() => document.body.innerText);
const cues = (page: Page) => page.evaluate(() => (window as unknown as { __cues: Cue[] }).__cues);

async function openGame(page: Page) {
  await page.goto("/game");
  await page.getByRole("button", { name: /Start Team A Round/ }).waitFor();
  await page.clock.pauseAt(Date.now() + 1000);
}

async function startRound(page: Page, team: "A" | "B") {
  await page.getByRole("button", { name: new RegExp(`Start Team ${team} Round`) }).click();
  await page.getByRole("timer").waitFor();
}

async function timerSeconds(page: Page) {
  const label = (await page.getByRole("timer").getAttribute("aria-label")) ?? "";
  const [m, s] = label.match(/(\d+):(\d+)/)!.slice(1).map(Number);
  return m * 60 + s;
}

async function answer(page: Page, key: OptionKey, check?: Question) {
  if (check) {
    const opts = await page.$$eval('[aria-label="Response options"] button', (bs) =>
      bs.map((b) => (b as HTMLElement).innerText.replace(/^[ABCD]\s*/, "").replace(/Option [ABCD]:\s*/, "").replace(/\s*LOCKED$/i, "").trim()),
    );
    expect(opts, `options in original order for Q${check.id}`).toEqual(KEYS.map((k) => check.options[k]));
    await expect(page.locator(`#scenario-${check.id}-text`)).toHaveText(check.question);
  }
  await page.keyboard.press(key);
  const locked = page.locator('[aria-label="Response options"] button[aria-pressed="true"]');
  await expect(locked).toHaveClass(/bg-ink/);
  // No correctness cues during play: no green/red on options, no "correct" wording in header/monitor.
  await expect(page.locator('[aria-label="Response options"] [class*="safe"], [aria-label="Response options"] [class*="alert"]')).toHaveCount(0);
  const chrome = await page.evaluate(() => [...document.querySelectorAll("header, aside")].map((e) => (e as HTMLElement).innerText).join("\n"));
  expect(chrome).not.toMatch(/\bcorrect\b/i);
  await page.clock.runFor(LOCK + 50);
}

async function expireRound(page: Page) {
  const remaining = await timerSeconds(page);
  await page.clock.runFor(remaining * 1000 + 200);
  await page.getByText("Round closed", { exact: true }).waitFor();
  await page.clock.runFor(2000);
}

async function expectSealedTransition(page: Page, team: "A" | "B", forbidden: string[] = []) {
  await page.getByText(`Team ${team} decisions recorded and sealed.`).waitFor();
  const t = await bodyText(page);
  expect(t).not.toMatch(/\bcorrect\b/i);
  expect(t).not.toMatch(/\bscore:?\s*[-−+]?\d/i);
  for (const f of forbidden) expect(t).not.toContain(f);
}

async function overviewCounts(page: Page) {
  return page.$$eval('section[aria-label$="summary"]', (secs) =>
    secs.map((s) => [...s.querySelectorAll("dd")].map((d) => Number((d as HTMLElement).innerText.trim()))),
  );
}

async function finalScores(page: Page) {
  await page.getByText(/wins|It’s a tie/).first().waitFor();
  const raw = await page.$$eval('article[aria-label$="results"]', (as) =>
    as.map((a) => (a.querySelector(".font-mono") as HTMLElement).innerText.trim()),
  );
  return raw.map((s) => Number(s.replace("−", "-").replace("+", "")));
}

async function goToLastReviewStep(page: Page) {
  for (let i = 0; i < 15; i++) await page.keyboard.press("ArrowRight");
}

// ── tests ───────────────────────────────────────────────────────────────────

test("full game: early completion, sealed hand-over, AAR, winner, restart", async ({ page }) => {
  await openGame(page);
  await startRound(page, "A");
  for (const q of TEAM.A) await answer(page, q.correctAnswer, q);
  await expectSealedTransition(page, "A", ["75", "70", "7 / 7", "7/7"]);
  await page.clock.runFor(60_000);
  await expect(page.getByRole("button", { name: /Start Team B Round/ })).toBeVisible(); // no auto-start

  await startRound(page, "B");
  await expect(page.locator("header").first()).toContainText(/team b/i);
  for (const [i, q] of TEAM.B.entries()) await answer(page, i < 2 ? wrongKey(q) : q.correctAnswer, q);
  await page.getByRole("button", { name: /Open After-Action Review/ }).click();

  expect(await overviewCounts(page)).toEqual([[7, 0, 0], [5, 2, 0]]);
  expect(await bodyText(page)).not.toMatch(/\b75\b|\b45\b/); // scores stay hidden until the reveal

  await page.keyboard.press("ArrowRight");
  for (const q of TEAM.A) {
    const t = await bodyText(page);
    expect(t).toContain(q.scenario);
    expect(t).toMatch(/selected the correct action/i);
    expect(t).toContain(q.options[q.correctAnswer]);
    expect(t).toMatch(/key learning point\s+\S/i);
    await page.keyboard.press("ArrowRight");
  }
  for (const [i, q] of TEAM.B.entries()) {
    const t = await bodyText(page);
    expect(t).toContain(q.scenario);
    if (i < 2) {
      expect(t).toContain("Incorrect");
      expect(t).toContain(q.options[wrongKey(q)]);
      expect(t).toMatch(/correct action/i);
      expect(t).toContain(q.options[q.correctAnswer]);
    } else expect(t).toMatch(/selected the correct action/i);
    if (i < 6) await page.keyboard.press("ArrowRight");
  }
  await page.getByRole("button", { name: "Facilitator notes" }).click();
  expect(await bodyText(page)).toContain(TEAM.B[6].lesson);
  await page.getByRole("tab", { name: "Team A" }).click();
  expect(await bodyText(page)).toContain("Team A · 7 of 7");
  await page.getByRole("tab", { name: "Team B" }).click();

  await page.getByRole("button", { name: "Reveal Winner" }).click();
  await page.clock.runFor(3000);
  expect(await finalScores(page)).toEqual([75, 45]);
  const w = await bodyText(page);
  expect(w).toContain("Team A wins");
  expect(w).toContain("Congratulations, Team A");
  expect(w).toMatch(/Speed bonus \+5/);
  expect(w).toMatch(/Patient Management Performance/i);
  expect(w).not.toMatch(/failed evacuation/i);
  const c = (await cues(page)).map((x) => x.cue);
  expect(c.filter((x) => x === "celebrate")).toHaveLength(1);
  expect(c.filter((x) => x === "incident")).toHaveLength(2);
  expect(c.filter((x) => x === "lock")).toHaveLength(14);
  expect(c.filter((x) => x === "riskHigh")).toHaveLength(1);
  await expect(page.locator("canvas")).toHaveCount(1); // confetti

  await page.getByRole("button", { name: "Back to review" }).click();
  expect(await bodyText(page)).toContain("Team B · 7 of 7");
  await page.getByRole("button", { name: "Reveal Winner" }).click();
  await page.clock.runFor(3000);
  await page.getByRole("button", { name: /Replay Game/ }).click();
  await startRound(page, "A");
  expect(await timerSeconds(page)).toBe(ROUND);
  expect(await bodyText(page)).toMatch(/scenario 1 of 7/i);
  await expect(page.locator("header").first()).toContainText(/score\s*0/i);
});

test("timeout with zero answers: all unanswered, tie, each timer sound exactly once", async ({ page }) => {
  await openGame(page);
  await startRound(page, "A");
  const t0 = await page.evaluate(() => performance.now());
  await page.clock.runFor((ROUND - 46) * 1000);
  await expect(page.getByRole("timer")).not.toHaveClass(/caution|alert/);
  await page.clock.runFor(1000);
  await expect(page.getByRole("timer")).toHaveClass(/caution/);
  await page.clock.runFor(25_000);
  await expect(page.getByRole("timer")).toHaveClass(/alert/);
  await expireRound(page);

  const roundCues = (await cues(page)).filter((x) => x.t >= t0 - 5).map((x) => ({ cue: x.cue, left: Math.round(ROUND - (x.t - t0) / 1000) }));
  const at = (n: string) => roundCues.filter((x) => x.cue === n).map((x) => x.left);
  expect(at("warn45")).toEqual([45]);
  expect(at("warn20")).toEqual([20]);
  expect(at("tick")).toEqual([10, 9, 8, 7, 6, 5, 4]);
  expect(at("tickFinal")).toEqual([3, 2, 1]);
  expect(at("timeout")).toHaveLength(1);
  expect(at("lock")).toHaveLength(0);

  await expectSealedTransition(page, "A");
  await startRound(page, "B");
  await expireRound(page);
  await page.getByRole("button", { name: /Open After-Action Review/ }).click();
  expect(await overviewCounts(page)).toEqual([[0, 0, 7], [0, 0, 7]]);
  await page.keyboard.press("ArrowRight");
  const t = await bodyText(page);
  expect(t).toMatch(/unanswered/i);
  expect(t).toContain("No decision — time expired");
  expect(t).toContain(TEAM.A[0].options[TEAM.A[0].correctAnswer]);
  await goToLastReviewStep(page);
  await page.getByRole("button", { name: "Reveal Winner" }).click();
  await page.clock.runFor(3000);
  expect(await finalScores(page)).toEqual([0, 0]);
  const w = await bodyText(page);
  expect(w).toContain("It’s a tie");
  expect(w).not.toMatch(/Team [AB] wins/);
  await expect(page.locator('article[aria-label$="results"] span', { hasText: /shared honours/i })).toHaveCount(2);
  expect(w.match(/Incomplete/g) ?? []).toHaveLength(2);
});

test("partial round and tie with speed bonus; mute, reduce motion, fullscreen", async ({ page }) => {
  await openGame(page);
  await page.getByRole("button", { name: "Mute sound (M)" }).click();
  await startRound(page, "A");
  for (const q of TEAM.A.slice(0, 3)) await answer(page, q.correctAnswer);
  await expireRound(page);
  const timeout = (await cues(page)).filter((x) => x.cue === "timeout");
  expect(timeout).toHaveLength(1);
  expect(timeout[0].muted && !timeout[0].played).toBe(true);

  await page.keyboard.press("m"); // unmute
  await startRound(page, "B");
  for (const [i, q] of TEAM.B.entries()) await answer(page, i < 4 ? q.correctAnswer : wrongKey(q));
  const lastLock = (await cues(page)).filter((x) => x.cue === "lock").at(-1)!;
  expect(lastLock.played && !lastLock.muted).toBe(true);

  await page.getByRole("button", { name: /Open After-Action Review/ }).click();
  expect(await overviewCounts(page)).toEqual([[3, 0, 4], [4, 3, 0]]);
  await page.getByRole("button", { name: "Reduce motion" }).click();
  expect(await page.evaluate(() => document.documentElement.dataset.reduceMotion)).toBe("true");
  await goToLastReviewStep(page);
  await page.getByRole("button", { name: "Reveal Winner" }).click();
  expect(await finalScores(page)).toEqual([30, 30]); // A: 3×10, no bonus · B: 40 − 15 + 5
  expect(await bodyText(page)).toContain("It’s a tie");
  await expect(page.locator("canvas")).toHaveCount(0); // no confetti with reduced motion

  await page.getByRole("button", { name: /^Full screen$/ }).click();
  expect(await bodyText(page)).toContain("Exit full screen");
  await page.keyboard.press("f");
  expect(await page.evaluate(() => (window as unknown as { __fs: string[] }).__fs)).toEqual(["enter", "exit"]);
});

test("a decision locked just before time-out is kept", async ({ page }) => {
  await openGame(page);
  await startRound(page, "A");
  await page.clock.runFor((ROUND - 0.5) * 1000);
  await page.keyboard.press(TEAM.A[0].correctAnswer);
  await page.clock.runFor(1200);
  await page.getByText("Round closed", { exact: true }).waitFor();
  expect(await bodyText(page)).toContain("6 scenarios recorded as unanswered");
  await page.clock.runFor(2000);
  await startRound(page, "B");
  await expireRound(page);
  await page.getByRole("button", { name: /Open After-Action Review/ }).click();
  expect(await overviewCounts(page)).toEqual([[1, 0, 6], [0, 0, 7]]);
});

test("touch taps, number keys, one-off high-risk shake, alarms never overlap", async ({ page }) => {
  await openGame(page);
  await page.getByRole("button", { name: /Start Team A Round/ }).tap();
  await page.getByRole("timer").waitFor();
  await page.locator('[aria-label="Response options"] button').nth(0).tap(); // A (wrong on Q1)
  await expect(page.locator('[aria-label="Response options"] button[aria-pressed="true"]')).toContainText(TEAM.A[0].options.A);
  await page.clock.runFor(LOCK + 50);
  await page.keyboard.press("2"); // Q2: B (wrong)
  await page.clock.runFor(LOCK + 50);
  await page.keyboard.press("1"); // Q3: A (wrong) → exposure High, outbreak Critical
  await expect(page.locator("aside .animate-shake")).toHaveCount(2);
  await page.clock.runFor(3000);
  await expect(page.locator("aside .animate-shake")).toHaveCount(0);
  await expect(page.locator("aside")).toContainText("Critical");

  await expireRound(page);
  const alarms = new Set(["incident", "warn45", "warn20", "timeout", "riskHigh", "celebrate"]);
  const list = (await cues(page)).filter((c) => alarms.has(c.cue) && c.played);
  expect(list.filter((c) => c.cue === "riskHigh")).toHaveLength(1);
  for (let i = 1; i < list.length; i++) expect(list[i].t - list[i - 1].t).toBeGreaterThanOrEqual(600);
});

test("no photographs: same-origin requests only, illustrated scene panel on every scenario", async ({ page }) => {
  const hosts = new Set<string>();
  const images: string[] = [];
  page.on("request", (r) => {
    hosts.add(new URL(r.url()).host);
    if (r.resourceType() === "image" && !/icon\.svg/.test(r.url())) images.push(r.url());
  });
  await openGame(page);
  await startRound(page, "A");
  for (const q of TEAM.A) {
    await expect(page.locator('main [role="note"][aria-label^="Scene:"]')).toHaveCount(1);
    await expect(page.locator("main img")).toHaveCount(0);
    await answer(page, q.correctAnswer, q);
  }
  expect(images).toEqual([]);
  expect([...hosts]).toEqual([new URL(page.url()).host]);
});
