# LogicLens — Execution Task List

> Track progress against the approved architecture plan (`ARCHITECTURE.md`).
> Format: `[ ]` todo · `[/]` in progress · `[x]` done

---

## Phase 1 — Project Scaffold & Design System

- [ ] Initialize Next.js 15 project with TypeScript (`npx create-next-app@latest`)
- [ ] Install and configure Tailwind CSS v4
- [ ] Install shadcn/ui and initialize component library
- [ ] Install core dependencies: Zustand, Framer Motion, Excalidraw, Sandpack, Zod, @google/generative-ai
- [ ] Create `.env.example` with `GEMINI_API_KEY_1` and `GEMINI_API_KEY_2` placeholders
- [ ] Set up dark theme CSS variable system in `globals.css` (glassmorphism tokens)
- [ ] Configure Google Fonts (Inter / Outfit) in `layout.tsx`
- [ ] Build `TopBar` component (logo, Generate button, Export action)
- [ ] Build `StatusBar` component (active model display, key indicator, latency)
- [ ] Build landing page (`app/page.tsx`) with hero section and CTA to `/canvas`

---

## Phase 2 — Canvas & Input Layer

- [ ] Embed Excalidraw in `WorkspaceCanvas.tsx` with infinite canvas config
- [ ] Implement canvas snapshot export (Excalidraw → PNG → base64)
- [ ] Build `ScanModal.tsx` — webcam capture via `getUserMedia`, canvas frame grab
- [ ] Implement `canvasStore.ts` (Zustand): `elements`, `sketchImageBase64`, `scanState`
- [ ] Build `LogicOverlay.tsx` — absolute SVG layer over Excalidraw for glow effects
- [ ] Implement "pulsing prompt" overlay animation on empty canvas state
- [ ] Wire **Generate** button → snapshot export → trigger parse pipeline

---

## Phase 3 — AI Vision Pipeline (Parse Sketch)

- [ ] Build `lib/ai/geminiClient.ts` — SDK init + dual-key failover wrapper
- [ ] Define `LogicGraph` Zod schema in `lib/schemas/logicGraph.ts`
- [ ] Build `lib/ai/parseSketch.ts` — Gemini 2.5 Flash multimodal prompt + response parser
- [ ] Build `/api/parse-sketch/route.ts` — POST endpoint, 2-retry Zod validation
- [ ] Build `useSketchParser.ts` hook — calls API, populates `generationStore`
- [ ] Build `generationStore.ts` (Zustand): `logicGraph`, `generatedFiles`, `streamingStatus`
- [ ] Animate `LogicOverlay` glow effects when `logicGraph` is populated
- [ ] Build `ScannerAnimation.tsx` — Framer Motion sweep triggered on Generate

---

## Phase 4 — Code Generation & Live Sandbox

- [ ] Define `GeneratedProject` Zod schema in `lib/schemas/generatedCode.ts`
- [ ] Build `lib/ai/generateCode.ts` — Gemini 2.5 Pro prompt with image + LogicGraph input
- [ ] Build `/api/generate-code/route.ts` — Edge Function, SSE streaming response
- [ ] Build `useCodeGenerator.ts` hook — SSE consumer, streams files into store
- [ ] Build `lib/sandbox/sandpackConfig.ts` — dynamic template builder from `GeneratedProject`
- [ ] Build `PreviewPane.tsx` — Sandpack provider with Preview and Code tabs
- [ ] Build `CodeViewer.tsx` — syntax-highlighted streaming code display
- [ ] Wire full pipeline: Canvas snapshot → Parse → Generate → Sandpack preview
- [ ] Test with real sketch: draw 2 boxes + arrow, verify live interactive output

---

## Phase 5 — Refinement Chat

- [ ] Build `lib/ai/refineCode.ts` — surgical patch prompt (image + graph + code + message)
- [ ] Build `/api/refine-code/route.ts` — Edge Function, SSE streaming patch response
- [ ] Build `useRefiner.ts` hook — SSE consumer, calls `sandpack.updateFile()` per patched file
- [ ] Build `chatStore.ts` (Zustand): `chatHistory`, `activeKey`
- [ ] Build `RefinementChat.tsx` — collapsible bottom drawer, message input
- [ ] Build `ReasoningPanel.tsx` — displays `logicGraph.aiReasoning` for transparency
- [ ] Test refinement: "make it dark themed" → verify only changed files update in < 2s

---

## Phase 6 — Polish, SEO & Deployment

- [ ] Three-panel layout finalization (canvas | preview pane | chat drawer)
- [ ] Responsive layout adjustments for smaller screens
- [ ] Micro-animations: hover effects, button press feedback, panel transitions
- [ ] Generate OG image for social sharing (`public/og-image.png`)
- [ ] Add meta tags, title tags, semantic HTML to all pages
- [ ] Final `next build` and error resolution
- [ ] Deploy to Vercel, set `GEMINI_API_KEY_1` and `GEMINI_API_KEY_2` in Vercel env
- [ ] Configure Edge Function runtime for all API routes
- [ ] Smoke test full pipeline on deployed URL
- [ ] Update `README.md` with setup instructions and demo

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
