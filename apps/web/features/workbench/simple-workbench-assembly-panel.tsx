"use client";

import type { AssemblyCalculation, FloorRole, MaterialDefinition } from "@dynecho/shared";
import { Plus } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

import { formatDecimal } from "@/lib/format";

import type { StudyMode } from "./preset-definitions";
import type { AssemblyToolPanel, NewLayerDraft } from "./simple-workbench-constants";
import { CustomMaterialComposer, NewLayerComposer } from "./simple-workbench-layer-composer";
import { LayerStackDiagram } from "./simple-workbench-layer-diagram";
import { workbenchSectionMutedCardClass } from "./simple-workbench-layer-visuals";
import { SimpleLayerRow } from "./simple-workbench-layer-row";
import { SectionLead } from "./simple-workbench-primitives";
import { buildDefaultNewLayerDraft, buildMaterialGroups } from "./simple-workbench-utils";
import {
  getWorkbenchMaterialById,
  resolveThicknessForMaterialChange,
  type CustomMaterialDraft,
  type CustomMaterialDraftErrors
} from "./workbench-materials";
import type { WorkbenchMaterialOptionGroup } from "./workbench-material-picker";
import { inferFloorRole } from "./workbench-store";
import type { LayerDraft } from "./workbench-store";

export function SimpleWorkbenchAssemblyPanel(props: {
  activeAssemblyTool: AssemblyToolPanel | null;
  activeRowId: string | null;
  activeWorkspacePanel: string;
  appendConfiguredLayer: () => void;
  createCustomMaterial: () => void;
  customMaterialDraft: CustomMaterialDraft;
  customMaterialErrors: CustomMaterialDraftErrors;
  customMaterialExpanded: boolean;
  customMaterials: readonly MaterialDefinition[];
  duplicateRow: (id: string) => void;
  expandedRowId: string | null;
  isDesktop: boolean;
  liveRowCount: number;
  materials: readonly MaterialDefinition[];
  missingFloorRoleCount: number;
  movedRowFlash: { direction: "down" | "up"; rowId: string } | null;
  moveRowWithFeedback: (id: string, direction: "up" | "down") => void;
  newLayerDraft: NewLayerDraft;
  newLayerMaterialGroups: readonly WorkbenchMaterialOptionGroup[];
  parkedRowCount: number;
  replaceConfiguredBaseLayer: () => void;
  replaceConfiguredBaseLayerAvailable: boolean;
  removeRow: (id: string) => void;
  result: AssemblyCalculation | null;
  rows: readonly LayerDraft[];
  setActiveAssemblyTool: Dispatch<SetStateAction<AssemblyToolPanel | null>>;
  setActiveRowId: Dispatch<SetStateAction<string | null>>;
  setCustomMaterialDraft: Dispatch<SetStateAction<CustomMaterialDraft>>;
  setCustomMaterialExpanded: (expanded: boolean) => void;
  setExpandedRowId: Dispatch<SetStateAction<string | null>>;
  setNewLayerDraft: Dispatch<SetStateAction<NewLayerDraft>>;
  studyMode: StudyMode;
  totalThickness: number;
  updateDensity: (id: string, densityKgM3: string) => void;
  updateDynamicStiffness: (id: string, dynamicStiffnessMNm3: string) => void;
  updateFloorRole: (id: string, floorRole?: FloorRole) => void;
  updateMaterial: (id: string, materialId: string) => void;
  updateThickness: (id: string, thicknessMm: string) => void;
}) {
  const {
    activeAssemblyTool,
    activeRowId,
    activeWorkspacePanel,
    appendConfiguredLayer,
    createCustomMaterial,
    customMaterialDraft,
    customMaterialErrors,
    customMaterialExpanded,
    customMaterials,
    duplicateRow,
    expandedRowId,
    isDesktop,
    liveRowCount,
    materials,
    missingFloorRoleCount,
    movedRowFlash,
    moveRowWithFeedback,
    newLayerDraft,
    newLayerMaterialGroups,
    parkedRowCount,
    replaceConfiguredBaseLayer,
    replaceConfiguredBaseLayerAvailable,
    removeRow,
    result,
    rows,
    setActiveAssemblyTool,
    setActiveRowId,
    setCustomMaterialDraft,
    setCustomMaterialExpanded,
    setExpandedRowId,
    setNewLayerDraft,
    studyMode,
    totalThickness,
    updateDensity,
    updateDynamicStiffness,
    updateFloorRole,
    updateMaterial,
    updateThickness
  } = props;

  return (
    <div
      className={isDesktop
        ? "col-start-1 row-start-2 min-w-0 border-r border-[color:var(--line)] px-4 pb-4"
        : `stage-enter-2 min-w-0 px-4 py-4 ${activeWorkspacePanel === "stack" ? "block" : "hidden"}`
      }
    >
      <div className="flex flex-col">
        <SectionLead title="Assembly" tone="assembly" />

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.72rem] text-[color:var(--ink-faint)]">
          <span>{rows.length ? `${rows.length} rows` : "No rows"}</span>
          {rows.length ? (
            <>
              <span className="text-[color:var(--line)]">·</span>
              <span>{`${formatDecimal(totalThickness)} mm`}</span>
              <span className="text-[color:var(--line)]">·</span>
              <span>{`${liveRowCount} live / ${parkedRowCount} parked`}</span>
              {studyMode === "floor" && missingFloorRoleCount > 0 ? (
                <>
                  <span className="text-[color:var(--line)]">·</span>
                  <span className="text-[color:var(--warning-ink)]">{`${missingFloorRoleCount} role missing`}</span>
                </>
              ) : null}
            </>
          ) : null}
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              aria-pressed={activeAssemblyTool === "composer"}
              className={`focus-ring inline-flex h-8 items-center gap-1.5 rounded px-3 text-[0.8rem] font-semibold ${
                activeAssemblyTool === "composer"
                  ? "bg-[color:var(--accent)] text-[color:var(--paper)]"
                  : "border border-[color:var(--accent)] text-[color:var(--accent-ink)] hover:bg-[color:var(--accent-soft)]"
              }`}
              onClick={() => setActiveAssemblyTool((current) => (current === "composer" ? null : "composer"))}
              type="button"
            >
              <Plus className="h-3.5 w-3.5" />
              {activeAssemblyTool === "composer" ? "Close" : "Add layer"}
            </button>
            <button
              aria-pressed={activeAssemblyTool === "library"}
              className={`focus-ring inline-flex h-8 items-center gap-1.5 rounded border px-3 text-[0.8rem] font-medium ${
                activeAssemblyTool === "library"
                  ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]"
                  : "border-[color:var(--line)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
              }`}
              onClick={() => setActiveAssemblyTool((current) => (current === "library" ? null : "library"))}
              type="button"
            >
              {`Custom materials${customMaterials.length ? ` (${customMaterials.length})` : ""}`}
            </button>
            {!isDesktop ? (
              <button
                aria-pressed={activeAssemblyTool === "preview"}
                className={`focus-ring inline-flex h-8 items-center gap-1.5 rounded border px-3 text-[0.8rem] font-medium ${
                  activeAssemblyTool === "preview"
                    ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]"
                    : "border-[color:var(--line)] text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
                }`}
                onClick={() => setActiveAssemblyTool((current) => (current === "preview" ? null : "preview"))}
                type="button"
              >
                Preview
              </button>
            ) : null}
          </div>

          {activeAssemblyTool === "library" ? (
            <CustomMaterialComposer
              customMaterials={customMaterials}
              draft={customMaterialDraft}
              errors={customMaterialErrors}
              expanded={customMaterialExpanded}
              onCreate={createCustomMaterial}
              onDraftChange={(field, value) =>
                setCustomMaterialDraft((current) => ({
                  ...current,
                  [field]: value
                }))
              }
              onExpandedChange={setCustomMaterialExpanded}
            />
          ) : null}

          {activeAssemblyTool === "composer" ? (
            <NewLayerComposer
              draft={newLayerDraft}
              materials={materials}
              materialGroups={newLayerMaterialGroups}
              onAdd={appendConfiguredLayer}
              onDensityChange={(densityKgM3) => setNewLayerDraft((current) => ({ ...current, densityKgM3 }))}
              onDynamicStiffnessChange={(dynamicStiffnessMNm3) =>
                setNewLayerDraft((current) => ({ ...current, dynamicStiffnessMNm3 }))
              }
              onFloorRoleChange={(floorRole) => setNewLayerDraft((current) => ({ ...current, floorRole }))}
              onMaterialChange={(materialId) =>
                setNewLayerDraft((current) => {
                  const nextFloorRole = inferFloorRole(materialId, studyMode, customMaterials);
                  const nextMaterial = getWorkbenchMaterialById(materialId, customMaterials);
                  const previousMaterial = getWorkbenchMaterialById(current.materialId, customMaterials);
                  const baselineDraft = buildDefaultNewLayerDraft(studyMode);

                  return {
                    ...current,
                    densityKgM3: "",
                    dynamicStiffnessMNm3: "",
                    floorRole: nextFloorRole,
                    materialId,
                    thicknessMm:
                      nextMaterial
                        ? resolveThicknessForMaterialChange({
                            currentThicknessMm: current.thicknessMm,
                            nextFloorRole,
                            nextMaterial,
                            previousDefaultThicknessMm:
                              current.materialId === baselineDraft.materialId ? baselineDraft.thicknessMm : undefined,
                            previousFloorRole: current.floorRole,
                            previousMaterial
                          })
                        : current.thicknessMm
                  };
                })
              }
              onReplaceBase={replaceConfiguredBaseLayer}
              onThicknessChange={(thicknessMm) => setNewLayerDraft((current) => ({ ...current, thicknessMm }))}
              replaceBaseAvailable={replaceConfiguredBaseLayerAvailable}
              studyMode={studyMode}
            />
          ) : null}

          {!isDesktop && activeAssemblyTool === "preview" ? (
            <LayerStackDiagram activeRowId={activeRowId} materials={materials} result={result} rows={rows} studyMode={studyMode} />
          ) : null}

          {rows.length ? (
            <div className={`hidden items-center gap-3 rounded border px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)] 2xl:grid 2xl:grid-cols-[2.5rem_minmax(0,1.5fr)_7rem_10rem_auto] ${workbenchSectionMutedCardClass("assembly")}`}>
              <span>#</span>
              <span>Layer</span>
              <span>Thickness</span>
              {studyMode === "floor" ? <span>Role</span> : <span>State</span>}
              <span className="text-right">Actions</span>
            </div>
          ) : null}

          <div className="grid min-w-0 gap-3">
            {rows.length ? (
              rows.map((row, index) => (
                <SimpleLayerRow
                  active={row.id === activeRowId}
                  expanded={row.id === expandedRowId}
                  index={index}
                  key={row.id}
                  materials={materials}
                  materialGroups={buildMaterialGroups(studyMode, materials, row.materialId, row.floorRole)}
                  moveFlashDirection={movedRowFlash?.rowId === row.id ? movedRowFlash.direction : undefined}
                  onActiveRowChange={setActiveRowId}
                  onExpandedChange={setExpandedRowId}
                  onDensityChange={updateDensity}
                  onDuplicateRow={duplicateRow}
                  onDynamicStiffnessChange={updateDynamicStiffness}
                  onFloorRoleChange={updateFloorRole}
                  onMaterialChange={updateMaterial}
                  onMoveRow={moveRowWithFeedback}
                  onRemoveRow={removeRow}
                  onThicknessChange={updateThickness}
                  row={row}
                  studyMode={studyMode}
                  totalRows={rows.length}
                />
              ))
            ) : (
              <div className="rounded border border-dashed border-[color:var(--line)] px-4 py-6 text-center text-sm text-[color:var(--ink-soft)]">
                No layers yet. Use <strong className="font-semibold text-[color:var(--ink)]">Add layer</strong> or pick an example stack.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
