# Calculator Docs

Living reference docs for the DynEcho acoustic calculator. Read
these before anything under `docs/archive/`.

## Agent Resume Triangle

Read these in order. If they disagree with each other, stop and fix the
drift before starting work.

1. [CURRENT_STATE.md](./CURRENT_STATE.md) — short snapshot of
   what is stable right now, completion signals, active slice,
   deferred follow-up tracks.
2. [MASTER_PLAN.md](./MASTER_PLAN.md) — strategic roadmap,
   quantitative completion targets, ROI table, accuracy
   preservation contract, master sequence.
3. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)
   — tactical detail for the active slice.
4. [PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md)
   — closed calculator-only chain for private/internal-use readiness.
5. [CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_BROAD_REVALIDATION_GATE_C_READY_HANDOFF.md](./CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_BROAD_REVALIDATION_GATE_C_READY_HANDOFF.md)
   — latest calculator handoff: full `pnpm check` is green after Gate
   B, and Gate C closeout is the next first action.
6. [CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_B_HANDOFF.md](./CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_B_HANDOFF.md)
   — prior calculator handoff: Gate B landed the regular-use visibility
   audit and selected Gate C closeout.
7. [CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_A_HANDOFF.md)
   — prior calculator handoff: Gate A landed the pilot usage note and
   scenario summary.
8. [INTERNAL_USE_PILOT_USAGE_NOTE.md](./INTERNAL_USE_PILOT_USAGE_NOTE.md)
   — short company pilot usage note and scenario summary.
9. [SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md](./SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md)
   — active calculator slice plan: Gate B visibility landed; Gate C
   closeout / next-slice selection is next.
10. [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_PLAN.md)
   — closed planning slice: Gate A re-ranked remaining source and
   accuracy gaps and selected internal-use operating envelope v1.
11. [CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md)
   — prepared roadmap for the long source-gated accuracy program.

Then run `pnpm calculator:gate:current` to confirm the green
baseline.

## Supporting Reads

- [CHECKPOINT_2026-04-23_SERVER_BACKED_PROJECT_STORAGE_HANDOFF.md](./CHECKPOINT_2026-04-23_SERVER_BACKED_PROJECT_STORAGE_HANDOFF.md)
  — productization closeout: server-backed project storage v1 closed.
- [PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md)
  — closed calculator readiness chain and private/internal-use caveats.
- [CHECKPOINT_2026-04-28_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_GATE_A_HANDOFF.md)
  — prior calculator handoff: Gate A selected
  `internal_use_operating_envelope_v1`.
- [CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_BROAD_REVALIDATION_GATE_C_READY_HANDOFF.md](./CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_BROAD_REVALIDATION_GATE_C_READY_HANDOFF.md)
  — latest calculator handoff: broad validation green, no runtime
  posture movement, Gate C ready.
- [CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_B_HANDOFF.md](./CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_B_HANDOFF.md)
  — prior calculator handoff: Gate B landed source-gated visible
  honesty for dynamic wall formula routes and selected Gate C closeout.
- [CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_GATE_A_HANDOFF.md)
  — prior calculator handoff: pilot usage note and scenario summary
  landed no-runtime.
- [INTERNAL_USE_PILOT_USAGE_NOTE.md](./INTERNAL_USE_PILOT_USAGE_NOTE.md)
  — company-internal pilot operating envelope: pilot-ready lanes,
  caveated lanes, and fail-closed/source-gated lanes.
- [CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed the framed split slice and
  selected `calculator_source_gap_revalidation_v3`.
- [CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_B_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_GATE_B_HANDOFF.md)
  — prior calculator handoff: Gate B fixed current LSF field +1 dB
  value drift plus monotonic-floor warning and added paired web-card
  coverage.
- [SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md](./SLICE_WALL_FRAMED_FACING_SPLIT_WARNING_STABILITY_PLAN.md)
  — closed implementation plan: Gate B fixed the LSF field board-split
  value/warning drift while keeping exact/source posture, support,
  confidence, and board-coalescing boundaries protected.
- [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V3_PLAN.md)
  — closed implementation plan: Gate A reranked remaining source and
  accuracy gaps after the framed split fix.
- [SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md](./SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md)
  — active internal-use plan: Gate B visibility hardening landed; Gate
  C closeout is next.
- [CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md)
  — source-gated accuracy roadmap: timber double-board, CLT wall,
  lined/heavy-core wall, no-stud double-leaf, floor fallback, and
  historical blocked floor families.
- [CHECKPOINT_2026-04-28_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed the expanded floor-order
  slice no-runtime and selected
  `wall_framed_facing_split_warning_stability_v1`.
- [CHECKPOINT_2026-04-28_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_GATE_A_HANDOFF.md)
  — prior calculator handoff: Gate A found no runtime/card drift and
  selected Gate C no-runtime closeout.
- [CHECKPOINT_2026-04-28_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_GATE_A_HANDOFF.md)
  — prior calculator handoff: Gate A selected
  `floor_layer_order_invariance_expansion_v1` after source/import
  candidates remained blocked.
- [SLICE_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_PLAN.md](./SLICE_FLOOR_LAYER_ORDER_INVARIANCE_EXPANSION_PLAN.md)
  — closed implementation plan: Gate A landed the role-defined exact,
  raw order-sensitive, fail-closed impact, and many-layer/split reorder
  audit; Gate C closed no-runtime and selected framed-wall split
  warning stability.
- [CHECKPOINT_2026-04-28_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed lined-massive /
  heavy-core source research no-runtime and selected source-gap
  revalidation v2.
- [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V2_PLAN.md)
  — closed implementation plan: Gate A re-ranked remaining floor/wall
  source and accuracy gaps and selected floor layer-order invariance
  expansion.
- [CHECKPOINT_2026-04-28_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_A_HANDOFF.md)
  — prior calculator handoff: Gate A landed lined-massive /
  heavy-core source and bounded lining-rule inventory no-runtime.
- [SLICE_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_PLAN.md](./SLICE_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_PLAN.md)
  — closed implementation plan: Gate A inventoried source/tolerance
  posture and Gate C selected source-gap revalidation v2.
- [CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed CLT wall source research
  no-runtime and selected lined-massive / heavy-core source research.
- [CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_CLT_WALL_SOURCE_RESEARCH_GATE_A_HANDOFF.md)
  — prior calculator handoff: Gate A landed CLT wall source/tolerance
  inventory no-runtime and selected Gate C closeout.
- [SLICE_WALL_CLT_WALL_SOURCE_RESEARCH_PLAN.md](./SLICE_WALL_CLT_WALL_SOURCE_RESEARCH_PLAN.md)
  — closed implementation plan: Gate A inventoried CLT wall
  source/tolerance posture and Gate C selected lined-massive /
  heavy-core source research.
- [CHECKPOINT_2026-04-28_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed timber double-board
  no-runtime and selected CLT wall source research.
- [CHECKPOINT_2026-04-28_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_GATE_A_HANDOFF.md)
  — prior calculator handoff: Gate A landed timber double-board
  source/tolerance inventory no-runtime and selected Gate C closeout.
- [SLICE_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_PLAN.md](./SLICE_WALL_TIMBER_DOUBLE_BOARD_SOURCE_RESEARCH_PLAN.md)
  — closed implementation plan: Gate A inventoried timber double-board
  source/tolerance posture and Gate C selected CLT wall source research.
- [CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed no-stud double-leaf
  no-runtime and selected timber double-board source research.
- [CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed the source-catalog slice
  no-runtime and selected no-stud double-leaf source research.
- [SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md](./SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md)
  — closed implementation plan: Gate A inventoried targets, Gate B
  closed source-pack readiness, and Gate C selected no-stud double-leaf
  source research.
- [CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_B_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_B_HANDOFF.md)
  — prior calculator handoff: Gate B closed source-pack readiness
  no-runtime and selected no import pack.
- [CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_A_HANDOFF.md)
  — prior calculator handoff: Gate A inventoried source targets,
  required metadata, readiness decisions, and negative boundaries.
- [CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed source-evidence
  acquisition no-runtime and selected wall source-catalog acquisition.
- [SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md](./SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md)
  — closed implementation plan: Gate A classified evidence, Gate B
  reconciled bounded framed rows, and Gate C selected source-catalog
  acquisition.
- [CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_B_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_B_HANDOFF.md)
  — prior calculator handoff: bounded W111 / W112 / W115 / W119 rows
  already fit current runtime behavior.
- [CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_A_HANDOFF.md)
  — prior calculator handoff: Gate A classified source/tolerance
  candidates and selected bounded framed-wall reconciliation.
- [CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_C_CLOSEOUT_HANDOFF.md)
  — prior calculator handoff: Gate C closed double-leaf Sharp/Davy
  scoping no-runtime and selected source-evidence acquisition.
- [CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_HANDOFF.md)
  — prior calculator handoff: Gate B landed no-runtime and pinned the
  current formula-owned double-leaf / stud-cavity values.
- [CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_REVALIDATION.md](./CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_REVALIDATION.md)
  — prior calculator handoff: Gate B was still unimplemented, the plan
  still matched implementation, and validation was green.
- [CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_HANDOFF.md](./CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_HANDOFF.md)
  — prior calculator handoff: Gate A landed no-runtime and Gate B was
  made ready for the bounded current-value/source-tolerance matrix.
- [CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_A_HANDOFF.md)
  — active slice evidence: current double-leaf, single-stud, and
  double-stud values are pinned with negative boundaries.
- [SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md](./SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md)
  — closed implementation plan: Gate A and Gate B pinned the current
  double-leaf/stud posture, then Gate C closed no-runtime.
- [CHECKPOINT_2026-04-27_CALCULATOR_SOURCE_GAP_REVALIDATION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-27_CALCULATOR_SOURCE_GAP_REVALIDATION_GATE_A_HANDOFF.md)
  — prior handoff: source-gap revalidation Gate A closed no-runtime
  and selected wall coverage planning v2.
- [SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md](./SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md)
  — closed planning surface: selected single-leaf first and double-leaf
  / stud-cavity second.
- [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md)
  — closed Gate A implementation plan: source-gap revalidation selected
  wall coverage planning v2.
- [CHECKPOINT_2026-04-27_PROPOSAL_REPORT_POLISH_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-27_PROPOSAL_REPORT_POLISH_CLOSEOUT_HANDOFF.md)
  — prior handoff: proposal/report polish closed and calculator
  source-gap revalidation was selected.
- [CHECKPOINT_2026-04-27_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_HANDOFF.md](./CHECKPOINT_2026-04-27_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_HANDOFF.md)
  — productization handoff: owner-only route policy integration
  closed, and proposal/report polish was selected.
- [SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md](./SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md)
  — closed implementation plan: wired the pure owner/editor/reviewer/viewer
  policy through existing owner-scoped project/proposal routes without
  enabling team access yet.
- [SLICE_PROPOSAL_REPORT_POLISH_PLAN.md](./SLICE_PROPOSAL_REPORT_POLISH_PLAN.md)
  — closed implementation plan: tightened PDF/DOCX/workbench proposal
  honesty without changing acoustic calculations.
- [CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_C_CLOSEOUT_HANDOFF.md)
  — previous calculator closeout: dynamic-airborne split v2 Gate C
  closed, C6 moved out of partial, and realistic layer-combination
  coverage cartography was selected.
- [CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_ELEVENTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_ELEVENTH_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B eleventh carve
  landed before Gate C closeout.
- [CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_TENTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_TENTH_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B tenth carve
  landed and the narrow-gap cap carve was selected.
- [CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_NINTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_NINTH_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B ninth
  carve landed and the next bounded recursive monotonic-floor carve was
  selected.
- [CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_EIGHTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_EIGHTH_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B eighth carve
  landed and the next bounded premium correction carve was selected.
- [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_SEVENTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_SEVENTH_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B seventh
  carve landed and the next bounded template carve was selected.
- [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_SIXTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_SIXTH_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B sixth
  carve landed and the next bounded field-trim carve was selected.
- [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_FIFTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_FIFTH_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B fifth
  carve landed and the next bounded field-lift carve was selected.
- [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_FOURTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_FOURTH_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B fourth
  carve landed and the next bounded field-lift carve was selected.
- [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_THIRD_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_THIRD_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B third
  carve landed and the next bounded field-lift carve was selected.
- [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_SECOND_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_SECOND_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B second
  carve landed and the next bounded field-trim carve was selected.
- [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_FIRST_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_FIRST_CARVE_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate B first
  carve landed and the next bounded cap carve was selected.
- [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_A_HANDOFF.md)
  — calculator handoff: dynamic-airborne split v2 Gate A landed
  no-runtime and selected the first Gate B composer-injection carve.
- [CHECKPOINT_2026-04-24_INVALID_THICKNESS_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-24_INVALID_THICKNESS_CLOSEOUT_HANDOFF.md)
  — calculator handoff: invalid-thickness closed no-runtime and
  dynamic-airborne split v2 was selected.
- [CHECKPOINT_2026-04-24_INVALID_THICKNESS_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-24_INVALID_THICKNESS_GATE_A_HANDOFF.md)
  — calculator handoff: invalid-thickness Gate A landed no-runtime and
  Gate B was not required.
- [CHECKPOINT_2026-04-24_INVALID_THICKNESS_BASELINE_READY_HANDOFF.md](./CHECKPOINT_2026-04-24_INVALID_THICKNESS_BASELINE_READY_HANDOFF.md)
  — calculator handoff: post-commit baseline revalidated before
  invalid-thickness Gate A.
- [CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_CLOSEOUT_HANDOFF.md)
  — calculator handoff: floor layer-order closed no-runtime and
  all-caller invalid-thickness guard was selected.
- [CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_GATE_A_HANDOFF.md)
  — calculator handoff: floor layer-order Gate A landed no-runtime.
- [CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_CLOSEOUT_HANDOFF.md)
  — calculator handoff: floor 50+ layer stress regression closed
  no-runtime and floor layer-order edit stability was selected.
- [CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_GATE_A_HANDOFF.md)
  — calculator handoff: floor 50+ layer Gate A landed no-runtime.
- [CHECKPOINT_2026-04-24_FLOOR_FIELD_CONTINUATION_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-24_FLOOR_FIELD_CONTINUATION_CLOSEOUT_HANDOFF.md)
  — calculator handoff: floor field-continuation closed no-runtime and
  floor 50+ layer stress regression was selected.
- [CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_C_CLOSEOUT_HANDOFF.md)
  — calculator handoff: resilient side-count Gate C closed and floor
  field-continuation expansion was selected.
- [CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md](./CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md)
  — productization closeout: team-access policy model closed.
- [CHECKPOINT_2026-04-23_AUTH_SESSION_HARDENING_HANDOFF.md](./CHECKPOINT_2026-04-23_AUTH_SESSION_HARDENING_HANDOFF.md)
  — productization closeout: auth-session hardening closed.
- [CHECKPOINT_2026-04-23_PROJECT_ACCESS_AUTHORIZATION_HANDOFF.md](./CHECKPOINT_2026-04-23_PROJECT_ACCESS_AUTHORIZATION_HANDOFF.md)
  — productization closeout: project-access authorization closed.
- [CHECKPOINT_2026-04-23_FINAL_AUDIT_HANDOFF.md](./CHECKPOINT_2026-04-23_FINAL_AUDIT_HANDOFF.md)
  — latest calculator closeout: final audit closed and
  productization handoff opened.
- [POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md](./POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md)
  — productization roadmap; project-access route integration is
  deferred.
- [SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md](./SLICE_DYNAMIC_AIRBORNE_SPLIT_REFACTOR_V2_PLAN.md)
  — closed calculator architecture slice plan.
- [SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md](./SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md)
  — closed calculator planning surface; maps realistic layer
  combinations by evidence tier before selecting runtime widening.
- [SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md](./SLICE_UI_INPUT_OUTPUT_HONESTY_PLAN.md)
  — closed UI/input/output honesty slice plan.
- [SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md](./SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md)
  — closed direct invalid-thickness guard plan.
- [SLICE_FLOOR_LAYER_ORDER_EDIT_STABILITY_PLAN.md](./SLICE_FLOOR_LAYER_ORDER_EDIT_STABILITY_PLAN.md)
  — closed floor layer-order edit stability audit plan.
- [SLICE_FLOOR_MANY_LAYER_STRESS_REGRESSION_PLAN.md](./SLICE_FLOOR_MANY_LAYER_STRESS_REGRESSION_PLAN.md)
  — closed floor 50+ layer stress regression audit plan.
- [SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md](./SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md)
  — closed floor continuation audit plan.
- [SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md](./SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md)
  — closed resilient side-count modeling slice plan.
- [SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md](./SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md)
  — closed productization slice plan for wiring policy decisions into
  owner-scoped project/proposal routes.
- [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md)
  — closed calculator Gate A plan for source-gap inventory/rerank before
  runtime movement.
- [SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md](./SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md)
  — closed calculator planning slice for wall coverage expansion
  ordering.
- [SLICE_PROPOSAL_REPORT_POLISH_PLAN.md](./SLICE_PROPOSAL_REPORT_POLISH_PLAN.md)
  — closed productization slice plan for tightening proposal/report
  honesty without changing acoustic values.
- [SLICE_TEAM_ACCESS_MODEL_PLAN.md](./SLICE_TEAM_ACCESS_MODEL_PLAN.md)
  — closed productization slice plan for team/project role policy.
- [SLICE_AUTH_SESSION_HARDENING_PLAN.md](./SLICE_AUTH_SESSION_HARDENING_PLAN.md)
  — closed productization slice plan for login/session/logout hardening.
- [SLICE_PROJECT_ACCESS_AUTHORIZATION_PLAN.md](./SLICE_PROJECT_ACCESS_AUTHORIZATION_PLAN.md)
  — closed productization slice plan for project/proposal route
  authorization.
- [SLICE_SERVER_BACKED_PROJECT_STORAGE_PLAN.md](./SLICE_SERVER_BACKED_PROJECT_STORAGE_PLAN.md)
  — closed productization slice plan for server-backed project
  storage v1.
- [DYNAMIC_AIRBORNE_CARTOGRAPHY.md](./DYNAMIC_AIRBORNE_CARTOGRAPHY.md)
  — `dynamic-airborne.ts` split blueprint. v1 landed 2026-04-21;
  v2 Gate C closed on 2026-04-26, and the remaining recursive guards are
  optional architecture backlog.
- [SYSTEM_MAP.md](./SYSTEM_MAP.md) — end-to-end system model,
  runtime boundaries, persistence posture, test surface map.
- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
  — answer-origin semantics and evidence-tier composition.
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md) — source-backed
  widening / tightening / deferred-family ledger.

## Archived Documents

The following docs have moved to `docs/archive/`. They informed
earlier decisions but the living triangle above now supersedes
them. Check archive when you need historical context.

- `docs/archive/handoffs/` — closed-slice plans
  (`SLICE_LSF_TIMBER_PRESET_WITH_INVARIANTS_PLAN.md`,
  `SLICE_WALL_HOSTILE_INPUT_WITH_CARTOGRAPHY_PLAN.md`,
  `SLICE_WALL_FIELD_CONTINUATION_VALUE_PINNING_PLAN.md`,
  `SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md`,
  `SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md`,
  `SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md`); older
  checkpoint handoffs (2026-04-08 through 2026-04-22);
  `STABILIZATION_CHECKPOINT_2026-04-13.md`.
- `docs/archive/analysis/` — closed planning docs
  (`DYNAMIC_CALCULATOR_PLAN.md`,
  `DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md`,
  `DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md`,
  `WALL_COVERAGE_EXPANSION_PLAN.md`);
  `SYSTEM_AUDIT_2026-04-20.md`; historical wall-stability +
  suite-triage analyses.

## Document Freshness Rule

Every closed slice updates:

1. `CURRENT_STATE.md` — active slice moved + latest closed slice
   recorded + completion-signal table flipped.
2. `NEXT_IMPLEMENTATION_PLAN.md` — "Now" section points at the
   new active slice.
3. The slice's post-contract or focused route/unit tests —
   executable closure record.
4. `MASTER_PLAN.md` §3 implementation state grid + §4 master
   sequence row for the closed slice.

Skipping any of the four is how drift restarts.
