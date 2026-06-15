# Legacy Workbench Feature Area

Active calculator UI work should target `apps/web/features/workbench-rebuild`
and the `/workbench-v2` route.

This directory is mixed-purpose:

- legacy simple/advanced calculator shells are retained for reference and tests;
- proposal, report, assistant, and shared presentation helpers are still used by
  the current `/workbench-v2` report handoff flow.

Do not change the legacy calculator shells for product work unless the task
explicitly names the legacy `/workbench` surface. When editing report/proposal
helpers here, keep `/workbench-v2` as the active calculator entry point.
