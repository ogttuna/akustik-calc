# Next Implementation Plan

Document role: tactical detail for the **active slice**. Short,
focused, agent-resume friendly. For the strategic picture read
[MASTER_PLAN.md](./MASTER_PLAN.md). For what is stable right now read
[CURRENT_STATE.md](./CURRENT_STATE.md). For the private-use readiness
chain read
[PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md).
For the prepared company-internal operating-envelope slice read
[SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md](./SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md).
For the long source-gated accuracy program read
[CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md).
For the immediate user-reported triple-leaf / rockwool reorder defect
read
[TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md](./TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md).
For the 2026-05-07 construction-image route-selection accuracy
incident, planned after Gate Z, read
[ACCURACY_INCIDENT_2026-05-07_CONSTRUCTION_IMAGE_ROUTE_SELECTION.md](./ACCURACY_INCIDENT_2026-05-07_CONSTRUCTION_IMAGE_ROUTE_SELECTION.md).
For the active route/source boundary risk register read
[CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md](./CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md).
For the 2026-05-08 strategic ROI replan that follows Gate BH read
[CHECKPOINT_2026-05-08_STRATEGIC_ROI_REPLAN_HANDOFF.md](./CHECKPOINT_2026-05-08_STRATEGIC_ROI_REPLAN_HANDOFF.md).
For the Gate-F-after strategic ROI revalidation and Gate G handoff read
[CHECKPOINT_2026-05-10_STRATEGIC_ROI_REVALIDATION_AND_GATE_G_PLAN_HANDOFF.md](./CHECKPOINT_2026-05-10_STRATEGIC_ROI_REVALIDATION_AND_GATE_G_PLAN_HANDOFF.md).
For the 2026-05-11 INSUL / ISO research refresh and Gate P replan read
[CHECKPOINT_2026-05-11_INSUL_ISO_RESEARCH_AND_GATE_P_REPLAN_HANDOFF.md](./CHECKPOINT_2026-05-11_INSUL_ISO_RESEARCH_AND_GATE_P_REPLAN_HANDOFF.md).
For the Gate S opening/leak runtime corridor and Gate T handoff read
[CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_S_HANDOFF.md](./CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_S_HANDOFF.md).
For the Gate R no-runtime formula corridor and Gate S handoff read
[CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_R_HANDOFF.md](./CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_R_HANDOFF.md).
For the Gate Q no-runtime input contract and Gate R handoff read
[CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Q_HANDOFF.md](./CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_Q_HANDOFF.md).
For the Gate P no-runtime closeout and Gate Q handoff read
[CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_P_HANDOFF.md](./CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_P_HANDOFF.md).

## Product Goal - Acoustic Calculator First

DynEcho's near-term product goal is personal-use readiness for a real
acoustic calculator. A user should be able to choose wall or floor, fill
the route-specific physical inputs, add layer materials and thicknesses,
and receive defensible `Rw`, `R'w`, `DnT,w`, `Ln,w`, and related values.
If a required physical field is missing, the calculator should identify
that missing input instead of inventing a high-confidence answer.

The core success criteria are coverage and accuracy together. The engine
must handle many wall/floor layer combinations with family-specific
physics, while still preferring exact measured/source rows when the full
assembly truly matches. Trusted source rows can also anchor deltas,
calibrate family solvers, define holdouts, and set tolerance boundaries,
but missing source packets must not block formula-backed prediction.

Long-term, DynEcho should be an industry-leading acoustic calculator, not
an INSUL clone and not a source library. INSUL's public technical notes
are useful because they show the expected family-specific prediction
shape, but DynEcho's target is stronger: exact measured override plus
source-anchored deltas, calibrated and uncalibrated physics candidates,
visible rejected candidates, explicit uncertainty, and strict separation
between lab element, field measurement, and building-prediction bases.

Dynamic calculator workflow target:

1. User selects `wall` or `floor`.
2. The route opens required physical inputs for the requested outputs:
   element/lab, field/apparent, or building prediction.
3. User enters layers, thicknesses, order, material properties, and
   grouped topology/context when the family requires it.
4. Engine resolves exact source, similar-source anchor, calibrated
   physics, uncalibrated physics, bounded prediction, screening,
   `needs_input`, and `unsupported` candidates.
5. Engine surfaces the lowest-risk basis-compatible candidate with
   `errorBudgetDb` / `toleranceClass`, rejected-candidate reasons, and
   missing-input prompts.
6. Workbench cards, saved replay, PDF, and DOCX must show the same value,
   basis, support bucket, and uncertainty posture.

Development work should therefore be judged by acoustic correctness, not
only software green status. Tests must assert numeric expectations,
origin/basis, tolerance or error budget, support buckets, workbench and
report parity, nearby negative cases, and hostile input behavior such as
many layers, duplicate/split roles, ambiguous topology, and safe or
unsafe reorders. Lab, field, and building-prediction bases must stay
separate; `Rw`/`STC`, `Ln,w`/`IIC`, and lab/field values are not
interchangeable without a named rating and measurement basis.

## Strategic ROI Replan - 2026-05-08

The Gate AQ-BH steel-floor calibration-readiness run usefully closed
ownership rules around the lightweight-steel formula corridor, but the
ROI has now changed. Continuing to add narrow same-stack steel `DeltaLw`
governance gates will not make DynEcho feel like a broadly usable
calculator fast enough. The highest-value path is:

1. Finish Gate BI as a minimal no-runtime governance guard. Its job is
   only to prove that Gate BH's `tighten` signal cannot move runtime
   tolerances, exact rows, source text, formulas, or field/building
   aliases without an explicit later runtime gate.
2. Immediately pivot to a Personal-Use MVP Coverage Sprint. Build an
   executable wall/floor scenario matrix of realistic and hostile user
   inputs, then classify every requested output as exact source,
   source-anchored delta, calibrated physics, uncalibrated family
   physics, bounded/screening, `needs_input`, or `unsupported`.
3. Use the matrix to select the next algorithmic family solver by
   user-visible coverage gain, not by source-packet availability. The
   first candidates to compare are generalized wall multi-cavity /
   triple-leaf routing beyond fixture gates, lined-massive/masonry
   upgrades, timber/CLT floor-impact coverage, and field/building
   continuations that have enough physical context.
4. Only return to steel-floor tolerance tightening when independent,
   source-owned same-stack ISO lab `DeltaLw` packets exist and the
   governance gate has a clear runtime proposal. Until then steel
   tolerances remain `+/-4.5 dB Ln,w` and `+/-2.0 dB DeltaLw`.

Why this is the correct direction:

- ISO 12354-1 and ISO 12354-2 frame building acoustics as calculation
  from element performance plus propagation/flanking context, not as a
  finite catalog lookup:
  <https://www.iso.org/standard/70242.html>,
  <https://www.iso.org/standard/70243.html>.
- ISO 717-1 and ISO 717-2 own the single-number rating conversion for
  airborne and impact results, so DynEcho needs basis-aware adapters and
  frequency/curve integrity:
  <https://www.iso.org/standard/77435.html>,
  <https://www.iso.org/standard/69867.html>.
- ISO 16283-1 and ISO 16283-2 define field measurement contexts, which
  reinforces that lab `Rw` / `Ln,w` must not be relabelled as `R'w`,
  `DnT,w`, `L'n,w`, or `L'nT,w` without owned room/context inputs:
  <https://www.iso.org/standard/55997.html>,
  <https://www.iso.org/standard/77436.html>.
- INSUL's public positioning confirms that users expect wall, floor,
  and ceiling prediction with material/layer choices and 1/3-octave
  results, but DynEcho's differentiator must be exact-source override
  plus transparent candidate rejection, uncertainty, and stricter basis
  separation:
  <https://www.insul.co.nz/>,
  <https://www.insul.co.nz/media/43149/INSUL-Version10-November-2023.pdf>.

Stop conditions for the sprint:

- do not crawl broad sources unless the active matrix names one exact
  source or holdout as the highest-impact unblocker;
- do not promote a measured row unless metric, topology, basis,
  rights-safe locator, and paired negative boundaries are owned;
- do not ship a numeric result where a physical input is missing;
- do not call the calculator personal-use-ready until common wall and
  floor scenarios are executable with visible numeric/basis/tolerance
  assertions and hostile-input coverage.

Second-pass execution format:

1. Close Gate BI as a small no-runtime governance contract. It must
   prove Gate BH's `tighten` label cannot change runtime values,
   tolerances, formula coefficients, exact-source precedence, source
   ingestion, field/building aliases, cards, reports, or APIs.
2. Start the Personal-Use MVP Coverage Sprint with
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts`.
   Gate A should add an executable scenario matrix over current engine
   entry points, not a paper-only checklist.
3. Every matrix row must pin route, family, requested metrics, basis,
   input completeness, current posture, expected posture, value or
   `needs_input` / `unsupported`, origin/support bucket,
   tolerance/error budget, visible-surface parity requirement, hostile
   variant, failure class, and next action.
4. The initial row inventory must cover at least 24 common and hostile
   scenarios: single/masonry/AAC walls, laminated/rigid walls,
   double-leaf and resilient framed walls, grouped and ambiguous
   triple/multi-cavity walls, lined massive walls, CLT/mass-timber
   walls, field airborne requests, heavy floating floors,
   lightweight-steel formula/exact/ambiguous cases, timber/CLT impact
   floors, field impact requests, ASTM/IIC boundaries, long-layer
   stress, invalid thickness, and safe/unsafe reorder cases.
5. Gate B must be selected from the matrix by coverage ROI:
   `user_frequency * current_failure_risk * solver_readiness /
   (implementation_cost + basis_leakage_risk)`. A lane with no numeric
   or posture assertions is not selectable.

## Strategic ROI Revalidation - 2026-05-10

The Gate F implementation validates the earlier ROI pivot. Floor-side
steel and timber/CLT formula corridors now have runtime, visible
surface parity, and first-class input surfaces. The next broad
calculator-readiness blocker is wall coverage, specifically generalized
multi-cavity / triple-leaf route readiness beyond fixture gates.

Fresh external checks still support this direction:

- ISO 12354-1 and ISO 12354-2 put calculation models, element
  performance, flanking/propagation, frequency bands, and uncertainty at
  the center of building-acoustic prediction.
- ISO 717-1 and ISO 717-2 keep single-number ratings downstream of
  frequency-band results, so family solvers and rating adapters must
  stay separate.
- ISO 16283-1 and ISO 16283-2 keep field measurement contexts separate
  from lab element values, so field/building outputs remain explicit
  context adapters.
- INSUL Version 10's public feature set confirms the market expectation
  for single/double/triple/quad system prediction with separate cavities,
  frame/infill modelling, and material properties. DynEcho should meet
  that scope with stricter candidate rejection and basis/error-budget
  transparency.

Gate L, Gate M, Gate N, and Gate O have now landed from that decision chain:

`gate_l_personal_use_mvp_airborne_building_prediction_boundary_plan`

`gate_m_personal_use_mvp_airborne_building_prediction_input_contract_plan`

`gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_plan`

`gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_plan`

The immediate next action is:

`gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_plan`

Target:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-p-airborne-building-prediction-runtime-corridor-contract.test.ts`

Gate M defines the first positive input contract for airborne
`building_prediction`: source-room volume, receiving-room volume/RT60,
flanking/junction class, conservative flanking assumption, junction
coupling length, building output basis, and the existing separating
element area. Gate N has now decided the first runtime-adapter boundary
for ISO 12354-1 style airborne building prediction, without reusing Gate
I field budgets or lab `Rw` values as building metrics. Gate O should
decide whether a narrow formula corridor can promote only after direct
separating-element curve, flanking path transmission, junction vibration
reduction, room absorption normalization, and uncertainty-budget owners
are explicit.

Gate O has now defined that narrow building-prediction formula corridor
without runtime movement. It keeps `R'w` / `DnT,w` parked, names
source-absent flanking formula terms, carries a `+/-9 dB` not-measured design
budget with same-building holdout uncertainty, and selects Gate P for the
runtime-corridor decision.

Gate O landed execution summary:

1. Created
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-o-airborne-building-prediction-formula-corridor-contract.test.ts`.
2. Added
   `packages/engine/src/dynamic-airborne-gate-o-building-prediction-formula-corridor.ts`
   for the Gate O plan id, status id, formula basis, budget terms, alias
   boundaries, and Gate P selection constants.
3. Defined separate source-absent formula corridors for `R'w` and
   `DnT,w`; both keep `proposedRuntimeEstimateDb: null` and
   `runtimePromotionAllowedInGateO: false`.
4. Formula terms are direct separating-element frequency curve, flanking
   path energy sum, junction vibration reduction index, room absorption
   standardization, and building-prediction uncertainty budget.
5. Gate O blocks lab `Rw` / `STC`, Gate I field budgets, and source
   single-number rows without an owned curve from being relabelled as
   building metrics.
6. Next selected gate:
   `gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_plan`.
7. Validation completed on 2026-05-10: focused Gate O engine formula
   corridor contract passed 1 file / 6 tests; Gate O/N/M/L plus Gate
   I/J/K continuity passed 7 files / 38 tests; engine typecheck passed;
   final `pnpm calculator:gate:current` passed with engine 356 files /
   2062 tests, web 71 files / 306 passed + 18 skipped, repo build 5/5
   successful, whitespace guard clean, and final `git diff --check`
   passed after the validation-doc sync. Known non-fatal warnings:
   test-environment Zustand storage-unavailable messages and optional
   `sharp` `@img/*` resolution warnings during web build.

## Strategic Research Refresh - 2026-05-11 INSUL / Building Prediction

This refresh rechecked the active Gate P decision against current public
INSUL documentation and official ISO standard pages. It does not change
the selected next gate: Gate P remains the immediate implementation
decision. It does tighten the acceptance bar for runtime promotion.

External findings:

- INSUL presents itself as a wall/floor/ceiling/window sound-insulation
  predictor and says it uses mass law, critical-frequency methods,
  Sharp, Cremer, and continued laboratory comparison to provide useful
  estimates. Its user guide states that prediction is not a substitute
  for test data and gives a typical accuracy statement around 3
  `STC`/`Rw` points for most constructions:
  <https://docs.insul.co.nz/v10/>.
- INSUL Version 10 publicly supports airborne `STC`/`Rw` prediction for
  single, double, triple, and quad systems, plus `IIC` and `Ln,w`
  impact predictions for single, double, and triple systems. That
  confirms the market scope DynEcho must eventually cover, but it also
  reinforces that the calculator needs family-specific models rather
  than source-row accumulation:
  <https://www.insul.co.nz/media/43149/INSUL-Version10-November-2023.pdf>.
- INSUL's triple-panel theory page says triple-panel predictions are
  less accurate than single/double panels and gives 90% limits around
  4 dB for `Rw` / `STC`. This supports keeping explicit wider budgets
  for complex multi-leaf systems:
  <https://docs.insul.co.nz/v10/SoundInsulationTheory/Airborne-TriplePanels/>.
- Most important for Gate P: INSUL's airborne flanking page says INSUL
  does not directly calculate flanking transmission within a building;
  it provides a visual indicator/reminder. That is a strong competitor
  benchmark warning against promoting `R'w` / `DnT,w` from a vague
  heuristic overlay:
  <https://docs.insul.co.nz/v10/SoundInsulationTheory/Airborne-Flanking/>.
- INSUL impact documentation keeps vertical impact prediction scoped and
  explicitly excludes horizontal/diagonal impact radiation. Its impact
  accuracy page gives broad `Ln,w` / `IIC` uncertainty ranges by floor
  family. That reinforces DynEcho's current rule: do not alias impact
  field/building metrics from lab values without owned context:
  <https://docs.insul.co.nz/v10/SoundInsulationTheory/Impact-ImpactSound/>,
  <https://docs.insul.co.nz/v10/SoundInsulationTheory/Impact-Accuracy/>.
- ISO 12354-1 frames airborne building prediction as calculation from
  element performance plus direct/indirect flanking transmission and
  structural propagation terms, with a detailed frequency-band model and
  a restricted simplified single-number model:
  <https://www.iso.org/standard/70242.html>.
- ISO 12354-2 gives the same kind of building-prediction framing for
  impact sound between rooms:
  <https://www.iso.org/standard/70243.html>.
- ISO 717-1 and ISO 717-2 define single-number rating conversion from
  measured band results for airborne and impact sound insulation. This
  keeps `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`, and `L'nT,w` as
  basis-specific outputs rather than interchangeable labels:
  <https://www.iso.org/standard/77435.html>,
  <https://www.iso.org/standard/69867.html>.
- ISO 16283-1 and ISO 16283-2 define field measurement procedures for
  airborne and impact sound insulation in buildings. This confirms that
  field/apparent outputs remain explicit measurement or
  building-context routes, not relabelled lab results:
  <https://www.iso.org/standard/55997.html>,
  <https://www.iso.org/standard/77436.html>.

Gate P decision after research:

1. Gate P must start by trying to prove a narrow runtime corridor from
   owned formula terms, not from UI copy or the previous field-context
   overlay.
2. Runtime promotion is allowed only if the engine can compute and trace
   the direct separating-element frequency curve, conservative flanking
   path energy sum, junction vibration-reduction/coupling term, room
   standardization term, and the existing `+/-9 dB` source-absent
   building budget.
3. If any of those terms remain only named but not executable, the
   correct Gate P outcome is no-runtime: complete building requests stay
   `unsupported`, the warning explains which formula owners are missing,
   and the next gate pivots back to a higher-ROI personal-use coverage
   lane.
4. A single-number source row, lab `Rw`/`STC`, Gate I field result, or
   INSUL-style reminder about flanking is not enough to calculate
   design-grade `R'w` or `DnT,w`.
5. No broad source crawl is selected. A source search is only justified
   if Gate P names a specific holdout needed to calibrate one owned
   formula term.

Gate N landed execution summary:

1. Created
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-n-airborne-building-prediction-runtime-adapter-contract.test.ts`.
2. Added
   `packages/engine/src/dynamic-airborne-gate-n-building-prediction-runtime-adapter.ts`
   for the Gate N plan id, status id, scenario pack, warning, runtime
   adapter method, formula owner inputs, and Gate O selection constants.
3. Complete Gate M physical and adapter owner sets now distinguish
   missing formula ownership from missing physical inputs and missing
   metric-basis owners. Gate N formula owners are:
   direct separating-element frequency curve owner, flanking path
   transmission terms owner, junction vibration reduction index owner,
   room absorption normalization owner, and building-prediction
   uncertainty-budget owner.
4. Complete physical building requests still select
   `candidate_dynamic_unsupported`, now with method
   `dynamic_calculator_building_prediction_runtime_adapter_owner_missing`.
5. Gate N keeps `R'w` / `DnT,w` building runtime numeric values parked,
   keeps Gate I field values live and separate, and does not crawl broad
   source rows.
6. Next selected gate:
   `gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_plan`.
7. Validation completed on 2026-05-10 after implementation: focused
   Gate N passed 1 file / 6 tests; Gate M/L continuity plus Gate I/J/K
   field continuity passed 6 files / 32 tests; focused workbench
   building/field input surfaces passed 2 files / 8 tests; engine/web
   typechecks passed; final `pnpm calculator:gate:current` passed with
   engine 355 files / 2056 tests, web 71 files / 306 passed + 18
   skipped, repo build 5/5 successful, and whitespace guard clean;
   final `git diff --check` passed after the validation-doc sync.

Gate M landed execution summary:

1. Created
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-m-airborne-building-prediction-input-contract.test.ts`.
2. Added
   `packages/engine/src/dynamic-airborne-gate-m-building-prediction-input-contract.ts`
   for the Gate M plan id, status id, scenario pack, runtime-boundary
   warning, and Gate N selection constants.
3. Shared airborne context now exposes source-room volume,
   flanking/junction class, conservative flanking assumption, junction
   coupling length, and building output basis as explicit
   building-prediction fields.
4. Route input topology now uses route family
   `building_prediction_airborne_context` and requires context mode,
   partition area, source-room volume, receiving-room volume/RT60,
   flanking/junction class, conservative flanking assumption, junction
   coupling length, and building output basis before building runtime can
   even be considered.
5. Complete physical owner sets select `candidate_dynamic_unsupported`
   with method
   `dynamic_calculator_building_prediction_runtime_owner_missing` until
   Gate N owns the ISO 12354-1 flanking/runtime adapter.
6. Partial owner sets remain `needs_input` with exact missing physical
   fields. Complete Gate I/J/K `field_between_rooms` values remain live
   and numeric-stable.
7. Next selected gate:
   `gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_plan`.
8. Validation completed on 2026-05-10: focused Gate M, Gate L
   continuity, Gate I/J/K continuity, Gate K route-input continuity,
   focused workbench building/field input surfaces, engine/web
   typechecks, final `pnpm calculator:gate:current`, and whitespace
   guard all passed. Final current-gate totals were engine 354 files /
   2050 tests, web 71 files / 306 passed + 18 skipped, repo build 5/5
   successful, and whitespace guard clean.

Gate L landed execution summary:

1. Created
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-l-airborne-building-prediction-boundary-contract.test.ts`.
2. Added
   `packages/engine/src/dynamic-airborne-gate-l-building-prediction-boundary.ts`
   to centralize the Gate L plan id, status, missing physical fields,
   and warning copy.
3. Dynamic route input topology now treats every airborne
   `building_prediction` request as a physical-input blocker until
   `flankingJunctionClass` and `conservativeFlankingAssumption` are
   explicit. This applies even when legacy `junctionQuality` is `good`,
   and also applies to lab-looking `Rw` / `STC` requests made under
   `building_prediction` context.
4. Calculator warnings suppress legacy building-context overlay warnings
   while the building route is parked, and instead expose the Gate L
   building-prediction boundary warning.
5. Workbench building-prediction field cards now show `Not ready` /
   `needs_input` with flanking/junction and conservative-assumption copy
   instead of showing Gate I field card posture or field budgets.
6. Complete `field_between_rooms` Gate I/J/K cases remain live and
   numeric-stable; lab element `Rw` / `STC` routes remain unaffected.
7. Next selected gate:
   `gate_m_personal_use_mvp_airborne_building_prediction_input_contract_plan`.
8. Validation completed on 2026-05-10: focused Gate L engine boundary
   contract, Gate L/K workbench coverage, targeted route-card
   regressions, Gate I/J/K/L engine continuity, Gate J/K/L web
   continuity, targeted legacy engine/web regressions, engine/web
   typechecks, final `pnpm calculator:gate:current`, and whitespace
   guard all passed. Final current-gate totals were engine 353 files /
   2044 tests, web 71 files / 306 passed + 18 skipped, repo build 5/5
   successful, and whitespace guard clean.

Gate K landed execution summary:

1. Created
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-k-airborne-field-context-input-surface-contract.test.ts`.
2. Added first-class web input-surface helper and acceptance coverage in
   `apps/web/features/workbench/airborne-field-context-input-surface.ts`
   and
   `apps/web/features/workbench/airborne-field-context-input-surface.test.ts`.
3. Dynamic Calculator wall field mode now exposes the Gate I/J physical
   inputs deliberately: `field_between_rooms`, panel width/height,
   receiving-room volume, receiving-room RT60, and optional
   airtightness. The wall field preset includes `DnT,w` / `DnT,A`.
4. Complete UI-derived lined massive/masonry, CLT/mass-timber, and
   grouped triple-leaf wall contexts feed the same Gate I runtime and
   Gate J surface values without numeric movement: lined stays
   `R'w 58 / DnT,w 59`, CLT stays `R'w 40 / DnT,w 41`, and grouped
   triple-leaf stays `R'w 50 / DnT,w 51`.
5. Partial UI fields now park with precise missing-input copy. Missing
   RT60 or room volume blocks visible field cards before legacy sidecar
   metrics can look live, and no Gate I field budget is shown.
6. Saved replay, scenario analysis, calculator API payload, Markdown
   report, and hostile edits preserve the explicit field context instead
   of silently falling back to lab `Rw` / `STC`.
7. Building-prediction/flanking remains out of scope and selected for
   Gate L:
   `gate_k_personal_use_mvp_airborne_field_context_input_surface_landed_selected_building_prediction_boundary_gate_l`.
8. Validation completed on 2026-05-10: focused Gate K engine/web packs,
   Gate I/J/K continuity, Gate J/K web surface continuity, engine/web
   typechecks, targeted field-output route-card regressions, final
   `pnpm calculator:gate:current`, and whitespace guard all passed. The
   final current-gate totals were engine 352 files / 2039 tests, web 70
   files / 303 passed + 18 skipped, repo build 5/5 successful, and
   whitespace guard clean.

Gate J landed execution summary:

1. Created
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-j-airborne-field-context-surface-parity-contract.test.ts`.
2. Added web surface parity in
   `apps/web/features/workbench/airborne-field-context-surface.ts` and
   `apps/web/features/workbench/airborne-field-context-surface-parity.test.ts`.
3. Cards, validation posture, field provenance, corridor/method
   dossiers, saved replay, Markdown report text, and calculator API
   payloads now expose
   `candidate_airborne_field_context_family_physics_prediction`,
   `gate_i_airborne_field_apparent_context_adapter_runtime`, the Gate I
   warning, actual `airborneBasis.errorBudgetDb`, and "not measured field
   evidence" wording.
4. No acoustic values moved: lined massive/masonry remains
   `R'w 58 / DnT,w 59`, CLT remains `R'w 40 / DnT,w 41`, and grouped
   triple-leaf remains `R'w 50 / DnT,w 51`.
5. Missing field context, building-prediction/flanking, lab `Rw` /
   `STC`, and exact-source precedence remain outside the Gate J surface
   claim.
6. Selected Gate K by ROI:
   `gate_j_personal_use_mvp_airborne_field_context_surface_parity_landed_selected_input_surface_gate_k`
   with target
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-k-airborne-field-context-input-surface-contract.test.ts`
   and action
   `gate_k_personal_use_mvp_airborne_field_context_input_surface_plan`.
7. Validation completed on 2026-05-10: focused Gate J engine contract
   passed 1 file / 4 tests; focused Gate J web surface parity passed 1
   file / 4 tests; Gate I/J engine continuity passed 2 files / 10 tests;
   web surface continuity passed 2 files / 8 tests; engine/web
   typechecks passed; final `pnpm calculator:gate:current` passed with
   engine 351 files / 2034 tests, web 69 files / 298 passed + 18
   skipped, repo build 5/5, and whitespace guard clean.

Gate I landed execution summary:

1. Created
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-i-airborne-field-context-continuation-contract.test.ts`
   and
   `packages/engine/src/dynamic-airborne-gate-i-airborne-field-context.ts`.
2. Promoted complete `field_between_rooms` requests for owned
   grouped triple-leaf, lined massive/masonry, and CLT/mass-timber wall
   families to
   `gate_i_airborne_field_apparent_context_adapter_runtime`.
3. Kept current field values numeric-stable: lined massive/masonry
   stays `R'w 58 / DnT,w 59`, CLT/mass-timber stays
   `R'w 40 / DnT,w 41`, and grouped triple-leaf stays
   `R'w 50 / DnT,w 51`.
4. Required explicit field context before promotion: context mode,
   partition area or panel width/height, receiving-room volume, and
   receiving-room RT60.
5. Kept missing physical context as `needs_input`, kept
   building-prediction/flanking outside this lane, and kept exact field
   rows first.
6. Selected Gate J by ROI:
   `gate_i_personal_use_mvp_airborne_field_context_continuation_landed_selected_field_surface_parity_gate_j`.
7. Validation completed on 2026-05-10: focused Gate I passed 1 file /
   6 tests, Gate G/H/I plus Gate O/P continuity passed 5 files / 30
   tests, engine typecheck passed, final `pnpm calculator:gate:current`
   passed with engine 350 files / 2030 tests, web 68 files / 294 passed
   + 18 skipped, repo build 5/5, and whitespace guard clean.

Gate H landed execution summary:

1. Created
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts`
   and `packages/engine/src/dynamic-airborne-gate-h-lined-masonry-clt.ts`.
2. Promoted complete source-absent lab lined massive/masonry wall from
   `screening_fallback` to
   `gate_h_lined_massive_wall_cavity_aware_family_physics_runtime`
   without retuning its current `Rw 60 / STC 60` pin.
3. Promoted complete source-absent lab CLT/mass-timber wall from
   `screening_fallback` to
   `gate_h_clt_mass_timber_wall_single_leaf_family_physics_runtime`
   without retuning its current `Rw 42 / STC 42` pin; `Ctr` remains
   unsupported until a metric owner lands.
4. Added explicit `lined_massive_wall` and `mass_timber_panel`
   topology modes plus route-input contracts so partial user intent
   returns `needs_input` with physical fields instead of a guessed
   high-confidence result.
5. Preserved ordinary single leaf, double/framed, grouped triple-leaf,
   field-output, and exact-source precedence boundaries.
6. Selected Gate I by ROI:
   `gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_landed_selected_airborne_field_context_gate_i`.

Gate I execution order:

1. Create
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-i-airborne-field-context-continuation-contract.test.ts`.
2. Start from existing lab family-physics routes that now have owned
   bases: Gate O single/massive panels, Gate S double/framed,
   Gate G grouped triple-leaf, and Gate H lined massive/CLT.
3. Add field/apparent positive cases only when `contextMode`,
   partition area, receiving-room volume, and RT60 are present.
4. Assert missing field context remains `needs_input` with exact missing
   fields.
5. Keep building-prediction and flanking outputs blocked until
   junction/flanking ownership exists.
6. Keep exact source rows first and keep lab/field/building basis labels
   separate in candidate resolution, output support, cards/API/report,
   and warnings.
7. Validate with focused Gate I, Gate G/H continuity, field-context
   regressions, engine typecheck, relevant web/API parity if visible
   behavior changes, `pnpm calculator:gate:current`, and
   `git diff --check`.

Gate G landed execution summary:

1. Created
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-g-generalized-wall-multicavity-route-readiness-contract.test.ts`
   to document the existing engine pieces: flat-list multileaf guard,
   grouped triple-leaf topology readiness, and the current grouped
   Rockwool two-cavity solver corridor.
2. Tested the ten required route-readiness cases: complete grouped 50/50
   mineral-wool triple leaf, complete grouped non-50/50
   construction-image topology, unequal cavity depths, safe reorder,
   flat-list ambiguity, partial grouped topology, duplicate/overlapping
   grouped layer indices, lined massive/masonry and CLT wall negatives,
   field/apparent output boundary, and exact-source precedence.
3. Preserved current grouped mineral-wool numeric pins: `Rw 50 /
   STC 55` for the 50/50 case and `Rw 55 / STC 56` for the non-50/50
   construction-image case.
4. Added a small wall-topology readiness helper for duplicate,
   overlapping, and out-of-range grouped layer indices rather than
   spreading more logic through `dynamic-airborne.ts`.
5. Kept all incomplete or physically impossible multi-cavity inputs on
   `needs_input` with exact missing fields. The engine does not infer
   internal leaf, cavity ownership, fill, absorption, coupling, or
   support topology from a flat layer list.
6. Selected Gate H by ROI:
   `gate_g_personal_use_mvp_generalized_wall_multicavity_route_readiness_landed_selected_lined_masonry_clt_wall_gate_h`.

Consumed Gate H execution order:

1. Create
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts`.
2. Start from the Gate A rows `wall.lined_massive_masonry.lab` and
   `wall.clt_mass_timber.lab`, then add nearby negatives for ordinary
   single leaf, double/framed, grouped triple leaf, and field outputs.
3. Re-read the existing lined-massive, masonry, CLT/mass-timber, Sharp,
   Davy/Cremer, and single-leaf panel code before choosing runtime
   movement.
4. Keep `Rw`/`STC` and lab/field/building bases separate. No `R'w` or
   `DnT,w` result may be promoted without field context.
5. Prefer a narrow family-physics improvement with explicit error budget
   over broad source crawling. Use source rows only as exact overrides,
   anchors, holdouts, or named calibration evidence.
6. If runtime changes, pin values, basis/origin, support bucket,
   candidate rejections, warnings, workbench card/API/report parity, and
   hostile layer-edit behavior in the same gate.
7. Validate with focused Gate H, Gate A/G continuity, engine typecheck,
   relevant web parity if visible behavior changes, and
   `git diff --check`; run `pnpm calculator:gate:current` for closeout.

## Active Decision Map - 2026-05-10 Model-First Physics Prediction Pivot Coverage Sprint Gate J Landed / Gate K Next

Current implementation position:
`calculator_model_first_physics_prediction_pivot_v1`.

Selected by:

`docs/calculator/CHECKPOINT_2026-05-05_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_REPLAN_HANDOFF.md`

Latest doc/implementation reconciliation:

`docs/calculator/CHECKPOINT_2026-05-05_DOC_IMPLEMENTATION_RECONCILIATION_HANDOFF.md`

Latest standards research / plan detail:

`docs/calculator/CHECKPOINT_2026-05-05_STANDARDS_RESEARCH_PLAN_DETAIL_HANDOFF.md`

Latest milestone research / execution breakdown:

`docs/calculator/CHECKPOINT_2026-05-05_MODEL_FIRST_MILESTONE_RESEARCH_HANDOFF.md`

Latest benchmark / acceptance refinement:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_BENCHMARK_ACCEPTANCE_HANDOFF.md`

Latest landed Gate U checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_U_HANDOFF.md`

Latest Gate U revalidation / commit-prep checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_U_REVALIDATION_AND_COMMIT_HANDOFF.md`

Latest landed Gate AA checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AA_HANDOFF.md`

Latest landed Gate AB checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AB_HANDOFF.md`

Latest landed Gate AC checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AC_HANDOFF.md`

Latest landed Gate AD checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AD_HANDOFF.md`

Latest landed Gate AE checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AE_HANDOFF.md`

Latest Gate AE broad revalidation / Gate AF planning checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_GATE_AE_REVALIDATION_GATE_AF_PLAN_HANDOFF.md`

Latest landed Gate AF checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AF_HANDOFF.md`

Latest landed Gate AG checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AG_HANDOFF.md`

Latest landed Gate AH checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AH_HANDOFF.md`

Latest landed Gate AI checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AI_HANDOFF.md`

Latest landed Gate AJ checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AJ_HANDOFF.md`

Latest landed Gate AK checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AK_HANDOFF.md`

Latest Gate AK report export/manual-edit revalidation checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_GATE_AK_REPORT_EXPORT_REVALIDATION_AND_PUSH_HANDOFF.md`

Latest broad revalidation / Gate AL handoff checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_BROAD_REVALIDATION_GATE_AK_TO_GATE_AL_HANDOFF.md`

Latest landed Gate AL checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AL_HANDOFF.md`

Latest landed Gate AM checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AM_HANDOFF.md`

Latest landed Gate AN checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AN_HANDOFF.md`

Latest landed Gate AO checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AO_HANDOFF.md`

Latest landed Gate AP checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AP_HANDOFF.md`

Latest Gate AP report export/manual-edit revalidation checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_GATE_AP_REPORT_EXPORT_REVALIDATION_AND_PUSH_HANDOFF.md`

Latest landed Gate AQ checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AQ_HANDOFF.md`

Latest landed Gate AR checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AR_HANDOFF.md`

Latest landed Gate AS checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AS_HANDOFF.md`

Latest landed Gate AT checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AT_HANDOFF.md`

Latest landed Gate AU checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AU_HANDOFF.md`

Latest landed Gate AV checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AV_HANDOFF.md`

Latest landed Gate AW checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AW_HANDOFF.md`

Latest landed Gate AX checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AX_HANDOFF.md`

Latest landed Gate AY checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AY_HANDOFF.md`

Latest landed Gate AZ checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AZ_HANDOFF.md`

Latest landed Gate BA checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BA_HANDOFF.md`

Latest landed Gate BB checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BB_HANDOFF.md`

Latest landed Gate BC checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BC_HANDOFF.md`

Latest landed Gate BD checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BD_HANDOFF.md`

Latest landed Gate BE checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BE_HANDOFF.md`

Latest landed Gate BF checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BF_HANDOFF.md`

Latest landed Gate BG checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BG_HANDOFF.md`

Latest landed Gate BH checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BH_HANDOFF.md`

Latest landed Gate BI checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_BI_HANDOFF.md`

Latest Personal-Use MVP Coverage Sprint Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_A_HANDOFF.md`

Latest Personal-Use MVP Coverage Sprint Gate B checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_B_HANDOFF.md`

Latest Personal-Use MVP Coverage Sprint Gate C checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_C_HANDOFF.md`

Latest Personal-Use MVP Coverage Sprint Gate D checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_D_HANDOFF.md`

Latest Personal-Use MVP Coverage Sprint Gate E checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_E_HANDOFF.md`

Latest Personal-Use MVP Coverage Sprint Gate F checkpoint:

`docs/calculator/CHECKPOINT_2026-05-08_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_F_HANDOFF.md`

Latest Personal-Use MVP Coverage Sprint Gate G checkpoint:

`docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_G_HANDOFF.md`

Latest Personal-Use MVP Coverage Sprint Gate H checkpoint:

`docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_H_HANDOFF.md`

Latest strategic ROI replan:

`docs/calculator/CHECKPOINT_2026-05-08_STRATEGIC_ROI_REPLAN_HANDOFF.md`

Latest strategic ROI revalidation:

`docs/calculator/CHECKPOINT_2026-05-10_STRATEGIC_ROI_REVALIDATION_AND_GATE_G_PLAN_HANDOFF.md`

Current selection status:

`gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_landed_selected_airborne_field_context_gate_i`

Gate H landed file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts`

Gate H landed action:

`gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_plan`

Gate H selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-i-airborne-field-context-continuation-contract.test.ts`

Gate H selected next action:

`gate_i_personal_use_mvp_airborne_field_context_continuation_plan`

Gate H result after ROI revalidation:

- done. Gate H landed lined massive/masonry and CLT wall lab
  family-physics origin promotion without numeric retuning;
- complete lined massive/masonry stays on the cavity-aware dynamic
  delegate at `Rw 60 / STC 60`, now with
  `family_physics_prediction` basis and uncalibrated error budget;
- complete CLT/mass-timber stays on the timber-panel delegate at
  `Rw 42 / STC 42`, now with `family_physics_prediction` basis and
  visible CLT simplification warning;
- explicit partial lined or mass-timber user intent fails closed with
  precise `needs_input` prompts instead of solver promotion;
- ordinary single leaf, double/framed, and grouped triple-leaf routes
  stay outside the Gate H candidate ids;
- field/apparent outputs and exact-source precedence stay
  basis-explicit;
- Gate I is selected from the coverage matrix for airborne field-context
  continuation.

Previous Gate G validation result:

Validation completed on 2026-05-10: focused Gate G engine contract
passed 1 file / 8 tests; Gate E/G doc-alignment continuity passed 2
files / 12 tests; Gate A/F/G coverage continuity plus route-input
topology and grouped Rockwool regressions passed 5 files / 33 tests;
engine typecheck passed; final `pnpm calculator:gate:current` passed
with engine 348 files / 2017 tests, web 68 files / 294 passed + 18
skipped, repo build 5/5, and whitespace guard clean. Known non-fatal
warnings remain the existing Zustand unavailable test-storage warnings
and optional `sharp/@img` package resolution warnings during the Next
build.

Gate E landed file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-e-timber-clt-floor-impact-delta-lw-surface-parity-contract.test.ts`

Gate E landed action:

`gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_plan`

Gate E selected next file, now landed by Gate F:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-f-timber-clt-floor-impact-delta-lw-input-surface-contract.test.ts`

Gate E selected next action, now landed by Gate F:

`gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_plan`

Gate E result after ROI replan:

- done. Gate E landed visible/API/report parity for the timber/CLT
  floor-impact `DeltaLw` runtime formula corridor;
- timber exact `Ln,w 51` stays exact while timber `DeltaLw 25.2` is
  shown as the source-absent timber joist formula corridor;
- CLT family `Ln,w 50` stays family-estimated while CLT `DeltaLw 22.6`
  is shown as the source-absent mass-timber CLT formula corridor;
- `DeltaLw` owns its own visible metric basis:
  `predictor_timber_joist_delta_lw_formula_corridor_estimate` or
  `predictor_mass_timber_clt_delta_lw_formula_corridor_estimate`;
- output cards, output posture, metric-basis copy, corridor/method
  dossiers, dynamic trace panel, Markdown report, calculator API, and
  impact-only API carry the same `+/-7.5 dB`
  `source_absent_formula_error_budget` and not-measured-evidence copy;
- missing physical inputs, `Ln,w`-only, ASTM `IIC` / `AIIC`, field
  `L'n,w` / `L'nT,w`, building-prediction basis, steel floors, and
  exact-source precedence remain blocked from timber/CLT `DeltaLw`
  aliasing or promotion;
- Gate F is selected to expose the same timber/CLT physical fields in
  the first-class Dynamic Calculator input surface and snapshot bridge.

Gate E validation result:

Validation completed on 2026-05-08: focused Gate E engine contract
passed 1 file / 4 tests, focused Gate E web surface/API contract passed
1 file / 4 tests, Gate D/E continuity passed 2 files / 11 tests,
Gate BI/A/B/C/D/E continuity passed 6 files / 40 tests, web
steel/timber parity continuity passed 3 files / 7 tests, engine
typecheck passed, and final `pnpm calculator:gate:current` passed with
engine 346 files / 2005 tests, web 67 files / 290 passed + 18 skipped,
repo build 5/5 successful, and whitespace guard clean.
`git diff --check` passed after the validation-result doc updates.
Known non-fatal
warnings remain the existing Zustand unavailable test-storage warnings
and optional `sharp/@img` package resolution warnings during the Next
build.

Gate C landed file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-c-timber-clt-floor-impact-delta-lw-formula-corridor-contract.test.ts`

Gate C landed action:

`gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan`

Gate C selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-d-timber-clt-floor-impact-delta-lw-runtime-corridor-contract.test.ts`

Gate C selected next action:

`gate_d_personal_use_mvp_timber_clt_floor_impact_delta_lw_runtime_corridor_plan`

Gate B landed file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts`

Gate B landed action:

`gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan`

Gate B selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-c-timber-clt-floor-impact-delta-lw-formula-corridor-contract.test.ts`

Gate B selected next action:

`gate_c_personal_use_mvp_timber_clt_floor_impact_delta_lw_formula_corridor_plan`

Gate B result after ROI replan:

- done. Gate B landed the timber/CLT floor-impact `DeltaLw` input and
  formula-readiness contract without runtime value movement;
- required physical inputs are `baseSlabOrFloor`,
  `toppingOrFloatingLayer`, `resilientLayerDynamicStiffnessMNm3`,
  `loadBasisKgM2`, and `ceilingOrLowerAssembly`;
- complete timber joist and CLT/mass-timber predictor inputs are ready
  for a formula corridor, while current runtime stays at timber exact
  `Ln,w 51` and CLT family `Ln,w 50` with `DeltaLw` unsupported;
- missing dynamic stiffness, load basis, topping/floating mass, and
  lower assembly are targeted `needs_input` negatives with prompts;
- ASTM `IIC` / `AIIC`, field `L'n,w` / `L'nT,w`, steel floors, and
  exact `Ln,w` source precedence remain blocked from lab `DeltaLw`
  aliasing or promotion;
- Gate C is selected to design the first timber/CLT `DeltaLw` formula
  corridor, tolerance/error-budget posture, and runtime promotion rules.

Gate B validation result:

Focused Gate B validation completed on 2026-05-08: Gate B passed 1 file
/ 8 tests, focused Gate A/Gate B continuity passed 2 files / 15 tests,
focused Gate BI/Gate A/Gate B continuity passed 3 files / 22 tests,
engine typecheck passed, and full `pnpm calculator:gate:current` passed
with engine 343 files / 1987 tests, web 66 files / 286 passed + 18
skipped, repo build 5/5 successful, and whitespace guard clean.

Gate A landed file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts`

Gate A landed action:

`gate_a_personal_use_mvp_coverage_matrix_plan`

Gate A selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts`

Gate A selected next action:

`gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan`

Gate A result after ROI replan:

- done. Gate A landed the executable 24-row wall/floor scenario matrix
  for the Personal-Use MVP Coverage Sprint;
- rows route through `calculateAssembly`, `calculateImpactOnly`,
  `buildDynamicCalculatorRouteInputTopologyAssessment`, and
  `buildSteelFloorFormulaPredictorInputFromSurface`;
- numeric rows pin current values, basis, origin, and tolerance/error
  budget; blocked rows pin missing fields or unsupported metric basis;
- field, lab, building-prediction, ISO, and ASTM bases remain separate;
- hostile duplicate steel carriers, ambiguous multi-cavity walls, many
  layers, and invalid thickness boundaries are represented explicitly;
- Gate B is selected from the matrix as the timber/CLT floor-impact
  `DeltaLw` input and physics contract lane.

Gate A validation result:

Focused Gate A validation completed on 2026-05-08: Gate A passed 1 file
/ 7 tests, focused Gate BI/Gate A continuity passed 2 files / 14 tests,
engine typecheck passed, and full `pnpm calculator:gate:current` passed
with engine 342 files / 1979 tests, web 66 files / 286 passed + 18
skipped, repo build 5/5 successful, and whitespace guard clean.

Gate BI landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bi-steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance-contract.test.ts`

Gate BI landed action:

`gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan`

Gate BI selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts`

Gate BI selected next action:

`gate_a_personal_use_mvp_coverage_matrix_plan`

Gate BH selection status:

`gate_bh_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_landed_no_runtime_selected_tighten_candidate_governance_gate_bi`

Gate BH landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bh-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation-contract.test.ts`

Gate BH landed action:

`gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan`

Gate BH selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bi-steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance-contract.test.ts`

Gate BH selected next action:

`gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan`

Gate BI implementation scope after ROI replan:

- done. Gate BI landed a no-runtime governance contract for the Gate BH
  `tighten` candidate;
- `tighten` remains a proposal label only until a later explicit runtime
  gate owns independent residual packets, topology diversity,
  rights/citation posture, exact-source boundaries, basis owners,
  tolerance-delta proposal, and card/report/API parity;
- steel-floor runtime values and tolerances remain frozen;
- the Personal-Use MVP Coverage Sprint is now the selected next lane.

Selected post-Gate-BI lane:

`personal_use_mvp_coverage_sprint_after_gate_bi`

Selected post-Gate-BI first file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts`

Selected post-Gate-BI first action:

`gate_a_personal_use_mvp_coverage_matrix_plan`

Gate BH result:

- Gate BH uses Gate BG's selected
  `residual_policy_closed_owner_revalidation` lane as input;
- Gate BD, Gate BE, Gate BF, and Gate BG closure evidence is preserved
  as evidence-only owner-map closure, not runtime evidence;
- the closed map reaches three same-stack ISO `DeltaLw` residual cases,
  four paired negative boundaries, source-owned open-web formula inputs,
  and separate field/building basis owners;
- the closed-owner residual-policy revalidation classifies the current
  policy-only evidence as `tighten`, with `max 0.6 dB` and `mean 0.6
  dB`, but `tighten` is only a later-gate candidate;
- no closure row can move runtime values, tighten tolerance, retune the
  formula, promote an exact row, ingest source text/documents, or alias
  lab values to field/building metrics;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate;
- tighten-candidate governance is selected as Gate BI before any
  corridor movement can be considered.

Gate BH validation result:

Focused Gate BH validation completed on 2026-05-08. Gate BH passed 1
file / 8 tests, focused Gate BG/BH continuity passed 2 files / 17
tests, focused Gate BD/BE/BF/BG/BH closure continuity passed 5 files /
45 tests, Gate AE doc breadcrumb regression passed 1 file / 4 tests,
engine typecheck passed, engine DTS build passed, and full `pnpm
calculator:gate:current` passed with engine 340 files / 1965 tests, web
66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Known warnings were the existing Zustand
unavailable test-storage warnings and optional sharp package resolution
warnings during web build. Broad `pnpm check` was not rerun because Gate
BH has no runtime/API/UI surface change.

Gate BG selection status:

`gate_bg_same_stack_iso_delta_lw_field_building_basis_owner_closure_landed_no_runtime_selected_residual_policy_revalidation_gate_bh`

Gate BG landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bg-steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure-contract.test.ts`

Gate BG landed action:

`gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan`

Gate BG selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bh-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation-contract.test.ts`

Gate BG selected next action:

`gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan`

Gate BG result:

- Gate BG uses Gate BF's selected field/building basis owner closure
  lane as input;
- field apparent impact owner packets must own `L'n,w` / `L'nT,w`
  context, and building-prediction owner packets must own separate
  building-prediction context;
- both require receiving room geometry/volume, separating element area,
  junction/flanking context, reverberation/normalization basis, and
  rights-safe locator or project-context metadata;
- complete future field/building basis packets close the blocker only as
  residual-policy readiness evidence;
- missing owner fields, missing context values, missing locator/project
  metadata, wrong basis, lab-corridor alias attempts, wrong metric
  family, product/inferred claims, and rights-blocked packets remain
  rejected;
- exact-source promotion, formula retune, tolerance tightening/widening,
  source text/document ingestion, field/building alias, and runtime
  movement remain blocked;
- residual policy closed-owner revalidation is selected as Gate BH
  because all ranked blocker-closure lanes can now be represented as
  closed in the owner map.

Gate BG validation result:

Focused Gate BG validation completed on 2026-05-08. Gate BG passed 1
file / 9 tests, focused Gate BF/BG continuity passed 2 files / 18 tests,
engine typecheck passed, engine DTS build passed, and full `pnpm
calculator:gate:current` passed with engine 339 files / 1957 tests, web
66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Known warnings were the existing Zustand
unavailable test-storage warnings and optional sharp package resolution
warnings during web build. Broad `pnpm check` was not rerun because Gate
BG has no runtime/API/UI surface change.

Gate BF selection status:

`gate_bf_same_stack_iso_delta_lw_open_web_input_ownership_closure_landed_no_runtime_selected_field_building_basis_owner_gate_bg`

Gate BF landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bf-steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure-contract.test.ts`

Gate BF landed action:

`gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan`

Gate BF selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bg-steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure-contract.test.ts`

Gate BF selected next action:

`gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan`

Gate BF result:

- Gate BF uses Gate BE's selected open-web input ownership closure lane
  as input;
- one source-owned open-web formula input packet must own support form,
  carrier depth, carrier spacing, load basis, dynamic stiffness, lower
  support class, upper resilient topology, and rights-safe locator
  metadata;
- complete future open-web input packets can close the ownership
  blocker only as residual-policy readiness evidence;
- missing owner fields, missing physical input values, missing locator
  metadata, wrong basis, wrong support form, product/inferred claims,
  rights-blocked packets, and missing upper topology remain rejected;
- exact-source promotion, formula retune, tolerance tightening/widening,
  source text/document ingestion, field/building alias, and runtime
  movement remain blocked;
- field/building basis owner closure is selected as Gate BG because the
  Gate BB/BC blocker map still has field/building basis owners missing.

Gate BF validation result:

Focused Gate BF validation completed on 2026-05-08. Gate BF passed 1 file
/ 9 tests, focused Gate BE/BF continuity passed 2 files / 19 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 338 files / 1948 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate BF
has no runtime/API/UI surface change.

Gate BE selection status:

`gate_be_same_stack_iso_delta_lw_paired_negative_closure_landed_no_runtime_selected_open_web_input_ownership_gate_bf`

Gate BE landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-be-steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure-contract.test.ts`

Gate BE landed action:

`gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan`

Gate BE selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bf-steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure-contract.test.ts`

Gate BE selected next action:

`gate_bf_steel_floor_formula_same_stack_iso_delta_lw_open_web_input_ownership_closure_plan`

Gate BE result:

- Gate BE uses Gate BD's selected paired-negative closure lane as input;
- three additional paired negatives must own the target metric family,
  ISO lab basis, explicit wrong-support or wrong-reference boundary,
  boundary identity, same-stack steel exclusion reason, not-holdout
  scope, and rights-safe locator metadata;
- complete future wrong-support and wrong-reference boundary packets can
  close the three-boundary shortfall only as residual-policy readiness
  evidence;
- missing owner fields, missing locator metadata, wrong basis/metric
  family, product/inferred values, rights-blocked packets, non-explicit
  boundaries, and same-stack steel non-boundaries remain rejected;
- exact-source promotion, formula retune, tolerance tightening/widening,
  source text/document ingestion, field/building alias, and runtime
  movement remain blocked;
- open-web formula input ownership closure is selected as Gate BF because
  the Gate BB/BC blocker map still has source-owned open-web formula
  input ownership missing.

Gate BE validation result:

Focused Gate BE validation completed on 2026-05-08. Gate BE passed 1 file
/ 10 tests, focused Gate BD/BE continuity passed 2 files / 19 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 337 files / 1939 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate BE
has no runtime/API/UI surface change.

Gate BD selection status:

`gate_bd_same_stack_iso_delta_lw_holdout_closure_landed_no_runtime_selected_paired_negative_closure_gate_be`

Gate BD landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bd-steel-floor-formula-same-stack-iso-delta-lw-holdout-closure-contract.test.ts`

Gate BD landed action:

`gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan`

Gate BD selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-be-steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure-contract.test.ts`

Gate BD selected next action:

`gate_be_steel_floor_formula_same_stack_iso_delta_lw_paired_negative_closure_plan`

Gate BD result:

- Gate BD uses only Gate BC's selected source-owned same-stack ISO
  `DeltaLw` holdout-count lane as the holdout-closure input;
- two additional holdouts must own the measured `DeltaLw` value,
  same-stack steel reference, ISO lab basis, all Gate AT/AK owner
  fields, paired negative-boundary ownership, and rights-safe locator
  metadata;
- complete future holdout packets can close the two-holdout shortfall
  only as residual-readiness evidence;
- missing metric value, missing paired negative-boundary owner, missing
  locator metadata, wrong basis/reference, product/inferred values, and
  rights-blocked packets remain rejected;
- exact-source promotion, formula retune, tolerance tightening/widening,
  source text/document ingestion, field/building alias, and runtime
  movement remain blocked;
- paired negative-boundary closure is selected as Gate BE because the
  Gate BB/BC blocker map still has a paired-negative shortfall of 3.

Gate BD validation result:

Focused Gate BD validation completed on 2026-05-08. Gate BD passed 1 file
/ 9 tests, focused Gate BC/BD continuity passed 2 files / 17 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 336 files / 1929 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate BD
has no runtime/API/UI surface change.

Gate BC selection status:

`gate_bc_same_stack_iso_delta_lw_residual_blocker_closure_landed_no_runtime_selected_holdout_closure_gate_bd`

Gate BC landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bc-steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure-contract.test.ts`

Gate BC landed action:

`gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan`

Gate BC selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bd-steel-floor-formula-same-stack-iso-delta-lw-holdout-closure-contract.test.ts`

Gate BC selected next action:

`gate_bd_steel_floor_formula_same_stack_iso_delta_lw_holdout_closure_plan`

Gate BC result:

- Gate BC ranks only Gate BB accepted policy-decision rows for residual
  blocker closure;
- current blocked policy rows and rejected probes remain blocked before
  closure ranking;
- the source-owned same-stack ISO lab `DeltaLw` holdout-count lane is
  selected as the next narrow closure lane because it directly improves
  residual case-count readiness and has a shortfall of 2;
- paired negative-boundary closure, source-owned open-web formula input
  ownership, and field/building basis owner closure remain ranked
  follow-up lanes;
- broad source crawl, source text/document ingestion, exact-source
  promotion, tolerance tightening/widening, formula retune, and runtime
  movement remain blocked;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate;
- Gate BD is selected as the holdout-count closure gate, not broad
  source crawl or formula retune.

Gate BC validation result:

Focused Gate BC validation completed on 2026-05-08. Gate BC passed 1 file
/ 8 tests, focused Gate BB/BC continuity passed 2 files / 16 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 335 files / 1920 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Known warnings were the existing Zustand
unavailable test-storage warnings and optional sharp package resolution
warnings during web build. Broad `pnpm check` was not rerun because Gate
BC has no runtime/API/UI surface change.

Gate BB selection status:

`gate_bb_same_stack_iso_delta_lw_residual_policy_decision_landed_no_runtime_selected_blocker_closure_gate_bc`

Gate BB landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bb-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision-contract.test.ts`

Gate BB landed action:

`gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan`

Gate BB selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bc-steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure-contract.test.ts`

Gate BB selected next action:

`gate_bc_steel_floor_formula_same_stack_iso_delta_lw_residual_blocker_closure_plan`

Gate BB result:

- Gate BB uses only Gate BA residual-admitted rows as residual-policy
  decision inputs;
- current blocked rows and rejected probes stay blocked before policy
  decision;
- the admitted future same-stack ISO lab `DeltaLw` row is classified as
  `hold_current_corridor_policy_decision`;
- blocker closure requirements remain explicit: 2 more source-owned
  `DeltaLw` holdouts, 3 more paired negative boundaries, source-owned
  open-web formula inputs, and field/building basis owners are required
  before any retune/tighten/widen path can be selected;
- future `retune_candidate`, `tighten`, or `widen` policy labels are
  later-gate signals only, not runtime or tolerance movement;
- source text and source documents are not copied or ingested, measured
  metric values are not ingested for runtime, runtime values remain
  `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain `+/-4.5 dB` /
  `+/-2.0 dB`, exact-source precedence is unchanged, and lab/field/
  building bases remain separate;
- Gate BC is selected as the residual blocker-closure gate, not formula
  retune or exact-source promotion.

Gate BB validation result:

Focused Gate BB validation completed on 2026-05-08. Gate BB passed 1 file
/ 8 tests, focused Gate BA/BB continuity passed 2 files / 16 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 334 files / 1912 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Known warnings were the existing Zustand
unavailable test-storage warnings and optional sharp package resolution
warnings during web build. Broad `pnpm check` was not rerun because Gate
BB has no runtime/API/UI surface change.

Gate BA selection status:

`gate_ba_same_stack_iso_delta_lw_residual_admission_boundary_landed_no_runtime_selected_residual_policy_decision_gate_bb`

Gate BA landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ba-steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary-contract.test.ts`

Gate BA landed action:

`gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan`

Gate BA selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bb-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision-contract.test.ts`

Gate BA selected next action:

`gate_bb_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_decision_plan`

Gate BA result:

- Gate BA admits only Gate AZ accepted calibration evidence candidates
  into same-stack ISO lab `DeltaLw` residual-policy evaluation;
- current request-status rows, rejected Gate AY probes, and blocked Gate
  AZ candidates remain blocked;
- residual admission requires source-owned measured `DeltaLw`,
  same-stack steel reference, ISO lab basis, all Gate AT/AK owner
  fields, paired negative-boundary ownership, and rights-safe
  citation/locator metadata;
- the accepted future same-stack ISO `DeltaLw` candidate enters residual
  evaluation, but its residual policy remains `hold` because the
  holdout-count, paired-negative-boundary, open-web-input, and
  field/building owner thresholds are still incomplete;
- residual admission is not exact-source promotion, field/building
  aliasing, tolerance tightening/widening, formula retune, or runtime
  movement;
- source text and source documents are not copied or ingested, measured
  metric values are not ingested for runtime, runtime values remain
  `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain `+/-4.5 dB` /
  `+/-2.0 dB`, exact-source precedence is unchanged, and lab/field/
  building bases remain separate;
- Gate BB is selected as the residual-policy decision gate, not
  exact-source promotion or formula retune.

Gate BA validation result:

Focused Gate BA validation completed on 2026-05-08. Gate BA passed 1 file
/ 8 tests, focused Gate AZ/BA continuity passed 2 files / 16 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 333 files / 1904 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Known warnings were the existing Zustand
unavailable test-storage warnings and optional sharp package resolution
warnings during web build. Broad `pnpm check` was not rerun because Gate
BA has no runtime/API/UI surface change.

Gate AZ selection status:

`gate_az_same_stack_iso_delta_lw_packet_calibration_candidate_landed_no_runtime_selected_residual_admission_boundary_gate_ba`

Gate AZ landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-az-steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate-contract.test.ts`

Gate AZ landed action:

`gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan`

Gate AZ selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ba-steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary-contract.test.ts`

Gate AZ selected next action:

`gate_ba_steel_floor_formula_same_stack_iso_delta_lw_residual_admission_boundary_plan`

Gate AZ result:

- Gate AZ uses Gate AY accepted packet boundary rows as the only
  calibration candidate source;
- current request-status rows remain blocked because no current
  source-owned packet has left request status;
- rejected Gate AY probes remain blocked before calibration candidate
  use;
- the accepted future same-stack ISO lab `DeltaLw` packet boundary probe
  can become a calibration evidence candidate only when rights-safe
  citation/locator metadata is preserved;
- calibration candidates are not residual-policy admissions, exact rows,
  retune inputs, tolerance changes, field/building aliases, or runtime
  movement;
- source text and source documents are not copied or ingested, measured
  metric values are not ingested for runtime, runtime values remain
  `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain `+/-4.5 dB` /
  `+/-2.0 dB`, exact-source precedence is unchanged, and lab/field/
  building bases remain separate;
- Gate BA is selected as the residual admission boundary gate, not
  exact-source promotion or formula retune.

Gate AZ validation result:

Focused Gate AZ validation completed on 2026-05-08. Gate AZ passed 1 file
/ 8 tests, focused Gate AY/AZ continuity passed 2 files / 16 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 332 files / 1896 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Known warnings were the existing Zustand
unavailable test-storage warnings and optional sharp package resolution
warnings during web build. Broad `pnpm check` was not rerun because Gate
AZ has no runtime/API/UI surface change.

Prior Gate AY selection status:

`gate_ay_same_stack_iso_delta_lw_packet_acceptance_boundary_landed_no_runtime_selected_packet_calibration_candidate_gate_az`

Gate AY landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ay-steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary-contract.test.ts`

Gate AY landed action:

`gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan`

Gate AY selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-az-steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate-contract.test.ts`

Gate AY selected next action:

`gate_az_steel_floor_formula_same_stack_iso_delta_lw_packet_calibration_candidate_plan`

Gate AY result:

- Gate AY uses only Gate AX request-ledger rows as current packet
  acceptance boundary rows;
- current request-ledger entries remain in request status until a
  source-owned packet exists;
- a complete future same-stack ISO lab `DeltaLw` packet boundary probe
  can leave request status only when measured `DeltaLw`, same-stack
  steel reference, ISO 10140 / 717-2 lab basis, all Gate AT/AK owner
  fields, and paired negative-boundary ownership are source-owned;
- wrong-basis, wrong-reference, product/inferred, rights-blocked,
  missing-owner, and blocked-ledger probes remain rejected;
- accepted boundary packets are not calibration evidence yet, not exact
  overrides, not retune input, and not field/building aliases;
- source text and source documents are not copied or ingested, measured
  metric values are not ingested for runtime, runtime values remain
  `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain `+/-4.5 dB` /
  `+/-2.0 dB`, exact-source precedence is unchanged, and lab/field/
  building bases remain separate;
- Gate AZ is selected as the packet calibration-candidate boundary gate,
  not calibration residual admission, exact-source promotion, or formula
  retune.

Gate AY validation result:

Focused Gate AY validation completed on 2026-05-08. Gate AY passed 1 file
/ 8 tests, focused Gate AX/AY continuity passed 2 files / 15 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 331 files / 1888 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Known warnings were the existing Zustand
unavailable test-storage warnings and optional sharp package resolution
warnings during web build. Broad `pnpm check` was not rerun because Gate
AY has no runtime/API/UI surface change.

Prior Gate AX selection status:

`gate_ax_same_stack_iso_delta_lw_packet_request_ledger_landed_no_runtime_selected_packet_acceptance_boundary_gate_ay`

Gate AX landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ax-steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger-contract.test.ts`

Gate AX landed action:

`gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan`

Gate AX selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ay-steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary-contract.test.ts`

Gate AX selected next action:

`gate_ay_steel_floor_formula_same_stack_iso_delta_lw_packet_acceptance_boundary_plan`

Gate AX result:

- Gate AX uses only Gate AW ready packet request rows as rights-safe
  request-ledger entries;
- blocked readiness rows remain blocked from the request ledger;
- request-ledger entries preserve locator-only metadata and the Gate
  AT/AK source-owned owner-field checklist;
- request-ledger entries are not source packets, measured rows,
  calibration evidence, exact overrides, or retune evidence;
- source documents, source text, and measured metric values are not
  copied or ingested;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate;
- Gate AY is selected as the packet acceptance boundary gate, not a
  broad source crawl, source-text ingestion, calibration admission, or
  formula retune.

Gate AX validation result:

Focused Gate AX validation completed on 2026-05-08. Gate AX passed 1 file
/ 7 tests, focused Gate AW/AX continuity passed 2 files / 14 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 330 files / 1880 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Known warnings were the existing Zustand
unavailable test-storage warnings and optional sharp package resolution
warnings during web build. Broad `pnpm check` was not rerun because Gate
AX has no runtime/API/UI surface change.

Prior Gate AW selection status:

`gate_aw_same_stack_iso_delta_lw_packet_acquisition_readiness_landed_no_runtime_selected_packet_request_ledger_gate_ax`

Gate AW landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aw-steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness-contract.test.ts`

Gate AW landed action:

`gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan`

Gate AW selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ax-steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger-contract.test.ts`

Gate AW selected next action:

`gate_ax_steel_floor_formula_same_stack_iso_delta_lw_packet_request_ledger_plan`

Gate AW result:

- Gate AW uses only Gate AV accepted intake rows as packet request
  candidates;
- rejected intake rows remain blocked from packet requests;
- ready packet requests require same-stack steel ISO `DeltaLw` scope,
  rights-safe locator metadata, and the Gate AT/AK source-owned owner
  field checklist;
- ready packet requests are not source packets, measured rows,
  calibration evidence, exact overrides, or retune evidence;
- source documents, source text, and measured metric values are not
  copied or ingested;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate;
- Gate AX is selected as the packet request ledger gate, not a broad
  source crawl, source-text ingestion, packet acceptance, or formula
  retune.

Gate AW validation result:

Focused Gate AW validation completed on 2026-05-08. Gate AW passed 1 file
/ 7 tests, focused Gate AV/AW continuity passed 2 files / 14 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 329 files / 1873 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Known warnings were the existing Zustand
unavailable test-storage warnings and optional sharp package resolution
warnings during web build. Broad `pnpm check` was not rerun because Gate
AW has no runtime/API/UI surface change.

Prior Gate AV selection status:

`gate_av_same_stack_iso_delta_lw_source_lead_intake_landed_no_runtime_selected_packet_acquisition_readiness_gate_aw`

Gate AV landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-av-steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake-contract.test.ts`

Gate AV landed action:

`gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan`

Gate AV selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aw-steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness-contract.test.ts`

Gate AV selected next action:

`gate_aw_steel_floor_formula_same_stack_iso_delta_lw_packet_acquisition_readiness_plan`

Gate AV result:

- Gate AV creates the metadata-only intake ledger for Gate AU's accepted
  source-lead categories;
- accepted manufacturer lab-report index, accredited lab-report index,
  and internal measurement packet leads become acquisition request
  targets only;
- source text and measured metric values are not ingested, and intake
  rows are not source packets, exact overrides, calibration evidence, or
  retune evidence;
- product-only/catalog, inferred, ASTM/IIC/STC, field/building,
  concrete-reference, boundary-only, rights-blocked, and missing-owner
  leads remain rejected at intake;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate;
- Gate AW is selected as the packet-acquisition readiness gate, not a
  broad source crawl, source-text ingestion, or formula retune.

Gate AV validation result:

Focused Gate AV validation completed on 2026-05-08. Gate AV passed 1 file
/ 7 tests, focused Gate AU/AV continuity passed 2 files / 14 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 328 files / 1866 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Known warnings were the existing Zustand
unavailable test-storage warnings and optional sharp package resolution
warnings during web build. Broad `pnpm check` was not rerun because Gate
AV has no runtime/API/UI surface change.

Prior Gate AU selection status:

`gate_au_same_stack_iso_delta_lw_narrow_source_lead_landed_no_runtime_selected_source_lead_intake_gate_av`

Gate AU landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-au-steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead-contract.test.ts`

Gate AU landed action:

`gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan`

Gate AU selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-av-steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake-contract.test.ts`

Gate AU selected next action:

`gate_av_steel_floor_formula_same_stack_iso_delta_lw_source_lead_intake_plan`

Gate AU result:

- Gate AU uses the Gate AT same-stack ISO lab `DeltaLw` packet
  acceptance surface as the only source-lead scope;
- rights-safe manufacturer lab-report index, accredited lab-report
  index, and internal measurement packet leads can proceed to a later
  packet acquisition/intake gate only as metadata-only targets;
- accepted leads are not calibration evidence yet, not exact overrides,
  and not retune inputs;
- product-only/catalog claims, ASTM/IIC/STC or field-basis reports,
  concrete-reference ISO `DeltaLw`, boundary-only references,
  missing-owner metadata, and rights-blocked reports remain rejected;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate;
- Gate AV is selected as the metadata-only source-lead intake gate, not
  a broad source crawl or formula retune.

Gate AU validation result:

Focused Gate AU validation completed on 2026-05-08. Gate AU passed 1 file
/ 7 tests, focused Gate AT/AU continuity passed 2 files / 14 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 327 files / 1859 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Known warnings were the existing Zustand
unavailable test-storage warnings and optional sharp package resolution
warnings during web build. Broad `pnpm check` was not rerun because Gate
AU has no runtime/API/UI surface change.

Prior Gate AT selection status:

`gate_at_same_stack_iso_delta_lw_packet_target_landed_no_runtime_selected_narrow_source_lead_gate_au`

Gate AT landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-at-steel-floor-formula-same-stack-iso-delta-lw-packet-target-contract.test.ts`

Gate AT landed action:

`gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan`

Gate AT selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-au-steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead-contract.test.ts`

Gate AT selected next action:

`gate_au_steel_floor_formula_same_stack_iso_delta_lw_narrow_source_lead_plan`

Gate AT result:

- Gate AT uses Gate AS selected same-stack ISO lab `DeltaLw` packet
  ownership as the only acceptance surface;
- the future same-stack source-owned ISO `DeltaLw` fixture is accepted
  as calibration evidence only and cannot move runtime values;
- accepted fixture residual policy stays on `hold` because holdout
  count, paired negative boundaries, open-web source-owned formula
  inputs, and field/building basis owners are incomplete;
- product-only or inferred `DeltaLw`, ASTM/IIC/STC or field/building
  basis, concrete-reference floors, boundary-only references, missing
  source-owned owner fields, and rights-blocked packets remain rejected;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate;
- Gate AU is selected as a narrow source-lead gate for same-stack ISO
  `DeltaLw`, not a broad source crawl or formula retune.

Gate AT validation result:

Focused Gate AT validation completed on 2026-05-08: Gate AT engine
contract passed 1 file / 7 tests. Focused Gate AS/AT continuity passed
2 files / 13 tests. Engine typecheck passed. Engine DTS build passed.
Full `pnpm calculator:gate:current` passed with engine 326 files / 1852
tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Broad `pnpm check` was not
rerun because Gate AT is no-runtime/no-API/no-UI and the current-gate
plus engine typecheck/build cover the changed surfaces. Known non-fatal
warnings remain the Node/Vitest Zustand persist storage warning and
optional `sharp` / `@img` Next build warnings via the DOCX export
dependency.

Prior Gate AS selection status:

`gate_as_owner_evidence_targeting_landed_no_runtime_selected_same_stack_delta_lw_packet_target_gate_at`

Gate AS landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-as-steel-floor-formula-owner-evidence-targeting-contract.test.ts`

Gate AS landed action:

`gate_as_steel_floor_formula_owner_evidence_targeting_plan`

Gate AS selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-at-steel-floor-formula-same-stack-iso-delta-lw-packet-target-contract.test.ts`

Gate AS selected next action:

`gate_at_steel_floor_formula_same_stack_iso_delta_lw_packet_target_plan`

Gate AS result:

- Gate AS ranks all seven Gate AQ evidence owners by calculator impact,
  acquisition feasibility, current ledger gap, and rejection-boundary
  risk;
- same-stack ISO lab `DeltaLw` packet ownership is selected first
  because it covers both `Ln,w` and `DeltaLw`, current accepted local
  packet count remains `0`, and Gate AK/AQ/AR already define the strict
  owner fields;
- selected Gate AT packet shape requires lab ISO 10140 / 717-2
  `DeltaLw`, same-stack steel reference, metric value,
  topology/support family, carrier spacing, load basis, dynamic
  stiffness, lower support class, upper resilient topology, and paired
  negative boundary owner;
- product-only, inferred, ASTM/IIC/STC, field/building,
  concrete-reference, boundary-only, and missing-owner-field evidence
  remains rejected;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate;
- Gate AT is selected as the same-stack ISO `DeltaLw` packet target,
  not a broad source crawl or formula retune.

Gate AS validation result:

Focused Gate AS validation completed on 2026-05-08: Gate AS engine
contract passed 1 file / 6 tests. Focused Gate AR/AS continuity passed
2 files / 13 tests. Engine typecheck passed. Engine DTS build passed.
Full `pnpm calculator:gate:current` passed with engine 325 files / 1845
tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Broad `pnpm check` was not
rerun because Gate AS is no-runtime/no-API/no-UI and the current-gate
plus engine typecheck/build cover the changed surfaces. Known non-fatal
warnings remain the Node/Vitest Zustand persist storage warning and
optional `sharp` / `@img` Next build warnings via the DOCX export
dependency.

Prior Gate AR selection status:

`gate_ar_calibration_evidence_intake_landed_no_runtime_selected_owner_evidence_targeting_gate_as`

Gate AR landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ar-steel-floor-formula-calibration-evidence-intake-contract.test.ts`

Gate AR landed action:

`gate_ar_steel_floor_formula_calibration_evidence_intake_plan`

Gate AR selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-as-steel-floor-formula-owner-evidence-targeting-contract.test.ts`

Gate AR selected next action:

`gate_as_steel_floor_formula_owner_evidence_targeting_plan`

Gate AR result:

- Gate AR classifies current Gate AK/AM local calibration evidence
  against the Gate AQ owner map;
- current accepted source-owned calibration packet count remains `0`;
- wrong-basis, wrong-reference-floor, product/inferred,
  missing-owner-field, and boundary-only evidence cannot tighten the lab
  steel-floor formula corridor;
- a future source-owned same-stack ISO `DeltaLw` packet satisfies the
  `source_owned_delta_lw_holdout_absence` owner, but residual-policy
  thresholds still keep runtime movement blocked;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate;
- Gate AS is selected as owner-evidence targeting, not a broad source
  crawl or formula retune.

Gate AR validation result:

Focused Gate AR validation completed on 2026-05-08: Gate AR engine
contract passed 1 file / 7 tests. Focused Gate AQ/AR continuity passed
2 files / 14 tests. Engine DTS build passed. Full `pnpm
calculator:gate:current` passed with engine 324 files / 1839 tests, web
66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Broad `pnpm check` passed with lint/typecheck
clean, engine 449 files / 2641 tests, web 172 files / 961 passed + 18
skipped, and repo build 5/5 successful. Known non-fatal warnings remain
the Node/Vitest Zustand persist storage warning and optional `sharp` /
`@img` Next build warnings via the DOCX export dependency.

Prior Gate AQ selection status:

`gate_aq_error_budget_calibration_readiness_landed_no_runtime_selected_calibration_evidence_intake_gate_ar`

Gate AQ landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aq-steel-floor-formula-error-budget-calibration-readiness-contract.test.ts`

Gate AQ landed action:

`gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan`

Gate AQ selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ar-steel-floor-formula-calibration-evidence-intake-contract.test.ts`

Gate AQ selected next action:

`gate_ar_steel_floor_formula_calibration_evidence_intake_plan`

Gate AQ result:

- Gate AQ maps every current steel-floor formula error-budget term to the
  exact source-owned evidence owner that can shrink it and the blocker
  that keeps the current tolerance;
- the mapping is exhaustive against the actual runtime
  `ImpactErrorBudget.terms`, so new unowned terms fail closed;
- current `Ln,w` and `DeltaLw` residual policies still resolve to
  `hold`, accepted same-stack source-owned `DeltaLw` holdout count is
  still `0`, and runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`;
- product-only, inferred, STC/IIC, field/building,
  wrong-reference-floor, concrete-reference, and boundary-only evidence
  cannot shrink budget terms or tighten the corridor;
- future `hold`, `tighten`, `widen`, and `retune_candidate` branches are
  executable but no runtime retune is selected now;
- Gate AR is selected as calibration-evidence intake / decision ledger,
  not as an automatic source crawl or formula retune.

Gate AQ validation result:

Focused Gate AQ validation completed on 2026-05-08: Gate AQ engine
contract passed 1 file / 7 tests. Focused Gate AP/AQ continuity passed
2 files / 14 tests. Full `pnpm calculator:gate:current` passed with
engine 323 files / 1832 tests, web 66 files / 286 passed + 18 skipped,
repo build 5/5 successful, and whitespace guard clean. Post-doc
`git diff --check` passed. Broad `pnpm check` also passed after Gate AQ:
lint, typecheck, engine 448 files / 2634 tests, web 172 files / 961
passed + 18 skipped, and build 5/5 successful. Known non-fatal warnings
remain the Node/Vitest Zustand persist storage warning and optional
`sharp` / `@img` Next build warnings via the DOCX export dependency.

Prior Gate AP selection status:

`gate_ap_error_budget_hostile_input_landed_no_runtime_selected_calibration_readiness_gate_aq`

Gate AP landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ap-steel-floor-formula-error-budget-hostile-input-contract.test.ts`

Gate AP landed action:

`gate_ap_steel_floor_formula_error_budget_hostile_input_plan`

Gate AP selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aq-steel-floor-formula-error-budget-calibration-readiness-contract.test.ts`

Gate AP selected next action:

`gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan`

Gate AP result:

- Gate AP keeps complete source-absent steel formula, safe reorder, and
  saved/API replay cases on the same `Ln,w 55.6` / `DeltaLw 22.4`
  runtime values and identical structured error-budget payloads;
- missing `steelCarrierSpacingMm`, duplicate/ambiguous steel
  base-structure rows, and exact-source precedence stay budget-free;
- field requests for `L'n,w` / `L'nT,w` remain unsupported unless a
  field-context route owns them, and no lab budget is copied onto field
  metric ids;
- no runtime formula retune or source-packet relaxation happened;
- Gate AQ is selected to turn the now-stable budget surface toward
  calibration-readiness: what source-owned evidence would tighten,
  widen, or retune the steel formula corridor.

Gate AP validation result:

Focused Gate AP validation completed on 2026-05-07: Gate AP engine
contract passed 1 file / 7 tests. Full `pnpm calculator:gate:current`
passed with engine 322 files / 1825 tests, web 66 files / 286 passed +
18 skipped, repo build 5/5 successful, and whitespace guard clean. Known
non-fatal warnings remain the Node/Vitest Zustand persist storage
warning and optional `sharp` / `@img` Next build warnings via the DOCX
export dependency.

Prior Gate AO selection status:

`gate_ao_error_budget_surface_parity_landed_no_runtime_selected_error_budget_hostile_input_gate_ap`

Prior Gate AO landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ao-steel-floor-formula-error-budget-surface-parity-contract.test.ts`

Prior Gate AO landed action:

`gate_ao_steel_floor_formula_error_budget_surface_parity_plan`

Prior Gate AO selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ap-steel-floor-formula-error-budget-hostile-input-contract.test.ts`

Prior Gate AO selected next action:

`gate_ap_steel_floor_formula_error_budget_hostile_input_plan`

Prior Gate AO validation result:

Validation completed on 2026-05-07: focused Gate AE/AN/AO engine
contracts passed 3 files / 15 tests, focused web steel-floor card /
budget-surface / input-surface parity passed 3 files / 7 tests, and
full `pnpm calculator:gate:current` passed with engine 321 files / 1818
tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Broad `pnpm check` passed after
a transient Google Fonts fetch timeout was isolated by a successful
build retry: lint, typecheck, engine 446 files / 2620 tests, web 172
files / 961 passed + 18 skipped, and build all passed. `git diff
--check` passed. Known non-fatal warnings remain the Node/Vitest Zustand
persist storage warning and optional `sharp` / `@img` Next build
warnings via the DOCX export dependency.

Gate AN selection status:

`gate_an_source_absent_uncertainty_landed_no_runtime_selected_error_budget_surface_parity_gate_ao`

Gate AN landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-an-steel-floor-formula-source-absent-uncertainty-contract.test.ts`

Gate AN landed action:

`gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan`

Gate AN selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ao-steel-floor-formula-error-budget-surface-parity-contract.test.ts`

Gate AN selected next action:

`gate_ao_steel_floor_formula_error_budget_surface_parity_plan`

Gate AN result:

- Gate AN lands a no-runtime structured error-budget contract for the
  source-absent steel-floor formula corridor;
- complete formula cases keep the same `Ln,w 55.6` / `DeltaLw 22.4`
  runtime estimates while exposing `Ln,w +/-4.5 dB` and
  `DeltaLw +/-2.0 dB` as metric-specific budget objects;
- budget terms distinguish missing source-owned `DeltaLw` holdouts,
  bare steel reference modelling, transfer efficiency, dynamic
  stiffness precision, load-basis precision, lower support class, and
  upper resilient topology;
- exact-source, needs-input, and unsafe-topology cases do not expose a
  formula error budget;
- Gate AK/AM source rules remain unchanged and still report zero
  accepted source-owned same-stack ISO lab `DeltaLw` holdouts;
- Gate AO is selected to carry the error-budget payload across cards,
  reports, calculator API, and impact-only API parity surfaces.

Gate AN validation result:

Focused validation completed on 2026-05-07: Gate AN focused engine
contract passed 1 file / 6 tests, engine typecheck passed, focused Gate
AM/AN contracts passed 2 files / 11 tests, focused Gate AJ/AK/AL/AM/AN
contracts passed 5 files / 25 tests, full `pnpm
calculator:gate:current` passed, and `git diff --check` passed before
this validation-doc sync. Current gate totals: engine 320 files / 1813
tests, web 65 files / 284 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean.

Gate AM selection status:

`gate_am_source_packet_acquisition_landed_no_runtime_selected_source_absent_uncertainty_gate_an`

Gate AM landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-am-steel-floor-formula-source-owned-delta-lw-source-packet-acquisition-contract.test.ts`

Gate AM landed action:

`gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan`

Gate AM selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-an-steel-floor-formula-source-absent-uncertainty-contract.test.ts`

Gate AM selected next action:

`gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan`

Gate AM result:

- Gate AM lands an executable narrow source-packet acquisition ledger
  without moving runtime values;
- no searched lead qualifies as a source-owned same-stack ISO lab
  `DeltaLw` steel-floor holdout;
- REGUPOL steel deck / steel joist and steel C-joist leads are rejected
  as wrong-basis STC/IIC evidence;
- REGUPOL ISO `DeltaLw` leads are rejected as solid/concrete
  reference-floor evidence rather than same-stack steel formula
  holdouts;
- SoundAdvisor is retained as a metric-scope boundary reference, not a
  candidate packet;
- broad source-library crawl remains blocked, so the next step is
  source-absent steel-floor formula uncertainty and error-budget work.

Gate AM validation result:

Focused validation completed on 2026-05-07: Gate AM focused engine
contract passed 1 file / 5 tests, engine typecheck passed, and focused
Gate AJ/AK/AL/AM contracts passed 4 files / 19 tests. Full `pnpm
calculator:gate:current` passed: engine 319 files / 1807 tests, web 65
files / 284 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. `git diff --check` passed. Known non-fatal
warnings remain the Node/Vitest Zustand persist storage warning and
optional `sharp` / `@img` Next build warnings via the DOCX export
dependency.

Gate AL selection status:

`gate_al_source_owned_delta_lw_first_holdout_guard_landed_no_runtime_selected_source_packet_acquisition_gate_am`

Gate AL landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts`

Gate AL landed action:

`gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan`

Gate AL selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-am-steel-floor-formula-source-owned-delta-lw-source-packet-acquisition-contract.test.ts`

Gate AL selected next action:

`gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan`

Gate AL result:

- Gate AL lands an executable first-holdout guard for source-owned
  same-stack lab `DeltaLw` packets without moving runtime values;
- current local/open candidate inventory still has zero accepted
  measured `DeltaLw` holdouts because Pliteq and UBIQ are `Ln,w`/`Rw`
  rows without owned `DeltaLw`, product-catalog `DeltaLw` rows are not
  same-stack steel-floor holdouts, Annex/companion values are inferred,
  and the checked REGUPOL steel C-joist source is ASTM/IIC/STC basis
  rather than ISO lab `DeltaLw`;
- Gate AL proves a future packet would be accepted only when the metric
  and every Gate AK owner field are source-owned;
- residual retune remains blocked by
  `delta_lw_measured_holdouts_missing` and
  `source_owned_metric_holdouts_missing`;
- exact measured rows remain precedence, and source rows remain anchors,
  holdouts, or calibration evidence rather than the product.

Gate AL validation result:

Focused validation completed on 2026-05-07: Gate AL engine contract
passed 1 file / 4 tests, and engine typecheck passed. Full `pnpm
calculator:gate:current` passed after the Gate AJ/AK/AL doc-alignment
repair: engine 318 files / 1802 tests, web 65 files / 284 passed + 18
skipped, repo build 5/5 successful, and whitespace guard clean. `git
diff --check` passed. Known non-fatal warnings remain the Node/Vitest
Zustand persist storage warning and optional `sharp` / `@img` Next build
warnings via the DOCX export dependency.

## Consumed Gate AQ Implementation Order - Steel-Floor Error-Budget Calibration Readiness

Gate AQ landed after Gate AP proved the steel formula error-budget
payload survives hostile input without leaking into wrong routes. It
defines how that budget can be tightened, widened, or retuned when
source-owned evidence finally exists, without falling back into a broad
source-library crawl.

Implementation comparison on 2026-05-08:

- Gate AP is implemented and validated in
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ap-steel-floor-formula-error-budget-hostile-input-contract.test.ts`;
- Gate AP's helper selects the Gate AQ contract file and action, but no
  `gate-aq` engine contract/helper exists yet;
- `packages/engine/src/steel-floor-impact-formula-corridor.ts` already
  owns the runtime basis, current tolerances, and structured error-budget
  term ids;
- `packages/engine/src/steel-floor-formula-residual-policy.ts` already
  owns the hold/tighten/widen/retune policy mechanics that Gate AQ should
  reuse instead of inventing a second decision vocabulary;
- `packages/engine/src/steel-floor-formula-source-owned-delta-lw-holdout.ts`
  and
  `packages/engine/src/steel-floor-formula-source-owned-delta-lw-source-packet-acquisition.ts`
  already define the source-owned `DeltaLw` packet rules and the current
  rejected evidence ledger;
- the current runtime must remain pinned at `Ln,w 55.6` /
  `DeltaLw 22.4` with `+/-4.5 dB` / `+/-2.0 dB` tolerances.

Gate AQ planning verdict:

- no external web/source crawl is required for Gate AQ because the gate is
  a no-runtime calibration-readiness contract over existing Gate
  AI/AK/AM/AN/AP evidence and policies;
- internet/source research belongs in the next evidence-intake gate only
  if Gate AQ first defines the exact packet acceptance contract;
- the implementation should fail closed whenever a budget term, evidence
  owner, or residual-policy decision appears without an explicit mapping.

Gate AQ implementation format:

1. Files to add:
   - `packages/engine/src/steel-floor-formula-error-budget-calibration-readiness.ts`;
   - `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aq-steel-floor-formula-error-budget-calibration-readiness-contract.test.ts`.
2. Optional package export:
   - export the new helper from `packages/engine/src/index.ts` if the
     helper is intended to be available through `@dynecho/engine`;
   - relative test-only helpers may stay unexported, but the choice must
     be explicit in the Gate AQ test.
3. Contract identity:
   - landed gate:
     `gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan`;
   - previous landed gate:
     `gate_ap_steel_floor_formula_error_budget_hostile_input_plan`;
   - selected next action:
     `gate_ar_steel_floor_formula_calibration_evidence_intake_plan`;
   - selected next file:
     `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ar-steel-floor-formula-calibration-evidence-intake-contract.test.ts`;
   - no runtime movement: `runtimeValueMovement: false`;
   - no retune now: `runtimeRetuneAllowedNow: false`.
4. Core data shape:
   - `SteelFloorFormulaBudgetTermReadiness` should bind one runtime
     `termId` to metric ids, `tightenRequires`, current missing owner
     status, and the exact rejected evidence buckets;
   - `SteelFloorFormulaCalibrationReadinessDecision` should reuse the
     existing residual-policy decision literals: `hold`, `tighten`,
     `widen`, and `retune_candidate`;
   - `GateAQSteelFloorFormulaErrorBudgetCalibrationReadinessContract`
     should expose term mapping, current hold posture, negative evidence
     rejection, synthetic future decision cases, AP/AO invariants, and
     next-gate selection.

Gate AQ evidence-owner map:

1. `source_owned_delta_lw_holdout_absence`
   - metrics: `Ln,w`, `DeltaLw`;
   - owner: `accepted_source_owned_same_stack_iso_delta_lw_holdouts`;
   - current blocker: Gate AM accepted count remains `0`.
2. `source_absent_bare_steel_reference_model`
   - metrics: `Ln,w`;
   - owner: `same_stack_bare_steel_reference_rows`;
   - current blocker: no same-stack bare steel reference row owns the
     carrier, lower support, load, and topology packet.
3. `support_form_transfer_efficiency`
   - metrics: `Ln,w`;
   - owner: `source_owned_steel_transfer_efficiency_curve`;
   - current blocker: open-web/steel transfer curve is not source-owned.
4. `lower_support_class_simplification`
   - metrics: `Ln,w`;
   - owner: `lower_ceiling_support_family_holdouts`;
   - current blocker: lower ceiling support is class-modelled rather than
     backed by enough same-family holdouts.
5. `dynamic_stiffness_precision`
   - metrics: `Ln,w`, `DeltaLw`;
   - owner: `frequency_dependent_dynamic_stiffness_or_product_curve_owner`;
   - current blocker: input owns scalar `s'`, not a source-owned tested
     frequency-dependent resilient layer curve.
6. `load_basis_precision`
   - metrics: `Ln,w`, `DeltaLw`;
   - owner: `source_owned_load_basis_schedule`;
   - current blocker: input owns aggregate `kg/m2`, not a source-owned
     load schedule.
7. `upper_resilient_topology_simplification`
   - metrics: `DeltaLw`;
   - owner: `upper_resilient_topology_holdouts`;
   - current blocker: upper resilient topology is represented by `s'` and
     package load rather than same-stack measured packets.

Gate AQ executable checks:

1. Exhaustive term mapping:
   - build a complete source-absent steel formula runtime;
   - collect every `ImpactErrorBudget.terms[].termId`;
   - assert every term id exists in the Gate AQ owner map;
   - assert every owner id appears in the term's `tightenRequires`.
2. Current hold posture:
   - reuse `buildGateAISteelFloorFormulaResidualPolicyContract()`;
   - assert `Ln,w` decision is `hold`;
   - assert `DeltaLw` decision is `hold`;
   - assert runtime values remain `Ln,w 55.6` and `DeltaLw 22.4`;
   - assert tolerances remain `+/-4.5 dB` and `+/-2.0 dB`.
3. Wrong-evidence rejection:
   - reject `ln_w_only_system_table` as `DeltaLw` tightening evidence;
   - reject `product_catalog_delta_lw`;
   - reject `annex_c_or_companion_inferred_delta_lw`;
   - reject `field_astm_or_building_prediction_delta_lw`;
   - reject `rejected_wrong_metric_basis_astm_iic_stc`;
   - reject `rejected_reference_floor_not_same_stack_steel`;
   - reject `rejected_boundary_reference_not_candidate_packet`.
4. Future decision matrix:
   - current evidence case -> `hold`;
   - complete low-residual source-owned evidence case -> `tighten`;
   - residual outside current tolerance with missing correction owner ->
     `widen`;
   - residual outside current tolerance with all source-owned owners,
     correction owner, and paired negative thresholds -> `retune_candidate`;
   - all four cases must keep `runtimeValueMovement: false`.
5. AP/AO invariants:
   - complete, safe reorder, and saved/API replay keep the same structured
     budget;
   - missing physical input, unsafe duplicate carrier, and exact-source
     precedence remain budget-free;
   - field metric ids `L'n,w` and `L'nT,w` never receive lab budget
     aliases;
   - card/report/API payload shape remains unchanged.

Gate AQ validation commands:

1. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-aq-steel-floor-formula-error-budget-calibration-readiness-contract.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-ap-steel-floor-formula-error-budget-hostile-input-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-aq-steel-floor-formula-error-budget-calibration-readiness-contract.test.ts --maxWorkers=1`
3. `pnpm calculator:gate:current`
4. `git diff --check`

Gate AQ validation result:

Focused Gate AQ validation completed on 2026-05-08: Gate AQ engine
contract passed 1 file / 7 tests. Focused Gate AP/AQ continuity passed
2 files / 14 tests. Full `pnpm calculator:gate:current` passed with
engine 323 files / 1832 tests, web 66 files / 286 passed + 18 skipped,
repo build 5/5 successful, whitespace guard clean, and post-doc
`git diff --check` passed. Broad `pnpm check` also passed: lint,
typecheck, engine 448 files / 2634 tests, web 172 files / 961 passed +
18 skipped, and build 5/5 successful.

Gate AQ closeout docs:

1. Add a Gate AQ checkpoint.
2. Add Gate AQ to `tools/dev/run-calculator-current-gate.ts`.
3. Update `CURRENT_STATE.md`, this plan, the active slice plan, and
   `AGENTS.md`.
4. Keep Gate AR selected as an evidence-intake/decision-ledger gate, not
   as an automatic source crawl or formula retune.

Non-goals for Gate AQ:

- no runtime formula retune;
- no broad source-library crawl;
- no field/building promotion from lab evidence;
- no source row promotion without paired positive and negative tests.

## Consumed Gate AR Implementation Order - Steel-Floor Calibration Evidence Intake

Gate AR was selected because Gate AQ now defines the
acceptance and rejection contract for calibration evidence. Gate AR
now intakes and classifies candidate evidence against that contract,
without loosening the contract or retuning runtime values.

Gate AR order completed:

1. Add
   `packages/engine/src/steel-floor-formula-calibration-evidence-intake.ts`
   and
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ar-steel-floor-formula-calibration-evidence-intake-contract.test.ts`.
2. Reuse the Gate AQ term owner map as the only acceptance surface for
   steel formula error-budget calibration evidence.
3. Classify any candidate packet into one of these buckets:
   `accepted_source_owned_calibration_packet`,
   `rejected_missing_source_owned_owner_field`,
   `rejected_wrong_metric_basis`,
   `rejected_reference_floor_not_same_stack_steel`,
   `rejected_product_or_inferred_metric`, or
   `rejected_boundary_reference_only`.
4. Keep candidate rows as holdout/calibration evidence, not product
   catalog replacements and not exact-source promotions.
5. No source-owned packet is available in the local ledger, so Gate AR
   lands a no-runtime rejection ledger and selects Gate AS as the next
   narrow owner-evidence targeting gate.
6. A future accepted packet probe proves which Gate AQ term owner it
   satisfies and which residual-policy thresholds still block tightening
   or retune.
7. Runtime values `Ln,w 55.6` / `DeltaLw 22.4`, current
   tolerances `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence, and
   field/building basis separation remain unchanged.

Gate AR validation commands:

1. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-ar-steel-floor-formula-calibration-evidence-intake-contract.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-aq-steel-floor-formula-error-budget-calibration-readiness-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-ar-steel-floor-formula-calibration-evidence-intake-contract.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/engine build`
4. `pnpm calculator:gate:current`
5. `pnpm check`
6. `git diff --check`

Gate AR validation result:

Focused Gate AR validation completed on 2026-05-08: Gate AR engine
contract passed 1 file / 7 tests. Focused Gate AQ/AR continuity passed
2 files / 14 tests. Engine DTS build passed. Full `pnpm
calculator:gate:current` passed with engine 324 files / 1839 tests, web
66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Broad `pnpm check` passed with lint/typecheck
clean, engine 449 files / 2641 tests, web 172 files / 961 passed + 18
skipped, and repo build 5/5 successful. Known non-fatal warnings remain
the Node/Vitest Zustand persist storage warning and optional `sharp` /
`@img` Next build warnings via the DOCX export dependency.

Non-goals for Gate AR:

- no automatic broad web crawl;
- no runtime retune from a single accepted packet;
- no product-only `DeltaLw`, STC/IIC, ASTM, field, building-prediction,
  concrete-reference, or boundary-only evidence as tightening evidence;
- no aliasing between ISO lab `Ln,w` / `DeltaLw` and field or rating
  metrics.

## Consumed Gate AS Implementation Order - Steel-Floor Formula Owner Evidence Targeting

Gate AS is selected because Gate AR proved the current local ledger has
no accepted source-owned calibration packet, while Gate AQ already names
the owner fields that could shrink individual budget terms. Gate AS
targets the next evidence owner deliberately rather than crawling a broad
source library or retuning the formula.

Gate AS order completed:

1. Add
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-as-steel-floor-formula-owner-evidence-targeting-contract.test.ts`
   and
   `packages/engine/src/steel-floor-formula-owner-evidence-targeting.ts`.
2. Read Gate AQ `termReadiness` and Gate AR `currentLedgerSummary`.
3. Rank Gate AQ owners by calculator impact and acquisition feasibility:
   same-stack ISO `DeltaLw` holdouts, same-stack bare steel reference
   rows, transfer-efficiency curve, dynamic stiffness curve, load basis
   schedule, lower support holdouts, and upper resilient topology
   holdouts.
4. Select exactly one narrow evidence target for the next gate:
   same-stack ISO lab `DeltaLw` packet ownership.
5. Keep exact rows as exact overrides only when the full assembly
   matches; otherwise source rows stay calibration evidence, holdouts,
   anchors, or boundaries.
6. Preserve `Ln,w 55.6` / `DeltaLw 22.4`, current tolerances, exact
   source precedence, and lab/field/building basis separation.

Gate AS validation commands:

1. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-as-steel-floor-formula-owner-evidence-targeting-contract.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-ar-steel-floor-formula-calibration-evidence-intake-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-as-steel-floor-formula-owner-evidence-targeting-contract.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/engine build`
4. `pnpm calculator:gate:current`
5. `git diff --check`

Gate AS validation result:

Focused Gate AS validation completed on 2026-05-08: Gate AS engine
contract passed 1 file / 6 tests. Focused Gate AR/AS continuity passed
2 files / 13 tests. Engine typecheck passed. Engine DTS build passed.
Full `pnpm calculator:gate:current` passed with engine 325 files / 1845
tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean.

Non-goals for Gate AS:

- no broad web/source crawl;
- no runtime retune;
- no promotion from product-only, inferred, ASTM/IIC/STC, field,
  building, concrete-reference, or boundary-only evidence;
- no new UI surface unless the selected target changes runtime input
  requirements later.

## Consumed Gate AT Implementation Order - Steel-Floor Same-Stack ISO DeltaLw Packet Target

Gate AT is selected because Gate AS ranked same-stack ISO lab
`DeltaLw` packet ownership first. Gate AT turns that target into a
rights-safe, source-owned packet target fixture contract without
promoting a row or retuning runtime values.

Gate AT order completed:

1. Add
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-at-steel-floor-formula-same-stack-iso-delta-lw-packet-target-contract.test.ts`
   and
   `packages/engine/src/steel-floor-formula-same-stack-iso-delta-lw-packet-target.ts`.
2. Use the Gate AS selected target shape as the only acceptance surface:
   lab ISO 10140 / 717-2 `DeltaLw`, same-stack steel reference,
   metric value, topology/support family, carrier spacing, load basis,
   dynamic stiffness, lower support class, upper resilient topology, and
   paired negative boundary owner.
3. Define the narrow acquisition/search packet boundaries before any
   web/source crawl: source-owned same-stack steel packets can become
   calibration evidence; product-only, inferred, ASTM/IIC/STC,
   field/building, concrete-reference, boundary-only, and missing-owner
   packets remain rejected.
4. Keep exact measured rows as exact overrides only for full assembly
   matches; otherwise source rows stay calibration evidence, holdouts,
   anchors, or boundaries.
5. Preserve runtime values, current tolerances, exact-source precedence,
   and lab/field/building basis separation.

Gate AT validation commands:

1. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-at-steel-floor-formula-same-stack-iso-delta-lw-packet-target-contract.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-as-steel-floor-formula-owner-evidence-targeting-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-at-steel-floor-formula-same-stack-iso-delta-lw-packet-target-contract.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/engine build`
4. `pnpm calculator:gate:current`
5. `git diff --check`

Gate AT validation result:

Focused Gate AT validation completed on 2026-05-08: Gate AT engine
contract passed 1 file / 7 tests. Focused Gate AS/AT continuity passed
2 files / 13 tests. Engine typecheck passed. Engine DTS build passed.
Full `pnpm calculator:gate:current` passed with engine 326 files / 1852
tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean.

Non-goals for Gate AT:

- no broad web/source crawl;
- no source text ingestion;
- no runtime retune;
- no exact-source promotion unless a future full-assembly match owns the
  exact row route;
- no promotion from product-only, inferred, ASTM/IIC/STC, field,
  building, concrete-reference, boundary-only, rights-blocked, or
  missing-owner evidence.

## Consumed Gate AU Implementation Order - Steel-Floor Same-Stack ISO DeltaLw Narrow Source Lead

Gate AU is selected because Gate AT now defines the precise acceptance
surface for same-stack ISO lab `DeltaLw` packet evidence. Gate AU turns
that target into a narrow rights-safe lead/acquisition plan before
any actual packet source is allowed to affect calibration.

Gate AU order completed:

1. Add
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-au-steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead-contract.test.ts`
   and
   `packages/engine/src/steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead.ts`.
2. Use the Gate AT packet acceptance surface as the only source-lead
   scope: same-stack steel, lab ISO 10140 / 717-2 `DeltaLw`, all
   source-owned owner fields, and rights-safe metadata-only handling.
3. Enumerate a narrow set of source-lead categories and reject any lead
   that is product-only, inferred, ASTM/IIC/STC, field/building,
   concrete-reference, boundary-only, rights-blocked, or missing source
   ownership.
4. Keep accepted leads as potential calibration evidence only. They do
   not become exact overrides or retune inputs until a later gate has
   source-owned packet data plus residual-policy thresholds.
5. Preserve runtime values, current tolerances, exact-source precedence,
   and lab/field/building basis separation.

Gate AU validation commands:

1. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-au-steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead-contract.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-at-steel-floor-formula-same-stack-iso-delta-lw-packet-target-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-au-steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead-contract.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/engine build`
4. `pnpm calculator:gate:current`
5. `git diff --check`

Gate AU validation result:

Focused Gate AU validation completed on 2026-05-08. Gate AU passed 1 file
/ 7 tests, focused Gate AT/AU continuity passed 2 files / 14 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 327 files / 1859 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Known warnings were the existing Zustand
unavailable test-storage warnings and optional sharp package resolution
warnings during web build. Broad `pnpm check` was not rerun because Gate
AU has no runtime/API/UI surface change.

Non-goals for Gate AU:

- no broad web/source crawl;
- no source text ingestion;
- no packet acceptance yet;
- no calibration residual admission yet;
- no exact-source promotion;
- no runtime retune;
- no promotion from product-only, inferred, ASTM/IIC/STC, field,
  building, concrete-reference, boundary-only, rights-blocked, or
  missing-owner leads.

## Consumed Gate AV Implementation Order - Steel-Floor Same-Stack ISO DeltaLw Source Lead Intake

Gate AV was selected because Gate AU named the only rights-safe lead
categories allowed to progress toward a same-stack ISO `DeltaLw` packet.
Gate AV created the metadata-only intake ledger for those lead
categories before any source packet data can be considered.

Gate AV order completed:

1. Add
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-av-steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake-contract.test.ts`
   and a small helper if the intake ledger needs one.
2. Use the Gate AU lead scope as the only intake surface:
   manufacturer lab-report index, accredited lab-report index, and
   internal measurement packet leads only; same-stack steel; lab ISO
   10140 / 717-2 `DeltaLw`; all owner fields; rights-safe metadata only.
3. Keep accepted lead intake rows as acquisition targets only, not
   source packets, exact overrides, calibration evidence, or retune
   evidence.
4. Reject product-only/catalog, inferred, ASTM/IIC/STC, field/building,
   concrete-reference, boundary-only, rights-blocked, and missing-owner
   leads at intake.
5. Preserve runtime values, current tolerances, exact-source precedence,
   and lab/field/building basis separation.

Gate AV validation commands:

1. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-av-steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake-contract.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-au-steel-floor-formula-same-stack-iso-delta-lw-narrow-source-lead-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-av-steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake-contract.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/engine build`
4. `pnpm calculator:gate:current`
5. `git diff --check`

Gate AV validation result:

Focused Gate AV validation completed on 2026-05-08. Gate AV passed 1 file
/ 7 tests, focused Gate AU/AV continuity passed 2 files / 14 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 328 files / 1866 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Known warnings were the existing Zustand
unavailable test-storage warnings and optional sharp package resolution
warnings during web build. Broad `pnpm check` was not rerun because Gate
AV has no runtime/API/UI surface change.

Non-goals for Gate AV:

- no broad web/source crawl;
- no source text ingestion;
- no measured metric value ingestion;
- no packet acceptance yet;
- no calibration residual admission yet;
- no exact-source promotion;
- no runtime retune.

## Consumed Gate AW Implementation Order - Steel-Floor Same-Stack ISO DeltaLw Packet Acquisition Readiness

Gate AW was selected because Gate AV now has a metadata-only source-lead
ledger, but the accepted lead rows still are not source packets. Gate AW
defined the packet-acquisition readiness contract for moving from
a rights-safe lead row to a source-owned packet request without
ingesting source text, copying report contents, or changing runtime
values.

Gate AW order completed:

1. Add
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aw-steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness-contract.test.ts`
   and a small helper if the packet readiness contract needs one.
2. Use only Gate AV accepted intake rows as packet request candidates.
   Rejected intake rows must remain blocked.
3. Require every packet request to name the same-stack steel ISO
   `DeltaLw` basis, rights-safe locator metadata, and the Gate AT/AK
   source-owned owner-field checklist before it can progress.
4. Keep packet readiness separate from packet acceptance: a ready packet
   request is still not a measured row, not calibration evidence, not an
   exact override, and not retune evidence.
5. Preserve runtime values, current tolerances, exact-source precedence,
   and lab/field/building basis separation.

Gate AW validation commands:

1. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-aw-steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness-contract.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-av-steel-floor-formula-same-stack-iso-delta-lw-source-lead-intake-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-aw-steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness-contract.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/engine build`
4. `pnpm calculator:gate:current`
5. `git diff --check`

Gate AW validation result:

Focused Gate AW validation completed on 2026-05-08. Gate AW passed 1 file
/ 7 tests, focused Gate AV/AW continuity passed 2 files / 14 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 329 files / 1873 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Known warnings were the existing Zustand
unavailable test-storage warnings and optional sharp package resolution
warnings during web build. Broad `pnpm check` was not rerun because Gate
AW has no runtime/API/UI surface change.

Non-goals for Gate AW:

- no broad web/source crawl;
- no source text or document ingestion;
- no measured metric value ingestion;
- no packet acceptance yet;
- no calibration residual admission yet;
- no exact-source promotion;
- no runtime retune.

## Consumed Gate AX Implementation Order - Steel-Floor Same-Stack ISO DeltaLw Packet Request Ledger

Gate AX was selected because Gate AW now separates packet-acquisition
readiness from packet acceptance. Gate AX should build the rights-safe
packet request ledger from Gate AW ready request rows, while keeping
blocked rows out and preserving the rule that packet requests are still
not measured source packets or calibration evidence.

Gate AX order completed:

1. Add
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ax-steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger-contract.test.ts`
   and a small helper if the request ledger needs one.
2. Use only Gate AW ready packet request rows as request-ledger entries.
   Blocked readiness rows must remain blocked.
3. Preserve rights-safe locator-only metadata and the Gate AT/AK owner
   checklist on every request-ledger entry.
4. Keep request-ledger entries separate from packet acceptance:
   no source text, no measured metric value, no copied report content,
   no exact override, no calibration residual admission, and no retune.
5. Preserve runtime values, current tolerances, exact-source precedence,
   and lab/field/building basis separation.

Gate AX validation commands:

1. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-ax-steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger-contract.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-aw-steel-floor-formula-same-stack-iso-delta-lw-packet-acquisition-readiness-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-ax-steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger-contract.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/engine build`
4. `pnpm calculator:gate:current`
5. `git diff --check`

Gate AX validation result:

Focused Gate AX validation completed on 2026-05-08. Gate AX passed 1 file
/ 7 tests, focused Gate AW/AX continuity passed 2 files / 14 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 330 files / 1880 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Known warnings were the existing Zustand
unavailable test-storage warnings and optional sharp package resolution
warnings during web build. Broad `pnpm check` was not rerun because Gate
AX has no runtime/API/UI surface change.

Non-goals for Gate AX:

- no broad web/source crawl;
- no source text or document ingestion;
- no measured metric value ingestion;
- no packet acceptance yet;
- no calibration residual admission yet;
- no exact-source promotion;
- no runtime retune.

## Consumed Gate AY Implementation Order - Steel-Floor Same-Stack ISO DeltaLw Packet Acceptance Boundary

Gate AY is selected because Gate AX now has rights-safe packet request
ledger entries, but those entries still are not source packets. Gate AY
should define the acceptance boundary that a future source-owned packet
must satisfy before it can leave request status.

Gate AY order completed:

1. Add
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ay-steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary-contract.test.ts`
   and a small helper if the boundary needs one.
2. Use only Gate AX request-ledger entries as candidate packet
   acceptance boundary rows. Blocked ledger rows must remain blocked.
3. Require source-owned measured `DeltaLw`, same-stack steel reference,
   lab ISO 10140 / 717-2 basis, all Gate AT/AK owner fields, and paired
   negative-boundary ownership before any packet can be accepted.
4. Keep acceptance boundary separate from runtime use: accepted packets
   may become calibration evidence candidates only in a later gate and
   still cannot promote exact source, retune, or alias field/building
   metrics.
5. Preserve runtime values, current tolerances, exact-source precedence,
   and lab/field/building basis separation.

Gate AY validation commands:

1. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-ay-steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary-contract.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-ax-steel-floor-formula-same-stack-iso-delta-lw-packet-request-ledger-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-ay-steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary-contract.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/engine typecheck`
4. `pnpm --filter @dynecho/engine build`
5. `pnpm calculator:gate:current`
6. `git diff --check`

Gate AY validation result:

Focused Gate AY validation completed on 2026-05-08. Gate AY passed 1 file
/ 8 tests, focused Gate AX/AY continuity passed 2 files / 15 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 331 files / 1888 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate AY
has no runtime/API/UI surface change.

Non-goals for Gate AY:

- no broad web/source crawl;
- no source text or document ingestion;
- no source document copy;
- no measured metric value ingestion for runtime;
- no calibration residual admission yet;
- no exact-source promotion;
- no runtime retune.

## Consumed Gate AZ Implementation Order - Steel-Floor Same-Stack ISO DeltaLw Packet Calibration Candidate

Gate AZ is selected because Gate AY now separates packet acceptance from
calibration use. Gate AZ should define when an accepted packet boundary
row can become a calibration evidence candidate, while still preventing
residual admission, exact-source promotion, and runtime retune until the
residual policy gates own those decisions.

Gate AZ order completed:

1. Add
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-az-steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate-contract.test.ts`
   and a small helper if the calibration-candidate boundary needs one.
2. Use only Gate AY accepted packet boundary rows as calibration
   candidate inputs. Current request-status rows and rejected probes must
   remain blocked.
3. Require the accepted packet to preserve source-owned measured
   `DeltaLw`, same-stack steel reference, ISO lab basis, every Gate AT/AK
   owner field, paired negative-boundary ownership, and rights-safe
   citation/locator metadata before it can become a calibration
   candidate.
4. Keep calibration candidates separate from residual admission and
   runtime use: no tolerance tightening, widening, retune, exact-source
   promotion, or field/building alias can happen in Gate AZ.
5. Preserve runtime values, current tolerances, exact-source precedence,
   and lab/field/building basis separation.

Gate AZ validation commands:

1. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-az-steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate-contract.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-ay-steel-floor-formula-same-stack-iso-delta-lw-packet-acceptance-boundary-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-az-steel-floor-formula-same-stack-iso-delta-lw-packet-calibration-candidate-contract.test.ts --maxWorkers=1`
3. `pnpm --filter @dynecho/engine typecheck`
4. `pnpm --filter @dynecho/engine build`
5. `pnpm calculator:gate:current`
6. `git diff --check`

Gate AZ validation result:

Focused Gate AZ validation completed on 2026-05-08. Gate AZ passed 1 file
/ 8 tests, focused Gate AY/AZ continuity passed 2 files / 16 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 332 files / 1896 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate AZ
has no runtime/API/UI surface change.

Non-goals for Gate AZ:

- no broad web/source crawl;
- no source text or document ingestion;
- no source document copy;
- no measured metric value ingestion for runtime;
- no residual-policy admission yet;
- no exact-source promotion;
- no tolerance tightening or widening;
- no runtime retune.

## Consumed Gate BA Implementation Order - Steel-Floor Same-Stack ISO DeltaLw Residual Admission Boundary

Gate BA was selected because Gate AZ separated calibration candidate
status from residual-policy admission. Gate BA now defines when a
calibration evidence candidate can enter residual evaluation for the
steel-floor formula corridor, while preserving the existing residual
policy thresholds and keeping runtime movement closed.

Gate BA order completed:

1. Add
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ba-steel-floor-formula-same-stack-iso-delta-lw-residual-admission-boundary-contract.test.ts`
   and a small helper if the residual-admission boundary needs one.
2. Use only Gate AZ accepted calibration evidence candidates as residual
   admission inputs. Current request-status rows, rejected Gate AY
   probes, and blocked Gate AZ candidate rows must remain blocked.
3. Require residual admission to preserve source-owned measured
   `DeltaLw`, same-stack steel reference, ISO lab basis, all Gate AT/AK
   owner fields, paired negative-boundary ownership, and rights-safe
   citation/locator metadata.
4. Keep residual admission separate from runtime use: no exact-source
   promotion, field/building alias, tolerance tightening/widening, or
   formula retune can happen in Gate BA unless the residual policy
   explicitly classifies a later gate as eligible.
5. Preserve runtime values, current tolerances, exact-source precedence,
   and lab/field/building basis separation.

Gate BA result:

- Gate AZ accepted calibration candidates are the only residual
  admission source;
- current request-status rows and rejected/blocked candidates stay out
  of residual evaluation;
- the future source-owned same-stack ISO lab `DeltaLw` candidate can
  enter residual-policy evaluation with source-owned owner fields and
  rights-safe locator metadata preserved;
- the residual-policy snapshot is `hold`, not retune/tighten/widen,
  because residual holdout count, paired negative-boundary count,
  open-web formula input ownership, and field/building owner coverage are
  still incomplete;
- Gate BA does not move `Ln,w 55.6`, `DeltaLw 22.4`, `+/-4.5 dB`
  `Ln,w` tolerance, or `+/-2.0 dB` `DeltaLw` tolerance.

Gate BA validation result:

Focused Gate BA validation completed on 2026-05-08. Gate BA passed 1 file
/ 8 tests, focused Gate AZ/BA continuity passed 2 files / 16 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 333 files / 1904 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate BA
has no runtime/API/UI surface change.

Non-goals for Gate BA:

- no source text or document ingestion;
- no exact-source promotion;
- no tolerance tightening or widening;
- no formula retune;
- no field/building alias;
- no runtime value movement.

## Consumed Gate BB Implementation Order - Steel-Floor Same-Stack ISO DeltaLw Residual Policy Decision

Gate BB was selected because Gate BA admitted a candidate to
residual-policy evaluation but kept policy decision and runtime
consequences separate. Gate BB now makes the residual-policy decision
surface explicit: what evidence is admitted, which blockers keep the
decision at `hold`, and which later threshold changes would be required
before any retune, tightening, or widening gate could be selected.

Gate BB order completed:

1. Add
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bb-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-decision-contract.test.ts`
   and a focused helper if the policy-decision surface needs one.
2. Use only Gate BA residual-admitted rows as policy-decision inputs;
   current blocked rows and rejected probes remain blocked.
3. Assert the admitted future row produces `hold` with explicit blockers
   for holdout count, paired negative boundaries, open-web formula input
   ownership, and field/building basis owners.
4. Preserve residual-policy threshold semantics: Gate BB may select a
   later evidence/threshold gate, but must not retune, exact-promote,
   alias field/building metrics, or move tolerances/runtime values.
5. Keep runtime pins, exact-source precedence, and lab/field/building
   basis separation unchanged.

Gate BB result:

- Gate BA residual-admitted rows are the only policy-decision inputs;
- current blocked rows and rejected probes remain blocked;
- the admitted future same-stack ISO `DeltaLw` row remains `hold`, with
  blocker shortfalls recorded as 2 more source-owned holdouts and 3 more
  paired negative boundaries plus missing open-web input ownership and
  field/building basis owners;
- future `retune_candidate`, `tighten`, and `widen` labels are
  classified only as later-gate signals and do not move runtime or
  tolerance values;
- Gate BB does not move `Ln,w 55.6`, `DeltaLw 22.4`, `+/-4.5 dB`
  `Ln,w` tolerance, or `+/-2.0 dB` `DeltaLw` tolerance.

Gate BB validation result:

Focused Gate BB validation completed on 2026-05-08. Gate BB passed 1 file
/ 8 tests, focused Gate BA/BB continuity passed 2 files / 16 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 334 files / 1912 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate BB
has no runtime/API/UI surface change.

Non-goals for Gate BB:

- no source text or document ingestion;
- no exact-source promotion;
- no tolerance tightening or widening;
- no formula retune;
- no field/building alias;
- no runtime value movement.

## Consumed Gate BC Implementation Order - Steel-Floor Same-Stack ISO DeltaLw Residual Blocker Closure

Gate BC was selected because Gate BB made the `hold` blockers explicit.
Gate BC now decides which blocker-closure lane is the right next bounded
target without loosening residual thresholds or starting a broad source
crawl.

Gate BC order completed:

1. Add
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bc-steel-floor-formula-same-stack-iso-delta-lw-residual-blocker-closure-contract.test.ts`
   and a helper if the blocker-closure ranking needs one.
2. Use only Gate BB accepted policy-decision rows and their blocker
   shortfalls as input.
3. Rank closure lanes for source-owned same-stack ISO `DeltaLw`
   holdout count, paired negative boundaries, open-web formula input
   ownership, and field/building basis owners.
4. Select a narrow next closure lane that improves residual evidence
   readiness while keeping runtime/tolerance movement closed.
5. Preserve exact-source precedence, lab/field/building basis separation,
   and all current runtime pins.

Gate BC result:

- Gate BB accepted policy-decision rows are the only blocker-closure
  ranking inputs;
- current blocked rows and rejected probes remain blocked before closure
  ranking;
- `same_stack_iso_delta_lw_holdout_count_closure` is selected for Gate
  BD because it directly improves residual case-count readiness and has
  a shortfall of 2;
- paired negative-boundary closure, open-web formula input ownership,
  and field/building basis owners remain ranked follow-ups;
- Gate BC does not move `Ln,w 55.6`, `DeltaLw 22.4`, `+/-4.5 dB`
  `Ln,w` tolerance, or `+/-2.0 dB` `DeltaLw` tolerance.

Gate BC validation result:

Focused Gate BC validation completed on 2026-05-08. Gate BC passed 1 file
/ 8 tests, focused Gate BB/BC continuity passed 2 files / 16 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 335 files / 1920 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate BC
has no runtime/API/UI surface change.

Non-goals for Gate BC:

- no broad source crawl;
- no source text or document ingestion;
- no exact-source promotion;
- no tolerance tightening or widening;
- no formula retune;
- no field/building alias;
- no runtime value movement.

## Consumed Gate BD Implementation Order - Steel-Floor Same-Stack ISO DeltaLw Holdout Closure

Gate BD is selected because Gate BC chose the source-owned same-stack ISO
`DeltaLw` holdout-count closure lane as the next narrow target. Gate BD
should define exactly what counts toward the two-missing-holdout
shortfall without ingesting source text or moving runtime values.

Gate BD order completed:

1. Add
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bd-steel-floor-formula-same-stack-iso-delta-lw-holdout-closure-contract.test.ts`
   and a helper if the holdout-closure boundary needs one.
2. Use only Gate BC's selected holdout-count closure lane as input;
   paired-negative, open-web, and field/building lanes remain follow-up
   blockers.
3. Define the evidence requirements for the two additional source-owned
   same-stack ISO lab `DeltaLw` holdouts: source-owned metric value,
   same-stack steel reference, ISO lab basis, all Gate AT/AK owner
   fields, paired negative-boundary ownership, and rights-safe locator
   metadata.
4. Keep accepted holdout-closure evidence as residual-readiness evidence
   only; no exact-source promotion, formula retune, tolerance movement,
   or runtime movement.
5. Preserve exact-source precedence, lab/field/building basis separation,
   and all current runtime pins.

Gate BD result:

- only Gate BC's selected
  `same_stack_iso_delta_lw_holdout_count_closure` lane can feed
  holdout-closure evidence;
- the closure boundary requires two additional source-owned same-stack
  ISO lab `DeltaLw` holdouts with measured metric value, same-stack
  steel reference, ISO lab basis, all Gate AT/AK owner fields, paired
  negative-boundary ownership, and rights-safe locator metadata;
- complete future closure packets count only as residual-readiness
  evidence and do not become exact rows, runtime ingestion, tolerance
  movement, or formula retune input;
- missing metric value, missing paired negative-boundary owner, missing
  locator metadata, wrong basis/reference, product/inferred values, and
  rights-blocked packets remain rejected;
- Gate BD selects paired negative-boundary closure as Gate BE because
  the holdout-count future probe can close the two-holdout shortfall
  while paired negative boundaries remain short by 3;
- `Ln,w 55.6`, `DeltaLw 22.4`, `+/-4.5 dB` `Ln,w`, and `+/-2.0 dB`
  `DeltaLw` remain unchanged.

Gate BD validation result:

Focused Gate BD validation completed on 2026-05-08. Gate BD passed 1 file
/ 9 tests, focused Gate BC/BD continuity passed 2 files / 17 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 336 files / 1929 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate BD
has no runtime/API/UI surface change.

Non-goals for Gate BD:

- no broad source crawl;
- no source text or document ingestion;
- no exact-source promotion;
- no tolerance tightening or widening;
- no formula retune;
- no field/building alias;
- no runtime value movement.

## Consumed Gate BE Implementation Order - Steel-Floor Same-Stack ISO DeltaLw Paired Negative Closure

Gate BE is selected because Gate BD defined the two-additional-holdout
closure boundary and the next ranked blocker remains paired negative
boundaries. Gate BE should define what counts toward the three-missing
paired-negative shortfall without ingesting source text, broad-crawling,
or moving runtime values.

Gate BE order completed:

1. Add
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-be-steel-floor-formula-same-stack-iso-delta-lw-paired-negative-closure-contract.test.ts`
   and a helper if the paired-negative closure boundary needs one.
2. Use Gate BD's landed holdout-closure contract as input; the selected
   next lane must be `paired_negative_boundary_closure`.
3. Define the evidence requirements for three additional source-owned
   paired negative boundaries: same target metric family, explicit
   wrong-support or wrong-reference boundary, ISO lab basis owner, all
   owner fields needed to prove the boundary is not a valid same-stack
   steel holdout, and rights-safe locator metadata.
4. Keep accepted paired-negative evidence as residual-policy readiness
   evidence only; no exact-source promotion, formula retune, tolerance
   movement, or runtime movement.
5. Preserve exact-source precedence, lab/field/building basis separation,
   source-absent steel formula pins, and Gate BD holdout-count closure
   requirements.

Gate BE result:

- only Gate BD's selected `paired_negative_boundary_closure` lane can
  feed paired-negative closure evidence;
- the closure boundary requires three additional source-owned paired
  negatives with target metric family, ISO lab basis, explicit wrong-
  support or wrong-reference boundary, boundary identity, same-stack
  steel exclusion reason, not-holdout scope, and rights-safe locator
  metadata;
- complete future closure packets count only as residual-policy
  readiness evidence and do not become exact rows, runtime ingestion,
  tolerance movement, or formula retune input;
- missing owner fields, missing locator metadata, wrong basis/metric
  family, product/inferred values, rights-blocked packets, non-explicit
  boundaries, and same-stack steel non-boundaries remain rejected;
- Gate BE selects open-web formula input ownership closure as Gate BF
  because the paired-negative future probe can close the three-boundary
  shortfall while source-owned open-web formula inputs remain missing;
- `Ln,w 55.6`, `DeltaLw 22.4`, `+/-4.5 dB` `Ln,w`, and `+/-2.0 dB`
  `DeltaLw` remain unchanged.

Gate BE validation result:

Focused Gate BE validation completed on 2026-05-08. Gate BE passed 1 file
/ 10 tests, focused Gate BD/BE continuity passed 2 files / 19 tests,
engine typecheck passed, engine DTS build passed, and full
`pnpm calculator:gate:current` passed with engine 337 files / 1939 tests,
web 66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Broad `pnpm check` was not rerun because Gate BE
has no runtime/API/UI surface change.

Non-goals for Gate BE:

- no broad source crawl;
- no source text or document ingestion;
- no exact-source promotion;
- no tolerance tightening or widening;
- no formula retune;
- no field/building alias;
- no runtime value movement.

## Consumed Gate BI Implementation Order - Steel-Floor Same-Stack ISO DeltaLw Tighten-Candidate Governance

Gate BI was selected because Gate BH revalidated the closed owner map as
a policy-only `tighten` candidate while still blocking runtime/tolerance
movement. Gate BI must decide what governance evidence is required before
that candidate can become an actual corridor-tightening plan.

Gate BI order completed:

1. Add
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bi-steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance-contract.test.ts`
   and a helper if the governance decision needs one.
2. Use Gate BH's landed closed-owner revalidation contract as input; the
   selected next signal must be the `tighten` policy-only candidate, not
   a runtime action.
3. Define the extra evidence required before tolerance movement is
   allowed: measured-residual packet ownership, independence from the
   closure fixture probes, same-stack steel topology diversity, source
   rights/citation posture, exact-source precedence boundaries, and
   lab/field/building basis separation.
4. Keep the current `+/-2.0 dB DeltaLw` and `+/-4.5 dB Ln,w` corridors
   unchanged unless a later gate owns a measured tightening decision.
5. Preserve Gate BH's closed owner map and make every acceptance/reject
   reason visible for future agents.
6. Select `personal_use_mvp_coverage_sprint_after_gate_bi` and the
   Gate A scenario matrix as the next lane if all governance boundaries
   hold.

Gate BI must not expand into another source acquisition or residual
policy chain. Its value is to safely exit the narrow steel corridor and
clear the path for broad calculator coverage work.

Gate BI validation result:

Focused Gate BI validation completed on 2026-05-08. Gate BI passed 1
file / 7 tests, focused Gate BH/BI continuity passed 2 files / 15
tests, focused Gate BD/BE/BF/BG/BH/BI closure continuity passed 6 files
/ 52 tests, engine typecheck passed, engine build/DTS passed, and full
`pnpm calculator:gate:current` passed with engine 341 files / 1972
tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Known warnings were the existing
Zustand unavailable test-storage warnings and optional sharp package
resolution warnings during web build. Broad `pnpm check` was not rerun
because Gate BI has no runtime/API/UI surface change.

## Next Implementation Order - Personal-Use MVP Coverage Sprint Gate T Opening/Leak Composite Surface Parity

Gate S has landed the opening/leak composite runtime corridor for
complete element-lab lab `Rw` requests. The engine now promotes the Gate
R area-energy formula at runtime, returns the pinned `Rw 38.2` fixture,
surfaces `gate_s_opening_leak_composite_area_energy_runtime_corridor`,
and blocks `STC`, `R'w`, `DnT,w`, field, and building outputs unless a
later adapter explicitly owns them. Source-absent unbudgeted, STC-only,
missing, duplicate, excessive, and non-lab opening inputs fail closed
instead of returning host-wall `Rw` as a supported answer.

Gate T target:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-t-opening-leak-composite-surface-parity-contract.test.ts`

Gate T action:

`gate_t_personal_use_mvp_opening_leak_composite_surface_parity_plan`

Gate T order:

1. Add the Gate T surface-parity contract test for the opening/leak
   composite runtime corridor.
2. Verify route/output card, API payload, saved replay, scenario
   analysis, and Markdown/report surfaces show the same lab `Rw 38.2`,
   `gate_s_opening_leak_composite_area_energy_runtime_corridor` method,
   `family_physics_prediction` origin, and `+/-6 dB` budget that the
   engine result exposes.
3. Keep unsupported basis boundaries visible: `STC`, `R'w`, `DnT,w`,
   field, and building outputs must remain unsupported with clear
   warnings rather than aliasing lab `Rw` or opening element values.
4. Verify missing/hostile input visibility for missing opening physical
   fields, duplicate openings, excessive area, source-absent unbudgeted
   values, and STC-only opening basis. These should show
   `needs_input` / `unsupported` posture through every visible surface.
5. Do not add a field/building/STC adapter in Gate T. If a later adapter
   is selected, write it as a separate Gate U plan with its own formula,
   owners, evidence, and tests.
6. Validate focused Gate T, Gate S/R/Q/P/O/N/M/L continuity, Gate
   G/H/I/J/K wall continuity, current-gate runner, and `git diff
   --check`.

## Consumed Gate S Implementation Order - Personal-Use MVP Coverage Sprint Opening/Leak Composite Runtime Corridor

Gate S status:

`gate_s_personal_use_mvp_opening_leak_composite_runtime_corridor_landed_selected_surface_parity_gate_t`

Gate S selected Gate T action:

`gate_t_personal_use_mvp_opening_leak_composite_surface_parity_plan`

Gate S selected Gate T file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-t-opening-leak-composite-surface-parity-contract.test.ts`

Gate R has landed the opening/leak composite transmission-loss formula
corridor as no-runtime. It defines a source-absent area-energy lab `Rw`
design corridor for host wall plus openings, explicit seal/leakage
penalties, a visible `+/-6 dB` design budget, and strict negative
boundaries for `STC`-only opening basis, field/building leakage, missing
owners, source-absent unbudgeted opening values, and hostile opening
inputs.

Gate S target:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-s-opening-leak-composite-transmission-loss-runtime-corridor-contract.test.ts`

Gate S action:

`gate_s_personal_use_mvp_opening_leak_composite_transmission_loss_runtime_corridor_plan`

Gate S order:

1. Add the Gate S runtime-corridor contract test and runtime helper
   integration for the Gate R lab `Rw` formula corridor.
2. Promote only complete, explicitly owned, element-lab opening/leak
   composite cases to runtime. The promoted runtime value must use the
   Gate R area-energy formula, host-wall candidate `Rw`, opening area
   ratio, opening rating basis, and seal/leakage penalty.
3. Keep exact measured/source host-wall rows ahead of the formula when
   they truly exact-match the complete assembly. Opening element rows
   remain terms, not host-wall replacements.
4. Keep `STC`, `R'w`, `DnT,w`, field context, and building-prediction
   outputs blocked unless Gate S adds an explicit owned adapter for each
   basis. Do not copy lab `Rw` or opening element values into field or
   building metrics.
5. Surface the formula origin, `+/-6 dB` budget, opening/leak composite
   support label, and missing-input messages through engine result,
   support trace, cards/report/API payloads if Gate S touches visible
   runtime surfaces.
6. Preserve Gate Q/R hostile-input behavior: missing physical fields,
   missing owners, duplicate openings, excessive area, zero/negative
   area/count, `STC`-only basis, source-absent unbudgeted values, and
   unsafe context aliases must stay non-runtime.
7. Pin at least one complete numeric runtime case. Current Gate R
   design fixture is host wall `Rw 55`, 12 m2 host area, 1.8 m2 average
   sealed-class door with `Rw 32`, expected composite design `Rw 38.2`
   before runtime promotion. Gate S must prove this value only when all
   owners are complete.
8. Validate with focused Gate S, Gate R/Q/P/O/N/M/L continuity, Gate
   G/H/I/J/K wall continuity, current-gate runner, and `git diff
   --check`.

## Consumed Gate R Implementation Order - Personal-Use MVP Coverage Sprint Opening/Leak Composite Formula Corridor

Gate Q landed the opening/leak composite transmission-loss input
contract as no-runtime. Gate R consumed the next step and defined the
formula corridor without moving runtime values.

Gate R order completed:

1. Added
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-r-opening-leak-composite-transmission-loss-formula-corridor-contract.test.ts`.
2. Added
   `packages/engine/src/dynamic-airborne-gate-r-opening-leak-composite-transmission-loss-formula-corridor.ts`.
3. Defined the area-energy composite TL formula corridor:
   host-wall and opening transmission coefficients are area-weighted and
   converted back to lab `Rw`.
4. Defined explicit seal/leakage penalties: `sealed: 0 dB`,
   `average: 2 dB`, `leaky: 6 dB`, `open_gap: 12 dB`.
5. Added the `+/-6 dB` source-absent design budget for lab `Rw` and
   kept it labelled as not measured evidence.
6. Preserved exact-source precedence, host-wall candidate precedence,
   no-runtime behavior, safe reorder invariance, and lab/field/building
   separation.
7. Blocked missing Gate Q physical inputs, missing formula owners,
   `STC`-only opening basis, source-absent opening values without a
   budget owner, building-prediction target leakage, duplicate openings,
   excessive area, and zero/negative area/count.
8. Selection status:
   `gate_r_personal_use_mvp_opening_leak_composite_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_s`.
9. Selected Gate S:
   `gate_s_personal_use_mvp_opening_leak_composite_transmission_loss_runtime_corridor_plan`.
10. Validation completed on 2026-05-11: focused Gate R passed 1 file /
    6 tests; Gate R/Q/P/O/N/M/L plus Gate G/H/I/J/K continuity passed
    12 files / 71 tests; final `pnpm calculator:gate:current` passed
    with engine 359 files / 2080 tests, web 71 files / 306 passed + 18
    skipped, repo build 5/5 successful, and whitespace guard clean.

## Consumed Gate Q Implementation Order - Personal-Use MVP Coverage Sprint Opening/Leak Composite Input Contract

Gate P landed the airborne building-prediction runtime-corridor decision
as no-runtime. Gate Q consumed the next lower basis-risk, high-coverage
wall calculator gap: openings, leakage, and composite area transmission
loss.

Gate Q order completed:

1. Added
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-q-opening-leak-composite-transmission-loss-input-contract.test.ts`.
2. Added
   `packages/engine/src/dynamic-airborne-gate-q-opening-leak-composite-transmission-loss-input-contract.ts`.
3. Added shared schema fields in
   `packages/shared/src/domain/airborne-context.ts` and
   `packages/shared/src/domain/input-completeness.ts` for
   `hostWallAreaM2`, `openingAreaM2`, `openingElementRwDb`,
   `openingRatingBasis`, `openingSealLeakageClass`, `openingCount`, and
   `openingOrigin`.
4. Kept Gate Q no-runtime. Complete opening inputs are
   `ready_for_formula_corridor`, but `Rw`, `STC`, `R'w`, and `DnT,w`
   host-wall/building values do not move.
5. Preserved exact-source precedence, host-wall candidate precedence,
   leakage-input honesty, and lab/field/building separation.
6. Covered missing physical fields, unknown rating/seal classes,
   excessive area, duplicate openings, zero/negative area/count, safe
   reorder invariance, and many-layer host-wall stability.
7. Selection status:
   `gate_q_personal_use_mvp_opening_leak_composite_input_contract_landed_no_runtime_selected_formula_corridor_gate_r`.
8. Selected Gate R:
   `gate_r_personal_use_mvp_opening_leak_composite_transmission_loss_formula_corridor_plan`.
9. Validation completed on 2026-05-11: focused Gate Q passed 1 file /
   6 tests; Gate Q/P/O/N/M/L plus Gate G/H/I/J/K continuity passed 11
   files / 65 tests; final `pnpm calculator:gate:current` passed with
   engine 358 files / 2074 tests, web 71 files / 306 passed + 18
   skipped, repo build 5/5 successful, and whitespace guard clean.
   Final standalone `git diff --check` passed after this validation-note
   sync.

## Consumed Gate P Implementation Order - Personal-Use MVP Coverage Sprint Airborne Building-Prediction Runtime Corridor

Gate O has landed the no-runtime building-prediction formula corridor:
airborne `building_prediction` now has complete physical inputs,
metric-basis adapter owners, named formula terms, alias blockers, and a
`+/-9 dB` source-absent design budget. Complete requests still select
`unsupported` until Gate P decides whether runtime promotion is
defensible from owned curve/path/room terms.

Gate P order completed:

1. Add
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-p-airborne-building-prediction-runtime-corridor-contract.test.ts`.
2. Re-read Gate I/J/K/L/M/N/O contracts,
   `dynamic-airborne-gate-o-building-prediction-formula-corridor.ts`,
   `dynamic-airborne-gate-n-building-prediction-runtime-adapter.ts`,
   `dynamic-calculator-candidate-resolver-runtime.ts`,
   `apply-airborne-context.ts`, `curve-rating.ts`, `calculate-assembly.ts`,
   workbench field/building cards, report/API payloads, and ISO 12354-1
   basis notes before changing runtime behavior. Also keep the
   2026-05-11 INSUL / ISO refresh above in scope: public INSUL flanking
   behavior is a cautionary boundary, not permission to ship a heuristic
   building metric.
3. Build the Gate P test as a promotion decision table with two explicit
   branches:
   `runtime_promoted_with_owned_formula_terms` and
   `runtime_blocked_formula_terms_not_owned`. The current expected
   branch is blocked unless implementation proves every term below is
   executable.
4. Runtime can promote only if the implementation can produce a named
   building-prediction basis from:
   direct separating-element frequency curve, conservative flanking path
   energy combination, junction vibration reduction / coupling length,
   room standardization, and visible `+/-9 dB` error budget. Each term
   must appear in the dynamic trace or method dossier; hidden
   coefficients are not acceptable for personal-use readiness.
5. If Gate P promotes, add numeric assertions for `R'w` and `DnT,w`,
   selected candidate id, basis/origin, warning copy,
   supported/unsupported output parity, exact-source precedence,
   lab/field/building separation, and hostile edits. It must not reuse
   Gate I selected candidate ids or present the value as measured
   evidence.
6. If Gate P cannot promote without overclaiming the current heuristic
   overlay, keep complete requests `unsupported`, keep the Gate N method
   and Gate O formula-corridor dossier, keep `proposedRuntimeEstimateDb:
   null`, and select the next highest-ROI personal-use coverage lane.
   Gate P selected opening/leak composite transmission-loss input
   ownership because it improves common wall calculator coverage with
   lower basis-leakage risk than airborne building flanking.
7. Preserve Gate G/H/I/K/M/N/O numeric and posture pins: grouped
   triple-leaf, lined massive/masonry, CLT, field-context values,
   precise Gate M `needs_input`, Gate N formula-owner blockers, and
   Gate O `proposedRuntimeEstimateDb: null` contract must stay stable
   unless Gate P explicitly owns a runtime transition.
8. Run focused Gate P validation, Gate O/N/M/L continuity, Gate I/J/K
   field continuity, relevant web/API/report tests if selected candidate
   or visible posture changes, `pnpm calculator:gate:current`, and
   `git diff --check`.

Gate P landed execution summary:

1. Added
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-p-airborne-building-prediction-runtime-corridor-contract.test.ts`.
2. Added
   `packages/engine/src/dynamic-airborne-gate-p-building-prediction-runtime-corridor.ts`
   for the Gate P plan id, no-runtime selection status, term blocker
   table, corridor decisions, and Gate Q selection constants.
3. Gate P kept the selected runtime branch at
   `runtime_blocked_formula_terms_not_owned`; both `R'w` and `DnT,w`
   retain `proposedRuntimeEstimateDb: null` and
   `candidate_dynamic_unsupported`.
   Selection status:
   `gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_closed_no_runtime_selected_opening_leak_composite_gate_q`.
4. Direct separating-element curve ownership, flanking path energy,
   junction/coupling, room standardization, and the `+/-9 dB` budget all
   remain explicit blockers before building runtime can move.
5. Gate P preserved exact-source precedence and lab/field/building alias
   boundaries. Gate I field values stay live; Gate P does not copy them
   into `building_prediction`.
6. Gate P selected:
   `gate_q_personal_use_mvp_opening_leak_composite_transmission_loss_input_contract_plan`.
7. Runtime guard detail: explicit `building_prediction` requests with
   `buildingPredictionOutputBasis` now keep unsupported `R'w` / `DnT,w`
   out of supported outputs and out of diagnostic metrics; legacy
   field-style continuation snapshots without that explicit output basis
   stay on their existing guarded route.
8. Validation completed on 2026-05-11: focused Gate P passed 1 file / 6
   tests; Gate P/O/N/M/L plus Gate I/J/K continuity passed 8 files / 44
   tests; final `pnpm calculator:gate:current` passed with engine 357
   files / 2068 tests, web 71 files / 306 passed + 18 skipped, and repo
   build 5/5 successful. `git diff --check` must be rerun after this
   validation-note sync.

## Consumed Gate O Implementation Order - Personal-Use MVP Coverage Sprint Airborne Building-Prediction Formula Corridor

Gate N landed the no-runtime building-prediction runtime adapter
boundary: airborne `building_prediction` had complete physical inputs,
metric-basis adapter owners, and named missing ISO 12354-1 flanking
formula terms. Complete requests still selected `unsupported` until a
later gate owned a defensible formula corridor. Gate O defined the
formula corridor without aliasing Gate I field/apparent values or lab
`Rw` / `STC` values onto building metrics.

Gate O order completed:

1. Added
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-o-airborne-building-prediction-formula-corridor-contract.test.ts`.
2. Re-read Gate I/J/K/L/M/N contracts,
   `dynamic-calculator-route-input-topology.ts`,
   `dynamic-calculator-candidate-resolver-runtime.ts`,
   `dynamic-airborne-gate-n-building-prediction-runtime-adapter.ts`,
   `apply-airborne-context.ts`, `calculate-assembly.ts`, workbench
   field/building cards, report/API payloads, and ISO 12354-1 basis
   notes before changing behavior.
3. Decided the formula-corridor threshold. Gate O defines source-absent
   formula terms and `+/-9 dB` budgets, but runtime promotion remains
   forbidden until Gate P owns the selected candidate and value movement.
4. Kept complete requests `unsupported`, preserved the Gate N method and
   warning, and selected Gate P runtime-corridor decision rather than
   presenting the current heuristic overlay as a building runtime.
5. Added no numeric runtime assertions in Gate O; it pins
   `proposedRuntimeEstimateDb: null`, basis/origin boundaries, tolerance
   budgets, exact-source precedence, lab/field/building separation, and
   nearby negative cases.
6. Preserved Gate G/H/I/K/M/N numeric and posture pins: grouped
   triple-leaf, lined massive/masonry, CLT, field-context values,
   precise Gate M `needs_input`, and Gate N formula-owner blockers stay
   stable.
7. Selected Gate P:
   `gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_plan`.

## Consumed Gate N Implementation Order - Personal-Use MVP Coverage Sprint Airborne Building-Prediction Runtime Adapter

Gate M landed the no-runtime input contract: airborne
`building_prediction` had a complete physical owner set, but complete
requests still selected `unsupported` until the ISO 12354-1
flanking/runtime adapter owned a formula. Gate N defined that first
runtime adapter boundary without aliasing Gate I field/apparent values or
lab `Rw` / `STC` values onto building metrics.

Gate N order completed:

1. Added
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-n-airborne-building-prediction-runtime-adapter-contract.test.ts`.
2. Re-read Gate I/J/K/L/M contracts, `dynamic-calculator-route-input-topology.ts`,
   `dynamic-calculator-candidate-resolver-runtime.ts`,
   `apply-airborne-context.ts`, `calculate-assembly.ts`, workbench
   field/building cards, report/API payloads, and current ISO 12354-1
   basis notes before changing behavior.
3. Defined the minimum no-value-movement runtime adapter owner set:
   flanking transmission adapter owner, apparent building metric basis
   owner, standardized building metric basis owner, source-room volume,
   receiving-room volume/RT60, junction class, conservative flanking
   assumption, junction coupling length, building output basis, direct
   separating-element frequency curve owner, flanking path transmission
   terms owner, junction vibration reduction index owner, room
   absorption normalization owner, and uncertainty-budget owner.
4. Kept Gate N as a no-runtime adapter-readiness gate. Complete requests
   remain `unsupported`; the exact missing runtime owner set is now
   visible in the selected basis.
5. Preserved exact-source precedence, lab/field/building separation,
   Gate G/H/I/K numeric pins, and Gate M precise `needs_input` behavior.
6. Added visible warning/basis assertions because the unsupported method
   and warning changed from the Gate M runtime placeholder to the Gate N
   runtime-adapter owner boundary.
7. Selected Gate O:
   `gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_plan`.

## Consumed Gate M Implementation Order - Personal-Use MVP Coverage Sprint Airborne Building-Prediction Input Contract

Gate L landed the no-runtime boundary: airborne `building_prediction`
was parked as `needs_input` until flanking/junction ownership and a
conservative flanking assumption were explicit. Gate M defined the first
complete building-prediction input contract without promoting numeric
building-prediction runtime.

Gate M order completed:

1. Added
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-m-airborne-building-prediction-input-contract.test.ts`.
2. Re-read Gate I/J/K/L contracts, `dynamic-calculator-route-input-topology.ts`,
   `apply-airborne-context.ts`, `calculate-assembly.ts`, workbench
   field/building cards, report/API payloads, and current ISO 12354
   basis notes before changing behavior.
3. Defined the minimum complete owner set for airborne building
   prediction: separating element area, source-room volume, receiving
   room geometry or basis owner, receiver absorption/reverberation basis,
   flanking/junction class, conservative flanking assumption, junction
   coupling length, and building output basis for apparent versus
   standardized building metrics.
4. Asserted that partial owner sets remain `needs_input` with exact
   fields and that complete owner sets still do not promote runtime
   until a later solver/adapter gate owns the formula.
5. Kept Gate I/J/K `field_between_rooms` values and Gate L parked
   building cards stable while adding only contract metadata and
   missing-input readiness.
6. Preserved exact-source precedence, lab/field/building separation, and
   all Gate G/H/I/K numeric pins.
7. Selected Gate N:
   `gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_plan`.
8. Validated with focused Gate M, Gate L continuity, Gate I/J/K
   continuity, Gate K route-input continuity, focused workbench
   building/field input surfaces, engine/web typechecks, final
   `pnpm calculator:gate:current`, and `git diff --check`.

## Consumed Gate K Implementation Order - Personal-Use MVP Coverage Sprint Airborne Field-Context Input Surface

Gate J landed surface parity for the Gate I field/apparent airborne
basis. Gate K made those physical field-context inputs first-class in
the Dynamic Calculator workbench so the user can enter them intentionally
and see exact missing-input prompts before the engine blocks.

Gate K order completed:

1. Added
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-k-airborne-field-context-input-surface-contract.test.ts`.
2. Re-read Gate I/J contracts, `scenario-analysis.ts`, workbench route
   controls, estimate API request shape, and report replay before
   changing the UI.
3. Added `apps/web/features/workbench/airborne-field-context-input-surface.ts`
   for route mode `field_between_rooms`, panel width/height,
   receiving-room volume, RT60, and optional airtightness.
4. Asserted complete UI-derived lined massive/masonry, CLT, and grouped
   triple-leaf field contexts feed the same Gate I runtime values and
   Gate J surface basis.
5. Asserted partial UI fields produce precise `needs_input` warnings for
   missing physical fields and do not show a Gate I budget.
6. Asserted saved replay, calculator API payload, Markdown report, and
   hostile edits preserve the same field context rather than silently
   falling back to lab `Rw` / `STC`.
7. Kept building-prediction/flanking explicit and out of scope until a
   later owner lands.
8. Selected Gate L:
   `gate_k_personal_use_mvp_airborne_field_context_input_surface_landed_selected_building_prediction_boundary_gate_l`.

## Consumed Gate J Implementation Order - Personal-Use MVP Coverage Sprint Airborne Field-Context Surface Parity

Gate I has landed airborne field-context continuation for already-owned
lab family routes. Complete `field_between_rooms` requests now carry a
field/apparent family-physics basis for grouped mineral-wool
triple-leaf, lined massive/masonry, and CLT/mass-timber wall families
without relabelling lab `Rw` / `STC`. The next risk is surface parity:
the values, basis, warning, and candidate posture must be visible in the
same way across calculator cards, APIs, snapshots, and reports.

Gate J order completed:

1. Add
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-j-airborne-field-context-surface-parity-contract.test.ts`.
2. Re-read the Gate I contract, workbench route-card/output-card
   mappers, estimate API payload assembly, saved scenario replay, and
   report payload builders before changing UI/API behavior.
3. Assert complete field-context grouped, lined massive/masonry, and
   CLT/mass-timber examples show the same `R'w` / `DnT,w` values,
   `candidate_airborne_field_context_family_physics_prediction`, method
   `gate_i_airborne_field_apparent_context_adapter_runtime`, warning,
   and uncalibrated field uncertainty posture across visible surfaces.
4. Assert missing field context still shows precise `needs_input`
   prompts and no Gate I field budget.
5. Assert building-prediction/flanking remains out of scope and lab
   `Rw` / `STC` cards are not relabelled as field metrics.
6. Preserve exact-source precedence and all Gate G/H/I numeric pins.
7. Run focused Gate J validation, Gate I continuity, web/API/report
   parity where touched, engine/web typecheck as needed, final
   `pnpm calculator:gate:current`, and `git diff --check`.

## Consumed Gate I Implementation Order - Personal-Use MVP Coverage Sprint Airborne Field-Context Continuation

Gate H has landed lined massive/masonry and CLT wall lab
family-physics origin promotion without numeric retuning. The highest
ROI next lane is Gate I: a narrow airborne field/apparent continuation
for already-owned lab family routes, with explicit physical context and
strict lab/field separation.

Gate I order completed:

1. Add
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-i-airborne-field-context-continuation-contract.test.ts`.
2. Re-read `packages/engine/src/dynamic-airborne.ts`,
   `packages/engine/src/dynamic-calculator-route-input-topology.ts`,
   `packages/shared/src/domain/airborne-context.ts`, the Gate X/Z
   field-output contracts, and the Gate G/H negative field-output cases
   before changing runtime behavior.
3. Build an executable matrix for complete and incomplete airborne
   field contexts over already-owned lab routes: grouped multi-cavity /
   triple-leaf, lined massive/masonry, CLT/mass-timber, and a simple
   massive-panel continuity case.
4. Require physical field context explicitly: `contextMode`,
   partition area or panel dimensions, receiving-room volume, receiving
   room RT60, and a named field-output basis. Missing fields must return
   `needs_input` with exact field ids.
5. Do not relabel lab `Rw` / `STC` as `R'w` / `DnT,w`. If Gate I
   promotes runtime values, it must name the adapter, basis, and
   uncertainty budget separately from the lab family solver. If the
   evidence is not enough, Gate I should land as a no-runtime boundary
   contract.
6. Keep building-prediction and flanking outputs blocked unless
   junction/flanking ownership is explicit. Keep low-frequency,
   `DnT,50`, and unrelated floor-impact field metrics outside the lane.
7. Preserve exact-source precedence and Gate G/H lab value pins:
   grouped walls `Rw 50 / STC 55` and `Rw 55 / STC 56`, lined massive
   `Rw 60 / STC 60`, and CLT `Rw 42 / STC 42`.
8. Run focused Gate I validation, Gate G/H field-negative continuity,
   engine typecheck, final `pnpm calculator:gate:current`, and
   `git diff --check`.
9. Status:
   `gate_i_personal_use_mvp_airborne_field_context_continuation_landed_selected_field_surface_parity_gate_j`.
10. Selected Gate J file:
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-j-airborne-field-context-surface-parity-contract.test.ts`.
11. Selected Gate J action:
   `gate_j_personal_use_mvp_airborne_field_context_surface_parity_plan`.

## Consumed Gate H Implementation Order - Personal-Use MVP Coverage Sprint Lined Masonry / CLT Wall Upgrade

Gate G has landed the generalized grouped wall multi-cavity /
triple-leaf route-readiness contract. Complete grouped mineral-wool
triple-leaf walls now route by explicit topology and physical
completeness rather than old fixture gates, while ambiguous and hostile
inputs fail closed. The highest-ROI next gap is Gate H: lined
massive/masonry and CLT walls are common personal-use wall assemblies,
but they still sit below the desired formula/runtime confidence lane.

Gate H order completed:

1. Add
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts`.
2. Re-read `packages/engine/src/airborne-calculator.ts`,
   `packages/engine/src/dynamic-airborne.ts`, current lined wall /
   mass-law helpers, CLT/timber wall handling, and the Gate A matrix
   rows `wall.lined_massive_masonry.lab` and `wall.clt_mass_timber.lab`
   before changing route behavior.
3. Build an executable matrix for lined massive/masonry leaf + lining
   inputs, CLT/mass-timber wall inputs, missing lining/cavity/connection
   fields, exact-source precedence, triple-leaf negative boundaries, and
   field/apparent output non-aliasing.
4. Promote only explicit complete physical input to an owned
   family-physics/formula corridor. Partial lined-wall or CLT input must
   return `needs_input` with exact missing fields instead of borrowing
   triple-leaf or generic source rows.
5. Keep lab `Rw` / `STC` distinct from `R'w` / `DnT,w`, and do not
   turn CLT or lined massive wall estimates into field/building outputs
   until a field-context owner exists.
6. Preserve Gate G mineral-wool route pins, exact source precedence,
   and duplicate/out-of-range topology guards while adding the new lane.
7. Select Gate I from the coverage matrix after Gate H lands; likely
   candidates are field/building context continuation or the next broad
   wall/floor family gap, not steel-floor tolerance tightening unless
   new source-owned same-stack ISO `DeltaLw` evidence appears.
8. Run focused Gate H validation, Gate A/G/H coverage-sprint continuity,
   related airborne/topology regressions, final
   `pnpm calculator:gate:current`, and `git diff --check`.
9. Validation completed on 2026-05-10: focused Gate H passed 1 file / 7
   tests; Gate A/G/H plus Gate O CLT continuity passed 4 files / 26
   tests; Gate P CLT continuity plus dynamic-airborne split line-count
   guard passed 2 files / 10 tests; engine typecheck passed; final
   `pnpm calculator:gate:current` passed with engine 349 files / 2024
   tests, web 68 files / 294 passed + 18 skipped, repo build 5/5
   successful, and whitespace guard clean. The build still emits the
   known optional `sharp/@img` warnings through the DOCX route. `git
   diff --check` passed after validation-result doc updates.

## Consumed Gate G Implementation Order - Personal-Use MVP Coverage Sprint Generalized Wall Multicavity Route Readiness

Gate G was selected by landed Gate F. It proved physically complete
grouped multi-cavity / triple-leaf walls route by topology and physical
completeness, not by old fixture-specific gates.

Gate G order completed:

1. Added
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-g-generalized-wall-multicavity-route-readiness-contract.test.ts`.
2. Re-read `packages/engine/src/airborne-calculator.ts`,
   `packages/engine/src/dynamic-airborne.ts`, current grouped
   triple-leaf tests, and the Dynamic Calculator route/topology helpers
   before changing route behavior.
3. Built an executable matrix for complete grouped multi-cavity walls,
   unequal two-cavity depths, safe reorder variants, duplicate and
   ambiguous leaves, missing leaf grouping, lined-massive/CLT negative
   boundaries, field-output requests, and exact-source precedence.
4. Preserved complete grouped mineral-wool value pins:
   `Rw 50 / STC 55` for the owned 50/50 case and `Rw 55 / STC 56` for
   the non-50/50 construction-image topology.
5. Added grouped topology validation so duplicate/overlapping or
   out-of-range layer ownership cannot promote through the two-cavity
   solver.
6. Added route-input prompts for grouped fill/absorber precision while
   preserving the existing seven-field flat-list ambiguity contract.
7. Kept `Rw`, `STC`, `R'w`, `DnT,w`, lab, field, and
   building-prediction bases separated, and preserved exact-source
   precedence.
8. Selected Gate H lined massive/masonry and CLT wall upgrade from the
   coverage matrix.

## Consumed Gate F Implementation Order - Personal-Use MVP Coverage Sprint Timber/CLT Floor Impact DeltaLw Input Surface

Gate F was selected by landed Gate E. Gate E proved that explicit engine
predictor input surfaces honestly on cards, traces, dossiers, reports,
and APIs. Gate F made the same timber/CLT physical fields enter through
the first-class Dynamic Calculator floor input surface and snapshot
bridge.

Gate F order completed:

1. Added
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-f-timber-clt-floor-impact-delta-lw-input-surface-contract.test.ts`.
2. Added `packages/engine/src/timber-clt-delta-lw-input-surface.ts` and
   exported its contract helpers from the engine package.
3. Extended workbench timber/CLT floor controls for structural support
   type, impact system type, load basis, resilient dynamic stiffness,
   upper floating/topping mass, base overrides, and lower assembly.
4. Wired live workbench evaluation, local saved replay, server snapshot
   replay, calculator API payload, and impact-only API payload to feed
   the same predictor input as Gate D/E.
5. Pinned complete UI-derived timber input at exact `Ln,w 51` plus
   formula `DeltaLw 25.2`; complete UI-derived CLT input at family
   `Ln,w 50` plus formula `DeltaLw 22.6`.
6. Preserved partial-input parking with precise missing fields and no
   `DeltaLw` budget.
7. Preserved exact-source precedence, field/ASTM non-aliasing,
   wrong-family steel boundaries, unsafe duplicate carrier guards, and
   safe reorder stability.
8. Selected Gate G generalized wall multicavity route readiness from the
   coverage matrix without tuning coefficients or adding source rows.
9. Validation completed on 2026-05-10 after post-doc revalidation:
   focused Gate F engine
   contract passed 1 file / 4 tests, focused Gate F web input-surface
   acceptance passed 1 file / 4 tests, Gate E/F engine continuity passed
   2 files / 8 tests, web Gate E/F/snapshot continuity passed 3 files /
   12 tests, engine typecheck passed, web typecheck passed, final
   `pnpm calculator:gate:current` passed with engine 347 files / 2009
   tests, web 68 files / 294 passed + 18 skipped, repo build 5/5
   successful, and whitespace guard clean. `git diff --check` passed.

## Consumed Gate E Implementation Order - Personal-Use MVP Coverage Sprint Timber/CLT Floor Impact DeltaLw Surface Parity

Gate E is selected by landed Gate D. Gate D moved runtime values for the
explicit complete timber/CLT `DeltaLw` corridor, so the next highest-risk
work is not another formula change. It is proving the same values, basis,
error budget, and blocked negatives appear across every calculator
surface a user will trust.

Gate E order:

1. Add
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-e-timber-clt-floor-impact-delta-lw-surface-parity-contract.test.ts`.
2. Assert output-card parity for explicit complete timber and CLT:
   timber exact `Ln,w 51` plus formula `DeltaLw 25.2`; CLT family
   `Ln,w 50` plus formula `DeltaLw 22.6`.
3. Assert dynamic trace and support notes expose the active
   timber/CLT `DeltaLw` formula corridor, the metric-specific basis, and
   the `+/-7.5 dB` source-absent error budget.
4. Assert Markdown report payload parity. The report must not present
   the formula budget as measured evidence and must not hide the
   `DeltaLw` metric basis.
5. Assert calculator API and impact-only API payload parity: numeric
   values, `metricBasis.DeltaLw`, `errorBudgets`, supported/unsupported
   target outputs, and warnings must match the engine result.
6. Re-run the negative surfaces: missing dynamic stiffness, missing load
   basis, missing topping/floating mass, missing lower assembly,
   `Ln,w`-only, ASTM `IIC` / `AIIC`, field requests, and wrong-family
   steel requests must remain `needs_input` or `unsupported` without a
   timber/CLT `DeltaLw` formula budget.
7. Selected Gate F from the visible parity result without tuning formula
   coefficients or adding source rows.
8. Validation completed on 2026-05-08: focused Gate E engine contract
   passed 1 file / 4 tests, focused Gate E web surface/API contract
   passed 1 file / 4 tests, Gate D/E continuity passed 2 files / 11
   tests, Gate BI/A/B/C/D/E continuity passed 6 files / 40 tests, web
   steel/timber parity continuity passed 3 files / 7 tests, engine
   typecheck passed, final `pnpm calculator:gate:current` passed with
   engine 346 files / 2005 tests, web 67 files / 290 passed + 18
   skipped, repo build 5/5 successful, and whitespace guard clean.
   `git diff --check` passed after the validation-result doc updates.

## Consumed Gate D Implementation Order - Personal-Use MVP Coverage Sprint Timber/CLT Floor Impact DeltaLw Runtime Corridor

Gate D was selected by the landed Gate C formula-corridor contract. Gate
C proved that the timber joist and mass-timber CLT `DeltaLw` routes had
named source-absent formula corridors, physical terms, support bucket
labels, source-absent design budgets, and negative boundaries while
runtime still kept `DeltaLw` unsupported.

Gate D order completed:

1. Added
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-d-timber-clt-floor-impact-delta-lw-runtime-corridor-contract.test.ts`.
2. Added
   `packages/engine/src/timber-clt-floor-impact-delta-lw-runtime-corridor.ts`.
3. Promoted only the complete explicit timber joist and CLT predictor
   lanes.
4. Calculated lab `DeltaLw` from load basis, dynamic stiffness,
   lower-assembly coupling, and structural-family correction; no value
   is derived from `Ln,w`, `IIC`, `AIIC`, or field/building outputs.
5. Pinned timber `DeltaLw 25.2` and CLT `DeltaLw 22.6`.
6. Kept `Ln,w` anchors on their own basis: timber exact `Ln,w 51` and
   CLT family `Ln,w 50`.
7. Added structured `+/-7.5 dB`
   `source_absent_formula_error_budget` payloads for `DeltaLw`.
8. Preserved missing-input, `Ln,w`-only, ASTM, field, steel-family, and
   exact-source precedence boundaries.
9. Validation completed on 2026-05-08: focused Gate D runtime contract
   passed 1 file / 7 tests; focused Gate B/C/D continuity passed 3 files
   / 22 tests; focused Gate BI/A/B/C/D continuity passed 5 files / 36
   tests; engine typecheck passed; final `pnpm calculator:gate:current`
   passed with engine 345 files / 2001 tests, web 66 files / 286 passed
   + 18 skipped, repo build 5/5 successful, and whitespace guard clean;
   `git diff --check` passed after the validation-result doc updates.

## Consumed Gate C Implementation Order - Personal-Use MVP Coverage Sprint Timber/CLT Floor Impact DeltaLw Formula Corridor

Gate C was selected by the landed Gate B input contract. Gate B proved
that complete timber joist and CLT/mass-timber physical inputs could be
recognized as formula-corridor-ready while current runtime kept
`DeltaLw` unsupported.

Gate C order completed:

1. Added
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-c-timber-clt-floor-impact-delta-lw-formula-corridor-contract.test.ts`.
2. Consumed Gate B positive cases and missing-input negatives. Complete
   timber joist and CLT routes are the only formula-corridor candidates;
   missing dynamic stiffness, load basis, topping/floating mass, or lower
   assembly stays `needs_input`.
3. Named the candidate formula bases before runtime movement:
   reference-floor handling, upper-treatment mass/dynamic-stiffness
   transfer, lower-assembly coupling, `+/-7.5 dB` source-absent
   design-budget components, and support bucket labels for timber joist
   and CLT separately.
4. Preserved current exact/source precedence: timber exact `Ln,w 51`
   remains exact for `Ln,w`, CLT family `Ln,w 50` remains family
   evidence, and neither value creates `DeltaLw`.
5. Kept ASTM `IIC` / `AIIC`, field `L'n,w` / `L'nT,w`, and building
   prediction blocked from lab `DeltaLw` aliasing.
6. Left a precise Gate D runtime proposal because Gate C stayed
   no-runtime.
7. Validation passed on 2026-05-08: focused Gate C 1 file / 7 tests,
   Gate B/Gate C continuity 2 files / 15 tests, Gate BI/Gate A/Gate
   B/Gate C continuity 4 files / 29 tests, engine typecheck, full
   `pnpm calculator:gate:current`, and whitespace guard.

## Consumed Gate B Implementation Order - Personal-Use MVP Coverage Sprint Timber/CLT Floor Impact DeltaLw

Gate B was selected by the landed Gate A matrix, not by source
availability alone. The selected matrix rows showed that timber and CLT
floors can already produce useful `Ln,w` posture in current routes, but
lab `DeltaLw` was unsupported for the common timber/CLT impact lane.

Gate B order completed:

1. Add
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts`
   and extend the Personal-Use MVP Coverage Sprint helper only as needed.
2. Consume Gate A evidence rows:
   `floor.timber_joist_impact.lab`,
   `floor.clt_mass_timber_impact.lab`, and
   `floor.complete_field_impact_context.lprime`.
3. Define the physical input contract for timber joist and CLT/mass
   timber `DeltaLw`: base system family, panel/joist depth or mass,
   resilient layer dynamic stiffness/load basis, topping/floating layer
   mass, ceiling/cavity/support isolation, and explicit lab output basis.
4. Preserve exact `Ln,w` source precedence. Exact or source-owned `Ln,w`
   may anchor the lane, but `DeltaLw` must not be invented from `IIC`,
   `AIIC`, field values, or unrelated reference assemblies.
5. The first Gate B contract may remain no-runtime if it only establishes
   the input/formula-readiness boundary. If it promotes runtime, it must
   name a bounded formula, tolerance/error budget, support bucket, and
   negative boundaries in the same gate.
6. Assert positive and negative cases: complete timber, complete CLT,
   missing dynamic stiffness/load/topping, wrong ASTM basis, missing
   ceiling isolation, exact-source precedence, and field-context
   non-aliasing.
7. Keep broad source crawling blocked. Use source rows only if the Gate B
   contract names a specific same-family holdout or anchor required for
   the formula owner.

## Consumed Gate A Implementation Order - Personal-Use MVP Coverage Sprint Scenario Matrix

Gate A landed after Gate BI closed the narrow steel-floor governance
boundary without runtime movement. It made calculator coverage
executable across common wall/floor and hostile user scenarios.

Gate A order completed:

1. Added
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts`
   and
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint.ts`.
2. Routed matrix rows through current public engine entry points instead
   of mocking solver outputs.
3. Built the 24-row starter matrix from the strategic ROI checkpoint:
   wall single/masonry/AAC/laminated/double/framed/resilient/triple
   scenarios, field airborne, concrete/steel/timber/CLT floors, field
   impact, ASTM boundary, many-layer stress, invalid thickness, and
   safe/unsafe reorder cases.
4. Each row asserts route, family, requested metrics, basis, input
   completeness, current posture, expected posture, value or blocked
   reason, origin/support bucket, tolerance/error budget,
   visible-surface parity target, hostile variant, failure class, and
   next action.
5. Selected the timber/CLT floor-impact `DeltaLw` Gate B lane from the
   matrix by coverage ROI and accuracy risk.

## Consumed Gate BH Implementation Order - Steel-Floor Same-Stack ISO DeltaLw Residual Policy Closed-Owner Revalidation

Gate BH is selected because Gate BG closed the final ranked owner
blocker without moving runtime values. Gate BH should re-run the
residual-policy readiness decision against the closed owner map and
prove whether the formula corridor still holds, tightens, widens, or
needs a later retune candidate without letting any no-runtime closure row
become measured runtime evidence.

Gate BH order completed:

1. Add
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bh-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation-contract.test.ts`
   and
   `packages/engine/src/steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation.ts`.
2. Use Gate BG's landed field/building basis owner closure contract as
   input; the selected next lane is
   `residual_policy_closed_owner_revalidation`.
3. Reconstruct the same-stack ISO lab `DeltaLw` residual-policy owner map
   with holdout count, paired negative boundaries, open-web formula input
   ownership, and field/building basis owners represented as closed
   evidence-only gates.
4. Keep runtime values, tolerances, exact-source precedence, and lab/
   field/building separation frozen unless a later gate owns measured
   residuals and explicitly selects retune/tighten/widen.
5. Preserve Gate BD, Gate BE, Gate BF, and Gate BG requirements in the
   revalidation output so future agents can see which blocker was closed
   by which no-runtime gate.
6. Select Gate BI for tighten-candidate governance because the closed
   owner map now produces a policy-only `tighten` signal that still
   cannot move runtime values or tolerances at Gate BH.

## Consumed Gate BG Implementation Order - Steel-Floor Same-Stack ISO DeltaLw Field/Building Basis Owner Closure

Gate BG was selected because Gate BF closed the open-web formula input
ownership boundary and the remaining ranked blocker was field/building
basis ownership.

Gate BG order completed:

1. Added
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bg-steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure-contract.test.ts`
   and
   `packages/engine/src/steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure.ts`.
2. Used Gate BF's landed open-web input ownership closure contract as
   input; the selected next lane is `field_building_basis_owner_closure`.
3. Defined field/building basis owner requirements separately for field
   apparent impact (`L'n,w`, `L'nT,w`) and building-prediction context:
   receiving room geometry/volume, separating element area, junction or
   flanking context, reverberation/normalization basis, and rights-safe
   locator or project-context metadata.
4. Kept accepted field/building basis owner evidence as residual-policy
   readiness evidence only; no lab-corridor conversion to field outputs,
   exact promotion, retune, tolerance movement, or runtime movement.
5. Preserved exact-source precedence, lab/field/building basis
   separation, source-absent steel formula pins, Gate BD holdout-count
   closure, Gate BE paired-negative closure, and Gate BF open-web input
   ownership requirements.

## Consumed Gate BF Implementation Order - Steel-Floor Same-Stack ISO DeltaLw Open-Web Input Ownership Closure

Gate BF was selected because Gate BE closed the paired-negative boundary
definition and the next ranked blocker was source-owned open-web formula
input ownership.

Gate BF order completed:

1. Added
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bf-steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure-contract.test.ts`
   and
   `packages/engine/src/steel-floor-formula-same-stack-iso-delta-lw-open-web-input-ownership-closure.ts`.
2. Used Gate BE's landed paired-negative closure contract as input; the
   selected next lane is `open_web_formula_input_ownership_closure`.
3. Defined source-owned open-web formula input requirements: support
   form, carrier spacing/depth, load basis, dynamic stiffness, lower
   support class, upper resilient topology, and rights-safe locator
   metadata.
4. Kept accepted open-web input evidence as residual-policy readiness
   evidence only; no exact-source promotion, formula retune, tolerance
   movement, or runtime movement.
5. Preserved exact-source precedence, lab/field/building basis
   separation, source-absent steel formula pins, Gate BD holdout-count
   closure, and Gate BE paired-negative closure requirements.

## Consumed Gate AP Implementation Order - Steel-Floor Error-Budget Hostile Input

Gate AP is the right next step because Gate AO made the source-absent
steel-floor formula budget visible on every main surface. The next risk
is hostile input drift: duplicate steel carriers, partial physical
inputs, safe reorders, exact-source precedence, or saved/API replays
must not leak a budget when the formula is not actually selected, and
must preserve the same budget when the topology is still physically the
same complete source-absent steel formula case.

Gate AP order completed:

1. Build a hostile-input matrix for the steel-floor formula budget:
   complete, safe reorder, saved/API replay, missing physical input,
   duplicate/ambiguous base structure, exact-source precedence, and
   requested field outputs.
2. Assert complete/safe-reorder/replay cases keep the same runtime
   `Ln,w 55.6` / `DeltaLw 22.4` and the same structured budget object.
3. Assert missing-input, unsafe-topology, and exact-source cases do not
   expose formula budgets in runtime, cards, reports, or API payloads.
4. Assert unsupported field outputs remain explicit and do not inherit
   lab formula budgets as `L'n,w` / `L'nT,w`.
5. Keep Gate AK/AM source-packet strictness and Gate AO surface parity
   unchanged.

## Consumed Gate AO Implementation Order - Steel-Floor Error-Budget Surface Parity

Gate AO carried the structured budget onto user-visible and API
surfaces.

Gate AO order completed:

1. Added the structured Gate AN error-budget payload to the steel formula
   runtime/support trace path without changing `Ln,w` or `DeltaLw`
   numeric values.
2. Showed the same `origin`, `notMeasuredEvidence`, metric corridor, and
   terms on output cards, method dossier, corridor dossier, Markdown
   report, calculator API payload, and impact-only API payload.
3. Kept exact-source, needs-input, and unsafe-topology cases free of
   formula budgets.
4. Added parity tests comparing visible text and API payloads against
   the structured budget object.
5. Preserved Gate AK/AM source-packet strictness and Gate AN corridor
   values.

## Consumed Gate AN Implementation Order - Source-Absent Steel-Floor Formula Uncertainty

Gate AN made the current tolerance corridor structured and testable.

Gate AN order completed:

1. Added explicit `Ln,w` and `DeltaLw` source-absent error-budget
   objects for complete steel-floor formula cases.
2. Attributed uncertainty to missing source-owned holdouts,
   source-absent steel reference modelling, transfer efficiency, input
   precision, and topology simplification.
3. Kept exact source precedence and Gate AK/AM source packet rules
   unchanged.
4. Added needs-input and unsafe-topology guards where no formula budget
   can be surfaced.
5. Selected Gate AO for card/report/API surface parity.

## Consumed Gate AM Implementation Order - Source-Owned DeltaLw Source Packet Acquisition

Gate AM kept source acquisition narrow and calculator-first.

Gate AM order completed:

1. Searched and encoded narrow source leads for REGUPOL steel
   deck/steel joist rows, REGUPOL steel C-joist evidence, REGUPOL ISO
   `DeltaLw` reference-floor rows, and SoundAdvisor ISO `DeltaLw` scope
   boundary evidence.
2. Rejected every lead that failed to own the same-stack ISO lab
   `DeltaLw` metric plus the Gate AK owner fields.
3. Kept accepted packet count at zero instead of treating wrong-basis or
   reference-floor values as holdouts.
4. Selected Gate AN so source-absent formula uncertainty improves next
   without turning the calculator into a source catalog.

## Consumed Gate AL Implementation Order - First Source-Owned DeltaLw Holdout Guard

Gate AL made the first-holdout acquisition decision executable without
pretending that a near-miss row is a source-owned ISO `DeltaLw` holdout.

Gate AL order completed:

1. Created the Gate AL contract at
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts`.
2. Added the Gate AL helper in
   `packages/engine/src/steel-floor-formula-first-source-owned-delta-lw-holdout.ts`.
3. Rejected current Pliteq/UBIQ `Ln,w`/`Rw`-only rows, product catalog
   `DeltaLw`, inferred Annex/companion values, and REGUPOL ASTM/IIC/STC
   wrong-basis evidence from source-owned ISO `DeltaLw` residual
   tightening.
4. Proved a future same-stack ISO lab packet can count only when every
   Gate AK owner field is source-owned.
5. Preserved the runtime value freeze and selected Gate AM for a narrow
   source-packet acquisition pass.

## Consumed Gate AK Implementation Order - Source-Owned DeltaLw Holdout Packet Contract

Gate AK landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ak-steel-floor-formula-source-owned-delta-lw-holdout-contract.test.ts`

Gate AK landed action:

`gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan`

Gate AK result:

- Gate AK lands an executable same-stack lab `DeltaLw` holdout packet
  contract for the steel-floor formula lane;
- a candidate can count toward formula residual tightening only when the
  measured metric value, topology/support family, carrier spacing, load
  basis, dynamic stiffness, lower support class, upper-resilient
  topology, and paired negative boundary owner are all source-owned;
- current Pliteq steel-joist rows remain `Ln,w` holdouts only, UBIQ
  open-web exact rows remain anchors only, and product catalog, Annex-C
  or companion-inferred, field, ASTM, and building-prediction values are
  explicitly rejected for lab `DeltaLw` residual tightening;
- the accepted measured `DeltaLw` holdout count remains zero, so runtime
  values and residual retune permission stay frozen;
- exact measured rows remain precedence, and source rows remain anchors,
  holdouts, or calibration evidence rather than the product.

Gate AK validation result:

Validation completed on 2026-05-07: Gate AK focused engine contract
passed 1 file / 5 tests; engine typecheck passed; full `pnpm
calculator:gate:current` passed with engine 317 files / 1798 tests, web
65 files / 284 passed + 18 skipped, repo build 5/5 tasks, and whitespace
guard clean; `git diff --check` passed. Known non-fatal warnings remain
the Node/Vitest Zustand persist storage warning and optional `sharp` /
`@img` Next build warnings via the DOCX export dependency.

Report export/manual-edit validation result:

Revalidated on 2026-05-07 after Gate AP. The report editor remains a
packaged proposal snapshot editor rather than a solver mutation surface.
Focused report editor/export web tests passed 6 files / 29 tests. Real
manual-edit PDF and DOCX exports were generated under
`output/report-checkpoint-2026-05-07-gate-ap/`; PDF text extraction, PDF
PNG rendering and visual review, DOCX zip integrity, and DOCX XML
content checks passed for `Rw 64 dB (manual checkpoint)`, `DnT,w 57 dB
(manual checkpoint)`, `Ln,w 49 dB (manual checkpoint)`, the manual
response curve, and the edited layer label. `soffice`/LibreOffice is not
installed in this environment, so DOCX visual rendering was not
available here. Full `pnpm calculator:gate:current` passed: engine 322
files / 1825 tests, web 66 files / 286 passed with 18 skipped, repo
build 5/5 successful, and whitespace guard clean. `git diff --check`
passed after the checkpoint documentation update.

Gate AK broad revalidation result:

Broad validation completed on 2026-05-07 after Gate AK and report
export/manual-edit validation. `pnpm check` passed after fixing stale
lint pins, impact validation fixture drift, and web expectation drift
around ambiguous duplicate/disjoint lightweight-steel floor schedules.
Engine Vitest passed 442 files / 2600 tests; web Vitest passed 171 files
/ 959 tests with 18 skipped; repo production build passed 5/5 tasks.
The Gate AD steel-floor formula corridor is now present in the real-world
floor and impact validation benchmark corpora as an explicit
predictor-input estimate lane. Hostile duplicate/disjoint steel floor
covering schedules now fail closed for impact outputs instead of
reopening broad `family_general` fallback; `Rw` screening can remain
available because it does not depend on the steel impact package inputs.
Runtime calculator values were not retuned.

Gate AK closed the next residual-policy gap by making source ownership
for measured same-stack lab `DeltaLw` executable before any row can
tighten the steel-floor formula residual.

Gate AK order completed:

1. Created the Gate AK contract at
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ak-steel-floor-formula-source-owned-delta-lw-holdout-contract.test.ts`.
2. Added the source-owned `DeltaLw` holdout evaluator in
   `packages/engine/src/steel-floor-formula-source-owned-delta-lw-holdout.ts`.
3. Required source ownership for metric value, topology/support family,
   carrier spacing, load basis, dynamic stiffness, lower support class,
   upper-resilient topology, and paired negative boundary owner.
4. Audited current Pliteq, UBIQ, product-catalog, inferred, and
   wrong-basis candidates without allowing any of them to tighten lab
   `DeltaLw` residuals.
5. Preserved current runtime values, exact-source precedence, and the
   residual-policy hold.

## Consumed Gate AJ Implementation Order - Steel Formula Negative Boundaries And DeltaLw Holdout Intake

Gate AJ closed the immediate residual-policy gap by making paired
negative boundaries executable and separating measured `DeltaLw` holdout
intake from product/inferred/wrong-basis values.

Gate AJ order completed:

1. Created the Gate AJ contract at
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aj-steel-floor-formula-negative-boundary-and-delta-lw-holdout-contract.test.ts`.
2. Added paired negative-boundary cases for wrong support family, exact
   row precedence, field/building basis leakage, and source-absent design
   references.
3. Defined measured `DeltaLw` holdout intake rules separately from
   product-catalog `DeltaLw` or inferred Annex-C companions.
4. Kept UBIQ exact rows as anchors until carrier spacing, load basis,
   dynamic stiffness, lower support class, and upper-resilient topology
   are source-owned.
5. Preserved current runtime values and exact-source precedence.

Gate AI selection status:

`gate_ai_steel_floor_formula_residual_policy_landed_selected_negative_boundary_delta_lw_gate_aj`

Gate AI landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts`

Gate AI landed action:

`gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan`

Gate AI selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aj-steel-floor-formula-negative-boundary-and-delta-lw-holdout-contract.test.ts`

Gate AI selected next action:

`gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan`

Gate AH selection status:

`gate_ah_steel_floor_formula_accuracy_benchmark_landed_selected_residual_policy_gate_ai`

Gate AH landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts`

Gate AH landed action:

`gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan`

Gate AH selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts`

Gate AH selected next action:

`gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan`

Gate AH result:

- Gate AH landed a no-runtime steel-floor formula accuracy benchmark
  matrix;
- three same-family Pliteq steel-joist `Ln,w` holdouts compare against
  explicit Gate AD formula inputs and all stay inside the current
  corridor;
- max `Ln,w` residual is `0.6 dB`; mean `Ln,w` residual is `0.4 dB`;
- `DeltaLw` measured residual count remains zero, so the current
  `+/-2.0 dB DeltaLw` tolerance is kept but not tightened;
- 36 UBIQ open-web exact rows are counted as exact source anchors but
  stay non-residual until formula inputs and topology are source-owned;
- measured/source rows remain calibration evidence and exact overrides,
  not a finite replacement for the calculator.

Gate AH validation result:

Focused validation completed on 2026-05-07: Gate AH engine contract
passed 1 file / 5 tests; engine typecheck passed. Full `pnpm
calculator:gate:current` passed with engine 314 files / 1783 tests, web
65 files / 284 passed + 18 skipped, and repo build 5/5 tasks. Known
non-fatal warnings remain the Node/Vitest Zustand persist storage warning
and optional `sharp` / `@img` Next build warnings via the DOCX export
dependency.

## Consumed Gate AI Implementation Order - Steel Formula Residual Policy And Calibration Readiness

Gate AI is the right next step because Gate AH now owns the benchmark
matrix but has not yet turned the benchmark outcome into an explicit
policy for when the formula may be retuned, tightened, widened, or held.

Gate AI order:

1. Create the Gate AI contract at
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts`.
2. Convert Gate AH residual evidence into an executable policy:
   `hold`, `tighten`, `widen`, or `retune_candidate`.
3. Keep current runtime values unless a source-owned correction has
   paired positive and negative tests.
4. Require measured `DeltaLw` holdouts before tightening `DeltaLw`.
5. Keep UBIQ open-web exact rows as anchors until carrier spacing, load
   basis, dynamic stiffness, lower support class, and upper-resilient
   topology are owned as formula inputs.
6. Preserve exact-source precedence and lab/field/building basis
   separation.

Non-goals for Gate AI:

- no broad source crawl;
- no measured-row catalog replacement;
- no field/building output promotion from lab formula values;
- no formula retune from the Pliteq-only limited holdout set.

Gate AG selection status:

`gate_ag_steel_floor_formula_input_surface_acceptance_landed_selected_accuracy_benchmark_gate_ah`

Gate AG landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ag-steel-floor-formula-input-surface-acceptance-contract.test.ts`

Gate AG landed action:

`gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan`

Gate AG selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts`

Gate AG selected next action:

`gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan`

Gate AG result:

- Gate AG acceptance landed without retuning the Gate AD steel formula;
- complete UI-derived steel rows remain lab `LnW 55.6` / `DeltaLw
  22.4` with the same source-absent formula basis and card/report
  tolerance copy;
- live workbench, local saved replay, server snapshot replay, output
  cards, Markdown report payload, estimate API payload, and impact-only
  API payload now have paired acceptance coverage;
- missing/invalid fields name the precise physical blockers instead of
  silently parking the formula lane;
- hostile edits cover comma decimals, empty/zero/negative values, field
  removal, many parked rows, safe reorder, split-contiguous same steel
  carriers, unsafe duplicate carriers, steel/non-steel base toggles, and
  field impact output requests;
- field outputs such as `L'n,w` and `L'nT,w` stay unsupported unless a
  field-context owner is active.

Gate AG validation result:

Focused validation completed on 2026-05-07: Gate AG engine contract
passed 1 file / 3 tests; web steel formula input-surface acceptance
passed 1 file / 4 tests; Gate AF + Gate AG web focused suite passed 2
files / 8 tests; engine typecheck passed; web typecheck passed; preflight
`git diff --check` passed. Final `pnpm calculator:gate:current` passed
with engine 313 files / 1778 tests, web 65 files / 284 tests plus 18
skipped, repo build, and whitespace guard. The Gate AG web acceptance
test emits known non-fatal Zustand persist storage warnings under
Node/Vitest; the web build still emits the known non-fatal optional
`sharp/@img` package warnings.

## Consumed Gate AH Implementation Order - Steel Formula Accuracy Benchmark Expansion

Gate AH is the right next step because Gate AG proved the new input
surface is stable across user-facing and API surfaces. The remaining
calculator-first risk is numeric accuracy across nearby steel-floor
families, not another UI plumbing pass and not a source-library crawl.
Gate AH has now consumed that benchmark gap.

Gate AH order:

1. Create the Gate AH contract at
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts`.
2. Build a rights-safe benchmark matrix from existing measured/holdout
   steel-floor rows and explicit physics input cases. Include support
   form, carrier depth/spacing, resilient dynamic stiffness, load basis,
   lower isolation, metric basis, and tolerance owner for each case.
3. Compare formula residuals against exact measured values where
   topology and metric scope truly match; use near rows only as anchors
   or calibration checks when their family and basis are defensible.
4. Decide whether the current `+/-4.5 dB Ln,w` and `+/-2.0 dB DeltaLw`
   corridor tolerances should stay, widen, or narrow from evidence.
5. Preserve exact-source precedence and keep lab, field, and
   building-prediction outputs separate. Do not alias `Ln,w` with `IIC`.

Non-goals for Gate AH:

- no broad source crawl;
- no replacing the physics calculator with a measured-row catalog;
- no field/building output promotion from lab values;
- no formula retune without residual evidence and paired negative tests.

Gate AF selection status:

`gate_af_steel_floor_formula_input_surface_landed_selected_acceptance_revalidation_gate_ag`

Gate AF landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts`

Gate AF landed action:

`gate_af_steel_floor_formula_input_surface_plan`

Gate AF selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ag-steel-floor-formula-input-surface-acceptance-contract.test.ts`

Gate AF selected next action:

`gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan`

Gate AF result:

- the Dynamic Calculator floor route now has a first-class steel-floor
  formula input surface for support form, carrier depth/spacing,
  resilient dynamic stiffness, load basis, and lower ceiling isolation;
- workbench route controls, scenario analysis, local/server snapshots,
  and the engine helper bridge those fields into the Gate AD
  `ImpactPredictorInput`;
- complete construction-image style steel rows plus the UI surface still
  return lab `LnW 55.6`, `DeltaLw 22.4`, and
  `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`;
- partial fields stay parked instead of producing a fake formula value;
- unsafe duplicate steel carrier topology is refused;
- exact measured full-stack rows still outrank the formula corridor.

Gate AF validation result:

Validation completed on 2026-05-07. Focused Gate AF engine contract
passed 1 file / 5 tests; focused web steel formula input-surface test
passed 1 file / 4 tests; engine typecheck passed; web typecheck passed;
final `pnpm calculator:gate:current` passed with engine 312 files / 1775
tests, web 64 files / 280 tests plus 18 skipped, repo build, and
whitespace guard. The Next build still emits the known non-fatal optional
`sharp/@img` package warnings.

## Consumed Gate AG Implementation Order - Steel Input Surface Acceptance Revalidation

Gate AG was selected because Gate AF landed the functional input bridge,
but the calculator still needed proof that the new surface stayed stable
across the surfaces a user actually touches: workbench UI, local saved
replay, server snapshot replay, output cards, report payloads, and API
payloads. Gate AG has now consumed that acceptance gap.

Gate AG order:

1. Create the Gate AG contract at
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ag-steel-floor-formula-input-surface-acceptance-contract.test.ts`.
   It should select the next calculator-first accuracy step only after
   input-surface acceptance is stable.
2. Add web acceptance coverage for a complete steel formula scenario
   through live workbench state, local saved scenario replay, and server
   snapshot replay. All paths must return lab `LnW 55.6`, `DeltaLw
   22.4`, the Gate AD basis, and the Gate AE card/report tolerance
   language.
3. Add route-panel/output-unlock assertions for missing and invalid steel
   fields: empty, zero, negative, comma decimal, and field removal after a
   previously complete calculation.
4. Expand hostile UI coverage for many layers, safe reorder, unsafe
   duplicate carriers, split-but-contiguous layers, and toggling between
   steel and non-steel base structures.
5. Preserve exact-source precedence and do not promote field/building
   impact outputs from the lab formula unless the field-context owner is
   explicitly active.

Non-goals for Gate AG:

- no steel formula retune;
- no source crawl;
- no `Ln,w` / `IIC` aliasing;
- no field/building-prediction promotion from lab values.

Gate AE selection status:

`gate_ae_steel_formula_card_report_parity_landed_selected_input_surface_gate_af`

Gate AE landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ae-steel-floor-formula-card-report-parity-contract.test.ts`

Gate AE landed action:

`gate_ae_steel_floor_formula_card_and_report_parity_plan`

Gate AE selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts`

Gate AE selected next action:

`gate_af_steel_floor_formula_input_surface_plan`

Gate AE result:

- Gate AD steel formula runtime values stay pinned (`LnW 55.6`,
  `DeltaLw 22.4`), but card/report/dossier/trace surfaces now expose
  the same `Lightweight-steel formula corridor` label;
- output cards and posture copy keep the source-absent lab estimate
  basis and `+/-4.5 dB` / `+/-2.0 dB` tolerances attached to `Ln,w` and
  `DeltaLw`;
- dynamic impact trace, impact support notes, formula notes, validation
  mode, report, and proposal method dossier all show the same steel
  formula corridor instead of generic scoped/heavy-reference wording;
- the validation ladder now tracks a dedicated
  `steel_formula_corridor_estimate` mode and raises the lightweight
  steel family tolerance envelope to `4.5 dB`;
- exact measured rows still outrank the formula corridor and source rows
  remain calibration/holdout evidence, not the whole calculator.

Gate AE validation result:

Validation completed on 2026-05-07. Focused Gate AE engine contract
passed 1 file / 4 tests; focused web steel formula card/report parity
passed 1 file / 1 test; focused Gate AD regression passed 1 file / 6
tests; focused web output/model/dossier/formula report regressions passed
3 files / 16 tests; final `pnpm calculator:gate:current` passed with
engine 311 files / 1770 tests, web 63 files / 276 tests plus 18 skipped,
repo build, and whitespace guard. The Next build still emits the known
non-fatal optional `sharp/@img` package warnings.

Broad revalidation was repeated on 2026-05-07 after the repo-level
audit. `pnpm calculator:gate:current` passed again with engine 311 files
/ 1770 tests, web 63 files / 276 tests plus 18 skipped, repo build, and
whitespace guard. This pass found no runtime correction needed before
Gate AF; the remaining gap is the missing first-class Dynamic Calculator
input surface for the physical steel-floor formula fields.

## Consumed Gate AF Implementation Order - Steel Floor Formula Input Surface

Gate AF was selected because the Gate AD/AE behavior was correct only
when the caller provided explicit `impactPredictorInput`. Gate AF has
now consumed that gap by adding the first-class Dynamic Calculator steel
floor input surface.

Implement Gate AF in this order:

1. Add the Gate AF executable contract and scenario pack at
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts`.
   It should assert the selected slice/status, required fields, positive
   and negative scenarios, exact-source precedence, and no numeric
   retune of the Gate AD formula.
2. Bridge user-facing floor-route inputs into the existing
   `ImpactPredictorInput` shape. Required fields are
   `steelSupportForm`, `steelCarrierDepthMm`,
   `steelCarrierSpacingMm`, `resilientLayerDynamicStiffnessMNm3`,
   `loadBasisKgM2`, and `lowerCeilingIsolationSupportForm`.
3. Add workbench controls only when the floor impact route requires
   them, and make the visible missing-input prompts match the engine
   field IDs. Partial values should reduce prompts deterministically.
4. Preserve parity: a complete UI-derived open-web steel stack must
   still calculate lab `LnW 55.6`, `DeltaLw 22.4`, basis
   `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`,
   and `+/-4.5 dB` / `+/-2.0 dB` tolerances across card, trace, saved
   replay, PDF/DOCX inputs if touched, and Markdown report.
5. Add hostile-input coverage for invalid numbers, many layers,
   duplicate/split carriers, safe reorder, unsafe reorder, and generic
   `lightweight_steel_floor` stacks. Missing or unsafe inputs must stay
   `needs_input`; they must not fall back to broad steel-family blending.

Gate AF non-goals: no source-packet crawl, no formula retune unless the
input-surface contract proves a numeric bug, no lab/field aliasing, and
no field/building-prediction promotion without explicit field-context
ownership.

Previous Gate AD selection status:

`gate_ad_steel_floor_impact_formula_corridor_landed_selected_card_report_parity_gate_ae`

Previous Gate AD landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts`

Previous Gate AD landed action:

`gate_ad_steel_floor_impact_formula_numeric_corridor_plan`

Previous Gate AD selected Gate AE file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ae-steel-floor-formula-card-report-parity-contract.test.ts`

Previous Gate AD selected Gate AE action:

`gate_ae_steel_floor_formula_card_and_report_parity_plan`

Previous Gate AD result:

- complete explicit source-absent steel floors now calculate lab
  `Ln,w` / `DeltaLw` through
  `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`
  instead of broad nearby-source family blending;
- the open-web reference scenario is pinned at `LnW 55.6`,
  `DeltaLw 22.4`, with `+/-4.5 dB` / `+/-2.0 dB` formula corridors;
- carrier spacing and lower ceiling isolation are runtime blockers, not
  reasons to fall through to generic family estimates;
- exact measured rows remain first precedence; same-family rows are
  holdouts/calibration evidence, not the whole calculator.

Gate AD validation result:

Gate AD validation completed on 2026-05-07. Focused Gate AD passed 1
file / 6 tests; focused Gate AC/Gate AD plus predictor-input regression
passed 3 files / 55 tests; focused impact-only fallback regression
passed 1 file / 102 tests; engine typecheck passed; final
`pnpm calculator:gate:current` passed with engine 310 files / 1766
tests, web 62 files / 275 tests plus 18 skipped, repo build, and
whitespace guard. The Next build still emits the known non-fatal `sharp`
optional `@img` package warnings. Final `git diff --check` passed after
this validation note update.

Previous Gate AC selection status:

`gate_ac_steel_floor_physics_input_contract_landed_selected_formula_corridor_gate_ad`

Previous Gate AC landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ac-steel-floor-physics-input-contract.test.ts`

Previous Gate AC landed action:

`gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan`

Previous Gate AC selected Gate AD file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts`

Previous Gate AC selected Gate AD action:

`gate_ad_steel_floor_impact_formula_numeric_corridor_plan`

Previous Gate AC result:

- steel-floor source-absent impact routes now have a no-runtime
  input/formula readiness contract instead of only a source guard;
- required physical inputs are `steelSupportForm`,
  `steelCarrierDepthMm`, `steelCarrierSpacingMm`,
  `resilientLayerDynamicStiffnessMNm3`, `loadBasisKgM2`, and
  `lowerCeilingIsolationSupportForm`;
- complete explicit open-web steel input is
  `ready_for_formula_corridor_gate`, but runtime values remain on the
  current family-estimate lane until Gate AD owns numeric corridors;
- exact full-stack measured source rows remain first precedence and do
  not need formula readiness;
- nearby negatives cover missing spacing and missing lower isolation.

Gate AC validation result:

Validation completed on 2026-05-07: focused Gate AC passed 1 file / 6
tests; focused Gate AB + Gate AC + predictor input regression passed 3
files / 54 tests; engine typecheck passed; `pnpm
calculator:gate:current` passed with engine 309 files / 1760 tests, web
62 files / 275 tests plus 18 skipped, repo build, and whitespace guard.
Known optional `sharp/@img` Next build warnings remain non-fatal.

Gate AB selection status:

`gate_ab_floor_family_source_guard_landed_selected_steel_floor_physics_input_gate_ac`

Gate AB landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ab-floor-family-source-guard-contract.test.ts`

Gate AB landed action:

`gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan`

Gate AB selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ac-steel-floor-physics-input-contract.test.ts`

Gate AB selected next action:

`gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan`

Gate AB result:

- the generic modular/lightweight steel floor repro no longer turns into
  `Ln,w 53.3` by blending UBIQ open-web rows;
- generic `lightweight_steel_floor` impact routes now require explicit
  `open_web_or_rolled` vs `joist_or_purlin`, carrier depth/spacing,
  upper impact package dynamic stiffness or a matching source row, and
  lower ceiling isolation form before impact metrics promote;
- exact same-family Pliteq steel-joist rows still promote when full
  topology truly matches;
- UBIQ same-family bound rows remain visible as bound support and are
  not converted into exact `Ln,w`.

Gate AB validation result:

Validation completed on 2026-05-07: focused Gate AB passed 1 file / 5
tests; focused floor-impact source/fallback regression passed 7 files /
140 tests; focused Gate AA/AB pair passed 2 files / 10 tests; engine
typecheck passed; `pnpm calculator:gate:current` passed with engine 308
files / 1754 tests, web 62 files / 275 tests plus 18 skipped, repo
build, and whitespace guard. Known optional `sharp/@img` Next build
warnings remain non-fatal.

Gate AA selection status:

`gate_aa_construction_image_route_selection_recovered_selected_floor_family_guard_gate_ab`

Gate AA landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aa-construction-image-accuracy-incident-contract.test.ts`

Gate AA landed action:

`gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan`

Gate AA selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ab-floor-family-source-guard-contract.test.ts`

Gate AA selected next action:

`gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan`

Gate AA result:

- the shared-wall construction-image grouped topology with explicit
  80/80 mm mineral-wool cavities now selects
  `triple_leaf_two_cavity_frequency_solver` instead of
  `multileaf_screening_blend`;
- the app path matches the direct solver at `Rw 61`, `STC 61`, `C -1.7`,
  and `Ctr -6.8`;
- 65/95 and 95/65 grouped cavity checks prove the selector is a physical
  domain gate, not a new 80/80 fixture gate;
- flat-list ACON-like construction-image input remains `needs_input`
  for grouped topology.

Gate AA validation result:

Validation completed on 2026-05-07: focused Gate I/AA/G/J/M regression
passed 5 files / 32 tests. Engine typecheck passed. `pnpm
calculator:gate:current` passed with engine 307 files / 1749 tests, web
62 files / 275 tests plus 18 skipped, repo build, and whitespace guard.
Known optional `sharp/@img` Next build warnings remain non-fatal. Final
`git diff --check` passed after this validation note update.

Previous Gate Z selection status:

`gate_z_floor_impact_field_runtime_landed_selected_construction_image_accuracy_incident_gate_aa`

Previous Gate Z landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-z-floor-impact-field-runtime-contract.test.ts`

Previous Gate Z landed action:

`gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator`

Previous Gate Z selected next action:

`gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan`

Gate Z result:

- field-only Dynamic Calculator floor-impact `L'n,w` / `L'nT,w`
  requests now promote when the Gate W lab anchor and Gate Y field
  context are complete;
- the pinned reference stack returns `LnW 50.3`, `DeltaLw 24.3`,
  `LPrimeNW 52.3`, and `LPrimeNTw 49.9` on basis
  `mixed_predicted_plus_estimated_standardized_field_volume_normalization`;
- field-only and lab-anchored mixed requests now share the same numeric
  field outputs and support buckets for `L'n,w` / `L'nT,w`;
- missing `impactFieldContext` remains `needs_input` style behavior and
  does not fabricate field outputs;
- `L'nT,50` remains blocked until
  `lowFrequencyImpactSpectrumOrCI50_2500Owner` exists.

Previous Gate Y landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts`

Previous Gate Y landed action:

`gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator`

Selected Gate AA accuracy incident:

`docs/calculator/ACCURACY_INCIDENT_2026-05-07_CONSTRUCTION_IMAGE_ROUTE_SELECTION.md`

The construction-image examples exposed a route-selection accuracy
incident, not a warning-copy problem. A realistic grouped multi-leaf
wall with 80/80 mm mineral-wool cavities can miss the existing
three-leaf/two-cavity solver because the Gate G selector is tied to the
50/50 mm benchmark fixture, then fall through to `multileaf_screening_blend`
and underpredict. A modular lightweight-steel floor example also shows
the same class of risk on the floor side: broad nearby source-family
blends must not become numeric anchors when explicit steel support is
present. Gate Z has now finished the selected field-impact runtime
boundary, Gate AA recovered the wall-side construction-image route
selection, and Gate AB has now closed the floor-side nearby-source
borrowing failure. Gate AC has now converted that blocked generic steel
route into a no-runtime input/formula readiness contract. The next
calculator work is
`gate_ad_steel_floor_impact_formula_numeric_corridor_plan`: define and
test the first numeric steel-floor impact formula corridor so
source-absent steel floors can calculate from physics rather than only
blocked/source-matched routes.

2026-05-07 plan iteration:

- Gate Z is landed and closed for this boundary.
- Gate AA is landed for the wall-side construction-image route miss. Its
  plan was expanded with an implementation comparison against
  `dynamic-airborne-gate-g-rockwool.ts`, `dynamic-airborne.ts`,
  `wall-triple-leaf-frequency-solver.ts`, `curve-rating.ts`,
  `impact-estimate.ts`, `lightweight-steel-bound-estimate.ts`, and
  `floor-system-estimate.ts`.
- Gate AA started from tests, not a small runtime patch: the
  construction-image scenario pack now asserts app-path/direct-solver
  parity and rejects `multileaf_screening_blend` for complete grouped
  multi-cavity wall topology.
- Gate AB carries the floor half of the incident and is landed: generic
  lightweight-steel floors no longer borrow UBIQ open-web or Pliteq
  steel-joist source rows when the steel support form is unspecified.
- Gate AC is landed and no-runtime: support form, carrier geometry,
  joist/section spacing, deck/board schedule, resilient layer dynamic
  stiffness, lower ceiling isolation, lab/field metric scope, and
  calibration/holdout requirements are now executable contract inputs.
- Gate AD should implement the numeric corridor around that contract:
  expected `Ln,w` / `DeltaLw` corridor, source holdout comparison,
  rejection of missing spacing/lower-isolation negatives, and no
  promotion outside declared lab/field basis.
- Formula ownership for Gate AA is family-specific: single/laminated
  leaf, double leaf/framed, triple leaf/two-cavity, generalized
  multi-layer airborne, heavy concrete impact, and lightweight steel
  impact are separate model lanes. Exact measured rows can override or
  calibrate only when topology/material/metric/basis ownership exists.
- Gate AA should document residual numeric error as solver backlog
  after measured/INSUL-style curve comparison. Confidence copy is not a
  substitute for correcting the selected calculation route.

Gate Z validation result:

Validation completed on 2026-05-07: focused Gate Z passed 1 file / 6
tests; focused Gate V/W/X/Y/Z regression passed 5 files / 28 tests;
focused Gate J readiness pack regression passed 1 file / 8 tests after
updating the expected Gate Z field-context warning; engine typecheck
passed; `pnpm calculator:gate:current` passed with engine 306 files /
1744 tests, web 62 files / 275 tests plus 18 skipped, repo build, and
whitespace guard. Known optional `sharp/@img` Next build warnings remain
non-fatal. Final `git diff --check` passed after this validation note
update.

Previous Gate Y validation result:

Focused Gate Y passed 1 file / 5 tests, focused Gate V/W/X/Y regression
passed 4 files / 22 tests, `pnpm --filter @dynecho/engine typecheck`
passed, `pnpm calculator:gate:current` passed, broad `pnpm check`
passed, and `git diff --check` passed. The broad check covered full
engine 430 files / 2540 tests and full web 168 files / 950 tests plus
18 skipped. Known optional `sharp/@img` Next build warnings remain
non-fatal.

Gate Y result:

- the field-context input boundary for Dynamic Calculator floor impact is
  now executable and source-row independent;
- `L'n,w` / `L'nT,w` require the Gate W lab impact anchor plus
  `contextMode`, `partitionAreaM2`, `receivingRoomVolumeM3`,
  `receivingRoomRt60S`, and `impactFieldContext`;
- field `K` / mass-ratio / direct-flanking policy and flanking path or
  junction policy are named owners before promotion;
- `L'nT,50` remains blocked until a low-frequency spectrum or
  `CI,50-2500` owner exists;
- Gate Z now supersedes the pre-runtime boundary for complete
  field-only `L'n,w` / `L'nT,w`; the Gate Y contract remains the owner
  for required fields and the blocked `L'nT,50` low-frequency owner.

Previous landed Gate X checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_X_HANDOFF.md`

Previous landed Gate W checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_W_HANDOFF.md`

Previous landed Gate V checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_V_HANDOFF.md`

Previous landed Gate T checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_T_HANDOFF.md`

Previous landed Gate S checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_S_HANDOFF.md`

Previous landed Gate R checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_R_HANDOFF.md`

Previous landed Gate Q checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Q_HANDOFF.md`

Previous Gate Q selection status:

`gate_q_double_leaf_framed_bridge_input_contract_landed_no_runtime_selected_solver_candidate_gate_r`

Gate Q selected Gate R file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts`

Gate Q selected Gate R action:

`gate_r_define_double_leaf_framed_bridge_solver_candidate_without_runtime_value_movement`

Previous landed Gate P checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_P_HANDOFF.md`

Previous Gate P selection status:

`gate_p_next_family_solver_selection_landed_no_runtime_selected_double_leaf_framed_bridge_gate_q`

Gate P selected Gate Q file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts`

Gate P selected Gate Q action:

`gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator`

Previous landed Gate O checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_O_HANDOFF.md`

Previous Gate O selection status:

`gate_o_single_leaf_massive_panel_runtime_promotion_landed_no_value_selected_next_family_solver_gate_p`

Gate O selected Gate P file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts`

Gate O selected Gate P action:

`gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion`

Previous landed Gate N checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_N_HANDOFF.md`

Previous Gate N selection status:

`gate_n_family_solver_upgrade_selection_landed_no_runtime_selected_single_leaf_massive_panel_gate_o`

Gate N selected Gate O file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts`

Gate N selected Gate O action:

`gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator`

Previous landed Gate M checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_M_HANDOFF.md`

Previous Gate M selection status:

`gate_m_dynamic_candidate_resolver_runtime_landed_no_value_selected_family_solver_upgrade_gate_n`

Gate M selected Gate N file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-n-family-solver-upgrade-contract.test.ts`

Gate M selected Gate N action:

`gate_n_select_first_family_solver_upgrade_runtime_gate_for_dynamic_calculator`

Previous landed Gate L checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_L_HANDOFF.md`

Previous landed Gate K checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_K_HANDOFF.md`

Previous Gate K selection status:

`gate_k_route_input_topology_contract_landed_no_runtime_selected_topology_normalizer_gate_l`

Gate K selected Gate L file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-l-topology-normalizer-hostile-input-contract.test.ts`

Gate K selected Gate L action:

`gate_l_define_topology_normalizer_and_hostile_input_guard_for_dynamic_calculator`

Previous landed Gate J checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_J_HANDOFF.md`

Previous Gate J selection status:

`gate_j_personal_use_readiness_scenario_pack_landed_no_runtime_selected_route_input_topology_gate_k`

Gate J selected Gate K file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-k-route-input-topology-contract.test.ts`

Gate J selected Gate K action:

`gate_k_define_route_input_topology_contracts_for_dynamic_calculator`

Previous checkpoint / manual export validation:

`docs/calculator/CHECKPOINT_2026-05-06_GATE_I_REPORT_EXPORT_MANUAL_EDIT_VALIDATION_HANDOFF.md`

Previous wrap-up / report-export readiness checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_GATE_H_AND_REPORT_EXPORT_WRAPUP_HANDOFF.md`

Latest landed Gate I checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_I_HANDOFF.md`

Previous Gate I selection status:

`gate_i_family_material_properties_and_benchmark_scenarios_landed_no_runtime_selected_personal_use_readiness_gate_j`

Gate I selected Gate J file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-j-personal-use-readiness-scenario-pack-contract.test.ts`

Gate I selected Gate J action:

`gate_j_build_personal_use_readiness_scenario_pack`

Previous landed Gate H checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_H_HANDOFF.md`

Previous Gate H selection status:

`gate_h_source_calibration_exact_promotion_policy_landed_no_runtime_selected_family_material_expansion_gate_i`

Gate H selected Gate I file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts`

Gate H selected Gate I action:

`gate_i_expand_family_material_properties_and_benchmark_scenarios`

Previous landed Gate G checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_G_HANDOFF.md`

Previous Gate G selection status:

`gate_g_grouped_rockwool_family_physics_prediction_landed_selected_source_calibration_gate_h`

Gate G selected Gate H file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-h-source-calibration-exact-promotion-contract.test.ts`

Gate G selected Gate H action:

`gate_h_calibrate_sources_and_exact_promotion_without_deleting_physics_solver`

Previous landed Gate E checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_E_HANDOFF.md`

Previous Gate E selection status:

`gate_e_airborne_candidate_resolver_landed_no_runtime_selected_grouped_rockwool_prediction_gate_g`

Previous landed Gate D checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_D_HANDOFF.md`

Previous landed Gate C checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_C_HANDOFF.md`

Previous landed Gate B checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_B_HANDOFF.md`

Previous landed Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_A_HANDOFF.md`

Latest checkpoint / revalidation handoff:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_GATE_A_REVALIDATION_COMMIT_HANDOFF.md`

Latest acoustic-calculator plan revalidation / execution handoff:

`docs/calculator/CHECKPOINT_2026-05-06_ACOUSTIC_CALCULATOR_PLAN_REVALIDATION_HANDOFF.md`

Previous Gate R selection status:

`gate_r_double_leaf_framed_bridge_solver_contract_landed_no_runtime_selected_runtime_promotion_gate_s`

Gate R selected Gate S file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts`

Gate R selected Gate S action:

`gate_s_promote_double_leaf_framed_bridge_solver_runtime_for_dynamic_calculator`

Gate S selection status:

`gate_s_double_leaf_framed_bridge_runtime_landed_selected_family_material_gap_gate_t`

Gate S selected Gate T file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-t-family-material-gap-closure-contract.test.ts`

Gate S selected Gate T action:

`gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator`

Gate T selection status:

`gate_t_family_material_property_gap_closure_landed_no_runtime_selected_next_solver_or_calibration_gate_u`

Gate T selected Gate U file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts`

Gate T selected Gate U action:

`gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure`

Selection status:

`gate_u_next_solver_or_calibration_selection_landed_no_runtime_selected_floor_impact_gate_v`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts`

Selected next action:

`gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator`

Active planning surface:

`docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`

Why this is the next step:

The calculator must calculate. Missing source/lab packets block
measured-exact or source-validated promotion, but they must not block a
labelled family-specific physics prediction. The prior active
Rockwool/source-packet refresh path was too narrow because it kept the
most visible triple-leaf defect waiting on source evidence instead of
splitting exact-source promotion from formula-backed prediction.

Checkpoint assessment:

The plan remains correct after Gate J. Gate B added shared airborne
basis/candidate metadata, Gate C added optional rating-adapter basis
metadata, Gate D added optional physical input-completeness metadata,
Gate E added optional airborne candidate-resolution metadata, and Gate G
used that stack for the first deliberate runtime prediction movement.
The explicit grouped Rockwool triple-leaf case is now labelled
`family_physics_prediction` on
`triple_leaf_two_cavity_frequency_solver`, not measured exact or source
validated. Gate H added the no-runtime source-promotion policy that
keeps exact full-stack, calibrated family, anchored-delta, and
uncalibrated prediction candidates separate. Source candidates may win
only with rights-safe evidence, owned topology/material/metric/tolerance
scope, paired positive/negative tests, and calibration holdout metadata.
Gate I added the first material-property widening contract and benchmark
scenario readiness helper for single-leaf, double/framed, triple-leaf,
lined masonry, CLT/mass timber, and floating-floor routes without moving
runtime values. Gate J landed the personal-use readiness scenario pack
and engine-inventory guard without moving runtime values. Gate K landed
the no-runtime Dynamic Calculator route/input topology contract: source
absence blocks source promotion only, missing physical topology/material
/ field / floor-impact inputs become targeted prompts, and unsupported
runtime outputs remain explicit. Gate L landed the no-runtime topology
normalizer and hostile input guard: safe role-defined floor edits can
normalize, multi-cavity wall order remains meaningful, ambiguous
flat-list auto-grouping is blocked, and hostile layer input fails closed.
Gate L selection status was
`gate_l_topology_normalizer_hostile_input_guard_landed_no_runtime_selected_candidate_resolver_gate_m`,
selecting
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts`
with
`gate_m_populate_dynamic_candidate_resolver_runtime_for_dynamic_calculator`.
Gate M populated the Dynamic Calculator candidate resolver runtime
surface without moving numeric values or support buckets: exact full
stack, anchored delta, calibrated family, family physics, bounded,
screening, `needs_input`, and `unsupported` candidates now coexist with
selected/rejected reasons. ACON-like flat-list multi-cavity walls expose
`needs_input` candidate metadata instead of silently looking like a
source/library miss.
Gate N selected the first family solver upgrade runtime gate without
moving numeric values: single-leaf / laminated single-leaf / rigid
massive panel goes first because the current family candidate is already
visible but selected as `screening_fallback`, required material inputs
are complete, and the acceptance surface can pin gypsum board,
laminated board, and concrete values while promoting basis/origin. It
explicitly defers double/framed, generalized multi-cavity, lined
masonry/CLT, floor impact, and field/building continuations until their
bridge/topology/impact/room owners are ready.
Gate O landed that selected runtime move: complete single-leaf /
laminated single-leaf / rigid massive panel Dynamic Calculator results
now select `family_physics_prediction` with an uncalibrated error budget
and `runtimeValueMovement: false`. Single gypsum, laminated gypsum, and
150 mm concrete values/support stay pinned; exact source rows still win
under the Gate H policy; grouped Rockwool Gate G remains unchanged; and
CLT/mass timber stays screening until orthotropic/directional properties
are owned.
Gate P landed the next-family solver selection without moving runtime
values: it excludes the already-landed single-leaf family and selects
double-leaf / framed bridge as the next Dynamic Calculator solver family
because it is common wall coverage, source-absent physics does not
require catalog rows, and the next safe move is an input/benchmark
contract. Gate Q must define `frameBridgeClass`, `studSpacingMm`,
`resilientSideCount`, `supportTopology`, porous cavity damping, and
mass-air-mass resonance ownership before any double-leaf/framed runtime
promotion.
Gate Q landed that input/benchmark contract without moving runtime
values. It adds an explicit `double_leaf_framed` wall topology mode,
the double-leaf/framed bridge input helper, and route-input assessment
for explicit double-leaf/framed contexts. Missing side groups, cavity
depth, frame bridge class, support topology, support spacing, and
resilient-bar side count now become physical `needs_input` prompts;
source absence remains exact/calibration-only. The next step is a solver
candidate/equation contract, not runtime promotion.
Gate R landed that solver-candidate/equation contract without moving
runtime values. It names the side-leaf surface-mass partition,
mass-air-mass resonance, bridge-coupling, porous-damping, ISO 717-1
`Rw`, and ASTM E413 `STC` adapter owners; records uncalibrated benchmark
corridors for independent absorbed and resilient bridge cases; keeps
missing resilient side count as `needs_input`; and rejects direct-fixed
and non-explicit multi-cavity flat-list boundaries before runtime
promotion. The next step is Gate S runtime promotion with value pins and
visible/report parity, not a formula retune.
Gate S landed that runtime promotion for complete explicit
double-leaf/framed contexts. Independent absorbed gypsum / rockwool /
gypsum selects the family physics candidate at `Rw 45`, `STC 45`,
`C -1`, `Ctr -6.1`, with a `7 dB` uncalibrated error budget.
Resilient both-side bridge selects `Rw 46` / `STC 46` with an `8 dB`
error budget. Exact full-stack source rows still outrank the runtime
candidate when Gate H source-promotion prerequisites are satisfied.
Missing `resilientBarSideCount` now parks explicit double-leaf/framed
route/output/report surfaces as `needs_input` instead of showing
fallback numbers.
The latest
manual export validation generated edited
PDF/DOCX artifacts from the same report snapshot: PDF rendered cleanly to
PNG, and DOCX package/XML checks confirmed the same manual values. The
Gate T then closed the remaining high-impact family material-property
gaps for Dynamic Calculator physics without replacing the solver with a
finite source catalog. It adds `absorberClass` as shared acoustic
material metadata and fills engineering-default acoustic properties for
board leaves/finishes, masonry cores, porous absorbers, floor
decks/screeds, limp membranes, and resilient impact layers. Required
property gaps still become `needs_input`; optional precision gaps widen
uncertainty through explicit defaults; no runtime values, support
buckets, card behavior, or report copy moved.
Gate V landed the no-runtime floor-impact dynamic-stiffness input and
adapter contract for Dynamic Calculator. It keeps the calculator-first
strategy intact: source rows can still anchor, calibrate, or override
when they truly match, but resilient floating-floor `Ln,w` / `DeltaLw`
now has executable physical input ownership instead of waiting on a
finite catalog. `resilientLayerDynamicStiffnessMNm3` and
`loadBasisKgM2` are required for the resilient floating-floor lane;
missing dynamic stiffness, missing load basis, field-output requests
without room context, and `IIC` / `AIIC` requests are covered by positive
and nearby-negative tests. `L'n,w` / `L'nT,w` remain field-context
outputs and `IIC` / `AIIC` remain blocked until ASTM E989 ownership is
implemented.

Gate W moved Dynamic Calculator floor-impact runtime only inside the
complete Gate V lab boundary. Current promoted floor pins are
`DeltaLw 24.3` / `LnW 50.3` for the heavy floating-floor predictor
scenario with explicit `loadBasisKgM2` and dynamic stiffness. Missing
load, missing dynamic stiffness, field impact without room context, and
ASTM `IIC` / `AIIC` remain non-promoted boundaries.

Gate X compared the remaining high-impact Dynamic Calculator gaps and
selected floor-impact field-context ownership as the next move. This is
the most direct continuation of Gate W: lab `Ln,w` / `DeltaLw` is now
owned, while `L'n,w`, `L'nT,w`, and `L'nT,50` still require explicit
room/context/flanking and ISO 717-2 field-adapter inputs. Gate X did not
move runtime values and deliberately keeps source rows as later anchors,
calibration, or exact overrides.

Gate Y then landed the no-runtime field-context contract. The contract
names the required physical fields, lab anchor, field `K` / mass-ratio /
direct-flanking policy, flanking owner, and low-frequency owner for
`L'nT,50`. Gate Z has now normalized field-only and lab-anchored mixed
`L'n,w` / `L'nT,w` runtime behavior under one owned
runtime/support/report policy.

Clean next-step queue:

1. Gate AA construction-image accuracy incident:
   create scenario tests, compare app-path and direct solver behavior,
   reject wrong route/source-family selections, and recover the solver
   domain for realistic grouped multi-leaf walls and explicit
   lightweight-steel floors.
2. Surface any remaining missing input controls in the workbench and
   proposal editor if Gate AA exposes a UI gap.
3. Keep source packet acquisition/calibration rows as later anchors or
   exact overrides only
   through the Gate H policy.

Gate Z landed status:

`gate_z_floor_impact_field_runtime_landed_selected_construction_image_accuracy_incident_gate_aa`

Gate Z selected Gate AA action:

`gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan`

Gate Y landed summary:

1. Added
   `packages/engine/src/dynamic-calculator-floor-impact-field-context-contract.ts`.
2. Added
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts`.
3. Defined positive and nearby-negative readiness for `contextMode`,
   `partitionAreaM2`, `receivingRoomVolumeM3`, `receivingRoomRt60S`,
   `impactFieldContext`, field/flanking policy, lab dynamic stiffness,
   and the low-frequency `L'nT,50` owner.
4. Selected Gate Z for floor-impact field runtime promotion and visible
   parity after this no-runtime contract.

Gate Y landed status:

`gate_y_floor_impact_field_context_contract_landed_no_runtime_selected_field_runtime_gate_z`

Gate Y selected Gate Z file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-z-floor-impact-field-runtime-contract.test.ts`

Gate Y selected Gate Z action:

`gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator`

Gate X landed summary:

1. Added
   `packages/engine/src/dynamic-calculator-next-solver-or-field-context-selection.ts`.
2. Added
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-x-next-solver-or-field-context-selection-contract.test.ts`.
3. Ranked floor-impact field context, floor-impact input surfacing, wall
   field/building context, generalized multi-cavity solving, ASTM impact
   adapter work, and double-leaf calibration holdouts.
4. Selected Gate Y because it increases personal-use floor coverage
   without treating a finite source catalog as the product.
5. Proved Gate W lab runtime pins remain unchanged while field impact
   outputs stay `needs_input` until their context boundary is owned.

Gate X landed status:

`gate_x_next_solver_or_field_context_selection_landed_no_runtime_selected_floor_impact_field_context_gate_y`

Gate X selected Gate Y file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts`

Gate X selected Gate Y action:

`gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator`

Gate W landed summary:

1. Added
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts`.
2. Promoted only the complete resilient floating-floor lab lane where
   Gate V's ISO 717-2 adapter is ready for `Ln,w` / `DeltaLw`.
3. Added `loadBasisKgM2` to the impact predictor input and fed it into
   the heavy floating-floor formula instead of relying on a hidden
   source row.
4. Kept `L'n,w`, `L'nT,w`, `IIC`, and `AIIC` out of runtime promotion;
   lab `Ln,w` is not aliased to field or ASTM ratings.
5. Added nearby negatives for missing `loadBasisKgM2`, missing
   `resilientLayerDynamicStiffnessMNm3`, unsupported ASTM ratings, and
   field outputs without room context.

Gate W landed status:

`gate_w_floor_impact_runtime_landed_selected_next_dynamic_calculator_solver_or_field_context_gate_x`

Gate W selected next action:

`gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary`

Gate W validation result:

- focused Gate W, focused Gate V, and Gate J/K regression tests are
  green;
- `pnpm --filter @dynecho/engine typecheck` is green;
- `pnpm calculator:gate:current` is green;
- broad `pnpm check` is green, including full engine/web tests and
  build; the known optional `sharp/@img` warnings remain non-fatal;
- `git diff --check` is green.

Gate V landed status:

`gate_v_floor_impact_dynamic_stiffness_contract_landed_no_runtime_selected_floor_impact_runtime_gate_w`

Gate V selected Gate W file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts`

Gate V selected Gate W action:

`gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator`

Previous Gate U selection status:

`gate_u_next_solver_or_calibration_selection_landed_no_runtime_selected_floor_impact_gate_v`

Gate U selected Gate V file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts`

Gate U selected Gate V action:

`gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator`

Corrected operating model:

1. whole-stack exact source row wins when present;
2. exact source subassembly can anchor a calculated delta candidate;
3. otherwise the stack goes through the best family-specific physics
   solver available;
4. source/lab rows calibrate, validate, benchmark, and override exact
   matches, but do not replace the calculator engine;
5. every surfaced number must carry basis/origin: exact, anchored
   delta, calibrated physics, physics prediction, bounded, screening,
   needs-input, or unsupported.

Research-backed standards frame:

- airborne prediction/rating aligns with ISO 12354-1 and ISO 717-1;
- impact prediction/rating aligns with ISO 12354-2 and ISO 717-2;
- lab rows carry ISO 10140 or ASTM E90/E492 style measurement basis;
- field outputs carry ISO 16283 or ASTM E336/E1007 style field basis;
- STC/IIC ratings must be rating-adapter outputs or exact source
  metadata, not informal aliases of `Rw`/`Ln,w`;
- porous absorber data belongs to ISO 9053 / ISO 354 / ASTM C423 style
  input evidence; NRC/absorption can inform cavity damping assumptions
  but must not be promoted as wall/floor isolation;
- floating-floor impact prediction needs resilient-layer dynamic
  stiffness/load basis, aligned with ISO 9052-1 style material context;
- source absence blocks exact promotion only; physical input absence
  produces `needs_input`; true route absence produces `unsupported`.
- INSUL is a useful public competitor/category reference because it is
  sold as prediction software for wall/floor/roof/ceiling/window sound
  insulation, but DynEcho must not merely imitate it. DynEcho's target is
  stronger: exact-source override plus model-first prediction with
  visible origin/basis, error budget, candidate rejection, and regression
  tests.

Current implementation facts from the re-analysis:

- `impact-lane.ts` already has the desired precedence pattern.
- airborne/wall now has first-class candidate/basis metadata for the
  grouped Rockwool prediction lane; broader families still need runtime
  population.
- `airborne-verified-catalog.ts` has whole-stack exact anchoring but no
  partial anchor plus delta candidate.
- `wall-triple-leaf-frequency-solver.ts` now feeds the explicit grouped
  Rockwool runtime path as uncalibrated family physics prediction.
- `airborne-source-promotion.ts` now defines the source-promotion
  readiness policy for exact full-stack, calibrated family, and
  exact-subassembly-plus-delta candidates. It keeps source rows from
  promoting outside the topology/material/metric/tolerance scope they
  own and requires paired positive/negative tests plus calibration
  holdout metadata.
- `packages/shared/src/domain/material.ts` now has optional acoustic
  material properties: behaviour, modulus, Poisson ratio, loss factor,
  flow resistivity, porosity, and source status. The seed catalog has
  nominal engineering defaults for the common materials needed by the
  first Gate I benchmark scenarios, but these defaults do not imply
  source-owned exactness.
- `airborne-family-material-expansion.ts` now defines the M8 benchmark
  scenario matrix and readiness evaluator. Missing required material
  properties produce `needs_input`; optional precision gaps produce
  `complete_with_defaults` plus an error-budget adjustment.
- grouped Rockwool explicit topology returns lab `Rw 50 / STC 55 /
  C 0.8 / Ctr -7.3`; flat-list split/internal Rockwool remains guarded
  at diagnostic `Rw 41` until topology is explicit.
- the report editor at `/workbench/proposal/configure` lets the user
  manually correct packaged report values before issue. PDF and DOCX use
  the same edited snapshot; report edits do not mutate calculator inputs,
  solver routes, or engine outputs.

Milestone execution order:

1. M1 Gate A direction contract:
   no-runtime test that locks source absence != formula absence and names
   the candidate/basis contract.
2. M2 basis and candidate schema:
   add airborne `basis`, `candidateSet`, missing-source, missing-input,
   defaults, standards, and error-budget metadata without moving values.
3. M3 rating adapter integrity:
   inventory ISO 717 / ASTM E413 / ASTM E989 adapters and prevent
   `Rw`/`STC`, `Ln,w`/`IIC`, and lab/field aliasing.
4. M4 input completeness / needs-input matrix:
   define required physical inputs for single leaf, double/framed,
   triple leaf, porous fill, floating floor, and field/apparent outputs.
5. M5 airborne candidate resolver:
   select between exact rows, partial anchors, calibrated physics,
   uncalibrated physics, bounded, screening, needs-input, and unsupported
   candidates with rejected-candidate traceability.
6. M6 grouped Rockwool triple-leaf prediction:
   first runtime movement; use the grouped triple-leaf/two-cavity solver
   as `family_physics_prediction`, not exact/source-validated.
7. M7 calibration and exact promotion:
   reintroduce source packets as exact override, calibration, benchmark,
   and holdout validation.
8. M8 family expansion / material-property widening:
   broaden single/double/triple/framed/masonry/CLT/floor families and add
   material properties needed for higher-accuracy solvers.
9. M9 personal-use readiness:
   broad scenario validation, visible basis checks, hostile input checks,
   `pnpm calculator:gate:current`, `pnpm check`, and docs guard.

Benchmark acceptance lanes now required before runtime movement:

- exact full-stack source row;
- exact subassembly anchor plus calculated delta;
- single-leaf/massive physics;
- double-leaf/framed/cavity physics;
- triple-leaf/multi-cavity physics;
- porous-fill/absorption-data boundary;
- floating-floor/impact prediction;
- field/apparent output context;
- rating-adapter integrity;
- hostile layer input stability;
- calibration/holdout;
- personal-use scenario pack.

Runtime movement stop rules:

- every non-exact result needs `errorBudgetDb` or `toleranceClass`;
- every field/apparent result needs the required context or returns
  `needs_input`;
- every runtime value move needs a positive benchmark and a nearby
  negative/hostile case;
- source rows cannot promote a broader family than their topology,
  metric, material mapping, and tolerance owner allow.

Source-absent solver contract now documented in the active slice:

- the calculator path is
  `layers -> material properties -> topology classifier -> family solver
  -> frequency curve -> ISO/ASTM rating adapter -> basis/error budget`;
- single-leaf routes start from mass law, panel stiffness,
  critical-frequency/coincidence, and loss-factor correction;
- double/framed routes model mass-air-mass resonance, cavity damping,
  cavity-mode transition, and frame/bridge transmission paths;
- triple/multi-cavity routes require grouped leaf/cavity topology and
  should grow from the current grouped triple-leaf solver toward a
  transfer-matrix / impedance-network model for solid leaves, limp-mass
  membranes, cavities, and porous fills;
- porous fills are damping inputs, not direct `Rw`/`STC` source rows;
- `Rw`, `C`, and `Ctr` come from ISO 717-1 adapters, `STC` from ASTM E413
  adapters, and no rating is copied as an alias.

Candidate selection contract:

- exact measured full-stack wins only on exact topology/metric/basis;
- similar measured assemblies can inform anchored deltas, calibration
  corridors, response surfaces, or conservative bounds only through a
  named algorithm and holdout/error-budget policy;
- family solvers remain live candidates even when no source packet exists;
- screening fallback is allowed only as visibly non-design-grade;
- the selected candidate and rejected candidates must explain basis
  compatibility, topology match, missing physical inputs, uncertainty,
  and why lab/field/building-prediction outputs were or were not allowed.

Immediate ordering after Gate J:

1. keep the unfinished selected point: Gate K route input and topology
   contract remains next;
2. use the landed ACON-like source-absent multi-leaf/multi-cavity wall
   scenario as an anti-library-drift regression: exact source absent,
   flat-list guarded, grouped topology required, screening visibly
   non-design-grade;
3. keep Gate J method-selection coverage active where exact source,
   similar-source anchored delta, calibrated solver, uncalibrated solver,
   bounded result, screening result, `needs_input`, and `unsupported`
   compete honestly;
4. add grouped leaf/cavity input contracts and UI prompts
   for cavity depths, frame coupling, MLV surface mass, and porous-fill
   properties;
5. move runtime solver values only in family-sized gates with positive
   benchmarks, nearby negatives, rating-adapter parity, and error budget;
6. use future source rows as exact override, calibration, holdout, and
   tolerance evidence, not as the primary strategy for unbounded layer
   combinations.

Dynamic calculator implementation ladder after Gate J:

1. Route input contract: wall/floor route, requested outputs, lab vs
   field vs building basis, room/flanking context, and family-required
   physical fields are represented as schema-owned inputs.
2. Topology normalizer: layer order, grouped leaves/cavities, frame
   coupling, support/resilient side, MLV/limp mass, porous fill, and
   floor roles are stable under duplicate/split/long-list hostile input.
3. Candidate resolver population: airborne/wall reaches the same
   candidate transparency as impact/floor, with selected and rejected
   candidates visible.
4. Family solver upgrades: single-leaf, double/framed, triple/multi-cavity,
   lined massive/masonry/CLT, porous/MLV, floating floor impact, and
   field/building continuations move in separate bounded gates.
5. UI prompting: missing physical fields become targeted prompts instead
   of silent defaults or unsupported cards.
6. Accuracy harness: every runtime movement includes numeric expected
   ranges, curve/rating parity, tolerance/error budget, positive
   benchmark, nearby negative, hostile layer cases, saved replay, and
   report parity.

Final pre-implementation engine/research read:

- INSUL's public documentation confirms the right minimum algorithmic
  shape: single panels require mass, elastic modulus, critical-frequency /
  coincidence, loss factor, finite-size behavior, and thick-panel effects;
  double panels require mass-law, mass-air-mass resonance, cavity-mode,
  absorber, and bridge/connection regions; triple panels are supported but
  explicitly carry higher uncertainty. DynEcho should treat this as a
  floor, not the ceiling.
- The local `airborne-calculator.ts` engines currently expose
  `ks_rw_calibrated`, `mass_law`, `sharp`, and `kurtovic`. KS is a
  mass-based `Rw` calibration lane, while Sharp and Kurtovic are
  single-panel curve delegates with only a small double-leaf gap bonus.
- The local `dynamic-airborne.ts` selector blends these delegates. It
  keeps rigid/single/lining routes useful, but `multileaf_multicavity`
  still selects `multileaf_screening_blend`, and stud/double-stud routes
  remain surrogate blends. Therefore the next implementation must start
  by making Gate J prove this limitation and the required future method
  selection, not by adding a larger source catalog.

Just landed Gate A:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`

Gate A selection status:

`gate_a_model_first_direction_contract_landed_no_runtime_selected_basis_gate_b`

Gate A status:

`gate_a_defined_model_first_candidate_basis_and_benchmark_acceptance_no_runtime`

Gate A locked the corrected model-first rule: source absence is an
exact/calibration blocker, not formula absence. It froze runtime values,
named airborne candidate origins and standards fields, carried forward
the B0-B12 benchmark acceptance lanes, and selected Gate B shared
airborne basis/candidate schema as the next no-value-movement step.

Gate B validation order:

1. Create
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts`.
2. Define the shared airborne basis/candidate schema without moving
   numeric runtime values, support buckets, confidence, route cards,
   output cards, proposal/report copy, or workbench input behavior.
3. Include `measurementStandard`, `calculationStandard`,
   `ratingStandard`, `frequencyBands`, `curveBasis`, `errorBudgetDb`,
   `toleranceClass`, `propertyDefaults`, `missingSourceEvidence`, and
   `missingPhysicalInputs`.
4. Prove source absence and physical input absence are separate fields.
5. Preserve current Rockwool values and keep M6 as the first runtime
   prediction movement.
6. Run focused Gate B and `git diff --check`.

Gate B implementation detail from the 2026-05-06 plan validation pass:

Gate B landed implementation check:

- Gate B is now implemented in
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts`.
- Gate B landed
  `gate_b_defined_shared_airborne_basis_candidate_schema_without_value_movement`;
  Gate B selection status was
  `gate_b_shared_airborne_basis_candidate_schema_landed_no_runtime_selected_rating_adapter_gate_c`;
  Gate A had selected
  `gate_b_define_shared_airborne_basis_candidate_schema_without_value_movement`.
- Shared schema now exposes optional `airborneBasis` and
  `airborneCandidateSet` fields.
- Gate A and `pnpm calculator:gate:current` are green with the current
  runtime values frozen.

Preferred Gate B edit scope:

1. Add shared airborne basis/candidate schemas, preferably in a small
   shared domain file such as
   `packages/shared/src/domain/airborne-basis.ts`.
2. Export the new shared schemas/types from `packages/shared/src/index.ts`.
3. Add optional `airborneBasis` and `airborneCandidateSet` fields to
   `packages/shared/src/domain/assembly.ts` so existing callers that do
   not send or read the new metadata still parse.
4. Create the focused Gate B contract test in the selected engine file.
5. Add the Gate B contract to `tools/dev/run-calculator-current-gate.ts`
   only after the focused Gate B test is passing.

Gate B schema contract:

- origins:
  `measured_exact_full_stack`,
  `measured_exact_subassembly_plus_calculated_delta`,
  `calibrated_family_physics`, `family_physics_prediction`,
  `bounded_prediction`, `screening_fallback`, `needs_input`, and
  `unsupported`;
- basis fields:
  `kind`, `origin`, `family`, `method`, `measurementStandard`,
  `calculationStandard`, `ratingStandard`, `frequencyBands`,
  `curveBasis`, `exactSourceId`, `anchorSourceId`, `errorBudgetDb`,
  `toleranceClass`, `requiredInputs`, `assumptions`,
  `propertyDefaults`, `missingSourceEvidence`, and
  `missingPhysicalInputs`;
- candidate fields:
  candidate id/origin, selected flag, output ids or metric ids, basis
  metadata, and rejected-candidate reasons when not selected;
- source absence and physical input absence must be represented as
  separate arrays/fields. Missing source evidence can block exact or
  calibration promotion only; missing topology/geometry/input can
  produce `needs_input`.

Gate B tests must prove:

- a legacy `AssemblyCalculation` without `airborneBasis` and
  `airborneCandidateSet` still parses;
- exact/catalog examples can carry measurement and rating basis;
- formula-backed prediction examples can carry calculation and rating
  basis plus `errorBudgetDb` or `toleranceClass`;
- `missingSourceEvidence` and `missingPhysicalInputs` are distinct;
- current Rockwool values remain frozen:
  adjacent Rockwool stays `Rw 51 / R'w 49 / DnT,w 51`, and split or
  grouped unresolved Rockwool stays `Rw 41` screening until M6;
- no support bucket, confidence, route-card value, output-card status,
  proposal/report copy, or workbench input behavior changes in Gate B.

Gate B validation commands:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts --maxWorkers=1
git diff --check
```

Run `pnpm calculator:gate:current` after adding Gate B to the current
gate runner or after any authority-doc/current-gate alignment changes.

Gate C validation order:

1. Create
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-c-rating-adapter-contract.test.ts`.
2. Inventory existing airborne and impact single-number rating paths.
3. Prove `Rw`/`STC`, `Ln,w`/`IIC`, lab, field, and
   building-prediction values remain basis-owned and cannot silently
   alias.
4. Keep runtime values, support buckets, visible cards, reports, and
   workbench input behavior frozen.
5. Run focused Gate C, Gate B continuity, `pnpm calculator:gate:current`,
   and `git diff --check`.

Gate C landed implementation check:

- Gate C is now implemented in
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-c-rating-adapter-contract.test.ts`.
- Gate C landed
  `gate_c_inventory_rating_adapter_integrity_without_value_movement`.
- Shared schema now exposes optional `ratingAdapterBasisSet` metadata
  through `packages/shared/src/domain/rating-adapter.ts` and
  `AssemblyCalculationSchema`.
- The Gate C contract inventories ISO 717-1, ISO 717-2, ASTM E413, and
  ASTM E989. `Rw`/`STC`, `Ln,w`/`IIC`, and lab/field contexts are
  rejected as silent aliases. ASTM E989/IIC is recorded as
  `planned_not_implemented` until a real runtime adapter or exact source
  owner lands.
- Current Rockwool values remain frozen; M6 is still the first runtime
  prediction movement.
- Gate C validation passed on 2026-05-06: focused Gate C 1 file / 6
  tests, focused Gate A/B/C continuity 3 files / 17 tests, and
  `pnpm calculator:gate:current` with engine 284 files / 1604 tests,
  web 61 files / 273 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard green. Broad `pnpm check` also passed with
  lint/typecheck clean, engine 409 files / 2406 tests, web 166 files /
  936 passed + 18 skipped, repo build 5 / 5 tasks, and final
  `git diff --check` green after `apps/web/next-env.d.ts` restoration.
- Gate C selection status:
  `gate_c_rating_adapter_integrity_landed_no_runtime_selected_input_completeness_gate_d`.

Gate D validation order:

1. Create
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts`.
2. Define the minimum physical input matrix for single leaf,
   double/framed, triple leaf, porous fill, floating floor, and
   field/apparent outputs.
3. Prove missing source evidence and missing physical inputs remain
   separate: source absence blocks exact/calibration only; missing
   physical inputs produce `needs_input`.
4. Keep runtime values, support buckets, visible cards, reports, and
   workbench input behavior frozen.
5. Run focused Gate D plus Gate A/B/C continuity, then
   `pnpm calculator:gate:current` and `git diff --check`.

Gate D landed implementation check:

- Gate D is now implemented in
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts`.
- Gate D landed
  `gate_d_define_physical_input_completeness_needs_input_matrix_without_value_movement`.
- Shared schema now exposes optional `inputCompletenessSet` metadata
  through `packages/shared/src/domain/input-completeness.ts` and
  `AssemblyCalculationSchema`.
- The Gate D contract defines minimum physical inputs for single leaf,
  double/framed, triple-leaf/multicavity, porous fill, floating floor,
  and field/apparent output contexts.
- Missing exact/source evidence is separated from missing physical
  inputs: source absence blocks exact/calibration only, while physical
  input absence produces `needs_input`.
- Optional precision gaps can widen uncertainty only through documented
  defaults; they are not `needs_input` blockers.
- Current Rockwool values remain frozen; M6 is still the first runtime
  prediction movement.
- Gate D validation passed on 2026-05-06: focused Gate D 1 file / 7
  tests, focused Gate A/B/C/D continuity 4 files / 24 tests, and
  `pnpm calculator:gate:current` with engine 285 files / 1611 tests,
  web 61 files / 273 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard green. Broad `pnpm check` also passed with
  lint/typecheck clean, engine 410 files / 2413 tests, web 166 files /
  936 passed + 18 skipped, repo build 5 / 5 tasks, and final
  `git diff --check` green.

Gate D selected Gate E:

`gate_d_input_completeness_matrix_landed_no_runtime_selected_airborne_candidate_resolver_gate_e`

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts`

`gate_e_define_airborne_candidate_resolver_selected_rejected_candidates_without_value_movement`

Gate E landed implementation check:

- Gate E is now implemented in
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts`.
- Gate E landed
  `gate_e_define_airborne_candidate_resolver_selected_rejected_candidates_without_value_movement`.
- Shared schema now exposes optional `airborneCandidateResolution`
  metadata through `packages/shared/src/domain/airborne-basis.ts` and
  `AssemblyCalculationSchema`.
- The resolver contract pins the model-first airborne precedence:
  exact full-stack, anchored delta, calibrated family physics,
  uncalibrated family physics prediction, bounded prediction, screening
  fallback, `needs_input`, then `unsupported`.
- The selected candidate must be exactly one candidate, cannot carry
  rejection reasons, and every rejected candidate must explain why it
  lost or was blocked.
- Missing source evidence blocks exact/calibration promotion only;
  missing physical topology selects `needs_input`; deterministic
  tie-breakers cover duplicate rows and safe candidate reorders.
- Current Rockwool values remain frozen; Gate G/M6 is still the first
  runtime prediction movement.
- Gate E validation passed on 2026-05-06: focused Gate E 1 file / 8
  tests, focused Gate A/B/C/D/E continuity 5 files / 32 tests, and
  `pnpm calculator:gate:current` with engine 286 files / 1619 tests,
  web 61 files / 273 passed + 18 skipped, repo build 5 / 5 tasks, and
  whitespace guard green. Broad `pnpm check` also passed with
  lint/typecheck clean, engine 411 files / 2421 tests, web 166 files /
  936 passed + 18 skipped, repo build 5 / 5 tasks, and final
  `git diff --check` green.

Gate E selected Gate G:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-g-grouped-rockwool-prediction-contract.test.ts`

`gate_g_promote_grouped_rockwool_triple_leaf_family_physics_prediction_with_benchmarks`

Everything below this line is chronology/history unless a future top
section promotes it again. Older blocks may still contain words such as
"current", "active", or "selected next action"; read those as current
only for that historical slice.

## Historical Decision Map - 2026-05-05 V28 Source-Gap Revalidation Gate A Landed / Rockwool Source-Packet Refresh Selected

This section is retained for traceability only. It is not the active
next implementation plan.

Historical implementation position:
`rockwool_split_triple_leaf_rights_safe_source_packet_refresh_v2`.

Calculator source-gap revalidation V28 Gate A landed:

`packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts`

Landed status:

`selected_rockwool_split_triple_leaf_rights_safe_source_packet_refresh_after_v28_rerank_no_runtime_candidates_after_ubiq_packaged_finish`

Historical selected next file:

`packages/engine/src/rockwool-split-triple-leaf-rights-safe-source-packet-refresh-v2-gate-a-contract.test.ts`

Historical selected next action:

`gate_a_refresh_rights_safe_rockwool_triple_leaf_source_packet_search_without_runtime`

Historical planning surface:

`docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_RIGHTS_SAFE_SOURCE_PACKET_REFRESH_V2_PLAN.md`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V28_GATE_A_HANDOFF.md`

Gate A artifacts:

- `ubiq_packaged_finish_current_gate_pack_preserved_after_v28`
- `rockwool_numeric_boundaries_after_v28`
- `rockwool_rights_safe_source_packet_refresh_selected_after_v28`
- `raw_open_web_and_company_internal_blockers_carry_forward_after_v28`

Protected behavior:

- UBIQ packaged-finish remains current-gate owned for `90 exact` and
  `21 bound` open-web rows.
- adjacent Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`.
- flat-list split/internal gypsum-leaf Rockwool remains withheld from
  supported outputs and diagnostic-only at `Rw 41 / R'w 39 / DnT,w 40`.
- grouped Rockwool remains screening-only/source-blocked at `Rw 41`.
- generic/raw open-web widening remains blocked by
  `source_owned_raw_carrier_negative_boundary_absent`.

Why this was selected at the time: after UBIQ current-gate closeout, Rockwool is
again the highest user-visible numeric blocker. Direct exact runtime is
still blocked by `rights_safe_source_owned_curve_payload_absent`, so the
then-selected bounded source-exact step was source-packet refresh, not a
guessed runtime retune. This has since been superseded as active work by
the model-first physics prediction pivot above.

Validation order for Rockwool source-packet refresh Gate A:

1. Create
   `packages/engine/src/rockwool-split-triple-leaf-rights-safe-source-packet-refresh-v2-gate-a-contract.test.ts`.
2. Re-check local/rights-safe source packet state and the previous Uris
   Gate U decision.
3. Accept no runtime movement unless the slice can name source-owned
   curve/band payload, topology/material/metric/tolerance owners,
   negative boundaries, calibration/holdout, and paired engine/web
   visible tests.
4. If no packet is available, close no-runtime with a durable blocker
   and select the next bounded correctness step.
5. Run focused Rockwool source-packet refresh, continuity,
   `pnpm calculator:gate:current`, and `git diff --check`.

Latest validation:

V28 validation completed on 2026-05-05: focused V28 Gate A passed
1 file / 5 tests; focused UBIQ continuity passed 7 files / 25 tests;
focused Rockwool/source-packet continuity passed 4 files / 21 tests;
final doc-contract continuity passed 4 files / 20 tests after the
validation notes were updated;
final `pnpm calculator:gate:current` passed with engine 281 files /
1587 tests, web 61 files / 273 passed + 18 skipped, repo build 5 / 5
tasks, and whitespace guard green. Final `git diff --check` passed.
Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was restored to
`.next-typecheck` after the Next build.

## Prior Active Decision Map - 2026-05-05 UBIQ Packaged-Finish Current-Gate Guard Gate C Closed / V28 Selected

Current implementation position:
`calculator_source_gap_revalidation_v28`.

UBIQ packaged-finish current-gate guard Gate C closeout landed:

`packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Landed status:

`closed_ubiq_open_web_packaged_finish_current_gate_guard_selected_source_gap_revalidation_v28`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_gap_order_after_ubiq_packaged_finish_current_gate_closeout`

Active planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V28_PLAN.md`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`

Gate C artifacts:

- `closed_ubiq_packaged_finish_current_gate_guard_summary`
- `packaged_finish_current_gate_pack_carry_forward`
- `source_gap_revalidation_v28_selected_after_ubiq_packaged_finish_closeout`
- `rockwool_and_raw_open_web_blockers_carry_forward_after_ubiq_packaged_finish_closeout`

Current-gate protected pack:

- `src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`
- `src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts`
- `src/ubiq-open-web-packaged-finish-family-design.test.ts`
- `src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts`
- `src/ubiq-open-web-packaged-lane-trace-matrix.test.ts`
- `features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts`
- `features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts`
- `features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts`
- `features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts`

Protected behavior: `90 exact` and `21 bound` UBIQ open-web rows from
the official UBIQ PDF remain current-gate owned across engine and
visible guard surfaces. Runtime values, support semantics, confidence,
evidence, API, route-card values, output-card statuses,
proposal/report copy, and workbench-input behavior remain frozen.

Rockwool and raw open-web blockers remain unchanged: direct Rockwool
exact runtime is still blocked by
`rights_safe_source_owned_curve_payload_absent`, and generic/raw
open-web widening is still blocked by
`source_owned_raw_carrier_negative_boundary_absent`.

Validation order for V28:

1. Create
   `packages/engine/src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts`.
2. Re-rank the remaining source accuracy gaps after packaged-finish
   current-gate closeout.
3. Keep direct Rockwool exact runtime blocked unless the missing
   rights-safe source-owned curve packet appears.
4. Keep generic/raw open-web widening blocked unless a source-owned raw
   carrier topology, metric, tolerance, and negative-boundary owner is
   named.
5. Select the next bounded accuracy slice with a target file, action,
   blockers, and validation scope.
6. Run focused V28, focused UBIQ continuity,
   `pnpm calculator:gate:current`, and `git diff --check`.

Latest validation:

Gate C validation completed on 2026-05-05: focused Gate C closeout
passed 1 file / 5 tests; focused packaged-finish continuity passed
with engine 5 files / 15 tests and web 4 files / 5 tests; final
`pnpm calculator:gate:current` passed with engine 280 files / 1582
tests, web 61 files / 273 passed + 18 skipped, repo build 5 / 5 tasks,
and whitespace guard green. Final `git diff --check` passed. Known
non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was restored to
`.next-typecheck` after the Next build.

## Prior Active Decision Map - 2026-05-05 UBIQ Packaged-Finish Current-Gate Guard Gate A Landed / Closeout Selected

Current implementation position:
`ubiq_open_web_packaged_finish_current_gate_guard_v1`.

UBIQ packaged-finish current-gate guard Gate A landed:

`packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`

Landed status:

`gate_a_promoted_ubiq_packaged_finish_engine_visible_guards_into_current_gate_selected_closeout`

Selected next file:

`packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Selected next action:

`gate_c_closeout_ubiq_open_web_packaged_finish_current_gate_guard_and_select_next_accuracy_slice`

Active planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_GATE_A_HANDOFF.md`

Gate A artifacts:

- `ubiq_packaged_finish_current_gate_guard_gate_a_summary`
- `current_gate_promoted_ubiq_packaged_finish_engine_visible_pack`
- `source_verified_ubiq_packaged_finish_pdf_status`
- `rockwool_and_raw_open_web_blockers_still_carry_forward_after_packaged_finish_gate_a`

Current-gate promoted pack:

- `src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`
- `src/ubiq-open-web-packaged-finish-family-design.test.ts`
- `src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts`
- `src/ubiq-open-web-packaged-lane-trace-matrix.test.ts`
- `features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts`
- `features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts`
- `features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts`
- `features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts`

Protected behavior: `90 exact` and `21 bound` UBIQ open-web rows from
the official UBIQ PDF are now current-gate owned across engine and
visible guard surfaces. Runtime values, support semantics, confidence,
evidence, API, route-card values, output-card statuses,
proposal/report copy, and workbench-input behavior remain frozen.

Rockwool and raw open-web blockers remain unchanged: direct Rockwool
exact runtime is still blocked by
`rights_safe_source_owned_curve_payload_absent`, and generic/raw
open-web widening is still blocked by
`source_owned_raw_carrier_negative_boundary_absent`.

Validation order for packaged-finish closeout:

1. Create
   `packages/engine/src/post-ubiq-open-web-packaged-finish-current-gate-guard-v1-next-slice-selection-contract.test.ts`.
2. Close `ubiq_open_web_packaged_finish_current_gate_guard_v1` with no
   runtime changes.
3. Confirm the full packaged-finish pack remains in
   `tools/dev/run-calculator-current-gate.ts`.
4. Re-rank/select the next bounded accuracy slice without promoting
   Rockwool exact runtime or generic/raw open-web widening while their
   source blockers remain active.
5. Run focused closeout, focused UBIQ continuity,
   `pnpm calculator:gate:current`, and `git diff --check`.

Latest validation:

Packaged-finish Gate A validation completed on 2026-05-05: focused
Gate A passed 1 file / 5 tests; focused packaged-finish continuity
passed with engine 4 files / 10 tests and web 4 files / 5 tests; final
`pnpm calculator:gate:current` passed with engine 279 files / 1577
tests, web 61 files / 273 passed + 18 skipped, repo build 5 / 5 tasks,
and whitespace guard green. Known non-fatal `sharp/@img` warnings
remain through `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was
restored to `.next-typecheck` after the Next build.

## Prior Active Decision Map - 2026-05-05 V27 Source-Gap Revalidation Gate A Landed / UBIQ Packaged-Finish Guard Selected

Current implementation position:
`ubiq_open_web_packaged_finish_current_gate_guard_v1`.

Calculator source-gap revalidation V27 Gate A landed:

`packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts`

Landed status:

`selected_ubiq_open_web_packaged_finish_current_gate_guard_after_v27_rerank_preserved_rockwool_and_raw_open_web_blockers`

Selected next file:

`packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`

Selected next action:

`gate_a_promote_ubiq_open_web_packaged_finish_engine_visible_guards_into_current_gate`

Active planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_PACKAGED_FINISH_CURRENT_GATE_GUARD_V1_PLAN.md`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V27_GATE_A_HANDOFF.md`

Latest broad validation checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_BROAD_REVALIDATION_AND_NEXT_STEP_HANDOFF.md`

Latest pre-implementation analysis checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_PRE_UBIQ_PACKAGED_FINISH_GATE_A_ANALYSIS_REPLAN_HANDOFF.md`

Gate A artifacts:

- `remaining_accuracy_gap_order_after_ubiq_supported_band_closeout`
- `ubiq_packaged_finish_ready_surfaces_after_v27`
- `packaged_finish_current_gate_guard_selected_after_v27`
- `rockwool_source_blockers_carry_forward_after_v27`

Selected next accuracy work: promote the UBIQ open-web
packaged-finish engine and visible guard pack into current-gate
ownership. This protects `90 exact` and `21 bound` source-backed UBIQ
open-web rows across family-design, near-miss, packaged-lane trace,
visible card, and saved/edit history replay surfaces before any
generic/raw open-web widening.

Current selected guard pack to promote:

- `packages/engine/src/ubiq-open-web-packaged-finish-family-design.test.ts`
- `packages/engine/src/ubiq-open-web-packaged-finish-near-miss-matrix.test.ts`
- `packages/engine/src/ubiq-open-web-packaged-lane-trace-matrix.test.ts`
- `apps/web/features/workbench/ubiq-open-web-packaged-finish-family-card-design.test.ts`
- `apps/web/features/workbench/ubiq-open-web-packaged-finish-near-miss-card-matrix.test.ts`
- `apps/web/features/workbench/ubiq-open-web-packaged-finish-history-replay-matrix.test.ts`
- `apps/web/features/workbench/ubiq-open-web-packaged-lane-card-matrix.test.ts`

Rockwool carry-forward remains unchanged: adjacent Rockwool stays
supported at `Rw 51 / R'w 49 / DnT,w 51`; flat-list split/internal
gypsum-leaf Rockwool stays withheld with diagnostic
`Rw 41 / R'w 39 / DnT,w 40`; grouped Rockwool stays `Rw 41`
screening-only; direct exact runtime remains blocked by
`rights_safe_source_owned_curve_payload_absent`. Generic/raw open-web
widening remains blocked by `source_owned_raw_carrier_negative_boundary_absent`.

Validation order for packaged-finish Gate A:

1. Create
   `packages/engine/src/ubiq-open-web-packaged-finish-current-gate-guard-gate-a-contract.test.ts`.
2. Add the existing UBIQ packaged-finish engine and web guard files to
   `tools/dev/run-calculator-current-gate.ts`.
3. Prove exact family design, bound-only behavior, near-miss
   fail-closed behavior, workbench cards, and history replay are
   current-gate owned.
4. Keep runtime values, support semantics, confidence, evidence, API,
   route-card values, output-card statuses, proposal/report copy, and
   workbench-input behavior frozen.
5. Run focused UBIQ continuity, `pnpm calculator:gate:current`, and
   `git diff --check`.

Latest validation:

V27 Gate A validation completed on 2026-05-05: focused V27 Gate A
passed 1 file / 5 tests; focused UBIQ packaged-finish engine continuity
passed 5 files / 15 tests; focused UBIQ packaged-finish visible
continuity passed 4 files / 5 tests; final
`pnpm calculator:gate:current` passed with engine 275 files / 1567
tests, web 57 files / 268 passed + 18 skipped, repo build 5 / 5 tasks,
and whitespace guard green. Known non-fatal `sharp/@img` warnings
remain through `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was
restored to `.next-typecheck` after the Next build.

Broad validation and plan refresh completed on 2026-05-05:
`pnpm check` passed with lint clean, typecheck clean, engine full suite
403 files / 2374 tests, web full suite 166 files / 936 passed + 18
skipped, and repo build 5 / 5 tasks. Final `git diff --check` was
green before the broad-validation checkpoint write. The correct next
step remains packaged-finish Gate A because there is no broad-test
failure requiring emergency repair, while the existing UBIQ
packaged-finish guard pack is source-backed and ready to become
current-gate owned. Direct Rockwool exact runtime remains blocked by
`rights_safe_source_owned_curve_payload_absent`; generic/raw open-web
widening remains blocked by `source_owned_raw_carrier_negative_boundary_absent`.

Pre-Gate A analysis refresh completed on 2026-05-05: the selected
contract file is still absent, the seven UBIQ packaged-finish engine and
visible guard files exist, and focused continuity passed with engine
4 files / 10 tests and web 4 files / 5 tests. The official UBIQ PDF
source is accessible, so no new internet research is needed for this
no-runtime guard promotion. The immediate implementation remains Gate A:
create the current-gate owner contract, add the seven existing guard
files to `tools/dev/run-calculator-current-gate.ts`, and keep runtime
behavior frozen. Direct Rockwool exact runtime remains a separate
blocked source-packet problem, not a shortcut target for this Gate A.

## Prior Active Decision Map - 2026-05-05 UBIQ Supported-Band Current-Gate Guard Gate C Closed / V27 Selected

Current implementation position:
`calculator_source_gap_revalidation_v27`.

UBIQ supported-band current-gate guard Gate C landed:

`packages/engine/src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Landed status:

`closed_ubiq_open_web_supported_band_current_gate_guard_selected_source_gap_revalidation_v27`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_gap_order_after_ubiq_supported_band_current_gate_closeout`

Active planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V27_PLAN.md`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`

Gate C artifacts:

- `closed_ubiq_supported_band_current_gate_guard_summary`
- `supported_band_current_gate_pack_carry_forward`
- `source_gap_revalidation_v27_selected_after_ubiq_supported_band_closeout`
- `rockwool_blockers_still_carry_forward_after_ubiq_supported_band_closeout`

Current-gate carried UBIQ pack:

- `src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`
- `src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`
- `src/ubiq-open-web-weak-band-exact-source-mapping.test.ts`
- `src/ubiq-open-web-weaker-band-posture-guard.test.ts`
- `features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts`
- `src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`
- `src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`
- `src/ubiq-open-web-supported-band-finish-completion.test.ts`
- `src/ubiq-lnw-plus-ci-bound-history-guard.test.ts`
- `src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`
- `features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts`
- `features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`

Selected next accuracy work: V27 revalidates the source-gap order after
UBIQ FL-23/25/27 weak-band and FL-24/26/28 supported-band surfaces
became current-gate owned. V27 must select the next bounded
source-backed correctness slice without promoting Rockwool exact runtime
while `rights_safe_source_owned_curve_payload_absent` is still active
and without opening generic/raw open-web widening before source-owned
negative boundaries are named.

Validation order for V27:

1. Create
   `packages/engine/src/calculator-source-gap-revalidation-v27-gate-a-contract.test.ts`.
2. Re-rank remaining source-backed runtime/guard work after UBIQ
   current-gate closeout.
3. Keep Rockwool exact runtime and generic/raw open-web widening blocked
   unless V27 can name the missing source owners.
4. Select one bounded next slice with target file and validation scope.
5. Run focused V27 continuity, `pnpm calculator:gate:current`, and
   `git diff --check`.

Latest validation:

Supported-band Gate C closeout validation completed on 2026-05-05:
focused closeout passed 1 file / 5 tests; focused UBIQ continuity
passed with engine 7 files / 27 tests and web 3 files / 5 tests; final
`pnpm calculator:gate:current` passed with engine 274 files / 1562
tests, web 57 files / 268 passed + 18 skipped, repo build 5 / 5 tasks,
and whitespace guard green. Known non-fatal `sharp/@img` warnings
remain through `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was
restored to `.next-typecheck` after the Next build.

## Prior Active Decision Map - 2026-05-05 UBIQ Supported-Band Current-Gate Guard Gate A Landed / Closeout Selected

Current implementation position:
`ubiq_open_web_supported_band_current_gate_guard_v1`.

UBIQ supported-band current-gate guard Gate A landed:

`packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`

Landed status:

`gate_a_promoted_ubiq_supported_band_exact_and_bound_guards_into_current_gate_selected_closeout`

Selected next file:

`packages/engine/src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Selected next action:

`gate_c_closeout_ubiq_open_web_supported_band_current_gate_guard_and_select_next_accuracy_slice`

Active planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_V1_PLAN.md`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_GATE_A_HANDOFF.md`

Gate A artifacts:

- `ubiq_supported_band_current_gate_guard_gate_a_summary`
- `current_gate_promoted_ubiq_supported_band_engine_visible_pack`
- `rockwool_blockers_still_carry_forward_after_ubiq_supported_band_gate_a`

Current-gate promoted supported-band pack:

- `src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`
- `src/ubiq-open-web-supported-band-finish-completion.test.ts`
- `src/ubiq-lnw-plus-ci-bound-history-guard.test.ts`
- `src/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`
- `features/workbench/ubiq-lnw-plus-ci-bound-history-guard.test.ts`
- `features/workbench/ubiq-lnw-plus-ci-near-miss-estimate-posture.test.ts`

Protected UBIQ values:

- FL-24 bare exact:
  `ubiq_fl24_open_web_steel_300_19mm_bare_exact_lab_2026`, `Rw 61`,
  `Ln,w 62`, `Ln,w+CI 60`.
- FL-26 bare exact:
  `ubiq_fl26_open_web_steel_200_16mm_bare_exact_lab_2026`, `Rw 60`,
  `Ln,w 62`, `Ln,w+CI 61`.
- FL-28 bare exact:
  `ubiq_fl28_open_web_steel_400_19mm_bare_exact_lab_2026`, `Rw 64`,
  `Ln,w 58`, `Ln,w+CI 56`.
- FL-28 carpet bound:
  `ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026`,
  `Rw 64`, `Ln,w+CI <= 45`, no exact `Ln,w`.

Rockwool carry-forward remains unchanged: adjacent Rockwool stays
supported at `Rw 51 / R'w 49 / DnT,w 51`; flat-list split/internal
gypsum-leaf Rockwool stays withheld with diagnostic
`Rw 41 / R'w 39 / DnT,w 40`; grouped Rockwool stays `Rw 41`
screening-only; direct exact runtime remains blocked by
`rights_safe_source_owned_curve_payload_absent`.

Validation order for supported-band Gate A closeout:

1. Create
   `packages/engine/src/post-ubiq-open-web-supported-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`.
2. Close `ubiq_open_web_supported_band_current_gate_guard_v1`
   no-runtime.
3. Confirm the supported-band exact/bound current-gate pack remains in
   `tools/dev/run-calculator-current-gate.ts`.
4. Re-rank remaining source-backed accuracy work and select the next
   bounded slice.
5. Run `pnpm calculator:gate:current` and `git diff --check`.

Latest validation:

Supported-band Gate A validation completed on 2026-05-05: focused Gate
A passed 1 file / 5 tests; focused continuity passed with engine
3 files / 7 tests and web 2 files / 3 tests; focused V26 + weak-band +
supported-band doc continuity pack passed 4 files / 20 tests after
restoring prior carry-forward strings in
`docs/calculator/CURRENT_STATE.md`; final
`pnpm calculator:gate:current` passed with engine 273 files / 1557
tests, web 57 files / 268 passed + 18 skipped, repo build 5 / 5 tasks,
and whitespace guard green. Known non-fatal `sharp/@img` warnings
remain through `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts` was
restored to `.next-typecheck` after the Next build.

## Prior Active Decision Map - 2026-05-05 UBIQ Weak-Band Current-Gate Guard Gate C Closed / Supported-Band Guard Selected

Current implementation position:
`ubiq_open_web_supported_band_current_gate_guard_v1`.

UBIQ weak-band current-gate guard Gate C landed:

`packages/engine/src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Landed status:

`closed_ubiq_open_web_weak_band_current_gate_guard_selected_supported_band_current_gate_guard`

Selected next file:

`packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`

Selected next action:

`gate_a_promote_source_backed_ubiq_supported_band_exact_and_bound_guards_into_current_gate`

Active planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_SUPPORTED_BAND_CURRENT_GATE_GUARD_V1_PLAN.md`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`

Gate C artifacts:

- `closed_ubiq_weak_band_current_gate_guard_summary`
- `weak_band_current_gate_pack_carry_forward`
- `ubiq_supported_band_source_ready_next`
- `rockwool_blockers_still_carry_forward_after_ubiq_weak_band_closeout`

Selected next accuracy work: promote the UBIQ FL-24/26/28
supported-band exact/bound guard pack into current-gate ownership.
This protects 36 exact bare/timber rows and 18 carpet bound rows,
including the representative FL-28 exact bare stack (`Rw 64`,
`Ln,w 58`, `Ln,w+CI 56`) and FL-28 carpet bound stack (`Rw 64`,
`Ln,w+CI <= 45`, no exact `Ln,w`).

Validation order for supported-band Gate A:

1. Create
   `packages/engine/src/ubiq-open-web-supported-band-current-gate-guard-gate-a-contract.test.ts`.
2. Add existing supported-band exact, bound-history, and near-miss
   engine/web guards to `tools/dev/run-calculator-current-gate.ts`.
3. Prove exact bare/timber rows stay live and carpet bound rows remain
   bound-only without fabricated `Ln,w`.
4. Keep runtime values, source rows, APIs, route-card values,
   output-card statuses, and workbench-input behavior unchanged.
5. Run focused UBIQ continuity, `pnpm calculator:gate:current`, and
   `git diff --check`.

## Prior Active Decision Map - 2026-05-05 UBIQ Weak-Band Current-Gate Guard Gate A Landed / Closeout Selected

Current implementation position:
`ubiq_open_web_weak_band_current_gate_guard_v1`.

UBIQ weak-band current-gate guard Gate A landed:

`packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`

Landed status:

`gate_a_promoted_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate_selected_closeout`

Selected next file:

`packages/engine/src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`

Selected next action:

`gate_c_closeout_ubiq_open_web_weak_band_current_gate_guard_and_select_next_accuracy_slice`

Active planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_V1_PLAN.md`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_GATE_A_HANDOFF.md`

Gate A artifacts:

- `ubiq_weak_band_current_gate_guard_gate_a_summary`
- `current_gate_promoted_ubiq_weak_band_engine_visible_pack`
- `rockwool_source_blockers_carry_forward_after_ubiq_gate_a`

Current-gate pack now includes:

- `src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`
- `src/ubiq-open-web-weak-band-exact-source-mapping.test.ts`
- `src/ubiq-open-web-weaker-band-posture-guard.test.ts`
- `features/workbench/ubiq-open-web-weaker-band-card-posture.test.ts`

Protected UBIQ behavior: 54 exact FL-23/25/27 weak-band rows remain
exact-only; exact lower-board stacks stay live on published values, and
upper-only weak-band stacks keep impact outputs fail-closed.

Protected Rockwool carry-forward: adjacent Rockwool stays supported at
`Rw 51 / R'w 49 / DnT,w 51`; flat-list split/internal gypsum-leaf
Rockwool stays withheld with diagnostic `Rw 41 / R'w 39 / DnT,w 40`;
grouped Rockwool stays `Rw 41` screening-only; direct exact runtime
stays blocked by `rights_safe_source_owned_curve_payload_absent`.

Validation order for UBIQ closeout:

1. Create
   `packages/engine/src/post-ubiq-open-web-weak-band-current-gate-guard-v1-next-slice-selection-contract.test.ts`.
2. Close `ubiq_open_web_weak_band_current_gate_guard_v1` no-runtime.
3. Confirm the current-gate UBIQ pack remains in
   `tools/dev/run-calculator-current-gate.ts`.
4. Select the next bounded accuracy/source slice.
5. Run `pnpm calculator:gate:current` and `git diff --check`.

Latest validation:

UBIQ weak-band current-gate guard Gate A validation completed on
2026-05-05: focused UBIQ Gate A passed 1 file / 5 tests; focused UBIQ
continuity passed with engine 2 files / 6 tests and web 1 file / 2
tests; final `pnpm calculator:gate:current` passed with engine 268 files
/ 1540 tests, web 55 files / 265 passed + 18 skipped, repo build 5 / 5
tasks, and whitespace guard green; final `git diff --check` passed.
Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`.

## Prior Active Decision Map - 2026-05-05 V26 Source Gap Revalidation Gate A Landed / UBIQ Weak-Band Guard Selected

Current implementation position before UBIQ Gate A:
`ubiq_open_web_weak_band_current_gate_guard_v1`.

V26 Gate A landed:

`packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts`

Landed status:

`selected_ubiq_open_web_weak_band_current_gate_guard_after_v26_rerank_preserved_rockwool_blockers_and_found_source_backed_floor_exact_guard_gap`

Selected next file:

`packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`

Selected next action:

`gate_a_promote_source_backed_ubiq_weak_band_exact_and_fail_closed_guards_into_current_gate`

Active planning surface:

`docs/calculator/SLICE_UBIQ_OPEN_WEB_WEAK_BAND_CURRENT_GATE_GUARD_V1_PLAN.md`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_GATE_A_HANDOFF.md`

V26 artifacts:

- `remaining_accuracy_gap_order_after_rockwool_closeout`
- `rockwool_source_blockers_carry_forward_after_v26`
- `selected_ubiq_open_web_weak_band_current_gate_guard`

Selected accuracy work: promote the source-backed UBIQ FL-23/25/27
open-web weak-band guard into current-gate ownership. This is not a
confidence/copy pass. It protects exact lower-board floor stacks and the
upper-only impact fail-closed boundary:

- representative FL-23 exact lower-board stack: `Rw 51`, `Ln,w 71`,
  `Ln,w+CI 70`, field `R'w 72`, `DnT,w 74`, `L'n,w 73`, `L'nT,w 70.6`.
- representative FL-23 upper-only stack: airborne `Rw 73` remains live,
  but impact outputs remain unsupported or need input.

Rockwool remains bounded honestly: adjacent Rockwool stays supported at
`Rw 51 / R'w 49 / DnT,w 51`; flat-list split/internal gypsum-leaf
Rockwool stays withheld from supported outputs with diagnostic
`Rw 41 / R'w 39 / DnT,w 40`; grouped Rockwool stays `Rw 41`
screening-only on `multileaf_screening_blend`; direct exact runtime is
still blocked by `rights_safe_source_owned_curve_payload_absent`.

Validation order for UBIQ weak-band Gate A:

1. Create
   `packages/engine/src/ubiq-open-web-weak-band-current-gate-guard-gate-a-contract.test.ts`.
2. Promote existing UBIQ weak-band engine and web guards into
   `tools/dev/run-calculator-current-gate.ts`.
3. Run focused UBIQ engine/web continuity and
   `pnpm calculator:gate:current`.
4. Keep runtime values, APIs, source rows, route-card values, output-card
   statuses, and workbench-input behavior unchanged.
5. Run `git diff --check`.

## Prior Active Decision Map - 2026-05-05 Rockwool Split Numeric Closure Gate C Closed / V26 Selected

Current implementation position:
`calculator_source_gap_revalidation_v26`.

Rockwool split triple-leaf numeric source closure Gate C landed:

`packages/engine/src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts`

Landed status:

`closed_rockwool_split_triple_leaf_numeric_source_closure_selected_source_gap_revalidation_v26`

Closed slice:

`rockwool_split_triple_leaf_numeric_source_closure_v1`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_gap_order_after_rockwool_split_numeric_closure_closeout`

Active planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_PLAN.md`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_C_CLOSEOUT_HANDOFF.md`

Gate C closeout artifacts:

- `rockwool_split_numeric_closure_gate_c_summary`
- `flat_list_split_output_withhold_carry_forward`
- `adjacent_rockwool_51_49_51_carry_forward`
- `grouped_rockwool_screening_source_blocker_status`
- `remaining_accuracy_gap_order_after_rockwool_closeout`
- `selected_gate_a_source_gap_revalidation_v26_with_target_file`

Protected boundaries: flat-list split/internal gypsum-leaf Rockwool
stacks still calculate `Rw 41 / R'w 39 / DnT,w 40`, but requested wall
airborne outputs stay out of `supportedTargetOutputs` until grouped
topology or a source-owned calibrated model exists. Adjacent Rockwool
stays corrected and supported at `Rw 51 / R'w 49 / DnT,w 51`. Grouped
Rockwool remains live screening-only/source-blocked at `Rw 41`, not
exact and not source-validated.

V26 Gate A must be an accuracy/source-gap re-rank, not a confidence or
copy-only pass. It should select one bounded next slice that improves
numeric correctness, source ownership, or data-backed coverage.

Validation order for V26 Gate A:

1. Create
   `packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts`.
2. Re-rank remaining wall/floor accuracy gaps after Rockwool split
   closeout.
3. Keep direct Rockwool exact runtime blocked unless a rights-safe
   source-owned curve payload and complete owner/test set exists.
4. Select one implementable next file and one action.
5. Run focused continuity for the selected candidate,
   `pnpm calculator:gate:current`, and `git diff --check`.

Latest validation:

Rockwool split numeric closure Gate C validation completed on
2026-05-05: focused Gate C passed 1 file / 6 tests; final
`pnpm calculator:gate:current` passed with engine 264 files / 1524
tests, web 54 files / 263 passed + 18 skipped, repo build 5 / 5 tasks,
and whitespace guard green. Known non-fatal `sharp/@img` warnings
remain through `@turbodocx/html-to-docx`.

## Prior Active Decision Map - 2026-05-05 Rockwool Split Numeric Closure Gate B Landed

Current implementation position:
`rockwool_split_triple_leaf_numeric_source_closure_v1`.

Rockwool split triple-leaf numeric source closure Gate B landed:

`packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-b-runtime.test.ts`

Landed status:

`gate_b_withheld_flat_list_split_internal_leaf_supported_outputs_selected_closeout`

Landed gate:

`gate_b_withheld_flat_list_split_internal_leaf_exact_outputs_until_grouped_topology_or_source_owned_model`

Landed action:

`gate_b_withhold_flat_list_split_internal_leaf_exact_outputs_until_grouped_topology_or_source_owned_model`

Gate B landed a runtime output-support boundary:
flat-list split/internal gypsum-leaf Rockwool stacks still calculate the
finite diagnostic `Rw 41 / R'w 39 / DnT,w 40`, but those requested wall
airborne outputs are no longer exposed in `supportedTargetOutputs`.
They move to `unsupportedTargetOutputs` and the workbench card surface
shows `Not ready` until grouped topology and a source-owned calibrated
model exist.

The adjacent Rockwool value stays defended at
`Rw 51 / R'w 49 / DnT,w 51`. Grouped Rockwool stays on the existing
screening-only/source-blocked live path (`Rw 41`), not exact,
not source-validated, and not design-grade.

Current selected next file:

`packages/engine/src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts`

Current selected next action:

`gate_c_closeout_split_triple_leaf_numeric_source_closure_and_select_next_accuracy_slice`

Active planning surface:

`docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_V1_PLAN.md`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_B_HANDOFF.md`

Validation order for Gate C:

1. Create
   `packages/engine/src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts`.
2. Close out `rockwool_split_triple_leaf_numeric_source_closure_v1`.
3. Preserve the new flat-list split unsupported-output boundary,
   adjacent `51/49/51` correction, and grouped screening-only boundary.
4. Select the next bounded accuracy slice from the source-gap order.
5. Run `pnpm calculator:gate:current` and `git diff --check`.

Latest validation:

Rockwool split numeric closure Gate B validation completed on
2026-05-05: focused engine Gate B passed 1 file / 5 tests, focused web
Gate B passed 1 file / 3 tests, web Rockwool continuity passed 5 files /
28 tests after updating the internal acceptance rehearsal to expect
flat-list split `Not ready`, Rockwool engine continuity passed 7 files /
38 tests, and final `pnpm calculator:gate:current` passed with engine
263 files / 1518 tests, web 54 files / 263 passed + 18 skipped, repo
build 5 / 5 tasks, and whitespace guard green. Broad validation after
Gate B: lint and typecheck passed, engine full suite passed 396 files /
2338 tests, web full suite passed on rerun with 166 files / 936 passed
+ 18 skipped, repo build passed 5 / 5 tasks, and final
`git diff --check` passed. The first monolithic `pnpm check` run hit a
transient timeout in the long AAC-G5 web route scan; the isolated rerun
and full web-suite rerun passed.

## Prior Active Decision Map - 2026-05-05 Rockwool Split Numeric Closure Gate A Landed

Current implementation position before Gate B:
`rockwool_split_triple_leaf_numeric_source_closure_v1`.

Rockwool split triple-leaf numeric source closure Gate A landed:

`packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts`

Landed status:

`gate_a_kept_split_internal_leaf_finite_screening_diagnostic_but_rejected_exact_numeric_closure_selected_runtime_withhold_gate_b`

Landed action:

`gate_a_decided_split_internal_leaf_requires_source_owned_topology_before_exact_numeric_closure`

Gate A landed
`rockwool_split_internal_leaf_exact_numeric_rejected_without_source_owned_topology`.
The adjacent Rockwool value stays defended at
`Rw 51 / R'w 49 / DnT,w 51`. The split/internal gypsum-leaf stack still
returns the finite screening diagnostic `Rw 41 / R'w 39 / DnT,w 40` on
`multileaf_screening_blend`, but Gate A explicitly rejects closing that
as a correct physical triple-leaf penalty. The current NRC 2024, Uris
2006, and Ballagh 2013 source-pack entries are not enough to import a
fixed penalty or exact Rockwool runtime.

## Prior Active Decision Map - 2026-05-05 V25 Numeric Recovery Landed

Current implementation position before Gate A:
`rockwool_split_triple_leaf_numeric_source_closure_v1`.

V25 Gate A landed a real runtime numeric correction after the user
clarified that correctness matters more than confidence/support posture.
The landed file is:

`packages/engine/src/calculator-source-gap-revalidation-v25-gate-a-contract.test.ts`

Landed status:

`v25_fixed_adjacent_rockwool_flat_list_numeric_hold_selected_split_internal_leaf_numeric_source_closure`

Gate A landed `rockwool_adjacent_flat_list_numeric_recovery`: the
PDF-like adjacent Rockwool stack is now `Rw 51`, `R'w 49`, `DnT,w 51`
on
`double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology`.
It is no longer pulled down to the prior bad
`multileaf_screening_blend_fail_closed_until_grouped_topology` corridor
from flat-list route sensitivity alone.

Gate A also landed
`rockwool_split_internal_leaf_remains_numeric_open`: the split/internal
gypsum-leaf stack still returns `Rw 41`, `R'w 39`, `DnT,w 40` through
`multileaf_screening_blend`. This is not closed as correct.

Prior selected next file:

`packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts`

Prior selected next action:

`gate_a_decide_split_internal_leaf_numeric_model_or_topology_required_stop`

Prior active planning surface:

`docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_V1_PLAN.md`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V25_GATE_A_HANDOFF.md`

Prior validation order for the selected split/internal-leaf numeric closure:

1. Create
   `packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts`.
2. Decide whether the split/internal gypsum layer is a physical
   triple-leaf penalty requiring source/topology ownership, or a
   flat-list intent ambiguity that should ask for grouped topology input.
3. Do not spend the next slice on confidence wording.
4. Run the Rockwool flat-list guard engine/web tests and
   `pnpm calculator:gate:current`.

## Active Decision Map - 2026-05-05 Rockwool Support Posture Gate A Landed

Current implementation position:
`calculator_source_gap_revalidation_v25`.

Rockwool support posture Gate A landed no-runtime and kept the current
source-required Rockwool values as screening-supported finite metrics,
not exact/source-backed or design-grade. The selected next
implementation file is:

`packages/engine/src/calculator-source-gap-revalidation-v25-gate-a-contract.test.ts`

This file does not exist yet; it is the next file to create.

Current selected status:

`gate_a_kept_rockwool_source_required_values_screening_supported_no_runtime_selected_source_gap_revalidation_v25`

Current next action:

`gate_a_revalidate_source_gap_order_after_rockwool_support_posture`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_GATE_A_HANDOFF.md`

Active planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V25_PLAN.md`

Landed support-posture Gate A file:

`packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts`

Gate A action:

`gate_a_decide_supported_vs_unsupported_output_posture_for_source_required_rockwool`

Gate A landed:

- `rockwool_support_semantics_decision`
- `rockwool_screening_supported_values_not_exact`
- `rockwool_posture_surface_map`
- `rockwool_unsupported_without_preview_rejected`
- `source_gap_revalidation_v25_selected`

Gate A result:

Gate A chose the screening-supported posture. `supportedTargetOutputs`
continues to mean "a finite calculator value exists"; it does not mean
source-backed exactness. Moving Rockwool `Rw`, `STC`, `C`, `Ctr`,
`R'w`, or `DnT,w` to `unsupportedTargetOutputs` now is rejected because
the current workbench would render `Not ready` and hide the useful
`Rw 41` diagnostic unless a separate screening-preview value channel is
added first.

Runtime values remain grouped `Rw 41` / `STC 41`, flat-list adjacent
swap `Rw 42` / `STC 42`, and field `R'w 34` / `DnT,w 36`. They remain
`finite_screening_metric_available_not_source_backed_exact`, not exact,
not source-validated, and not design-grade.

Rockwool support posture Gate A validation completed on 2026-05-05:
focused Gate A passed 1 file / 5 tests; engine continuity passed 8
files / 49 tests; web Rockwool/output continuity passed 4 files / 29
tests; final `pnpm calculator:gate:current` passed with engine 260 files
/ 1505 tests, web 53 files / 260 passed + 18 skipped, repo build 5 / 5
tasks, and whitespace guard green. Broad `pnpm check` passed with lint
and typecheck clean, engine 393 files / 2325 tests, web 165 files / 933
passed + 18 skipped, and repo build 5 / 5 tasks. Known non-fatal
`sharp/@img` warnings remain through `@turbodocx/html-to-docx`;
`apps/web/next-env.d.ts` was restored to `.next-typecheck` after the
Next build.

Validation order for the selected V25 source-gap revalidation:

1. Create
   `packages/engine/src/calculator-source-gap-revalidation-v25-gate-a-contract.test.ts`.
2. Re-rank remaining source/accuracy gaps after the Rockwool support
   posture closeout.
3. Keep Rockwool exact runtime blocked unless a new rights-safe
   source-owned packet and complete owner set are present.
4. Select one bounded implementable next file and one bounded next
   action.

The previous Rockwool resolution decision map is preserved below for
handoff history.

## Prior Active Decision Map - 2026-05-05 Rockwool Resolution Gate A Landed

Current implementation position:
`rockwool_triple_leaf_support_posture_v1`.

Rockwool triple-leaf resolution Gate A landed and made the source
decision explicit. The selected next implementation file is:

`packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts`

This file does not exist yet; it is the next file to create.

Current selected status:

`gate_a_confirmed_rockwool_triple_leaf_source_packet_absent_runtime_diagnostic_selected_support_posture`

Current next action:

`gate_a_decide_supported_vs_unsupported_output_posture_for_source_required_rockwool`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_GATE_A_HANDOFF.md`

Active planning surface:

`docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_V1_PLAN.md`

Landed Rockwool resolution Gate A file:

`packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts`

Gate A action:

`gate_a_decide_rockwool_triple_leaf_exact_source_or_fail_closed_path`

Gate A landed:

- `rockwool_exact_source_packet_decision`
- `rockwool_source_required_screening_boundary`
- `rockwool_flat_list_reorder_boundary`
- `rockwool_support_posture_selected`

Gate A result:

Gate A confirmed exact/source-backed Rockwool runtime is blocked by
`rights_safe_source_owned_curve_payload_absent`; repeating Uris
acquisition without a new packet is not selected. Runtime numeric values
remain grouped `Rw 41`, flat-list `Rw 42`, and field `R'w 34` /
`DnT,w 36`, but the grouped diagnostic now says:

`Grouped triple-leaf topology is present, but DynEcho still needs a source-calibrated triple-leaf solver, rights-safe source-owned curve payload, local Rockwool/material mapping, metric context owner, tolerance owner, negative boundaries, and paired visible tests before promoting this beyond the screening blend; treat it as source-required screening, not exact or design-grade.`

Rockwool resolution Gate A validation completed on 2026-05-05: focused
Gate A passed 1 file / 6 tests; engine continuity passed 9 files / 55
tests; web Rockwool continuity passed 2 files / 14 tests; split-refactor
size pin passed 1 file / 5 tests after updating `dynamic-airborne.ts`
from 1829 to 1828 physical lines; final `pnpm calculator:gate:current`
passed with engine 259 files / 1500 tests, web 53 files / 260 passed +
18 skipped, repo build 5 / 5 tasks, and whitespace guard green. Broad
`pnpm check` passed after removing one unused source-promotion Gate A
import: lint and typecheck clean, engine 392 files / 2320 tests, web 165
files / 933 passed + 18 skipped, and repo build 5 / 5 tasks. Known
non-fatal `sharp/@img` warnings remain through `@turbodocx/html-to-docx`;
`apps/web/next-env.d.ts` was restored to `.next-typecheck` after the
Next build.

Validation order for the selected support-posture slice:

1. Create
   `packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts`.
2. Decide whether source-required Rockwool outputs stay in
   `supportedTargetOutputs` as explicit screening-supported values or
   move to `unsupportedTargetOutputs` for exact/design-grade requests
   with a separate screening preview.
3. If support semantics change, add paired web visible/API/report tests
   before closeout and run broad `pnpm check`.

The previous source-promotion owner-set decision map is preserved below
for handoff history.

## Prior Active Decision Map - 2026-05-05 Source-Promotion Owner-Set Gate A Landed

Current implementation position:
`rockwool_triple_leaf_resolution_v1`.

Source-promotion owner-set Gate A landed no-runtime and intentionally
selected the Rockwool triple-leaf resolution path instead of opening
another generic guard chain. The selected next implementation file is:

`packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts`

This file does not exist yet; it is the next file to create.

Current selected status:

`gate_a_locked_source_promotion_owner_set_no_runtime_selected_rockwool_triple_leaf_resolution`

Current next action:

`gate_a_decide_rockwool_triple_leaf_exact_source_or_fail_closed_path`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_GATE_A_HANDOFF.md`

Active planning surface:

`docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_V1_PLAN.md`

Landed source-promotion owner-set Gate A file:

`packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts`

Gate A action:

`gate_a_inventory_source_promotion_owner_set_after_v24_rerank`

Gate A landed:

- `source_promotion_owner_set_inventory`
- `ownerless_source_promotion_blocked`
- `hostile_import_snapshot_not_evidence_carry_forward`
- `rockwool_resolution_selected_as_next_accuracy_target`

Gate A result:

Gate A locked the promotion boundary and kept runtime values, support,
confidence, evidence, API shape, route-card values, output-card status,
proposal/report values, visible behavior, and workbench-input behavior
frozen. Source-like names, near-source aliases, source locators,
imported snapshots, finite copied numbers, and visible copy cannot
promote runtime evidence unless source provenance, topology owner,
material mapping owner, metric context owner, tolerance owner, negative
boundaries, paired engine tests, and paired visible tests are complete.

Rockwool remains frozen: grouped `Rw 41`, flat-list `Rw 42`, field
`R'w 34` and `DnT,w 36`, screening-only, not exact/source-validated,
Uris 2006 still `paused_waiting_rights_safe_source_packet`.

Source-promotion owner-set Gate A validation completed on 2026-05-05:
focused Gate A passed 1 file / 6 tests; engine continuity passed 7
files / 42 tests; web continuity passed 2 files / 15 tests; `pnpm
calculator:gate:current` passed with engine 258 files / 1494 tests, web
53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
whitespace guard green; final `git diff --check` passed after restoring
`apps/web/next-env.d.ts` to `.next-typecheck`. Broad `pnpm check` was
not run because Gate A made no runtime, visible, shared-schema, API,
report/proposal, or workbench-input behavior movement. Known non-fatal
`sharp/@img` warnings remain through `@turbodocx/html-to-docx`.

Validation order for the selected Rockwool resolution slice:

1. Create
   `packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts`.
2. Decide whether a rights-safe source-owned packet and complete owner
   set exist for exact/source-backed runtime.
3. If yes, select the exact implementation path with paired engine and
   visible tests. If not, select fail-closed or explicitly screening-only
   behavior so the result cannot be mistaken for exact.
4. Keep field outputs tied to the selected basis and never let `R'w` /
   `DnT,w` look design-grade when the basis is screening or blocked.

The previous V24 owner-set decision map is preserved below for handoff
history.

## Prior Active Decision Map - 2026-05-05 Calculator Source Gap Revalidation V24 Gate A Landed

Current implementation position:
`source_promotion_owner_set_readiness_guard_v1`.

Calculator source-gap revalidation V24 Gate A landed no-runtime and
selected a dedicated source-promotion owner-set guard. The selected next
implementation file is:

`packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts`

This file does not exist yet; it is the next file to create.

Current selected status:

`selected_source_promotion_owner_set_readiness_guard_after_v24_confirmed_rockwool_uris_blocked_and_controlled_use_handoff_closed`

Current next action:

`gate_a_inventory_source_promotion_owner_set_after_v24_rerank`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_GATE_A_HANDOFF.md`

Active planning surface:

`docs/calculator/SLICE_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_V1_PLAN.md`

Landed V24 Gate A file:

`packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts`

V24 Gate A action:

`gate_a_revalidate_source_accuracy_gap_order_after_controlled_use_handoff_closeout`

V24 Gate A landed:

- `controlled_use_handoff_gate_c_closeout_consumed`
- `rockwool_uris_exact_runtime_still_blocked_after_controlled_use`
- `source_promotion_owner_set_guard_selected`
- `hostile_api_import_and_frequent_combination_green_carry_forward`
- `field_outputs_non_design_grade_carry_forward`

V24 Gate A result:

V24 did not move runtime values, support, confidence, evidence, API
shape, route-card values, output-card status, proposal/report values,
or workbench-input behavior. Rockwool/Uris exact runtime remains blocked
because the rights-safe source-owned curve payload and complete local
owner set are absent. Hostile API/import and frequent-combination
guards are green, so the next actionable correctness step is to prevent
near-source aliases, source rows, source locator metadata, imported
snapshots, and official-sounding names from becoming runtime evidence
without the full owner set.

The next slice must require all of these before future exact/source
promotion:

- `source_provenance`
- `topology_owner`
- `material_mapping_owner`
- `metric_context_owner`
- `tolerance_owner`
- `negative_boundaries`
- `paired_engine_tests`
- `paired_visible_tests`

Rockwool remains frozen: grouped `Rw 41`, flat-list `Rw 42`, field
`R'w 34` and `DnT,w 36`, screening-only, not exact/source-validated,
Uris 2006 still `paused_waiting_rights_safe_source_packet`.

V24 Gate A validation completed on 2026-05-05: focused V24 Gate A
passed 1 file / 7 tests; engine continuity passed 8 files / 47 tests;
web visible frequent-combination continuity passed 1 file / 8 tests;
`pnpm calculator:gate:current` passed with engine 257 files / 1488
tests, web 53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks,
and whitespace guard green; final `git diff --check` passed after
restoring `apps/web/next-env.d.ts` to `.next-typecheck`. Broad
`pnpm check` was not run because V24 Gate A made no runtime, visible,
shared-schema, API, report/proposal, or workbench-input behavior
movement. Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`.

Validation order for the selected source-promotion owner-set guard:

1. Create
   `packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts`.
2. Inventory exact source rows, near-source aliases, source locator
   metadata, imported snapshots, material aliases, and visible
   route/output/report claims.
3. Keep runtime frozen unless source provenance, topology owner,
   material mapping owner, metric context owner, tolerance owner,
   negative boundaries, paired engine tests, and paired visible tests
   are all named and green.

The previous V24 source-gap decision map is preserved below for handoff
history.

## Prior Active Decision Map - 2026-05-05 Company-Internal Controlled Use Handoff Gate C Closed

Current implementation position:
`calculator_source_gap_revalidation_v24`.

Company-internal controlled-use handoff Gate C closed no-runtime and
selected a fresh source-gap revalidation pass. The selected next
implementation file is:

`packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts`

This file does not exist yet; it is the next file to create.

Current selected status:

`closed_company_internal_controlled_use_handoff_no_runtime_and_selected_source_gap_revalidation_v24`

Current next action:

`gate_a_revalidate_source_accuracy_gap_order_after_controlled_use_handoff_closeout`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_C_CLOSEOUT_HANDOFF.md`

Active planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_PLAN.md`

Current controlled-use handoff:

`docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md`

Landed Gate C closeout file:

`packages/engine/src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts`

Gate C action:

`gate_c_closeout_company_internal_controlled_use_handoff_and_next_slice_selection`

Gate C consumed:

- `current_operator_workflow`
- `current_acceptance_bucket_table`
- `ready_values_snapshot`
- `caveated_blocked_stop_rules`
- `validation_command_log`
- `rockwool_screening_only_notice`
- `selected_closeout_or_source_gap_followup`

Gate C landed:

- `company_internal_controlled_use_handoff_closed`
- `controlled_use_pack_is_current_operator_handoff`
- `calculator_source_gap_revalidation_v24_selected`

Gate C result:

Gate C did not move runtime values, support, confidence, evidence, API
shape, route-card values, output-card status, proposal/report values,
or workbench-input behavior. It kept the controlled-use pack as the
current operator handoff for knowledgeable personal/company-internal use
inside the documented envelope. It did not open a direct high-accuracy
label.

V24 must carry forward `controlled_use_pack_is_current_operator_handoff`,
`rockwool_screening_only_not_fixed`, `field_outputs_non_design_grade`,
`source_promotion_owner_set_required`, `hostile_api_import_fail_closed`,
and `frequent_combination_snapshots_stay_green`.

Rockwool remains frozen: grouped `Rw 41`, flat-list `Rw 42`, field
`R'w 34` and `DnT,w 36`, screening-only, not exact/source-validated,
Uris 2006 still `paused_waiting_rights_safe_source_packet`.

Gate C validation completed on 2026-05-05: focused Gate C passed 1 file
/ 5 tests; continuity passed 8 files / 43 tests; `pnpm
calculator:gate:current` passed with engine 256 files / 1481 tests, web
53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
whitespace guard green; broad `pnpm check` passed with lint/typecheck
clean, engine 389 files / 2301 tests, web 165 files / 933 passed + 18
skipped, repo build 5 / 5 tasks, and final `git diff --check` green. Known non-fatal `sharp/@img` warnings
remain through `@turbodocx/html-to-docx`; `apps/web/next-env.d.ts`
stayed restored to `.next-typecheck`.

Validation order for the selected V24 source-gap pass:

1. Create
   `packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts`.
2. Re-rank the current source/accuracy backlog after controlled-use
   handoff closeout, including Rockwool/Uris, source promotion owners,
   hostile API/import payloads, and frequent wall/floor combinations.
3. Keep runtime frozen unless the selected next candidate names source
   provenance, topology owner, material mapping owner, metric context
   owner, tolerance owner, negative boundaries, paired engine tests, and
   paired visible tests.

The previous controlled-use handoff Gate A decision map is preserved
below for handoff history.

## Prior Active Decision Map - 2026-05-05 Company-Internal Controlled Use Handoff Gate A Landed

Current implementation position:
`company_internal_controlled_use_handoff_v1`.

Company-internal controlled-use handoff Gate A landed no-runtime. The
selected next implementation file is:

`packages/engine/src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts`

This file does not exist yet; it is the next file to create.

Current selected status:

`gate_a_prepared_company_internal_controlled_use_handoff_no_runtime_selected_closeout`

Current next action:

`gate_c_closeout_company_internal_controlled_use_handoff_and_next_slice_selection`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_A_HANDOFF.md`

Active planning surface:

`docs/calculator/SLICE_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_V1_PLAN.md`

Current controlled-use handoff:

`docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md`

Landed Gate A file:

`packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts`

Gate A action:

`gate_a_prepare_company_internal_controlled_use_handoff_pack_no_runtime`

Gate A produced:

- `current_operator_workflow`
- `current_acceptance_bucket_table`
- `ready_values_snapshot`
- `caveated_blocked_stop_rules`
- `validation_command_log`
- `rockwool_screening_only_notice`
- `selected_closeout_or_source_gap_followup`

Gate A result:

Gate A did not move runtime values, support, confidence, evidence, API
shape, route-card values, output-card status, proposal/report values,
or workbench-input behavior. It created the current operator handoff
pack and kept the high-accuracy label forbidden. Controlled use remains
bounded to the documented ready/caveated/blocked/hostile envelope and
is not regulatory certification or external/client certification.

Ready values are now pinned in the controlled-use handoff:
`wall_lsf_exact_preset` `Rw=55`, `R'w=48`, building `DnT,w=50`;
`wall_aac_single_leaf_benchmark` `Rw=47`, `R'w=45`, building
`DnT,w=47`; `wall_masonry_single_leaf_benchmark` `Rw=43`, `R'w=41`,
building `DnT,w=43`; `floor_pliteq_exact_source_corridor` `Rw=60`,
`Ln,w=58`, `L'n,w=61`, `L'nT,w=58.2`; and
`floor_ubiq_bound_source_corridor` `Rw=62`, `Ln,w=52`, `L'n,w=55`,
`L'nT,w=52.2`.

Rockwool remains frozen: grouped `Rw 41`, flat-list `Rw 42`, field
`R'w 34` and `DnT,w 36`, screening-only, not exact/source-validated,
Uris 2006 still `paused_waiting_rights_safe_source_packet`.

Gate A validation completed on 2026-05-05: focused Gate A passed 1 file
/ 6 tests; continuity passed 6 files / 33 tests; `pnpm
calculator:gate:current` passed with engine 255 files / 1476 tests, web
53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
whitespace guard green; final `git diff --check` passed after restoring
`apps/web/next-env.d.ts` to `.next-typecheck`. Broad `pnpm check` is
reserved for the selected Gate C closeout or later runtime/user-visible
movement.

Validation order for the selected closeout:

1. Create
   `packages/engine/src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts`.
2. Consume the Gate A artifacts and decide whether this handoff can be
   kept as the current controlled-use pack or whether validation exposed
   a bounded source-gap follow-up.
3. Keep the high-accuracy label forbidden unless the controlled-use
   caveats, Rockwool screening notice, hostile guards, current gate, and
   broad validation are explicitly green. Run focused closeout,
   continuity, `pnpm calculator:gate:current`, broad `pnpm check`, and
   `git diff --check` before closeout.

The previous opening rehearsal Gate C decision map is preserved below
for handoff history.

## Prior Active Decision Map - 2026-05-05 Company-Internal Opening Rehearsal Gate C Closed

Current implementation position:
`company_internal_controlled_use_handoff_v1`.

Company-internal high-accuracy opening rehearsal Gate C closed
no-runtime and selected a controlled-use handoff slice. The selected
next implementation file is:

`packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts`

This file does not exist yet; it is the next file to create.

Current selected status:

`closed_company_internal_high_accuracy_opening_rehearsal_no_runtime_and_selected_controlled_use_handoff`

Current next action:

`gate_a_prepare_company_internal_controlled_use_handoff_pack_no_runtime`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_C_CLOSEOUT_HANDOFF.md`

Active planning surface:

`docs/calculator/SLICE_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_V1_PLAN.md`

Landed opening rehearsal Gate C closeout file:

`packages/engine/src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts`

Gate C action:

`gate_c_closeout_company_internal_opening_rehearsal_and_next_slice_selection`

Gate C consumed:

- `company_internal_opening_acceptance_matrix`
- `final_validation_evidence_map`
- `rockwool_screening_and_source_blocker_registry`
- `source_promotion_no_runtime_boundary_register`
- `hostile_api_import_fail_closed_evidence`
- `operator_caveat_and_usage_handoff_pack`
- `selected_opening_handoff_or_backlog_followup`

Gate C landed:

- `company_internal_controlled_use_handoff_selected`

Gate C result:

Gate C did not move runtime values, support, confidence, evidence, API
shape, route-card values, output-card status, proposal/report values,
or workbench-input behavior. It did not open a direct high-accuracy
label. It selected a bounded controlled-use handoff because the latest
opening rehearsal and broad validation are green enough to prepare a
current operator handoff, but the handoff still needs current values,
Rockwool screening-only language, caveats, and stop rules before any
use label is refreshed.

Rockwool remains frozen: grouped `Rw 41`, flat-list `Rw 42`, field
`R'w 34` and `DnT,w 36`, screening-only, not exact/source-validated,
Uris 2006 still `paused_waiting_rights_safe_source_packet`.

Gate C validation completed on 2026-05-05: focused Gate C passed 1 file
/ 5 tests; continuity passed 9 files / 47 tests; `pnpm
calculator:gate:current` passed with engine 254 files / 1470 tests, web
53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
whitespace guard green; broad `pnpm check` passed with lint and
typecheck clean, engine 387 files / 2290 tests, web 165 files / 933
passed + 18 skipped, and repo build 5 / 5 tasks; final
`git diff --check` passed.

Validation order for the selected controlled-use handoff:

1. Create
   `packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts`.
2. Produce `current_operator_workflow`,
   `current_acceptance_bucket_table`, `ready_values_snapshot`,
   `caveated_blocked_stop_rules`, `validation_command_log`,
   `rockwool_screening_only_notice`, and
   `selected_closeout_or_source_gap_followup`.
3. Keep the high-accuracy label forbidden and no-runtime. Run focused
   Gate A, continuity, `pnpm calculator:gate:current`, broad
   `pnpm check`, and `git diff --check` before handoff closeout.

The previous opening rehearsal Gate A decision map is preserved below
for handoff history.

## Prior Active Decision Map - 2026-05-05 Company-Internal Opening Rehearsal Gate A Landed

Current implementation position:
`company_internal_high_accuracy_opening_rehearsal_v1`.

Company-internal high-accuracy opening rehearsal Gate A landed
no-runtime. The selected next implementation file is:

`packages/engine/src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts`

This file does not exist yet; it is the next file to create.

Current selected status:

`gate_a_rehearsed_company_internal_high_accuracy_opening_no_runtime_selected_closeout`

Current next action:

`gate_c_closeout_company_internal_opening_rehearsal_and_next_slice_selection`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_A_HANDOFF.md`

Active planning surface:

`docs/calculator/SLICE_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_V1_PLAN.md`

Landed company-internal opening Gate A file:

`packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts`

Gate A action:

`gate_a_rehearse_company_internal_high_accuracy_opening_evidence_no_runtime`

Gate A artifacts:

- `company_internal_opening_acceptance_matrix`
- `final_validation_evidence_map`
- `rockwool_screening_and_source_blocker_registry`
- `source_promotion_no_runtime_boundary_register`
- `hostile_api_import_fail_closed_evidence`
- `operator_caveat_and_usage_handoff_pack`
- `selected_opening_handoff_or_backlog_followup`

Gate A result:

Gate A built the current opening evidence matrix without changing
runtime values, support, confidence, evidence, API shape, route-card
values, output-card status, proposal/report values, or workbench-input
behavior. It pinned ready source/benchmark corridors and kept
Rockwool, generated/screening lanes, field continuations, near-source
rows, Uris 2006, hostile API/import payloads, many-layer, and reorder
edges caveated, blocked, or fail-closed.

High-accuracy opening is not allowed by Gate A alone. The closeout must
consume `company_internal_opening_acceptance_matrix`,
`final_validation_evidence_map`,
`rockwool_screening_and_source_blocker_registry`,
`source_promotion_no_runtime_boundary_register`,
`hostile_api_import_fail_closed_evidence`,
`operator_caveat_and_usage_handoff_pack`, and
`selected_opening_handoff_or_backlog_followup`, then decide whether the
next step is a handoff or backlog follow-up after focused continuity,
`pnpm calculator:gate:current`, broad `pnpm check`, and final
`git diff --check`.

Rockwool remains frozen: grouped `Rw 41`, flat-list `Rw 42`, field
`R'w 34` and `DnT,w 36`, screening-only, not exact/source-validated,
Uris 2006 still `paused_waiting_rights_safe_source_packet`.

Gate A validation completed on 2026-05-05: focused Gate A passed 1
file / 6 tests; continuity passed 8 files / 42 tests;
`pnpm calculator:gate:current` passed with engine 253 files / 1465
tests, web 53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks,
and whitespace guard green; broad `pnpm check` passed with lint and
typecheck clean, engine 386 files / 2285 tests, web 165 files / 933
passed + 18 skipped, and repo build 5 / 5 tasks. Known non-fatal
`sharp/@img` warnings remain through `@turbodocx/html-to-docx`;
`apps/web/next-env.d.ts` was restored to `.next-typecheck` after Next
rewrote it.

Validation order for the selected closeout:

1. Create
   `packages/engine/src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts`.
2. Consume the Gate A artifacts above and explicitly keep
   `highAccuracyOpeningAllowedByGateAAlone` false.
3. Re-run focused Gate A, continuity, `pnpm calculator:gate:current`,
   broad `pnpm check`, and `git diff --check` before any opening label.

The previous source/hostile Gate C decision map is preserved below for
handoff history.

## Prior Active Decision Map - 2026-05-05 Source/Hostile Gate C Closed

Current implementation position:
`company_internal_high_accuracy_opening_rehearsal_v1`.

Source-promotion / hostile-input Gate C closed no-runtime and selected a
fresh high-accuracy opening rehearsal before any company-internal
high-accuracy handoff label is allowed. The selected next implementation
file is:

`packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts`

This file does not exist yet; it is the next file to create.

Current selected status:

`closed_source_promotion_hostile_input_readiness_guard_no_runtime_and_selected_company_internal_high_accuracy_opening_rehearsal`

Current next action:

`gate_a_rehearse_company_internal_high_accuracy_opening_evidence_no_runtime`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`

Active planning surface:

`docs/calculator/SLICE_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_V1_PLAN.md`

Landed source/hostile Gate C closeout file:

`packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts`

Gate C action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Gate C artifacts consumed:

- `source_promotion_surface_inventory`
- `hostile_api_import_fail_closed_surface_inventory`
- `estimate_json_1e309_rejected_by_finite_layer_schema`
- `server_import_snapshot_not_runtime_promotion_surface`
- `near_source_rows_context_only_until_owner_set_exists`
- `rockwool_gate_c_policy_freeze_carry_forward`
- `selected_source_promotion_hostile_closeout_with_target_file`

Gate C landed artifact:

- `company_internal_high_accuracy_opening_rehearsal_selected`

Gate C result:

Gate C did not move runtime values, support, confidence, evidence,
route-card values, output-card status, proposal/report values, or
workbench-input behavior. It consumed Gate A's finite layer-schema
tightening and kept estimate / impact-only `1e309` payloads rejected
before calculation. No source row, near-source alias, import snapshot,
or Rockwool triple-leaf row was promoted.

Rockwool remains frozen: grouped `Rw 41`, flat-list `Rw 42`, field
`R'w 34` and `DnT,w 36`, screening-only, not exact/source-validated,
Uris 2006 still `paused_waiting_rights_safe_source_packet`.

Gate C validation completed on 2026-05-05: focused Gate C passed 1 file
/ 5 tests; engine continuity passed 7 files / 36 tests; `pnpm
calculator:gate:current` passed with engine 252 files / 1459 tests, web
53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
whitespace guard green. Broad `pnpm check` passed with lint/typecheck
clean, engine 385 files / 2279 tests, web 165 files / 933 passed + 18
skipped, repo build 5 / 5 tasks. Known non-fatal `sharp/@img` warnings
remain through `@turbodocx/html-to-docx`; final `git diff --check` was
green and `apps/web/next-env.d.ts` had no final diff.

Validation order for the selected opening rehearsal:

1. Create
   `packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts`.
2. Build `company_internal_opening_acceptance_matrix`,
   `final_validation_evidence_map`,
   `rockwool_screening_and_source_blocker_registry`,
   `source_promotion_no_runtime_boundary_register`,
   `hostile_api_import_fail_closed_evidence`, and
   `operator_caveat_and_usage_handoff_pack`.
3. Keep high-accuracy opening blocked unless the selected rehearsal
   gate plus `pnpm calculator:gate:current`, broad `pnpm check`, and
   final `git diff --check` are green and the handoff evidence is
   explicit.

The previous source/hostile Gate C decision map is preserved below for
handoff history.

## Prior Active Decision Map - 2026-05-05 Source/Hostile Gate A Landed

Current implementation position:
`source_promotion_hostile_input_readiness_guard_v1`.

Source-promotion / hostile-input Gate A landed with finite shared
layer-schema tightening and selected closeout / next-slice selection.
The selected next implementation file is:

`packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts`

This file does not exist yet; it is the next file to create.

Current selected status:

`gate_a_inventoried_source_promotion_hostile_input_readiness_landed_finite_schema_tightening_selected_closeout`

Current next action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_GATE_A_HANDOFF.md`

Active planning surface:

`docs/calculator/SLICE_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_V1_PLAN.md`

Landed source/hostile Gate A file:

`packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts`

Gate A action:

`gate_a_inventory_source_promotion_and_hostile_input_readiness_after_rockwool_policy_closeout`

Gate A artifacts:

- `source_promotion_surface_inventory`
- `hostile_api_import_fail_closed_surface_inventory`
- `estimate_json_1e309_rejected_by_finite_layer_schema`
- `server_import_snapshot_not_runtime_promotion_surface`
- `near_source_rows_context_only_until_owner_set_exists`
- `rockwool_gate_c_policy_freeze_carry_forward`
- `selected_source_promotion_hostile_closeout_with_target_file`

Gate A result:

Gate A found one bounded hostile API gap. A public JSON request can send
`1e309`, which parses to `Infinity`; the previous shared
`LayerInputSchema` accepted it because it only required a positive
number. Engine runtime still failed closed and did not leak an
exact-looking result, but estimate / impact-only routes could return a
200 fail-closed calculation instead of a 400 validation response. Gate A
tightened `packages/shared/src/domain/layer.ts` to
`thicknessMm: z.number().finite().positive()` and pinned both API routes
in `apps/web/lib/calculator-api-validation.test.ts`.

No source row was promoted. Exact source controls and near-source rows
remain separated until source provenance, topology owner, material
mapping owner, metric-context owner, tolerance owner, negative
boundaries, and paired engine / visible tests exist. Server project
import remains snapshot persistence only, not calculator promotion; it
does not run runtime and restore reads `calculatorInput.payload`, not
stored `calculatorOutput` values.

Rockwool remains frozen by
`rockwool_gate_c_policy_freeze_carry_forward`: grouped `Rw 41`,
flat-list `Rw 42`, field `R'w 34` and `DnT,w 36`, screening-only, not
exact/source-validated, Uris 2006 still
`paused_waiting_rights_safe_source_packet`.

Gate A validation completed on 2026-05-05: focused Gate A passed 1
file / 6 tests; focused web API validation passed 1 file / 3 tests;
engine continuity passed 8 files / 44 tests; `pnpm
calculator:gate:current` passed with engine 251 files / 1454 tests, web
53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
whitespace guard green. Broad `pnpm check` passed after removing a
lint-only unused test constant: lint/typecheck clean, engine 384 files /
2274 tests, web 165 files / 933 passed + 18 skipped, repo build 5 / 5
tasks. Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`; final `git diff --check` was green after
`apps/web/next-env.d.ts` was restored to `.next-typecheck` after Next
build rewrote the route-types path.

Validation order for the selected source/hostile closeout:

1. Create
   `packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts`.
2. Consume `source_promotion_surface_inventory`,
   `hostile_api_import_fail_closed_surface_inventory`,
   `estimate_json_1e309_rejected_by_finite_layer_schema`,
   `server_import_snapshot_not_runtime_promotion_surface`,
   `near_source_rows_context_only_until_owner_set_exists`,
   `rockwool_gate_c_policy_freeze_carry_forward`, and
   `selected_source_promotion_hostile_closeout_with_target_file`.
3. Select the next bounded company-internal opening or final validation
   step. Do not open high-accuracy company-internal use until current
   gate, broad `pnpm check`, and final handoff evidence are green.

The previous source/hostile Gate A decision map is preserved below for
handoff history.

## Prior Active Decision Map - 2026-05-05 Source/Hostile Gate A Selected

Rockwool explicit screening-only policy Gate C closed no-runtime and
selected the source-promotion / hostile-input readiness guard. The
selected first implementation file was:

`packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts`

Gate A landed
`gate_a_inventoried_source_promotion_hostile_input_readiness_landed_finite_schema_tightening_selected_closeout`
and selected
`packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts`.

Landed Rockwool policy Gate C file:

`packages/engine/src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts`

Rockwool policy Gate C facts:

1. Runtime values, support, confidence, evidence, API behavior,
   route-card values, output-card status, proposal/report values, and
   workbench-input behavior stayed frozen. Gate C is no-runtime.
2. Gate C added `rockwool_policy_gate_c_closeout_summary`,
   `rockwool_exact_or_screening_company_criterion_closed`,
   `source_promotion_hostile_input_opening_blockers_carry_forward`,
   `source_promotion_hostile_input_readiness_guard_selected`, and
   `selected_gate_a_source_promotion_hostile_input_readiness_with_target_file`.
3. The Rockwool company-internal criterion is closed as explicit
   screening-only, not as exact runtime evidence.
4. Grouped split-rockwool remains `Rw 41`,
   `multileaf_screening_blend`, low confidence, screening-only, not
   exact, and not source-validated.
5. Flat-list adjacent swaps remain `Rw 42` on
   `multileaf_screening_blend_fail_closed_until_grouped_topology`.
6. Field `R'w 34` and `DnT,w 36` remain continuations from the Rockwool
   screening lane, not independent measured field or design-grade
   results.
7. Uris 2006 remains `paused_waiting_rights_safe_source_packet`.
8. Company-internal high-accuracy opening remains blocked by source
   promotion ownership, hostile API/import fail-closed proof, and final
   current-gate plus broad-check evidence at opening handoff.

Gate C landed action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Rockwool policy Gate C validation completed on 2026-05-05:

- focused Gate C passed 1 file / 6 tests;
- engine continuity with Rockwool Gate A, V23, company opening blocker,
  raw wall hostile inputs, and raw floor hostile inputs passed 6 files /
  37 tests;
- focused web Gate B compatibility passed 1 file / 7 tests after the
  selected Gate C file landed;
- `pnpm calculator:gate:current` passed with engine 250 files / 1448
  tests, web 53 files / 259 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green;
- final `git diff --check` was green after restoring
  `apps/web/next-env.d.ts` to `.next-typecheck`.

Broad `pnpm check` was not run because Gate C made no runtime, API,
shared-schema, route/report, or workbench-input behavior change. Known
non-fatal `sharp/@img` warnings remain through `@turbodocx/html-to-docx`.

Validation order for the selected source/hostile Gate A:

1. Create
   `packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts`.
2. Inventory source-promotion and hostile-input readiness after
   Rockwool policy closeout. Source rows and near-source aliases must
   stay context-only unless topology, material mapping, metric context,
   tolerance, negative boundaries, source provenance, and paired
   engine/visible tests exist.
3. Confirm raw wall/floor hostile input matrices and any public
   API/import caller paths fail closed before company-internal opening.
4. Select one bounded follow-up: small implementation fix, visible
   guard, or no-runtime closeout.

The previous Rockwool Gate C decision map is preserved below for
handoff history.

## Prior Active Decision Map - 2026-05-05 Rockwool Gate C Closeout

`rockwool_triple_leaf_explicit_screening_only_policy_v1` Gate C landed
`gate_c_no_runtime_closeout_and_next_slice_selection` with
`closed_rockwool_triple_leaf_explicit_screening_only_policy_no_runtime_and_selected_source_promotion_hostile_input_readiness_guard`
no-runtime and selected
`packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts`.

Gate C artifacts:

- `rockwool_policy_gate_c_closeout_summary`
- `rockwool_exact_or_screening_company_criterion_closed`
- `source_promotion_hostile_input_opening_blockers_carry_forward`
- `source_promotion_hostile_input_readiness_guard_selected`
- `selected_gate_a_source_promotion_hostile_input_readiness_with_target_file`

The previous Rockwool Gate B decision map is preserved below for
handoff history.

## Prior Active Decision Map - 2026-05-05 Rockwool Visible Screening-Only Gate B

`rockwool_triple_leaf_explicit_screening_only_policy_v1` Gate B landed
`gate_b_pin_visible_rockwool_triple_leaf_screening_only_policy` with
`gate_b_pinned_visible_rockwool_triple_leaf_screening_only_policy_no_runtime_selected_gate_c_closeout`
visible-copy only and selected
`packages/engine/src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts`.

Gate B artifacts:

- `visible_rockwool_screening_only_policy_guard`
- `rockwool_output_card_screening_only_copy`
- `rockwool_proposal_report_screening_only_copy`
- `rockwool_field_continuation_screening_bridge`
- `rockwool_non_target_boundary_copy_guard`
- `selected_gate_c_closeout_or_next_slice_with_target_file`

Rockwool policy Gate B validation completed on 2026-05-05:

- focused visible Gate B passed 1 file / 7 tests;
- web visible continuity passed 5 files / 31 tests;
- engine continuity passed 5 files / 29 tests;
- `pnpm calculator:gate:current` passed with engine 249 files / 1442
  tests, web 53 files / 259 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green;
- broad `pnpm check` passed with lint/typecheck clean, engine 382 files
  / 2262 tests, web 165 files / 932 passed + 18 skipped, and repo build
  5 / 5 tasks;
- final `git diff --check` was green after restoring
  `apps/web/next-env.d.ts` to `.next-typecheck`.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`.

The previous Rockwool Gate A decision map is preserved below for handoff
history.

## Prior Active Decision Map - 2026-05-05 Rockwool Gate A

`rockwool_triple_leaf_explicit_screening_only_policy_v1` Gate A landed
`gate_a_inventoried_rockwool_triple_leaf_screening_only_policy_no_runtime_selected_visible_gate_b`
no-runtime and selected
`apps/web/features/workbench/rockwool-triple-leaf-explicit-screening-only-policy-gate-b-visible.test.ts`.

Gate A implementation file:

`packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts`

Gate A artifacts:

- `rockwool_triple_leaf_screening_surface_inventory`
- `grouped_rw41_and_flat_rw42_runtime_freeze`
- `visible_route_output_report_policy_gap`
- `rockwool_visible_gate_b_selected`
- `source_promotion_hostile_input_carry_forward`
- `pre_company_internal_use_exit_criteria`

Gate A validation completed on 2026-05-05: focused Gate A 1 file / 6
tests, engine continuity 5 files / 29 tests, web visible continuity 3
files / 16 tests, `pnpm calculator:gate:current` with engine 249 files /
1442 tests, web 52 files / 252 passed + 18 skipped, repo build 5 / 5
tasks, whitespace guard green, and final `git diff --check` green after
restoring `apps/web/next-env.d.ts` to `.next-typecheck`.

The previous V23 decision map is preserved below for handoff history.

## Prior Active Decision Map - 2026-05-05 Source Gap Revalidation V23

`calculator_source_gap_revalidation_v23` Gate A landed
`selected_rockwool_triple_leaf_explicit_screening_only_policy_after_v23_confirmed_uris_source_blocked_and_field_output_owner_closed`
no-runtime and selected
`rockwool_triple_leaf_explicit_screening_only_policy_v1`.

V23 Gate A implementation file:

`packages/engine/src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts`

V23 selected first Rockwool policy file:

`packages/engine/src/rockwool-triple-leaf-explicit-screening-only-policy-gate-a-contract.test.ts`

V23 selected planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V23_PLAN.md`

V23 selected next planning surface:

`docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_EXPLICIT_SCREENING_ONLY_POLICY_V1_PLAN.md`

V23 carry-forward artifacts remain active for continuity:

- `rockwool_uris_exact_runtime_still_blocked`
- `rockwool_explicit_screening_only_policy_selected`
- `source_promotion_and_hostile_input_ownership_carry_forward`
- `repeat_uris_acquisition_blocked_without_new_packet`
- `pre_company_internal_use_exit_criteria`

V23 Gate A validation completed on 2026-05-05: focused V23 1 file / 7
tests, engine continuity 6 files / 36 tests, web visible continuity 3
files / 16 tests, `pnpm calculator:gate:current` with engine 248 files /
1436 tests, web 52 files / 252 passed + 18 skipped, repo build 5 / 5
tasks, whitespace guard green, and final `git diff --check` green after
restoring `apps/web/next-env.d.ts` to `.next-typecheck`.

The previous Field Output Owner Gate C decision map is preserved below
for handoff history.

## Prior Active Decision Map - 2026-05-05 Field Output Owner Gate C

`field_output_owner_and_design_grade_policy_v1` Gate C closed with
`closed_field_output_owner_design_grade_policy_no_runtime_and_selected_source_gap_revalidation_v23`
and selected `calculator_source_gap_revalidation_v23`.

Gate C implementation file:

`packages/engine/src/post-field-output-owner-and-design-grade-policy-v1-next-slice-selection-contract.test.ts`

Gate C selected first V23 file:

`packages/engine/src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts`

Gate C selected planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V23_PLAN.md`

Required Gate C carry-forward still present for doc/contract continuity:

- `field_output_owner_policy_gate_c_closeout_summary`
- `field_output_owner_and_design_grade_policy_closed_carry_forward`
- `rockwool_rw41_screening_and_uris_packet_status`
- `paused_waiting_rights_safe_source_packet`
- `pre_company_internal_use_exit_criteria`

Gate C validation completed on 2026-05-05: focused Gate C 1 file / 6
tests, engine continuity 5 files / 30 tests, web continuity 7 files /
73 passed + 18 skipped, `pnpm calculator:gate:current` with engine 247
files / 1429 tests, web 52 files / 252 passed + 18 skipped, repo build
5 / 5 tasks, whitespace guard green, broad `pnpm check` with
lint/typecheck clean, engine 380 files / 2249 tests, web 164 files /
925 passed + 18 skipped, build 5 / 5 tasks, and final
`git diff --check` green.

The previous Field Output Owner Gate B decision map is preserved below
for handoff history.

## Prior Active Decision Map - 2026-05-05 Field Output Owner Gate B

Current implementation position:
`field_output_owner_and_design_grade_policy_v1`.

`field_output_owner_and_design_grade_policy_v1` Gate B landed
visible-copy only and selected Gate C closeout / next-slice selection.
The selected Gate C implementation file was:

`packages/engine/src/post-field-output-owner-and-design-grade-policy-v1-next-slice-selection-contract.test.ts`

Gate B selected status:

`gate_b_pinned_visible_field_output_design_grade_owner_policy_no_runtime_selected_gate_c_closeout`

Gate B selected planning surface:

`docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md`

Gate B visible artifacts:

- `visible_field_output_design_grade_policy_guard`
- `output_card_owner_policy_copy`
- `proposal_report_owner_policy_copy`
- `needs_input_field_policy_visible_boundaries`
- `rockwool_field_output_screening_policy_carry_forward`
- `selected_gate_c_closeout_or_next_slice_with_target_file`

Gate B validation completed on 2026-05-05:

- focused Gate B passed 1 file / 6 tests;
- engine continuity with Gate A, V22, field-output leakage Gate A, and
  company blocker passed 4 files / 24 tests;
- web continuity with field-output owner Gate B, field-output leakage
  Gate B, company visible guard, wall/floor field continuations, output
  model, and output posture passed 7 files / 73 passed + 18 skipped;
- `pnpm calculator:gate:current` passed with engine 246 files / 1423
  tests, web 52 files / 252 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green;
- broad `pnpm check` passed with lint/typecheck clean, engine full
  suite 379 files / 2243 tests, web full suite 164 files / 925 passed +
  18 skipped, and repo build 5 / 5 tasks.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`.

`field_output_owner_and_design_grade_policy_v1` Gate A landed
no-runtime and selected the visible owner-policy Gate B. The selected
Gate B implementation file was:

`apps/web/features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts`

Gate A selected status:

`gate_a_inventoried_field_output_owner_design_grade_policy_no_runtime_selected_visible_policy_gate_b`

Gate A selected action:

`gate_b_pin_visible_field_output_design_grade_owner_policy`

Gate A artifacts:

- `field_output_owner_design_grade_policy_inventory`
- `field_metric_owner_matrix`
- `source_basis_and_tolerance_requirement_matrix`
- `missing_geometry_and_missing_field_input_negative_boundaries`
- `rockwool_screening_field_output_carry_forward`

Gate A validation completed on 2026-05-05:

- focused Gate A passed 1 file / 6 tests;
- engine continuity with V22, field-output Gate A, and company blocker
  passed 4 files / 24 tests;
- web continuity with field-output Gate B, company visible guard, wall
  field continuation, and floor field continuation passed 4 files /
  50 passed + 18 skipped;
- `pnpm calculator:gate:current` passed with engine 246 files / 1423
  tests, web 51 files / 246 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green;
- broad `pnpm check` passed with lint/typecheck clean, engine full
  suite 379 files / 2243 tests, web full suite 163 files / 919 passed +
  18 skipped, and repo build 5 / 5 tasks.

The previous V22 decision map is preserved below for handoff history.

## Prior Active Decision Map - 2026-05-05 V22 Gate A

Current implementation position:
`calculator_source_gap_revalidation_v22`.

`company_internal_frequent_combination_lane_snapshot_guard_v1` Gate C
closed no-runtime and selected V22 source-gap revalidation. The selected
next implementation file is:

`packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts`

This file has now landed no-runtime and selected
`field_output_owner_and_design_grade_policy_v1`.

V22 selected status:

`selected_field_output_owner_design_grade_policy_after_v22_confirmed_rockwool_source_blocked_and_company_snapshot_green`

Current selected status:

`closed_company_internal_frequent_combination_lane_snapshot_guard_no_runtime_and_selected_source_gap_revalidation_v22`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`

Active planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_PLAN.md`

Gate C facts:

1. Runtime values, support, confidence, evidence, API behavior, route
   cards, output cards, proposal/report copy, and workbench input
   behavior stayed frozen.
2. Gate C added
   `packages/engine/src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts`
   and closed `company_internal_frequent_combination_lane_snapshot_guard_v1`.
3. `company_internal_gate_c_closeout_summary` records that Gate A/B
   proved engine and web posture honesty, not exact source readiness.
4. `rockwool_rw41_screening_and_uris_packet_status` stays active:
   rockwool triple-leaf remains `Rw 41`, `multileaf_screening_blend`,
   low confidence, screening only, not exact, and not source-validated.
5. `repeat_uris_acquisition_blocked_without_new_packet`: Gate U already
   confirmed Uris identity and no rights-safe local or authorized curve
   payload. Do not retry acquisition without a new packet.
6. `company_internal_high_accuracy_opening_still_blocked` remains true
   until `pre_company_internal_use_exit_criteria` close.
7. `standing_lane_misclassification_monitoring_mandate` and
   `note_test_document_or_easy_fix` remain active for every suspicious
   common-combination lane/source/output result.

Gate C validation completed on 2026-05-04:

- focused Gate C passed 1 file / 6 tests;
- engine continuity passed 6 files / 38 tests;
- `pnpm calculator:gate:current` passed with engine 244 files / 1410
  tests, web 51 files / 246 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green;
- `pnpm check` passed with lint/typecheck clean, engine 377 files /
  2230 tests, web 163 files / 919 passed + 18 skipped, and build
  5 / 5 tasks;
- `git diff --check` passed after restoring `apps/web/next-env.d.ts` to
  `.next-typecheck`.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`.

2026-05-05 implementation check:

- the selected V22 Gate A file exists and has landed no-runtime;
- the V22 slice plan now contains the detailed Gate A implementation
  checklist, external Uris/ScienceDirect/OpenDevEd/Elsevier TDM source
  signal check, candidate decision table, executable test shape, done
  criteria, suspicious-result handling rule, and validation commands;
- V22 selected
  `packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts`
  as the next file to create;
- the source check did not produce a rights-safe Uris 2006 or equivalent
  runtime packet, so `repeat_uris_acquisition_blocked_without_new_packet`
  remains active;
- fresh `pnpm calculator:gate:current` passed with engine 244 files /
  1410 tests, web 51 files / 246 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.

Current next action:

`gate_a_revalidate_source_accuracy_gap_order_after_company_internal_snapshot_guard_closeout`

V22 Gate A must compare at least these candidates:

- rockwool/Uris source-owned closure or packet-intake readiness;
- remaining frequent-combination visible/API guardrail gaps;
- near-source material alias/source promotion ownership;
- hostile API/import guardrails;
- field-output owner and design-grade policy;
- productization/report polish only after correctness blockers are
  controlled.

Validation order for the selected V22 Gate A:

1. Create
   `packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts`.
2. Re-rank the backlog using `company_internal_gate_c_closeout_summary`,
   `rockwool_rw41_screening_and_uris_packet_status`,
   `frequent_combination_guard_green_carry_forward`,
   `field_output_near_source_hostile_input_and_curve_provenance_status`,
   and `company_internal_high_accuracy_opening_blocker_status`.
3. Keep exact runtime promotion blocked unless topology, material
   mapping, metric context, tolerance ownership, negative boundaries,
   source/curve provenance, and paired engine/web/report tests all
   exist.
4. Run focused V22 validation, continuity with company Gate C/Gate B/
   Gate A and Uris Gate U, then `pnpm calculator:gate:current` and
   `git diff --check`.
5. Run `pnpm check` before any company-internal high-accuracy handoff.

The previous company Gate C decision map is preserved below for handoff
history.

## Prior Active Decision Map - 2026-05-04 Company Snapshot Guard Gate C Closeout

`company_internal_frequent_combination_lane_snapshot_guard_v1` Gate C
closed no-runtime and selected `calculator_source_gap_revalidation_v22`
with:

`closed_company_internal_frequent_combination_lane_snapshot_guard_no_runtime_and_selected_source_gap_revalidation_v22`

Gate C checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`

Gate C artifacts:

- `company_internal_gate_c_closeout_summary`
- `rockwool_rw41_screening_and_uris_packet_status`
- `frequent_combination_guard_green_carry_forward`
- `field_output_near_source_hostile_input_and_curve_provenance_status`
- `repeat_uris_acquisition_blocked_without_new_packet`
- `company_internal_high_accuracy_opening_still_blocked`
- `selected_next_slice_with_target_file_and_validation_scope`

The previous Gate B decision map is preserved below for handoff history.

## Prior Active Decision Map - 2026-05-04 Company Snapshot Guard Gate B Closeout

Current implementation position:
`company_internal_frequent_combination_lane_snapshot_guard_v1`.

`company_internal_frequent_combination_lane_snapshot_guard_v1` Gate B
landed no-runtime and selected Gate C closeout / next-slice selection.
The selected next implementation file is:

`packages/engine/src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts`

This file does not exist yet; it is the next file to create after Gate B
validation is green.

Current selected status:

`company_internal_frequent_combination_visible_guard_landed_no_runtime_selected_gate_c_closeout`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_B_HANDOFF.md`

Active planning surface:

`docs/calculator/SLICE_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_PLAN.md`

Gate B facts:

1. Runtime values, support, confidence, evidence, API behavior, route
   cards, output cards, proposal/report copy, and workbench input
   behavior stayed frozen.
2. Gate B added
   `apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts`
   and the `company_internal_visible_route_output_snapshot_guard`.
3. The visible guard proves frequent rockwool triple-leaf, flat-list
   swaps, ordinary double-leaf/stud, masonry / lined-massive boundary
   hybrids, raw floor role inference, near-source aliases, hostile
   API/import payloads, and field-output continuations do not look exact
   or design-grade in route/output helper surfaces.
4. The split-rockwool / gypsum / MLV triple-leaf defect remains
   unresolved. `Rw 41` is still screening, low confidence, not exact,
   not fixed, and not source-validated.
5. Uris 2006 remains
   `paused_waiting_rights_safe_source_packet`; exact runtime promotion
   is blocked until source curves, material mapping, tolerance,
   negative boundaries, and paired visible tests exist.
6. Field outputs follow
   `field_outputs_never_design_grade_without_owner`; finite `R'w`,
   `DnT,w`, `L'n,w`, or `L'nT,w` values must stay visibly tied to
   lab/screening/apparent/bound continuations unless a later owner
   exists.
7. The `standing_lane_misclassification_monitoring_mandate` remains
   active: when a common combination looks like wrong lane / wrong
   source / false exact promotion, use `note_test_document_or_easy_fix`
   before moving on.

Gate B validation completed on 2026-05-04: focused web validation
passed 1 file / 8 tests; engine continuity passed 7 files / 50 tests;
web continuity passed 6 files / 27 tests; `pnpm calculator:gate:current`
passed with engine 243 files / 1404 tests, web 51 files / 246 passed +
18 skipped, repo build 5 / 5 tasks, and whitespace guard green; `git
diff --check` passed. Known non-fatal `sharp/@img` warnings remain
through `@turbodocx/html-to-docx`.

Current next action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

The next gate must close this slice no-runtime and select the next
bounded source/accuracy step. It must compare at least these candidates:

- rockwool triple-leaf source-owned closure;
- any remaining frequent-combination visible/API guardrails;
- source promotion ownership for near-source rows;
- hostile API/import guardrails;
- any new lane/output drift discovered by the Gate A/B matrix.

Gate B closeout validation is recorded in this plan and the Gate B
checkpoint. `pnpm check` remains required before a later
company-internal high-accuracy handoff.

Validation order for the selected Gate C:

1. Create
   `packages/engine/src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts`.
2. Close the slice no-runtime.
3. Re-rank next work against company-internal high-accuracy exit
   criteria.
4. Keep exact runtime promotion blocked unless topology, material
   mapping, metric context, tolerance ownership, negative boundaries,
   and paired engine/web/report tests all exist.

The previous Gate A decision map is preserved below for handoff history.

## Prior Active Decision Map - 2026-05-04 Company Snapshot Guard Gate A Closeout

Gate A landed no-runtime and selected the visible Gate B guard. The
selected Gate B implementation file was:

`apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts`

Gate A selected status:

`company_internal_frequent_combination_snapshot_matrix_landed_no_runtime_selected_visible_gate_b`

Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_A_HANDOFF.md`

Gate A validation completed on 2026-05-04: focused Gate A passed 1
file / 8 tests; engine continuity passed 7 files / 50 tests; web
continuity passed 4 files / 15 tests; final
`pnpm calculator:gate:current` passed with engine 243 files / 1404
tests, web 50 files / 238 passed + 18 skipped, repo build 5 / 5 tasks,
and whitespace guard green. Known non-fatal `sharp/@img` warnings remain
through `@turbodocx/html-to-docx`.

The previous V21 decision map is preserved below for handoff history.

## Prior Active Decision Map - 2026-05-04 V21 Gate A Closeout

Current implementation position:
`company_internal_frequent_combination_lane_snapshot_guard_v1`.

`calculator_source_gap_revalidation_v21` Gate A landed no-runtime and
selected the company-internal frequent-combination lane snapshot guard.
The selected next implementation file was:

`packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts`

V21 selected status:

`selected_company_internal_frequent_combination_lane_snapshot_guard_after_v21_consumed_field_output_guard_and_kept_rockwool_source_blocked`

V21 checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_GATE_A_HANDOFF.md`

V21 validation completed on 2026-05-04: focused V21 passed 1 file / 8
tests; engine continuity passed 5 files / 31 tests; web continuity
passed 3 files / 14 tests; final `pnpm calculator:gate:current` passed
with engine 242 files / 1396 tests, web 50 files / 238 passed + 18
skipped, repo build 5 / 5 tasks, and whitespace guard green. Earlier
current-gate build attempts hit transient Next manifest artifact misses;
the standalone root build and final retry passed with only the known
non-fatal `sharp/@img` warnings.

The previous field-output Gate B decision map is preserved below for
handoff history.

## Prior Active Decision Map - 2026-05-04 Field-Output Gate B Closeout

Current implementation position:
`calculator_source_gap_revalidation_v21`.

Field-output leakage Gate B landed visible copy / posture only and
selected a fresh source-gap revalidation. The selected next
implementation file is:

`packages/engine/src/calculator-source-gap-revalidation-v21-gate-a-contract.test.ts`

This file does not exist yet; it is the next file to create.

Current selected status:

`gate_b_strengthened_visible_field_output_basis_copy_no_runtime_selected_source_gap_revalidation_with_rockwool_and_misclassification_blockers`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_GATE_B_HANDOFF.md`

Active planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_PLAN.md`

Gate B facts:

1. Runtime values, support, confidence, evidence, API behavior, route
   cards, output-card status, proposal/report values, and workbench
   input behavior stayed frozen.
2. Proposal/report copy did move intentionally: field-style live cards
   now state that `R'w`, `DnT,w`, `L'n,w`, `L'nT,w`, and related field
   outputs are continuations from lab/screening/apparent/bound basis,
   not independent exact field measurements.
3. Low-confidence grouped split-rockwool still exposes finite `R'w 34`
   and `DnT,w 36` from the apparent field continuation while the
   dynamic wall strategy remains `multileaf_screening_blend`, low
   confidence, not fixed, and not source-validated.
4. Exact floor rows can still expose `L'n,w`, `L'nT,w`, and
   `L'nT,50`, but Gate B now forces report/card copy to keep those as
   field-impact continuations rather than independent exact field
   measurements.
5. Missing receiving-room volume and missing field `K` remain
   needs-input boundaries.

Gate B validation completed on 2026-05-04: focused Gate B passed 1 file
/ 4 tests. Continuity validation with output-card model, flat-list
multileaf guard, triple-leaf company-internal rehearsal, and floor field
continuation passed 4 files / 24 tests. The Gate B web file is now
included in `tools/dev/run-calculator-current-gate.ts`. The full
current gate then passed with engine 241 files / 1388 tests, web 50
files / 238 passed + 18 skipped, repo build 5 / 5 tasks, and whitespace
guard green. A first build attempt produced a transient
`next-font-manifest.json` artifact miss; the immediate web-build rerun
and full current-gate rerun passed without calculator/runtime changes.

Prior field-output Gate A status, kept for aligned contract handoff:

`gate_a_inventoried_field_output_lab_screening_leakage_no_runtime_selected_visible_wording_guard_gate_b`

Gate A selected:

`apps/web/features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts`

Company-internal high-accuracy opening blocker:

`company_internal_high_accuracy_opening_blocked_until_misclassification_blockers_close`

`triple_leaf_like_lane_source_field_errors_are_company_use_blockers`

The earlier internal-use envelope is historical controlled / caveated
pilot context only. Do not treat it as permission to open the calculator
as high-accuracy company-internal tooling while the current
misclassification and source-readiness blockers remain active. The new
planning contract is:

`packages/engine/src/company-internal-misclassification-readiness-blocker-contract.test.ts`

It keeps runtime values, support, confidence, evidence, API, route-card,
output-card, proposal/report, and workbench-input behavior frozen. It
asserts that company-internal high-accuracy opening is blocked until:

`pre_company_internal_use_exit_criteria`

1. `rockwool_triple_leaf_exact_or_explicit_screening_only`: the split
   rockwool / gypsum / MLV triple-leaf path is either source-validated
   with owned topology, material mapping, metric, tolerance, negative
   boundaries, and paired visible tests, or remains visibly
   screening-only.
2. `field_outputs_never_design_grade_without_owner`: finite `R'w`,
   `DnT,w`, `L'n,w`, and `L'nT,w` values never look design-grade unless
   a field-output owner exists.
3. `frequent_wall_floor_lane_snapshots_green`: frequent wall/floor
   route-family snapshots stay green; any suspected wrong lane must be
   noted, tested, documented, and fixed immediately only when the fix is
   bounded.
4. `source_promotion_requires_topology_material_metric_tolerance_negatives_visible_tests`:
   near-source manufacturer rows cannot promote without exact topology,
   material/alias mapping, metric context, tolerance owner, protected
   negative boundaries, and paired engine/web/report tests.
5. `hostile_api_import_payloads_fail_closed`: UI normalization does not
   replace API/import guards for NaN, Infinity, negative thickness,
   unknown materials, duplicate stacks, or excessive layers.
6. `calculator_gate_current_and_full_check_green`: both
   `pnpm calculator:gate:current` and `pnpm check` must pass before a
   company-internal high-accuracy handoff.

Current next action after Gate B:

`gate_a_revalidate_source_gap_order_after_field_output_guard_and_company_internal_blocker`

V21 Gate A must produce:

- `post_gate_b_source_gap_candidate_order`;
- `rockwool_triple_leaf_fix_path_status`;
- `company_internal_high_accuracy_blocker_alignment`;
- `field_output_guard_consumed_as_prerequisite`;
- `frequent_combination_lane_snapshot_risk_order`;
- `selected_next_slice_or_no_runtime_closeout`.

Validation order for V21 Gate A:

1. Create
   `packages/engine/src/calculator-source-gap-revalidation-v21-gate-a-contract.test.ts`.
2. Re-rank source/accuracy candidates after Gate B, explicitly
   accounting for rockwool triple-leaf, frequent-combination lane
   snapshots, field-output posture, hostile API/import guards, and
   near-source promotion blockers.
3. Keep runtime values frozen unless the contract explicitly selects a
   later bounded implementation gate.
4. Add the V21 file to `tools/dev/run-calculator-current-gate.ts` only
   after it exists.
5. Run focused V21 validation, continuity with Gate B / company blocker
   / v20 / Gate U / route-source risk register, then
   `pnpm calculator:gate:current`.

The previous v20 decision map is preserved below for handoff history.

## Prior Active Decision Map - 2026-05-04 V20 Gate A Closeout

Current implementation position:
`field_output_lab_screening_leakage_guard_v1`.

`calculator_source_gap_revalidation_v20` Gate A landed no-runtime and
selected the bounded field-output honesty guard. The selected next
implementation file,
`packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts`,
does not exist yet; this is the next file to create.

`selected_field_output_lab_screening_leakage_guard_after_v20_rerank_found_no_source_ready_runtime_candidate_and_uris_packet_absent`

`docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_GATE_A_HANDOFF.md`

`field_output_lab_screening_leakage_guard_v1`

`packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts`

V20 Gate A facts:

1. Uris 2006 remains blocked by
   `rights_safe_source_owned_curve_payload_absent`; it is an
   external/manual source-packet dependency, not a runtime lane.
2. The grouped split-rockwool stack remains `Rw 41`,
   `multileaf_screening_blend`, low confidence, not fixed, not exact,
   and not source-validated.
3. No wall or floor source row has complete topology, metric,
   material mapping, tolerance, negative-boundary, and visible-test
   ownership.
4. Field-style outputs such as `R'w`, `DnT,w`, `L'n,w`, and
   `L'nT,w` can be live from lab/screening/formula/bound basis and must
   not look design-grade without a field overlay owner.
5. Runtime values, support, confidence, evidence, API behavior, route
   cards, output cards, proposal/report copy, and workbench input
   behavior stayed frozen.

Field-output Gate A must produce:

- `field_output_lab_screening_leakage_inventory`
- `low_confidence_airborne_field_output_snapshot_matrix`
- `floor_impact_field_output_basis_snapshot_matrix`
- `visible_output_card_and_report_copy_inventory`
- `negative_boundaries_for_exact_field_or_design_grade_wording`
- `selected_gate_b_guard_or_no_runtime_closeout_with_target_file`

Validation order for field-output Gate A:

1. Create
   `packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts`.
2. Inventory field-style outputs across low-confidence airborne,
   floor exact/bound, generated floor fallback, and visible output/report
   copy surfaces.
3. Keep runtime values frozen unless a later gate explicitly selects a
   bounded visible wording guard with paired engine and web/report tests.
4. Add Gate A to `tools/dev/run-calculator-current-gate.ts` only after
   the file exists.
5. Run focused Gate A validation, then `pnpm calculator:gate:current`.

The previous v20 decision map is preserved below for handoff history.

## Prior Active Decision Map - 2026-05-04 Gate U Closeout

Current implementation position: `calculator_source_gap_revalidation_v20`.

`wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1`
Gate U landed no-runtime and selected the next source-gap
revalidation. The selected next implementation file,
`packages/engine/src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts`,
does not exist yet; this is the next file to create.

`gate_u_rechecked_uris_2006_rights_safe_source_packet_absent_no_runtime_selected_source_gap_revalidation_v20`

`docs/calculator/CHECKPOINT_2026-05-04_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_GATE_U_HANDOFF.md`

`calculator_source_gap_revalidation_v20`

`packages/engine/src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts`

Gate U facts:

1. Uris 2006 identity is confirmed by DOI/PII/title/journal metadata,
   but metadata is not a rights-safe runtime source packet.
2. Elsevier TDM / ScienceDirect paths are authorized access paths only;
   no authorized local payload, page image, table, curve identity, or
   band vector exists in the repo.
3. NRC 2024, Uris 2008, manufacturer STC/IIC/OITC rows, public
   catalogue metadata, user repro PDFs, and unrelated PDFs remain
   negative boundaries.
4. The grouped split-rockwool stack remains `Rw 41`,
   `multileaf_screening_blend`, low confidence, not fixed, not exact,
   and not source-validated.
5. Runtime promotion remains illegal until source packet, curve/rating
   derivation, local material mapping, topology guard, negative
   boundaries, and paired visible tests all pass.

V20 Gate A must produce:

- `uris_2006_gate_u_acquisition_closeout_summary`
- `source_packet_absence_and_external_dependency_carry_forward`
- `post_uris_acquisition_source_ready_runtime_candidate_rerank`
- `wrong_lane_and_frequent_combination_monitoring_carry_forward`
- `field_output_alias_hostile_input_curve_provenance_status`
- `selected_next_slice_with_target_file_and_validation_scope`

Validation order for v20 Gate A:

1. Create
   `packages/engine/src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts`.
2. Re-rank the backlog after Gate U confirmed the Uris source packet is
   still absent and runtime remains frozen.
3. Select only a source-ready row or bounded guard fix with topology,
   metric, material mapping, tolerance, negative-boundary, and visible
   test ownership; otherwise close no-runtime.
4. Add v20 to `tools/dev/run-calculator-current-gate.ts` only after the
   file exists.
5. Run focused v20 validation, then `pnpm calculator:gate:current`.

The previous Gate U decision map is preserved below for handoff
history.

## Prior Active Decision Map - 2026-05-04 V19 Gate A

Prior implementation position:
`wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1`.

`calculator_source_gap_revalidation_v19` Gate A landed no-runtime and
selected the Uris 2006 / equivalent rockwool two-cavity source-packet
acquisition lane as the next highest-impact step. The selected next
implementation file,
`packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts`,
does not exist yet; this is the next file to create.

`selected_uris_2006_rights_safe_source_packet_acquisition_after_v19_rerank_prioritized_unfixed_split_rockwool_and_found_no_runtime_ready_candidate`

`wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1`

`packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts`

V19 Gate A facts:

1. Floor Gate B evidence was carried forward as protected no-runtime
   behavior, not support/confidence/evidence promotion.
2. The grouped split-rockwool stack remains `Rw 41`,
   `multileaf_screening_blend`, low confidence, not fixed.
3. The Uris 2006 lane remains `paused_waiting_rights_safe_source_packet`.
4. Field-output leakage, material alias / near-source false promotion,
   hostile API/import input, and curve-provenance risks remain active.
5. Runtime promotion remains illegal until source packet, curve/rating
   derivation, local material mapping, topology guard, negative
   boundaries, and paired visible tests all pass.

Gate U must produce:

- `uris_2006_rights_safe_source_packet_acquisition_attempt`
- `equivalent_rockwool_two_cavity_source_payload_scan`
- `source_packet_runtime_readiness_or_rejection_reason`
- `nrc_2024_comparator_boundary_still_not_local_runtime`
- `rw41_screening_answer_remains_not_fixed_until_packet_mapping_and_visible_tests`
- `selected_next_gate_with_target_file_and_validation_scope`

Validation order for Gate U:

1. Create
   `packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts`.
2. Decide whether a rights-safe Uris 2006 packet or equivalent
   rockwool two-cavity curve payload exists.
3. Keep runtime frozen unless all source/topology/material/tolerance/
   negative-boundary/visible-test prerequisites are owned.
4. Add Gate U to `tools/dev/run-calculator-current-gate.ts` only after
   the file exists.
5. Run focused Gate U validation, then `pnpm calculator:gate:current`.

The previous v19 decision map is preserved below for handoff history.

## Prior Active Decision Map - 2026-05-04 Gate B Closeout

Current implementation position: `calculator_source_gap_revalidation_v19`.
The floor tolerance-edge slice closed no-runtime at Gate B and selected
the next source-gap rerank. The selected next implementation file,
`packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts`,
does not exist yet; this is the next file to create.

`floor_tolerance_edge_gate_b_closeout_summary`

`closed_floor_tolerance_edge_promotion_guard_no_runtime_and_selected_source_gap_revalidation_v19`

`gate_b_exact_bound_edges_remained_protected_no_support_promotion`

`calculator_source_gap_revalidation_v19`

`packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts`

Gate B closeout facts:

1. `floor_tolerance_edge_promotion_guard_v1` is closed no-runtime.
2. `+2 mm` exact/bound floor tolerance edges remained inside their
   exact/bound rows; `+2.1 mm` remained outside and did not promote.
3. Raw floor role prompts, duplicate-role negatives, direct
   `officialFloorSystemId` bypass boundaries, and visible exact/bound/
   screening wording separation remain protected.
4. Runtime values, support, confidence, evidence, field-output copy,
   API behavior, route cards, output cards, proposal/report copy, and
   workbench input behavior stayed frozen.
5. The next implementation step is v19 Gate A source-gap revalidation,
   not internet/source research or a speculative runtime promotion.

V19 Gate A must produce:

- `floor_tolerance_edge_gate_b_closeout_summary`
- `exact_bound_tolerance_edge_and_visible_wording_carry_forward`
- `post_floor_tolerance_source_ready_runtime_candidate_rerank`
- `rockwool_uris_2006_source_packet_status`
- `field_output_alias_hostile_input_curve_provenance_status`
- `selected_next_slice_with_target_gate_file_and_validation_scope`

V19 pre-contract decision matrix:

1. Evaluate `wall_triple_leaf_uris_2006_source_packet_or_acquisition_lane`
   first because it is the highest-impact unresolved user defect. It is
   not runtime-ready unless a rights-safe Uris 2006 or equivalent
   rockwool two-cavity curve packet exists with band data, rating
   derivation, uncertainty, local material mapping, grouped topology
   guard, and paired visible tests. If the packet is still absent, Gate
   A may select a formal source-acquisition slice but must keep `Rw 41`
   as screening.
2. Evaluate field-output leakage next. Do not let lab/screening basis
   values look exact for `R'w`, `DnT,w`, `L'nT,w`, or similar outputs.
3. Evaluate near-source/material-alias false promotion: rockwool vs
   glass-fiber, generic gypsum vs Type C, MLV/plaster, and
   manufacturer-context rows remain blocked without mapping and
   tolerance ownership.
4. Evaluate hostile API/import and curve-provenance risks. Unknown,
   non-finite, negative, or undocumented digitized inputs must stay
   fail-closed.
5. If none of the above is source-ready or bounded-fix ready, close v19
   no-runtime into the next explicitly named slice.

Validation order for v19 Gate A:

1. Create
   `packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts`.
2. Re-rank source-ready candidates after the floor tolerance-edge
   closeout, carrying forward wrong-lane, field-output, material alias,
   hostile input, and curve-provenance guards.
3. Select either a concrete source-ready next slice or another
   no-runtime closeout/rerank. Exact/runtime movement still requires
   source topology, local material mapping, metric/tolerance owner,
   negative boundaries, and paired engine plus visible tests.
4. Add v19 to `tools/dev/run-calculator-current-gate.ts` only after the
   file exists.
5. Run focused v19 validation, then `pnpm calculator:gate:current`.

The previous Gate B planning pass is preserved below for handoff
history.

## Prior Active Decision Map - 2026-05-04 Planning Pass

Prior implementation position: `floor_tolerance_edge_promotion_guard_v1`
Gate A was green and no-runtime. The selected next implementation file,
`packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`,
is now created and closed no-runtime.

`gate_b_closeout_file_currently_absent_and_next_to_create`

`wrong_measurement_triage_loop`

`frequent_combination_lane_suspicion_reproduce_trace_document_or_bounded_fix`

`external_source_research_deferred_until_source_acquisition_gate_or_source_packet`

`exact_promotion_requires_source_topology_material_metric_tolerance_negative_visible_proof`

Gate B closeout must make the next state unambiguous:

1. Create
   `packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`.
2. Close `floor_tolerance_edge_promotion_guard_v1` no-runtime unless
   the contract proves a small bounded floor tolerance / support wording
   fix that is covered by paired engine and visible web/report tests.
3. Keep runtime values, support, confidence, evidence, field-output
   copy, API behavior, route cards, output cards, proposal/report copy,
   and workbench input behavior frozen unless the closeout explicitly
   selects a bounded fix with tests.
4. Carry forward `standing_lane_misclassification_monitoring_mandate`,
   `note_test_document_or_easy_fix`,
   `paused_waiting_rights_safe_source_packet`,
   `multileaf_screening_blend_fail_closed_until_grouped_topology`,
   `raw_floor_role_inference`, and
   `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`.
5. Select the next slice by re-ranking source-ready accuracy work
   after the floor tolerance closeout. If no bounded source-ready path
   exists, the honest next step is a source-gap revalidation slice, not
   a speculative runtime promotion.

Wrong-measurement rule for every following slice: when a frequent wall
or floor combination appears to switch route family/source lane after a
small layer reorder, duplicate-stack edit, many-layer edit, material
alias, or near-thickness-boundary edit, first reproduce it in a focused
contract. Compare `detectedFamily`, strategy, support, confidence,
warnings, origin/evidence, and visible route/output wording. If the
answer is finite but fail-closed or low-confidence, document that state
instead of calling it exact. Implement immediately only when the fix is
bounded and covered by engine plus visible tests; otherwise record the
risk and select the next gate.

No external source research is selected for the immediate next step.
Internet/source-packet research should start only if Gate B selects a
source-acquisition lane or if a rights-safe source packet/source locator
is supplied. The original rockwool/Uris issue remains blocked on
`paused_waiting_rights_safe_source_packet`; the current `Rw 41`
`multileaf_screening_blend` answer is not fixed, exact, or
source-validated.

## Gate B Implementation Blueprint - 2026-05-04 Follow-Up Pass

Implementation surfaces inspected for the next step:

`inspected_floor_exact_bound_implementation_surfaces`

`gate_b_contract_blueprint_snapshot_matrix`

`exact_bound_screening_visible_surface_parity_check`

`contiguous_duplicate_vs_disjoint_duplicate_role_boundary`

`current_gate_runner_must_include_gate_b_after_creation`

`source_gap_revalidation_v19_candidate_after_floor_closeout`

`no_internet_research_before_gate_b_selects_source_acquisition`

The closeout contract should use the current implementation shape
instead of guessing:

- `packages/engine/src/floor-system-evaluation.ts` owns the `+/- 2 mm`
  exact/bound thickness tolerance and the split/ambiguous role topology
  helpers.
- `packages/engine/src/floor-system-match.ts` and
  `packages/engine/src/bound-floor-system-match.ts` own exact floor rows
  and official bound-only rows.
- `packages/engine/src/impact-lane.ts`,
  `packages/engine/src/floor-system-ratings.ts`, and
  `packages/engine/src/calculate-assembly.ts` decide exact, bound,
  family-estimate, lower-bound, target-output support, and warning
  surfaces.
- `apps/web/features/workbench/impact-result-panel.tsx` and
  `apps/web/features/workbench/simple-workbench-evidence.ts` are the
  visible parity surfaces for exact/bound/screening wording.
- `tools/dev/run-calculator-current-gate.ts` must be updated once
  `post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`
  exists so the selected Gate B closeout is part of the current gate.

Gate B should create one closeout contract with these assertions:

1. `gate_b_contract_blueprint_snapshot_matrix`: pin exact-inside,
   exact-just-outside, bound-inside, and bound-just-outside floor
   snapshots using existing representative rows. No support/confidence/
   evidence promotion should occur.
2. `contiguous_duplicate_vs_disjoint_duplicate_role_boundary`: distinguish
   merge-safe packed/contiguous same-role inputs from disjoint duplicate
   role schedules. Disjoint duplicates must not reopen exact or
   bound-only lanes just because the total thickness still looks close.
3. `exact_bound_screening_visible_surface_parity_check`: require exact
   warning/evidence copy, bound-only warning/evidence copy, and
   just-outside family/screening copy to remain visibly different.
4. `current_gate_runner_must_include_gate_b_after_creation`: after the
   file lands, update `tools/dev/run-calculator-current-gate.ts` and pin
   that inclusion in the closeout or its checkpoint.
5. Selection matrix: the likely next rerank candidate is
   `calculator_source_gap_revalidation_v19`, but Gate B must explicitly
   select or reject it. If no bounded fix is proven, select source-gap
   revalidation rather than runtime movement or source research.

## Gate B Preflight Fixture Map - 2026-05-04 Second Planning Pass

Second-pass implementation read:

`gate_b_preflight_exact_bound_fixture_map`

`gate_b_plus_2mm_inside_plus_2p1mm_outside_boundary`

`direct_floor_system_id_bypass_is_not_layer_match_promotion`

`field_context_warning_copy_not_field_metric_promotion`

`gate_b_validation_order_engine_contract_then_runner_then_current_gate`

`web_visible_changes_deferred_until_gate_b_selects_bounded_fix`

Use these fixtures before adding any broader logic:

- Exact edge fixture:
  `tuas_x3_clt140_measured_2026`, role `base_structure`, expected
  CLT `140 mm`. `+2 mm` must remain exact with `Rw 49`, `Ln,w 52`,
  and basis `open_measured_floor_system_exact_match`; `+2.1 mm` must
  drop to `family_general` with no exact `floorSystemMatch`.
- Bound edge fixture:
  `ubiq_fl33_open_web_steel_300_lab_2026`, role `base_structure`,
  expected open-web steel `300 mm`. `+2 mm` must remain the official
  bound-only row with `Rw 63`, `Ln,w upper bound 51`, and basis
  `official_floor_system_bound_support`; `+2.1 mm` must drop to
  `bound_interpolation` with basis
  `predictor_lightweight_steel_bound_interpolation_estimate`, even if
  the displayed numeric values remain close.
- Raw-role negative fixture:
  raw `tuas_x4_clt140_measured_2026` must keep impact unsupported and
  ask for floor roles before impact/output promotion.
- Duplicate-role negative fixture:
  raw `tuas_r7b_open_box_timber_measured_2026` must stay
  `family_general`, not exact, when single-entry roles are duplicated.

Do not use `officialFloorSystemId` / direct id resolution as proof that
a layer stack qualifies for exact or bound matching. That path is a
known-id bypass and should be tested separately from layer-scored
matching. Field-context warnings likewise prove visible copy behavior,
not new field-metric source ownership.

Validation order for Gate B:

1. Add the engine closeout contract and run it with Gate A plus v18 and
   the route/source risk register.
2. Add the new Gate B file to `tools/dev/run-calculator-current-gate.ts`.
3. Run `pnpm calculator:gate:current`.
4. Only add or change web visible tests if Gate B selects a bounded
   visible wording fix; otherwise web behavior remains frozen.

Last reviewed: 2026-05-04

## Implementation Cross-Check - 2026-05-04

`gate_b_implementation_cross_check_passed`

`gate_b_file_absent_runner_absent_by_design_until_creation`

`gate_a_fixture_ids_verified_in_catalog_and_existing_tests`

`packed_same_role_merge_safe_but_split_single_entry_schedules_blocked`

`official_floor_system_id_bypass_must_not_seed_layer_match_proof`

`gate_b_no_external_research_needed_until_source_acquisition_selected`

`gate_b_next_steps_order_contract_runner_current_gate_then_rerank`

`targeted_gate_a_v18_risk_register_validation_green`

Implementation read confirmed the plan is still executable and no
source lookup is needed before Gate B:

- The selected Gate B file is absent. This is expected until the next
  implementation step creates it.
- `tools/dev/run-calculator-current-gate.ts` currently runs v18 Gate A,
  floor tolerance Gate A, and the route/source risk register, but not
  Gate B. Add Gate B immediately after creating the file.
- `THICKNESS_TOLERANCE_MM` is `2`. Gate A already pins
  `tuas_x3_clt140_measured_2026` and
  `ubiq_fl33_open_web_steel_300_lab_2026` at `+2 mm` inside tolerance
  and `+2.1 mm` outside tolerance.
- `floor-system-evaluation.ts` intentionally permits packed same-role
  equivalents when they are contiguous/material-consistent, while
  `hasSplitSingleEntryRoleSchedules` blocks split/disjoint single-entry
  schedules from exact and bound matching. Gate B must keep that
  distinction explicit.
- Direct `officialFloorSystemId` resolution is a known-id bypass and
  its notes say layer scoring was bypassed. It must not be used as
  proof that an ambiguous layer stack earned exact or bound support.
- The current visible surfaces already separate exact match, bound-only
  match, published family estimate, and bound interpolation warnings.
  Gate B should only change visible wording if it selects a bounded
  wording fix with paired web/report tests.

Validation in this planning iteration passed:
`floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts`,
`calculator-source-gap-revalidation-v18-gate-a-contract.test.ts`, and
`calculator-route-source-risk-register-contract.test.ts` passed 3 files
/ 21 tests; `git diff --check` passed.

## Broad Audit Result - 2026-05-04

`broad_check_2026_05_04_toolbar_copy_alignment_passed`

`full_check_found_toolbar_copy_test_drift_not_calculator_runtime_drift`

`wrong_lane_broad_suites_green_no_runtime_movement_selected`

`gate_b_closeout_remains_first_implementation_step_after_broad_check`

`rockwool_uris_status_unchanged_after_broad_check`

Full `pnpm check` now passes after aligning
`simple-workbench-toolbar.test.ts` with the current toolbar copy
(`Report` and `PDF setup`, with `Example Stack` absent). The failing snapshot was UI-copy
drift, not calculator runtime, route-family, support, confidence,
evidence, field-output, or numeric-behavior drift.

The broad lane-safety suites stayed green, including deep hybrid
adjacent-swap scans, AAC boundary scans, dynamic route family-boundary
scans, many-layer and duplicate-stack histories, raw floor role guards,
hostile raw input guards, wall flat-list multileaf guards, grouped
topology route cards, and wall reorder invariance. That result supports
the current no-runtime posture; it does not justify a new promotion.

Historical note: this broad audit was completed before the Gate B
closeout existed. Gate B has since landed no-runtime and selected v19.
The current first implementation step is now
`packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts`.
The rockwool/Uris issue also remains unchanged: `Rw 41` is still
fail-closed `multileaf_screening_blend` screening output and still
waits for a rights-safe source packet or equivalent source-owned proof
before exact/runtime movement.

(`common_combination_lane_misclassification_sentinel_v1` Gate A landed
no-runtime on 2026-05-04 with
`common_combination_lane_sentinel_inventory_landed_no_runtime_selected_gate_b_reprobes`,
added
`packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts`,
created `frequent_wall_floor_combination_inventory`,
`route_family_source_lane_support_confidence_output_warning_snapshot_matrix`,
`small_layer_reorder_duplicate_many_layer_boundary_and_hostile_input_variants`,
`note_test_document_or_easy_fix_decision_log`,
`paired_engine_and_web_visible_tests_before_any_route_or_output_copy_movement`,
and `next_closeout_or_bounded_easy_fix_decision`, kept runtime/support/
confidence/evidence/API/route-card/output-card/proposal/report/
workbench-input behavior frozen, kept Uris 2006
`paused_waiting_rights_safe_source_packet`, kept
`multileaf_screening_blend_fail_closed_until_grouped_topology`, kept
`raw_floor_role_inference` /
`arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`, and
  selected
  `packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts`
  with `gate_b_reprobe_frequent_wall_floor_lane_sentinel_matrix_no_runtime`;
focused Gate A validation passed 1 file / 8 tests, continuity passed 6
files / 43 tests, `pnpm calculator:gate:current` passed engine 231
files / 1318 tests and web 49 files / 234 passed + 18 skipped, build
5 / 5 successful with known non-fatal `sharp/@img` warnings, and final
`git diff --check` passed;
`wall_no_stud_double_leaf_source_research_v1` Gate C closed
no-runtime; `wall_timber_double_board_source_research_v1` Gate C closed
no-runtime; `wall_clt_wall_source_research_v1` Gate C closed
no-runtime; `wall_lined_massive_heavy_core_source_research_v1` Gate C
closed no-runtime and selected `calculator_source_gap_revalidation_v2`;
`calculator_source_gap_revalidation_v2` Gate A landed no-runtime and
selected `floor_layer_order_invariance_expansion_v1`;
`floor_layer_order_invariance_expansion_v1` Gate A landed no-runtime
and selected Gate C closeout / next-slice selection;
`floor_layer_order_invariance_expansion_v1` Gate C closed no-runtime
and selected `wall_framed_facing_split_warning_stability_v1`;
`wall_framed_facing_split_warning_stability_v1` Gate A landed
no-runtime and selected Gate B value/warning stability fix;
`wall_framed_facing_split_warning_stability_v1` Gate B landed the
bounded LSF field board-split value/warning stability fix and selected
Gate C closeout / next-slice selection;
`wall_framed_facing_split_warning_stability_v1` Gate C closed and
selected `calculator_source_gap_revalidation_v3`;
`calculator_source_gap_revalidation_v3` Gate A landed no-runtime and
selected `internal_use_operating_envelope_v1`;
`internal_use_operating_envelope_v1` Gate A landed no-runtime with the
short company pilot usage note and scenario summary;
`internal_use_operating_envelope_v1` Gate B landed the regular
internal-use visibility audit and selected Gate C closeout /
next-slice selection;
the broad revalidation after Gate B is green;
`internal_use_operating_envelope_v1` Gate C closed no-runtime and
selected `calculator_source_pack_readiness_triage_v1` because no
source-ready accuracy import pack exists;
`calculator_source_pack_readiness_triage_v1` Gate A landed no-runtime
and selected `clt_mass_timber_wall_source_pack_extraction_v1` as a
source-row and metric-context extraction slice, not a runtime import;
`clt_mass_timber_wall_source_pack_extraction_v1` Gate A landed
no-runtime and selected Gate B metric-mapping / formula-tolerance
decision;
`clt_mass_timber_wall_source_pack_extraction_v1` Gate B landed
no-runtime, found no bounded metric-mapping or formula-tolerance path
ready now, and selected Gate C closeout / next-slice selection;
`clt_mass_timber_wall_source_pack_extraction_v1` Gate C closed
no-runtime and selected `internal_use_acceptance_rehearsal_v1` because
no source-ready accuracy pack exists after Gate B;
`internal_use_acceptance_rehearsal_v1` Gate A landed no-runtime with a
20-scenario company-internal acceptance matrix and selected Gate C
closeout / next-slice selection;
`internal_use_acceptance_rehearsal_v1` Gate C closed no-runtime and
selected `internal_use_pilot_handoff_v1` because no concrete
acceptance defect or source-ready accuracy pack exists;
`internal_use_pilot_handoff_v1` Gate A landed no-runtime with the
company-internal pilot handoff pack and selected Gate C closeout /
next-slice selection;
`internal_use_pilot_handoff_v1` Gate C closed no-runtime and selected
`calculator_source_intake_backlog_cleanup_v1` because no concrete pilot
defect or source-ready accuracy pack exists;
`calculator_source_intake_backlog_cleanup_v1` Gate A landed no-runtime
with the cross-family source-ready intake backlog and selected Gate C
closeout / next-slice selection;
`calculator_source_intake_backlog_cleanup_v1` Gate C closed no-runtime
and selected `generated_floor_fallback_topology_delta_v1` because no
source-ready runtime pack exists;
`generated_floor_fallback_topology_delta_v1` Gate A landed no-runtime
with the topology-delta matrix and selected Gate C closeout /
next-slice selection;
`generated_floor_fallback_topology_delta_v1` Gate C closed no-runtime
and selected `calculator_source_gap_revalidation_v4` because Gate A
found topology near misses only, not a source-ready runtime candidate;
`calculator_source_gap_revalidation_v4` Gate A landed no-runtime and
selected `knauf_wall_systems_source_pack_extraction_v1` because
official Knauf UK/AU source locators are concrete enough for extraction
but not import or confidence promotion;
`knauf_wall_systems_source_pack_extraction_v1` Gate A landed
no-runtime source table locator extraction and selected Gate B
mapping/tolerance decision;
`knauf_wall_systems_source_pack_extraction_v1` Gate B landed
no-runtime, found no locator row with complete topology / material /
metric / tolerance / visible-test ownership, and selected Gate C
closeout / next-slice selection;
`knauf_wall_systems_source_pack_extraction_v1` Gate C closed
no-runtime and selected `calculator_source_gap_revalidation_v5`;
`calculator_source_gap_revalidation_v5` Gate A landed no-runtime and
selected `timber_double_board_knauf_tb5a_mapping_tolerance_v1`;
`timber_double_board_knauf_tb5a_mapping_tolerance_v1` Gate A landed
no-runtime and selected Gate C closeout / next-slice selection;
`timber_double_board_knauf_tb5a_mapping_tolerance_v1` Gate C closed
no-runtime and selected `lined_masonry_knauf_mwi2a_mapping_tolerance_v1`;
`lined_masonry_knauf_mwi2a_mapping_tolerance_v1` Gate A landed
no-runtime and selected Gate C closeout / next-slice selection;
`lined_masonry_knauf_mwi2a_mapping_tolerance_v1` Gate C closed
no-runtime and selected `twin_timber_knauf_ttf302a_mapping_tolerance_v1`;
`twin_timber_knauf_ttf302a_mapping_tolerance_v1` Gate A landed
no-runtime and selected Gate C closeout / next-slice selection;
`twin_timber_knauf_ttf302a_mapping_tolerance_v1` Gate C closed
no-runtime and selected `calculator_source_gap_revalidation_v6`;
`calculator_source_gap_revalidation_v6` Gate A landed no-runtime and
selected `steel_stud_knauf_enpc_mapping_tolerance_v1`;
`steel_stud_knauf_enpc_mapping_tolerance_v1` Gate A landed no-runtime
and selected Gate C closeout / next-slice selection;
`steel_stud_knauf_enpc_mapping_tolerance_v1` Gate C closed no-runtime
and selected `calculator_source_gap_revalidation_v7`;
`calculator_source_gap_revalidation_v7` Gate A landed no-runtime and
selected `calculator_post_knauf_source_acquisition_v1`;
`calculator_post_knauf_source_acquisition_v1` Gate A landed no-runtime
and selected `british_gypsum_white_book_source_pack_extraction_v1`;
`british_gypsum_white_book_source_pack_extraction_v1` Gate A landed
no-runtime and selected Gate B mapping/tolerance decision;
urgent `wall_triple_leaf_accuracy_recovery_v1` Gate F landed
no-runtime with a research-only frequency-band solver skeleton and
selected Gate G calibration / holdout tolerance; urgent
`wall_triple_leaf_accuracy_recovery_v1` Gate G landed no-runtime with a
calibration / holdout tolerance owner and selected Gate G2 source-curve
digitization intake; urgent `wall_triple_leaf_accuracy_recovery_v1`
Gate G4 landed no-runtime with local material/topology mapping blocked
and selected Gate G5 blocked diagnostics/source acquisition; urgent
`wall_triple_leaf_accuracy_recovery_v1` Gate G5 landed no-runtime with
blocked diagnostics and selected Gate G6 local source/effect-model
requirements; urgent `wall_triple_leaf_accuracy_recovery_v1` Gate G6
landed no-runtime with local source/effect-model requirements and
selected Gate G7 local source-pack acquisition intake; urgent
`wall_triple_leaf_accuracy_recovery_v1` Gate G7 landed no-runtime with
local source-pack intake and an order-risk register, then selected Gate
G8 source-gap and order-risk register follow-up; urgent
`wall_triple_leaf_accuracy_recovery_v1` Gate G8 landed no-runtime with
source-gap and order-risk classification, then selected Gate G9 visible
diagnostics and grouped topology guard work; urgent
`wall_triple_leaf_accuracy_recovery_v1` Gate G9 landed no-runtime with
visible diagnostic and grouped topology guard ownership, then selected
Gate H fail-closed engine-integration prerequisite checking; urgent
`wall_triple_leaf_accuracy_recovery_v1` Gate H landed no-runtime with
engine-integration fail-closed prerequisite checking, then selected
Gate I web-visible grouped topology inputs; urgent
`wall_triple_leaf_accuracy_recovery_v1` Gate I landed no-runtime with
workbench grouped topology inputs and route-card topology-gap
visibility, then selected Gate J company-internal acceptance rehearsal;
urgent `wall_triple_leaf_accuracy_recovery_v1` Gate J landed
no-runtime with company-internal acceptance coverage for the two user
rockwool PDF stacks, complete/missing grouped topology, exact and
near-source controls, negative boundaries, hostile inputs, field
outputs, and report visibility, then selected Gate K runtime-promotion
readiness / source-gap closure; urgent
`wall_triple_leaf_accuracy_recovery_v1` Gate K landed no-runtime with
runtime-promotion readiness, kept the split-rockwool grouped stack
blocked on local material mapping / usable source pack / source-gap
closure / runtime-ready topology guards / paired runtime tests, and
selected Gate L source-gap closure; urgent
`wall_triple_leaf_accuracy_recovery_v1` Gate L landed no-runtime with
source-gap closure, confirmed all six local gaps remain open from
current evidence, and selected Gate M source evidence acquisition;
urgent `wall_triple_leaf_accuracy_recovery_v1` Gate M landed
no-runtime with source evidence acquisition, selected the rockwool
two-cavity band-curve source pack as the first evidence path, kept Type
C board mapping / support topology / MLV / gypsum plaster as follow-on
blockers, and selected Gate N rockwool two-cavity source locator
intake; urgent `wall_triple_leaf_accuracy_recovery_v1` Gate N landed
no-runtime with source locator intake, selected Uris 2006 as the
primary 50 mm mineral-wool/internal-board full-curve retrieval target,
kept NRC 2024 as an adjacent graph-owned comparator, kept rockwool
density and stone/glass-wool double-leaf papers as equivalence context
only, rejected NRC 1998 baseline rows from this lane, and selected Gate
O full-curve retrieval / provenance QC; urgent
`wall_triple_leaf_accuracy_recovery_v1` Gate O landed no-runtime with
full-curve retrieval and provenance QC, verified the Uris 2006 locator
but found no runtime-ready full one-third-octave curves, source
PDF/page image, plot axes, curve identity, or Rw/STC derivation in the
local/public corpus, rejected the reported 7-8 dB weighted-index
decrease as a reusable runtime penalty, and selected Gate P source
access or alternative measured-row acquisition; urgent
`wall_triple_leaf_accuracy_recovery_v1` Gate P landed no-runtime with
source access / alternative-row acquisition, kept Uris 2006 as the
primary access target but found no source-owned numeric curves/table,
classified Uris 2008 perforated absorptive-facing data as accessible
adjacent negative-boundary context, kept Utley/Brekke/Vinokur as method
context, rejected glazing rows, kept NRC 2024 as comparator only, and
selected Gate Q source-access backlog and runtime-blocker
revalidation; urgent `wall_triple_leaf_accuracy_recovery_v1` Gate Q
landed no-runtime with a manual source-access backlog and runtime
blocker revalidation, kept every Gate P blocker open, and selected Gate
R manual source packet intake; urgent
`wall_triple_leaf_accuracy_recovery_v1` Gate R landed no-runtime with
the manual Uris 2006 source-packet intake contract, recorded all seven
required artifacts as missing until a packet is provided, kept
digitization/runtime blocked, and selected Gate S source packet
availability checking; urgent
`wall_triple_leaf_accuracy_recovery_v1` Gate S landed no-runtime with
source-packet availability checking, confirmed no rights-safe Uris 2006
packet is available in the local corpus, kept metadata, NRC graph data,
user repro PDFs, and unrelated local PDFs out of source-packet
promotion, and selected Gate T manual source-packet acquisition
handoff; urgent `wall_triple_leaf_accuracy_recovery_v1` Gate T landed
no-runtime with manual source-packet acquisition handoff, paused the
Uris 2006 source lane on `paused_waiting_rights_safe_source_packet`,
kept the live split-rockwool answer frozen, and selected
`calculator_source_gap_revalidation_v8_no_runtime`; urgent
`calculator_source_gap_revalidation_v8` Gate A landed no-runtime,
kept the Uris 2006 lane paused, re-ranked the source/accuracy backlog,
and selected British Gypsum White Book Gate B
`gate_b_mapping_tolerance_decision_no_runtime`;
`british_gypsum_white_book_source_pack_extraction_v1` Gate B landed
no-runtime, kept `C204006`, `C204003`, `A206A290`, `A326017B`, and
`B226010` out of runtime, preserved `A046006` as the already-landed
exact timber anchor, and selected Gate C closeout /
next-slice selection; `british_gypsum_white_book_source_pack_extraction_v1`
Gate C closed no-runtime and selected `calculator_source_gap_revalidation_v9`;
`calculator_source_gap_revalidation_v9` Gate A landed no-runtime,
found no runtime-ready candidate after British Gypsum closeout, and
selected `calculator_post_british_gypsum_source_acquisition_v1`;
`calculator_post_british_gypsum_source_acquisition_v1` Gate A landed
no-runtime and selected
`rockwool_acoustic_wall_assemblies_source_pack_extraction_v1`;
`rockwool_acoustic_wall_assemblies_source_pack_extraction_v1` Gate C
closed no-runtime and selected `calculator_source_gap_revalidation_v10`;
`calculator_source_gap_revalidation_v10` Gate A landed no-runtime and
selected `usg_acoustical_assemblies_source_pack_extraction_v1`;
see
`SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md`).

---

## Primary Objective

The calculator exists to predict `Rw`, `R'w`, `Ln,w`, `DnT,w`, and
related values across realistic floor / wall layer combinations with:

- the broadest defensible coverage, and
- the highest defensible accuracy,

at the same time. Coverage gained at the cost of accuracy is a
regression. Every slice obeys the accuracy-preservation contract in
`MASTER_PLAN.md` §6.

## Planning Model

For every next slice decision:

1. Widen only inside corridors that are benchmark-backed,
   source-anchored, or formula-owned.
2. Pair widening with a tightening pass on the same family when the
   widened lane still relies on low-confidence blending.
3. Re-rank blocked families only after the current corridor is both
   broader and numerically honest.

## Now

- **Current selected calculator slice**:
  `floor_tolerance_edge_promotion_guard_v1`.
  Source label: exact/bound floor tolerance-edge guard no-runtime.
  Current selected status:
  `floor_tolerance_edge_inventory_landed_no_runtime_selected_closeout_next_slice_selection`.
  Next file:
  `packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`.
  Next action:
  `gate_b_no_runtime_closeout_and_next_slice_selection`.
  Planning surface:
  `docs/calculator/SLICE_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_PLAN.md`.
  Gate A landed
  `role_tagged_exact_floor_tolerance_edge_inventory`,
  `bound_floor_near_miss_and_exact_drop_snapshot_matrix`,
  `just_inside_just_outside_thickness_corridor_tests`,
  `raw_role_prompt_and_duplicate_role_negative_boundaries`,
  `visible_exact_bound_screening_support_wording_requirements`, and
  `next_guard_or_closeout_decision_before_any_floor_support_promotion`.
  Gate A kept runtime/support/confidence/evidence/API/route-card/
  output-card/proposal/report/workbench-input behavior frozen and
  selected no-runtime closeout / next-slice selection.
- **Just landed floor tolerance-edge Gate A**:
  `floor_tolerance_edge_inventory_landed_no_runtime_selected_closeout_next_slice_selection`.
  Checkpoint:
  [CHECKPOINT_2026-05-04_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-04_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_A_HANDOFF.md).
  Implementation file:
  `packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts`.
  Action:
  `gate_a_inventory_exact_floor_tolerance_edges_no_runtime`.
  Gate A pins exact/bound floor thickness edge behavior, raw-role and
  duplicate-role negative boundaries, hostile API/import fail-closed
  behavior, and visible wording requirements:
  `role_tagged_exact_floor_tolerance_edge_inventory`,
  `bound_floor_near_miss_and_exact_drop_snapshot_matrix`,
  `just_inside_just_outside_thickness_corridor_tests`,
  `raw_role_prompt_and_duplicate_role_negative_boundaries`,
  `visible_exact_bound_screening_support_wording_requirements`, and
  `next_guard_or_closeout_decision_before_any_floor_support_promotion`.
  It keeps `standing_lane_misclassification_monitoring_mandate`,
  `note_test_document_or_easy_fix`, `paused_waiting_rights_safe_source_packet`,
  `multileaf_screening_blend_fail_closed_until_grouped_topology`,
  `raw_floor_role_inference`, and
  `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`
  active.
  Validation completed on 2026-05-04: focused Gate A passed 1 file /
  7 tests; continuity with v18, common-combination Gate C / Gate B /
  Gate A, floor raw-role Gate C, route-family lane-drift Gate E / Gate
  F, and route-source risk register passed 9 files / 64 tests; `pnpm
  calculator:gate:current` passed engine 235 files / 1349 tests, web
  49 files / 234 passed + 18 skipped, repo build 5 / 5 successful with
  known non-fatal `sharp/@img` warnings; `apps/web/next-env.d.ts`
  restored to `.next-typecheck`; final `git diff --check` passed.
- **General review / release-gate finding on 2026-05-04**:
  the broad `pnpm check` pass initially caught non-runtime drift:
  strict warning callback types in new contracts, complete-topology
  typing in the triple-leaf frequency solver, and a stale
  `dynamic-airborne-order-sensitivity` snapshot that still expected
  lightweight flat-list triple-leaf swaps to promote to double-leaf.
  The correct current behavior is fail-closed
  `multileaf_screening_blend_fail_closed_until_grouped_topology` with a
  flat-list adjacent-swap guard warning. This confirms the first
  implementation step is still Gate B closeout for the floor
  tolerance-edge slice, followed by source-gap re-ranking or a bounded
  easy fix only if the closeout proves one. After fixes, `pnpm check`
  passed: lint passed, typecheck passed, engine tests passed 368 files
  / 2169 tests, web tests passed 161 files / 908 passed + 18 skipped,
  and build passed 5 / 5 packages with the known non-fatal
  `sharp/@img` warnings.
- **Just landed source-gap v18 Gate A**:
  `selected_floor_tolerance_edge_promotion_guard_after_v18_rerank_found_no_source_ready_runtime_candidate_and_common_combination_sentinel_closed`.
  Checkpoint:
  [CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A_HANDOFF.md).
  Implementation file:
  `packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts`.
  Action:
  `gate_a_revalidate_source_accuracy_gap_order_after_common_combination_sentinel_closeout`.
  V18 produced
  `common_combination_gate_b_reprobe_summary`,
  `sentinel_guard_green_and_fail_closed_boundary_carry_forward`,
  `post_sentinel_source_ready_runtime_candidate_rerank`,
  `rockwool_uris_2006_source_packet_status`,
  `floor_raw_role_field_output_near_source_hostile_input_and_curve_provenance_status`,
  and `selected_next_slice_with_target_gate_file_and_validation_scope`.
  V18 found no source-ready runtime candidate, kept
  `paused_waiting_rights_safe_source_packet`,
  `multileaf_screening_blend_fail_closed_until_grouped_topology`,
  `standing_lane_misclassification_monitoring_mandate`,
  `note_test_document_or_easy_fix`, `raw_floor_role_inference`, and
  `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`
  active, and selected `floor_tolerance_edge_promotion_guard`.
  Validation completed on 2026-05-04: focused v18 Gate A 1 file / 9
  tests; continuity with common-combination Gate C / Gate B / Gate A,
  v17, floor raw-role Gate C, route-family lane-drift Gate E / Gate F,
  and route-source risk register 9 files / 67 tests; `pnpm
  calculator:gate:current` engine 234 files / 1342 tests, web 49 files
  / 234 passed + 18 skipped, repo build 5 / 5 successful with known
  non-fatal `sharp/@img` warnings; `apps/web/next-env.d.ts` restored
  to `.next-typecheck`; final `git diff --check` passed.
- **Just closed common-combination sentinel**:
  `closed_common_combination_lane_misclassification_sentinel_no_runtime_and_selected_source_gap_revalidation_v18`.
  Checkpoint:
  [CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_C_CLOSEOUT_HANDOFF.md).
  Closeout file:
  `packages/engine/src/post-common-combination-lane-misclassification-sentinel-v1-next-slice-selection-contract.test.ts`.
  Closeout action:
  `gate_c_closeout_and_next_slice_selection_after_gate_b_reprobes_no_runtime`.
  Gate C validation completed on 2026-05-04: focused closeout 1 file /
  6 tests; continuity with Gate A, Gate B, v17, floor raw-role Gate C,
  route-family lane-drift Gate E / Gate F, and route-source risk
  register 8 files / 58 tests; `pnpm calculator:gate:current` engine
  233 files / 1333 tests, web 49 files / 234 passed + 18 skipped, repo
  build 5 / 5 successful with known non-fatal `sharp/@img` warnings;
  `apps/web/next-env.d.ts` restored to `.next-typecheck`; final
  `git diff --check` passed.
  Gate B landed
  `packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts`
  with
  `gate_b_reprobe_frequent_wall_floor_lane_sentinel_matrix_no_runtime`
  and
  `common_combination_lane_sentinel_reprobes_landed_no_runtime_selected_gate_c_closeout_next_slice`.
  Gate B checkpoint:
  [CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B_HANDOFF.md](./CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B_HANDOFF.md).
  Gate B produced `gate_b_reprobe_findings` for
  `split_rockwool_grouped_rw41_blocked_source_packet`,
  `split_rockwool_flat_swap_fail_closed_guard_green`,
  `classic_framed_adjacent_swap_fail_closed_guard_green`,
  `aac_board_fill_gap_lined_massive_boundary_documented_fail_closed`,
  `duplicate_many_layer_classic_stack_finite_watch`,
  `raw_floor_open_box_parity_green`,
  `raw_floor_clt_role_prompt_guard_green`,
  `near_source_alias_context_only_watch`,
  `field_output_copy_leakage_watch`,
  `hostile_api_import_fail_closed_green`, and
  `curve_digitization_provenance_blocked_source_qc`. It found no small
  bounded fix ready now, made no runtime/source/value/support/confidence
  movement, and selected Gate C closeout / next-slice decision.
  Gate A landed
  `packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts`
  with
  `common_combination_lane_sentinel_inventory_landed_no_runtime_selected_gate_b_reprobes`.
  Gate A produced
  `frequent_wall_floor_combination_inventory`,
  `route_family_source_lane_support_confidence_output_warning_snapshot_matrix`,
  `small_layer_reorder_duplicate_many_layer_boundary_and_hostile_input_variants`,
  `note_test_document_or_easy_fix_decision_log`,
  `paired_engine_and_web_visible_tests_before_any_route_or_output_copy_movement`,
  and `next_closeout_or_bounded_easy_fix_decision`.
  Gate A checkpoint:
  [CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A_HANDOFF.md).
  Gate B reprobed each sentinel row no-runtime. Gate C closed the
  sentinel slice no-runtime and selected
  `calculator_source_gap_revalidation_v18` while keeping the sentinel
  mandate active.
  Gate A validation completed on 2026-05-04: focused 1 file / 8 tests,
  continuity 6 files / 43 tests, `pnpm calculator:gate:current`
  engine 231 files / 1318 tests, web 49 files / 234 passed + 18
  skipped, build 5 / 5 successful with known non-fatal `sharp/@img`
  warnings, `apps/web/next-env.d.ts` restored to `.next-typecheck`,
  and final `git diff --check` passed.
  Required carry-forward:
  `raw_floor_role_inference`,
  `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`,
  `standing_lane_misclassification_monitoring_mandate`, and
  `note_test_document_or_easy_fix`.
  Protected fix boundary:
  `frequent_combination_wrong_lane_suspicion_requires_repro_or_documented_fail_closed_risk`
  and
  `easy_fix_requires_small_bounded_change_with_engine_and_web_visible_regression_tests`.
  Gate B validation completed on 2026-05-04:
  `pnpm --filter @dynecho/engine exec vitest run src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts --maxWorkers=1`,
  passed 1 file / 9 tests; continuity with Gate A, v17, floor raw-role
  Gate C, route-family lane-drift Gate E / Gate F, and route-source
  risk register passed 7 files / 52 tests; `pnpm calculator:gate:current`
  passed engine 232 files / 1327 tests, web 49 files / 234 passed + 18
  skipped, repo build 5 / 5 successful with known non-fatal
  `sharp/@img` warnings; `apps/web/next-env.d.ts` restored to
  `.next-typecheck`; final `git diff --check` passed.
- **Just landed source-gap v17 Gate A**:
  `selected_common_combination_lane_misclassification_sentinel_after_v17_rerank_found_no_source_ready_runtime_candidate_and_user_reinforced_always_on_wrong_lane_monitoring`.
  Checkpoint:
  [CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A_HANDOFF.md).
  Implementation file:
  `packages/engine/src/calculator-source-gap-revalidation-v17-gate-a-contract.test.ts`.
  Action:
  `gate_a_revalidate_source_accuracy_gap_order_after_floor_raw_role_prompt_guard_landing`.
  V17 found no source-ready runtime candidate. Uris 2006 remains
  `paused_waiting_rights_safe_source_packet`, the wall flat-list guard
  remains `multileaf_screening_blend_fail_closed_until_grouped_topology`,
  and closed manufacturer / GA-600 contexts remain non-runtime.
  Every future calculator slice must keep looking for wrong route-family
  or source-lane behavior on frequent combinations; suspicious results
  must be tested, documented, or fixed only when the fix is small,
  bounded, and regression-backed.
  Validation completed on 2026-05-03: focused v17 Gate A 1 file / 10
  tests; continuity with floor raw-role Gate C / Gate B / Gate A, v16,
  lane-drift Gate E / Gate F, and the route-source risk register 8
  files / 59 tests; `pnpm calculator:gate:current` engine 230 files /
  1310 tests, web 49 files / 234 passed + 18 skipped, repo build 5 / 5
  successful with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed; `apps/web/next-env.d.ts` restored to `.next-typecheck`.
- **Just landed floor raw-role Gate C**:
  `floor_raw_role_prompt_guard_runtime_landed_selected_source_gap_revalidation_v17`.
  Checkpoint:
  [CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_C_HANDOFF.md](./CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_C_HANDOFF.md).
  Gate C implementation file:
  `packages/engine/src/floor-raw-role-inference-guardrail-gate-c-implementation.test.ts`.
  Gate C web proof:
  `apps/web/features/workbench/floor-raw-role-prompt-guard-route-card.test.ts`.
  Gate C action:
  `gate_c_implement_raw_floor_role_prompt_guard_with_engine_web_visible_tests`.
  Gate C landed visible prompt/warning movement only: role-tagged exact
  rows remain the promoted path; raw parity-green exact rows stay live
  but explicitly state that
  `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`;
  `raw_tagged_drift_requires_floor_role_prompt`,
  `raw_no_safe_inference_requires_floor_role_prompt`, and
  `duplicate_single_entry_role_requires_floor_role_prompt` now surface
  before exact floor-family promotion. Runtime import, output support,
  confidence, evidence, API shape, proposal/report copy, and workbench
  input behavior did not move. The original rockwool source lane
  remains `paused_waiting_rights_safe_source_packet`; the flat-list
  guard remains `multileaf_screening_blend_fail_closed_until_grouped_topology`.
- **Prior selected calculator slice**:
  `floor_raw_role_inference_guardrail_v1`.
  Source label: floor raw role inference guardrail.
  Selected by `calculator_source_gap_revalidation_v16` Gate A with
  `selected_floor_raw_role_inference_guardrail_after_v16_rerank_found_no_source_ready_runtime_candidate_and_prioritized_floor_side_wrong_lane_risk`.
  Next file:
  `packages/engine/src/floor-raw-role-inference-guardrail-gate-c-implementation.test.ts`.
  Next action:
  `gate_c_implement_raw_floor_role_prompt_guard_with_engine_web_visible_tests`.
  Planning surface:
  `docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md`.
  Required boundary:
  `raw_floor_role_inference` /
  `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`.
  Role-tagged exact floor rows are the promoted exact path; raw floor
  inference must stay screening-only or prompt for missing roles when
  exact floor outputs require role ownership.
- **Just landed floor raw-role Gate B**:
  `floor_raw_role_inference_prompt_guard_design_landed_no_runtime_selected_gate_c_implementation`.
  Checkpoint:
  [CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_B_HANDOFF.md](./CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_B_HANDOFF.md).
  Gate B implementation file:
  `packages/engine/src/floor-raw-role-inference-guardrail-gate-b-design-contract.test.ts`.
  Gate B action:
  `gate_b_design_raw_floor_role_prompt_and_negative_boundary_guard_no_runtime`.
  Gate B keeps role-tagged exact floors as the promoted path, keeps
  current raw-parity green controls bounded without claiming arbitrary
  raw reorder invariance, and blocks exact/support/confidence/
  route-card/output-card promotion behind
  `raw_tagged_drift_requires_floor_role_prompt`,
  `raw_no_safe_inference_requires_floor_role_prompt`, and
  `duplicate_single_entry_role_requires_floor_role_prompt`.
  Gate C must prove
  `paired_engine_and_web_visible_tests_before_route_card_output_card_or_warning_copy_movement`
  before route-card, output-card, or warning copy moves. Runtime,
  support, confidence, evidence, API, proposal/report, and workbench
  input behavior remain frozen. The original rockwool source lane
  remains `paused_waiting_rights_safe_source_packet`; the flat-list
  guard remains `multileaf_screening_blend_fail_closed_until_grouped_topology`.
  `standing_lane_misclassification_monitoring_mandate` and
  `note_test_document_or_easy_fix` remain active.
  Gate B validation completed on 2026-05-03: focused floor raw-role Gate
  B 1 file / 7 tests; continuity with v16 Gate A, Gate A, floor-library
  raw parity, raw-floor inferred split parity, floor order
  invariance/edit stability, raw-floor hostile input, and route-source
  risk register 9 files / 46 tests; `pnpm calculator:gate:current`
  engine 228 files / 1291 tests, web 48 files / 230 passed + 18 skipped,
  repo build 5 / 5 passed with known non-fatal `sharp/@img` warnings,
  and whitespace guard passed; `apps/web/next-env.d.ts` restored to
  `.next-typecheck`.
- **Just landed floor raw-role Gate A**:
  `floor_raw_role_inference_inventory_landed_no_runtime_selected_gate_b_prompt_guard_design`.
  Checkpoint:
  [CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A_HANDOFF.md).
  Gate A implementation file:
  `packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts`.
  Gate A action:
  `gate_a_inventory_raw_floor_role_inference_guardrail_no_runtime`.
  Gate A inventoried 173 exact floor rows, 167 manual exact rows, 166
  raw-inference rows, one no-safe-inference row, 12 raw-vs-role-tagged
  drift rows, and 23 bound floor rows. It kept runtime/support/
  confidence/evidence/API/output support/route-card/output-card/
  proposal/report/workbench-input behavior frozen and selected Gate B
  prompt/guard design at
  `packages/engine/src/floor-raw-role-inference-guardrail-gate-b-design-contract.test.ts`
  with
  `gate_b_design_raw_floor_role_prompt_and_negative_boundary_guard_no_runtime`.
  This carries forward `standing_lane_misclassification_monitoring_mandate`
  and `note_test_document_or_easy_fix`. The original rockwool source
  lane remains `paused_waiting_rights_safe_source_packet`; the flat-list
  guard remains `multileaf_screening_blend_fail_closed_until_grouped_topology`.
  Gate A validation completed on 2026-05-03: focused floor raw-role Gate
  A 1 file / 7 tests; continuity with v16 Gate A, floor-library raw
  parity, raw-floor inferred split parity, floor order invariance/edit
  stability, raw-floor hostile input, and route-source risk register 8
  files / 39 tests; `pnpm calculator:gate:current` engine 227 files /
  1284 tests, web 48 files / 230 passed + 18 skipped, repo build 5 / 5
  passed with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed; `apps/web/next-env.d.ts` restored to `.next-typecheck`.
- **Just landed source-gap revalidation**:
  `calculator_source_gap_revalidation_v16`.
  Gate A re-ranked the backlog after the lane-drift guard runtime
  landing and found no source-ready runtime candidate. It selected the
  no-runtime floor raw-role inference guardrail.
  Gate A checkpoint:
  [CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A_HANDOFF.md).
  Gate A implementation file:
  `packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts`.
  Gate A action:
  `gate_a_revalidate_source_accuracy_gap_order_after_lane_drift_guard_runtime_landing`.
  Gate A status:
  `selected_floor_raw_role_inference_guardrail_after_v16_rerank_found_no_source_ready_runtime_candidate_and_prioritized_floor_side_wrong_lane_risk`.
  Gate A validation completed on 2026-05-03: focused v16 Gate A 1 file
  / 10 tests; continuity with v15 Gate A, watchlist Gate A/B/C/D/E/F,
  and the route-source risk register 9 files / 68 tests; `pnpm
  calculator:gate:current` engine 226 files / 1277 tests, web 48 files
  / 230 passed + 18 skipped, repo build 5 / 5 passed with known
  non-fatal `sharp/@img` warnings, and whitespace guard passed;
  `apps/web/next-env.d.ts` restored to `.next-typecheck`; final
  `git diff --check` passed after validation docs sync.
  Gate F checkpoint:
  [CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_F_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_F_CLOSEOUT_HANDOFF.md).
  V16 reranked the source/accuracy backlog against the guarded posture,
  including `gate_e_flat_list_guard_landing_summary`,
  `post_guard_rockwool_triple_leaf_exact_source_packet_status`,
  `post_guard_closed_manufacturer_and_ga600_source_context_rerank`,
  `common_stack_lane_misclassification_watchlist_carry_forward`, and
  `runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_negative_boundary_and_visible_test_flags`.
  It keeps `standing_lane_misclassification_monitoring_mandate`,
  `note_test_document_or_easy_fix`,
  `multileaf_screening_blend_fail_closed_until_grouped_topology`, and
  `paused_waiting_rights_safe_source_packet` active. The original
  rockwool triple-leaf calculation remains screening, not exact or
  source-validated.
- **Just closed route-family lane-drift watchlist**:
  `route_family_lane_drift_common_stack_watchlist_v1`.
  Gate A landed no-runtime with
  `common_stack_lane_drift_inventory_landed_no_runtime_selected_gate_b_reprobes`
  after v15 selected it with
  `selected_route_family_lane_drift_common_stack_watchlist_after_v15_rerank_found_no_runtime_ready_source_candidate_and_user_prioritized_rockwool_like_lane_errors`.
  Gate B then landed no-runtime with
  `common_stack_lane_drift_reprobes_landed_no_runtime_selected_gate_c_classification`.
  Gate C then landed no-runtime classification with
  `common_stack_lane_drift_classification_landed_no_runtime_selected_gate_d_flat_list_family_guard_design`.
  Gate D then landed no-runtime guard design with
  `common_stack_lane_drift_flat_list_guard_design_landed_no_runtime_selected_gate_e_implementation`.
  Gate E then landed the bounded flat-list guard runtime movement with
  `common_stack_lane_drift_flat_list_guard_runtime_landed_selected_gate_f_closeout_next_slice`.
  Gate F then closed the watchlist with
  `closed_route_family_lane_drift_common_stack_watchlist_after_gate_e_guard_landed_and_selected_source_gap_revalidation_v16`.
  Gate E checkpoint:
  [CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E_HANDOFF.md](./CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E_HANDOFF.md).
  Gate A implementation file:
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts`.
  Gate A action:
  `gate_a_inventory_common_wall_floor_lane_drift_watchlist_no_runtime`.
  Gate B implementation file:
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts`.
  Gate B action:
  `gate_b_reprobe_common_stack_route_family_and_value_drift_no_runtime`.
  Gate C implementation file:
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts`.
  Gate C action:
  `gate_c_classify_reprobe_findings_and_select_bounded_fix_or_closeout_no_runtime`.
  Gate D implementation file:
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts`.
  Gate D action:
  `gate_d_design_flat_list_multileaf_family_guard_with_negative_boundaries_no_runtime`.
  Gate E implementation file:
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts`.
  Gate E action:
  `gate_e_implement_flat_list_multileaf_family_guard_with_engine_web_negative_boundaries`.
  Gate E engine artifact:
  `packages/engine/src/dynamic-airborne-flat-list-multileaf-guard.ts`.
  Gate E web proof:
  `apps/web/features/workbench/wall-flat-list-multileaf-family-guard-route-card.test.ts`.
  Gate F closeout file:
  `packages/engine/src/post-route-family-lane-drift-common-stack-watchlist-v1-next-slice-selection-contract.test.ts`.
  Gate F action:
  `gate_f_closeout_and_next_slice_selection_after_flat_list_guard_runtime_landing`.
  Gate F validation completed on 2026-05-03: focused Gate F closeout 1
  file / 6 tests; continuity with v15 Gate A, Gate A/B/C/D/E/F, and the
  route-source risk register 8 files / 58 tests; `pnpm
  calculator:gate:current` engine 225 files / 1267 tests, web 48 files
  / 230 passed + 18 skipped, repo build 5 / 5 passed with known
  non-fatal `sharp/@img` warnings, and whitespace guard passed;
  `apps/web/next-env.d.ts` restored to `.next-typecheck`; final
  `git diff --check` passed after validation docs sync.
  Planning surface:
  `docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md`.
  Gate C classifies the two ordinary flat-list multileaf flips as
  `bounded_fix_candidate` and the heavy AAC / lined-massive flip as
  `negative_boundary_for_fix` before any bounded fix:
  `split_rockwool_flat_swap_3_4_wrong_lane_reproduced` (`Rw 41`
  low-confidence `multileaf_screening_blend` -> `Rw 51`
  medium-confidence `double_leaf`),
  `ordinary_classic_triple_leaf_swap_wrong_lane_reproduced` (`Rw 32`
  -> `Rw 44`), and
  `heavy_multileaf_lined_massive_boundary_reproduced` (`Rw 39` ->
  `Rw 49`). Gate D designs
  `flat_list_adjacent_swap_sensitivity_probe` with future fail-closed
  target `multileaf_screening_blend_fail_closed_until_grouped_topology`
  and protects `ordinary_double_leaf_negative_boundary`, simple-stud,
  `lined_massive_boundary_hold_negative_boundary`, grouped-topology,
  duplicate/many-layer, known-floor, near-source alias, field-output,
  and `paired_engine_and_web_visible_tests_before_runtime`. Gate E
  implements the fail-closed target with
  `multileaf_screening_blend_fail_closed_until_grouped_topology`.
  `engine_split_rockwool_swapped_flat_list_holds_multileaf_fail_closed`
  now holds the split-rockwool swap at low-confidence
  `multileaf_multicavity`, `Rw 42`, `R'w 40`, `DnT,w 41` instead of
  the historical wrong-lane `Rw 51` `double_leaf`. The adjacent
  PDF-like rockwool stack holds at `Rw 41`, `R'w 39`, `DnT,w 41`.
  `engine_classic_swapped_flat_list_holds_multileaf_fail_closed` holds
  the classic swap at `Rw 33`, `R'w 31`, `DnT,w 33` instead of the
  historical wrong-lane `Rw 44` `double_leaf`. Web proofs
  `web_route_card_shows_fail_closed_multileaf_screening_not_exact` and
  `web_output_card_does_not_promote_rw_prime_or_dntw_as_exact` keep
  guarded outputs visible as screening, not exact. Source/evidence/
  support/confidence/API/workbench-input behavior stay frozen.
  The Uris 2006 rockwool source lane remains
  `paused_waiting_rights_safe_source_packet`, so the original triple-leaf
  calculation is guarded against wrong-lane flat-list flips but is not
  source-validated or exact.
  Gate C validation completed on 2026-05-03: focused Gate C 1 file / 7
  tests, v14 compatibility spot-check 1 file / 8 tests, continuity
  with v15 + Gate A/B/C + route-source risk register 5 files / 39
  tests, `pnpm calculator:gate:current` engine 222 files / 1248 tests,
  web 47 files / 227 passed + 18 skipped, repo build 5 / 5 passed with
  known non-fatal `sharp/@img` warnings, and
  `apps/web/next-env.d.ts` restored to `.next-typecheck`; `git diff --check`
  passed after final validation docs sync.
  Gate D validation completed on 2026-05-03: focused Gate D 1 file / 7
  tests, continuity with v15 + Gate A/B/C/D + route-source risk register
  6 files / 46 tests, `pnpm calculator:gate:current` engine 223 files /
  1255 tests, web 47 files / 227 passed + 18 skipped, repo build 5 / 5
  passed with known non-fatal `sharp/@img` warnings, and
  `apps/web/next-env.d.ts` restored to `.next-typecheck`; `git diff --check`
  passed after final validation docs sync.
  Gate E validation completed on 2026-05-03: focused Gate E guard
  implementation 1 file / 6 tests; focused web route/output proof 1
  file / 3 tests; affected web order-sensitivity / company acceptance /
  guard proof 3 files / 13 tests; continuity with v15 + Gate A/B/C/D/E
  + route-source risk register 7 files / 52 tests; triple-leaf legacy
  compatibility after the guarded flat-list movement 3 files / 17
  tests; split-refactor composer-size guard 1 file / 5 tests; `pnpm
  calculator:gate:current` engine 224 files / 1261 tests, web 48 files
  / 230 passed + 18 skipped, repo build 5 / 5 passed with known
  non-fatal `sharp/@img` warnings, and whitespace guard passed;
  `apps/web/next-env.d.ts` restored to `.next-typecheck`; final
  `git diff --check` passed after validation docs sync.
- **Standing wrong-lane monitoring rule**:
  `standing_lane_misclassification_monitoring_mandate`.
  Every future calculator slice must watch for rockwool-like route
  family/source-lane mistakes on frequent wall/floor stacks. If a
  stack falls into the wrong lane, jumps after a small layer edit,
  promotes a near-source row as exact, leaks field metrics, or returns
  an absurd value, use `note_test_document_or_easy_fix`: reproduce with
  a focused test, fix when bounded, or document and keep output
  fail-closed.
- **Just landed source-gap revalidation**:
  `calculator_source_gap_revalidation_v15`.
  Gate A re-ranked the paused Uris 2006 lane, GA-600, closed
  CertainTeed / PABCO / Georgia-Pacific / National Gypsum / USG /
  ROCKWOOL / British Gypsum / Knauf rows, fresh source acquisition,
  CLT / floor / no-stud / lined-heavy follow-ups, and historical
  blockers. It found no source-ready runtime candidate and selected
  the no-runtime common-stack lane-drift watchlist.
  Gate A checkpoint:
  [CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A_HANDOFF.md).
  Gate A implementation file:
  `packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts`.
  Gate A action:
  `gate_a_revalidate_source_accuracy_gap_order_after_certainteed_source_pack_closeout`.
  Gate A validation completed on 2026-05-03: focused v15 Gate A 1 file
  / 9 tests; continuity with CertainTeed Gate C / Gate B / Gate A, v14,
  PABCO Gate C / Gate B / Gate A, and the route-source risk register
  9 files / 67 tests; `pnpm calculator:gate:current` engine 219 files /
  1222 tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with
  known non-fatal `sharp/@img` warnings, whitespace guard passed;
  `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; `git diff --check` passed after the final
  documentation sync.
- **Just closed source slice**:
  `certainteed_silentfx_nrc_astc_source_pack_extraction_v1`.
  Source label: CertainTeed SilentFX NRC ASTC source-pack extraction.
  Gate B landed no-runtime with
  `certainteed_gate_b_found_no_runtime_ready_row_selected_closeout`.
  Originally selected by `calculator_source_gap_revalidation_v14` Gate A with
  `selected_certainteed_silentfx_nrc_astc_source_pack_extraction_after_v14_rerank_found_official_astc_product_stc_context_but_no_runtime_ready_import`.
- **Paused urgent correctness slice**:
  `wall_triple_leaf_accuracy_recovery_v1` remains paused on
  `paused_waiting_rights_safe_source_packet`; the split-rockwool
  grouped stack still stays low-confidence `multileaf_screening_blend`
  (`Rw 41`) and must not be presented as fixed or source-validated.
- **Latest source checkpoint**:
  [CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md).
  It lands `certainteed_silentfx_nrc_astc_source_pack_extraction_v1`
  Gate C no-runtime closeout, keeps NRC ASTC and CertainTeed product
  `STC` source context only, keeps the split-rockwool `Rw 41`
  `multileaf_screening_blend` answer not fixed, keeps every runtime and
  visible surface frozen, and selects `calculator_source_gap_revalidation_v15`.
  Gate C status:
  `closed_certainteed_silentfx_nrc_astc_source_pack_no_runtime_and_selected_source_gap_revalidation_v15_because_gate_b_found_no_runtime_ready_row`.
  Gate B status:
  `certainteed_gate_b_found_no_runtime_ready_row_selected_closeout`.
  Gate A status:
  `certainteed_silentfx_nrc_astc_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  Prior v14 selection status:
  `selected_certainteed_silentfx_nrc_astc_source_pack_extraction_after_v14_rerank_found_official_astc_product_stc_context_but_no_runtime_ready_import`.
  Extracted source rows:
  `NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018`,
  `CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE`, and
  `CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE`.
  Source locators:
  `https://publications-cnrc.canada.ca/eng/view/object/?id=f308069f-1b20-4aac-bc6d-e7b174ff21bb`,
  `https://ctonesource.certainteed.com/Products/PDF/CTG-2481.pdf`,
  `https://www.certainteed.com/acoustic-gypsum-board`, and
  `https://www.certainteed.com/products/drywall-products/silentfx-quickcut-drywall`.
  Protected boundaries:
  `certainteed_nrc_astc_high_rise_examples_do_not_promote_dyn_echo_rw_or_field_outputs`,
  `certainteed_ctg_2481_u465_stc57_product_row_does_not_replace_existing_lsf_or_generic_gypsum_routes`,
  `certainteed_ctg_2481_u309_stc51_product_row_does_not_promote_dyn_echo_rw_or_field_outputs`,
  `certainteed_silentfx_astc_field_flanking_examples_do_not_promote_dyn_echo_rw_or_dntw`,
  `certainteed_silentfx_product_stc_examples_do_not_promote_runtime_without_metric_topology_tolerance_and_visible_tests`,
  `silentfx_and_generic_gypsum_or_quietrock_do_not_coalesce_without_material_mapping_tolerance_owner`,
  `certainteed_context_does_not_fix_uris_2006_split_rockwool_rw_41_screening_result`,
  `certainteed_ctg_2481_onesource_login_redirect_blocks_current_product_pdf_payload_runtime_claim`,
  and
  `certainteed_astc_and_stc_context_does_not_override_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_or_knauf_rows`.
  Gate B row boundaries:
  `certainteed_nrc_astc_gate_b_high_rise_examples_do_not_promote_dyn_echo_rw_dntw_or_field_outputs`,
  `certainteed_ctg_2481_u465_gate_b_stc57_login_locator_does_not_replace_existing_lsf_or_generic_gypsum_routes`,
  and
  `certainteed_ctg_2481_u309_gate_b_stc51_login_locator_does_not_promote_dyn_echo_rw_or_field_outputs`.
  Gate B protected boundaries:
  `certainteed_gate_b_source_rows_are_not_runtime_import_approval`,
  `certainteed_gate_b_astc_field_flanking_examples_do_not_promote_dyn_echo_rw_dntw_or_field_outputs`,
  `certainteed_gate_b_product_stc_values_do_not_promote_dyn_echo_rw_or_field_outputs`,
  `certainteed_gate_b_silentfx_typex_certainteed_typex_generic_gypsum_quietrock_and_pabco_type_x_do_not_coalesce_without_mapping_tolerance`,
  `certainteed_gate_b_onesource_login_redirect_blocks_runtime_import_and_confidence_promotion`,
  `certainteed_gate_b_rows_do_not_override_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors`,
  `certainteed_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`,
  `certainteed_astc_rows_do_not_promote_lab_rw_dntw_or_field_output_routes`,
  `certainteed_product_stc_rows_do_not_replace_existing_lsf_anchors`,
  `certainteed_silentfx_and_type_x_rows_do_not_promote_generic_gypsum_or_quietrock_aliases`,
  and
  `certainteed_onesource_login_locator_rows_do_not_promote_runtime_truth_without_payload`.
  Material alias tokens:
  `silentfx_quickcut_type_x_does_not_coalesce_with_generic_gypsum_without_source_tolerance_owner`,
  `certainteed_type_x_does_not_coalesce_with_pabco_type_x_quietrock_type_c_or_generic_gypsum_without_row_policy`,
  `certainteed_product_stc_ul_u465_u309_rows_need_full_payload_before_exact_lsf_or_generic_wall_mapping`,
  `nrc_astc_25_gauge_steel_stud_high_rise_examples_do_not_replace_existing_lsf_lab_anchors`,
  `astc_field_flanking_context_does_not_coalesce_with_lab_rw_or_dntw_outputs`,
  and
  `silentfx_context_does_not_coalesce_with_local_mlv_or_uris_2006_triple_leaf_route`.
  CertainTeed Gate A validation completed on 2026-05-03: focused
  CertainTeed Gate A 1 file / 8 tests; continuity with v14, PABCO Gate
  C / Gate B / Gate A, post-Georgia-Pacific Gate A, v13,
  Georgia-Pacific Gate C, and the route-source risk register 9 files /
  66 tests; `pnpm calculator:gate:current` engine 216 files / 1198
  tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with
  known non-fatal `sharp/@img` warnings, and whitespace guard passed;
  `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; `git diff --check` passed after the final
  documentation sync.
  CertainTeed Gate B validation completed on 2026-05-03: focused
  CertainTeed Gate B 1 file / 8 tests; continuity with Gate A, v14,
  PABCO Gate C / Gate B / Gate A, post-Georgia-Pacific Gate A, v13,
  Georgia-Pacific Gate C, and the route-source risk register 10 files /
  74 tests; `pnpm calculator:gate:current` engine 217 files / 1206
  tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with known
  non-fatal `sharp/@img` warnings, and whitespace guard passed;
  `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; `git diff --check` passed after the final
  documentation sync.
  CertainTeed Gate C validation completed on 2026-05-03: focused
  CertainTeed Gate C closeout 1 file / 7 tests; continuity with
  CertainTeed Gate B, Gate A, v14, PABCO Gate C / Gate B / Gate A,
  post-Georgia-Pacific Gate A, v13, Georgia-Pacific Gate C, and the
  route-source risk register 11 files / 81 tests; `pnpm
  calculator:gate:current` engine 218 files / 1213 tests, web 47 files
  / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings, and whitespace guard passed;
  `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; `git diff --check` passed after the final
  documentation sync.
  Prior PABCO Gate C status:
  `closed_pabco_quietrock_sound_design_guide_source_pack_no_runtime_and_selected_source_gap_revalidation_v14_because_gate_b_found_no_runtime_ready_row`.
  Prior PABCO source label:
  PABCO Gypsum / QuietRock Sound Design Guide.
  Gate B status:
  `pabco_gate_b_found_no_runtime_ready_row_selected_closeout`.
  Prior post-Georgia-Pacific selection status:
  `selected_pabco_quietrock_sound_design_guide_source_pack_extraction_after_post_georgia_pacific_acquisition_found_official_row_pages_but_no_runtime_ready_import`.
  Selected planning surface:
  `docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md`.
  Prior PABCO planning surface:
  `docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md`.
  Gate C validation completed on 2026-05-03: focused PABCO Gate C
  closeout 1 file / 7 tests; PABCO Gate C / Gate B / Gate A /
  post-Georgia-Pacific / v13 / Georgia-Pacific Gate C / route-source
  risk continuity 7 files / 50 tests; `pnpm calculator:gate:current`
  engine 214 files / 1182 tests, web 47 files / 227 passed + 18
  skipped, repo build 5 / 5 with known non-fatal `sharp/@img`
  warnings, whitespace guard passed; `apps/web/next-env.d.ts` restored
  to `.next-typecheck` after the build side-effect; `git diff --check`
  passed after the final documentation sync.
  Gate B validation completed on 2026-05-03: focused PABCO Gate B 1
  file / 8 tests; PABCO Gate B / Gate A / post-Georgia-Pacific / v13 /
  route-source risk continuity 5 files / 36 tests;
  `pnpm calculator:gate:current` engine 213 files / 1175 tests, web 47
  files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings, whitespace guard passed;
  `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; `git diff --check` passed.
- **Next urgent implementation file**:
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts`.
  Run
  `gate_b_reprobe_common_stack_route_family_and_value_drift_no_runtime`;
  execute the common-stack wrong-lane reprobes selected by Gate A:
  split-rockwool grouped vs flat reorder, ordinary framed insulation
  reorder, lined-massive / masonry boundary drift, duplicate and
  many-layer stacks, raw floor role inference, near-source gypsum
  aliases, field-output leakage, hostile API/import input, and curve
  provenance. Do not move runtime or visible surfaces unless a later
  bounded fix gate explicitly proves the defect and adds regression
  coverage.
- **Current source-slice detail**:
  `certainteed_silentfx_nrc_astc_source_pack_extraction_v1`.
  Planning surface:
  `docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md`.
  Selected first file:
  `packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts`.
  Selected first action:
  `gate_a_extract_certainteed_silentfx_nrc_astc_rows_without_runtime_import`.
  Landed Gate A status:
  `certainteed_silentfx_nrc_astc_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  Selected Gate B file:
  `packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-b-contract.test.ts`.
  Selected Gate B action:
  `gate_b_mapping_tolerance_decision_no_runtime`.
  Landed Gate B status:
  `certainteed_gate_b_found_no_runtime_ready_row_selected_closeout`.
  Selected Gate C file:
  `packages/engine/src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts`.
  Selected Gate C action:
  `gate_c_closeout_and_next_slice_selection_no_runtime`.
  Selection status:
  `selected_certainteed_silentfx_nrc_astc_source_pack_extraction_after_v14_rerank_found_official_astc_product_stc_context_but_no_runtime_ready_import`.
  Prior v14 status:
  `closed_pabco_quietrock_sound_design_guide_source_pack_no_runtime_and_selected_source_gap_revalidation_v14_because_gate_b_found_no_runtime_ready_row`.
  Prior v14 file:
  `packages/engine/src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts`.
  Prior v14 action:
  `gate_a_revalidate_source_accuracy_gap_order_after_pabco_source_pack_closeout`.
  Prior closed slice:
  `pabco_quietrock_sound_design_guide_source_pack_extraction_v1`.
  Landed Gate A file:
  `packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts`.
  Landed Gate A action:
  `gate_a_extract_pabco_quietrock_sound_design_guide_rows_without_runtime_import`.
  Landed Gate B file:
  `packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts`.
  Landed Gate B action:
  `gate_b_mapping_tolerance_decision_no_runtime`.
  Landed Gate B checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`.
  Landed Gate C file:
  `packages/engine/src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts`.
  Landed Gate C action:
  `gate_c_closeout_and_next_slice_selection_no_runtime`.
  Landed Gate C checkpoint:
  `docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`.
- **Landed PABCO Gate B rows and boundaries**:
  `PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730`
  (`https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-646-16/`),
  `PABCO_PGD_W_445_16_QR_ES_WOOD_2X4_RC_16OC_STC57_NOAL17_0745`
  (`https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-445-16/`),
  `PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035`
  (`https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-449-24/`),
  `PABCO_PGD_68_534_16_QR_ES_STEEL_68MIL_RC_16OC_STC50_NOAL18_0611`
  (`https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-68-534-16/`),
  `PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358`
  (`https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-546-407-16/`),
  and `PABCO_PGD_W6_467_24_QR530_WOOD_2X6_24OC_STC56_NOAL21_1053`
  (`https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w6-467-24/`).
  Gate A source locators also include `https://go.pabcogypsum.com/tsdg`
  and
  `https://quietrock.com/resources/sound-control-assembly-selector/`.
  Gate B protected row boundaries:
  `pabco_pgd_w_646_16_gate_b_stc41_does_not_replace_existing_timber_or_generic_wood_stud_routes`,
  `pabco_pgd_w_445_16_gate_b_resilient_channel_stc57_does_not_promote_dyn_echo_rw_or_generic_resilient_bar`,
  `pabco_pgd_w_449_24_gate_b_indexed_locator_missing_payload_blocks_runtime_and_confidence_promotion`,
  `pabco_pgd_68_534_16_gate_b_68mil_steel_resilient_channel_row_does_not_replace_lsf_anchors`,
  `pabco_pgd_546_407_16_gate_b_stc60_does_not_promote_field_outputs_or_existing_lsf_anchors`,
  and
  `pabco_pgd_w6_467_24_gate_b_quietrock_530_row_does_not_promote_generic_wood_stud_route`.
  Gate B protected negative boundaries:
  `pabco_gate_b_source_rows_are_not_runtime_import_approval`,
  `pabco_gate_b_stc_values_and_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`,
  `pabco_gate_b_quietrock_es_530_pabco_type_x_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance`,
  `pabco_gate_b_glass_fiber_does_not_coalesce_with_local_rockwool_or_fix_uris_2006`,
  `pabco_gate_b_resilient_channel_stud_depth_spacing_gauge_and_bearing_do_not_promote_generic_routes`,
  `pabco_gate_b_pgd_w_449_24_indexed_payload_missing_blocks_runtime_import`,
  `pabco_gate_b_rows_do_not_override_closed_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors`,
  `pabco_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`,
  `pabco_wood_stud_quietrock_rows_do_not_replace_existing_timber_or_generic_wood_stud_routes`,
  `pabco_steel_stud_quietrock_rows_do_not_replace_existing_lsf_anchors`,
  `pabco_resilient_channel_rows_do_not_promote_generic_resilient_bar_routes`,
  `pabco_quietrock_multilayer_rows_do_not_promote_nrc_triple_leaf_or_local_mlv_routes`,
  `pabco_high_stc_rows_do_not_promote_field_outputs_without_field_overlay`,
  `pabco_indexed_or_summary_report_locator_rows_do_not_promote_runtime_truth_without_payload`,
  and
  `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`.
- **Prior PABCO checkpoint**:
  [CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md).
  It lands Gate A no-runtime extraction with status
  `pabco_quietrock_sound_design_guide_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
- **Prior checkpoint**:
  [CHECKPOINT_2026-05-02_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-02_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_GATE_A_HANDOFF.md).
  It lands `calculator_post_georgia_pacific_source_acquisition_v1`
  Gate A no-runtime, ranks PABCO Gypsum / QuietRock, CertainTeed
  SilentFX / NRC ASTC, Gypsum Association GA-600, and the closed
  official locator chain. It keeps the split-rockwool `Rw 41`
  `multileaf_screening_blend` answer not fixed, keeps every runtime and
  visible surface frozen, and selects
  `pabco_quietrock_sound_design_guide_source_pack_extraction_v1`.
  Validation completed on 2026-05-02: focused post-Georgia-Pacific
  Gate A 1 file / 8 tests; continuity 20 files / 142 tests;
  `pnpm calculator:gate:current` engine 211 files / 1159 tests, web
  47 files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings, and `apps/web/next-env.d.ts` restored to
  `.next-typecheck` after the build side-effect; `git diff --check`
  passed.
- **Prior checkpoint**:
  [CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_GATE_A_HANDOFF.md).
  It lands `calculator_source_gap_revalidation_v13` Gate A
  no-runtime, re-ranks the paused Uris 2006 triple-leaf lane, closed
  Georgia-Pacific / National Gypsum / USG / ROCKWOOL / British Gypsum /
  Knauf rows, remaining official locators, CLT / mass timber,
  generated floor, no-stud, lined-heavy, and historical blockers. It
  keeps the split-rockwool `Rw 41` `multileaf_screening_blend` answer
  not fixed, keeps every runtime and visible surface frozen, and
  selects `calculator_post_georgia_pacific_source_acquisition_v1`.
  Gate A status:
  `selected_post_georgia_pacific_source_acquisition_v1_after_v13_rerank_found_no_runtime_ready_candidate_and_post_british_gypsum_official_locators_closed_no_runtime`.
  Post-Georgia-Pacific planning surface:
  `docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md`.
  Post-Georgia-Pacific source label:
  post-Georgia-Pacific source acquisition.
  Post-Georgia-Pacific implementation file:
  `packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts`.
  Post-Georgia-Pacific action:
  `gate_a_acquire_and_classify_post_georgia_pacific_source_locators_without_runtime_import`.
  Validation completed on 2026-05-02: focused v13 Gate A 1 file / 8
  tests; route-source risk register 1 file / 4 tests; continuity
  19 files / 134 tests; `pnpm calculator:gate:current` engine
  210 files / 1151 tests, web 47 files / 227 passed + 18 skipped,
  build 5 / 5 with known non-fatal `sharp/@img` warnings, whitespace
  guard passed, `apps/web/next-env.d.ts` restored to
  `.next-typecheck`, and `git diff --check` passed.
  Prior Georgia-Pacific Gate C status:
  `closed_georgia_pacific_fire_sound_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v13_because_gate_b_found_no_runtime_ready_row`.
- **Prior checkpoint**:
  [CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md).
  It lands
  `georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1`
  Gate C closeout no-runtime for Georgia-Pacific Fire & Sound Assemblies,
  keeps the Georgia-Pacific rows context-only, keeps `STC`
  ranges/values and sound-report locators out of DynEcho runtime
  metrics, keeps the split-rockwool `Rw 41`
  `multileaf_screening_blend` answer not fixed, and selects
  `calculator_source_gap_revalidation_v13`.
  Gate C status:
  `closed_georgia_pacific_fire_sound_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v13_because_gate_b_found_no_runtime_ready_row`.
  Prior Gate B status:
  `georgia_pacific_gate_b_found_no_runtime_ready_row_selected_closeout`.
  Prior Gate A status:
  `georgia_pacific_fire_sound_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  Prior v12 selection status:
  `selected_georgia_pacific_fire_sound_assemblies_source_pack_extraction_after_v12_rerank_found_official_planning_context_but_no_runtime_ready_import`.
- **Prior v13 selection checkpoint**:
  [CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md).
  It lands
  `packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with `gate_c_closeout_and_next_slice_selection_no_runtime`, records
  `closed_georgia_pacific_fire_sound_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v13_because_gate_b_found_no_runtime_ready_row`,
  selects
  `packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts`
  with
  `gate_a_revalidate_source_accuracy_gap_order_after_georgia_pacific_source_pack_closeout`,
  and creates
  `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_PLAN.md`.
  Validation completed on 2026-05-02: focused Gate C 1 file / 7 tests;
  route-source risk register 1 file / 4 tests; continuity 18 files /
  126 tests; current gate engine 209 files / 1143 tests, web 47 files /
  227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings, whitespace guard passed, `next-env` restored
  to `.next-typecheck`, and `git diff --check` passed.
- **Prior checkpoint**:
  [CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md](./CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md).
  It lands
  `packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts`
  with `gate_b_mapping_tolerance_decision_no_runtime`, keeps
  `GP_TOUGHROCK_INTERIOR_STEEL_UL_U465_STC45_49_RAL_TL99_103`,
  `GP_TOUGHROCK_INTERIOR_STEEL_UL_U411_STC55_59_RAL_TL09_331`,
  `GP_TOUGHROCK_SHAFTLINER_AREA_SEPARATION_GP_WA_120_04_STC66_RAL_TL_10_291`,
  `GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U305_U337_STC30_34_OR_64_8`,
  `GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U425_STC55_59_IRC_IR_761`,
  and `GP_DENSGLASS_SHAFTLINER_UL_V473_1HR_RC_STC48_RAL_TL09_363`
  context-only, records
  `georgia_pacific_gate_b_found_no_runtime_ready_row_selected_closeout`,
  protects
  `georgia_pacific_gate_b_actual_directory_or_test_report_payload_missing_blocks_runtime_import`,
  `georgia_pacific_gate_b_source_rows_are_not_runtime_import_approval`,
  `georgia_pacific_gate_b_stc_ranges_and_sound_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`,
  `georgia_pacific_gate_b_densglass_toughrock_soundbreak_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance`,
  `georgia_pacific_gate_b_exterior_sheathing_shaftliner_area_separation_and_stairwell_rows_do_not_promote_generic_wall_routes`,
  `georgia_pacific_gate_b_rows_do_not_override_closed_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_lsf_anchors`,
  and
  `georgia_pacific_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`,
  then selects
  `packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with `gate_c_closeout_and_next_slice_selection_no_runtime`.
  Validation completed on 2026-05-02: focused Gate B 1 file / 7 tests;
  continuity 17 files / 119 tests; current gate engine 208 files /
  1136 tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with
  known non-fatal `sharp/@img` warnings and whitespace guard passed;
  `apps/web/next-env.d.ts` restored to `.next-typecheck`;
  `git diff --check` passed.
- **Prior checkpoint**:
  [CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md).
  It lands
  `packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts`
  with `gate_a_extract_georgia_pacific_fire_sound_assemblies_rows_without_runtime_import`
  and selects
  `packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts`.
  Validation completed on 2026-05-02: focused Gate A 1 file / 8 tests;
  continuity 16 files / 112 tests; current gate engine 207 files /
  1129 tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with
  known non-fatal `sharp/@img` warnings and whitespace guard passed;
  `apps/web/next-env.d.ts` restored to `.next-typecheck`;
  `git diff --check` passed.
- **Prior checkpoint**:
  [CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md).
  It lands National Gypsum Fire & Sound Assembly Selector Gate C
  no-runtime and selects `calculator_source_gap_revalidation_v12` with
  `packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts`
  and
  `gate_a_revalidate_source_accuracy_gap_order_after_national_gypsum_source_pack_closeout`
  and
  `closed_national_gypsum_fire_sound_selector_source_pack_no_runtime_and_selected_source_gap_revalidation_v12_because_gate_b_found_no_runtime_ready_row`.
  The v11-selected National Gypsum source-pack extraction remains
  recorded as `national_gypsum_fire_sound_selector_source_pack_extraction_v1`;
  its Gate A file was
  `packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts`,
  its action was
  `gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import`,
  and its selection status was
  `selected_national_gypsum_fire_sound_selector_source_pack_extraction_after_v11_rerank_found_official_selector_context_but_no_runtime_ready_import`.
  Validation completed on 2026-05-02:
  focused National Gypsum Gate C closeout 1 file / 7 tests;
  continuity 14 files / 96 tests; current gate engine 205 files /
  1113 tests, web 47 files / 227 passed + 18 skipped, build 5 / 5
  with known non-fatal `sharp/@img` warnings and whitespace guard
  passed; `apps/web/next-env.d.ts` restored to `.next-typecheck`;
  `git diff --check` passed.
- **Prior checkpoint**:
  [CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md](./CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md).
  It lands National Gypsum Gate B no-runtime and selects
  `packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with `gate_c_closeout_and_next_slice_selection_no_runtime`.
  Gate B status:
  `national_gypsum_gate_b_found_no_runtime_ready_row_selected_closeout`.
  Protected Gate B boundaries:
  `national_gypsum_gate_b_source_rows_are_not_runtime_import_approval`,
  `national_gypsum_gate_b_stc_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`,
  `national_gypsum_gate_b_fire_shield_soundbreak_shaftliner_do_not_coalesce_with_generic_gypsum_or_mlv`,
  `national_gypsum_gate_b_glass_fiber_does_not_coalesce_with_rockwool_or_generic_mineral_wool`,
  `national_gypsum_gate_b_resilient_channel_ct_h_stud_load_bearing_and_roof_truss_roles_do_not_promote_generic_routes`,
  `national_gypsum_gate_b_rows_do_not_override_usg_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`,
  `national_gypsum_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`, and
  `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`.
  Validation completed on 2026-05-02: focused National Gypsum Gate B 1
  file / 7 tests; continuity 13 files / 89 tests; current gate engine
  204 files / 1106 tests, web 47 files / 227 passed + 18 skipped,
  build 5 / 5 with known non-fatal `sharp/@img` warnings and
  whitespace guard passed; `apps/web/next-env.d.ts` restored to
  `.next-typecheck`; `git diff --check` passed.
- **Prior checkpoint**:
  [CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md).
  It lands National Gypsum Gate A no-runtime and selects
  `packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-b-contract.test.ts`
  with `gate_b_mapping_tolerance_decision_no_runtime`.
  Gate A status:
  `national_gypsum_fire_sound_selector_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  Prior Gate A protected boundaries:
  `national_gypsum_selector_surface_does_not_count_as_runtime_ready_row_without_report_payload`,
  `national_gypsum_stc_rows_do_not_directly_promote_dyn_echo_rw_or_field_outputs`,
  `national_gypsum_wall_rows_do_not_override_usg_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`,
  `national_gypsum_glass_fiber_does_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`,
  `national_gypsum_soundbreak_fire_shield_shaftliner_do_not_coalesce_with_generic_gypsum_or_mlv_without_mapping`,
  `national_gypsum_roof_ceiling_or_stc_na_rows_do_not_promote_floor_wall_or_triple_leaf_routes`, and
  `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`.
- **Prior checkpoint**:
  [CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_GATE_A_HANDOFF.md).
  It lands v11 Gate A no-runtime and selected
  `packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts`
  with
  `gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import`.
  Gate A status:
  `selected_national_gypsum_fire_sound_selector_source_pack_extraction_after_v11_rerank_found_official_selector_context_but_no_runtime_ready_import`.
  Validation completed: focused v11 Gate A 1 file / 8 tests; continuity
  11 files / 76 tests; current gate engine 202 files / 1093 tests, web
  47 files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings and whitespace guard passed;
  `apps/web/next-env.d.ts` restored to `.next-typecheck`; `git diff --check`
  passed.
- **Prior checkpoint**:
  [CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md).
  It closes USG Gate C no-runtime and selects
  `packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts`
  with
  `gate_a_revalidate_source_accuracy_gap_order_after_usg_source_pack_closeout`.
  Gate C status:
  `closed_usg_acoustical_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v11_because_gate_b_found_no_runtime_ready_row`.
- **Prior checkpoint**:
  [CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md](./CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md).
  It lands USG Gate B no-runtime and selects
  `packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with `gate_c_closeout_and_next_slice_selection_no_runtime`.
  Gate B status:
  `usg_gate_b_found_no_runtime_ready_row_selected_closeout`.
- **Prior checkpoint**:
  [CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md).
  It lands USG Gate A no-runtime and selects
  `packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts`
  with `gate_b_mapping_tolerance_decision_no_runtime`.
  Gate A status:
  `usg_acoustical_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
- **Prior checkpoint**:
  [CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md](./CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md).
  It lands ROCKWOOL Gate B no-runtime and selects
  `packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with
  `gate_c_closeout_and_next_slice_selection_no_runtime`.
  Gate B status:
  `rockwool_gate_b_found_no_runtime_ready_row_selected_closeout`.
- **Prior checkpoint**:
  [CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md).
  It lands ROCKWOOL Gate A no-runtime and selects
  `packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts`
  with
  `gate_b_mapping_tolerance_decision_no_runtime`.
  Gate A status:
  `rockwool_acoustic_wall_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
- **Planning surface**:
  [SLICE_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_PLAN.md](./SLICE_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_PLAN.md)
  plus
  [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_PLAN.md)
  plus
  [SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md](./SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md)
  plus
  [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_PLAN.md)
  plus
  [SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md](./SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md)
  plus
  [TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md](./TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md)
  plus
  [CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md](./CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md)
  plus
  [SLICE_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md](./SLICE_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md)
  plus
  [SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md](./SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md)
  plus
  [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V8_PLAN.md)
  plus
  [SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md](./SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md)
  plus
  [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_PLAN.md)
  plus [SLICE_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_V1_PLAN.md](./SLICE_CALCULATOR_POST_KNAUF_SOURCE_ACQUISITION_V1_PLAN.md)
  plus [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md)
  plus [SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md](./SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md)
  plus [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_PLAN.md)
  plus [SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md](./SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md)
  plus [SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md](./SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md)
  plus [SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md](./SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md)
  plus [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_PLAN.md),
  [SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md](./SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md),
  and [SOURCE_READY_INTAKE_BACKLOG.md](./SOURCE_READY_INTAKE_BACKLOG.md).
- **Just landed urgent gate**:
  `packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts`
  lands National Gypsum Fire & Sound Selector source-pack extraction Gate
  A no-runtime. It records representative rows
  `NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50`,
  `NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44`,
  `NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51`,
  `NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43`, and
  `NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA`, keeps selector/report/STC
  context out of runtime, keeps every runtime and visible surface
  frozen, and selects
  `packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-b-contract.test.ts`
  with `gate_b_mapping_tolerance_decision_no_runtime`.
  Gate A status:
  `national_gypsum_fire_sound_selector_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
- **Prior urgent gate**:
  `packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts`
  lands source-gap revalidation v11 no-runtime. It keeps closed USG /
  ROCKWOOL / British Gypsum / Knauf rows context-only, keeps the paused
  Uris 2006 source lane and split-rockwool `Rw 41`
  `multileaf_screening_blend` answer frozen, keeps every runtime and
  visible surface frozen, and selects
  `national_gypsum_fire_sound_selector_source_pack_extraction_v1` with
  `packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts`
  and
  `gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import`.
  Gate A status:
  `selected_national_gypsum_fire_sound_selector_source_pack_extraction_after_v11_rerank_found_official_selector_context_but_no_runtime_ready_import`.
  Validation completed: focused v11 Gate A 1 file / 8 tests; continuity
  11 files / 76 tests; current gate engine 202 files / 1093 tests, web
  47 files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings and whitespace guard passed;
  `apps/web/next-env.d.ts` restored to `.next-typecheck`; `git diff --check`
  passed.
- **Prior urgent gate**:
  `packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  closes USG Acoustical Assemblies source-pack extraction Gate C
  no-runtime. It carries forward all Gate B USG row blockers, keeps
  `STC`, `IIC`, ranges, and test numbers source-context only, keeps the
  paused Uris 2006 lane and split-rockwool `Rw 41`
  `multileaf_screening_blend` answer frozen, and selects
  `calculator_source_gap_revalidation_v11` with
  `packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts`
  and
  `gate_a_revalidate_source_accuracy_gap_order_after_usg_source_pack_closeout`.
  Gate C status:
  `closed_usg_acoustical_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v11_because_gate_b_found_no_runtime_ready_row`.
  Validation completed: focused USG Gate C 1 file / 7 tests; continuity
  10 files / 68 tests; current gate engine 201 files / 1085 tests, web
  47 files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings; `apps/web/next-env.d.ts` restored to
  `.next-typecheck`; `git diff --check` passed.
- **Prior urgent gate**:
  `packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts`
  lands USG Acoustical Assemblies source-pack extraction Gate B
  no-runtime. It keeps `LEVELROCK_I_JOIST_SRM25_CARPET`,
  `LEVELROCK_I_JOIST_SRM25_SHEET_VINYL`,
  `LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE`,
  `LEVELROCK_TRUSS_SRM25_CERAMIC_TILE`, `USG_STEEL_FRAMED_A1`, and
  `USG_STEEL_FRAMED_A8` context-only because no row has exact topology,
  metric policy, material mapping, tolerance ownership, protected
  negative boundaries, and paired engine/web visible tests ready
  together. `STC`, `IIC`, ranges, and test numbers remain source-context
  only. Gate B status:
  `usg_gate_b_found_no_runtime_ready_row_selected_closeout`.
  Protected boundaries:
  `usg_gate_b_source_rows_are_not_runtime_import_approval`,
  `usg_gate_b_stc_iic_test_numbers_do_not_promote_dyn_echo_rw_lnw_or_field_outputs`,
  `usg_gate_b_levelrock_srm_srb_i_joist_truss_do_not_promote_generated_floor_or_wall_routes`,
  `usg_gate_b_floor_rows_do_not_override_exact_or_bound_floor_catalog_without_mapping_tolerance`,
  `usg_gate_b_steel_partition_rows_do_not_override_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`,
  `usg_gate_b_sheetrock_thermafiber_rc_channel_do_not_coalesce_with_generic_gypsum_rockwool_glass_fiber_or_resilient_bar`,
  `usg_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`,
  and
  `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`.
  The selected next file is
  `packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with `gate_c_closeout_and_next_slice_selection_no_runtime`.
  Validation completed: focused USG Gate B 1 file / 7 tests; continuity
  9 files / 61 tests; current gate engine 200 files / 1078 tests, web
  47 files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings; `apps/web/next-env.d.ts` restored to
  `.next-typecheck` after the build side-effect; whitespace guard passed
  through `pnpm calculator:gate:current`.
- **Prior urgent gate**:
  `packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts`
  lands USG Acoustical Assemblies source-pack extraction Gate A
  no-runtime. It extracts the same six SA200 rows from the official USG
  source
  `https://www.usg.com/content/dam/USG_Marketing_Communications/united_states/product_promotional_materials/finished_assets/acoustical-assemblies-en-SA200.pdf`,
  keeps `STC`, `IIC`, ranges, and test numbers source-context only, and
  selects
  `packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts`
  with `gate_b_mapping_tolerance_decision_no_runtime`. Gate A status:
  `usg_acoustical_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  Validation completed: focused USG Gate A 1 file / 6 tests; continuity
  8 files / 54 tests; current gate engine 199 files / 1071 tests, web
  47 files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings; `apps/web/next-env.d.ts` restored to
  `.next-typecheck` after the build side-effect; whitespace guard passed
  through `pnpm calculator:gate:current`.
- **Prior urgent gate**:
  `packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts`
  lands source-gap revalidation v10 no-runtime. It keeps ROCKWOOL
  Gate C closed, keeps the paused Uris 2006 lane on
  `paused_waiting_rights_safe_source_packet`, keeps the split-rockwool
  `Rw 41` `multileaf_screening_blend` answer low-confidence and not
  source-validated, keeps runtime frozen, and selects
  `packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts`
  with
  `selected_usg_acoustical_assemblies_source_pack_extraction_after_v10_rerank_found_official_floor_wall_stc_iic_rows_but_no_runtime_ready_import`.
  The selected action is
  `gate_a_extract_usg_acoustical_assemblies_rows_without_runtime_import`.
  Validation completed: focused v10 Gate A 1 file / 8 tests; continuity
  7 files / 48 tests; current gate engine 198 files / 1065 tests, web 47
  files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings; `apps/web/next-env.d.ts` restored to
  `.next-typecheck` after the build side-effect; `git diff --check`
  passed.
- **Prior urgent gate**:
  `packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  closes ROCKWOOL Acoustic Wall Assemblies source-pack extraction Gate C
  no-runtime. It keeps `ISS-00`, `ISS-22`, `ISS-39`, `IWS-04`, and
  `ESS-05` out of runtime import, keeps the split-rockwool `Rw 41`
  `multileaf_screening_blend` answer low-confidence and not
  source-validated, keeps runtime frozen, and selects
  `packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts`
  with
  `closed_rockwool_acoustic_wall_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v10_because_gate_b_found_no_runtime_ready_row`.
  The selected action is
  `gate_a_revalidate_source_accuracy_gap_order_after_rockwool_source_pack_closeout`.
  Validation completed: focused ROCKWOOL Gate C closeout 1 file / 6
  tests; ROCKWOOL Gate C / Gate B / Gate A / post-British-Gypsum
  acquisition / v9 / route-source-risk continuity 6 files / 40 tests;
  current gate engine 197 files / 1057 tests, web 47 files / 227 passed
  + 18 skipped, build 5 / 5 with known non-fatal `sharp/@img` warnings;
  `apps/web/next-env.d.ts` restored to `.next-typecheck` after the build
  side-effect, and `git diff --check` passed after docs-only
  validation-count updates.
- **Prior urgent gate**:
  `packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts`
  lands ROCKWOOL Acoustic Wall Assemblies source-pack extraction Gate B
  no-runtime. It keeps `ISS-00`, `ISS-22`, `ISS-39`, `IWS-04`, and
  `ESS-05` out of runtime import, blocks `STC` / `OITC` /
  report-number over-read into DynEcho outputs, keeps AFB /
  Comfortbatt / Cavityrock / local rockwool / glass-fiber coalescing
  blocked, protects Knauf LSF, `A046006`, NRC / Uris triple-leaf,
  floor, masonry, and lined-heavy boundaries, keeps runtime frozen, and
  selects
  `packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with `rockwool_gate_b_found_no_runtime_ready_row_selected_closeout`.
  The selected action is
  `gate_c_closeout_and_next_slice_selection_no_runtime`.
  Validation completed: focused ROCKWOOL Gate B 1 file / 8 tests;
  ROCKWOOL Gate B / Gate A / post-British-Gypsum acquisition / v9 /
  route-source-risk continuity 5 files / 34 tests; current gate engine
  196 files / 1051 tests, web 47 files / 227 passed + 18 skipped, build
  5 / 5 with known non-fatal `sharp/@img` warnings; `apps/web/next-env.d.ts`
  restored to `.next-typecheck` after the build side-effect, and
  `git diff --check` passed after docs-only validation-count updates.
- **Prior urgent gate**:
  `packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts`
  lands ROCKWOOL Acoustic Wall Assemblies source-pack extraction Gate A
  no-runtime. It extracts `ISS-00`, `ISS-22`, `ISS-39`, `IWS-04`, and
  `ESS-05`, keeps `STC` / `OITC` / report-number context out of DynEcho
  runtime metrics, protects the Uris 2006 split-rockwool `Rw 41`
  screening result, blocks AFB / Comfortbatt / Cavityrock / local
  rockwool / glass-fiber coalescing, keeps runtime frozen, and selects
  `packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts`
  with
  `rockwool_acoustic_wall_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`.
  The selected action is
  `gate_b_mapping_tolerance_decision_no_runtime`.
  Validation completed: focused ROCKWOOL Gate A 1 file / 6 tests;
  ROCKWOOL Gate A + post-BG continuity 7 files / 48 tests; current gate
  engine 195 files / 1043 tests, web 47 files / 227 passed + 18
  skipped, build 5 / 5 with known non-fatal `sharp/@img` warnings;
  `git diff --check` clean after restoring the build side-effect in
  `apps/web/next-env.d.ts`.
- **Prior urgent gate**:
  `packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts`
  lands post-British-Gypsum source acquisition Gate A no-runtime. It
  ranks the `ROCKWOOL Acoustic Wall Assemblies Catalog`, USG, National
  Gypsum, Georgia-Pacific, and prior mass-timber context locators, keeps
  runtime frozen, and selects
  `packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts`
  with
  `selected_rockwool_acoustic_wall_assemblies_source_pack_extraction_after_post_british_gypsum_acquisition_found_official_stone_wool_wall_rows_but_no_runtime_ready_import`.
  The selected action was
  `gate_a_extract_rockwool_acoustic_wall_assemblies_rows_without_runtime_import`.
- **Prior urgent gate**:
  `packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts`
  lands Gate A source-gap revalidation v9 no-runtime. It keeps the Uris
  2006 source lane paused, keeps British Gypsum and Knauf rows closed
  no-runtime, keeps runtime frozen, and selects
  `packages/engine/src/calculator-post-british-gypsum-source-acquisition-gate-a-contract.test.ts`
  with
  `selected_post_british_gypsum_source_acquisition_v1_after_v9_rerank_found_no_runtime_ready_candidate_and_british_gypsum_closed_no_runtime`.
  The selected action is
  `gate_a_acquire_and_classify_post_british_gypsum_source_locators_without_runtime_import`.
  Validation completed: focused v9 Gate A 1 file / 8 tests; v9 / Gate C
  / Gate B / v8 continuity 4 files / 30 tests; current-gate engine 192
  files / 1025 tests, web 47 files / 227 passed + 18 skipped, build
  5/5 with the known non-fatal `sharp/@img` warnings, whitespace guard
  clean.
- **Prior urgent gate**:
  `packages/engine/src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  lands Gate C closeout no-runtime. It closes
  `british_gypsum_white_book_source_pack_extraction_v1`, preserves the
  Gate B row boundaries, keeps runtime frozen, and selects
  `packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts`
  with
  `closed_british_gypsum_white_book_source_pack_no_runtime_and_selected_source_gap_revalidation_v9_because_gate_b_found_no_new_import_ready_row`.
  The selected action is
  `gate_a_revalidate_source_accuracy_gap_order_after_british_gypsum_source_pack_closeout`.
  Validation completed: focused Gate C 1 file / 6 tests; Gate C / Gate B
  / v8 continuity 3 files / 22 tests; current-gate engine 191 files /
  1017 tests, web 47 files / 227 passed + 18 skipped, build 5/5 with
  the known non-fatal `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`
  lands Gate B no-runtime mapping/tolerance decision. It keeps
  `C204006`, `C204003`, `A206A290`, `A326017B`, and `B226010` out of
  runtime import, keeps `A046006` as the already-landed exact timber
  anchor, keeps runtime frozen, and selects
  `packages/engine/src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  with
  `british_gypsum_gate_b_found_no_new_runtime_ready_row_kept_a046006_existing_anchor_and_selected_closeout`.
  The selected action is
  `gate_c_closeout_and_next_slice_selection_no_runtime`.
  Validation is green on 2026-05-02: focused Gate B 1 file / 8 tests; Gate B / Gate A
  / v8 continuity 3 files / 24 tests; current-gate engine 190 files /
  1011 tests, web 47 files / 227 passed + 18 skipped, build 5/5 with
  the known non-fatal `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts`
  lands Gate A no-runtime source-gap revalidation v8. It keeps the
  Uris 2006 lane paused on
  `paused_waiting_rights_safe_source_packet`, selects
  `british_gypsum_white_book_source_pack_extraction_v1`, keeps runtime
  frozen, and selects
  `packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`
  with
  `selected_british_gypsum_gate_b_mapping_tolerance_after_v8_rerank_paused_uris_2006_lane_and_found_official_rows_waiting_mapping`.
  The selected action is `gate_b_mapping_tolerance_decision_no_runtime`.
  Validation is green: focused v8 1 file / 8 tests; v8 / Gate T /
  British Gypsum Gate A engine continuity 3 files / 23 tests;
  current-gate engine 189 files / 1003 tests, web 47 files / 227
  passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts`
  lands Gate T no-runtime manual source-packet acquisition handoff. It
  formalizes `authorized_source_file_or_tdm_payload`,
  `rights_and_storage_note`, `source_identity_metadata`,
  `page_figure_table_locator`, `curve_identity_map`,
  `band_vector_or_digitization_payload`,
  `rating_derivation_and_uncertainty`, and
  `chain_of_custody_review`, pauses the Uris 2006 lane on
  `paused_waiting_rights_safe_source_packet`, keeps the split-rockwool
  grouped stack low-confidence `multileaf_screening_blend` (`Rw 41`),
  keeps runtime frozen, and selects
  `packages/engine/src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts`
  with
  `gate_t_paused_uris_2006_source_lane_no_runtime_selected_source_gap_revalidation_v8`.
  Validation is green: focused Gate T 1 file / 7 tests; Gate
  T/S/R/Q/P/O/N/M/K engine continuity 9 files / 63 tests; Gate J web
  continuity 1 file / 7 tests; current-gate engine 188 files / 995
  tests, web 47 files / 227 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-source-packet-availability-gate-s.test.ts`
  lands Gate S no-runtime source-packet availability checking. It
  confirms no rights-safe Uris 2006 packet is available now, keeps Uris
  2006 metadata as identity context only, keeps NRC 2024 graph data as
  an adjacent comparator, keeps user repro PDFs and unrelated local PDFs
  out of source evidence, keeps the split-rockwool grouped stack
  low-confidence `multileaf_screening_blend` (`Rw 41`), keeps runtime
  frozen, and selects
  `packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts`
  with
  `gate_s_confirmed_no_rights_safe_uris_2006_packet_no_runtime_selected_manual_source_packet_handoff_gate_t`.
  Validation is green: focused Gate S 1 file / 7 tests; Gate
  S/R/Q/P/O/N/M/K engine continuity 8 files / 56 tests; Gate J web
  continuity 1 file / 7 tests; current-gate engine 187 files / 988
  tests, web 47 files / 227 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-manual-source-packet-gate-r.test.ts`
  lands Gate R no-runtime manual source-packet intake. It formalizes
  the Uris 2006 packet artifact contract, records all seven artifacts
  as missing because no packet is provided now, keeps digitization,
  material mapping, and runtime import blocked, keeps the split-rockwool
  grouped stack low-confidence `multileaf_screening_blend` (`Rw 41`),
  keeps runtime frozen, and selects
  `packages/engine/src/wall-triple-leaf-source-packet-availability-gate-s.test.ts`
  with
  `gate_r_formalized_manual_source_packet_intake_no_runtime_selected_source_packet_availability_gate_s`.
  Validation is green: focused Gate R 1 file / 7 tests; Gate Q/P/O/N/M/K
  engine continuity 6 files / 42 tests; Gate J web continuity 1 file /
  7 tests; current-gate engine 186 files / 981 tests, web 47 files /
  227 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-source-access-followup-gate-q.test.ts`
  lands Gate Q no-runtime source-access backlog and runtime-blocker
  revalidation. It selects `uris_2006_authorized_curve_packet` as the
  first manual source packet, keeps `uris_2006_digitization_qc_packet`,
  `local_material_and_effect_mapping_packet`,
  `support_topology_mapping_packet`,
  `paired_visible_runtime_acceptance_packet`, and
  `uris_2008_perforated_facing_separate_lane` blocked from runtime,
  revalidates every Gate P blocker as still open, keeps the
  split-rockwool grouped stack low-confidence
  `multileaf_screening_blend` (`Rw 41`), keeps runtime frozen, and
  selects
  `packages/engine/src/wall-triple-leaf-manual-source-packet-gate-r.test.ts`
  with
  `gate_q_landed_source_access_backlog_and_blocker_revalidation_no_runtime_selected_manual_source_packet_gate_r`.
  Validation is green: focused Gate Q 1 file / 7 tests; Gate P/O/N/M/K
  engine continuity 5 files / 35 tests; Gate J web continuity 1 file /
  7 tests; current-gate engine 185 files / 974 tests, web 47 files /
  227 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-source-access-gate-p.test.ts`
  lands Gate P no-runtime source access / alternative measured-row
  acquisition. It keeps Uris 2006 as the primary source-access target,
  but blocks `authorized_elsevier_full_text_or_tdm`,
  `manual_author_or_library_source_packet`,
  `local_pdf_or_page_image_upload`, and
  `public_summary_and_metadata_recheck` because none provides
  source-owned one-third-octave curves/table data now. It classifies
  `uris_2008_perforated_absorptive_facing_accessible_adjacent` as an
  accessible adjacent negative boundary rather than a runtime row,
  keeps Utley/Brekke/Vinokur as method context, rejects Quirt/Tadeu
  glazing rows, keeps NRC 2024 as comparator only, keeps the
  split-rockwool grouped stack low-confidence
  `multileaf_screening_blend` (`Rw 41`), keeps runtime frozen, and
  selects
  `packages/engine/src/wall-triple-leaf-source-access-followup-gate-q.test.ts`
  with
  `gate_p_found_no_runtime_ready_access_or_equivalent_measured_row_no_runtime_selected_source_access_followup_gate_q`.
  Validation is green: focused Gate P 1 file / 7 tests; Gate O/N/M/L/K
  engine continuity 5 files / 35 tests; Gate J web continuity 1 file /
  7 tests; current-gate engine 184 files / 967 tests, web 47 files /
  227 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-source-locator-provenance-gate-o.test.ts`
  lands Gate O no-runtime full-curve retrieval and provenance QC. It
  verifies the Uris 2006 DOI/PII/pages/metadata locator and records
  access checks `sciencedirect_article_page_public_summary`,
  `doi_linkinghub_redirect`, `crossref_doi_metadata_and_elsevier_tdm_links`,
  and `sciencedirect_pdf_route_local_http_403`. None provides a
  runtime-ready source PDF/page image, plot axes, curve identity,
  one-third-octave band vector, or Rw/STC derivation owner. It rejects
  `fixed_weighted_index_penalty_not_curve`, keeps the split-rockwool
  grouped stack low-confidence `multileaf_screening_blend` (`Rw 41`),
  keeps runtime frozen, and selects
  `packages/engine/src/wall-triple-leaf-source-access-gate-p.test.ts`
  with
  `gate_o_verified_uris_locator_but_full_curves_not_runtime_ready_no_runtime_selected_source_access_gate_p`.
  Validation is green: focused Gate O 1 file / 7 tests; Gate N/M/L/K
  engine continuity 4 files / 28 tests; Gate J web continuity 1 file /
  7 tests; current-gate engine 183 files / 960 tests, web 47 files /
  227 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-source-locator-intake-gate-n.test.ts`
  lands Gate N no-runtime source locator intake. It selects
  `uris_2006_internal_gypsum_50mm_mineral_wool_double_frame` as the
  primary Gate O retrieval target, keeps
  `nrc_2024_internal_board_glass_fiber_92mm_source_family` as an
  adjacent comparator, keeps `uris_1999_rockwool_bulk_density_double_wall`
  and `wang_2022_lightweight_double_leaf_stone_wool_glass_wool` as
  equivalence context only, rejects
  `nrc_1998_gypsum_board_walls_baseline_numeric_rows` from this lane,
  keeps the split-rockwool grouped stack low-confidence
  `multileaf_screening_blend` (`Rw 41`), keeps runtime frozen, and
  selects
  `packages/engine/src/wall-triple-leaf-source-locator-provenance-gate-o.test.ts`
  with
  `gate_n_classified_rockwool_two_cavity_source_locators_no_runtime_selected_full_curve_retrieval_and_provenance_gate_o`.
  Validation is green: focused Gate N 1 file / 7 tests; Gate M/L/K
  engine continuity 3 files / 21 tests; Gate J web continuity 1 file /
  7 tests; current-gate engine 182 files / 953 tests, web 47 files /
  227 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts`
  lands Gate M no-runtime source evidence acquisition. It selects
  `rockwool_two_cavity_band_curve_source_pack` as the first evidence
  path because it covers both
  `rockwool_absorber_equivalence_or_measured_row` and
  `local_50mm_rockwool_cavity_source_row`, keeps Type C board mapping,
  support topology, MLV, and gypsum plaster as follow-on blockers,
  keeps the split-rockwool grouped stack low-confidence
  `multileaf_screening_blend` (`Rw 41`), keeps runtime frozen, and
  selects
  `packages/engine/src/wall-triple-leaf-source-locator-intake-gate-n.test.ts`
  with
  `gate_m_selected_rockwool_two_cavity_source_evidence_first_no_runtime_selected_source_locator_intake_gate_n`.
  Validation is green: focused Gate M 1 file / 7 tests; Gate L and
  Gate K engine continuity 2 files / 14 tests; Gate J web continuity 1
  file / 7 tests; engine lint; current-gate engine 181 files / 946
  tests, web 47 files / 227 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-source-gap-closure-gate-l.test.ts`
  lands Gate L no-runtime source-gap closure. It keeps all six Gate K
  closure tracks open with explicit statuses, refuses to treat adjacent
  NRC Type C board / glass-fiber batt / 92.1 mm cavity / double-stud
  support references as local runtime evidence, keeps the split-rockwool
  grouped stack low-confidence `multileaf_screening_blend` (`Rw 41`),
  keeps runtime frozen, and selects
  `packages/engine/src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts`
  with
  `gate_l_confirmed_source_gaps_remain_open_no_runtime_selected_source_evidence_acquisition_gate_m`.
  Validation is green: focused Gate L 1 file / 7 tests; engine lint;
  current-gate engine 180 files / 939 tests, web 47 files / 227 passed
  + 18 skipped, build 5/5 with the known non-fatal `sharp/@img`
  warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts`
  lands Gate K no-runtime runtime-promotion readiness. It passes the
  source-family curves, calibration/holdout, negative boundaries,
  complete grouped topology, and Gate J acceptance prerequisites, but
  keeps runtime promotion blocked on local material mapping, usable
  local source pack, source-gap closure, runtime-ready topology guards,
  and paired engine/web visible runtime tests. It keeps the
  split-rockwool grouped stack low-confidence
  `multileaf_screening_blend` (`Rw 41`), converts the open Gate G8
  source gaps into the selected Gate L closure plan, keeps runtime
  frozen, and selects
  `packages/engine/src/wall-triple-leaf-source-gap-closure-gate-l.test.ts`
  with
  `gate_k_blocked_runtime_promotion_no_runtime_selected_source_gap_closure_gate_l`.
  Focused validation is green: Gate K 1 file / 7 tests; engine lint;
  Gate J web handoff continuity 1 file / 7 tests;
  `pnpm calculator:gate:current` engine 179 files / 932 tests, web 47
  files / 227 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `apps/web/features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts`
  lands Gate J no-runtime company-internal acceptance rehearsal. It
  pins the adjacent-rockwool user stack as the current double-leaf
  control (`Rw 50`) and the split-rockwool grouped stack as still
  low-confidence `multileaf_screening_blend` (`Rw 41`), verifies
  missing vs complete topology route-card visibility, checks field
  `R'w 34` and `DnT,w 36` with report caveats, separates exact source
  controls from near-source local substitutions, protects double-leaf /
  lined-masonry / one-side-lining negatives, keeps many-layer reorder
  inputs finite and card-renderable, keeps runtime frozen, and selects
  `packages/engine/src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts`
  with
  `gate_j_landed_company_internal_acceptance_rehearsal_no_runtime_selected_runtime_promotion_readiness_gate_k`.
  Focused validation is green: Gate J 1 file / 7 tests; web typecheck;
  web lint; `pnpm calculator:gate:current` engine 178 files / 925
  tests, web 47 files / 227 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `apps/web/features/workbench/wall-triple-leaf-grouped-topology-route-card.test.ts`
  lands Gate I no-runtime web-visible grouped topology inputs. It
  creates
  `apps/web/features/workbench/simple-workbench-wall-topology.ts`,
  plumbs grouped wall topology through workbench snapshots and
  `AirborneContext.wallTopology`, adds grouped topology controls and a
  route-card topology gap for missing roles vs source-validation
  blocked complete topology, keeps `Rw 41` visibly caveated as
  screening, keeps runtime frozen, and selects
  `apps/web/features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts`
  with
  `gate_i_landed_web_visible_grouped_topology_inputs_no_runtime_selected_company_internal_acceptance_rehearsal_gate_j`.
  Focused validation is green: Gate I 1 file / 4 tests; Gate I plus
  server-project snapshot persistence 2 files / 8 tests; web typecheck;
  web lint; `pnpm calculator:gate:current` engine 178 files / 925
  tests, web 46 files / 220 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-engine-integration-fail-closed-gate-h.test.ts`
  lands Gate H no-runtime engine-integration fail-closed prerequisite
  checking. It creates
  `packages/engine/src/wall-triple-leaf-engine-integration-fail-closed.ts`,
  keeps `Rw 41` visibly caveated as screening, passes source-family
  curves / calibration / negative-boundary / complete grouped test
  topology, blocks local material mapping, usable local source pack,
  source-gap closure, runtime-ready topology guards, and paired
  engine/web-visible runtime tests, keeps runtime frozen, and selects
  `apps/web/features/workbench/wall-triple-leaf-grouped-topology-route-card.test.ts`
  with
  `gate_h_landed_engine_integration_fail_closed_prerequisite_check_no_runtime_selected_web_visible_grouped_topology_inputs_gate_i`.
  Validation is green: focused Gate H 1 file / 7 tests; Gate C + Gate
  D + Gate E + Gate F + Gate G + Gate G2 + Gate G2B + Gate G3 + Gate G4
  + Gate G5 + Gate G6 + Gate G7 + Gate G8 + Gate G9 + Gate H
  continuity 15 files / 100 tests; engine lint; `pnpm
  calculator:gate:current` engine 178 files / 925 tests, web 45 files /
  216 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-visible-diagnostics-and-topology-guard-gate-g9.test.ts`
  lands Gate G9 no-runtime visible diagnostics and grouped topology
  guard ownership. It creates
  `packages/engine/src/wall-triple-leaf-visible-diagnostics-and-topology-guard.ts`,
  keeps `Rw 41` visibly caveated as screening, records visible
  diagnostic ids for source gaps, rockwool-like route flips, duplicate
  stack edits, and missing paired tests, owns grouped topology guards,
  keeps runtime/web-visible runtime tests frozen, and selects
  `packages/engine/src/wall-triple-leaf-engine-integration-fail-closed-gate-h.test.ts`
  with
  `gate_g9_landed_visible_diagnostics_and_grouped_topology_guard_no_runtime_selected_engine_integration_fail_closed_gate_h`.
  Validation is green: focused Gate G9 1 file / 7 tests; Gate C + Gate
  D + Gate E + Gate F + Gate G + Gate G2 + Gate G2B + Gate G3 + Gate G4
  + Gate G5 + Gate G6 + Gate G7 + Gate G8 + Gate G9 continuity 14
  files / 93 tests; engine lint; `pnpm calculator:gate:current` engine
  177 files / 918 tests, web 45 files / 216 passed + 18 skipped, build
  5/5 with the known non-fatal `sharp/@img` warnings, whitespace guard
  clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-source-gap-and-order-risk-gate-g8.test.ts`
  lands Gate G8 no-runtime source-gap and order-risk register. It
  creates
  `packages/engine/src/wall-triple-leaf-source-gap-and-order-risk.ts`,
  keeps `Rw 41` visibly caveated as screening, classifies local Type C
  board, rockwool/mineral-wool absorber, local 50 mm cavities, MLV,
  gypsum plaster, and support gauge/depth/spacing into source
  acquisition / bounded effect-model / topology-input-owner gaps,
  selects `triple_leaf_double_leaf_route_flip` and
  `duplicate_stack_family_flip` for Gate G9 visible topology guard
  work, keeps runtime frozen, and selects
  `packages/engine/src/wall-triple-leaf-visible-diagnostics-and-topology-guard-gate-g9.test.ts`
  with
  `gate_g8_landed_source_gap_and_order_risk_register_no_runtime_selected_visible_diagnostics_and_topology_guard_gate_g9`.
  Validation is green: focused Gate G8 1 file / 7 tests; Gate C + Gate
  D + Gate E + Gate F + Gate G + Gate G2 + Gate G2B + Gate G3 + Gate G4
  + Gate G5 + Gate G6 + Gate G7 + Gate G8 continuity 13 files / 86
  tests; engine lint; `pnpm calculator:gate:current` engine 176 files /
  911 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-local-source-pack-acquisition-gate-g7.test.ts`
  lands Gate G7 no-runtime local source-pack intake and order-risk
  register. It creates
  `packages/engine/src/wall-triple-leaf-local-source-pack-acquisition.ts`,
  keeps `Rw 41` visibly caveated as screening, records that local Type C
  board, rockwool/mineral-wool absorber, local 50 mm cavities, MLV,
  gypsum plaster, and support gauge/depth/spacing still lack runtime
  evidence, pins sibling risk ids `triple_leaf_double_leaf_route_flip`,
  `heavy_multileaf_lined_massive_boundary_flip`,
  `masonry_lined_massive_swap_flip`, `duplicate_stack_family_flip`, and
  `raw_floor_order_role_inference_sensitivity`, keeps runtime frozen,
  and selects
  `packages/engine/src/wall-triple-leaf-source-gap-and-order-risk-gate-g8.test.ts`
  with
  `gate_g7_landed_local_source_pack_intake_no_runtime_selected_source_gap_and_order_risk_register_gate_g8`.
  Validation is green: focused Gate G7 1 file / 7 tests; Gate C + Gate
  D + Gate E + Gate F + Gate G + Gate G2 + Gate G2B + Gate G3 + Gate G4
  + Gate G5 + Gate G6 + Gate G7 continuity 12 files / 79 tests; engine
  lint; `pnpm calculator:gate:current` engine 175 files / 904 tests,
  web 45 files / 216 passed + 18 skipped, build 5/5 with the known
  non-fatal `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-local-source-acquisition-gate-g6.test.ts`
  lands Gate G6 no-runtime local source acquisition and bounded
  effect-model requirements. It creates
  `packages/engine/src/wall-triple-leaf-local-source-acquisition.ts`,
  keeps `Rw 41` visibly caveated as screening, requires local Type C
  board mapping, direct measured/digitized rows for rockwool absorber
  and local 50 mm cavities, bounded effect models for MLV and gypsum
  plaster, and exact support gauge/depth/spacing input mapping, keeps
  runtime frozen, and selects
  `packages/engine/src/wall-triple-leaf-local-source-pack-acquisition-gate-g7.test.ts`
  with
  `gate_g6_landed_local_source_and_effect_model_requirements_no_runtime_selected_source_pack_acquisition_gate_g7`.
  Validation is green: focused Gate G6 1 file / 6 tests; Gate C + Gate
  D + Gate E + Gate F + Gate G + Gate G2 + Gate G2B + Gate G3 + Gate G4
  + Gate G5 + Gate G6 continuity 11 files / 72 tests; engine lint;
  `pnpm calculator:gate:current` engine 174 files / 897 tests, web 45
  files / 216 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-blocked-diagnostics-gate-g5.test.ts`
  lands Gate G5 no-runtime blocked diagnostics and source-acquisition
  decision. It creates
  `packages/engine/src/wall-triple-leaf-blocked-diagnostics.ts`, keeps
  `Rw 41` visibly caveated as screening, maps Gate G4 blockers to
  user/developer diagnostics, ranks Gate G6 acquisition targets, keeps
  runtime frozen, and selects
  `packages/engine/src/wall-triple-leaf-local-source-acquisition-gate-g6.test.ts`
  with
  `gate_g5_landed_blocked_diagnostics_no_runtime_selected_local_source_acquisition_gate_g6`.
  Validation is green: focused Gate G5 1 file / 6 tests; Gate C + Gate
  D + Gate E + Gate F + Gate G + Gate G2 + Gate G2B + Gate G3 + Gate G4
  + Gate G5 continuity 10 files / 66 tests; engine lint; `pnpm
  calculator:gate:current` engine 173 files / 891 tests, web 45 files /
  216 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts`
  lands Gate G4 no-runtime local material mapping and runtime
  eligibility. It creates
  `packages/engine/src/wall-triple-leaf-local-material-mapping.ts`,
  proves the Gate G3 source-family calibration still passes, blocks
  local generic gypsum board, rockwool, MLV, gypsum plaster, 50 mm
  cavities, and generic support topology from exact NRC-like runtime,
  keeps runtime frozen, and selects
  `packages/engine/src/wall-triple-leaf-blocked-diagnostics-gate-g5.test.ts`
  with
  `gate_g4_blocked_local_material_and_topology_mapping_no_runtime_selected_blocked_diagnostics_and_source_acquisition_gate_g5`.
  Validation is green: focused Gate G4 1 file / 6 tests; Gate C + Gate
  D + Gate E + Gate F + Gate G + Gate G2 + Gate G2B + Gate G3 + Gate G4
  continuity 9 files / 60 tests; engine lint; `pnpm
  calculator:gate:current` engine 172 files / 885 tests, web 45 files /
  216 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-calibration-fit-gate-g3.test.ts`
  lands Gate G3 no-runtime source-family calibration fit and
  negative-boundary proof. It creates
  `packages/engine/src/wall-triple-leaf-calibration-fit.ts`, fits a
  low-dimensional NRC-like source-family model from the QC-passed
  curves, predicts calibration rows A/B and holdout row D against Gate
  G tolerance, keeps Assembly C as separate fill-regime context,
  protects ordinary double-leaf / simple stud / lined masonry / missing
  curve / floor-impact / field-only negatives, keeps runtime frozen,
  and selects
  `packages/engine/src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts`
  with
  `gate_g3_passed_nrc_2024_source_family_calibration_holdout_and_negative_boundaries_no_runtime_selected_local_mapping_gate_g4`.
  Validation is green: focused Gate G3 1 file / 8 tests; Gate C + Gate
  D + Gate E + Gate F + Gate G + Gate G2 + Gate G2B + Gate G3
  continuity 8 files / 54 tests; engine lint; `pnpm
  calculator:gate:current` engine 171 files / 879 tests, web 45 files /
  216 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-source-curve-digitization-qc.test.ts`
  lands Gate G2B no-runtime reproducible digitization QC. It creates
  `packages/engine/src/wall-triple-leaf-source-curve-digitization-qc.ts`,
  locks the NRC 2024 Figure 4 / Figure 5 render provenance and plot
  boxes, digitizes Type C plus assemblies A-D into 50..5000 Hz
  one-third-octave TL vectors, computes derived STC/Rw as 64/63,
  64/58, 60/49, 57/51, and 65/55, cross-checks Figure 5 deltas against
  `assemblyTL - baseTL`, keeps runtime frozen, and selects
  `packages/engine/src/wall-triple-leaf-calibration-fit-gate-g3.test.ts`
  with
  `gate_g2b_landed_reproducible_curve_digitization_qc_no_runtime_and_selected_calibration_fit_gate_g3`.
  Validation is green: focused Gate G2B 1 file / 8 tests; Gate C +
  Gate D + Gate E + Gate F + Gate G + Gate G2 + Gate G2B continuity
  7 files / 46 tests; engine lint; `pnpm calculator:gate:current`
  engine 170 files / 871 tests, web 45 files / 216 passed + 18 skipped,
  build 5/5 with the known non-fatal `sharp/@img` warnings, whitespace
  guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-source-curve-digitization-intake.test.ts`
  lands Gate G2 no-runtime source-curve digitization intake. It creates
  `packages/engine/src/wall-triple-leaf-source-curve-digitization-intake.ts`,
  pins the NRC 2024 Type C base wall and assemblies A-D as immutable
  graph rows, records reported STC values 64 / 64 / 60 / 57 / 65,
  preserves Figure 4 absolute-curve and Figure 5 delta-cross-check
  ownership, keeps `transmissionLossDb`, `derivedRw`, and
  `digitizationUncertaintyDb` null until reproducible QC exists, and
  selects
  `packages/engine/src/wall-triple-leaf-source-curve-digitization-qc.test.ts`
  with
  `gate_g2_landed_source_curve_digitization_intake_no_runtime_and_selected_reproducible_digitization_qc`.
  The live dynamic calculator still returns the user split-rockwool
  repro as low-confidence `multileaf_screening_blend` `Rw 41`.
  Validation is green: focused Gate G2 1 file / 7 tests; Gate C +
  Gate D + Gate E + Gate F + Gate G + Gate G2 continuity 6 files / 38
  tests; engine lint; `pnpm calculator:gate:current` engine 169 files /
  863 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with the
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-calibration-regime.test.ts`
  lands Gate G no-runtime calibration / holdout tolerance. It creates
  `packages/engine/src/wall-triple-leaf-calibration-regime.ts`, sets
  the calibration gate to at least two source-owned calibration rows,
  at least one source-owned holdout row, MAE <= 2 dB, max error <= 4
  dB, and dip-band placement within one neighboring one-third-octave
  band. Because the current corpus has no digitized triple-leaf source
  rows or source-owned holdouts, it selects
  `packages/engine/src/wall-triple-leaf-source-curve-digitization-intake.test.ts`
  with
  `gate_g_defined_calibration_holdout_regime_no_runtime_and_selected_source_curve_digitization_intake`.
  The live dynamic calculator still returns the user split-rockwool
  repro as low-confidence `multileaf_screening_blend` `Rw 41`.
  Validation is green: focused Gate G 1 file / 6 tests; Gate C + Gate D
  + Gate E + Gate F + Gate G continuity 5 files / 31 tests; engine
  lint; `pnpm calculator:gate:current` engine 168 files / 856 tests,
  web 45 files / 216 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings, whitespace guard clean.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-frequency-solver.test.ts`
  lands Gate F no-runtime frequency-band solver skeleton. It creates
  `packages/engine/src/wall-triple-leaf-frequency-solver.ts`, derives
  leaf masses from explicit Side A / internal / Side B groups, models
  two cavity spring resonances and an interacting resonance pair, makes
  fill damping plus coupling/support penalties explicit, returns
  one-third-octave TL curves, computes ISO 717 ratings through existing
  curve helpers, and selects
  `packages/engine/src/wall-triple-leaf-calibration-regime.test.ts`
  with
  `gate_f_landed_frequency_band_solver_skeleton_no_runtime_and_selected_calibration_holdout_gate_g`.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-source-corpus-contract.test.ts`
  lands Gate E no-runtime source-corpus classification. It creates
  `packages/engine/src/wall-triple-leaf-source-corpus.ts`, admits only
  NRC 2024 internal-leaf / two-cavity graph evidence to the non-runtime
  calibration intake lane, rejects ordinary double-leaf, simple stud,
  lined masonry / one-side lining, missing-curve/topology, floor/impact,
  and field-only negatives from exact triple-leaf evidence, and selects
  `packages/engine/src/wall-triple-leaf-frequency-solver.test.ts` with
  `gate_e_classified_triple_leaf_source_corpus_no_runtime_and_selected_frequency_band_solver_gate_f`.
  Validation is green: focused Gate D + Gate E 2 files / 12 tests; Gate
  C + Gate D + Gate E continuity 3 files / 17 tests; engine lint;
  `pnpm calculator:gate:current` engine 166 files / 842 tests, web 45
  files / 216 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts`
  lands Gate D no-runtime source-pack extraction. It creates
  `packages/engine/src/wall-triple-leaf-source-pack.ts`, pins five
  source lanes (`P0` NRC 2024 graph candidate, `P0` NRC 1998
  parser-ready baseline / negative boundary, `P1` Uris 2006 qualitative
  candidate, `P1` Ballagh solver model only, `P2` Warnock/NRC lined
  masonry boundary), keeps all candidates `directRuntimeReadyNow:
  false`, and selects
  `packages/engine/src/wall-triple-leaf-source-corpus-contract.test.ts`
  with
  `gate_d_extracted_triple_leaf_source_pack_no_runtime_and_selected_source_corpus_classifier_gate_e`.
  Validation is green: focused Gate D 1 file / 6 tests; Gate C + Gate D
  continuity 2 files / 11 tests; engine lint; `pnpm calculator:gate:current`
  engine 165 files / 836 tests, web 45 files / 216 passed + 18 skipped,
  build 5/5 with known non-fatal `sharp/@img` warnings.
- **Prior urgent gate**:
  `packages/engine/src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts`
  lands research and plan only. It pins NRC / Ballagh / ISO source
  locators, now also pins Uris 2006 and Warnock / NRC concrete-block
  drywall as measured candidate / adjacent-boundary sources, blocks
  immediate numeric movement, and selects
  `packages/engine/src/wall-triple-leaf-source-pack-extraction-gate-d-contract.test.ts`
  with
  `gate_c_researched_triple_leaf_physics_and_selected_source_pack_extraction_before_any_numeric_promotion`.
  Validation is green after the second source-readiness iteration:
  focused Gate C 1 file / 5 tests; `pnpm calculator:gate:current`
  engine 164 files / 830 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings, and
  `git diff --check` clean.
- **Just landed active-slice gate**:
  `packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts`
  lands `british_gypsum_white_book_source_pack_extraction_v1` Gate A
  no-runtime. It extracts `C204006` / `C204003` GypFloor Silent,
  `A206A290` GypWall Single Frame, `A046006` timber stud,
  `A326017B` GypWall Twin Frame Audio, and `B226010` GypLyner Single.
  `A046006` is already landed as
  `british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026`;
  no duplicate import is selected. `C204006`, `C204003`, `A206A290`,
  `A326017B`, and `B226010` still need live topology, material,
  metric, tolerance, negative-boundary, and paired visible-test
  ownership, so Gate A selects
  `packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts`
  with `gate_b_mapping_tolerance_decision_no_runtime`.
  Status:
  `british_gypsum_rows_extracted_no_new_runtime_import_a046006_already_landed_others_need_mapping_tolerance_visible_tests`.
- **Prior active-slice gate**:
  `packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts`
  lands `calculator_post_knauf_source_acquisition_v1` no-runtime. It
  acquired fresh official British Gypsum White Book and Stora Enso CLT
  source locators. British Gypsum outranks the rest for no-runtime
  extraction because it gives concrete wall and floor row locators:
  GypFloor Silent `C204006` / `C204003`, GypWall Single Frame
  `A206A290`, timber stud `A046006`, GypWall Twin Frame Audio
  `A326017B`, and GypLyner Single `B226010`. Runtime remains blocked
  until exact live topology, local material mapping, metric policy,
  tolerance owner, protected negative boundaries, and paired engine/web
  visible tests are extracted. It selects
  `packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts`.
  Gate A selection status:
  `selected_british_gypsum_white_book_source_pack_extraction_after_post_knauf_acquisition_found_official_wall_floor_rows_but_no_runtime_ready_import`.
- **Prior active-slice gate**:
  `packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts`
  lands `calculator_source_gap_revalidation_v7` no-runtime. It re-ranks
  the post-Knauf source/accuracy backlog after `TB.5A`, `MWI.2A`,
  `TTF30.2A`, and `EN-PC-50-055-6-2-12.5-WB-25` all closed
  no-runtime. It finds no source-ready runtime pack and selects
  post-Knauf source acquisition because the current Knauf and non-Knauf
  source reservoirs are exhausted for runtime movement.
  Gate A selection status:
  `selected_post_knauf_source_acquisition_v1_after_v7_rerank_found_no_runtime_ready_candidate_and_current_sources_exhausted`.
- **Prior active-slice gate**:
  `packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
  closes `EN-PC-50-055-6-2-12.5-WB-25` no-runtime. EN-PC stays source
  context only because Wallboard, 25 mm Acoustic Roll, 50 mm / 0.55
  gauge stud detail, field-output policy, spectrum-term policy,
  tolerance ownership, and paired visible tests remain incomplete.
  Since `TB.5A`, `MWI.2A`, `TTF30.2A`, and EN-PC have all closed
  no-runtime, it selects
  `packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts`.
  Gate C selection status:
  `closed_enpc_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v7_because_all_concrete_knauf_mapping_rows_lack_exact_material_metric_tolerance_ownership`.
- **Prior active-slice gate**:
  `packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts`
  lands `EN-PC-50-055-6-2-12.5-WB-25` Gate A no-runtime. It pins the
  Knauf UK steel-stud lab `Rw 49` row as source context only, compares
  it against the live `wall-lsf-knauf` exact anchor
  `knauf_lab_416889_primary_2026` (`Rw 55`), and keeps runtime blocked
  because Wallboard, 25 mm Acoustic Roll, 50 mm / 0.55 gauge stud
  details, field-output policy, spectrum-term policy, tolerance owner,
  and paired visible tests are incomplete. It selects
  `packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
  with `gate_c_no_runtime_closeout_and_next_slice_selection`.
  Gate A selection status:
  `gate_a_landed_enpc_steel_stud_mapping_tolerance_no_runtime_because_wallboard_acoustic_roll_stud_gauge_field_metric_and_tolerance_ownership_remain_incomplete`.
- **Prior active-slice gate**:
  `packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts`
  lands v6 Gate A no-runtime. It re-ranks the post-Knauf mapping chain,
  keeps `TB.5A`, `MWI.2A`, and `TTF30.2A` blocked from runtime import,
  and selects `steel_stud_knauf_enpc_mapping_tolerance_v1` with
  `packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts`.
  `EN-PC-50-055-6-2-12.5-WB-25` is a concrete Knauf UK steel-stud lab
  `Rw` row, but runtime remains blocked until Wallboard / Acoustic
  Roll mapping, stud-gauge equivalence, lab/field policy, tolerance
  owner, existing steel-anchor precedence, and paired visible tests are
  complete. Gate A selection status:
  `selected_no_runtime_knauf_enpc_steel_stud_mapping_tolerance_after_v6_rerank_found_no_runtime_ready_candidate`.
- **Prior active-slice gate**:
  `packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
  closes `TTF30.2A` no-runtime. `TTF30.2A` stays context only because
  exact 70 / 90 mm column selection, `FIBEROCK AQUA-TOUGH`, side
  asymmetry, twin-frame gap/coupling, glasswool placement, field-output
  policy, and tolerance ownership remain incomplete. It selects
  `calculator_source_gap_revalidation_v6` with
  `packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts`.
  Gate C selection status:
  `closed_ttf302a_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v6_because_knauf_tb5a_mwi2a_ttf302a_all_lack_exact_material_metric_tolerance_ownership`.
- **Prior active-slice gate**:
  `packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts`
  lands `TTF30.2A` Gate A no-runtime. `TTF30.2A` stays context only
  because exact column selection, `FIBEROCK AQUA-TOUGH` mapping,
  twin-frame 20 mm gap/coupling model, glasswool placement, field
  output policy, and tolerance ownership remain incomplete. It selects
  `gate_c_no_runtime_closeout_and_next_slice_selection` with
  `packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`.
  Gate A selection status:
  `gate_a_landed_ttf302a_twin_timber_mapping_tolerance_no_runtime_because_exact_column_material_metric_and_tolerance_ownership_remain_incomplete`.
- **Prior active-slice gate**:
  `packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
  closes `MWI.2A` no-runtime. `MWI.2A` stays context only because
  substrate mass, furring/coupling model, `SHEETROCK ONE` mapping,
  `KI 25G24` / `KI 50G11` mapping, field-output policy, and tolerance
  ownership remain incomplete. It selects
  `twin_timber_knauf_ttf302a_mapping_tolerance_v1`.
  Prior Gate C selection status:
  `closed_mwi2a_mapping_tolerance_no_runtime_and_selected_knauf_ttf302a_twin_timber_mapping_tolerance_because_mwi2a_lacks_exact_material_metric_tolerance_ownership`.
- **Next active-slice gate**:
  `packages/engine/src/calculator-post-knauf-source-acquisition-gate-a-contract.test.ts`
  should acquire and classify fresh official source locators for the
  highest-value floor and wall gaps. Runtime work is allowed only if
  exact topology, metric owner, tolerance owner, local material mapping,
  protected negative boundaries, and paired engine/web visible tests are
  all named. Without those prerequisites it must select source
  extraction, mapping, validation, or another acquisition pass
  no-runtime.
- **Prior active-slice gate**:
  `packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts`
  maps `MWI.2A` as context only. Source ratings span `Rw 52-61` and
  `Rw+Ctr 44-51` across concrete panel and core-filled block variants.
  Runtime stays blocked because the live route does not exact-match
  `1x13 mm SHEETROCK ONE` each side, substrate mass, side-2 furring /
  clip coupling, `KI 25G24` / `KI 50G11`, field-output policy, or a
  tolerance owner. It selected:
  `gate_c_no_runtime_closeout_and_next_slice_selection`.
- **Prior active-slice closeout**:
  `packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`
  closes `TB.5A` no-runtime. `TB.5A` stays context only because exact
  stud-depth column selection, `SHEETROCK ONE` mapping, `KI 75G11`
  mapping, field-output policy, and tolerance ownership remain missing.
  It selects `lined_masonry_knauf_mwi2a_mapping_tolerance_v1` with
  `packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts`.
  Gate C selection status:
  `closed_tb5a_mapping_tolerance_no_runtime_and_selected_knauf_mwi2a_lined_masonry_mapping_tolerance_because_tb5a_lacks_exact_material_metric_tolerance_ownership`.
- **Prior active-slice gate**:
  `packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts`
  maps `TB.5A` as context only. The 70 mm / 122 mm column gives
  `Rw 46 (Rw+Ctr 39)` for `KI 75G11`; the 90 mm / 142 mm column gives
  `Rw 47 (Rw+Ctr 40)`. Runtime stays blocked because the live route
  does not exact-match `2x13 mm SHEETROCK ONE`, `KI 75G11`, or a
  selected stud-depth column, and no field-output or tolerance owner is
  named. Next action:
  `gate_c_no_runtime_closeout_and_next_slice_selection`.
- **Prior active-slice selection gate**:
  `packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`
  re-ranks source/accuracy candidates after Knauf Gate C, keeps every
  runtime and visible surface frozen, and selects
  `timber_double_board_knauf_tb5a_mapping_tolerance_v1` with
  `packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts`.
  Gate A selection status:
  `selected_no_runtime_knauf_tb5a_timber_double_board_mapping_tolerance_after_v5_rerank_found_no_runtime_ready_candidate`.
- **Just closed active-slice gate**:
  `packages/engine/src/post-knauf-wall-systems-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  closes Knauf source-pack extraction no-runtime and selects
  `calculator_source_gap_revalidation_v5` with
  `packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`.
  Gate C selection status:
  `closed_knauf_wall_systems_source_pack_no_runtime_and_selected_source_gap_revalidation_v5_because_gate_b_found_no_import_ready_row`.
- **Just landed active-slice gate**:
  `packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts`
  compared the Gate A rows against implementation and selected Gate C
  closeout no-runtime. `EN-PC-50-055-6-2-12.5-WB-25`, `TB.5A`,
  `TTF30.2A`, and `MWI.2A` remain blocked; `TO120.1A` remains a
  one-side-lined negative boundary; `TSF120.1A` and `AAC.1A` remain
  adjacent context. Gate B status:
  `no_knauf_locator_row_has_complete_topology_metric_tolerance_and_visible_test_ownership`.
- **Prior active-slice gate**:
  `packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts`
  extracted Knauf UK/AU source table locators no-runtime. UK steel stud
  `EN-PC-50-055-6-2-12.5-WB-25`, AU timber `TB.5A`, AU twin timber
  `TTF30.2A`, and AU masonry `MWI.2A` are Gate B
  mapping/tolerance candidates only. `TO120.1A` is a one-side-lined
  timber negative boundary; `TSF120.1A` and `AAC.1A` are adjacent
  context.
- **Prior active-slice gate**:
  `packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts`
  re-ranks source/accuracy candidates no-runtime, confirms no runtime
  source pack is ready, and selects
  `knauf_wall_systems_source_pack_extraction_v1` with
  `packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts`
  as the next first-gate file.
- **Just closed active-slice gate**:
  `packages/engine/src/post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts`
  closes the topology-delta slice no-runtime, keeps the live generated
  floor fallback low-confidence/screening, skips Gate B, and selects
  `calculator_source_gap_revalidation_v4`.
- **Just landed active-slice gate**:
  `packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts`
  lands the no-runtime topology-delta matrix for generated floor
  fallback. The live fallback stayed low-confidence; Pliteq exact and
  UBIQ FL-32 bound precedence stayed source-topology gated; unsupported
  output and split-variant boundaries stayed explicit. Gate B is skipped
  because no runtime candidate is source-ready.
- **Just closed active-slice selection gate**:
  `packages/engine/src/post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts`
  closes source-intake backlog cleanup no-runtime, keeps every backlog
  family `runtimeImportReadyNow: false`, and selects
  `generated_floor_fallback_topology_delta_v1`.
- **Just landed source-intake backlog gate**:
  `packages/engine/src/calculator-source-intake-backlog-cleanup-gate-a-contract.test.ts`
  lands the no-runtime source-ready intake backlog:
  [SOURCE_READY_INTAKE_BACKLOG.md](./SOURCE_READY_INTAKE_BACKLOG.md).
  It consolidates CLT / mass-timber wall, timber double-board stud
  wall, no-stud double-leaf wall, generated floor fallback,
  lined-massive / heavy-core wall, and historical blocked families into
  one prerequisite matrix. All source locators remain context only; no
  runtime import, confidence/support promotion, or visible card/report
  movement is selected.
- **Just closed prior active-slice gate**:
  `packages/engine/src/post-internal-use-pilot-handoff-v1-next-slice-selection-contract.test.ts`
  closes the pilot handoff no-runtime, keeps the handoff as
  controlled-use evidence rather than promotion permission, preserves
  `runtime/support/confidence/evidence/API/route-card/output-card` and
  `proposal/report/workbench-input` behavior, and selects
  `calculator_source_intake_backlog_cleanup_v1`.
- **Just landed pilot handoff gate**:
  `packages/engine/src/internal-use-pilot-handoff-v1-gate-a-contract.test.ts`
  lands the no-runtime company-internal pilot handoff pack:
  [INTERNAL_USE_PILOT_HANDOFF.md](./INTERNAL_USE_PILOT_HANDOFF.md).
  It ties the ready, caveated, blocked, and hostile/edge lanes to
  operator steps, validation evidence, and known gaps. It preserves
  `runtime/support/confidence/evidence/API/route-card/output-card` and
  `proposal/report/workbench-input` behavior and selected Gate C
  closeout / next-slice selection.
- **Just closed source-readiness slice**:
  `clt_mass_timber_wall_source_pack_extraction_v1` Gate C closed
  no-runtime. It confirmed Gate B roadmap tracks are not source-ready
  runtime packs, preserved current CLT wall values and Dataholz
  floor-only boundaries, and selected company-internal acceptance
  rehearsal because all source-ready accuracy packs remain blocked.
- **Just closed prior active slice**:
  `packages/engine/src/post-internal-use-acceptance-rehearsal-v1-next-slice-selection-contract.test.ts`
  closes the acceptance rehearsal no-runtime, confirms Gate A did not
  reveal an acceptance defect or source-ready accuracy pack, keeps all
  runtime/support/confidence/evidence/API/route-card/output-card/
  proposal/report/workbench-input behavior frozen, and selects
  `internal_use_pilot_handoff_v1`.
- **Just landed acceptance gate**:
  `packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts`
  lands the no-runtime 20-scenario acceptance matrix and selects Gate C
  closeout / next-slice selection. It pins ready wall benchmarks, exact
  and bound floor source corridors, caveated generated routes,
  many-layer/reorder edges, invalid thickness fail-closed behavior,
  unsupported-output partitioning, and cross-package proof-owner
  surfaces without runtime/support/confidence/evidence movement.
- **Prior active-slice gate**:
  `clt_mass_timber_wall_source_pack_extraction_v1` Gate B rejected
  immediate bounded metric mapping and formula tolerance. STC/FSTC/ASTC
  stay metric-policy research; IIC is rejected for wall airborne
  outputs; one-third-octave TL is only future row recompute input;
  Dataholz CLT floor `Rw` remains floor-only. Gate B selected Gate C
  closeout / next-slice selection no-runtime.
- **Prior extraction gate**:
  `clt_mass_timber_wall_source_pack_extraction_v1` Gate A classified
  WoodWorks Table 7 Single CLT Wall and Table 9 Double CLT Wall as
  later row-mapping candidates only; WoodWorks Table 8 Single NLT Wall,
  NRC RR-335, and the NRC NLT addendum as formula/tolerance context;
  and the WoodWorks database plus local Dataholz CLT floor rows as
  rejection-only context. Runtime and visible posture stayed frozen.
- **Just landed planning surface**:
  [SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md](./SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md)
  landed Gate A no-runtime. It keeps every candidate
  `runtimeImportReadyNow: false`, ranks CLT / mass-timber first only
  for source-row and metric extraction, and blocks all runtime/support/
  confidence/evidence/route-card/output-card movement.
- **Pilot usage note**:
  [INTERNAL_USE_PILOT_USAGE_NOTE.md](./INTERNAL_USE_PILOT_USAGE_NOTE.md)
  defines the closed company-pilot operating envelope and scenario
  summary.
- **Just closed planning surface**:
  [SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md](./SLICE_INTERNAL_USE_OPERATING_ENVELOPE_V1_PLAN.md)
  closed no-runtime at Gate C and selected the source-pack readiness
  triage slice.
- **Latest validation**:
  focused `pnpm calculator:gate:current` is green after
  `wall_triple_leaf_accuracy_recovery_v1` Gate G2B:
  engine 170 files / 871 tests, web 45 files / 216 passed + 18 skipped,
  build 5/5 with the known non-fatal `sharp/@img` warnings, whitespace
  guard clean. Focused Gate G2B is green: 1 file / 8 tests. Gate C +
  Gate D + Gate E + Gate F + Gate G + Gate G2 + Gate G2B continuity is
  green: 7 files / 46 tests. Engine lint is green.
  Latest broad `pnpm check` remains green from the post-Knauf v5-ready
  revalidation checkpoint: lint/typecheck/test/
  build chain passed, with unchanged turbo cache replay for the broad
  package suites: engine 281 files / 1543 tests, web 157 files / 890
  passed + 18 skipped, build 5/5 with the known non-fatal `sharp/@img`
  warnings.
- **Prepared comprehensive-accuracy roadmap**:
  [CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md)
  records the longer source-gated program. It is roadmap context for
  the selected v7 source/accuracy rerank, not an active runtime import.
- **Personal-use readiness roadmap**:
  [PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md)
  is closed for the current private/internal-use bar. Heavy-core/concrete
  remains screening, timber stud + CLT wall remain formula/source-gated
  until new source evidence appears, floor fallback remains
  low-confidence until new source evidence or a bounded family rule
  appears, and UI/input/output honesty is validated.

## Superseded Historical Next Steps

The following section is historical backlog context from an older
triple-leaf/source-gap sequence. It is no longer the selected next work.
For current work, use the Gate BI and Personal-Use MVP Coverage Sprint
sections near the top of this file.

1. Implement
   `packages/engine/src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts`
   as the source-calibrated solver decision for the split-rockwool
   triple-leaf defect.
2. Use
   [SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md](./SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md)
   plus the Gate B checkpoint as authority. Do not treat
   `multileaf_screening_blend` as a verified triple-leaf solver.
3. Numeric promotion is allowed only after a source-calibrated
   triple-leaf solver has topology ownership, metric ownership,
   tolerance ownership, negative boundaries, and paired visible tests.
4. Keep the British Gypsum Gate B source-extraction work paused until
   the triple-leaf missing-input behavior is no longer ambiguous.

- **Just closed**: `knauf_wall_systems_source_pack_extraction_v1`
  Gate C.
  `packages/engine/src/post-knauf-wall-systems-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  closes the slice no-runtime, keeps all runtime and visible surfaces
  frozen, and selects
  `packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts`.

- **Just landed**: `knauf_wall_systems_source_pack_extraction_v1`
  Gate B.
  `packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts`
  blocks every extracted Knauf locator row from runtime import and
  visible promotion, pins current implementation comparison, and selects
  `packages/engine/src/post-knauf-wall-systems-source-pack-extraction-v1-next-slice-selection-contract.test.ts`.

- **Just landed**: `knauf_wall_systems_source_pack_extraction_v1`
  Gate A.
  `packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts`
  extracts official Knauf UK/AU source table locators, keeps every
  runtime and visible surface frozen, and selects
  `packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts`.

- **Just landed**: `calculator_source_gap_revalidation_v4` Gate A.
  `packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts`
  keeps every runtime and visible surface frozen, records official
  Knauf UK/AU source locators as extraction inputs only, and selects
  `knauf_wall_systems_source_pack_extraction_v1`.

- **Just closed**: `generated_floor_fallback_topology_delta_v1`
  Gate C.
  `packages/engine/src/post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts`
  closes the topology-delta slice no-runtime, skips Gate B, keeps the
  generated floor fallback low-confidence/screening, and selects
  `calculator_source_gap_revalidation_v4`.

- **Just landed**: `generated_floor_fallback_topology_delta_v1`
  Gate A.
  `packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts`
  creates the executable topology-delta matrix, keeps the live fallback
  low-confidence, proves Pliteq exact and UBIQ FL-32 bound precedence,
  and selects Gate C closeout with no runtime movement.

- **Just closed**: `calculator_source_intake_backlog_cleanup_v1`
  Gate C.
  `packages/engine/src/post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts`
  closes the slice no-runtime, keeps every candidate
  `runtimeImportReadyNow: false`, and selects
  `generated_floor_fallback_topology_delta_v1` with
  `packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts`
  as the next first-gate file.

- **Just landed**: `calculator_source_intake_backlog_cleanup_v1`
  Gate A.
  `packages/engine/src/calculator-source-intake-backlog-cleanup-gate-a-contract.test.ts`
  creates [SOURCE_READY_INTAKE_BACKLOG.md](./SOURCE_READY_INTAKE_BACKLOG.md),
  keeps every candidate `runtimeImportReadyNow: false`, and selects
  `packages/engine/src/post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts`.

- **Just closed**: `internal_use_pilot_handoff_v1` Gate C.
  `packages/engine/src/post-internal-use-pilot-handoff-v1-next-slice-selection-contract.test.ts`
  closes the pilot handoff no-runtime, keeps every runtime and visible
  surface frozen, and selects
  `calculator_source_intake_backlog_cleanup_v1`.

- **Just landed**: `internal_use_pilot_handoff_v1` Gate A.
  `packages/engine/src/internal-use-pilot-handoff-v1-gate-a-contract.test.ts`
  creates [INTERNAL_USE_PILOT_HANDOFF.md](./INTERNAL_USE_PILOT_HANDOFF.md),
  keeps every runtime and visible surface frozen, and selects
  `packages/engine/src/post-internal-use-pilot-handoff-v1-next-slice-selection-contract.test.ts`.

- **Just closed**: `internal_use_acceptance_rehearsal_v1` Gate C.
  `packages/engine/src/post-internal-use-acceptance-rehearsal-v1-next-slice-selection-contract.test.ts`
  closes the slice no-runtime, keeps the 20-scenario acceptance matrix
  as evidence only, blocks source-gated promotion, and selects
  `internal_use_pilot_handoff_v1`.

- **Just closed**: `clt_mass_timber_wall_source_pack_extraction_v1`
  Gate C.
  `packages/engine/src/post-clt-mass-timber-wall-source-pack-extraction-v1-next-slice-selection-contract.test.ts`
  closes the slice no-runtime, keeps Gate B roadmap tracks out of
  source-ready runtime import, pins the CLT wall runtime baseline, and
  selects `internal_use_acceptance_rehearsal_v1`.

- **Just landed**: `clt_mass_timber_wall_source_pack_extraction_v1`
  Gate B.
  `packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts`
  rejects immediate bounded mapping/tolerance movement for every Gate A
  source group. Table 7 and Table 9 stay roadmap row-mapping candidates
  only; Table 8 and NRC contexts stay formula/tolerance research only;
  the WoodWorks database remains pointer-only; Dataholz CLT rows remain
  floor-only. The next file is the Gate C closeout / next-slice
  selection contract.

- **Just landed**: `clt_mass_timber_wall_source_pack_extraction_v1`
  Gate A.
  `packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts`
  classifies the WoodWorks/NRC source groups and selects Gate B
  metric-mapping / formula-tolerance decision no-runtime. The live
  `wall-clt-local` route remains lab `Rw=42`, field `R'w=41`, field
  `DnT,w=42`, formula-owned, medium-confidence, and source-gated.

- **Just landed**: `calculator_source_pack_readiness_triage_v1` Gate A.
  `packages/engine/src/calculator-source-pack-readiness-triage-gate-a-contract.test.ts`
  ranks all source-pack candidates, keeps every candidate
  `runtimeImportReadyNow: false`, and selects
  `clt_mass_timber_wall_source_pack_extraction_v1` only as a no-runtime
  source-row and metric-context extraction slice. Timber double-board,
  no-stud double-leaf, generated floor fallback, lined/heavy-core, and
  historical blocked families remain runtime-blocked.

- **Just closed**: `internal_use_operating_envelope_v1` Gate C.
  `packages/engine/src/post-internal-use-operating-envelope-v1-next-slice-selection-contract.test.ts`
  closes the operating-envelope slice no-runtime, preserves Gate B
  visible-honesty wording as the only behavior movement, keeps dynamic
  wall formula routes source-gated scoped estimates, keeps generated
  steel floor fallback low-confidence/screening with `L'nT,50`
  unsupported, and selects `calculator_source_pack_readiness_triage_v1`
  because no source-ready accuracy import pack exists.

- **Prior readiness checkpoint**: `internal_use_operating_envelope_v1`
  broad clean stop / Gate C readiness.
  [CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_CLEAN_STOP_GATE_C_READY_HANDOFF.md](./CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_CLEAN_STOP_GATE_C_READY_HANDOFF.md)
  recorded the docs/implementation comparison before Gate C. Gate B was
  landed, focused and broad validation were green, and no source-ready
  accuracy pack was identified.

- **Prior readiness checkpoint**: `internal_use_operating_envelope_v1`
  broad
  Gate C readiness.
  [CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_BROAD_REVALIDATION_GATE_C_READY_HANDOFF.md](./CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_BROAD_REVALIDATION_GATE_C_READY_HANDOFF.md)
  records the full repo result. `pnpm check` is green after a
  type-only cleanup in the framed split Gate A/B tests. The broad green
  result did not reopen any source-gated runtime family.

- **Just landed**: `internal_use_operating_envelope_v1` Gate B.
  `packages/engine/src/internal-use-operating-envelope-v1-gate-b-contract.test.ts`
  and
  `apps/web/features/workbench/internal-use-operating-envelope-visibility-gate-b.test.ts`
  audit the caveated regular internal-use scenario set. Runtime,
  support, confidence, evidence tier, API shape, route-card values, and
  output-card statuses did not move. Dynamic wall formula routes now
  carry explicit formula-owned/source-gated scoped-estimate language in
  validation, evidence, and proposal/report surfaces. The generated
  steel floor fallback remains low-confidence/screening and `L'nT,50`
  unsupported. Targeted validation is green: web Gate B 1 file / 4
  tests; web related surfaces 6 files / 27 tests; engine Gate B 1 file
  / 5 tests. Focused current gate is green after docs/runner sync: 131
  engine files / 618 tests, 45 web files / 216 passed + 18 skipped,
  build 5/5 with known non-fatal `sharp/@img` warnings.

- **Just landed**: `internal_use_operating_envelope_v1` Gate A.
  [INTERNAL_USE_PILOT_USAGE_NOTE.md](./INTERNAL_USE_PILOT_USAGE_NOTE.md)
  and
  `packages/engine/src/internal-use-operating-envelope-v1-gate-a-contract.test.ts`
  define the short company pilot operating envelope. The scenario matrix
  separates exact/benchmark/source-backed lanes from low-confidence,
  screening, source-gated, unsupported, and fail-closed lanes. Runtime,
  support, confidence, evidence, API, and route-card behavior did not
  move. Targeted Gate A validation is green: 1 file / 6 tests.

- **Just landed**: `calculator_source_gap_revalidation_v3` Gate A.
  `packages/engine/src/calculator-source-gap-revalidation-v3-gate-a-contract.test.ts`
  lands no-runtime source/readiness rerank. It keeps the framed split
  fix closed, keeps wall source holdouts and floor fallback blocked,
  treats public source candidates as research intake only, keeps the
  comprehensive accuracy program as roadmap work, and selects
  `internal_use_operating_envelope_v1` because the short company pilot
  needs a clear operating envelope before regular internal-use
  hardening. Targeted Gate A validation is green: 1 file / 6 tests.

- **Just closed**: `wall_coverage_expansion_planning_v2` Gate A.
  The no-runtime contract inventories current wall exact/formula/
  screening ownership and guardrails, keeps heavy-core/concrete
  screening, timber stud low-confidence, and CLT wall formula-owned/
  source-blocked, and selects
  `wall_single_leaf_mass_law_calibration_v1` as the next no-runtime
  source/formula contract slice.
- **Just closed**: `wall_single_leaf_mass_law_calibration_v1` Gate C.
  Gate A and Gate B changed no runtime math. The no-runtime
  bounded candidate matrix pins current field values for 150 mm
  concrete (`R'w=53`), 150 mm solid brick (`R'w=51`), and 150 mm
  generic AAC (`R'w=38`), plus 100/150/200 mm monotonic sensitivity.
  It blocks runtime movement because none of the generic stacks has a
  stack-specific source row or bounded tolerance pack.
  `post-wall-single-leaf-mass-law-calibration-v1-next-slice-selection-contract.test.ts`
  closes the slice no-runtime and selects
  `wall_double_leaf_sharp_davy_scoping_v1` because double-leaf,
  stud/double-stud, and cavity walls are the next common wall coverage
  gap in the current roadmap.
- **Just landed**: `wall_double_leaf_sharp_davy_scoping_v1` Gate B.
  `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts`
  pins the empty double-leaf, porous double-leaf, explicit single-stud,
  and explicit double-stud current values and records source/tolerance
  decisions for each. Gate B changed no runtime math and blocks value
  movement because no direct source row, lab-fallback row, benchmark
  envelope, formula tolerance owner, or bounded family rule exists.
- **Just closed**: `wall_double_leaf_sharp_davy_scoping_v1` Gate C.
  `packages/engine/src/post-wall-double-leaf-sharp-davy-scoping-v1-next-slice-selection-contract.test.ts`
  closes the slice no-runtime and selects
  `wall_double_leaf_source_evidence_acquisition_v1`. Runtime remains
  frozen; the next slice must classify direct rows, family benchmarks,
  and formula tolerance references before any retune or import.
  The next implementation file is
  `packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-a-contract.test.ts`.
- **Just landed**: `wall_double_leaf_source_evidence_acquisition_v1`
  Gate B. Gate A classified the source/tolerance candidates; Gate B
  then reconciled bounded Knauf W111 / W112 / W115 / W119 framed-wall
  rows against current dynamic lab/field outputs. The rows already fit:
  W111/W112 single-stud rows sit inside tolerance, W112 field rows are
  exact verified proxy anchors, and W115/W119 split-cavity rows already
  match as `double_stud_system`. No runtime/support/confidence/evidence
  or route-card behavior changed.
- **Just closed**: `wall_double_leaf_source_evidence_acquisition_v1`
  Gate C. `packages/engine/src/post-wall-double-leaf-source-evidence-acquisition-v1-next-slice-selection-contract.test.ts`
  closes the source-evidence slice no-runtime and selects
  `wall_source_catalog_acquisition_v1`. The next slice should inventory
  wall source catalog targets and import acceptance rules before any
  runtime, confidence, support, evidence text, or route-card movement.
- **Just landed**: `wall_source_catalog_acquisition_v1` Gate A.
  `packages/engine/src/wall-source-catalog-acquisition-gate-a-contract.test.ts`
  lands no-runtime target/source-readiness inventory. It classifies
  manufacturer framed systems as `bounded_existing_rows`, no-stud
  double-leaf, timber double-board, CLT wall, and lined-massive /
  heavy-core concrete as `needs_research`, and floor / impact /
  product-delta adjacent rows as `reject_adjacent_context`. Gate B
  should close source-pack readiness no-runtime unless a direct row pack
  has complete metadata, tolerance, protected negative boundaries, and
  paired engine/web tests.
- **Just landed**: `wall_source_catalog_acquisition_v1` Gate B.
  `packages/engine/src/wall-source-catalog-acquisition-gate-b-contract.test.ts`
  closes source-pack readiness no-runtime. It selects no runtime import:
  existing framed rows already fit current behavior, no-stud
  double-leaf lacks direct rows, timber double-board lacks a live
  topology match, CLT lacks wall-specific source rows, lined-massive /
  heavy-core lacks a bounded lining rule, and floor/product-delta rows
  are rejected as wall source truth. Gate C then closed the
  source-catalog slice no-runtime and selected the next accuracy slice.
- **Just closed**: `wall_source_catalog_acquisition_v1` Gate C.
  `packages/engine/src/post-wall-source-catalog-acquisition-v1-next-slice-selection-contract.test.ts`
  closes the source-catalog slice no-runtime and selects
  `wall_no_stud_double_leaf_source_research_v1`. Runtime remains
  frozen. The next slice must classify direct empty and porous no-stud
  double-leaf rows, named formula/tolerance references, metadata
  completeness, and negative boundaries before any import, confidence,
  support, evidence, or route-card behavior changes.
- **Just landed**: `wall_no_stud_double_leaf_source_research_v1` Gate A.
  `packages/engine/src/wall-no-stud-double-leaf-source-research-gate-a-contract.test.ts`
  lands no-runtime source/formula research. It keeps current empty
  (`R'w=46`, `Rw=48`) and porous (`R'w=41`, `Rw=43`) no-stud routes
  formula-owned, classifies gypsum-block double-wall rows as
  direct-family but adjacent material, selects Davy/Sharp formula
  tolerance and NRC row extraction for Gate B, and rejects stud/framed
  context as an import unlock.
- **Just landed**: `wall_no_stud_double_leaf_source_research_v1` Gate B.
  `packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts`
  lands no-runtime formula-tolerance and direct-row feasibility. It
  keeps Davy/Sharp as relevant scope but rejects runtime ownership until
  local route inputs and single-number `Rw` tolerances are derived,
  keeps NRC as a useful row archive but rejects import until no-stud /
  no-rail / no-coupling row proof and live material/cavity mapping are
  extracted, keeps gypsum-block rows adjacent-material only, and selects
  Gate C no-runtime closeout / next-slice selection.
- **Just closed**: `wall_no_stud_double_leaf_source_research_v1` Gate C.
  `packages/engine/src/post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts`
  closes the source-research slice no-runtime and selects
  `wall_timber_double_board_source_research_v1`. Current no-stud empty
  (`R'w=46`, `Rw=48`) and porous (`R'w=41`, `Rw=43`) routes stay
  formula-owned. The next slice must inventory direct double-board
  timber stud rows, adjacent single-board/resilient rows, formula or
  tolerance candidates, and negative boundaries before any runtime,
  confidence, support, evidence, or route-card behavior changes.
- **Just landed**: `wall_timber_double_board_source_research_v1` Gate A.
  `packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts`
  lands no-runtime source/tolerance inventory. It pins the current
  generated `wall-timber-stud` route at lab `Rw=50`, field `R'w=42`,
  generated field-context `DnT,w=43`, workbench building-context
  `DnT,w=44`, low confidence, and
  `stud_surrogate_blend+framed_wall_calibration`. It classifies direct
  single-board timber rows as adjacent, RB1/RB2 resilient rows as
  side-count-bounded adjacent evidence, Gyproc A026025 as a secondary
  direct double-board benchmark that does not match the live stack, and
  linked steel holdouts as non-timber context. No direct import or
  formula/tolerance Gate B is ready; next is Gate C no-runtime closeout
  / next-slice selection.
- **Just closed**: `wall_timber_double_board_source_research_v1` Gate C.
  `packages/engine/src/post-wall-timber-double-board-source-research-v1-next-slice-selection-contract.test.ts`
  closes the timber double-board source-research slice no-runtime and
  selects `wall_clt_wall_source_research_v1`. Current timber
  double-board values stay formula-owned and low-confidence. The next
  slice must inventory wall-specific CLT rows, laminated-leaf formula or
  tolerance references, Dataholz/floor-only negative boundaries,
  metadata completeness, and selected next action before any runtime,
  confidence, support, evidence, API, or route-card behavior changes.
- **Just landed**: `wall_clt_wall_source_research_v1` Gate A.
  `packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts`
  lands no-runtime source/tolerance inventory. It pins the current
  generated `wall-clt-local` route at lab `Rw=42`, field `R'w=41`,
  field-context `DnT,w=42`, medium confidence, and
  `laminated_leaf_sharp_delegate`. It classifies Dataholz CLT rows as
  floor-only source truth, wall-specific CLT / mass-timber rows as
  missing, the laminated-leaf tolerance owner as missing, and report /
  product-delta CLT context as non-source. No direct import or
  formula/tolerance Gate B is ready; next is Gate C no-runtime closeout
  / next-slice selection.
- **Just closed**: `wall_clt_wall_source_research_v1` Gate C.
  `packages/engine/src/post-wall-clt-wall-source-research-v1-next-slice-selection-contract.test.ts`
  closes the CLT wall source-research slice no-runtime and selects
  `wall_lined_massive_heavy_core_source_research_v1`. Current CLT wall
  values stay formula-owned and medium-confidence. The next slice must
  inventory wall-specific lined concrete / heavy masonry rows,
  manufacturer wall-lining rows, bounded formula/tolerance candidates,
  and selector/deep-hybrid negative boundaries before any runtime,
  confidence, support, evidence, API, or route-card behavior changes.
- **Just landed**:
  `wall_lined_massive_heavy_core_source_research_v1` Gate A.
  `packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts`
  lands no-runtime source/bounded-lining-rule inventory. It pins the
  current `wall-screening-concrete` route at lab `Rw=57`, field
  `R'w=55`, `DnT,w=56`, `DnT,A=54.9`, medium confidence,
  `lined_massive_wall`, and `lined_massive_blend`. It keeps Knauf CC60
  rows floor-only, classifies wall-specific lined concrete / heavy
  masonry rows as missing, manufacturer wall-lining context as adjacent
  and unimported, formula-framework context as unbounded, selector and
  deep-hybrid rows as stability boundaries, and the old heavy-core Gate
  B audit as frozen baseline context. No direct import or
  formula/tolerance Gate B is ready; next is Gate C no-runtime closeout
  / next-slice selection.
- **Previously closed**: `proposal_report_polish_v1`.
  Simple PDF/DOCX exports now include output coverage posture,
  generated proposal documents preserve real floor/wall workbench
  caveats, and many-layer / long-label report rendering is pinned.
  This did not change calculator runtime/source/confidence posture.
- **Latest broad validation**: 2026-04-29 `pnpm check` is green during
  the post-Knauf v5-ready revalidation checkpoint: lint/typecheck/test/
  build chain passed, with unchanged turbo cache replay for engine 281
  files / 1543 tests and web 157 files / 890 passed + 18 skipped
  through `tools/dev/run-web-vitest.ts`, build 5/5, with only the known
  non-fatal `sharp/@img` optional-package warnings.
- **Cartography Gate A result**:
  `packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts`
  landed no-runtime. It executes 29 representative floor/wall cells and
  maps evidence tier, support/card posture, output coverage, origin,
  confidence, invariants, and candidate type.
- **Floor fallback Gate A result**:
  `packages/engine/src/floor-fallback-low-confidence-gate-a-audit-contract.test.ts`
  landed no-runtime. It pins generated `floor-steel-fallback` as
  no-exact/no-bound, `low_confidence`, fit `28%`, origin basis
  `predictor_floor_system_low_confidence_estimate`, lab `Rw=61` /
  `Ln,w=58.3`, field `R'w=70` / `Ln,w=58.3` /
  `L'n,w=61.3` / `L'nT,w=58.5`, and keeps `L'nT,50`
  unsupported. Pliteq and UBIQ rows remain source lineage / near
  misses, not promotion evidence.
- **Floor fallback Gate B result**:
  `packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts`
  landed no-runtime. It proves exact and bound source precedence already
  work on the true Pliteq and UBIQ source topologies, blocks promotion
  for the generated stack because it lacks the critical INEX deck /
  GenieMat / Pliteq ceiling or UBIQ bound topology, and finds no
  fail-closed correction because unsupported outputs already stay
  explicit.
- **Floor fallback Gate C result**:
  `packages/engine/src/post-floor-fallback-low-confidence-gate-c-next-slice-selection-contract.test.ts`
  closed `floor_fallback_low_confidence_cleanup_v1` no-runtime and
  selected `ui_input_output_honesty_v1`. `floor-steel-fallback` remains
  `screening` / `low_confidence`, with field `R'w=70`, `Ln,w=58.3`,
  `L'n,w=61.3`, `L'nT,w=58.5`, and unsupported `L'nT,50`.
- **UI/input/output honesty Gate A result**:
  `apps/web/features/workbench/ui-input-output-honesty-gate-a-inventory.test.ts`
  landed no-runtime. It pins structured schema issue paths for missing
  estimate and impact-only inputs, field-airborne geometry vs room-volume
  blockers, and non-numeric handling for explicitly unsupported requested
  outputs. It found no defended-looking unsupported live/bound value.
  Gate B is now limited to API next-field message mapping and simple
  output-card unsupported-vs-missing-input label precedence.
- **UI/input/output honesty Gate B result**:
  `apps/web/lib/calculator-api-validation.ts` now gives
  `/api/estimate` and `/api/impact-only` concrete `nextField` guidance
  while preserving raw schema `issues`. `simple-workbench-output-model`
  keeps genuinely missing field-impact inputs as `needs_input`, but
  marks engine-rejected current-path field-impact companions such as
  active-continuation `L'nT,50` as `unsupported` and non-numeric. No
  acoustic runtime values, formulas, confidence scores, or support
  precedence changed.
- **UI/input/output honesty Gate C result**:
  `packages/engine/src/post-ui-input-output-honesty-gate-c-next-slice-selection-contract.test.ts`
  closes the personal-use readiness chain and selects
  `project_access_policy_route_integration_v1`. The calculator is now
  reasonable for private/internal estimates across common wall/floor
  stacks when the visible evidence-tier caveats are respected. This is
  not a certification, every-possible-family, or full productization
  claim.
- **Project access policy route integration result**:
  `apps/web/lib/project-route-auth.ts` now adapts resolved owner scope
  into the pure project access policy. Project list/create/import/detail
  and proposal audit append decisions use that policy path while keeping
  current owner-scoped route behavior. `apps/web/lib/project-route-auth.test.ts`,
  `apps/web/lib/server-project-routes.test.ts`, and
  `apps/web/lib/post-project-access-policy-route-integration-next-slice-selection-contract.test.ts`
  pin the adapter, owner-only route behavior, no team-role route
  enablement, and next-slice selection.
- **Heavy-core/concrete closeout**: Gate B closed no-runtime for
  `wall.concrete_heavy_core_screening.field`. The no-runtime
  source/formula audit found no exact catalog row, no direct external
  benchmark match in the current audit, and no topology-specific
  tolerance for the selected concrete lining stack. Evidence remains
  `screening`.
- **Latest plan/implementation reconciliation**: 2026-04-27
  `wall_timber_stud_clt_accuracy_pass_v1` closed no-runtime at Gate C.
  `packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts`
  keeps generated `wall-timber-stud` at lab `Rw=50`, field `R'w=42`,
  low-confidence `stud_wall_system`, and blocks exact/benchmark
  promotion because no source/formula unlock matches the live stack.
  Direct timber exact rows are single-board only, resilient exact rows
  require explicit side-count/acoustic-board topology, the direct
  double-board row is only a secondary benchmark, and linked holdouts
  are steel-framed companions.
  `packages/engine/src/wall-clt-gate-b-source-contract.test.ts` keeps
  generated `wall-clt-local` at lab `Rw=42`, field `R'w=41`,
  medium-confidence `laminated_single_leaf`, and blocks exact/source
  promotion because no verified exact/lab-fallback match or
  wall-specific CLT source row exists. Dataholz CLT rows stay floor
  source truth, and the current laminated lane stays formula-owned.
  `packages/engine/src/post-wall-timber-stud-clt-gate-c-next-slice-selection-contract.test.ts`
  closes the slice and selects
  `floor_fallback_low_confidence_cleanup_v1`.
- **Closed productization follow-up**:
  `proposal_report_polish_v1`. PDF/DOCX/workbench proposal honesty is
  tightened for representative wall/floor scenarios without changing
  calculator values, formulas, support, or confidence.
- **Proposal/report polish Gate A first carve**:
  the simple PDF/DOCX HTML path now renders an output coverage register
  so live, `needs_input`, and `unsupported` output posture does not
  disappear from short-form exports. The focused
  `simple-workbench-proposal.test.ts` pins this; calculator runtime and
  support/confidence decisions are unchanged.
- **Proposal/report polish Gate A second carve**:
  `simple-workbench-proposal-generated-document-honesty.test.ts` now
  builds proposal documents from real workbench output models and pins a
  reinforced-concrete low-confidence floor case plus a dynamic
  field-airborne wall case across copy-ready text, branded preview, and
  simple preview. Targeted proposal/export tests and
  `pnpm calculator:gate:current` are green. This is still no-runtime for
  acoustic calculations.
- **Proposal/report polish Gate A third carve**:
  the generated-document test now includes a 53-row UBIQ exact floor
  stack with long material labels. Branded/simple HTML tables use fixed
  table layout plus `overflow-wrap` / `word-break` guards, SVG
  construction labels stay truncated, full labels remain available in
  wrapping table/text surfaces, and simple short-form exports explicitly
  state when the layer table is capped. Targeted proposal/report tests
  are green across 5 files / 18 tests, web lint is green,
  `pnpm calculator:gate:current` is green, and broad `pnpm check` is
  green with engine 233 files / 1275 tests and web 155 files / 885
  passed + 18 skipped.
- **Proposal/report polish closeout**:
  `packages/engine/src/post-proposal-report-polish-next-slice-selection-contract.test.ts`
  closes `proposal_report_polish_v1` and selects
  `calculator_source_gap_revalidation_v1`. The selected Gate A action
  is a no-runtime inventory and rerank of remaining source gaps.
  `pnpm calculator:gate:current` is green after adding the closeout
  contract: engine 99 files / 450 tests, web 43 files / 211 passed +
  18 skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.
- **Calculator source-gap revalidation Gate A**:
  `packages/engine/src/calculator-source-gap-revalidation-gate-a-contract.test.ts`
  closes `calculator_source_gap_revalidation_v1` no-runtime and selects
  `wall_coverage_expansion_planning_v2`. `GDMTXA04A`, `C11c`, raw bare
  open-box/open-web impact, and wall-selector behavior remain
  fail-closed. Heavy-core/concrete, timber stud, CLT wall, and floor
  fallback are not promoted from nearby green tests.
  `pnpm calculator:gate:current` is green after adding the Gate A
  contract: engine 100 files / 455 tests, web 43 files / 211 passed +
  18 skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.
- **Wall coverage expansion planning v2 Gate A**:
  `packages/engine/src/wall-coverage-expansion-planning-v2-gate-a-contract.test.ts`
  closes the wall coverage inventory no-runtime and selects
  `wall_single_leaf_mass_law_calibration_v1`. It keeps exact/catalog
  and lab-fallback rows precedence-protected, keeps heavy-core/concrete
  screening, timber stud low-confidence, and CLT wall formula-owned/
  source-blocked, and requires hostile-input, many-layer, reorder,
  invariant, invalid-thickness, and unsupported-output guards before
  runtime wall work.
  `pnpm calculator:gate:current` is green after adding the Gate A
  contract: engine 101 files / 460 tests, web 43 files / 211 passed +
  18 skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.
- **Wall single-leaf mass-law calibration Gate A**:
  `packages/engine/src/wall-single-leaf-mass-law-calibration-gate-a-contract.test.ts`
  lands the no-runtime source/formula contract for unmatched massive
  single-leaf walls. It keeps exact/catalog/lab-fallback precedence
  stronger than formula, limits positive Gate B scope to unmatched
  one-leaf mineral stacks, and requires web route-card coverage before
  any value/support/confidence/evidence text movement.
  `pnpm calculator:gate:current` is green after adding the Gate A
  contract: engine 102 files / 465 tests, web 43 files / 211 passed +
  18 skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.
- **Wall single-leaf mass-law calibration Gate B**:
  `packages/engine/src/wall-single-leaf-mass-law-calibration-gate-b-contract.test.ts`
  lands the no-runtime bounded runtime-candidate matrix. Current
  concrete / solid-brick / generic-AAC values stay as defensible
  formula-owned estimates; runtime movement is blocked until a
  stack-specific source row or bounded tolerance pack exists.
  `pnpm calculator:gate:current` is green after adding the Gate B
  contract: engine 103 files / 470 tests, web 43 files / 211 passed +
  18 skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.
- **Wall single-leaf mass-law calibration Gate C**:
  `packages/engine/src/post-wall-single-leaf-mass-law-calibration-v1-next-slice-selection-contract.test.ts`
  closes the slice no-runtime and selects
  `wall_double_leaf_sharp_davy_scoping_v1`. It keeps the single-leaf
  formula-owned values unchanged, preserves exact/catalog/lab-fallback
  precedence, and requires a no-runtime Sharp/Davy/double-leaf/stud
  scoping Gate A before any double-leaf runtime movement.
  `pnpm calculator:gate:current` is green after adding the Gate C
  contract: engine 104 files / 475 tests, web 43 files / 211 passed +
  18 skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.
- **Wall double-leaf Sharp/Davy scoping Gate A**:
  `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-a-contract.test.ts`
  lands the no-runtime current-value and route-ownership inventory for
  common double-leaf / stud-cavity walls. It pins empty double-leaf at
  field `R'w=46`, porous double-leaf without stud metadata at
  `R'w=41`, explicit single-stud at `R'w=37`, and explicit
  double-stud / split-cavity at `R'w=52`, while keeping lined-massive
  and triple-leaf shapes outside the target. Gate A selects Gate B
  matrix work but blocks value movement until a source row, benchmark
  envelope, formula tolerance owner, or bounded family rule is named.
- **Wall double-leaf Sharp/Davy Gate B**:
  `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts`
  lands the no-runtime bounded current-value/source-tolerance matrix.
  The four positive routes remain formula-owned estimates with no exact
  row, lab-fallback row, benchmark envelope, formula tolerance owner, or
  bounded family rule; protected exact, resilient, timber, single-leaf,
  lined-massive, CLT, direct-coupled, and triple-leaf boundaries remain
  outside the retune lane.
  `pnpm calculator:gate:current` is green after adding the Gate B
  contract: engine 106 files / 485 tests, web 43 files / 211 passed +
  18 skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.
- **Wall double-leaf Sharp/Davy Gate C**:
  `packages/engine/src/post-wall-double-leaf-sharp-davy-scoping-v1-next-slice-selection-contract.test.ts`
  closes the slice no-runtime and selects
  `wall_double_leaf_source_evidence_acquisition_v1`. No value/support/
  confidence/evidence/card behavior changed; source-evidence acquisition
  is selected because Gate B named specific source/tolerance blockers.
  `pnpm calculator:gate:current` is green after adding the Gate C
  contract: engine 107 files / 490 tests, web 43 files / 211 passed +
  18 skipped, build 5/5 with the known non-fatal `sharp/@img` warnings.
- **Wall double-leaf source evidence Gate A**:
  `packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-a-contract.test.ts`
  lands no-runtime source/tolerance classification. It rejects the
  generic empty AAC/gap/gypsum double-leaf and no-stud porous
  gypsum/wool/gap/gypsum double-leaf rows for runtime movement, because
  no direct stack row or topology-specific tolerance exists. It classifies
  Knauf W111 single-stud and W115 double-stud / split-cavity rows as
  bounded framed-wall evidence for Gate B reconciliation, while keeping
  Knauf Quietstud, Davy double-leaf formula, and stud-type study
  references as corridor context only. Exact catalog, resilient
  side-count, timber, single-leaf, lined-massive, heavy-core, CLT,
  direct-coupled, and triple-leaf boundaries stay protected.
  Targeted Gate A validation is green: 1 file / 6 tests.
- **Wall double-leaf source evidence Gate B**:
  `packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-b-contract.test.ts`
  lands no-runtime reconciliation. It pins 16 bounded W111 / W112 /
  W115 / W119 rows against current dynamic outputs: W111/W112
  single-stud rows fit inside source tolerances, W112 field rows remain
  exact verified proxy anchors, and W115/W119 split-cavity rows already
  match on the `double_stud_system` lane. Targeted Gate B validation is
  green: 1 file / 4 tests.
- **Wall double-leaf source evidence Gate C**:
  `packages/engine/src/post-wall-double-leaf-source-evidence-acquisition-v1-next-slice-selection-contract.test.ts`
  closes the source-evidence slice no-runtime and selects
  `wall_source_catalog_acquisition_v1`. Targeted Gate C validation is
  green: 1 file / 5 tests.
- **Wall source catalog acquisition Gate A**:
  `packages/engine/src/wall-source-catalog-acquisition-gate-a-contract.test.ts`
  lands no-runtime. It pins six target families, 16 required row
  metadata fields, seven negative boundaries, and the Gate B decision:
  no direct runtime import is ready now. Targeted Gate A validation is
  green: 1 file / 6 tests.
- **Wall source catalog acquisition Gate B**:
  `packages/engine/src/wall-source-catalog-acquisition-gate-b-contract.test.ts`
  lands no-runtime source-pack readiness closeout. It pins eight import
  acceptance criteria, six source-pack readiness decisions, and the Gate
  C action. Targeted Gate B validation is green: 1 file / 6 tests.
- **Wall source catalog acquisition Gate C**:
  `packages/engine/src/post-wall-source-catalog-acquisition-v1-next-slice-selection-contract.test.ts`
  closes the source-catalog slice no-runtime and selects
  `wall_no_stud_double_leaf_source_research_v1`. Targeted Gate C
  validation is green: 1 file / 5 tests.
- **Wall no-stud double-leaf source research Gate A**:
  `packages/engine/src/wall-no-stud-double-leaf-source-research-gate-a-contract.test.ts`
  lands no-runtime. It pins current live route posture, direct-family
  but non-importable gypsum-block candidates, Davy/Sharp formula
  tolerance candidacy, NRC row-extraction candidacy, stud/framed
  negative boundaries, and the Gate B no-runtime feasibility decision.
  Targeted Gate A validation is green: 1 file / 6 tests.
- **Wall no-stud double-leaf source research Gate B**:
  `packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts`
  lands no-runtime. It pins formula-tolerance acceptance criteria,
  rejects Davy/Sharp as a current runtime tolerance owner until a local
  tolerance derivation exists, rejects NRC and gypsum-block candidates
  as direct imports until row/topology proof exists, preserves current
  empty and porous values, and selects Gate C closeout. Targeted Gate B
  validation is green: 1 file / 6 tests.
- **Wall no-stud double-leaf source research Gate C**:
  `packages/engine/src/post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts`
  closes the source-research slice no-runtime, keeps current no-stud
  values frozen, and selects
  `wall_timber_double_board_source_research_v1`. Targeted Gate C
  validation is green: 1 file / 5 tests.
- **Wall timber double-board source research Gate A**:
  `packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts`
  lands no-runtime. It pins current live route posture, direct
  single-board timber exact rows as adjacent, RB1/RB2 resilient exact
  rows as side-count-bounded adjacent evidence, Gyproc A026025 as a
  secondary benchmark, linked steel holdouts as non-timber context, and
  no named bounded formula/tolerance owner. Gate A selects Gate C
  no-runtime closeout / next-slice selection. Targeted Gate A validation
  is green: 1 file / 5 tests.
- **Wall timber double-board source research Gate C**:
  `packages/engine/src/post-wall-timber-double-board-source-research-v1-next-slice-selection-contract.test.ts`
  closes the source-research slice no-runtime, keeps current timber
  double-board values frozen, and selects
  `wall_clt_wall_source_research_v1`. Targeted Gate C validation is
  green: 1 file / 5 tests.
- **Wall CLT wall source research Gate A**:
  `packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts`
  lands no-runtime. It pins current live route posture, Dataholz CLT
  floor exact rows as floor-only source truth, missing wall-specific CLT
  rows, missing laminated-leaf tolerance owner, report/product-delta
  non-source context, and the Gate C no-runtime closeout decision.
  Targeted Gate A validation is green: 1 file / 5 tests.
- **Wall CLT wall source research Gate C**:
  `packages/engine/src/post-wall-clt-wall-source-research-v1-next-slice-selection-contract.test.ts`
  closes the source-research slice no-runtime, keeps current CLT wall
  values frozen, and selects
  `wall_lined_massive_heavy_core_source_research_v1`. Targeted Gate C
  validation is green: 1 file / 5 tests.
- **Wall lined massive / heavy-core source research Gate A**:
  `packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts`
  lands no-runtime. It pins current live route posture, floor-only Knauf
  CC60 rows, missing wall-specific rows, adjacent manufacturer lining
  context, unbounded formula context, selector/deep-hybrid stability
  boundaries, and the Gate C no-runtime closeout decision. Targeted
  Gate A validation is green: 1 file / 5 tests.
- **Wall lined massive / heavy-core source research Gate C**:
  `packages/engine/src/post-wall-lined-massive-heavy-core-source-research-v1-next-slice-selection-contract.test.ts`
  closes the source-research slice no-runtime, keeps current
  lined-massive / heavy-core values frozen, and selects
  `calculator_source_gap_revalidation_v2`. The next slice must
  re-rank remaining floor/wall source and accuracy gaps after the wall
  source-research chain closed no-runtime. Targeted Gate C validation
  is green: 1 file / 5 tests.
- **Calculator source-gap revalidation v2 Gate A**:
  `packages/engine/src/calculator-source-gap-revalidation-v2-gate-a-contract.test.ts`
  lands no-runtime. It keeps wall source-chain holdouts, floor fallback,
  and historical blocked-source families closed, recognizes floor
  field-continuation as already audited, defers optional architecture
  and productization-only work, and selects
  `floor_layer_order_invariance_expansion_v1` because user layer
  reorder/edit behavior is the ready engine-addressable accuracy risk.
  Targeted Gate A validation is green: 1 file / 6 tests.
- **Floor layer-order invariance expansion Gate A**:
  `packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts`
  lands no-runtime. It proves role-defined UBIQ FL-28 and Dataholz
  GDMTXN01 exact floor rows remain exact under reverse, rotate,
  base-first, grouped-by-role, and interleaved UI order edits; keeps raw
  terminal concrete helper support changes explicit; keeps raw open-web
  impact outputs fail-closed after reorder; and keeps many-layer split
  raw concrete stacks finite without exact/bound promotion. Gate B is
  not required; the next action is Gate C no-runtime closeout /
  next-slice selection. Targeted Gate A validation is green: 1 file / 6
  tests.
- **Floor layer-order invariance expansion Gate C**:
  `packages/engine/src/post-floor-layer-order-invariance-expansion-v1-next-slice-selection-contract.test.ts`
  closes the expanded floor-order slice no-runtime. It keeps broad
  arbitrary raw floor reorder value invariance unclaimed, keeps source
  families closed, and selects
  `wall_framed_facing_split_warning_stability_v1` because F3 is the
  remaining documented non-source-blocked calculator drift. Targeted
  Gate C validation is green: 1 file / 5 tests.
- **Wall framed facing split warning stability Gate A**:
  `packages/engine/src/wall-framed-facing-split-warning-stability-gate-a-contract.test.ts`
  lands no-runtime. It pins representative LSF and timber framed wall
  board splits across lab and field contexts. The old warning-only F3
  description is incomplete in the current implementation: LSF lab
  stays exact at `Rw=55`, timber lab/field stays stable, but LSF
  field/building board splits move `R'w`, `Dn,w`, `Dn,A`, `DnT,w`,
  `DnT,A`, and `STC` by +1 dB and add the framed reinforcement
  monotonic-floor warning. Gate A keeps route cards frozen, preserves
  the no-global-board-coalescing boundary, and selects Gate B
  value/warning stability fix. Targeted Gate A validation is green:
  1 file / 5 tests.
- **Wall framed facing split warning stability Gate B**:
  `packages/engine/src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts`
  lands the bounded runtime fix. LSF field/building board splits now
  keep the Gate A baseline values (`R'w=51`, `Dn,w=51`, `Dn,A=49.6`,
  `DnT,w=52`, `DnT,A=51.1`, `STC=51`, `C=-1.4`, `Ctr=-6.4`) and no
  longer add the framed reinforcement monotonic-floor warning. LSF lab
  exact and timber lab/field remain stable; coalesced 25 mm boards per
  face remain a different topology at `R'w=38`. Paired web route-card
  coverage pins the visible cards and acoustic warnings while leaving
  ordinary guided sanity notes honest for 6.25 mm split fragments.
  Targeted Gate B validation is green: 1 file / 5 tests, and the web
  route-card matrix is green: 1 file / 1 test.
- **Wall framed facing split warning stability Gate C**:
  `packages/engine/src/post-wall-framed-facing-split-warning-stability-v1-next-slice-selection-contract.test.ts`
  closes the slice no-runtime after the Gate B fix and selects
  `calculator_source_gap_revalidation_v3`. The framed split fix stays
  local; source-blocked wall/floor families and floor fallback are not
  reopened from this green result. The next first-gate file is
  `packages/engine/src/calculator-source-gap-revalidation-v3-gate-a-contract.test.ts`.

## Immediate Execution Order

`wall_triple_leaf_accuracy_recovery_v1` should now proceed in this
order:

1. Re-read
   [CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_B_HANDOFF.md](./CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_B_HANDOFF.md),
   [CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_A_HANDOFF.md),
   [SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md](./SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md),
   [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md),
   [CURRENT_STATE.md](./CURRENT_STATE.md), and
   [CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md).
2. Add
   `packages/engine/src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts`
   as the source-calibrated triple-leaf solver decision contract.
3. Keep runtime values frozen unless Gate B explicitly selects a
   source-calibrated solver path with topology, metric, tolerance,
   negative-boundary, and paired visible-test ownership.
4. British Gypsum Gate B is now resumed by v8, but only as
   `gate_b_mapping_tolerance_decision_no_runtime`; the triple-leaf
   Uris lane stays paused on `paused_waiting_rights_safe_source_packet`
   and the split-rockwool screening answer must not look precise.

Historical source-chain context below stays available for backlog
continuity:

1. Re-read
   [CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md),
   [SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md](./SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md),
   [CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md),
   [CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-30_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md),
   [SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md](./SLICE_LINED_MASONRY_KNAUF_MWI2A_MAPPING_TOLERANCE_PLAN.md),
   [CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md),
   [CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-30_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md),
   [SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md](./SLICE_TIMBER_DOUBLE_BOARD_KNAUF_TB5A_MAPPING_TOLERANCE_PLAN.md),
   [CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-30_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_GATE_A_HANDOFF.md),
   [CHECKPOINT_2026-04-29_POST_KNAUF_V5_READY_REVALIDATION_HANDOFF.md](./CHECKPOINT_2026-04-29_POST_KNAUF_V5_READY_REVALIDATION_HANDOFF.md),
   [CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md),
   [CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md](./CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md),
   [CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md),
   [CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_GATE_A_HANDOFF.md),
   [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_PLAN.md),
   [SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md](./SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md),
   [SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_PLAN.md),
   [SOURCE_READY_INTAKE_BACKLOG.md](./SOURCE_READY_INTAKE_BACKLOG.md),
   [CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT_HANDOFF.md),
   [CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_A_HANDOFF.md),
   [SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md](./SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md),
   [CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_GATE_C_CLOSEOUT_HANDOFF.md),
   [SLICE_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_V1_PLAN.md](./SLICE_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_V1_PLAN.md),
   [INTERNAL_USE_PILOT_HANDOFF.md](./INTERNAL_USE_PILOT_HANDOFF.md),
   [SLICE_INTERNAL_USE_PILOT_HANDOFF_V1_PLAN.md](./SLICE_INTERNAL_USE_PILOT_HANDOFF_V1_PLAN.md),
   [CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md](./CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md),
   [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md), and the
   current-state active-slice section.
2. Add
   `packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts`
   as the Gate A no-runtime mapping / tolerance decision for
   `EN-PC-50-055-6-2-12.5-WB-25`.
3. Keep the v6 Gate A result authoritative: no runtime-ready candidate
   was found, and `EN-PC-50-055-6-2-12.5-WB-25` is selected only for
   no-runtime mapping because Wallboard / Acoustic Roll mapping,
   stud-gauge equivalence, field-output policy, tolerance owner,
   existing steel-anchor precedence, and paired visible tests remain
   incomplete.
4. Preserve the no-runtime/no-promotion boundary: source pointers,
   handoff success, topology near misses, and nearby green tests are
   not source-gated family promotion.
5. Update `NEXT_IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`,
   `AGENTS.md`, the slice plan, and the relevant checkpoint together.
6. Validate with the targeted EN-PC Gate A test,
   `pnpm calculator:gate:current`, and `git diff --check`. Run
   `pnpm check` if Gate A becomes the release gate or selects
   runtime/import/visible behavior work.

## Personal-Use Readiness Chain

These are the calculator priorities before calling the project ready for
private day-to-day use:

1. Floor fallback / low-confidence cleanup.
   - closed no-runtime at Gate C.
2. UI / input / output honesty pass.
   - closed at Gate C.

Productization route-policy and proposal/report polish slices are
closed. Calculator runtime/source posture stays frozen during Knauf
source-pack extraction unless a later contract names a source-ready
accuracy pack. The landed framed-wall
split fix remains protected, and the no-stud, timber double-board, CLT
wall, lined-massive / heavy-core source research, source-intake backlog
cleanup, and floor layer-order invariance expansion slices have closed
no-runtime at Gate C. Additional productization work is deferred until
this source/topology step closes or the priority explicitly changes.

## Latest Closed Slices

See [CURRENT_STATE.md](./CURRENT_STATE.md) "Latest Closed Slices" table.
`wall_timber_double_board_source_research_v1` Gate C is closed
no-runtime and `wall_clt_wall_source_research_v1` Gate C is closed
no-runtime. `wall_lined_massive_heavy_core_source_research_v1` Gate C
is closed no-runtime and selected `calculator_source_gap_revalidation_v2`.
`calculator_source_gap_revalidation_v2` Gate A has landed no-runtime
and selected `floor_layer_order_invariance_expansion_v1`. Floor order
invariance Gate A has landed no-runtime and selected Gate C closeout /
next-slice selection. Floor order invariance Gate C has closed
no-runtime and selected `wall_framed_facing_split_warning_stability_v1`.
Framed-wall split warning stability Gate A has landed no-runtime and
selected Gate B LSF field board-split value/warning stability fix. Gate
B has landed that bounded fix and selected Gate C closeout /
next-slice selection. Gate C has closed the framed split slice and
selected `calculator_source_gap_revalidation_v3`. Source-gap
revalidation v3 Gate A then selected `internal_use_operating_envelope_v1`;
internal-use Gate A landed the pilot pack, and Gate B landed the
regular internal-use visibility audit. Gate C closed the
operating-envelope slice no-runtime and selected
`calculator_source_pack_readiness_triage_v1`. Source-pack readiness
triage Gate A has now landed no-runtime and selected
`clt_mass_timber_wall_source_pack_extraction_v1` as the next bounded
source-row and metric-context extraction slice. CLT / mass-timber
extraction Gate A has now landed no-runtime, classified the
WoodWorks/NRC source groups, kept `wall-clt-local` frozen, and selected
Gate B metric-mapping / formula-tolerance decision. Gate B has now
landed no-runtime, found no bounded mapping/tolerance path ready now,
and selected Gate C closeout / next-slice selection. Gate C has now
closed no-runtime and selected `internal_use_acceptance_rehearsal_v1`
because no source-ready accuracy pack exists after Gate B. Acceptance
rehearsal Gate A then landed the 20-scenario matrix, and Gate C has now
closed no-runtime and selected `internal_use_pilot_handoff_v1`.

## Deferred Follow-Up Tracks

1. **Remaining dynamic-airborne recursive guard carves** — optional
   architecture backlog only. `applyLinedMassiveMasonryMonotonicFloor`,
   `applyFramedReinforcementMonotonicFloor`, and
   `applyAmbiguousFamilyBoundaryHold` still live in
   `dynamic-airborne.ts`, but C6 is closed because the file is below
   2000 lines after broad validation.
2. **Blocked source-family reopens** — `GDMTXA04A`, `C11c`, raw bare
   open-box/open-web impact, wall-selector behavior, reinforced-concrete
   reopening, and timber exact-row follow-ups remain closed unless new
   source evidence deliberately selects a source slice.
3. **Productization route integration** —
   closed as `project_access_policy_route_integration_v1`. Route
   behavior remains owner-scoped and acoustic calculations are
   unaffected.
