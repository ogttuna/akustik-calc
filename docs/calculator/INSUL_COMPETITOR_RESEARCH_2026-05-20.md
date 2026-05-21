# INSUL Competitor Research - 2026-05-20

Document role: public-source competitor benchmark for DynEcho's
calculator-first roadmap. This is not a source-row intake document and
does not ingest measured assembly values.

## Research Boundary

Use INSUL as a category benchmark, not as an implementation source to
copy. The useful takeaways are public product architecture, model family
boundaries, input ownership, visible limitations, and accuracy posture.
Do not copy proprietary equations, UI assets, or measured catalogue data.

DynEcho's target remains stronger than "INSUL-like":

- exact trusted rows win true full-stack matches;
- similar rows can anchor only when topology, metric basis, and rights
  are owned;
- source-absent combinations must calculate through named family
  solvers with visible error budgets;
- missing physical inputs must return `needs_input`;
- lab, field, and building-prediction outputs must stay basis-separated.

## Sources Checked

- INSUL 10.0 User Guide: https://docs.insul.co.nz/v10/
- INSUL technical information: https://www.insul.co.nz/tech-info/
- INSUL Version 10 announcement:
  https://www.insul.co.nz/news/version-10/
- INSUL 10.0.7 release note:
  https://www.insul.co.nz/news/release-1007/
- INSUL 10 release history:
  https://docs.insul.co.nz/v10/Resources/Releases/
- INSUL single-panel theory:
  https://docs.insul.co.nz/v10/SoundInsulationTheory/Airborne-SinglePanels-Overview/
- INSUL triple-panel theory:
  https://docs.insul.co.nz/v10/SoundInsulationTheory/Airborne-TriplePanels/
- INSUL glazing energy model:
  https://docs.insul.co.nz/v10/SoundInsulationTheory/Airborne-Glazing-EnergyModel/
- INSUL porous-facing theory:
  https://docs.insul.co.nz/v10/SoundInsulationTheory/Airborne-Porous-Facing/
- INSUL floating-floor theory:
  https://docs.insul.co.nz/v10/SoundInsulationTheory/Airborne-DoublePanels-FloatingFloors/
- INSUL airborne ratings:
  https://docs.insul.co.nz/v10/SoundInsulationTheory/Ratings-Airborne/
- INSUL floor getting-started guide:
  https://docs.insul.co.nz/v10/GettingStarted/Floors/
- INSUL impact input-force theory:
  https://docs.insul.co.nz/v10/SoundInsulationTheory/Impact-InputForce/
- INSUL floor-cover theory:
  https://docs.insul.co.nz/v10/SoundInsulationTheory/Impact-FloorCovers/
- INSUL impact-sound theory:
  https://docs.insul.co.nz/v10/SoundInsulationTheory/Impact-ImpactSound/
- INSUL impact accuracy and limitations:
  https://docs.insul.co.nz/v10/SoundInsulationTheory/Impact-Accuracy/
- INSUL flanking guide:
  https://docs.insul.co.nz/v10/GettingStarted/Flanking/
- INSUL leaks guide:
  https://docs.insul.co.nz/v10/GettingStarted/Leaks/
- INSUL technical papers index:
  https://www.insul.co.nz/download/
- ISO 717-2:2020:
  https://www.iso.org/standard/69867.html
- ISO 12354-1:2017:
  https://www.iso.org/standard/70242.html
- ISO 12354-2:2017:
  https://www.iso.org/standard/70243.html
- CadnaB building-acoustics overview:
  https://www.datakustik.com/products/cadnab/cadnab-for-building-acoustics
- CadnaB calculation feature page:
  https://www.datakustik.com/products/cadnab/features/calculation
- CadnaB room/building transmission overview:
  https://www.datakustik.com/building-acoustics/airborne-and-impact-sound-insulation
- SONarchitect overview:
  https://www.acousticware.com/sonarchitect/index.php/en/sonarchitect-iso/whatit
- SOAB database overview:
  https://www.sonusoft.com/soab-database
- SOAB subscription / ISO 12354 input-data notes:
  https://www.sonusoft.com/subscribe

## Follow-Up Sanity Check - 2026-05-20

The follow-up web research still supports the model-first calculator
direction. It does not justify a broad source crawl before the selected
implementation gate.

Key confirmations:

- INSUL's public technical material describes family-specific physics:
  single-panel mass law and coincidence, thick-panel effects, finite-size
  low-frequency effects, double-panel mass-air-mass and bridging regions,
  impact-floor family separation, leaks, glazing, and composite
  transmission. This confirms that DynEcho should keep adding named
  source-absent family solvers instead of trying to stretch one universal
  layer formula across every route.
- INSUL Version 10 publicly describes a first-principles algorithm review,
  validation study, quad models, wave-based glazing, refined material
  properties, and bridging changes. Competitor direction is still
  algorithm/model depth, not catalog breadth alone.
- ISO 717-1 and ISO 717-2 keep single-number airborne and impact ratings
  downstream of octave or one-third-octave results. DynEcho can keep
  shipping pinned single-number corridors where that is the current owned
  surface, but the long-term engine shape should expose internal banded
  curves or curve provenance whenever a solver is naturally spectral.
- CadnaB/BASTIAN-style building workflows are ISO 12354 room-pair and
  whole-building calculations with geometry, junctions, flanking paths,
  spectral outputs, and requirement checks. This supports DynEcho's
  current refusal to alias lab `Rw` / `Ln,w` into building `R'w` /
  `DnT,w` / `L'n,w` without explicit direct/flanking/junction/room
  owners.
- SOAB positions structured, validated third-octave input data as the
  fuel for ISO 12354 prediction tools. That reinforces source rows as
  exact overrides, calibrated anchors, holdouts, and structured input
  evidence, not as the product itself.
- The INSUL manual's composite transmission-loss section aligns with the
  existing DynEcho opening/leak area-energy route. The correct next work
  there is still basis/adapter expansion only when requested metrics and
  source/band inputs are owned.

Plan impact:

- The latest selected implementation has now moved through double-leaf /
  framed wall coverage refresh. The landed no-runtime gate is
  `layer_combination_resolver_double_leaf_framed_wall_banded_coverage_refresh_plan`
  with selection status
  `layer_combination_resolver_double_leaf_framed_wall_banded_coverage_refresh_landed_no_runtime_selected_post_double_leaf_revalidation`.
  It selected
  `layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan`
  in
  `packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts`;
  selected next label: layer combination resolver post double-leaf
  framed wall banded coverage revalidation.
- The coverage refresh follows the INSUL/ISO lesson that route-owned
  family solvers need an explicit coverage ledger after visible surface
  parity. Independent, resilient both-sides, and resilient one-side
  double-leaf/framed wall rows stay on
  `layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
  and candidate
  `candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`,
  with `Rw 45`, `Rw 46`, and `Rw 45` pins plus not-measured budgets.
- Field/building, ASTM/IIC, floor-impact, direct-fixed, grouped
  triple-leaf/multicavity, tolerance retune, and broad source crawl stay
  blocked or separate. This is not a broad source crawl.
- The latest selected implementation has moved through double-leaf /
  framed wall runtime promotion and surface parity. The landed surface
  parity gate is
  `layer_combination_resolver_double_leaf_framed_wall_banded_surface_parity_plan`
  with selection status
  `layer_combination_resolver_double_leaf_framed_wall_banded_surface_parity_landed_no_runtime_selected_coverage_refresh`.
  It selected
  `layer_combination_resolver_double_leaf_framed_wall_banded_coverage_refresh_plan`
  in
  `packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-coverage-refresh-contract.test.ts`;
  selected next label: layer combination resolver double-leaf framed
  wall banded coverage refresh.
- This surface parity keeps DynEcho aligned with the INSUL/ISO
  architecture lesson: candidate trace, output cards, route posture,
  metric-basis rows, method dossier, local saved replay, server snapshot
  replay, calculator API payloads, impact-only API payloads, and
  Markdown report expose the same source-absent element-lab basis
  `layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
  and candidate
  `candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`.
  Scenario-specific pins remain independent absorbed `Rw 45`, resilient
  both-sides `Rw 46`, and resilient one-side `Rw 45`, with explicit
  not-measured budgets rather than measured-evidence wording.
- Field/building overlays stay basis-separated and do not rewrite lab
  candidate trace pins; missing physical inputs still fail as
  `needs_input`; direct-fixed, grouped triple-leaf/multicavity,
  floor-impact, ASTM/IIC, tolerance retune, and broad source crawling
  remain blocked. This is not a broad source crawl.
- Previous single-leaf surface parity remains landed as
  `layer_combination_resolver_single_leaf_mass_law_banded_surface_parity_plan`
  with selection status
  `layer_combination_resolver_single_leaf_mass_law_banded_surface_parity_landed_no_runtime_selected_post_single_leaf_matrix_refresh`.
  It exposed the scenario-specific candidate trace for wall single-leaf
  and floor direct-airborne cases, then selected
  `layer_combination_resolver_post_single_leaf_mass_law_banded_matrix_refresh_plan`
  in
  `packages/engine/src/layer-combination-resolver-post-single-leaf-mass-law-banded-matrix-refresh-contract.test.ts`;
  selected next label: layer combination resolver post single-leaf
  mass-law banded matrix refresh.
- The latest selected implementation has moved past single-leaf surface
  parity into the landed post-single-leaf matrix refresh:
  `layer_combination_resolver_post_single_leaf_mass_law_banded_matrix_refresh_plan`
  with selection status
  `layer_combination_resolver_post_single_leaf_mass_law_banded_matrix_refresh_landed_no_runtime_selected_double_leaf_framed_wall_banded_solver_owner`.
  It selected
  `layer_combination_resolver_double_leaf_framed_wall_banded_solver_owner_plan`
  in
  `packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-solver-owner-contract.test.ts`;
  selected next label: layer combination resolver double-leaf framed wall
  banded solver owner.
- The landed matrix keeps
  `candidate_layer_combination_resolver_single_leaf_mass_law_banded_source_absent_family_solver`
  on wall single-leaf and floor direct-airborne cases with visible
  `+/-6 dB` budgets while treating the former single-leaf owner gap as
  `ready_with_budget`. Floor impact, field/building, ASTM/IIC, and broad
  source crawl remain blocked. This is not a broad source crawl.
- The double-leaf / framed wall owner and formula corridor have now
  landed. The formula corridor is
  `layer_combination_resolver_double_leaf_framed_wall_banded_formula_corridor_plan`
  with selection status
  `layer_combination_resolver_double_leaf_framed_wall_banded_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  It defines
  `layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
  with mass-air-mass, bridge coupling, absorber flow resistivity,
  one-third-octave TL, ISO 717-1 Rw/C/Ctr, STC display, exact-source
  precedence, hostile topology, and not-measured budget terms.
- The runtime corridor has since landed from the previously selected
  action
  `layer_combination_resolver_double_leaf_framed_wall_banded_runtime_corridor_plan`
  in
  `packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor-contract.test.ts`;
  the current next action is now the surface-parity-selected coverage
  refresh named above.
- The formula/runtime design pins preserve Gate S values for the
  surface-parity handoff:
  independent absorbed `Rw 45` / STC 45 / `C -1` / `Ctr -6.1` with
  `+/-7 dB` budgets and resilient both-sides `Rw 46` / STC 46 /
  `C -1.1` / `Ctr -6.2` with `+/-8 dB` budgets. Missing
  `resilientBarSideCount`, field/building, ASTM/IIC, direct-fixed bridge,
  grouped triple-leaf/multicavity, and broad source crawl remain blocked.
- The next high-value lane is therefore the double-leaf / framed wall
  coverage refresh, selected from actual resolver gaps rather than source
  availability.
- Prefer lanes that improve actual calculator coverage with explicit
  physical inputs and budgets: double-leaf/framed walls, floor-cover /
  floating package transfer, glazing/opening/leak spectrum adapters, or
  field/building adapters when direct and flanking owners exist.
- Keep building-prediction runtime and ASTM/IIC expansion lower priority
  unless the matrix proves they now outrank the source-absent family
  solver gaps. They require more owner infrastructure than a narrow lab
  or field continuation.

## Detailed INSUL Architecture Read - 2026-05-20

The deeper public read still frames INSUL as a route-specific prediction
engine. The repeated product pattern is:

1. select route and construction family;
2. collect physical material and topology inputs for that family;
3. calculate a banded transmission or impact curve;
4. derive single-number ratings and spectrum adapters from that curve;
5. show construction images, graphs, tables, and report output.

This matters because the hard part is not one isolated formula. The hard
part is candidate selection: deciding which model family owns the stack,
which physical inputs are mandatory, which ratings are legal for that
basis, and when a superficially similar source or floor-cover package
must be rejected.

| INSUL public capability | Public model signal | DynEcho use |
| --- | --- | --- |
| Single panels | mass-law, coincidence, finite-size, thick/heavy-panel behavior | keep single-leaf solvers separate from laminated/multi-leaf routes; expose density, thickness, mass, stiffness, loss-factor assumptions |
| Layered or massive panels | material-property refinement and thick-panel handling | add explicit property ownership instead of hiding defaults in generic layer math |
| Double panels and floating floors | mass-air-mass resonance, cavity behavior, bridging/connection paths | require cavity depth, frame/bridge class, infill, resilient layer, and connection topology before promotion |
| Triple and quad panels | multiple cavities with lower public accuracy posture | keep grouped topology and cavity ownership first-class; add low-frequency and multi-cavity uncertainty warnings |
| Glazing | energy and wave-based glazing models with frame/spacer effects | treat glazing as its own family, not as ordinary gypsum/concrete leaves |
| Porous facings and cavity fills | absorption/flow-resistivity-sensitive behavior | require porous/facing role and material properties instead of relying only on thickness |
| Leaks/openings/composite TL | aperture, slit, and area-energy style routes | continue the Gate S/U opening-leak route; do not alias it to STC, field, or building metrics without a later adapter |
| Impact floors | separate massive/lightweight families and input force handling | keep timber, CLT, open-box, open-web, EPS/screed, and package-transfer lanes separated by support family |
| Floor covers and underlays | measured vs predicted modes, dynamic-stiffness input, base-floor dependence | exact compatible packages first; otherwise require support family, base floor, dynamic stiffness, load basis, finish mass, lower assembly, and metric basis |
| Ratings | airborne and impact single-number ratings from octave or third-octave results | move long-term source-absent solvers toward internal banded curves, with `Rw`, `C`, `Ctr`, `Ln,w`, and `CI` as derived adapters |
| Flanking/building | public flanking reminder rather than full building calculation | DynEcho can exceed INSUL by owning direct/flanking/junction/room-normalization building routes |
| Material/user database | editable material and product lists | use source rows as exact overrides, anchors, holdouts, and local property evidence; never as the whole calculator |

## How DynEcho Uses This Without Copying INSUL

INSUL is a benchmark for product architecture and model-family coverage,
not a formula or data source to copy. DynEcho should implement its own
standards-grounded and source-owned formulas, keep rights-safe
provenance, and avoid importing INSUL measurement rows or UI assets.

Implementation rules from this read:

- every source-absent solver must name its construction family, required
  physical inputs, metric basis, origin, support bucket, tolerance or
  error budget, and negative boundaries;
- the candidate resolver must keep exact-match, similar-anchor,
  source-absent formula, field, building, and unsupported lanes distinct;
- route-specific input surfaces are mandatory for serious accuracy:
  wall, floor, opening/leak, field, building, impact package, glazing,
  and floor-cover inputs cannot collapse into one generic layer list;
- low-frequency, resonance, multi-cavity, high-layer-count, and
  floor-cover transfer risks need visible warnings and tests;
- banded curve ownership should become the internal target for solvers
  where the physics is spectral, even if the current UI exposes only
  single-number results;
- field and building routes must own ISO 12354-style direct,
  flanking/junction, coupling, room absorption, and normalization terms
  before runtime promotion.

## DynEcho Must Beat INSUL On

DynEcho's target is not parity. The product should be stricter and more
transparent than the public INSUL posture:

- cards, API payloads, reports, dossiers, and saved replays must all show
  the same basis, origin, support bucket, and error-budget language;
- missing physical inputs must fail closed with exact owner names, not
  silently fall back to a convenient generic estimate;
- exact rows, similar anchors, calibration holdouts, and formula
  estimates must remain separate with rights-safe provenance;
- building prediction should become an executable owned route, not only
  a flanking reminder, once direct/flanking/junction/room terms are
  implemented;
- hostile inputs must be part of the acceptance matrix: too many layers,
  safe/unsafe reorders, duplicate carriers/openings, partial packages,
  wrong support family, and lab/field/building alias attempts;
- residual policy and holdout matrices must decide when to hold, widen,
  tighten, or retune a corridor. Runtime movement should never happen
  from undocumented intuition.

## INSUL Product Shape

INSUL is clearly a prediction calculator, not just a finite catalogue.
Its public user guide says it predicts sound insulation for walls,
floors, ceilings, and windows using theoretical models that require
limited input data, then refines those models against laboratory tests.

The public UI/model structure is route-specific:

- construction tabs for walls, ceilings, floors, roofs, glazing, porous
  materials, flanking, and leaks;
- panel tabs for single, double, triple, and now quad style
  constructions;
- charts/tables showing banded curves and single-number ratings;
- material and floor-cover lists that can be filtered, edited, imported,
  and extended by users.

Important product lesson: a serious calculator opens different physical
input surfaces for different acoustic routes. DynEcho should continue
the same route-owned input pattern rather than a generic layer list that
tries to infer every topology after the fact.

## INSUL Model Families

Public INSUL material points to a family-specific model stack:

- single panels: mass law, critical/coincidence behavior, low-frequency
  finite-size effects, thick/heavy-panel behavior;
- double panels: airborne cavity path plus structure-borne/bridging path,
  with different frequency regions around mass-air-mass resonance,
  cavity modes, and solid connections;
- triple panels: extension of double-panel cavity/connection ideas, with
  explicit warning that accuracy drops as element count rises;
- quad panels: supported in Version 10, but the public guide section is
  still sparse;
- glazing: energy-based and wave-based models;
- leaks: separate Gomperts and Mechel style routines for apertures and
  slits;
- impact floors: separate massive-floor and lightweight-floor routes,
  plus floor covers, underlays, floating floors, joists, and ceiling
  connections.

DynEcho use:

- keep the resolver family-first, not "one formula for all layers";
- keep source-absent solver names explicit in output metadata;
- keep triple/multi-cavity and high-layer-count paths conservative until
  topology owners and error budgets are explicit;
- preserve rejected-candidate reasons so a user can see why a route did
  not borrow from a superficially similar assembly.

## Impact Floor Lessons

INSUL separates floor-cover data into measured and predicted modes.
Measured floor-cover improvements can be used when compatible, while
predicted floor-cover performance depends on physical material
properties such as thickness, density, bending stiffness, damping, and
underlay stiffness. INSUL also exposes dynamic stiffness as a direct
input pathway for underlays.

The public guide also warns that floor-cover transferability depends on
the base floor family. Lightweight-floor floor-cover data should not be
casually transferred to heavyweight floors, and even one lightweight
construction may not transfer to another without construction ownership.

DynEcho use:

- exact measured floor-package rows stay first when they truly match;
- source-absent floor-package corridors should require support family,
  base carrier, resilient-layer stiffness/load basis, upper finish mass,
  lower ceiling/isolation, and metric basis;
- package-transfer lanes must remain family-gated and topology-gated;
- EPS/screed hybrid package parity has already landed. The current
  post-input-surface open-web revalidation must prove that new UI inputs
  did not disturb floor-cover/package-transfer boundaries, exact
  precedence, field/building separation, or dynamic-stiffness ownership.
  The following matrix refresh should rank the next source-absent floor
  solver gap from observed calculator clusters, not from broad source
  crawling.

## Flanking And Building Prediction

INSUL's public flanking guide is especially useful as a boundary marker.
It says high-performance lab partitions can fail to achieve site
performance because sound travels through secondary/flanking paths.
INSUL provides a visual flanking indicator, but it does not directly
calculate full building flanking transmission.

DynEcho use:

- keep lab `Rw` / `Ln,w` separate from field `R'w`, `DnT,w`, `L'n,w`,
  and building-prediction outputs;
- do not promote building prediction until flanking paths, junction
  classes, coupling lengths, room normalization, and uncertainty owners
  are executable;
- longer-term opportunity: beat INSUL by making field/building
  prediction an owned route instead of a visual reminder.

## Accuracy And Limitation Posture

INSUL is candid about uncertainty:

- general airborne predictions are positioned as useful engineering
  estimates, not substitutes for test data;
- triple panel predictions are explicitly less accurate than single and
  double panel predictions;
- impact prediction accuracy varies by massive vs lightweight floor
  families and becomes weaker in transition regions;
- low-frequency impact bands can diverge substantially from measured
  data;
- floor-cover predictions can diverge near resonance and can overstate
  high-frequency improvement.

DynEcho use:

- every promoted source-absent formula corridor needs metric-specific
  error budgets, not generic confidence;
- low-frequency warnings should be first-class for impact and
  multi-cavity routes;
- banded prediction curves should become an internal engine artifact even
  when the UI initially shows single-number ratings;
- tests must include nearby negatives, wrong-family transfer attempts,
  field/building aliases, and hostile layer edits.

## Where DynEcho Should Be Better

| Benchmark behavior | INSUL public posture | DynEcho target |
| --- | --- | --- |
| Model breadth | broad family modules for walls, floors, ceilings, roofs, glazing, leaks | same breadth, but with explicit candidate resolver and rejected-candidate trace |
| Source rows | user/material databases and measured floor-cover data | exact rows plus calibrated anchors, holdouts, residual policy, and rights-safe provenance |
| Source-absent prediction | theoretical family models with known limitations | named source-absent corridors with visible per-metric error budgets |
| Missing inputs | UI defaults and route inputs | precise `needs_input` with missing physical owner names |
| Field/building | flanking reminder/indicator, not full direct building calculation | owned field/building routes with room, flanking, junction, and normalization inputs |
| Triple/quad complexity | supported but lower accuracy warnings | supported only with explicit topology, grouping, and uncertainty budgets |
| Output transparency | charts/tables and single-number ratings | charts/tables plus basis/origin/support bucket/error budget on every card/API/report |
| Validation | comparison against lab tests | executable holdout/residual matrix plus UI/API/report parity tests |

## 2026-05-21 Follow-Up Research Refresh And Plan Impact

No runtime direction changes from this research. The research changes
planning language only, and it keeps the current selected implementation
bounded.

Current selected implementation:

`layer_combination_resolver_double_leaf_framed_wall_banded_formula_corridor_plan`

Current selected file:

`packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-formula-corridor-contract.test.ts`

Research conclusion:

- INSUL's public user guide and technical pages confirm the correct
  product shape: route-specific prediction models, limited physical
  inputs, one-third-octave curves, rating adapters, and continued
  comparison with laboratory tests. It is not just a finite source-row
  catalog.
- INSUL's single-panel public theory uses surface mass, stiffness /
  critical-frequency behavior, coincidence, low-frequency finite-size
  effects, and thick-panel corrections. The single-leaf banded runtime
  corridor and surface parity have landed, so the current matrix treats
  that former gap as `ready_with_budget`.
- INSUL's double-panel public theory separates airborne cavity paths from
  structural bridge paths and makes cavity infill, flow resistivity,
  frame/support type, and connection class first-class inputs. The next
  wall solver depth after single-leaf parity is therefore the
  double-leaf/framed/bridged chain, not a generic layer heuristic. The
  owner step has now landed and the selected next implementation is the
  formula corridor.
- INSUL's impact pages separate massive-floor impact theory,
  lightweight-floor theory, ceiling connections, measured floor-cover
  improvements, predicted floor-cover improvements, and dynamic
  stiffness. DynEcho must mirror that separation through owner gates
  before combining arbitrary floor finishes, underlays, carriers, and
  lower treatments.
- ISO 12354-1/2 make field/building outputs a separate direct/flanking /
  structural-propagation problem. ISO 717-1/2 keep single-number ratings
  downstream of octave or one-third-octave data. DynEcho must not alias
  lab `Rw` or `Ln,w` into field/building or ASTM/IIC values without
  named adapters.
- DynEcho's opportunity to beat INSUL is transparency: exact rows,
  similarity anchors, calibrated solvers, source-absent solvers,
  rejected candidates, missing owner fields, basis, support bucket, and
  per-metric budget must be visible on cards, APIs, saved replays, and
  reports.

Research-backed execution order:

1. Keep the landed single-leaf mass-law banded runtime and surface
   parity values frozen while preserving the scenario-specific candidate
   trace and `+/-6 dB` budget.
2. Use the landed post-single-leaf resolver matrix refresh as the active
   handoff: single-leaf is `ready_with_budget`, broad source crawl stays
   blocked, and the selected next action was the double-leaf/framed wall
   owner.
3. Continue the wall double-leaf/framed/bridged family chain. The owner,
   formula corridor, and runtime corridor have landed. Complete
   source-absent element-lab double-leaf/framed walls now promote through
   `layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
   and candidate
   `candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`
   without numeric value movement: independent absorbed remains `Rw 45`
   / STC 45 / `C -1` / `Ctr -6.1` with `+/-7 dB`; resilient both-sides
   remains `Rw 46` / STC 46 / `C -1.1` / `Ctr -6.2` with `+/-8 dB`;
   resilient one-side remains `Rw 45` / STC 45 / `C -1.1` / `Ctr -6.2`
   with `+/-8 dB`. Missing `resilientBarSideCount`, direct-fixed,
   grouped triple-leaf/multicavity, unowned field/building aliases,
   floor-impact, ASTM/IIC, and broad source crawling remain blocked.
   Explicit `field_between_rooms` output remains on its separate field
   overlay and does not relabel lab `Rw`. The landed runtime corridor is
   `layer_combination_resolver_double_leaf_framed_wall_banded_runtime_corridor_plan`
   with selection status
   `layer_combination_resolver_double_leaf_framed_wall_banded_runtime_corridor_landed_selected_surface_parity`.
   The selected next action is
   `layer_combination_resolver_double_leaf_framed_wall_banded_surface_parity_plan`
   in
   `packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-surface-parity-contract.test.ts`;
   selected next label: layer combination resolver double-leaf framed
   wall banded surface parity. This is not a broad source crawl.
   Previous owner handoff remains documented for agent resumes:
   `layer_combination_resolver_double_leaf_framed_wall_banded_solver_owner_plan`
   landed with selection status
   `layer_combination_resolver_double_leaf_framed_wall_banded_solver_owner_landed_no_runtime_selected_formula_corridor`
   and selected
   `layer_combination_resolver_double_leaf_framed_wall_banded_formula_corridor_plan`
   in
   `packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-formula-corridor-contract.test.ts`;
   selected next label: layer combination resolver double-leaf framed
   wall banded formula corridor. The formula handoff then landed as
   `layer_combination_resolver_double_leaf_framed_wall_banded_formula_corridor_plan`
   with selection status
   `layer_combination_resolver_double_leaf_framed_wall_banded_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
4. Then continue surface parity and coverage refresh for the same
   double-leaf/framed owner chain.
5. Start the floor floating-cover / underlay / resilient-package family
   owner chain with explicit measured-vs-predicted package separation.
6. Add field/building adapter owners only after direct lab curves and
   required room, junction, flanking, and normalization inputs are owned.
7. Add glazing/opening/leak and spectrum-adapter parity after the major
   wall/floor family solvers expose banded internal curves.
8. Add calibration, holdout residuals, and tolerance retune governance
   after the family owner chains identify concrete residual gaps.
9. Acquire broad source/holdout rows only for named anchors, exact
   precedence, residual, or validation gaps. Do not source-crawl as a
   substitute for solvers.

Blocked for now:

- broad source crawling;
- tolerance retuning without residual/holdout evidence;
- lab-to-field or lab-to-building runtime aliases;
- ASTM/STC/IIC/OITC aliases without named rating adapters;
- generic "arbitrary layer" heuristics that skip family-specific owner
  inputs.

Implementation cross-check, 2026-05-21:

- The selected single-leaf surface-parity gate has landed and should not
  be reopened unless a new residual/holdout proves a defect. Its public
  values stay `Rw 31`, `Rw 34`, `Rw 55`, and `+/-6 dB` on the owned
  wall single-leaf and floor direct-airborne routes.
- The implementation gap is now local to the next selected formula
  corridor: register the double-leaf/framed wall source-absent basis,
  candidate id, current value pins, not-measured budgets, and negative
  boundaries in the shared layer-combination resolver without moving
  acoustic values.
- The following research-dependent gates remain later work after the
  double-leaf owner chain starts: floating floor / underlay
  dynamic-stiffness owners, field/building ISO 12354 adapters, and
  calibration/holdout tolerance governance.

## Backlog Inspired By INSUL

1. Add an explicit INSUL-style model-family capability matrix to the
   broad-accuracy matrix refresh: single leaf, double leaf, triple/quad,
   glazing/openings, leaks, massive floor, lightweight floor, floor
   covers, floating floors, ceiling connections, field, building.
2. Introduce internal one-third-octave curve artifacts for source-absent
   solvers where the physics model is naturally banded. Single-number
   `Rw`, `C`, `Ctr`, `Ln,w`, and `CI` should be derived outputs, not the
   only model state.
3. Make low-frequency risk explicit on impact and multi-cavity outputs.
   Do not hide it behind a generic confidence label.
4. Add user/material-property extension strategy after V0 scope freeze:
   editable density, modulus, loss factor, flow resistivity, dynamic
   stiffness, orthotropy, damping, and source/provenance metadata.
5. Build an owned building-prediction route after the current lab
   corridors are visible: direct curve owner, flanking path energy,
   junction/coupling, room absorption/normalization, and field/building
   uncertainty budget.
6. Keep exact-source and package-transfer lanes separate. INSUL's
   measured/predicted floor-cover split supports this separation.

## Non-Goals

- Do not pause the selected double-leaf/framed wall owner chain to build
  a broad INSUL clone.
- Do not add measurement rows from INSUL public docs.
- Do not treat INSUL's output targets as a ceiling; they are the
  baseline category expectation.
- Do not claim building/field values from lab-only corridors.
