# Wall Coverage Expansion Plan

Slice id: `wall_coverage_expansion_planning_v1`
Status: closed — the slice produced this plan and its first executable sub-slice (`wall_preset_expansion_v1`) landed
Last reviewed: 2026-04-20
Iteration: 2 (open design questions resolved; first sub-slice landed)

## Latest Landed Sub-Slice

`wall_preset_expansion_v1` closed cleanly on 2026-04-20. Three new wall
presets landed:

- `aac_single_leaf_wall` — Ytong D700 150 mm + 10 mm cement plaster both
  sides. Canonical Rw = 45 in lab mode (benchmark reference Rw=47 under
  dedicated lab airtightness protocol).
- `masonry_brick_wall` — Wienerberger Porotherm 100 mm + 13 mm dense
  plaster both sides. Canonical Rw = 47 in lab mode.
- `clt_wall` — 140 mm cross-laminated timber + 12.5 mm gypsum board both
  sides. Canonical Rw = 40 in lab mode.

Each preset survives the lab / apparent-field / building context sweep
in `wall-full-preset-contract-matrix.test.ts` and has its canonical Rw
pinned in `wall-preset-expansion-benchmarks.test.ts`.

Not landed in this sub-slice (deferred): `light_steel_stud_wall` and
`timber_stud_wall` presets. Rationale: both require
`airborneContext.studType` injection that the current preset surface
does not support. Opening the preset surface to airborneContext is a
separate design decision tracked in the audit as finding 6.

## Next Active Slice

`wall_reorder_output_set_consistency_v1` — selected by the
`wall_preset_expansion_v1` post-contract after the analysis probe
surfaced an asymmetric light-heavy stack reorder inconsistency (same
Rw, different C availability). Engine path to investigate: the `RwC`
derivation inside `packages/engine/src/dynamic-airborne.ts` and
`packages/engine/src/estimate-rw.ts`.

Selected by: `packages/engine/src/post-dataholz-clt-calibration-tightening-second-pass-next-slice-selection-contract.test.ts`.

## Mission Alignment

From [project memory — DynEcho Core Mission](../../../.claude/projects/-home-ogttuna-Dev-Machinity-AcousticUpgrade/memory/project_dynecho_core_mission.md):

- DynEcho must deliver broader layer combination coverage AND maximum
  numerical accuracy on both floor and wall.
- Wall coverage is significantly behind floor and is the primary remaining
  coverage gap.
- Formula-owned lanes (mass law, Sharp, Davy, ISO 12354) are a fast
  coverage-growth tool that respects existing exact-catalog-family-formula
  precedence.

The wall coverage expansion program addresses this gap under the established
project discipline: every slice pairs widening with tightening; every lane
is benchmark-backed, source-anchored, or formula-owned; every input has one
deterministic path to one defended answer.

## Prerequisites (Must Land Before First Widening)

These audit findings must be executed before any new wall corridor is
opened. They are the guardrails that protect every new lane.

### P1. Wall hostile-input matrix

Mirror the existing floor discipline to walls.

- Engine file: `packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts`
- Workbench file: `apps/web/features/workbench/raw-wall-hostile-input-route-card-matrix.test.ts`
- Scenarios (per user's corner-case rule):
  - 50+ layer wall stacks (no `NaN`/`undefined`, no crashes)
  - Layer reordering (role-indifferent orderings must produce the same
    answer for walls whose order is not physically meaningful; order-
    sensitive walls must say so explicitly via a label)
  - Unknown `materialId`, empty `materialId: ""`, non-numeric
    `thicknessMm` (e.g. `"abc" as any`)
  - Missing `wallRole`, missing required field
- Precedence: tests must remain green as every new wall lane lands.

### P2. Engine-level hostile thickness test

A cross-cutting guard that covers both floor and wall.

- File: `packages/engine/src/hostile-thickness-input.test.ts`
- Scenarios: `thicknessMm: 0`, `thicknessMm: -5`, `thicknessMm: NaN`,
  `thicknessMm: Infinity`, `thicknessMm: "abc" as any`.
- Assertion: no `NaN`/`undefined` propagates; each scenario produces a
  defended fail-closed output or a specific, documented thrown error.

### P3. 50+ layer stress test

- File: `packages/engine/src/many-layer-stress.test.ts`
- Scenarios: 50+ layer floor and wall stacks with realistic mixes.
- Assertion: engine returns either a defended answer or a structured
  fail-closed warning. No `NaN`, no crash, no timeouts.

## Widening Candidates (Tier 1)

Each candidate is a formula-owned wall lane that is safe to defend today
without overriding any existing exact wall row. Precedence is explicit:
exact > catalog > bound > family > formula > low-confidence > unsupported.
A new formula lane never shadows an exact row even if its output space
overlaps — the selector's deterministic routing ensures a single path per
input.

### C1. Mass law single-leaf wall (formula-owned)

Physical basis: Rw ≈ 20·log10(m'·f) − 47 (or per-project standardized
derivation). Applies to single-leaf massive walls (concrete, masonry,
dense AAC) where mass per unit area dominates.

- Input topology: single base_structure layer (`concrete`, `brick`,
  `aac_block`, `dense_stone`), optional thin finish (`plaster`,
  `gypsum_board`) with no second leaf and no cavity.
- Output: `Rw` only (mass law is airborne-only). Impact outputs stay
  unsupported.
- Provenance label: `formula_mass_law_single_leaf_wall`.
- Precedence: the lane fires only when no exact wall row or family
  estimate already claims the input.
- Negative cases: any stack with a second leaf, a cavity, or a lining
  thicker than `X mm` falls off this lane.
- Test matrix:
  - Positive: typical single-leaf concrete / masonry / dense AAC
    topologies produce the expected `Rw`.
  - Negative: same stack with a second leaf → not this lane.
  - Negative: same stack with a resilient interlayer → not this lane.
  - Precedence: when a Ytong `D700` exact row exists for the same stack,
    exact row wins.
  - Reordering: reversing layer order on a truly single-leaf stack is a
    no-op (mass law is order-independent for single leaf).
  - Hostile: missing `thicknessMm` or unknown `materialId` falls off the
    lane with a warning.

### C2. Sharp double-leaf wall (formula-owned)

Physical basis: Sharp's formula for double-leaf walls with a decoupled
cavity. Applies to LSF, double-stud, decoupled masonry double-leaf.

- Input topology: two `base_structure` layers (one "outer leaf", one
  "inner leaf") separated by a cavity (with or without fill), each leaf
  optionally with lining (`gypsum_board`, multiple layers).
- Output: `Rw`. Impact stays unsupported. Optionally `DnT,w` if the field
  context requests it and the field volume is supplied.
- Provenance label: `formula_sharp_double_leaf_wall`.
- Precedence: fires only when no exact row and no existing framed LSF
  benchmark covers the stack.
- Negative cases: triple-leaf, single-leaf, direct-coupled (no cavity)
  → not this lane.
- Test matrix:
  - Positive: typical LSF / double-stud / decoupled masonry stacks.
  - Negative: triple-leaf, single-leaf, direct-coupled.
  - Precedence: Ytong `G5/800` exact row and `airborne-framed-wall-benchmark`
    LSF cases already own their inputs — they must win.
  - Reordering: swapping the two leaves (outer ↔ inner) is a no-op unless
    the wall is explicitly orientation-sensitive.
  - Hostile: cavity without a second leaf falls off the lane.

### C3. Davy lined cavity (formula-owned, refines Sharp)

Physical basis: Davy's refinement of Sharp when the cavity contains
absorbent (mineral wool, glass wool). Adjusts the Sharp output for
cavity absorption quality and thickness.

- Input topology: Sharp double-leaf + cavity fill (mineral wool, glass
  wool, acoustic insulation).
- Output: `Rw` improved by a defended absorption adjustment.
- Provenance label: `formula_davy_lined_cavity_wall`.
- Precedence: fires only when Sharp would fire and the cavity has a
  qualifying absorbent.
- Test matrix: same as Sharp matrix + a positive case where Davy
  adjustment produces a measurably different `Rw` than bare Sharp for
  the same topology with absorbent added.

### C4. CLT wall (formula-owned, mass-timber)

Physical basis: CLT walls behave like thick mass-timber panels. Airborne
performance can be predicted from panel thickness and layer count using
published mass-timber relations (Hongisto, Rindel, or similar).

- Input topology: one or more CLT panels in base_structure role,
  optionally with lining on one or both sides.
- Output: `Rw`. Impact stays unsupported unless the CLT wall is paired
  with a floor edge that has impact inputs.
- Provenance label: `formula_mass_timber_clt_wall`.
- Precedence: fires only when no exact CLT wall row exists (currently
  none do).
- Test matrix: positive (CLT 100mm, 140mm, 200mm with optional lining),
  negative (non-CLT panels with same thickness), precedence vs. any
  future exact row.

## Widening Candidates (Tier 2 — deferred until Tier 1 lands)

These require either new catalog entries, new material definitions, or
new formula families. They are called out here so they are not forgotten.

- Masonry single-leaf and double-leaf (requires `clay_brick` material
  definition + density ladder)
- Sandwich panel / prefab panel (requires research on governing
  formula — ISO 12354-1 composite element method or manufacturer data)
- Curtain wall (requires glass / metal frame materials + specific
  transmission data)
- Partition drywall with multiple studs or staggered stud configurations
- Timber stud wall with explicit `wood_stud` family-specific scoring

## Widening Candidates (Tier 3 — long-lead)

- Wall source catalog: a `packages/catalogs/src/wall-systems/` folder
  analogous to `floor-systems/`, populated with exact rows from Dataholz,
  Knauf, Rockwool, Saint-Gobain Isover, Paroc, and similar sources.
- Wall-specific field continuation model for `DnT,w`, `R'w`, `D2m,nT,w`
  (facade test continuation).

## Wall Preset Additions

From the system audit: only `concrete_wall` preset exists. Each new Tier 1
formula lane should arrive with a matching preset so the user can see the
new capability.

- `light_steel_stud_wall` preset → C2 Sharp + C3 Davy (cavity filled with
  mineral wool)
- `aac_single_leaf_wall` preset → C1 mass law (fires when Ytong/Celcon
  exact row doesn't match input)
- `timber_stud_wall` preset → C2 Sharp with `wood_stud` family
- `clt_wall` preset → C4 CLT wall formula
- `masonry_wall` preset — deferred until `clay_brick` material lands
  (Tier 2)

Each preset is pinned in `apps/web/features/workbench/wall-full-preset-contract-matrix.test.ts`.

## Slice Execution Order

Each step is its own slice with its own planning contract on close.

1. Prerequisite slice `wall_hostile_input_matrix_v1`
   - Land P1 (engine + workbench hostile-input matrices for walls).
   - Land P2 (engine-level hostile thickness test).
   - Close with a successor planning contract selecting the many-layer
     stress test slice or the first formula lane (depending on what
     landed cleanly).
2. Prerequisite slice `many_layer_stress_test_v1`
   - Land P3 (50+ layer stress test for floor + wall).
   - Close with a successor planning contract selecting C1 mass law.
3. First widening slice `wall_mass_law_single_leaf_v1` (C1)
   - Land runtime lane + positive/negative/precedence/reordering matrix
     + workbench route card test + `aac_single_leaf_wall` preset.
   - Close with a successor contract selecting C2 Sharp.
4. `wall_sharp_double_leaf_v1` (C2) + `light_steel_stud_wall` and
   `timber_stud_wall` presets.
5. `wall_davy_lined_cavity_v1` (C3) — lights up absorbent-filled cavities
   in LSF and timber stud walls.
6. `wall_clt_mass_timber_v1` (C4) + `clt_wall` preset.
7. Planning contract closing the wall Tier 1 program and selecting
   Tier 2 (masonry, sandwich, etc.) or a floor tightening pass.

## Non-Goals

- Do NOT reopen any blocked source family (GDMTXA04A, C11c, raw bare,
  wall-selector behavior widening) during this program.
- Do NOT add wall formula lanes that override existing defended wall
  corridors (clear double-leaf, AAC boundary, clear lined-massive, G5
  sibling, heavy-core trim, lab double-stud).
- Do NOT promise impact outputs on walls until a defended impact lane
  exists.
- Do NOT change floor logic inside a wall slice.
- Do NOT merge multiple wall families into a single "universal wall
  formula" — keep family-specific lanes distinct.

## Validation Posture

Every slice in this program must pass:

- `pnpm calculator:gate:current`: green (with that slice's evidence
  added to the focused gate).
- `pnpm check`: green (full lint + typecheck + test + build).
- Every existing floor and wall corridor test stays green.
- `git diff --check`: no whitespace regressions.

## Resolved Design Questions (Iteration 2)

1. **Where does the formula lane live in `dynamic-airborne.ts`?**
   Decision: do **not** split `dynamic-airborne.ts` as a prerequisite to
   landing C1. Reason: splitting is a 6630-line no-runtime refactor that
   touches every wall and floor test; folding it in as a prerequisite
   makes the first slice huge and delays coverage. Instead, land C1
   mass-law inside the existing file with a clear `// region: mass-law`
   section header, and schedule the `dynamic-airborne.ts` split as a
   dedicated no-runtime refactor slice **after** Tier 1 wall coverage
   lands (between C4 and the Tier 1 closeout).

2. **Wall preset registry: `wall-systems/` folder or seed materials?**
   Decision: start with seed materials + topology rules in the engine
   for Tier 1. Rationale: formula-owned lanes are declarative topology
   matchers, not catalog rows, so a `wall-systems/` folder has nothing
   to store at Tier 1. Create `packages/catalogs/src/wall-systems/`
   later when exact wall rows from Dataholz/Knauf/Rockwool actually
   land (Tier 3). This keeps the first wall widening slice small.

3. **Wall mode layer normalization parity with floor?**
   Decision: investigate inside the Prerequisite slice. The wall
   hostile-input matrix will exercise wall normalization under 50+
   layers, reordering, unknown materials, and missing fields. If the
   matrix reveals normalization gaps vs. floor, land a wall-
   normalization-parity slice between Prerequisites and C1. Otherwise
   proceed to C1 directly.

4. **Sharp and Davy: one family or two?**
   Decision: two distinct formula families with explicit precedence
   (Davy > Sharp when cavity has qualifying absorbent; Sharp otherwise).
   Rationale: they produce different numerical outputs, so one
   provenance label that sometimes means "Sharp" and sometimes means
   "Davy" would blur answer origin. Two labels (`formula_sharp_double_leaf_wall`,
   `formula_davy_lined_cavity_wall`) with a precedence test that proves
   Davy fires only when Sharp would fire AND the cavity has absorbent
   matching the Davy applicability criterion.

## Formula Citation Sources (Tier 1)

Every formula-owned lane lands with a cited source so the provenance
label is defensible in a consultant brief.

- **C1 Mass law**: ISO 12354-1, "General method for the prediction of
  airborne sound insulation of rigid homogeneous plates" + standard
  empirical form `Rw ≈ 37.5 · log10(m') − 42` (Gerretsen / Rindel
  adaptation). Reference also the specific derivation used in the
  heavy-concrete formula family already landed in engine.
- **C2 Sharp**: Sharp, B. H. (1978) "Prediction methods for the sound
  transmission of building elements", Noise Control Engineering, vol 11,
  issue 2. Specific form used: the two-leaf mass-spring-mass formulation
  with coincidence correction for the outer leaf.
- **C3 Davy**: Davy, J. L. (2010) "The improvement of a simple
  theoretical model for the prediction of the sound insulation of double
  leaf walls", Journal of the Acoustical Society of America, vol 127.
  Specific form: Davy's cavity absorption adjustment applied on top of
  Sharp output.
- **C4 CLT wall**: Hongisto, V. (2006) "Sound insulation of double walls"
  or Rindel, J. H. (2018) "Sound Insulation in Buildings" chapter on
  cross-laminated timber panels. Specific form to be picked in the C4
  slice plan.

These citations go into the engine as a shared constant map so the
provenance label can link to the source in proposal output.

## First Implementable Slice (Prerequisite #1)

Slice id: `wall_hostile_input_matrix_v1`

Behavior class: no-runtime guard matrix landing.

### Files to land

1. `packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts`
   - Engine-side matrix: calls `calculateAssembly(layers, opts)` for
     wall-mode layer stacks with hostile inputs; asserts fail-closed
     behavior (warning emitted, no `NaN`, no crash, unsupported outputs
     marked explicitly).
2. `apps/web/features/workbench/raw-wall-hostile-input-route-card-matrix.test.ts`
   - Workbench-side matrix: uses `evaluateScenario` with `studyMode:
     "wall"`; asserts the same fail-closed behavior on route-card
     surfaces (card status, warning display).
3. `packages/engine/src/hostile-thickness-input.test.ts`
   - Cross-cutting (floor + wall): exercises `thicknessMm: 0 | -5 | NaN
     | Infinity | "abc" as any` at the engine surface; asserts defended
     fail-closed output or a specific thrown error for each.

### Test scenarios to cover in each file

For `raw-wall-hostile-input-answer-matrix.test.ts`:
- wall with 50 identical `gypsum_board` layers → no crash, defended
  output or fail-closed with warning
- wall with 50 mixed layers (alternating materials, varying thickness)
  → no crash
- wall with `materialId: "not_a_real_material"` → warning, fail-closed
- wall with `materialId: ""` → warning, fail-closed
- wall with `thicknessMm: 0` → warning, layer dropped or fail-closed
- wall with layers reordered (same materials, different order) on a
  single-leaf wall → answer is identical (mass law is order-independent
  for single leaf)
- wall with layers reordered on a double-leaf wall where orientation is
  physically meaningful → answer differs, and the provenance label
  records that order sensitivity explicitly

For `raw-wall-hostile-input-route-card-matrix.test.ts`:
- Same scenarios surfaced through the workbench `scenario-analysis`
  path; assert the card status matches the engine's unsupported/live
  posture and the warning appears in the consultant trail output.

For `hostile-thickness-input.test.ts`:
- `thicknessMm: 0` → layer dropped with a "missing thickness" warning
- `thicknessMm: -5` → layer rejected with a specific warning (not
  silently absoluted)
- `thicknessMm: NaN` → specific warning, no downstream `NaN`
- `thicknessMm: Infinity` → specific warning, no downstream crash
- `thicknessMm: "abc" as any` → type-system slippage defended by a
  runtime guard that rejects non-finite non-positive values
- Same 5 scenarios for floor mode and wall mode

### Validation

- Targeted engine+web pack: run the 3 new test files plus the existing
  `raw-floor-hostile-input-*` matrices to confirm no regression.
- `pnpm calculator:gate:current`: green after these files are added to
  the focused gate.
- `pnpm check`: green across all 130+ test files.
- `git diff --check`: green.

### Closeout contract

`packages/engine/src/post-wall-hostile-input-matrix-v1-next-slice-selection-contract.test.ts`

- `latestClosedImplementationSlice: "wall_hostile_input_matrix_v1"`
- `selectedImplementationSlice: "many_layer_stress_test_v1"` (next
  prerequisite)
- Evidence packs listing all three test files landed plus the focused
  gate update.

## Iteration Notes

- Iteration 1 (2026-04-20 planning slice kickoff): first draft, 4 open
  design questions.
- Iteration 2 (2026-04-20, same day): open questions resolved, formula
  citations enumerated, first slice made executable.
- Iteration 3 (TBD, before executing the prerequisite slice): final
  pre-execution review. Must confirm: (a) audit finding #1
  (`dynamic-airborne.ts` split) is scheduled between C4 and Tier 1
  closeout, not before C1; (b) citation sources are accessible and the
  exact formula forms are documented; (c) the prerequisite slice's
  hostile-input matrix does not accidentally break any existing wall
  corridor guard test.
