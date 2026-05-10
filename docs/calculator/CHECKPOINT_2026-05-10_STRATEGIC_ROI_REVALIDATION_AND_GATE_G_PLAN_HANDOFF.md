# Checkpoint 2026-05-10 - Strategic ROI Revalidation and Gate G Plan Handoff

Checkpoint id:
`strategic_roi_revalidation_after_gate_f_selected_gate_g_wall_multicavity`

Status: LANDED / DOC-ONLY / NO RUNTIME MOVEMENT

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

1. Add the Gate G contract test and helper only if needed.
2. Re-read `packages/engine/src/airborne-calculator.ts`,
   `packages/engine/src/dynamic-airborne.ts`,
   `packages/engine/src/wall-triple-leaf-topology-readiness.ts`, and
   current grouped triple-leaf tests.
3. Build a route-readiness matrix covering:
   complete grouped 50/50 triple leaf, complete grouped non-50/50
   construction-image topology, unequal cavity depths, safe reorder,
   duplicate/ambiguous leaves, missing grouping, missing cavity fields,
   lined-massive/CLT negatives, field-output boundaries, and exact
   source precedence.
4. For complete grouped topology, route by physical domain and required
   topology fields, not old fixture gates.
5. For incomplete topology, return exact missing fields. Do not guess
   internal leaf/cavity groups from a flat list.
6. Keep runtime movement minimal. If a runtime value changes, pin
   `Rw`, `STC`, `C`, `Ctr`, basis, support bucket, warnings, and visible
   card/report/API parity in the same gate.
7. Select Gate H after Gate G by matrix ROI. Expected candidates are:
   lined massive/masonry + CLT wall upgrade, then field/building context
   continuation, then steel tolerance tightening only if real packets
   arrive.

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
