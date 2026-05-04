import type { MaterialDefinition } from "@dynecho/shared";
import { Database, Plus } from "lucide-react";

import { Pill, SurfacePanel } from "@dynecho/ui";

import { getMaterialCategoryLabel } from "./describe-assembly";
import { defaultThicknessForMaterial, defaultThicknessForMaterialInRole } from "./workbench-materials";

type MaterialLibraryPanelProps = {
  materials: readonly MaterialDefinition[];
  onAppendMaterial: (materialId: string, thicknessMm: string) => void;
  onReplaceBaseStructure?: (materialId: string, thicknessMm: string) => void;
  replaceBaseMaterialIds?: readonly string[];
};

const QUICK_MATERIAL_LIMIT = 10;

export function MaterialLibraryPanel({
  materials,
  onAppendMaterial,
  onReplaceBaseStructure,
  replaceBaseMaterialIds = []
}: MaterialLibraryPanelProps) {
  const replaceableMaterialIds = new Set(replaceBaseMaterialIds);
  const pinnedMaterials = materials.filter((material) => replaceableMaterialIds.has(material.id));
  const quickMaterials = [
    ...pinnedMaterials,
    ...materials
      .filter((material) => !replaceableMaterialIds.has(material.id))
      .slice(0, Math.max(0, QUICK_MATERIAL_LIMIT - pinnedMaterials.length))
  ].slice(0, QUICK_MATERIAL_LIMIT);
  const quickMaterialIds = new Set(quickMaterials.map((material) => material.id));
  const remainingMaterials = materials.filter((material) => !quickMaterialIds.has(material.id));
  const renderMaterialCard = (material: MaterialDefinition) => {
    const canReplaceBase = Boolean(onReplaceBaseStructure) && replaceableMaterialIds.has(material.id);

    return (
      <article className="pointer-card grid min-w-0 gap-3 rounded-md border hairline px-4 py-4 xl:grid-cols-[minmax(0,1fr)_auto]" key={material.id}>
        <div className="min-w-0 space-y-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <div className="min-w-0 text-wrap font-semibold text-[color:var(--ink)]">{material.name}</div>
            <Pill tone="neutral">{getMaterialCategoryLabel(material)}</Pill>
          </div>
          <div className="line-clamp-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            {material.densityKgM3.toLocaleString("en-US")} kg/m³
            {material.notes ? ` · ${material.notes}` : ""}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-start gap-2 xl:justify-end">
          {canReplaceBase ? (
            <button
              aria-label={`Replace base with ${material.name}`}
              className="focus-ring touch-target inline-flex items-center justify-center rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
              onClick={() => onReplaceBaseStructure?.(material.id, defaultThicknessForMaterialInRole(material, "base_structure"))}
              type="button"
            >
              Replace base
            </button>
          ) : null}
          <button
            aria-label={`Add ${material.name}`}
            className="focus-ring touch-target inline-flex items-center justify-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink)] hover:bg-[color:var(--panel)]"
            onClick={() => onAppendMaterial(material.id, defaultThicknessForMaterial(material))}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </article>
    );
  };

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)]">
          <Database className="h-4 w-4 text-[color:var(--ink)]" />
        </div>
        <div>
          <div className="eyebrow">Seed material library</div>
          <h2 className="mt-1 font-display text-[1.8rem] leading-none tracking-[-0.04em]">Quick insert</h2>
          {onReplaceBaseStructure ? (
            <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
              Structural carriers can be appended as a new row or used to replace the current base row without leaving a duplicate
              carrier behind.
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {quickMaterials.map(renderMaterialCard)}
      </div>
      {remainingMaterials.length > 0 ? (
        <details className="mt-4 rounded-lg border hairline bg-[color:var(--panel)]">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[color:var(--ink)]">
            Browse {remainingMaterials.length} more seed materials
          </summary>
          <div className="grid max-h-[32rem] gap-3 overflow-y-auto border-t border-[color:var(--line)] p-3">
            {remainingMaterials.map(renderMaterialCard)}
          </div>
        </details>
      ) : null}
    </SurfacePanel>
  );
}
