import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-runtime-corridor";
import { OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS } from "./open-box-timber-eps-screed-hybrid-package-estimate";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_LANDED_GATE =
  "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_surface_parity_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTION_STATUS =
  "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_surface_parity_landed_selected_matrix_refresh";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "broad_accuracy_open_box_timber_post_eps_screed_hybrid_matrix_refresh_plan";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-open-box-timber-post-eps-screed-hybrid-matrix-refresh-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_LABEL =
  "open-box timber post EPS/screed hybrid matrix refresh";

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageSurfaceParityTarget =
  | "calculator_api_payload"
  | "confidence_provenance"
  | "impact_lane"
  | "impact_only_api_payload"
  | "local_saved_replay"
  | "markdown_report"
  | "method_dossier"
  | "metric_basis_rows"
  | "output_cards"
  | "route_posture"
  | "server_snapshot_replay";

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageSurfaceValuePin = {
  readonly expected: {
    readonly C: number;
    readonly CI: number;
    readonly CI50_2500: number;
    readonly LnW: number;
    readonly LnWPlusCI: number;
    readonly Rw: number;
    readonly RwPlusC: number;
    readonly fitPercent: number;
  };
  readonly id:
    | "safe_split_support_eps_screed_hybrid_43mm_screed_variant"
    | "source_absent_eps_screed_hybrid_43mm_screed_variant";
};

export type BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageSurfaceParityContract = {
  readonly basis: typeof OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS;
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_LANDED_GATE;
  readonly previousRuntime: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTION_STATUS;
  };
  readonly runtimeMovedAtSurfaceParity: false;
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTION_STATUS;
  readonly surfaceTargets: readonly BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageSurfaceParityTarget[];
  readonly valuePins: readonly BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageSurfaceValuePin[];
};

export function buildBroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageSurfaceParityContract():
  BroadAccuracyFloorOpenBoxTimberEpsScreedHybridPackageSurfaceParityContract {
  return {
    basis: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS,
    landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_LANDED_GATE,
    previousRuntime: {
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_RUNTIME_SELECTION_STATUS
    },
    runtimeMovedAtSurfaceParity: false,
    selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTION_STATUS,
    surfaceTargets: [
      "impact_lane",
      "output_cards",
      "route_posture",
      "confidence_provenance",
      "metric_basis_rows",
      "method_dossier",
      "local_saved_replay",
      "server_snapshot_replay",
      "calculator_api_payload",
      "impact_only_api_payload",
      "markdown_report"
    ],
    valuePins: [
      {
        expected: { C: -1.3, CI: 0, CI50_2500: 1, LnW: 47, LnWPlusCI: 47, Rw: 72, RwPlusC: 70.7, fitPercent: 95 },
        id: "source_absent_eps_screed_hybrid_43mm_screed_variant"
      },
      {
        expected: { C: -1.3, CI: 0, CI50_2500: 1, LnW: 47, LnWPlusCI: 47, Rw: 72, RwPlusC: 70.7, fitPercent: 95 },
        id: "safe_split_support_eps_screed_hybrid_43mm_screed_variant"
      }
    ]
  };
}
