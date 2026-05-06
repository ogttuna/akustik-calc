# Checkpoint: Model-First Milestone Research Handoff

Date: 2026-05-05

Status: milestone plan added; no runtime behavior changed.

## Purpose

Turn the model-first physics prediction pivot into a milestone sequence
that can be implemented without drifting back into one-off source-packet
or Rockwool-only loops.

## Additional Research Used

- ISO 10848-1/2/3/4:
  flanking transmission measurement context. The standards confirm that
  building/field performance is not just the separating layer stack; it
  needs flanking, junction, and context ownership before apparent/field
  results can be design-grade.
  <https://www.iso.org/standard/67226.html>
  <https://www.iso.org/standard/67227.html>
  <https://www.iso.org/standard/67228.html>
  <https://www.iso.org/standard/67229.html>
- ISO 12999-1:2020:
  measurement uncertainty context for building-acoustics sound
  insulation. This supports explicit `errorBudgetDb` /
  `toleranceClass` instead of false exactness.
  <https://www.iso.org/standard/73930.html>
- SONarchitect ISO method page:
  professional ISO 12354 tooling computes airborne, impact, facade, and
  reverberation quantities and includes multilayer / equation methods.
  This supports a calculator-plus-data architecture.
  <https://www.acousticware.com/sonarchitect/index.php/en/sonarchitect-iso/isoen12354>
- BASTIAN:
  professional building-acoustics tool category reference for
  calculation of airborne/impact sound insulation and absorption.
  <https://www.schallmessung.com/bastian/>
- INSUL technical notes:
  family-specific single-panel and double-panel prediction behavior,
  including mass, modulus, critical frequency, coincidence, loss factor,
  mass-air-mass resonance, cavity modes, and structural connections.
  <https://www.insul.co.nz/tech-info/>
- Cambridge/Davy/Pearse 2017 JASA double-leaf cavity paper:
  finite cavity and porous fill assumptions materially affect
  predictions; porous fill cannot be simplified to "more mass".
  <https://pubmed.ncbi.nlm.nih.gov/28147555/>
- Stabilized transfer-matrix / multilayer research:
  supports a later generalized multilayer solver, but only after material
  property contracts and validation exist.
  <https://www.sciencedirect.com/science/article/abs/pii/S0022460X23003474>

## Milestone Decisions

The active slice now carries these milestones:

1. M0 direction lock / research baseline.
2. M1 Gate A no-runtime direction contract.
3. M2 airborne basis and candidate schema.
4. M3 rating adapter integrity.
5. M4 input completeness / needs-input matrix.
6. M5 airborne candidate resolver.
7. M6 grouped Rockwool triple-leaf runtime prediction.
8. M7 calibration / exact promotion layer.
9. M8 family expansion and material-property widening.
10. M9 personal-use readiness gate.

## Correct Next Step

Create:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`

Gate A remains no-runtime. It should assert:

- the model-first pivot is active;
- source-packet refresh is exact/calibration backlog;
- missing source evidence is not missing formula capability;
- M2-M9 milestone sequence is the accepted execution path;
- Rockwool grouped triple-leaf is the first runtime prediction benchmark,
  but not an exact/source-validated claim.

## Non-Negotiable Boundaries

- Do not promote Rockwool as exact without source-owned topology,
  material, metric, tolerance, negative-boundary, calibration/holdout,
  and visible-test ownership.
- Do not calculate field/apparent outputs as design-grade without
  room/flanking/junction context.
- Do not treat NRC/absorption as transmission loss or impact isolation.
- Do not use transfer-matrix/general multilayer modelling as a shortcut
  before material contracts and validation are in place.

## Validation

This handoff is docs-only. Handoff checks passed:

- `git diff --check`;
- trailing-whitespace scan over active authority docs.
