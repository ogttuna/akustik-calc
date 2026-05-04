"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, Download, FilePenLine, Moon, RotateCcw, Sun } from "lucide-react";
import Link from "next/link";

import type { StudyMode } from "./preset-definitions";
import { getStudyModeLabel } from "./simple-workbench-utils";

type SimpleWorkbenchToolbarProps = {
  exportReady: boolean;
  isExportingPdf: boolean;
  onExportBrandedDocx: () => void;
  onExportBrandedPdf: () => void;
  onExportSimpleDocx: () => void;
  onExportSimplePdf: () => void;
  onOpenPdfSetup: () => void;
  onReset: () => void;
  onToggleTheme: () => void;
  readyOutputCount: number;
  rowCount: number;
  studyMode: StudyMode;
  theme: "dark" | "light";
};

export function SimpleWorkbenchToolbar({
  exportReady,
  isExportingPdf,
  onExportBrandedDocx,
  onExportBrandedPdf,
  onExportSimpleDocx,
  onExportSimplePdf,
  onOpenPdfSetup,
  onReset,
  onToggleTheme,
  readyOutputCount,
  rowCount,
  studyMode,
  theme,
}: SimpleWorkbenchToolbarProps) {
  const [reportMenuOpen, setReportMenuOpen] = useState(false);
  const reportMenuRef = useRef<HTMLDetailsElement | null>(null);

  useEffect(() => {
    if (!reportMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!reportMenuRef.current?.contains(target)) {
        setReportMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setReportMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [reportMenuOpen]);

  const closeReportMenu = () => setReportMenuOpen(false);

  return (
    <div className="stage-enter relative z-30 shrink-0 border-b border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-3">
      <div className="grid gap-3">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="inline-flex h-7 items-center rounded border border-[color:var(--line-strong)] bg-[color:var(--ink)] px-2 text-[0.68rem] font-semibold tracking-[0.14em] text-[color:var(--paper)]">
                DAC
              </span>
              <h1 className="min-w-0 max-w-full text-sm font-semibold uppercase leading-5 tracking-[0.08em] text-[color:var(--ink)]">
                DYNECHO ACOUSTIC CALCULATOR
              </h1>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[0.72rem] text-[color:var(--ink-faint)]">
              <span className="rounded-full border border-[color:var(--line)] bg-[color:var(--paper)] px-2 py-0.5 font-semibold text-[color:var(--ink-soft)]">
                {getStudyModeLabel(studyMode)}
              </span>
              <span className="rounded-full border border-[color:var(--line)] bg-[color:var(--paper)] px-2 py-0.5 font-semibold text-[color:var(--ink-soft)]">
                {`${readyOutputCount} ready`}
              </span>
              <span>{`${rowCount} row${rowCount === 1 ? "" : "s"}`}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <details className="relative" onToggle={(event) => setReportMenuOpen(event.currentTarget.open)} open={reportMenuOpen} ref={reportMenuRef}>
              <summary
                className="focus-ring touch-target inline-flex h-8 cursor-pointer list-none items-center gap-1.5 rounded border border-[color:var(--accent)] bg-[color:var(--accent-soft)] px-2.5 text-[0.8rem] font-semibold text-[color:var(--accent-ink)] hover:brightness-95 [&::-webkit-details-marker]:hidden"
                onClick={(event) => {
                  event.preventDefault();
                  setReportMenuOpen((current) => !current);
                }}
              >
                <Download className="h-3.5 w-3.5" />
                Report
              </summary>
              <div className="absolute left-0 z-50 mt-2 grid w-48 max-w-[calc(100vw-2rem)] gap-1 rounded border border-[color:var(--line-strong)] bg-[color:var(--paper)] p-1.5 shadow-[0_20px_50px_-26px_rgba(0,0,0,0.55)] sm:left-auto sm:right-0">
                <button
                  className="focus-ring flex min-w-0 items-center justify-between gap-2 rounded px-2.5 py-2 text-left text-[0.8rem] font-semibold text-[color:var(--ink)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!exportReady || isExportingPdf}
                  onClick={() => {
                    closeReportMenu();
                    onExportBrandedPdf();
                  }}
                  type="button"
                >
                  <span>{isExportingPdf ? "Exporting..." : "Branded PDF"}</span>
                  <Download className="h-3.5 w-3.5 shrink-0" />
                </button>
                <button
                  className="focus-ring rounded px-2.5 py-2 text-left text-[0.8rem] font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!exportReady || isExportingPdf}
                  onClick={() => {
                    closeReportMenu();
                    onExportBrandedDocx();
                  }}
                  type="button"
                >
                  {isExportingPdf ? "..." : "Branded DOCX"}
                </button>
                <button
                  className="focus-ring rounded px-2.5 py-2 text-left text-[0.8rem] font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!exportReady || isExportingPdf}
                  onClick={() => {
                    closeReportMenu();
                    onExportSimplePdf();
                  }}
                  type="button"
                >
                  {isExportingPdf ? "..." : "Simple PDF"}
                </button>
                <button
                  className="focus-ring rounded px-2.5 py-2 text-left text-[0.8rem] font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!exportReady || isExportingPdf}
                  onClick={() => {
                    closeReportMenu();
                    onExportSimpleDocx();
                  }}
                  type="button"
                >
                  {isExportingPdf ? "..." : "Simple DOCX"}
                </button>
                <button
                  className="focus-ring flex min-w-0 items-center justify-between gap-2 rounded px-2.5 py-2 text-left text-[0.8rem] font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!exportReady || isExportingPdf}
                  onClick={() => {
                    closeReportMenu();
                    onOpenPdfSetup();
                  }}
                  type="button"
                >
                  <span>PDF setup</span>
                  <FilePenLine className="h-3.5 w-3.5 shrink-0" />
                </button>
              </div>
            </details>

            <button
              className="focus-ring touch-target inline-flex h-8 items-center gap-1.5 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2.5 text-[0.8rem] font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
              onClick={onReset}
              type="button"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>

            <Link
              className="focus-ring touch-target inline-flex h-8 items-center gap-1.5 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-2.5 text-[0.8rem] font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
              href="/workbench?view=advanced"
            >
              Advanced
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>

            <button
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="focus-ring touch-target inline-flex h-8 w-8 items-center justify-center rounded border border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
              onClick={onToggleTheme}
              type="button"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
