# Checkpoint - 2026-05-08 Strategic ROI Replan

Checkpoint id:
`strategic_roi_replan_personal_use_mvp_after_gate_bh`

Status: SELECTED / DOC-ONLY / NO RUNTIME MOVEMENT

## Why This Exists

Gate AQ through Gate BH closed a useful but narrow steel-floor formula
calibration-readiness chain. Gate BH now has a policy-only `tighten`
candidate for the same-stack ISO lab `DeltaLw` residual path, while
runtime values remain `Ln,w 55.6` / `DeltaLw 22.4` with `+/-4.5 dB` /
`+/-2.0 dB` tolerances.

That is not the same as broad calculator readiness. The project goal is
a wall/floor acoustic calculator that works for realistic and hostile
layer combinations with named algorithms, exact-source overrides where
valid, and explicit missing-input prompts. Continuing to spend many
gates on steel-floor tolerance tightening has lower ROI than exposing
and closing the next broad personal-use coverage gaps.

## External Research Inputs

- ISO 12354-1:2017 describes calculation models for airborne sound
  insulation between rooms from element performance, including measured
  direct/indirect flanking data and theoretically derived propagation:
  <https://www.iso.org/standard/70242.html>.
- ISO 12354-2:2017 describes impact sound calculation models between
  rooms using element performance, flanking/direct transmission data,
  and structural propagation methods:
  <https://www.iso.org/standard/70243.html>.
- ISO 717-1:2020 and ISO 717-2:2020 define single-number airborne and
  impact ratings from frequency-band results:
  <https://www.iso.org/standard/77435.html>,
  <https://www.iso.org/standard/69867.html>.
- ISO 16283-1:2014 and ISO 16283-2:2020 define field measurement
  contexts for airborne and impact sound insulation. These reinforce
  that field/apparent values require room/context inputs and cannot be
  relabelled from lab values:
  <https://www.iso.org/standard/55997.html>,
  <https://www.iso.org/standard/77436.html>.
- INSUL publicly positions itself as prediction software for walls,
  floors, and ceilings with material/layer choices and 1/3-octave
  transmission loss graphs. That confirms the expected calculator shape,
  but DynEcho should exceed it by exposing exact-source override,
  rejected candidates, uncertainty, and basis separation:
  <https://www.insul.co.nz/>,
  <https://www.insul.co.nz/media/43149/INSUL-Version10-November-2023.pdf>.

## Implementation Diagnosis

Strengths already in the implementation:

- exact-source precedence and measured-row guards exist;
- source absence no longer blocks source-absent family physics;
- single-leaf, double/framed, triple-leaf route recovery, floor-impact
  dynamic-stiffness, field impact continuation, and lightweight-steel
  formula corridor are represented;
- `needs_input` and unsupported basis boundaries are explicit in many
  routes;
- card/report/API parity has been tested for high-risk steel formula
  surfaces;
- hostile inputs such as duplicate/ambiguous steel carriers and unsafe
  reorders have targeted tests.

Main gaps:

- there is no current executable, product-shaped matrix that says which
  common wall/floor user scenarios are usable today, which fail closed,
  and which are silently too narrow;
- the latest effort has become too steel-floor residual-policy heavy;
- older docs still imply a private/internal-use readiness bar that was
  narrower than the user's current "usable calculator" goal;
- several family solvers remain partial, screening, or fixture-gated;
- source rows are well controlled, but algorithmic family coverage needs
  the next investment.

## ROI Decision

The next work must maximize broad calculator usefulness while preserving
accuracy:

1. Complete Gate BI as a minimal no-runtime governance guard over Gate
   BH's `tighten` candidate.
2. Then pivot to `personal_use_mvp_coverage_sprint_after_gate_bi`.
3. Start that sprint with an executable scenario matrix covering common
   walls, common floors, field/lab/building basis requests, and hostile
   inputs.
4. Use the matrix failures to select the next algorithmic family solver
   lane. The likely high-ROI candidates are generalized wall
   multi-cavity/triple-leaf routing beyond fixture gates,
   lined-massive/masonry upgrades, timber/CLT floor-impact coverage, and
   field/building continuations with owned room/context inputs.
5. Defer steel tolerance tightening until independent source-owned
   same-stack ISO `DeltaLw` packets and governance-owned runtime deltas
   exist.

## Gate BI Scope

Gate BI must be deliberately small:

- accept Gate BH's `tighten` signal only as a proposal label;
- prove that no runtime value, tolerance, source ingestion, exact row,
  formula coefficient, field/building alias, card, report, or API
  surface can change at Gate BI;
- record the prerequisites for any future runtime tightening;
- select the Personal-Use MVP Coverage Sprint as the next lane.

## Post-Gate-BI Sprint Shape

Proposed first test:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts`

Proposed first action:

`gate_a_personal_use_mvp_coverage_matrix_plan`

The matrix should include at least:

- single-leaf masonry/concrete/AAC wall;
- laminated board / rigid panel wall;
- double-leaf independent stud wall;
- resilient-bar framed wall;
- explicit grouped triple-leaf / multi-cavity wall;
- ambiguous flat-list multi-cavity wall negative;
- lined massive wall;
- CLT / mass-timber wall;
- heavy concrete floating floor;
- lightweight-steel floor with complete formula inputs;
- lightweight-steel floor with missing carrier/lower-isolation inputs;
- timber or CLT floor impact route;
- field airborne and field impact requests with complete context;
- field requests missing room/flanking inputs;
- long layer list, duplicates, splits, invalid thickness, and safe /
  unsafe reorder cases.

Each row must assert requested metrics, selected support bucket, origin,
basis, value or `needs_input` / `unsupported`, tolerance/error budget,
and card/report/API parity requirements where the route is user-visible.

## Definition Of Done For The Replan

- Gate BI closes without runtime movement.
- The next selected lane is a coverage matrix, not another broad source
  crawl.
- The matrix makes "what is usable today" executable.
- The next solver is selected from matrix failures by coverage ROI and
  accuracy risk.
- Docs stop claiming broad personal-use readiness until the matrix
  proves it.
