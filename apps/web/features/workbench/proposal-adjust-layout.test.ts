import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("proposal adjust layout", () => {
  it("uses the same full-width outer spacing model as the workbench and a wider edit column", () => {
    const source = readFileSync(
      new URL("../../app/workbench/proposal/configure/proposal-adjust-client-page.tsx", import.meta.url),
      "utf8"
    );

    expect(source).toContain('px-[clamp(0.75rem,1.6vw,1.5rem)] pb-10 pt-4');
    expect(source).toContain('xl:grid-cols-[minmax(0,1.08fr)_minmax(28rem,0.92fr)] 2xl:grid-cols-[minmax(0,1.02fr)_minmax(32rem,0.98fr)]');
    expect(source).not.toContain("ui-shell flex min-h-screen");
    expect(source).not.toContain('xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)] 2xl:grid-cols-[minmax(0,1.42fr)_minmax(24rem,0.58fr)]');
  });

  it("keeps export controls inside the sticky preview rail instead of reserving a top-side card", () => {
    const source = readFileSync(
      new URL("../../app/workbench/proposal/configure/proposal-adjust-client-page.tsx", import.meta.url),
      "utf8"
    );

    expect(source).toContain('<div className="mt-5 border-t hairline pt-5">');
    expect(source).toContain('>Export target<');
    expect(source).not.toContain('grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]');
  });
});
