"use client";

import type {
  AcousticAbsorberClass,
  AcousticMaterialBehavior,
  AcousticMaterialPropertySourceStatus,
  MaterialCategory,
  MaterialDefinition
} from "@dynecho/shared";
import { Copy, Palette, Plus, RotateCcw, Save, Search, Trash2, X } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

import {
  buildMaterialDefinitionFromDraft,
  buildMaterialVisualOverride,
  countMaterialUsage,
  createDefaultMaterialVisualDraft,
  createEmptyMaterialEditorDraft,
  createMaterialEditorDraftFromMaterial,
  createMaterialVisualDraft,
  createSeedCopyDraft,
  getMaterialVisualReadabilityWarning,
  isBuiltInMaterial,
  isValidMaterialVisualDraft,
  type MaterialEditorDraft,
  type MaterialVisualDraft,
  type MaterialVisualOverride,
  validateMaterialEditorDraft
} from "./material-editor-state";
import type {
  MaterialRouteInputEffectiveness,
  MaterialRouteInputEffectivenessMap
} from "./material-route-input-effectiveness";

type MaterialEditorLayer = {
  id: string;
  label: string;
  materialId: string;
};

type MaterialEditorPanelProps = {
  layers: readonly MaterialEditorLayer[];
  materials: readonly MaterialDefinition[];
  onClose?: () => void;
  onDeleteMaterial: (materialId: string) => void;
  onReplaceMaterialInLayers: (fromMaterialId: string, toMaterialId: string) => void;
  onResetVisualOverride: (materialId: string) => void;
  onSaveMaterial: (material: MaterialDefinition) => void;
  onSaveVisualOverride: (override: MaterialVisualOverride) => void;
  onSelectMaterial: (materialId: string | null) => void;
  routeInputEffectiveness?: MaterialRouteInputEffectivenessMap;
  restoreWarning?: string | null;
  selectedMaterialId: string | null;
  visualOverrides: readonly MaterialVisualOverride[];
};

const CATEGORY_OPTIONS: readonly { label: string; value: MaterialCategory }[] = [
  { label: "Mass", value: "mass" },
  { label: "Finish", value: "finish" },
  { label: "Insulation", value: "insulation" },
  { label: "Gap", value: "gap" },
  { label: "Support", value: "support" }
];

const BEHAVIOR_OPTIONS: readonly { label: string; value: AcousticMaterialBehavior }[] = [
  { label: "Rigid mass", value: "rigid_mass" },
  { label: "Panel leaf", value: "panel_leaf" },
  { label: "Limp membrane", value: "limp_mass_membrane" },
  { label: "Porous absorber", value: "porous_absorber" },
  { label: "Air cavity", value: "air_cavity" },
  { label: "Resilient layer", value: "resilient_layer" },
  { label: "Structural bridge", value: "structural_bridge" },
  { label: "Mass timber", value: "mass_timber" }
];

const ABSORBER_OPTIONS: readonly { label: string; value: AcousticAbsorberClass }[] = [
  { label: "Unknown", value: "unknown" },
  { label: "None", value: "none" },
  { label: "Porous absorber", value: "porous_absorptive" }
];

const SOURCE_STATUS_OPTIONS: readonly { label: string; value: AcousticMaterialPropertySourceStatus }[] = [
  { label: "User supplied", value: "user_supplied" },
  { label: "Catalog nominal", value: "catalog_nominal" },
  { label: "Engineering default", value: "engineering_default" },
  { label: "Source owned", value: "source_owned" },
  { label: "Unknown", value: "unknown" }
];

type EditorMode = "existing" | "new" | "seed-copy";
type EditorTab = "appearance" | "properties";
type CatalogScope = "all" | "built_in" | "project";

const FIELD_DESCRIPTIONS = {
  absorberClass: "Identifies whether the cavity material should be treated as porous absorption in wall routes.",
  behavior: "Tells the acoustic solver how to interpret this material: panel leaf, porous absorber, resilient layer, mass, or support.",
  category: "Groups the material for browsing, visual defaults, and schedule labels.",
  densityKgM3: "Material density, rho, in kg/m3. Combined with layer thickness to estimate surface mass.",
  dynamicStiffnessMNm3: "Elastic stiffness of a resilient layer in MN/m3. Used by impact and floating floor routes when relevant.",
  flowResistivityPaSM2: "Air-flow resistance of a porous absorber in Pa.s/m2. Missing user-supplied values can keep absorber routes at needs_input.",
  lossFactor: "Internal damping ratio from 0 to 1. Higher values indicate more panel or mass damping.",
  name: "Project display name shown in layer pickers, schedules, snapshots, and reports.",
  notes: "Free-form product/source notes. Saved with the material and not used directly by the solver.",
  poissonRatio: "Elastic transverse strain ratio. Typical solid material values are between 0 and 0.5.",
  porosity: "Open void fraction from 0 to 1. Useful when porous material characterization is available.",
  propertySourceStatus: "Records whether the values are user supplied, catalog nominal, engineering default, source owned, or unknown.",
  tags: "Comma-separated search keywords. They help users find the material and do not affect calculations.",
  visualFill: "Main front-face color used by the layer illustration.",
  visualPattern: "Texture, hatch, or fiber pattern color used by the layer illustration.",
  visualSide: "Side-face color used to give the layer illustration depth.",
  visualStroke: "Outline and seam color used by the layer illustration.",
  youngModulusPa: "Elastic modulus in Pa. Describes stiffness for panel, mass, and timber-like materials."
} as const;

const ROUTE_INPUT_EFFECTIVENESS_LABELS: Record<MaterialRouteInputEffectiveness["status"], string> = {
  inactive: "Inactive",
  needed: "Needed",
  used: "Used"
};

function MaterialRouteInputEffectivenessBadge(props: { effectiveness: MaterialRouteInputEffectiveness }) {
  const badgeClassName = [
    "material-route-input-effectiveness",
    "ui-badge",
    "ui-badge-compact",
    props.effectiveness.status === "used" ? "ui-badge-success" : props.effectiveness.status === "needed" ? "ui-badge-warning" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={badgeClassName} title={props.effectiveness.title}>
      {ROUTE_INPUT_EFFECTIVENESS_LABELS[props.effectiveness.status]}
    </span>
  );
}

function MaterialFieldLabel(props: {
  effectiveness?: MaterialRouteInputEffectiveness;
  htmlFor: string;
  label: string;
}) {
  return (
    <label className="material-editor-field-label" htmlFor={props.htmlFor}>
      <span>{props.label}</span>
      {props.effectiveness ? <MaterialRouteInputEffectivenessBadge effectiveness={props.effectiveness} /> : null}
    </label>
  );
}

function MaterialTextField(props: {
  description?: string;
  disabled?: boolean;
  error?: string;
  effectiveness?: MaterialRouteInputEffectiveness;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
  warning?: string;
}) {
  const inputId = useId();
  const descriptionId = props.description ? `${inputId}-description` : undefined;

  return (
    <div className="material-editor-field">
      <MaterialFieldLabel effectiveness={props.effectiveness} htmlFor={inputId} label={props.label} />
      {props.description ? <small className="material-editor-description" id={descriptionId}>{props.description}</small> : null}
      <input
        aria-describedby={descriptionId}
        className="focus-ring ui-field"
        disabled={props.disabled}
        id={inputId}
        onChange={(event) => props.onChange(event.target.value)}
        placeholder={props.placeholder}
        value={props.value}
      />
      {props.error ? <small className="material-editor-error">{props.error}</small> : null}
      {!props.error && props.warning ? <small className="material-editor-warning">{props.warning}</small> : null}
    </div>
  );
}

function MaterialSelectField<TValue extends string>(props: {
  description?: string;
  disabled?: boolean;
  effectiveness?: MaterialRouteInputEffectiveness;
  label: string;
  onChange: (value: TValue) => void;
  options: readonly { label: string; value: TValue }[];
  value: TValue;
}) {
  const selectId = useId();
  const descriptionId = props.description ? `${selectId}-description` : undefined;

  return (
    <div className="material-editor-field">
      <MaterialFieldLabel effectiveness={props.effectiveness} htmlFor={selectId} label={props.label} />
      {props.description ? <small className="material-editor-description" id={descriptionId}>{props.description}</small> : null}
      <select
        aria-describedby={descriptionId}
        className="focus-ring ui-field"
        disabled={props.disabled}
        id={selectId}
        onChange={(event) => props.onChange(event.target.value as TValue)}
        value={props.value}
      >
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function MaterialColorField(props: {
  description?: string;
  disabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const inputId = useId();
  const descriptionId = props.description ? `${inputId}-description` : undefined;

  return (
    <div className="material-editor-color-field">
      <label htmlFor={inputId}>{props.label}</label>
      <input
        aria-describedby={descriptionId}
        disabled={props.disabled}
        id={inputId}
        onChange={(event) => props.onChange(event.target.value)}
        type="color"
        value={props.value}
      />
      <code>{props.value}</code>
      {props.description ? <small className="material-editor-description" id={descriptionId}>{props.description}</small> : null}
    </div>
  );
}

function MaterialTextAreaField(props: {
  description?: string;
  disabled?: boolean;
  effectiveness?: MaterialRouteInputEffectiveness;
  label: string;
  onChange: (value: string) => void;
  rows?: number;
  value: string;
}) {
  const textareaId = useId();
  const descriptionId = props.description ? `${textareaId}-description` : undefined;

  return (
    <div className="material-editor-field">
      <MaterialFieldLabel effectiveness={props.effectiveness} htmlFor={textareaId} label={props.label} />
      {props.description ? <small className="material-editor-description" id={descriptionId}>{props.description}</small> : null}
      <textarea
        aria-describedby={descriptionId}
        className="focus-ring ui-field"
        disabled={props.disabled}
        id={textareaId}
        onChange={(event) => props.onChange(event.target.value)}
        rows={props.rows ?? 3}
        value={props.value}
      />
    </div>
  );
}

function getModeLabel(mode: EditorMode, selectedMaterial: MaterialDefinition | null): string {
  if (mode === "new") return "New project material";
  if (mode === "seed-copy") return "Project copy draft";
  if (!selectedMaterial) return "No material selected";
  return isBuiltInMaterial(selectedMaterial) ? "Built-in material" : "Project material";
}

const CATALOG_SCOPE_OPTIONS: readonly { label: string; value: CatalogScope }[] = [
  { label: "All", value: "all" },
  { label: "Project", value: "project" },
  { label: "Built-in", value: "built_in" }
];

export function MaterialEditorPanel({
  layers,
  materials,
  onClose,
  onDeleteMaterial,
  onReplaceMaterialInLayers,
  onResetVisualOverride,
  onSaveMaterial,
  onSaveVisualOverride,
  onSelectMaterial,
  routeInputEffectiveness = {},
  restoreWarning = null,
  selectedMaterialId,
  visualOverrides
}: MaterialEditorPanelProps) {
  const initialSelectedMaterial = materials.find((material) => material.id === selectedMaterialId) ?? null;
  const initialSelectedOverride = visualOverrides.find((override) => override.materialId === selectedMaterialId);
  const [mode, setMode] = useState<EditorMode>("existing");
  const [activeTab, setActiveTab] = useState<EditorTab>("properties");
  const [search, setSearch] = useState("");
  const [catalogScope, setCatalogScope] = useState<CatalogScope>("all");
  const [categoryFilter, setCategoryFilter] = useState<MaterialCategory | "all">("all");
  const [draft, setDraft] = useState<MaterialEditorDraft>(() =>
    initialSelectedMaterial ? createMaterialEditorDraftFromMaterial(initialSelectedMaterial) : createEmptyMaterialEditorDraft()
  );
  const [visualDraft, setVisualDraft] = useState<MaterialVisualDraft>(() =>
    createMaterialVisualDraft(initialSelectedOverride, initialSelectedMaterial)
  );
  const [replaceSourceLayers, setReplaceSourceLayers] = useState(true);

  const selectedMaterial = initialSelectedMaterial;
  const selectedOverride = initialSelectedOverride;
  const selectedVisualDefaults = useMemo(() => createDefaultMaterialVisualDraft(selectedMaterial), [selectedMaterial]);
  const visualReadabilityWarning = useMemo(() => getMaterialVisualReadabilityWarning(visualDraft), [visualDraft]);
  const selectedUsageCount = selectedMaterial ? countMaterialUsage(layers, selectedMaterial.id) : 0;
  const isExistingBuiltIn = mode === "existing" && selectedMaterial ? isBuiltInMaterial(selectedMaterial) : false;
  const canEditProperties = mode !== "existing" || !isExistingBuiltIn;
  const validation = useMemo(
    () => validateMaterialEditorDraft(draft, materials, mode === "existing" && selectedMaterial ? selectedMaterial.id : null),
    [draft, materials, mode, selectedMaterial]
  );
  const hasErrors = Object.keys(validation.errors).length > 0;
  const shouldShowPorousAbsorberFields =
    draft.behavior === "porous_absorber" ||
    draft.absorberClass === "porous_absorptive" ||
    Boolean(draft.flowResistivityPaSM2.trim()) ||
    Boolean(routeInputEffectiveness.flowResistivityPaSM2);
  const shouldShowDynamicStiffnessField =
    draft.behavior === "resilient_layer" ||
    Boolean(draft.dynamicStiffnessMNm3.trim()) ||
    Boolean(routeInputEffectiveness.dynamicStiffnessMNm3);
  const filteredMaterials = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return materials.filter((material) => {
      if (catalogScope === "project" && isBuiltInMaterial(material)) {
        return false;
      }

      if (catalogScope === "built_in" && !isBuiltInMaterial(material)) {
        return false;
      }

      if (categoryFilter !== "all" && material.category !== categoryFilter) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      const haystack = [material.id, material.name, material.category, ...material.tags].join(" ").toLowerCase();
      return haystack.includes(normalized);
    });
  }, [catalogScope, categoryFilter, materials, search]);

  useEffect(() => {
    if (!selectedMaterial || mode !== "existing") {
      return;
    }

    setDraft(createMaterialEditorDraftFromMaterial(selectedMaterial));
    setVisualDraft(createMaterialVisualDraft(selectedOverride, selectedMaterial));
  }, [mode, selectedMaterial, selectedOverride]);

  function updateDraft(patch: Partial<MaterialEditorDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function updateVisualDraft(patch: Partial<MaterialVisualDraft>) {
    setVisualDraft((current) => ({ ...current, ...patch }));
  }

  function selectExistingMaterial(materialId: string) {
    setMode("existing");
    onSelectMaterial(materialId);
  }

  function startNewMaterial() {
    setMode("new");
    setActiveTab("properties");
    setDraft(createEmptyMaterialEditorDraft());
    onSelectMaterial(null);
  }

  function startSeedCopy() {
    if (!selectedMaterial) {
      return;
    }

    setMode("seed-copy");
    setActiveTab("properties");
    setDraft(createSeedCopyDraft(selectedMaterial, materials));
    setReplaceSourceLayers(selectedUsageCount > 0);
  }

  function saveMaterial() {
    if (!canEditProperties || hasErrors) {
      return;
    }

    const currentMaterialId = mode === "existing" && selectedMaterial ? selectedMaterial.id : null;
    const material = buildMaterialDefinitionFromDraft({
      currentMaterialId,
      draft,
      existingMaterials: materials
    });
    const sourceMaterialId = mode === "seed-copy" && selectedMaterial ? selectedMaterial.id : null;

    onSaveMaterial(material);
    if (sourceMaterialId && replaceSourceLayers) {
      onReplaceMaterialInLayers(sourceMaterialId, material.id);
    }
    setMode("existing");
    onSelectMaterial(material.id);
  }

  function saveVisualOverride() {
    if (!selectedMaterial || !isValidMaterialVisualDraft(visualDraft)) {
      return;
    }

    const override = buildMaterialVisualOverride(selectedMaterial.id, visualDraft, new Date().toISOString(), selectedVisualDefaults);
    if (override) {
      onSaveVisualOverride(override);
      return;
    }

    onResetVisualOverride(selectedMaterial.id);
  }

  function deleteMaterial() {
    if (!selectedMaterial || isBuiltInMaterial(selectedMaterial) || selectedUsageCount > 0) {
      return;
    }

    onDeleteMaterial(selectedMaterial.id);
    onSelectMaterial(materials.find((material) => material.id !== selectedMaterial.id)?.id ?? null);
  }

  return (
    <section className="calc-section material-editor-panel" aria-label="Material editor">
      <div className="material-editor-head">
        <div>
          <div className="eyebrow">Material editor</div>
          <h2>{getModeLabel(mode, selectedMaterial)}</h2>
        </div>
        {onClose ? (
          <button aria-label="Close material editor" className="focus-ring ui-icon-button" onClick={onClose} type="button">
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {restoreWarning ? (
        <div className="material-editor-readonly material-editor-restore-warning">
          <strong>Material state restored</strong>
          <span>{restoreWarning}</span>
        </div>
      ) : null}

      <div className="material-editor-layout" data-detail-first={canEditProperties ? "true" : "false"}>
        <div className="material-editor-browser">
          <div className="material-editor-browser-head">
            <div>
              <span>Catalog</span>
              <strong>{filteredMaterials.length} materials</strong>
            </div>
            <button className="focus-ring ui-button ui-button-ghost material-editor-new-button" onClick={startNewMaterial} type="button">
              <Plus className="h-4 w-4" />
              New material
            </button>
          </div>
          <div className="calc-search-input">
            <Search className="h-4 w-4" />
            <input onChange={(event) => setSearch(event.target.value)} placeholder="Search materials" value={search} />
          </div>
          <div className="material-editor-filter-row">
            <div className="material-editor-scope-tabs" aria-label="Material source filter">
              {CATALOG_SCOPE_OPTIONS.map((option) => (
                <button
                  aria-pressed={catalogScope === option.value}
                  className="focus-ring"
                  key={option.value}
                  onClick={() => setCatalogScope(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <select
              aria-label="Material category filter"
              className="focus-ring ui-field material-editor-category-filter"
              onChange={(event) => setCategoryFilter(event.target.value as MaterialCategory | "all")}
              value={categoryFilter}
            >
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="material-editor-list" role="listbox">
            {filteredMaterials.slice(0, 80).map((material) => {
              const usageCount = countMaterialUsage(layers, material.id);
              const builtIn = isBuiltInMaterial(material);

              return (
                <button
                  aria-selected={mode === "existing" && selectedMaterial?.id === material.id}
                  className="focus-ring material-editor-list-row"
                  key={material.id}
                  onClick={() => selectExistingMaterial(material.id)}
                  role="option"
                  type="button"
                >
                  <span>
                    <strong>{material.name}</strong>
                    <small>{material.category} / {material.densityKgM3} kg/m3</small>
                  </span>
                  <em>{builtIn ? "Built-in" : "Project"}{usageCount ? ` / ${usageCount} used` : ""}</em>
                </button>
              );
            })}
          </div>
        </div>

        <div className="material-editor-detail">
          <div className="material-editor-tabs" role="tablist">
            <button aria-selected={activeTab === "properties"} className="focus-ring" onClick={() => setActiveTab("properties")} type="button">
              Properties
            </button>
            <button aria-selected={activeTab === "appearance"} className="focus-ring" onClick={() => setActiveTab("appearance")} type="button">
              <Palette className="h-4 w-4" />
              Appearance
            </button>
          </div>

          {activeTab === "properties" ? (
            <div className="material-editor-form">
              {isExistingBuiltIn ? (
                <div className="material-editor-readonly">
                  <strong>Built-in catalog material</strong>
                  <span>Create a project copy before changing calculation properties.</span>
                </div>
              ) : null}

              <div className="material-editor-field-grid">
                <MaterialTextField
                  description={FIELD_DESCRIPTIONS.name}
                  disabled={!canEditProperties}
                  error={validation.errors.name}
                  label="Name"
                  onChange={(value) => updateDraft({ name: value })}
                  value={draft.name}
                />
                <MaterialSelectField
                  description={FIELD_DESCRIPTIONS.category}
                  disabled={!canEditProperties}
                  effectiveness={routeInputEffectiveness.category}
                  label="Category"
                  onChange={(value) => updateDraft({ category: value })}
                  options={CATEGORY_OPTIONS}
                  value={draft.category}
                />
                <MaterialSelectField
                  description={FIELD_DESCRIPTIONS.behavior}
                  disabled={!canEditProperties}
                  effectiveness={routeInputEffectiveness.behavior}
                  label="Behavior"
                  onChange={(value) => updateDraft({ behavior: value })}
                  options={BEHAVIOR_OPTIONS}
                  value={draft.behavior}
                />
                <MaterialTextField
                  description={FIELD_DESCRIPTIONS.densityKgM3}
                  disabled={!canEditProperties}
                  error={validation.errors.densityKgM3}
                  effectiveness={routeInputEffectiveness.densityKgM3}
                  label="Density"
                  onChange={(value) => updateDraft({ densityKgM3: value })}
                  placeholder="kg/m3"
                  value={draft.densityKgM3}
                />
              </div>

              <div className="material-editor-field-grid">
                <MaterialSelectField
                  description={FIELD_DESCRIPTIONS.propertySourceStatus}
                  disabled={!canEditProperties}
                  effectiveness={routeInputEffectiveness.propertySourceStatus}
                  label="Source"
                  onChange={(value) => updateDraft({ propertySourceStatus: value })}
                  options={SOURCE_STATUS_OPTIONS}
                  value={draft.propertySourceStatus}
                />
                <MaterialTextField
                  description={FIELD_DESCRIPTIONS.tags}
                  disabled={!canEditProperties}
                  effectiveness={routeInputEffectiveness.tags}
                  label="Tags"
                  onChange={(value) => updateDraft({ tags: value })}
                  placeholder="comma separated"
                  value={draft.tags}
                />
              </div>

              {shouldShowPorousAbsorberFields ? (
                <div className="material-editor-field-grid">
                  <MaterialSelectField
                    description={FIELD_DESCRIPTIONS.absorberClass}
                    disabled={!canEditProperties}
                    effectiveness={routeInputEffectiveness.absorberClass}
                    label="Absorber class"
                    onChange={(value) => updateDraft({ absorberClass: value })}
                    options={ABSORBER_OPTIONS}
                    value={draft.absorberClass}
                  />
                  <MaterialTextField
                    description={FIELD_DESCRIPTIONS.flowResistivityPaSM2}
                    disabled={!canEditProperties}
                    error={validation.errors.flowResistivityPaSM2}
                    effectiveness={routeInputEffectiveness.flowResistivityPaSM2}
                    label="Flow resistivity"
                    onChange={(value) => updateDraft({ flowResistivityPaSM2: value })}
                    placeholder="Pa.s/m2"
                    value={draft.flowResistivityPaSM2}
                    warning={validation.warnings.flowResistivityPaSM2}
                  />
                  <MaterialTextField
                    description={FIELD_DESCRIPTIONS.porosity}
                    disabled={!canEditProperties}
                    error={validation.errors.porosity}
                    effectiveness={routeInputEffectiveness.porosity}
                    label="Porosity"
                    onChange={(value) => updateDraft({ porosity: value })}
                    placeholder="0-1"
                    value={draft.porosity}
                  />
                </div>
              ) : null}

              {shouldShowDynamicStiffnessField ? (
                <div className="material-editor-field-grid">
                  <MaterialTextField
                    description={FIELD_DESCRIPTIONS.dynamicStiffnessMNm3}
                    disabled={!canEditProperties}
                    error={validation.errors.dynamicStiffnessMNm3}
                    effectiveness={routeInputEffectiveness.dynamicStiffnessMNm3}
                    label="Dynamic stiffness"
                    onChange={(value) => updateDraft({ dynamicStiffnessMNm3: value })}
                    placeholder="MN/m3"
                    value={draft.dynamicStiffnessMNm3}
                    warning={validation.warnings.dynamicStiffnessMNm3}
                  />
                </div>
              ) : null}

              {["rigid_mass", "panel_leaf", "limp_mass_membrane", "mass_timber"].includes(draft.behavior) ? (
                <div className="material-editor-field-grid">
                  <MaterialTextField
                    description={FIELD_DESCRIPTIONS.youngModulusPa}
                    disabled={!canEditProperties}
                    error={validation.errors.youngModulusPa}
                    effectiveness={routeInputEffectiveness.youngModulusPa}
                    label="Young modulus"
                    onChange={(value) => updateDraft({ youngModulusPa: value })}
                    placeholder="Pa"
                    value={draft.youngModulusPa}
                  />
                  <MaterialTextField
                    description={FIELD_DESCRIPTIONS.poissonRatio}
                    disabled={!canEditProperties}
                    error={validation.errors.poissonRatio}
                    effectiveness={routeInputEffectiveness.poissonRatio}
                    label="Poisson ratio"
                    onChange={(value) => updateDraft({ poissonRatio: value })}
                    placeholder="0-0.5"
                    value={draft.poissonRatio}
                  />
                  <MaterialTextField
                    description={FIELD_DESCRIPTIONS.lossFactor}
                    disabled={!canEditProperties}
                    error={validation.errors.lossFactor}
                    effectiveness={routeInputEffectiveness.lossFactor}
                    label="Loss factor"
                    onChange={(value) => updateDraft({ lossFactor: value })}
                    placeholder="0-1"
                    value={draft.lossFactor}
                  />
                </div>
              ) : null}

              <MaterialTextAreaField
                description={FIELD_DESCRIPTIONS.notes}
                disabled={!canEditProperties}
                effectiveness={routeInputEffectiveness.notes}
                label="Notes"
                onChange={(value) => updateDraft({ notes: value })}
                rows={3}
                value={draft.notes}
              />

              {mode === "seed-copy" && selectedMaterial && selectedUsageCount > 0 ? (
                <label className="material-editor-checkbox">
                  <input checked={replaceSourceLayers} onChange={(event) => setReplaceSourceLayers(event.target.checked)} type="checkbox" />
                  <span>Replace {selectedUsageCount} active layer{selectedUsageCount === 1 ? "" : "s"} using {selectedMaterial.name}</span>
                </label>
              ) : null}

              <div className="material-editor-actions">
                {isExistingBuiltIn ? (
                  <button className="focus-ring ui-button ui-button-primary" onClick={startSeedCopy} type="button">
                    <Copy className="h-4 w-4" />
                    Create project copy
                  </button>
                ) : (
                  <button className="focus-ring ui-button ui-button-primary" disabled={hasErrors || !canEditProperties} onClick={saveMaterial} type="button">
                    <Save className="h-4 w-4" />
                    Save material
                  </button>
                )}
                {selectedMaterial && !isBuiltInMaterial(selectedMaterial) ? (
                  <button
                    className="focus-ring ui-button ui-button-danger"
                    disabled={selectedUsageCount > 0}
                    onClick={deleteMaterial}
                    title={selectedUsageCount > 0 ? "Remove active layers before deleting this material." : undefined}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="material-editor-form">
              {selectedMaterial ? (
                <>
                  <div className="material-editor-swatch-row" aria-label="Material appearance preview">
                    <span style={{ background: visualDraft.fillColor, borderColor: visualDraft.strokeColor }} />
                    <strong>{selectedMaterial.name}</strong>
                    <small>Visual only. Calculation inputs do not change.</small>
                  </div>
                  <div className="material-editor-color-grid">
                    <MaterialColorField
                      description={FIELD_DESCRIPTIONS.visualFill}
                      label="Fill"
                      onChange={(value) => updateVisualDraft({ fillColor: value })}
                      value={visualDraft.fillColor}
                    />
                    <MaterialColorField
                      description={FIELD_DESCRIPTIONS.visualSide}
                      label="Side"
                      onChange={(value) => updateVisualDraft({ sideColor: value })}
                      value={visualDraft.sideColor}
                    />
                    <MaterialColorField
                      description={FIELD_DESCRIPTIONS.visualStroke}
                      label="Stroke"
                      onChange={(value) => updateVisualDraft({ strokeColor: value })}
                      value={visualDraft.strokeColor}
                    />
                    <MaterialColorField
                      description={FIELD_DESCRIPTIONS.visualPattern}
                      label="Pattern"
                      onChange={(value) => updateVisualDraft({ patternColor: value })}
                      value={visualDraft.patternColor}
                    />
                  </div>
                  {!isValidMaterialVisualDraft(visualDraft) ? <p className="material-editor-error">Use valid hex colors for the preview.</p> : null}
                  {isValidMaterialVisualDraft(visualDraft) && visualReadabilityWarning ? (
                    <p className="material-editor-warning">{visualReadabilityWarning}</p>
                  ) : null}
                  <div className="material-editor-actions">
                    <button
                      className="focus-ring ui-button ui-button-primary"
                      disabled={!isValidMaterialVisualDraft(visualDraft)}
                      onClick={saveVisualOverride}
                      type="button"
                    >
                      <Save className="h-4 w-4" />
                      Save appearance
                    </button>
                    <button className="focus-ring ui-button ui-button-ghost" onClick={() => onResetVisualOverride(selectedMaterial.id)} type="button">
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </button>
                  </div>
                </>
              ) : (
                <p className="material-editor-empty">Save or select a material before editing appearance.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
