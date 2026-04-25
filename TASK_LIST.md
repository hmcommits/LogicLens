# LogicLens — Execution Task List

> Track progress against the approved architecture plan (`ARCHITECTURE.md`).
> Format: `[ ]` todo · `[/]` in progress · `[x]` done

---

## Phase 1 — Project Scaffold & Design System ✅

- [x] Initialize Next.js 15 project with TypeScript (`npx create-next-app@latest`)
- [x] Install and configure Tailwind CSS v4 (installed via scaffold)
- [x] Install core dependencies: Zustand, Framer Motion, Excalidraw, Sandpack, Zod, @google/generative-ai
- [x] Create `.env.example` with `GEMINI_API_KEY_1` and `GEMINI_API_KEY_2` placeholders
- [x] Set up dark theme CSS variable system in `globals.css` (glassmorphism tokens, animations, utility classes)
- [x] Configure Google Fonts (Inter + JetBrains Mono) in `layout.tsx` with full SEO metadata
- [x] Create all 3 Zustand stores: `canvasStore`, `generationStore`, `chatStore`
- [x] Build `TopBar` component (logo, pipeline stage breadcrumb, Scan/Export/Generate buttons)
- [x] Build `StatusBar` component (active model display, key indicator, latency, globalIntent)
- [x] Build landing page (`app/page.tsx`) with hero, 4-step guide, features grid, CTA
- [x] Build canvas page stub (`app/canvas/page.tsx`) with TopBar + StatusBar wired

---

## Phase 2 — Canvas & Input Layer ✅

- [x] Embed Excalidraw in `WorkspaceCanvas.tsx` with dark theme + dynamic import (SSR-safe)
- [x] Implement canvas snapshot export (Excalidraw → `exportToBlob` → base64 PNG)
- [x] Build `ScanModal.tsx` — webcam via `getUserMedia` + file upload fallback, 3-phase flow
- [x] Build `LogicOverlay.tsx` — absolute SVG layer with glow edges, node highlights, confidence colors
- [x] Build `ScannerAnimation.tsx` — sweep bar + scan lines + centered status chip
- [x] Implement pulsing "Draw your intent" prompt on empty canvas state
- [x] Wire Generate button → snapshot export → `useSketchParser` hook → `/api/parse-sketch`
- [x] Build `lib/ai/geminiClient.ts` — dual-key failover proxy wrapper
- [x] Build `lib/ai/prompts.ts` — prompt builders for parse, generate, refine
- [x] Build `lib/schemas/logicGraph.ts` — Zod schema + `parseLogicGraphResponse`
- [x] Build `/api/parse-sketch` route (Gemini 2.5 Flash, 2-retry validation)
- [x] Build `/api/generate-code` route (Edge, SSE, Gemini 2.5 Pro)
- [x] Build `/api/refine-code` route (Edge, SSE, Gemini 2.5 Pro)
- [x] Wire full canvas page with all Phase 2 components

---

## Phase 3 — AI Vision Pipeline (Parse Sketch)

- [x] Build `lib/ai/geminiClient.ts` — SDK init + dual-key failover wrapper
- [x] Define `LogicGraph` Zod schema in `lib/schemas/logicGraph.ts`
- [x] Build `lib/ai/parseSketch.ts` — Gemini 2.5 Flash multimodal prompt + response parser
- [x] Build `/api/parse-sketch/route.ts` — POST endpoint, 2-retry Zod validation
- [x] Build `useSketchParser.ts` hook — calls API, populates `generationStore`
- [x] Build `generationStore.ts` (Zustand): `logicGraph`, `generatedFiles`, `streamingStatus`
- [x] Animate `LogicOverlay` glow effects when `logicGraph` is populated
- [x] Build `ScannerAnimation.tsx` — Framer Motion sweep triggered on Generate

---

## Phase 4 — Code Generation & Live Sandbox

- [x] Define `GeneratedProject` Zod schema in `lib/schemas/generatedCode.ts`
- [x] Build `lib/ai/generateCode.ts` — Gemini 2.5 Pro prompt with image + LogicGraph input
- [x] Build `/api/generate-code/route.ts` — Edge Function, SSE streaming response
- [x] Build `useCodeGenerator.ts` hook — SSE consumer, streams files into store
- [x] Build `lib/sandbox/sandpackConfig.ts` — dynamic template builder from `GeneratedProject`
- [x] Build `PreviewPane.tsx` — Sandpack provider with Preview and Code tabs
- [x] Build `CodeViewer.tsx` — syntax-highlighted streaming code display
- [x] Wire full pipeline: Canvas snapshot → Parse → Generate → Sandpack preview
- [x] Test with real sketch: draw 2 boxes + arrow, verify live interactive output

---

## Phase 5 — Refinement Chat

- [x] Build `lib/ai/refineCode.ts` — surgical patch prompt (image + graph + code + message)
- [x] Build `/api/refine-code/route.ts` — Edge Function, SSE streaming patch response
- [x] Build `useRefiner.ts` hook — SSE consumer, calls `sandpack.updateFile()` per patched file
- [x] Build `chatStore.ts` (Zustand): `chatHistory`, `activeKey`
- [x] Build `RefinementChat.tsx` — collapsible bottom drawer, message input
- [x] Build `ReasoningPanel.tsx` — displays `logicGraph.aiReasoning` for transparency
- [x] Test refinement: "make it dark themed" → verify only changed files update in < 2s

---

## Phase 6 — Polish, SEO & Deployment

- [-] Three-panel layout finalization (canvas | preview pane | chat drawer)
- [-] Responsive layout adjustments for smaller screens
- [x] Micro-animations: hover effects, button press feedback, panel transitions
- [-] Generate OG image for social sharing (`public/og-image.png`)
- [-] Add meta tags, title tags, semantic HTML to all pages
- [ ] Final `next build` and error resolution
- [ ] Deploy to Vercel, set `GEMINI_API_KEY_1` and `GEMINI_API_KEY_2` in Vercel env
- [ ] Configure Edge Function runtime for all API routes
- [ ] Smoke test full pipeline on deployed URL
- [x] Update `README.md` with setup instructions and demo

---

## Notes & Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-04-25 | Gemini 2.5 Pro receives image + LogicGraph JSON | Image provides visual layout fidelity beyond what JSON alone captures |
| 2026-04-25 | No auth, no DB | Simplicity, free tier, focus on core UX flow |
| 2026-04-25 | Excalidraw for canvas | Production-ready, open-source, exports PNG cleanly |
| 2026-04-25 | Dual API key failover | User provides 2 keys; automatic transparent failover on quota errors |
| 2026-04-25 | Sandpack over E2B | Client-side, zero cost, zero cold start — fits free-tier deployment goal |
| 2026-04-25 | Edge Functions for API routes | Bypasses Vercel's 10s serverless timeout for long SSE streams |
