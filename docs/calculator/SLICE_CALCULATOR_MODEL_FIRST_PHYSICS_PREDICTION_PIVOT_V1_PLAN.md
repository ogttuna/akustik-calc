# Slice Plan - Calculator Model-First Physics Prediction Pivot V1

Slice id: `calculator_model_first_physics_prediction_pivot_v1`

Status: SELECTED / GATE I NEXT

Selected by:

2026-05-05 implementation re-analysis after the user clarified that
DynEcho must be an acoustic calculator first, not a lookup/source-packet
queue.

Selection status:

`gate_h_source_calibration_exact_promotion_policy_landed_no_runtime_selected_family_material_expansion_gate_i`

Gate A file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`

Gate A landed action:

`gate_a_defined_model_first_candidate_basis_and_benchmark_acceptance_no_runtime`

Gate B file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts`

Gate B landed action:

`gate_b_defined_shared_airborne_basis_candidate_schema_without_value_movement`

Gate B selection status:

`gate_b_shared_airborne_basis_candidate_schema_landed_no_runtime_selected_rating_adapter_gate_c`

Gate C file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-c-rating-adapter-contract.test.ts`

Gate C landed action:

`gate_c_inventory_rating_adapter_integrity_without_value_movement`

Gate C selection status:

`gate_c_rating_adapter_integrity_landed_no_runtime_selected_input_completeness_gate_d`

Gate D file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts`

Gate D landed action:

`gate_d_define_physical_input_completeness_needs_input_matrix_without_value_movement`

Gate D selection status:

`gate_d_input_completeness_matrix_landed_no_runtime_selected_airborne_candidate_resolver_gate_e`

Gate E file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts`

Gate E landed action:

`gate_e_define_airborne_candidate_resolver_selected_rejected_candidates_without_value_movement`

Gate E selection status:

`gate_e_airborne_candidate_resolver_landed_no_runtime_selected_grouped_rockwool_prediction_gate_g`

Gate G file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-g-grouped-rockwool-prediction-contract.test.ts`

Gate G landed action:

`gate_g_promote_grouped_rockwool_triple_leaf_family_physics_prediction_with_benchmarks`

Gate G selection status:

`gate_g_grouped_rockwool_family_physics_prediction_landed_selected_source_calibration_gate_h`

Gate H file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-h-source-calibration-exact-promotion-contract.test.ts`

Gate H landed action:

`gate_h_calibrate_sources_and_exact_promotion_without_deleting_physics_solver`

Gate H selection status:

`gate_h_source_calibration_exact_promotion_policy_landed_no_runtime_selected_family_material_expansion_gate_i`

Gate I selected file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts`

Gate I selected action:

`gate_i_expand_family_material_properties_and_benchmark_scenarios`

Selected planning surface:

`docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`

Latest acoustic-calculator plan revalidation / execution handoff:

`docs/calculator/CHECKPOINT_2026-05-06_ACOUSTIC_CALCULATOR_PLAN_REVALIDATION_HANDOFF.md`

Latest Gate H / report-export wrap-up handoff:

`docs/calculator/CHECKPOINT_2026-05-06_GATE_H_AND_REPORT_EXPORT_WRAPUP_HANDOFF.md`

Latest landed Gate H handoff:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_H_HANDOFF.md`

Previous landed Gate G handoff:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_G_HANDOFF.md`

Previous landed Gate E handoff:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_E_HANDOFF.md`

Previous landed Gate D handoff:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_D_HANDOFF.md`

Previous landed Gate C handoff:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_C_HANDOFF.md`

Previous landed Gate B handoff:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_B_HANDOFF.md`

## Objective

Product objective:

DynEcho must become a high-accuracy acoustic calculator for personal use,
not a finite source lookup. The target user flow is: choose wall or
floor, enter the physical inputs needed for that route, select layer
materials and thicknesses, then calculate `Rw`, `R'w`, `DnT,w`, `Ln,w`,
and related outputs with clear basis, tolerance, and missing-input
diagnostics.

This slice exists because coverage and accuracy both matter. The system
must cover many realistic and hostile layer combinations, but it must not
pretend unsupported or under-specified assemblies are design-grade.
Exact measured/source rows remain the safest result when they truly
match; otherwise the engine must use family-specific physics, calibrated
or uncalibrated as appropriate, with explicit uncertainty.

Restore the calculator architecture to the intended model:

1. If an exact measured/source row exists for the full assembly, use it
   as exact source truth.
2. If no exact row exists, calculate a prediction from the layer stack
   with the best family-specific physics model available.
3. If a known subassembly exists, allow an exact anchor plus calculated
   delta candidate and compare it with the full-stack physics candidate.
4. Use source/lab rows for exact override, calibration, benchmarks,
   tolerances, and regression tests. Do not let missing source packets
   prevent formula-backed calculation.
5. Keep lab, field, and building-prediction contexts separate. Do not
   silently alias `Rw`/`STC`, `Ln,w`/`IIC`, or lab values with
   field/apparent values.
6. Treat edge cases as first-class acceptance criteria: many layers,
   duplicate layers, split roles, ambiguous topology, history replay, and
   safe or unsafe reorders must either remain stable or explain why the
   route changed.
7. Make tests prove acoustic correctness, not only code execution:
   expected numeric ranges or exact values, origin/basis, tolerance or
   error budget, support buckets, visible card/report parity, and nearby
   negative cases.

This slice corrects the planning error that treated
`rights_safe_source_owned_curve_payload_absent` as a blocker for any
Rockwool/triple-leaf calculation. That blocker still prevents measured
exact promotion. It must not block a labelled `calculated_prediction`.
Gate A made that rule executable: source absence is an exact/calibration
blocker, not formula absence.

## Standards / Research Baseline

Internet research on 2026-05-05 confirms the plan must be
standards-aligned and model-first:

- ISO 12354-1:2017 is the primary airborne building-estimation
  reference. It describes calculation models for airborne insulation
  between rooms using element performance, flanking paths, and
  theoretically derived propagation methods, with detailed frequency-band
  calculation from 100 Hz to 3150 Hz and optional extension to 50 Hz when
  data exists:
  <https://www.iso.org/standard/70242.html>
- ISO 12354-2:2017 is the impact counterpart. It estimates impact
  sound insulation between rooms, again combining element data,
  flanking/structural propagation, frequency-band calculation, and
  simplified single-number routes:
  <https://www.iso.org/standard/70243.html>
- ISO 717-1:2020 defines airborne single-number ratings from octave or
  one-third-octave band results, including `Rw` and spectrum adaptation
  terms:
  <https://www.iso.org/standard/77435.html>
- ISO 717-2:2020 defines the impact single-number rating family:
  <https://www.iso.org/fr/standard/69867.html>
- ISO 10140-2:2021 and ISO 10140-3:2021 are lab measurement references
  for airborne and impact element data; exact rows imported from lab
  reports should carry these or equivalent source-standard metadata:
  <https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/94/79487.html?browse=tc>
  <https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/94/79483.html?browse=tc>
- ISO 16283-1 / ISO 16283-2 are field-measurement references for
  airborne and impact building performance. Field outputs such as
  `R'w`, `DnT,w`, `L'n,w`, and `L'nT,w` must not be represented as
  independent lab exact values:
  <https://www.iso.org/standard/55997.html>
  <https://www.iso.org/standard/77436.html>
- ASTM E90 / E336 / E413 establish the US airborne lab, field, and STC
  rating lane. `STC` must be derived from a curve or exact source row
  with an ASTM-compatible basis, not copied blindly from `Rw`:
  <https://store.astm.org/e0090-23.html>
  <https://store.astm.org/standards/e336>
  <https://store.astm.org/e0413-22.html>
- ASTM E492 / E989 establish the US impact lab and IIC rating lane:
  <https://store.astm.org/e0492-25.html>
  <https://store.astm.org/e0989-21.html>
- INSUL is a reference competitor/category signal: professional tools
  are prediction engines for walls, floors, roofs, ceilings, and windows,
  not finite lookup tables:
  <https://marshallday.com/software>
- Double-leaf research confirms that cavity extent, finite radiation,
  and porous fill modelling materially affect predictions. A PubMed
  indexed 2017 JASA paper on double-leaf cavities specifically highlights
  finite-cavity effects and porous-fill parameter sensitivity:
  <https://pubmed.ncbi.nlm.nih.gov/28147555/>
- Porous absorber inputs must distinguish absorption data from isolation
  data. ISO 9053-1 gives airflow resistance measurement context for
  porous acoustic materials; ISO 354 and ASTM C423 cover reverberation
  room absorption measurements. NRC/absorption rows must not be treated as
  wall/floor transmission-loss rows:
  <https://www.iso.org/standard/69869.html>
  <https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/03/45/34545.html?browse=tc>
  <https://store.astm.org/Standards/C423.htm>
- Floating-floor impact predictions need resilient-layer dynamic
  stiffness, not just density or thickness. ISO 9052-1 is the relevant
  dynamic-stiffness measurement context for materials under floating
  floors:
  <https://www.iso.org/standard/16620.html>
- ASTM E1007 field impact measurement shows why field impact metrics need
  receiving-room, flanking, and metric-basis ownership; field impact
  results should not be generalized as lab `IIC`:
  <https://store.astm.org/e1007-25.html>
- ISO 10848-1/2/3/4 cover laboratory and field measurement of flanking
  transmission. This reinforces that field/apparent performance needs
  flanking/junction ownership and cannot be inferred from the separating
  stack alone:
  <https://www.iso.org/standard/67226.html>
  <https://www.iso.org/standard/67227.html>
  <https://www.iso.org/standard/67228.html>
  <https://www.iso.org/standard/67229.html>
- ISO 12999-1:2020 covers measurement uncertainty for building-acoustics
  sound insulation. Non-exact predictions need explicit uncertainty /
  tolerance metadata:
  <https://www.iso.org/standard/73930.html>
- Transfer-matrix / multilayer research supports a later generalized
  multilayer solver for solid, fluid, and porous layers, but it requires
  richer material properties and validation before being used broadly:
  <https://www.sciencedirect.com/science/article/abs/pii/S0022460X23003474>
- Professional ISO 12354 tools such as SONarchitect and BASTIAN combine
  calculation methods with frequency-band element data/databases. They are
  not proof that every assembly is a lookup row; they confirm the need for
  structured input data plus calculation:
  <https://www.acousticware.com/sonarchitect/index.php/en/sonarchitect-iso/whatit>
  <https://www.schallmessung.com/bastian/>
- INSUL technical notes expose the expected family-specific behavior:
  single panels need mass, modulus, critical-frequency/coincidence and
  loss-factor handling; double panels move through mass-law,
  mass-air-mass resonance, cavity-mode, and structural-connection regions:
  <https://www.insul.co.nz/tech-info/>

Implementation consequence:

- source rows are evidence and calibration, not the calculator;
- ratings must be curve-first where possible, then rated by ISO/ASTM
  adapters;
- exact-vs-prediction-vs-field basis must be first-class metadata;
- missing source packets cannot block prediction, only exact/source
  promotion;
- uncertainty/error-budget must be part of every non-exact surfaced
  answer.

## Deep Research Analysis

The practical architecture target is not "one formula for every stack".
It is a family router that produces a frequency-band curve wherever the
family has enough physical inputs, then applies explicit rating adapters.

### Element, Building, And Field Separation

- `Rw`, `STC`, `Ln,w`, and `IIC` can be element/lab or calculated
  element predictions when the stack owns the required physical data.
- `R'w`, `DnT,w`, `L'n,w`, `L'nT,w`, `AIIC`, `ISR`, and similar field or
  apparent outputs require room/context/flanking basis. They can be
  calculated only as continuations from an element prediction plus field
  context; otherwise they are `needs_input`.
- ISO 12354-style building estimation is not just the wall/floor layer
  stack. It needs separating element, receiving/source room context,
  flanking paths, junction/coupling, and receiver normalization.

### Material Data Contracts

The current material schema is intentionally too small for high-accuracy
physics. The solver should start with conservative defaults only where
the method already has a bounded default, and must expose each default in
`airborneBasis.propertyDefaults`.

Minimum future material fields by role:

- solid leaf: density, thickness, surface mass, Young modulus, Poisson
  ratio, loss factor, critical-frequency override, shear-wave/thick-plate
  flag;
- board/laminate/MLV: limp-mass or plate behavior, damping/loss factor,
  bonded-vs-decoupled layering;
- porous fill: flow resistivity, absorber class, fill coverage, thickness,
  placement, density, optional ISO 354 / ASTM C423 absorption data;
- resilient support/floor layer: dynamic stiffness, load range,
  compression/creep assumptions, thickness, coverage;
- frame/bridge: stud type, spacing, gauge/stiffness, connection class,
  resilient channel side count, screw/clip coupling;
- cavity: depth, cavity count, leaf grouping, fill state, cavity mode
  assumptions, vent/leak flags;
- field context: source/receiver volume, receiving absorption or
  reverberation time, partition area, flanking/junction class.

### Family Solver Implications

- single leaf can begin with mass-law plus critical/coincidence and loss
  factor correction; if modulus/loss factor are absent, return a wider
  error budget or a bounded/screening result.
- double leaf must model mass-air-mass resonance, cavity depth, absorber
  fill, cavity mode transition, and structural bridge limits. Stud
  spacing/coupling can swing ratings enough that "same layers, unknown
  frame" should not silently be high confidence.
- triple leaf must be role/group based, not flat-list based. Complete
  grouped topology can calculate; ambiguous reorderable flat lists stay
  `needs_input` or screening.
- porous material data improves cavity damping but does not by itself
  define isolation. NRC/absorption cannot be promoted to Rw/STC.
- floating floor impact needs dynamic stiffness and loading basis;
  thickness/density alone is not a design-grade impact predictor.
- transfer-matrix modelling is the long-term generalized route for
  arbitrary multilayer stacks, but it should be introduced after material
  property widening and benchmark tests, not as the first Rockwool fix.

### Accuracy / Tolerance Policy

Use three tolerance classes until enough calibration data exists:

- `exact_source`: exact imported/measured row; tolerance belongs to source
  parsing and rating reproduction.
- `calibrated_prediction`: family solver calibrated against source rows
  with holdout tests; expected tolerance should be documented per family.
- `uncalibrated_prediction`: physics formula with complete inputs but no
  source-family calibration; expose wider `errorBudgetDb` and never call
  it exact.

For early gates, numeric acceptance should test ranges and monotonic
sanity rather than pretend false exactness:

- adding mass to one leaf should not reduce high-frequency TL outside
  known resonance/coincidence bands without a trace reason;
- adding absorber in a cavity should not be modelled as a pure mass
  increase;
- reducing bridge coupling should not reduce predicted insulation;
- swapping grouped leaves should either be physically symmetric or explain
  the asymmetry;
- adding many layers must not change family route because of array-order
  instability alone.

## Milestone Roadmap

These milestones are intentionally ordered so the project stops circling
source packets before it has a calculator architecture. Each milestone
must leave a testable artifact and a clear rollback boundary.

### M0 - Direction Lock / Research Baseline

Status: complete.

Purpose:

- freeze the corrected rule: source absence is not formula absence;
- record ISO/ASTM/INSUL/research evidence that the target is
  calculation plus calibrated data, not lookup;
- keep Rockwool exact/source validation blocked while unblocking
  formula-backed prediction planning.

Done when:

- `NEXT_IMPLEMENTATION_PLAN.md`, this slice, and
  `CALCULATION_MODEL_AND_VALIDATION.md` all state the same rule;
- `AGENTS.md` points agents to this plan before old source-packet paths;
- validation is docs-only clean with `git diff --check`.

### M1 - Gate A Direction Contract

Status: landed no-runtime on 2026-05-06.

Target:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`

Purpose:

- make the model-first pivot executable as a no-runtime contract;
- assert candidate origins, standards fields, and precedence order;
- explicitly demote source-packet refresh to exact-source/calibration
  backlog;
- assert Rockwool/Uris source absence blocks exact promotion only.

Done when:

- focused Gate A contract passes;
- runtime values remain frozen;
- the test names the later milestone order M2-M9.

Landed evidence:

- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`
  passed;
- `pnpm calculator:gate:current` passed after adding Gate A to the
  current-gate runner;
- Gate B is now the next implementation step.

### M2 - Basis And Candidate Schema

Purpose:

- add first-class airborne `basis` and `candidateSet` structures parallel
  to the impact lane's precedence posture;
- represent `measurementStandard`, `calculationStandard`,
  `ratingStandard`, `frequencyBands`, `curveBasis`, `errorBudgetDb`,
  `propertyDefaults`, `missingSourceEvidence`, and
  `missingPhysicalInputs`;
- preserve existing API parsing while adding basis metadata.

Done when:

- exact, calibrated, prediction, bounded, screening, needs-input, and
  unsupported outputs can be represented without changing numeric values;
- old workbench/report callers continue to parse;
- engine tests prove source absence and input absence are distinct
  fields.

### M3 - Rating Adapter Integrity

Purpose:

- inventory and pin ISO 717-1, ISO 717-2, ASTM E413, and ASTM E989
  rating adapters;
- stop silent `Rw`/`STC`, `Ln,w`/`IIC`, and lab/field metric aliasing;
- make every single-number output traceable to a curve or exact source
  row.

Research basis:

- ISO 717 and ASTM E413/E989 are rating adapters, not stack solvers;
- field/apparent metrics must keep ISO 16283 / ASTM E336/E1007 context.

Done when:

- every surfaced rating has `ratingStandard` or explicit
  `engine_native` basis;
- tests fail if `STC` is copied from `Rw` without a compatible basis;
- impact ratings cannot be inferred from airborne curves.

### M4 - Input Completeness / Needs-Input Matrix

Purpose:

- define minimum physical inputs per solver family before resolver
  promotion;
- ask the user for missing topology/geometry instead of inventing it;
- allow optional precision fields to widen uncertainty only where a
  solver owns a documented default.

Research basis:

- ISO 12354 and ISO 10848 separate element performance, room/building
  geometry, flanking/junction paths, and field context;
- ISO 9053/354/ASTM C423 absorption data is useful only as absorber
  evidence, not isolation evidence;
- ISO 9052-1 dynamic stiffness is required for design-grade floating
  floor impact prediction.

Done when:

- single leaf, double leaf/framed, triple leaf, porous fill,
  floating-floor, and field/apparent rows each name required inputs;
- `needs_input` names exact missing fields for the UI;
- missing exact source never causes `needs_input` by itself.

### M5 - Airborne Candidate Resolver

Purpose:

- extract airborne selection out of `calculate-assembly.ts`;
- collect exact full-stack source, partial anchor plus delta, calibrated
  family physics, uncalibrated family physics, bounded prediction,
  screening fallback, needs-input, and unsupported candidates;
- return selected and rejected candidates so tests can prove why a
  tempting but invalid path lost.

Done when:

- selection is deterministic under duplicate rows and safe reorders;
- exact rows only win on exact topology/metric match;
- valid physics candidates survive source-packet absence;
- missing topology moves to `needs_input`.

### M6 - First Runtime Prediction: Grouped Rockwool Triple Leaf

Purpose:

- make the first visible correction a calculator result, not another
  source-packet wait;
- run the existing grouped two-cavity/triple-leaf solver as
  `family_physics_prediction`;
- keep exact/source-validated flags false.

Done when:

- complete grouped Rockwool topology no longer remains blocked by
  `rights_safe_source_owned_curve_payload_absent`;
- output carries finite `Rw`, `STC`, `C`, and `Ctr` from the solver curve;
- visible cards and reports say calculated prediction, not measured
  exact;
- flat-list ambiguous/reorder-sensitive Rockwool remains guarded.

### M7 - Calibration / Exact Promotion Layer

Purpose:

- return source packets to their correct role: exact override,
  calibration, benchmark, and holdout validation;
- allow measured subassemblies to anchor calculated delta candidates;
- prevent source rows from deleting or bypassing physics candidates.

Research basis:

- ISO 12999-1 uncertainty context supports explicit uncertainty/error
  handling instead of false exactness;
- source rows can reduce error budgets only through explicit calibration
  metadata and holdout tests.

Done when:

- measured exact, calibrated prediction, and uncalibrated prediction are
  separate candidate origins;
- source rows can promote only owned topology/metric/scope;
- calibration reports holdout tolerance and failure cases.

### M8 - Family Expansion And Material Property Widening

Purpose:

- expand beyond Rockwool without repeating one-off fix loops;
- add material properties needed by family solvers: modulus, Poisson
  ratio, loss factor, flow resistivity, porosity, limp-mass/membrane
  behavior, dynamic stiffness, uncertainty, and source status;
- introduce transfer-matrix/multilayer modelling only after the material
  contracts and validation harness exist.

Done when:

- single-leaf, double-leaf/framed, triple-leaf, lined massive/masonry,
  timber/CLT, floor/impact, and field/apparent families each have a
  named solver or explicit unsupported/needs-input boundary;
- scenario tests cover common professional layer combinations and hostile
  reorder/split/duplicate cases.

### M9 - Personal-Use Readiness Gate

Purpose:

- decide whether the calculator is ready for private use as a
  high-accuracy tool.

Done when:

- broad scenario tests cover wall/floor, exact source, anchored delta,
  physics prediction, field context, and unsupported/needs-input flows;
- `pnpm calculator:gate:current`, `pnpm check`, and docs guards pass;
- known incorrect/low-confidence corridors are either fixed, visibly
  labelled, or blocked with a named next slice.

## Benchmark And Acceptance Matrix

Use this matrix to decide whether a milestone is complete. Every
runtime-moving milestone must add or extend these benchmark rows instead
of relying on one happy-path number.

### B0 - No-Runtime Direction Contract

Applies to: M1.

Acceptance:

- active slice, target file, and milestone order are asserted;
- current Rockwool and other runtime values stay frozen;
- source absence is asserted as an exact/calibration blocker only.

### B1 - Exact Full-Stack Source Row

Applies to: M2, M5, M7, M9.

Acceptance:

- exact full-stack source row wins only on exact topology, metric, and
  rating basis match;
- result carries `measured_exact_full_stack`, source id, measurement
  standard, rating standard, and exact flags;
- adjacent near-miss stacks do not borrow the exact row.

### B2 - Exact Subassembly Anchor Plus Delta

Applies to: M2, M5, M7, M9.

Acceptance:

- an exact subassembly can participate only when the remaining layer
  delta has a named calculation method;
- full-stack physics and anchored-delta candidates can coexist;
- rejected-candidate trace explains why one candidate won.

### B3 - Single-Leaf / Massive Physics

Applies to: M4, M5, M8, M9.

Acceptance:

- surface mass or density/thickness is required;
- missing modulus/loss factor widens `errorBudgetDb` unless a solver
  explicitly requires them;
- adding mass should not reduce high-frequency TL outside documented
  resonance/coincidence reasons;
- `Rw` and `STC` are rated from compatible curves, not copied aliases.

### B4 - Double-Leaf / Framed / Cavity Physics

Applies to: M4, M5, M8, M9.

Acceptance:

- leaf groups, cavity depth, bridge/frame class, support spacing, and
  fill state are represented or named as missing;
- absorber/fill changes damping assumptions, not simple mass;
- unknown frame/bridge topology is `needs_input` or a visibly wider
  uncertainty class, not high-confidence prediction.

### B5 - Triple-Leaf / Multi-Cavity Physics

Applies to: M4, M5, M6, M8, M9.

Acceptance:

- grouped topology with two cavities can calculate as
  `family_physics_prediction`;
- flat-list ambiguous topology remains `needs_input` or guarded
  screening;
- grouped Rockwool can move from screening to prediction, while exact and
  source-validated flags remain false until M7.

### B6 - Porous Fill / Absorption Data Boundary

Applies to: M3, M4, M8, M9.

Acceptance:

- ISO 9053 / ISO 354 / ASTM C423 style data can support absorber/fill
  assumptions;
- NRC or absorption rows never promote directly to `Rw`, `STC`, `Ln,w`,
  or `IIC`;
- missing flow resistivity/absorber class either uses a documented
  conservative default or becomes `needs_input`.

### B7 - Floating Floor / Impact Prediction

Applies to: M3, M4, M5, M8, M9.

Acceptance:

- dynamic stiffness/load basis is required for design-grade
  floating-floor impact prediction;
- `Ln,w` / `IIC` are rated through ISO 717-2 / ASTM E989-compatible
  routes;
- field impact outputs require ASTM E1007 / field-context ownership.

### B8 - Field / Apparent Output Context

Applies to: M3, M4, M5, M9.

Acceptance:

- `R'w`, `DnT,w`, `L'n,w`, `L'nT,w`, and facade/OITC-like future outputs
  require room, area, flanking, junction, or facade context as relevant;
- ISO 12354 / ISO 10848 / ISO 16283 context is visible in basis metadata;
- missing field context produces `needs_input`, not design-grade output.

### B9 - Rating Adapter Integrity

Applies to: M3, M5, M9.

Acceptance:

- every single-number rating is traceable to a frequency curve or exact
  source metadata;
- `Rw`, `STC`, `IIC`, `Ln,w`, field, and facade ratings cannot silently
  alias each other;
- adapter changes require curve-level regression tests, not only final
  integer assertions.

### B10 - Hostile Layer Input Stability

Applies to: M4, M5, M6, M8, M9.

Acceptance:

- duplicate, split, reordered, very long, and mixed-role layer lists do
  not change route family without a trace reason;
- grouped topology remains stable under safe reorder;
- hostile flat-list inputs fail closed with missing-field diagnostics.

### B11 - Calibration / Holdout

Applies to: M7, M8, M9.

Acceptance:

- source rows can calibrate only the family/topology scope they own;
- holdout rows must remain outside calibration fitting;
- calibrated prediction, uncalibrated prediction, and exact source remain
  separate origins with separate error budgets.

### B12 - Personal-Use Scenario Pack

Applies to: M9.

Acceptance:

- scenario pack covers wall, floor, exact source, anchored delta,
  uncalibrated prediction, calibrated prediction, field continuation,
  `needs_input`, unsupported, and hostile inputs;
- engine, web visible cards, saved/replayed scenarios, and reports agree
  on value, basis, and support bucket.

## Initial Tolerance Classes

Tolerance numbers must be owned per family before runtime promotion. Use
these classes until source-backed family calibration replaces them:

- `exact_source`: exact imported/measured row. Tests assert exact source
  id, exact metric, and rating basis reproduction.
- `calibrated_prediction`: family solver calibrated against owned source
  rows with holdout tests. Tests assert target tolerance, residual
  summary, and rejected outliers.
- `uncalibrated_prediction`: complete physical inputs and named solver,
  but no family calibration yet. Tests assert range, monotonic sanity,
  assumptions, and wider `errorBudgetDb`; visible copy must not imply
  exactness.
- `bounded_prediction`: conservative bound where exact or full physics is
  unavailable. Tests assert bound direction and prevent exact-field
  leakage.
- `screening_fallback`: rough/legacy screening. Tests assert visible
  caveat and prevent company-internal high-accuracy promotion.

Stop rules:

- no non-exact result may surface without `errorBudgetDb` or
  `toleranceClass`;
- no field/apparent metric may surface as design-grade without required
  field context;
- no runtime value may move without at least one positive benchmark row
  and one nearby negative/hostile row;
- no source row may promote a broader family than its topology, metric,
  material mapping, and tolerance owner allow.

## Current Implementation Reading

Read these files before implementing this slice:

- `packages/engine/src/calculate-assembly.ts`
  - current entry point; dynamic airborne, verified catalog anchors,
    field companions, impact lane, output support, and Rockwool
    withholding are composed here.
- `packages/engine/src/airborne-verified-catalog.ts`
  - full-stack exact source anchor exists and should be retained.
  - gap: no partial source anchor plus calculated delta candidate.
- `packages/engine/src/impact-lane.ts`
  - closest existing pattern for precedence-based candidate resolution:
    exact source, exact system, bound, product, explicit delta,
    predictor, narrow estimate, family estimate.
- `packages/engine/src/dynamic-airborne.ts`
  - current airborne family selector and correction stack.
  - gap: `multileaf_multicavity` still selects
    `multileaf_screening_blend`, not a triple-leaf solver.
- `packages/engine/src/wall-triple-leaf-frequency-solver.ts`
  - existing three-leaf/two-cavity curve solver can produce band curve,
    `Rw`, `STC`, leaf masses, cavities, and resonances from grouped
    topology.
  - current blocker: it is typed as `researchOnly: true`,
    `runtimeEligible: false`, and `sourceOwned: false`.
- `packages/engine/src/wall-triple-leaf-engine-integration-fail-closed.ts`
  - current source-promotion prerequisites keep runtime on
    `multileaf_screening_blend`.
  - required correction: split exact-source promotion prerequisites from
    formula-backed prediction prerequisites.
- `packages/shared/src/domain/assembly.ts` and
  `packages/shared/src/domain/dynamic-airborne.ts`
  - current schemas lack a first-class airborne output origin/basis
    equivalent to impact/floor basis semantics.
- `packages/shared/src/domain/material.ts`
  - current material schema is too sparse for broad high-accuracy
    physics; it needs a later material-property widening plan.

## Non-Negotiable Model

Airborne/wall results must carry one of these origins:

- `measured_exact_full_stack`
- `measured_exact_subassembly_plus_calculated_delta`
- `calibrated_family_physics`
- `family_physics_prediction`
- `bounded_prediction`
- `screening_fallback`
- `needs_input`
- `unsupported`

Selection precedence:

1. full-stack measured exact source row;
2. full-stack source-anchored/calibrated family solver;
3. exact subassembly anchor plus calculated delta;
4. full-stack family-specific physics solver;
5. bounded prediction;
6. screening fallback;
7. needs-input/unsupported when required topology or geometry is absent.

Exact/source labels require source-owned topology, material mapping,
metric context, tolerance, negative boundaries, calibration/holdout, and
paired engine/web/report tests.

Formula-backed prediction requires:

- sufficient topology for the selected family;
- finite material properties or conservative defaults with uncertainty;
- a named solver/method;
- output basis and visible copy that says calculated prediction, not
  measured exact;
- numeric sanity tests and negative-boundary tests.

## Gate A - Contract And Schema Plan

Gate A is no-runtime. It defines the contract and blocks future agents
from returning to a source-packet-only path.

Implementation target:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`

Required Gate A assertions:

1. Active selected slice is this model-first pivot, not
   `rockwool_split_triple_leaf_rights_safe_source_packet_refresh_v2`.
2. Missing Rockwool/Uris/source packet blocks only measured-exact
   promotion, not formula-backed prediction.
3. Airborne candidate origins listed above are named in the contract,
   with standards-backed labels:
   - `measurementStandard`: ISO 10140, ISO 16283, ASTM E90, ASTM E336,
     ASTM E492, or none for pure prediction;
   - `ratingStandard`: ISO 717-1, ISO 717-2, ASTM E413, ASTM E989, or
     engine-native bounded estimate;
   - `calculationStandard`: ISO 12354-1, ISO 12354-2, or named local
     physics solver.
4. The impact lane is identified as the precedence pattern for the
   airborne resolver.
5. Rockwool grouped triple-leaf is the first benchmark target for a
   calculated prediction path.
6. Flat-list triple-leaf remains guarded: if topology is ambiguous,
   request grouped topology or mark needs-input; do not invent exact
   support from reorder-sensitive flat lists.
7. The existing untracked/stale
   `packages/engine/src/calculator-model-first-pivot-gate-a-contract.test.ts`
   must not be treated as landed unless it is reviewed and deliberately
   replaced by the Gate A target above.

Validation:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts --maxWorkers=1
git diff --check
```

## Gate B - Shared Basis And Candidate Shape

Add a shared airborne result basis/candidate schema. Suggested shape:

- `airborneBasis.kind`
- `airborneBasis.origin`
- `airborneBasis.family`
- `airborneBasis.method`
- `airborneBasis.calculationStandard`
- `airborneBasis.ratingStandard`
- `airborneBasis.measurementStandard`
- `airborneBasis.frequencyBands`
- `airborneBasis.curveBasis`
- `airborneBasis.exactSourceId`
- `airborneBasis.anchorSourceId`
- `airborneBasis.errorBudgetDb`
- `airborneBasis.toleranceClass`
- `airborneBasis.requiredInputs`
- `airborneBasis.assumptions`
- `airborneBasis.propertyDefaults`
- `airborneCandidateSet[]`

No numeric behavior should move until the schema is populated and tests
prove old callers still parse.

Gate B acceptance:

- existing API callers continue to parse;
- exact/catalog rows can identify their measurement/rating standard;
- formula predictions can identify their calculation/rating standard;
- field continuations can identify field context instead of appearing as
  lab exact values;
- UI/report cards can distinguish `measured exact`, `anchored
  prediction`, `calibrated prediction`, `physics prediction`, `bounded`,
  `screening`, `needs input`, and `unsupported`.

Implementation detail after the 2026-05-06 plan/implementation
validation:

Gate B has landed no-runtime. Gate A is landed and current-gate
validated, and the selected Gate B file now adds shared schema support
for first-class `airborneBasis` / `airborneCandidateSet` fields. This
means the active slice is still in progress, but the next step is Gate C
rating-adapter integrity, not a new slice and not runtime movement.

Landed implementation shape:

1. Created a small shared schema module for airborne basis metadata:
   `packages/shared/src/domain/airborne-basis.ts`.
2. Exported it from `packages/shared/src/index.ts`.
3. Added optional `airborneBasis` and `airborneCandidateSet` fields to
   `AssemblyCalculation` in `packages/shared/src/domain/assembly.ts`.
   Optional fields preserve old API/workbench/report callers in Gate B.
4. Created
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts`.
5. Added Gate B to `tools/dev/run-calculator-current-gate.ts`.

The Gate B contract test should be data-shape-first and no-runtime:

- parse a legacy assembly result with no airborne basis fields;
- parse an exact full-stack candidate with `measurementStandard` and
  `ratingStandard`;
- parse a formula-backed prediction candidate with
  `calculationStandard`, `ratingStandard`, and either `errorBudgetDb` or
  `toleranceClass`;
- parse a `needs_input` candidate where `missingPhysicalInputs` is
  populated and `missingSourceEvidence` is not treated as the same
  field;
- parse a source-blocked exact/calibration candidate where
  `missingSourceEvidence` is populated but a separate physics candidate
  can still exist;
- assert the current Rockwool frozen values through `calculateAssembly`
  so Gate B cannot accidentally become M6.

Do not populate the runtime resolver broadly in Gate B. It is acceptable
for the focused contract to build representative basis/candidate objects
directly, plus a small compatibility parse through
`AssemblyCalculationSchema`. Gate E later owns optional resolver
metadata. Runtime population and numeric movement belong to Gate G/M6.

2026-05-06 update: Gate E has now added that optional resolver metadata
surface without runtime population.

## Gate C - Rating Adapter Inventory

Gate C has landed no-runtime. Before changing solver values, it
inventoried and pinned rating adapters:

- ISO 717-1 adapter for `Rw`, `C`, and `Ctr` from one-third-octave or
  octave airborne curves;
- ASTM E413 adapter for `STC` from compatible airborne transmission-loss
  curves;
- ISO 717-2 adapter for `Ln,w`, `L'n,w`, `L'nT,w`, and related impact
  single-number ratings;
- ASTM E989 adapter for `IIC` from ASTM E492/E1007-compatible impact
  band data.

Gate C acceptance:

- every rating has a named rating standard or is marked engine-native;
- `Rw` and `STC` are not silently interchangeable;
- impact ratings are not inferred from airborne ratings;
- field ratings are not labelled as lab exact;
- current values remain frozen unless the adapter already exists and the
  test only exposes metadata.

Gate C landed implementation shape:

- added `packages/shared/src/domain/rating-adapter.ts`;
- exported rating-adapter schemas from `packages/shared/src/index.ts`;
- added optional `ratingAdapterBasisSet` to `AssemblyCalculationSchema`;
- added the focused Gate C contract at
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-c-rating-adapter-contract.test.ts`;
- added Gate C to `tools/dev/run-calculator-current-gate.ts`;
- kept runtime values, support buckets, confidence, evidence, visible
  cards, proposal/report copy, and workbench input behavior frozen.
- validated focused Gate C 1 file / 6 tests, Gate A/B/C continuity
  3 files / 17 tests, and `pnpm calculator:gate:current` with engine
  284 files / 1604 tests, web 61 files / 273 passed + 18 skipped, repo
  build 5 / 5 tasks, and whitespace guard green;
- validated broad `pnpm check` with lint/typecheck clean, engine 409
  files / 2406 tests, web 166 files / 936 passed + 18 skipped, repo
  build 5 / 5 tasks, and final `git diff --check` green after
  `apps/web/next-env.d.ts` restoration.

Gate C selected Gate D:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts`

`gate_d_define_physical_input_completeness_needs_input_matrix_without_value_movement`

## Gate D - Input Completeness / Needs-Input Matrix

Before the resolver promotes physics predictions, define the minimum
input matrix per family. This gate prevents "calculate everything" from
turning into "invent missing physics".

Required matrix rows:

- single leaf:
  surface mass or density/thickness; material class; optional modulus and
  loss factor; missing modulus/loss factor widens uncertainty.
- double leaf/framed:
  leaf grouping, cavity depth, frame/bridge class, fill state, support
  spacing/side-count where relevant.
- triple leaf:
  side A leaf group, cavity 1, internal leaf group, internal coupling,
  cavity 2, side B leaf group, support topology.
- porous fill:
  thickness, placement, fill coverage, flow-resistivity/absorber class or
  conservative default marker.
- floating floor:
  base slab/floor, topping or floating layer, resilient layer dynamic
  stiffness/load basis, ceiling/lower assembly where relevant.
- field/apparent outputs:
  partition area, source/receiver volume or receiving-room normalization,
  flanking/junction class or explicit conservative flanking assumption.

Acceptance:

- missing exact source never yields `needs_input` by itself;
- missing physical topology/input yields `needs_input`;
- missing optional precision parameters yields wider uncertainty only when
  the selected solver has documented defaults;
- every `needs_input` result names the missing fields the UI should ask
  for.

Gate D landed implementation shape:

- added `packages/shared/src/domain/input-completeness.ts`;
- exported input-completeness schemas from `packages/shared/src/index.ts`;
- added optional `inputCompletenessSet` to `AssemblyCalculationSchema`;
- added the focused Gate D contract at
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts`;
- added Gate D to `tools/dev/run-calculator-current-gate.ts`;
- kept runtime values, support buckets, confidence, evidence, visible
  cards, proposal/report copy, and workbench input behavior frozen.
- validated focused Gate D 1 file / 7 tests, Gate A/B/C/D continuity
  4 files / 24 tests, and `pnpm calculator:gate:current` with engine
  285 files / 1611 tests, web 61 files / 273 passed + 18 skipped, repo
  build 5 / 5 tasks, and whitespace guard green;
- validated broad `pnpm check` with lint/typecheck clean, engine 410
  files / 2413 tests, web 166 files / 936 passed + 18 skipped, repo
  build 5 / 5 tasks, and final `git diff --check` green.

Gate D selected Gate E:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts`

`gate_e_define_airborne_candidate_resolver_selected_rejected_candidates_without_value_movement`

## Gate E - Airborne Candidate Resolver

Gate E landed the no-runtime resolver contract and optional shared
metadata surface. Runtime population still belongs to Gate G and later
runtime gates.

Implemented surfaces:

- `packages/shared/src/domain/airborne-basis.ts` now exports
  `AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE`,
  `AirborneCandidateResolutionSchema`, and related resolver tie-breaker
  types.
- `AssemblyCalculationSchema` now accepts optional
  `airborneCandidateResolution` metadata.
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts`
  pins the resolver contract without populating runtime results.

The resolver policy mirrors `impact-lane.ts` and must:

1. collect exact full-stack catalog match;
2. collect exact partial/subassembly anchors when available;
3. collect calibrated family-specific solver candidates;
4. collect uncalibrated family physics predictions;
5. collect bounded/screening fallback;
6. select by precedence, required-input completeness, family confidence,
   and error budget.

The resolver must return both selected result and rejected candidates so
tests can prove why a better-looking but invalid candidate was not used.

Gate E landed acceptance:

- candidate selection is deterministic under duplicate rows and safe
  reorders;
- exact full-stack rows override prediction only on exact topology match;
- partial anchors can participate only when the remaining delta has a
  named calculation method;
- missing topology moves to `needs_input`, not an invented number;
- source-packet absence does not remove a valid physics candidate.
- selected candidate count is exactly one, selected candidates cannot
  carry rejection reasons, and rejected candidates must explain why they
  lost or were blocked.
- validation passed on 2026-05-06: focused Gate E 1 file / 8 tests,
  focused Gate A/B/C/D/E continuity 5 files / 32 tests,
  `pnpm calculator:gate:current`, broad `pnpm check`, and final
  `git diff --check` green.

Gate E selected Gate G:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-g-grouped-rockwool-prediction-contract.test.ts`

`gate_g_promote_grouped_rockwool_triple_leaf_family_physics_prediction_with_benchmarks`

## Gate F - Solver Family Roadmap

Implement solver families incrementally. Do not wait for all families to
be perfect before fixing Rockwool, but every family must have a named
method, input contract, error budget, and negative cases.

1. Single-leaf / massive / panel:
   - mass-law baseline;
   - coincidence/critical-frequency correction;
   - material-family calibration where exact rows exist;
   - ISO 717-1 / ASTM E413 rating adapters from generated curves.
2. Double-leaf / framed / cavity:
   - mass-air-mass resonance;
   - cavity depth and absorber fill;
   - stud/bridge/resilient coupling;
   - Sharp/Davy/Cremer-style candidate lineage where already present or
     added;
   - finite-cavity and porous-fill sensitivity tracked as assumptions.
3. Triple-leaf / multi-cavity:
   - use grouped topology first;
   - two-cavity solver candidate from
     `wall-triple-leaf-frequency-solver.ts`;
   - expose leaf masses, cavity depths, coupling assumptions, resonance
     frequencies, and uncertainty;
   - keep flat-list ambiguous topology as `needs_input`.
4. Lined massive / masonry / CLT / timber:
   - keep existing exact/source rows;
   - use family physics where source rows are absent;
   - prevent source rows from becoming broad lookup guesses outside their
     topology.
5. Floor / impact:
   - keep `impact-lane.ts` precedence;
   - align impact prediction metadata with ISO 12354-2, ISO 717-2,
     ASTM E492, ASTM E989;
   - preserve existing exact floor-system rows and delta/bound lanes.

## Gate G - Rockwool Grouped Triple-Leaf Prediction

First runtime movement should be the grouped Rockwool/triple-leaf case:

- input: complete grouped triple-leaf topology with two 50 mm Rockwool
  cavities, internal gypsum leaf, MLV, gypsum/plaster outer leaves, and
  support topology;
- selected origin: `family_physics_prediction`;
- method: triple-leaf/two-cavity frequency-band solver;
- output: finite `Rw`, `STC`, `C`, `Ctr` from solver curve;
- support: grouped topology can support wall airborne prediction outputs;
- exact flag: false;
- source-validated flag: false until source rows validate it;
- copy: calculated prediction, not measured exact.

Flat-list split/internal Rockwool remains guarded unless topology can be
inferred without ambiguity. A hostile reorder must not silently become
exact or source-backed.

Gate G acceptance:

- grouped Rockwool no longer stays blocked by
  `rights_safe_source_owned_curve_payload_absent`;
- selected origin is `family_physics_prediction`;
- exact/source-validated flags remain false;
- result carries standards/rating basis, solver assumptions, and
  uncertainty;
- visible output cards and proposal/report copy do not call the result
  measured exact;
- current flat-list negative/withholding tests remain green.

## Gate H - Source Calibration And Exact Promotion

After the prediction path exists, source-packet work returns as
calibration/exact-promotion backlog:

- source rows can calibrate triple-leaf damping/coupling and tolerance;
- measured full-stack rows can override prediction;
- measured subassemblies can anchor delta candidates;
- no source row is allowed to delete or bypass the physics solver.

The old source-packet refresh plan is retained as backlog for this gate,
not as the active next action.

Gate H acceptance:

- a source row can promote only the exact topology/metric it owns;
- a source row can calibrate a family only through explicit calibration
  metadata and holdout tests;
- measured exact, calibrated prediction, and uncalibrated prediction are
  separate origins;
- exact and prediction values can coexist as candidates and the resolver
  explains why one won.

## Material Property Follow-Up

Create a later material-property widening slice after Gate G or when a
solver needs it. It should add first-class airborne/mechanical
properties such as:

- Young modulus;
- Poisson ratio;
- loss factor/damping;
- flow resistivity;
- porosity;
- absorber class;
- limp-mass/membrane behavior;
- property uncertainty and source status.

Do not block Gate G on the full material-property program. Use
conservative defaults where the existing solver already does, but expose
the assumptions in `airborneBasis`.

## Documentation And Test Expectations

Docs that must stay aligned while implementing:

- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`
- `docs/calculator/MASTER_PLAN.md`
- this slice plan
- `AGENTS.md`

Tests must check values, basis/origin, support buckets, visible card
copy, and negative cases. A finite number alone is not sufficient.
