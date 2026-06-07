# Post-V1 Gate EI/EJ ASTM IIC/AIIC Exact-Band Input Surface Plan - 2026-06-07

## Role

Gate EI is a no-runtime numeric coverage/accuracy rerank after Gate EH.
It does not write a new acoustic formula, retune coefficients, crawl
source rows, or touch frontend implementation. Its job is to pick the
highest-ROI next calculator slice after the ASTM exact-band owner has
been proven.

Gate EI selects Gate EJ:
`post_v1_floor_astm_iic_aiic_exact_band_input_surface_gate_ej_plan` in
`packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts`.

Selected candidate:
`floor.astm_iic_aiic_user_band_input_surface`.

Gate EI status:
`post_v1_next_numeric_coverage_gap_gate_ei_landed_no_runtime_selected_floor_astm_iic_aiic_exact_band_input_surface_gate_ej`.

## Why This Is The Highest ROI Now

Gate EH closed the owner boundary:

- lab ASTM E492/E989 one-third-octave sources own `IIC`;
- field ASTM E1007/E989 one-third-octave sources own `AIIC`;
- ISO one-third-octave sources, missing/ambiguous `standardMethod`, and
  ISO `Ln,w` / `DeltaLw` routes do not publish ASTM ratings.

After that proof, the highest remaining ROI is not another finite
source row and not an ISO-to-ASTM alias. The relevant standard-method
boundary is ASTM E492/E1007 through ASTM E989, and the engine plus
shared/API schemas already have the pieces needed for exact ASTM band
calculation:

- `packages/engine/src/impact-astm-e989.ts` owns the ASTM E989 contour
  rating runtime.
- `packages/shared/src/domain/exact-impact-source.ts` carries
  `exactImpactSource.standardMethod`.
- `packages/shared/src/api/estimate.ts` and
  `packages/shared/src/api/impact-only.ts` already accept
  `exactImpactSource`.

The remaining gap is the selected input surface: user/import paths must
be able to send explicitly ASTM-labelled exact bands into that owner
without silently treating ISO bands as ASTM. Gate EJ must therefore keep
the boundary narrow:

1. ASTM E492/E989 lab exact bands may publish `IIC`.
2. ASTM E1007/E989 field exact bands may publish `AIIC`.
3. ISO bands, missing method, ambiguous method, lab/field mismatch, and
   formula-derived ISO single-number outputs remain stopped boundaries.
4. No ISO `Ln,w`, `L'nT,w`, `DeltaLw`, `CI`, or `CI,50-2500` answer may
   be aliased to ASTM `IIC` / `AIIC`.

This improves calculator scope because a real user-supplied exact ASTM
band measurement can become a defensible standard calculation, while
preserving the formula/metric boundary for all layer-derived ISO impact
routes.

## Gate EI ROI Iterations

Iteration 1 rechecked closed formula-route candidates after Gate EH.
Composite-panel, heavy-concrete lower-treatment, mass-timber/CLT,
lightweight concrete, steel visible formula input, wall common
flat/multicavity, local-substitution, CLT, masonry, LSF, timber-stud,
and exact-source runtime-basis work are already closed or already
runtime-capable with required inputs.

Iteration 2 rejected unsafe or blocked directions. ISO-to-ASTM formula
aliases remain wrong metric owners, cross-family lower-treatment
`DeltaLw` subtraction remains wrong-metric derivation, and
opening/leak or open-box residual budget tightening remains blocked
until enough same-family holdouts exist.

## Gate EI Counters

- `candidateCount 10`
- `roiAnalysisIterations: 2`
- `estimatedNextInputSurfaceLedgers 1`
- `estimatedNextNewCalculableMetricBasisRequestShapes 2`
- `newCalculableLayerTemplates 0`
- `newCalculableRequestShapes 0`
- `runtimeBasisPromotions 0`
- `runtimeFormulaRetunes 0`
- `runtimeValuesMoved 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Gate EJ Acceptance

Gate EJ must be treated as a separate surface slice, not hidden inside
Gate EI.

1. Prove estimate and impact-only request surfaces accept explicitly
   ASTM-labelled exact impact bands and route them to the Gate EH owner.
2. Preserve ISO default/import behavior unless the user/import data
   explicitly names ASTM E492/E989 or ASTM E1007/E989.
3. Keep missing/ambiguous `standardMethod` stopped for ASTM publication.
4. Keep lab ASTM E492 from publishing `AIIC` and field ASTM E1007 from
   publishing `IIC`.
5. Touch no formula coefficients and import no source rows.

## Gate EJ Landed Result

Gate EJ landed as:
`post_v1_floor_astm_iic_aiic_exact_band_input_surface_gate_ej_plan`.

Gate EJ status:
`post_v1_floor_astm_iic_aiic_exact_band_input_surface_gate_ej_landed_surface_parity_selected_next_numeric_coverage_gap_gate_ek`.

Gate EJ selected next:
`post_v1_next_numeric_coverage_gap_gate_ek_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ek-contract.test.ts`.

Gate EJ closes the selected `floor.astm_iic_aiic_user_band_input_surface`
scope gap. Explicitly ASTM-labelled one-third-octave user/import impact
bands now carry `standardMethod` through shared estimate, shared
impact-only, API forwarding, and the workbench exact-band import helper.
Lab `ASTM E492 / ASTM E989` exact bands calculate owned `IIC`; field
`ASTM E1007 / ASTM E989` exact bands calculate owned `AIIC`.

The stop boundaries are unchanged: ISO import defaults stay
`ISO 10140-3` / `ISO 16283-2`, missing or ambiguous methods remain
unsupported for ASTM publication, lab ASTM E492 does not publish
`AIIC`, field ASTM E1007 does not publish `IIC`, and formula-derived
ISO `Ln,w`, `DeltaLw`, `CI`, or `CI,50-2500` answers do not alias to
ASTM ratings.

Gate EJ counters:

- `inputSurfaceLedgers 1`
- `newCalculableMetricBasisRequestShapes: 2`
- `newCalculableLayerTemplates 0`
- `newCalculableRequestShapes 0`
- `runtimeBasisPromotions 0`
- `runtimeFormulaRetunes 0`
- `runtimeValuesMoved 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 1`
