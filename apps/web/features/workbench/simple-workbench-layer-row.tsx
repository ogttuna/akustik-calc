"use client";

import type { FloorRole, MaterialDefinition } from "@dynecho/shared";
import { ArrowDown, ArrowUp, Copy } from "lucide-react";
import type { ReactNode } from "react";

import { formatDecimal } from "@/lib/format";

import { getMaterialCategoryLabel } from "./describe-assembly";
import { getCatalogDynamicStiffness } from "./dynamic-stiffness";
import { getLayerThicknessGuidanceHint, getLayerThicknessSanityWarning } from "./input-sanity";
import { getCatalogDensity } from "./material-density";
import type { StudyMode } from "./preset-definitions";
import { workbenchSectionMutedCardClass } from "./simple-workbench-layer-visuals";
import { GuidedFactChip } from "./simple-workbench-primitives";
import {
  buildMaterialFacts,
  compactValues,
  formatDensityLabel,
  formatDynamicStiffnessLabel,
  getDensityInputWarning,
  getDynamicStiffnessInputWarning,
  getLayerPositionNarrative,
  getStackEdgeLabel,
  getTextInputClassName,
  isThicknessReady,
  uniqueMaterialsById
} from "./simple-workbench-utils";
import { FLOOR_ROLE_LABELS } from "./workbench-data";
import { WorkbenchMaterialPicker, type WorkbenchMaterialOptionGroup } from "./workbench-material-picker";
import type { LayerDraft } from "./workbench-store";

export function SimpleLayerRow(props: {
  active: boolean;
  expanded: boolean;
  index: number;
  materials: readonly MaterialDefinition[];
  onDensityChange: (id: string, densityKgM3: string) => void;
  onDuplicateRow: (id: string) => void;
  onDynamicStiffnessChange: (id: string, dynamicStiffnessMNm3: string) => void;
  materialGroups: readonly WorkbenchMaterialOptionGroup[];
  moveFlashDirection?: "down" | "up";
  onActiveRowChange: (rowId: string | null) => void;
  onExpandedChange: (rowId: string | null) => void;
  onFloorRoleChange: (id: string, floorRole?: FloorRole) => void;
  onMaterialChange: (id: string, materialId: string) => void;
  onMoveRow: (id: string, direction: "up" | "down") => void;
  onRemoveRow: (id: string) => void;
  onThicknessChange: (id: string, thicknessMm: string) => void;
  row: LayerDraft;
  studyMode: StudyMode;
  totalRows: number;
}) {
  const {
    active,
    expanded,
    index,
    materials: allMaterials,
    materialGroups,
    moveFlashDirection,
    onActiveRowChange,
    onExpandedChange,
    onDensityChange,
    onDuplicateRow,
    onDynamicStiffnessChange,
    onFloorRoleChange,
    onMaterialChange,
    onMoveRow,
    onRemoveRow,
    onThicknessChange,
    row,
    studyMode,
    totalRows
  } = props;

  const materials = uniqueMaterialsById(materialGroups.flatMap((group) => group.materials));
  const material = materials.find((entry) => entry.id === row.materialId) ?? allMaterials[0]!;
  const edgeLabel = getStackEdgeLabel(studyMode, index, totalRows);
  const canMoveUp = index > 0;
  const canMoveDown = index < totalRows - 1;
  const thicknessReady = isThicknessReady(row.thicknessMm);
  const thicknessGuidanceHint = getLayerThicknessGuidanceHint(row, allMaterials);
  const thicknessSanityWarning = getLayerThicknessSanityWarning(row, index + 1, allMaterials);
  const densityWarning = getDensityInputWarning(material, row.densityKgM3);
  const dynamicStiffnessWarning = getDynamicStiffnessInputWarning(row.dynamicStiffnessMNm3);
  const categoryLabel = getMaterialCategoryLabel(material);
  const densityLabel = formatDensityLabel(material, row.densityKgM3);
  const surfaceMassLabel =
    buildMaterialFacts({
      densityOverride: row.densityKgM3,
      dynamicStiffnessOverride: row.dynamicStiffnessMNm3,
      material,
      thicknessMm: row.thicknessMm
    }).find((fact) => fact.includes("kg/m²")) ?? "Pending thickness";
  const dynamicStiffnessLabel = formatDynamicStiffnessLabel(material, row.dynamicStiffnessMNm3);
  const catalogDynamicStiffness = getCatalogDynamicStiffness(material);
  const catalogDensity = getCatalogDensity(material);
  const floorRoleNote =
    studyMode !== "floor"
      ? null
      : row.floorRole
        ? null
        : "Assign a floor role when this row should participate in exact floor matching.";
  const stateLabel = thicknessReady ? "Live row" : "Parked";
  const rowMeta = compactValues([edgeLabel, stateLabel, studyMode === "floor" && row.floorRole ? FLOOR_ROLE_LABELS[row.floorRole] : null]).join(" • ");

  return (
    <article
      className={`workbench-row min-w-0 rounded border px-3 py-3 ${
        active
          ? "border-[color:var(--line-strong)] bg-[color:var(--panel)]"
          : thicknessReady
            ? "border-[color:var(--line)] bg-[color:var(--paper)]"
            : "border-[color:var(--warning)] bg-[color:color-mix(in_oklch,var(--warning)_8%,var(--paper))]"
      }`}
      data-active={active ? "true" : "false"}
      data-move-flash={moveFlashDirection ?? "idle"}
      data-row-id={row.id}
      data-ready={thicknessReady ? "true" : "false"}
      data-testid={`editor-row-${index + 1}`}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onActiveRowChange(null);
        }
      }}
      onFocusCapture={() => onActiveRowChange(row.id)}
      onMouseEnter={() => onActiveRowChange(row.id)}
      onMouseLeave={() => onActiveRowChange(null)}
    >
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:color-mix(in_oklch,var(--ink)_3%,var(--paper))] text-xs font-semibold text-[color:var(--ink)]">
            {index + 1}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[0.9rem] font-semibold text-[color:var(--ink)]">{material.name}</div>
            <div className="mt-1 text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">{rowMeta}</div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            aria-label={`Move layer ${index + 1} up`}
            className="focus-ring inline-flex h-7 w-7 items-center justify-center rounded border border-[color:var(--line)] text-[color:var(--ink-soft)] enabled:hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-35"
            disabled={!canMoveUp}
            onClick={() => onMoveRow(row.id, "up")}
            type="button"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            aria-label={`Move layer ${index + 1} down`}
            className="focus-ring inline-flex h-7 w-7 items-center justify-center rounded border border-[color:var(--line)] text-[color:var(--ink-soft)] enabled:hover:bg-[color:var(--panel)] disabled:cursor-not-allowed disabled:opacity-35"
            disabled={!canMoveDown}
            onClick={() => onMoveRow(row.id, "down")}
            type="button"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            aria-label={`Duplicate layer ${index + 1}`}
            className="focus-ring inline-flex h-7 w-7 items-center justify-center rounded border border-[color:var(--line)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
            onClick={() => onDuplicateRow(row.id)}
            title="Duplicate"
            type="button"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            className="focus-ring rounded px-2.5 py-1.5 text-sm font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
            onClick={() => onRemoveRow(row.id)}
            type="button"
          >
            Remove
          </button>
          <button
            aria-label={expanded ? "Hide details" : "Edit row"}
            aria-expanded={expanded}
            className="focus-ring inline-flex items-center justify-center rounded border border-[color:var(--line)] px-2.5 py-1.5 text-sm font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
            onClick={() => onExpandedChange(expanded ? null : row.id)}
            type="button"
          >
            {expanded ? "Close" : "Edit"}
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <GuidedFactChip>{thicknessReady ? `${row.thicknessMm} mm` : "Pending thickness"}</GuidedFactChip>
        <GuidedFactChip>{studyMode === "floor" ? (row.floorRole ? FLOOR_ROLE_LABELS[row.floorRole] : "Unassigned role") : stateLabel}</GuidedFactChip>
        <GuidedFactChip>{densityLabel}</GuidedFactChip>
        <GuidedFactChip>{surfaceMassLabel}</GuidedFactChip>
      </div>

      {expanded ? (
        <div className="mt-3 grid gap-3">
          <div className={`grid min-w-0 gap-3 ${studyMode === "floor" ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
            <WorkbenchMaterialPicker
              currentMaterial={material}
              groups={materialGroups}
              label="Material"
              onSelect={(materialId) => onMaterialChange(row.id, materialId)}
            />

            <label className="grid min-w-0 gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Thickness</span>
              <input
                aria-invalid={Boolean(thicknessSanityWarning)}
                className={getTextInputClassName(Boolean(thicknessSanityWarning))}
                inputMode="decimal"
                onChange={(event) => onThicknessChange(row.id, event.target.value)}
                placeholder="mm"
                value={row.thicknessMm}
              />
            </label>

            <label className="grid min-w-0 gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Density</span>
              <input
                aria-invalid={Boolean(densityWarning)}
                aria-label={`Layer ${index + 1} density`}
                className={getTextInputClassName(Boolean(densityWarning))}
                inputMode="decimal"
                onChange={(event) => onDensityChange(row.id, event.target.value)}
                placeholder={typeof catalogDensity === "number" ? formatDecimal(catalogDensity) : "kg/m³"}
                value={row.densityKgM3 ?? ""}
              />
            </label>

            {studyMode === "floor" ? (
              <label className="grid min-w-0 gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Dynamic stiffness</span>
                <input
                  aria-invalid={Boolean(dynamicStiffnessWarning)}
                  aria-label={`Layer ${index + 1} dynamic stiffness`}
                  className={getTextInputClassName(Boolean(dynamicStiffnessWarning))}
                  inputMode="decimal"
                  onChange={(event) => onDynamicStiffnessChange(row.id, event.target.value)}
                  placeholder={typeof catalogDynamicStiffness === "number" ? formatDecimal(catalogDynamicStiffness) : "MN/m³"}
                  value={row.dynamicStiffnessMNm3 ?? ""}
                />
              </label>
            ) : null}

            {studyMode === "floor" ? (
              <label className="grid min-w-0 gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Floor role</span>
                <select
                  className="focus-ring touch-target w-full min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-2.5"
                  onChange={(event) => onFloorRoleChange(row.id, event.target.value ? (event.target.value as FloorRole) : undefined)}
                  value={row.floorRole ?? ""}
                >
                  <option value="">Unassigned</option>
                  {Object.entries(FLOOR_ROLE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <GuidedFactChip>{categoryLabel}</GuidedFactChip>
            <GuidedFactChip>{dynamicStiffnessLabel}</GuidedFactChip>
            <GuidedFactChip>{getLayerPositionNarrative(studyMode, index, totalRows)}</GuidedFactChip>
          </div>

          {material.notes ? (
            <div className={`rounded border px-3 py-2.5 text-[0.74rem] leading-5 text-[color:var(--ink-soft)] ${workbenchSectionMutedCardClass("assembly")}`}>
              <span className="font-semibold text-[color:var(--ink)]">Material note:</span> {material.notes}
            </div>
          ) : null}

          {floorRoleNote || thicknessGuidanceHint || thicknessSanityWarning || densityWarning || dynamicStiffnessWarning ? (
            <div className="grid gap-1 text-[0.7rem] leading-5">
              {floorRoleNote ? <div className="text-[color:var(--ink-soft)]">{floorRoleNote}</div> : null}
              {thicknessGuidanceHint ? <div className="text-[color:var(--ink-soft)]">{thicknessGuidanceHint}</div> : null}
              {thicknessSanityWarning ? <div className="text-[color:var(--warning-ink)]">{thicknessSanityWarning}</div> : null}
              {densityWarning ? <div className="text-[color:var(--warning-ink)]">{densityWarning}</div> : null}
              {dynamicStiffnessWarning ? <div className="text-[color:var(--warning-ink)]">{dynamicStiffnessWarning}</div> : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
