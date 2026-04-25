"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import TopBar from "@/components/layout/TopBar";
import StatusBar from "@/components/layout/StatusBar";
import ScanModal from "@/components/canvas/ScanModal";
import ScannerAnimation from "@/components/preview/ScannerAnimation";
import { useCanvasStore } from "@/store/canvasStore";
import { useGenerationStore } from "@/store/generationStore";
import { useSketchParser } from "@/hooks/useSketchParser";

// Dynamic imports for heavy canvas/preview components
const WorkspaceCanvas = dynamic(
  () => import("@/components/canvas/WorkspaceCanvas"),
  { ssr: false }
);

const LogicOverlay = dynamic(
  () => import("@/components/canvas/LogicOverlay"),
  { ssr: false }
);

export default function CanvasPage() {
  const [isScanOpen, setIsScanOpen] = useState(false);
  const sketchImageBase64 = useCanvasStore((s) => s.sketchImageBase64);
  const isEmpty = useCanvasStore((s) => s.isEmpty);
  const setSketchImageBase64 = useCanvasStore((s) => s.setSketchImageBase64);
  const status = useGenerationStore((s) => s.status);
  const setStatus = useGenerationStore((s) => s.setStatus);
  const { parse } = useSketchParser();

  const handleGenerate = useCallback(async () => {
    // If no sketch yet from Excalidraw, try snapshotting the canvas
    let image = sketchImageBase64;
    if (!image && typeof window !== "undefined") {
      const exportFn = (window as Window & { __excalidrawExport?: () => Promise<string | null> }).__excalidrawExport;
      if (exportFn) {
        const snap = await exportFn();
        if (snap) {
          setSketchImageBase64(snap);
          image = snap;
        }
      }
    }

    if (!image && isEmpty) {
      // Nothing to generate
      return;
    }

    await parse(image ?? undefined);
    // Code generation (Phase 3) will be wired here
  }, [sketchImageBase64, isEmpty, setSketchImageBase64, parse]);

  const handleExport = useCallback(() => {
    // Phase 4 — download generated files as zip
    console.log("Export coming in Phase 4");
  }, []);

  const isGenerating = status === "parsing" || status === "generating";
  const hasOutput = status === "done" || status === "refining";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#080b14]">
      <TopBar
        onGenerate={handleGenerate}
        onScan={() => setIsScanOpen(true)}
        onExport={handleExport}
      />

      {/* Main workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Canvas panel */}
        <div
          className="relative flex-1 overflow-hidden transition-all duration-500"
          style={{ maxWidth: hasOutput ? "55%" : "100%" }}
        >
          <WorkspaceCanvas />
          <LogicOverlay />
          <ScannerAnimation />

          {/* Scanned image indicator */}
          {sketchImageBase64 && !isGenerating && (
            <div className="absolute bottom-3 left-3 badge badge-cyan text-[10px] gap-1.5">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v2M16 20h2a2 2 0 0 0 2-2v-2" />
              </svg>
              Image loaded — ready to generate
            </div>
          )}
        </div>

        {/* Preview panel placeholder — Phase 3 */}
        {hasOutput && (
          <div className="flex-1 glass-panel border-l border-[rgba(255,255,255,0.06)] flex items-center justify-center">
            <p className="text-[#4b5563] text-sm">Preview pane — Phase 3</p>
          </div>
        )}
      </main>

      <StatusBar />

      {/* Scan modal */}
      <ScanModal isOpen={isScanOpen} onClose={() => setIsScanOpen(false)} />
    </div>
  );
}
