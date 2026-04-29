# Slice Plan - CLT / Mass-Timber Wall Source Pack Extraction v1

Status: CLOSED AT GATE C (selected 2026-04-29 by
`calculator-source-pack-readiness-triage-gate-a-contract.test.ts`;
Gate A landed 2026-04-29 in
`clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts`;
Gate B landed 2026-04-29 in
`clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts`;
Gate C closed 2026-04-29 in
`post-clt-mass-timber-wall-source-pack-extraction-v1-next-slice-selection-contract.test.ts`;
no-runtime source-row and metric-context extraction slice).

Landed implementation files:

`packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts`

`packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts`

`packages/engine/src/post-clt-mass-timber-wall-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Selected next implementation file:

`packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts`

Selection reason: `calculator_source_pack_readiness_triage_v1` Gate A
ranked all candidate source packs and kept every candidate
`runtimeImportReadyNow: false`. CLT / mass-timber is still blocked for
runtime import, but it has the strongest current wall-side source
reservoir because the WoodWorks mass-timber acoustic inventory and NRC
mass-timber report surfaces contain explicit mass-timber wall or
measured transmission-loss context worth extracting.

Gate A result: source groups are now classified, but no runtime import
is selected. WoodWorks Table 7 Single CLT Wall and Table 9 Double CLT
Wall are later row-mapping candidates only. WoodWorks Table 8 Single NLT
Wall, NRC RR-335, and the NRC NLT addendum are formula/tolerance context
only. The WoodWorks database and local Dataholz CLT floor rows are
rejection-only context until their specific blockers are satisfied.

Gate B result: no bounded metric-mapping or formula-tolerance path is
ready now. STC/FSTC/ASTC remain metric-policy research; IIC is rejected
for wall airborne outputs; one-third-octave transmission-loss context is
only future row recompute input; local Dataholz CLT `Rw` rows remain
floor-only. Gate B selects Gate C closeout / next-slice selection.

Gate C result: the slice is closed no-runtime. No Gate B roadmap track
is source-ready for runtime import, support promotion, confidence
promotion, evidence promotion, or visible card/report movement. The
selected next slice is `internal_use_acceptance_rehearsal_v1`, because
company use now needs an executable acceptance matrix over the current
operating envelope rather than another source-gated runtime import
attempt.

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

## Gate A - Extract Row And Metric Eligibility - Landed

Gate A added:

`packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts`

The contract is no-runtime and classifies candidate source
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

Landed Gate A decision:

- `directRuntimeImportReadyNow: false`
- `nextGate:
  gate_b_bound_metric_mapping_and_formula_tolerance_decision_no_runtime`
- `nextGateFile:
  packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts`
- Current `wall-clt-local` runtime baseline remains formula-owned,
  medium-confidence, and source-gated.
- Dataholz CLT exact rows remain floor-only source truth.

## Gate B - Bound Metric Mapping And Formula Tolerance Decision - Landed

Gate B added:

`packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts`

Gate B decided that the extracted WoodWorks/NRC context cannot support a
bounded follow-up without more source work:

- STC/FSTC/ASTC are kept as metric-policy research only.
- IIC is rejected for wall airborne outputs.
- one-third-octave transmission-loss context is only future row
  recompute input after exact wall rows and ISO 717 handling are named.
- local Dataholz CLT `Rw` rows remain floor-only truth.
- WoodWorks/NRC contexts do not name a local CLT, NLT, or double-CLT
  formula-tolerance owner.

Gate B tests assert:

- Gate B remains no-runtime and preserves all support,
  confidence, evidence, route-card, output-card, proposal/report, and
  API surfaces;
- each Gate A source group is rejected from immediate bounded follow-up
  with its first missing requirement;
- no STC/FSTC/ASTC/IIC value is treated as ISO `Rw`, `R'w`,
  `DnT,w`, or direct field truth without an explicit mapping rule;
- current `wall-clt-local` values remain lab `Rw=42`, field
  `R'w=41`, field `DnT,w=42`;
- Dataholz CLT exact rows remain floor-only;
- the selected next action is Gate C closeout / next-slice selection.

## Gate C - Closeout And Next-Slice Selection - Landed

Gate C added:

`packages/engine/src/post-clt-mass-timber-wall-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Gate C closed the CLT / mass-timber extraction slice no-runtime. It did
not promote:

- WoodWorks table groups without exact row, metric policy, and
  tolerance owner;
- WoodWorks database pointers without underlying report/table/row;
- NRC RR-335 ASTC/flanking context as direct `Rw` / `R'w` / `DnT,w`
  truth;
- NRC NLT addendum context without an NLT wall family/tolerance owner;
- Dataholz CLT floor rows into wall CLT truth.

Gate C tests assert:

- Gate C closes the slice no-runtime;
- Gate B roadmap tracks are not source-ready runtime packs;
- current CLT wall runtime values and visible posture remain
  frozen;
- Dataholz CLT floor rows remain floor-only truth;
- no source-ready accuracy pack outranks a company-internal acceptance
  rehearsal;
- the selected next slice is
  `internal_use_acceptance_rehearsal_v1`.

## Validation

- Run the targeted Gate A engine contract while iterating.
- Add the Gate A contract to `tools/dev/run-calculator-current-gate.ts`
  when it lands.
- Run the targeted Gate B engine contract while iterating.
- Add the Gate B contract to `tools/dev/run-calculator-current-gate.ts`
  when it lands.
- Run the targeted Gate C engine contract while iterating.
- Add the Gate C contract to `tools/dev/run-calculator-current-gate.ts`
  when it lands.
- Run `pnpm calculator:gate:current`.
- Run `git diff --check`.
- Run `pnpm check` if the slice changes broad repo contracts,
  user-visible route/report behavior, or before a full release-style
  checkpoint.

Latest Gate A validation, 2026-04-29:

- targeted Gate A engine contract green: 1 file / 7 tests;
- focused current gate green: engine 134 files / 637 tests, web 45
  files / 216 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean;
- broad `pnpm check` green: lint/typecheck green, engine 267 files /
  1457 tests, web 157 files / 890 passed + 18 skipped, build 5/5 with
  the known non-fatal `sharp/@img` warnings.

Latest Gate B targeted validation, 2026-04-29:

- targeted Gate B engine contract green: 1 file / 7 tests;
- focused current gate green: engine 135 files / 644 tests, web 45
  files / 216 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean;
- broad `pnpm check` green: lint/typecheck green, engine 268 files /
  1464 tests, web 157 files / 890 passed + 18 skipped, build 5/5 with
  the known non-fatal `sharp/@img` warnings.

Latest Gate C targeted validation, 2026-04-29:

- targeted Gate C engine contract green: 1 file / 5 tests;
- focused current gate green: engine 136 files / 649 tests, web 45
  files / 216 passed + 18 skipped, build 5/5 with the known non-fatal
  `sharp/@img` warnings, whitespace guard clean;
- broad `pnpm check` green: lint/typecheck green, engine 269 files /
  1469 tests, web 157 files / 890 passed + 18 skipped, build 5/5 with
  the known non-fatal `sharp/@img` warnings.
