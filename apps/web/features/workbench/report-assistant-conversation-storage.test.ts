import { describe, expect, it } from "vitest";

import {
  REPORT_ASSISTANT_CONVERSATION_STORAGE_KEY,
  createReportAssistantResearchReviewPacket,
  getLatestReportAssistantResearchReviewPacket,
  readReportAssistantConversationStorage,
  sanitizeReportAssistantConversationMessages,
  writeReportAssistantConversationStorage,
  type ReportAssistantConversationMessage
} from "./report-assistant-conversation-storage";

class MemoryStorage {
  private readonly data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  removeItem(key: string) {
    this.data.delete(key);
  }

  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

describe("report assistant conversation storage", () => {
  it("sanitizes messages, trims unsafe fields, truncates long text, and caps count", () => {
    const messages = Array.from({ length: 20 }, (_, index) => ({
      content: index === 0 ? "x".repeat(2200) : `message ${index}`,
      extraRawProviderPayload: "must be dropped",
      id: `message-${index}`,
      metricId: index === 1 ? "output:Rw" : undefined,
      recommendedActionText: index === 1 ? "lower Rw by 2 dB" : undefined,
      role: index === 2 ? "bad-role" : index % 2 === 0 ? "assistant" : "user",
      source: index === 0 ? "model" : "invalid-source",
      status: index === 0 ? "generated" : "invalid-status"
    }));

    const sanitized = sanitizeReportAssistantConversationMessages(messages);

    expect(sanitized).toHaveLength(14);
    expect(sanitized[0]?.id).toBe("message-6");
    expect(sanitized.some((message) => "extraRawProviderPayload" in message)).toBe(false);
    expect(sanitized.some((message) => message.role === "assistant" || message.role === "user")).toBe(true);
    expect(sanitized.every((message) => message.content.length <= 1800)).toBe(true);
  });

  it("sanitizes and restores bounded research review packets inside assistant messages", () => {
    const storage = new MemoryStorage();
    const researchReviewPacket = createReportAssistantResearchReviewPacket({
      assistantContextSignature: "report-context:floor-rw",
      review: {
        answerText: "Rw looks optimistic without exact test evidence.",
        comparableAssemblies: [
          {
            comparisonNote: "Same concrete family only.",
            label: "Concrete floor reference",
            matchingLayers: ["200 mm concrete slab"],
            metricValues: ["Rw 52-58 dB"],
            sourceTitle: "Reference",
            sourceUrl: "https://example.com/reference",
            weakeningDifferences: ["different floating finish"]
          },
          {
            label: "Unsafe source assembly",
            matchingLayers: [],
            metricValues: [],
            sourceUrl: "file:///tmp/nope",
            weakeningDifferences: []
          }
        ],
        comparability: "partial",
        confidence: "medium",
        insufficientSourcesReason: "No exact layer-combination test.",
        metric: "Rw",
        metricId: "output:Rw",
        missingEvidence: ["Exact tested assembly"],
        recommendedActionText: "Consider lowering Rw by 1-2 dB.",
        sourceQuality: "mixed",
        sources: [
          {
            note: "Comparable only.",
            title: "Concrete floor source",
            url: "https://example.com/concrete-floor"
          },
          {
            title: "Unsafe",
            url: "file:///tmp/nope"
          }
        ],
        valueRecommendation: {
          maxDb: 56,
          minDb: 52,
          note: "Keep inside conservative comparable range."
        },
        valueRange: {
          maxDb: 58,
          minDb: 52
        },
        valueReviewed: "54 dB",
        verdict: "suspicious"
      },
      source: "research_provider",
      userInstruction: "Rw fazla mı araştır."
    });
    const messages: ReportAssistantConversationMessage[] = [
      {
        content: "Research answer.",
        id: "assistant-research-1",
        metricId: "output:Rw",
        researchReviewPacket,
        role: "assistant",
        source: "research_provider",
        status: "generated"
      }
    ];

    writeReportAssistantConversationStorage("report-context:floor-rw", messages, storage);
    const restored = readReportAssistantConversationStorage("report-context:floor-rw", storage);

    expect(restored[0]?.researchReviewPacket).toMatchObject({
      assistantContextSignature: "report-context:floor-rw",
      comparability: "partial",
      metricId: "output:Rw",
      sourceQuality: "mixed",
      sources: [
        {
          title: "Concrete floor source",
          url: "https://example.com/concrete-floor"
        }
      ],
      valueRecommendation: {
        maxDb: 56,
        minDb: 52
      },
      verdict: "suspicious"
    });
    expect(restored[0]?.researchReviewPacket?.comparableAssemblies[1]?.sourceUrl).toBeUndefined();
    expect(JSON.stringify(restored)).not.toContain("file:///tmp/nope");
    expect(getLatestReportAssistantResearchReviewPacket({
      assistantContextSignature: "report-context:floor-rw",
      messages: restored,
      metricId: "output:Rw"
    })).toMatchObject({
      metricId: "output:Rw",
      verdict: "suspicious"
    });
    expect(getLatestReportAssistantResearchReviewPacket({
      assistantContextSignature: "report-context:floor-rw",
      messages: restored,
      metricId: "output:Ln,w"
    })).toBeUndefined();
    expect(getLatestReportAssistantResearchReviewPacket({
      assistantContextSignature: "report-context:wall-rw",
      messages: restored,
      metricId: "output:Rw"
    })).toBeUndefined();
  });

  it("restores only same-document messages", () => {
    const storage = new MemoryStorage();
    const messages: ReportAssistantConversationMessage[] = [
      {
        content: "No report value was changed.",
        id: "assistant-1",
        metricId: "output:Rw",
        role: "assistant",
        source: "context",
        status: "generated"
      }
    ];

    writeReportAssistantConversationStorage("doc-a", messages, storage);

    expect(readReportAssistantConversationStorage("doc-a", storage)).toEqual(messages);
    expect(readReportAssistantConversationStorage("doc-b", storage)).toEqual([]);
  });

  it("separates conversations by assistant context signature even when the patch document is unchanged", () => {
    const storage = new MemoryStorage();
    const messages: ReportAssistantConversationMessage[] = [
      {
        content: "Concrete slab context review.",
        id: "assistant-1",
        metricId: "output:Ln,w",
        role: "assistant",
        source: "context",
        status: "generated"
      }
    ];

    writeReportAssistantConversationStorage("report-context:concrete-layer", messages, storage);

    expect(readReportAssistantConversationStorage("report-context:concrete-layer", storage)).toEqual(messages);
    expect(readReportAssistantConversationStorage("report-context:clt-layer", storage)).toEqual([]);
  });

  it("removes invalid storage records and continues without throwing", () => {
    const storage = new MemoryStorage();
    storage.setItem(REPORT_ASSISTANT_CONVERSATION_STORAGE_KEY, "{broken");

    expect(readReportAssistantConversationStorage("doc-a", storage)).toEqual([]);
    expect(storage.getItem(REPORT_ASSISTANT_CONVERSATION_STORAGE_KEY)).toBeNull();
  });

  it("clears storage when no valid messages remain", () => {
    const storage = new MemoryStorage();
    writeReportAssistantConversationStorage("doc-a", [{ content: "hello", id: "user-1", role: "user" }], storage);
    writeReportAssistantConversationStorage("doc-a", [], storage);

    expect(storage.getItem(REPORT_ASSISTANT_CONVERSATION_STORAGE_KEY)).toBeNull();
  });
});
