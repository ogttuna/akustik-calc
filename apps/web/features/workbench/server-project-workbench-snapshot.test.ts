import { describe, expect, it } from "vitest";

import {
  SERVER_PROJECT_WORKBENCH_SNAPSHOT_SCHEMA_ID,
  buildServerProjectWorkbenchSnapshot,
  parseServerProjectWorkbenchSnapshot
} from "./server-project-workbench-snapshot";
import type { ScenarioSnapshot } from "./workbench-store";

const SCENARIO: ScenarioSnapshot = {
  airborneAirtightness: "good",
  airborneConnectionType: "auto",
  airborneContextMode: "element_lab",
  airborneElectricalBoxes: "none",
  airborneJunctionQuality: "good",
  airbornePanelHeightMm: "",
  airbornePanelWidthMm: "",
  airbornePenetrationState: "none",
  airbornePerimeterSeal: "good",
  airborneReceivingRoomRt60S: "",
  airborneReceivingRoomVolumeM3: "",
  airborneResilientBarSideCount: "both_sides",
  airborneSharedTrack: "independent",
  airborneStudSpacingMm: "",
  airborneStudType: "auto",
  approverTitle: "Acoustic Consultant",
  briefNote: "Server-backed restore test.",
  calculatorId: "dynamic",
  clientName: "Acme",
  consultantAddress: "Office address",
  consultantCompany: "DynEcho",
  consultantEmail: "hello@example.com",
  consultantLogoDataUrl: "",
  consultantPhone: "+90 212 000 00 00",
  consultantWordmarkLine: "",
  criteriaPackId: "apartment_core",
  customMaterials: [],
  fieldRiskIds: [],
  id: "local-current",
  impactDirectPathOffsetDb: "",
  impactExactBandInput: "",
  impactExactLabOrField: "lab",
  impactFlankingPathsInput: "",
  impactGuideCi50_2500Db: "",
  impactGuideCiDb: "",
  impactGuideHdDb: "",
  impactGuideKDb: "",
  impactGuideMassRatio: "",
  impactGuideReceivingRoomVolumeM3: "",
  impactGuideSmallRoomMode: false,
  impactGuideSource: "live_stack",
  impactImprovementBandInput: "",
  impactLowerTreatmentReductionDb: "",
  impactReferenceDeltaLwDb: "",
  name: "Acme server snapshot",
  preparedBy: "Operator",
  presetId: "heavy_concrete_impact_floor",
  projectName: "Acme tower",
  proposalAttention: "Design team",
  proposalIssueCodePrefix: "DEC",
  proposalIssuePurpose: "Client review and acoustic coordination",
  proposalRecipient: "Acme",
  proposalReference: "DEC-2026-001",
  proposalRevision: "Rev 00",
  proposalSubject: "Acme tower floor acoustic proposal",
  proposalValidityNote: "Valid for this test.",
  reportProfile: "consultant",
  requestedOutputs: ["Rw", "Ln,w"],
  rows: [
    {
      floorRole: "base_structure",
      id: "row-1",
      materialId: "concrete",
      thicknessMm: "200"
    }
  ],
  savedAtIso: "2026-04-23T12:00:00.000Z",
  studyMode: "floor",
  targetLnwDb: "55",
  targetRwDb: "60"
};

describe("server project workbench snapshot", () => {
  it("marks and parses server-backed simple workbench snapshots", () => {
    const serverSnapshot = buildServerProjectWorkbenchSnapshot(SCENARIO);
    const parsed = parseServerProjectWorkbenchSnapshot(serverSnapshot);

    expect(serverSnapshot.schemaId).toBe(SERVER_PROJECT_WORKBENCH_SNAPSHOT_SCHEMA_ID);
    expect(parsed).toMatchObject({
      airborneResilientBarSideCount: "both_sides",
      criteriaPackId: "apartment_core",
      presetId: "heavy_concrete_impact_floor",
      projectName: "Acme tower",
      rows: [
        {
          floorRole: "base_structure",
          materialId: "concrete",
          thicknessMm: "200"
        }
      ],
      studyMode: "floor"
    });
  });

  it("keeps legacy server snapshots without side count restorable", () => {
    const legacyScenario = { ...SCENARIO };
    delete legacyScenario.airborneResilientBarSideCount;
    const parsed = parseServerProjectWorkbenchSnapshot({
      ...legacyScenario,
      schemaId: SERVER_PROJECT_WORKBENCH_SNAPSHOT_SCHEMA_ID
    });

    expect(parsed).toMatchObject({
      presetId: "heavy_concrete_impact_floor",
      projectName: "Acme tower",
      studyMode: "floor"
    });
    expect(parsed?.airborneResilientBarSideCount).toBeUndefined();
  });

  it("drops invalid side-count values from server snapshots before store restore", () => {
    const parsed = parseServerProjectWorkbenchSnapshot({
      ...SCENARIO,
      airborneResilientBarSideCount: "invalid-side-count",
      schemaId: SERVER_PROJECT_WORKBENCH_SNAPSHOT_SCHEMA_ID
    });

    expect(parsed).not.toBeNull();
    expect(parsed?.airborneResilientBarSideCount).toBeUndefined();
  });

  it("rejects unmarked or cross-mode snapshots before restore", () => {
    expect(parseServerProjectWorkbenchSnapshot({ ...SCENARIO })).toBeNull();
    expect(
      parseServerProjectWorkbenchSnapshot({
        ...SCENARIO,
        presetId: "concrete_wall",
        schemaId: SERVER_PROJECT_WORKBENCH_SNAPSHOT_SCHEMA_ID,
        studyMode: "floor"
      })
    ).toBeNull();
  });
});
