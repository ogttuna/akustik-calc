# Checkpoint 2026-05-11 - INSUL / ISO Research And Gate P Replan Handoff

Document role: short research-and-planning handoff for the active
Personal-Use MVP Coverage Sprint. This checkpoint updates the Gate P
decision after rechecking current public INSUL documentation and official
ISO standard pages. No runtime code changed in this checkpoint.

## Current Local State

Selected status before this checkpoint:

`gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_p`

Selected next action remains:

`gate_p_personal_use_mvp_airborne_building_prediction_runtime_corridor_plan`

Selected next file remains:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-p-airborne-building-prediction-runtime-corridor-contract.test.ts`

Gate O is still the latest implementation commit:

`97f2da3 Land airborne building prediction formula corridor boundary`

Gate O has a named source-absent airborne building-prediction formula
corridor for `R'w` and `DnT,w`, a `+/-9 dB` not-measured design budget,
same-building holdout uncertainty, and strict blockers against relabeling
lab `Rw`/`STC`, Gate I field values, or source single-number rows as
building metrics. Runtime is still parked: `proposedRuntimeEstimateDb`
is `null` and complete building requests remain `unsupported` until
Gate P.

## External Research Summary

INSUL remains a useful competitor/category benchmark, not an authority to
copy blindly.

- INSUL's current user guide positions it as a predictor for walls,
  floors, ceilings, and windows. It says it uses mass law,
  critical-frequency methods, Sharp, Cremer, and laboratory comparison,
  while warning that prediction is not a substitute for test data:
  <https://docs.insul.co.nz/v10/>.
- INSUL Version 10 publicly covers airborne `STC`/`Rw` for single,
  double, triple, and quad systems, and impact `IIC`/`Ln,w` for single,
  double, and triple systems:
  <https://www.insul.co.nz/media/43149/INSUL-Version10-November-2023.pdf>.
- INSUL's triple-panel theory page warns that triple-panel accuracy is
  lower than single/double accuracy, with an estimated 90% limit around
  4 dB for `Rw` / `STC`:
  <https://docs.insul.co.nz/v10/SoundInsulationTheory/Airborne-TriplePanels/>.
- The most important Gate P finding is INSUL's airborne flanking page:
  it states that INSUL does not directly calculate flanking transmission
  within a building and instead provides a visual reminder/indicator.
  That supports a conservative Gate P outcome unless DynEcho owns real
  formula terms:
  <https://docs.insul.co.nz/v10/SoundInsulationTheory/Airborne-Flanking/>.
- INSUL impact documentation keeps vertical impact prediction scoped and
  excludes horizontal/diagonal impact radiation; its impact accuracy
  page gives broad family-dependent `Ln,w` / `IIC` uncertainty ranges:
  <https://docs.insul.co.nz/v10/SoundInsulationTheory/Impact-ImpactSound/>,
  <https://docs.insul.co.nz/v10/SoundInsulationTheory/Impact-Accuracy/>.

Official ISO pages support the same boundary:

- ISO 12354-1 describes airborne building prediction from element
  performance plus direct/indirect flanking and structural propagation
  terms, with detailed frequency-band and restricted simplified models:
  <https://www.iso.org/standard/70242.html>.
- ISO 12354-2 does the same for impact sound insulation between rooms:
  <https://www.iso.org/standard/70243.html>.
- ISO 717-1 and ISO 717-2 define basis-aware single-number rating
  conversion for airborne and impact results:
  <https://www.iso.org/standard/77435.html>,
  <https://www.iso.org/standard/69867.html>.
- ISO 16283-1 and ISO 16283-2 define field measurement procedures for
  airborne and impact sound insulation in buildings:
  <https://www.iso.org/standard/55997.html>,
  <https://www.iso.org/standard/77436.html>.

## Gate P Decision

Gate P should not start by trying to make a number appear on the
building card. It should start by proving whether a runtime number is
owned.

The runtime corridor can promote only if the engine can calculate and
trace all of these terms:

1. direct separating-element frequency curve;
2. conservative flanking path energy combination;
3. junction vibration-reduction / coupling-length term;
4. room absorption or standardization term;
5. the existing `+/-9 dB` source-absent building-prediction error
   budget.

If any term is only named, inferred, UI-only, or copied from Gate I field
context, Gate P must close no-runtime:

- complete building requests remain `unsupported`;
- Gate N warning/method and Gate O formula dossier remain visible;
- `proposedRuntimeEstimateDb` remains `null`;
- no lab `Rw`/`STC`, source single-number, or field `R'w` result is
  relabelled as `R'w` / `DnT,w` building prediction;
- Gate P selects the next highest-ROI personal-use coverage lane instead
  of broad source crawling.

## Step-By-Step Next Work

1. Add the Gate P contract test file named above.
2. Re-read Gate I/J/K/L/M/N/O contracts plus the Gate O and Gate N helper
   modules before touching runtime behavior.
3. Encode a promotion decision table with two branches:
   `runtime_promoted_with_owned_formula_terms` and
   `runtime_blocked_formula_terms_not_owned`.
4. Keep the current expected branch blocked unless every formula term is
   executable in the engine and visible in trace/dossier surfaces.
5. If blocked, assert unchanged `unsupported` runtime, unchanged Gate O
   `null` proposal, exact missing/unsupported warning copy, exact-source
   precedence, and lab/field/building alias negatives.
6. If promoted, assert numeric `R'w` and `DnT,w`, selected candidate id,
   basis/origin, `+/-9 dB` budget, card/API/report parity, exact-source
   precedence, and hostile edits.
7. Run focused Gate P validation, Gate O/N/M/L continuity, Gate I/J/K
   field continuity, relevant web/API/report tests if visible posture
   changes, `pnpm calculator:gate:current`, and `git diff --check`.

## Validation

This checkpoint is a docs/planning update. Implementation validation was
not rerun. Required local validation for the docs update:

- `git diff --check`

Known unrelated dirty files at the time of this checkpoint:

- `apps/web/next-env.d.ts`
- `apps/web/tsconfig.tsbuildinfo`
- local/untracked generated PDFs, outputs, `.playwright-cli/`, and
  `tmp/`
