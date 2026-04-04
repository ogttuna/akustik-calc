"use client";

import type { AssemblyCalculation, MaterialDefinition } from "@dynecho/shared";

import { formatDecimal } from "@/lib/format";

import { getMaterialCategoryLabel } from "./describe-assembly";
import { formatIllustrationClampLabel } from "./simple-workbench-illustration";
import {
  layerFillClass,
  layerStrokeClass,
  workbenchSectionCardClass,
  workbenchSectionEyebrowClass
} from "./simple-workbench-layer-visuals";
import { DetailTag } from "./simple-workbench-primitives";
import { SectionIllustration } from "./simple-workbench-section-illustration";
import type { StudyMode } from "./preset-definitions";
import {
  buildSolverDisplayLayers,
  buildMaterialFacts,
  compactValues,
  getRowActivityCounts,
  sumThickness
} from "./simple-workbench-utils";
import { FLOOR_ROLE_LABELS } from "./workbench-data";
import type { LayerDraft } from "./workbench-store";

export function LayerLegendRow(props: {
  active: boolean;
  index: number;
  material: MaterialDefinition;
  sourceRowIds: readonly string[];
  studyMode: StudyMode;
  thicknessLabel: string;
  floorRole?: LayerDraft["floorRole"];
}) {
  const { active, floorRole, index, material, sourceRowIds, studyMode, thicknessLabel } = props;
  const facts = buildMaterialFacts({
    material,
    thicknessMm: thicknessLabel.replace(/ mm$/u, "")
  });
  const liveRowLabel =
    sourceRowIds.length > 1 ? `${sourceRowIds.length} live rows` : "Solver layer";

  return (
    <article
      className={`rounded border px-3 py-2 ${
        active
          ? "border-[color:var(--ink)] bg-[color:color-mix(in_oklch,var(--ink)_4%,var(--paper))]"
          : "border-[color:var(--line)] bg-[color:var(--paper)]"
      }`}
      data-active={active ? "true" : "false"}
      data-testid={`legend-row-${index + 1}`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.68rem] font-semibold ${layerFillClass(material)} ${layerStrokeClass(material)}`}
        >
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="truncate text-[0.82rem] font-semibold text-[color:var(--ink)]">{material.name}</div>
            <DetailTag>{thicknessLabel}</DetailTag>
            {studyMode === "floor" && floorRole ? <DetailTag>{FLOOR_ROLE_LABELS[floorRole]}</DetailTag> : null}
          </div>
          <div className="mt-0.5 text-[0.68rem] leading-5 text-[color:var(--ink-soft)]">
            {compactValues([getMaterialCategoryLabel(material), facts[0], liveRowLabel]).join(" · ")}
          </div>
        </div>
      </div>
    </article>
  );
}

export function FloorStackFigure(props: {
  activeRowId: string | null;
  layers: readonly {
    material: MaterialDefinition;
    sourceRowIds: readonly string[];
    thicknessLabel: string;
    thicknessMm: number;
    id: string;
  }[];
}) {
  const { activeRowId, layers } = props;
  const totalThickness = layers.reduce((sum, entry) => sum + entry.thicknessMm, 0);

  return (
    <div className="section-figure rounded-xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
          <div>Walking side</div>
          <div className="mt-1 text-[0.58rem] tracking-[0.12em] opacity-80">Section preview</div>
        </div>
        <div className="text-right text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
          <div>{layers.length} layers</div>
          <div className="mt-1 text-[0.58rem] tracking-[0.12em] opacity-80">{formatIllustrationClampLabel("floor")}</div>
        </div>
      </div>

      <div className="mt-3">
        <SectionIllustration
          axis="floor"
          layers={layers.map(({ id, material, sourceRowIds, thicknessLabel, thicknessMm }, index) => ({
            active: activeRowId ? sourceRowIds.includes(activeRowId) : false,
            indexLabel: String(index + 1),
            key: id,
            material,
            ready: true,
            thicknessLabel,
            thicknessMm
          }))}
          orientation="floor"
        />
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
          <div>Ceiling side</div>
          <div className="mt-1 text-[0.58rem] tracking-[0.12em] opacity-80">Visualized with bounded thickness cues</div>
        </div>
        <div className="text-right text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
          <div>{formatDecimal(totalThickness)} mm total</div>
          <div className="mt-1 text-[0.58rem] tracking-[0.12em] opacity-80">Calculation geometry unchanged</div>
        </div>
      </div>
    </div>
  );
}

export function WallStackFigure(props: {
  activeRowId: string | null;
  layers: readonly {
    material: MaterialDefinition;
    sourceRowIds: readonly string[];
    thicknessLabel: string;
    thicknessMm: number;
    id: string;
  }[];
}) {
  const { activeRowId, layers } = props;
  const totalThickness = layers.reduce((sum, entry) => sum + entry.thicknessMm, 0);

  return (
    <div className="section-figure rounded-xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
          <div>Side A</div>
          <div className="mt-1 text-[0.58rem] tracking-[0.12em] opacity-80">Section preview</div>
        </div>
        <div className="text-right text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
          <div>{layers.length} layers</div>
          <div className="mt-1 text-[0.58rem] tracking-[0.12em] opacity-80">{formatIllustrationClampLabel("wall")}</div>
        </div>
      </div>

      <div className="mt-3">
        <SectionIllustration
          axis="wall"
          layers={layers.map(({ id, material, sourceRowIds, thicknessLabel, thicknessMm }, index) => ({
            active: activeRowId ? sourceRowIds.includes(activeRowId) : false,
            indexLabel: String(index + 1),
            key: id,
            material,
            ready: true,
            thicknessLabel,
            thicknessMm
          }))}
          orientation="wall"
        />
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
          <div>Side B</div>
          <div className="mt-1 text-[0.58rem] tracking-[0.12em] opacity-80">Visualized with bounded thickness cues</div>
        </div>
        <div className="text-right text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
          <div>{formatDecimal(totalThickness)} mm total</div>
          <div className="mt-1 text-[0.58rem] tracking-[0.12em] opacity-80">Calculation geometry unchanged</div>
        </div>
      </div>
    </div>
  );
}

export function LayerStackDiagram(props: {
  activeRowId: string | null;
  materials: readonly MaterialDefinition[];
  result: AssemblyCalculation | null;
  rows: readonly LayerDraft[];
  studyMode: StudyMode;
}) {
  const { activeRowId, materials, result, rows, studyMode } = props;
  const totalThickness = sumThickness(rows);
  const { collapsedLiveRowCount, solverLayerCount } = getRowActivityCounts(rows, materials);
  const resolved = buildSolverDisplayLayers(rows, materials);

  return (
    <section className={`min-w-0 overflow-hidden rounded border ${workbenchSectionCardClass("assembly")}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--line)] px-4 py-3">
        <div className={`text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${workbenchSectionEyebrowClass("assembly")}`}>
          {studyMode === "floor" ? "Floor section" : "Wall section"}
        </div>
        <div className="flex flex-wrap gap-3 text-[0.68rem] tabular-nums text-[color:var(--ink-faint)]">
          <span>{rows.length} rows</span>
          <span>{totalThickness > 0 ? `${formatDecimal(totalThickness)} mm` : "—"}</span>
          <span>{result ? `${formatDecimal(result.metrics.surfaceMassKgM2)} kg/m²` : "—"}</span>
        </div>
      </div>

      {resolved.length ? (
        <div className="grid gap-3 p-3">
          <div>
            {studyMode === "floor" ? (
              <FloorStackFigure activeRowId={activeRowId} layers={resolved} />
            ) : (
              <WallStackFigure activeRowId={activeRowId} layers={resolved} />
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                Technical layer schedule
              </div>
              <div className="text-[0.72rem] font-semibold text-[color:var(--ink-soft)]">
                {`${solverLayerCount} solver layer${solverLayerCount === 1 ? "" : "s"}`}
              </div>
            </div>
            <div className="grid gap-2 xl:grid-cols-2">
              {resolved.map(({ floorRole, id, material, sourceRowIds, thicknessLabel }, index) => (
                <LayerLegendRow
                  active={activeRowId ? sourceRowIds.includes(activeRowId) : false}
                  floorRole={floorRole}
                  index={index}
                  key={id}
                  material={material}
                  sourceRowIds={sourceRowIds}
                  studyMode={studyMode}
                  thicknessLabel={thicknessLabel}
                />
              ))}
            </div>
          </div>
          {collapsedLiveRowCount > 0 ? (
            <div className="text-[0.72rem] text-[color:var(--ink-faint)]">
              {`${collapsedLiveRowCount} adjacent row${collapsedLiveRowCount === 1 ? "" : "s"} collapse before calculation.`}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="px-4 py-4">
          <div className="rounded border border-dashed border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-5 text-[0.82rem] leading-6 text-[color:var(--ink-soft)]">
            Add valid layers to generate the section preview and live stack metrics.
          </div>
        </div>
      )}
    </section>
  );
}
