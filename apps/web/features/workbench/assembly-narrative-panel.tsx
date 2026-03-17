import type { AssemblyCalculation } from "@dynecho/shared";
import { Binary, WavesLadder } from "lucide-react";

import { SurfacePanel } from "@dynecho/ui";

import type { StudyMode } from "./preset-definitions";
import { describeAssembly } from "./describe-assembly";

type AssemblyNarrativePanelProps = {
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
};

export function AssemblyNarrativePanel({ result, studyMode }: AssemblyNarrativePanelProps) {
  const narrative = describeAssembly(result, studyMode);

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="eyebrow">Assembly readout</div>
      <div className="mt-4 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)]">
          <Binary className="h-4 w-4 text-[color:var(--ink)]" />
        </div>
        <div>
          <h2 className="font-display text-[1.9rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">
            {narrative.headline}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">{narrative.detail}</p>
        </div>
      </div>
      <div className="mt-5 rounded-[1.25rem] border hairline bg-black/[0.025] px-4 py-4 text-sm leading-7 text-[color:var(--ink-soft)]">
        <div className="flex items-center gap-2 font-semibold text-[color:var(--ink)]">
          <WavesLadder className="h-4 w-4" />
          Interpretation boundary
        </div>
        <p className="mt-2">
          This is still a controlled migration surface, but it now carries curve-backed airborne screening, curated
          floor families, official product rows, predictor-family estimates, and direct plus flanking field
          supplements. Full upstream parity is still under active import and validation.
        </p>
      </div>
    </SurfacePanel>
  );
}
