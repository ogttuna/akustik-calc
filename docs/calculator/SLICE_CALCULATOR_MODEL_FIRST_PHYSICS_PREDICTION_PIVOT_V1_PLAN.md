# Slice Plan - Calculator Model-First Physics Prediction Pivot V1

Slice id: `calculator_model_first_physics_prediction_pivot_v1`

Status: SELECTED / GATE AN LANDED / GATE AO ERROR-BUDGET SURFACE PARITY NEXT

Selected by:

2026-05-05 implementation re-analysis after the user clarified that
DynEcho must be an acoustic calculator first, not a lookup/source-packet
queue.

Selection status:

`gate_an_source_absent_uncertainty_landed_no_runtime_selected_error_budget_surface_parity_gate_ao`

Latest Gate AN checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AN_HANDOFF.md`

Gate AN landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-an-steel-floor-formula-source-absent-uncertainty-contract.test.ts`

Gate AN landed action:

`gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan`

Gate AN selected Gate AO file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ao-steel-floor-formula-error-budget-surface-parity-contract.test.ts`

Gate AN selected Gate AO action:

`gate_ao_steel_floor_formula_error_budget_surface_parity_plan`

Gate AN landed summary:

Gate AN adds a no-runtime structured error-budget contract for the
source-absent steel-floor formula corridor. Complete steel formula cases
keep the same `Ln,w 55.6` / `DeltaLw 22.4` estimates while exposing
`Ln,w +/-4.5 dB` and `DeltaLw +/-2.0 dB` as metric-specific error
budgets. The terms name missing source-owned holdouts, source-absent
bare steel reference modelling, transfer efficiency, dynamic stiffness
precision, load-basis precision, lower support class simplification, and
upper resilient topology simplification. Exact-source, needs-input, and
unsafe-topology cases do not expose a formula budget.

Gate AN validation result:

Focused validation completed on 2026-05-07: Gate AN focused engine
contract passed 1 file / 6 tests, engine typecheck passed, focused Gate
AM/AN contracts passed 2 files / 11 tests, focused Gate AJ/AK/AL/AM/AN
contracts passed 5 files / 25 tests, full `pnpm
calculator:gate:current` passed, and `git diff --check` passed before
this validation-doc sync. Current gate totals: engine 320 files / 1813
tests, web 65 files / 284 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean.

Latest Gate AM checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AM_HANDOFF.md`

Gate AM landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-am-steel-floor-formula-source-owned-delta-lw-source-packet-acquisition-contract.test.ts`

Gate AM landed action:

`gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan`

Gate AM selected Gate AN file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-an-steel-floor-formula-source-absent-uncertainty-contract.test.ts`

Gate AM selected Gate AN action:

`gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan`

Gate AM landed summary:

Gate AM adds a no-runtime source-packet acquisition ledger for
source-owned same-stack ISO lab `DeltaLw` steel-floor holdouts. The
narrow pass rejects REGUPOL steel deck/joist and steel C-joist leads as
wrong-basis STC/IIC evidence, rejects REGUPOL ISO `DeltaLw` leads as
solid/concrete reference-floor evidence, and keeps SoundAdvisor as a
metric-scope boundary rather than a candidate steel packet. The accepted
source-owned holdout count remains zero, so Gate AN is selected for
source-absent steel-floor formula uncertainty and error-budget work.

Gate AM validation result:

Focused validation completed on 2026-05-07: Gate AM focused engine
contract passed 1 file / 5 tests, engine typecheck passed, and focused
Gate AJ/AK/AL/AM contracts passed 4 files / 19 tests. Full `pnpm
calculator:gate:current` passed: engine 319 files / 1807 tests, web 65
files / 284 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. `git diff --check` passed. Known non-fatal
warnings remain the Node/Vitest Zustand persist storage warning and
optional `sharp` / `@img` Next build warnings via the DOCX export
dependency.

Latest Gate AL checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AL_HANDOFF.md`

Gate AL landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts`

Gate AL landed action:

`gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan`

Gate AL selected Gate AM file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-am-steel-floor-formula-source-owned-delta-lw-source-packet-acquisition-contract.test.ts`

Gate AL selected Gate AM action:

`gate_am_steel_floor_formula_source_owned_delta_lw_source_packet_acquisition_plan`

Gate AL landed summary:

Gate AL adds a no-runtime first-holdout guard for source-owned
same-stack ISO lab `DeltaLw` steel-floor packets. The current inventory
still has zero accepted measured `DeltaLw` holdouts: Pliteq and UBIQ are
`Ln,w`/`Rw` evidence without owned `DeltaLw`, product catalog `DeltaLw`
does not own a same-stack steel-floor assembly, Annex/companion values
are inferred, and the checked REGUPOL steel C-joist source is
ASTM/IIC/STC basis rather than ISO lab `DeltaLw`. Runtime values remain
unchanged and Gate AM is selected for narrow source-packet acquisition.

Gate AL validation result:

Focused validation completed on 2026-05-07. Gate AL focused engine
contract passed 1 file / 4 tests, and engine typecheck passed. Full
`pnpm calculator:gate:current` passed after the Gate AJ/AK/AL
doc-alignment repair: engine 318 files / 1802 tests, web 65 files / 284
passed + 18 skipped, repo build 5/5 successful, and whitespace guard
clean. `git diff --check` passed. Known non-fatal warnings remain the
Node/Vitest Zustand persist storage warning and optional `sharp` / `@img`
Next build warnings via the DOCX export dependency.

Consumed Gate AM implementation plan:

1. Search narrowly for ISO 10140 / ISO 717-2 steel-floor or steel-joist
   same-stack lab `DeltaLw` sources that own the Gate AK fields.
2. Encode a packet only when metric value, topology/support family,
   carrier spacing, load basis, dynamic stiffness, lower support class,
   upper-resilient topology, and paired negative boundary owner are
   source-owned.
3. Keep accepted rows as holdout/calibration evidence rather than exact
   replacements or product rows.
4. If no packet qualifies, land the rejection ledger and next acquisition
   decision without weakening Gate AK/AL.

Consumed Gate AN implementation plan:

1. Add an explicit source-absent error-budget object for steel-floor
   `Ln,w` and `DeltaLw`.
2. Attribute uncertainty terms to measured holdout absence, support-form
   assumptions, load-basis defaults, dynamic-stiffness precision, lower
   support class, and upper resilient topology.
3. Keep exact source precedence and Gate AK/AM source packet rules
   unchanged.
4. Add hostile source-absent cases where all physical inputs are
   present, partially missing, duplicated, or unsafe.
5. Preserve card/report/API parity for the uncertainty posture without
   presenting it as measured evidence.

Gate AO implementation plan:

1. Carry Gate AN's structured error-budget payload into the steel formula
   runtime/support trace without changing numeric values.
2. Surface the same `origin`, `notMeasuredEvidence`, metric corridor, and
   terms on output cards, method dossier, Markdown report, calculator
   API, and impact-only API.
3. Keep exact-source, needs-input, and unsafe-topology cases free of
   formula budgets.
4. Add parity tests that compare visible output against the structured
   budget object.
5. Keep Gate AK/AM source-packet strictness unchanged.

Latest Gate AK checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AK_HANDOFF.md`

Gate AK landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ak-steel-floor-formula-source-owned-delta-lw-holdout-contract.test.ts`

Gate AK landed action:

`gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan`

Gate AK selected Gate AL file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts`

Gate AK selected Gate AL action:

`gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan`

Gate AK landed summary:

Gate AK adds a no-runtime source-owned same-stack lab `DeltaLw`
holdout packet contract for the steel-floor formula lane. A candidate
can count toward formula residual tightening only when the measured
metric value, topology/support family, carrier spacing, load basis,
dynamic stiffness, lower support class, upper-resilient topology, and
paired negative boundary owner are source-owned. Current Pliteq, UBIQ,
product-only, inferred, and wrong-basis candidates do not count, so
runtime values and residual retune permission remain held.

Gate AK validation result:

Validation completed on 2026-05-07. Gate AK focused engine contract
passed 1 file / 5 tests; engine typecheck passed; full `pnpm
calculator:gate:current` passed with engine 317 files / 1798 tests, web
65 files / 284 passed + 18 skipped, repo build 5/5 tasks, and whitespace
guard clean; `git diff --check` passed. Known non-fatal warnings remain
the Node/Vitest Zustand persist storage warning and optional `sharp` /
`@img` Next build warnings via the DOCX export dependency.

Latest Gate AJ checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AJ_HANDOFF.md`

Gate AJ landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aj-steel-floor-formula-negative-boundary-and-delta-lw-holdout-contract.test.ts`

Gate AJ landed action:

`gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan`

Gate AJ selected Gate AK file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ak-steel-floor-formula-source-owned-delta-lw-holdout-contract.test.ts`

Gate AJ selected Gate AK action:

`gate_ak_steel_floor_formula_source_owned_delta_lw_holdout_acquisition_plan`

Gate AJ landed summary:

Gate AJ adds a no-runtime paired-negative boundary and `DeltaLw` holdout
intake contract for the steel-floor formula lane. The protected
negatives cover wrong support family, exact source precedence,
lab-to-field/building leakage, and source-absent design references. The
paired-negative blocker is removed from the executable residual-policy
input, but runtime values still hold because source-owned formula inputs,
field/building owners, and measured `DeltaLw` holdouts are incomplete.

Gate AJ validation result:

Focused validation completed on 2026-05-07. Gate AJ engine contract
passed 1 file / 5 tests; engine typecheck passed. Full `pnpm
calculator:gate:current` passed with engine 316 files / 1793 tests, web
65 files / 284 passed + 18 skipped, repo build 5/5 tasks, and whitespace
guard clean. Known non-fatal warnings remain the Node/Vitest Zustand
persist storage warning and optional `sharp` / `@img` Next build
warnings via the DOCX export dependency.

Consumed Gate AK implementation plan:

1. Create
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ak-steel-floor-formula-source-owned-delta-lw-holdout-contract.test.ts`.
2. Add source-owned measured same-stack lab `DeltaLw` holdout packet
   requirements.
3. Require metric, topology/support family, carrier spacing, load basis,
   dynamic stiffness, lower support class, upper-resilient topology, and
   paired negative owner before a row can count.
4. Keep product-only, inferred, field, ASTM, and building-basis values
   out of residual tightening.
5. Preserve exact-source precedence and runtime value freeze unless a
   later residual policy explicitly promotes correction.

Consumed Gate AL implementation plan:

1. Create
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts`.
2. Add the Gate AL helper at
   `packages/engine/src/steel-floor-formula-first-source-owned-delta-lw-holdout.ts`.
3. Reject `Ln,w`/`Rw`-only, product-only, inferred, and wrong-basis
   candidates from source-owned ISO `DeltaLw` residual tightening.
4. Prove a future source-owned packet would be accepted only when every
   Gate AK owner field is source-owned.
5. Preserve runtime values unless the residual policy explicitly
   promotes a correction after enough measured holdouts exist.

Latest Gate AI checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AI_HANDOFF.md`

Gate AI landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts`

Gate AI landed action:

`gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan`

Gate AI selected Gate AJ file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aj-steel-floor-formula-negative-boundary-and-delta-lw-holdout-contract.test.ts`

Gate AI selected Gate AJ action:

`gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan`

Gate AI landed summary:

Gate AI adds a no-runtime residual policy for the steel-floor formula
corridor. Current `Ln,w` evidence resolves to `hold`: max residual is
low, but the evidence set is only three same-family Pliteq holdouts and
lacks source-owned open-web formula inputs and separate field/building
basis owners. Current `DeltaLw` evidence also resolves to `hold` because
measured `DeltaLw` residual count is zero. The policy defines executable
`hold`, `tighten`, `widen`, and `retune_candidate` branches and keeps
UBIQ exact rows as anchors.

Latest Gate AH checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AH_HANDOFF.md`

Gate AH landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts`

Gate AH landed action:

`gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan`

Gate AH selected Gate AI file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts`

Gate AH selected Gate AI action:

`gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan`

Gate AH landed summary:

Gate AH adds a no-runtime steel-floor formula accuracy benchmark matrix.
Three same-family Pliteq steel-joist lab `Ln,w` holdouts are residual
checks and all stay inside the current `+/-4.5 dB Ln,w` corridor; max
residual is `0.6 dB` and mean residual is `0.4 dB`. `DeltaLw` residual
count remains zero because the local measured rows do not own measured
`DeltaLw`. UBIQ open-web exact rows remain source anchors only when
formula inputs or upper-resilient topology are missing.

Gate AH validation result:

Focused validation completed on 2026-05-07. Gate AH engine contract
passed 1 file / 5 tests; engine typecheck passed. Full `pnpm
calculator:gate:current` passed with engine 314 files / 1783 tests, web
65 files / 284 passed + 18 skipped, and repo build 5/5 tasks. Known
non-fatal warnings remain the Node/Vitest Zustand persist storage warning
and optional `sharp` / `@img` Next build warnings via the DOCX export
dependency.

Gate AI implementation plan:

1. Create
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts`.
2. Turn Gate AH residual evidence into explicit hold/tighten/widen/retune
   policy.
3. Keep current runtime values unless a source-owned correction has paired
   positive and negative tests.
4. Require measured `DeltaLw` holdouts before tightening `DeltaLw`.
5. Keep UBIQ exact rows as anchors until formula inputs and topology are
   source-owned.

Latest Gate AG checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AG_HANDOFF.md`

Gate AG landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ag-steel-floor-formula-input-surface-acceptance-contract.test.ts`

Gate AG landed action:

`gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan`

Gate AG selected Gate AH file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts`

Gate AG selected Gate AH action:

`gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan`

Gate AG landed summary:

Gate AG keeps the Gate AD steel formula values unchanged while proving
the Gate AF input surface across live workbench evaluation, local saved
replay, server snapshot replay, output cards, Markdown report payload,
estimate API payload, impact-only API payload, and hostile edits.
Complete UI-derived steel rows still return lab `LnW 55.6`, `DeltaLw
22.4`, and
`predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`.
Missing/invalid fields now name precise physical blockers; field impact
outputs remain unsupported instead of being promoted from the lab
formula.

Gate AG validation result:

Focused validation completed on 2026-05-07. Gate AG engine contract
passed 1 file / 3 tests; web steel formula input-surface acceptance
passed 1 file / 4 tests; Gate AF + Gate AG web focused suite passed 2
files / 8 tests; engine typecheck passed; web typecheck passed; preflight
`git diff --check` passed. Final `pnpm calculator:gate:current` passed
with engine 313 files / 1778 tests, web 65 files / 284 tests plus 18
skipped, repo build, and whitespace guard. The Gate AG web acceptance
test emits known non-fatal Zustand persist storage warnings under
Node/Vitest; the web build still emits the known non-fatal optional
`sharp/@img` package warnings.

Gate AH implementation plan:

1. Create
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts`.
2. Build a rights-safe steel benchmark matrix from existing measured and
   holdout cases with explicit support form, carrier geometry, dynamic
   stiffness, load basis, lower isolation, metric basis, and tolerance
   owner.
3. Compare residuals only where topology and metric basis match; use near
   rows as calibration anchors, not as a replacement for the physics
   calculator.
4. Decide whether the current steel formula tolerance should stay,
   widen, or narrow based on evidence.
5. Keep exact-source precedence and lab/field/building bases separate.

Latest Gate AF checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AF_HANDOFF.md`

Gate AF landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts`

Gate AF landed action:

`gate_af_steel_floor_formula_input_surface_plan`

Gate AF selected Gate AG file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ag-steel-floor-formula-input-surface-acceptance-contract.test.ts`

Gate AF selected Gate AG action:

`gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan`

Gate AF landed summary:

Gate AF moves the steel formula corridor from hidden explicit
`impactPredictorInput` only into the Dynamic Calculator floor workflow.
Workbench route controls, scenario analysis, local/server snapshots, and
the engine helper now bridge steel support form, carrier depth/spacing,
upper dynamic stiffness, load basis, and lower ceiling isolation into the
same predictor input that Gate AD uses. Complete construction-image style
steel rows plus UI fields return lab `LnW 55.6`, `DeltaLw 22.4`, and
`predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`.
Partial fields do not generate a fake formula answer, unsafe duplicate
steel carriers are refused, and exact measured rows remain first
precedence.

Gate AF validation result:

Validation completed on 2026-05-07. Focused Gate AF engine contract
passed 1 file / 5 tests; focused web steel formula input-surface test
passed 1 file / 4 tests; engine typecheck passed; web typecheck passed;
final `pnpm calculator:gate:current` passed with engine 312 files / 1775
tests, web 64 files / 280 tests plus 18 skipped, repo build, and
whitespace guard. The Next build still emits the known non-fatal optional
`sharp/@img` package warnings.

Consumed Gate AG implementation plan:

1. Create
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ag-steel-floor-formula-input-surface-acceptance-contract.test.ts`.
2. Prove complete steel input-surface parity across live workbench, saved
   scenario replay, server snapshot replay, report payloads, output cards,
   and API payloads.
3. Make missing/invalid steel fields visibly precise in route unlocks and
   output posture.
4. Add hostile UI cases for invalid values, comma decimals, many layers,
   split/reordered layers, unsafe duplicate carriers, and steel/non-steel
   base toggles.
5. Keep exact-source precedence and lab/field/building bases separate.

Latest Gate AE checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AE_HANDOFF.md`

Latest Gate AE broad revalidation / Gate AF planning checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_GATE_AE_REVALIDATION_GATE_AF_PLAN_HANDOFF.md`

Gate AE landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ae-steel-floor-formula-card-report-parity-contract.test.ts`

Gate AE landed action:

`gate_ae_steel_floor_formula_card_and_report_parity_plan`

Gate AE selected Gate AF file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts`

Gate AE selected Gate AF action:

`gate_af_steel_floor_formula_input_surface_plan`

Gate AE landed summary:

Gate AE does not move the Gate AD numeric answer; it makes the existing
steel formula result defensible on every user-facing surface. The
workbench `Ln,w` / `DeltaLw` cards, output posture, dynamic impact
trace, impact-support formula notes, validation mode, proposal method
dossier, and Markdown report now all say `Lightweight-steel formula
corridor` and carry the same source-absent lab estimate/tolerance
language. The validation ladder has a dedicated
`steel_formula_corridor_estimate` mode, and the lightweight-steel family
now exposes the `4.5 dB` corridor tolerance instead of hiding under a
generic scoped formula/family estimate bucket. Exact source rows still
win on true matches.

Gate AE validation result:

Validation completed on 2026-05-07. Focused Gate AE engine contract
passed 1 file / 4 tests; focused web steel formula card/report parity
passed 1 file / 1 test; focused Gate AD regression passed 1 file / 6
tests; focused web output/model/dossier/formula report regressions passed
3 files / 16 tests; final `pnpm calculator:gate:current` passed with
engine 311 files / 1770 tests, web 63 files / 276 tests plus 18 skipped,
repo build, and whitespace guard. The Next build still emits the known
non-fatal optional `sharp/@img` package warnings.

Gate AE broad revalidation result:

Revalidation repeated on 2026-05-07 with `pnpm
calculator:gate:current`. Engine 311 files / 1770 tests, web 63 files /
276 tests plus 18 skipped, repo build, and whitespace guard all passed.
The audit found no runtime correction needed before Gate AF. The first
open product gap is input-surface ownership: the steel formula corridor
works from explicit `impactPredictorInput`, but the user-facing Dynamic
Calculator floor route still needs to ask for and persist the same
physical fields.

Consumed Gate AF implementation plan:

1. Create the Gate AF contract at
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts`.
   It should prove selected status, required field IDs, complete
   positive scenarios, partial/missing negatives, exact-source
   precedence, and no Gate AD numeric retune.
2. Reuse the Gate AC field set: `steelSupportForm`,
   `steelCarrierDepthMm`, `steelCarrierSpacingMm`,
   `resilientLayerDynamicStiffnessMNm3`, `loadBasisKgM2`, and
   `lowerCeilingIsolationSupportForm`.
3. Bridge route/API/workbench values into the same `ImpactPredictorInput`
   that currently drives the formula corridor. Missing physical fields
   should remain `needs_input`, not broad family fallback.
4. Add the workbench floor controls and visible prompt parity only for
   the relevant floor impact route and target outputs.
5. Assert complete UI-derived open-web steel returns lab `LnW 55.6` and
   `DeltaLw 22.4` with
   `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`,
   `+/-4.5 dB` / `+/-2.0 dB` tolerance language, and card/report/replay
   parity.
6. Cover hostile edits: invalid zero/negative values, many layers,
   duplicate or split steel carriers, safe reorder, and unsafe reorder.

Gate AF did not expand source packets, retune the formula, or promote
field/building-prediction values.

Previous Gate AD checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AD_HANDOFF.md`

Previous Gate AD landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts`

Previous Gate AD landed action:

`gate_ad_steel_floor_impact_formula_numeric_corridor_plan`

Previous Gate AD selected Gate AE file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ae-steel-floor-formula-card-report-parity-contract.test.ts`

Previous Gate AD selected Gate AE action:

`gate_ae_steel_floor_formula_card_and_report_parity_plan`

Previous Gate AD landed summary:

Gate AD promotes the first source-absent lightweight-steel floor impact
formula corridor. Complete explicit steel predictor input now uses
`predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`
instead of broad floor-system family blending, with pinned lab
`Ln,w 55.6` and `DeltaLw 22.4` for the open-web example. Missing
carrier spacing or lower isolation blocks runtime fallback, exact
measured rows still outrank the formula, and Pliteq steel-joist rows are
used as holdouts rather than as the whole calculator.

Gate AD validation result:

Gate AD validation completed on 2026-05-07. Focused Gate AD passed 1
file / 6 tests; focused Gate AC/Gate AD plus predictor-input regression
passed 3 files / 55 tests; focused impact-only fallback regression
passed 1 file / 102 tests; engine typecheck passed; final
`pnpm calculator:gate:current` passed with engine 310 files / 1766
tests, web 62 files / 275 tests plus 18 skipped, repo build, and
whitespace guard. The Next build still emits the known non-fatal `sharp`
optional `@img` package warnings. Final `git diff --check` passed after
this validation note update.

Previous Gate AC checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AC_HANDOFF.md`

Gate AC landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ac-steel-floor-physics-input-contract.test.ts`

Gate AC landed action:

`gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan`

Gate AC selected Gate AD file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts`

Gate AC selected Gate AD action:

`gate_ad_steel_floor_impact_formula_numeric_corridor_plan`

Gate AC landed summary:

Gate AC turns the Gate AB source guard into an executable no-runtime
input/formula readiness contract. Source-absent steel floor impact
prediction now requires explicit support form, carrier depth and
spacing, upper impact dynamic stiffness, load basis, and lower ceiling
isolation/support form before any formula corridor can promote. Exact
full-stack source rows remain highest precedence. Complete explicit
open-web steel input is formula-corridor ready, but runtime values remain
on the current family-estimate lane until Gate AD owns numeric
acceptance.

Gate AC validation result:

Validation completed on 2026-05-07: focused Gate AC passed 1 file / 6
tests; focused Gate AB + Gate AC + predictor input regression passed 3
files / 54 tests; engine typecheck passed; `pnpm
calculator:gate:current` passed with engine 309 files / 1760 tests, web
62 files / 275 tests plus 18 skipped, repo build, and whitespace guard.
Known optional `sharp/@img` Next build warnings remain non-fatal.

Previous Gate AB summary:

The floor side of the construction-image accuracy incident now has a
source guard. Generic `lightweight_steel_floor` impact routes with
upper/lower packages no longer borrow UBIQ open-web or Pliteq
steel-joist source rows to produce `Ln,w`. They surface missing support
form / carrier / dynamic-stiffness / lower-isolation inputs instead.
Exact same-family steel rows and same-family bound rows remain active.

Previous Gate AB selection status:

`gate_ab_floor_family_source_guard_landed_selected_steel_floor_physics_input_gate_ac`

Previous Gate AB selected Gate AC file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ac-steel-floor-physics-input-contract.test.ts`

Previous Gate AB selected Gate AC action:

`gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan`

Gate AB validation result:

Validation completed on 2026-05-07: focused Gate AB passed 1 file / 5
tests; focused floor-impact source/fallback regression passed 7 files /
140 tests; focused Gate AA/AB pair passed 2 files / 10 tests; engine
typecheck passed; `pnpm calculator:gate:current` passed with engine 308
files / 1754 tests, web 62 files / 275 tests plus 18 skipped, repo
build, and whitespace guard. Known optional `sharp/@img` Next build
warnings remain non-fatal.

Latest Gate AA checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AA_HANDOFF.md`

Gate AA selection status:

`gate_aa_construction_image_route_selection_recovered_selected_floor_family_guard_gate_ab`

Gate AA landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aa-construction-image-accuracy-incident-contract.test.ts`

Gate AA landed action:

`gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan`

Gate AA selected Gate AB file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ab-floor-family-source-guard-contract.test.ts`

Gate AA selected Gate AB action:

`gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan`

Gate AA landed summary:

The construction-image shared-wall grouped topology now reaches the
triple-leaf two-cavity frequency solver by physical domain. The explicit
80/80 mm mineral-wool scenario returns `Rw 61`, `STC 61`, `C -1.7`, and
`Ctr -6.8` from the same curve as the direct solver. Flat-list ACON-like
input remains `needs_input`, so the change recovers complete grouped
physics without turning image examples into a finite lookup table.

Gate AA validation result:

Validation completed on 2026-05-07: focused Gate I/AA/G/J/M regression
passed 5 files / 32 tests. Engine typecheck passed. `pnpm
calculator:gate:current` passed with engine 307 files / 1749 tests, web
62 files / 275 tests plus 18 skipped, repo build, and whitespace guard.
Known optional `sharp/@img` Next build warnings remain non-fatal. Final
`git diff --check` passed after this validation note update.

Previous Gate Z selection status:

`gate_z_floor_impact_field_runtime_landed_selected_construction_image_accuracy_incident_gate_aa`

Latest Gate Z checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_Z_HANDOFF.md`

Gate Z landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-z-floor-impact-field-runtime-contract.test.ts`

Gate Z landed action:

`gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator`

Gate Z selected Gate AA planning surface:

`docs/calculator/ACCURACY_INCIDENT_2026-05-07_CONSTRUCTION_IMAGE_ROUTE_SELECTION.md`

Gate Z selected Gate AA action:

`gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan`

Gate Z landed summary:

Field-only Dynamic Calculator floor-impact `L'n,w` / `L'nT,w` now
promotes from the owned Gate W lab `Ln,w` / `DeltaLw` anchor plus Gate Y
field context. The reference stack pins `LnW 50.3`, `DeltaLw 24.3`,
`LPrimeNW 52.3`, and `LPrimeNTw 49.9` on basis
`mixed_predicted_plus_estimated_standardized_field_volume_normalization`.
`L'nT,50` stays blocked until
`lowFrequencyImpactSpectrumOrCI50_2500Owner` exists.

Previous Gate Y landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts`

Previous Gate Y landed action:

`gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator`

Previous Gate Y selected Gate Z file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-z-floor-impact-field-runtime-contract.test.ts`

Previous Gate Y selected Gate Z action:

`gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator`

Previous Gate Y selection status:

`gate_y_floor_impact_field_context_contract_landed_no_runtime_selected_field_runtime_gate_z`

Gate Z validation result:

Validation completed on 2026-05-07: focused Gate Z passed 1 file / 6
tests. Focused Gate V/W/X/Y/Z regression passed 5 files / 28 tests.
Focused Gate J readiness pack regression passed 1 file / 8 tests after
updating the expected Gate Z field-context warning. Engine typecheck
passed. `pnpm calculator:gate:current` passed with engine 306 files /
1744 tests, web 62 files / 275 tests plus 18 skipped, repo build, and
whitespace guard. Known optional `sharp/@img` Next build warnings remain
non-fatal. Final `git diff --check` passed after this validation note
update.

Previous Gate Y validation result:

Focused Gate Y passed 1 file / 5 tests. Focused Gate V/W/X/Y
regression passed 4 files / 22 tests. `pnpm --filter @dynecho/engine
typecheck`, `pnpm calculator:gate:current`, broad `pnpm check`, and
`git diff --check` are green. Broad `pnpm check` covered full engine 430
files / 2540 tests and full web 168 files / 950 tests plus 18 skipped.
Known optional `sharp/@img` Next build warnings remain non-fatal.

Previous Gate X selection status:

`gate_x_next_solver_or_field_context_selection_landed_no_runtime_selected_floor_impact_field_context_gate_y`

Previous Gate X checkpoint:

`docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_X_HANDOFF.md`

Gate X landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-x-next-solver-or-field-context-selection-contract.test.ts`

Gate X landed action:

`gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary`

Selected next Gate Y file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts`

Selected next Gate Y action:

`gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator`

Gate X validation result:

Focused Gate X, `pnpm calculator:gate:current`, broad `pnpm check`, and
`git diff --check` are green. Known optional `sharp/@img` Next build
warnings remain non-fatal.

Previous Gate W selection status:

`gate_w_floor_impact_runtime_landed_selected_next_dynamic_calculator_solver_or_field_context_gate_x`

Previous Gate V selection status:

`gate_v_floor_impact_dynamic_stiffness_contract_landed_no_runtime_selected_floor_impact_runtime_gate_w`

Gate V selected Gate W file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts`

Gate V selected Gate W action:

`gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator`

Latest revalidation / commit-prep checkpoint:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_U_REVALIDATION_AND_COMMIT_HANDOFF.md`

Revalidation result: current gate and broad `pnpm check` were green after
proposal-surface fixes; that selected Gate V, which has now landed.

Previous Gate U selection status:

`gate_u_next_solver_or_calibration_selection_landed_no_runtime_selected_floor_impact_gate_v`

Gate A file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`

Gate A landed action:

`gate_a_defined_model_first_candidate_basis_and_benchmark_acceptance_no_runtime`

Gate B file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts`

Gate B landed action:

`gate_b_defined_shared_airborne_basis_candidate_schema_without_value_movement`

Gate B selection status:

`gate_b_shared_airborne_basis_candidate_schema_landed_no_runtime_selected_rating_adapter_gate_c`

Gate C file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-c-rating-adapter-contract.test.ts`

Gate C landed action:

`gate_c_inventory_rating_adapter_integrity_without_value_movement`

Gate C selection status:

`gate_c_rating_adapter_integrity_landed_no_runtime_selected_input_completeness_gate_d`

Gate D file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts`

Gate D landed action:

`gate_d_define_physical_input_completeness_needs_input_matrix_without_value_movement`

Gate D selection status:

`gate_d_input_completeness_matrix_landed_no_runtime_selected_airborne_candidate_resolver_gate_e`

Gate E file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts`

Gate E landed action:

`gate_e_define_airborne_candidate_resolver_selected_rejected_candidates_without_value_movement`

Gate E selection status:

`gate_e_airborne_candidate_resolver_landed_no_runtime_selected_grouped_rockwool_prediction_gate_g`

Gate G file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-g-grouped-rockwool-prediction-contract.test.ts`

Gate G landed action:

`gate_g_promote_grouped_rockwool_triple_leaf_family_physics_prediction_with_benchmarks`

Gate G selection status:

`gate_g_grouped_rockwool_family_physics_prediction_landed_selected_source_calibration_gate_h`

Gate H file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-h-source-calibration-exact-promotion-contract.test.ts`

Gate H landed action:

`gate_h_calibrate_sources_and_exact_promotion_without_deleting_physics_solver`

Gate H selection status:

`gate_h_source_calibration_exact_promotion_policy_landed_no_runtime_selected_family_material_expansion_gate_i`

Gate I file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts`

Gate I landed action:

`gate_i_expand_family_material_properties_and_benchmark_scenarios`

Gate I selection status:

`gate_i_family_material_properties_and_benchmark_scenarios_landed_no_runtime_selected_personal_use_readiness_gate_j`

Gate J file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-j-personal-use-readiness-scenario-pack-contract.test.ts`

Gate J landed action:

`gate_j_build_personal_use_readiness_scenario_pack`

Gate J selection status:

`gate_j_personal_use_readiness_scenario_pack_landed_no_runtime_selected_route_input_topology_gate_k`

Gate K selected file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-k-route-input-topology-contract.test.ts`

Gate K selected action:

`gate_k_define_route_input_topology_contracts_for_dynamic_calculator`

Gate K file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-k-route-input-topology-contract.test.ts`

Gate K landed action:

`gate_k_define_route_input_topology_contracts_for_dynamic_calculator`

Gate K selection status:

`gate_k_route_input_topology_contract_landed_no_runtime_selected_topology_normalizer_gate_l`

Gate L selected file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-l-topology-normalizer-hostile-input-contract.test.ts`

Gate L selected action:

`gate_l_define_topology_normalizer_and_hostile_input_guard_for_dynamic_calculator`

Gate L file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-l-topology-normalizer-hostile-input-contract.test.ts`

Gate L landed action:

`gate_l_define_topology_normalizer_and_hostile_input_guard_for_dynamic_calculator`

Gate L selection status:

`gate_l_topology_normalizer_hostile_input_guard_landed_no_runtime_selected_candidate_resolver_gate_m`

Gate M selected file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts`

Gate M selected action:

`gate_m_populate_dynamic_candidate_resolver_runtime_for_dynamic_calculator`

Gate M file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts`

Gate M landed action:

`gate_m_populate_dynamic_candidate_resolver_runtime_for_dynamic_calculator`

Gate M selection status:

`gate_m_dynamic_candidate_resolver_runtime_landed_no_value_selected_family_solver_upgrade_gate_n`

Gate N selected file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-n-family-solver-upgrade-contract.test.ts`

Gate N selected action:

`gate_n_select_first_family_solver_upgrade_runtime_gate_for_dynamic_calculator`

Gate N file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-n-family-solver-upgrade-contract.test.ts`

Gate N landed action:

`gate_n_select_first_family_solver_upgrade_runtime_gate_for_dynamic_calculator`

Gate N selection status:

`gate_n_family_solver_upgrade_selection_landed_no_runtime_selected_single_leaf_massive_panel_gate_o`

Gate O selected file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts`

Gate O selected action:

`gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator`

Gate O file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts`

Gate O landed action:

`gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator`

Gate O selection status:

`gate_o_single_leaf_massive_panel_runtime_promotion_landed_no_value_selected_next_family_solver_gate_p`

Gate P selected file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts`

Gate P selected action:

`gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion`

Gate P file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-p-next-family-solver-upgrade-selection-contract.test.ts`

Gate P landed action:

`gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion`

Gate P selection status:

`gate_p_next_family_solver_selection_landed_no_runtime_selected_double_leaf_framed_bridge_gate_q`

Gate Q selected file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts`

Gate Q selected action:

`gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator`

Gate Q file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts`

Gate Q landed action:

`gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator`

Gate Q selection status:

`gate_q_double_leaf_framed_bridge_input_contract_landed_no_runtime_selected_solver_candidate_gate_r`

Gate R selected file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts`

Gate R selected action:

`gate_r_define_double_leaf_framed_bridge_solver_candidate_without_runtime_value_movement`

Gate R file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-r-double-leaf-framed-bridge-solver-contract.test.ts`

Gate R landed action:

`gate_r_define_double_leaf_framed_bridge_solver_candidate_without_runtime_value_movement`

Gate R selection status:

`gate_r_double_leaf_framed_bridge_solver_contract_landed_no_runtime_selected_runtime_promotion_gate_s`

Gate S selected file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts`

Gate S selected action:

`gate_s_promote_double_leaf_framed_bridge_solver_runtime_for_dynamic_calculator`

Gate S file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts`

Gate S landed action:

`gate_s_promote_double_leaf_framed_bridge_solver_runtime_for_dynamic_calculator`

Gate S selection status:

`gate_s_double_leaf_framed_bridge_runtime_landed_selected_family_material_gap_gate_t`

Gate T selected file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-t-family-material-gap-closure-contract.test.ts`

Gate T selected action:

`gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator`

Gate T file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-t-family-material-gap-closure-contract.test.ts`

Gate T landed action:

`gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator`

Gate T selection status:

`gate_t_family_material_property_gap_closure_landed_no_runtime_selected_next_solver_or_calibration_gate_u`

Gate U selected file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts`

Gate U selected action:

`gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure`

Gate U file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts`

Gate U landed action:

`gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure`

Gate U selection status:

`gate_u_next_solver_or_calibration_selection_landed_no_runtime_selected_floor_impact_gate_v`

Gate V selected file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts`

Gate V selected action:

`gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator`

Gate V file landed:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts`

Gate V landed action:

`gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator`

Gate V selection status:

`gate_v_floor_impact_dynamic_stiffness_contract_landed_no_runtime_selected_floor_impact_runtime_gate_w`

Gate S runtime note:

Complete explicit double-leaf/framed gypsum / rockwool / gypsum now
uses the bridge family physics runtime with `Rw 45`, `STC 45`, `C -1`,
`Ctr -6.1`, and a `7 dB` error budget. Resilient both-side bridge pins
`Rw 46` / `STC 46` with an `8 dB` error budget. Missing
`resilientBarSideCount` remains `needs_input`, and exact source rows can
still override through Gate H precedence when eligible.

Gate T material-property note:

Gate T closes high-impact family material-property gaps without turning
the calculator into a source catalog. Shared material acoustic metadata
now includes `absorberClass`; board leaves/finishes, masonry cores,
porous absorbers, floor decks/screeds, limp membranes, and resilient
impact layers have engineering-default acoustic properties. Required
gaps still return `needs_input`; optional precision gaps widen
uncertainty; runtime values and support buckets stay unchanged.

Gate U selection note:

Gate U selects floor-impact dynamic-stiffness input/adapter ownership as
the next solver/calibration lane. Calibration holdouts for existing
single-leaf and double-leaf runtime lanes remain useful later, but the
larger personal-use gap is floor impact coverage. Gate V must keep
`Ln,w`, `L'n,w`, `L'nT,w`, `IIC`, and `AIIC` basis-separated and must
ask for missing dynamic stiffness/load-basis inputs instead of guessing.

Gate V landing note:

Gate V adds
`packages/engine/src/dynamic-calculator-floor-impact-dynamic-stiffness-contract.ts`
and the Gate V contract test. Complete resilient floating-floor
`Ln,w` / `DeltaLw` input now requires
`resilientLayerDynamicStiffnessMNm3` plus `loadBasisKgM2`; missing
dynamic stiffness, missing load, field impact without room context, and
`IIC` / `AIIC` are executable nearby negatives. Safe role-defined floor
reorders normalize, source absence remains only an exact/calibration
blocker, and runtime values do not move. Gate W is selected for runtime
promotion using this contract boundary.

Gate W landing note:

Gate W promotes only the complete Dynamic Calculator resilient
floating-floor ISO 717-2 lab lane for `Ln,w` / `DeltaLw`. It adds
`loadBasisKgM2` to the impact predictor input, carries explicit load and
dynamic stiffness through the heavy floating-floor formula, and pins the
runtime support bucket to
`predictor_heavy_floating_floor_iso12354_annexc_estimate` at
`DeltaLw 24.3` / `LnW 50.3`. Missing load, missing dynamic stiffness,
field impact without room context, and ASTM `IIC` / `AIIC` remain
non-promoted boundaries. Gate X is selected to choose the next Dynamic
Calculator solver or field-context boundary.

Gate X landing note:

Gate X lands a no-runtime selection contract for the next Dynamic
Calculator solver or field-context boundary. It ranks floor-impact field
context, floor-impact input surfacing, wall field/building context,
generalized multi-cavity solving, ASTM impact adapters, and double-leaf
calibration holdouts. The selected next move is Gate Y:
`gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator`
at
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts`.
The reason is continuity and user value: Gate W already owns lab
`Ln,w` / `DeltaLw`, while `L'n,w`, `L'nT,w`, and `L'nT,50` still need
explicit room/context/flanking and ISO 717-2 field adapter ownership.
Gate X keeps lab pins unchanged and keeps source rows as later anchors or
calibration evidence.

Selected planning surface:

`docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`

Latest acoustic-calculator plan revalidation / execution handoff:

`docs/calculator/CHECKPOINT_2026-05-06_ACOUSTIC_CALCULATOR_PLAN_REVALIDATION_HANDOFF.md`

Latest Gate I / report-export manual validation handoff:

`docs/calculator/CHECKPOINT_2026-05-06_GATE_I_REPORT_EXPORT_MANUAL_EDIT_VALIDATION_HANDOFF.md`

Latest Gate H / report-export wrap-up handoff:

`docs/calculator/CHECKPOINT_2026-05-06_GATE_H_AND_REPORT_EXPORT_WRAPUP_HANDOFF.md`

Latest landed Gate H handoff:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_H_HANDOFF.md`

Latest landed Gate I handoff:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_I_HANDOFF.md`

Previous landed Gate G handoff:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_G_HANDOFF.md`

Previous landed Gate E handoff:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_E_HANDOFF.md`

Previous landed Gate D handoff:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_D_HANDOFF.md`

Previous landed Gate C handoff:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_C_HANDOFF.md`

Previous landed Gate B handoff:

`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_B_HANDOFF.md`

## Objective

Product objective:

DynEcho must become a high-accuracy acoustic calculator for personal use,
not a finite source lookup. The target user flow is: choose wall or
floor, enter the physical inputs needed for that route, select layer
materials and thicknesses, then calculate `Rw`, `R'w`, `DnT,w`, `Ln,w`,
and related outputs with clear basis, tolerance, and missing-input
diagnostics.

The long-term product bar is not merely "similar to INSUL". INSUL is a
useful reference for family-specific prediction structure, but DynEcho's
goal is stronger: an industry-leading calculator that combines
high-quality physics solvers, exact measured overrides, source-anchored
deltas, calibration/holdout evidence, explicit uncertainty, and visible
lab/field/building-prediction basis. The calculator must support
unbounded layer combinations through algorithms first, while using
trusted measurements whenever they are the safest available evidence.

This slice exists because coverage and accuracy both matter. The system
must cover many realistic and hostile layer combinations, but it must not
pretend unsupported or under-specified assemblies are design-grade.
Exact measured/source rows remain the safest result when they truly
match; otherwise the engine must use family-specific physics, calibrated
or uncalibrated as appropriate, with explicit uncertainty.

Restore the calculator architecture to the intended model:

1. If an exact measured/source row exists for the full assembly, use it
   as exact source truth.
2. If no exact row exists, calculate a prediction from the layer stack
   with the best family-specific physics model available.
3. If a known subassembly exists, allow an exact anchor plus calculated
   delta candidate and compare it with the full-stack physics candidate.
4. If a similar measured assembly exists, it may inform an anchored delta,
   calibration corridor, or uncertainty bound only when topology, material
   substitutions, metric basis, and tolerance scope are owned by a named
   algorithm. It must not be copied as a nearest-neighbor lookup answer.
5. Use source/lab rows for exact override, calibration, benchmarks,
   tolerances, and regression tests. Do not let missing source packets
   prevent formula-backed calculation.
6. Keep lab, field, and building-prediction contexts separate. Do not
   silently alias `Rw`/`STC`, `Ln,w`/`IIC`, or lab values with
   field/apparent values.
7. Treat edge cases as first-class acceptance criteria: many layers,
   duplicate layers, split roles, ambiguous topology, history replay, and
   safe or unsafe reorders must either remain stable or explain why the
   route changed.
8. Make tests prove acoustic correctness, not only code execution:
   expected numeric ranges or exact values, origin/basis, tolerance or
   error budget, support buckets, visible card/report parity, and nearby
   negative cases.

This slice corrects the planning error that treated
`rights_safe_source_owned_curve_payload_absent` as a blocker for any
Rockwool/triple-leaf calculation. That blocker still prevents measured
exact promotion. It must not block a labelled `calculated_prediction`.
Gate A made that rule executable: source absence is an exact/calibration
blocker, not formula absence.

## Standards / Research Baseline

Internet research on 2026-05-05 confirms the plan must be
standards-aligned and model-first:

- ISO 12354-1:2017 is the primary airborne building-estimation
  reference. It describes calculation models for airborne insulation
  between rooms using element performance, flanking paths, and
  theoretically derived propagation methods, with detailed frequency-band
  calculation from 100 Hz to 3150 Hz and optional extension to 50 Hz when
  data exists:
  <https://www.iso.org/standard/70242.html>
- ISO 12354-2:2017 is the impact counterpart. It estimates impact
  sound insulation between rooms, again combining element data,
  flanking/structural propagation, frequency-band calculation, and
  simplified single-number routes:
  <https://www.iso.org/standard/70243.html>
- ISO 717-1:2020 defines airborne single-number ratings from octave or
  one-third-octave band results, including `Rw` and spectrum adaptation
  terms:
  <https://www.iso.org/standard/77435.html>
- ISO 717-2:2020 defines the impact single-number rating family:
  <https://www.iso.org/fr/standard/69867.html>
- ISO 10140-2:2021 and ISO 10140-3:2021 are lab measurement references
  for airborne and impact element data; exact rows imported from lab
  reports should carry these or equivalent source-standard metadata:
  <https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/94/79487.html?browse=tc>
  <https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/94/79483.html?browse=tc>
- ISO 16283-1 / ISO 16283-2 are field-measurement references for
  airborne and impact building performance. Field outputs such as
  `R'w`, `DnT,w`, `L'n,w`, and `L'nT,w` must not be represented as
  independent lab exact values:
  <https://www.iso.org/standard/55997.html>
  <https://www.iso.org/standard/77436.html>
- ASTM E90 / E336 / E413 establish the US airborne lab, field, and STC
  rating lane. `STC` must be derived from a curve or exact source row
  with an ASTM-compatible basis, not copied blindly from `Rw`:
  <https://store.astm.org/e0090-23.html>
  <https://store.astm.org/standards/e336>
  <https://store.astm.org/e0413-22.html>
- ASTM E492 / E989 establish the US impact lab and IIC rating lane:
  <https://store.astm.org/e0492-25.html>
  <https://store.astm.org/e0989-21.html>
- INSUL is a reference competitor/category signal: professional tools
  are prediction engines for walls, floors, roofs, ceilings, and windows,
  not finite lookup tables:
  <https://marshallday.com/software>
- Double-leaf research confirms that cavity extent, finite radiation,
  and porous fill modelling materially affect predictions. A PubMed
  indexed 2017 JASA paper on double-leaf cavities specifically highlights
  finite-cavity effects and porous-fill parameter sensitivity:
  <https://pubmed.ncbi.nlm.nih.gov/28147555/>
- Porous absorber inputs must distinguish absorption data from isolation
  data. ISO 9053-1 gives airflow resistance measurement context for
  porous acoustic materials; ISO 354 and ASTM C423 cover reverberation
  room absorption measurements. NRC/absorption rows must not be treated as
  wall/floor transmission-loss rows:
  <https://www.iso.org/standard/69869.html>
  <https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/03/45/34545.html?browse=tc>
  <https://store.astm.org/Standards/C423.htm>
- Floating-floor impact predictions need resilient-layer dynamic
  stiffness, not just density or thickness. ISO 9052-1 is the relevant
  dynamic-stiffness measurement context for materials under floating
  floors:
  <https://www.iso.org/standard/16620.html>
- ASTM E1007 field impact measurement shows why field impact metrics need
  receiving-room, flanking, and metric-basis ownership; field impact
  results should not be generalized as lab `IIC`:
  <https://store.astm.org/e1007-25.html>
- ISO 10848-1/2/3/4 cover laboratory and field measurement of flanking
  transmission. This reinforces that field/apparent performance needs
  flanking/junction ownership and cannot be inferred from the separating
  stack alone:
  <https://www.iso.org/standard/67226.html>
  <https://www.iso.org/standard/67227.html>
  <https://www.iso.org/standard/67228.html>
  <https://www.iso.org/standard/67229.html>
- ISO 12999-1:2020 covers measurement uncertainty for building-acoustics
  sound insulation. Non-exact predictions need explicit uncertainty /
  tolerance metadata:
  <https://www.iso.org/standard/73930.html>
- Transfer-matrix / multilayer research supports a later generalized
  multilayer solver for solid, fluid, and porous layers, but it requires
  richer material properties and validation before being used broadly:
  <https://www.sciencedirect.com/science/article/abs/pii/S0022460X23003474>
- Professional ISO 12354 tools such as SONarchitect and BASTIAN combine
  calculation methods with frequency-band element data/databases. They are
  not proof that every assembly is a lookup row; they confirm the need for
  structured input data plus calculation:
  <https://www.acousticware.com/sonarchitect/index.php/en/sonarchitect-iso/whatit>
  <https://www.schallmessung.com/bastian/>
- INSUL technical notes expose the expected family-specific behavior:
  single panels need mass, modulus, critical-frequency/coincidence and
  loss-factor handling; double panels move through mass-law,
  mass-air-mass resonance, cavity-mode, and structural-connection regions:
  <https://www.insul.co.nz/tech-info/>
- Davy's single-leaf extension of Cremer's model confirms that single
  leaves need finite-size radiation efficiency, critical-frequency
  behaviour, shear-wave correction for thicker walls, and damping/loss
  factor sensitivity, not only a simple mass-law integer:
  <https://pubmed.ncbi.nlm.nih.gov/19813801/>
- triple-panel / multi-cavity research supports transfer-matrix modelling
  with explicit boundary conditions and poroelastic linings for
  triple-panel structures; this is the right long-term direction for
  complex gypsum / MLV / cavity / mineral-wool stacks:
  <https://openresearch.surrey.ac.uk/esploro/outputs/journalArticle/Sound-transmission-through-triple-panel-structures-lined/99513143302346>
- Miki / Delany-Bazley-style porous material work confirms flow
  resistivity and equivalent-fluid propagation are the right inputs for
  porous acoustic behaviour; porous fills are damping/propagation inputs,
  not direct isolation ratings:
  <https://www.jstage.jst.go.jp/article/ast1980/11/1/11_1_25/_article>

Implementation consequence:

- source rows are evidence and calibration, not the calculator;
- ratings must be curve-first where possible, then rated by ISO/ASTM
  adapters;
- exact-vs-prediction-vs-field basis must be first-class metadata;
- missing source packets cannot block prediction, only exact/source
  promotion;
- uncertainty/error-budget must be part of every non-exact surfaced
  answer;
- method selection must choose the most defensible available candidate for
  the requested output basis, not the easiest source/library path.

## Deep Research Analysis

The practical architecture target is not "one formula for every stack".
It is a family router that produces a frequency-band curve wherever the
family has enough physical inputs, then applies explicit rating adapters.

### Source-Absent Calculation Pipeline

When no exact source row exists, DynEcho must still behave as a
calculator. Source absence blocks measured-exact or source-calibrated
promotion only; it does not block the calculation route.

The source-absent path is:

```text
layers and route context
-> material property resolution
-> topology classifier / grouped leaf-cavity model
-> family-specific frequency-band solver
-> R(f), L(f), or delta curve
-> ISO/ASTM rating adapter
-> basis/origin, assumptions, error budget, and missing-input diagnostics
```

This is intentionally not a lookup library. Source rows are guardrails:
they provide exact overrides, anchors, calibration targets, holdouts,
benchmark ranges, and negative boundaries. They are not the only way to
answer an unbounded layer combination.

If a family solver has enough physical inputs, the candidate origin is
`family_physics_prediction` or `bounded_prediction` with a named method
and error budget. If the physical inputs are missing, the answer is
`needs_input` with exact missing fields. If the route has no solver, it is
`unsupported`. None of those states should trigger another source-packet
search loop as the primary product behavior.

### Candidate Selection Policy

The resolver may use whichever method is most defensible for the current
input and requested output. "Convenient" means defensible, traceable, and
basis-compatible, not merely available.

Candidate generation should include, when applicable:

1. exact measured full-stack source row;
2. exact measured subassembly plus calculated delta;
3. similar measured assembly used as a calibration corridor or bounded
   anchor;
4. calibrated family physics solver;
5. uncalibrated family physics solver with complete inputs;
6. bounded prediction when a full solver is not yet owned;
7. screening fallback only as visibly non-design-grade;
8. `needs_input` or `unsupported`.

Candidate selection must rank by:

- measurement or calculation basis compatibility: lab element, field
  measurement, or ISO 12354-style building prediction;
- requested metric and rating adapter: `Rw`, `STC`, `C`, `Ctr`, `R'w`,
  `DnT,w`, `Ln,w`, `IIC`, or future facade metrics;
- topology match quality: exact leaf/cavity/frame topology beats similar
  or ambiguous topology;
- physical input completeness and material-property quality;
- calibration and holdout residuals for the chosen family;
- explicit `errorBudgetDb` / `toleranceClass`;
- rejected-candidate reasons visible enough for engine, UI, saved replay,
  and report parity tests.

Similar-source use is allowed only through a named algorithm:

- parametric delta from a frequency-band family solver;
- local sensitivity / derivative around the source assembly;
- calibrated response surface with holdout rows;
- conservative bound where the direction of the delta is provable.

It is not acceptable to choose a nearby source row by string similarity or
material-name distance and surface that value as design-grade.

### Source-Absent Solver Equation Families

These equations define the intended calculation backbone. They are not a
license to retune broad runtime values in one pass; each family still
needs input contracts, positive benchmarks, nearby negatives, visible
basis checks, and tolerance ownership before promotion.

Single-leaf / massive / panel:

```text
m' = rho * h
TL_mass(f) ~= 20 * log10(m' * f) - 47..48
D = E * h^3 / (12 * (1 - nu^2))
fc = c0^2 / (2 * pi) * sqrt(m' / D)
```

The solver starts from mass law, then applies critical-frequency /
coincidence and loss-factor corrections. Required physical inputs are
surface mass or density/thickness. Young modulus, Poisson ratio, and loss
factor either come from material data, from a documented conservative
default with wider `errorBudgetDb`, or become `needs_input` if the
selected method requires them.

The improvement path is:

- current: mass-law / Sharp-like curve delegate where available;
- next: Davy/Cremer-style finite-size radiation and coincidence
  correction with damping sensitivity;
- later: thicker-wall shear correction, orthotropic timber/CLT variants,
  and calibrated material-family residuals.

Double-leaf / cavity wall:

```text
f0 = 1 / (2 * pi) * sqrt((rho0 * c0^2 / d) * (1 / m1' + 1 / m2'))
```

The solver must handle mass-law behaviour below mass-air-mass resonance,
the decoupled region above `f0`, cavity-mode transition when the cavity
depth becomes acoustically relevant, porous-fill damping, and structural
bridge limits. The total transmission should be composed as parallel
paths where needed:

```text
tau_total(f) = tau_air_cavity(f) + tau_bridge(f) + tau_leakage(f)
TL(f) = -10 * log10(tau_total(f))
```

Unknown stud/bridge coupling is not a harmless detail. It must produce
`needs_input` or a clearly wider uncertainty class unless a specific
family corridor owns the default.

The improvement path is:

- current: mass-air-mass plus existing Sharp/Davy/Cremer-style delegates
  and guarded calibrated corridors;
- next: explicit cavity-mode transition, absorber damping, and finite
  cavity/radiation corrections;
- later: frame/stud coupling as point/line connection paths or SEA/TMM
  hybrid candidates, with separate corridors for steel stud, timber stud,
  independent double stud, resilient channel, and clip systems.

Framed / stud walls:

The framed route is a double-leaf solver plus frame coupling metadata:
stud type, spacing, gauge or stiffness class, independent vs shared
tracks, resilient channels or clips, side count, and screw/fastener
coupling. The same layers on independent double studs and on a rigidly
bridged single frame can differ materially, so frame coupling must be a
first-class input rather than inferred from layer names.

Triple-leaf / multi-cavity:

Flat layer order is insufficient for design-grade results. The solver
needs grouped topology:

```text
leaf -> cavity -> leaf -> cavity -> leaf ...
```

The near-term route can use the existing three-leaf/two-cavity solver
where the topology is explicit. The longer-term generalized route should
be transfer-matrix or impedance-network based:

```text
each solid leaf: plate or limp-mass mechanical impedance Zp(w)
each MLV layer: limp mass plus damping Zmlv(w)
each cavity: acoustic compliance / propagation matrix
each porous fill: equivalent-fluid damping and propagation
system matrix -> tau(f) -> TL(f)
```

This is the class exposed by the ACON Probarrier / gypsum / mineral-wool
/ multi-cavity wall example. Exact sources can calibrate it later, but a
missing exact source must not collapse it to an apparently supported
screening answer. If grouped topology, cavity depths, MLV surface mass,
porous-fill properties, and frame coupling are missing, the calculator
should ask for them.

The improvement path is:

- current: guarded screening for ambiguous flat lists and existing grouped
  three-leaf/two-cavity prediction for the narrow owned case;
- next: grouped multi-leaf input contract and solver candidate for MLV /
  gypsum / mineral-wool / multi-cavity walls;
- later: generalized transfer-matrix / impedance-network solver for
  arbitrary solid, limp-mass, air, porous, and connection layers.

Porous fills and absorbers:

Mineral wool, glass wool, and similar porous fills are cavity damping
inputs, not simple isolation barriers. Flow resistivity, thickness, fill
coverage, placement, density, and optional absorption evidence inform the
model. NRC/absorption data may support damping assumptions but cannot
promote directly to `Rw`, `STC`, `Ln,w`, or `IIC`.

The improvement path is:

- current: absorber class / fill coverage and conservative default
  damping where the family owns it;
- next: Delany-Bazley-Miki equivalent-fluid propagation using flow
  resistivity and frequency;
- later: Biot/poroelastic options only when material data supports the
  extra parameters.

Rating adapters:

Family solvers produce curves first. `Rw`, `C`, and `Ctr` are ISO 717-1
adapter outputs. `STC` is an ASTM E413 adapter output. Impact ratings
follow ISO 717-2 / ASTM E989 where implemented. No adapter may silently
copy another rating just because the final integer is often close.

### INSUL Reference And DynEcho Differentiation

INSUL's public technical notes are useful because they expose the right
shape: single panels use mass, modulus, critical frequency, and loss
factor; double panels move through mass-law, mass-air-mass resonance,
cavity-mode, and structural-connection regions. DynEcho should use that
as a minimum bar, not a ceiling.

DynEcho should be better than INSUL in the product behaviours that matter
for this repo:

- exact measured rows and source-owned rows coexist with, but do not
  replace, physics solvers;
- every result exposes origin, basis, assumptions, error budget, and
  rejected candidates;
- lab element, field measurement, and building-prediction outputs are
  different bases with different required inputs;
- hostile unbounded layer combinations are first-class tests;
- the report/export layer must show the same value, basis, and support
  posture as the engine;
- missing source evidence never becomes a reason to abandon calculation.

### Element, Building, And Field Separation

- `Rw`, `STC`, `Ln,w`, and `IIC` can be element/lab or calculated
  element predictions when the stack owns the required physical data.
- `R'w`, `DnT,w`, `L'n,w`, `L'nT,w`, `AIIC`, `ISR`, and similar field or
  apparent outputs require room/context/flanking basis. They can be
  calculated only as continuations from an element prediction plus field
  context; otherwise they are `needs_input`.
- ISO 12354-style building estimation is not just the wall/floor layer
  stack. It needs separating element, receiving/source room context,
  flanking paths, junction/coupling, and receiver normalization.
- a lab element prediction cannot be silently surfaced as `R'w` or
  `DnT,w`; those require apparent/field or building-prediction context;
- a building-prediction result must declare whether it uses detailed
  frequency-band ISO 12354-style inputs or a simplified single-number
  route, and the simplified route must carry a wider uncertainty policy.

### Material Data Contracts

The current material schema is intentionally too small for high-accuracy
physics. The solver should start with conservative defaults only where
the method already has a bounded default, and must expose each default in
`airborneBasis.propertyDefaults`.

Minimum future material fields by role:

- solid leaf: density, thickness, surface mass, Young modulus, Poisson
  ratio, loss factor, critical-frequency override, shear-wave/thick-plate
  flag;
- board/laminate/MLV: limp-mass or plate behavior, damping/loss factor,
  bonded-vs-decoupled layering;
- porous fill: flow resistivity, absorber class, fill coverage, thickness,
  placement, density, optional ISO 354 / ASTM C423 absorption data;
- resilient support/floor layer: dynamic stiffness, load range,
  compression/creep assumptions, thickness, coverage;
- frame/bridge: stud type, spacing, gauge/stiffness, connection class,
  resilient channel side count, screw/clip coupling;
- cavity: depth, cavity count, leaf grouping, fill state, cavity mode
  assumptions, vent/leak flags;
- field context: source/receiver volume, receiving absorption or
  reverberation time, partition area, flanking/junction class.

### Family Solver Implications

- single leaf can begin with mass-law plus critical/coincidence and loss
  factor correction; if modulus/loss factor are absent, return a wider
  error budget or a bounded/screening result.
- double leaf must model mass-air-mass resonance, cavity depth, absorber
  fill, cavity mode transition, and structural bridge limits. Stud
  spacing/coupling can swing ratings enough that "same layers, unknown
  frame" should not silently be high confidence.
- triple leaf must be role/group based, not flat-list based. Complete
  grouped topology can calculate; ambiguous reorderable flat lists stay
  `needs_input` or screening.
- porous material data improves cavity damping but does not by itself
  define isolation. NRC/absorption cannot be promoted to Rw/STC.
- floating floor impact needs dynamic stiffness and loading basis;
  thickness/density alone is not a design-grade impact predictor.
- transfer-matrix modelling is the long-term generalized route for
  arbitrary multilayer stacks, but it should be introduced after material
  property widening and benchmark tests, not as the first Rockwool fix.

### Accuracy / Tolerance Policy

Use three tolerance classes until enough calibration data exists:

- `exact_source`: exact imported/measured row; tolerance belongs to source
  parsing and rating reproduction.
- `calibrated_prediction`: family solver calibrated against source rows
  with holdout tests; expected tolerance should be documented per family.
- `uncalibrated_prediction`: physics formula with complete inputs but no
  source-family calibration; expose wider `errorBudgetDb` and never call
  it exact.

For early gates, numeric acceptance should test ranges and monotonic
sanity rather than pretend false exactness:

- adding mass to one leaf should not reduce high-frequency TL outside
  known resonance/coincidence bands without a trace reason;
- adding absorber in a cavity should not be modelled as a pure mass
  increase;
- reducing bridge coupling should not reduce predicted insulation;
- swapping grouped leaves should either be physically symmetric or explain
  the asymmetry;
- adding many layers must not change family route because of array-order
  instability alone.

## Milestone Roadmap

These milestones are intentionally ordered so the project stops circling
source packets before it has a calculator architecture. Each milestone
must leave a testable artifact and a clear rollback boundary.

### M0 - Direction Lock / Research Baseline

Status: complete.

Purpose:

- freeze the corrected rule: source absence is not formula absence;
- record ISO/ASTM/INSUL/research evidence that the target is
  calculation plus calibrated data, not lookup;
- keep Rockwool exact/source validation blocked while unblocking
  formula-backed prediction planning.

Done when:

- `NEXT_IMPLEMENTATION_PLAN.md`, this slice, and
  `CALCULATION_MODEL_AND_VALIDATION.md` all state the same rule;
- `AGENTS.md` points agents to this plan before old source-packet paths;
- validation is docs-only clean with `git diff --check`.

### M1 - Gate A Direction Contract

Status: landed no-runtime on 2026-05-06.

Target:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`

Purpose:

- make the model-first pivot executable as a no-runtime contract;
- assert candidate origins, standards fields, and precedence order;
- explicitly demote source-packet refresh to exact-source/calibration
  backlog;
- assert Rockwool/Uris source absence blocks exact promotion only.

Done when:

- focused Gate A contract passes;
- runtime values remain frozen;
- the test names the later milestone order M2-M9.

Landed evidence:

- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`
  passed;
- `pnpm calculator:gate:current` passed after adding Gate A to the
  current-gate runner;
- Gate B is now the next implementation step.

### M2 - Basis And Candidate Schema

Purpose:

- add first-class airborne `basis` and `candidateSet` structures parallel
  to the impact lane's precedence posture;
- represent `measurementStandard`, `calculationStandard`,
  `ratingStandard`, `frequencyBands`, `curveBasis`, `errorBudgetDb`,
  `propertyDefaults`, `missingSourceEvidence`, and
  `missingPhysicalInputs`;
- preserve existing API parsing while adding basis metadata.

Done when:

- exact, calibrated, prediction, bounded, screening, needs-input, and
  unsupported outputs can be represented without changing numeric values;
- old workbench/report callers continue to parse;
- engine tests prove source absence and input absence are distinct
  fields.

### M3 - Rating Adapter Integrity

Purpose:

- inventory and pin ISO 717-1, ISO 717-2, ASTM E413, and ASTM E989
  rating adapters;
- stop silent `Rw`/`STC`, `Ln,w`/`IIC`, and lab/field metric aliasing;
- make every single-number output traceable to a curve or exact source
  row.

Research basis:

- ISO 717 and ASTM E413/E989 are rating adapters, not stack solvers;
- field/apparent metrics must keep ISO 16283 / ASTM E336/E1007 context.

Done when:

- every surfaced rating has `ratingStandard` or explicit
  `engine_native` basis;
- tests fail if `STC` is copied from `Rw` without a compatible basis;
- impact ratings cannot be inferred from airborne curves.

### M4 - Input Completeness / Needs-Input Matrix

Purpose:

- define minimum physical inputs per solver family before resolver
  promotion;
- ask the user for missing topology/geometry instead of inventing it;
- allow optional precision fields to widen uncertainty only where a
  solver owns a documented default.

Research basis:

- ISO 12354 and ISO 10848 separate element performance, room/building
  geometry, flanking/junction paths, and field context;
- ISO 9053/354/ASTM C423 absorption data is useful only as absorber
  evidence, not isolation evidence;
- ISO 9052-1 dynamic stiffness is required for design-grade floating
  floor impact prediction.

Done when:

- single leaf, double leaf/framed, triple leaf, porous fill,
  floating-floor, and field/apparent rows each name required inputs;
- `needs_input` names exact missing fields for the UI;
- missing exact source never causes `needs_input` by itself.

### M5 - Airborne Candidate Resolver

Purpose:

- extract airborne selection out of `calculate-assembly.ts`;
- collect exact full-stack source, partial anchor plus delta, calibrated
  family physics, uncalibrated family physics, bounded prediction,
  screening fallback, needs-input, and unsupported candidates;
- return selected and rejected candidates so tests can prove why a
  tempting but invalid path lost.

Done when:

- selection is deterministic under duplicate rows and safe reorders;
- exact rows only win on exact topology/metric match;
- valid physics candidates survive source-packet absence;
- missing topology moves to `needs_input`.

### M6 - First Runtime Prediction: Grouped Rockwool Triple Leaf

Purpose:

- make the first visible correction a calculator result, not another
  source-packet wait;
- run the existing grouped two-cavity/triple-leaf solver as
  `family_physics_prediction`;
- keep exact/source-validated flags false.

Done when:

- complete grouped Rockwool topology no longer remains blocked by
  `rights_safe_source_owned_curve_payload_absent`;
- output carries finite `Rw`, `STC`, `C`, and `Ctr` from the solver curve;
- visible cards and reports say calculated prediction, not measured
  exact;
- flat-list ambiguous/reorder-sensitive Rockwool remains guarded.

### M7 - Calibration / Exact Promotion Layer

Purpose:

- return source packets to their correct role: exact override,
  calibration, benchmark, and holdout validation;
- allow measured subassemblies to anchor calculated delta candidates;
- prevent source rows from deleting or bypassing physics candidates.

Research basis:

- ISO 12999-1 uncertainty context supports explicit uncertainty/error
  handling instead of false exactness;
- source rows can reduce error budgets only through explicit calibration
  metadata and holdout tests.

Done when:

- measured exact, calibrated prediction, and uncalibrated prediction are
  separate candidate origins;
- source rows can promote only owned topology/metric/scope;
- calibration reports holdout tolerance and failure cases.

### M8 - Family Expansion And Material Property Widening

Purpose:

- expand beyond Rockwool without repeating one-off fix loops;
- add material properties needed by family solvers: modulus, Poisson
  ratio, loss factor, flow resistivity, porosity, limp-mass/membrane
  behavior, dynamic stiffness, uncertainty, and source status;
- introduce transfer-matrix/multilayer modelling only after the material
  contracts and validation harness exist.

Done when:

- single-leaf, double-leaf/framed, triple-leaf, lined massive/masonry,
  timber/CLT, floor/impact, and field/apparent families each have a
  named solver or explicit unsupported/needs-input boundary;
- scenario tests cover common professional layer combinations and hostile
  reorder/split/duplicate cases.

Gate I landed shape:

- shared material definitions now accept optional acoustic properties:
  behaviour, modulus, Poisson ratio, loss factor, flow resistivity,
  porosity, and source status;
- seed catalog common materials now carry nominal engineering defaults
  for readiness checks, not measured-exact source ownership;
- `airborne-family-material-expansion.ts` defines M8 benchmark scenarios
  and a readiness evaluator for single-leaf, double/framed, triple-leaf,
  lined masonry, CLT/mass timber, and floating-floor routes;
- missing required material properties produce `needs_input`; optional
  precision gaps produce `complete_with_defaults` plus error-budget
  adjustment;
- runtime values remain frozen and Gate J is selected for personal-use
  readiness scenario pack coverage.

### M9 - Personal-Use Readiness Gate

Purpose:

- decide whether the calculator is ready for private use as a
  high-accuracy tool;
- turn the source-absent solver contract into executable user scenarios
  before any further broad formula retune.

Done when:

- broad scenario tests cover wall/floor, exact source, anchored delta,
  physics prediction, field context, and unsupported/needs-input flows;
- the scenario pack includes an ACON-like multi-leaf/multi-cavity wall
  with MLV, gypsum boards, mineral wool, multiple cavities, and frame
  coupling metadata as an anti-library-drift regression;
- source absence is proven to leave the model-first calculation path
  alive, while missing physical topology/material inputs produce
  `needs_input`;
- method selection is proven across exact measured rows, similar-source
  anchors, calibrated solvers, uncalibrated solvers, bounded predictions,
  screening fallbacks, and missing-input/unsupported outcomes;
- `pnpm calculator:gate:current`, `pnpm check`, and docs guards pass;
- known incorrect/low-confidence corridors are either fixed, visibly
  labelled, or blocked with a named next slice.

### Near-Term Execution Order After Gate L

Gate J has landed the personal-use readiness scenario pack, Gate K has
landed the route/input topology contract, and Gate L has landed the
topology normalizer / hostile input guard. The unfinished point is now
Gate M:
`gate_m_populate_dynamic_candidate_resolver_runtime_for_dynamic_calculator`.

1. Keep the Gate J scenario pack as the anti-library-drift contract.
2. Keep the Gate K route/input prompt contract as the wall/floor
   user-flow boundary: source absence is not `needs_input`, missing
   physical topology/context is.
3. Use the ACON-like multi-leaf wall as a hostile personal-use scenario:
   exact source absent, flat-list input guarded, grouped topology
   required, and screening fallback visibly non-design-grade.
4. Keep method-selection scenarios where exact source, similar-source
   anchored delta, calibrated solver, uncalibrated solver, bounded
   prediction, screening fallback, `needs_input`, and `unsupported`
   compete with visible rejected reasons.
5. Keep the Gate L normalizer/guard active: safe edits stay stable,
   unsafe reorders stay traced, and ambiguous flat multi-cavity input
   asks for grouped topology.
6. Populate the dynamic candidate resolver runtime surface so exact,
   anchored, calibrated, uncalibrated, bounded, screening,
   `needs_input`, and `unsupported` candidates can be selected/rejected
   with visible basis-compatible reasons.
7. Move solver runtime in family-sized gates only: single-leaf,
   double/framed, triple/multi-cavity, porous-fill, and impact each need
   their own positive benchmark, negative boundary, and error budget.
8. Return to source acquisition/calibration only after the physics route
   exists, using source rows as exact override, calibration, holdout, and
   tolerance evidence.

## Dynamic Calculator Implementation Work Program

This program is the practical route from the current model-first pivot to
personal-use readiness. It is ordered to prevent the project from
slipping back into source-library work while still preserving trusted
measurements as the safest candidate when they truly match.

### Step 1 - Gate J Scenario Pack Contract

Status: landed by
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-j-personal-use-readiness-scenario-pack-contract.test.ts`.

Goal:

- make personal-use readiness executable before broad runtime movement.

Work:

- create
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-j-personal-use-readiness-scenario-pack-contract.test.ts`;
- define wall and floor scenario fixtures that represent the real user
  flow: route selection, required physical inputs, layers/thicknesses,
  requested outputs, and saved/replayed state;
- include exact source, similar-source anchored delta, calibrated solver,
  uncalibrated solver, bounded prediction, screening, `needs_input`, and
  `unsupported` candidates;
- include the ACON-like MLV / gypsum / mineral-wool / multi-cavity wall:
  flat-list remains guarded, grouped topology is required, and source
  absence does not trigger a source-packet queue.

Done when:

- the Gate J test fails if the product behaves like a lookup library;
- selected and rejected candidate reasons are asserted;
- visible card/report parity is part of the scenario definition, even if
  some checks are no-runtime metadata at first.

### Step 2 - Route Input Contract And Needs-Input Matrix

Status: landed by
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-k-route-input-topology-contract.test.ts`.

Goal:

- make the calculator ask for the right information at the right time.

Work:

- split route context by `wall` and `floor`;
- split output basis by lab/element, field/apparent, and
  building-prediction;
- define required fields per family:
  single leaf, double/framed, triple/multi-cavity, lined massive, CLT,
  porous fill, floating floor impact, and field/building continuations;
- surface missing inputs as machine-readable prompts such as cavity depth,
  frame coupling, stud spacing, MLV surface mass, flow resistivity,
  dynamic stiffness, room volume, partition area, flanking/junction class,
  or receiving-room reverberation context.

Done when:

- a missing source row never produces `needs_input` by itself;
- missing physical data produces targeted `needs_input`;
- optional defaults are visible in `propertyDefaults` and widen
  `errorBudgetDb`.

### Step 3 - Topology Normalizer And Hostile Input Guard

Status: landed by
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-l-topology-normalizer-hostile-input-contract.test.ts`.

Goal:

- make layer input robust when users add too many layers, duplicate
  layers, split one role into many rows, or reorder layers.

Work:

- normalize contiguous same-role layers where the physics is invariant;
- preserve order where order is physically meaningful, especially
  multi-leaf/multi-cavity stacks;
- convert flat layers into grouped topology only when the mapping is
  unambiguous;
- otherwise return guarded screening or `needs_input`;
- add stress tests for long layer lists, duplicate boards, split mineral
  wool, duplicate MLV, tiny air gaps, zero/negative/huge thickness, and
  unsafe reorder.

Done when:

- safe reorders stay numerically stable;
- unsafe reorders change result only with a trace reason;
- hostile inputs cannot silently promote to design-grade support.

### Step 4 - Dynamic Candidate Resolver Runtime Population

Status: Gate M landed at
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts`.

Selection after closeout:

`gate_m_dynamic_candidate_resolver_runtime_landed_no_value_selected_family_solver_upgrade_gate_n`

Goal:

- make airborne/wall behave like a transparent dynamic calculator, not a
  single selected-curve pipeline.

Work:

- populate candidate sets for exact full-stack, exact subassembly plus
  calculated delta, similar-source anchored delta, calibrated family
  physics, uncalibrated family physics, bounded prediction, screening,
  `needs_input`, and `unsupported`;
- rank by topology match, metric basis, input completeness, source
  ownership, calibration residual, and uncertainty;
- expose rejected-candidate reasons to engine tests, UI cards, saved
  replay, and reports.

Done when:

- exact source wins only on exact match;
- source-absent family solvers remain live candidates;
- lab, field, and building-prediction candidates cannot replace each
  other without required context.

### Step 5 - Family Solver Upgrade Gates

Goal:

- move runtime in small, defensible family gates.

Family gates:

- single leaf / massive / panel: mass law, Davy/Cremer finite-size and
  coincidence correction, damping/loss factor, thick-wall shear, CLT
  orthotropy later;
- double leaf / framed: mass-air-mass, cavity-mode transition, porous
  damping, stud/bridge/resilient coupling, independent double-stud
  corridor;
- triple / multi-cavity: grouped leaf/cavity input, MLV limp mass,
  porous cavities, current grouped solver, then transfer-matrix /
  impedance-network generalization;
- lined massive / masonry / CLT: heavy core plus lining/facing family
  solvers, source anchors only inside owned topology;
- porous / MLV material models: flow resistivity, equivalent-fluid
  damping, limp-mass surface density, damping/loss factor, source status;
- floor / impact: exact source, dynamic stiffness, explicit `DeltaLw`,
  floor-system predictor, field impact continuations, and ISO/ASTM rating
  separation;
- field / building prediction: room volume, area, flanking, junction,
  receiving absorption/reverberation, detailed vs simplified ISO 12354
  route, and wider uncertainty for simplified paths.

Done when each family gate has:

- required physical inputs;
- named equations or solver method;
- positive benchmark and nearby negative;
- hostile input tests;
- curve/rating adapter parity;
- tolerance/error-budget ownership;
- visible/report parity.

### Step 6 - UI Prompting And Report Parity

Goal:

- make the user flow match the dynamic calculator model.

Work:

- route selection opens only relevant fields;
- requested outputs drive extra field prompts;
- layer editor supports grouped topology where required;
- missing-input messages name exact fields instead of generic failure;
- output cards show basis, origin, support bucket, assumptions, and
  uncertainty;
- PDF/DOCX reports match the engine and workbench values unless the user
  manually edits the proposal snapshot.

Done when:

- every scenario in Gate J has engine, visible-card, saved-replay, PDF,
  and DOCX parity coverage or an explicitly named pending parity task.

### Step 7 - Source Calibration And Research Backlog

Goal:

- use external research and measured rows to make solvers more accurate,
  not to replace solvers.

Work:

- collect rights-safe source rows for exact override, calibration, and
  holdout;
- research and implement missing family algorithms where local methods are
  weak;
- compare against INSUL-style behaviour but set a stronger bar: visible
  origin, rejected candidates, uncertainty, hostile-input stability, and
  source-absent calculation.

Done when:

- source rows can promote only their exact topology/metric scope;
- calibration reduces error budget only with holdout evidence;
- source absence never blocks a physically sufficient dynamic calculation.

## Final Pre-Implementation Research And Engine Read - 2026-05-06

This final read confirms the implementation should now move into Gate J,
not into another source-catalog expansion.

External prediction-engine bar:

- INSUL's current user guide describes itself as a prediction program for
  walls, floors, ceilings, and windows, based on theoretical models with
  minimal construction information, refined against laboratory tests:
  <https://docs.insul.co.nz/v10/>
- INSUL technical notes state the single-panel route uses mass per area,
  elastic modulus, mass law, critical frequency, loss factor,
  finite-size/radiation behavior, and thick-panel/shear effects:
  <https://www.insul.co.nz/tech-info/>
- INSUL double-panel notes split the problem into airborne cavity and
  structure-borne/bridging paths, with absorber flow-resistivity inputs
  and connection/frame modelling:
  <https://docs.insul.co.nz/v10/SoundInsulationTheory/Airborne-DoublePanels-Overview/>
- INSUL triple-panel notes are useful because they show the natural
  extension of double-panel principles to multi-panel stacks, but they
  also warn that triple-panel accuracy is materially lower:
  <https://docs.insul.co.nz/v10/SoundInsulationTheory/Airborne-TriplePanels/>
- INSUL rating notes keep STC and Rw as curve-derived rating methods with
  different frequency ranges and rule details, reinforcing that DynEcho
  must use adapters rather than blind aliases:
  <https://docs.insul.co.nz/v10/SoundInsulationTheory/Ratings-Airborne/>
- INSUL impact notes show a useful floor route split: massive vertical
  impact based on point-force theory, lightweight floors based on their
  own theory, and explicit limits for horizontal/diagonal impact:
  <https://docs.insul.co.nz/v10/SoundInsulationTheory/Impact-ImpactSound/>
- DIN 4109 examples using `RD = 30.9 * log(m'/m0) - 22.2` confirm the
  KS-style local mass-curve lane is a real massive-element reference,
  but only inside its owned mass/material route:
  <https://storefrontapi.commerce.xella.com/medias/sys_master/root/hcf/h0e/8835609264158/Berechnung-der-Luftschalldaemmung_K.Naumann_T.Schoch/Berechnung-der-Luftschalldaemmung-K.Naumann-T.Schoch.pdf>

Local engine read:

- `packages/engine/src/airborne-calculator.ts` exposes the current
  delegate calculators: `ks_rw_calibrated`, `mass_law`, `sharp`, and
  `kurtovic`.
- KS currently infers a wall/floor type and calculates mass-based `Rw`
  formulas such as the dense massive lane `30.9 * log10(m') - 22.2`,
  then builds a calibrated mass-law curve. This is a good anchor for
  owned massive routes, not for arbitrary cavities or framed walls.
- Sharp and Kurtovic currently build single-panel frequency curves from
  surface mass, inferred stiffness, critical frequency, loss factor, and
  finite-panel radiation efficiency. The only double-leaf behavior in
  that file is a small gap bonus, not a full double-panel solver.
- `packages/engine/src/dynamic-airborne.ts` calculates all delegates and
  blends them by detected family. Rigid and single-leaf routes therefore
  have useful physics candidates, but `multileaf_multicavity` still
  selects `multileaf_screening_blend`, and stud/double-stud routes remain
  surrogate blends.
- This explains the ACON-like wall failure mode: the engine can detect a
  multi-leaf/multi-cavity family, but the selected runtime method is still
  a conservative screening/Sharp blend rather than a grouped
  leaf/cavity/MLV/porous/bridge solver.

Implementation consequence:

1. Gate J remains the first implementation step. It must make the
   personal-use scenario pack executable without moving runtime values.
2. Gate J must include ACON-like source-absent multi-leaf/multi-cavity,
   exact-source, similar-source anchored delta, calibrated solver,
   uncalibrated solver, bounded prediction, screening, `needs_input`, and
   `unsupported` scenarios.
3. Add an engine-inventory assertion in or near Gate J that records the
   current KS/mass-law/Sharp/Kurtovic/dynamic-blend posture and prevents
   surrogate or screening routes from being mistaken for design-grade
   solvers.
4. After Gate J, implement route input and topology contracts before
   solver retuning: wall/floor route, output basis, grouped
   leaves/cavities, MLV surface mass, cavity depth, frame/bridge
   coupling, porous flow resistivity, dynamic stiffness, room/flanking
   context, and missing-input prompts.
5. Runtime movement then happens by family gate: single-leaf/massive,
   double/framed, triple/multi-cavity, lined massive/CLT/masonry,
   porous/MLV, floating-floor impact, and field/building continuations.
6. Source rows collected during these gates are exact overrides,
   calibration anchors, holdouts, bounds, and negative tests. They do not
   replace source-absent dynamic calculation.

## Benchmark And Acceptance Matrix

Use this matrix to decide whether a milestone is complete. Every
runtime-moving milestone must add or extend these benchmark rows instead
of relying on one happy-path number.

### B0 - No-Runtime Direction Contract

Applies to: M1.

Acceptance:

- active slice, target file, and milestone order are asserted;
- current Rockwool and other runtime values stay frozen;
- source absence is asserted as an exact/calibration blocker only.

### B1 - Exact Full-Stack Source Row

Applies to: M2, M5, M7, M9.

Acceptance:

- exact full-stack source row wins only on exact topology, metric, and
  rating basis match;
- result carries `measured_exact_full_stack`, source id, measurement
  standard, rating standard, and exact flags;
- adjacent near-miss stacks do not borrow the exact row.

### B2 - Exact Subassembly Anchor Plus Delta

Applies to: M2, M5, M7, M9.

Acceptance:

- an exact subassembly can participate only when the remaining layer
  delta has a named calculation method;
- full-stack physics and anchored-delta candidates can coexist;
- rejected-candidate trace explains why one candidate won.

### B3 - Single-Leaf / Massive Physics

Applies to: M4, M5, M8, M9.

Acceptance:

- surface mass or density/thickness is required;
- missing modulus/loss factor widens `errorBudgetDb` unless a solver
  explicitly requires them;
- adding mass should not reduce high-frequency TL outside documented
  resonance/coincidence reasons;
- `Rw` and `STC` are rated from compatible curves, not copied aliases.

### B4 - Double-Leaf / Framed / Cavity Physics

Applies to: M4, M5, M8, M9.

Acceptance:

- leaf groups, cavity depth, bridge/frame class, support spacing, and
  fill state are represented or named as missing;
- absorber/fill changes damping assumptions, not simple mass;
- unknown frame/bridge topology is `needs_input` or a visibly wider
  uncertainty class, not high-confidence prediction.

### B5 - Triple-Leaf / Multi-Cavity Physics

Applies to: M4, M5, M6, M8, M9.

Acceptance:

- grouped topology with two cavities can calculate as
  `family_physics_prediction`;
- flat-list ambiguous topology remains `needs_input` or guarded
  screening;
- grouped Rockwool can move from screening to prediction, while exact and
  source-validated flags remain false until M7.

### B6 - Porous Fill / Absorption Data Boundary

Applies to: M3, M4, M8, M9.

Acceptance:

- ISO 9053 / ISO 354 / ASTM C423 style data can support absorber/fill
  assumptions;
- NRC or absorption rows never promote directly to `Rw`, `STC`, `Ln,w`,
  or `IIC`;
- missing flow resistivity/absorber class either uses a documented
  conservative default or becomes `needs_input`.

### B7 - Floating Floor / Impact Prediction

Applies to: M3, M4, M5, M8, M9.

Acceptance:

- dynamic stiffness/load basis is required for design-grade
  floating-floor impact prediction;
- `Ln,w` / `IIC` are rated through ISO 717-2 / ASTM E989-compatible
  routes;
- field impact outputs require ASTM E1007 / field-context ownership.

### B8 - Field / Apparent Output Context

Applies to: M3, M4, M5, M9.

Acceptance:

- `R'w`, `DnT,w`, `L'n,w`, `L'nT,w`, and facade/OITC-like future outputs
  require room, area, flanking, junction, or facade context as relevant;
- ISO 12354 / ISO 10848 / ISO 16283 context is visible in basis metadata;
- missing field context produces `needs_input`, not design-grade output.

### B9 - Rating Adapter Integrity

Applies to: M3, M5, M9.

Acceptance:

- every single-number rating is traceable to a frequency curve or exact
  source metadata;
- `Rw`, `STC`, `IIC`, `Ln,w`, field, and facade ratings cannot silently
  alias each other;
- adapter changes require curve-level regression tests, not only final
  integer assertions.

### B10 - Hostile Layer Input Stability

Applies to: M4, M5, M6, M8, M9.

Acceptance:

- duplicate, split, reordered, very long, and mixed-role layer lists do
  not change route family without a trace reason;
- grouped topology remains stable under safe reorder;
- hostile flat-list inputs fail closed with missing-field diagnostics.

### B11 - Calibration / Holdout

Applies to: M7, M8, M9.

Acceptance:

- source rows can calibrate only the family/topology scope they own;
- holdout rows must remain outside calibration fitting;
- calibrated prediction, uncalibrated prediction, and exact source remain
  separate origins with separate error budgets.

### B12 - Personal-Use Scenario Pack

Applies to: M9.

Acceptance:

- scenario pack covers wall, floor, exact source, anchored delta,
  uncalibrated prediction, calibrated prediction, field continuation,
  `needs_input`, unsupported, and hostile inputs;
- realistic source-absent walls, including MLV / gypsum / mineral-wool /
  multi-cavity stacks, cannot drift into a lookup-source queue or surface
  an apparently design-grade screening number;
- engine, web visible cards, saved/replayed scenarios, and reports agree
  on value, basis, and support bucket.

### B13 - Method Selection / Similar Source Delta

Applies to: M5, M7, M8, M9.

Acceptance:

- exact measured full-stack, similar-source anchored delta, calibrated
  family solver, uncalibrated family solver, bounded prediction,
  screening fallback, `needs_input`, and `unsupported` can coexist as
  candidates;
- similar source rows are never copied by nearest-neighbor lookup; they
  can only anchor a delta, calibrate a corridor, define a response
  surface, or set a conservative bound through a named algorithm;
- the resolver chooses the lowest-risk basis-compatible candidate for the
  requested metric and exposes rejected-candidate reasons;
- lab element, field/apparent, and building-prediction candidates cannot
  replace each other without the required room/flanking/rating context.

## Initial Tolerance Classes

Tolerance numbers must be owned per family before runtime promotion. Use
these classes until source-backed family calibration replaces them:

- `exact_source`: exact imported/measured row. Tests assert exact source
  id, exact metric, and rating basis reproduction.
- `calibrated_prediction`: family solver calibrated against owned source
  rows with holdout tests. Tests assert target tolerance, residual
  summary, and rejected outliers.
- `uncalibrated_prediction`: complete physical inputs and named solver,
  but no family calibration yet. Tests assert range, monotonic sanity,
  assumptions, and wider `errorBudgetDb`; visible copy must not imply
  exactness.
- `bounded_prediction`: conservative bound where exact or full physics is
  unavailable. Tests assert bound direction and prevent exact-field
  leakage.
- `screening_fallback`: rough/legacy screening. Tests assert visible
  caveat and prevent company-internal high-accuracy promotion.

Stop rules:

- no non-exact result may surface without `errorBudgetDb` or
  `toleranceClass`;
- no field/apparent metric may surface as design-grade without required
  field context;
- no runtime value may move without at least one positive benchmark row
  and one nearby negative/hostile row;
- no source row may promote a broader family than its topology, metric,
  material mapping, and tolerance owner allow.

## Current Implementation Reading

Read these files before implementing this slice:

- `packages/engine/src/calculate-assembly.ts`
  - current entry point; dynamic airborne, verified catalog anchors,
    field companions, impact lane, output support, and Rockwool
    withholding are composed here.
- `packages/engine/src/airborne-verified-catalog.ts`
  - full-stack exact source anchor exists and should be retained.
  - gap: no partial source anchor plus calculated delta candidate.
- `packages/engine/src/impact-lane.ts`
  - closest existing pattern for precedence-based candidate resolution:
    exact source, exact system, bound, product, explicit delta,
    predictor, narrow estimate, family estimate.
- `packages/engine/src/dynamic-airborne.ts`
  - current airborne family selector and correction stack.
  - gap: `multileaf_multicavity` still selects
    `multileaf_screening_blend`, not a triple-leaf solver.
- `packages/engine/src/wall-triple-leaf-frequency-solver.ts`
  - existing three-leaf/two-cavity curve solver can produce band curve,
    `Rw`, `STC`, leaf masses, cavities, and resonances from grouped
    topology.
  - current blocker: it is typed as `researchOnly: true`,
    `runtimeEligible: false`, and `sourceOwned: false`.
- `packages/engine/src/wall-triple-leaf-engine-integration-fail-closed.ts`
  - current source-promotion prerequisites keep runtime on
    `multileaf_screening_blend`.
  - required correction: split exact-source promotion prerequisites from
    formula-backed prediction prerequisites.
- `packages/shared/src/domain/assembly.ts` and
  `packages/shared/src/domain/dynamic-airborne.ts`
  - current schemas lack a first-class airborne output origin/basis
    equivalent to impact/floor basis semantics.
- `packages/shared/src/domain/material.ts`
  - current material schema is too sparse for broad high-accuracy
    physics; it needs a later material-property widening plan.

## Non-Negotiable Model

Airborne/wall results must carry one of these origins:

- `measured_exact_full_stack`
- `measured_exact_subassembly_plus_calculated_delta`
- `calibrated_family_physics`
- `family_physics_prediction`
- `bounded_prediction`
- `screening_fallback`
- `needs_input`
- `unsupported`

Selection precedence:

1. full-stack measured exact source row;
2. full-stack source-anchored/calibrated family solver;
3. exact subassembly anchor plus calculated delta;
4. full-stack family-specific physics solver;
5. bounded prediction;
6. screening fallback;
7. needs-input/unsupported when required topology or geometry is absent.

Exact/source labels require source-owned topology, material mapping,
metric context, tolerance, negative boundaries, calibration/holdout, and
paired engine/web/report tests.

Formula-backed prediction requires:

- sufficient topology for the selected family;
- finite material properties or conservative defaults with uncertainty;
- a named solver/method;
- output basis and visible copy that says calculated prediction, not
  measured exact;
- numeric sanity tests and negative-boundary tests.

## Gate A - Contract And Schema Plan

Gate A is no-runtime. It defines the contract and blocks future agents
from returning to a source-packet-only path.

Implementation target:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`

Required Gate A assertions:

1. Active selected slice is this model-first pivot, not
   `rockwool_split_triple_leaf_rights_safe_source_packet_refresh_v2`.
2. Missing Rockwool/Uris/source packet blocks only measured-exact
   promotion, not formula-backed prediction.
3. Airborne candidate origins listed above are named in the contract,
   with standards-backed labels:
   - `measurementStandard`: ISO 10140, ISO 16283, ASTM E90, ASTM E336,
     ASTM E492, or none for pure prediction;
   - `ratingStandard`: ISO 717-1, ISO 717-2, ASTM E413, ASTM E989, or
     engine-native bounded estimate;
   - `calculationStandard`: ISO 12354-1, ISO 12354-2, or named local
     physics solver.
4. The impact lane is identified as the precedence pattern for the
   airborne resolver.
5. Rockwool grouped triple-leaf is the first benchmark target for a
   calculated prediction path.
6. Flat-list triple-leaf remains guarded: if topology is ambiguous,
   request grouped topology or mark needs-input; do not invent exact
   support from reorder-sensitive flat lists.
7. The existing untracked/stale
   `packages/engine/src/calculator-model-first-pivot-gate-a-contract.test.ts`
   must not be treated as landed unless it is reviewed and deliberately
   replaced by the Gate A target above.

Validation:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts --maxWorkers=1
git diff --check
```

## Gate B - Shared Basis And Candidate Shape

Add a shared airborne result basis/candidate schema. Suggested shape:

- `airborneBasis.kind`
- `airborneBasis.origin`
- `airborneBasis.family`
- `airborneBasis.method`
- `airborneBasis.calculationStandard`
- `airborneBasis.ratingStandard`
- `airborneBasis.measurementStandard`
- `airborneBasis.frequencyBands`
- `airborneBasis.curveBasis`
- `airborneBasis.exactSourceId`
- `airborneBasis.anchorSourceId`
- `airborneBasis.errorBudgetDb`
- `airborneBasis.toleranceClass`
- `airborneBasis.requiredInputs`
- `airborneBasis.assumptions`
- `airborneBasis.propertyDefaults`
- `airborneCandidateSet[]`

No numeric behavior should move until the schema is populated and tests
prove old callers still parse.

Gate B acceptance:

- existing API callers continue to parse;
- exact/catalog rows can identify their measurement/rating standard;
- formula predictions can identify their calculation/rating standard;
- field continuations can identify field context instead of appearing as
  lab exact values;
- UI/report cards can distinguish `measured exact`, `anchored
  prediction`, `calibrated prediction`, `physics prediction`, `bounded`,
  `screening`, `needs input`, and `unsupported`.

Implementation detail after the 2026-05-06 plan/implementation
validation:

Gate B has landed no-runtime. Gate A is landed and current-gate
validated, and the selected Gate B file now adds shared schema support
for first-class `airborneBasis` / `airborneCandidateSet` fields. This
means the active slice is still in progress, but the next step is Gate C
rating-adapter integrity, not a new slice and not runtime movement.

Landed implementation shape:

1. Created a small shared schema module for airborne basis metadata:
   `packages/shared/src/domain/airborne-basis.ts`.
2. Exported it from `packages/shared/src/index.ts`.
3. Added optional `airborneBasis` and `airborneCandidateSet` fields to
   `AssemblyCalculation` in `packages/shared/src/domain/assembly.ts`.
   Optional fields preserve old API/workbench/report callers in Gate B.
4. Created
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts`.
5. Added Gate B to `tools/dev/run-calculator-current-gate.ts`.

The Gate B contract test should be data-shape-first and no-runtime:

- parse a legacy assembly result with no airborne basis fields;
- parse an exact full-stack candidate with `measurementStandard` and
  `ratingStandard`;
- parse a formula-backed prediction candidate with
  `calculationStandard`, `ratingStandard`, and either `errorBudgetDb` or
  `toleranceClass`;
- parse a `needs_input` candidate where `missingPhysicalInputs` is
  populated and `missingSourceEvidence` is not treated as the same
  field;
- parse a source-blocked exact/calibration candidate where
  `missingSourceEvidence` is populated but a separate physics candidate
  can still exist;
- assert the current Rockwool frozen values through `calculateAssembly`
  so Gate B cannot accidentally become M6.

Do not populate the runtime resolver broadly in Gate B. It is acceptable
for the focused contract to build representative basis/candidate objects
directly, plus a small compatibility parse through
`AssemblyCalculationSchema`. Gate E later owns optional resolver
metadata. Runtime population and numeric movement belong to Gate G/M6.

2026-05-06 update: Gate E has now added that optional resolver metadata
surface without runtime population.

## Gate C - Rating Adapter Inventory

Gate C has landed no-runtime. Before changing solver values, it
inventoried and pinned rating adapters:

- ISO 717-1 adapter for `Rw`, `C`, and `Ctr` from one-third-octave or
  octave airborne curves;
- ASTM E413 adapter for `STC` from compatible airborne transmission-loss
  curves;
- ISO 717-2 adapter for `Ln,w`, `L'n,w`, `L'nT,w`, and related impact
  single-number ratings;
- ASTM E989 adapter for `IIC` from ASTM E492/E1007-compatible impact
  band data.

Gate C acceptance:

- every rating has a named rating standard or is marked engine-native;
- `Rw` and `STC` are not silently interchangeable;
- impact ratings are not inferred from airborne ratings;
- field ratings are not labelled as lab exact;
- current values remain frozen unless the adapter already exists and the
  test only exposes metadata.

Gate C landed implementation shape:

- added `packages/shared/src/domain/rating-adapter.ts`;
- exported rating-adapter schemas from `packages/shared/src/index.ts`;
- added optional `ratingAdapterBasisSet` to `AssemblyCalculationSchema`;
- added the focused Gate C contract at
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-c-rating-adapter-contract.test.ts`;
- added Gate C to `tools/dev/run-calculator-current-gate.ts`;
- kept runtime values, support buckets, confidence, evidence, visible
  cards, proposal/report copy, and workbench input behavior frozen.
- validated focused Gate C 1 file / 6 tests, Gate A/B/C continuity
  3 files / 17 tests, and `pnpm calculator:gate:current` with engine
  284 files / 1604 tests, web 61 files / 273 passed + 18 skipped, repo
  build 5 / 5 tasks, and whitespace guard green;
- validated broad `pnpm check` with lint/typecheck clean, engine 409
  files / 2406 tests, web 166 files / 936 passed + 18 skipped, repo
  build 5 / 5 tasks, and final `git diff --check` green after
  `apps/web/next-env.d.ts` restoration.

Gate C selected Gate D:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts`

`gate_d_define_physical_input_completeness_needs_input_matrix_without_value_movement`

## Gate D - Input Completeness / Needs-Input Matrix

Before the resolver promotes physics predictions, define the minimum
input matrix per family. This gate prevents "calculate everything" from
turning into "invent missing physics".

Required matrix rows:

- single leaf:
  surface mass or density/thickness; material class; optional modulus and
  loss factor; missing modulus/loss factor widens uncertainty.
- double leaf/framed:
  leaf grouping, cavity depth, frame/bridge class, fill state, support
  spacing/side-count where relevant.
- triple leaf:
  side A leaf group, cavity 1, internal leaf group, internal coupling,
  cavity 2, side B leaf group, support topology.
- porous fill:
  thickness, placement, fill coverage, flow-resistivity/absorber class or
  conservative default marker.
- floating floor:
  base slab/floor, topping or floating layer, resilient layer dynamic
  stiffness/load basis, ceiling/lower assembly where relevant.
- field/apparent outputs:
  partition area, source/receiver volume or receiving-room normalization,
  flanking/junction class or explicit conservative flanking assumption.

Acceptance:

- missing exact source never yields `needs_input` by itself;
- missing physical topology/input yields `needs_input`;
- missing optional precision parameters yields wider uncertainty only when
  the selected solver has documented defaults;
- every `needs_input` result names the missing fields the UI should ask
  for.

Gate D landed implementation shape:

- added `packages/shared/src/domain/input-completeness.ts`;
- exported input-completeness schemas from `packages/shared/src/index.ts`;
- added optional `inputCompletenessSet` to `AssemblyCalculationSchema`;
- added the focused Gate D contract at
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-d-input-completeness-contract.test.ts`;
- added Gate D to `tools/dev/run-calculator-current-gate.ts`;
- kept runtime values, support buckets, confidence, evidence, visible
  cards, proposal/report copy, and workbench input behavior frozen.
- validated focused Gate D 1 file / 7 tests, Gate A/B/C/D continuity
  4 files / 24 tests, and `pnpm calculator:gate:current` with engine
  285 files / 1611 tests, web 61 files / 273 passed + 18 skipped, repo
  build 5 / 5 tasks, and whitespace guard green;
- validated broad `pnpm check` with lint/typecheck clean, engine 410
  files / 2413 tests, web 166 files / 936 passed + 18 skipped, repo
  build 5 / 5 tasks, and final `git diff --check` green.

Gate D selected Gate E:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts`

`gate_e_define_airborne_candidate_resolver_selected_rejected_candidates_without_value_movement`

## Gate E - Airborne Candidate Resolver

Gate E landed the no-runtime resolver contract and optional shared
metadata surface. Runtime population still belongs to Gate G and later
runtime gates.

Implemented surfaces:

- `packages/shared/src/domain/airborne-basis.ts` now exports
  `AIRBORNE_CANDIDATE_RESOLVER_PRECEDENCE`,
  `AirborneCandidateResolutionSchema`, and related resolver tie-breaker
  types.
- `AssemblyCalculationSchema` now accepts optional
  `airborneCandidateResolution` metadata.
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-e-airborne-candidate-resolver-contract.test.ts`
  pins the resolver contract without populating runtime results.

The resolver policy mirrors `impact-lane.ts` and must:

1. collect exact full-stack catalog match;
2. collect exact partial/subassembly anchors when available;
3. collect calibrated family-specific solver candidates;
4. collect uncalibrated family physics predictions;
5. collect bounded/screening fallback;
6. select by precedence, required-input completeness, family confidence,
   and error budget.

The resolver must return both selected result and rejected candidates so
tests can prove why a better-looking but invalid candidate was not used.

Gate E landed acceptance:

- candidate selection is deterministic under duplicate rows and safe
  reorders;
- exact full-stack rows override prediction only on exact topology match;
- partial anchors can participate only when the remaining delta has a
  named calculation method;
- missing topology moves to `needs_input`, not an invented number;
- source-packet absence does not remove a valid physics candidate.
- selected candidate count is exactly one, selected candidates cannot
  carry rejection reasons, and rejected candidates must explain why they
  lost or were blocked.
- validation passed on 2026-05-06: focused Gate E 1 file / 8 tests,
  focused Gate A/B/C/D/E continuity 5 files / 32 tests,
  `pnpm calculator:gate:current`, broad `pnpm check`, and final
  `git diff --check` green.

Gate E selected Gate G:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-g-grouped-rockwool-prediction-contract.test.ts`

`gate_g_promote_grouped_rockwool_triple_leaf_family_physics_prediction_with_benchmarks`

## Gate F - Solver Family Roadmap

Implement solver families incrementally. Do not wait for all families to
be perfect before fixing Rockwool, but every family must have a named
method, input contract, error budget, and negative cases.

1. Single-leaf / massive / panel:
   - mass-law baseline using `m' = rho * h` and
     `TL(f) ~= 20 * log10(m' * f) - 47..48`;
   - coincidence/critical-frequency correction using panel stiffness
     `D = E * h^3 / (12 * (1 - nu^2))` and a family-owned `fc`;
   - material-family calibration where exact rows exist;
   - ISO 717-1 / ASTM E413 rating adapters from generated curves.
2. Double-leaf / framed / cavity:
   - mass-air-mass resonance using
     `f0 = 1 / (2 * pi) * sqrt((rho0 * c0^2 / d) * (1 / m1' + 1 / m2'))`;
   - cavity depth and absorber fill;
   - stud/bridge/resilient coupling as parallel transmission paths
     through `tau_total(f) = tau_air(f) + tau_bridge(f) + tau_leakage(f)`;
   - Sharp/Davy/Cremer-style candidate lineage where already present or
     added;
   - finite-cavity and porous-fill sensitivity tracked as assumptions.
3. Triple-leaf / multi-cavity:
   - use grouped topology first;
   - two-cavity solver candidate from
     `wall-triple-leaf-frequency-solver.ts`;
   - expose leaf masses, cavity depths, coupling assumptions, resonance
     frequencies, and uncertainty;
   - grow toward transfer-matrix / impedance-network modelling for
     arbitrary solid, limp-mass, cavity, and porous layers;
   - keep flat-list ambiguous topology as `needs_input` or explicitly
     caveated screening, not design-grade support.
4. Lined massive / masonry / CLT / timber:
   - keep existing exact/source rows;
   - use family physics where source rows are absent;
   - prevent source rows from becoming broad lookup guesses outside their
     topology.
5. Floor / impact:
   - keep `impact-lane.ts` precedence;
   - align impact prediction metadata with ISO 12354-2, ISO 717-2,
     ASTM E492, ASTM E989;
   - preserve existing exact floor-system rows and delta/bound lanes.

## Gate G - Rockwool Grouped Triple-Leaf Prediction

First runtime movement should be the grouped Rockwool/triple-leaf case:

- input: complete grouped triple-leaf topology with two 50 mm Rockwool
  cavities, internal gypsum leaf, MLV, gypsum/plaster outer leaves, and
  support topology;
- selected origin: `family_physics_prediction`;
- method: triple-leaf/two-cavity frequency-band solver;
- output: finite `Rw`, `STC`, `C`, `Ctr` from solver curve;
- support: grouped topology can support wall airborne prediction outputs;
- exact flag: false;
- source-validated flag: false until source rows validate it;
- copy: calculated prediction, not measured exact.

Flat-list split/internal Rockwool remains guarded unless topology can be
inferred without ambiguity. A hostile reorder must not silently become
exact or source-backed.

Gate G acceptance:

- grouped Rockwool no longer stays blocked by
  `rights_safe_source_owned_curve_payload_absent`;
- selected origin is `family_physics_prediction`;
- exact/source-validated flags remain false;
- result carries standards/rating basis, solver assumptions, and
  uncertainty;
- visible output cards and proposal/report copy do not call the result
  measured exact;
- current flat-list negative/withholding tests remain green.

## Gate H - Source Calibration And Exact Promotion

After the prediction path exists, source-packet work returns as
calibration/exact-promotion backlog:

- source rows can calibrate triple-leaf damping/coupling and tolerance;
- measured full-stack rows can override prediction;
- measured subassemblies can anchor delta candidates;
- no source row is allowed to delete or bypass the physics solver.

The old source-packet refresh plan is retained as backlog for this gate,
not as the active next action.

Gate H acceptance:

- a source row can promote only the exact topology/metric it owns;
- a source row can calibrate a family only through explicit calibration
  metadata and holdout tests;
- measured exact, calibrated prediction, and uncalibrated prediction are
  separate origins;
- exact and prediction values can coexist as candidates and the resolver
  explains why one won.

## Material Property Follow-Up

Create a later material-property widening slice after Gate G or when a
solver needs it. It should add first-class airborne/mechanical
properties such as:

- Young modulus;
- Poisson ratio;
- loss factor/damping;
- flow resistivity;
- porosity;
- absorber class;
- limp-mass/membrane behavior;
- property uncertainty and source status.

Do not block Gate G on the full material-property program. Use
conservative defaults where the existing solver already does, but expose
the assumptions in `airborneBasis`.

## Documentation And Test Expectations

Docs that must stay aligned while implementing:

- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`
- `docs/calculator/MASTER_PLAN.md`
- this slice plan
- `AGENTS.md`

Tests must check values, basis/origin, support buckets, visible card
copy, and negative cases. A finite number alone is not sufficient.
