import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-1.5">
      <div className="eyebrow">{eyebrow}</div>
      <div className="max-w-3xl space-y-1">
        <h2 className="text-lg font-semibold leading-tight tracking-[-0.02em] text-[color:var(--ink)]">
          {title}
        </h2>
        {description ? (
          <div className="max-w-2xl text-sm leading-6 text-[color:var(--ink-soft)]">{description}</div>
        ) : null}
      </div>
    </div>
  );
}
