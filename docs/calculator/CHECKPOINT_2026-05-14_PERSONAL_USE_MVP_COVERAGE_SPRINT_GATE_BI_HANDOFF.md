# Personal-Use MVP Coverage Sprint Gate BI Handoff

Date: 2026-05-14

Gate BI has now landed:

`gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_plan`

Gate BI selection status:

`gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_landed_no_runtime_selected_field_building_runtime_corridor_gate_bj`

Selected Gate BJ action:

`gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_plan`

Selected Gate BJ file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bj-floor-impact-field-building-runtime-corridor-contract.test.ts`

Next plain label: floor-impact field/building runtime corridor.

## What Landed

Gate BI is a no-runtime floor-impact field/building adapter owner
contract after Gate BH. It does not move runtime values, retune lab
floor formulas, add source rows, add ASTM/IIC adapters, or alias lab
`Ln,w` / `DeltaLw` budgets into field/building outputs.

The contract makes the owner boundary executable:

- field-apparent `L'n,w` / `L'nT,w` owners are separate from
  building-prediction owners;
- `L'nT,50` is blocked until a low-frequency owner exists;
- missing separating area, receiving room volume, RT60/absorption,
  impact field context, junction/flanking, and coupling inputs remain
  precise `needs_input` prompts;
- complete building physical context still cannot promote without
  direct curve, flanking path energy, junction/Kij, room normalization,
  low-frequency, and uncertainty-budget owners;
- `IIC` / `AIIC` remain unsupported ASTM boundaries.

Current field and lab values are preserved:

- heavy combined lab `Ln,w 44.4` / `DeltaLw 30.1`;
- steel formula `Ln,w 55.6` / `DeltaLw 22.4`;
- timber `Ln,w 51` / `DeltaLw 25.2`;
- CLT `Ln,w 50` / `DeltaLw 22.6`;
- floor field `L'n,w 53` / `L'nT,w 50.6`;
- local low-frequency guide `L'nT,50 49`.

## Why Gate BJ Next

The 2026-05-14 company-internal calculation-grade review tightened the
bar: company scenarios should not end on live low-confidence/screening
fallbacks when complete physical inputs can support a source-absent
physics corridor.

Gate BI therefore selects the runtime-producing Gate BJ lane rather than
another broad cartography or visibility-only review. Gate BJ should
promote `L'n,w` and `L'nT,w` field/building impact runtime only where
the Gate BI owners are complete. `L'nT,50` should remain blocked until a
low-frequency owner exists, and low-confidence/screening floor behavior
should be removed by later runtime lanes, not relabelled.

## Validation Target

Minimum validation for Gate BI:

- focused Gate BI engine contract;
- Gate BH + Gate BI continuity;
- engine typecheck;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Known non-fatal warnings remain the optional `sharp/@img` warnings from
`@turbodocx/html-to-docx` during Next build and the unavailable
Zustand test-storage warnings in web tests.
