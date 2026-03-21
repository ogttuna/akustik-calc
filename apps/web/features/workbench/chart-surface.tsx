"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { useHasMounted } from "./use-has-mounted";

type ChartSurfaceProps = {
  children: (size: { height: number; width: number }) => ReactNode;
  className: string;
  placeholder: string;
};

function readRenderableSize(element: HTMLDivElement): { height: number; width: number } | null {
  const width = element.clientWidth;
  const height = element.clientHeight;

  if (width <= 0 || height <= 0) {
    return null;
  }

  return { height, width };
}

export function ChartSurface({ children, className, placeholder }: ChartSurfaceProps) {
  const hasMounted = useHasMounted();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<{ height: number; width: number } | null>(null);

  useEffect(() => {
    if (!hasMounted) {
      setSize(null);
      return;
    }

    const element = containerRef.current;
    if (!element) {
      return;
    }

    let frameId = 0;
    const updateReadyState = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        setSize(readRenderableSize(element));
      });
    };

    updateReadyState();

    const observer = new ResizeObserver(() => {
      updateReadyState();
    });

    observer.observe(element);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [hasMounted]);

  return (
    <div className={`${className} min-h-0 min-w-0`} ref={containerRef}>
      {size ? (
        children(size)
      ) : (
        <div className="flex h-full items-center justify-center rounded-[1rem] bg-black/[0.02] text-sm text-[color:var(--ink-soft)]">
          {placeholder}
        </div>
      )}
    </div>
  );
}
