"use client";

import type { FloorRole, MaterialDefinition } from "@dynecho/shared";
import { ArrowDown, ArrowUp, Copy, GripVertical, Trash2 } from "lucide-react";
import type { DragEvent } from "react";

import { formatDecimal } from "@/lib/format";

import { getMaterialCategoryLabel } from "./describe-assembly";
import { getCatalogDynamicStiffness } from "./dynamic-stiffness";
import { getLayerThicknessGuidanceHint, getLayerThicknessSanityWarning } from "./input-sanity";
import { getCatalogDensity } from "./material-density";
import type { StudyMode } from "./preset-definitions";
import {
  describeSimpleWorkbenchSingleEntryFloorRoleConflict,
  findSimpleWorkbenchSingleEntryFloorRoleConflict
} from "./simple-workbench-floor-role-conflicts";
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
  dragPosition?: "after" | "before" | null;
  dragState?: "dragging" | "idle";
  expanded: boolean;
  index: number;
  materials: readonly MaterialDefinition[];
  onDensityChange: (id: string, densityKgM3: string) => void;
  onDuplicateRow: (id: string) => void;
  onDynamicStiffnessChange: (id: string, dynamicStiffnessMNm3: string) => void;
  materialGroups: readonly WorkbenchMaterialOptionGroup[];
  moveFlashDirection?: "down" | "up";
  onActiveRowChange: (rowId: string | null) => void;
  onLayerDragEnd: () => void;
  onLayerDragOver: (event: DragEvent<HTMLElement>, rowId: string) => void;
  onLayerDragStart: (event: DragEvent<HTMLElement>, rowId: string) => void;
  onLayerDrop: (event: DragEvent<HTMLElement>, rowId: string) => void;
  onExpandedChange: (rowId: string | null) => void;
  onFloorRoleChange: (id: string, floorRole?: FloorRole) => void;
  onMaterialChange: (id: string, materialId: string) => void;
  onMoveRow: (id: string, direction: "up" | "down") => void;
  onRemoveRow: (id: string) => void;
  onThicknessChange: (id: string, thicknessMm: string) => void;
  row: LayerDraft;
  rows: readonly LayerDraft[];
  studyMode: StudyMode;
  totalRows: number;
}) {
  const {
    active,
    dragPosition,
    dragState = "idle",
    expanded,
    index,
    materials: allMaterials,
    materialGroups,
    moveFlashDirection,
    onActiveRowChange,
    onLayerDragEnd,
    onLayerDragOver,
    onLayerDragStart,
    onLayerDrop,
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
    rows,
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
  const overrideActive = Boolean(row.densityKgM3?.trim() || row.dynamicStiffnessMNm3?.trim());
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
  const floorRoleConflict =
    studyMode === "floor"
      ? findSimpleWorkbenchSingleEntryFloorRoleConflict(rows, row.floorRole, { ignoreRowId: row.id })
      : null;
  const floorRoleConflictWarning = floorRoleConflict
    ? describeSimpleWorkbenchSingleEntryFloorRoleConflict(floorRoleConflict, {
        context: "editor"
      })
    : null;
  const stateLabel = thicknessReady ? "Live row" : "Parked";
  const thicknessLabel = thicknessReady ? `${row.thicknessMm} mm` : "Pending";
  const roleOrStateLabel = studyMode === "floor" ? (row.floorRole ? FLOOR_ROLE_LABELS[row.floorRole] : "Unassigned") : stateLabel;
  const rowMeta = compactValues([edgeLabel, stateLabel, studyMode === "floor" && row.floorRole ? FLOOR_ROLE_LABELS[row.floorRole] : null]).join(" • ");
  const secondaryFacts = compactValues([
    surfaceMassLabel,
    densityLabel,
    studyMode === "floor" ? dynamicStiffnessLabel : null
  ]).join(" • ");

  return (
    <article
      className={`workbench-row min-w-0 rounded border px-2.5 py-2.5 ${
        active
          ? "border-[color:var(--line-strong)] bg-[color:var(--panel)]"
          : thicknessReady
            ? "border-[color:var(--line)] bg-[color:var(--paper)]"
            : "border-[color:var(--warning)] bg-[color:color-mix(in_oklch,var(--warning)_8%,var(--paper))]"
      }`}
      data-active={active ? "true" : "false"}
      data-drag-state={dragState}
      data-drop-position={dragPosition ?? "none"}
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
      onDragOver={(event) => onLayerDragOver(event, row.id)}
      onDrop={(event) => onLayerDrop(event, row.id)}
      onMouseEnter={() => onActiveRowChange(row.id)}
      onMouseLeave={() => onActiveRowChange(null)}
    >
      <div className="grid min-w-0 gap-2 2xl:grid-cols-[2.5rem_minmax(0,1.5fr)_7rem_10rem_auto] 2xl:items-center">
        <div className="hidden h-7 w-7 items-center justify-center rounded border border-[color:var(--line)] bg-[color:color-mix(in_oklch,var(--ink)_3%,var(--paper))] text-[0.72rem] font-semibold text-[color:var(--ink)] 2xl:flex">
          {index + 1}
        </div>

        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <button
              aria-grabbed={dragState === "dragging"}
              aria-label={`Drag layer ${index + 1} to reorder`}
              className="focus-ring inline-flex h-7 w-7 shrink-0 cursor-grab items-center justify-center rounded border border-[color:var(--line)] text-[color:var(--ink-faint)] hover:border-[color:var(--line-strong)] hover:bg-[color:var(--panel)] active:cursor-grabbing"
              draggable={totalRows > 1}
              onDragEnd={onLayerDragEnd}
              onDragStart={(event) => onLayerDragStart(event, row.id)}
              title="Drag to reorder"
              type="button"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </button>
            <span
              aria-hidden="true"
              className={`h-2 w-2 shrink-0 rounded-full ${thicknessReady ? "bg-[color:var(--success)]" : "bg-[color:var(--warning)]"}`}
            />
            <div className="line-clamp-2 min-w-0 text-[0.88rem] font-semibold leading-5 text-[color:var(--ink)]">{material.name}</div>
          </div>
          <div className="mt-1 line-clamp-2 text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">
            <span className="2xl:hidden">{`${index + 1}. ${rowMeta}`}</span>
            <span className="hidden 2xl:inline">{compactValues([edgeLabel, categoryLabel]).join(" • ")}</span>
          </div>
        </div>

        <div className="min-w-0">
          <div className="text-[0.82rem] font-semibold text-[color:var(--ink)]">{thicknessLabel}</div>
          <div className="mt-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-faint)] 2xl:hidden">Thickness</div>
        </div>

        <div className="min-w-0">
          <div className={`truncate text-[0.82rem] font-semibold ${thicknessReady ? "text-[color:var(--ink)]" : "text-[color:var(--warning-ink)]"}`}>
            {roleOrStateLabel}
          </div>
          <div className="mt-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-faint)] 2xl:hidden">
            {studyMode === "floor" ? "Role" : "State"}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-start gap-1 2xl:justify-end">
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
            aria-label={`Remove layer ${index + 1}`}
            className="focus-ring inline-flex h-7 w-7 items-center justify-center rounded border border-transparent text-[color:var(--warning-ink)] hover:border-[color:var(--warning)] hover:bg-[color:var(--warning-soft)]"
            onClick={() => onRemoveRow(row.id)}
            title="Remove"
            type="button"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            aria-label={expanded ? "Hide details" : "Edit row"}
            aria-expanded={expanded}
            className="focus-ring inline-flex h-7 items-center justify-center rounded border border-[color:var(--line)] px-2 text-[0.75rem] font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
            onClick={() => onExpandedChange(expanded ? null : row.id)}
            type="button"
          >
            {expanded ? "Close" : "Edit"}
          </button>
        </div>
      </div>

      <div className="mt-2 line-clamp-2 text-[0.72rem] leading-5 text-[color:var(--ink-soft)]" title={secondaryFacts}>
        {secondaryFacts}
      </div>

      {expanded ? (
        <div className="mt-3 grid gap-3">
          <div className="grid min-w-0 gap-3 2xl:grid-cols-2">
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

          <details
            className={`rounded border px-3 py-2.5 ${workbenchSectionMutedCardClass("assembly")}`}
            open={Boolean(densityWarning || dynamicStiffnessWarning || overrideActive)}
          >
            <summary className="cursor-pointer list-none">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-[0.82rem] font-semibold text-[color:var(--ink)]">Optional overrides</div>
                <GuidedFactChip tone={densityWarning || dynamicStiffnessWarning ? "warning" : "neutral"}>
                  {densityWarning || dynamicStiffnessWarning ? "Check values" : overrideActive ? "Overrides set" : "Catalog defaults"}
                </GuidedFactChip>
              </div>
            </summary>

            <div className={`mt-3 grid min-w-0 gap-3 ${studyMode === "floor" ? "2xl:grid-cols-2" : ""}`}>
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
            </div>
          </details>

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

          {floorRoleNote ||
          floorRoleConflictWarning ||
          thicknessGuidanceHint ||
          thicknessSanityWarning ||
          densityWarning ||
          dynamicStiffnessWarning ? (
            <div className="grid gap-1 text-[0.7rem] leading-5">
              {floorRoleNote ? <div className="text-[color:var(--ink-soft)]">{floorRoleNote}</div> : null}
              {floorRoleConflictWarning ? <div className="text-[color:var(--warning-ink)]">{floorRoleConflictWarning}</div> : null}
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
