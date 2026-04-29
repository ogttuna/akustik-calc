# Internal Use Pilot Usage Note

Status: current company-internal pilot usage note after
`internal_use_pilot_handoff_v1` Gate C closeout. The operating
envelope, acceptance matrix, and handoff are closed no-runtime; the
active next slice is `calculator_source_intake_backlog_cleanup_v1`. For
the concise operator handoff, read
[INTERNAL_USE_PILOT_HANDOFF.md](./INTERNAL_USE_PILOT_HANDOFF.md).

Use this note when running short company-internal calculator pilots. It
does not certify a design and it does not promote any low-confidence,
screening, or source-gated family. It tells a knowledgeable internal
user which outputs can be used as estimates today and which need a
visible caveat.

## Operating Envelope

### pilot_ready_with_standard_caveat

Use these for ordinary internal estimates when the entered stack matches
the preset/source corridor and the route card stays source-backed or
benchmark-backed.

| Scenario id | Family | Current evidence | Expected values / outputs | Proof owner |
|---|---|---|---|---|
| `wall_lsf_exact_preset` | light-steel stud wall | exact Knauf lab row / benchmark-backed preset | `Rw=55`, `R'w=48`, building `DnT,w=49` | `wall-lsf-timber-stud-preset-benchmarks.test.ts` |
| `wall_aac_single_leaf_benchmark` | AAC single-leaf wall | Xella benchmark/exact lab anchor | `Rw=47`, `R'w=45`, building `DnT,w=46` | `wall-preset-expansion-benchmarks.test.ts` |
| `wall_masonry_single_leaf_benchmark` | masonry single-leaf wall | Wienerberger benchmark/exact lab anchor | `Rw=43`, `R'w=41`, building `DnT,w=43` | `wall-preset-expansion-benchmarks.test.ts` |
| `floor_exact_bound_source_corridor` | source-backed floor corridors | exact/bound floor precedence | supported outputs include `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`, `L'nT,w` when the stack matches the source corridor | `airborne-verified-catalog.test.ts`, `floor-source-corpus-contract.test.ts` |

Rules:

- Keep the normal internal-estimate caveat visible: calculator result,
  not regulatory certification.
- If the layer stack stops matching the protected source corridor, do
  not keep treating the result as exact or benchmark-backed.
- For field and building contexts, fill the required geometry and room
  inputs. Missing building data should remain `needs_input`, not an
  invented number.

### pilot_allowed_with_visible_caveat

Use these only when the user can see that the result is formula-owned,
low-confidence, screening, or source-gated. These are useful for
internal comparisons and early design discussion, not defended source
truth.

| Scenario id | Family | Required visible caveat | Expected values / outputs | Proof owner |
|---|---|---|---|---|
| `wall_timber_double_board_generated` | timber double-board stud wall | low confidence, formula-owned, source-gated | generated `wall-timber-stud`: `Rw=50`, `R'w=42`, field `DnT,w=43`, building `DnT,w=44` | `wall-timber-double-board-source-research-gate-a-contract.test.ts` |
| `wall_clt_local_generated` | CLT wall | medium confidence, formula-owned, source-gated | generated `wall-clt-local`: `Rw=42`, `R'w=41`, field `DnT,w=42` | `wall-clt-wall-source-research-gate-a-contract.test.ts` |
| `wall_lined_heavy_core_screening` | lined/heavy-core concrete or masonry wall | screening only, no wall-specific bounded lining rule | generated `wall-screening-concrete`: `Rw=57`, `R'w=55`, `DnT,w=56`, `DnT,A=54.9` | `wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts` |
| `floor_steel_fallback_generated` | generated steel floor fallback | low-confidence screening estimate | generated `floor-steel-fallback`: `Rw=61`, `R'w=70`, `Ln,w=58.3`, `L'n,w=61.3`, `L'nT,w=58.5`; `L'nT,50` unsupported | `floor-fallback-low-confidence-gate-b-source-contract.test.ts` |
| `many_layer_and_reorder_guardrails` | hostile edit / many-layer / reorder behavior | finite, stable, or explicitly unsupported; not a new source claim | behavior protected by many-layer and layer-order guards | `floor-many-layer-stress-gate-a-matrix.test.ts`, `floor-layer-order-invariance-expansion-gate-a-contract.test.ts` |

Rules:

- Do not write "exact", "source-backed", or "benchmark-backed" on these
  results unless a later source slice changes the executable contract.
- Preserve unsupported-output messages. For example, `L'nT,50` on the
  generated steel floor fallback remains unsupported.
- If a warning or low-confidence label appears, include it in any
  proposal/report note made from the pilot result.

### not_defended_fail_closed_or_source_gated

Do not use these as defended calculator answers in the company pilot.
They should either fail closed, ask for missing inputs, or remain a
clearly source-gated research item.

| Scenario id | Current posture | Required behavior |
|---|---|---|
| `invalid_or_missing_inputs` | fail-closed / `needs_input` | ask for the missing or invalid field; do not synthesize a defended result |
| `unsupported_target_outputs` | unsupported output | show unsupported status and reason |
| `wall_no_stud_double_leaf_source_gated` | formula-owned source-gated family | no runtime or confidence promotion without direct rows or bounded formula tolerance |
| `historical_blocked_floor_families` | closed fail-closed source gaps such as `GDMTXA04A`, `C11c`, and raw open-box/open-web | do not reopen from nearby green tests alone |

### hostile_many_layer_reorder_and_missing_input_edges

Use these only as robustness checks around the pilot, not as new source
claims. They prove that hostile or messy user behavior stays finite,
explicitly unsupported, or `needs_input` instead of silently becoming a
defended result.

| Scenario id | Current posture | Required behavior |
|---|---|---|
| `floor_many_layer_exact_split_stack` | exact/source corridor stress | finite supported values, unsupported companions preserved, no source promotion |
| `floor_many_layer_raw_fail_or_screening_stack` | raw hostile stack | finite/null values only with explicit unsupported outputs; no fabricated exact match |
| `floor_role_defined_reorder_exact_stack` | role-defined reorder/edit | exact precedence remains protected when floor roles define the stack |
| `floor_raw_reorder_support_boundary` | raw layer-order boundary | raw order may change support posture; do not claim broad arbitrary reorder invariance |
| `wall_field_missing_geometry_needs_input` | missing field/building inputs | `Dn,w` / `DnT,w` stay pending input until geometry and receiving-room data are supplied |
| `mixed_study_mode_save_load_replay_owner` | save/load proof owner | rely on the existing web torture test; do not duplicate that long matrix in the pilot note |

## Pilot Checklist

1. Pick wall or floor and use the matching input fields.
2. Add the layers and thicknesses. If the route asks for field/building
   data, fill the required geometry or receiving-room fields.
3. Read both the value and the route/evidence text. The evidence text is
   part of the answer.
4. Use `pilot_ready_with_standard_caveat` results for ordinary internal
   estimates.
5. Use `pilot_allowed_with_visible_caveat` results only with their
   caveat copied into the surrounding engineering note.
6. Treat `not_defended_fail_closed_or_source_gated` results as blocked
   until a later source or bounded-tolerance slice changes the contract.

## Next Step

Gate B landed the regular internal-use visibility audit. The only
behavior movement was visible wording for dynamic wall formula routes:
validation, evidence, and proposal/report surfaces now say explicitly
when no exact wall source row is active and keep
formula-owned/source-gated scoped-estimate language visible.

Gate C has now closed the operating-envelope slice no-runtime and
selected `calculator_source_pack_readiness_triage_v1`. Source-pack
readiness then selected CLT / mass-timber source-pack extraction for
no-runtime row/metric inspection. That extraction has now closed at
Gate C without runtime import because no source-ready metric-mapping or
formula-tolerance path exists yet. Runtime values, support classes,
confidence classes, source evidence tiers, API shape, route-card values,
and output-card statuses remain frozen.

`internal_use_acceptance_rehearsal_v1` Gate A landed the executable
company-use acceptance matrix from this note. It pins 20 representative
scenarios across ready benchmark/source corridors, caveated
formula/screening routes, fail-closed/source-gated cases, and hostile
many-layer/reorder/missing-input proof owners without changing runtime
values or promoting source-gated families.

Gate C has now closed the acceptance rehearsal no-runtime. No concrete
acceptance defect or source-ready accuracy pack was found, so the next
bounded action moved to `internal_use_pilot_handoff_v1`. Gate A has now
prepared [INTERNAL_USE_PILOT_HANDOFF.md](./INTERNAL_USE_PILOT_HANDOFF.md)
with scenario buckets, validation evidence, known gaps, and an operator
checklist. That handoff keeps
`runtime/support/confidence/evidence/API/route-card/output-card` and
`proposal/report/workbench-input` behavior frozen. Gate C then closed
the handoff no-runtime and selected
`calculator_source_intake_backlog_cleanup_v1` because no concrete pilot
defect or source-ready accuracy pack exists.
