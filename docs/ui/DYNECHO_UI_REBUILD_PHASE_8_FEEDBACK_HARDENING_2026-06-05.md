# DynEcho UI Rebuild Phase 8 Feedback Hardening - 2026-06-05

Document role: user-feedback hardening slice after Phase 7 calculator desktop
polish.

## User Feedback To Carry Forward

- Dropdowns can render below adjacent panels/components.
- Light/dark mode is not discoverable or consistently controllable.
- Some dark-mode surfaces have insufficient text/background contrast.
- Login page likely has contrast failures in dark mode.
- Some flows still feel inconvenient and not professional enough.

## Scope

Allowed work:

- frontend-only changes to public intro, login, rebuilt calculator, and rebuilt
  report editor surfaces;
- central style/token updates in `apps/web/app/globals.css`;
- browser validation for light/dark mode and dropdown layering;
- documentation updates under `docs/ui`.

Blocked work:

- backend, engine, API, schema, auth, storage, or PDF output changes;
- calculator result/value changes;
- old rejected workbench shell reuse;
- PDF output renderer/template changes.

## Phase 8 Acceptance Checklist

- [x] User feedback above remains recorded in this document.
- [x] Theme toggle is available on public intro, login, calculator, and report
      editor shell surfaces.
- [x] Login inputs and submit button use central theme tokens, not hard-coded
      white/ink combinations.
- [x] Dropdown/popover/menu z-index tokens sit above sticky tool chrome.
- [x] Dark-mode Playwright smoke verifies visible login form text and controls.
- [x] Calculator smoke verifies material popover stays above surrounding UI.
- [x] Focused ESLint passes for touched frontend files.
- [x] Web build passes with only known optional PDF/DOCX warnings.
- [x] Protected PDF output/API files remain untouched.

## Validation Notes

- Login dark-mode smoke verified token-based input and submit colors, visible
  form text, no horizontal overflow, and no browser console errors.
- Calculator smoke verified material dropdown z-index `1600`, the sampled top
  element inside the popover, three searchable material options for `rock`, and
  no horizontal overflow.
- Report editor topbar smoke verified theme toggle and sign-out actions are
  visible after hydration.
- Focused ESLint passed for touched frontend files.
- `pnpm --filter @dynecho/web build` passed. The only warnings were the known
  optional Sharp package resolution warnings from the protected PDF/DOCX import
  chain.
- Protected PDF output/API diff check returned no touched files.
- Screenshot artifacts:
  `output/playwright/ui-phase8/login-dark-contrast-clean.png` and
  `output/playwright/ui-phase8/calculator-dropdown-layering.png`.
