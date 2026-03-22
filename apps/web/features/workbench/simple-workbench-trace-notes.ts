export type SimpleWorkbenchTraceNoteSelection = {
  hiddenCount: number;
  notes: readonly string[];
  totalCount: number;
};

type SelectSimpleWorkbenchTraceNotesOptions = {
  fallbackNotes?: readonly string[];
  maxNotes?: number;
};

const NOTE_PRIORITY_RULES: ReadonlyArray<{ pattern: RegExp; score: number }> = [
  {
    pattern:
      /\b(exact|official|curated|bound(?:-only)?|conservative bound|family estimate|screening seed|selected lane|strategy|active on the current|matched curated|matched catalog|anchor)\b/i,
    score: 120
  },
  {
    pattern: /\b(detected support family|detected family|support family|structural family)\b/i,
    score: 90
  },
  {
    pattern:
      /\b(field continuation|room volume|standardized|field-side|flanking|leakage|junction|guide|k correction|direct path|receiving-room)\b/i,
    score: 80
  },
  {
    pattern: /\b(evidence tier|confidence|fit\b|solver spread|candidate|provenance)\b/i,
    score: 70
  },
  {
    pattern: /\b(support form|topology|visible floor-role|cavity|leaf|stud|surface mass|thickness)\b/i,
    score: 60
  },
  {
    pattern:
      /\b(iso 717|computed as|derived|formula|upper bound|lower bound|companion|curve|apparent field|screening)\b/i,
    score: 60
  }
];

function normalizeTraceNote(note: string): string {
  return note.trim().replace(/\s+/g, " ").toLowerCase();
}

function dedupeTraceNotes(notes: readonly string[]): string[] {
  const seen = new Set<string>();
  const deduped: string[] = [];

  for (const note of notes) {
    const trimmed = note.trim();

    if (trimmed.length === 0) {
      continue;
    }

    const normalized = normalizeTraceNote(trimmed);

    if (seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    deduped.push(trimmed);
  }

  return deduped;
}

function scoreTraceNote(note: string, index: number): number {
  let score = Math.max(0, 24 - index);

  for (const rule of NOTE_PRIORITY_RULES) {
    if (rule.pattern.test(note)) {
      score += rule.score;
    }
  }

  if (note.length <= 120) {
    score += 6;
  } else if (note.length >= 220) {
    score -= 8;
  }

  if (/\b(no structured|no explicit|not yet)\b/i.test(note)) {
    score -= 30;
  }

  return score;
}

export function selectSimpleWorkbenchTraceNotes(
  notes: readonly string[],
  options: SelectSimpleWorkbenchTraceNotesOptions = {}
): SimpleWorkbenchTraceNoteSelection {
  const maxNotes = Math.max(1, options.maxNotes ?? 4);
  const dedupedNotes = dedupeTraceNotes(notes);

  if (dedupedNotes.length === 0) {
    const fallbackNotes = dedupeTraceNotes(options.fallbackNotes ?? []);
    const visibleFallbackNotes = fallbackNotes.slice(0, maxNotes);

    return {
      hiddenCount: Math.max(0, fallbackNotes.length - visibleFallbackNotes.length),
      notes: visibleFallbackNotes,
      totalCount: fallbackNotes.length
    };
  }

  if (dedupedNotes.length <= maxNotes) {
    return {
      hiddenCount: 0,
      notes: dedupedNotes,
      totalCount: dedupedNotes.length
    };
  }

  const rankedNotes = dedupedNotes.map((note, index) => ({
    index,
    note,
    score: scoreTraceNote(note, index)
  }));
  const selectedIndexes = new Set<number>([0]);

  for (const item of [...rankedNotes].sort((left, right) => right.score - left.score || left.index - right.index)) {
    if (selectedIndexes.size >= maxNotes) {
      break;
    }

    selectedIndexes.add(item.index);
  }

  const selectedNotes = rankedNotes
    .filter((item) => selectedIndexes.has(item.index))
    .sort((left, right) => left.index - right.index)
    .map((item) => item.note);

  return {
    hiddenCount: Math.max(0, dedupedNotes.length - selectedNotes.length),
    notes: selectedNotes,
    totalCount: dedupedNotes.length
  };
}
