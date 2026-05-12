# Gate AI Opening/Leak STC Surface Parity Handoff - 2026-05-12

Landed action:

`gate_ai_personal_use_mvp_opening_leak_stc_surface_parity_plan`

Selection status:

`gate_ai_personal_use_mvp_opening_leak_stc_surface_parity_landed_selected_revalidation_gate_aj`

Selected next action:

`gate_aj_personal_use_mvp_post_opening_leak_stc_surface_revalidation_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aj-post-opening-leak-stc-surface-revalidation-contract.test.ts`

## Summary

Gate AI is a no-runtime surface-parity gate after Gate AH's
opening/leak `STC` ASTM E413 adapter. It keeps Gate S/Gate AH values
frozen:

- complete opening/leak fixture: lab `Rw 38.2 / STC 39`;
- high-leakage two-opening case: lab `Rw 33.7 / STC 34`;
- budget: `+/-6 dB` source-absent opening/leak budget, not measured
  evidence;
- adapter id: `astm_e413_stc_from_airborne_transmission_loss_curve`;
- rating basis: element-lab `STC` through ASTM E413, not an alias from
  `Rw`.

## What Changed

- Added Gate AI engine contract:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ai-opening-leak-stc-surface-parity-contract.test.ts`.
- Added explicit web surface fields for the Gate AH adapter:
  `stcAdapterActive`, `stcAdapterId`, `stcAdapterLabel`, and
  `stcRatingStandard`.
- Strengthened the opening/leak web parity test so target-output
  status/corridor, route/card posture, method/corridor dossiers, saved
  replay, estimate API payloads, and Markdown report lines all carry
  the same Gate S + Gate AH basis.
- Updated current-gate runner and calculator docs to point from Gate AI
  to Gate AJ.

## Boundaries Kept

- Missing opening fields remain `needs_input`.
- Source-absent opening values remain unsupported until a value owner
  exists.
- STC-only opening input basis remains blocked; Gate AH needs an
  `Rw`-compatible opening element to shift the host transmission-loss
  curve.
- `R'w`, `DnT,w`, field, and building requests remain blocked without a
  Gate AH adapter or `+/-6 dB` lab budget.
- No source row, tolerance, formula, exact-match, or field/building
  behavior moved.

## Next Gate AJ

Gate AJ should be a post-STC-surface revalidation gate. It should prove
that the added `STC` support and visible surface did not regress:

1. Gate S opening/leak `Rw 38.2` / `+/-6 dB` runtime corridor.
2. Gate AH opening/leak `STC 39` ASTM E413 adapter.
3. Gate U first-class opening input surface and hostile UI edits.
4. Gate G/H/I/J/K wall route and airborne field-context surfaces.
5. Gate L/M/N/O/P building-prediction boundaries.
6. Gate W/AA coverage matrix supported-value versus unsupported-output
   separation.

Gate AJ should not promote new runtime behavior unless the revalidation
finds a concrete defect that requires a minimal fix.
