import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="min-w-0 max-w-full space-y-1.5">
      <div className="eyebrow">{eyebrow}</div>
      <div className="max-w-full space-y-1 md:max-w-3xl">
        <h2 className="text-wrap text-lg font-semibold leading-tight text-[color:var(--ink)]">
          {title}
        </h2>
        {description ? (
          <div className="max-w-full text-wrap text-sm leading-6 text-[color:var(--ink-soft)] md:max-w-2xl">{description}</div>
        ) : null}
      </div>
    </div>
  );
}
