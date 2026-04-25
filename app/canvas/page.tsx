import TopBar from "@/components/layout/TopBar";
import StatusBar from "@/components/layout/StatusBar";

export const metadata = {
  title: "Canvas — LogicLens",
  description: "Draw your intent on the infinite canvas. LogicLens turns it into a working React app.",
};

export default function CanvasPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />
      <main className="flex-1 flex items-center justify-center bg-[#080b14] relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(108,99,255,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(108,99,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 text-center select-none">
          <div className="text-5xl mb-4">🎨</div>
          <p className="text-[#8892a4] text-sm">Canvas workspace coming in Phase 2</p>
          <p className="text-[#4b5563] text-xs mt-1">Draw your intent here soon…</p>
        </div>
      </main>
      <StatusBar />
    </div>
  );
}
