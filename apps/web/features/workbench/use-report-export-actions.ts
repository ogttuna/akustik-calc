"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type ExportStatus = "idle" | "copied" | "downloaded" | "error";

export function useReportExportActions(markdown: string, filename: string) {
  const [status, setStatus] = useState<ExportStatus>("idle");
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  function flashStatus(nextStatus: ExportStatus) {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    setStatus(nextStatus);
    resetTimerRef.current = window.setTimeout(() => {
      setStatus("idle");
    }, 1800);
  }

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success("Markdown copied", {
        description: "The current acoustic brief is on your clipboard."
      });
      flashStatus("copied");
    } catch {
      toast.error("Copy failed", {
        description: "Browser clipboard permission blocked the export."
      });
      flashStatus("error");
    }
  }

  function downloadReport() {
    try {
      const blob = new Blob([markdown], {
        type: "text/markdown;charset=utf-8"
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Markdown downloaded", {
        description: filename
      });
      flashStatus("downloaded");
    } catch {
      toast.error("Download failed", {
        description: "The browser could not generate the markdown file."
      });
      flashStatus("error");
    }
  }

  return {
    copyReport,
    downloadReport,
    status
  };
}
