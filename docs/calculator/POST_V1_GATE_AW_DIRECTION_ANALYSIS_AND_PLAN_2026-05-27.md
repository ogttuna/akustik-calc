# Post-V1 Gate AW Direction Analysis And Plan - 2026-05-27

Document role: active Gate AW analysis and implementation plan. Read
after [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and
[POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md](./POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md).
This file turns the generic `post_v1_next_numeric_coverage_gap_gate_aw_plan`
handoff into a concrete, implementation-ready calculator slice.

## Decision

Gate AW should implement mixed wall building-prediction plus lab
companion coverage for source-absent wall direct-curve families.

This is the right next direction because it increases actual calculator
capacity without adding catalog work:

- the direct wall curve is already calculated for several realistic
  source-absent wall families;
- the complete ISO 12354-1 building context is already able to publish
  building/apparent outputs through Gate AR;
- current mixed building requests still mark lab companions unsupported
  even when the same selected family has the lab `Rw`, STC, `C`, and
  `Ctr` values available;
- the fix is mostly answer ownership and surface parity, not new source
  acquisition or speculative formula research;
- metric boundaries stay clean because building metrics remain on the
  building-prediction basis and lab companions remain direct-curve
  companions.

Do not use Gate AW for a broad source crawl, confidence wording pass,
finite scenario pack, or another no-runtime cartography gate.

## Product Aim Check

The product goal is a usable acoustic calculator. The user gives wall or
floor layers plus the required physical/context inputs; DynEcho returns
every defensible owned output it can calculate and parks the rest as
`needs_input` or `unsupported`.

Gate AW supports that goal directly:

- More coverage: complete building-prediction wall requests should
  return both building outputs and requested lab direct-curve companions
  when the selected source-absent wall family already owns both.
- More accuracy: the published values stay on their proper basis instead
  of aliasing lab `Rw` to field `R'w`, or building `DnT,w` back to lab
  STC.
- Better usability: a user asking for `Rw`, STC, `C`, `Ctr`, `R'w`,
  `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` on a complete building wall case
  gets a fuller answer rather than a misleading partial stop.

This is calculator work, not library/catalog work.

## External Direction Check

The external pattern still supports this route:

- INSUL positions itself around construction-family models such as
  single, double, triple, and quad constructions, cavity/bridge terms,
  and one-third-octave prediction rather than just finite source rows:
  https://www.insul.co.nz/tech-info/
- ISO 12354-1 is the relevant building-acoustics route for airborne
  sound insulation between rooms; it requires direct, flanking,
  junction, and room context instead of treating lab and building values
  as aliases: https://www.iso.org/standard/70242.html
- ISO 717-1 is the rating adapter for airborne sound insulation curves:
  https://www.iso.org/standard/77435.html
- ISO 12354-2 and ISO 717-2 remain relevant for floor impact work, but
  they do not justify aliasing ISO impact values to ASTM `IIC`:
  https://www.iso.org/standard/70243.html and
  https://www.iso.org/standard/69867.html

The implication is clear: keep expanding family solvers and basis-aware
adapters. Do not spend Gate AW on more rows unless they calibrate a
selected formula family.

Second-pass source check on 2026-05-27:

- INSUL's public feature page still frames the product as prediction of
  wall/floor/ceiling/window transmission loss and floor impact sound in
  one-third-octave bands, plus weighted ratings. It explicitly supports
  evaluating material or design changes and says prediction is not a
  replacement for measurement. That supports DynEcho's exact-first,
  formula-next posture rather than a catalog-only posture.
- ISO 12354-1:2017 remains the current published airborne
  building-estimation standard, but ISO marks it as "to be revised".
  Gate AW must therefore keep the runtime basis versioned and
  source-absent, with explicit uncertainty and no hidden defaults.
- ISO 717-1:2020 was reviewed and confirmed in 2026. Gate AW can keep
  using the existing ISO 717-1 airborne rating adapter for lab
  direct-curve companions, but those companions must not be presented as
  measured building evidence.
- ISO 12354-2 and ISO 717-2 remain floor impact standards and are not a
  reason to spend AW on ASTM `IIC` / `AIIC` aliases.

## Implementation Comparison

Current implementation facts checked on 2026-05-27:

- usable V1 Steps 0-5 are closed for the company-internal envelope;
- latest full documented gate after Gate AV passed
  `pnpm calculator:gate:current` with engine 559 files / 3109 tests,
  web 108 files / 429 passed and 18 skipped, repo build 5 / 5, and
  whitespace guard passed;
- the shared resolver surface is documented as 37 declared candidates
  and 34 active runtime-basis mappings;
- Gate AV selected `post_v1_next_numeric_coverage_gap_gate_aw_plan`;
- `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-aw-contract.test.ts`
  does not exist yet.

Code-level comparison:

- `calculate-assembly.ts` already has helper gates for earlier building
  lab-spectrum work:
  `getPostV1WallSourceAbsentBuildingLabSpectrumCompanionOutputs` and
  `getPostV1WallHeavyCompositeBuildingLabSpectrumCompanionOutputs`.
  Those helpers intentionally return no lab companions when any
  field/building output is already supported. That was correct for
  Gates AF/AG, but it is now the exact Gate AW blocker.
- `calculate-assembly.ts` currently sets
  `gateARAirborneBuildingPredictionLabAliasBlockedOutputs` for Gate AR
  building runtime and moves requested `Rw`, STC, `C`, and `Ctr` back to
  unsupported. Gate AW must replace this blanket block with a narrower
  rule: block lab aliases when they are unowned, but re-open them as
  companions when the selected Gate AR direct-curve family has finite
  owned lab values.
- `layer-combination-resolver-registry.ts` does not currently expose a
  runtime declaration for
  `gate_ar_airborne_building_prediction_all_owner_runtime_corridor`.
  Positive Gate AR building cases therefore have
  `airborneCandidateResolution` but no `layerCombinationResolverTrace`.
  Gate AW should add the runtime mapping or otherwise make the trace
  surface parity explicit.
- `layer-combination-resolver-runtime-candidate-surface-parity.ts`
  currently prefers wall airborne traces for lab and field runtimes, but
  not for the Gate AR building runtime. Gate AW should add the building
  runtime to the trace route logic.
- Existing Gate T/U/V behavior already proves the desired mixed-output
  pattern for field requests: keep the field/building candidate trace
  honest while publishing lab companions separately. Gate AW should copy
  that ownership pattern, not invent a new answer order.

### Wall Probe

The live wall probe used `ENGINE_MIXED_GENERATED_CASES`,
`calculateAssembly`, complete Gate AR building context, and mixed target
outputs:

`Rw`, STC, `C`, `Ctr`, `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`.

Current behavior:

| Case | Current supported outputs | Current stopped outputs | Candidate/trace state | Available direct values |
| --- | --- | --- | --- | --- |
| `wall-screening-concrete` | `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A` | `Rw`, STC, `C`, `Ctr` | Gate AR candidate selected, resolver trace absent | `Rw 55`, STC 55, `C -1.6`, `Ctr -6.3` |
| `wall-heavy-composite-hint-suppression` | `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A` | `Rw`, STC, `C`, `Ctr` | Gate AR candidate selected, resolver trace absent | `Rw 60`, STC 60, `C -1.4`, `Ctr -6.1` |
| `wall-masonry-brick` | `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A` | `Rw`, STC, `C`, `Ctr` | Gate AR candidate selected, resolver trace absent | `Rw 40`, STC 40, `C -0.2`, `Ctr -4.7` |
| `wall-clt-local` | `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A` | `Rw`, STC, `C`, `Ctr` | Gate AR candidate selected, resolver trace absent | `Rw 41`, STC 41, `C -1.8`, `Ctr -7.6` |
| `wall-held-aac` without support topology | none | all mixed outputs | `needs_input` trace present | missing multileaf topology fields |
| `wall-held-aac` with explicit support topology | `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A` | `Rw`, STC, `C`, `Ctr` | Gate AR candidate selected | `Rw 60`, STC 60 |
| `wall-lsf-knauf` | `Rw`, STC, `C`, `Ctr` | `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A` | `needs_input` trace present | exact/framed lab path only |
| `wall-timber-stud` | `Rw`, STC, `C`, `Ctr` | `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A` | `needs_input` trace present | framed lab path only |

Conclusion: Gate AW should close the mixed source-absent wall building
plus lab companion gap for the families already using Gate AR building
runtime. LSF and timber-stud building adapters are a separate next gate
because they currently fail for a different reason: the building route
asks for multileaf grouping fields instead of using the framed/stud
direct-curve owner.

### Floor Probe

The broad floor probe used 29 generated floor cases with field context
and requested:

`Rw`, STC, `C`, `Ctr`, `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`,
`Ln,w`, `DeltaLw`, `CI`, `Ln,w+CI`, `CI,50-2500`, `L'n,w`,
`L'nT,w`, `L'nT,50`, `IIC`, `AIIC`.

Unsupported count across the 29 floor field cases:

| Output | Unsupported count | Interpretation |
| --- | ---: | --- |
| `AIIC` | 29 | correct until ASTM field owner exists |
| `IIC` | 29 | correct until ASTM lab owner exists |
| `CI,50-2500` | 23 | often requires explicit user/source input; Gates AT/AO/AV already opened owned explicit-input paths |
| `DeltaLw` | 23 | many exact/source rows do not own `DeltaLw`; do not fabricate |
| `CI`, `Ln,w+CI`, `L'nT,50` | 17 each | explicit companion/input gap mostly covered for owned lanes, still absent where source/formula does not own terms |
| STC | 16 | many exact floor rows should not alias airborne STC |
| `C` | 15 | same metric-scope boundary |
| `Ctr` | 7 | same metric-scope boundary |
| `Ln,w`, `L'n,w`, `L'nT,w` | 1 each | one real remaining floor impact family gap |

The one floor case with no impact support is
`floor-tuas-c11c-fail-closed`; it currently supports airborne outputs
but not impact outputs. That is a valid future coverage target, but it
is lower immediate ROI than Gate AW because Gate AW can unlock mixed
lab/building wall outputs across several already-live families with a
smaller implementation surface.

### ROI Re-Rank

| Rank | Candidate | Why | Gate |
| ---: | --- | --- | --- |
| 1 | Mixed wall building plus lab companions | Unlocks `Rw`, STC, `C`, `Ctr` on multiple complete Gate AR building cases; no new source crawl; small code surface | AW |
| 2 | Framed LSF/timber building adapter | Turns complete building context for common framed walls into `R'w` / `Dn*` outputs without unrelated multileaf topology prompts | AX |
| 3 | `floor-tuas-c11c-fail-closed` impact family gap | Only one broad floor probe case lacks `Ln,w` / field impact support; needs a real ISO impact owner, not prompt wording | AY |
| 4 | Quad/multicavity widening and calibration holdouts | Larger scope; useful after AW/AX/AY tighten active mixed-output behavior | later |

Blocked as low ROI for the next slice:

- source-row volume crawl without a selected formula/holdout role;
- low-confidence wording or confidence-display work;
- more explicit `CI` / `CI,50-2500` prompt-only passes before a real
  new floor impact owner is selected;
- ASTM alias work unless the inputs are ASTM E492/E1007/E989-owned.

## Selected Gate AW Acceptance

Gate AW closes only the mixed wall building plus lab companion gap.

### Positive Cases

For complete `building_prediction` context and mixed target outputs
`Rw`, STC, `C`, `Ctr`, `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`,
the following cases should support all requested outputs:

- `wall-screening-concrete`;
- `wall-heavy-composite-hint-suppression`;
- `wall-masonry-brick`;
- `wall-clt-local`;
- `wall-held-aac` only when the explicit support topology required by
  the multileaf solver is present.

The building outputs must stay on
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`.
The lab companions must use the selected direct-curve family values as
companions, not relabel the building candidate.

Expected value pins:

| Case | Lab companion pins | Building pins to keep live |
| --- | --- | --- |
| `wall-screening-concrete` | `Rw 55`, STC 55, `C -1.6`, `Ctr -6.3` | `R'w 55`, `Dn,w 55`, `Dn,A 53.4`, `DnT,w 56`, `DnT,A 54.9` |
| `wall-heavy-composite-hint-suppression` | `Rw 60`, STC 60, `C -1.4`, `Ctr -6.1` | `R'w 60`, `Dn,w 60`, `Dn,A 58.6`, `DnT,w 61`, `DnT,A 60.1` |
| `wall-masonry-brick` | `Rw 40`, STC 40, `C -0.2`, `Ctr -4.7` | `R'w 40`, `Dn,w 40`, `Dn,A 39.8`, `DnT,w 42`, `DnT,A 41.3` |
| `wall-clt-local` | `Rw 41`, STC 41, `C -1.8`, `Ctr -7.6` | `R'w 41`, `Dn,w 41`, `Dn,A 39.2`, `DnT,w 42`, `DnT,A 40.7` |
| `wall-held-aac` with support topology | `Rw 60`, STC 60, plus owned spectrum values if the selected family exposes them | `R'w 60`, `Dn,w 60`, `Dn,A 58.1`, `DnT,w 61`, `DnT,A 59.6` |

First failing assertions for the AW contract should be:

- the four source-absent positive cases above move from 5/9 supported
  outputs to 9/9 supported outputs;
- `unsupportedTargetOutputs` is empty on those positive mixed requests;
- `airborneBasis.method` remains
  `gate_ar_airborne_building_prediction_all_owner_runtime_corridor`;
- `airborneCandidateResolution.selectedCandidateId` remains
  `candidate_airborne_building_prediction_all_owner_family_physics_prediction`;
- `layerCombinationResolverTrace` exists for Gate AR positives and has
  `requestedBasis: "building_prediction"`;
- the trace keeps building metrics as its owned selected-candidate pins
  and does not pretend lab companions are measured building evidence.

### Negative Cases

Gate AW must not:

- publish lab companions when the request only asks for building
  outputs;
- publish building outputs for `wall-held-aac` when required support or
  multileaf topology fields are missing;
- reopen opening/leak building routes without their dedicated owner
  inputs;
- change exact measured precedence for `wall-lsf-knauf`;
- make framed LSF or timber-stud building outputs live by guessing
  multileaf topology;
- alias lab `Rw` to building `R'w`;
- alias ISO values to ASTM `IIC` / `AIIC`;
- alter floor impact behavior.

### Surface Acceptance

Engine, workbench cards, answer chart, report, `/api/estimate`, saved
replay, server snapshot replay, and resolver trace must agree:

- `supportedTargetOutputs` includes both lab companion and building
  outputs only when both are requested and owned;
- `unsupportedTargetOutputs` remains empty for the positive mixed cases;
- building candidate trace continues to identify the building runtime
  and building-owned metrics;
- lab companions are visible as companion outputs without corrupting the
  building trace value pins;
- stopped negative cases show `needs_input` or `unsupported` with exact
  missing fields.

## Implementation Order

1. Add
   `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-aw-contract.test.ts`
   as the executable Gate AW selection/acceptance contract.
2. Add a small Gate AW owner module, for example
   `packages/engine/src/post-v1-wall-building-lab-companion-gate-aw.ts`,
   with constants for landed action, selection status, supported
   outputs, and value pins.
3. Add Gate AR building runtime declaration/mapping to the resolver
   surface if absent, so positive building runtime cases produce a
   visible `layerCombinationResolverTrace`.
4. Add a new helper in `calculate-assembly.ts`, or revise the existing
   Gate AR lab-blocking path, so complete Gate AR building requests keep
   the building runtime selected while also publishing requested lab
   direct-curve companions from the same family solver.
5. Keep the existing Gate AF/AG behavior intact for requests where
   building outputs are not owned or are intentionally parked.
6. Add web/API/report parity tests for one representative source-absent
   building case and one negative missing-topology case.
7. Add Gate AW to `tools/dev/run-calculator-current-gate.ts`.
8. Update active docs after runtime and surface tests pass.

Likely files to touch:

- `packages/engine/src/calculate-assembly.ts`;
- `packages/engine/src/layer-combination-resolver-registry.ts`;
- `packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity.ts`;
- `packages/engine/src/post-v1-wall-building-lab-companion-gate-aw.ts`;
- `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-aw-contract.test.ts`;
- one focused web parity file under `apps/web/features/workbench/`;
- `tools/dev/run-calculator-current-gate.ts`;
- active docs only after tests are green.

Do not split Gate AW into a no-runtime plan-only gate unless a targeted
failing test proves the runtime path is unsafe to touch.

## Definition Of Done

Gate AW is done only when all of these are true:

- complete source-absent Gate AR wall building requests support all nine
  mixed lab/building outputs listed above;
- exact/source anchored wall requests still obey exact metric scope;
- incomplete multileaf/AAC support topology stays `needs_input`;
- framed LSF/timber building outputs remain a separate AX gap;
- floor impact output support is unchanged;
- resolver trace, cards, API payload, and report agree on supported and
  stopped outputs;
- current gate runner includes the AW contract.

## Next Gates After AW

1. Gate AX: framed LSF/timber building adapter expansion.
   Complete building context for `wall-lsf-knauf` and
   `wall-timber-stud` should use the framed/stud direct-curve owner
   instead of asking for unrelated multileaf grouping fields. Exact lab
   precedence and source-absent framed formula boundaries must remain
   intact.
2. Gate AY: floor impact source-absent gap for the remaining real
   fail-closed family, starting with `floor-tuas-c11c-fail-closed`.
   This should calculate owned ISO impact outputs only if the chosen
   family formula and required physical inputs are explicit. It should
   not fabricate `DeltaLw`, `CI`, `CI,50-2500`, `IIC`, or `AIIC`.
3. Later: quad/multicavity widening and holdout/calibration work for
   the family solvers that already produce live values.

This replaces the earlier broad idea of spending the third slot on more
explicit floor companion prompts. Gates AS through AV already closed
the highest-value explicit `CI`, `CI,50-2500`, and `DeltaLw` companion
paths for owned floor lanes. The remaining floor coverage gain is a real
impact-family solver gap, not another prompt-only companion pass.

## Validation Plan

Minimum validation for Gate AW implementation:

- targeted engine:
  `pnpm --filter @dynecho/engine exec vitest run src/post-v1-next-numeric-coverage-gap-gate-aw-contract.test.ts --maxWorkers=1`;
- targeted engine continuity for Gate AF, Gate AG, Gate AJ, Gate T,
  Gate U, Gate V, and Gate AV contracts;
- targeted web/API/report parity test files added for Gate AW;
- full `pnpm calculator:gate:current`;
- `git diff --check`.

Docs-only edits to this plan do not require the full calculator gate,
but behavior edits do.

## Implementation Outcome

Gate AW landed on 2026-05-27 as
`post_v1_wall_building_lab_companion_gate_aw_plan`, with selection
status
`post_v1_wall_building_lab_companion_gate_aw_landed_selected_next_numeric_coverage_gap_gate_ax`.

The implementation added the Gate AR building runtime candidate to the
resolver surface, reopened only owned direct-curve lab companions beside
complete building-prediction outputs, kept incomplete AAC/support
topology as `needs_input`, kept opening/leak and framed LSF/timber
building gaps closed for later owners, and added engine plus web surface
parity coverage.

Validation passed:

- focused Gate AW engine: 1 file / 4 tests;
- registry / adapter / surface: 3 files / 17 tests;
- continuity: 8 files / 32 tests;
- coverage/V1: 4 files / 32 tests;
- web Gate AW/parity: 2 files / 4 tests;
- full `pnpm calculator:gate:current`: engine 560 files / 3113 tests,
  web 109 files / 430 passed + 18 skipped, repo build 5 / 5, and
  whitespace guard passed.
