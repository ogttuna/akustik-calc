# Checkpoint - 2026-05-08 Strategic ROI Replan

Checkpoint id:
`strategic_roi_replan_personal_use_mvp_after_gate_bh`

Status: SELECTED / DOC-ONLY / NO RUNTIME MOVEMENT

Superseded for next-action planning by:

`docs/calculator/CHECKPOINT_2026-05-10_STRATEGIC_ROI_REVALIDATION_AND_GATE_G_PLAN_HANDOFF.md`

The 2026-05-10 checkpoint revalidates this ROI pivot after Gate F
landed and keeps Gate G generalized wall multi-cavity route readiness as
the next implementation lane.

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

## Second-Pass Reconciliation - 2026-05-08

Reviewed implementation surfaces for this planning pass:

- `packages/engine/src/dynamic-airborne.ts` already contains exact
  source precedence, mass-law / KS / Sharp / Kurtovic delegate paths,
  grouped triple-leaf recovery, and multiple route-specific overlays.
- `packages/engine/src/dynamic-impact.ts` already contains exact
  impact rows, dynamic-stiffness/floating-floor handling, field impact
  continuation, and the lightweight-steel formula corridor.
- `packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts`
  already has the candidate vocabulary the product needs: exact,
  anchored, calibrated, family physics, bounded/screening,
  `needs_input`, and `unsupported`.
- `packages/engine/src/dynamic-calculator-route-input-topology.ts`
  already requests many of the physical fields that should drive the
  dynamic calculator UI, including grouped wall topology, field context,
  floating-floor parameters, and steel carrier/lower isolation fields.
- `tools/dev/run-calculator-current-gate.ts` validates the current gate
  chain, but has not yet been moved onto Gate BI or the coverage sprint.

Conclusion: the architecture is no longer blocked on inventing a
candidate system. The highest uncertainty is product coverage: which
real wall/floor user scenarios currently return a defensible value,
which correctly ask for inputs, and which are only narrow fixture passes.
That must become executable before another broad source or residual
policy lane is started.

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

Solver-lane selection after the matrix should use this scoring rule:

`roi = user_frequency * current_failure_risk * solver_readiness /
(implementation_cost + basis_leakage_risk)`.

Do not select a lane with no numeric or posture assertions. If a lane
needs source evidence, the matrix row must name the exact evidence
packet and explain why a physics-only solver cannot safely proceed.

## Gate BI Scope - Landed

Gate BI has landed deliberately small:

- accepted Gate BH's `tighten` signal only as a proposal label;
- proved that no runtime value, tolerance, source ingestion, exact row,
  formula coefficient, field/building alias, card, report, or API
  surface can change at Gate BI;
- recorded the prerequisites for any future runtime tightening;
- selected the Personal-Use MVP Coverage Sprint as the next lane.

Gate BI landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bi-steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance-contract.test.ts`

Gate BI landed action:

`gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan`

Gate BI executable contract requirements:

- one accepted path: Gate BH `tighten` remains a governance proposal;
- one frozen-runtime path: `Ln,w 55.6`, `DeltaLw 22.4`, `+/-4.5 dB`,
  and `+/-2.0 dB` remain unchanged;
- one basis boundary: lab `Ln,w` / `DeltaLw` cannot become `L'n,w`,
  `L'nT,w`, field, or building-prediction output;
- one exact-source boundary: exact source precedence remains ahead of
  formula proposals;
- one source boundary: Gate BI cannot ingest source text/documents or
  measured values;
- selected next lane must be
  `personal_use_mvp_coverage_sprint_after_gate_bi` unless these
  governance checks uncover a safety blocker.

## Post-Gate-BI Sprint Shape

Proposed first test:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts`

Proposed first action:

`gate_a_personal_use_mvp_coverage_matrix_plan`

Gate A should add a small helper, for example
`packages/engine/src/calculator-personal-use-mvp-coverage-sprint.ts`,
and route scenarios through current public engine entry points instead
of mocking solver outputs. Gate A is allowed to be no-runtime if it only
records current behavior, but it must be executable and must pin actual
current values/postures.

## Gate A Scope - Landed

Gate A has now landed this sprint shape in:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts`

with helper:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint.ts`

Selection status:

`gate_a_personal_use_mvp_coverage_matrix_landed_no_runtime_selected_timber_clt_floor_impact_delta_lw_gate_b`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts`

Selected next action:

`gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan`

Gate A result:

- 24 executable rows now cover common wall/floor, lab/field/building,
  ASTM-boundary, and hostile-input calculator scenarios;
- rows use current public entry points instead of fixture-only mocks;
- numeric rows pin current values and basis without changing runtime;
- blocked rows pin exact missing fields or unsupported basis;
- Gate B is selected from the matrix by ROI as timber/CLT floor-impact
  `DeltaLw` input and physics ownership.

Gate A validation result:

Focused Gate A validation completed on 2026-05-08: Gate A passed 1 file
/ 7 tests, focused Gate BI/Gate A continuity passed 2 files / 14 tests,
engine typecheck passed, and full `pnpm calculator:gate:current` passed
with engine 342 files / 1979 tests, web 66 files / 286 passed + 18
skipped, repo build 5/5 successful, and whitespace guard clean.

## Gate B Scope - Landed

Gate B has now landed the matrix-selected timber/CLT floor-impact
`DeltaLw` input and formula-readiness contract in:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts`

with helper:

`packages/engine/src/timber-clt-floor-impact-delta-lw-input-contract.ts`

Selection status:

`gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_landed_no_runtime_selected_formula_corridor_gate_c`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-c-timber-clt-floor-impact-delta-lw-formula-corridor-contract.test.ts`

Selected next action:

`gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan`

Gate B result:

- complete timber joist and CLT/mass-timber inputs are ready for a
  formula corridor;
- current runtime remains unchanged: timber exact `Ln,w 51` and CLT
  family `Ln,w 50` still leave `DeltaLw` unsupported;
- missing `baseSlabOrFloor`, `toppingOrFloatingLayer`,
  `resilientLayerDynamicStiffnessMNm3`, `loadBasisKgM2`, or
  `ceilingOrLowerAssembly` produces explicit `needs_input`;
- ASTM `IIC` / `AIIC`, field `L'n,w` / `L'nT,w`, steel floors, and
  exact `Ln,w` source precedence cannot alias or promote lab `DeltaLw`;
- broad source crawling remains blocked. Gate C must design the formula
  corridor, tolerance/error budget, support bucket, and negative
  boundaries before any runtime promotion.

Gate B validation result:

Focused Gate B validation completed on 2026-05-08: Gate B passed 1 file
/ 8 tests, focused Gate A/Gate B continuity passed 2 files / 15 tests,
focused Gate BI/Gate A/Gate B continuity passed 3 files / 22 tests,
engine typecheck passed, and full `pnpm calculator:gate:current` passed
with engine 343 files / 1987 tests, web 66 files / 286 passed + 18
skipped, repo build 5/5 successful, and whitespace guard clean.

## Gate C Scope - Landed

Gate C has now landed the selected timber/CLT floor-impact `DeltaLw`
formula-corridor contract in:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-c-timber-clt-floor-impact-delta-lw-formula-corridor-contract.test.ts`

with helper:

`packages/engine/src/timber-clt-floor-impact-delta-lw-formula-corridor.ts`

Selection status:

`gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_d`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-d-timber-clt-floor-impact-delta-lw-runtime-corridor-contract.test.ts`

Selected next action:

`gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_plan`

Gate C result:

- separate timber joist and mass-timber CLT source-absent `DeltaLw`
  formula corridors are named;
- both corridors name the Gate D terms: reference-floor `Ln,w`, loaded
  upper mass, dynamic stiffness transfer, lower-assembly coupling, and
  structural-family correction;
- current runtime remains unchanged: timber exact `Ln,w 51`, CLT family
  `Ln,w 50`, and `DeltaLw` unsupported;
- both design budgets are `+/-7.5 dB` and explicitly not measured
  evidence;
- Gate B missing-input negatives, ASTM/field/building basis boundaries,
  steel-family leakage, and exact `Ln,w` precedence remain blocked;
- broad source crawling remains blocked. Gate D must make a runtime
  formula proposal with value pins, error budgets, exact-source
  precedence, basis boundaries, and visible/API/report parity before any
  runtime movement.

Gate C validation result:

Focused Gate C validation completed on 2026-05-08: Gate C passed 1 file
/ 7 tests, focused Gate B/Gate C continuity passed 2 files / 15 tests,
focused Gate BI/Gate A/Gate B/Gate C continuity passed 4 files / 29
tests, engine typecheck passed, and full `pnpm calculator:gate:current`
passed with engine 344 files / 1994 tests, web 66 files / 286 passed +
18 skipped, repo build 5/5 successful, and whitespace guard clean.
Known warnings were existing Zustand unavailable test-storage warnings
and optional `sharp/@img` package resolution warnings during web build.

Each matrix row must include:

- `id`, `route`, `family`, `requestedMetrics`, and output `basis`;
- input completeness: complete, partial, ambiguous, hostile, or invalid;
- current posture: exact, anchored, calibrated, family physics,
  bounded/screening, `needs_input`, or `unsupported`;
- expected posture for personal-use readiness;
- numeric pin where the current engine returns a value;
- `origin`, support bucket, tolerance/error budget, and basis label;
- missing-input names or rejected-candidate reasons;
- visible surfaces that must eventually agree: workbench card,
  saved replay, calculator API, impact-only API, Markdown/PDF/DOCX
  report;
- hostile variant, failure class, and proposed next action.

Minimum Gate A scenario set:

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

Expand that list into explicit rows before implementation. The starting
row inventory should be:

1. wall single-leaf heavy concrete/masonry, lab `Rw` / `C` / `Ctr`;
2. wall AAC or non-homogeneous masonry, lab `Rw`;
3. wall laminated board / rigid panel, lab `Rw`;
4. wall double-leaf independent stud with absorption, lab `Rw`;
5. wall resilient-bar framed leaf, lab `Rw`;
6. wall grouped triple-leaf 50/50 mineral wool, lab `Rw`;
7. wall grouped triple-leaf non-50/50 construction-image topology,
   lab `Rw`;
8. wall flat-list multi-cavity ambiguity, expected `needs_input`;
9. wall lined massive masonry, lab `Rw`;
10. wall CLT / mass timber, lab `Rw`;
11. wall complete field context, `R'w` / `DnT,w`;
12. wall missing field room/context, expected `needs_input`;
13. floor heavy concrete floating floor, lab `Ln,w` / `DeltaLw`;
14. floor heavy concrete floating floor missing `s'` or load, expected
    `needs_input`;
15. floor lightweight-steel complete formula inputs, lab `Ln,w` /
    `DeltaLw`;
16. floor lightweight-steel duplicate/ambiguous carrier, expected
    refusal;
17. floor lightweight-steel exact row precedence over formula;
18. floor timber joist impact route;
19. floor CLT / mass timber impact route;
20. floor complete field impact context, `L'n,w` / `L'nT,w`;
21. floor missing field impact context, expected `needs_input`;
22. floor ASTM/IIC/AIIC request boundary, expected unsupported or
    explicitly basis-owned adapter;
23. hostile long-layer stress case with stable result or clean refusal;
24. invalid thickness / zero / negative / unsafe reorder boundaries.

Gate A definition of done:

- every row has an executable assertion;
- no row silently aliases lab, field, building, ISO, or ASTM bases;
- numeric rows pin value, origin, basis, and tolerance/error budget;
- blocked rows pin exact missing fields or unsupported reason;
- the matrix ranks candidate Gate B lanes by ROI and selects exactly
  one next implementation lane.

Likely Gate B candidates, pending matrix evidence:

- generalized wall multi-cavity / triple-leaf routing beyond fixture
  gates;
- lined-massive and masonry upgrade solver coverage;
- timber / CLT floor-impact input contract and physics route;
- field/building continuation adapters where room, area, volume,
  reverberation, and flanking context are owned.

The first Gate B lane must be chosen from the matrix, not from preference
or source availability alone.

## Definition Of Done For The Replan

- Gate BI closes without runtime movement. Done in
  `gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan`.
- The next selected lane is a coverage matrix, not another broad source
  crawl. Done in `gate_a_personal_use_mvp_coverage_matrix_plan`.
- The matrix makes "what is usable today" executable. Done by the 24-row
  Personal-Use MVP Coverage Sprint Gate A matrix.
- The next solver is selected from matrix failures by coverage ROI and
  accuracy risk. Done: Gate B is timber/CLT floor-impact `DeltaLw`.
- Docs stop claiming broad personal-use readiness until the matrix
  proves it.
