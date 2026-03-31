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

export function MaterialLibraryPanel({
  materials,
  onAppendMaterial,
  onReplaceBaseStructure,
  replaceBaseMaterialIds = []
}: MaterialLibraryPanelProps) {
  const replaceableMaterialIds = new Set(replaceBaseMaterialIds);

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
        {materials.map((material) => {
          const canReplaceBase = Boolean(onReplaceBaseStructure) && replaceableMaterialIds.has(material.id);

          return (
            <article className="pointer-card grid gap-3 rounded-md border hairline px-4 py-4 md:grid-cols-[1fr_auto]" key={material.id}>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-semibold text-[color:var(--ink)]">{material.name}</div>
                <Pill tone="neutral">{getMaterialCategoryLabel(material)}</Pill>
              </div>
              <div className="text-sm leading-7 text-[color:var(--ink-soft)]">
                {material.densityKgM3.toLocaleString("en-US")} kg/m³
                {material.notes ? ` · ${material.notes}` : ""}
              </div>
            </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
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
        })}
      </div>
    </SurfacePanel>
  );
}
