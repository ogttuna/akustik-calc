# Checkpoint: Standards Research / Plan Detail Handoff

Date: 2026-05-05

Status: standards research completed and active model-first plan
expanded; no runtime behavior changed.

## Purpose

Detail the model-first physics prediction plan with external standards
and research so the next implementation step is not another
source-packet-only loop.

## Researched Sources

- ISO 12354-1:2017:
  airborne building-estimation model from element performance, flanking,
  and theoretical propagation.
  <https://www.iso.org/standard/70242.html>
- ISO 12354-2:2017:
  impact building-estimation model from element performance, flanking,
  and structural propagation.
  <https://www.iso.org/standard/70243.html>
- ISO 717-1:2020:
  airborne single-number ratings and spectrum adaptation terms.
  <https://www.iso.org/standard/77435.html>
- ISO 717-2:2020:
  impact single-number rating family.
  <https://www.iso.org/fr/standard/69867.html>
- ISO 10140-2:2021 and ISO 10140-3:2021:
  lab measurement context for airborne and impact element data.
  <https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/94/79487.html?browse=tc>
  <https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/07/94/79483.html?browse=tc>
- ISO 16283-1:2014 and ISO 16283-2:2020:
  field measurement context for airborne and impact sound insulation.
  <https://www.iso.org/standard/55997.html>
  <https://www.iso.org/standard/77436.html>
- ASTM E90, E336, E413:
  US airborne lab, field, and STC lane.
  <https://store.astm.org/e0090-23.html>
  <https://store.astm.org/standards/e336>
  <https://store.astm.org/e0413-22.html>
- ASTM E492, E989:
  US impact lab and IIC lane.
  <https://store.astm.org/e0492-25.html>
  <https://store.astm.org/e0989-21.html>
- Marshall Day Acoustics INSUL:
  competitor/category confirmation that professional acoustic tools are
  prediction engines for walls, floors, roofs, ceilings, and windows.
  <https://marshallday.com/software>
- Cambridge/Davy/Pearse 2017 JASA double-leaf cavity paper:
  research signal that finite cavity and porous-fill assumptions can
  materially affect double-leaf predictions.
  <https://pubmed.ncbi.nlm.nih.gov/28147555/>
- ISO 9053-1:2018:
  airflow resistance context for porous acoustic materials. Porous
  fill/absorber data can support cavity damping assumptions, but it is
  not a wall/floor transmission-loss row by itself.
  <https://www.iso.org/standard/69869.html>
- ISO 354 and ASTM C423:
  reverberation-room absorption context. NRC/absorption rows must remain
  absorption evidence and must not be promoted directly into `Rw`, `STC`,
  `Ln,w`, or `IIC`.
  <https://www.iso.org/cms/%20render/live/en/sites/isoorg/contents/data/standard/03/45/34545.html?browse=tc>
  <https://store.astm.org/Standards/C423.htm>
- ISO 9052-1:1989:
  dynamic stiffness context for materials under floating floors.
  Floating-floor impact predictions need dynamic stiffness/load basis,
  not just layer thickness or density.
  <https://www.iso.org/standard/16620.html>
- ASTM E1007:
  field measurement context for tapping-machine impact transmission
  through floor-ceiling assemblies and associated supporting structures.
  Field impact outputs need field/context ownership.
  <https://store.astm.org/e1007-25.html>
- Transfer-matrix / multilayer research:
  supports a later generalized multilayer solver path for solid, fluid,
  and porous layers after material-property widening and validation.
  <https://www.sciencedirect.com/science/article/abs/pii/S0022460X23003474>
- SONarchitect and BASTIAN:
  professional ISO 12354 tool references showing the target category:
  frequency-band element data plus calculation, not finite lookup rows.
  <https://www.acousticware.com/sonarchitect/index.php/en/sonarchitect-iso/whatit>
  <https://www.schallmessung.com/bastian/>
- INSUL technical notes:
  family-specific reference behavior for single-panel and double-panel
  prediction regions including mass, modulus, critical frequency,
  coincidence, loss factor, mass-air-mass resonance, cavity modes, and
  structural connections.
  <https://www.insul.co.nz/tech-info/>

## Plan Detail Added

`docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`
now includes:

- standards/research baseline;
- deep research analysis that separates element, building, and field
  outputs;
- material data contracts for solid leaves, boards/MLV, porous fill,
  resilient/floor layers, frames/bridges, cavities, and field context;
- accuracy/tolerance policy for `exact_source`,
  `calibrated_prediction`, and `uncalibrated_prediction`;
- Gate A standards-backed contract assertions;
- Gate B shared `airborneBasis` / `airborneCandidateSet` shape with
  `measurementStandard`, `calculationStandard`, `ratingStandard`,
  frequency bands, curve basis, tolerance, and assumptions;
- Gate C rating adapter inventory for ISO 717-1, ISO 717-2, ASTM E413,
  and ASTM E989;
- Gate D input completeness / needs-input matrix so missing physical
  topology is separated from missing exact source evidence;
- Gate E airborne candidate resolver;
- Gate F solver family roadmap for single-leaf, double-leaf,
  triple-leaf, lined/masonry/CLT/timber, and impact/floor;
- Gate G grouped Rockwool triple-leaf prediction;
- Gate H source calibration and exact promotion.

`docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md` now records the
standards alignment contract: missing exact source means no exact claim,
not no calculation.

`docs/calculator/NEXT_IMPLEMENTATION_PLAN.md` now summarizes the
standards frame and the detailed gate sequence.

## Correct Next Implementation Step

Create:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`

That Gate A must be no-runtime and must assert:

- source-packet refresh is historical/exact-source backlog;
- missing source packet cannot block formula-backed prediction;
- standards fields exist in the planned basis contract;
- later gates must define the input-completeness matrix before resolver
  promotion, so the calculator asks for missing topology/geometry instead
  of inventing it;
- grouped Rockwool triple-leaf is the first runtime prediction
  benchmark;
- `Rw`, `STC`, `IIC`, field ratings, and impact ratings are not
  interchangeable without a named rating/measurement basis.
- NRC/absorption evidence is not isolation evidence; it can inform
  porous-fill/cavity damping only through an explicit solver assumption.
- floating-floor prediction requires dynamic stiffness/load context
  before design-grade impact results are surfaced.

## Validation

This pass changed docs only. Runtime tests were not run because no
runtime behavior changed. Handoff checks passed:

- `git diff --check`;
- trailing-whitespace scan over changed authority docs.
