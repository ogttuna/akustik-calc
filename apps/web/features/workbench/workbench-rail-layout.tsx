"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";

type WorkbenchRailLayoutProps = {
  leftRail: ReactNode;
  centerRail: ReactNode;
  rightRail: ReactNode;
};

function ResizeHandle() {
  return (
    <Separator className="workbench-resize-handle hidden xl:flex" aria-label="Resize workbench rail">
      <div className="workbench-resize-grip">
        <GripVertical className="h-4 w-4" />
      </div>
    </Separator>
  );
}

export function WorkbenchRailLayout({ leftRail, centerRail, rightRail }: WorkbenchRailLayoutProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");
    const sync = () => setIsDesktop(mediaQuery.matches);

    sync();
    mediaQuery.addEventListener("change", sync);

    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  return (
    isDesktop ? (
      <section>
        <Group defaultLayout={{ center: 42, left: 24, right: 34 }} id="dynecho-workbench-layout" orientation="horizontal">
          <Panel defaultSize={24} id="left" minSize={18}>
            <div className="min-w-0 pr-3">{leftRail}</div>
          </Panel>
          <ResizeHandle />
          <Panel defaultSize={42} id="center" minSize={30}>
            <div className="min-w-0 px-3">{centerRail}</div>
          </Panel>
          <ResizeHandle />
          <Panel defaultSize={34} id="right" minSize={24}>
            <div className="min-w-0 pl-3">{rightRail}</div>
          </Panel>
        </Group>
      </section>
    ) : (
      <section className="grid gap-6">
        <div className="min-w-0">{leftRail}</div>
        <div className="min-w-0">{centerRail}</div>
        <div className="min-w-0">{rightRail}</div>
      </section>
    )
  );
}
