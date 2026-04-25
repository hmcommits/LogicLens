"use client";

import { useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useCanvasStore } from "@/store/canvasStore";
import { motion, AnimatePresence } from "framer-motion";

// Excalidraw must be dynamically imported — it uses browser-only APIs
const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  { ssr: false, loading: () => <CanvasLoading /> }
);

function CanvasLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#080b14]">
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className="w-8 h-8 rounded-full border-2 border-[rgba(108,99,255,0.3)] border-t-[#6c63ff]"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        />
        <span className="text-[#4b5563] text-xs">Loading canvas…</span>
      </div>
    </div>
  );
}

interface WorkspaceCanvasProps {
  onSnapshotReady?: (base64: string) => void;
}

export default function WorkspaceCanvas({ onSnapshotReady }: WorkspaceCanvasProps) {
  const excalidrawApiRef = useRef<InstanceType<typeof import("@excalidraw/excalidraw").Excalidraw> | null>(null);
  const setElements = useCanvasStore((s) => s.setElements);
  const setSketchImageBase64 = useCanvasStore((s) => s.setSketchImageBase64);
  const isEmpty = useCanvasStore((s) => s.isEmpty);

  // Export the current canvas as a base64 PNG
  const exportSnapshot = useCallback(async (): Promise<string | null> => {
    const api = excalidrawApiRef.current;
    if (!api) return null;

    const elements = api.getSceneElements();
    if (!elements || elements.length === 0) return null;

    try {
      const { exportToBlob } = await import("@excalidraw/excalidraw");
      const blob = await exportToBlob({
        elements,
        appState: {
          ...api.getAppState(),
          exportWithDarkMode: true,
          exportBackground: true,
        },
        files: api.getFiles(),
        mimeType: "image/png",
        quality: 0.95,
      });

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Strip the data URL prefix — keep only the base64 content
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("Snapshot export failed:", err);
      return null;
    }
  }, []);

  // Expose snapshot function to parent via store
  useEffect(() => {
    // Store the export function so TopBar's Generate button can call it
    (window as Window & { __excalidrawExport?: () => Promise<string | null> }).__excalidrawExport = exportSnapshot;
  }, [exportSnapshot]);

  return (
    <div className="relative w-full h-full">
      {/* Excalidraw canvas */}
      <div className="absolute inset-0">
        <Excalidraw
          // @ts-expect-error — Excalidraw ref typing varies by version
          ref={excalidrawApiRef}
          theme="dark"
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: false,
              export: false,
              loadScene: false,
              saveToActiveFile: false,
              saveAsImage: false,
            },
            tools: { image: true },
          }}
          initialData={{
            appState: {
              viewBackgroundColor: "#080b14",
              gridSize: null,
              theme: "dark",
            },
          }}
          onChange={(elements) => {
            setElements(elements as unknown[]);
          }}
        />
      </div>

      {/* Empty state — pulsing "Draw your intent" prompt */}
      <AnimatePresence>
        {isEmpty && (
          <motion.div
            key="empty-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4 select-none">
              {/* Pulsing ring */}
              <motion.div
                className="w-16 h-16 rounded-full border-2 border-[rgba(108,99,255,0.4)] flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(108,99,255,0.4)",
                    "0 0 0 16px rgba(108,99,255,0)",
                  ],
                }}
                transition={{ duration: 2.4, repeat: Infinity }}
              >
                <svg
                  className="w-7 h-7 text-[rgba(108,99,255,0.6)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </motion.div>

              <div className="text-center">
                <motion.p
                  className="text-[#8892a4] text-sm font-medium"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Draw your intent
                </motion.p>
                <p className="text-[#4b5563] text-xs mt-1">
                  Sketch boxes, arrows, and labels — then hit Generate
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Exported helper — called by the Generate button in TopBar
export async function captureCanvasSnapshot(setSketchImageBase64: (b: string | null) => void): Promise<string | null> {
  const exportFn = (window as Window & { __excalidrawExport?: () => Promise<string | null> }).__excalidrawExport;
  if (!exportFn) return null;
  const base64 = await exportFn();
  if (base64) setSketchImageBase64(base64);
  return base64;
}
