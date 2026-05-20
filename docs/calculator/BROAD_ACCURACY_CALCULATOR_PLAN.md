# Broad Accuracy Calculator Plan

Status: active refocus plan, created 2026-05-15.

This plan supersedes the idea that the 71-row company-internal
controlled envelope is the finish line. That envelope remains a
regression guard. The product target is broader: for arbitrary realistic
wall/floor layer combinations, the calculator should find exact measured
evidence when it exists, use nearby measured evidence as an anchor when
it is physically compatible, and otherwise calculate with the correct
family solver and an explicit error budget.

The plan also supersedes the idea that "low confidence" is a deliverable
outcome. Weak labels are useful only as inventory while the project is
finding a real calculation route. Company-internal readiness means common
layer combinations compute through exact evidence, similarity anchors,
calibrated family solvers, or source-absent physics models. If physical
inputs are missing, the result should ask for those inputs. If no
calculation owner exists, it should be `unsupported`. Neither case is the
end goal.

## External Research Check

The direction matches the public shape of the field:

- ISO 12354-1 says airborne building prediction uses measured element
  data for direct/indirect flanking plus theoretical propagation models:
  https://www.iso.org/standard/70242.html
- ISO 12354-2 says impact prediction uses measured data for direct and
  indirect flanking plus theoretical structural propagation, with
  frequency-band and simplified models:
  https://www.iso.org/standard/70243.html
- ISO 717-1 and ISO 717-2 define single-number airborne and impact
  ratings from octave or one-third-octave results, so `Rw`, `C`, `Ctr`,
  `Ln,w`, and field/building metrics must remain basis-owned rather than
  aliased:
  https://www.iso.org/standard/77435.html and
  https://www.iso.org/standard/69867.html
- INSUL positions itself as construction-input prediction software for
  TL, `Rw`/`STC`, and `Ln,w`/`IIC`, and its technical notes discuss
  mass law, coincidence, double-panel, finite-size, and bridging effects:
  https://www.insul.co.nz/features/ and
  https://www.insul.co.nz/tech-info/
- BASTIAN positions building acoustics calculation as EN 12354 based,
  including airborne and impact sound between rooms, third-octave
  calculations, single-number ratings, and ISO 717 spectrum terms:
  https://www.datakustik.com/fileadmin/user_upload/Bastian/Technical_Brochures/Datakustik_Bastian_Folder_EN_02-13.pdf
- Sonusoft's Acoulatis/SOAB material describes the same split between
  element prediction, third-octave results, ISO 12354 workflows, and
  structured acoustic input data:
  https://www.sonusoft.com/

The implication for DynEcho is clear: source rows are valuable inputs,
calibration evidence, exact overrides, and holdouts. They are not the
product by themselves. The product is a resolver that can calculate.

## Current Implementation Reality

Executable refocus contract:

`packages/engine/src/broad-accuracy-calculator-readiness-contract.test.ts`

Latest checkpoint:
[CHECKPOINT_2026-05-20_BROAD_ACCURACY_REVALIDATION_AND_OPEN_BOX_FRAGMENTATION_PLAN.md](./CHECKPOINT_2026-05-20_BROAD_ACCURACY_REVALIDATION_AND_OPEN_BOX_FRAGMENTATION_PLAN.md).
The current gate is green after the open-box timber package-transfer
formula/runtime/surface-parity/coverage-refresh sequence, but broad
"every common wall/floor combination" confidence is still not complete.
The selected next action is the exact-only hybrid fragmentation policy
for same-family TUAS open-box timber evidence.

Current measured/source inventory exposed by that contract:

- floor exact rows: 173;
- floor bound rows: 23;
- floor exact source types: 38 open measured dataset rows, 116 official
  manufacturer system-table rows, 19 official open component-library
  rows;
- verified airborne wall entries: 56, including 43 lab `Rw` rows and 13
  field `DnT,A,k` rows;
- approximate airborne field companions: 13;
- wall timber/lightweight source-corpus rows: 9.

Current residual/holdout coverage exposed by that contract:

- steel floor formula has 3 same-family `Ln,w` holdout residuals, MAE
  0.4 dB, max error 0.6 dB;
- steel floor formula has 0 measured same-stack `DeltaLw` residual rows;
- triple-leaf wall has 2 calibration rows and 1 holdout row in the
  source-family calibration fit;
- timber/lightweight wall corpus has 6 exact imports and 2 linked
  holdouts;
- the 71-row company-internal matrix is only a controlled envelope, not
  broad accuracy proof.

Main gap: measured/source rows exist, but there is no single global
reference benchmark and similarity-anchor resolver that drives every
solver family. That is why progress has felt too narrow: the project has
many defended slices, but not yet a unifying accuracy loop.

Second gap: historical `low_confidence`, `screening_fallback`, and
screening-only lanes still exist in shared/domain contracts and old
calculator slices. The broad-readiness loop must treat those lanes as
solver debt. They can remain visible as honest stopgaps while being
replaced, but they must not be counted as supported company-internal
calculation coverage.

## Resolver Order

Every wall/floor route should follow this order:

1. `exact_measured_same_topology_metric_basis`
2. `nearby_measured_similarity_anchor`
3. `calibrated_family_solver`
4. `source_absent_family_solver_with_budget`
5. `needs_input_or_unsupported_boundary`

Important rule: step 5 is not the target. It is only the safe failure
mode when required physical information or a route owner is genuinely
missing.

Important rule: `low_confidence` and `screening_fallback` sit outside
this target resolver order. They are migration debt to be classified,
ranked, and converted into a real solver path or a precise boundary.

## Milestones

### Milestone 1 - Global Reference Benchmark

Build `broad_accuracy_reference_benchmark_expansion_and_similarity_solver`
as the active next slice.

Deliverables:

- one reference-case schema for wall and floor rows;
- source row classification as exact source, holdout residual,
  similarity anchor, or formula regression anchor;
- weak-lane debt classification for any active `low_confidence`,
  `screening_fallback`, or screening-only runtime/contract path;
- runner that computes residuals by route, family, metric, and basis;
- summary thresholds by family, not one global average;
- explicit count of formula corridors with no measured residuals.

Acceptance:

- measured rows and formula anchors are counted separately;
- exact source rows cannot hide formula residual failures;
- weak-lane rows cannot count as supported readiness;
- every promoted family solver has either measured residuals or a
  documented source-absent budget;
- docs and tests say "not broad-ready" until the benchmark proves it.

### Milestone 2 - Similarity Anchor Service

Turn the existing ad hoc exact/recommendation paths into a first-class
similarity resolver.

Deliverables:

- normalized assembly fingerprint for wall and floor stacks;
- topology distance: route, lab/field/building basis, support family,
  leaf/cavity count, structural carrier, lining/ceiling/floating layers,
  openings, and material class;
- numeric distance: thickness, surface mass, dynamic stiffness, spacing,
  load basis, room/area/volume context;
- hard rejection for wrong basis, wrong metric, wrong support family, or
  missing owner fields.

Acceptance:

- nearby measured rows can anchor only compatible stacks;
- wrong-family rows are negative tests;
- anchor correction is visible in basis/support notes;
- exact measured rows still win over similarity and formula.

### Milestone 3 - Family Solver Backtest Loop

Backtest every major solver against the global reference benchmark:

- single-leaf masonry/concrete/AAC;
- lined massive/masonry/heavy-core;
- CLT/mass-timber wall;
- framed timber/lightweight-steel wall;
- double-leaf and no-stud double-leaf;
- grouped triple-leaf/multi-cavity;
- opening/leak composite;
- heavy concrete, hollow-core, CLT, timber joist, open-web steel,
  steel joist floors;
- field adapters and building-prediction adapters separately from lab.

Acceptance:

- every family has residual thresholds or stays explicitly
  source-absent-budgeted;
- no solver can be promoted only because a fixture value is green;
- route/card/report/API parity remains a secondary guard, not the main
  accuracy proof.

### Milestone 4 - Company-Internal Readiness Re-definition

Company-internal readiness is achieved only when:

- the common wall/floor families above have benchmark-backed residual
  coverage or bounded source-absent budgets;
- the UI/API/report surfaces share the same resolver result;
- missing-input prompts are precise;
- hostile layer edits, duplicates, many layers, and safe/unsafe reorder
  cases stay stable;
- the operating envelope names supported, needs-input, and unsupported
  cases honestly, but the supported set is broad enough for real daily
  use.

## Active Next Step

Detailed active slice plan:

[SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md](./SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md)

The benchmark expansion slice has now landed as a no-runtime contract:

- landed gate:
  `broad_accuracy_reference_benchmark_expansion_and_similarity_solver_plan`
- selection status:
  `broad_accuracy_reference_benchmark_expansion_landed_no_runtime_selected_floor_system_similarity_anchor`
- implementation:
  `packages/engine/src/broad-accuracy-reference-benchmark-expansion.ts`
- contract:
  `packages/engine/src/broad-accuracy-reference-benchmark-expansion-contract.test.ts`

It ingests the existing 173 floor exact rows, 23 floor bound rows, 56
airborne verified rows, timber wall corpus, steel residual benchmark,
and triple-leaf calibration fit into one benchmark ledger. It also adds
family residual summaries, weak-lane debt classification, and
similarity-anchor hard rejection policy.

Selected next action:

`broad_accuracy_floor_system_similarity_anchor_runtime_plan`

Selected next file:

`packages/engine/src/broad-accuracy-floor-system-similarity-anchor-contract.test.ts`

That selected floor-system anchor admission gate has now landed as a
no-runtime contract:

- landed gate:
  `broad_accuracy_floor_system_similarity_anchor_runtime_plan`
- selection status:
  `broad_accuracy_floor_system_similarity_anchor_landed_no_runtime_selected_open_web_supported_band_runtime_corridor`
- implementation:
  `packages/engine/src/broad-accuracy-floor-system-similarity-anchor.ts`
- contract:
  `packages/engine/src/broad-accuracy-floor-system-similarity-anchor-contract.test.ts`

It classifies the existing open-web/open-box floor evidence without
calling it readiness: 90 UBIQ open-web exact rows, 21 open-web bound
rows, and 15 TUAS open-box exact rows. It also keeps the current FL-28
250 mm interpolation seed pinned as no-runtime movement and selects the
first actual broadening runtime lane:

`broad_accuracy_open_web_supported_band_similarity_runtime_corridor_plan`

Selected next file:

`packages/engine/src/broad-accuracy-open-web-supported-band-similarity-runtime-contract.test.ts`

Selected next label: open-web steel supported-band similarity runtime
corridor.

That selected runtime corridor has now landed:

- landed gate:
  `broad_accuracy_open_web_supported_band_similarity_runtime_corridor_plan`
- selection status:
  `broad_accuracy_open_web_supported_band_similarity_runtime_corridor_landed_selected_surface_parity`
- implementation:
  `packages/engine/src/lightweight-steel-open-web-supported-band-estimate.ts`
- contract:
  `packages/engine/src/broad-accuracy-open-web-supported-band-similarity-runtime-contract.test.ts`
- runtime basis:
  `predictor_lightweight_steel_open_web_supported_band_similarity_estimate`
- selected next action:
  `broad_accuracy_open_web_supported_band_similarity_surface_parity_plan`
- selected next file:
  `packages/engine/src/broad-accuracy-open-web-supported-band-similarity-surface-parity-contract.test.ts`
- selected next label:
  open-web supported-band similarity surface parity

The runtime is deliberately narrow: complete element-lab FL-24/FL-26
open-web steel supported-band stacks now calculate from six same-source
UBIQ anchors instead of falling back to a broad steel blend or bound-only
row. FL-26 250 mm timber returns `Ln,w 53.5`, `Ln,w+CI 52`, `Rw 61.5`;
FL-24 250 mm timber returns `Ln,w 54.5`, `Ln,w+CI 53`, `Rw 60.5`; and
FL-26 250 mm bare returns `Ln,w 61.5`, `Ln,w+CI 60`, `Rw 61.5`. Exact
source rows still win, the existing FL-28 interpolation seed remains
unchanged, and carpet, missing-fill, field/building, and ASTM/IIC
aliases remain blocked. The next slice should prove card/report/API
surface parity for this new basis before widening another family.

That selected surface parity has now landed:

- landed gate:
  `broad_accuracy_open_web_supported_band_similarity_surface_parity_plan`
- selection status:
  `broad_accuracy_open_web_supported_band_similarity_surface_parity_landed_selected_coverage_refresh`
- landed implementation:
  `apps/web/features/workbench/open-web-supported-band-similarity-surface.ts`
- landed contract:
  `packages/engine/src/broad-accuracy-open-web-supported-band-similarity-surface-parity-contract.test.ts`
- landed web surface:
  `apps/web/features/workbench/open-web-supported-band-similarity-surface-parity.test.ts`
- selected next action:
  `broad_accuracy_open_web_supported_band_similarity_coverage_refresh_plan`
- selected next file:
  `packages/engine/src/broad-accuracy-open-web-supported-band-similarity-coverage-refresh-contract.test.ts`
- selected next label:
  open-web supported-band similarity coverage refresh

Surface parity keeps the runtime values frozen while cards, method
dossier, saved replay, server snapshot replay, calculator API,
impact-only API, and Markdown report all show `Open-web steel
supported-band similarity` with the same
`predictor_lightweight_steel_open_web_supported_band_similarity_estimate`
basis, `89.5%` fit, exact-source precedence, and non-lab boundaries.
FL-26 250 mm timber remains `Ln,w 53.5`, `Ln,w+CI 52`, `Rw 61.5`.

That selected coverage refresh has now landed:

- landed gate:
  `broad_accuracy_open_web_supported_band_similarity_coverage_refresh_plan`
- selection status:
  `broad_accuracy_open_web_supported_band_similarity_coverage_refresh_landed_selected_wall_multileaf_triple_leaf_solver`
- landed implementation:
  `packages/engine/src/broad-accuracy-open-web-supported-band-similarity-coverage-refresh.ts`
- landed contract:
  `packages/engine/src/broad-accuracy-open-web-supported-band-similarity-coverage-refresh-contract.test.ts`
- selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_plan`
- selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-contract.test.ts`
- selected next label:
  wall multileaf triple-leaf calibrated solver

Coverage refresh is no-runtime. It pins the open-web steel
supported-band similarity values, including FL-26 250 mm timber
`Ln,w 53.5`, keeps exact-source precedence and the FL-28 seed
unchanged, keeps carpet, missing-fill, field, building, and ASTM/IIC
aliases blocked, and records direct-fixed open-web plus open-box timber
as ranked follow-ups. The selected next lane is the wall multileaf
triple-leaf calibrated solver so the broad-accuracy work moves back to
a wall family solver rather than another source inventory crawl.

That wall solver has now landed:

- landed gate:
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_plan`
- selection status:
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_landed_selected_surface_parity`
- landed implementation:
  `packages/engine/src/dynamic-airborne-broad-accuracy-wall-triple-leaf-calibrated.ts`
- landed contract:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-contract.test.ts`
- runtime basis:
  `broad_accuracy_wall_triple_leaf_nrc2024_calibrated_two_cavity_solver`
- selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_surface_parity_plan`
- selected next file:
  `apps/web/features/workbench/wall-triple-leaf-calibrated-solver-surface-parity.test.ts`
- selected next label:
  wall triple-leaf calibrated solver surface parity

The gate promotes only explicit NRC 2024 source-family Type C /
glass-fiber grouped triple-leaf element-lab stacks. Assembly B now
returns `Rw 49 / STC 60 / C 1.4 / Ctr -7.4`; Assembly A returns
`Rw 58 / STC 64`; Assembly D returns `Rw 55 / STC 65`. These values are
calibrated family-physics predictions with a `+/-4 dB` budget, not exact
source promotions. Rockwool / MLV / plaster local stacks, generic
gypsum or glasswool substitutions, duplicate or missing grouped
topology, field outputs, and building outputs remain outside the lane.
The selected next action has landed as surface parity, not another
source crawl.

Surface parity has now landed:

- landed gate:
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_surface_parity_plan`
- selection status:
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_surface_parity_landed_selected_coverage_refresh`
- landed implementation:
  `apps/web/features/workbench/wall-triple-leaf-calibrated-solver-surface.ts`
- landed test:
  `apps/web/features/workbench/wall-triple-leaf-calibrated-solver-surface-parity.test.ts`
- selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_coverage_refresh_plan`
- selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-coverage-refresh-contract.test.ts`
- selected next label:
  wall triple-leaf calibrated solver coverage refresh

Cards, posture, dynamic branch copy, method/corridor dossiers, saved
replay, server snapshot replay, calculator API payloads, and Markdown
report lines now expose the same calibrated source-family basis and
`+/-4 dB` budget. Mixed lab-plus-field requests keep `R'w` and `DnT,w`
parked as field input prompts instead of borrowing lab `Rw`; this is an
intentional non-aliasing boundary. The selected next action is a coverage
refresh to update the executable matrix and choose the next highest-ROI
coverage gap.

That coverage refresh has now landed:

- landed gate:
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_coverage_refresh_plan`
- selection status:
  `broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_coverage_refresh_landed_selected_local_substitution_mapping`
- landed implementation:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-coverage-refresh.ts`
- landed contract:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-coverage-refresh-contract.test.ts`
- selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_mapping_plan`
- selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-mapping-contract.test.ts`
- selected next label:
  wall triple-leaf local substitution mapping

The refresh is no-runtime: Assembly B stays `Rw 49`, Assembly A stays
`Rw 58`, and Assembly D stays `Rw 55` on the NRC 2024 Type C /
glass-fiber calibrated basis. The matrix keeps mixed `R'w` / `DnT,w`,
building, exact-source admission, duplicate grouped topology, and partial
grouped topology as explicit boundaries. Generic gypsum / glasswool and
local Rockwool / MLV / plaster stacks are now selected for local
substitution mapping because they are the closest practical wall
coverage blocker; direct-fixed open-web and open-box timber remain
ranked follow-ups.

That local substitution mapping has now landed:

- landed gate:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_mapping_plan`
- selection status:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_mapping_landed_no_runtime_selected_formula_corridor`
- landed implementation:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-mapping.ts`
- landed contract:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-mapping-contract.test.ts`
- selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_formula_corridor_plan`
- selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-formula-corridor-contract.test.ts`
- selected next label:
  wall triple-leaf local substitution formula corridor

The no-runtime mapping admits generic gypsum / glasswool and local
Rockwool / MLV / plaster grouped stacks only as formula corridor
candidates. It does not call them NRC source-family rows, does not move
`Rw 49`, and does not promote field/building aliases. The next corridor
must own the actual numeric substitution terms and visible parity before
calculator coverage can broaden.

That formula corridor has now landed:

- landed gate:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_formula_corridor_plan`
- selection status:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_formula_corridor_landed_no_runtime_selected_runtime_corridor`
- landed implementation:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-formula-corridor.ts`
- landed contract:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-formula-corridor-contract.test.ts`
- selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor_plan`
- selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor-contract.test.ts`
- selected next label:
  wall triple-leaf local substitution runtime corridor

The formula corridor is still no-runtime. Generic gypsum / glasswool
has an executable source-absent lab `Rw 49.3` design corridor and a
`+/-6 dB` not-measured budget. Local Rockwool / MLV / plaster has an
executable source-absent lab `Rw 52.8` design corridor and a `+/-8 dB`
not-measured budget. Exact measured rows, the NRC Type C / glass-fiber
calibrated control, field/building boundaries, and missing metric
adapters still take precedence over the corridor.

That runtime corridor has now landed:

- landed gate:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor_plan`
- selection status:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor_landed_selected_surface_parity`
- landed implementation:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor.ts`
- landed contract:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor-contract.test.ts`
- selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_surface_parity_plan`
- selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-surface-parity-contract.test.ts`
- selected next label:
  wall triple-leaf local substitution surface parity

The runtime corridor exposes only lab `Rw`: generic gypsum / glasswool
returns live ISO-rounded `Rw 50` from a `Rw 49.3` formula design corridor,
and local Rockwool / MLV / plaster returns live ISO-rounded `Rw 53` from
a `Rw 52.8` formula design corridor. The local stack's old Gate G
`Rw 50` value is now superseded by the source-absent formula corridor,
while exact rows and the NRC source-family calibrated control still
outrank it. `STC`, `C`, `Ctr`, field, and building outputs remain
unsupported until later adapter gates.

Current validation status:

- Full `pnpm calculator:gate:current` passed on 2026-05-19 before the
  open-box timber formula sprint: engine 459 files / 2635 tests, web 87
  files / 363 passed + 18 skipped, repo build 5/5, with only the known
  non-fatal optional `sharp/@img` and Zustand test-storage warnings.
- The explicit local-substitution surface parity has now landed with
  selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_surface_parity_landed_selected_coverage_refresh`.
  Cards, route posture, dynamic branch copy, method dossier, local saved
  replay, server snapshot replay, calculator API payloads, and Markdown
  reports now expose the same Rw-only candidate, method, warning, and
  not-measured budgets. Generic gypsum / glasswool remains `Rw 50`;
  local Rockwool / MLV / plaster remains `Rw 53`; unsupported `STC`,
  `C`, `Ctr`, field, and building boundaries stay explicit. Its selected
  coverage refresh has now landed in
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_coverage_refresh_plan`
  in
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-coverage-refresh-contract.test.ts`.
- That coverage refresh has now landed with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_coverage_refresh_landed_selected_lab_spectrum_adapter`.
  It keeps generic `Rw 50` and local `Rw 53` frozen, keeps `R'w` and
  `DnT,w` under explicit field-context ownership, keeps building
  prediction blocked, and leaves direct-fixed open-web plus open-box
  timber as ranked floor follow-ups. Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-contract.test.ts`.
  Selected next label: wall triple-leaf local substitution lab STC/C/Ctr
  spectrum adapter.
- The lab spectrum adapter has now landed with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_landed_selected_surface_parity`.
  It promotes complete element-lab local-substitution `STC`, `C`, and
  `Ctr` from the calculated curve while preserving `Rw 50` / `Rw 53`.
  Generic is `STC 61 / C 1.6 / Ctr -7.2`; local Rockwool / MLV /
  plaster is `STC 64 / C 1.6 / Ctr -7.2`. Field/building outputs and
  hostile topology remain separate protected boundaries. Selected next
  action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_surface_parity_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-surface-parity-contract.test.ts`.
  Selected next label: wall triple-leaf local substitution lab spectrum
  adapter surface parity.
- The adapter surface parity closeout has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_surface_parity_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_surface_parity_landed_selected_coverage_refresh`.
  It does not move runtime values. Cards, route posture, dynamic trace,
  method dossiers, local saved replay, server snapshot replay,
  calculator API payloads, and Markdown reports now expose the same lab
  spectrum adapter candidate, method, warning, values, and source-absent
  budgets. Generic stays `Rw 50 / STC 61 / C 1.6 / Ctr -7.2`; local
  Rockwool / MLV / plaster stays `Rw 53 / STC 64 / C 1.6 / Ctr -7.2`.
  Field/building outputs, exact precedence, and hostile topology remain
  protected. Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_coverage_refresh_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-coverage-refresh-contract.test.ts`.
  Selected next label: wall triple-leaf local substitution lab spectrum
  adapter coverage refresh.
- The lab spectrum adapter coverage refresh has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_coverage_refresh_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_lab_spectrum_adapter_coverage_refresh_landed_selected_field_context_harmonization`.
  It is no-runtime: generic stays `Rw 50 / STC 61 / C 1.6 / Ctr
  -7.2`, local Rockwool / MLV / plaster stays `Rw 53 / STC 64 / C 1.6 /
  Ctr -7.2`, and STC-only stays on the calculated lab spectrum adapter.
  Exact/calibrated precedence, mixed field `R'w` / `DnT,w`, building,
  duplicate grouping, and partial topology remain protected. Selected
  next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_harmonization_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization-contract.test.ts`.
  Direct-fixed open-web and open-box timber remain ranked follow-ups
  behind this same-family wall field context lane.
- The field context harmonization has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_harmonization_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_harmonization_landed_selected_field_context_surface_parity`.
  It is runtime movement for complete local Rockwool / MLV / plaster
  grouped triple-leaf `field_between_rooms` requests. The lab
  local-substitution curve (`Rw 53 / STC 64 / C 1.6 / Ctr -7.2`) is the
  direct anchor, and the current contract fixture returns `R'w 51` and
  `DnT,w 53` with a `+/-10 dB` source-absent field error budget. Missing
  field context remains `needs_input`, building prediction remains
  unsupported, and exact measured rows still win. Selected next action:
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_surface_parity_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-surface-parity-contract.test.ts`.
  Direct-fixed open-web and open-box timber remain ranked follow-ups
  behind this wall surface-parity closeout.
- The field-context surface parity closeout has now landed as
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_surface_parity_plan`
  with selection status
  `broad_accuracy_wall_multileaf_triple_leaf_local_substitution_field_context_surface_parity_landed_selected_open_web_direct_fixed_lining_transfer_owner`.
  It is no-runtime: cards, route posture, dynamic trace, method
  dossiers, saved replay, server snapshot replay, calculator API
  payloads, and Markdown reports now preserve the same
  local-substitution field-context basis, warning, values, and budget.
  The contract fixture remains `R'w 51 / DnT,w 53`, the workbench/API
  fixture remains `R'w 52 / DnT,w 53`, and both carry the `+/-10 dB`
  source-absent field budget without becoming measured field evidence or
  lab `Rw`/`STC` relabels. Selected next action:
  `broad_accuracy_floor_open_web_direct_fixed_lining_transfer_owner_contract_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-transfer-owner-contract.test.ts`.
  Direct-fixed open-web is selected next; open-box timber remains the
  ranked follow-up.
- The direct-fixed open-web transfer-owner contract has now landed as
  `broad_accuracy_floor_open_web_direct_fixed_lining_transfer_owner_contract_plan`
  with selection status
  `broad_accuracy_floor_open_web_direct_fixed_lining_transfer_owner_landed_no_runtime_selected_formula_corridor`.
  This no-runtime gate classifies 54 UBIQ direct-fixed open-web exact
  rows across FL-23, FL-25, and FL-27; owns carrier geometry, deck mass,
  upper finish delta, direct lining attachment, `Ln,w` / `CI` /
  `Ln,w+CI` transfer, `Rw` bridge, exact precedence, source-absent
  budget, and negative boundaries; and keeps resilient suspended-ceiling
  rows, open-box timber, field/building outputs, and ASTM/IIC aliases
  blocked. Selected next action:
  `broad_accuracy_floor_open_web_direct_fixed_lining_formula_corridor_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-formula-corridor-contract.test.ts`.
  Selected next label: floor open-web direct-fixed lining formula
  corridor.
- The direct-fixed open-web formula corridor has now landed as
  `broad_accuracy_floor_open_web_direct_fixed_lining_formula_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_web_direct_fixed_lining_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  This is no-runtime formula-corridor work: it defines same-family
  direct-fixed interpolation from the 54 UBIQ exact rows by FL-23 /
  FL-25 / FL-27 board schedule, 16/19 mm INEX deck, finish package, and
  200/300/400 mm carrier depth. The representative 250 mm FL-23 / 19 mm
  timber-underlay design row is `Ln,w 71`, `CI -0.5`, `Ln,w+CI 70.5`,
  `Rw 51`, and `Rw+Ctr 43.5`, with source-absent design budgets of
  `+/-4 dB` for `Ln,w` and `+/-3 dB` for `Rw`. Exact rows still win;
  out-of-band carrier depths, field/building outputs, and ASTM/IIC
  aliases remain blocked. Selected next action:
  `broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-runtime-corridor-contract.test.ts`.
  Selected next label: floor open-web direct-fixed lining runtime
  corridor.
- The direct-fixed open-web runtime corridor has now landed as
  `broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_web_direct_fixed_lining_runtime_corridor_landed_selected_surface_parity`.
  It promotes complete source-absent element-lab direct-fixed open-web
  stacks through
  `broad_accuracy_floor_open_web_direct_fixed_lining_direct_source_interpolation_formula_corridor`
  instead of the broad floor-family fallback. FL-23/FL-25/FL-27
  same-family source anchors now cover mid-depth direct-fixed variants:
  the 250 mm FL-23 / 19 mm timber-underlay runtime returns `Ln,w 71`,
  `CI -0.5`, `Ln,w+CI 70.5`, `Rw 51`, and `Rw+Ctr 43.5`; FL-25 bare and
  FL-27 carpet variants keep their formula-corridor pins. Runtime impact
  budgets stay visible as not-measured source-absent budgets (`+/-4 dB`
  for `Ln,w`, `+/-1.5 dB` for `CI`, `+/-4.5 dB` for `Ln,w+CI`; the
  formula owner still carries `+/-3 dB` for `Rw`). Exact rows still win;
  resilient supported-band stacks, out-of-band depths, duplicate carriers,
  field/building outputs, and ASTM/IIC aliases remain outside the runtime.
  Selected next action:
  `broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-surface-parity-contract.test.ts`.
  Selected next label: floor open-web direct-fixed lining surface parity.
- The direct-fixed open-web surface parity gate has now landed as
  `broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_plan`
  with selection status
  `broad_accuracy_floor_open_web_direct_fixed_lining_surface_parity_landed_selected_coverage_refresh`.
  It keeps output cards, route posture, impact lane labels, confidence
  provenance, metric-basis copy, corridor/method dossier, local saved
  replay, server snapshot replay, calculator API, impact-only API, and
  Markdown report on the same source-absent direct-fixed lab basis without
  moving runtime values. The visible FL-23 timber pin still reports
  `Ln,w 71`, `CI -0.5`, `Ln,w+CI 70.5`, `Rw 51`, and `Rw+Ctr 43.5`
  inside the FL-23/FL-25/FL-27 direct-fixed source grid with
  source-absent budgets. Exact rows, resilient supported-band stacks,
  out-of-band depths, duplicate carriers, field/building outputs, and
  ASTM/IIC aliases remain outside this lane. Selected next action:
  `broad_accuracy_floor_open_web_direct_fixed_lining_coverage_refresh_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-floor-open-web-direct-fixed-lining-coverage-refresh-contract.test.ts`.
  Selected next label: floor open-web direct-fixed lining coverage
  refresh.
- The direct-fixed open-web coverage refresh has now landed as
  `broad_accuracy_floor_open_web_direct_fixed_lining_coverage_refresh_plan`
  with selection status
  `broad_accuracy_floor_open_web_direct_fixed_lining_coverage_refresh_landed_selected_open_box_timber_transfer_owner`.
  This no-runtime coverage refresh moves the FL-23/FL-25/FL-27
  direct-fixed lane out of follow-up status and into the broad matrix:
  FL-23 keeps `Ln,w 71`, `CI -0.5`, `Ln,w+CI 70.5`, `Rw 51`, and
  `Rw+Ctr 43.5`; FL-25 keeps `Ln,w 77`; FL-27 keeps `Ln,w 63`. Exact
  source precedence stays first for the 300 mm FL-23 exact row,
  resilient supported-band stacks stay on their separate lane,
  out-of-band depths and duplicate carriers stay outside direct-fixed,
  and field/building plus ASTM/IIC outputs remain boundary rows.
  Selected next action:
  `broad_accuracy_floor_open_box_timber_similarity_transfer_owner_contract_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-transfer-owner-contract.test.ts`.
  Selected next label: floor open-box timber similarity transfer owner.
- The open-box timber similarity transfer-owner contract has now landed
  as
  `broad_accuracy_floor_open_box_timber_similarity_transfer_owner_contract_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_similarity_transfer_owner_landed_no_runtime_selected_formula_corridor`.
  This no-runtime owner gate classifies 15 TUAS open-box timber exact
  rows on the 370 mm `open_box_timber_slab` carrier, separates 10
  predictor-owned rows from 5 exact-only hybrid / fragmented package
  rows, and owns the open-box support family, laminate/EPS finish pair,
  upper package interaction, lower ceiling family, fragmented-package
  exact equivalence, ISO lab `Ln,w` / `CI` / `CI,50-2500` / `Ln,w+CI`
  transfer, `Rw` / companion `Rw+C` semantics, exact precedence,
  source-absent budget, and negative boundaries. Open-web steel, raw bare
  open-box carriers, disjoint duplicate roles, partial
  laminate/EPS finishes, field/building outputs, and ASTM/IIC aliases
  stay blocked. Selected next action:
  `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-formula-corridor-contract.test.ts`.
  Selected next label: floor open-box timber similarity formula corridor.
- The open-box timber similarity formula corridor has now landed as
  `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_similarity_formula_corridor_landed_no_runtime_selected_runtime_corridor`.
  It is no-runtime formula-corridor work: TUAS same-family open-box
  package probes now expose design payloads such as `Ln,w 50.8` /
  `Rw 66` for dry gypsum-fiber, with `+/-7 dB` impact and `+/-6 dB`
  airborne design budgets. Exact rows, raw bare open-box carriers,
  exact-only hybrid and mixed staged packets, field/building outputs, and
  ASTM/IIC aliases remain blocked. Selected next action:
  `broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-runtime-corridor-contract.test.ts`.
  Selected next label: floor open-box timber similarity runtime corridor.
- The open-box timber similarity runtime corridor has now landed as
  `broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_similarity_runtime_corridor_landed_selected_surface_parity`.
  Complete source-absent dry gypsum-fiber, thin laminate/EPS, and
  reinforced-ceiling open-box timber package-transfer cases now promote
  through the
  `broad_accuracy_floor_open_box_timber_similarity_package_transfer_formula_corridor`
  runtime basis. The dry gypsum-fiber runtime pin is `Ln,w 50.8`,
  `CI,50-2500 3.3`, and `Rw 66`; the not-measured budgets stay visible
  as `+/-7 dB` for `Ln,w`, `+/-2.5 dB` for `CI,50-2500`, and `+/-6 dB`
  for `Rw`. Exact TUAS rows still win; raw bare open-box, exact-only
  hybrid, mixed staged, field/building, and ASTM/IIC aliases stay
  blocked. Selected next action:
  `broad_accuracy_floor_open_box_timber_similarity_surface_parity_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-surface-parity-contract.test.ts`.
  Selected next label: floor open-box timber similarity surface parity.
- The open-box timber similarity surface parity gate has now landed as
  `broad_accuracy_floor_open_box_timber_similarity_surface_parity_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_similarity_surface_parity_landed_selected_coverage_refresh`.
  This is no-runtime surface work: cards, route posture, impact lane
  labels, confidence provenance, metric-basis copy, method dossier, local
  saved replay, server snapshot replay, calculator API, impact-only API,
  and Markdown report now expose the same source-absent open-box timber
  package-transfer lab basis. The dry gypsum-fiber pin remains
  `Ln,w 50.8`, `CI,50-2500 3.3`, and `Rw 66` with not-measured budgets
  `+/-7 dB`, `+/-2.5 dB`, and `+/-6 dB`. Exact TUAS rows, raw bare
  open-box, exact-only hybrid, mixed staged, field/building, and
  ASTM/IIC boundaries remain protected. Selected next action:
  `broad_accuracy_floor_open_box_timber_similarity_coverage_refresh_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-similarity-coverage-refresh-contract.test.ts`.
  Selected next label: floor open-box timber similarity coverage refresh.
- The open-box timber similarity coverage refresh has now landed as
  `broad_accuracy_floor_open_box_timber_similarity_coverage_refresh_plan`
  with selection status
  `broad_accuracy_floor_open_box_timber_similarity_coverage_refresh_landed_selected_exact_only_hybrid_fragmentation_policy`.
  This no-runtime coverage refresh moves the package-transfer lane into
  the broad matrix, preserves exact source precedence, keeps `Ln,w 50.8`,
  `CI,50-2500 3.3`, and `Rw 66`, and leaves raw bare, exact-only
  hybrid, mixed staged, field/building, and ASTM/IIC as explicit
  boundaries. Selected next action: exact-only hybrid fragmentation
  policy,
  `broad_accuracy_floor_open_box_timber_exact_only_hybrid_fragmentation_policy_plan`.
  Selected next file:
  `packages/engine/src/broad-accuracy-floor-open-box-timber-exact-only-hybrid-fragmentation-policy-contract.test.ts`.
- Pre-sprint revalidation:
  [CHECKPOINT_2026-05-19_PRE_SPRINT_REVALIDATION_AND_OPEN_BOX_FORMULA_PLAN.md](./CHECKPOINT_2026-05-19_PRE_SPRINT_REVALIDATION_AND_OPEN_BOX_FORMULA_PLAN.md).
  The full current gate was green before the formula sprint; the
  no-runtime formula, runtime, and surface parity gates have now landed,
  leaving coverage-matrix refresh next.
