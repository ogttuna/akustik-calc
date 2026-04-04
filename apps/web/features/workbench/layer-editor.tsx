"use client";

import type { FloorRole, MaterialDefinition } from "@dynecho/shared";
import { ArrowDown, ArrowUp, GripVertical, Plus } from "lucide-react";
import { SurfacePanel } from "@dynecho/ui";

import { getMaterialCategoryLabel } from "./describe-assembly";
import { FieldUsageBoard } from "./field-usage-board";
import { FieldGuide } from "./field-guide";
import { prependRecommendedMaterialGroup } from "./material-picker-recommendations";
import { getCatalogDensity } from "./material-density";
import { parsePositiveWorkbenchNumber } from "./parse-number";
import type { StudyMode } from "./preset-definitions";
import { FLOOR_ROLE_LABELS } from "./workbench-data";
import { WorkbenchMaterialPicker, type WorkbenchMaterialOptionGroup } from "./workbench-material-picker";
import type { LayerDraft } from "./workbench-store";

function buildLayerEditorMaterialGroups(input: {
  floorRole?: FloorRole;
  materials: readonly MaterialDefinition[];
  selectedMaterialId: string;
  studyMode: StudyMode;
}): WorkbenchMaterialOptionGroup[] {
  const grouped = new Map<string, MaterialDefinition[]>();
  const categoryOrder = {
    finish: 0,
    mass: 1,
    insulation: 2,
    support: 3,
    gap: 4
  } as const;

  for (const material of input.materials) {
    const label = getMaterialCategoryLabel(material);
    const bucket = grouped.get(label);

    if (bucket) {
      bucket.push(material);
    } else {
      grouped.set(label, [material]);
    }
  }

  const groups = Array.from(grouped.entries())
    .sort(([leftLabel, leftMaterials], [rightLabel, rightMaterials]) => {
      const leftCategory = leftMaterials[0]?.category ?? "mass";
      const rightCategory = rightMaterials[0]?.category ?? "mass";
      const leftOrder = categoryOrder[leftCategory] ?? 99;
      const rightOrder = categoryOrder[rightCategory] ?? 99;

      return leftOrder - rightOrder || leftLabel.localeCompare(rightLabel, "en");
    })
    .map(([label, groupMaterials]) => ({
      label,
      materials: [...groupMaterials].sort((left, right) => left.name.localeCompare(right.name, "en"))
    }));

  return prependRecommendedMaterialGroup({
    floorRole: input.floorRole,
    groups,
    materials: input.materials,
    selectedMaterialId: input.selectedMaterialId,
    studyMode: input.studyMode
  });
}

type LayerEditorProps = {
  materials: readonly MaterialDefinition[];
  studyMode: StudyMode;
  rows: readonly LayerDraft[];
  onAddRow: () => void;
  onDensityChange: (id: string, densityKgM3: string) => void;
  onFloorRoleChange: (id: string, floorRole?: FloorRole) => void;
  onMaterialChange: (id: string, materialId: string) => void;
  onMoveRow: (id: string, direction: "up" | "down") => void;
  onRemoveRow: (id: string) => void;
  onThicknessChange: (id: string, thicknessMm: string) => void;
};

export function LayerEditor({
  materials,
  studyMode,
  rows,
  onAddRow,
  onDensityChange,
  onFloorRoleChange,
  onMaterialChange,
  onMoveRow,
  onRemoveRow,
  onThicknessChange
}: LayerEditorProps) {
  const rowLabel = rows.length === 1 ? "layer" : "layers";
  const validThicknessCount = rows.filter((row) => {
    const thickness = parsePositiveWorkbenchNumber(row.thicknessMm);
    return typeof thickness === "number";
  }).length;
  const assignedFloorRoleCount = rows.filter((row) => typeof row.floorRole === "string").length;
  const usageItems = [
    {
      guide:
        rows.length > 0
          ? {
              currentUse: `${rows.length} ${rowLabel} currently feed material identity into the visible stack, surface-mass readout, and curated family matching.`,
              kind: "active" as const,
              meaning: "Material selects the physical layer class and the catalog signals that downstream exact lanes can match."
            }
          : {
              currentUse: "No layers are present yet, so material identity has not entered the solver.",
              kind: "conditional" as const,
              meaning: "Add at least one material layer before the assembly can form a meaningful topology."
            },
      id: "material_identity",
      label: "Material identity"
    },
    {
      guide:
        rows.length === 0
          ? {
              currentUse: "Thickness is idle until at least one layer is added.",
              kind: "conditional" as const,
              meaning: "Thickness drives surface mass, total build-up depth, and exact-family fit checks."
            }
          : validThicknessCount === rows.length
            ? {
                currentUse: `Thickness is active on all ${rows.length} ${rowLabel} and is feeding mass-based screening plus exact-family fit checks.`,
                kind: "active" as const,
                meaning: "Thickness drives surface mass, total build-up depth, and exact-family fit checks."
              }
            : {
                currentUse: `${validThicknessCount} of ${rows.length} ${rowLabel} currently carry usable thickness. Incomplete rows weaken mass-based screening and floor-family fit.`,
                kind: "conditional" as const,
                meaning: "Thickness drives surface mass, total build-up depth, and exact-family fit checks."
              },
      id: "thickness_completeness",
      label: "Thickness completeness"
    },
    {
      guide:
        studyMode !== "floor"
          ? {
              currentUse: "Wall mode keeps floor-role semantics parked.",
              kind: "ignored" as const,
              meaning: "Floor role only matters when the impact lane needs to distinguish structure, resilient layer, screed, finish, and ceiling treatment."
            }
          : rows.length === 0
            ? {
                currentUse: "No floor-role map exists yet because the floor stack is still empty.",
                kind: "conditional" as const,
                meaning: "Floor role tells the impact engine which layer acts as structure, resilient layer, screed, fill, covering, or ceiling."
              }
            : assignedFloorRoleCount === rows.length
              ? {
                  currentUse: `All ${rows.length} ${rowLabel} already carry floor roles, so exact family and product lanes can read the current topology cleanly.`,
                  kind: "active" as const,
                  meaning: "Floor role tells the impact engine which layer acts as structure, resilient layer, screed, fill, covering, or ceiling."
                }
              : {
                  currentUse: `${assignedFloorRoleCount} of ${rows.length} ${rowLabel} currently carry floor roles. Screening can still run, but exact family and product lanes may stay partial.`,
                  kind: "conditional" as const,
                  meaning: "Floor role tells the impact engine which layer acts as structure, resilient layer, screed, fill, covering, or ceiling."
                },
      id: "floor_role_coverage",
      label: "Floor-role coverage"
    }
  ] as const;

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="eyebrow">Assembly draft</div>
          <h2 className="mt-1 font-display text-3xl tracking-[-0.04em]">Layer editor</h2>
          {studyMode === "floor" ? (
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
              Floor roles make the impact lane explicit. Tag base, resilient, screed, and covering layers instead of
              relying only on row order.
          </p>
          ) : null}
        </div>
        <button
          className="focus-ring ink-button-solid touch-target inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
          onClick={onAddRow}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Add layer
        </button>
      </div>
      <div className="mt-5">
        <FieldUsageBoard
          description="The row-level help stays on each field. This board summarizes whether the current stack is structurally legible enough for the dynamic airborne lane and the floor-side family matcher before you start reading result panels."
          items={usageItems}
          title="How ready the current layer stack is for the solver"
        />
      </div>
      <div className="mt-6 grid gap-3">
        {rows.map((row, index) => {
          const material = materials.find((entry) => entry.id === row.materialId) ?? materials[0]!;
          const materialName = material.name;
          const materialGroups = buildLayerEditorMaterialGroups({
            floorRole: row.floorRole,
            materials,
            selectedMaterialId: row.materialId,
            studyMode
          });

          return (
            <article className="pointer-card rounded-lg border hairline p-4" key={row.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)]">
                    <GripVertical className="h-4 w-4 text-[color:var(--ink-faint)]" />
                  </div>
                  <div>
                    <div className="eyebrow">Layer {String(index + 1).padStart(2, "0")}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[color:var(--ink-soft)]">
                      <span>{getMaterialCategoryLabel(material)}</span>
                      {studyMode === "floor" && row.floorRole ? (
                        <span className="rounded-full border hairline px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                          {FLOOR_ROLE_LABELS[row.floorRole]}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    aria-label={`Move ${materialName} layer up`}
                    className="focus-ring touch-target inline-flex items-center justify-center rounded-full border hairline px-3 py-2 text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
                    onClick={() => onMoveRow(row.id, "up")}
                    type="button"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    aria-label={`Move ${materialName} layer down`}
                    className="focus-ring touch-target inline-flex items-center justify-center rounded-full border hairline px-3 py-2 text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
                    onClick={() => onMoveRow(row.id, "down")}
                    type="button"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    aria-label={`Remove ${materialName} layer`}
                    className="focus-ring touch-target underline-muted rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] underline underline-offset-4"
                    onClick={() => onRemoveRow(row.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div
                className={`mt-4 grid gap-3 ${
                  studyMode === "floor" ? "md:grid-cols-[1.1fr_0.5fr_0.55fr_0.8fr]" : "md:grid-cols-[1.2fr_0.6fr_0.65fr]"
                }`}
              >
                <FieldGuide
                  guide={{
                    currentUse:
                      "Material is active immediately. It drives category, density-derived mass, product matching, and curated family fitting.",
                    kind: "active",
                    meaning: "Material selects the physical layer type and the catalog signals that downstream exact lanes can match."
                  }}
                  hint="Material identity is always active."
                  inputId={`layer-material-${row.id}`}
                  label="Material"
                >
                  <WorkbenchMaterialPicker
                    buttonClassName="hairline bg-[color:var(--paper)]"
                    currentMaterial={material}
                    groups={materialGroups}
                    id={`layer-material-${row.id}`}
                    onSelect={(materialId) => onMaterialChange(row.id, materialId)}
                  />
                </FieldGuide>
                <FieldGuide
                  guide={{
                    currentUse:
                      row.thicknessMm.trim().length > 0
                        ? "Thickness is active and feeds surface-mass screening plus exact-family fit checks."
                        : "Thickness is missing, so this layer cannot contribute cleanly to mass-based screening.",
                    kind: row.thicknessMm.trim().length > 0 ? "active" : "conditional",
                    meaning: "Thickness controls the layer's surface-mass contribution and helps curated exact lanes identify the topology."
                  }}
                  hint="Mass-based screening and family fitting both depend on this field."
                  inputId={`layer-thickness-${row.id}`}
                  label="Thickness (mm)"
                >
                  <input
                    className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
                    id={`layer-thickness-${row.id}`}
                    inputMode="decimal"
                    onChange={(event) => onThicknessChange(row.id, event.target.value)}
                    value={row.thicknessMm}
                  />
                </FieldGuide>
                <FieldGuide
                  guide={{
                    currentUse:
                      row.densityKgM3?.trim().length
                        ? "Manual density override is active for this stack row. It changes surface mass and family fit without touching the catalog material."
                        : "Catalog density is active. Leave this blank unless the project uses a justified alternate density for this layer.",
                    kind: row.densityKgM3?.trim().length ? "active" : "conditional",
                    meaning: "Density drives surface mass and can shift which exact or bounded family the live stack belongs to."
                  }}
                  hint="This override is row-local. It does not rewrite the shared material catalog."
                  inputId={`layer-density-${row.id}`}
                  label="Density (kg/m³)"
                >
                  <input
                    className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
                    id={`layer-density-${row.id}`}
                    inputMode="decimal"
                    onChange={(event) => onDensityChange(row.id, event.target.value)}
                    placeholder={
                      typeof getCatalogDensity(material) === "number" ? String(getCatalogDensity(material)) : "Catalog density"
                    }
                    value={row.densityKgM3 ?? ""}
                  />
                </FieldGuide>
                {studyMode === "floor" ? (
                  <FieldGuide
                    guide={{
                      currentUse: row.floorRole
                        ? "This role is active in exact floor-family matching, official product rows, and scoped impact logic."
                        : "No floor role is assigned yet. This row still stays in the visible stack, so remove it for a true replacement. Screening can still run, but exact family and product lanes may stay inactive.",
                      kind: row.floorRole ? "active" : "conditional",
                      meaning: "Floor role tells the impact engine whether a layer acts as structure, resilient layer, screed, fill, covering, or ceiling."
                    }}
                    hint="Floor studies need roles for exact family and product lanes."
                    inputId={`layer-floor-role-${row.id}`}
                    label="Floor role"
                  >
                    <select
                      className="focus-ring touch-target rounded-2xl border hairline bg-[color:var(--paper)] px-4 py-3"
                      id={`layer-floor-role-${row.id}`}
                      onChange={(event) =>
                        onFloorRoleChange(row.id, event.target.value ? (event.target.value as FloorRole) : undefined)
                      }
                      value={row.floorRole ?? ""}
                    >
                      <option value="">Unassigned</option>
                      {Object.entries(FLOOR_ROLE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </FieldGuide>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </SurfacePanel>
  );
}
