# System Audit — 2026-04-20

Broad audit conducted after the Dataholz CLT calibration tightening second pass
closed with a workbench consultant-trail + diagnostics-dossier cut. The audit
scans docs, architecture, test coverage, wall coverage, and common user
scenarios against the product mission (broader layer combination coverage +
maximum numerical accuracy on both floor and wall).

This document is the input for the wall coverage expansion planning slice
(`wall_coverage_expansion_planning_v1`) and for incremental hygiene fixes.

## ROI-Ranked Findings

Each finding lists the evidence, impact, and concrete fix. Priority is top-down.

### 1. `packages/engine/src/dynamic-airborne.ts` is 6630 lines — split required

This single file owns wall/floor airborne family detection, predictor scoring,
interpolation, and helper utilities. Every wall or floor slice touches it, so
merge conflicts and test fragility are high.

- File: `packages/engine/src/dynamic-airborne.ts` (6630 lines)
- Proposed split:
  - `dynamic-airborne-family-detection.ts` — family classifier (AAC, LSF,
    double-stud, lined-massive, heavy-core, etc.)
  - `dynamic-airborne-predictor-scoring.ts` — candidate scoring and
    interpolation
  - `dynamic-airborne-helpers.ts` — geometry helpers, frame coupling helpers,
    absorption lookups
- Risk: any split must keep `calculate-assembly.test.ts` green and preserve
  the public surface that `calculate-assembly.ts` imports. A split should be
  landed as a dedicated no-runtime refactor slice with its own
  post-refactor planning contract.

### 2. Wall hostile-input test matrix is missing

Floor has `raw-floor-hostile-input-answer-matrix.test.ts` and
`raw-floor-hostile-input-route-card-matrix.test.ts` guarding stupid/hostile
input against both the engine and the workbench route card. Wall has no
equivalent. This must land *before* the wall coverage expansion program adds
new wall corridors, otherwise hostile input cannot be detected from the
widened surfaces.

- Missing files:
  - `packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts`
  - `apps/web/features/workbench/raw-wall-hostile-input-route-card-matrix.test.ts`
- Scenarios to cover: unknown material, empty `materialId`, non-numeric
  `thicknessMm`, absent `wallRole`, many-layer wall (50+), layer reordering
  parity (for walls whose order is not physically meaningful).

### 3. Engine-level negative / zero thickness test is missing

Workbench `normalize-rows.test.ts` drops zero-thickness rows and emits a
warning. But the engine (`calculateAssembly`) does not have a dedicated test
for `thicknessMm: -5` or `thicknessMm: 0` coming in directly. Any code path
that bypasses normalization (e.g. API callers, future desktop app) can break
silently.

- Proposed file: `packages/engine/src/hostile-thickness-input.test.ts`
- Scenarios: `thicknessMm: 0`, `thicknessMm: -5`, `thicknessMm: NaN`,
  `thicknessMm: Infinity`, `thicknessMm: "abc" as any` — each must produce a
  defended fail-closed output or a specific thrown error, never `NaN`/
  `undefined` propagating through the calculation.

### 4. Predictor priority rules are uncommented

`packages/engine/src/predictor-published-family-estimate.ts` lines 1159-1256
list 15 rules with priority 10-135. The order is intentional (exact Knauf
concrete → Pliteq steel joist → open box → CLT bare → CLT dry → Dataholz CLT
dry → Pliteq hollow core → Dataholz timber dry → Knauf timber → CLT wet →
Dataholz CLT wet suspended → steel open web carpet), but *why* this order is
stable is not documented inline. A new rule added at the wrong priority can
silently shadow an existing defended lane.

- Proposed: add a one-line comment to each rule explaining which structural
  family it matches and why its priority is below the ones above it.
- Also uncommented and non-obvious (same file):
  - `thicknessNear` default tolerance (3 mm) — physical tolerance or
    data-entry buffer?
  - `calculateCandidateScore` normalization scales (45, 40, 25) —
    inconsistent scales per rule
  - `TUAS_CLT_BARE_RAW_SLAB_RW_PENALTY_DB = 3` and `LNW_PENALTY_DB = 3` —
    no citation, no calibration note
- Also uncommented (`floor-system-estimate.ts`):
  - `capFitPercentForEstimateTier`: 54 for family_general, 29 for
    low_confidence — cap origin unexplained
  - `deduplicateLightweelSteelLowerOnlyRecommendations`: why only this
    family is deduplicated
  - `restrictSourcesForSpecificImpactBasis`: why `tuas_` and `dataholz_`
    must not mix

### 5. Duplicate-date checkpoint files add cognitive load

Multiple `CHECKPOINT_<date>_<slice>_HANDOFF.md` files on the same day:

- `2026-04-13`: `CHECKPOINT_2026-04-13_END_OF_DAY_HANDOFF.md` + `STABILIZATION_CHECKPOINT_2026-04-13.md`
- `2026-04-14`: `CHECKPOINT_2026-04-14_UBIQ_HISTORY_REPLAY_HANDOFF.md` + `CHECKPOINT_2026-04-14_FORMULA_PROVENANCE_DOSSIER_HANDOFF.md`
- `2026-04-16`: `CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md` + `CHECKPOINT_2026-04-16_REQUESTED_OUTPUT_HARNESS_REFACTOR_HANDOFF.md`
- `2026-04-17`: `CHECKPOINT_2026-04-17_HEAVY_CONCRETE_FORMULA_FAMILY_CLOSEOUT_HANDOFF.md` + `CHECKPOINT_2026-04-17_REINFORCED_CONCRETE_ACCURACY_TIGHTENING_CLOSEOUT_HANDOFF.md` + `CHECKPOINT_2026-04-17_DATAHOLZ_CLT_CALIBRATION_TIGHTENING_CLOSEOUT_HANDOFF.md`

Also: `DYNAMIC_CALCULATOR_PLAN.md`, `DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md`, and `DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md` are three parallel "planning" docs. `NEXT_IMPLEMENTATION_PLAN.md` references them as "older long-form backlog" but their relative authority is unclear to a new agent.

- Proposed consolidation:
  - For same-date duplicate checkpoints, keep the latest one as canonical
    and move earlier-in-day siblings to `docs/archive/checkpoints/`
  - For the three `DYNAMIC_CALCULATOR_*_PLAN.md` files, collapse into one
    `LEGACY_BACKLOG.md` or archive them explicitly under
    `docs/archive/legacy-plans/`
- Keep the `docs/archive/README.md` "living doc wins on conflict" rule.

### 6. Wall preset space is minimal

- `apps/web/features/workbench/preset-definitions.ts` has only
  `concrete_wall` as a wall preset. This is the entire wall-mode preset
  surface the user sees.
- Wall catalog at `packages/catalogs/src/` has no `wall-systems/` folder;
  AAC materials live in `seed-materials.ts` but there is no "wall systems"
  registry analogous to `floor-systems/`.
- Tier 1 preset additions (aligned with existing test coverage):
  - `light_steel_stud_wall` preset (framed benchmark already in engine)
  - `aac_single_leaf_wall` preset (AAC airborne benchmark already in
    engine)
  - `timber_stud_wall` preset (`wood_stud` family type exists in engine
    but has no preset)
  - `clt_wall` preset (CLT material exists for floor; wall topology is an
    open question)
  - `masonry_wall` preset (clay brick material is missing — requires
    catalog addition before a preset is defensible)

### 7. 50+ layer engine stress test is missing

`simple-workbench-proposal-reporting.test.ts` tests "compact annotation"
behavior for many-layer scenarios but does not test calculation stability
for 50+ layers. Engine has no direct test. This matters for:
- Corner case discipline (user rule): system must not break with many
  layers
- Wall mode: wall normalization is shallower than floor normalization,
  so a big-stack wall path may fail earlier

- Proposed file: `packages/engine/src/many-layer-stress.test.ts`
- Scenarios: 50+ layer floor stacks with realistic material mixes, 50+
  layer wall stacks, assert no `NaN`/`undefined`/thrown errors and
  reasonable output behavior (either a defended answer or a fail-closed
  warning).

## Lower-Priority Findings

These are real but not blocking the wall coverage program.

- **File-size medium risk** (1000-3000 line range):
  - `impact-predictor-input.ts` (1985 lines) — structural classification +
    role normalization could be split
  - `calculate-assembly.ts` (1316 lines) — wall vs floor branches could be
    extracted
  - `predictor-published-family-estimate.ts` (1256 lines) — concrete rules,
    CLT rules, and steel/timber rules could be 3 files
  - `floor-system-estimate.ts` (1057 lines) — family classification vs
    estimate building could be split
  - `apps/web/features/workbench/simple-workbench-proposal.ts` (3078 lines)
  - `apps/web/features/workbench/simple-workbench-proposal-panel.tsx`
    (1986 lines)

- **User input edge cases that are soft-warnings rather than tests**:
  - `materialId: ""` (empty string) is not explicitly tested — only
    `materialId: "unknown_material"` is tested via `scenario-analysis.test.ts`
  - Extreme field-context values (e.g. `receivingRoomVolumeM3: 0`) are not
    tested
  - Floor-mode layers sent with `wallRole` (or vice versa) is not
    explicitly tested

- **Wall timber stud**: `wood_stud` type exists in engine
  (`simple-workbench-constants.ts:422`, `dynamic-airborne.ts:2463`) with
  frame coupling penalty, but no dedicated positive test scenario. If a
  user picks timber stud in workbench UI, the answer is defended by one
  penalty path that has no unit test.

- **Heavy concrete single-leaf wall**: covered partially by
  `output-combination-sweep.test.ts` but no dedicated benchmark.

- **Sandwich panel / prefab panel / curtain wall / partition drywall**:
  no catalog entries, no tests, no presets. These are common building
  components and the user has asked for comprehensive coverage.

## Non-Findings (intentionally confirmed)

- Version naming (`v1` / `v2` / `final`) is clean — no polluted filenames.
- `docs/archive/` policy ("living doc wins") is in place and explicit.
- Layer reordering is well-tested for floor
  (`floor-packaged-lane-order-parity.test.ts`, `calculate-assembly.test.ts`,
  `ubiq-lnw-plus-ci-bound-history-guard.test.ts`) and partially for wall
  (`dynamic-route-order-sensitivity.test.ts`,
  `dynamic-airborne-order-sensitivity.test.ts`).
- Hostile input for floor is well-covered
  (`raw-floor-hostile-input-answer-matrix.test.ts`,
  `raw-floor-hostile-input-route-card-matrix.test.ts`).

## How This Feeds the Wall Coverage Expansion Plan

The wall coverage expansion planning slice
(`wall_coverage_expansion_planning_v1`) should:

1. Fix finding #2 (wall hostile-input matrix) as a prerequisite guardrail
   before any new wall corridor is added.
2. Fix finding #3 (engine-level hostile thickness test) as a cross-cutting
   guard that protects both floor and wall.
3. Land finding #6 (wall preset expansion) as the first coverage deliverable,
   paired with at least one formula-owned wall lane (mass law, Sharp, or
   Davy) per preset that is safe to defend today.
4. Reference finding #7 (50+ layer stress test) as the stress guardrail to
   land alongside or before the first widening cut.

Findings #1, #4, and #5 are hygiene improvements that do not block the wall
program but should be scheduled as no-runtime cleanup slices when the wall
program has a natural pause.

## Post-Audit Findings (from the `wall_preset_expansion_v1` probe)

The analysis probe that preceded the wall preset expansion slice surfaced
two additional observations worth recording:

### Finding 8 (reclassified — NOT a bug): silent thickness drop

Hypothesis from the audit: negative/zero/non-numeric thickness causes a
silent drop with no user-visible warning. Probe proved this is incorrect.
The workbench emits a specific warning ("Layer N is missing a valid
thickness.") through `normalizeRows` when it encounters invalid thickness,
and the scenario continues with a partial result computed from the valid
layers. This behavior is defensible — the user is informed, the workspace
stays live, and the broken layer is explicit. Finding 3 in this audit
(engine-level hostile thickness test) remains valid as an additional
guardrail that would catch regressions.

### Finding 9 (new — real bug, deferred): reorder changes C availability

On asymmetric light-heavy stacks (e.g. `gypsum_board 12.5 + rockwool 50 +
air_gap 50 + concrete 150`), reversing the layer order produces the same
`Rw` value (54 dB) but a different `supportedOutputs` set:

- Original order `[gypsum, rockwool, air_gap, concrete]`:
  `supportedOutputs = [Rw, STC, Ctr]` (C missing)
- Reversed order `[concrete, rockwool, air_gap, gypsum]`:
  `supportedOutputs = [Rw, STC, C, Ctr]` (C live)

`dynamicAirborneTrace.detectedFamilyLabel` is `null` in both orderings, so
the difference is not driven by airborne family classification. The
inconsistency is most likely in the `RwC` derivation path inside
`packages/engine/src/dynamic-airborne.ts` or `estimate-rw.ts`.

Symmetric single-leaf (concrete 150 + plaster/gypsum finish) and symmetric
double-leaf (gypsum + air + gypsum) show no reorder delta, so the
inconsistency is specific to asymmetric light-heavy double-leaf stacks.

This is a user-trust bug (moving a layer changes what outputs the user
sees) but NOT a numerical accuracy bug (Rw stays identical). Deferred to
slice `wall_reorder_output_set_consistency_v1`, selected as the next
active runtime tightening slice by the `wall_preset_expansion_v1`
post-contract.

## Post-Session Priority Analysis (2026-04-21)

Full system re-audit after the Dataholz CLT pass 2 closeout, the deep-hybrid
timeout fix, and the wall preset expansion slice all landed. Broad validation
confirmed green: engine `184/184` files / `1021/1021` tests, web `132/132`
files / `715/715` tests, build + lint + typecheck + whitespace all green.

### What genuinely moved forward this session

- **Coverage axis** (user's stated goal #1):
  - Wall presets: `1 → 4` (concrete baseline + AAC single-leaf + masonry
    brick + CLT wall). Net user-visible capability jump.
  - The three new presets are symmetric stacks (plaster | core | plaster
    or gypsum | core | gypsum), so they are NOT affected by the reorder
    bug documented in finding 9.
  - Floor coverage unchanged numerically but accuracy discipline extended
    to CLT visible estimate consultant/dossier surfaces (pass 2 cut).
- **Accuracy axis** (user's stated goal #2):
  - Engine numerical behavior unchanged. Every floor Rw / Ln,w / field
    continuation produces the same value as before.
  - Validation discipline on CLT estimate path now matches the
    reinforced-concrete low-confidence discipline — the proposal output
    can no longer silently blur estimate vs exact for CLT users.
- **Hygiene axis**:
  - Pre-existing flaky deep-hybrid scan timeout fixed at root cause.
  - Doc drift closed (pass 2 contract + preset expansion contract both
    committed on the focused gate and cross-referenced from living docs).

### Strategic options weighed for the next slice

Five candidate directions considered, measured against the product mission
(broader coverage AND maximum accuracy on both floor and wall):

| Option | Mission Axis | User-Visible Impact | Scope (days) | Risk | Notes |
|---|---|---|---|---|---|
| A. Fix reorder C-availability bug (finding 9) | Accuracy / trust | Medium (asymmetric stacks only) | 1-2 | Low | Selected by post-contract; reveals engine internals |
| B. Wall mass-law formula lane | Coverage | High (any mass-dominated wall) | 2-3 | Medium | Probe shows engine already approximates mass law; may be presets-only, not a new lane |
| C. Preset airborneContext injection → unblock LSF + timber stud | Coverage | Medium-high (2 more presets) | 1-2 | Medium | Architectural change to preset surface |
| D. Split `dynamic-airborne.ts` (finding 1) | Enabler | Low (no user-facing change) | 2-3 | High | Unlocks cleaner future work; high blast radius |
| E. Engine-level hostile thickness test (finding 3) | Robustness | Low (current behavior is already defendable) | 0.5 | Very low | Cheap guardrail |

### Honest judgment: Option A (reorder fix) remains the strongest next move

Reasons A beats the alternatives:

1. **Concrete observed bug**, not hypothetical. The probe captured exact
   reproduction steps. Every other option starts from speculation.
2. **Reveals engine internals** before we build more on top. Finding out
   how `RwC` is derived is a prerequisite for Option B (we might discover
   the engine already has a mass-law-like lane and Option B is just
   preset work, not engine work).
3. **Small scope**. The fix is contained to engine derivation; no new
   catalog rows, no new formula families, no UX changes.
4. **User-trust protection**. Dragging layers changing the output set is
   exactly the kind of non-deterministic behavior that erodes trust in
   acoustic software. Fixing it before expanding coverage is the right
   ordering.
5. **Test infrastructure reuse**. The reorder invariance test matrix we
   write for A will also catch future regressions as we add new wall
   lanes. It's a guardrail that stays useful.

Reasons A is NOT reordered as a prerequisite below B:
- Option A does NOT expand coverage. If we only do A and stop, the
  project still has the same coverage gaps.
- If A reveals the engine's RwC derivation is genuinely intertwined with
  family detection in a way that needs `dynamic-airborne.ts` split
  first (Option D), the slice will bounce. We accept that risk by
  running the probe first.

### Why the deferred options are deferred (explicitly)

- **B (wall formula lane)**: probably redundant. Probe evidence suggests
  the engine ALREADY has generic single-leaf and double-leaf airborne
  derivations. The Ytong 150 stack produces Rw=45 without any explicit
  mass-law formula lane — the engine's generic airborne calculator is
  covering it. Rather than add a new "mass law" lane, we should verify
  what's there and add presets. This is a different kind of work than
  originally planned; reframe after A lands.
- **C (preset airborneContext)**: architectural; should be a conscious UX
  decision in a separate slice. Not blocking wall coverage because
  symmetric presets are already landed.
- **D (`dynamic-airborne.ts` split)**: deferred until needed. If Option A
  reveals the RwC fix is surgical (one derivation function), we don't
  split. If it requires touching many interrelated paths, we split.
- **E (hostile thickness test)**: cheap; land opportunistically inside
  another slice. Not standalone-worthy.

### Recommended next-slice shape

**Slice id**: `wall_reorder_output_set_consistency_v1`
**Class**: runtime tightening (engine fix) + test matrix
**Steps** (in order, each with a stop gate):

1. **Probe deepening** (≤30 min): extend the reorder investigation to
   pin which engine function causes the C-availability flip. Expected
   location: `packages/engine/src/dynamic-airborne.ts` (in `RwC`
   derivation) or `packages/engine/src/estimate-rw.ts`. Output: one
   specific function name with line range.

2. **Test matrix first** (before any fix): land
   `packages/engine/src/wall-reorder-invariance-matrix.test.ts` with
   positive cases (symmetric stacks, reorder-indifferent) and the
   currently-broken cases (asymmetric light-heavy reorders produce
   identical supportedOutputs). The asymmetric cases start RED —
   this proves the bug is test-captured.

3. **Engine fix**: minimal change to the offending derivation so the
   test matrix goes green. No family-detection refactor unless
   absolutely required (if required, STOP and re-plan).

4. **Broad validation**: `pnpm calculator:gate:current` + `pnpm check`
   + `pnpm build` + `git diff --check` all green.

5. **Closeout post-contract**:
   `packages/engine/src/post-wall-reorder-output-set-consistency-v1-next-slice-selection-contract.test.ts`.
   Select the next slice based on what the fix reveals:
   - If engine still monolithic and fix was messy → select
     `dynamic_airborne_split_refactor_v1`
   - If engine fix was surgical and symmetric presets are still green
     → select `wall_airborne_context_preset_injection_v1` (unblocks
     LSF + timber stud presets)
   - If probe finds a deeper accuracy issue → select a fresh slice
     based on that evidence

### Stop Conditions For The Reorder Fix

- STOP if the probe reveals the bug is actually in the catalog (some
  material is asymmetric in its own metadata). Then the fix is a
  catalog fix, not an engine fix.
- STOP if the fix requires touching more than 3 engine files. That's
  the signal to split `dynamic-airborne.ts` first.
- STOP if any upstream closeout test goes red. Roll back and rethink.
- STOP if the fix changes any Rw value on any existing test. Rw itself
  was order-invariant in the probe — only C availability was the
  issue. If Rw moves, we're in accuracy-change territory and need a
  separate analysis.

### Confidence Level

High (Option A). The probe is concrete, the scope is bounded, the
success criterion is testable in a single matrix, and rollback is
clean (any floor/wall corridor regression signals stop).

Medium-high for the post-A selection (Option B vs C vs D). Will
resolve once the engine investigation surfaces how RwC is actually
derived.

## Post-Session Finding 10 — RETRACTED (2026-04-21 verification)

**Claim retracted.** The "wall preset context gap" finding was a false
alarm produced by a test artifact, not a real accuracy bug. Correcting
the audit record so future agents do not inherit an incorrect
"masonry preset is 4 dB over spec" claim.

### What the original finding claimed

- `masonry_brick_wall` preset Rw=47 vs Wienerberger benchmark Rw=43
  (±1 dB tolerance): "4 dB over manufacturer spec".
- `aac_single_leaf_wall` preset Rw=45 vs Xella benchmark Rw=47 (±2.5 dB
  tolerance): "2 dB under".
- Proposed fix: inject `airborneContext` into presets via a new
  `preset_airborne_context_injection_v1` slice.

### Why the claim was wrong

The measurements were taken with `evaluateScenario({ ..., airborneContext: null })`
inside `wall-preset-expansion-benchmarks.test.ts`. That is the
**no-context engine path**, not what the workbench UI actually sends.

The real workbench flow (`apps/web/features/workbench/workbench-shell.tsx`
lines 284-303) builds a `liveAirborneContext` for wall mode from the
workbench store defaults:

```ts
const liveAirborneContext = studyMode === "wall" ? {
  airtightness: "good",          // workbench-store default
  contextMode: "element_lab",    // workbench-store default
  /* ...plus 13 other fields, mostly undefined by default */
} : null;
evaluateScenario({ ..., airborneContext: liveAirborneContext });
```

The defaults `airtightness: "good"` and `contextMode: "element_lab"`
are the exact same shape as `LAB_MASONRY_CONTEXT` used by the engine
benchmark suite. Under this real workbench default context the engine
produces:

- `masonry_brick_wall` → Rw=**43** (matches Wienerberger benchmark 43 within ±1 dB)
- `aac_single_leaf_wall` → Rw=**47** (matches Xella benchmark 47 within ±2.5 dB)
- `clt_wall` → Rw=40 (no exact CLT wall benchmark, formula-owned)

So the presets are already benchmark-matching in the user-visible UI.
The 2-4 dB "gap" only appears when a test evaluates the preset stack
with `airborneContext: null`, which corresponds to a synthetic
engine-only code path the workbench UI never takes.

### Correction landed in this retraction

1. `apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts`
   updated to pass a `WORKBENCH_DEFAULT_LAB_CONTEXT` that mirrors the
   workbench shell's `liveAirborneContext`. The pinned Rw values are now
   43 (masonry), 47 (AAC), 40 (CLT) — benchmark-matching.
2. `docs/calculator/MASTER_PLAN.md` §3 wall grid: AAC and masonry
   rows restored to 🟢 Benchmark; "Wall preset context gap" row
   removed from the cross-cutting table.
3. `docs/calculator/MASTER_PLAN.md` §4 ROI table: step B
   (`preset_airborne_context_injection_v1`) accuracy rating
   downgraded from ++ to neutral; the slice is no longer needed to
   close an accuracy gap.
4. `docs/calculator/MASTER_PLAN.md` §4 master sequence: step 2
   (preset airborne context injection) removed as the selected next
   slice. The slice rationale was entirely predicated on the now-
   retracted gap finding.
5. `docs/calculator/CURRENT_STATE.md` and
   `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md` updated to reflect
   the retraction and to select a different next slice.

### Why this happened (process lesson)

Writing a benchmark fit test with a plausible-looking but
non-workbench-equivalent context produced a 2-4 dB artifact that was
then mistaken for a user-facing accuracy gap. The lesson for future
preset tests: **the test context must mirror the workbench shell's
`liveAirborneContext`, not a synthetic convenience context**. Added
an inline note in
`apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts`
warning future agents about this trap.

### Status of findings 1-9

Findings 1-9 remain valid (they were rechecked during the retraction).
Finding 10 is the only finding that was wrong.

## Validation Posture At Audit Time

- Phase 1 landed: two new workbench tests (CLT visible estimate consultant
  trail matrix + diagnostics dossier matrix) + one engine post-contract
  closing `dataholz_clt_calibration_tightening` second pass.
- `pnpm calculator:gate:current`: green.
- `pnpm check`: pending at audit write time — Phase 2 of the current session
  has not yet emitted a final result.
- Broad repo snapshot: the focused gate ran clean through lint, typecheck,
  tests, and build. The broad `pnpm check` green status must be confirmed
  before any wall program slice is kicked off.
