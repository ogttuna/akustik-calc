# Gate BL Steel-Floor Suspended-Ceiling Input Surface Plan

Date: 2026-05-14

Selected action:

`gate_bl_personal_use_mvp_steel_floor_suspended_ceiling_input_surface_plan`

Selected file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bl-steel-floor-suspended-ceiling-input-surface-contract.test.ts`

## Goal

Gate BK proved the source-absent steel suspended-ceiling-only formula
lane, but the Dynamic Calculator surface still treated every steel
formula stack as an upper/lower `DeltaLw` route. Gate BL makes the
steel suspended-ceiling owner fields first-class on the existing floor
input surface without adding a new hidden selector.

The first-class owner fields are:

- `steelSupportForm`;
- `steelCarrierDepthMm`;
- `steelCarrierSpacingMm`;
- `lowerCeilingIsolationSupportForm`.

When those fields and the visible lower ceiling layer set are complete,
UI-derived input now reaches
`predictor_lightweight_steel_suspended_ceiling_corridor_estimate` and
keeps the Gate BK lab `Ln,w 62.2` / `+/-6 dB` value pin. Upper package
`loadBasisKgM2` and `resilientLayerDynamicStiffnessMNm3` remain required
only for the existing Gate AD upper/lower `DeltaLw` route.

## Runtime Scope

Gate BL adds no retune. It only changes routing/input ownership:

- visible steel suspended-ceiling-only stacks with complete owner fields
  resolve to `impactSystemType: suspended_ceiling_only`;
- complete UI-derived input returns lab `Ln,w 62.2`;
- incomplete UI-derived input names `steelCarrierSpacingMm` and
  `lowerCeilingIsolationSupportForm` instead of presenting a
  low-confidence fallback as the final answer;
- cards, reports, local saved replay, server snapshot replay,
  calculator API payloads, and impact-only API payloads preserve the
  same Gate BK basis and budget.

Gate BL keeps frozen:

- Gate AD steel upper/lower `Ln,w 55.6` / `DeltaLw 22.4`;
- Gate BK suspended-ceiling `Ln,w 62.2`;
- exact source precedence;
- field/building, ASTM/IIC/AIIC, and `L'nT,50` boundaries.

## Next Slice

Gate BL closes by selecting post-input-surface revalidation:

`gate_bm_personal_use_mvp_post_steel_suspended_ceiling_input_surface_revalidation_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bm-post-steel-suspended-ceiling-input-surface-revalidation-contract.test.ts`

Gate BM should prove Gate BL did not disturb Gate AD steel upper/lower,
Gate BK suspended-ceiling, Gate BJ field/building, and adjacent floor
impact source-absent lanes.
