# Post-V1 Route/Input Family First-Class Surface V1 - 2026-06-29

Status:
`post_v1_route_input_family_first_class_surface_v1_landed_input_surface_selected_post_v1_industry_grade_golden_scenario_matrix_v1`

Action:
`post_v1_route_input_family_first_class_surface_v1_plan`

Plan doc:
`docs/calculator/POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_PLAN_2026-06-29.md`

Selected by:
`post_v1_spectral_rating_backbone_v1_landed_support_selected_post_v1_route_input_family_first_class_surface_v1`

Selected candidate:
`post_v1_route_input_family_first_class_surface_v1`

Selected next action:
`post_v1_industry_grade_golden_scenario_matrix_v1_plan`

Selected next file:
`packages/engine/src/post-v1-industry-grade-golden-scenario-matrix-v1-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_PLAN_2026-06-30.md`

Selected next label:
`post-V1 industry-grade golden scenario matrix V1`

Previous support action:
`post_v1_spectral_rating_backbone_v1_plan`

Previous support status:
`post_v1_spectral_rating_backbone_v1_landed_support_selected_post_v1_route_input_family_first_class_surface_v1`

Previous support file:
`packages/engine/src/post-v1-spectral-rating-backbone-v1-contract.test.ts`

Previous support selected candidate:
`post_v1_spectral_rating_backbone_v1`

Previous support selected next label:
`post-V1 route/input family first-class surface V1`

Prior rerank:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_plan`

Prior rerank status:
`post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_landed_no_runtime_selected_post_v1_spectral_rating_backbone_v1`

Previous support counters:
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`,
`reusableRatingProceduresMoved: 3`, and
`unsupportedBoundariesProtected: 6`.

Landed input-surface counters:
`firstClassRouteFamiliesCaptured: 6`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 6`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 8`.

## Purpose

The spectral rating backbone support slice moved reusable rating/band
procedure ownership without opening runtime values. The next highest-ROI
move is to make route/input families first-class enough that arbitrary
user stacks fail with precise route-required input prompts instead of
falling into broad family fallback, metric aliasing, or source-row
proximity.

This is an input-surface/boundary slice, not a broad source crawl.

## Landed Implementation

The slice now adds
`packages/engine/src/post-v1-route-input-family-first-class-surface-v1.ts`
and
`packages/engine/src/post-v1-route-input-family-first-class-surface-v1-contract.test.ts`.
The shared input-completeness schema now accepts first-class route
families for ceiling/plenum, roof, opening/facade indoor,
opening/facade outdoor-indoor OITC, ASTM IIC/AIIC impact rating, and
field/building flanking context. Shared answer-boundary and resolver
route schemas can represent `roof`, `opening`, and `facade` without
pretending those routes are wall/floor/ceiling.

The builder returns typed `AcousticInputCompleteness` rows with concrete
`needs_input` field ids for route intent, mounting context, plenum
properties, facade/outdoor context, OITC band basis, opening area-energy
fields, ASTM impact band basis, impact field context, and
building/flanking terms. It keeps source absence out of
`missingPhysicalInputs` and keeps unsupported adjacent metric bases
explicit. It moves no runtime values and imports no source rows.

## Selection Card

User construction / formula family:
mixed wall, floor, ceiling, roof, opening/facade, outdoor-indoor OITC,
and impact stacks whose formula route is blocked by missing physical
context.

Target outputs to open:
none by default. This slice should improve `needs_input` precision and
route selection safety for later `Rw`, `R'w`, `Dn,w`, `DnT,w`, `STC`,
`OITC`, `Ln,w`, `DeltaLw`, `IIC`, and `AIIC` owners.

Route:
first-class route/input family records consumed by resolver candidates
and target-output support.

Required physical inputs to classify:

- route intent: wall, ceiling, roof, floor, opening/facade,
  outdoor-indoor facade, impact vs airborne;
- mounting/framing/topology: studs, joists, resilient supports,
  suspended ceiling/plenum, direct-fixed vs resilient;
- formula-critical context: element area, room volumes, RT60 or
  normalization basis, flanking/junction context, cavity depth, dynamic
  stiffness, flow resistivity, load basis, opening area/count/seal class;
- rating basis: owned curve, exact measured row, source report, field,
  building prediction, or unsupported basis.

`needs_input` behavior:
missing route-required physical inputs must be returned as concrete
keys tied to the route family. Do not silently default across route
families when a missing input changes the formula family.

`unsupported` boundaries:

- no OITC from ISO/STC curves;
- no IIC/AIIC from ISO `Ln,w` / `DeltaLw`;
- no ceiling impact inferred from airborne ceiling boards;
- no roof/facade route from indoor partition context;
- no source-row proximity substitution without exact or bounded
  same-family evidence;
- no broad catalog/source crawl.

Expected counters:
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`requiredPhysicalInputsCaptured: 6`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 8`.

## Implementation Scope

Start files:

- `packages/shared/src/domain/airborne-context.ts`
- `packages/shared/src/domain/assembly.ts`
- `packages/engine/src/dynamic-calculator-route-input-topology.ts`
- `packages/engine/src/layer-combination-resolver-registry.ts`
- `packages/engine/src/target-output-support.ts`
- `packages/engine/src/post-v1-route-input-family-first-class-surface-v1-contract.test.ts`

Actions:

- inventory current route-required input keys for opening/facade OITC,
  ceiling/roof/suspended-ceiling, impact, and airborne field/building
  families;
- expose a small route/input family surface that can be asserted by
  resolver contracts without changing runtime values;
- prove missing inputs remain `needs_input` and unsupported adjacent
  metric bases remain `unsupported`;
- pick the next value-moving, accuracy, or boundary owner after this
  input-surface closes.

Do not:

- create a source catalog;
- retune formulas;
- add confidence labels;
- polish UI;
- turn route/input family records into a generic library detached from
  current calculator routes.
