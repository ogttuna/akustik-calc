"use client";

import { CircleHelp, Orbit } from "lucide-react";
import type { FocusEvent, KeyboardEvent, ReactNode } from "react";
import { useId, useState } from "react";

import type { WorkbenchFieldStatus, WorkbenchFieldStatusKind } from "./workbench-field-status";
import { formatWorkbenchFieldStatusLabel, isWorkbenchFieldStatusUsed } from "./workbench-field-status";

type FieldGuideProps = {
  children: ReactNode;
  guide: WorkbenchFieldStatus;
  hint?: string;
  inputId: string;
  label: string;
};

function getStatusClasses(kind: WorkbenchFieldStatusKind): string {
  switch (kind) {
    case "active":
      return "border-[color:var(--success)] bg-[color:var(--success-soft)] text-[color:var(--success-ink)]";
    case "conditional":
      return "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]";
    case "anchored":
      return "border-[color:var(--ink-faint)] bg-[color:var(--panel)] text-[color:var(--ink-soft)]";
    case "ignored":
      return "border-[color:var(--line)] bg-[color:var(--panel)] text-[color:var(--ink-soft)]";
  }
}

function FieldStatusChip({ kind }: { kind: WorkbenchFieldStatusKind }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${getStatusClasses(kind)}`}
    >
      {formatWorkbenchFieldStatusLabel(kind)}
    </span>
  );
}

export function FieldGuide({ children, guide, hint, inputId, label }: FieldGuideProps) {
  const panelId = useId();
  const hintId = useId();
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hovered || focused || pinned;

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      setFocused(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      setPinned(false);
      setHovered(false);
      setFocused(false);
    }
  };

  return (
    <div
      className="grid gap-2"
      onBlurCapture={handleBlur}
      onFocusCapture={() => setFocused(true)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <label
            className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]"
            htmlFor={inputId}
          >
            {label}
          </label>
          {hint ? (
            <p className="mt-1 text-xs leading-6 text-[color:var(--ink-faint)]" id={hintId}>
              {hint}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <FieldStatusChip kind={guide.kind} />
          <button
            aria-controls={panelId}
            aria-expanded={open}
            aria-label="Show field help"
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded border hairline bg-[color:var(--paper)] text-[color:var(--ink-soft)] transition hover:bg-[color:var(--panel)] hover:text-[color:var(--ink)]"
            onClick={() => setPinned((value) => !value)}
            title={`Explain ${label}`}
            type="button"
          >
            <CircleHelp className="h-4 w-4" />
          </button>
        </div>
      </div>

      {open ? (
        <div
          className="rounded-md border hairline bg-[color:var(--panel-strong)] px-4 py-4 text-sm leading-7 text-[color:var(--ink-soft)]"
          id={panelId}
          role="note"
        >
          <div className="flex flex-wrap items-center gap-2">
            <FieldStatusChip kind={guide.kind} />
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
              {isWorkbenchFieldStatusUsed(guide.kind) ? "Used in current calculation" : "Not used right now"}
            </span>
          </div>
          <p className="mt-3">
            <span className="font-semibold text-[color:var(--ink)]">Meaning:</span> {guide.meaning}
          </p>
          <p className="mt-2 inline-flex gap-2">
            <Orbit className="mt-1 h-4 w-4 shrink-0 text-[color:var(--ink-faint)]" />
            <span>
              <span className="font-semibold text-[color:var(--ink)]">Current use:</span> {guide.currentUse}
            </span>
          </p>
        </div>
      ) : null}

      <div aria-describedby={hint ? hintId : undefined}>{children}</div>
    </div>
  );
}
