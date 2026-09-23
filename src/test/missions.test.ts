import { describe, it, expect } from "vitest";
import { ALL_MISSIONS, WORLDS, FINAL_TEST, FINAL_PASS_SCORE } from "@/content/missions";

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const isStrictlyLongest = (options: string[], idx: number) =>
  options.every((o, i) => i === idx || options[idx].length > o.length);

describe("curriculum shape", () => {
  it("has 18 missions, 6 per world, with unique ids", () => {
    expect(ALL_MISSIONS).toHaveLength(18);
    WORLDS.forEach((w) => expect(w.missions).toHaveLength(6));
    expect(new Set(ALL_MISSIONS.map((m) => m.id)).size).toBe(18);
  });

  it("ends every world with a boss mission", () => {
    WORLDS.forEach((w) => expect(w.missions[w.missions.length - 1].boss).toBe(true));
  });
});

describe("reading load stays light", () => {
  it.each(ALL_MISSIONS.map((m) => [m.id, m] as const))("mission %s", (_id, m) => {
    expect(words(m.hook)).toBeLessThanOrEqual(35);
    expect(words(m.takeaway)).toBeLessThanOrEqual(20);
    m.cards.forEach((c) => {
      expect(words(c.text)).toBeLessThanOrEqual(22);
      expect(words(c.title)).toBeLessThanOrEqual(4);
    });
    const total = words(m.hook) + m.cards.reduce((a, c) => a + words(c.text), 0) + words(m.takeaway);
    expect(total).toBeLessThanOrEqual(110);
  });
});

describe("games are well-formed", () => {
  ALL_MISSIONS.forEach((m) => {
    m.games.forEach((g, gi) => {
      it(`${m.id} game ${gi + 1} (${g.kind})`, () => {
        if (g.kind === "swipe") {
          expect(g.cards.length).toBeGreaterThanOrEqual(4);
          expect(g.cards.length).toBeLessThanOrEqual(6);
          expect(g.cards.some((c) => c.side === "left")).toBe(true);
          expect(g.cards.some((c) => c.side === "right")).toBe(true);
        }
        if (g.kind === "pick") {
          expect(g.options).toHaveLength(3);
          expect(g.options.filter((o) => o.correct)).toHaveLength(1);
        }
        if (g.kind === "spot") {
          g.flags.forEach((f) => expect(g.message).toContain(f.fragment));
          expect(g.flags.filter((f) => f.isRed).length).toBeGreaterThanOrEqual(2);
          expect(g.flags.some((f) => !f.isRed)).toBe(true);
        }
        if (g.kind === "build") {
          g.slots.forEach((s) => {
            expect(s.options.length).toBeGreaterThanOrEqual(2);
            expect(s.options.filter((o) => o.strong)).toHaveLength(1);
          });
        }
        if (g.kind === "order") {
          expect(g.items.length).toBeGreaterThanOrEqual(3);
          expect(g.items.length).toBeLessThanOrEqual(5);
        }
      });
    });
  });
});

describe("answers can't be guessed from patterns", () => {
  it("every quick-fire round mixes true and false", () => {
    ALL_MISSIONS.forEach((m) => {
      const answers = m.quick.map((q) => q.answer);
      expect(answers.includes(true) && answers.includes(false), m.id).toBe(true);
    });
  });

  it("the right pick option is the longest only some of the time", () => {
    const picks = ALL_MISSIONS.flatMap((m) => m.games).filter((g) => g.kind === "pick");
    const longest = picks.filter((g) => {
      const opts = g.options.map((o) => o.text);
      return isStrictlyLongest(opts, g.options.findIndex((o) => o.correct));
    }).length;
    // Neither always nor never: both are patterns a kid can learn.
    expect(longest / picks.length).toBeGreaterThanOrEqual(0.15);
    expect(longest / picks.length).toBeLessThanOrEqual(0.45);
  });

  it("the right final-test answer is the longest only some of the time", () => {
    const longest = FINAL_TEST.filter((q) => isStrictlyLongest(q.options, q.correct)).length;
    expect(longest / FINAL_TEST.length).toBeGreaterThanOrEqual(0.1);
    expect(longest / FINAL_TEST.length).toBeLessThanOrEqual(0.45);
  });
});

describe("final test", () => {
  it("has 10 three-option questions and a pass mark of 8", () => {
    expect(FINAL_TEST).toHaveLength(10);
    FINAL_TEST.forEach((q) => expect(q.options).toHaveLength(3));
    expect(FINAL_PASS_SCORE).toBe(8);
  });
});

describe("World 3 frames AI use as supervised", () => {
  it("never recommends a specific adult AI product", () => {
    const text = JSON.stringify(ALL_MISSIONS);
    ["ChatGPT", "Claude", "Gemini", "Midjourney", "DALL-E", "ElevenLabs", "Suno", "Copilot"].forEach((name) =>
      expect(text).not.toContain(name),
    );
  });

  it("mentions age limits and doing it together", () => {
    const text = JSON.stringify(ALL_MISSIONS);
    expect(text).toMatch(/vanaf 13/);
    expect(text).toMatch(/samen met een ouder/i);
  });
});
