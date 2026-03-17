import type { MaterialDefinition } from "@dynecho/shared";

import { FLOOR_SYSTEM_MATERIALS } from "./floor-system-materials";

const BASE_SEED_MATERIALS: readonly MaterialDefinition[] = [
  {
    id: "concrete",
    name: "Concrete",
    category: "mass",
    densityKgM3: 2400,
    notes: "Seed catalog entry for the new product repo.",
    tags: ["structural", "baseline", "heavy-base"]
  },
  {
    id: "gypsum_board",
    name: "Gypsum Board",
    category: "finish",
    densityKgM3: 850,
    tags: ["lining", "board"]
  },
  {
    id: "clt_panel",
    name: "CLT Panel",
    category: "mass",
    densityKgM3: 470,
    tags: ["mass-timber", "structural"]
  },
  {
    id: "screed",
    name: "Mineral Screed",
    category: "mass",
    densityKgM3: 2000,
    tags: ["floor", "mass"]
  },
  {
    id: "vinyl_flooring",
    name: "Vinyl Flooring",
    category: "finish",
    densityKgM3: 1400,
    tags: ["finish", "resilient"]
  },
  {
    id: "ceramic_tile",
    name: "Ceramic Tile",
    category: "finish",
    densityKgM3: 2000,
    tags: ["finish", "hard-floor", "floor"]
  },
  {
    id: "rockwool",
    name: "Rock Wool",
    category: "insulation",
    densityKgM3: 45,
    tags: ["cavity-fill", "porous"]
  },
  {
    id: "air_gap",
    name: "Air Gap",
    category: "gap",
    densityKgM3: 0,
    tags: ["cavity"]
  },
  {
    id: "resilient_support",
    name: "Resilient Support",
    category: "support",
    densityKgM3: 0,
    tags: ["support"]
  },
  {
    id: "generic_resilient_underlay",
    name: "Generic Resilient Underlay",
    category: "support",
    densityKgM3: 700,
    impact: {
      dynamicStiffnessMNm3: 10
    },
    notes: "Seed dynamic-stiffness layer for narrow heavy-floor Ln,w estimation.",
    tags: ["support", "resilient", "impact"]
  },
  {
    id: "generic_resilient_underlay_s30",
    name: "Generic Resilient Underlay S30",
    category: "support",
    densityKgM3: 700,
    impact: {
      dynamicStiffnessMNm3: 30
    },
    notes: "Generic s'=30 MN/m3 resilient layer for explicit narrow heavy-floor impact estimates without implying an official product row.",
    tags: ["support", "resilient", "impact", "generic"]
  }
];

export const MATERIAL_CATALOG_SEED: readonly MaterialDefinition[] = [
  ...BASE_SEED_MATERIALS,
  ...FLOOR_SYSTEM_MATERIALS
];

export const MATERIAL_SOURCE_NOTE =
  "Seed catalog plus a curated exact floor-system slice. Acoustic2 remains read-only; no direct catalog sync is happening from its active working tree.";

export const materialCatalogById = Object.fromEntries(
  MATERIAL_CATALOG_SEED.map((entry) => [entry.id, entry])
) as Record<string, MaterialDefinition>;
