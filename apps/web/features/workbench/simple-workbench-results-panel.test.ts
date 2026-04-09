import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("simple workbench results panel", () => {
  it("keeps the hero stack vertical inside the narrow workbench results rail", () => {
    const source = readFileSync(new URL("./simple-workbench-results-panel.tsx", import.meta.url), "utf8");

    expect(source).toContain('3xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]');
    expect(source).toContain('<ResultAnswerChart layout="stacked"');
    expect(source).toContain('responseCurves.length > 1 ? "2xl:grid-cols-2" : ""');
    expect(source).not.toContain('mt-5 grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]');
  });
});
