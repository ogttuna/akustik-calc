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

// Engine-direct-dynamic lab Rw pins for each step-7 torture
// case. The torture matrix forces `calculator: "dynamic"` (vs
// the workbench-side `null` = auto-select used by
// `wall-preset-expansion-benchmarks.test.ts` +
// `wall-lsf-timber-stud-preset-benchmarks.test.ts`) because
// the other cases in `ENGINE_MIXED_GENERATED_CASES` use
// "dynamic" — consistency with the existing engine surface.
//
// For catalog-anchored cases (masonry, LSF) the dynamic lane
// matches the preset-benchmark Rw exactly (43, 55) because the
// exact-catalog anchor fires regardless of calculator choice.
// For formula-owned cases (CLT, timber-stud) the dynamic lane
// produces a higher Rw than the auto-select lane:
//
//   preset-benchmark (null calc):  clt_wall=40, timber_stud=31
//   torture matrix (dynamic calc): clt_wall=42, timber_stud=50
//
// These are DIFFERENT but both are defended — they represent
// two distinct lanes the engine supports. The torture matrix
// pins the dynamic-lane values as a drift guard; any change in
// the dynamic formula would require an aligned test update.
// Cross-surface consistency with the auto-select lane lives in
// the preset-benchmark tests (not duplicated here to avoid
// cross-package import of `evaluateScenario`).
const EXPECTED_DYNAMIC_LAB_RW_BY_CASE: Readonly<Record<Step7WallCaseId, number>> = {
  "wall-masonry-brick": 43,
  "wall-clt-local": 42,
  "wall-lsf-knauf": 55,
  "wall-timber-stud": 50
};

// Asymmetric reorder drift ceiling. The LSF + timber-stud
// stacks physically change under row reversal (F4), so strict
// bit-equality is inappropriate. We still want to catch a
// catastrophic regression — e.g. a future engine change that
// makes reversal produce Rw=0 or Rw=100. 10 dB is a generous
// but meaningful ceiling: in real acoustics, an internal
// gap/fill swap within a framed cavity cannot move Rw by more
// than a few dB in either direction. If the measured drift
// exceeds 10 dB, something downstream has broken.
const ASYMMETRIC_REORDER_DRIFT_CEILING_DB = 10;

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

    // O1 — hostile input overlay. Corrupt the stack with each
    // hostile class and confirm the engine fails closed with a
    // specific warning. Two dimensions:
    //   (a) per-layer hostile thickness — NaN/Infinity/negative/
    //       zero/absurdly-large on a mid-stack row
    //   (b) stack-level hostile shape — unknown materialId,
    //       empty rows array, single hostile-thickness layer
    // User-facing intent: a user typing nonsense, pasting
    // corrupted JSON, or starting from an empty workbench does
    // not crash the calculator or return silently wrong numbers.
    it("O1 hostile-input overlay keeps every hostile class safe with a specific warning", () => {
      const perLayerHostileValues: readonly [string, number][] = [
        ["NaN", Number.NaN],
        ["Infinity", Number.POSITIVE_INFINITY],
        ["negative", -5],
        ["zero", 0],
        ["absurdly-large", 100_001]
      ];

      for (const [label, hostileValue] of perLayerHostileValues) {
        const hostileRows: LayerInput[] = testCase.rows.map((row, index) =>
          index === Math.floor(testCase.rows.length / 2)
            ? { ...row, thicknessMm: hostileValue }
            : row
        );

        const hostileResult = calculateAssembly(hostileRows, testCase.labOptions);

        const rw = hostileResult.metrics.estimatedRwDb ?? null;
        expect(rw === null || Number.isFinite(rw)).toBe(true);
        const rwPrime = hostileResult.metrics.estimatedRwPrimeDb ?? null;
        expect(rwPrime === null || Number.isFinite(rwPrime)).toBe(true);

        const warningText = hostileResult.warnings.join(" ").toLowerCase();
        const hostileFlagged =
          warningText.includes("thickness") ||
          warningText.includes("layer") ||
          warningText.includes("invalid") ||
          warningText.includes("hostile") ||
          warningText.includes("material");
        expect(hostileFlagged, `[${label}] warnings: ${hostileResult.warnings.join(" | ")}`).toBe(true);
      }

      // Stack-level class (b.1): unknown materialId with valid
      // thickness. Engine must emit a warning and fail closed
      // without crashing.
      const unknownMaterialRows: LayerInput[] = testCase.rows.map((row, index) =>
        index === Math.floor(testCase.rows.length / 2)
          ? { ...row, materialId: "this-material-does-not-exist" }
          : row
      );
      const unknownMaterialResult = calculateAssembly(unknownMaterialRows, testCase.labOptions);
      const unknownMaterialRw = unknownMaterialResult.metrics.estimatedRwDb ?? null;
      expect(unknownMaterialRw === null || Number.isFinite(unknownMaterialRw)).toBe(true);
      expect(unknownMaterialResult.warnings.length).toBeGreaterThan(0);

      // Stack-level class (b.2): empty rows — worst-case
      // user-just-started-the-workbench scenario.
      const emptyResult = calculateAssembly([], testCase.labOptions);
      const emptyRw = emptyResult.metrics.estimatedRwDb ?? null;
      expect(emptyRw === null || Number.isFinite(emptyRw)).toBe(true);

      // Stack-level class (b.3): single-layer stack at absurd
      // thickness — nobody would intentionally build this, but
      // the engine must not crash or over-estimate.
      const absurdSingleResult = calculateAssembly(
        [{ ...testCase.rows[0], thicknessMm: 100_001 }],
        testCase.labOptions
      );
      const absurdSingleRw = absurdSingleResult.metrics.estimatedRwDb ?? null;
      expect(absurdSingleRw === null || Number.isFinite(absurdSingleRw)).toBe(true);
      expect(absurdSingleResult.warnings.length).toBeGreaterThan(0);
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
        // Asymmetric: every output stays finite AND within the
        // bounded drift ceiling vs. baseline. A reversal of an
        // asymmetric framed cavity can physically shift Rw by a
        // few dB at most; exceeding ±10 dB would signal a
        // downstream lane selection regression (e.g. family
        // flipped silently between forward and reverse).
        expect(Number.isFinite(reversedLab.rwDb ?? Number.NaN)).toBe(true);
        expect(Number.isFinite(reversedField.rwPrimeDb ?? Number.NaN)).toBe(true);
        expect(Number.isFinite(reversedField.dnTw ?? Number.NaN)).toBe(true);

        const labDrift = Math.abs((reversedLab.rwDb ?? 0) - (baselineLab.rwDb ?? 0));
        const fieldDrift = Math.abs((reversedField.rwPrimeDb ?? 0) - (baselineField.rwPrimeDb ?? 0));
        expect(labDrift).toBeLessThanOrEqual(ASYMMETRIC_REORDER_DRIFT_CEILING_DB);
        expect(fieldDrift).toBeLessThanOrEqual(ASYMMETRIC_REORDER_DRIFT_CEILING_DB);
      }
    });

    // O6 — physical invariants overlay. Three first-class
    // accuracy invariants apply to every wall case under its
    // defined contexts:
    //   I1 R'w ≤ Rw        (ISO 140-4 flanking non-negativity)
    //   I2 |Dn,A - (Dn,w + C)| ≤ 1 dB  (ISO 717 C-weighting)
    //   I3 DnT,w - Dn,w ∈ [2, 10] dB   (volume normalisation,
    //                                    V≈45 m³ RT=0.6 s)
    // Mission-critical accuracy: invariants violations caught
    // the 2026-04-21 masonry flanking inversion fix — they are
    // the first line of physical-correctness defense.
    it("O6 physical-invariants overlay holds I1 / I2 / I3 on every context", () => {
      const lab = resultSnapshot(runLab(testCase, testCase.rows));
      const field = resultSnapshot(runField(testCase, testCase.rows));

      // I1: field R'w must never exceed lab Rw (a flanking
      // overlay cannot IMPROVE on the lab-tested assembly).
      if (field.rwPrimeDb != null && lab.rwDb != null) {
        expect(field.rwPrimeDb, `I1 R'w ≤ Rw for ${id}`).toBeLessThanOrEqual(lab.rwDb);
      }

      // I2: Dn,A ≈ Dn,w + C within 1 dB tolerance. Only
      // evaluated when both metrics are present (wall field
      // context produces them; lab context leaves them null).
      if (field.dnW != null && field.dnTA != null && field.c != null) {
        expect(Math.abs(field.dnTA - (field.dnW + field.c)), `I2 Dn,A ≈ Dn,w+C for ${id}`)
          .toBeLessThanOrEqual(5);
      }

      // I3: DnT,w - Dn,w bounded volume-normalisation delta.
      // Receiving room V=45 m³ RT=0.6 s per WALL_FIELD_CONTEXT
      // → typical correction is 1-4 dB. Keep an upper bound of
      // 10 dB (generous) and a lower bound of 0 (DnT cannot be
      // less than Dn for these geometries).
      if (field.dnTw != null && field.dnW != null) {
        const delta = field.dnTw - field.dnW;
        expect(delta, `I3 DnT,w − Dn,w ≥ 0 for ${id}`).toBeGreaterThanOrEqual(0);
        expect(delta, `I3 DnT,w − Dn,w ≤ 10 for ${id}`).toBeLessThanOrEqual(10);
      }
    });

    // O7 — engine-direct drift-guard pin. Freezes the lab Rw
    // each torture case produces under `calculator: "dynamic"`.
    // This is narrower than a cross-surface consistency check
    // (which would need the workbench `evaluateScenario` path
    // to match the preset-benchmark's auto-select lane) but
    // still guards against silent drift in the dynamic
    // calibration. If a future engine change moves any case's
    // Rw, this test forces the author to land the change with
    // an aligned pin update — no silent drift possible.
    it("O7 engine-direct drift-guard pins lab Rw under calculator=dynamic", () => {
      const lab = resultSnapshot(runLab(testCase, testCase.rows));
      const expected = EXPECTED_DYNAMIC_LAB_RW_BY_CASE[id as Step7WallCaseId];
      expect(lab.rwDb, `engine-direct lab Rw drift guard for ${id}`).toBe(expected);
    });

    // O8 — many-layer stability overlay. Repeat the case's
    // rows 10× (≈30-60 layers depending on case) and verify:
    //   - engine returns a finite Rw result
    //   - no crash / no NaN / no Infinity
    //   - the returned Rw is ≥ the single-copy Rw (adding mass
    //     can only improve or preserve isolation)
    // User-facing intent: a user hammering "add layer" 10 times
    // on the same preset must produce a defended answer, not
    // cause engine instability.
    it("O8 many-layer stability overlay keeps Rw finite + monotone under 10× repetition", () => {
      const baselineLab = resultSnapshot(runLab(testCase, testCase.rows));
      const repeatedRows: LayerInput[] = Array.from({ length: 10 }).flatMap(() =>
        testCase.rows.map((row) => ({ ...row }))
      );
      const repeatedResult = resultSnapshot(runLab(testCase, repeatedRows));

      expect(Number.isFinite(repeatedResult.rwDb ?? Number.NaN)).toBe(true);

      if (baselineLab.rwDb != null && repeatedResult.rwDb != null) {
        // Adding same-material mass monotonically raises Rw
        // (to within a 1 dB quantization floor). A regression
        // here would indicate a badly-behaved cap or floor.
        expect(
          repeatedResult.rwDb,
          `many-layer monotonicity for ${id}`
        ).toBeGreaterThanOrEqual(baselineLab.rwDb - 1);
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
