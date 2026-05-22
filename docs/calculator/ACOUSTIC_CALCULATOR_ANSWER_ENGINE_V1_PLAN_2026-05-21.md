# Acoustic Calculator Answer Engine V1 Plan - 2026-05-21

Status: active product correction after implementation/runtime analysis.

DynEcho is an acoustic calculator. A user brings an acoustic project,
chooses wall or floor, enters the layer stack and the extra physical
inputs required for that construction, and gets an acoustic answer.

The answer engine must do this:

1. use an exact measured value when the same construction, metric, and
   basis is already known;
2. use a very similar measured construction only as an anchor when the
   family, topology, metric, and physical delta are compatible;
3. otherwise choose the correct acoustic formula family for the entered
   layers and calculate the result;
4. return `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`, STC, `C`, `Ctr`, `CI`,
   `CI,50-2500`, and related outputs on the correct lab, field,
   building, ISO, or ASTM basis;
5. require extra physical inputs only when the formula genuinely needs
   them to choose or calculate the answer.

This is not a test project. This is not a source catalog. This is not a
finite scenario library. Tests and docs are only guardrails. The product
is the calculator answer.

Selected next action:

`acoustic_calculator_answer_engine_v1_plan`

Selected next file:

`packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`

Selected next label:

acoustic calculator answer engine V1

This replaces the previous immediate focus on a narrow
post-double-leaf coverage revalidation. The double-leaf coverage refresh
is still useful and stays landed, but the next work must make the
existing calculator infrastructure answer real layer combinations.

## 2026-05-22 Checkpoint

Latest checkpoint:

[CHECKPOINT_2026-05-22_ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_RECONCILIATION.md](./CHECKPOINT_2026-05-22_ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_RECONCILIATION.md)

The docs and implementation were reread against this plan on
2026-05-22. The current gate is green after updating one stale
model-first documentation alignment test:

- `pnpm calculator:gate:current` passed with engine 508 files / 2889
  tests, web 94 files / 388 passed + 18 skipped, repo build 5 / 5, and
  whitespace guard passed.
- `packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`
  does not exist yet; that remains the selected next implementation
  contract.
- Single-leaf gypsum and explicit double-leaf/framed wall inputs already
  reach traced source-absent family solvers.
- Flat gypsum / absorber / gypsum input without explicit topology can
  still fall to untraced screening instead of selecting the double-leaf
  formula or asking for the missing physical fields.
- Missing `resilientBarSideCount` can select `needs_input` while numeric
  wall metrics remain present in the result object. The answer engine
  must stop that user-facing value leakage.

## INSUL Benchmark Shape

Official INSUL materials confirm the target product shape:

- INSUL presents itself as a quick prediction tool for sound insulation
  in walls, floors, and ceilings.
- It predicts sound insulation for walls, floors, roofs, ceilings,
  windows, impact sound, and rain noise.
- It calculates TL or `Ln` in 1/3 octave bands, then derives weighted
  ratings such as STC, `Rw`, IIC, or `LnTw`.
- It lets users evaluate material and design changes rather than only
  searching a finite catalog.
- Its methods use acoustic theory: mass law, critical frequency,
  elastic plate theory, Sharp/Cremer-style complex partition methods,
  finite-size effects, double-panel mass-air-mass behavior, cavity
  coupling, and bridging.
- It is refined by comparison with lab tests, and lab tests remain the
  stronger truth when available.

DynEcho must compete with that product shape and improve on it where we
can: clearer basis/origin, visible formula choice, measured-row
precedence, and better handling of arbitrary entered layer stacks.

Primary official references checked on 2026-05-21:

- https://www.insul.co.nz/
- https://www.insul.co.nz/features/
- https://www.insul.co.nz/tech-info/
- https://docs.insul.co.nz/v10/

## What Already Exists

The last three months are not worthless. The useful pieces are:

- exact/source rows;
- measured-row matching and source precedence rules;
- single-leaf mass-law source-absent runtime;
- double-leaf/framed wall source-absent runtime when explicit topology
  is present;
- grouped/triple-leaf wall runtimes;
- floor impact lanes for exact, package transfer, supported band,
  raw-bare, helper-only, direct-fixed, bounds, and predictors;
- a shared candidate registry;
- a runtime basis adapter;
- API, workbench, replay, and Markdown report trace surfaces;
- coverage ledgers that protect already-landed behavior.

These pieces should not be deleted. They must be used by the answer
engine.

## Current Failure Mode

The current runtime can calculate numbers before the product answer has
been chosen.

Examples observed in live probes:

- single gypsum wall works: it selects the single-leaf source-absent
  formula and returns `Rw 31`;
- explicit double-leaf/framed wall works: it selects the double-leaf
  source-absent formula and returns `Rw 45`;
- flat gypsum / rockwool / gypsum without explicit topology can return
  a numeric screening result instead of either choosing the double-leaf
  formula or asking for the physical inputs the double-leaf formula
  needs;
- missing `resilientBarSideCount` can be detected, but numeric `Rw` /
  STC metrics can still remain in the result object;
- flat triple-leaf without grouping can ask for missing grouping inputs,
  but numeric airborne metrics can still remain in the result object;
- tagged floor raw-bare and helper-only impact stacks already calculate
  through useful source-absent formula lanes;
- roleless helper-like floor stacks do not yet consistently become a
  safe inferred answer or a clear missing-role prompt.

That is the core product gap. The calculator must choose the answer
path first, then publish the answer.

## Required Answer Flow

For every user request:

```text
user selects wall or floor
user enters layers and thicknesses
user enters requested outputs
engine identifies the construction family
engine checks exact measured matches
engine checks compatible measured anchors
engine chooses the right formula family
engine asks for any physical inputs the chosen formula needs
engine calculates banded TL or Ln where the formula owns that route
engine derives the requested single-number ratings
engine returns the answer with basis, formula, and uncertainty
```

This is the mental model. Implementation details can use registries,
adapters, traces, or tests, but they must serve this answer flow.

## Formula Families To Use

Wall:

- single visible leaf: mass law, stiffness/coincidence, thick-panel
  behavior where relevant, ISO 717-1 rating;
- double-leaf/framed: side masses, cavity depth, mass-air-mass
  resonance, absorber damping, support/bridge coupling, ISO 717-1
  rating;
- grouped triple-leaf/multicavity: grouped leaf/cavity model, calibrated
  or source-absent family solver, strict grouping input ownership;
- massive/masonry/AAC/lined massive/CLT/opening/leak lanes where already
  owned by existing runtime code.

Floor:

- exact measured floor systems first;
- package-transfer and supported-band similarity only when compatible;
- raw-bare open-box timber and open-web steel source-absent formulas;
- helper-only lower-treatment formulas when roles/geometry are known or
  safely inferred;
- direct-fixed open-web lining formula where compatible;
- floating floor / underlay / resilient package formulas where physical
  inputs such as dynamic stiffness, load, screed/finish mass, and support
  family are owned;
- field/building and ASTM/IIC outputs only through named rating or field
  adapters, not aliases.

## What The Next Slice Must Do

The next slice must turn the existing pieces into the answer engine.
It should be implementation-first, not documentation-first.

1. Build the answer selection layer.
   For a given stack, it must choose exact measured, similar measured
   anchor, calibrated formula, source-absent formula, missing-input
   prompt, or unsupported basis.
2. Publish values only from the chosen answer path.
   Internal diagnostic curves can exist, but if the chosen answer is
   missing-input or unsupported, the user-facing answer must not show a
   calculated `Rw`, STC, `Ln,w`, or field/building value as if it were
   the answer.
3. Make flat double-leaf-like stacks useful.
   Gypsum / absorber / gypsum must not silently become an untraced
   screening answer. It must either use the double-leaf formula when
   enough physical data is present or ask for the missing fields.
4. Make floor helper-like stacks useful.
   If roles are present, use the helper-only formula. If roles are
   absent but safe inference is possible, infer. If not, ask for the
   missing roles or physical inputs.
5. Keep exact and measured evidence valuable.
   Exact matches win. Similar measured combinations can calibrate or
   anchor only when physically compatible.
6. Keep basis boundaries strict.
   Lab `Rw` is not field `R'w`; ISO `Ln,w` is not ASTM IIC; `Rw` is not
   automatically STC unless a named rating adapter owns that output.
7. Add the gate only to prevent regression.
   The gate is not the product. It is the brake that stops future work
   from drifting back into source crawling, isolated scenario patches,
   or answer/value leakage.

## Non-Goals

- turning the project into a source-row catalog;
- adding another narrow scenario pack as a substitute for formula
  selection;
- broad source crawling;
- tolerance retuning without measured holdouts;
- deleting the existing solver lanes;
- hiding behind `low confidence` instead of choosing the best available
  formula and explaining its uncertainty;
- publishing field/building or ASTM values by alias.

## Done Means

For realistic acoustic project inputs, DynEcho behaves like a
calculator:

- if the exact construction is known, it uses the measured answer;
- if a compatible measured construction can anchor the calculation, it
  uses it honestly;
- otherwise it chooses the right formula family and calculates;
- if that formula needs a real physical input, the app asks for that
  input and then calculates;
- if the requested basis genuinely has no owned method, the app says so
  instead of pretending another metric is the answer.

The goal is a better acoustic calculator, not a better-looking test
suite.
