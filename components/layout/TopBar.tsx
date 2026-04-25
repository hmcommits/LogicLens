"use client";

import { useGenerationStore } from "@/store/generationStore";
import { useCanvasStore } from "@/store/canvasStore";
import { motion } from "framer-motion";

interface TopBarProps {
  onGenerate?: () => void;
  onExport?: () => void;
}

export default function TopBar({ onGenerate, onExport }: TopBarProps) {
  const status = useGenerationStore((s) => s.status);
  const sketchImageBase64 = useCanvasStore((s) => s.sketchImageBase64);
  const isEmpty = useCanvasStore((s) => s.isEmpty);

  const isGenerating = status === "parsing" || status === "generating";
  const hasOutput = status === "done" || status === "refining";
  const canGenerate = !isEmpty || !!sketchImageBase64;

  return (
    <header
      id="topbar"
      className="glass-panel sticky top-0 z-50 flex items-center justify-between px-4 h-14 border-b border-[rgba(255,255,255,0.08)]"
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 select-none">
        <div className="relative flex items-center justify-center w-8 h-8">
          {/* Animated logo mark */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#6c63ff] to-[#00d4ff] opacity-80" />
          <svg
            className="relative z-10 w-5 h-5 text-white"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="3" fill="currentColor" />
            <path
              d="M10 2 L10 6 M10 14 L10 18 M2 10 L6 10 M14 10 L18 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M4.9 4.9 L7.8 7.8 M12.2 12.2 L15.1 15.1 M15.1 4.9 L12.2 7.8 M7.8 12.2 L4.9 15.1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span className="font-bold text-base tracking-tight text-gradient">
          LogicLens
        </span>
        <span className="hidden sm:block badge badge-brand">Beta</span>
      </div>

      {/* ── Center — pipeline stage indicator ── */}
      <div className="hidden md:flex items-center gap-1.5">
        {(["Draw", "Parse", "Generate", "Live"] as const).map((stage, idx) => {
          const stageStatus = getStageStatus(stage, status);
          return (
            <div key={stage} className="flex items-center gap-1.5">
              {idx > 0 && (
                <div className="w-6 h-px bg-[rgba(255,255,255,0.1)]" />
              )}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-300 ${
                  stageStatus === "active"
                    ? "bg-[rgba(108,99,255,0.2)] text-[#a78bfa] border border-[rgba(108,99,255,0.4)]"
                    : stageStatus === "done"
                    ? "bg-[rgba(34,197,94,0.12)] text-[#22c55e] border border-[rgba(34,197,94,0.25)]"
                    : "text-[#4b5563] border border-transparent"
                }`}
              >
                {stageStatus === "active" && (
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                {stageStatus === "done" && (
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {stage}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center gap-2">


        {/* Export button — only shown when there's generated output */}
        {hasOutput && (
          <motion.button
            id="topbar-export-btn"
            onClick={onExport}
            className="btn-ghost"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.97 }}
            aria-label="Export generated code"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export</span>
          </motion.button>
        )}

        {/* Generate button */}
        <motion.button
          id="topbar-generate-btn"
          onClick={onGenerate}
          disabled={!canGenerate || isGenerating}
          className="btn-brand relative overflow-hidden"
          aria-label="Generate app from sketch"
          whileHover={!isGenerating && canGenerate ? { scale: 1.02 } : {}}
          whileTap={!isGenerating && canGenerate ? { scale: 0.97 } : {}}
        >
          {!isGenerating && canGenerate && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          )}
          {isGenerating ? (
            <>
              <motion.div
                className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
              <span>{status === "parsing" ? "Parsing…" : "Generating…"}</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" />
              </svg>
              <span>Generate</span>
            </>
          )}
        </motion.button>
      </div>
    </header>
  );
}

type Stage = "Draw" | "Parse" | "Generate" | "Live";
type StageStatus = "inactive" | "active" | "done";

function getStageStatus(stage: Stage, status: ReturnType<typeof useGenerationStore.getState>["status"]): StageStatus {
  switch (stage) {
    case "Draw":
      return status === "idle" ? "active" : "done";
    case "Parse":
      if (status === "parsing") return "active";
      if (["parse-done", "generating", "done", "refining"].includes(status)) return "done";
      return "inactive";
    case "Generate":
      if (status === "generating") return "active";
      if (["done", "refining"].includes(status)) return "done";
      return "inactive";
    case "Live":
      if (status === "done" || status === "refining") return "active";
      return "inactive";
    default:
      return "inactive";
  }
}
