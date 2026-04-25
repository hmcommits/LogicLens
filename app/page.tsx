"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "Draw Your Intent",
    desc: "Sketch on an infinite canvas or scan a paper napkin. Arrows become event handlers. Boxes become components.",
    color: "purple",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    title: "AI Topology Extraction",
    desc: "Gemini 2.5 Flash reads your sketch and constructs a Semantic Logic Graph — nodes, edges, behaviors, and intent.",
    color: "cyan",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "Live Code Synthesis",
    desc: "Gemini 2.5 Pro sees your image AND the logic graph. It generates React + Tailwind code that actually runs.",
    color: "pink",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Conversational Refinement",
    desc: "Chat to refine. \"Make it Cyberpunk.\" \"Add a sort button.\" Surgical edits. Preview updates in under 2 seconds.",
    color: "purple",
  },
];

const colorMap = {
  purple: {
    icon: "text-[#a78bfa]",
    bg: "bg-[rgba(108,99,255,0.08)]",
    border: "border-[rgba(108,99,255,0.2)]",
    glow: "group-hover:shadow-[0_0_24px_rgba(108,99,255,0.15)]",
  },
  cyan: {
    icon: "text-[#67e8f9]",
    bg: "bg-[rgba(0,212,255,0.08)]",
    border: "border-[rgba(0,212,255,0.2)]",
    glow: "group-hover:shadow-[0_0_24px_rgba(0,212,255,0.12)]",
  },
  pink: {
    icon: "text-[#f9a8d4]",
    bg: "bg-[rgba(255,107,203,0.08)]",
    border: "border-[rgba(255,107,203,0.2)]",
    glow: "group-hover:shadow-[0_0_24px_rgba(255,107,203,0.12)]",
  },
};

const steps = [
  { num: "01", label: "Draw", desc: "Sketch your UI on the canvas" },
  { num: "02", label: "Parse", desc: "AI extracts the logic graph" },
  { num: "03", label: "Generate", desc: "Code streams in real-time" },
  { num: "04", label: "Refine", desc: "Chat to iterate surgically" },
];

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* ── Nav ── */}
      <nav className="glass-panel border-b border-[rgba(255,255,255,0.06)] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5 select-none">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6c63ff] to-[#00d4ff] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="3" fill="currentColor" />
                <path d="M10 2 L10 6 M10 14 L10 18 M2 10 L6 10 M14 10 L18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight text-gradient">LogicLens</span>
          </div>
          <Link
            href="/canvas"
            id="nav-launch-btn"
            className="btn-brand"
            style={{ padding: "7px 18px", fontSize: "13px" }}
          >
            Launch App →
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[rgba(108,99,255,0.07)] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[rgba(0,212,255,0.05)] blur-[80px] pointer-events-none" />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="badge badge-brand mb-6 text-xs"
        >
          <span className="dot-live" style={{ width: 6, height: 6 }} />
          Powered by Gemini 2.5 Pro + Flash
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] max-w-4xl"
        >
          <span className="text-gradient">Sketch.</span>
          <br />
          <span className="text-[#f0f4ff]">Watch it work.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-[#8892a4] max-w-2xl leading-relaxed"
        >
          LogicLens is an <strong className="text-[#f0f4ff] font-semibold">Intent-to-App Engine</strong>.
          Draw arrows, boxes, and scribbles on a canvas. Our AI reads the topology,
          extracts the logic, and synthesizes a <strong className="text-[#f0f4ff] font-semibold">fully interactive React app</strong> — in seconds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-3"
        >
          <Link href="/canvas" id="hero-launch-btn" className="btn-brand" style={{ fontSize: "16px", padding: "12px 28px" }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Start Drawing
          </Link>
          <a
            href="https://github.com/hmcommits/LogicLens"
            target="_blank"
            rel="noopener noreferrer"
            id="hero-github-btn"
            className="btn-ghost"
            style={{ fontSize: "15px", padding: "11px 22px" }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </motion.div>

        {/* Mock sketch preview */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-16 w-full max-w-3xl relative"
        >
          <div className="glass-card p-1 border border-[rgba(255,255,255,0.08)] shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            {/* Fake window chrome */}
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[rgba(255,255,255,0.06)]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] opacity-70" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#eab308] opacity-70" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] opacity-70" />
              <span className="ml-3 text-[11px] text-[#4b5563]">LogicLens Canvas</span>
            </div>
            {/* Sketch illustration */}
            <div className="relative h-56 flex items-center justify-center bg-[rgba(13,17,23,0.6)] rounded-b-xl overflow-hidden">
              <svg viewBox="0 0 600 200" className="w-full h-full opacity-70" fill="none">
                {/* Medicine list box */}
                <rect x="60" y="30" width="160" height="140" rx="8" stroke="rgba(108,99,255,0.6)" strokeWidth="2" strokeDasharray="6 3" />
                <text x="140" y="22" textAnchor="middle" fill="rgba(167,139,250,0.7)" fontSize="11" fontFamily="monospace">Medicine List</text>
                <line x1="60" y1="65" x2="220" y2="65" stroke="rgba(108,99,255,0.3)" strokeWidth="1" />
                {["Aspirin 100mg", "Metformin 500mg", "Vitamin D3"].map((item, i) => (
                  <g key={item} transform={`translate(0, ${i * 32})`}>
                    <rect x="70" y="72" width="140" height="24" rx="4" fill="rgba(108,99,255,0.06)" />
                    <text x="82" y="88" fill="rgba(240,244,255,0.5)" fontSize="9" fontFamily="monospace">{item}</text>
                    <rect x="176" y="74" width="28" height="20" rx="3" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.3)" strokeWidth="1" />
                    <text x="190" y="87" textAnchor="middle" fill="rgba(34,197,94,0.7)" fontSize="8" fontFamily="monospace">Took</text>
                  </g>
                ))}
                {/* Arrow */}
                <path d="M220 88 Q340 88 340 50" stroke="rgba(0,212,255,0.7)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <defs>
                  <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="rgba(0,212,255,0.7)" />
                  </marker>
                </defs>
                <text x="285" y="82" fill="rgba(0,212,255,0.5)" fontSize="8" fontFamily="monospace" transform="rotate(-15, 285, 82)">increment dose</text>
                {/* Counter box */}
                <rect x="320" y="20" width="100" height="56" rx="8" stroke="rgba(0,212,255,0.5)" strokeWidth="2" strokeDasharray="6 3" />
                <text x="370" y="14" textAnchor="middle" fill="rgba(103,232,249,0.6)" fontSize="10" fontFamily="monospace">Counter</text>
                <text x="370" y="56" textAnchor="middle" fill="rgba(240,244,255,0.8)" fontSize="28" fontFamily="monospace" fontWeight="bold">3</text>
                {/* Neon glow on arrow */}
                <path d="M220 88 Q340 88 340 50" stroke="rgba(0,212,255,0.15)" strokeWidth="8" />
              </svg>
              {/* Scan animation overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[rgba(108,99,255,0.8)] to-transparent"
                  style={{ left: "60%", filter: "blur(1px)" }}
                />
              </div>
            </div>
          </div>
          {/* Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[rgba(108,99,255,0.08)] to-[rgba(0,212,255,0.06)] rounded-2xl blur-xl -z-10" />
        </motion.div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-6 border-t border-[rgba(255,255,255,0.05)]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f0f4ff] tracking-tight">
              From napkin to app in 4 steps
            </h2>
            <p className="mt-3 text-[#8892a4]">No wizards. No complex dashboards. Just draw.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card p-5 text-center relative overflow-hidden"
              >
                <div className="text-[3rem] font-black text-[rgba(108,99,255,0.1)] leading-none mb-2 select-none">
                  {step.num}
                </div>
                <div className="text-[#f0f4ff] font-semibold text-sm mb-1">{step.label}</div>
                <div className="text-[#8892a4] text-xs leading-relaxed">{step.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f0f4ff] tracking-tight">
              Built for engineers, not designers
            </h2>
            <p className="mt-3 text-[#8892a4]">Every feature serves the intent-to-app pipeline.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f, i) => {
              const c = colorMap[f.color as keyof typeof colorMap];
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className={`group glass-card p-6 border transition-all duration-300 ${c.border} ${c.glow}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${c.bg} ${c.icon}`}>
                    {f.icon}
                  </div>
                  <h3 className="text-[#f0f4ff] font-semibold text-base mb-2">{f.title}</h3>
                  <p className="text-[#8892a4] text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center relative overflow-hidden border-t border-[rgba(255,255,255,0.05)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(108,99,255,0.08),transparent)] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative max-w-xl mx-auto"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            <span className="text-gradient">Draw your intent.</span>
          </h2>
          <p className="text-[#8892a4] text-lg mb-10">
            No sign-up. No configuration. Just open the canvas and start.
          </p>
          <Link href="/canvas" id="footer-cta-btn" className="btn-brand" style={{ fontSize: "17px", padding: "14px 36px" }}>
            Open Canvas →
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[rgba(255,255,255,0.05)] py-6 px-6 text-center text-[#4b5563] text-xs">
        <span>LogicLens · Intent-to-App Engine · Powered by Gemini AI</span>
      </footer>
    </main>
  );
}
