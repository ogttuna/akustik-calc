# Company Internal Controlled Use Handoff

Status: Gate C closed handoff pack for
`company_internal_controlled_use_handoff_v1`. This document is now the
historical controlled-use operator pack. Controlled personal/company-
internal use is allowed only inside the envelope below and only with the
caveats carried with each lane. This is not regulatory certification,
not external/client certification, and not a broad high-accuracy
opening.
Marker: not a broad high-accuracy opening.

Current-state override, 2026-06-05: this handoff is not the current
calculator next-slice selector. Usable V1 is closed for the current
tested envelope, and post-V1 scope/accuracy work is governed by
[CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md) and
[POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md](./POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md).
Gate CH is the latest landed value-moving runtime slice, and
`post_v1_next_numeric_coverage_gap_gate_ci_plan` is the selected next
numeric coverage-gap label.

The high-accuracy label remains forbidden. Rockwool triple-leaf remains
screening-only and must not be described as exact or source-validated.

Executable owner:

`packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts`

Selected closeout:

`packages/engine/src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts`

Selected closeout action:

`gate_c_closeout_company_internal_controlled_use_handoff_and_next_slice_selection`

Closeout status:

`closed_company_internal_controlled_use_handoff_no_runtime_and_selected_source_gap_revalidation_v24`

Closeout artifacts:

- `company_internal_controlled_use_handoff_closed`
- `controlled_use_pack_is_current_operator_handoff`
- `calculator_source_gap_revalidation_v24_selected`

Selected next source-gap pass:

`packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_accuracy_gap_order_after_controlled_use_handoff_closeout`

## Gate A Artifacts

- `current_operator_workflow`
- `current_acceptance_bucket_table`
- `ready_values_snapshot`
- `caveated_blocked_stop_rules`
- `validation_command_log`
- `rockwool_screening_only_notice`
- `selected_closeout_or_source_gap_followup`

No runtime/support/confidence/evidence/API/route-card/output-card,
proposal/report/workbench-input behavior is allowed to move in this
handoff slice.

## Current Operator Workflow

1. Select `wall` or `floor` first. Do not reuse a wall result for a
   floor or a floor result for a wall.
2. Fill the inputs opened by that selection. Field or building outputs
   need geometry, context mode, and receiving-room data when the route
   asks for them.
3. Add layers with material and thickness. Keep source-corridor stacks
   close to their documented topology; if the stack stops matching the
   corridor, treat the result as generated, screening, or blocked
   according to the route card.
4. Read value, support, confidence, evidence, route, warnings, and
   unsupported outputs. Do not rely only on the headline number.
   Marker: Read value, support, confidence, evidence, route, warnings, and unsupported outputs.
5. Copy the caveat into any surrounding engineering note when the lane
   is formula-owned, source-gated, screening-only, low-confidence,
   field-continuation, or unsupported.
6. If the result says `needs_input`, unsupported, fail-closed,
   source-gated, or screening-only, stop and keep the caveat or block.
   Do not invent a defended exact answer.
   Stop phrase: `needs_input`, unsupported, fail-closed, source-gated, or screening-only.
7. For many-layer, reorder, save/load, import, or hostile-edit cases,
   trust only the protected behaviors listed here. Do not infer broad
   arbitrary layer-order invariance from a nearby green test.
   Reorder phrase: Do not infer broad arbitrary layer-order invariance.

## Current Acceptance Bucket Table

### ready_with_current_source_or_benchmark_owner

These lanes are usable for controlled internal estimates when the
entered stack matches the documented source or benchmark corridor. Keep
the standard caveat visible: calculator estimate, not certification.

| Scenario id | Use now | Current value / output expectation | Proof owner |
|---|---|---|---|
| `wall_lsf_exact_preset` | yes, standard caveat | `Rw=55`, `R'w=48`, building `DnT,w=50`; exact lab row with field/building continuation | `company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts` |
| `wall_aac_single_leaf_benchmark` | yes, standard caveat | `Rw=47`, `R'w=45`, building `DnT,w=47`; benchmark-backed single-leaf corridor | `company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts` |
| `wall_masonry_single_leaf_benchmark` | yes, standard caveat | `Rw=43`, `R'w=41`, building `DnT,w=43`; benchmark-backed masonry corridor | `company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts` |
| `floor_pliteq_exact_source_corridor` | yes, standard caveat | `Rw=60`, `Ln,w=58`, `L'n,w=61`, `L'nT,w=58.2`; `Ln,w+CI`, `DeltaLw`, and `L'nT,50` unsupported | `company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts` |
| `floor_ubiq_bound_source_corridor` | yes, standard caveat | `Rw=62`, `Ln,w=52`, `L'n,w=55`, `L'nT,w=52.2`; bound interpolation, not exact source row | `company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts` |

### caveated_screening_or_field_continuation

These lanes can support controlled comparison and early internal design
discussion only when the caveat is visible. Do not write exact,
source-backed, benchmark-backed, or design-grade unless a later
source-ready slice changes the executable contract.

| Scenario id | Use now | Required visible caveat | Current value / output expectation |
|---|---|---|---|
| `rockwool_grouped_triple_leaf_screening_only` | yes, caveated | Rockwool remains screening-only, not exact/source-validated | grouped `Rw 41`, `STC 41`, low confidence, `multileaf_screening_blend` |
| `rockwool_flat_list_swap_screening_guard` | yes, caveated | flat-list adjacent swaps keep the current double-leaf numeric lane until grouped topology proves a physical triple-leaf penalty | flat-list `Rw 51` numeric hold, medium confidence, `double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology` |
| `rockwool_field_continuation_screening_bridge` | yes, caveated | field outputs are continuations from active lab/screening/apparent/bound basis, not independent design-grade field measurements | field `R'w 34` and `DnT,w 36`, low confidence |
| `wall_timber_double_board_generated` | yes, caveated | low confidence, generated, formula-owned, source-gated | generated `wall-timber-stud`: `Rw=42`, `R'w=42`, `DnT,w=43` |
| `wall_lined_heavy_core_screening` | yes, caveated | medium confidence, screening/formula-owned, no wall-specific bounded lining rule | generated `wall-screening-concrete`: `Rw=55`, `R'w=55`, `DnT,w=56`, `DnT,A=54.9` |
| `floor_steel_fallback_generated` | yes, caveated | low-confidence screening fallback | generated `floor-steel-fallback`: `Rw=61`, `Ln,w=58.3`, `L'n,w=61.3`, `L'nT,w=58.5`; `L'nT,50` unsupported |

### blocked_source_owner_missing_or_needs_input

These lanes are not defended calculator answers for controlled use. They
must remain blocked, explicitly unsupported, `needs_input`, fail-closed,
or source-gated.

| Scenario id | Use now | Required behavior |
|---|---|---|
| `near_source_rows_context_only_until_owner_set_exists` | no | near-source rows are context only; no exact/runtime import without a complete owner set |
| `wall_no_stud_double_leaf_source_gated` | no | no runtime/confidence promotion without direct row mapping or bounded formula tolerance owner |
| `unsupported_target_output_partition` | no | unsupported companions remain unsupported instead of fabricated |
| `uris_2006_rights_safe_source_packet_absent` | no | Uris 2006 stays `paused_waiting_rights_safe_source_packet` |

### hostile_many_layer_reorder_and_import_edges

These lanes prove that hostile or messy user behavior remains finite,
explicit, or blocked. They are not source claims.

| Scenario id | Use now | Required behavior |
|---|---|---|
| `estimate_and_impact_json_1e309_rejected` | robustness only | finite schema validation rejects non-finite JSON at `layers.0.thicknessMm` |
| `hostile_unknown_material_engine_fail_closed` | robustness only | unknown materials reach engine fail-closed behavior with no supported outputs |
| `floor_many_layer_exact_split_stack` | robustness only | 50+ exact split stacks remain finite; exact match stays explicit |
| `floor_many_layer_raw_fail_or_screening_stack` | robustness only | raw 50+ stacks remain finite/null and do not fabricate exact/bound matches |
| `floor_role_defined_reorder_exact_stack` | robustness only | role-defined exact precedence survives representative reorder/edit |
| `floor_raw_reorder_support_boundary` | robustness only | raw moved support may drop `Rw`; broad arbitrary reorder invariance is not claimed |

## Ready Values Snapshot

Current ready source/benchmark corridors:

- `wall_lsf_exact_preset`: `Rw=55`, `R'w=48`, building `DnT,w=50`
- `wall_aac_single_leaf_benchmark`: `Rw=47`, `R'w=45`, building
  `DnT,w=47`
- `wall_masonry_single_leaf_benchmark`: `Rw=43`, `R'w=41`, building
  `DnT,w=43`
- `floor_pliteq_exact_source_corridor`: `Rw=60`, `Ln,w=58`,
  `L'n,w=61`, `L'nT,w=58.2`
- `floor_ubiq_bound_source_corridor`: `Rw=62`, `Ln,w=52`,
  `L'n,w=55`, `L'nT,w=52.2`

## Caveated Blocked Stop Rules

Rockwool remains screening-only where grouped triple-leaf topology is
explicit: grouped `Rw 41`, field `R'w 34` and `DnT,w 36`, not
exact/source-validated. Flat-list adjacent swaps now stay on the current
double-leaf numeric lane (`Rw 51`) until grouped topology proves a
physical triple-leaf penalty. Uris 2006 remains
`paused_waiting_rights_safe_source_packet`.

Source promotion requires source provenance, topology owner, material
mapping owner, metric context owner, tolerance owner, negative
boundaries, paired engine tests, and paired visible tests. Import
snapshots and near-source similarity cannot seed runtime.

Guard phrase: source promotion requires source provenance, topology owner, material mapping owner, metric context owner, tolerance owner, negative boundaries, paired engine tests, and paired visible tests.

Field outputs are continuations from active lab/screening/apparent/bound
basis, not independent design-grade field measurements. Use `R'w`,
`DnT,w`, `L'n,w`, and `L'nT,w` only with the active basis caveat.

Unsupported companions remain unsupported. Missing geometry, receiving
room data, non-finite thicknesses, unknown materials, and source-gated
families must stop the workflow instead of producing an invented
defended value.

## Validation Command Log

Focused Gate A:

```sh
pnpm --filter @dynecho/engine exec vitest run src/company-internal-controlled-use-handoff-gate-a-contract.test.ts --maxWorkers=1
```

Continuity:

```sh
pnpm --filter @dynecho/engine exec vitest run src/company-internal-controlled-use-handoff-gate-a-contract.test.ts src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts src/company-internal-misclassification-readiness-blocker-contract.test.ts --maxWorkers=1
```

Current gate:

```sh
pnpm calculator:gate:current
```

Whitespace guard:

```sh
git diff --check
```

Gate A validation completed on 2026-05-05:

- focused Gate A passed 1 file / 6 tests
- continuity passed 6 files / 33 tests
- `pnpm calculator:gate:current` passed with engine 255 files / 1476
  tests, web 53 files / 260 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green
- final `git diff --check` passed after restoring
  `apps/web/next-env.d.ts` to `.next-typecheck`

Broad `pnpm check` is reserved for the selected Gate C closeout or any
later runtime/user-visible movement. Known non-fatal `sharp/@img`
warnings through `@turbodocx/html-to-docx` remain unchanged.

Gate C closeout validation completed on 2026-05-05:

- focused Gate C passed 1 file / 5 tests
- continuity passed 8 files / 43 tests
- `pnpm calculator:gate:current` passed with engine 256 files / 1481
  tests, web 53 files / 260 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green
- broad `pnpm check` passed with lint/typecheck clean, engine 389 files
  / 2301 tests, web 165 files / 933 passed + 18 skipped, repo build
  5 / 5 tasks
- final `git diff --check` passed

## Rockwool Screening Only Notice

Rockwool triple-leaf is the most visible current accuracy blocker. The
calculator may show a screening result for internal comparison, but it
must not be used as an exact/source-validated triple-leaf answer. Any
handoff, route card, output card, proposal note, or internal engineering
note must carry the screening-only language until a rights-safe source
packet or equivalent source-owned curve payload exists.

## Selected Closeout Or Source Gap Followup

Gate A selects closeout, not runtime promotion:

`packages/engine/src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts`

Closeout should choose between keeping this controlled-use pack as the
current operator handoff or selecting a bounded source-gap follow-up if
validation exposes a concrete defect. It must not open a direct
high-accuracy label unless the controlled-use caveats, Rockwool
screening notice, hostile guards, current gate, and broad validation are
all explicitly green.
