import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-3">
      <div className="eyebrow">{eyebrow}</div>
      <div className="max-w-3xl space-y-2">
        <h2 className="font-display text-[clamp(1.8rem,3vw,3.4rem)] leading-[0.92] tracking-[-0.04em] text-[color:var(--ink)] text-balance">
          {title}
        </h2>
        {description ? (
          <div className="max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">{description}</div>
        ) : null}
      </div>
    </div>
  );
}
