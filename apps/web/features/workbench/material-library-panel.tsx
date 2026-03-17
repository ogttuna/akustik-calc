import type { MaterialDefinition } from "@dynecho/shared";
import { Database, Plus } from "lucide-react";

import { Pill, SurfacePanel } from "@dynecho/ui";

import { getMaterialCategoryLabel } from "./describe-assembly";

type MaterialLibraryPanelProps = {
  materials: readonly MaterialDefinition[];
  onAppendMaterial: (materialId: string, thicknessMm: string) => void;
};

function defaultThicknessFor(material: MaterialDefinition): string {
  if (material.id === "generic_resilient_underlay") {
    return "8";
  }

  if (material.id === "mw_t_impact_layer") {
    return "30";
  }

  if (material.id === "mw_t_impact_layer_s35") {
    return "30";
  }

  if (material.id === "mw_t_impact_layer_s40") {
    return "30";
  }

  if (material.id === "mw_t_impact_layer_s6") {
    return "40";
  }

  if (material.id === "wf_t_impact_layer_s102") {
    return "10";
  }

  if (material.id === "eps_underlay") {
    return "3";
  }

  if (material.id === "regupol_sonus_curve_8") {
    return "8";
  }

  if (material.id === "regupol_sonus_multi_4_5") {
    return "4.5";
  }

  if (
    material.id === "getzner_afm_21" ||
    material.id === "getzner_afm_23" ||
    material.id === "getzner_afm_26" ||
    material.id === "getzner_afm_29" ||
    material.id === "getzner_afm_33" ||
    material.id === "getzner_afm_35"
  ) {
    return "8";
  }

  if (material.id === "engineered_timber_flooring") {
    return "15";
  }

  if (material.id === "engineered_timber_with_acoustic_underlay") {
    return "20";
  }

  if (material.id === "dry_floating_gypsum_fiberboard") {
    return "25";
  }

  if (material.id === "inex_floor_panel") {
    return "19";
  }

  if (material.id === "carpet_with_foam_underlay") {
    return "11";
  }

  if (material.id === "impactstop_board") {
    return "13";
  }

  if (material.id === "firestop_board") {
    return "16";
  }

  if (material.id === "furring_channel") {
    return "28";
  }

  if (material.id === "ceramic_tile") {
    return "8";
  }

  if (material.id === "porcelain_tile") {
    return "10";
  }

  if (material.id === "laminate_flooring") {
    return "8";
  }

  if (material.id === "clt_panel") {
    return "140";
  }

  if (material.id === "concrete") {
    return "150";
  }

  if (material.id === "timber_frame_floor") {
    return "220";
  }

  if (material.id === "timber_joist_floor") {
    return "240";
  }

  if (material.id === "open_box_timber_slab") {
    return "370";
  }

  if (material.id === "open_web_steel_floor") {
    return "200";
  }

  if (material.id === "generic_fill") {
    return "40";
  }

  if (material.id === "bonded_chippings") {
    return "60";
  }

  if (material.id === "non_bonded_chippings") {
    return "120";
  }

  if (material.id === "elastic_bonded_fill") {
    return "60";
  }

  if (material.id === "resilient_channel") {
    return "27";
  }

  if (material.id === "acoustic_hanger_ceiling") {
    return "95";
  }

  if (material.id === "resilient_stud_ceiling") {
    return "25";
  }

  if (material.id === "ubiq_resilient_ceiling") {
    return "65";
  }

  switch (material.category) {
    case "gap":
      return "50";
    case "insulation":
      return "50";
    case "finish":
      return "12.5";
    case "support":
      return "10";
    case "mass":
    default:
      return "100";
  }
}

export function MaterialLibraryPanel({ materials, onAppendMaterial }: MaterialLibraryPanelProps) {
  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)]">
          <Database className="h-4 w-4 text-[color:var(--ink)]" />
        </div>
        <div>
          <div className="eyebrow">Seed material library</div>
          <h2 className="mt-1 font-display text-[1.8rem] leading-none tracking-[-0.04em]">Quick insert</h2>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {materials.map((material) => (
          <article className="pointer-card grid gap-3 rounded-[1.25rem] border hairline px-4 py-4 md:grid-cols-[1fr_auto]" key={material.id}>
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
            <button
              aria-label={`Add ${material.name}`}
              className="focus-ring touch-target inline-flex items-center justify-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink)] hover:bg-black/[0.035]"
              onClick={() => onAppendMaterial(material.id, defaultThicknessFor(material))}
              type="button"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </article>
        ))}
      </div>
    </SurfacePanel>
  );
}
