import { describe, expect, it } from "vitest";

import { calculatorPreviewToAssistantResult } from "./report-assistant-calculator-preview-result";
import type { WorkbenchV2CalculatorAssistantPreview } from "../workbench-rebuild/workbench-v2-calculator-assistant";

describe("report assistant calculator preview result", () => {
  it("surfaces typed draft missing inputs as result-envelope tasks without numeric basis", () => {
    const preview: WorkbenchV2CalculatorAssistantPreview = {
      calculationSummary: {
        selectedOutputs: ["Ln,w", "AIIC"],
        status: "needs_input"
      },
      describedConfiguration: {
        description: "120 mm concrete floor + 30 mm rockwool için Ln,w ve AIIC hesapla",
        layers: [],
        parser: "deterministic_wall_layer_description_v1",
        warnings: []
      },
      layerStackDraft: {
        draft: {
          assumptions: [],
          contextSignature: "ctx.floor",
          customMaterials: [],
          draftId: "draft.floor",
          floorImpactDraft: {
            requiredPhysicalInputs: ["dynamic_stiffness", "load_basis", "target_metric_basis"]
          },
          layers: [],
          mode: "floor",
          originalPhrases: [],
          requestedOutputs: ["Ln,w", "AIIC"],
          source: "user_instruction",
          sourceInstruction: "120 mm concrete floor + 30 mm rockwool için Ln,w ve AIIC hesapla",
          warnings: []
        },
        validation: {
          clarifyingQuestions: [
            "Describe the layer stack with material, role, and mm thickness for each layer.",
            "What is the resilient layer dynamic stiffness in MN/m3?"
          ],
          missingInputs: [
            {
              category: "layer_stack",
              code: "assistant_layer_stack_empty",
              message: "Layer stack draft has no layers.",
              question: "Describe the layer stack with material, role, and mm thickness for each layer."
            },
            {
              category: "physical_input",
              code: "assistant_floor_impact_dynamic_stiffness_missing",
              message: "Floor/impact draft is missing dynamic_stiffness.",
              physicalInput: "dynamic_stiffness",
              question: "What is the resilient layer dynamic stiffness in MN/m3?"
            }
          ],
          ok: false,
          status: "needs_input"
        }
      },
      outputRows: [
        { detail: "Pending until the described layer configuration is complete.", label: "Ln,w", status: "pending", value: "--" },
        { detail: "Pending until the described layer configuration is complete.", label: "AIIC", status: "pending", value: "--" }
      ],
      requestedSnapshot: {
        customMaterialCount: 0,
        layerCount: 0,
        mode: "floor",
        name: "Described layer configuration",
        selectedOutputs: ["Ln,w", "AIIC"]
      },
      tasks: [
        {
          detail: "Described calculator preview currently supports wall layer configurations.",
          id: "unsupported-described-floor-configuration",
          label: "Floor description unsupported",
          source: "described_layer_configuration"
        }
      ]
    };

    expect(calculatorPreviewToAssistantResult({
      name: "preview_described_layer_configuration",
      preview
    })).toMatchObject({
      authority: "needs_input",
      basis: [],
      routeStatus: "needs_input",
      tasks: [
        {
          code: "unsupported-described-floor-configuration",
          severity: "warning"
        },
        {
          code: "assistant_layer_stack_empty",
          message: "Layer stack draft has no layers. Describe the layer stack with material, role, and mm thickness for each layer.",
          severity: "warning"
        },
        {
          code: "assistant_floor_impact_dynamic_stiffness_missing",
          message: "Floor/impact draft is missing dynamic_stiffness. What is the resilient layer dynamic stiffness in MN/m3?",
          severity: "warning"
        }
      ]
    });
  });
});
