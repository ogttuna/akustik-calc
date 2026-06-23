# Post-V1 Wall British Gypsum Exact Lab Needs-Input Boundary Fix Plan - 2026-06-23

Status:
`post_v1_wall_british_gypsum_exact_lab_needs_input_boundary_fix_landed_runtime_boundary_selected_runtime_first_rerank_after_current_gate_reconciliation`

## Purpose

This is the bounded runtime-boundary fix selected after the current-gate
stale metric/basis reconciliation exposed one non-stale web current-gate
failure in the resilient-bar route/card matrix.

The failing shapes were British Gypsum White Book timber resilient-bar
lab rows (`A046005` / `A046006`) requested together with field/building
companion outputs. The exact measured lab anchor was active and warned
correctly for explicit side-count requests, and the legacy auto
side-count formula corridor still had finite same-basis lab values. In
both cases Answer Engine V1's grouped-topology `needs_input` boundary
parked every wall airborne output, including the element-lab `Rw`,
`STC`, `C`, and `Ctr` outputs already available from the exact anchored
or stud-wall formula lab path.

This fix keeps exact measured/source-row precedence intact. It does not
import source rows, retune formula coefficients, broaden compatible
anchor deltas, or alias lab values into field/building outputs.

Previous landed support slice:
`post_v1_current_gate_stale_metric_basis_reconciliation_after_opening_leak_apparent_dna_plan`
/
`packages/engine/src/post-v1-current-gate-stale-metric-basis-reconciliation-after-opening-leak-apparent-dna-contract.test.ts`
/
`docs/calculator/POST_V1_CURRENT_GATE_STALE_METRIC_BASIS_RECONCILIATION_AFTER_OPENING_LEAK_APPARENT_DNA_PLAN_2026-06-23.md`
/
`post_v1_current_gate_stale_metric_basis_reconciliation_after_opening_leak_apparent_dna_landed_no_runtime_selected_runtime_first_rerank_after_current_gate_reconciliation`.

Selected action:
`post_v1_wall_british_gypsum_exact_lab_needs_input_boundary_fix_plan`

Selected file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-needs-input-boundary-fix-contract.test.ts`

Selected plan:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_NEEDS_INPUT_BOUNDARY_FIX_PLAN_2026-06-23.md`

Selected label:
`post-V1 wall British Gypsum exact lab needs-input boundary fix`

Selected follow-up action:
`post_v1_runtime_first_route_family_rerank_after_current_gate_stale_metric_basis_reconciliation_plan`

Selected follow-up plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_CURRENT_GATE_STALE_METRIC_BASIS_RECONCILIATION_PLAN_2026-06-23.md`

Counters: `newCalculableRequestShapes: 3`,
`newCalculableTargetOutputs: 4`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `engineImplementationFilesTouched: 1`,
`engineContractFilesTouched: 1`, and `frontendImplementationFilesTouched:
0`.

## Selection Card

- User construction / formula family: British Gypsum `A046005`
  one-side RB1 and `A046006` both-side RB2 timber resilient-bar lab
  rows, covering explicit side-count exact anchors and the legacy
  auto-side-count stud-wall formula corridor.
- Target outputs to open/protect: exact element-lab `Rw`, `STC`, `C`,
  and `Ctr` when the verified airborne lab source anchor or owned
  element-lab stud-wall formula path is active.
- Route: exact measured/source row anchors the explicit element-lab
  curve; legacy auto keeps the stud-wall formula lab path. Answer Engine
  V1 route-input boundary remains active only for unowned field/building
  companions.
- Required physical inputs: grouped topology and field/building context
  inputs remain required for `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and
  `DnT,A`.
- `needs_input` behavior: the mixed request keeps field/building outputs
  parked with explicit grouped topology/context missing inputs.
- `unsupported` boundaries: lab values are not copied into field or
  building outputs; impact aliases stay closed; near-source rows still
  require exact construction identity.
- Expected `newCalculableRequestShapes`: 3.
- Expected `newCalculableTargetOutputs`: 4.
- Expected `runtimeBasisPromotions`: 0.
- Expected `runtimeValuesMoved`: 0.

## ROI Iterations Before Implementation

Iteration 1: do not loosen the web expectation.

- The exact British Gypsum warning was already present, so changing the
  route-card expectation to "Awaiting physical input" would hide a real
  exact-row precedence leak.
- The failure was not stale in the same way as the opening/leak apparent
  companion expectations.

Iteration 2: do not widen grouped topology ownership.

- The British Gypsum rows include an air-gap plus absorber schedule that
  triggers grouped topology prompts.
- Owning the full grouped topology route would be a larger formula/input
  milestone and is not required to preserve same-basis exact lab outputs.

Iteration 3: protect only element-lab lab outputs on owned lab paths.

- The minimal calculator-safe behavior is to exempt current live lab
  outputs from the needs-input parking filter only when a verified
  airborne lab source anchor or the existing stud-wall formula lab path
  is active in `element_lab` context.
- Field/building outputs remain parked and therefore the fix cannot copy
  lab `Rw` into apparent or standardized metrics.

## Work Order

1. Add a contract for `A046005` and `A046006` mixed lab requests.
2. Keep `Rw`, `STC`, `C`, and `Ctr` live from the exact anchored lab
   path.
3. Keep `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` in `needs_input`
   with grouped topology/context prompts.
4. Add a narrow protected-output filter to the Answer Engine V1 wall
   needs-input boundary path.
5. Add the contract to `tools/dev/run-calculator-current-gate.ts`.

## Validation Plan

- Run the new British Gypsum boundary contract.
- Run the web resilient-bar route/card matrix.
- Run the prior current-gate reconciliation contract.
- Run `pnpm calculator:gate:current`.
- Run `git diff --check`.

## Stop Rule

If exact lab outputs cannot stay live without also opening field/building
companions, stop. Do not alias lab values into apparent, standardized, or
building metrics to make the route card green.
