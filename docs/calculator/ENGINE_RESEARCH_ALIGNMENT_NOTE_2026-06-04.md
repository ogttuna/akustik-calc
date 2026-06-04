# Engine Research Alignment Note - 2026-06-04

Status: analysis note with follow-up implementation completed. This note
records the research/alignment pass; the bridge fix that followed is
tracked in
`docs/calculator/IMPACT_FLOOR_LNW_NOT_READY_FIX_PLAN_2026-06-04.md`.

## Scope

This note records the second-pass review requested for the acoustic
answer engine, with a focus on the `Impact Floor / Ln,w Not ready`
failure mode and the broader goal of becoming an industry-grade acoustic
calculator.

Authoritative local references checked:

- `AGENTS.md`
- `docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`
- `docs/calculator/ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_PLAN_2026-05-21.md`
- `packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts`
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts`
- `apps/web/features/workbench/scenario-analysis.ts`
- `apps/web/features/workbench/heavy-concrete-combined-impact-input-surface-acceptance.test.ts`

External references checked:

- ISO 12354-1:2017 and ISO 12354-2:2017, for airborne and impact
  building-acoustic estimation from element performance.
- ISO 717-1:2020 and ISO 717-2:2020, for single-number rating separation.
- ISO 10140-2:2021 and ISO 10140-3:2021, for lab airborne and impact
  measurement context.
- ISO 16283-1:2014 and ISO 16283-2:2020, for field airborne and impact
  measurement context.
- ISO 9052-1:1989, for dynamic stiffness of materials used under
  floating floors.
- ASTM E90, E413, E492, E989, and E1007, for ASTM lab/field and rating
  ownership boundaries.
- Official product/software pages for INSUL, CadnaB, SONarchitect,
  AcouBAT by CYPE, and Sonusoft/Acoulatis/SOAB.

## Industry-Bar Conclusions

The current DynEcho direction is aligned with professional prediction
software expectations:

1. The engine should be model-first, not a finite source-row catalog.
2. Exact measured rows still win when stack, topology, metric, and basis
   match.
3. Compatible measured rows may anchor or calibrate only through named,
   scoped algorithms.
4. Source-absent formulas are valid user-facing answers only when the
   route owns the metric/basis and required physical inputs are present.
5. Missing physical inputs must stop only the outputs that genuinely need
   those inputs.
6. ISO lab, ISO field, ISO building-prediction, and ASTM rating outputs
   must remain separate ownership domains.

Professional tools reinforce this direction. INSUL is element/prediction
oriented and returns band-derived ratings. CadnaB, BASTIAN,
SONarchitect, and AcouBAT emphasize ISO 12354-style building prediction,
flanking/room context, and structured element data. Sonusoft/SOAB
separates prediction software from validated third-octave input data for
ISO 12354 workflows. These references support DynEcho's current
architecture: formula-family ownership, basis-specific adapters,
explicit physical inputs, and traceable boundaries.

## Impact Floor Finding

The observed `Impact Floor / Ln,w Not ready` issue is not primarily an
engine-math failure.

The engine already has a Gate CG2 contract for visible heavy-floating
reinforced-concrete upper-treatment stacks:

- missing `loadBasisKgM2` keeps published-family `Ln,w 50` live and stops
  only `DeltaLw` as `needs_input`;
- missing `resilientLayerDynamicStiffnessMNm3` keeps published-family
  `Ln,w 50` live and stops only `DeltaLw` as `needs_input`;
- complete explicit floating-floor context calculates `Ln,w 50.3` /
  `DeltaLw 24.3`;
- ASTM `IIC` / `AIIC` remain unsupported without ASTM owners.

Runtime spot checks from the workbench bridge confirmed the failure mode
on the actual `heavy_concrete_impact_floor` preset rows:

```text
preset_no_surface:
  basis: predictor_heavy_concrete_published_upper_treatment_estimate
  Ln,w: 50
  DeltaLw: 33.4
  supported: Rw, Ln,w, DeltaLw
  unsupported: Ln,w+CI

preset_empty_surface:
  supported: Rw
  unsupported: Ln,w, DeltaLw, Ln,w+CI
  warning: missing dynamic stiffness, load basis, and lower ceiling assembly
```

The likely bridge defect is in
`apps/web/features/workbench/scenario-analysis.ts`: all non-`inactive`
input-surface predictor inputs are forwarded to `calculateAssembly`.
That includes `needs_input` heavy-concrete combined surfaces produced
from blank/default UI fields. The blank explicit surface then shadows
the already-owned published upper-treatment answer, even though Gate CG2
says the published `Ln,w` anchor must remain live while only
formula-dependent outputs stop.

## Fix Direction

The next implementation should be small and route-scoped:

1. Keep heavy-concrete missing-input warnings visible.
2. Do not pass the heavy-concrete combined `impactPredictorInput` into
   the engine when the surface status is `needs_input`.
3. Continue passing it when status is `ready_for_formula_corridor`, so the
   complete combined upper/lower formula remains live.
4. Keep `unsafe_topology` parked and visible; do not silently fall back if
   the topology itself is hostile.
5. Add a workbench regression for the exact preset/default-surface case:
   blank heavy-concrete surface must keep published `Ln,w` live and park
   only outputs requiring missing formula fields.
6. Add/keep companion assertions that complete surface promotes to the
   combined formula and ASTM/field aliases stay separate.

This is a stricter answer-engine interpretation, not a looser one:
missing lower assembly, load, or dynamic stiffness should block the
combined formula outputs that need those inputs, but should not invalidate
a separately owned published-family `Ln,w` anchor for the same visible
upper-treatment stack.

## Verification Notes

Target contracts observed passing inside the broad engine run:

- `post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts`
- `calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts`

An attempted `pnpm --filter @dynecho/engine test -- ...` run did not stay
limited to the requested files and executed the whole engine package. It
finished with unrelated historical/global matrix failures:

```text
Test Files  27 failed | 696 passed | 4 skipped (727)
Tests       42 failed | 4067 passed | 5 skipped (4114)
```

Those broad failures should not be interpreted as the Impact Floor root
cause. The direct runtime checks and the two target impact contracts are
the relevant evidence for this note.

## Follow-Up Closeout - 2026-06-04

The recommended bridge fix was implemented after this analysis. The
workbench now forwards the heavy-concrete combined `impactPredictorInput`
only when the surface is `ready_for_formula_corridor` or
`unsafe_topology`; `needs_input` surfaces keep warning text visible but
no longer shadow the published upper-treatment `Ln,w` anchor.

Checkpoint validation passed:

- web regression for the real `heavy_concrete_impact_floor` preset;
- target engine Gate CG2 and Gate W impact contracts;
- production report-assistant smoke with live `Impact Floor` `Rw`,
  `Ln,w`, and `DeltaLw` metric contexts;
- production health remained green.

The engine architecture conclusion is unchanged: the fix preserves
model-first ownership, keeps missing physical inputs explicit, and does
not promote field/ASTM outputs from lab ISO impact formulas.
