export const REPORT_ASSISTANT_CONVERSATION_STORAGE_KEY = "dynecho:report-assistant-conversation:v1";

const REPORT_ASSISTANT_CONVERSATION_MAX_MESSAGES = 14;
const REPORT_ASSISTANT_CONVERSATION_MAX_TEXT_LENGTH = 1800;
const REPORT_ASSISTANT_RESEARCH_PACKET_MAX_ASSEMBLIES = 4;
const REPORT_ASSISTANT_RESEARCH_PACKET_MAX_LIST_ITEMS = 8;
const REPORT_ASSISTANT_RESEARCH_PACKET_MAX_SOURCES = 6;
const REPORT_ASSISTANT_RESEARCH_PACKET_MAX_TEXT_LENGTH = 900;

export type ReportAssistantConversationSource = "context" | "deterministic" | "model" | "research_provider" | null;

export type ReportAssistantConversationStatus = "applied" | "generated" | "rejected";

export type ReportAssistantResearchReviewPacket = {
  answerText?: string;
  assistantContextSignature: string;
  comparableAssemblies: readonly {
    comparisonNote?: string;
    label: string;
    matchingLayers: readonly string[];
    metricValues: readonly string[];
    sourceTitle?: string;
    sourceUrl?: string;
    weakeningDifferences: readonly string[];
  }[];
  comparability?: string;
  confidence?: string;
  createdAtIso: string;
  insufficientSourcesReason?: string;
  metric: string;
  metricId: string;
  missingEvidence: readonly string[];
  recommendedActionText?: string;
  source?: ReportAssistantConversationSource;
  sourceQuality?: string;
  sources: readonly {
    note?: string;
    title: string;
    url: string;
  }[];
  userInstruction?: string;
  valueRecommendation?: {
    displayValue?: string;
    maxDb?: number;
    minDb?: number;
    note?: string;
    targetDb?: number;
  };
  valueRange?: {
    maxDb?: number;
    minDb?: number;
    note?: string;
  };
  valueReviewed: string;
  verdict: string;
};

export type ReportAssistantConversationMessage = {
  content: string;
  id: string;
  metricId?: string;
  recommendedActionText?: string;
  researchReviewPacket?: ReportAssistantResearchReviewPacket;
  role: "assistant" | "user";
  source?: ReportAssistantConversationSource;
  status?: ReportAssistantConversationStatus;
};

type ReportAssistantConversationStorageRecord = {
  documentSignature: string;
  messages: ReportAssistantConversationMessage[];
  savedAtIso: string;
};

type ReportAssistantConversationStorageDriver = {
  getItem: (key: string) => string | null;
  removeItem: (key: string) => void;
  setItem: (key: string, value: string) => void;
};

export function createReportAssistantConversationMessage(
  input: Omit<ReportAssistantConversationMessage, "id">
): ReportAssistantConversationMessage {
  return {
    ...input,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`
  };
}

export function sanitizeReportAssistantConversationMessages(value: unknown): ReportAssistantConversationMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const messages: ReportAssistantConversationMessage[] = [];

  for (const entry of value) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const record = entry as Partial<ReportAssistantConversationMessage>;
    const role = record.role === "assistant" || record.role === "user" ? record.role : null;
    const content = typeof record.content === "string" ? getBoundedReportAssistantConversationText(record.content) : "";
    if (!role || content.length === 0) {
      continue;
    }

    const message: ReportAssistantConversationMessage = {
      content,
      id: typeof record.id === "string" && record.id.length > 0 ? record.id : createReportAssistantConversationMessage({ content, role }).id,
      role
    };

    if (typeof record.metricId === "string") {
      message.metricId = record.metricId;
    }
    if (typeof record.recommendedActionText === "string") {
      message.recommendedActionText = getBoundedReportAssistantConversationText(record.recommendedActionText);
    }
    const researchReviewPacket = sanitizeReportAssistantResearchReviewPacket(record.researchReviewPacket);
    if (role === "assistant" && researchReviewPacket) {
      message.researchReviewPacket = researchReviewPacket;
    }
    if (isReportAssistantConversationSource(record.source)) {
      message.source = record.source;
    }
    if (record.status === "applied" || record.status === "generated" || record.status === "rejected") {
      message.status = record.status;
    }

    messages.push(message);
  }

  return messages.slice(-REPORT_ASSISTANT_CONVERSATION_MAX_MESSAGES);
}

export function createReportAssistantResearchReviewPacket(input: {
  assistantContextSignature: string;
  review: {
    answerText?: string;
    comparableAssemblies?: readonly {
      comparisonNote?: string;
      label: string;
      matchingLayers?: readonly string[];
      metricValues?: readonly string[];
      sourceTitle?: string;
      sourceUrl?: string;
      weakeningDifferences?: readonly string[];
    }[];
    comparability?: string;
    confidence?: string;
    insufficientSourcesReason?: string;
    metric: string;
    metricId: string;
    missingEvidence?: readonly string[];
    recommendedActionText?: string;
    sourceQuality?: string;
    sources?: readonly {
      note?: string;
      title: string;
      url: string;
    }[];
    valueRecommendation?: ReportAssistantResearchReviewPacket["valueRecommendation"];
    valueRange?: ReportAssistantResearchReviewPacket["valueRange"];
    valueReviewed: string;
    verdict: string;
  };
  source?: ReportAssistantConversationSource;
  userInstruction?: string;
}): ReportAssistantResearchReviewPacket {
  return sanitizeReportAssistantResearchReviewPacket({
    answerText: input.review.answerText,
    assistantContextSignature: input.assistantContextSignature,
    comparableAssemblies: input.review.comparableAssemblies,
    comparability: input.review.comparability,
    confidence: input.review.confidence,
    createdAtIso: new Date().toISOString(),
    insufficientSourcesReason: input.review.insufficientSourcesReason,
    metric: input.review.metric,
    metricId: input.review.metricId,
    missingEvidence: input.review.missingEvidence,
    recommendedActionText: input.review.recommendedActionText,
    source: input.source,
    sourceQuality: input.review.sourceQuality,
    sources: input.review.sources,
    userInstruction: input.userInstruction,
    valueRecommendation: input.review.valueRecommendation,
    valueRange: input.review.valueRange,
    valueReviewed: input.review.valueReviewed,
    verdict: input.review.verdict
  }) ?? {
    assistantContextSignature: input.assistantContextSignature,
    comparableAssemblies: [],
    createdAtIso: new Date().toISOString(),
    metric: input.review.metric,
    metricId: input.review.metricId,
    missingEvidence: [],
    sources: [],
    valueReviewed: input.review.valueReviewed,
    verdict: input.review.verdict
  };
}

export function getLatestReportAssistantResearchReviewPacket(input: {
  assistantContextSignature: string;
  messages: readonly ReportAssistantConversationMessage[];
  metricId?: string;
}): ReportAssistantResearchReviewPacket | undefined {
  for (let index = input.messages.length - 1; index >= 0; index -= 1) {
    const message = input.messages[index];
    const packet = message?.researchReviewPacket;
    if (
      message?.role === "assistant" &&
      packet &&
      packet.assistantContextSignature === input.assistantContextSignature &&
      (!input.metricId || packet.metricId === input.metricId)
    ) {
      return packet;
    }
  }

  return undefined;
}

export function readReportAssistantConversationStorage(
  documentSignature: string,
  storage = getBrowserConversationStorage()
): ReportAssistantConversationMessage[] {
  if (!storage) {
    return [];
  }

  try {
    const raw = storage.getItem(REPORT_ASSISTANT_CONVERSATION_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const record = JSON.parse(raw) as Partial<ReportAssistantConversationStorageRecord>;
    return record.documentSignature === documentSignature ? sanitizeReportAssistantConversationMessages(record.messages) : [];
  } catch {
    try {
      storage.removeItem(REPORT_ASSISTANT_CONVERSATION_STORAGE_KEY);
    } catch {
      // Ignore unavailable localStorage; the assistant can continue without persistence.
    }
    return [];
  }
}

export function writeReportAssistantConversationStorage(
  documentSignature: string,
  messages: readonly ReportAssistantConversationMessage[],
  storage = getBrowserConversationStorage()
) {
  if (!storage) {
    return;
  }

  const sanitizedMessages = sanitizeReportAssistantConversationMessages(messages);
  try {
    if (sanitizedMessages.length === 0) {
      storage.removeItem(REPORT_ASSISTANT_CONVERSATION_STORAGE_KEY);
      return;
    }

    const record: ReportAssistantConversationStorageRecord = {
      documentSignature,
      messages: sanitizedMessages,
      savedAtIso: new Date().toISOString()
    };
    storage.setItem(REPORT_ASSISTANT_CONVERSATION_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Ignore quota or storage access errors; persistence is best-effort.
  }
}

function getBoundedReportAssistantConversationText(value: string): string {
  const normalized = value.trim();
  return normalized.length > REPORT_ASSISTANT_CONVERSATION_MAX_TEXT_LENGTH
    ? `${normalized.slice(0, REPORT_ASSISTANT_CONVERSATION_MAX_TEXT_LENGTH - 1)}...`
    : normalized;
}

export function sanitizeReportAssistantResearchReviewPacket(value: unknown): ReportAssistantResearchReviewPacket | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as Partial<ReportAssistantResearchReviewPacket>;
  const assistantContextSignature = getBoundedResearchPacketText(record.assistantContextSignature);
  const metric = getBoundedResearchPacketText(record.metric);
  const metricId = getBoundedResearchPacketText(record.metricId);
  const valueReviewed = getBoundedResearchPacketText(record.valueReviewed);
  const verdict = getBoundedResearchPacketText(record.verdict);

  if (!assistantContextSignature || !metric || !metricId || !valueReviewed || !verdict) {
    return undefined;
  }

  const createdAtIso = getBoundedResearchPacketText(record.createdAtIso) ?? new Date().toISOString();

  return {
    answerText: getBoundedResearchPacketText(record.answerText),
    assistantContextSignature,
    comparableAssemblies: sanitizeResearchPacketComparableAssemblies(record.comparableAssemblies),
    comparability: getBoundedResearchPacketText(record.comparability),
    confidence: getBoundedResearchPacketText(record.confidence),
    createdAtIso,
    insufficientSourcesReason: getBoundedResearchPacketText(record.insufficientSourcesReason),
    metric,
    metricId,
    missingEvidence: sanitizeResearchPacketStringArray(record.missingEvidence),
    recommendedActionText: getBoundedResearchPacketText(record.recommendedActionText),
    source: isReportAssistantConversationSource(record.source) ? record.source : undefined,
    sourceQuality: getBoundedResearchPacketText(record.sourceQuality),
    sources: sanitizeResearchPacketSources(record.sources),
    userInstruction: getBoundedResearchPacketText(record.userInstruction),
    valueRecommendation: sanitizeResearchPacketValueRecommendation(record.valueRecommendation),
    valueRange: sanitizeResearchPacketValueRange(record.valueRange),
    valueReviewed,
    verdict
  };
}

function getBoundedResearchPacketText(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim().replace(/\s+/gu, " ");
  if (normalized.length === 0) {
    return undefined;
  }

  return normalized.length > REPORT_ASSISTANT_RESEARCH_PACKET_MAX_TEXT_LENGTH
    ? `${normalized.slice(0, REPORT_ASSISTANT_RESEARCH_PACKET_MAX_TEXT_LENGTH - 1)}...`
    : normalized;
}

function sanitizeResearchPacketStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .map((entry) => getBoundedResearchPacketText(entry))
        .filter((entry): entry is string => Boolean(entry))
        .slice(0, REPORT_ASSISTANT_RESEARCH_PACKET_MAX_LIST_ITEMS)
    : [];
}

function sanitizeResearchPacketNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function sanitizeResearchPacketValueRange(value: unknown): ReportAssistantResearchReviewPacket["valueRange"] {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as NonNullable<ReportAssistantResearchReviewPacket["valueRange"]>;
  const maxDb = sanitizeResearchPacketNumber(record.maxDb);
  const minDb = sanitizeResearchPacketNumber(record.minDb);
  const note = getBoundedResearchPacketText(record.note);

  return typeof maxDb === "number" || typeof minDb === "number" || note
    ? {
        maxDb,
        minDb,
        note
      }
    : undefined;
}

function sanitizeResearchPacketValueRecommendation(value: unknown): ReportAssistantResearchReviewPacket["valueRecommendation"] {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as NonNullable<ReportAssistantResearchReviewPacket["valueRecommendation"]>;
  const displayValue = getBoundedResearchPacketText(record.displayValue);
  const maxDb = sanitizeResearchPacketNumber(record.maxDb);
  const minDb = sanitizeResearchPacketNumber(record.minDb);
  const note = getBoundedResearchPacketText(record.note);
  const targetDb = sanitizeResearchPacketNumber(record.targetDb);

  return displayValue || typeof maxDb === "number" || typeof minDb === "number" || note || typeof targetDb === "number"
    ? {
        displayValue,
        maxDb,
        minDb,
        note,
        targetDb
      }
    : undefined;
}

function sanitizeResearchPacketSources(value: unknown): ReportAssistantResearchReviewPacket["sources"] {
  if (!Array.isArray(value)) {
    return [];
  }

  const sources: ReportAssistantResearchReviewPacket["sources"][number][] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const record = entry as ReportAssistantResearchReviewPacket["sources"][number];
    const title = getBoundedResearchPacketText(record.title);
    const url = getBoundedResearchPacketText(record.url);
    if (!title || !url || !/^https?:\/\//iu.test(url)) {
      continue;
    }

    sources.push({
      note: getBoundedResearchPacketText(record.note),
      title,
      url
    });
    if (sources.length >= REPORT_ASSISTANT_RESEARCH_PACKET_MAX_SOURCES) {
      break;
    }
  }

  return sources;
}

function sanitizeResearchPacketComparableAssemblies(value: unknown): ReportAssistantResearchReviewPacket["comparableAssemblies"] {
  if (!Array.isArray(value)) {
    return [];
  }

  const assemblies: ReportAssistantResearchReviewPacket["comparableAssemblies"][number][] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const record = entry as ReportAssistantResearchReviewPacket["comparableAssemblies"][number];
    const label = getBoundedResearchPacketText(record.label);
    if (!label) {
      continue;
    }

    const sourceUrl = getBoundedResearchPacketText(record.sourceUrl);
    assemblies.push({
      comparisonNote: getBoundedResearchPacketText(record.comparisonNote),
      label,
      matchingLayers: sanitizeResearchPacketStringArray(record.matchingLayers),
      metricValues: sanitizeResearchPacketStringArray(record.metricValues),
      sourceTitle: getBoundedResearchPacketText(record.sourceTitle),
      sourceUrl: sourceUrl && /^https?:\/\//iu.test(sourceUrl) ? sourceUrl : undefined,
      weakeningDifferences: sanitizeResearchPacketStringArray(record.weakeningDifferences)
    });
    if (assemblies.length >= REPORT_ASSISTANT_RESEARCH_PACKET_MAX_ASSEMBLIES) {
      break;
    }
  }

  return assemblies;
}

function getBrowserConversationStorage(): ReportAssistantConversationStorageDriver | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

function isReportAssistantConversationSource(value: unknown): value is ReportAssistantConversationSource {
  return value === "context" || value === "deterministic" || value === "model" || value === "research_provider" || value === null;
}
