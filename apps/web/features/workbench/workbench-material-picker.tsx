"use client";

import type { MaterialDefinition } from "@dynecho/shared";
import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { formatDecimal } from "@/lib/format";

import { getMaterialCategoryLabel } from "./describe-assembly";
import { getCatalogDensity } from "./material-density";
import { isCustomWorkbenchMaterial } from "./workbench-materials";

export type WorkbenchMaterialOptionGroup = {
  label: string;
  materials: readonly MaterialDefinition[];
};

type WorkbenchMaterialPickerProps = {
  buttonClassName?: string;
  currentMaterial: MaterialDefinition;
  emptyMessage?: string;
  groups: readonly WorkbenchMaterialOptionGroup[];
  id?: string;
  label?: string;
  onSelect: (materialId: string) => void;
  searchPlaceholder?: string;
};

function formatMaterialDensity(material: MaterialDefinition): string {
  const densityKgM3 = getCatalogDensity(material);

  if (!(typeof densityKgM3 === "number")) {
    return material.category === "gap" ? "Gap layer" : "Density not listed";
  }

  return `${Number.isInteger(densityKgM3) ? densityKgM3.toLocaleString("en-US") : formatDecimal(densityKgM3)} kg/m³`;
}

function getMaterialBadge(material: MaterialDefinition): string {
  if (isCustomWorkbenchMaterial(material)) {
    return "Custom";
  }

  return getMaterialCategoryLabel(material);
}

function matchesMaterialQuery(material: MaterialDefinition, query: string): boolean {
  if (query.length === 0) {
    return true;
  }

  const searchHaystack = [
    material.name,
    material.notes,
    getMaterialCategoryLabel(material),
    formatMaterialDensity(material),
    ...(material.tags ?? [])
  ]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .join(" ")
    .toLocaleLowerCase("en-US");

  return searchHaystack.includes(query);
}

export function WorkbenchMaterialPicker(props: WorkbenchMaterialPickerProps) {
  const {
    buttonClassName,
    currentMaterial,
    emptyMessage = "No materials match this search.",
    groups,
    id,
    label,
    onSelect,
    searchPlaceholder = "Search materials"
  } = props;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const generatedTriggerId = useId();
  const panelId = useId();
  const triggerId = id ?? generatedTriggerId;
  const normalizedQuery = query.trim().toLocaleLowerCase("en-US");
  const filteredGroups = groups
    .map((group) => ({
      label: group.label,
      materials: group.materials.filter((material) => matchesMaterialQuery(material, normalizedQuery))
    }))
    .filter((group) => group.materials.length > 0);
  const selectedDensity = formatMaterialDensity(currentMaterial);
  const selectedBadge = getMaterialBadge(currentMaterial);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    searchRef.current?.focus();
  }, [open]);

  return (
    <div className="grid min-w-0 gap-2" ref={rootRef}>
      {label ? (
        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]" htmlFor={triggerId}>
          {label}
        </label>
      ) : null}

      <button
        aria-controls={panelId}
        aria-expanded={open}
        className={`focus-ring flex min-h-[3.1rem] w-full min-w-0 items-center justify-between gap-3 rounded border px-3 py-2.5 text-left ${
          buttonClassName ?? "border-[color:var(--line)] bg-[color:var(--paper)]"
        }`}
        id={triggerId}
        onClick={() => {
          setOpen((current) => !current);
          if (open) {
            setQuery("");
          }
        }}
        type="button"
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-[color:var(--ink)]">{currentMaterial.name}</span>
          <span className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">
            <span className="truncate">{selectedDensity}</span>
            <span className="text-[color:var(--ink-faint)]">•</span>
            <span className="truncate">{selectedBadge}</span>
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[color:var(--ink-soft)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div
          className="grid gap-3 rounded-md border border-[color:var(--line)] bg-[color:var(--panel)] p-3"
          id={panelId}
        >
          <label className="relative block">
            <span className="sr-only">Search materials</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--ink-faint)]" />
            <input
              className="focus-ring w-full rounded border border-[color:var(--line)] bg-[color:var(--paper)] py-2 pl-9 pr-3 text-sm text-[color:var(--ink)]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              ref={searchRef}
              value={query}
            />
          </label>

          {filteredGroups.length > 0 ? (
            <div className="max-h-72 overflow-y-auto rounded border border-[color:var(--line)] bg-[color:var(--paper)] p-2">
              <div className="grid gap-3">
                {filteredGroups.map((group) => (
                  <section className="grid gap-2" key={group.label}>
                    <div className="flex items-center justify-between gap-2 px-1">
                      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                        {group.label}
                      </div>
                      <div className="text-[0.68rem] font-semibold text-[color:var(--ink-soft)]">{group.materials.length}</div>
                    </div>
                    <div className="grid gap-1.5">
                      {group.materials.map((material) => {
                        const selected = material.id === currentMaterial.id;

                        return (
                          <button
                            className={`focus-ring flex min-w-0 items-center justify-between gap-3 rounded border px-3 py-2.5 text-left ${
                              selected
                                ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)]"
                                : "border-[color:var(--line)] bg-[color:var(--paper)] hover:bg-[color:var(--panel)]"
                            }`}
                            key={material.id}
                            onClick={() => {
                              onSelect(material.id);
                              setOpen(false);
                              setQuery("");
                            }}
                            type="button"
                          >
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold text-[color:var(--ink)]">{material.name}</span>
                              <span className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">
                                <span className="truncate">{formatMaterialDensity(material)}</span>
                                <span className="text-[color:var(--ink-faint)]">•</span>
                                <span className="truncate">{getMaterialBadge(material)}</span>
                              </span>
                            </span>
                            {selected ? <Check className="h-4 w-4 shrink-0 text-[color:var(--accent)]" /> : null}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded border border-dashed border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-6 text-center text-sm leading-6 text-[color:var(--ink-soft)]">
              {emptyMessage}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
