import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  applySplitPlans,
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot,
  type EngineMixedGeneratedCase
} from "./mixed-floor-wall-generated-test-helpers";
import type { AirborneContext, LayerInput } from "@dynecho/shared";

// Step-7 cross-mode torture matrix for the four wall cases
// added in atomic steps 3-6 (wall-masonry-brick, wall-clt-local,
// wall-lsf-knauf, wall-timber-stud). Each overlay exercises a
// user-realistic stress path:
//
//   O1 hostile-input   — bad thicknesses never crash the engine
//   O2 reorder         — symmetric stacks produce identical outputs
//   O3 save-load       — JSON round-trip preserves outputs bit-exactly
//   O4 duplicate-swap  — split-and-reverse variants equal baseline
//   O5 history-replay  — studType toggle sequence is idempotent
//
// Overlays iterate independently so regressions surface per-
// overlay. The matrix is the last gate before the step-8 final
// audit — any overlay × case cell that fails is a real bug per
// the DynEcho mission discipline (accuracy + coverage advance
// together).

const STEP_7_WALL_CASE_IDS = [
  "wall-masonry-brick",
  "wall-clt-local",
  "wall-lsf-knauf",
  "wall-timber-stud"
] as const;

type Step7WallCaseId = (typeof STEP_7_WALL_CASE_IDS)[number];

// Reorder-invariance applies cleanly only to physically
// symmetric stacks. `masonry-brick` and `clt-local` are
// [facing, core, facing] — reversal is a no-op.
// `lsf-knauf` and `timber-stud` are [2 facings, gap, fill,
// 2 facings] or [2 facings, fill, gap, 2 facings] — reversal
// flips the fill-side / gap-side arrangement of the internal
// cavity, which is physically distinguishable. For those
// cases we assert the weaker invariant: `supportedTargetOutputs`
// and `dynamicFamily` stay stable; numeric values may differ.
const SYMMETRIC_REORDER_CASE_IDS: readonly Step7WallCaseId[] = [
  "wall-masonry-brick",
  "wall-clt-local"
];

function resolveCase(id: Step7WallCaseId): EngineMixedGeneratedCase {
  const candidate = ENGINE_MIXED_GENERATED_CASES.find((entry) => entry.id === id);
  if (!candidate) {
    throw new Error(`step-7 torture matrix expects case '${id}' to exist in ENGINE_MIXED_GENERATED_CASES`);
  }
  return candidate;
}

function runLab(testCase: EngineMixedGeneratedCase, rows: readonly LayerInput[]) {
  return calculateAssembly(rows, testCase.labOptions);
}

function runField(testCase: EngineMixedGeneratedCase, rows: readonly LayerInput[]) {
  return calculateAssembly(rows, testCase.fieldOptions);
}

function snapshotBoth(testCase: EngineMixedGeneratedCase, rows: readonly LayerInput[]) {
  return {
    field: resultSnapshot(runField(testCase, rows)),
    lab: resultSnapshot(runLab(testCase, rows))
  };
}

describe("step-7 cross-mode wall extension — torture matrix", () => {
  describe.each(STEP_7_WALL_CASE_IDS)("case %s", (id) => {
    const testCase = resolveCase(id as Step7WallCaseId);

    // O1 — hostile input overlay. Corrupt one layer's thickness
    // with each of the five hostile values. The engine must not
    // crash; it must emit a result with finite or null-but-not-
    // NaN metrics and at least one warning naming the offending
    // layer or the hostile class. User-facing intent: a user
    // typing nonsense (or pasting corrupted data) does not break
    // the calculator or return silently wrong numbers.
    it("O1 hostile-input overlay keeps every hostile thickness value safe", () => {
      const hostileValues: readonly [string, number][] = [
        ["NaN", Number.NaN],
        ["Infinity", Number.POSITIVE_INFINITY],
        ["negative", -5],
        ["zero", 0],
        ["absurdly-large", 100_001]
      ];

      for (const [label, hostileValue] of hostileValues) {
        const hostileRows: LayerInput[] = testCase.rows.map((row, index) =>
          index === Math.floor(testCase.rows.length / 2)
            ? { ...row, thicknessMm: hostileValue }
            : row
        );

        const hostileResult = calculateAssembly(hostileRows, testCase.labOptions);

        // Engine returned — no crash. Metrics must be finite
        // numbers OR null-ish (fail-closed: null or undefined);
        // never NaN or Infinity silently passing through.
        const rw = hostileResult.metrics.estimatedRwDb ?? null;
        expect(rw === null || Number.isFinite(rw)).toBe(true);
        const rwPrime = hostileResult.metrics.estimatedRwPrimeDb ?? null;
        expect(rwPrime === null || Number.isFinite(rwPrime)).toBe(true);

        // Warning surface must flag hostile input at least once.
        const warningText = hostileResult.warnings.join(" ").toLowerCase();
        const hostileFlagged =
          warningText.includes("thickness") ||
          warningText.includes("layer") ||
          warningText.includes("invalid") ||
          warningText.includes("hostile") ||
          warningText.includes("material");
        expect(hostileFlagged, `[${label}] warnings: ${hostileResult.warnings.join(" | ")}`).toBe(true);
      }
    });

    // O2 — reorder overlay. Reversal behaviour depends on
    // physical symmetry:
    //   - Symmetric stacks (`[facing, core, facing]`) must
    //     produce bit-identical outputs under row reversal.
    //   - Asymmetric stacks (framed walls with distinct
    //     air-gap + fill positions) physically change under
    //     reversal; we only assert structural stability —
    //     `supportedTargetOutputs`, `dynamicFamily`, and the
    //     non-null status of each metric.
    // User-facing intent: a drag-reorder of a symmetric
    // assembly must not change the number; an asymmetric
    // reorder must still produce a defended, finite result.
    it("O2 reorder overlay preserves symmetry invariants (strict where symmetric, structural otherwise)", () => {
      const isSymmetric = SYMMETRIC_REORDER_CASE_IDS.includes(id as Step7WallCaseId);

      const baselineLab = resultSnapshot(runLab(testCase, testCase.rows));
      const baselineField = resultSnapshot(runField(testCase, testCase.rows));

      const reversed = [...testCase.rows].reverse();
      const reversedLab = resultSnapshot(runLab(testCase, reversed));
      const reversedField = resultSnapshot(runField(testCase, reversed));

      // Family + supported outputs must stay identical regardless of
      // symmetry — reversal never changes the detected topology class.
      expect(reversedLab.dynamicFamily).toBe(baselineLab.dynamicFamily);
      expect(reversedLab.supportedTargetOutputs).toEqual(baselineLab.supportedTargetOutputs);
      expect(reversedField.dynamicFamily).toBe(baselineField.dynamicFamily);
      expect(reversedField.supportedTargetOutputs).toEqual(baselineField.supportedTargetOutputs);

      if (isSymmetric) {
        expect(reversedLab.rwDb).toBe(baselineLab.rwDb);
        expect(reversedLab.c).toBe(baselineLab.c);
        expect(reversedLab.ctr).toBe(baselineLab.ctr);
        expect(reversedField.rwPrimeDb).toBe(baselineField.rwPrimeDb);
        expect(reversedField.dnTw).toBe(baselineField.dnTw);
        expect(reversedField.dnTA).toBe(baselineField.dnTA);
      } else {
        // Asymmetric: every output stays finite (no fail-closed drop)
        // even though values may differ from baseline.
        expect(Number.isFinite(reversedLab.rwDb ?? Number.NaN)).toBe(true);
        expect(Number.isFinite(reversedField.rwPrimeDb ?? Number.NaN)).toBe(true);
        expect(Number.isFinite(reversedField.dnTw ?? Number.NaN)).toBe(true);
      }
    });

    // O3 — save-load overlay. A full JSON round-trip of the
    // rows + airborneContext must preserve computed outputs
    // bit-exactly. User-facing intent: scenario persistence
    // (browser localStorage, server-side save, URL state
    // encoding) cannot corrupt the computed answer.
    it("O3 save-load overlay survives JSON round-trip of rows + airborneContext", () => {
      const baselineLab = resultSnapshot(runLab(testCase, testCase.rows));
      const baselineField = resultSnapshot(runField(testCase, testCase.rows));

      const restoredRows = JSON.parse(JSON.stringify(testCase.rows)) as LayerInput[];
      const restoredLabOptions = JSON.parse(JSON.stringify(testCase.labOptions));
      const restoredFieldOptions = JSON.parse(JSON.stringify(testCase.fieldOptions));

      const restoredLab = resultSnapshot(calculateAssembly(restoredRows, restoredLabOptions));
      const restoredField = resultSnapshot(calculateAssembly(restoredRows, restoredFieldOptions));

      expect(restoredLab).toEqual(baselineLab);
      expect(restoredField).toEqual(baselineField);
    });

    // O4 — duplicate-swap overlay. For the single-split-plan
    // cases (masonry, CLT, LSF, timber-stud), exhaust the
    // 2^N reverse-mask grid on the splitPlans' parts: forward
    // and reversed parts must produce identical outputs on both
    // lab and field because each split is physically symmetric
    // (equal halves of the same material).
    it("O4 duplicate-swap overlay keeps split-plan parts reversible without drift", () => {
      const baseline = snapshotBoth(testCase, applySplitPlans(testCase.rows, testCase.splitPlans));

      for (let mask = 0; mask < 1 << testCase.splitPlans.length; mask += 1) {
        const reversedPlans = testCase.splitPlans.map((plan, index) =>
          mask & (1 << index)
            ? { ...plan, parts: [...plan.parts].reverse() }
            : plan
        );
        const variantRows = applySplitPlans(testCase.rows, reversedPlans);
        const variant = snapshotBoth(testCase, variantRows);
        expect(variant.lab, `lab mask=${mask}`).toEqual(baseline.lab);
        expect(variant.field, `field mask=${mask}`).toEqual(baseline.field);
      }
    });

    // O5 — edit-history replay overlay. For the framed-wall
    // cases with a studType context (LSF, timber stud), a
    // user-style toggle sequence (LSF → wood_stud → LSF, or
    // wood_stud → LSF → wood_stud) must be idempotent when the
    // same context is restored. Simulates workbench-side edit
    // history: restoring a historical scenario produces the
    // identical engine output to computing it freshly.
    //
    // Non-framed cases (masonry, CLT) skip this overlay — they
    // do not carry studType so toggling does not apply.
    it("O5 history-replay overlay is idempotent under studType toggle", () => {
      const framedContext = testCase.labOptions.airborneContext as AirborneContext | undefined;
      if (!framedContext || framedContext.studType == null) {
        expect(true, "non-framed case skips O5").toBe(true);
        return;
      }

      const toggleStudType: AirborneContext["studType"] =
        framedContext.studType === "light_steel_stud" ? "wood_stud" : "light_steel_stud";

      const toggledContext = { ...framedContext, studType: toggleStudType };
      const baselineContext = framedContext;

      const first = resultSnapshot(
        calculateAssembly(testCase.rows, { ...testCase.labOptions, airborneContext: baselineContext })
      );
      // Middle call toggles to the other studType — represents
      // a user briefly changing the context during an edit
      // session. Nothing is asserted on this call; we only care
      // that the engine produces the original output when
      // restoring the baseline.
      calculateAssembly(testCase.rows, { ...testCase.labOptions, airborneContext: toggledContext });
      const restored = resultSnapshot(
        calculateAssembly(testCase.rows, { ...testCase.labOptions, airborneContext: baselineContext })
      );

      expect(restored).toEqual(first);
    });
  });
});
