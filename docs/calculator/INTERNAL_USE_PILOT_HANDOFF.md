# Internal Use Pilot Handoff

Status: Gate A handoff pack for `internal_use_pilot_handoff_v1`.
Controlled company-internal use is allowed only inside the envelope
below. This is not regulatory certification and it does not promote any
low-confidence, screening, or source-gated family.

Read this file before using the calculator for an internal wall or
floor estimate. For the executable proof, see
`packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts`
and
`packages/engine/src/internal-use-pilot-handoff-v1-gate-a-contract.test.ts`.

## Operator Workflow

1. Select `wall` or `floor` first. Do not reuse a wall result for a
   floor or a floor result for a wall.
2. Fill the inputs opened by that selection. Field or building outputs
   need geometry and receiving-room data when the route asks for them.
3. Add materials and thicknesses. Keep source-corridor stacks close to
   their documented topology; if the stack stops matching the corridor,
   treat the result as generated or blocked according to the route card.
4. Run the calculation and read the value, support status, confidence,
   evidence text, route card, warnings, and unsupported-output list.
5. Copy the caveat into any surrounding engineering note when the lane
   is formula-owned, source-gated, screening, low-confidence, or
   unsupported.
6. If the result says `needs_input`, unsupported, fail-closed, or
   source-gated, stop and provide the missing input or keep the item as
   blocked. Do not invent a defended answer.
   Status phrase: `needs_input`, unsupported, fail-closed, or source-gated.
7. For many-layer, reorder, save/load, or hostile-edit cases, trust only
   the protected behaviors listed here. Do not infer broad arbitrary
   layer-order invariance from a nearby green test.
   Reorder phrase: Do not infer broad arbitrary layer-order invariance.

## Scenario Buckets

### pilot_ready_with_standard_caveat

These lanes are usable for ordinary internal estimates when the entered
stack matches the documented preset/source corridor. Keep the standard
internal-use caveat visible: calculator estimate, not certification.

| Scenario id | Use now | Current value / output expectation | Proof owner |
|---|---|---|---|
| `wall_lsf_exact_preset` | yes, standard caveat | `Rw=55`, `R'w=48`, building `DnT,w=49`; exact/high source posture | `wall-lsf-timber-stud-preset-benchmarks.test.ts` |
| `wall_aac_single_leaf_benchmark` | yes, standard caveat | `Rw=47`, `R'w=45`, building `DnT,w=46`; benchmark-backed posture | `wall-preset-expansion-benchmarks.test.ts` |
| `wall_masonry_single_leaf_benchmark` | yes, standard caveat | `Rw=43`, `R'w=41`, building `DnT,w=43`; benchmark-backed posture | `wall-preset-expansion-benchmarks.test.ts` |
| `floor_pliteq_exact_source_corridor` | yes, standard caveat | exact source match; supported partition stays explicit | `floor-fallback-low-confidence-gate-b-source-contract.test.ts` |
| `floor_ubiq_bound_source_corridor` | yes, standard caveat | bound interpolation source corridor; bound-vs-exact distinction remains visible | `floor-fallback-low-confidence-gate-b-source-contract.test.ts` |

### pilot_allowed_with_visible_caveat

These lanes are useful for internal comparisons and early design
discussion only when the caveat is visible. Do not write exact,
source-backed, or benchmark-backed on these results unless a later
source-ready slice changes the executable contract.

| Scenario id | Use now | Required visible caveat | Current value / output expectation |
|---|---|---|---|
| `wall_timber_double_board_generated` | yes, caveated | low confidence, formula-owned, source-gated | generated `wall-timber-stud`: `Rw=50`, `R'w=42`, field `DnT,w=43`, building `DnT,w=44` |
| `wall_clt_local_generated` | yes, caveated | medium confidence, formula-owned, source-gated | generated `wall-clt-local`: `Rw=42`, `R'w=41`, field `DnT,w=42` |
| `wall_lined_heavy_core_screening` | yes, caveated | screening only, no wall-specific bounded lining rule | generated `wall-screening-concrete`: `Rw=57`, `R'w=55`, `DnT,w=56`, `DnT,A=54.9` |
| `floor_steel_fallback_generated` | yes, caveated | low-confidence screening estimate | generated `floor-steel-fallback`: `Rw=61`, `R'w=70`, `Ln,w=58.3`, `L'n,w=61.3`, `L'nT,w=58.5`; `L'nT,50` unsupported |

### not_defended_fail_closed_or_source_gated

These lanes are not defended calculator answers in the company pilot.
They must remain blocked, explicitly unsupported, `needs_input`, or
source-gated.

| Scenario id | Use now | Required behavior |
|---|---|---|
| `invalid_thickness_all_callers_fail_closed` | no | no supported outputs; warnings stay explicit; finite/null result surfaces only |
| `api_missing_layers_next_field` | no | API points to the next missing field instead of calculating |
| `unsupported_target_output_partition` | no | unsupported companions remain unsupported instead of fabricated |
| `wall_no_stud_double_leaf_source_gated` | no | no runtime/confidence promotion without direct rows or bounded formula tolerance |
| `historical_blocked_floor_families` | no | `GDMTXA04A`, `C11c`, raw open-box/open-web stay closed unless new source evidence selects a later slice |

### hostile_many_layer_reorder_and_missing_input_edges

These lanes are robustness checks for hostile or messy user behavior.
They prove that the app remains finite, explicit, or blocked. They are
not source claims.

| Scenario id | Use now | Required behavior |
|---|---|---|
| `floor_many_layer_exact_split_stack` | robustness only | finite exact 50+ layer behavior; unsupported companions preserved; no source promotion |
| `floor_many_layer_raw_fail_or_screening_stack` | robustness only | finite/null values, explicit unsupported outputs, no fabricated exact/bound match |
| `floor_role_defined_reorder_exact_stack` | robustness only | role-defined exact precedence survives representative reorder/edit |
| `floor_raw_reorder_support_boundary` | robustness only | raw order may change support posture; broad arbitrary reorder invariance is not claimed |
| `wall_field_missing_geometry_needs_input` | robustness only | `Dn,w` / `DnT,w` stay pending until geometry and room inputs are present |
| `mixed_study_mode_save_load_replay_owner` | robustness only | save/load replay proof remains owned by the existing web torture matrix |

## Known Gaps And Blocks

Do not promote these families for pilot convenience:

| Family | Current posture | Missing before runtime import or confidence promotion |
|---|---|---|
| `timber_double_board_stud_wall` | formula-owned, low confidence, source-gated | direct double-board timber topology row or bounded formula tolerance owner |
| `clt_mass_timber_wall` | formula-owned, medium confidence, source-gated | wall-specific CLT/NLT/DLT row pack or laminated-leaf tolerance owner |
| `lined_massive_heavy_core_wall` | screening only | wall-specific lined concrete/heavy masonry row or bounded lining rule |
| `no_stud_double_leaf_wall` | formula-owned, source-blocked | no-stud/no-rail direct row mapping or local Davy/Sharp tolerance owner |
| `generated_floor_fallback` | low-confidence screening | exact Pliteq/Ubiq topology match or bounded steel/open-web family rule |
| `historical_blocked_families` | fail-closed | new source evidence for `GDMTXA04A`, `C11c`, or true bare carrier impact behavior |

A source-ready accuracy pack must name exact topology and material
thickness mapping, metric owner, tolerance owner, protected negative
boundaries, and paired engine/web visible tests before it can change
runtime behavior.
Prerequisites phrase: exact topology and material thickness mapping,
metric owner, tolerance owner, protected negative boundaries, paired
engine/web visible tests.

## Validation Evidence Map

Current focused baseline before this Gate A:

- `pnpm calculator:gate:current`
  - engine: 138 files / 661 tests
  - web: 45 files / 216 passed + 18 skipped
  - build: 5/5 with known non-fatal `sharp/@img` warnings
  - whitespace guard: clean

Required validation for this handoff:

| Command | Purpose | Expected result |
|---|---|---|
| `pnpm --filter @dynecho/engine exec vitest run src/internal-use-pilot-handoff-v1-gate-a-contract.test.ts --maxWorkers=1` | proves this handoff pack is complete and internally consistent | green, 1 file / 6 tests |
| `pnpm --filter @dynecho/engine exec vitest run src/post-internal-use-acceptance-rehearsal-v1-next-slice-selection-contract.test.ts --maxWorkers=1` | preserves the Gate C decision that selected this handoff | targeted Gate C green, 1 file / 5 tests |
| `pnpm calculator:gate:current` | focused calculator regression gate | green, engine 139 files / 667 tests; web 45 files / 216 passed + 18 skipped; build 5/5 |
| `pnpm check` | release-candidate broad gate for company handoff | green, engine 272 files / 1487 tests; web 157 files / 890 passed + 18 skipped; build 5/5 |
| `git diff --check` | whitespace guard | clean |

## Handoff Decision

The current calculator can be used for controlled company-internal
estimates inside the lanes above. It is not ready for unreviewed
external/client certification workflows. The next slice after Gate A
should be Gate C closeout unless focused or broad validation exposes a
concrete pilot defect.

No runtime/support/confidence/evidence/API/route-card/output-card/
proposal/report/workbench-input behavior is allowed to move in this
handoff slice.
