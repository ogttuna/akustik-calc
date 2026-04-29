# Slice Plan - CLT / Mass-Timber Wall Source Pack Extraction v1

Status: SELECTED / NOT STARTED (selected 2026-04-29 by
`calculator-source-pack-readiness-triage-gate-a-contract.test.ts`;
no-runtime source-row and metric-context extraction slice).

Next implementation file:

`packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts`

Selection reason: `calculator_source_pack_readiness_triage_v1` Gate A
ranked all candidate source packs and kept every candidate
`runtimeImportReadyNow: false`. CLT / mass-timber is still blocked for
runtime import, but it has the strongest current wall-side source
reservoir because the WoodWorks mass-timber acoustic inventory and NRC
mass-timber report surfaces contain explicit mass-timber wall or
measured transmission-loss context worth extracting.

## Objective

Extract a bounded CLT / mass-timber wall source pack shape without
changing runtime behavior. The slice should decide whether specific
WoodWorks/NRC rows can become future wall import candidates, formula
tolerance candidates, or rejection-only context.

This slice must not change acoustic formulas, runtime values, support
classes, confidence classes, evidence tiers, API shape, route-card
values, output-card statuses, proposal/report copy, or workbench input
behavior.

## Source Surfaces

Use these as source-intake surfaces, not runtime truth:

- WoodWorks Acoustically Tested Mass Timber Assemblies PDF:
  `https://www.woodworks.org/wp-content/uploads/Acoustically-Tested-Mass-Timber-Assemblies-WoodWorks.pdf`
  - extraction targets: single CLT wall, single NLT wall, and double
    CLT wall table groups;
  - blocker: many rows use STC/ASTC or related North American acoustic
    metrics that must be mapped or rejected against DynEcho ISO
    `Rw` / field output semantics.
- WoodWorks Mass Timber Fire & Acoustic Database:
  `https://www.woodworks.org/resources/inventory-of-fire-resistance-tested-mass-timber-assemblies-penetrations/`
  - extraction target: report pointers and metadata only;
  - blocker: database rows are living pointers and must not be copied
    as source truth without naming the underlying report and metric
    context.
- NRC mass-timber report archive:
  `https://nrc-publications.canada.ca/eng/view/object/?id=e38fb723-6a4c-4a78-9e47-5a73c92c448f`
  - extraction target: measured transmission-loss / flanking context
    that can help classify mass-timber wall/floor evidence boundaries.
- NRC NLT addendum:
  `https://nrc-publications.canada.ca/eng/view/ft/?id=9e3b39be-e0ed-415b-9649-3e7ec228f52c`
  - extraction target: NLT addendum context and any explicitly
    wall-relevant table/report references.

## Current Runtime Baseline

The live CLT wall route remains the existing formula-owned,
medium-confidence wall route pinned by:

- `packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts`
- `packages/engine/src/post-wall-clt-wall-source-research-v1-next-slice-selection-contract.test.ts`
- `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`

Dataholz CLT floor rows remain floor-only source truth. They do not
promote CLT wall values, CLT wall confidence, or CLT wall evidence tier.

## Gate A - Extract Row And Metric Eligibility

Gate A should add:

`packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts`

The contract should be no-runtime and should classify candidate source
rows into these outcomes:

- `eligible_for_later_row_mapping`: exact assembly locator exists, wall
  topology is explicit, and metric context is usable or deliberately
  convertible in a later bounded contract;
- `formula_tolerance_context_only`: source context is useful for
  laminated-leaf formula tolerance ownership but not direct row import;
- `rejection_context_only`: floor-only, flanking-only, database-pointer,
  STC/ASTC-only, product-summary, or topology-mismatched context.

Required evidence fields:

- source label, URL, report/table/page/row locator, and retrieval date;
- wall/floor orientation and assembly topology;
- CLT/NLT/DLT leaf thickness, board layers, cavity, insulation,
  resilient mounting, stud/rail/connector, and side-order metadata when
  present;
- reported metric (`STC`, `ASTC`, `Rw`, `R'w`, transmission-loss
  spectrum, or other), lab/field context, and uncertainty/tolerance
  owner if available;
- local DynEcho route or generated case mapping;
- explicit reason the row is import-eligible later, formula-context
  only, or rejection-only;
- paired engine and web route-card/report test shape required before
  any visible support/confidence/evidence movement.

Minimum tests in the Gate A contract:

- assert the slice lands no-runtime and all planning surfaces exist;
- assert each extracted source group has a report/table locator, metric
  context, and eligibility classification;
- assert STC/ASTC/IIC rows do not become ISO `Rw`, `R'w`, `DnT,w`, or
  field truth without an explicit mapping decision;
- assert Dataholz floor CLT rows remain floor-only truth;
- assert no CLT wall support, confidence, evidence tier, route-card, or
  output-card behavior changes;
- assert any next follow-up names either a bounded metric-mapping slice,
  a formula-tolerance slice, or a roadmap-only closeout.

## Validation

- Run the targeted Gate A engine contract while iterating.
- Add the Gate A contract to `tools/dev/run-calculator-current-gate.ts`
  when it lands.
- Run `pnpm calculator:gate:current`.
- Run `git diff --check`.
- Run `pnpm check` if the slice changes broad repo contracts,
  user-visible route/report behavior, or before a full release-style
  checkpoint.
