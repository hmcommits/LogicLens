"use client";

import { useEffect, useRef } from "react";

interface CodeViewerProps {
  content: string;
}

export default function CodeViewer({ content }: CodeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as code streams in
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative font-[family-name:var(--font-jetbrains-mono)] text-[13px] leading-relaxed"
    >
      <pre className="text-[#a78bfa] whitespace-pre-wrap break-words opacity-80">
        {content}
      </pre>
      
      {/* Blinking cursor effect at the end of the text */}
      <span className="inline-block w-2 h-4 bg-[#6c63ff] ml-1 align-middle animate-pulse" />
    </div>
  );
}
