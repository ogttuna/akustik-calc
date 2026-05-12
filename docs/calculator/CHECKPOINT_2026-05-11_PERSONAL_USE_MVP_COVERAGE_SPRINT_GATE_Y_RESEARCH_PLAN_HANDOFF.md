# Personal-Use MVP Coverage Sprint Gate Y Research Plan Handoff - 2026-05-11

## Status

This is a planning and research checkpoint only. No runtime values,
formula coefficients, support buckets, source precedence, field/building
boundaries, APIs, or visible surfaces moved in this pass.

Current selected status remains:

`gate_x_personal_use_mvp_aac_nonhomogeneous_masonry_wall_family_solver_landed_selected_clt_ctr_gate_y`

Selected next action remains:

`gate_y_personal_use_mvp_clt_mass_timber_ctr_spectrum_adapter_plan`

Selected next file remains:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-y-clt-mass-timber-ctr-spectrum-adapter-contract.test.ts`

## Implementation Read

Gate H already promoted complete element-lab CLT / mass-timber wall from
`screening_fallback` to a named family-physics basis:

`gate_h_clt_mass_timber_wall_single_leaf_family_physics_runtime`

The current live dynamic result for `[{ materialId: "clt_panel",
thicknessMm: 120 }]` with `["Rw", "STC", "C", "Ctr"]` in
`element_lab` context is:

- `estimatedRwDb: 42`;
- `estimatedStc: 42`;
- `estimatedCDb: -1.2`;
- `estimatedCtrDb: -6.1`;
- `supportedTargetOutputs: ["Rw", "STC", "C"]`;
- `unsupportedTargetOutputs: ["Ctr"]`;
- `airborneBasis.curveBasis: "calculated_frequency_curve"`;
- `airborneBasis.frequencyBands.bandSet: "dynamic_airborne_delegate_grid"`;
- `airborneBasis.errorBudgetDb: 6`;
- `dynamicAirborneTrace.selectedMethod: "sharp"`;
- `dynamicAirborneTrace.strategy: "timber_panel_blend"`.

So Gate Y should not invent a new raw numeric model first. The finite
`Ctr` value is already present in the ISO 717-1 rating payload, but the
calculator correctly withholds support until a CLT-specific spectrum
adapter owner makes the basis visible and guarded. Gate Y is therefore a
support/basis/contract promotion over the existing calculated frequency
curve, not source-row crawling and not a retune.

The base coverage matrix still records `wall.clt_mass_timber.lab` as:

`airborne_error_budget_6_db_with_Ctr_unsupported`

Gate Y should update only this row's CLT lab `Ctr` posture after the
runtime contract proves the guardrails below.

## External Source Read

The external research supports a bounded source-absent spectrum adapter:

- ISO 717-1:2020 is the current official airborne single-number rating
  standard. It defines airborne single-number quantities, accounts for
  different source spectra including traffic, and determines those
  quantities from one-third-octave or octave-band results:
  <https://www.iso.org/standard/77435.html>.
- INSUL's public technical notes model single-panel sound transmission
  from mass per area and elastic modulus, then account for coincidence,
  finite-size low-frequency effects, and timber/steel panel modes:
  <https://www.insul.co.nz/tech-info/>.
- INSUL's feature page confirms the expected product shape: prediction
  of 1/3-octave TL or impact bands plus weighted `STC`/`Rw` or impact
  ratings, with measured data still the authority:
  <https://www.insul.co.nz/features/>.
- INSUL Version 10 publicly advertises single, double, triple, and quad
  airborne model families plus real-world anchoring tools:
  <https://www.insul.co.nz/media/43149/INSUL-Version10-November-2023.pdf>.
- Dataholz publishes timber wall component rows using `Rw (C,Ctr)` or
  `Rw (C;Ctr)` notation, including CLT / solid glued wood examples such
  as bare or lined internal walls and CLT external walls:
  <https://www.dataholz.eu/en/components/internal-wall/detail/kz/iwmxxo01a.htm>,
  <https://www.dataholz.eu/en/components/internal-wall/detail/kz/iwmxxi03a.htm>,
  <https://www.dataholz.eu/en/components/external-wall/version/kz/awmoho01a/nr/01.htm>.
- WoodWorks notes that mass timber has unique acoustic challenges and
  fewer quantified assemblies than traditional light-frame, steel, and
  concrete assemblies. Its public mass-timber acoustics paper gives bare
  CLT wall STC examples and says added components are commonly needed:
  <https://www.woodworks.org/resources/acoustics-and-mass-timber-room-to-room-noise-control/>,
  <https://www.woodworks.org/wp-content/uploads/wood_solution_paper-MASS-TIMBER-ACOUSTICS.pdf>.

Research conclusion: `Ctr` must stay downstream of a frequency-band
airborne curve and must be labelled as a source-absent CLT/mass-timber
lab spectrum-adapter result unless an exact source-owned `Rw(C;Ctr)` row
truly matches. It must not be guessed from `Rw`, `STC`, or a generic
wall catalog row.

## Gate Y Decision

Gate Y remains the highest-ROI next step because it closes the last
immediate wall lab row left by Gate W/X without broad source crawling.
It increases personal-use coverage for a realistic mass-timber wall
case, uses an already-owned calculated frequency curve, and has low
basis-leakage risk when constrained to element-lab `Ctr`.

Do not switch the next step to source acquisition unless a specific
source-owned CLT `Rw(C;Ctr)` holdout is named for calibration. Source
rows are useful future exact overrides and holdouts, but they are not
needed to expose this bounded source-absent adapter.

## Gate Y Runtime Contract

Gate Y should promote only complete element-lab CLT / mass-timber wall
`Ctr` when all of these are true:

1. The route is a wall/airborne route in `element_lab` basis.
2. The resolved topology is a single visible `mass_timber_panel` /
   CLT-like solid timber leaf, not lined massive, gypsum, concrete,
   framed, double-leaf, grouped triple-leaf, opening/leak, floor, field,
   or building prediction.
3. Density, thickness, and surface mass are finite and positive.
4. The selected runtime basis has `curveBasis:
   "calculated_frequency_curve"` and `frequencyBands` from the dynamic
   airborne delegate grid.
5. The rating adapter is ISO 717-1 and the requested metric is `Ctr` in
   the lab airborne output set.
6. The candidate remains `origin: "family_physics_prediction"` with no
   exact-source claim.

Expected positive CLT fixture after Gate Y:

- `estimatedRwDb` remains `42`;
- `estimatedStc` remains `42`;
- `estimatedCDb` remains `-1.2`;
- `estimatedCtrDb` becomes supported at the current finite value `-6.1`;
- `supportedTargetOutputs` becomes `["Rw", "STC", "C", "Ctr"]`;
- `unsupportedTargetOutputs` becomes `[]`;
- parent curve/error posture remains source-absent and uncalibrated with
  `errorBudgetDb: 6`.

Gate Y must not present `Ctr -6.1` as measured evidence and must not
tighten the CLT error budget. Any future tightening requires
source-owned CLT holdouts with band or `Rw(C;Ctr)` metric ownership and
paired negative boundaries.

## Required Negatives

The Gate Y contract should include at least these negative boundaries:

1. Missing custom CLT density or invalid thickness returns
   `needs_input`, with no supported `Ctr`.
2. Ordinary gypsum, concrete, AAC, lined massive, framed/double-leaf,
   grouped triple-leaf, and opening/leak routes do not inherit the CLT
   adapter.
3. `field_between_rooms` and `building_prediction` requests do not
   borrow the lab `Ctr` budget for `R'w`, `DnT,w`, or any building
   output.
4. ASTM/STC-only wording does not create `Ctr`; `STC` remains an ASTM
   adapter boundary and `Ctr` remains ISO 717-1.
5. Exact source rows, when truly matching the stack and basis, still
   take precedence over the source-absent family prediction.
6. Reordered or duplicate CLT inputs only support `Ctr` when the
   topology still resolves to a single valid mass-timber panel; ambiguous
   duplicates stay blocked or unsupported.

## Implementation Order

1. Add the selected Gate Y contract file and pin the current pre-change
   CLT fixture behavior: finite `estimatedCtrDb: -6.1`, but `Ctr`
   unsupported.
2. Add a small companion helper, following Gate X's pattern, for the
   CLT `Ctr` spectrum-adapter constants, candidate id, support label,
   and guard predicates. Do not expand the near-2000-line base coverage
   matrix file unnecessarily.
3. Promote the target-output support for `Ctr` only when the Gate Y
   helper confirms the complete CLT lab spectrum owner set. Prefer a
   small visibility/support change over formula rewrites.
4. Update the Gate W/X matrix refresh overlay so
   `wall.clt_mass_timber.lab` moves from
   `source_absent_gate_h_clt_family_physics_partial_spectrum` to a full
   CLT lab family-physics spectrum-adapter support bucket.
5. Add the negatives above in the same test file or adjacent helper
   tests if the file becomes too large.
6. If only engine support changes, validate with focused Gate Y,
   Gate H/X/Y continuity, engine typecheck, `pnpm calculator:gate:current`,
   and `git diff --check`. If output cards, APIs, saved replay, or
   reports change their visible support/status payloads, run the relevant
   web parity tests and then `pnpm check`.

## Done Criteria

Gate Y is done only when a complete CLT / mass-timber element-lab wall
supports `Rw`, `STC`, `C`, and `Ctr` with the current pinned numeric
values, visible source-absent `family_physics_prediction` basis,
unchanged `+/-6 dB` uncalibrated budget, exact-source precedence,
field/building non-aliasing, and hostile-input negatives all executable
in tests.
