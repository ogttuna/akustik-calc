import { describe, expect, it } from "vitest";

import { classifyReportAssistantEditorRequest } from "./report-assistant-editor-workflow";

describe("report assistant editor workflow", () => {
  it("routes save and destructive intents to preview-only action proposals", () => {
    expect(classifyReportAssistantEditorRequest("Create a new project report from this draft")).toBe("action_proposal");
    expect(classifyReportAssistantEditorRequest("Save this stack as a project assembly")).toBe("action_proposal");
    expect(classifyReportAssistantEditorRequest("Save this stack as a reusable template")).toBe("action_proposal");
    expect(classifyReportAssistantEditorRequest("Save this report revision")).toBe("action_proposal");
    expect(classifyReportAssistantEditorRequest("Restore this selected revision")).toBe("action_proposal");
    expect(classifyReportAssistantEditorRequest("Delete this report")).toBe("action_proposal");
    expect(classifyReportAssistantEditorRequest("Kaydet ve yeni revizyon oluştur")).toBe("action_proposal");
  });

  it("routes workspace questions to the read-only query path", () => {
    expect(classifyReportAssistantEditorRequest("Which preset looks closest to this stack?")).toBe("read_only_query");
    expect(classifyReportAssistantEditorRequest("What changed since the previous revision?")).toBe("read_only_query");
    expect(classifyReportAssistantEditorRequest("Bu raporda hangi proje seçili?")).toBe("read_only_query");
  });

  it("routes bounded calculator preview commands to the read-only query path", () => {
    expect(classifyReportAssistantEditorRequest(
      "Calculatoru kullan: 12.5 mm alcipan + 50 mm tasyunu + 100 mm beton icin Rw ve STC hesapla"
    )).toBe("read_only_query");
    expect(classifyReportAssistantEditorRequest(
      "Calculate DnT,w for 12.5 mm gypsum board + 50 mm rockwool + 100 mm concrete"
    )).toBe("read_only_query");
  });

  it("leaves report-value edit requests on the patch proposal path", () => {
    expect(classifyReportAssistantEditorRequest("Lower Rw by 2 dB for this client issue")).toBe("patch_proposal");
    expect(classifyReportAssistantEditorRequest("Add a note about the field assumptions")).toBe("patch_proposal");
  });
});
