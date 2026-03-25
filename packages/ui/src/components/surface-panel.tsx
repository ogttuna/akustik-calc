import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "../lib/cx";

type SurfacePanelProps = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode;
};

export function SurfacePanel({ children, className, ...props }: SurfacePanelProps) {
  return (
    <section
      className={cx(
        "surface-shadow rounded-lg border bg-[color:var(--panel)] p-4 hairline",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
