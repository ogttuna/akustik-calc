# Post-V1 Wall Double-Leaf/Framed Leaf Surface-Mass Numeric Sensitivity Owner Plan - 2026-06-22

## Purpose

This is the selected next runtime owner after the no-runtime rerank
following the wall double-leaf/framed cavity-depth numeric-sensitivity
coverage refresh.

The owner must make the double-leaf/framed route's side-leaf surface
mass sensitivity explicit and regression-protected for user-entered
wall stacks. It should stay inside the existing owned Gate S / Gate I /
Gate AR double-leaf/framed route and must not become a source crawl,
frontend polish pass, or broad formula rewrite.

Selected owner action:

`post_v1_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_owner_plan`

Selected owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-owner-contract.test.ts`

Selected owner plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_LEAF_SURFACE_MASS_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-22.md`

Selected owner label:

`post-V1 wall double-leaf/framed leaf surface-mass numeric sensitivity owner`

Selected candidate:

`wall.double_leaf_framed.leaf_surface_mass_numeric_sensitivity_owner`

## Rerank Handoff

Previous coverage refresh:

`post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_plan`

Previous coverage refresh file:

`packages/engine/src/post-v1-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-coverage-refresh-contract.test.ts`

Previous coverage refresh status:

`post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Landed rerank action:

`post_v1_runtime_first_route_family_rerank_after_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_plan`

Landed rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-coverage-refresh-contract.test.ts`

Landed rerank status:

`post_v1_runtime_first_route_family_rerank_after_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_leaf_surface_mass_numeric_sensitivity_owner`

Rerank counters: `candidateCount: 8`, `roiAnalysisIterations: 4`,
`estimatedNextRuntimeValuesMoved: 13`,
`estimatedNextAccuracyPromotedTargetOutputs: 13`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## Landing Result

Landed owner status:

`post_v1_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Selected coverage refresh action:

`post_v1_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_coverage_refresh_plan`

Selected coverage refresh file:

`packages/engine/src/post-v1-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_LEAF_SURFACE_MASS_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected coverage refresh label:

`post-V1 wall double-leaf/framed leaf surface-mass numeric sensitivity coverage refresh`

The owner pins the existing owned Gate S / Gate I / Gate AR
double-leaf/framed formula route to side-leaf surface mass and
mass-ratio inputs. Light `9.5 mm`, baseline `12.5 mm`, and heavy
`18 mm` gypsum leaves return lab `Rw/STC 43`, `46`, and `49`;
asymmetric `12.5 + 25 mm` leaves keep `leafMassRatio 2` active and
return lab `Rw/STC 49`. Field and building companions move from the
same direct curve. Missing side-leaf grouping remains `needs_input`;
`IIC` and `AIIC` remain `unsupported`. Counters:
`accuracyPromotedRequestShapes: 3`,
`accuracyPromotedTargetOutputs: 13`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 13`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Selection Card

- User construction / formula family: double-leaf/framed wall with
  explicit side A and side B leaf groups, one framed cavity, porous
  absorber inputs, and support topology already owned by the current
  context-owned route.
- Target outputs to protect: lab `Rw`, `STC`, `C`, and `Ctr`, plus
  owned field/building companions `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and
  `DnT,A` when requested with the existing route context.
- Route: owned Gate S direct lab formula feeding Gate I field and Gate
  AR building adapters. The runtime route must use side-leaf surface
  masses in total mass, leaf mass ratio, and mass-air-mass resonance
  terms before field/building adapters run.
- Required physical inputs: side A leaf group, side B leaf group,
  positive side-leaf surface masses from explicit layer surface mass or
  density/thickness, cavity depth, support topology, support spacing,
  bridge class, absorber coverage/thickness when present, and
  `flowResistivityPaSM2` when porous fill is user-supplied.
- `needs_input` behavior: missing side leaf groups, missing or
  non-positive side-leaf mass, missing cavity depth, missing support
  spacing, or missing required porous-flow input must remain
  `needs_input`; do not infer material density or surface mass from a
  nearby source family.
- `unsupported` boundaries: impact outputs such as `Ln,w`, `DeltaLw`,
  `IIC`, and `AIIC` remain unsupported for this airborne wall owner;
  ASTM aliases remain blocked unless an owned ASTM route exists; exact
  source rows and compatible anchors keep precedence when they truly
  match.
- Expected counters: `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `accuracyPromotedRequestShapes: 3`,
  `accuracyPromotedTargetOutputs: 13`, and `runtimeValuesMoved 13`.

## Planning Iterations

Iteration 1: Review the recently landed numeric-sensitivity chain for
this exact route. Flow resistivity, absorber coverage ratio, support
spacing, absorber thickness, and cavity depth are already owned and
coverage-refreshed or selected through the latest refresh. Do not reopen
those lanes.

Iteration 2: Inspect the local implementation before adding formulas.
The current double-leaf/framed bridge solver already carries
`sideALeafMassKgM2`, `sideBLeafMassKgM2`, `leafMassRatio`, total leaf
mass, and mass-air-mass terms. The next owner should therefore be a
bounded runtime accuracy/sensitivity contract, not a broad research
task.

Iteration 3: Compare alternatives. Frequency-band backbone and
building/flanking broadening remain strategically important, but this
candidate has lower blast radius and immediate accuracy impact for
arbitrary user-entered board/custom layer combinations. Broad source
crawling, UI cleanup, process cleanup, and confidence-label work are
out of scope.

Iteration 4: Implement only after this plan and the rerank contract are
green. The owner should probe side-leaf mass variants around the
existing baseline and verify that lab, field, and building values move
from the same owned direct curve while required-input and unsupported
boundaries stay honest.

## Implementation Steps

1. Create the owner contract file named above.
2. Build three same-topology wall requests that differ only in side-leaf
   surface mass or density/thickness-derived surface mass. Keep cavity
   depth, support spacing, bridge class, flow resistivity, absorber
   thickness, and absorber coverage fixed.
3. Assert that lab `Rw`/`STC`/`C`/`Ctr` and field/building companions
   move monotonically and are attributed to the owned Gate S / Gate I /
   Gate AR route rather than source aliases.
4. Assert missing side-leaf mass or missing side-leaf groups stays
   `needs_input` with precise owner fields.
5. Assert impact aliases remain `unsupported`.
6. Add the owner file to `tools/dev/run-calculator-current-gate.ts`.
7. Run the targeted owner test, the local double-leaf/framed owner
   chain if needed, and `pnpm calculator:gate:current`.

## Expected Owner Counters

- `accuracyPromotedRequestShapes: 3`
- `accuracyPromotedTargetOutputs: 13`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 13`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Stop Conditions

- Do not retune formula constants unless the owner test proves a real
  formula bug rather than an unprotected sensitivity axis.
- Do not import source rows for this owner; same-family measurements can
  be future calibration evidence, not a prerequisite for this bounded
  local route.
- Do not default unknown side-leaf mass, density, or thickness when the
  user stack lacks enough physical information.
- Do not promote field/building metrics from lab values without the
  existing owned adapters and their required context.
