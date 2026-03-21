import type { BoundFloorSystem, ExactFloorSystem } from "@dynecho/shared";

const FLOOR_SYSTEM_SOURCE_URLS = {
  "Euracoustics FA2023 concrete ceiling study": "https://dael.euracoustics.org/confs/fa2023/data/articles/001014.pdf",
  "Knauf AU official system table": "https://www.marketing.knaufapac.com/AU-Web-Forms_01b-Digital-Download-Request.html",
  "PMC open-access composite panel floor study": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10004424/",
  "Pliteq Australia GenieClip brochure": "https://pliteq.com.au/wp-content/uploads/sites/7/AUS-GenieClip-Brochure_Digital.pdf",
  "TUAS open measured dataset": "https://data.mendeley.com/datasets/y83p8mpryd/2",
  "UBIQ official system table PDF": "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf"
} as const satisfies Record<string, string>;

type FloorSystemWithSource = BoundFloorSystem | ExactFloorSystem;

function resolveDataholzSourceUrl(systemId: string): string | undefined {
  const componentCode = /^dataholz_([^_]+)_/iu.exec(systemId)?.[1];

  return componentCode ? `https://www.dataholz.eu/en/index/download/en/${componentCode}-0.pdf` : undefined;
}

export function resolveFloorSystemSourceUrl(system: FloorSystemWithSource): string | undefined {
  if (typeof system.sourceUrl === "string" && system.sourceUrl.length > 0) {
    return system.sourceUrl;
  }

  if (system.sourceLabel === "Dataholz open component library") {
    return resolveDataholzSourceUrl(system.id) ?? "https://www.dataholz.eu/en/components/";
  }

  return FLOOR_SYSTEM_SOURCE_URLS[system.sourceLabel as keyof typeof FLOOR_SYSTEM_SOURCE_URLS];
}

export function withFloorSystemSourceUrls<T extends FloorSystemWithSource>(systems: readonly T[]): readonly T[] {
  return systems.map((system) => {
    const sourceUrl = resolveFloorSystemSourceUrl(system);

    return sourceUrl ? { ...system, sourceUrl } : system;
  });
}
