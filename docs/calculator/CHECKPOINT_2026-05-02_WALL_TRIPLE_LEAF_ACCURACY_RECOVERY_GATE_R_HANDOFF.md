# Checkpoint - 2026-05-02 - Wall Triple Leaf Accuracy Recovery Gate R

Slice:

`wall_triple_leaf_accuracy_recovery_v1`

Gate R status:

`gate_r_formalized_manual_source_packet_intake_no_runtime_selected_source_packet_availability_gate_s`

Selected next file:

`packages/engine/src/wall-triple-leaf-source-packet-availability-gate-s.test.ts`

## Summary

Gate R lands the manual source-packet intake contract with no runtime
movement. It adds:

- `packages/engine/src/wall-triple-leaf-manual-source-packet.ts`
- `packages/engine/src/wall-triple-leaf-manual-source-packet-gate-r.test.ts`

The gate formalizes what a Uris 2006 packet must contain before any
digitization, material mapping, tolerance decision, or runtime
promotion can proceed. No source packet is currently provided, so the
calculator remains fail-closed on the existing screening path.

## Required Packet Artifacts

The Uris 2006 packet must provide all of these before runtime can move:

1. `rights_safe_source_file`
2. `source_locator_metadata`
3. `page_figure_table_locator`
4. `curve_identity_map`
5. `band_vector_or_digitization_payload`
6. `rating_derivation_and_uncertainty`
7. `chain_of_custody_and_rights_note`

Artifact intent:

- the source file or authorized payload must be rights-safe for the
  local calculator corpus and traceable to Uris 2006 DOI
  `10.1016/j.apacoust.2005.11.006`;
- locator metadata must identify title, authors, journal, volume,
  issue, pages, DOI, and PII, but metadata alone cannot replace curves;
- page / figure / table locators must distinguish double-frame controls
  from internal-board triple-leaf variants;
- curve identity must map source curves to local Side A, cavity 1,
  internal leaf, cavity 2, and Side B roles;
- one-third-octave TL vectors must be source-owned or reproducibly
  digitized on the calculator band grid with uncertainty recorded;
- Rw/STC derivation must use the same band data and name ISO 717 / ASTM
  E413 assumptions where applicable;
- chain-of-custody and rights notes must stay separate from runtime
  evidence, with no copied source text or image embedded in runtime
  code.

## Packet Validation

Current packet state:

- `packetProvidedNow`: `false`
- `status`: `blocked_no_source_packet`
- `missingArtifactCount`: `7`
- `readyForDigitizationNow`: `false`
- `readyForRuntimeNow`: `false`
- target backlog item: `uris_2006_authorized_curve_packet`

Gate R preserves the Gate Q backlog context. The first backlog item
remains `uris_2006_authorized_curve_packet`, Gate P still has seven
open runtime blockers, and none of those blockers is closed by intake
contract wording alone.

## Runtime Posture

Runtime remains fail-closed:

- split-rockwool grouped stack: `multileaf_screening_blend`, `Rw 41`,
  low confidence;
- no digitization selected now;
- no runtime import selected now;
- no support promotion;
- no confidence promotion;
- no evidence promotion;
- no API, route-card, output-card, proposal/report, or workbench input
  behavior movement.

Do not present `Rw 41` as fixed, correct, or source-validated. Gate R
only defines the packet contract that a later gate must satisfy.

## Gate S Selection

Gate S should check whether the required source packet is actually
available in the local / rights-safe corpus:

`packages/engine/src/wall-triple-leaf-source-packet-availability-gate-s.test.ts`

Gate S must keep runtime frozen when the packet is absent or when any
required artifact is incomplete. It may only prepare digitization work
if the source packet is present, rights-safe, traceable, and contains
enough curve/table or page-image evidence to support reproducible
one-third-octave extraction.

## Validation

Focused Gate R validation:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-manual-source-packet-gate-r.test.ts --maxWorkers=1`
  green on 2026-05-02: 1 file / 7 tests.

Continuity validation:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-access-followup-gate-q.test.ts src/wall-triple-leaf-source-access-gate-p.test.ts src/wall-triple-leaf-source-locator-provenance-gate-o.test.ts src/wall-triple-leaf-source-locator-intake-gate-n.test.ts src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts --maxWorkers=1`
  green on 2026-05-02: 6 files / 42 tests.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts --maxWorkers=1`
  green on 2026-05-02: 1 file / 7 tests.
- `pnpm calculator:gate:current`
  green on 2026-05-02 after adding Gate R to the runner: engine 186
  files / 981 tests, web 47 files / 227 passed + 18 skipped, build
  5/5 with the known non-fatal `sharp/@img` warnings, whitespace guard
  clean.
- `git diff --check`
  green on 2026-05-02.
