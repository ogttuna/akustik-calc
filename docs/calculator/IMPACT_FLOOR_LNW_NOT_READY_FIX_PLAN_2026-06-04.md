# Impact Floor `Ln,w Not ready` Fix Plan - 2026-06-04

Status: implemented and production-validated on 2026-06-04. Treat the
original plan below as the design record; the implementation closeout
section records the current source of truth.

Related analysis:

- `docs/calculator/ENGINE_RESEARCH_ALIGNMENT_NOTE_2026-06-04.md`
- `docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts`
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts`

External reference check:

- ISO 12354-2 confirms impact prediction is an estimation route from
  element performance and structural propagation data, not a UI-state
  catalog lookup: `https://www.iso.org/standard/70243.html`.
- ISO 10140-3 confirms lab impact measurements apply to floor assemblies
  and are not directly field results without accounting for flanking and
  boundary conditions: `https://www.iso.org/standard/79483.html`.
- ISO 9052-1 confirms dynamic stiffness is a specific floating-floor
  material input, so missing dynamic stiffness cannot be silently guessed:
  `https://www.iso.org/standard/16620.html`.
- CadnaB and AcouBAT product pages reinforce the professional-tool bar:
  ISO 12354-style calculation, structured element data, and explicit
  building context rather than hidden UI defaults.

## Objective

Fix the workbench path where the visible `heavy_concrete_impact_floor`
preset can show `Impact Floor / Ln,w Not ready` because a blank/default
heavy-concrete combined input surface shadows the already-owned
published upper-treatment `Ln,w` answer.

The fix must preserve the answer-engine principle:

- owned visible-stack `Ln,w` anchors stay live;
- formula outputs that genuinely require missing physical fields stay
  stopped or warned;
- complete explicit physical input still promotes the combined
  upper/lower formula;
- unsafe topology remains fail-closed;
- ISO/ASTM and lab/field/building bases stay separate.

## Implementation Closeout - 2026-06-04

The fix was implemented in
`apps/web/features/workbench/scenario-analysis.ts` by adding the
route-scoped bridge rule:

```ts
shouldForwardHeavyConcreteCombinedImpactPredictor(surface)
```

Only heavy-concrete combined impact surfaces with
`ready_for_formula_corridor` or `unsafe_topology` status are forwarded as
explicit `impactPredictorInput`. `needs_input` heavy-concrete surfaces
still produce missing-input warnings, but they no longer shadow the
visible-stack published upper-treatment `Ln,w` anchor. Steel and
timber/CLT bridge behavior was left unchanged.

The regression was added in
`apps/web/features/workbench/heavy-concrete-combined-impact-input-surface-acceptance.test.ts`
using the real `heavy_concrete_impact_floor` preset rows. It proves:

- no-surface, blank-surface, and partial-surface preset scenarios keep
  the published upper-treatment `Ln,w` anchor live;
- blank and partial surfaces still show missing dynamic stiffness, load
  basis, and lower ceiling guidance;
- complete heavy-concrete input still promotes the combined formula
  corridor;
- unsafe topology remains parked;
- API payloads do not promote ASTM/field outputs from the lab ISO formula.

Checkpoint verification passed:

```bash
pnpm --dir apps/web exec vitest run \
  features/workbench/heavy-concrete-combined-impact-input-surface-acceptance.test.ts \
  --maxWorkers=1
```

The broader assistant/report checkpoint later reran this file as part of
an 18-file web Vitest packet: `135` tests passed.

The two target engine contracts also passed:

```bash
pnpm --dir packages/engine exec vitest run \
  src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts \
  src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts \
  --maxWorkers=1
```

Result: `2` engine files / `11` tests passed.

Production validation also passed through the report-assistant smoke
matrix. `Impact Floor` now appears in live `floor-rw`, `floor-lnw`, and
`floor-deltalw` cases, each with numeric metric context and non-mutating
patch preview coverage.

## Confirmed Failure Mode - Historical Pre-Fix

The relevant workbench bridge is
`apps/web/features/workbench/scenario-analysis.ts`.

Pre-fix behavior:

```text
activeInputSurfacePredictors includes every surface whose status is not
"inactive".
```

That includes `heavyConcreteCombinedImpactInputSurface.status ===
"needs_input"`. A blank workbench surface therefore creates an explicit
predictor input and passes it to `calculateAssembly`, which prevents the
normal visible-layer resolver from selecting the Gate CG2 published
upper-treatment anchor.

Current implementation comparison:

| Layer | Current behavior | Correct behavior for this fix |
| --- | --- | --- |
| Engine visible-layer route | Gate CG2 keeps published `Ln,w` live while parking only missing-input companions. | Keep unchanged. |
| Engine explicit combined route | Complete predictor input promotes combined formula; incomplete predictor input parks formula. | Keep unchanged. |
| Workbench warning surface | Blank/partial heavy surface emits missing-input guidance. | Keep unchanged. |
| Workbench predictor forwarding | Any non-`inactive` heavy surface is forwarded, including `needs_input`. | Forward only `ready_for_formula_corridor` and `unsafe_topology`. |
| Output cards/report | Reflect whatever route `calculateAssembly` selected. | Must show published anchor for blank/default surface and combined formula for complete surface. |

Runtime spot check on the actual `heavy_concrete_impact_floor` preset:

```text
preset_no_surface:
  basis: predictor_heavy_concrete_published_upper_treatment_estimate
  Ln,w: 50
  DeltaLw: 33.4
  supported: Rw, Ln,w, DeltaLw
  unsupported: Ln,w+CI

preset_empty_surface:
  supported: Rw
  unsupported: Ln,w, DeltaLw, Ln,w+CI
```

## Non-Goals

Do not retune acoustic formulas.

Do not change `packages/engine/src/*` for this fix unless a targeted
regression proves the bridge-only plan is insufficient.

Do not change steel-floor or timber/CLT input-surface behavior in this
slice. They have separate surface contracts and should not be swept into
this bug fix.

Do not seed hidden defaults for dynamic stiffness, load basis, lower
ceiling assembly, or slab density.

Do not convert `Ln,w` to `IIC`, lab values to field values, or
field/building outputs to lab values.

Do not suppress missing-input warnings. The warning is useful; the bug is
that the warning's partial predictor becomes the selected impact route.

## Implementation Plan

Implementation order is important: write the failing regression first,
then apply the bridge change. If the regression does not fail before the
bridge change, the test is not exercising this bug.

1. Add a small local helper in `apps/web/features/workbench/scenario-analysis.ts`.

   Suggested behavior:

   ```ts
   type HeavyConcreteCombinedSurfaceBridgeStatus =
     | "inactive"
     | "needs_input"
     | "ready_for_formula_corridor"
     | "unsafe_topology";

   function shouldForwardHeavyConcreteCombinedImpactPredictor(
     surface: { status: HeavyConcreteCombinedSurfaceBridgeStatus } | null
   ): boolean {
     return surface?.status === "ready_for_formula_corridor" ||
       surface?.status === "unsafe_topology";
   }
   ```

   Keep the helper local to avoid widening the public workbench surface
   API for a one-route bridge rule. If a type import is used instead, it
   should come from the existing wrapper module and not from a new engine
   runtime dependency.

2. Update only the heavy-concrete entry in `activeInputSurfacePredictors`.

   Current heavy entry:

   ```ts
   heavyConcreteCombinedImpactInputSurface?.status !== "inactive"
     ? heavyConcreteCombinedImpactInputSurface?.impactPredictorInput
     : null
   ```

   Planned behavior:

   ```ts
   shouldForwardHeavyConcreteCombinedImpactPredictor(heavyConcreteCombinedImpactInputSurface)
     ? heavyConcreteCombinedImpactInputSurface?.impactPredictorInput
     : null
   ```

   Do not change the steel or timber/CLT entries in this slice. Their
   current partial-input semantics may be intentionally different, and
   changing them would turn a one-route bridge fix into a broad surface
   policy migration.

3. Preserve current warning behavior.

   Leave `formatWorkbenchHeavyConcreteCombinedImpactMissingInputWarning`
   untouched. A blank or partial heavy-concrete surface should still tell
   the user which combined-formula fields are missing.

4. Preserve `unsafe_topology` fail-closed behavior.

   Keep forwarding the unsafe-topology blocker predictor. If this is not
   done, duplicate or unsafe concrete bases could silently fall back to a
   published anchor, which would violate the topology guard.

5. Leave complete formula behavior unchanged.

   When status is `ready_for_formula_corridor`, the explicit combined
   formula must still publish the existing pinned values, including
   `Ln,w 44.4` and `DeltaLw 30.1` for the Gate BF workbench fixture.

6. Do not add hidden defaults or partial seed synthesis.

   In particular, do not copy slab density/thickness from visible layers
   into the user surface, and do not infer `loadBasisKgM2`,
   `resilientLayerDynamicStiffnessMNm3`, or lower ceiling assembly. The
   visible-layer resolver already owns the fallback answer; the explicit
   combined formula must still wait for its physical inputs.

## Regression Tests

Add the primary regression to
`apps/web/features/workbench/heavy-concrete-combined-impact-input-surface-acceptance.test.ts`.

Important fixture warning: the existing helper
`evaluateHeavyConcreteScenario` defaults `surface` to
`COMPLETE_HEAVY_CONCRETE_SURFACE` when the input surface is `null` or
`undefined`. Do not use that helper for the no-surface baseline. Create a
new helper or call `evaluateScenario` directly, otherwise the regression
will accidentally test the complete formula path instead of the
visible-layer route.

Also use the actual `heavy_concrete_impact_floor` preset rows from
`getPresetById("heavy_concrete_impact_floor")`. The local
`HEAVY_CONCRETE_ROWS` fixture in the existing test file uses a different
30 mm screed and `generic_resilient_underlay_s30`; the production preset
uses 50 mm screed and `generic_resilient_underlay`. The bug was observed
on the preset, so the regression must use the preset.

### Test 1 - Blank Surface Must Not Shadow Visible Anchor

Build two scenarios with the actual `heavy_concrete_impact_floor` preset
rows:

- baseline: no `heavyConcreteCombinedImpactInputSurface`;
- regression: all heavy-concrete input-surface fields are empty strings.

Suggested empty surface fixture:

```ts
const EMPTY_HEAVY_CONCRETE_SURFACE = {
  impactHeavyConcreteBaseSlabDensityKgM3: "",
  impactHeavyConcreteBaseSlabThicknessMm: "",
  impactHeavyConcreteLoadBasisKgM2: "",
  impactHeavyConcreteLowerAssemblyType: "",
  impactHeavyConcreteLowerBoardLayerCount: "",
  impactHeavyConcreteLowerBoardThicknessMm: "",
  impactHeavyConcreteLowerCavityDepthMm: "",
  impactHeavyConcreteLowerCavityFillThicknessMm: "",
  impactHeavyConcreteLowerSupportClass: "",
  impactHeavyConcreteResilientLayerDynamicStiffnessMNm3: "",
  impactHeavyConcreteResilientLayerThicknessMm: ""
} as const satisfies WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft;
```

Suggested preset row helper:

```ts
function buildHeavyConcreteImpactPresetRows(): LayerDraft[] {
  return getPresetById("heavy_concrete_impact_floor").rows.map((row, index) => ({
    ...row,
    id: `heavy-concrete-impact-preset-${index + 1}`,
    thicknessMm: String(row.thicknessMm)
  }));
}
```

Suggested direct scenario helper:

```ts
function evaluateHeavyConcreteImpactPreset(input: {
  surface?: WorkbenchHeavyConcreteCombinedImpactInputSurfaceDraft;
}): EvaluatedScenario {
  return evaluateScenario({
    heavyConcreteCombinedImpactInputSurface: input.surface,
    id: "heavy-concrete-impact-preset-blank-surface-regression",
    name: "Heavy concrete impact preset blank surface regression",
    rows: buildHeavyConcreteImpactPresetRows(),
    source: "current",
    studyMode: "floor",
    targetOutputs: ["Rw", "Ln,w", "DeltaLw", "Ln,w+CI"]
  });
}
```

Assert:

- `Ln,w` is live in both scenarios;
- `unsupportedTargetOutputs` does not include `Ln,w`;
- `impact.basis` remains
  `predictor_heavy_concrete_published_upper_treatment_estimate`;
- `impact.LnW` remains `50`;
- `impactPredictorStatus?.inputMode` is not `explicit_predictor_input`
  for the blank-surface scenario;
- baseline and blank-surface supported/unsupported output partitions are
  the same, except the blank-surface scenario may include the additional
  combined-formula missing-input warning;
- warning text still mentions upper resilient dynamic stiffness, loaded
  upper treatment mass basis, and lower ceiling assembly.

This baseline-parity assertion is safer than hard-coding whether
`DeltaLw` is live or stopped for every future preset. The important rule
is that a blank UI surface must not change the selected impact answer.

### Test 2 - Complete Surface Still Promotes Formula

Keep or extend the existing complete-surface assertions:

- basis is `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`;
- `Ln,w` is `44.4`;
- `DeltaLw` is `30.1`;
- output cards and report posture still label the heavy concrete
  combined formula corridor.

This protects against accidentally disabling the explicit formula path.

### Test 2b - Partial Surface Also Must Not Shadow Anchor

Add one partial-surface case, not just the all-empty surface. Recommended
fixture: copy `COMPLETE_HEAVY_CONCRETE_SURFACE` but blank
`impactHeavyConcreteResilientLayerDynamicStiffnessMNm3` or
`impactHeavyConcreteLowerAssemblyType`.

Assert:

- warning still names the missing field;
- selected `impact.basis` is not the combined formula basis;
- `Ln,w` remains live from the visible/published route if the visible
  stack is otherwise eligible.

This protects the real user workflow where someone fills some formula
fields but stops halfway.

### Test 3 - Unsafe Topology Stays Parked

Keep the existing duplicate-base/unsafe-topology test and tighten if
needed:

- warning contains `unsafe to collapse`;
- result does not promote the heavy concrete combined formula;
- no new fallback is silently selected because of the bridge change;
- `unsupportedTargetOutputs` still includes formula-dependent impact
  outputs requested for the unsafe stack.

This test is the reason `unsafe_topology` must still be forwarded. A
duplicate concrete base is not the same as a blank form; it is a hostile
topology boundary.

### Test 4 - ASTM/Field Alias Boundaries Stay Separate

Retain existing API or workbench assertions that field and ASTM requests
do not get values from the lab ISO combined formula unless an explicit
field/ASTM owner exists.

### Test 5 - Conflict Handling Is Unchanged

The existing `activeInputSurfacePredictors.length > 1` conflict rule must
continue to park explicit predictor input when multiple ready/unsafe
floor formula surfaces match. The heavy `needs_input` surface should not
count as an active predictor after this fix, but a heavy
`ready_for_formula_corridor` or `unsafe_topology` surface still should.

At minimum, confirm no existing steel/timber/CLT surface acceptance tests
change because of this patch.

## Verification Commands

Use direct Vitest commands so file filters do not accidentally run the
entire package.

```bash
pnpm --filter @dynecho/web exec vitest run \
  features/workbench/heavy-concrete-combined-impact-input-surface-acceptance.test.ts \
  --maxWorkers=1
```

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts \
  src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts \
  --maxWorkers=1
```

Then run a runtime spot check equivalent to the analysis:

```bash
pnpm exec tsx -e '<evaluate preset no-surface, empty-surface, complete-surface and print basis/value partitions>'
```

Expected spot-check result after the fix:

```text
preset_no_surface:
  basis: predictor_heavy_concrete_published_upper_treatment_estimate
  Ln,w: 50
  supported includes: Rw, Ln,w

preset_empty_surface:
  basis: predictor_heavy_concrete_published_upper_treatment_estimate
  Ln,w: 50
  supported includes: Rw, Ln,w
  warning includes: Upper resilient dynamic stiffness, Loaded upper treatment mass basis, Lower ceiling assembly

complete_surface:
  basis: predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate
  Ln,w: 44.4
  DeltaLw: 30.1
```

If targeted checks pass, run the current calculator gate if the working
tree is stable enough:

```bash
pnpm calculator:gate:current
```

If broad package tests show unrelated historical/global matrix failures,
record them separately and do not mix them with this bug's acceptance
unless the failing file touches heavy-concrete workbench bridge behavior.

Because this repository currently has unrelated report-assistant changes
in the working tree, the implementation turn must record whether any
verification failure is pre-existing or caused by the new bridge patch.
Do not revert unrelated files.

## Acceptance Criteria

The fix is accepted only if all of the following are true:

- The actual `heavy_concrete_impact_floor` preset with blank/default
  heavy-concrete combined surface no longer marks `Ln,w` as unsupported
  or `Not ready`.
- The same blank/default surface still displays combined-formula
  missing-input guidance.
- Complete heavy-concrete combined input still calculates the combined
  formula values.
- Unsafe concrete topology remains parked.
- Existing Gate CG2 and Gate W engine contracts still pass.
- Report/output-card behavior remains basis-consistent: the visible
  answer basis must identify whether the value came from the published
  upper-treatment anchor or the combined formula corridor.

## Abort Conditions

Stop and reassess instead of widening the patch if any of these occur:

- the blank-surface regression can be made green only by changing engine
  formulas or source data;
- `unsafe_topology` starts falling back to a live published anchor;
- complete heavy-concrete combined input stops producing the pinned
  `Ln,w 44.4` / `DeltaLw 30.1` values;
- steel or timber/CLT workbench surface acceptance tests change;
- fixing `Ln,w` requires muting missing-input warnings.

## Rollback

Rollback should be a one-file revert in
`apps/web/features/workbench/scenario-analysis.ts`, plus removal of the
new regression assertions. No production data migration or engine state
change is involved.

## Risk Assessment

Primary risk: if a user partially fills the heavy-concrete combined
surface, the workbench will keep showing the visible-stack anchor while
warning that the combined formula lane still needs fields. This is
acceptable for this fix because the selected answer basis remains
visible and the missing combined-formula fields remain explicit.

Secondary risk: changing all input-surface families at once could break
steel or timber/CLT partial-input contracts. This plan avoids that by
scoping the bridge change to heavy concrete only.

Tertiary risk: baseline parity may show `DeltaLw` live for the current
production preset because the visible-layer published route owns enough
data to estimate it. That is acceptable. The stricter invariant is that
the blank/default UI surface must not change the selected route or make
`Ln,w` unavailable.

Residual future work: after this fix, a separate improvement may split
upper-treatment explicit inputs from lower-treatment combined inputs, so
partial upper data can feed the upper formula without requiring lower
assembly fields. That is not part of this bug fix.
