# Post-V1 Gate EG/EH ASTM IIC/AIIC Exact-Band Input Owner Plan - 2026-06-07

## Role

Gate EG is a no-runtime numeric coverage/accuracy rerank after Gate EF.
It does not write a new acoustic formula, retune coefficients, crawl
source rows, or touch frontend implementation. Its job is to select the
highest-ROI calculator slice that still improves scope/accuracy while
preserving metric-basis boundaries.

Gate EG selects Gate EH:
`post_v1_floor_astm_iic_aiic_exact_band_input_owner_gate_eh_plan` in
`packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh-contract.test.ts`.

Selected candidate:
`floor.astm_iic_aiic_exact_band_user_input_owner_gap`.

Gate EG status:
`post_v1_next_numeric_coverage_gap_gate_eg_landed_no_runtime_selected_floor_astm_iic_aiic_exact_band_input_owner_gate_eh`.

## Why This Is The Highest ROI Now

Gate EF closed the composite-panel suspended-ceiling-only route boundary,
so the next selection pass rechecked the apparent floor-impact gaps.
Open-web field/building companions and open-box finished package
field/building companions are already live with their required explicit
contexts in the current implementation. Lower-treatment `DeltaLw`
subtraction across unrelated open-web, hollow-core, steel, Pliteq, or
Knauf rows remains a wrong metric-owner derivation. Opening/leak budget
tightening and open-box residual variants still need same-family
calibration or holdout evidence.

The ASTM path has a better ROI profile because the engine already owns a
real ASTM E492/E1007 exact-band metric owner:

- `packages/engine/src/impact-astm-e989.ts` calculates ASTM E989
  contour ratings from ASTM E492 lab bands and ASTM E1007 field bands.
- The owned outputs are `IIC` for lab ASTM E492/E989 and `AIIC` for
  field ASTM E1007/E989.
- Shared/API schemas already carry `exactImpactSource` and
  `standardMethod`.
- The current workbench band parser still stamps pasted one-third-octave
  impact bands as ISO (`ISO 10140-3` or `ISO 16283-2`), so user-supplied
  ASTM bands need an explicit owner/input boundary before any surface
  implementation is allowed to promote them.

This is calculator work because it protects the exact standard owner for
two real impact metrics and prepares new calculable request shapes
without aliasing ISO `Ln,w` / `L'nT,w` / `DeltaLw` into ASTM `IIC` /
`AIIC`.

## Gate EG Counters

- `candidateCount 12`
- `roiAnalysisIterations: 2`
- `estimatedNextInputOwnerLedgers 1`
- `estimatedFollowingNewCalculableMetricBasisRequestShapesIfGateEHProvesOwner 2`
- `newCalculableLayerTemplates 0`
- `newCalculableRequestShapes 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Gate EH Acceptance

Gate EH must stay narrow.

1. Pin lab ASTM E492/E989 exact-band input ownership for `IIC`.
2. Pin field ASTM E1007/E989 exact-band input ownership for `AIIC`.
3. Prove ISO one-third-octave impact bands still calculate ISO impact
   metrics only and do not publish ASTM `IIC` / `AIIC`.
4. Prove missing or ambiguous `standardMethod` remains a stopped
   boundary for ASTM publication instead of a guessed standard.
5. Prove Gate EH moves no formula coefficients, imports no source rows,
   and touches no frontend implementation unless a later explicitly
   selected surface slice opens that work.

Gate EH may define the required input-owner ledger and selected route
contract. If user-facing workbench controls are needed to expose ASTM
method selection, that must be a following input-surface slice after the
owner boundary is proven.

## Gate EH Landed Result

Gate EH landed as:
`post_v1_floor_astm_iic_aiic_exact_band_input_owner_gate_eh_plan`.

Gate EH status:
`post_v1_floor_astm_iic_aiic_exact_band_input_owner_gate_eh_landed_no_runtime_selected_next_numeric_coverage_gap_gate_ei`.

Gate EH owner:
`floor.astm_iic_aiic.exact_band_standard_method_owner`.

Gate EH pins the exact input-owner boundary without moving runtime
values. Lab ASTM E492/E989 exact one-third-octave sources own `IIC`;
field ASTM E1007/E989 exact one-third-octave sources own `AIIC`; both
use the existing ASTM E989 contour owner
`floor.astm_e989_impact_rating.contour_runtime` and basis
`astm_e989_impact_rating_metric_schema_adapter_bridge`. ISO
one-third-octave sources, missing `standardMethod`, ambiguous
standard-method text, lab/field metric mismatch, and ISO `Ln,w` /
`DeltaLw` formula aliases do not publish ASTM `IIC` / `AIIC`.

Gate EH counters:

- `acceptedOwnerLedgers: 1`
- `astmExactBandRequestShapesPinned: 2`
- `newCalculableLayerTemplates 0`
- `newCalculableRequestShapes 0`
- `runtimeBasisPromotions 0`
- `runtimeFormulaRetunes 0`
- `runtimeValuesMoved 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

Gate EH selected:
`post_v1_next_numeric_coverage_gap_gate_ei_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ei-contract.test.ts`.
