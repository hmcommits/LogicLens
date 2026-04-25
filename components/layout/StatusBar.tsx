"use client";

import { useGenerationStore } from "@/store/generationStore";
import { motion, AnimatePresence } from "framer-motion";

const MODEL_LABELS: Record<string, string> = {
  parsing: "Gemini 2.5 Flash",
  generating: "Gemini 2.5 Pro",
  refining: "Gemini 2.5 Pro",
};

export default function StatusBar() {
  const status = useGenerationStore((s) => s.status);
  const activeKeyIndex = useGenerationStore((s) => s.activeKeyIndex);
  const lastLatencyMs = useGenerationStore((s) => s.lastLatencyMs);
  const logicGraph = useGenerationStore((s) => s.logicGraph);
  const errorMessage = useGenerationStore((s) => s.errorMessage);

  const activeModel = MODEL_LABELS[status] ?? null;
  const isActive = ["parsing", "generating", "refining"].includes(status);
  const isError = status === "error";

  return (
    <footer
      id="statusbar"
      className="glass-panel border-t border-[rgba(255,255,255,0.06)] h-7 flex items-center px-4 gap-4 text-[11px] text-[#4b5563] overflow-hidden"
    >
      {/* ── Left: Status ── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <AnimatePresence mode="wait">
          {isError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-[#ef4444]"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
              <span>{errorMessage ?? "An error occurred"}</span>
            </motion.div>
          ) : isActive ? (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-[#a78bfa]"
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="capitalize">{status}…</span>
            </motion.div>
          ) : status === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-[#22c55e]"
            >
              <div className="dot-live" />
              <span>Ready</span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#4b5563]" />
              <span>Idle</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-px h-3 bg-[rgba(255,255,255,0.06)] flex-shrink-0" />

      {/* ── Center: Active model ── */}
      <AnimatePresence mode="wait">
        {activeModel && (
          <motion.div
            key={activeModel}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-[#67e8f9]"
          >
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
              <circle cx="6" cy="6" r="2" />
              <path d="M6 1v2M6 9v2M1 6h2M9 6h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span>{activeModel}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {activeModel && (
        <div className="w-px h-3 bg-[rgba(255,255,255,0.06)] flex-shrink-0" />
      )}

      {/* ── API Key indicator ── */}
      <div
        className={`flex items-center gap-1.5 flex-shrink-0 ${
          activeKeyIndex === 2 ? "text-[#eab308]" : ""
        }`}
        title={activeKeyIndex === 2 ? "Using fallback API key" : "Using primary API key"}
      >
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          <path d="M8 5a3 3 0 1 1-4.5 2.6L8 3.5" />
          <path d="M5 7.5l1-1" />
          <path d="M7 5.5l1.5-1.5" />
        </svg>
        <span>Key {activeKeyIndex}</span>
        {activeKeyIndex === 2 && (
          <span className="badge badge-warning" style={{ fontSize: "9px", padding: "1px 5px" }}>
            Fallback
          </span>
        )}
      </div>

      {/* ── Latency ── */}
      {lastLatencyMs !== null && (
        <>
          <div className="w-px h-3 bg-[rgba(255,255,255,0.06)] flex-shrink-0" />
          <span className="flex-shrink-0">{lastLatencyMs}ms</span>
        </>
      )}

      {/* ── Right: Global intent (spacer + info) ── */}
      {logicGraph?.globalIntent && (
        <div className="ml-auto flex items-center gap-1.5 max-w-xs truncate">
          <div className="w-px h-3 bg-[rgba(255,255,255,0.06)] flex-shrink-0" />
          <span className="truncate text-[#4b5563]" title={logicGraph.globalIntent}>
            {logicGraph.globalIntent}
          </span>
        </div>
      )}
    </footer>
  );
}
