import type { FloorRole, ReportProfile, RequestedOutputId, StudyContext } from "@dynecho/shared";

import type { StudyMode } from "./preset-definitions";

export const REQUESTED_OUTPUT_LABELS: Record<RequestedOutputId, string> = {
  "AIIC": "AIIC",
  "C": "C",
  "CI": "CI",
  "CI,50-2500": "CI,50-2500",
  "Ctr": "Ctr",
  "DeltaLw": "DeltaLw",
  "HIIC": "HIIC",
  "IIC": "IIC",
  "ISR": "ISR",
  "LIIC": "LIIC",
  "LIR": "LIR",
  "Ln,w": "Ln,w",
  "Ln,w+CI": "Ln,w+CI",
  "L'n,w": "L'n,w",
  "L'nT,w": "L'nT,w",
  "L'nT,50": "L'nT,50",
  "NISR": "NISR",
  "Rw": "Rw",
  "STC": "STC"
};

export const REQUESTED_OUTPUT_DESCRIPTIONS: Record<RequestedOutputId, string> = {
  "AIIC": "ASTM E989 apparent impact insulation class for field-side impact bands.",
  "C": "ISO 717 airborne spectrum adaptation term for mid-frequency transport noise.",
  "CI": "ISO 717-2 impact low-frequency companion term for walking-noise weighting.",
  "CI,50-2500": "Extended ISO 717-2 impact companion term when 50..2500 Hz data exists.",
  "Ctr": "ISO 717 airborne low-frequency spectrum adaptation term.",
  "DeltaLw": "ISO 717-2 heavy-reference improvement rating for floating-floor systems.",
  "HIIC": "ASTM E3222 high-frequency impact companion family.",
  "IIC": "ASTM E989 impact insulation class for lab-side impact bands.",
  "ISR": "ASTM field impact sound rating family derived from field-side impact bands.",
  "LIIC": "ASTM E3207 low-frequency impact insulation class.",
  "LIR": "ASTM E3207 low-frequency impact response companion metric.",
  "Ln,w": "ISO 717-2 weighted normalized impact sound pressure level for lab-side floor impact.",
  "Ln,w+CI": "ISO 717-2 combined impact rating with low-frequency companion term.",
  "L'n,w": "Field-side weighted normalized impact sound pressure level using explicit K carry-over.",
  "L'nT,w": "Standardized field-side weighted impact rating with room-volume normalization.",
  "L'nT,50": "Standardized field-side weighted impact rating with the 50..2500 Hz companion term.",
  "NISR": "ASTM normalized impact sound rating from field-side impact bands.",
  "Rw": "ISO 717 weighted airborne sound reduction index.",
  "STC": "ASTM E413 single-number airborne rating."
};

export const REQUESTED_OUTPUT_SUPPORT_NOTES: Record<RequestedOutputId, string> = {
  "AIIC": "Tracked as an ASTM field-impact lane. DynEcho keeps it visible as research scope until a standards-backed adapter ships.",
  "C": "Live from the calibrated airborne curve.",
  "CI": "Live when an exact impact curve, exact family, or supported guide lane provides it.",
  "CI,50-2500": "Live when exact impact data or curated family data carries the extended low-frequency companion.",
  "Ctr": "Live from the calibrated airborne curve.",
  "DeltaLw": "Live on exact improvement curves, official product evidence, curated families, and the narrow heavy-floor path.",
  "HIIC": "Tracked as a future ASTM E3222 high-frequency lane; not fabricated today.",
  "IIC": "Requested and tracked, but intentionally unsupported until an ASTM E989 lab adapter is implemented.",
  "ISR": "Requested and tracked, but intentionally unsupported until an ASTM field-impact adapter is implemented.",
  "LIIC": "Tracked as a future low-frequency lane; current workbench surfaces ISO companions instead of inventing ASTM E3207 values.",
  "LIR": "Tracked as a future low-frequency companion lane; not fabricated today.",
  "Ln,w": "Live from exact impact sources, curated floor families, official product evidence, or narrow scoped predictors.",
  "Ln,w+CI": "Live when CI is present on an exact or family-backed impact lane.",
  "L'n,w": "Live when exact or predictor-backed impact lanes carry explicit K into field-side normalization.",
  "L'nT,w": "Live when explicit room-volume or Turkish small-room normalization is available.",
  "L'nT,50": "Live when CI,50-2500 is present together with standardized field normalization or the Turkish simple guide.",
  "NISR": "Requested and tracked, but intentionally unsupported until an ASTM field-impact adapter is implemented.",
  "Rw": "Live from the calibrated airborne curve and curated floor-family companions.",
  "STC": "Live from the calibrated airborne curve."
};

export const LIVE_OUTPUTS = new Set<RequestedOutputId>(["Rw", "STC", "C", "Ctr"]);
export const SCOPED_OUTPUTS = new Set<RequestedOutputId>(["Ln,w", "DeltaLw"]);
export const GUIDE_OUTPUTS = new Set<RequestedOutputId>(["CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]);
export const UPSTREAM_ONLY_OUTPUTS = new Set<RequestedOutputId>([]);
export const RESEARCH_OUTPUTS = new Set<RequestedOutputId>(["IIC", "AIIC", "NISR", "ISR", "LIIC", "LIR", "HIIC"]);

export const STUDY_CONTEXT_LABELS: Record<StudyContext, string> = {
  concept: "Concept",
  coordination: "Coordination",
  pre_tender: "Pre-tender"
};

export const REPORT_PROFILE_LABELS: Record<ReportProfile, string> = {
  consultant: "Consultant issue",
  developer: "Developer memo",
  lab_ready: "Lab-ready brief"
};

export const STUDY_MODE_LABELS: Record<StudyMode, string> = {
  floor: "Floor mode",
  wall: "Wall mode"
};

export const FLOOR_ROLE_LABELS: Record<FloorRole, string> = {
  base_structure: "Base structure",
  resilient_layer: "Resilient layer",
  floating_screed: "Floating screed",
  upper_fill: "Upper fill",
  floor_covering: "Floor covering",
  ceiling_cavity: "Ceiling cavity",
  ceiling_fill: "Ceiling fill",
  ceiling_board: "Ceiling board"
};

export const CAPABILITY_ROWS = [
  {
    detail: "Airborne screening now includes a portable TS engine, a calibrated frequency curve, and live rating composites in the web app and API.",
    family: "Current shell",
    label: "Rw, STC, C, Ctr",
    status: "live" as const
  },
  {
    detail: "Exact lab or field impact bands can now be imported on nominal ISO 717-2 grids, keeping measured impact ratings separate from the airborne screening curve.",
    family: "Exact impact source",
    label: "Ln,w, L'nT,w, CI, CI,50-2500, Ln,w+CI",
    status: "live" as const
  },
  {
    detail: "Exact heavy-reference improvement curves can now derive DeltaLw and treated reference Ln,w without collapsing into the live floor predictor.",
    family: "Exact heavy reference",
    label: "DeltaLw, treated reference Ln,w",
    status: "live" as const
  },
  {
    detail: "A curated Knauf, Dataholz, TUAS, and UBIQ floor-family slice can now exact-match role-tagged floor build-ups across timber, concrete, CLT, open-box, and open-web steel examples, then surface published Ln,w, CI, and companion Rw values. When a family omits Rw + Ctr, DynEcho carries that honestly as unavailable rather than fabricating it. When the stack is close but not exact, DynEcho now shows the nearest curated families and missing signals.",
    family: "Exact floor systems",
    label: "Curated Ln,w, CI, Ln,w+CI, Rw, Rw + Ctr",
    status: "live" as const
  },
  {
    detail: "Official manufacturer technical-data and catalog rows can now match curated resilient-product assemblies. Exact product-system rows, lower-bound support rows, and product-only DeltaLw lanes sit between family matches and the generic heavy-floor formula.",
    family: "Official product rows",
    label: "Ln,w, DeltaLw, lower-bound support",
    status: "live" as const
  },
  {
    detail: "Impact is live only for the narrow heavy-concrete path with an explicit resilient layer and dynamic-stiffness data. Timber, CLT, steel, and ceiling-driven families stay upstream.",
    family: "Scoped impact",
    label: "Ln,w, DeltaLw",
    status: "scoped" as const
  },
  {
    detail: "Guide-side impact companions can now be carried manually from published or exact source values, while live-stack exact and predictor lanes can also carry direct field-side normalization from explicit K and receiving-room inputs. Exact CI terms auto-carry when an exact band source is active.",
    family: "Guide supplement",
    label: "CI, CI,50-2500, Ln,w+CI, L'n,w, L'nT,w, L'nT,50",
    status: "guided" as const
  },
  {
    detail: "Exact floor-system families are now landing as a curated slice, but broad catalog coverage, wider steel-family import, band-backed DeltaLw references, and deeper field-side family import still live upstream.",
    family: "Exact family import",
    label: "Broad floor families, automatic CI, field-side chains",
    status: "upstream" as const
  },
  {
    detail: "Formula notes, source provenance, and benchmark-backed result explanations should become first-class report surfaces here.",
    family: "Reporting",
    label: "Notes, references, audit trail",
    status: "planned" as const
  }
];

export const SYSTEM_TOOL_ROWS = [
  {
    body: "Compare multiple stack options, not just one active assembly. Acoustic decisions are almost always trade-off decisions.",
    title: "Scenario comparisons"
  },
  {
    body: "Show octave or third-octave behavior, not only a single-number rating. Weak bands are often the actual design problem.",
    title: "Frequency-domain review"
  },
  {
    body: "Track project targets, missing outputs, and specification gaps directly in the workbench rather than in a separate spreadsheet.",
    title: "Target tracking"
  },
  {
    body: "Start from brief templates for housing, hospitality, workplace, or education, then tune the output set without losing delivery context.",
    title: "Criteria packs"
  },
  {
    body: "Separate screening formulas from curated exact systems so the user always knows whether a number came from an estimate, a product property, or a measured floor family.",
    title: "Impact provenance"
  },
  {
    body: "Accept pasted lab or field band data on nominal grids, then derive weighted impact ratings directly instead of forcing users into manual carry-over.",
    title: "Exact band import"
  },
  {
    body: "Accept exact DeltaLw improvement curves on the heavy-reference floor so product evidence can stay richer than a single datasheet number.",
    title: "Exact DeltaLw import"
  },
  {
    body: "Match role-tagged floor build-ups against curated official and measured floor families so published Ln,w and Rw values can sit beside screening estimates.",
    title: "Exact floor families"
  },
  {
    body: "Turn product-sheet DeltaLw values into quick heavy-reference checks without pretending they replace a full floor-system model.",
    title: "Datasheet quick derive"
  },
  {
    body: "Carry exact manufacturer-system rows and catalog DeltaLw values as their own evidence class so official product data does not get flattened into generic formulas.",
    title: "Official product evidence"
  },
  {
    body: "Expose where a result came from: seed heuristic, imported upstream parity, official product data, or benchmark estimate.",
    title: "Provenance and trust"
  },
  {
    body: "Prepare clean consultant-facing output with notes, formulas, assumptions, and export-ready narratives.",
    title: "Report preparation"
  },
  {
    body: "Stay portable so the same engine can later drive a desktop field tool or an offline spec-review app.",
    title: "Desktop-ready core"
  }
];
