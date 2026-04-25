"use client";

import { useGenerationStore } from "@/store/generationStore";
import { Sandpack } from "@codesandbox/sandpack-react";
import { buildSandpackFiles } from "@/lib/sandbox/sandpackConfig";
import CodeViewer from "./CodeViewer";

export default function PreviewPane() {
  const status = useGenerationStore((s) => s.status);
  const files = useGenerationStore((s) => s.files);

  const isGenerating = status === "generating";
  const hasFiles = files && files.length > 0;

  // We are streaming, show the CodeViewer with the raw text
  if (isGenerating && hasFiles && files[0].path === "__streaming__") {
    return (
      <div className="flex-1 flex flex-col overflow-hidden glass-panel border-l border-[rgba(255,255,255,0.06)] relative bg-[#080b14]">
        <div className="flex items-center px-4 py-2 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
          <div className="w-2 h-2 rounded-full bg-[#00d4ff] mr-2 shadow-[0_0_8px_rgba(0,212,255,0.8)] animate-pulse" />
          <span className="text-xs font-medium text-[#00d4ff] uppercase tracking-wider font-[family-name:var(--font-jetbrains-mono)]">
            Synthesizing Code...
          </span>
        </div>
        <CodeViewer content={files[0].content} />
      </div>
    );
  }

  // Done generating, show the Sandpack preview
  if (hasFiles && files[0].path !== "__streaming__") {
    const sandpackFiles = buildSandpackFiles(files);
    
    return (
      <div className="flex-1 flex flex-col overflow-hidden glass-panel border-l border-[rgba(255,255,255,0.06)] relative bg-[#080b14]">
        <Sandpack
          template="react-ts"
          theme="dark"
          files={sandpackFiles}
          options={{
            showNavigator: true,
            showTabs: true,
            editorHeight: "100%",
            externalResources: ["https://cdn.tailwindcss.com"],
            classes: {
              "sp-wrapper": "h-full w-full custom-sandpack-wrapper",
              "sp-layout": "h-full w-full",
            }
          }}
          customSetup={{
            dependencies: {
              "lucide-react": "latest",
              "framer-motion": "latest",
            }
          }}
        />
      </div>
    );
  }

  // Empty state placeholder
  return (
    <div className="flex-1 flex flex-col overflow-hidden glass-panel border-l border-[rgba(255,255,255,0.06)] relative bg-[#080b14] items-center justify-center">
      <div className="w-16 h-16 rounded-full border border-[rgba(255,255,255,0.08)] flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-[#4b5563]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </div>
      <p className="text-[#4b5563] text-sm text-center max-w-[200px]">
        Generate your intent to see the live preview and code.
      </p>
    </div>
  );
}
