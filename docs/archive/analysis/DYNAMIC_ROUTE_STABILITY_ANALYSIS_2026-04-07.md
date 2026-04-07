# Dynamic Route Stability Analysis — 2026-04-07

Historical note:

- this is a dated investigation log
- use it together with `docs/calculator/CURRENT_STATE.md` and `docs/calculator/DYNAMIC_CALCULATOR_PLAN.md`
- treat it as evidence for the current hardening backlog, not as the living contract by itself
- Phase A remediation for the reproduced wall-side instability class has since landed; the living status and shipped guard set now live under:
  - `docs/calculator/DYNAMIC_WALL_STABILITY_REMEDIATION.md`

## 1. Why This Note Exists

This pass was run to answer a narrow question:

- are the previously reported large `Rw` / `R'w` / `DnT,w` jumps on duplicate and reorder operations still reproducible on the current repo?

Short answer:

- some old drift classes are defended now
- the broad residual problem is not fully closed
- current wall-side dynamic behavior can still jump by very large amounts when the same visible package is duplicated or slightly reordered

## 2. Scope

This pass focused on:

- `dynamic` airborne behavior for wall-like arbitrary layer stacks
- workbench-facing edit paths that a user can actually perform:
  - duplicate
  - move up / move down
  - contiguous split
- the gap between current regression coverage and actual dynamic-route behavior

This pass did not implement a fix.

## 3. What Was Verified First

These targeted packs were run first and are still useful guardrails:

```bash
pnpm exec vitest run \
  packages/engine/src/output-perturbation-sweep.test.ts \
  packages/engine/src/dynamic-guided-combination-sweep.test.ts \
  packages/engine/src/airborne-masonry-regression.test.ts

pnpm -C apps/web exec vitest run --config vitest.config.ts \
  features/workbench/wall-seeded-edit-stability.test.ts \
  features/workbench/floor-seeded-edit-stability.test.ts \
  features/workbench/floor-stack-invariance.test.ts \
  features/workbench/complex-stack-audit.test.ts
```

Important nuance:

- these suites passing does not prove that the dynamic wall route is stable for arbitrary deep stacks
- several workbench tests call `evaluateScenario(...)` without passing `calculator: "dynamic"`
- `calculateAssembly(...)` only enters the dynamic airborne branch when `options.calculator === "dynamic"`

Relevant code paths:

- `packages/engine/src/calculate-assembly.ts`
- `apps/web/features/workbench/scenario-analysis.ts`
- `apps/web/features/workbench/workbench-shell.tsx`
- `apps/web/features/workbench/simple-workbench-shell.tsx`

## 4. Current State Of The Existing Guards

The current repo already defends some narrow classes correctly:

- floor-side contiguous split parity is covered
- the simple heavy-floor top-side package has deterministic canonicalization
- wall mineral-wool contiguous split parity has a dedicated audit
- outer compliant layers around single-leaf masonry are trimmed explicitly before wall-family selection

Those gains are real and should not be understated.

However, the current living docs already say the remaining open work is broader:

- reorder canonicalization is intentionally narrow
- broad mixed floor / wall torture work is still open
- duplicate / reorder / split / partial-edit cycles still need wider audit coverage

That document judgement is consistent with the reproduced behavior below.

## 5. Main Finding

The residual instability is not primarily a bad logarithm implementation.

The reproduced jumps come from abrupt topology reinterpretation:

- one small visible-stack change can move the wall between:
  - `masonry_nonhomogeneous`
  - `double_leaf`
  - `stud_wall_system`
  - `multileaf_multicavity`
- once the detected family changes, the selected delegate blend and correction corridor also change
- that branch switch can move the single-number result by far more than a user would expect from a small visible edit

In other words:

- the arithmetic is finite
- the route selection is too topology-sensitive for some arbitrary stacks

## 6. Reproduced Workbench-Like Cases

The following cases were reproduced using `calculateAssembly(..., { calculator: "dynamic" })` with the same kind of wall field context the workbench shells provide for wall studies:

- `contextMode = "building_prediction"`
- `panelHeightMm = 2800`
- `panelWidthMm = 3600`
- `receivingRoomRt60S = 0.6`
- `receivingRoomVolumeM3 = 45`

### 6.1 Duplicate Jump

Base stack:

- `rockwool:50 | rockwool:50 | security_board:12.5 | ytong_aac_d700:100 | air_gap:50`

Observed result:

- lab `Rw = 36`
- field `R'w = 34`
- field `DnT,w = 36`
- detected family: `masonry_nonhomogeneous`
- strategy: `masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap`

Duplicated stack:

- the same 5 visible rows appended again, giving 10 rows total

Observed result:

- lab `Rw = 55`
- field `R'w = 55`
- field `DnT,w = 56`
- detected family: `double_leaf`
- strategy: `double_leaf_porous_fill_delegate`

Observed jump:

- `Rw: +19 dB`
- `R'w: +21 dB`
- `DnT,w: +20 dB`

This is the closest current repo reproduction of the user complaint:

- “the same 5-layer package is added again and the single-number result jumps far too much”

### 6.2 Move Jump

Base stack:

- `security_board:12.5 | rockwool:50 | security_board:12.5 | ytong_aac_d700:100 | rockwool:50`

Observed result:

- lab `Rw = 51`
- field `R'w = 49`
- field `DnT,w = 50`
- detected family: `double_leaf`
- strategy: `double_leaf_porous_fill_delegate`

Moved stack:

- move only the `rockwool:50` row from position 2 to position 1
- resulting visible order:
  - `rockwool:50 | security_board:12.5 | security_board:12.5 | ytong_aac_d700:100 | rockwool:50`

Observed result:

- lab `Rw = 37`
- field `R'w = 35`
- field `DnT,w = 37`
- detected family: `masonry_nonhomogeneous`
- strategy: `masonry_nonhomogeneous_blend+aac_massive_calibration+masonry_davy_cap`

Observed jump:

- `Rw: -14 dB`
- `R'w: -14 dB`
- `DnT,w: -13 dB`

This is the current repo reproduction of the user complaint:

- “a layer is moved in the order and the result jumps far too much”

## 7. Stronger Engine-Level Stress Reproduction

The same class becomes even more obvious when the dynamic route is forced with explicit framed-wall metadata.

### 7.1 Duplicate Jump Under Explicit Dynamic Metadata

Base stack:

- `concrete:80 | pumice_block:100 | air_gap:50 | gypsum_board:12.5 | concrete:80`

Observed result:

- lab `Rw = 34`
- field `R'w = 26`
- field `DnT,w = 27`
- detected family: `stud_wall_system`

Duplicated stack:

- the same 5 visible rows appended again

Observed result:

- lab `Rw = 66`
- field `R'w = 58`
- field `DnT,w = 59`
- detected family: `multileaf_multicavity`

Observed jump:

- `Rw: +32 dB`
- `R'w: +32 dB`
- `DnT,w: +32 dB`

### 7.2 Move Jump Under Explicit Dynamic Metadata

Base stack:

- `air_gap:50 | concrete:80 | ytong_aac_d700:100 | concrete:80 | firestop_board:15`

Observed result:

- lab `Rw = 61`
- field `R'w = 53`
- field `DnT,w = 54`
- detected family: `masonry_nonhomogeneous`

Moved stack:

- move only the first `concrete:80` upward
- resulting visible order:
  - `concrete:80 | air_gap:50 | ytong_aac_d700:100 | concrete:80 | firestop_board:15`

Observed result:

- lab `Rw = 34`
- field `R'w = 26`
- field `DnT,w = 27`
- detected family: `stud_wall_system`

Observed jump:

- `Rw: -27 dB`
- `R'w: -27 dB`
- `DnT,w: -27 dB`

This stronger reproduction is useful because it isolates the root mechanism clearly:

- the jump is a family handoff problem
- not a small output overlay drift

## 8. How To Reproduce Manually

### 8.1 Workbench-Like Duplicate And Move Cases

Run this from repo root:

```bash
pnpm exec tsx <<'TS'
import { calculateAssembly } from "./packages/engine/src";

const FIELD_CONTEXT = {
  contextMode: "building_prediction" as const,
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const CASES = [
  {
    id: "duplicate_base",
    layers: [
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "security_board", thicknessMm: 12.5 },
      { materialId: "ytong_aac_d700", thicknessMm: 100 },
      { materialId: "air_gap", thicknessMm: 50 }
    ]
  },
  {
    id: "duplicate_changed",
    layers: [
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "security_board", thicknessMm: 12.5 },
      { materialId: "ytong_aac_d700", thicknessMm: 100 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "security_board", thicknessMm: 12.5 },
      { materialId: "ytong_aac_d700", thicknessMm: 100 },
      { materialId: "air_gap", thicknessMm: 50 }
    ]
  },
  {
    id: "move_base",
    layers: [
      { materialId: "security_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "security_board", thicknessMm: 12.5 },
      { materialId: "ytong_aac_d700", thicknessMm: 100 },
      { materialId: "rockwool", thicknessMm: 50 }
    ]
  },
  {
    id: "move_changed",
    layers: [
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "security_board", thicknessMm: 12.5 },
      { materialId: "security_board", thicknessMm: 12.5 },
      { materialId: "ytong_aac_d700", thicknessMm: 100 },
      { materialId: "rockwool", thicknessMm: 50 }
    ]
  }
];

for (const testCase of CASES) {
  const lab = calculateAssembly(testCase.layers, {
    airborneContext: { contextMode: "element_lab" },
    calculator: "dynamic",
    targetOutputs: ["Rw"]
  });

  const field = calculateAssembly(testCase.layers, {
    airborneContext: FIELD_CONTEXT,
    calculator: "dynamic",
    targetOutputs: ["R'w", "DnT,w"]
  });

  console.log(JSON.stringify({
    id: testCase.id,
    rw: lab.metrics.estimatedRwDb,
    rwPrime: field.metrics.estimatedRwPrimeDb,
    dnTw: field.metrics.estimatedDnTwDb,
    family: field.dynamicAirborneTrace?.detectedFamily ?? lab.dynamicAirborneTrace?.detectedFamily ?? null,
    strategy: field.dynamicAirborneTrace?.strategy ?? lab.dynamicAirborneTrace?.strategy ?? null
  }, null, 2));
}
TS
```

Expected symptom:

- the duplicate case should jump from the mid-30s into the mid-50s
- the move case should drop from about `50` into the high-30s

### 8.2 Explicit Dynamic Stress Reproduction

Run this from repo root:

```bash
pnpm exec tsx <<'TS'
import { calculateAssembly } from "./packages/engine/src";

const LAB_CONTEXT = {
  contextMode: "element_lab" as const,
  airtightness: "good" as const,
  connectionType: "line_connection" as const,
  studSpacingMm: 600,
  studType: "light_steel_stud" as const
};

const FIELD_CONTEXT = {
  contextMode: "building_prediction" as const,
  airtightness: "good" as const,
  connectionType: "line_connection" as const,
  electricalBoxes: "none" as const,
  junctionQuality: "good" as const,
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  penetrationState: "none" as const,
  perimeterSeal: "good" as const,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent" as const,
  studSpacingMm: 600,
  studType: "light_steel_stud" as const
};

const CASES = [
  {
    id: "duplicate_base",
    layers: [
      { materialId: "concrete", thicknessMm: 80 },
      { materialId: "pumice_block", thicknessMm: 100 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "concrete", thicknessMm: 80 }
    ]
  },
  {
    id: "duplicate_changed",
    layers: [
      { materialId: "concrete", thicknessMm: 80 },
      { materialId: "pumice_block", thicknessMm: 100 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "concrete", thicknessMm: 80 },
      { materialId: "concrete", thicknessMm: 80 },
      { materialId: "pumice_block", thicknessMm: 100 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "concrete", thicknessMm: 80 }
    ]
  }
];

for (const testCase of CASES) {
  const lab = calculateAssembly(testCase.layers, {
    airborneContext: LAB_CONTEXT,
    calculator: "dynamic",
    targetOutputs: ["Rw"]
  });

  const field = calculateAssembly(testCase.layers, {
    airborneContext: FIELD_CONTEXT,
    calculator: "dynamic",
    targetOutputs: ["R'w", "DnT,w"]
  });

  console.log(JSON.stringify({
    id: testCase.id,
    rw: lab.metrics.estimatedRwDb,
    rwPrime: field.metrics.estimatedRwPrimeDb,
    dnTw: field.metrics.estimatedDnTwDb,
    family: field.dynamicAirborneTrace?.detectedFamily ?? lab.dynamicAirborneTrace?.detectedFamily ?? null,
    strategy: field.dynamicAirborneTrace?.strategy ?? lab.dynamicAirborneTrace?.strategy ?? null
  }, null, 2));
}
TS
```

Expected symptom:

- the duplicated case should jump by roughly `30 dB`
- the detected family should switch from `stud_wall_system` to `multileaf_multicavity`

## 9. Why Current Tests Miss This

Three separate reasons matter here:

1. Some existing workbench tests exercise `evaluateScenario(...)` without `calculator: "dynamic"`, so they stay on screening behavior instead of the dynamic topology selector.
2. Existing split / invariance audits are intentionally narrow and mostly contiguous-split oriented.
3. The remaining reproduced issue appears mainly on hybrid wall stacks that mix masonry-like mass, board layers, and compliant layers in ambiguous orderings.

The current docs already warned about exactly this class:

- narrow deterministic normalization is acceptable only where the final package should truly be path-invariant
- broader mixed wall/floor torture work still has to decide what is genuinely invariant and what is not

## 10. External Sanity Check

Two external references were used as sanity context:

- HUD Noise Guidebook:
  - doubling partition thickness is described as giving up to about `6 dB`
  - resilient attachments are described as roughly `2-5 dB`
  - acoustical blankets in lightweight construction can add larger benefits, but not the kind of `20-30 dB` single-number jump reproduced above
  - source: https://www.huduser.gov/portal/portal/sites/default/files/pdf/The-Noise-Guidebook.pdf
- Wang et al. 2023:
  - changing layer order can change overall `Rw`
  - the paper reports meaningful effects, but not the size of jump reproduced here on the single-number result
  - source: https://www.mdpi.com/1996-1944/16/10/3862

Important interpretation note:

- the second paper is not a building partition standard reference
- it was used only as a supporting “layer order can matter, but the current jump size is still suspicious” check

## 11. Practical Conclusion

The current repo status should be read as:

- contiguous split hardening: partially defended
- narrow floor canonicalization: defended
- broad wall duplicate / reorder dynamic stability: still open

The next implementation pass after the direct repro guards should tighten family handoff rules or normalization only for combinations that should truly be path-invariant.

## 12. Follow-Up Added After This Note

Direct reproduction tests and small-variation matrices for the cases in Sections 6 and 7 now live at:

- `apps/web/features/workbench/dynamic-route-instability.test.ts`
- `packages/engine/src/dynamic-airborne-instability-repro.test.ts`

These tests intentionally preserve executable reproductions of the current jumps. They are evidence guards, not fix-validation guards yet.
