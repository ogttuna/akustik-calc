import { SurfacePanel } from "@dynecho/ui";

type PanelPlaceholderProps = {
  description: string;
  title: string;
};

export function PanelPlaceholder({ description, title }: PanelPlaceholderProps) {
  return (
    <SurfacePanel className="px-5 py-5">
      <div className="eyebrow">Loading lane</div>
      <h2 className="mt-1 font-display text-[1.9rem] leading-none tracking-[-0.04em]">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">{description}</p>
      <div className="mt-5 grid gap-3">
        <div className="h-14 rounded-[1.1rem] border hairline bg-black/[0.025]" />
        <div className="h-14 rounded-[1.1rem] border hairline bg-black/[0.025]" />
      </div>
    </SurfacePanel>
  );
}
