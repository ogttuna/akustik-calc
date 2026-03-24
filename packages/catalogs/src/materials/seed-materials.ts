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
    id: "lightweight_concrete",
    name: "Lightweight Concrete",
    category: "mass",
    densityKgM3: 1800,
    notes: "Ported from the Acoustic2 base catalog for lighter mineral slab and wall studies.",
    tags: ["structural", "concrete", "masonry", "lightweight-mineral"]
  },
  {
    id: "heavy_concrete",
    name: "Heavy Concrete",
    category: "mass",
    densityKgM3: 3000,
    notes: "Ported from the Acoustic2 base catalog for dense mineral slab studies and heavy support comparisons.",
    tags: ["structural", "concrete", "masonry", "heavy-base", "dense-mineral"]
  },
  {
    id: "gypsum_board",
    name: "Gypsum Board",
    category: "finish",
    densityKgM3: 850,
    tags: ["lining", "board"]
  },
  {
    id: "acoustic_gypsum_board",
    name: "Acoustic Gypsum Board",
    category: "finish",
    densityKgM3: 1024,
    notes: "Curated acoustic board entry aligned to the upstream Acoustic2 reference surface mass of 12.8 kg/m² at 12.5 mm.",
    tags: ["lining", "board", "acoustic-board", "soundbloc", "diamond-board"]
  },
  {
    id: "diamond_board",
    name: "Diamond Board",
    category: "finish",
    densityKgM3: 1024,
    notes: "Curated Diamant/DB board entry aligned to the upstream Acoustic2 diamond-board profile at 12.8 kg/m² for 12.5 mm.",
    tags: ["lining", "board", "diamond-board", "db-board", "enhanced-board"]
  },
  {
    id: "security_board",
    name: "Security Board AKV",
    category: "finish",
    densityKgM3: 736,
    notes: "Curated Security Board entry aligned to the upstream Acoustic2 security-board profile at 9.2 kg/m² for 12.5 mm.",
    tags: ["lining", "board", "security-board", "akv", "enhanced-board"]
  },
  {
    id: "silentboard",
    name: "Silentboard",
    category: "finish",
    densityKgM3: 1472,
    notes: "Curated Silentboard entry aligned to the upstream Acoustic2 silentboard profile at 18.4 kg/m² for 12.5 mm.",
    tags: ["lining", "board", "silentboard", "enhanced-board"]
  },
  {
    id: "fire_board",
    name: "Fire Board",
    category: "finish",
    densityKgM3: 820,
    notes: "Ported from the Acoustic2 board catalog and aligned to the 20 mm fire-board reference mass of 16.4 kg/m².",
    tags: ["lining", "board", "fire-board", "enhanced-board", "df-board"]
  },
  {
    id: "sheetrock_one",
    name: "Sheetrock One",
    category: "finish",
    densityKgM3: 800,
    notes: "Ported from the Acoustic2 board catalog for lighter single-board wall and ceiling studies.",
    tags: ["lining", "board", "sheetrock", "single-board", "standard-board"]
  },
  {
    id: "cement_board",
    name: "Cement Board",
    category: "finish",
    densityKgM3: 1400,
    notes: "Ported from the Acoustic2 board catalog for dense cementitious lining layers.",
    tags: ["lining", "board", "cement-board", "dense-board", "wet-area-board"]
  },
  {
    id: "cement_plaster",
    name: "Cement Plaster",
    category: "finish",
    densityKgM3: 1700,
    notes: "Curated mineral plaster layer used by the Xella/Ytong masonry reference slice.",
    tags: ["plaster", "render", "mineral-finish", "masonry-finish"]
  },
  {
    id: "dense_plaster",
    name: "Dense Plaster",
    category: "finish",
    densityKgM3: 2077,
    notes: "Curated dense plaster layer for the official Wienerberger Porotherm acoustic declarations.",
    tags: ["plaster", "dense-plaster", "mineral-finish", "masonry-finish"]
  },
  {
    id: "lightweight_plaster",
    name: "Lightweight Plaster",
    category: "finish",
    densityKgM3: 908,
    notes: "Curated lightweight plaster layer for the official Wienerberger Porotherm acoustic declarations.",
    tags: ["plaster", "lightweight-plaster", "mineral-finish", "masonry-finish"]
  },
  {
    id: "lime_cement_plaster_1300",
    name: "Lime-Cement Plaster 1300",
    category: "finish",
    densityKgM3: 1300,
    notes: "Curated lime-cement plaster layer for official HELUZ measured laboratory declarations.",
    tags: ["plaster", "lime-cement-plaster", "mineral-finish", "masonry-finish"]
  },
  {
    id: "lime_cement_plaster_1700",
    name: "Lime-Cement Plaster 1700",
    category: "finish",
    densityKgM3: 1700,
    notes: "Curated lime-cement plaster layer for official HELUZ measured laboratory declarations.",
    tags: ["plaster", "lime-cement-plaster", "mineral-finish", "masonry-finish"]
  },
  {
    id: "lime_cement_plaster_1780",
    name: "Lime-Cement Plaster 1780",
    category: "finish",
    densityKgM3: 1780,
    notes: "Curated lime-cement plaster layer for official HELUZ measured laboratory declarations.",
    tags: ["plaster", "lime-cement-plaster", "mineral-finish", "masonry-finish"]
  },
  {
    id: "skim_plaster",
    name: "Skim Plaster",
    category: "finish",
    densityKgM3: 1700,
    notes: "Thin skim-coat plaster used by the official Xella modular wall references.",
    tags: ["plaster", "skim", "thin-coat", "mineral-finish", "masonry-finish"]
  },
  {
    id: "celcon_lwt_plaster",
    name: "Celcon Lightweight Plaster",
    category: "finish",
    densityKgM3: 770,
    notes: "Curated 13 mm lightweight plaster layer for the official H+H Celcon finished-aircrete acoustic table; density inferred from the published wall-mass deltas.",
    tags: ["plaster", "lightweight-plaster", "aircrete-finish", "celcon", "masonry-finish"]
  },
  {
    id: "celcon_dense_plaster",
    name: "Celcon Dense Plaster",
    category: "finish",
    densityKgM3: 1845,
    notes: "Curated 13 mm dense plaster layer for the official H+H Celcon finished-aircrete acoustic table; density inferred from the published wall-mass deltas.",
    tags: ["plaster", "dense-plaster", "aircrete-finish", "celcon", "masonry-finish"]
  },
  {
    id: "gypsum_plaster",
    name: "Gypsum Plaster",
    category: "finish",
    densityKgM3: 1000,
    notes: "Ported from the Acoustic2 base catalog for lighter wet plaster finish studies.",
    tags: ["plaster", "gypsum-plaster", "mineral-finish", "lightweight-finish"]
  },
  {
    id: "lime_plaster",
    name: "Lime Plaster",
    category: "finish",
    densityKgM3: 1600,
    notes: "Ported from the Acoustic2 base catalog for traditional lime-finish wall studies.",
    tags: ["plaster", "lime-plaster", "mineral-finish", "masonry-finish"]
  },
  {
    id: "ytong_aac_d700",
    name: "Ytong AAC D700",
    category: "mass",
    densityKgM3: 700,
    notes: "Curated AAC block entry for the official Ytong D700 single-leaf wall references.",
    tags: ["aac", "ytong", "autoclaved-aerated-concrete", "block", "masonry", "lightweight-mineral"]
  },
  {
    id: "ytong_g5_800",
    name: "Ytong G5/800",
    category: "mass",
    densityKgM3: 800,
    notes: "Curated AAC panel entry for the official Xella modular building system reference.",
    tags: ["aac", "ytong", "autoclaved-aerated-concrete", "panel", "masonry", "lightweight-mineral"]
  },
  {
    id: "ytong_separatiepaneel_aac_4_600",
    name: "Ytong Separatiepaneel AAC 4/600",
    category: "mass",
    densityKgM3: 610,
    notes:
      "Curated prefab AAC partition-panel entry for the official Xella Nederland separatiepanelen acoustic sheet; density follows the published 6% moisture bulk density and panel mass-per-area table.",
    tags: ["aac", "ytong", "separatiepaneel", "prefab-panel", "autoclaved-aerated-concrete", "masonry", "lightweight-mineral"]
  },
  {
    id: "ytong_separatiepaneel_aac_5_750",
    name: "Ytong Separatiepaneel AAC 5/750",
    category: "mass",
    densityKgM3: 795,
    notes:
      "Curated prefab AAC partition-panel entry for the official Xella Nederland separatiepanelen acoustic sheet; density follows the published 6% moisture bulk density and panel mass-per-area table.",
    tags: ["aac", "ytong", "separatiepaneel", "prefab-panel", "autoclaved-aerated-concrete", "masonry", "lightweight-mineral"]
  },
  {
    id: "ytong_cellenbetonblok_g4_600",
    name: "Ytong Cellenbetonblok G4/600",
    category: "mass",
    densityKgM3: 610,
    notes:
      "Curated AAC block entry for the official Xella Nederland cellenbetonblokken acoustic sheet; density follows the published 6% moisture bulk density table.",
    tags: ["aac", "ytong", "cellenbetonblok", "block", "autoclaved-aerated-concrete", "masonry", "lightweight-mineral"]
  },
  {
    id: "ytong_cellenbetonblok_g5_800",
    name: "Ytong Cellenbetonblok G5/800",
    category: "mass",
    densityKgM3: 795,
    notes:
      "Curated AAC block entry for the official Xella Nederland cellenbetonblokken acoustic sheet; density follows the published 6% moisture bulk density table.",
    tags: ["aac", "ytong", "cellenbetonblok", "block", "autoclaved-aerated-concrete", "masonry", "lightweight-mineral"]
  },
  {
    id: "ytong_massief_g2_300",
    name: "Ytong Massief G2/300",
    category: "mass",
    densityKgM3: 300,
    notes: "Curated low-density AAC block entry for the official Xella Nederland Massiefblokken acoustic reference slice.",
    tags: ["aac", "ytong", "massief", "autoclaved-aerated-concrete", "block", "masonry", "lightweight-mineral"]
  },
  {
    id: "celcon_solar_grade",
    name: "Celcon Solar Grade",
    category: "mass",
    densityKgM3: 570,
    notes: "Curated H+H Celcon Solar grade aircrete block entry for the official unfinished-aircrete acoustic reference slice.",
    tags: ["aac", "aircrete", "celcon", "block", "masonry", "lightweight-mineral"]
  },
  {
    id: "celcon_standard_grade",
    name: "Celcon Standard Grade",
    category: "mass",
    densityKgM3: 700,
    notes: "Curated H+H Celcon Standard grade aircrete block entry for the official unfinished-aircrete acoustic reference slice.",
    tags: ["aac", "aircrete", "celcon", "block", "masonry", "lightweight-mineral"]
  },
  {
    id: "celcon_high_strength",
    name: "Celcon High Strength Grade",
    category: "mass",
    densityKgM3: 830,
    notes: "Curated H+H Celcon High Strength grade aircrete block entry for the official unfinished-aircrete acoustic reference slice.",
    tags: ["aac", "aircrete", "celcon", "block", "masonry", "lightweight-mineral"]
  },
  {
    id: "pumice_block",
    name: "Pumice Block",
    category: "mass",
    densityKgM3: 900,
    notes: "Curated lightweight pumice block entry for masonry-backed stability guards and regression coverage.",
    tags: ["pumice", "bims", "block", "masonry", "lightweight-mineral"]
  },
  {
    id: "silka_cs_block",
    name: "Silka CS Block",
    category: "mass",
    densityKgM3: 1753,
    notes: "Curated calcium-silicate block entry for the official Xella Silka acoustic reference slice.",
    tags: ["silicate", "calcium-silicate", "sand-lime", "silka", "block", "masonry", "dense-mineral"]
  },
  {
    id: "solid_brick",
    name: "Solid Brick",
    category: "mass",
    densityKgM3: 1800,
    notes: "Ported from the Acoustic2 masonry catalog for solid fired-clay leaf studies.",
    tags: ["clay", "brick", "block", "masonry", "solid", "dense-mineral"]
  },
  {
    id: "hollow_brick",
    name: "Hollow Brick",
    category: "mass",
    densityKgM3: 1200,
    notes: "Ported from the Acoustic2 masonry catalog for perforated clay block studies outside the verified manufacturer slices.",
    tags: ["clay", "brick", "block", "masonry", "perforated", "hollow"]
  },
  {
    id: "aac",
    name: "AAC Block",
    category: "mass",
    densityKgM3: 500,
    notes: "Ported from the Acoustic2 base catalog as a generic AAC option when a branded density class is not known.",
    tags: ["aac", "autoclaved-aerated-concrete", "block", "masonry", "lightweight-mineral"]
  },
  {
    id: "porotherm_pls_100",
    name: "Porotherm PLS 100",
    category: "mass",
    densityKgM3: 950,
    notes: "Curated perforated clay block entry for the official Wienerberger Porotherm acoustic declaration slice.",
    tags: ["porotherm", "wienerberger", "clay", "brick", "block", "perforated", "hollow", "masonry"]
  },
  {
    id: "porotherm_pls_140",
    name: "Porotherm PLS 140",
    category: "mass",
    densityKgM3: 850,
    notes: "Curated perforated clay block entry for the official Wienerberger Porotherm acoustic declaration slice.",
    tags: ["porotherm", "wienerberger", "clay", "brick", "block", "perforated", "hollow", "masonry"]
  },
  {
    id: "porotherm_pls_190",
    name: "Porotherm PLS 190",
    category: "mass",
    densityKgM3: 850,
    notes: "Curated perforated clay block entry for the official Wienerberger Porotherm acoustic declaration slice.",
    tags: ["porotherm", "wienerberger", "clay", "brick", "block", "perforated", "hollow", "masonry"]
  },
  {
    id: "heluz_14_brushed",
    name: "HELUZ 14 brousená",
    category: "mass",
    densityKgM3: 740,
    notes: "Curated perforated clay internal-brick entry for the official HELUZ laboratory declaration slice.",
    tags: ["heluz", "clay", "brick", "block", "perforated", "hollow", "masonry", "internal-brick"]
  },
  {
    id: "heluz_aku_115",
    name: "HELUZ AKU 11.5",
    category: "mass",
    densityKgM3: 1070,
    notes: "Curated acoustic clay brick entry for the official HELUZ AKU measured laboratory slice.",
    tags: ["heluz", "aku", "clay", "brick", "block", "perforated", "hollow", "masonry", "acoustic-brick"]
  },
  {
    id: "heluz_aku_200_p15",
    name: "HELUZ AKU 20 P15",
    category: "mass",
    densityKgM3: 1020,
    notes: "Curated acoustic clay brick entry for the official HELUZ AKU measured laboratory slice.",
    tags: ["heluz", "aku", "clay", "brick", "block", "perforated", "hollow", "masonry", "acoustic-brick"]
  },
  {
    id: "heluz_aku_300_333_p20",
    name: "HELUZ AKU 30/33.3 P20",
    category: "mass",
    densityKgM3: 980,
    notes: "Curated acoustic clay brick entry for the official HELUZ AKU measured laboratory slice.",
    tags: ["heluz", "aku", "clay", "brick", "block", "perforated", "hollow", "masonry", "acoustic-brick"]
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
    id: "anhydrite_screed",
    name: "Anhydrite Screed",
    category: "mass",
    densityKgM3: 2050,
    notes: "Ported from the Acoustic2 floor catalog for calcium-sulfate floating screed build-ups.",
    tags: ["floor", "mass", "screed", "anhydrite"]
  },
  {
    id: "particleboard_flooring",
    name: "Particleboard Flooring",
    category: "mass",
    densityKgM3: 700,
    notes: "Ported from the Acoustic2 floor catalog for dry deck and subfloor build-ups.",
    tags: ["floor", "deck", "subfloor", "wood-board", "chipboard"]
  },
  {
    id: "osb",
    name: "OSB",
    category: "mass",
    densityKgM3: 650,
    notes: "Ported from the Acoustic2 timber catalog for deck, sheathing, and subfloor layers.",
    tags: ["deck", "subfloor", "wood-board", "structural", "timber"]
  },
  {
    id: "plywood",
    name: "Plywood",
    category: "mass",
    densityKgM3: 600,
    notes: "Ported from the Acoustic2 timber catalog for deck and sheathing layers.",
    tags: ["deck", "subfloor", "wood-board", "structural", "timber"]
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
    id: "mlv",
    name: "MLV Sound Barrier",
    category: "finish",
    densityKgM3: 1900,
    notes: "Ported from the Acoustic2 membrane catalog for limp-mass barrier layers and local custom stack studies.",
    tags: ["membrane", "barrier", "limp-mass", "acoustic-barrier"]
  },
  {
    id: "bitumen_membrane",
    name: "Bitumen Membrane",
    category: "finish",
    densityKgM3: 1100,
    notes: "Ported from the Acoustic2 membrane catalog for bituminous isolation and barrier layers.",
    tags: ["membrane", "barrier", "bitumen", "acoustic-barrier"]
  },
  {
    id: "rockwool",
    name: "Rock Wool",
    category: "insulation",
    densityKgM3: 45,
    tags: ["cavity-fill", "porous"]
  },
  {
    id: "high_density_rockwool",
    name: "High Density Rock Wool",
    category: "insulation",
    densityKgM3: 90,
    notes: "Ported from the Acoustic2 infill catalog for denser cavity-fill and board-style mineral wool studies.",
    tags: ["cavity-fill", "porous", "rockwool", "high-density", "board-insulation"]
  },
  {
    id: "glasswool_board",
    name: "Glass Wool Board",
    category: "insulation",
    densityKgM3: 30,
    notes: "Ported from the Acoustic2 infill catalog for semi-rigid glass wool slab studies.",
    tags: ["cavity-fill", "porous", "glasswool", "board-insulation"]
  },
  {
    id: "cellulose_fill",
    name: "Cellulose Fill",
    category: "insulation",
    densityKgM3: 45,
    notes: "Ported from the Acoustic2 infill catalog for blown cellulose cavity studies.",
    tags: ["cavity-fill", "porous", "cellulose", "blown-in"]
  },
  {
    id: "wood_wool_panel",
    name: "Wood Wool Panel",
    category: "insulation",
    densityKgM3: 400,
    notes: "Ported from the Acoustic2 infill catalog for wood-wool acoustic board layers.",
    tags: ["cavity-fill", "wood-wool", "board-insulation", "porous"]
  },
  {
    id: "pet_felt",
    name: "PET Acoustic Felt",
    category: "insulation",
    densityKgM3: 180,
    notes: "Ported from the Acoustic2 infill catalog for recycled polyester felt layers.",
    tags: ["cavity-fill", "felt", "polyester", "porous"]
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
    id: "acoustic_mount_clip",
    name: "Acoustic Mount Clip",
    category: "support",
    densityKgM3: 0,
    notes: "Ported from the Acoustic2 support catalog for resilient clip-supported linings and ceilings.",
    tags: ["support", "resilient", "ceiling-support", "clip"]
  },
  {
    id: "spring_hanger_track",
    name: "Spring Hanger Track",
    category: "support",
    densityKgM3: 0,
    notes: "Ported from the Acoustic2 support catalog for spring-hung ceiling and service-zone build-ups.",
    tags: ["support", "resilient", "ceiling-support", "hanger-track"]
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
