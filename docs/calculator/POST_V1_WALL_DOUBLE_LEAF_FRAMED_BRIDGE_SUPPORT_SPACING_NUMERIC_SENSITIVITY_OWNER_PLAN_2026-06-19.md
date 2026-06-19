# Post-V1 Wall Double-Leaf/Framed Bridge Support-Spacing Numeric Sensitivity Owner - 2026-06-19

## Purpose

This runtime owner follows the porous absorber coverage-ratio numeric
sensitivity coverage refresh. It targets the next adjacent
calculator-first physical input in the same double-leaf/framed wall
formula family: `studSpacingMm` / `supportSpacingMm`.

The current route already treats support spacing as route-required
input for double-leaf/framed bridge ownership, but the live bridge
coupling term is mostly bridge-class driven. A user can therefore supply
400 mm, 600 mm, or wider spacing and not get a defensible numeric change
for routes where spacing should affect structure-borne bridge coupling.

This owner must make support spacing numerically active for owned
double-leaf/framed bridge classes while preserving missing-input and
unsupported boundaries. This is calculator runtime work, not a broad
source crawl, UI polish, confidence-copy work, or docs-only cleanup.

Owner action:

`post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-bridge-support-spacing-numeric-sensitivity-owner-contract.test.ts`

## Previous Refresh

Previous refresh:

`post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-coverage-ratio-numeric-sensitivity-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_bridge_support_spacing_numeric_sensitivity_owner`

Previous owner status:

`post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Previous refresh selected candidate:

`wall.double_leaf_framed.porous_absorber_coverage_ratio_numeric_sensitivity_owner`

Previous refresh counters:

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Selected Candidate

`wall.double_leaf_framed.bridge_support_spacing_numeric_sensitivity_owner`

## Selection Card

- User construction / formula family:
  double-leaf/framed wall with explicit side leaf groups, cavity depth,
  porous damping input, bridge class, support topology, and support
  spacing.
- Target outputs to improve:
  lab `Rw`, `STC`, `C`, `Ctr`; field/building `R'w`, `Dn,w`, `Dn,A`,
  `DnT,w`, and `DnT,A` when those adapters are already owned.
- Formula route:
  existing source-absent double-leaf/framed formula curve, with the
  bridge-coupling delta made a function of support spacing for owned
  bridge classes before lab/field/building adapters run.
- Required physical inputs:
  side A/B leaf groups, cavity depth, cavity absorption class,
  `flowResistivityPaSM2`, bridge class / support topology, and
  `supportSpacingMm` (`studSpacingMm` in the current context payload).
- `needs_input` behavior:
  missing support spacing remains `needs_input` for double-leaf/framed
  bridge routes that require it; the owner must not guess spacing.
- Unsupported boundaries:
  direct-fixed bridge remains owned by the existing direct-fixed
  separate runtime, impact/ASTM aliases remain unsupported, and
  opening/leak paths remain outside this owner.

## Evidence And Formula Guard

This owner may use a bounded engineering correction rather than a broad
source import. The correction must stay small and monotonic:

- 600 mm is the neutral current baseline for existing pins;
- tighter 400 mm support spacing should not improve the bridge term;
- wider spacing may improve bridge decoupling only inside a capped
  range and only for bridge classes where support spacing affects
  structure-borne transmission.

NRC evidence supports the direction and bounded scale:

- NRC Construction Technology Update No. 1 reports that increasing
  stud/resilient-channel spacing improves sound reduction and that STC
  usually increases by one or two points when going from 400 mm to
  600 mm spacing:
  `https://nrc-publications.canada.ca/fra/voir/td/?id=7c9971a9-227a-433a-8c06-cd00af83a236`
- NRC IRC-IR-832 explains that resilient-channel spacing affects
  structural power flow and shows larger spacing reducing
  structure-borne transmission until other paths dominate:
  `https://nrc-publications.canada.ca/fra/voir/td/?id=57dbff41-7b93-4621-bd17-ae2c6ab6c7e0`

The owner must not import rows from these sources. They are direction
and cap evidence for a bounded local correction.

## Expected Movement

Expected counters:

- `accuracyPromotedRequestShapes: 3`
- `accuracyPromotedTargetOutputs: 13`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 13`
- `runtimeFormulaRetunes: 1`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

Expected runtime behavior:

- `supportSpacingMm = 600` keeps the current baseline pins for the
  owned double-leaf/framed porous route.
- `supportSpacingMm = 400` and a wider spacing such as `800` or `1200`
  produce distinct lab and field/building values on the same owned
  route.
- the correction remains capped and does not turn spacing into a broad
  source-row alias.
- missing `supportSpacingMm` stays `needs_input` where the route
  requires bridge spacing.

## Implementation Steps

1. Add the owner contract that first proves current behavior is spacing
   insensitive for the selected request shape.
2. Add a bounded support-spacing correction to the double-leaf/framed
   bridge-coupling term.
3. Keep 600 mm as the baseline so existing pins remain stable unless
   the request explicitly changes spacing.
4. Re-probe lab, field, and building outputs for 400/600/wider spacing.
5. Preserve direct-fixed, missing support spacing, impact aliases, and
   opening/leak boundaries.
6. Add the owner to the current calculator gate and update live
   handoff docs with the progress ledger.

This is not a broad source crawl.

## Landed Closeout

Status:

`post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-bridge-support-spacing-numeric-sensitivity-owner-contract.test.ts`

Selected candidate:

`wall.double_leaf_framed.bridge_support_spacing_numeric_sensitivity_owner`

Runtime behavior:

- `supportSpacingMm = 400` returns lab `Rw/STC 45` and field/building
  values derived from that owned base curve.
- `supportSpacingMm = 600` keeps the existing baseline `Rw/STC 46`.
- `supportSpacingMm = 1200` returns lab `Rw/STC 47` and field/building
  values derived from that owned base curve.
- missing `supportSpacingMm` remains `needs_input`.
- impact aliases remain `unsupported`.
- direct-fixed double-leaf remains on the existing direct-fixed owner.

Counters:

- `accuracyPromotedRequestShapes: 3`
- `accuracyPromotedTargetOutputs: 13`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 13`
- `runtimeFormulaRetunes: 1`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

Selected next:

`post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-bridge-support-spacing-numeric-sensitivity-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_BRIDGE_SUPPORT_SPACING_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md`
/
`post-V1 wall double-leaf/framed bridge support-spacing numeric sensitivity coverage refresh`

This is not a broad source crawl.
