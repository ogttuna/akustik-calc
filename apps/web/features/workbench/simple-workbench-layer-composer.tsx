"use client";

import type { FloorRole, MaterialCategory, MaterialDefinition } from "@dynecho/shared";
import { Plus } from "lucide-react";

import { formatDecimal } from "@/lib/format";

import { getMaterialCategoryLabel } from "./describe-assembly";
import { getCatalogDensity } from "./material-density";
import { getCatalogDynamicStiffness } from "./dynamic-stiffness";
import { getLayerThicknessGuidanceHint, getLayerThicknessSanityWarning } from "./input-sanity";
import type { StudyMode } from "./preset-definitions";
import type { NewLayerDraft } from "./simple-workbench-constants";
import { workbenchSectionCardClass, workbenchSectionMutedCardClass } from "./simple-workbench-layer-visuals";
import { DetailTag, GuidedFactChip, InlinePair } from "./simple-workbench-primitives";
import {
  buildMaterialFacts,
  formatDensityLabel,
  formatDynamicStiffnessLabel,
  getCustomMaterialCategoryLabel,
  getCustomMaterialNotePreview,
  getDensityInputWarning,
  getDynamicStiffnessInputWarning,
  getTextInputClassName,
  parsePositiveNumber,
  uniqueMaterialsById
} from "./simple-workbench-utils";
import { FLOOR_ROLE_LABELS } from "./workbench-data";
import {
  CUSTOM_MATERIAL_CATEGORY_OPTIONS,
  type CustomMaterialDraft,
  type CustomMaterialDraftErrors
} from "./workbench-materials";
import { WorkbenchMaterialPicker, type WorkbenchMaterialOptionGroup } from "./workbench-material-picker";

export function CustomMaterialComposer(props: {
  customMaterials: readonly MaterialDefinition[];
  draft: CustomMaterialDraft;
  errors: CustomMaterialDraftErrors;
  expanded: boolean;
  onCreate: () => void;
  onDraftChange: <Field extends keyof CustomMaterialDraft>(field: Field, value: CustomMaterialDraft[Field]) => void;
  onExpandedChange: (expanded: boolean) => void;
}) {
  const { customMaterials, draft, errors, expanded, onCreate, onDraftChange, onExpandedChange } = props;
  const canCreate =
    draft.name.trim().length > 0 &&
    draft.densityKgM3.trim().length > 0 &&
    Object.values(errors).every((value) => !value);
  const draftName = draft.name.trim() || "New local material";
  const draftCategoryLabel = getCustomMaterialCategoryLabel(draft.category);
  const draftDensityLabel = draft.densityKgM3.trim().length > 0 ? `${draft.densityKgM3.trim()} kg/m³` : "Pending";
  const draftDynamicLabel =
    draft.dynamicStiffnessMNm3.trim().length > 0 ? `${draft.dynamicStiffnessMNm3.trim()} MN/m³` : "Not listed";
  const draftNotePreview = draft.notes.trim().length > 0 ? draft.notes.trim() : null;

  return (
    <section className={`rounded border px-3 py-3 ${workbenchSectionCardClass("assembly")}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[0.84rem] font-semibold text-[color:var(--ink)]">Custom material library</div>
          <div className="mt-1 text-[0.72rem] text-[color:var(--ink-faint)]">{`${customMaterials.length} saved`}</div>
        </div>
        <button
          aria-expanded={expanded}
          className={`focus-ring inline-flex items-center justify-center rounded border px-3 py-2 text-sm font-semibold ${
            expanded
              ? "border-[color:var(--line)] bg-[color:var(--panel)] text-[color:var(--ink)]"
              : "border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)]"
          }`}
          onClick={() => onExpandedChange(!expanded)}
          type="button"
        >
          {expanded ? "Close custom material" : "Create custom material"}
        </button>
      </div>

      {customMaterials.length ? (
        <div className="mt-3 grid gap-2 xl:grid-cols-2">
          {customMaterials.map((material) => {
            const notePreview = getCustomMaterialNotePreview(material.notes);

            return (
              <article
                className={`grid gap-2 rounded border px-3 py-3 ${workbenchSectionMutedCardClass("assembly")}`}
                data-testid={`custom-material-card-${material.id}`}
                key={material.id}
              >
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-[color:var(--ink)]">{material.name}</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <DetailTag>Local</DetailTag>
                      <DetailTag>{getMaterialCategoryLabel(material)}</DetailTag>
                    </div>
                  </div>
                  {typeof material.impact?.dynamicStiffnessMNm3 === "number" ? (
                    <GuidedFactChip>{`${formatDecimal(material.impact.dynamicStiffnessMNm3)} MN/m³`}</GuidedFactChip>
                  ) : null}
                </div>
                <div className="text-[0.72rem] text-[color:var(--ink-faint)]">{`${formatDecimal(material.densityKgM3)} kg/m³`}</div>
                {notePreview ? (
                  <p className="line-clamp-2 text-[0.74rem] leading-5 text-[color:var(--ink-soft)]">{notePreview}</p>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <div className={`mt-3 rounded border px-3 py-3 text-[0.78rem] text-[color:var(--ink-soft)] ${workbenchSectionMutedCardClass("assembly")}`}>
          No local materials yet.
        </div>
      )}

      {expanded ? (
        <div className="mt-4 grid gap-3">
          <div
            className={`grid gap-2 rounded-md border px-3 py-3 ${workbenchSectionMutedCardClass("assembly")}`}
            data-testid="custom-material-preview"
          >
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Preview</div>
            <div className="grid gap-2 sm:grid-cols-2">
              <InlinePair label="Name" value={draftName} />
              <InlinePair label="Category" value={draftCategoryLabel} />
              <InlinePair label="Density" value={draftDensityLabel} />
              <InlinePair label="Dynamic stiffness" value={draftDynamicLabel} />
            </div>
            {draftNotePreview ? <p className="text-[0.76rem] leading-5 text-[color:var(--ink-soft)]">{draftNotePreview}</p> : null}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid min-w-0 gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Custom material name</span>
              <input
                aria-invalid={Boolean(errors.name)}
                className={getTextInputClassName(Boolean(errors.name))}
                onChange={(event) => onDraftChange("name", event.target.value)}
                placeholder="e.g. EPDM resilient mat"
                value={draft.name}
              />
              {errors.name ? <span className="text-[0.72rem] leading-5 text-[color:var(--warning-ink)]">{errors.name}</span> : null}
            </label>

            <label className="grid min-w-0 gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Category</span>
              <select
                className="focus-ring touch-target w-full min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-2.5"
                onChange={(event) => onDraftChange("category", event.target.value as MaterialCategory)}
                value={draft.category}
              >
                {CUSTOM_MATERIAL_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid min-w-0 gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Density</span>
              <input
                aria-invalid={Boolean(errors.densityKgM3)}
                className={getTextInputClassName(Boolean(errors.densityKgM3))}
                inputMode="decimal"
                onChange={(event) => onDraftChange("densityKgM3", event.target.value)}
                placeholder="kg/m³"
                value={draft.densityKgM3}
              />
              {errors.densityKgM3 ? (
                <span className="text-[0.72rem] leading-5 text-[color:var(--warning-ink)]">{errors.densityKgM3}</span>
              ) : (
                <span className="text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">Required for surface mass. Use `0` only for true gaps or support-only layers.</span>
              )}
            </label>

            <label className="grid min-w-0 gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Dynamic stiffness</span>
              <input
                aria-invalid={Boolean(errors.dynamicStiffnessMNm3)}
                className={getTextInputClassName(Boolean(errors.dynamicStiffnessMNm3))}
                inputMode="decimal"
                onChange={(event) => onDraftChange("dynamicStiffnessMNm3", event.target.value)}
                placeholder="MN/m³"
                value={draft.dynamicStiffnessMNm3}
              />
              {errors.dynamicStiffnessMNm3 ? (
                <span className="text-[0.72rem] leading-5 text-[color:var(--warning-ink)]">{errors.dynamicStiffnessMNm3}</span>
              ) : (
                <span className="text-[0.72rem] leading-5 text-[color:var(--ink-soft)]">Optional. Fill this when the product sheet publishes a resilient-layer stiffness.</span>
              )}
            </label>
          </div>

          <label className="grid min-w-0 gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Material note</span>
            <textarea
              className="focus-ring min-h-[5.5rem] rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-2.5 text-sm text-[color:var(--ink)]"
              onChange={(event) => onDraftChange("notes", event.target.value)}
              placeholder="Optional source note, product sheet reference, or consultant remark."
              value={draft.notes}
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <GuidedFactChip tone={errors.name || errors.densityKgM3 ? "warning" : "neutral"}>
                {canCreate ? "Ready to save" : "Missing required fields"}
              </GuidedFactChip>
              <GuidedFactChip>{`Library size after save: ${customMaterials.length + (canCreate ? 1 : 0)}`}</GuidedFactChip>
            </div>
            <button
              className="focus-ring inline-flex items-center justify-center gap-2 rounded bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!canCreate}
              onClick={onCreate}
              type="button"
            >
              <Plus className="h-4 w-4" />
              Save material
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function NewLayerComposer(props: {
  draft: NewLayerDraft;
  materials: readonly MaterialDefinition[];
  onDensityChange: (densityKgM3: string) => void;
  materialGroups: readonly WorkbenchMaterialOptionGroup[];
  onAdd: () => void;
  onDynamicStiffnessChange: (dynamicStiffnessMNm3: string) => void;
  onFloorRoleChange: (floorRole?: FloorRole) => void;
  onMaterialChange: (materialId: string) => void;
  onReplaceBase?: () => void;
  onThicknessChange: (thicknessMm: string) => void;
  replaceBaseAvailable?: boolean;
  studyMode: StudyMode;
}) {
  const {
    draft,
    materials: allMaterials,
    materialGroups,
    onAdd,
    onDensityChange,
    onDynamicStiffnessChange,
    onFloorRoleChange,
    onMaterialChange,
    onReplaceBase,
    onThicknessChange,
    replaceBaseAvailable = false,
    studyMode
  } = props;
  const materials = uniqueMaterialsById(materialGroups.flatMap((group) => group.materials));
  const material = materials.find((entry) => entry.id === draft.materialId) ?? allMaterials[0]!;
  const categoryLabel = getMaterialCategoryLabel(material);
  const densityLabel = formatDensityLabel(material, draft.densityKgM3);
  const surfaceMassLabel =
    buildMaterialFacts({
      densityOverride: draft.densityKgM3,
      dynamicStiffnessOverride: draft.dynamicStiffnessMNm3,
      material,
      thicknessMm: draft.thicknessMm
    }).find((fact) => fact.includes("kg/m²")) ?? "Pending thickness";
  const dynamicStiffnessLabel = formatDynamicStiffnessLabel(material, draft.dynamicStiffnessMNm3);
  const densityWarning = getDensityInputWarning(material, draft.densityKgM3);
  const dynamicStiffnessWarning = getDynamicStiffnessInputWarning(draft.dynamicStiffnessMNm3);
  const catalogDynamicStiffness = getCatalogDynamicStiffness(material);
  const catalogDensity = getCatalogDensity(material);
  const thicknessWarning = getLayerThicknessSanityWarning(
    {
      floorRole: draft.floorRole,
      materialId: draft.materialId,
      thicknessMm: draft.thicknessMm
    },
    0,
    allMaterials
  );
  const thicknessHint = getLayerThicknessGuidanceHint(
    {
      floorRole: draft.floorRole,
      materialId: draft.materialId
    },
    allMaterials
  );
  const canAdd = Boolean(parsePositiveNumber(draft.thicknessMm));

  return (
    <div className={`relative z-10 rounded border px-3 py-3 ${workbenchSectionCardClass("assembly")}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[0.84rem] font-semibold text-[color:var(--ink)]">Add the next layer here</div>
          <p className="mt-1 text-[0.76rem] leading-5 text-[color:var(--ink-soft)]">
            {replaceBaseAvailable && draft.floorRole === "base_structure"
              ? "Pick the material and thickness, then append it or replace the current base row cleanly."
              : "Pick the material and thickness, then append it to the stack."}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {replaceBaseAvailable && onReplaceBase ? (
            <button
              className="focus-ring inline-flex items-center justify-center rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!canAdd}
              onClick={onReplaceBase}
              type="button"
            >
              Replace base
            </button>
          ) : null}
          <button
            className="focus-ring inline-flex items-center justify-center gap-2 rounded bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!canAdd}
            onClick={onAdd}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add layer
          </button>
        </div>
      </div>

      <div className={`mt-3 grid min-w-0 gap-3 ${studyMode === "floor" ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        <WorkbenchMaterialPicker
          currentMaterial={material}
          groups={materialGroups}
          label="New layer material"
          onSelect={onMaterialChange}
        />

        <label className="grid min-w-0 gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">New layer thickness</span>
          <input
            aria-invalid={Boolean(thicknessWarning)}
            aria-label="New layer thickness"
            className={getTextInputClassName(Boolean(thicknessWarning))}
            inputMode="decimal"
            onChange={(event) => onThicknessChange(event.target.value)}
            placeholder="mm"
            value={draft.thicknessMm}
          />
        </label>

        <label className="grid min-w-0 gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">New layer density</span>
          <input
            aria-invalid={Boolean(densityWarning)}
            aria-label="New layer density"
            className={getTextInputClassName(Boolean(densityWarning))}
            inputMode="decimal"
            onChange={(event) => onDensityChange(event.target.value)}
            placeholder={typeof catalogDensity === "number" ? formatDecimal(catalogDensity) : "kg/m³"}
            value={draft.densityKgM3}
          />
        </label>

        {studyMode === "floor" ? (
          <label className="grid min-w-0 gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">New layer dynamic stiffness</span>
            <input
              aria-invalid={Boolean(dynamicStiffnessWarning)}
              aria-label="New layer dynamic stiffness"
              className={getTextInputClassName(Boolean(dynamicStiffnessWarning))}
              inputMode="decimal"
              onChange={(event) => onDynamicStiffnessChange(event.target.value)}
              placeholder={typeof catalogDynamicStiffness === "number" ? formatDecimal(catalogDynamicStiffness) : "MN/m³"}
              value={draft.dynamicStiffnessMNm3}
            />
          </label>
        ) : null}

        {studyMode === "floor" ? (
          <label className="grid min-w-0 gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">New layer role</span>
            <select
              aria-label="New layer role"
              className="focus-ring touch-target w-full min-w-0 rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-2.5"
              onChange={(event) => onFloorRoleChange(event.target.value ? (event.target.value as FloorRole) : undefined)}
              value={draft.floorRole ?? ""}
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

      <div className="mt-3 grid gap-2 sm:grid-cols-2 2xl:grid-cols-4">
        <InlinePair label="Category" value={categoryLabel} />
        <InlinePair label="Density" value={densityLabel} />
        <InlinePair label="Layer mass" value={surfaceMassLabel} />
        <InlinePair label="Dynamic stiffness" value={dynamicStiffnessLabel} />
      </div>

      {material.notes ? (
        <div className={`mt-3 rounded border px-3 py-2.5 text-[0.74rem] leading-5 text-[color:var(--ink-soft)] ${workbenchSectionMutedCardClass("assembly")}`}>
          <span className="font-semibold text-[color:var(--ink)]">Material note:</span> {material.notes}
        </div>
      ) : null}

      {thicknessHint || thicknessWarning || densityWarning || dynamicStiffnessWarning ? (
        <div className="mt-3 grid gap-1 text-[0.7rem] leading-5">
          {thicknessHint ? <div className="text-[color:var(--ink-soft)]">{thicknessHint}</div> : null}
          {thicknessWarning ? <div className="text-[color:var(--warning-ink)]">{thicknessWarning}</div> : null}
          {densityWarning ? <div className="text-[color:var(--warning-ink)]">{densityWarning}</div> : null}
          {dynamicStiffnessWarning ? <div className="text-[color:var(--warning-ink)]">{dynamicStiffnessWarning}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
