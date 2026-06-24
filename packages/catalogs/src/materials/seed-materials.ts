import type { MaterialDefinition } from "@dynecho/shared";

import { FLOOR_SYSTEM_MATERIALS } from "./floor-system-materials";

const BASE_SEED_MATERIALS: readonly MaterialDefinition[] = [
  {
    id: "concrete",
    name: "Concrete",
    category: "mass",
    densityKgM3: 2400,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.015,
      notes: ["Nominal concrete stiffness/damping for model-first material readiness; not an exact source row."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 30000000000
    },
    notes: "Seed catalog entry for the new product repo.",
    tags: ["structural", "baseline", "heavy-base"]
  },
  {
    id: "lightweight_concrete",
    name: "Lightweight Concrete",
    category: "mass",
    densityKgM3: 1800,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.015,
      notes: ["Nominal lightweight-concrete stiffness/damping for material-gap closure; not a source-owned curve."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 12000000000
    },
    notes: "Ported from the Acoustic2 base catalog for lighter mineral slab and wall studies.",
    tags: ["structural", "concrete", "masonry", "lightweight-mineral"]
  },
  {
    id: "heavy_concrete",
    name: "Heavy Concrete",
    category: "mass",
    densityKgM3: 3000,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.015,
      notes: ["Nominal heavy concrete stiffness/damping for material-readiness routing; not source-owned calibration."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 32000000000
    },
    notes: "Ported from the Acoustic2 base catalog for dense mineral slab studies and heavy support comparisons.",
    tags: ["structural", "concrete", "masonry", "heavy-base", "dense-mineral"]
  },
  {
    id: "gypsum_board",
    name: "Gypsum Board",
    category: "finish",
    densityKgM3: 850,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.03,
      notes: ["Nominal board stiffness/damping for uncalibrated family solvers and uncertainty accounting."],
      poissonRatio: 0.25,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 2500000000
    },
    tags: ["lining", "board"]
  },
  {
    id: "acoustic_gypsum_board",
    name: "Acoustic Gypsum Board",
    category: "finish",
    densityKgM3: 1024,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.035,
      notes: ["Nominal enhanced gypsum-board stiffness/damping; exact product curves still require source ownership."],
      poissonRatio: 0.25,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 2800000000
    },
    notes: "Curated acoustic board entry aligned to the upstream Acoustic2 reference surface mass of 12.8 kg/m² at 12.5 mm.",
    tags: ["lining", "board", "acoustic-board", "soundbloc", "diamond-board"]
  },
  {
    id: "nrc_type_c_gypsum_board",
    name: "NRC 2024 Type C Gypsum Board",
    category: "finish",
    densityKgM3: 772,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.035,
      notes: [
        "Source-family identity material for the NRC 2024 internal-board triple-leaf calibration corridor.",
        "Use only with explicit grouped triple-leaf topology; it is not a generic Type C product claim."
      ],
      poissonRatio: 0.25,
      propertySourceStatus: "source_owned",
      youngModulusPa: 2800000000
    },
    notes: "Represents the 12.7 mm Type C gypsum board at 9.80 kg/m2 used by the NRC 2024 internal gypsum double-stud source-family rows.",
    tags: ["lining", "board", "gypsum", "type-c", "nrc-2024", "triple-leaf-source-family"]
  },
  {
    id: "diamond_board",
    name: "Diamond Board",
    category: "finish",
    densityKgM3: 1024,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.035,
      notes: ["Nominal dense board properties for material-readiness checks; not a measured acoustic curve."],
      poissonRatio: 0.25,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 3000000000
    },
    notes: "Curated Diamant/DB board entry aligned to the upstream Acoustic2 diamond-board profile at 12.8 kg/m² for 12.5 mm.",
    tags: ["lining", "board", "diamond-board", "db-board", "enhanced-board"]
  },
  {
    id: "security_board",
    name: "Security Board AKV",
    category: "finish",
    densityKgM3: 736,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.03,
      notes: ["Nominal security-board stiffness/damping for family-material gap closure; exact product rows remain separate."],
      poissonRatio: 0.25,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 2500000000
    },
    notes: "Curated Security Board entry aligned to the upstream Acoustic2 security-board profile at 9.2 kg/m² for 12.5 mm.",
    tags: ["lining", "board", "security-board", "akv", "enhanced-board"]
  },
  {
    id: "silentboard",
    name: "Silentboard",
    category: "finish",
    densityKgM3: 1472,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.04,
      notes: ["Nominal high-mass board properties used only with explicit uncertainty until source calibration lands."],
      poissonRatio: 0.25,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 3200000000
    },
    notes: "Curated Silentboard entry aligned to the upstream Acoustic2 silentboard profile at 18.4 kg/m² for 12.5 mm.",
    tags: ["lining", "board", "silentboard", "enhanced-board"]
  },
  {
    id: "fire_board",
    name: "Fire Board",
    category: "finish",
    densityKgM3: 820,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.03,
      notes: ["Nominal fire-board stiffness/damping for uncalibrated board-family solvers."],
      poissonRatio: 0.25,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 2500000000
    },
    notes: "Ported from the Acoustic2 board catalog and aligned to the 20 mm fire-board reference mass of 16.4 kg/m².",
    tags: ["lining", "board", "fire-board", "enhanced-board", "df-board"]
  },
  {
    id: "sheetrock_one",
    name: "Sheetrock One",
    category: "finish",
    densityKgM3: 800,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.03,
      notes: ["Nominal standard-board stiffness/damping for family-material gap closure."],
      poissonRatio: 0.25,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 2500000000
    },
    notes: "Ported from the Acoustic2 board catalog for lighter single-board wall and ceiling studies.",
    tags: ["lining", "board", "sheetrock", "single-board", "standard-board"]
  },
  {
    id: "cement_board",
    name: "Cement Board",
    category: "finish",
    densityKgM3: 1400,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.02,
      notes: ["Nominal cement-board stiffness/damping for dense lining material readiness."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 8000000000
    },
    notes: "Ported from the Acoustic2 board catalog for dense cementitious lining layers.",
    tags: ["lining", "board", "cement-board", "dense-board", "wet-area-board"]
  },
  {
    id: "geotextile",
    name: "Geotextile Separator Layer",
    category: "finish",
    densityKgM3: 150,
    notes:
      "Curated nominal separator-membrane entry for the TUAS hybrid lower-treatment open-box rows. Density is a conservative placeholder for exact-match schedule surfacing, not a generalized wet-build predictor calibration.",
    tags: ["separator", "membrane", "geotextile", "nonwoven"]
  },
  {
    id: "cement_plaster",
    name: "Cement Plaster",
    category: "finish",
    densityKgM3: 1700,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.02,
      notes: ["Nominal mineral plaster properties for masonry finish modelling."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 8000000000
    },
    notes: "Curated mineral plaster layer used by the Xella/Ytong masonry reference slice.",
    tags: ["plaster", "render", "mineral-finish", "masonry-finish"]
  },
  {
    id: "dense_plaster",
    name: "Dense Plaster",
    category: "finish",
    densityKgM3: 2077,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.02,
      notes: ["Nominal dense-plaster stiffness/damping for masonry finish modelling."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 8000000000
    },
    notes: "Curated dense plaster layer for the official Wienerberger Porotherm acoustic declarations.",
    tags: ["plaster", "dense-plaster", "mineral-finish", "masonry-finish"]
  },
  {
    id: "lightweight_plaster",
    name: "Lightweight Plaster",
    category: "finish",
    densityKgM3: 908,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.03,
      notes: ["Nominal lightweight-plaster stiffness/damping for masonry finish modelling."],
      poissonRatio: 0.22,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 3000000000
    },
    notes: "Curated lightweight plaster layer for the official Wienerberger Porotherm acoustic declarations.",
    tags: ["plaster", "lightweight-plaster", "mineral-finish", "masonry-finish"]
  },
  {
    id: "lime_cement_plaster_1300",
    name: "Lime-Cement Plaster 1300",
    category: "finish",
    densityKgM3: 1300,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.02,
      notes: ["Nominal lime-cement plaster stiffness/damping for masonry finish modelling."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 7000000000
    },
    notes: "Curated lime-cement plaster layer for official HELUZ measured laboratory declarations.",
    tags: ["plaster", "lime-cement-plaster", "mineral-finish", "masonry-finish"]
  },
  {
    id: "lime_cement_plaster_1700",
    name: "Lime-Cement Plaster 1700",
    category: "finish",
    densityKgM3: 1700,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.02,
      notes: ["Nominal lime-cement plaster stiffness/damping for masonry finish modelling."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 8000000000
    },
    notes: "Curated lime-cement plaster layer for official HELUZ measured laboratory declarations.",
    tags: ["plaster", "lime-cement-plaster", "mineral-finish", "masonry-finish"]
  },
  {
    id: "lime_cement_plaster_1780",
    name: "Lime-Cement Plaster 1780",
    category: "finish",
    densityKgM3: 1780,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.02,
      notes: ["Nominal lime-cement plaster stiffness/damping for masonry finish modelling."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 8000000000
    },
    notes: "Curated lime-cement plaster layer for official HELUZ measured laboratory declarations.",
    tags: ["plaster", "lime-cement-plaster", "mineral-finish", "masonry-finish"]
  },
  {
    id: "skim_plaster",
    name: "Skim Plaster",
    category: "finish",
    densityKgM3: 1700,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.02,
      notes: ["Nominal skim-plaster stiffness/damping for thin finish material readiness."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 8000000000
    },
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
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.02,
      notes: ["Nominal gypsum plaster properties for finish-layer physics readiness."],
      poissonRatio: 0.22,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 4000000000
    },
    notes: "Ported from the Acoustic2 base catalog for lighter wet plaster finish studies.",
    tags: ["plaster", "gypsum-plaster", "mineral-finish", "lightweight-finish"]
  },
  {
    id: "lime_plaster",
    name: "Lime Plaster",
    category: "finish",
    densityKgM3: 1600,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.02,
      notes: ["Nominal lime-plaster stiffness/damping for masonry finish material readiness."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 8000000000
    },
    notes: "Ported from the Acoustic2 base catalog for traditional lime-finish wall studies.",
    tags: ["plaster", "lime-plaster", "mineral-finish", "masonry-finish"]
  },
  {
    id: "ytong_aac_d700",
    name: "Ytong AAC D700",
    category: "mass",
    densityKgM3: 700,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.03,
      notes: ["Nominal AAC stiffness/damping aligned with existing benchmark fixtures; still not an exact source curve."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 3500000000
    },
    notes: "Curated AAC block entry for the official Ytong D700 single-leaf wall references.",
    tags: ["aac", "ytong", "autoclaved-aerated-concrete", "block", "masonry", "lightweight-mineral"]
  },
  {
    id: "ytong_g5_800",
    name: "Ytong G5/800",
    category: "mass",
    densityKgM3: 800,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.03,
      notes: ["Nominal AAC panel stiffness/damping for material-property coverage checks."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 3500000000
    },
    notes: "Curated AAC panel entry for the official Xella modular building system reference.",
    tags: ["aac", "ytong", "autoclaved-aerated-concrete", "panel", "masonry", "lightweight-mineral"]
  },
  {
    id: "ytong_separatiepaneel_aac_4_600",
    name: "Ytong Separatiepaneel AAC 4/600",
    category: "mass",
    densityKgM3: 610,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.03,
      notes: ["Nominal AAC panel stiffness/damping for material-gap closure; exact rows remain source-owned separately."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 3100000000
    },
    notes:
      "Curated prefab AAC partition-panel entry for the official Xella Nederland separatiepanelen acoustic sheet; density follows the published 6% moisture bulk density and panel mass-per-area table.",
    tags: ["aac", "ytong", "separatiepaneel", "prefab-panel", "autoclaved-aerated-concrete", "masonry", "lightweight-mineral"]
  },
  {
    id: "ytong_separatiepaneel_aac_5_750",
    name: "Ytong Separatiepaneel AAC 5/750",
    category: "mass",
    densityKgM3: 795,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.03,
      notes: ["Nominal AAC panel stiffness/damping for material-gap closure; exact rows remain source-owned separately."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 3500000000
    },
    notes:
      "Curated prefab AAC partition-panel entry for the official Xella Nederland separatiepanelen acoustic sheet; density follows the published 6% moisture bulk density and panel mass-per-area table.",
    tags: ["aac", "ytong", "separatiepaneel", "prefab-panel", "autoclaved-aerated-concrete", "masonry", "lightweight-mineral"]
  },
  {
    id: "ytong_cellenbetonblok_g4_600",
    name: "Ytong Cellenbetonblok G4/600",
    category: "mass",
    densityKgM3: 610,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.03,
      notes: ["Nominal AAC block stiffness/damping for material-gap closure; exact rows remain source-owned separately."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 3100000000
    },
    notes:
      "Curated AAC block entry for the official Xella Nederland cellenbetonblokken acoustic sheet; density follows the published 6% moisture bulk density table.",
    tags: ["aac", "ytong", "cellenbetonblok", "block", "autoclaved-aerated-concrete", "masonry", "lightweight-mineral"]
  },
  {
    id: "ytong_cellenbetonblok_g5_800",
    name: "Ytong Cellenbetonblok G5/800",
    category: "mass",
    densityKgM3: 795,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.03,
      notes: ["Nominal AAC block stiffness/damping for material-gap closure; exact rows remain source-owned separately."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 3500000000
    },
    notes:
      "Curated AAC block entry for the official Xella Nederland cellenbetonblokken acoustic sheet; density follows the published 6% moisture bulk density table.",
    tags: ["aac", "ytong", "cellenbetonblok", "block", "autoclaved-aerated-concrete", "masonry", "lightweight-mineral"]
  },
  {
    id: "ytong_massief_g2_300",
    name: "Ytong Massief G2/300",
    category: "mass",
    densityKgM3: 300,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.035,
      notes: ["Nominal low-density AAC block stiffness/damping for material-gap closure."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 2200000000
    },
    notes: "Curated low-density AAC block entry for the official Xella Nederland Massiefblokken acoustic reference slice.",
    tags: ["aac", "ytong", "massief", "autoclaved-aerated-concrete", "block", "masonry", "lightweight-mineral"]
  },
  {
    id: "celcon_solar_grade",
    name: "Celcon Solar Grade",
    category: "mass",
    densityKgM3: 570,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.03,
      notes: ["Nominal aircrete block stiffness/damping for material-gap closure; not a measured product curve."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 3500000000
    },
    notes: "Curated H+H Celcon Solar grade aircrete block entry for the official unfinished-aircrete acoustic reference slice.",
    tags: ["aac", "aircrete", "celcon", "block", "masonry", "lightweight-mineral"]
  },
  {
    id: "celcon_standard_grade",
    name: "Celcon Standard Grade",
    category: "mass",
    densityKgM3: 700,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.03,
      notes: ["Nominal aircrete block stiffness/damping for material-gap closure; not a measured product curve."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 3500000000
    },
    notes: "Curated H+H Celcon Standard grade aircrete block entry for the official unfinished-aircrete acoustic reference slice.",
    tags: ["aac", "aircrete", "celcon", "block", "masonry", "lightweight-mineral"]
  },
  {
    id: "celcon_high_strength",
    name: "Celcon High Strength Grade",
    category: "mass",
    densityKgM3: 830,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.03,
      notes: ["Nominal high-strength aircrete block stiffness/damping for material-gap closure."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 3500000000
    },
    notes: "Curated H+H Celcon High Strength grade aircrete block entry for the official unfinished-aircrete acoustic reference slice.",
    tags: ["aac", "aircrete", "celcon", "block", "masonry", "lightweight-mineral"]
  },
  {
    id: "pumice_block",
    name: "Pumice Block",
    category: "mass",
    densityKgM3: 900,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.025,
      notes: ["Nominal pumice-block stiffness/damping for masonry material readiness."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 5000000000
    },
    notes: "Curated lightweight pumice block entry for masonry-backed stability guards and regression coverage.",
    tags: ["pumice", "bims", "block", "masonry", "lightweight-mineral"]
  },
  {
    id: "silka_cs_block",
    name: "Silka CS Block",
    category: "mass",
    densityKgM3: 1753,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.02,
      notes: ["Nominal calcium-silicate block stiffness/damping for material-gap closure."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 12000000000
    },
    notes: "Curated calcium-silicate block entry for the official Xella Silka acoustic reference slice.",
    tags: ["silicate", "calcium-silicate", "sand-lime", "silka", "block", "masonry", "dense-mineral"]
  },
  {
    id: "solid_brick",
    name: "Solid Brick",
    category: "mass",
    densityKgM3: 1800,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.02,
      notes: ["Nominal fired-clay brick stiffness/damping for material-gap closure."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 15000000000
    },
    notes: "Ported from the Acoustic2 masonry catalog for solid fired-clay leaf studies.",
    tags: ["clay", "brick", "block", "masonry", "solid", "dense-mineral"]
  },
  {
    id: "hollow_brick",
    name: "Hollow Brick",
    category: "mass",
    densityKgM3: 1200,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.025,
      notes: ["Nominal hollow-brick stiffness/damping for uncalibrated masonry readiness."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 8000000000
    },
    notes: "Ported from the Acoustic2 masonry catalog for perforated clay block studies outside the verified manufacturer slices.",
    tags: ["clay", "brick", "block", "masonry", "perforated", "hollow"]
  },
  {
    id: "aac",
    name: "AAC Block",
    category: "mass",
    densityKgM3: 500,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.03,
      notes: ["Nominal generic AAC block stiffness/damping for material-gap closure."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 3000000000
    },
    notes: "Ported from the Acoustic2 base catalog as a generic AAC option when a branded density class is not known.",
    tags: ["aac", "autoclaved-aerated-concrete", "block", "masonry", "lightweight-mineral"]
  },
  {
    id: "porotherm_pls_100",
    name: "Porotherm PLS 100",
    category: "mass",
    densityKgM3: 950,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.02,
      notes: ["Nominal perforated clay block stiffness/damping for material-gap closure."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 8000000000
    },
    notes: "Curated perforated clay block entry for the official Wienerberger Porotherm acoustic declaration slice.",
    tags: ["porotherm", "wienerberger", "clay", "brick", "block", "perforated", "hollow", "masonry"]
  },
  {
    id: "porotherm_pls_140",
    name: "Porotherm PLS 140",
    category: "mass",
    densityKgM3: 850,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.02,
      notes: ["Nominal perforated clay block stiffness/damping for material-gap closure."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 8000000000
    },
    notes: "Curated perforated clay block entry for the official Wienerberger Porotherm acoustic declaration slice.",
    tags: ["porotherm", "wienerberger", "clay", "brick", "block", "perforated", "hollow", "masonry"]
  },
  {
    id: "porotherm_pls_190",
    name: "Porotherm PLS 190",
    category: "mass",
    densityKgM3: 850,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.02,
      notes: ["Nominal perforated clay block stiffness/damping for material-gap closure."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 8000000000
    },
    notes: "Curated perforated clay block entry for the official Wienerberger Porotherm acoustic declaration slice.",
    tags: ["porotherm", "wienerberger", "clay", "brick", "block", "perforated", "hollow", "masonry"]
  },
  {
    id: "heluz_14_brushed",
    name: "HELUZ 14 brousená",
    category: "mass",
    densityKgM3: 740,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.025,
      notes: ["Nominal HELUZ clay block stiffness/damping for material-gap closure."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 8000000000
    },
    notes: "Curated perforated clay internal-brick entry for the official HELUZ laboratory declaration slice.",
    tags: ["heluz", "clay", "brick", "block", "perforated", "hollow", "masonry", "internal-brick"]
  },
  {
    id: "heluz_aku_115",
    name: "HELUZ AKU 11.5",
    category: "mass",
    densityKgM3: 1070,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.025,
      notes: ["Nominal HELUZ acoustic clay block stiffness/damping for material-gap closure."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 8000000000
    },
    notes: "Curated acoustic clay brick entry for the official HELUZ AKU measured laboratory slice.",
    tags: ["heluz", "aku", "clay", "brick", "block", "perforated", "hollow", "masonry", "acoustic-brick"]
  },
  {
    id: "heluz_aku_200_p15",
    name: "HELUZ AKU 20 P15",
    category: "mass",
    densityKgM3: 1020,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.025,
      notes: ["Nominal HELUZ acoustic clay block stiffness/damping for material-gap closure."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 8000000000
    },
    notes: "Curated acoustic clay brick entry for the official HELUZ AKU measured laboratory slice.",
    tags: ["heluz", "aku", "clay", "brick", "block", "perforated", "hollow", "masonry", "acoustic-brick"]
  },
  {
    id: "heluz_aku_300_333_p20",
    name: "HELUZ AKU 30/33.3 P20",
    category: "mass",
    densityKgM3: 980,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.025,
      notes: ["Nominal HELUZ acoustic clay block stiffness/damping for material-gap closure."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 8000000000
    },
    notes: "Curated acoustic clay brick entry for the official HELUZ AKU measured laboratory slice.",
    tags: ["heluz", "aku", "clay", "brick", "block", "perforated", "hollow", "masonry", "acoustic-brick"]
  },
  {
    id: "clt_panel",
    name: "CLT Panel",
    category: "mass",
    densityKgM3: 470,
    acoustic: {
      behavior: "mass_timber",
      lossFactor: 0.025,
      notes: ["Nominal CLT stiffness is an isotropic placeholder for readiness checks; orthotropic calibration remains future work."],
      poissonRatio: 0.3,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 11000000000
    },
    tags: ["mass-timber", "structural"]
  },
  {
    id: "screed",
    name: "Mineral Screed",
    category: "mass",
    densityKgM3: 2000,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.02,
      notes: ["Nominal mineral screed properties for floor airborne/impact readiness."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 20000000000
    },
    tags: ["floor", "mass"]
  },
  {
    id: "anhydrite_screed",
    name: "Anhydrite Screed",
    category: "mass",
    densityKgM3: 2050,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.02,
      notes: ["Nominal anhydrite-screed stiffness/damping for floor material-readiness checks."],
      poissonRatio: 0.2,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 20000000000
    },
    notes: "Ported from the Acoustic2 floor catalog for calcium-sulfate floating screed build-ups.",
    tags: ["floor", "mass", "screed", "anhydrite"]
  },
  {
    id: "particleboard_flooring",
    name: "Particleboard Flooring",
    category: "mass",
    densityKgM3: 700,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.03,
      notes: ["Nominal particleboard deck stiffness/damping for floor material-gap closure."],
      poissonRatio: 0.3,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 4000000000
    },
    notes: "Ported from the Acoustic2 floor catalog for dry deck and subfloor build-ups.",
    tags: ["floor", "deck", "subfloor", "wood-board", "chipboard"]
  },
  {
    id: "osb",
    name: "OSB",
    category: "mass",
    densityKgM3: 650,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.025,
      notes: ["Nominal OSB deck stiffness/damping for floor and sheathing material-gap closure."],
      poissonRatio: 0.3,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 4000000000
    },
    notes: "Ported from the Acoustic2 timber catalog for deck, sheathing, and subfloor layers.",
    tags: ["deck", "subfloor", "wood-board", "structural", "timber"]
  },
  {
    id: "plywood",
    name: "Plywood",
    category: "mass",
    densityKgM3: 600,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.02,
      notes: ["Nominal plywood deck stiffness/damping for floor and sheathing material-gap closure."],
      poissonRatio: 0.3,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 9000000000
    },
    notes: "Ported from the Acoustic2 timber catalog for deck and sheathing layers.",
    tags: ["deck", "subfloor", "wood-board", "structural", "timber"]
  },
  {
    id: "vinyl_flooring",
    name: "Vinyl Flooring",
    category: "finish",
    densityKgM3: 1400,
    acoustic: {
      behavior: "limp_mass_membrane",
      lossFactor: 0.12,
      notes: ["Nominal resilient vinyl finish behavior for limp-mass and floor-finish readiness; not an exact impact product row."],
      propertySourceStatus: "engineering_default"
    },
    tags: ["finish", "resilient"]
  },
  {
    id: "ceramic_tile",
    name: "Ceramic Tile",
    category: "finish",
    densityKgM3: 2000,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.01,
      notes: ["Nominal ceramic tile stiffness/damping for hard-finish material readiness."],
      poissonRatio: 0.22,
      propertySourceStatus: "engineering_default",
      youngModulusPa: 50000000000
    },
    tags: ["finish", "hard-floor", "floor"]
  },
  {
    id: "mlv",
    name: "MLV Sound Barrier",
    category: "finish",
    densityKgM3: 1900,
    acoustic: {
      behavior: "limp_mass_membrane",
      lossFactor: 0.12,
      notes: ["Nominal limp-mass membrane behaviour; position-specific one-third-octave delta evidence is still required for exact promotion."],
      propertySourceStatus: "engineering_default"
    },
    notes: "Ported from the Acoustic2 membrane catalog for limp-mass barrier layers and local custom stack studies.",
    tags: ["membrane", "barrier", "limp-mass", "acoustic-barrier"]
  },
  {
    id: "bitumen_membrane",
    name: "Bitumen Membrane",
    category: "finish",
    densityKgM3: 1100,
    acoustic: {
      behavior: "limp_mass_membrane",
      lossFactor: 0.1,
      notes: ["Nominal bituminous membrane limp-mass behavior for material-gap closure."],
      propertySourceStatus: "engineering_default"
    },
    notes: "Ported from the Acoustic2 membrane catalog for bituminous isolation and barrier layers.",
    tags: ["membrane", "barrier", "bitumen", "acoustic-barrier"]
  },
  {
    id: "rockwool",
    name: "Rock Wool",
    category: "insulation",
    densityKgM3: 45,
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 15000,
      notes: ["Nominal porous absorber default for family physics; source-owned product flow-resistivity can replace it later."],
      porosity: 0.95,
      propertySourceStatus: "engineering_default"
    },
    tags: ["cavity-fill", "porous"]
  },
  {
    id: "high_density_rockwool",
    name: "High Density Rock Wool",
    category: "insulation",
    densityKgM3: 90,
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 30000,
      notes: ["Nominal high-density mineral-wool absorber default for model-first readiness checks."],
      porosity: 0.93,
      propertySourceStatus: "engineering_default"
    },
    notes: "Ported from the Acoustic2 infill catalog for denser cavity-fill and board-style mineral wool studies.",
    tags: ["cavity-fill", "porous", "rockwool", "high-density", "board-insulation"]
  },
  {
    id: "glasswool_board",
    name: "Glass Wool Board",
    category: "insulation",
    densityKgM3: 30,
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 10000,
      notes: ["Nominal glass-wool absorber default; not a source-owned product curve."],
      porosity: 0.97,
      propertySourceStatus: "engineering_default"
    },
    notes: "Ported from the Acoustic2 infill catalog for semi-rigid glass wool slab studies.",
    tags: ["cavity-fill", "porous", "glasswool", "board-insulation"]
  },
  {
    id: "nrc_glass_fiber_batt",
    name: "NRC 2024 Glass-Fiber Batt",
    category: "insulation",
    densityKgM3: 12,
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 10000,
      notes: [
        "Source-family identity absorber for the NRC 2024 internal-board triple-leaf calibration corridor.",
        "Do not use as a Rockwool/mineral-wool equivalence proof outside that corridor."
      ],
      porosity: 0.98,
      propertySourceStatus: "source_owned"
    },
    notes: "Represents the 92.1 mm glass-fiber batt named by the NRC 2024 internal gypsum double-stud source-family rows.",
    tags: ["cavity-fill", "porous", "glass-fiber", "nrc-2024", "triple-leaf-source-family"]
  },
  {
    id: "cellulose_fill",
    name: "Cellulose Fill",
    category: "insulation",
    densityKgM3: 45,
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 8000,
      notes: ["Nominal cellulose-fill flow resistivity and porosity for porous cavity readiness."],
      porosity: 0.98,
      propertySourceStatus: "engineering_default"
    },
    notes: "Ported from the Acoustic2 infill catalog for blown cellulose cavity studies.",
    tags: ["cavity-fill", "porous", "cellulose", "blown-in"]
  },
  {
    id: "wood_wool_panel",
    name: "Wood Wool Panel",
    category: "insulation",
    densityKgM3: 400,
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 50000,
      notes: ["Nominal wood-wool absorber flow resistivity for material-gap closure."],
      porosity: 0.75,
      propertySourceStatus: "engineering_default"
    },
    notes: "Ported from the Acoustic2 infill catalog for wood-wool acoustic board layers.",
    tags: ["cavity-fill", "wood-wool", "board-insulation", "porous"]
  },
  {
    id: "pet_felt",
    name: "PET Acoustic Felt",
    category: "insulation",
    densityKgM3: 180,
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 18000,
      notes: ["Nominal PET felt absorber flow resistivity and porosity for cavity readiness."],
      porosity: 0.9,
      propertySourceStatus: "engineering_default"
    },
    notes: "Ported from the Acoustic2 infill catalog for recycled polyester felt layers.",
    tags: ["cavity-fill", "felt", "polyester", "porous"]
  },
  {
    id: "air_gap",
    name: "Air Gap",
    category: "gap",
    densityKgM3: 0,
    acoustic: {
      behavior: "air_cavity",
      notes: ["Air cavity marker for family-material readiness; geometry remains supplied by layer/context thickness."],
      propertySourceStatus: "catalog_nominal"
    },
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
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: ["Nominal resilient-layer behaviour paired with the explicit impact dynamic stiffness value."],
      propertySourceStatus: "engineering_default"
    },
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
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: ["Nominal resilient-layer behaviour paired with the explicit s'=30 MN/m3 impact value."],
      propertySourceStatus: "engineering_default"
    },
    impact: {
      dynamicStiffnessMNm3: 30
    },
    notes: "Generic s'=30 MN/m3 resilient layer for explicit narrow heavy-floor impact estimates without implying an official product row.",
    tags: ["support", "resilient", "impact", "generic"]
  }
];

const PUBLIC_SOURCE_MATERIALS: readonly MaterialDefinition[] = [
  {
    id: "gyproc_wallboard_ten_12_5",
    name: "Gyproc WallBoard Ten 12.5 mm",
    category: "finish",
    densityKgM3: 808,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.03,
      notes: [
        "Density is derived from British Gypsum's public PDS minimum board weight of 10.1 kg/m2 at 12.5 mm.",
        "Elastic and damping values remain nominal panel-leaf defaults; do not treat this as a measured acoustic curve."
      ],
      poissonRatio: 0.25,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 2500000000
    },
    notes: "Public-source seed: https://www.british-gypsum.com/documents/product-data-sheet-pds/british-gypsum-pds-gyproc-wallboard-ten-12-5mm.pdf",
    tags: ["lining", "board", "gyproc", "wallboard-ten", "plasterboard", "public-source"]
  },
  {
    id: "gyproc_soundbloc_12_5",
    name: "Gyproc SoundBloc 12.5 mm",
    category: "finish",
    densityKgM3: 824,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.035,
      notes: [
        "Density is derived from British Gypsum's public PDS minimum board weight of 10.3 kg/m2 at 12.5 mm.",
        "Elastic and damping values remain nominal enhanced gypsum-board inputs; do not treat this as a measured acoustic curve."
      ],
      poissonRatio: 0.25,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 2800000000
    },
    notes: "Public-source seed: https://www.british-gypsum.com/documents/product-data-sheet-pds/british-gypsum-pds-gyproc-soundbloc-12-5mm.pdf",
    tags: ["lining", "board", "gyproc", "soundbloc", "plasterboard", "acoustic-board", "public-source"]
  },
  {
    id: "gyproc_soundbloc_15",
    name: "Gyproc SoundBloc 15 mm",
    category: "finish",
    densityKgM3: 867,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.035,
      notes: [
        "Density is derived from British Gypsum's public PDS minimum board weight of 13.0 kg/m2 at 15 mm.",
        "Elastic and damping values remain nominal enhanced gypsum-board inputs; do not treat this as a measured acoustic curve."
      ],
      poissonRatio: 0.25,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 2800000000
    },
    notes: "Public-source seed: https://www.british-gypsum.com/documents/product-data-sheet-pds/british-gypsum-pds-gyproc-soundbloc-15mm.pdf",
    tags: ["lining", "board", "gyproc", "soundbloc", "plasterboard", "acoustic-board", "public-source"]
  },
  {
    id: "gyproc_habito_12_5",
    name: "Gyproc Habito 12.5 mm",
    category: "finish",
    densityKgM3: 936,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.035,
      notes: [
        "Density is derived from British Gypsum's public PDS minimum board weight of 11.7 kg/m2 at 12.5 mm.",
        "Elastic and damping values remain nominal very-high-density gypsum-board inputs; do not treat this as a measured acoustic curve."
      ],
      poissonRatio: 0.25,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 3000000000
    },
    notes: "Public-source seed: https://www.british-gypsum.com/documents/product-data-sheet-pds/british-gypsum-pds-gyproc-habito-12-5mm.pdf",
    tags: ["lining", "board", "gyproc", "habito", "plasterboard", "impact-resistant-board", "public-source"]
  },
  {
    id: "gyproc_fireline_12_5",
    name: "Gyproc FireLine 12.5 mm",
    category: "finish",
    densityKgM3: 776,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.03,
      notes: [
        "Density is derived from British Gypsum's public PDS minimum board weight of 9.7 kg/m2 at 12.5 mm.",
        "Elastic and damping values remain nominal fire-rated gypsum-board inputs; do not treat this as a measured acoustic curve."
      ],
      poissonRatio: 0.25,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 2500000000
    },
    notes: "Public-source seed: https://www.british-gypsum.com/documents/product-data-sheet-pds/british-gypsum-pds-gyproc-fireline-12-5mm.pdf",
    tags: ["lining", "board", "gyproc", "fireline", "plasterboard", "fire-board", "public-source"]
  },
  {
    id: "knauf_pro_hd_12_5",
    name: "Knauf PRO HD 12.5 mm",
    category: "finish",
    densityKgM3: 992,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.035,
      notes: [
        "Density follows Knauf PRO HD public datasheet board-density row for 12.5 mm.",
        "Elastic and damping values remain nominal high-density gypsum board inputs."
      ],
      poissonRatio: 0.25,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 2800000000
    },
    notes: "Public-source seed: https://knauf.com/api/download-center/v1/assets/342853ac-e96a-433a-a0f5-5124dfedbed7?download=true",
    tags: ["lining", "board", "knauf", "pro-hd", "gypsum", "public-source"]
  },
  {
    id: "knauf_soundshield_plus_12_5",
    name: "Knauf Soundshield Plus 12.5 mm",
    category: "finish",
    densityKgM3: 920,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.035,
      notes: [
        "Density follows Knauf Soundshield Plus public datasheet board-density row for 12.5 mm.",
        "Elastic and damping values remain nominal enhanced gypsum board inputs."
      ],
      poissonRatio: 0.25,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 2800000000
    },
    notes: "Public-source seed: https://knauf.com/api/download-center/v1/assets/128d62d1-6570-4c71-9e2d-c93a46d4ab77?download=true",
    tags: ["lining", "board", "knauf", "soundshield-plus", "gypsum", "acoustic-board", "public-source"]
  },
  {
    id: "knauf_soundshield_plus_15",
    name: "Knauf Soundshield Plus 15 mm",
    category: "finish",
    densityKgM3: 887,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.035,
      notes: [
        "Density follows Knauf Soundshield Plus public datasheet board-density row for 15 mm.",
        "Elastic and damping values remain nominal enhanced gypsum board inputs."
      ],
      poissonRatio: 0.25,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 2800000000
    },
    notes: "Public-source seed: https://knauf.com/api/download-center/v1/assets/128d62d1-6570-4c71-9e2d-c93a46d4ab77?download=true",
    tags: ["lining", "board", "knauf", "soundshield-plus", "gypsum", "acoustic-board", "public-source"]
  },
  {
    id: "knauf_pro_hd_15",
    name: "Knauf PRO HD 15 mm",
    category: "finish",
    densityKgM3: 1013,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.035,
      notes: [
        "Density follows Knauf PRO HD public datasheet board-density row for 15 mm.",
        "Elastic and damping values remain nominal high-density gypsum board inputs."
      ],
      poissonRatio: 0.25,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 2800000000
    },
    notes: "Public-source seed: https://knauf.com/api/download-center/v1/assets/342853ac-e96a-433a-a0f5-5124dfedbed7?download=true",
    tags: ["lining", "board", "knauf", "pro-hd", "gypsum", "public-source"]
  },
  {
    id: "quietrock_510",
    name: "QuietRock 510",
    category: "finish",
    densityKgM3: 819,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.06,
      notes: [
        "Density is derived from PABCO QuietRock 510 public datasheet approximate weight of 2.13 lb/ft2 at 1/2 in.",
        "The higher damping input is nominal for the viscoelastic laminated board family; it is not a measured acoustic curve."
      ],
      poissonRatio: 0.25,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 2500000000
    },
    notes: "Public-source seed: https://pabcogypsum.com/cms/resources/media/2022/12/QuietRock_510_Datasheet.pdf",
    tags: ["lining", "board", "quietrock", "pabco", "damped-gypsum", "acoustic-board", "public-source"]
  },
  {
    id: "quietrock_530",
    name: "QuietRock 530",
    category: "finish",
    densityKgM3: 884,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.06,
      notes: [
        "Density is derived from PABCO QuietRock 530 public datasheet approximate weight of 2.88 lb/ft2 at 5/8 in.",
        "The higher damping input is nominal for the viscoelastic laminated board family; it is not a measured acoustic curve."
      ],
      poissonRatio: 0.25,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 2500000000
    },
    notes: "Public-source seed: https://pabcogypsum.com/cms/resources/media/2022/12/QuietRock_530_Datasheet.pdf",
    tags: ["lining", "board", "quietrock", "pabco", "damped-gypsum", "acoustic-board", "public-source"]
  },
  {
    id: "fermacell_gypsum_fibreboard_1150",
    name: "fermacell Gypsum Fibreboard",
    category: "finish",
    densityKgM3: 1150,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.035,
      notes: [
        "Density is the midpoint of the public fermacell gypsum-fibreboard 1150 +/- 50 kg/m3 range.",
        "Elastic and damping values remain nominal dense board inputs."
      ],
      poissonRatio: 0.25,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 3500000000
    },
    notes: "Public-source seed: https://www.fermacell.co.uk/fermacellapi/downloads/file/en-GB/0690J000004BxHIQA0",
    tags: ["lining", "board", "gypsum-fibre", "fermacell", "dry-floor", "public-source"]
  },
  {
    id: "fiber_cement_board_1290",
    name: "Fiber Cement Board 1290",
    category: "finish",
    densityKgM3: 1290,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.02,
      notes: ["Density follows the FSRI public materials database row for 8.5 mm fiber cement board."],
      poissonRatio: 0.2,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 8000000000
    },
    notes: "Public-source seed: https://materials.fsri.org/materialdetail/fiber-cement-board",
    tags: ["lining", "board", "fiber-cement", "cement-board", "public-source"]
  },
  {
    id: "osb_3_640",
    name: "OSB 3 640",
    category: "mass",
    densityKgM3: 640,
    acoustic: {
      behavior: "panel_leaf",
      lossFactor: 0.025,
      notes: ["Density follows the Canadian Wood Council OSB sizes note basis of 640 kg/m3."],
      poissonRatio: 0.3,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 4000000000
    },
    notes: "Public-source seed: https://cwc.ca/wp-content/uploads/2019/03/Oriented-Strand-Board-OSB-Sizes.pdf",
    tags: ["deck", "subfloor", "wood-board", "osb", "structural", "timber", "public-source"]
  },
  {
    id: "stora_enso_clt_490",
    name: "Stora Enso CLT 490",
    category: "mass",
    densityKgM3: 490,
    acoustic: {
      behavior: "mass_timber",
      lossFactor: 0.025,
      notes: [
        "Density follows the Stora Enso CLT public technical product data row.",
        "The stiffness input remains the catalog nominal isotropic mass-timber placeholder; orthotropic CLT calibration is separate."
      ],
      poissonRatio: 0.3,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 11000000000
    },
    notes: "Public-source seed: https://www.storaenso.com/en/products/mass-timber-construction/building-products/clt",
    tags: ["mass-timber", "structural", "clt", "stora-enso", "public-source"]
  },
  {
    id: "hh_celcon_solar_460",
    name: "H+H Celcon Solar Grade 460",
    category: "mass",
    densityKgM3: 460,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.03,
      notes: [
        "Density follows the current H+H Celcon Solar Grade public product/data rows.",
        "This product-specific public seed does not replace the older Celcon acoustic-reference-slice material ids."
      ],
      poissonRatio: 0.2,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 3000000000
    },
    notes: "Public-source seed: https://www.hhcelcon.co.uk/products-applications/products/solar-grade-blocks",
    tags: ["aac", "aircrete", "celcon", "h+h", "block", "masonry", "lightweight-mineral", "public-source"]
  },
  {
    id: "hh_celcon_standard_600",
    name: "H+H Celcon Standard Grade 600",
    category: "mass",
    densityKgM3: 600,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.03,
      notes: [
        "Density follows the current H+H Celcon Standard Grade public product/data rows.",
        "This product-specific public seed does not replace the older Celcon acoustic-reference-slice material ids."
      ],
      poissonRatio: 0.2,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 3200000000
    },
    notes: "Public-source seed: https://www.hhcelcon.co.uk/products-applications/products/standard-grade-blocks",
    tags: ["aac", "aircrete", "celcon", "h+h", "block", "masonry", "lightweight-mineral", "public-source"]
  },
  {
    id: "hh_celcon_high_strength_730",
    name: "H+H Celcon High Strength Grade 730",
    category: "mass",
    densityKgM3: 730,
    acoustic: {
      behavior: "rigid_mass",
      lossFactor: 0.03,
      notes: [
        "Density follows the current H+H Celcon High Strength public product/data rows.",
        "This product-specific public seed does not replace the older Celcon acoustic-reference-slice material ids."
      ],
      poissonRatio: 0.2,
      propertySourceStatus: "catalog_nominal",
      youngModulusPa: 3500000000
    },
    notes: "Public-source seed: https://www.hhcelcon.co.uk/products-applications/products/high-strength-grade-blocks",
    tags: ["aac", "aircrete", "celcon", "h+h", "block", "masonry", "lightweight-mineral", "public-source"]
  },
  {
    id: "tecsound_sy_35",
    name: "TECSOUND SY 35",
    category: "finish",
    densityKgM3: 2000,
    acoustic: {
      behavior: "limp_mass_membrane",
      lossFactor: 0.12,
      notes: [
        "Density is derived from SOPREMA TECSOUND SY 35 area weight of 3.5 kg/m2 at 1.75 mm.",
        "Limp-mass damping remains nominal until product-specific frequency data is source-owned."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    notes: "Public-source seed: https://www.soprema.co.uk/products/tecsound-sy",
    tags: ["membrane", "barrier", "limp-mass", "tecsound", "soprema", "self-adhesive", "public-source"]
  },
  {
    id: "tecsound_sy_50",
    name: "TECSOUND SY 50",
    category: "finish",
    densityKgM3: 2000,
    acoustic: {
      behavior: "limp_mass_membrane",
      lossFactor: 0.12,
      notes: [
        "Density is derived from SOPREMA TECSOUND SY 50 area weight of 5 kg/m2 at 2.5 mm.",
        "Limp-mass damping remains nominal until product-specific frequency data is source-owned."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    notes: "Public-source seed: https://www.soprema.co.uk/products/tecsound-sy",
    tags: ["membrane", "barrier", "limp-mass", "tecsound", "soprema", "self-adhesive", "public-source"]
  },
  {
    id: "tecsound_sy_70",
    name: "TECSOUND SY 70",
    category: "finish",
    densityKgM3: 2000,
    acoustic: {
      behavior: "limp_mass_membrane",
      lossFactor: 0.12,
      notes: [
        "Density is derived from SOPREMA TECSOUND SY 70 area weight of 7 kg/m2 at 3.5 mm.",
        "Limp-mass damping remains nominal until product-specific frequency data is source-owned."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    notes: "Public-source seed: https://www.soprema.co.uk/products/tecsound-sy",
    tags: ["membrane", "barrier", "limp-mass", "tecsound", "soprema", "self-adhesive", "public-source"]
  },
  {
    id: "tecsound_sy_100",
    name: "TECSOUND SY 100",
    category: "finish",
    densityKgM3: 2000,
    acoustic: {
      behavior: "limp_mass_membrane",
      lossFactor: 0.12,
      notes: [
        "Density is derived from SOPREMA TECSOUND SY 100 area weight of 10 kg/m2 at 5 mm.",
        "Limp-mass damping remains nominal until product-specific frequency data is source-owned."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    notes: "Public-source seed: https://www.soprema.co.uk/products/tecsound-sy",
    tags: ["membrane", "barrier", "limp-mass", "tecsound", "soprema", "self-adhesive", "public-source"]
  },
  {
    id: "rockwool_rwa45",
    name: "ROCKWOOL RWA45",
    category: "insulation",
    densityKgM3: 45,
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 15000,
      notes: [
        "Density follows ROCKWOOL's public RW Slabs NBS specification.",
        "Flow resistivity is an engineering nominal for wall-cavity readiness and is not a ROCKWOOL-declared value."
      ],
      porosity: 0.95,
      propertySourceStatus: "engineering_default"
    },
    notes: "Public-source density seed: https://www.rockwool.com/syssiteassets/rw-uk/downloads/nbs-specifications/rockwool-insulation-slabs--rwa45--rw3-rw4-rw5-rw6---nbs-specification.pdf",
    tags: ["cavity-fill", "porous", "rockwool", "rwa45", "stone-wool", "public-source"]
  },
  {
    id: "rockwool_rw3",
    name: "ROCKWOOL RW3",
    category: "insulation",
    densityKgM3: 60,
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 28000,
      notes: [
        "Density follows ROCKWOOL's public RW Slabs NBS specification.",
        "Flow resistivity is a dense-mineral-wool engineering nominal and is not a ROCKWOOL-declared value."
      ],
      porosity: 0.94,
      propertySourceStatus: "engineering_default"
    },
    notes: "Public-source density seed: https://www.rockwool.com/syssiteassets/rw-uk/downloads/nbs-specifications/rockwool-insulation-slabs--rwa45--rw3-rw4-rw5-rw6---nbs-specification.pdf",
    tags: ["cavity-fill", "porous", "rockwool", "rw3", "stone-wool", "public-source"]
  },
  {
    id: "rockwool_rw4",
    name: "ROCKWOOL RW4",
    category: "insulation",
    densityKgM3: 80,
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 42000,
      notes: [
        "Density follows ROCKWOOL's public RW Slabs NBS specification.",
        "Flow resistivity is a dense-mineral-wool engineering nominal and is not a ROCKWOOL-declared value."
      ],
      porosity: 0.93,
      propertySourceStatus: "engineering_default"
    },
    notes: "Public-source density seed: https://www.rockwool.com/syssiteassets/rw-uk/downloads/nbs-specifications/rockwool-insulation-slabs--rwa45--rw3-rw4-rw5-rw6---nbs-specification.pdf",
    tags: ["cavity-fill", "porous", "rockwool", "rw4", "stone-wool", "public-source"]
  },
  {
    id: "rockwool_rw5",
    name: "ROCKWOOL RW5",
    category: "insulation",
    densityKgM3: 100,
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 50000,
      notes: [
        "Density follows ROCKWOOL's public RW Slabs NBS specification.",
        "Flow resistivity is a dense-mineral-wool engineering nominal and is not a ROCKWOOL-declared value."
      ],
      porosity: 0.92,
      propertySourceStatus: "engineering_default"
    },
    notes: "Public-source density seed: https://www.rockwool.com/syssiteassets/rw-uk/downloads/nbs-specifications/rockwool-insulation-slabs--rwa45--rw3-rw4-rw5-rw6---nbs-specification.pdf",
    tags: ["cavity-fill", "porous", "rockwool", "rw5", "stone-wool", "public-source"]
  },
  {
    id: "rockwool_rw6",
    name: "ROCKWOOL RW6",
    category: "insulation",
    densityKgM3: 140,
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 70000,
      notes: [
        "Density follows ROCKWOOL's public RW Slabs NBS specification.",
        "Flow resistivity is a dense-mineral-wool engineering nominal and is not a ROCKWOOL-declared value."
      ],
      porosity: 0.9,
      propertySourceStatus: "engineering_default"
    },
    notes: "Public-source density seed: https://www.rockwool.com/syssiteassets/rw-uk/downloads/nbs-specifications/rockwool-insulation-slabs--rwa45--rw3-rw4-rw5-rw6---nbs-specification.pdf",
    tags: ["cavity-fill", "porous", "rockwool", "rw6", "stone-wool", "public-source"]
  },
  {
    id: "rockwool_afb_40",
    name: "ROCKWOOL AFB 40",
    category: "insulation",
    densityKgM3: 40,
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 14000,
      notes: [
        "Density follows ROCKWOOL AFB public brochure nominal density of 40 kg/m3.",
        "Flow resistivity is an engineering nominal for porous absorber modelling and is not declared in that brochure."
      ],
      porosity: 0.95,
      propertySourceStatus: "engineering_default"
    },
    notes: "Public-source density seed: https://www.rockwool.com/siteassets/o2-rockwool/documentation/brochures/commercial/afb-acoustical-fire-batts-steel-studs-brochure.pdf",
    tags: ["cavity-fill", "porous", "rockwool", "afb", "stone-wool", "north-america", "public-source"]
  },
  {
    id: "owens_corning_703",
    name: "Owens Corning 703 Fiberglas Board",
    category: "insulation",
    densityKgM3: 48,
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 17000,
      notes: [
        "Density follows the public Owens Corning 700 Series Fiberglas data sheet for Type 703.",
        "Flow resistivity is an engineering nominal for porous absorber modelling and is not declared in that PDS."
      ],
      porosity: 0.95,
      propertySourceStatus: "engineering_default"
    },
    notes: "Public-source density seed: https://images-na.ssl-images-amazon.com/images/I/81DnaCijLgL.pdf",
    tags: ["cavity-fill", "porous", "glass-fiber", "fiberglass", "oc703", "public-source"]
  },
  {
    id: "owens_corning_705",
    name: "Owens Corning 705 Fiberglas Board",
    category: "insulation",
    densityKgM3: 96,
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 30000,
      notes: [
        "Density follows the public Owens Corning 700 Series Fiberglas data sheet for Type 705.",
        "Flow resistivity is an engineering nominal for porous absorber modelling and is not declared in that PDS."
      ],
      porosity: 0.93,
      propertySourceStatus: "engineering_default"
    },
    notes: "Public-source density seed: https://images-na.ssl-images-amazon.com/images/I/81DnaCijLgL.pdf",
    tags: ["cavity-fill", "porous", "glass-fiber", "fiberglass", "oc705", "public-source"]
  },
  {
    id: "knauf_acoustic_roll_034",
    name: "Knauf Acoustic Roll 034",
    category: "insulation",
    densityKgM3: 24,
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 8000,
      notes: [
        "Density follows Knauf Acoustic Roll 034 public datasheet sound-absorption table.",
        "Flow resistivity is a lightweight glass/mineral-wool engineering nominal and is not declared in that datasheet."
      ],
      porosity: 0.97,
      propertySourceStatus: "engineering_default"
    },
    notes: "Public-source density seed: https://knauf.com/api/download-center/v1/assets/5175ffea-ad6f-4656-acfd-438c97824556?download=true",
    tags: ["cavity-fill", "porous", "knauf", "acoustic-roll", "mineral-wool", "public-source"]
  },
  {
    id: "basotect_melamine_foam",
    name: "Basotect Melamine Foam",
    category: "insulation",
    densityKgM3: 9,
    acoustic: {
      absorberClass: "porous_absorptive",
      behavior: "porous_absorber",
      flowResistivityPaSM2: 10000,
      notes: [
        "Density follows BASF's public Basotect melamine-resin foam article.",
        "Flow resistivity is an engineering nominal because the public article describes flow resistance qualitatively."
      ],
      porosity: 0.99,
      propertySourceStatus: "engineering_default"
    },
    notes: "Public-source density seed: https://download.basf.com/p1/8a8081c57fd4b609017fd65cf6376e78/en/Melamine_Resin_Foam_-_Lightweight%252C_Versatile_All-Rounder",
    tags: ["porous", "foam", "melamine", "basotect", "room-acoustics", "public-source"]
  },
  {
    id: "eps_70_insulation_board",
    name: "EPS 70 Insulation Board",
    category: "insulation",
    densityKgM3: 15,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: ["Density follows the public EPS flooring insulation datasheet EPS 70 nominal-density row."],
      propertySourceStatus: "catalog_nominal"
    },
    notes: "Public-source seed: https://www.engineeredfoamproducts.com/wp-content/uploads/2021/05/EFP-EPS-Technical-Datasheet-Expanded-Polystyrene.pdf",
    tags: ["eps", "rigid-board", "floor-insulation", "upper-fill", "public-source"]
  },
  {
    id: "eps_100_insulation_board",
    name: "EPS 100 Insulation Board",
    category: "insulation",
    densityKgM3: 20,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: ["Density follows the public EPS flooring insulation datasheet EPS 100 nominal-density row."],
      propertySourceStatus: "catalog_nominal"
    },
    notes: "Public-source seed: https://www.engineeredfoamproducts.com/wp-content/uploads/2021/05/EFP-EPS-Technical-Datasheet-Expanded-Polystyrene.pdf",
    tags: ["eps", "rigid-board", "floor-insulation", "upper-fill", "public-source"]
  },
  {
    id: "eps_150_insulation_board",
    name: "EPS 150 Insulation Board",
    category: "insulation",
    densityKgM3: 25,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: ["Density follows the public EPS flooring insulation datasheet EPS 150 nominal-density row."],
      propertySourceStatus: "catalog_nominal"
    },
    notes: "Public-source seed: https://www.engineeredfoamproducts.com/wp-content/uploads/2021/05/EFP-EPS-Technical-Datasheet-Expanded-Polystyrene.pdf",
    tags: ["eps", "rigid-board", "floor-insulation", "upper-fill", "public-source"]
  },
  {
    id: "xps_foam_board_40",
    name: "XPS Foam Board 40",
    category: "insulation",
    densityKgM3: 40,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: ["Density follows the public CTCN XPS foam board 38-40 kg/m3 product row, rounded to 40 kg/m3."],
      propertySourceStatus: "catalog_nominal"
    },
    notes: "Public-source seed: https://www.ctc-n.org/products/xps-foam-board",
    tags: ["xps", "rigid-board", "floor-insulation", "upper-fill", "public-source"]
  },
  {
    id: "pir_board_30",
    name: "PIR Board 30",
    category: "insulation",
    densityKgM3: 30,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: ["Density follows the public termPIR MAX 19 AL technical-data row."],
      propertySourceStatus: "catalog_nominal"
    },
    notes: "Public-source seed: https://termpir.eu/en_en/produkty/plyty-izolacyjne-termpir/termpirlt-supgt-reg-lt-/supgt-max-19-al",
    tags: ["pir", "rigid-board", "floor-insulation", "upper-fill", "public-source"]
  },
  {
    id: "cork_underlay_184",
    name: "Cork Underlay 184",
    category: "support",
    densityKgM3: 184,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: ["Density follows Jelinek QuietCORK public underlayment specifications."],
      propertySourceStatus: "catalog_nominal"
    },
    notes: "Public-source seed: https://jelinek.com/quietcork-underlayment-specifications",
    tags: ["resilient", "underlay", "cork", "floor", "public-source"]
  },
  {
    id: "regufoam_sound_10",
    name: "REGUFOAM sound 10",
    category: "support",
    densityKgM3: 135,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Density is derived from REGUPOL's public 2.3 kg/m2 area weight at 17 mm.",
        "Dynamic stiffness follows the public product page as an upper-bound value, so the seeded value is the conservative formula input.",
        "Use this as an impact resilient layer, not as an airborne mass contribution."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 6
    },
    notes: "Public-source seed: https://acoustics.regupol.com/products/range/regupol-sound/regufoam-sound-10/",
    tags: ["resilient", "underlay", "impact", "regupol", "regufoam", "sound", "public-source"]
  },
  {
    id: "regupol_sound_12",
    name: "REGUPOL sound 12",
    category: "support",
    densityKgM3: 0,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Dynamic stiffness follows REGUPOL sound public product-family table; mass density is not declared in the source page.",
        "The public table publishes s' as an upper-bound value, so the seeded value is the conservative formula input.",
        "Use this as an impact resilient layer, not as an airborne mass contribution."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 6
    },
    notes: "Public-source seed: https://acoustics.regupol.com/products/range/regupol-sound/",
    tags: ["resilient", "underlay", "impact", "regupol", "sound", "public-source"]
  },
  {
    id: "regupol_sound_15",
    name: "REGUPOL sound 15",
    category: "support",
    densityKgM3: 0,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Dynamic stiffness follows REGUPOL sound public product-family table; mass density is not declared in the source page.",
        "The public table publishes s' as an upper-bound value, so the seeded value is the conservative formula input.",
        "Use this as an impact resilient layer, not as an airborne mass contribution."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 6
    },
    notes: "Public-source seed: https://acoustics.regupol.com/products/range/regupol-sound/",
    tags: ["resilient", "underlay", "impact", "regupol", "sound", "public-source"]
  },
  {
    id: "regupol_sound_17",
    name: "REGUPOL sound 17",
    category: "support",
    densityKgM3: 0,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Dynamic stiffness follows REGUPOL sound public product-family table; mass density is not declared in the source page.",
        "The public table publishes s' as an upper-bound value, so the seeded value is the conservative formula input.",
        "Use this as an impact resilient layer, not as an airborne mass contribution."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 19
    },
    notes: "Public-source seed: https://acoustics.regupol.com/products/range/regupol-sound/",
    tags: ["resilient", "underlay", "impact", "regupol", "sound", "public-source"]
  },
  {
    id: "regupol_sound_47",
    name: "REGUPOL sound 47",
    category: "support",
    densityKgM3: 0,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Dynamic stiffness follows REGUPOL sound public product-family table; mass density is not declared in the source page.",
        "The public table publishes s' as an upper-bound value, so the seeded value is the conservative formula input.",
        "Use this as an impact resilient layer, not as an airborne mass contribution."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 30
    },
    notes: "Public-source seed: https://acoustics.regupol.com/products/range/regupol-sound/",
    tags: ["resilient", "underlay", "impact", "regupol", "sound", "public-source"]
  },
  {
    id: "regupol_comfort_8",
    name: "REGUPOL comfort 8",
    category: "support",
    densityKgM3: 325,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Density is derived from the ETA mass-per-unit-area midpoint of 2.6 kg/m2 at 8 mm.",
        "Dynamic stiffness follows REGUPOL's public comfort 8 product page."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 15
    },
    notes: "Public-source seed: https://acoustics.regupol.com/products/range/regupol-comfort/regupol-comfort-8/",
    tags: ["resilient", "underlay", "impact", "regupol", "comfort", "public-source"]
  },
  {
    id: "regupol_comfort_12",
    name: "REGUPOL comfort 12",
    category: "support",
    densityKgM3: 250,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Density is derived from the ETA mass-per-unit-area midpoint of 3.0 kg/m2 at 12 mm.",
        "Dynamic stiffness follows REGUPOL's public comfort 12 product page."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 10
    },
    notes: "Public-source seed: https://acoustics.regupol.com/products/range/regupol-comfort/regupol-comfort-12/",
    tags: ["resilient", "underlay", "impact", "regupol", "comfort", "public-source"]
  },
  {
    id: "regupol_sound_and_drain_22",
    name: "REGUPOL sound and drain 22",
    category: "support",
    densityKgM3: 0,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Dynamic stiffness follows REGUPOL sound and drain 22 public product page; mass density is not declared in the source page.",
        "Use this as an impact resilient layer, not as an airborne mass contribution."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 21
    },
    notes: "Public-source seed: https://acoustics.regupol.com/products/range/regupol-sound-and-drain/regupol-sound-and-drain-22/",
    tags: ["resilient", "underlay", "impact", "regupol", "sound-and-drain", "public-source"]
  },
  {
    id: "isolgomma_upgrei",
    name: "Isolgomma UPGREI",
    category: "support",
    densityKgM3: 265,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Density is derived from Isolgomma's public 2.65 kg/m2 area weight at 10 mm.",
        "Dynamic stiffness follows the public product page; use this as an impact resilient layer, not as an airborne mass contribution."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 6
    },
    notes: "Public-source seed: https://www.isolgomma.com/product/upgrei/",
    tags: ["resilient", "underlay", "impact", "isolgomma", "upgrei", "public-source"]
  },
  {
    id: "isolgomma_uproll",
    name: "Isolgomma UPROLL",
    category: "support",
    densityKgM3: 344,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Density is derived from Isolgomma's public 3.10 kg/m2 area weight at 9 mm.",
        "Dynamic stiffness follows the public product page; use this as an impact resilient layer, not as an airborne mass contribution."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 11
    },
    notes: "Public-source seed: https://www.isolgomma.com/product/uproll/",
    tags: ["resilient", "underlay", "impact", "isolgomma", "uproll", "public-source"]
  },
  {
    id: "isolgomma_grei",
    name: "Isolgomma GREI",
    category: "support",
    densityKgM3: 400,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Density is derived from Isolgomma's public 2.80 kg/m2 area weight at 7 mm.",
        "Dynamic stiffness follows the public product page; use this as an impact resilient layer, not as an airborne mass contribution."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 8
    },
    notes: "Public-source seed: https://www.isolgomma.com/product/grei/",
    tags: ["resilient", "underlay", "impact", "isolgomma", "grei", "public-source"]
  },
  {
    id: "isolgomma_roll",
    name: "Isolgomma ROLL",
    category: "support",
    densityKgM3: 380,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Density is derived from Isolgomma's public 1.90 kg/m2 area weight at 5 mm.",
        "Dynamic stiffness follows the public product page; use this as an impact resilient layer, not as an airborne mass contribution."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 21
    },
    notes: "Public-source seed: https://www.isolgomma.com/product/roll/",
    tags: ["resilient", "underlay", "impact", "isolgomma", "roll", "public-source"]
  },
  {
    id: "isolgomma_highmat_30",
    name: "Isolgomma HIGHMAT 30",
    category: "support",
    densityKgM3: 63,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Effective density is derived from Isolgomma's public 1.90 kg/m2 superficial weight at 30 mm.",
        "Dynamic stiffness follows Isolgomma's official technical data. The technical data publishes DeltaLw 36 dB, but the live catalog row stays withheld until the matcher can encode the required screed thickness and density boundary."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 4
    },
    notes:
      "Public-source seed: https://www.isolgomma.com/downloads/technical-data/Isolgomma_Highmat_30-EN.pdf",
    tags: ["resilient", "underlay", "impact", "isolgomma", "highmat", "public-source"]
  },
  {
    id: "isolgomma_bifloor",
    name: "Isolgomma BIFLOOR",
    category: "support",
    densityKgM3: 68,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Effective density is derived from Isolgomma's public 1.90 kg/m2 superficial weight at 28 mm.",
        "Dynamic stiffness follows the public product page; use this as an impact resilient layer, not as an airborne mass contribution."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 10
    },
    notes: "Public-source seed: https://www.isolgomma.com/product/bifloor/",
    tags: ["resilient", "underlay", "impact", "isolgomma", "bifloor", "public-source"]
  },
  {
    id: "isolgomma_sylcer_3",
    name: "Isolgomma SYLCER 3",
    category: "support",
    densityKgM3: 820,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Density and 2.46 kg/m2 superficial weight follow Isolgomma's official technical data.",
        "Dynamic stiffness and DeltaLw follow the official technical data; use the live catalog DeltaLw row only for the bonded ceramic-tile stack shape."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 180
    },
    notes:
      "Public-source seed: https://www.isolgomma.com/downloads/technical-data/Isolgomma_Sylcer-EN.pdf",
    tags: ["resilient", "underlay", "impact", "isolgomma", "sylcer", "public-source"]
  },
  {
    id: "schluter_ditra_sound",
    name: "Schluter DITRA-SOUND",
    category: "support",
    densityKgM3: 0,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "The official brochure declares 3.5 mm thickness and a tested 13 dB impact-sound reduction, but not density or dynamic stiffness.",
        "Use this product through the official impact catalog DeltaLw lane, not through the dynamic-stiffness formula route."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    notes:
      "Public-source seed: https://assets.schluter.com/asset/570120892212/document_bd9ftlao5926r0vrla5ukp4b77/552264_Prospekt_Ditra_Sound_GB?content-disposition=inline",
    tags: ["resilient", "underlay", "impact", "schluter", "ditra-sound", "tile", "public-source"]
  },
  {
    id: "damtec_estra_6",
    name: "DAMTEC estra 6 mm",
    category: "support",
    densityKgM3: 717,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Density is derived from the official 3.87-4.73 kg/m2 area-weight range midpoint at 6 mm.",
        "Dynamic stiffness follows the official under-screed brochure. DeltaLw values are not seeded here because they depend on screed thickness and surface mass."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 70
    },
    notes:
      "Public-source seed: https://www.kraiburg-relastec.com/damtec/wp-content/uploads/sites/2/2019/09/DAMTEC_under_screed_EN_v1_2019.pdf",
    tags: ["resilient", "underlay", "impact", "damtec", "estra", "public-source"]
  },
  {
    id: "damtec_estra_8",
    name: "DAMTEC estra 8 mm",
    category: "support",
    densityKgM3: 717,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Density is derived from the official 5.16-6.31 kg/m2 area-weight range midpoint at 8 mm.",
        "Dynamic stiffness follows the official under-screed brochure. DeltaLw values are not seeded here because they depend on screed thickness and surface mass."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 60
    },
    notes:
      "Public-source seed: https://www.kraiburg-relastec.com/damtec/wp-content/uploads/sites/2/2019/09/DAMTEC_under_screed_EN_v1_2019.pdf",
    tags: ["resilient", "underlay", "impact", "damtec", "estra", "public-source"]
  },
  {
    id: "damtec_estra_3d_8_4",
    name: "DAMTEC estra 3D 8/4",
    category: "support",
    densityKgM3: 538,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Effective density is derived from the official 3.87-4.73 kg/m2 area-weight range midpoint at 8 mm nominal thickness.",
        "Dynamic stiffness follows the official under-screed brochure. DeltaLw values are not seeded here because they depend on screed thickness and surface mass."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 20
    },
    notes:
      "Public-source seed: https://www.kraiburg-relastec.com/damtec/wp-content/uploads/sites/2/2019/09/DAMTEC_under_screed_EN_v1_2019.pdf",
    tags: ["resilient", "underlay", "impact", "damtec", "estra-3d", "public-source"]
  },
  {
    id: "damtec_3d_17_8",
    name: "DAMTEC 3D 17/8",
    category: "support",
    densityKgM3: 550,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: [
        "Density uses the midpoint of the official 500-600 kg/m3 area-weight/density row for DAMTEC 3D 17/8.",
        "Dynamic stiffness follows the official under-screed brochure. DeltaLw values are not seeded here because they depend on screed thickness, layer count, and surface mass."
      ],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 15
    },
    notes:
      "Public-source seed: https://www.kraiburg-relastec.com/damtec/wp-content/uploads/sites/2/2019/09/DAMTEC_under_screed_EN_v1_2019.pdf",
    tags: ["resilient", "underlay", "impact", "damtec", "3d-17-8", "public-source"]
  },
  {
    id: "forbo_sarlon_19_db",
    name: "Forbo Sarlon 19 dB Acoustic Vinyl",
    category: "finish",
    densityKgM3: 0,
    notes:
      "Public-source seed: https://www.forbo.com/flooring/en-gl/products/acoustic-flooring/sarlon-19-db-acoustic-vinyl/bdqcop. Use as a floor_covering identity material only; the product DeltaLw lane stays parked until thickness/test-system boundaries are encoded. Density is not seeded from this source and must not be used as an airborne mass contribution.",
    tags: ["floor-finish", "acoustic-vinyl", "impact", "forbo", "sarlon", "public-source"]
  },
  {
    id: "forbo_sarlon_15_db",
    name: "Forbo Sarlon 15 dB Acoustic Vinyl",
    category: "finish",
    densityKgM3: 0,
    notes:
      "Public-source seed: https://www.forbo.com/flooring/en-gl/products/acoustic-flooring/sarlon-15-db-acoustic-vinyl/buxjuc. Use as a floor_covering identity material only; the product DeltaLw lane stays parked until thickness/test-system boundaries are encoded. Density is not seeded from this source and must not be used as an airborne mass contribution.",
    tags: ["floor-finish", "acoustic-vinyl", "impact", "forbo", "sarlon", "public-source"]
  },
  {
    id: "forbo_eternal_de_luxe_acoustic",
    name: "Forbo Eternal de Luxe Acoustic",
    category: "finish",
    densityKgM3: 0,
    notes:
      "Public-source seed: https://www.forbo.com/flooring/en-gl/products/acoustic-flooring/eternal-de-luxe-design-vinyl/bxm0k2. Use as a floor_covering identity material only; the product DeltaLw lane stays parked until thickness/test-system boundaries are encoded. Density is not seeded from this source and must not be used as an airborne mass contribution.",
    tags: ["floor-finish", "acoustic-vinyl", "impact", "forbo", "eternal", "public-source"]
  },
  {
    id: "forbo_modulup_19_db",
    name: "Forbo Modul'up 19 dB Loose Lay Vinyl",
    category: "finish",
    densityKgM3: 0,
    notes:
      "Public-source seed: https://www.forbo.com/flooring/en-gl/products/heterogeneous-vinyl/modul-up-19-db-loose-lay-vinyl/bxnlic. Use as a floor_covering identity material only; the product DeltaLw lane stays parked until thickness/test-system boundaries are encoded. Density is not seeded from this source and must not be used as an airborne mass contribution.",
    tags: ["floor-finish", "acoustic-vinyl", "impact", "forbo", "modulup", "loose-lay", "public-source"]
  },
  {
    id: "tarkett_comfort_acoustic_19_db",
    name: "Tarkett Comfort Acoustic 19 dB",
    category: "finish",
    densityKgM3: 0,
    notes:
      "Public-source seed: https://professionals.tarkett.co.uk/en_GB/collection-C002828-comfort-acoustic-35-residential. Use as a floor_covering layer through the official impact catalog DeltaLw lane; density is not seeded from this source and must not be used as an airborne mass contribution.",
    tags: ["floor-finish", "acoustic-vinyl", "impact", "tarkett", "comfort-acoustic", "public-source"]
  },
  {
    id: "tarkett_iq_optima_acoustic_16_db",
    name: "Tarkett iQ Optima Acoustic 16 dB",
    category: "finish",
    densityKgM3: 0,
    notes:
      "Public-source seed: https://professionals.tarkett.com/en_EU/collection-C000127-iq-optima-acoustic. Use as a floor_covering layer through the official impact catalog DeltaLw lane; density is not seeded from this source and must not be used as an airborne mass contribution.",
    tags: ["floor-finish", "acoustic-vinyl", "impact", "tarkett", "iq-optima", "public-source"]
  },
  {
    id: "tarkett_iq_natural_acoustic_15_db",
    name: "Tarkett iQ Natural Acoustic 15 dB",
    category: "finish",
    densityKgM3: 0,
    notes:
      "Public-source seed: https://professionals.tarkett.com/en_EU/node/iq-natural-sustainable-vinyl-flooring-9685. Use as a floor_covering identity material only; the product DeltaLw lane stays parked until thickness/test-system boundaries are encoded. Density is not seeded from this source and must not be used as an airborne mass contribution.",
    tags: ["floor-finish", "acoustic-vinyl", "impact", "tarkett", "iq-natural", "public-source"]
  },
  {
    id: "scanrubber_825_underlay",
    name: "Scan Underlay 825 5 mm",
    category: "support",
    densityKgM3: 165,
    acoustic: {
      behavior: "resilient_layer",
      lossFactor: 0.08,
      notes: ["Density is derived from the public 0.825 kg/m2, 5 mm Scan Underlay 825 specification."],
      propertySourceStatus: "catalog_nominal"
    },
    impact: {
      dynamicStiffnessMNm3: 37
    },
    notes: "Public-source seed: https://scanunderlay.com/products/underscreed/825",
    tags: ["resilient", "underlay", "rubber", "impact", "floor", "public-source"]
  }
];

export const MATERIAL_CATALOG_SEED: readonly MaterialDefinition[] = [
  ...BASE_SEED_MATERIALS,
  ...PUBLIC_SOURCE_MATERIALS,
  ...FLOOR_SYSTEM_MATERIALS
];

export const MATERIAL_SOURCE_NOTE =
  "Seed catalog plus public-source material rows and a curated exact floor-system slice. Acoustic2 remains read-only; no direct catalog sync is happening from its active working tree.";

export const materialCatalogById = Object.fromEntries(
  MATERIAL_CATALOG_SEED.map((entry) => [entry.id, entry])
) as Record<string, MaterialDefinition>;
