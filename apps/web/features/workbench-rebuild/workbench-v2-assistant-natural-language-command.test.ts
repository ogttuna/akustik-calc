import { afterEach, describe, expect, it, vi } from "vitest";

import { buildResolvedMaterialCatalog } from "./material-editor-state";
import {
  buildWorkbenchV2AssistantNaturalLanguageCommandModelRequest,
  createWorkbenchV2AssistantNaturalLanguageCommandDecision,
  extractWorkbenchV2AssistantNaturalLanguageCommandDecision
} from "./workbench-v2-assistant-natural-language-command";

const materials = buildResolvedMaterialCatalog([]);
const currentLayers = [
  { id: "layer-1", materialId: "gypsum_board", role: "side_a", thicknessMm: "12.5" },
  { id: "layer-2", materialId: "rockwool", role: "cavity", thicknessMm: "50" },
  { id: "layer-3", materialId: "gypsum_board", role: "side_b", thicknessMm: "12.5" }
];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("workbench v2 assistant natural-language command", () => {
  it("extracts a calculator command decision from Gemini-style text responses", () => {
    const decision = extractWorkbenchV2AssistantNaturalLanguageCommandDecision({
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  confidence: "high",
                  explanation: "User wants a relative thickness edit on every visible layer.",
                  normalizedCommand: "hepsinin kalınlığını 10 mm artır",
                  status: "apply"
                })
              }
            ]
          }
        }
      ]
    });

    expect(decision).toMatchObject({
      confidence: "high",
      normalizedCommand: "hepsinin kalınlığını 10 mm artır",
      status: "apply"
    });
  });

  it("builds system-llm Gemini requests without forwarding endpoint query params", () => {
    const request = buildWorkbenchV2AssistantNaturalLanguageCommandModelRequest({
      currentLayers,
      currentMode: "wall",
      currentSelectedOutputs: ["Rw"],
      instruction: "bi mantıklı kalınlık gir abi",
      materials,
      settings: {
        endpoint: "http://system_llm:4000/gemini-proxy?token=do-not-forward",
        model: "gemini-3-flash-preview",
        provider: "system_llm_gemini_proxy",
        proxyKey: "proxy-secret",
        timeoutMs: 12000
      }
    });

    expect(request.url).toBe("http://system_llm:4000/gemini-proxy/v1beta/models/gemini-3-flash-preview:generateContent");
    expect(request.headers.Authorization).toBe("Bearer proxy-secret");
    expect(JSON.stringify(request.body)).toContain("dynecho.workbench_v2.calculator_command_intent");
    expect(JSON.stringify(request.body)).not.toContain("do-not-forward");
  });

  it("tells the calculator command model to reject source review and report override requests", () => {
    const request = buildWorkbenchV2AssistantNaturalLanguageCommandModelRequest({
      currentLayers,
      currentMode: "wall",
      currentSelectedOutputs: ["Rw"],
      instruction: "Rw fazla mı az mı internetten araştır, gerekirse raporda editleyim mi diye sor",
      materials,
      settings: {
        endpoint: "http://system_llm:4000/gemini-proxy",
        model: "gemini-3-flash-preview",
        provider: "system_llm_gemini_proxy",
        proxyKey: "proxy-secret",
        timeoutMs: 12000
      }
    });

    const body = JSON.stringify(request.body);
    expect(body).toContain("value is too high/low");
    expect(body).toContain("internet/source-backed review");
    expect(body).toContain("report value should be overridden after confirmation");
    expect(body).toContain("instead of returning an apply command");
  });

  it("calls a configured provider and returns a safe normalized command decision", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          decision: {
            confidence: "medium",
            explanation: "The user asked for visible-layer draft thicknesses.",
            normalizedCommand: "ekrandaki layerların kalınlıklarını mantıklı şekilde gir",
            status: "apply",
            warnings: ["Draft values require verification."]
          }
        }),
        {
          status: 200
        }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await createWorkbenchV2AssistantNaturalLanguageCommandDecision({
      currentLayers,
      currentMode: "wall",
      currentSelectedOutputs: ["Rw"],
      instruction: "şunların kalınlıklarını kafana göre mantıklı doldur",
      materials,
      settings: {
        endpoint: "https://assistant.example.test/intent",
        provider: "custom_patch_provider",
        timeoutMs: 12000
      }
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://assistant.example.test/intent",
      expect.objectContaining({
        method: "POST"
      })
    );
    expect(result).toMatchObject({
      decision: {
        normalizedCommand: "ekrandaki layerların kalınlıklarını mantıklı şekilde gir",
        status: "apply"
      },
      ok: true,
      source: "model"
    });
  });
});
