# Checkpoint 2026-05-10 - Strategic ROI Revalidation and Gate G Plan Handoff

Checkpoint id:
`strategic_roi_revalidation_after_gate_f_selected_gate_g_wall_multicavity`

Status: LANDED / DOC-ONLY / NO RUNTIME MOVEMENT

Post-closeout note: this checkpoint selected Gate G after Gate F. Gate G
has since landed in
`docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_G_HANDOFF.md`
with status
`gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_landed_selected_lined_masonry_clt_wall_gate_h`.
The active next implementation lane is now
`gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_plan`.

## Purpose

This checkpoint revalidates the product direction after Personal-Use MVP
Coverage Sprint Gate F. It compares the current implementation with the
calculator-first goal, checks external standards/software signals, and
sets the next highest-ROI implementation lane.

## External Research Inputs

- ISO 12354-1:2017 is current and frames airborne building-acoustic
  prediction as calculation from element performance, direct/indirect
  flanking data, theoretical structural propagation, frequency-band
  results, single-number rating conversion, and uncertainty:
  <https://www.iso.org/standard/70242.html>.
- ISO 12354-2:2017 frames impact prediction the same way for floors and
  connected elements. It is currently published and marked to be revised,
  so DynEcho should keep the model modular and basis-explicit instead of
  hard-coding one frozen formula shape:
  <https://www.iso.org/standard/70243.html>.
- ISO 717-1:2020 and ISO 717-2:2020 define airborne and impact
  single-number ratings from one-third-octave or octave-band measurement
  results. This supports keeping band/curve/rating adapters separate
  from family solvers:
  <https://www.iso.org/standard/77435.html>,
  <https://www.iso.org/standard/69867.html>.
- ISO 16283-1:2014 and ISO 16283-2:2020 define field measurement
  contexts for airborne and impact sound insulation. They reinforce
  that lab `Rw` / `Ln,w` cannot be relabelled as `R'w`, `DnT,w`,
  `L'n,w`, or `L'nT,w` without owned room/source/context inputs:
  <https://www.iso.org/standard/55997.html>,
  <https://www.iso.org/standard/77436.html>.
- INSUL Version 10 publicly advertises prediction for single, double,
  triple, and quad airborne systems plus impact predictions for single,
  double, and triple systems, with separate cavities, frame/infill
  modelling, material properties, and real-world/lab-limit anchoring.
  That confirms the market expectation: a useful calculator must handle
  multi-shell walls and floors algorithmically, not only through a finite
  catalog:
  <https://www.insul.co.nz/media/43149/INSUL-Version10-November-2023.pdf>.

## Implementation Comparison

Current strengths:

- Candidate vocabulary is present: exact, source-anchored,
  calibrated/family physics, bounded/screening, `needs_input`, and
  `unsupported`.
- Exact source precedence and basis boundaries are guarded in engine and
  web acceptance tests.
- Steel floor and timber/CLT floor-impact corridors now have runtime,
  visible/API/report parity, and first-class input surfaces.
- The 24-row Personal-Use MVP scenario matrix gives an executable view
  of common/hostile wall and floor states.
- `pnpm calculator:gate:current` is green after Gate F: engine 347
  files / 2009 tests, web 68 files / 294 passed + 18 skipped, repo
  build 5/5 successful.

Current gaps:

- Wall multi-cavity / triple-leaf handling is still partly inherited
  from older fixture and source-calibration gates. Complete grouped
  topology can reach the two-cavity family solver in important cases,
  but the route-readiness contract is not generalized enough for
  arbitrary user-entered grouped multi-cavity walls.
- Ambiguous flat-list multi-cavity walls correctly fail closed, but the
  next UX/engine contract must name exactly which grouping fields are
  required before a user can recover the route.
- Lined massive/masonry and CLT wall routes are still high-value
  follow-ups; the matrix marks them as screening or partial family
  coverage.
- Field/building outputs are improving, but they must remain downstream
  context adapters after lab/family basis is owned, not aliases.
- Steel-floor tolerance tightening is deliberately deferred until
  independent source-owned same-stack ISO `DeltaLw` packets exist.

Second-pass code facts from the 2026-05-10 recheck:

- `packages/engine/src/dynamic-airborne.ts` already calls
  `applyFlatListMultileafFamilyGuard`,
  `evaluateWallTripleLeafTopologyReadiness`, and
  `maybeCalculateGateGGroupedRockwoolPrediction` before falling back to
  the broad family blend. Gate G should test and refine those
  integration points instead of adding a parallel selector.
- `packages/engine/src/wall-triple-leaf-topology-readiness.ts` owns the
  seven minimum grouped-topology fields: side A leaf group, cavity 1
  depth/fill/absorption, internal leaf group, internal leaf
  coupling/bridge class, cavity 2 depth/fill/absorption, side B leaf
  group, and support topology.
- `packages/engine/src/dynamic-airborne-gate-g-rockwool.ts` already
  promotes a narrow complete grouped mineral-wool triple-leaf family
  physics prediction with `triple_leaf_two_cavity_frequency_solver`,
  `+/-5 dB` uncalibrated error budget, and exact/calibration candidates
  rejected for missing source evidence.
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint.ts`
  already pins the two current grouped wall rows:
  `Rw 50 / STC 55` for the owned 50/50 mineral-wool fixture and
  `Rw 55 / STC 56` for the non-50/50 construction-image topology.
  Gate G's job is therefore route-readiness generalization and
  hostile-input proof, not retuning those values.
- At the time of this revalidation, the target Gate G test file did not
  exist yet. Gate G later created it and made the existing state
  executable before changing runtime behavior.

## ROI Decision

The highest ROI remains Gate G:

`gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_plan`

Target file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-g-generalized-wall-multicavity-route-readiness-contract.test.ts`

Why Gate G is first:

- Wall multi-cavity / triple-leaf assemblies are a broad, user-visible
  wall coverage gap rather than a narrow tolerance-polishing problem.
- The implementation already has the raw solver/readiness pieces, so the
  first win is route generalization and fail-closed contracts, not a
  brand-new physics stack.
- This lane reduces the biggest risk from user behavior: layer reorder,
  inserted internal leaves, ambiguous flat lists, and fixture-specific
  gates that can otherwise make values jump or look more authoritative
  than they are.
- It aligns with the standards/software direction: frequency-band,
  multi-element prediction with explicit topology and context.

## Next Gate G Plan

Gate G is a contract-first implementation gate. It should not crawl
broad sources, retune steel or timber/floor formula corridors, or turn
lab values into field/building values. It should make the wall
multi-cavity route visibly deterministic for common and hostile user
inputs.

Target:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-g-generalized-wall-multicavity-route-readiness-contract.test.ts`

Implementation order:

1. Create the Gate G contract test and pin the current implementation
   facts before editing runtime code.
2. Re-read `packages/engine/src/airborne-calculator.ts`,
   `packages/engine/src/dynamic-airborne.ts`,
   `packages/engine/src/dynamic-airborne-flat-list-multileaf-guard.ts`,
   `packages/engine/src/dynamic-airborne-gate-g-rockwool.ts`,
   `packages/engine/src/wall-triple-leaf-topology-readiness.ts`, and
   the older grouped triple-leaf tests.
3. Add a local Gate G fixture matrix with one row per boundary. Each row
   must name route, requested metrics, basis, topology completeness,
   expected posture, value or missing fields, selected method/strategy,
   origin/support bucket, warning text, and whether visible parity is
   required.
4. Add or extend a small helper only if the matrix reveals missing
   topology validation, such as duplicate or overlapping layer-index
   groups. Keep the helper close to wall topology/readiness code rather
   than expanding `dynamic-airborne.ts`.
5. Keep the already landed mineral-wool predictions unchanged unless
   the Gate G test explicitly proposes and pins a runtime move. Any
   runtime move must include engine value pins plus web card/report/API
   parity in the same gate.
6. Update current-gate runner and docs after the contract is green.
7. Select Gate H from the matrix by coverage ROI after Gate G lands.

Gate G acceptance matrix:

| Case | Expected result |
| --- | --- |
| Complete grouped 50/50 mineral-wool triple leaf | Stays on `triple_leaf_two_cavity_frequency_solver`, pins current `Rw 50 / STC 55`, `family_physics_prediction`, `+/-5 dB`, no exact/source claim. |
| Complete grouped non-50/50 construction-image topology | Stays on the same solver, pins current `Rw 55 / STC 56`, proving routing is not the old 50/50 fixture gate. |
| Complete grouped unequal cavity depths within physical domain | Does not fail because the cavities are unequal; either routes to the owned solver when material/domain rules match or returns a named unsupported/readiness reason. |
| Safe reorder with explicit groups | Keeps the same grouped physical interpretation and avoids large value jumps from visual layer order alone. |
| Flat-list multi-cavity ambiguity | Returns `needs_input`; required fields must map to the seven grouped topology fields and no internal leaf/cavity groups may be inferred. |
| Partial grouped topology | Names only the missing grouped topology fields, especially cavity depth/fill/absorption and internal leaf coupling. |
| Duplicate or overlapping grouped layer indices | Refuses or parks as `needs_input`; no formula result should be emitted from impossible topology ownership. |
| Lined massive/masonry and CLT wall negatives | Stay out of the triple-leaf route and remain queued for the later lined masonry/CLT wall upgrade lane. |
| Field/apparent output requests | Stay basis-explicit; no lab `Rw`/`STC` result may be relabelled as `R'w` or `DnT,w` without field context. |
| Exact source precedence | Exact measured rows still outrank the formula route only when full stack, metric, topology, and basis truly match. |

Definition of done:

- focused Gate G engine contract passes;
- Gate A/F continuity remains green for the existing coverage sprint
  rows;
- if runtime/web behavior changes, focused web parity tests pass;
- `pnpm --filter @dynecho/engine typecheck` and
  `git diff --check` pass;
- final docs name the selected Gate H file and action.

Expected Gate H choice if Gate G is no-runtime or minimal-runtime:
`lined_masonry_clt_wall_upgrade`. Field/building continuations should
wait until wall lab/family routes are more stable. Steel-floor tolerance
tightening should remain deferred unless independent source-owned
same-stack ISO `DeltaLw` packets are present.

## Long-Range Finish Strategy

DynEcho becomes a useful personal calculator when the following gates
are green:

1. Wall MVP backbone: single/rigid, double/framed, resilient, grouped
   multi-cavity/triple-leaf readiness, lined massive/masonry, and CLT
   wall routes each have numeric or precise `needs_input` behavior.
2. Floor MVP backbone: heavy floating, lightweight steel, timber/CLT,
   exact source precedence, field impact continuation, ASTM/IIC
   boundaries, and hostile floor layer edits are guarded.
3. Basis adapters: lab, field/apparent, building prediction, ISO/ASTM
   ratings, and report cards remain separate and tested.
4. Calibration loop: every family solver has at least representative
   benchmark/holdout rows, residual decisions, and source-owned exact
   promotion rules.
5. Product hardening: first-class UI input surfaces exist for all owned
   routes, reports show basis/error budgets honestly, and long/hostile
   layer lists stay stable.

The practical next milestone is not "industry-leading." It is
`personal_use_mvp_internal`: common wall and floor scenarios calculate
or ask for precise missing inputs with visible uncertainty. Gate G is
the first blocker for that milestone.

## Commit Scope Guidance

Commit the Gate BI/A-F implementation and this strategic update
together. Do not include local PDFs, `output/`, `tmp/`,
`.playwright-cli/`, or generated Next/TypeScript build-info churn unless
there is a separate tooling reason.
