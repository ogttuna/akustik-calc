# Slice Plan - Wall Formula Family Widening v1

Status: CLOSED (opened 2026-04-23; Gate A audit landed 2026-04-23; Gate B live-route proof landed 2026-04-23; Gate C closed honestly no-runtime on 2026-04-23)

## Objective

Improve wall airborne calculation coverage and numerical accuracy without
loosening the existing exact/catalog/benchmark precedence.

The first known target is the `timber_stud_wall` formula-owned gap, but
the 2026-04-23 implementation review showed that the gap has two
surfaces:

- the no-calculator / screening-seed preset matrices pin lab Rw 31.1 dB
  and field R'w 24 dB; these are real drift guards but are not automatically
  the same as the live simple-workbench default because the workbench
  store defaults `calculatorId` to `dynamic`;
- the same timber stud stack with `calculator: "dynamic"` gives lab
  Rw 50 dB, field R'w 42 dB, and building DnT,w 43 dB, but the trace is
  low-confidence and boundary-adjacent
  (`stud_surrogate_blend+framed_wall_calibration`).

This slice must not jump directly to either surface as the corrected
truth. Gate A built the audit/anchor matrix that explains the
calculator selection path and guards precedence. Gate B now proves that
the live workbench preset route already uses the dynamic surface, so
Gate C has now closed: no source-backed runtime tightening landed, and
the current dynamic lane remains honest and low-confidence.

## Non-Goals

- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web, or
  wall-selector blocked-source families.
- Do not replace exact/catalog/verified benchmark rows with formula
  outputs.
- Do not change plan tiers, auth, billing, invitations, or project/team
  collaboration behavior.
- Do not add a formula lane that cannot explain its applicability,
  negative cases, and provenance.
- Do not present any formula output as measured or exact.

## Current Baseline

- `good_calculator_final_audit_v1` is closed and the focused calculator
  gate is green.
- Productization slices through `team_access_model_v1` are closed.
- `project_access_policy_route_integration_v1` is deferred, not
  deleted, because it does not improve acoustic accuracy or coverage.
- Wall presets currently cover six defended archetypes and are pinned
  across lab/field/building surfaces.
- `wall_lsf_timber_stud_preset_benchmarks.test.ts` pins:
  - LSF benchmark behavior on the defended Knauf lane,
  - timber-stud formula-owned behavior as a drift guard, not a target.
- `apps/web/features/workbench/workbench-store.ts` defaults the live
  workbench calculator to `dynamic`, while several existing preset
  matrices call `evaluateScenario` without a calculator override. The
  next audit must reconcile those two surfaces before it changes any
  runtime value or updates any user-facing expectation.
- `wall_field_continuation_completeness_matrix.test.ts` and
  `wall_physical_invariants_matrix.test.ts` keep I1/I2/I3 green on the
  defended wall preset surface.
- `packages/engine/src/wall-formula-family-widening-audit.test.ts`
  landed on 2026-04-23 with no runtime changes and is now part of
  `pnpm calculator:gate:current`. It pins the screening and dynamic
  surfaces, exact/catalog precedence, double-leaf/stud boundary rows,
  negative topology cases, and hostile invalid-input fail-closed behavior.
- `apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts`
  landed on 2026-04-23 and proves the live workbench preset path uses
  `calculator: "dynamic"` with the store/shell default calculator. It
  pins the user-visible timber and LSF route branch + card values across
  lab/field/building contexts.
- The older
  `docs/archive/analysis/WALL_COVERAGE_EXPANSION_PLAN.md` remains
  backlog context. Its prerequisite guardrails largely landed already:
  wall hostile-input matrix, preset expansion, field continuation pins,
  wall reorder invariance, and 50-layer wall stress coverage.

## Implementation Findings From 2026-04-23 Review

Code paths inspected:

- `packages/engine/src/dynamic-airborne.ts`
- `packages/engine/src/dynamic-airborne-framed-wall.ts`
- `packages/engine/src/dynamic-airborne-cavity-topology.ts`
- `packages/engine/src/apply-airborne-context.ts`
- `packages/engine/src/calculate-assembly.ts`
- `apps/web/features/workbench/preset-definitions.ts`
- `apps/web/features/workbench/workbench-store.ts`
- wall preset/value matrix tests under `apps/web/features/workbench/`

Observed behavior for the current timber stud preset stack
(`2x12.5 gypsum + 50 rockwool + 50 air + 2x12.5 gypsum`,
`wood_stud`, `line_connection`, 600 mm spacing):

| Surface | Calculator | Lab Rw | Field R'w | Building DnT,w | Trace posture |
|---|---:|---:|---:|---:|---|
| Existing no-calculator preset matrices | `null` | 31.1 lab metric (~31 displayed) | 24 | 25 | screening seed, no dynamic trace |
| Dynamic candidate lane | `dynamic` | 50 | 42 | 43 | `stud_wall_system`, `stud_surrogate_blend+framed_wall_calibration`, low confidence |

Observed behavior for the LSF preset:

| Surface | Calculator | Lab Rw | Field R'w | Trace posture |
|---|---:|---:|---:|---|
| Existing no-calculator preset matrices | `null` | 55 | 48 | exact Knauf catalog anchor applies; building DnT,w=49 |
| Dynamic candidate lane | `dynamic` | 55 | 48 | dynamic route still yields exact catalog anchor |

Interpretation:

- The timber-stud gap is not simply a missing `wood_stud` correction
  inside `estimateStudWallTargetRw`; that function already reaches a
  plausible dynamic target for this topology. The unresolved issue is
  the route/selection contract between screening-seed preset tests,
  dynamic calculator defaults, field overlays, and confidence labeling.
- LSF proves exact/catalog precedence is already load-bearing: even
  when dynamic is selected, the Knauf exact row owns the answer.
- Any fix that makes timber use the dynamic framed-wall lane must keep
  the low-confidence/boundary warning honest unless new benchmark
  evidence tightens the confidence class.

## External Source Recheck

This planning pass did not import a new exact timber-stud catalog row.
It only rechecked whether the current local target corridor is
plausible enough to audit further:

- Davy 2010, JASA, DOI `10.1121/1.3273889`, is a relevant double-leaf
  cavity-wall model source. The abstract states that the model was
  compared with double-glazed windows and gypsum plasterboard cavity
  walls with and without absorbing cavity material, with mean difference
  around -0.6 dB and standard deviation around 3.1 dB, but wider
  frequency-specific errors. Use this as a corridor source, not as an
  exact single-number anchor.
  Source: https://pubmed.ncbi.nlm.nih.gov/20136207/
- Scientific Reports 2024, "Airborne sound insulation performance of
  lightweight double leaf walls with different stud types", explicitly
  treats wooden, steel, and acoustic studs as different sound-bridge
  paths; it reports that traditional wooden studs, treated as rigid
  frames, contribute more sound-bridge effect than steel studs of the
  same structure. This supports preserving `studType` and coupling
  metadata instead of collapsing all framed cavities into one generic
  double-leaf formula.
  Source: https://www.nature.com/articles/s41598-024-82403-w
- Knauf UK Drywall Systems Performance Guide 2026 lists timber-stud
  examples around Rw 35/42 for basic 1x12.5 wallboard cases and
  high-performance resilient-bar timber examples around Rw 56/59. This
  supports the finding that Rw 31 is suspiciously low for a 2+2 board
  insulated timber-stud stack, but it is not an exact match for the
  current preset and cannot be used as a direct replacement value.
  Source: https://knauf.com/api/download-center/v1/assets/0f399ff9-ae51-4916-b290-c5f5d270a2e4?country=gb&download=true&locale=en-GB

## Gate A Implementation Step - Landed 2026-04-23

The no-runtime-value-change audit/anchor pack is implemented in
`packages/engine/src/wall-formula-family-widening-audit.test.ts` and
listed in `tools/dev/run-calculator-current-gate.ts`.

It pins current values and trace/provenance for both calculator
surfaces:

- timber stud, `calculator: null`: lab Rw 31.1, field R'w 24,
  building DnT,w 25, `method=screening_mass_law_curve_seed_v3`, no
  dynamic trace;
- timber stud, `calculator: "dynamic"`: lab Rw 50, field R'w 42,
  building DnT,w 43, dynamic trace family `stud_wall_system`, strategy
  `stud_surrogate_blend+framed_wall_calibration`, confidence remains low;
- LSF, `calculator: null` and `calculator: "dynamic"`: lab Rw 55 and
  field R'w 48; exact Knauf catalog anchor/fallback wins ahead of formula
  surfaces;
- representative empty-cavity and mineral-wool double-leaf rows, with
  and without explicit stud metadata;
- direct-coupled, triple-leaf, missing-thickness, and unknown-material
  negative cases;
- exact/benchmark-owned Porotherm masonry where formula widening must
  not shadow the catalog/benchmark result.

The matching planning contract
`packages/engine/src/post-team-access-model-calculator-refocus-next-slice-selection-contract.test.ts`
now records Gate A as landed and keeps Gate B ahead of runtime value
changes.

## Gate B Implementation Step - Landed 2026-04-23

Gate B proves the user-visible route authority:

1. The live workbench shells call `evaluateScenario` with
   `calculator: calculatorId`.
2. The workbench store defaults `calculatorId` to `dynamic`.
3. Loading `timber_stud_wall` preserves that dynamic calculator while
   applying the preset's framed-wall metadata.
4. The new web route/card matrix pins the live dynamic branch and card
   values for timber + LSF across lab/field/building contexts.

Conclusion: the screening-only preset benchmark/continuation matrices
remain useful drift guards, but they are not the user-visible workbench
surface. No route-selection correction is needed at this time.

## Gate C Closeout - Landed 2026-04-23

Gate C decided that this slice should not change runtime math:

1. The live timber route is already proven to be the dynamic lane.
2. Davy 2010 plus the 2024 stud-type paper support broad framed-wall
   corridor reasoning and explicit stud-type handling, not a direct trim
   number for the current preset.
3. Official Knauf, British Gypsum, and Gyproc timber rows bracket the
   current live timber value but do not exact-match the current board /
   cavity / connection topology closely enough to defend a targeted
   trim.
4. Therefore the slice closes honestly with no runtime value change and
   no confidence-class tightening.
5. The follow-up selected slice is
   `wall_timber_lightweight_source_corpus_v1`.

## Decision Gates

Gate A - audit only:

- Landed: `wall-formula-family-widening-audit.test.ts`.
- No production runtime values changed.
- Output: this document now states both engine surfaces. User-visible
  route authority remains the Gate B decision.

Gate B - choose first runtime cut:

- Landed: live workbench already uses dynamic for timber and LSF.
- Landed: stale screening-only comments/tests were updated and live
  dynamic route/card VALUE pins were added.
- Result: no route-selection correction was needed.

Gate C - runtime closeout:

- Landed as a no-runtime closeout.
- LSF exact Rw=55 and all verified catalog rows stayed unchanged.
- Timber dynamic confidence stays low because no new row justified a
  tighter classification.
- Next slice selection moved to source-corpus authoring for common
  timber/lightweight walls.

## Runtime Widening Rules

Any runtime correction inside this slice must:

- preserve exact > catalog > benchmark > bound > family/formula >
  low-confidence > unsupported precedence,
- add positive, negative, and precedence tests before implementation,
- never silently switch the calculator surface that a workbench route is
  using; if `calculator: null` and `calculator: "dynamic"` diverge, the
  test must name which one represents that user path,
- update workbench route/card tests if a visible value, label,
  support bucket, provenance string, or warning changes,
- keep `R'w <= Rw`, `Dn,A ~= Dn,w + C`, and defensible
  `DnT,w - Dn,w` ranges green,
- document the formula lane as scoped, not measured.

## Validation

Minimum closeout validation:

- focused new audit/runtime tests,
- `pnpm calculator:gate:current`,
- `pnpm check`,
- `git diff --check`.

If any numeric wall value changes, also run the affected wall web
matrix tests directly before the broad gate.

## Completion Criteria

- The first audit matrix explains the current wall formula-family
  behavior and pins the known timber-stud gap.
- Gate B proves the authoritative live route.
- Gate C names the missing evidence and closes no-runtime.
- The selected follow-up slice is
  `wall_timber_lightweight_source_corpus_v1`.
- Docs continue to state that productization route integration is
  deferred, not abandoned.
