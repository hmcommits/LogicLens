# LogicLens — Complete Architectural Plan

> **Status:** Approved ✅ | Last Updated: 2026-04-25

## Vision Summary

**LogicLens** is an **Intent-to-App Engine** that transforms rough whiteboard sketches or photo uploads into fully functional, interactive React applications in real time. It extracts **Semantic Logic Graphs** from user drawings — treating arrows, boxes, and scribbles as behavioral contracts — and synthesizes live, runnable code.

**Scope:** Canvas → Sketch Parsing → Code Generation → Live Preview → Refinement Chat. No auth. No DB persistence.

---

## System Overview

```
User (Browser)
    │
    ├─► [Draw on Excalidraw Canvas]
    │         │
    │         ▼
    │   [Snapshot: PNG/Base64]
    │         │
    │         ▼
    │   /api/parse-sketch
    │   └─► Gemini 2.5 Flash (Vision)
    │         image → LogicGraph JSON
    │         │
    │         ▼
    │   /api/generate-code  (SSE Stream)
    │   └─► Gemini 2.5 Pro (Vision + Code)
    │         image + LogicGraph JSON → React/Tailwind code
    │         │
    │         ▼
    │   Sandpack (Client-Side Sandbox)
    │   └─► Live interactive preview
    │
    └─► [Refinement Chat]
              │
              ▼
        /api/refine-code  (SSE Stream)
        └─► Gemini 2.5 Pro
              image + LogicGraph + currentCode + userMessage → patched files
```

---

## Critical Design Decision: Dual-Model, Dual-Input Pipeline

> This is the core intelligence architecture of LogicLens.

### Why Gemini 2.5 Pro receives BOTH the image AND the LogicGraph JSON

**Phase 1 — Vision Parsing** uses Gemini 2.5 Flash (fast, cheap) to extract the structured `LogicGraph` JSON from the sketch.

**Phase 2 — Code Synthesis** uses Gemini 2.5 Pro and receives:
- **The original sketch image** → visual proportions, spatial layout, color palette hints, element density, visual hierarchy
- **The LogicGraph JSON** → structured semantic data: component names, edge behaviors, inferred interactions

Giving Pro **both inputs** means:
- It can match code layout to the *actual visual proportions* in the sketch
- It can resolve ambiguities in the JSON using visual evidence
- Styling decisions (spacing, font sizes, color tone) are grounded in the actual sketch rather than generic defaults
- The result is dramatically more "sketch-faithful" than JSON-only code generation

The same dual-input strategy applies to the **Refinement Chat** — Pro always has the original image as ground truth context.

---

## Dual API Key Failover Strategy

Two Gemini API keys are accepted via `.env`. A lightweight `geminiClient.ts` wrapper implements automatic failover:

```
Primary Key (GEMINI_API_KEY_1)
    │
    ▼
API Call attempt
    │
    ├── ✅ Success → return response
    │
    └── ❌ Error (429 / 503 / quota exceeded)
              │
              ▼
        Secondary Key (GEMINI_API_KEY_2)
              │
              ▼
        Retry same call
              │
              ├── ✅ Success → return response
              │
              └── ❌ Error → throw to caller with combined error context
```

The failover is transparent — the calling route handler doesn't need to know which key succeeded.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSR + API Routes + Edge Functions in one repo |
| **Language** | TypeScript | Type-safe AI response schemas |
| **Styling** | Tailwind CSS v4 + shadcn/ui | IDE-grade dark aesthetic, utility-first |
| **Canvas** | Excalidraw (embedded) | Production-ready infinite canvas, exports PNG |
| **AI — Vision** | Gemini 2.5 Flash | Fast multimodal sketch parsing → LogicGraph |
| **AI — Code** | Gemini 2.5 Pro | Deep reasoning: image + JSON → React code |
| **Streaming** | Server-Sent Events (SSE) via Edge Route Handlers | Real-time code streaming, bypasses 10s timeout |
| **Code Sandbox** | Sandpack (CodeSandbox SDK) | Client-side, zero cold start, free, supports Tailwind |
| **State** | Zustand | Lightweight, no boilerplate |
| **Animations** | Framer Motion | Scanner sweep, panel transitions, chat drawer |
| **Deployment** | Vercel (free tier, Edge Functions) | Native Next.js, SSE-compatible |

**No auth. No database. No persistence.** Sessions are fully in-memory/client-side.

---

## Environment Variables

```env
# .env.local
GEMINI_API_KEY_1=your_primary_key_here
GEMINI_API_KEY_2=your_fallback_key_here
```

---

## Directory Structure

```
logiclens/
├── app/
│   ├── layout.tsx                  # Root layout (fonts, global providers)
│   ├── page.tsx                    # Landing page (hero, CTA → /canvas)
│   ├── canvas/
│   │   └── page.tsx                # Main workspace
│   └── api/
│       ├── parse-sketch/
│       │   └── route.ts            # POST: image → LogicGraph JSON
│       ├── generate-code/
│       │   └── route.ts            # POST (SSE): image + LogicGraph → code stream
│       └── refine-code/
│           └── route.ts            # POST (SSE): image + graph + code + msg → patch stream
│
├── components/
│   ├── canvas/
│   │   ├── WorkspaceCanvas.tsx     # Excalidraw wrapper, snapshot export
│   │   ├── ScanModal.tsx           # Webcam capture → base64 image
│   │   └── LogicOverlay.tsx        # SVG glow layer over recognized connections
│   ├── preview/
│   │   ├── PreviewPane.tsx         # Sandpack provider + tabs (Preview / Code)
│   │   ├── CodeViewer.tsx          # Syntax-highlighted streaming code panel
│   │   └── ScannerAnimation.tsx    # Framer Motion "Semantic Scanner" sweep
│   ├── chat/
│   │   ├── RefinementChat.tsx      # Bottom drawer chat interface
│   │   └── ReasoningPanel.tsx      # AI reasoning transparency (aiReasoning field)
│   ├── layout/
│   │   ├── TopBar.tsx              # Logo, Generate button, Export
│   │   └── StatusBar.tsx           # Active model, latency, key in use (Key 1 / Key 2)
│   └── ui/                         # shadcn/ui primitives + custom tokens
│
├── lib/
│   ├── ai/
│   │   ├── geminiClient.ts         # SDK init + dual-key failover wrapper
│   │   ├── parseSketch.ts          # Vision prompt builder for Flash
│   │   ├── generateCode.ts         # Code gen prompt builder for Pro (image + JSON)
│   │   └── refineCode.ts           # Surgical patch prompt builder for Pro
│   ├── schemas/
│   │   ├── logicGraph.ts           # Zod schema: LogicGraph, LogicNode, LogicEdge
│   │   └── generatedCode.ts        # Zod schema: CodeFile[], GeneratedProject
│   └── sandbox/
│       └── sandpackConfig.ts       # Dynamic Sandpack template builder
│
├── store/
│   ├── canvasStore.ts              # Excalidraw elements, sketchImageBase64, scanState
│   ├── generationStore.ts          # logicGraph, generatedFiles, streamingStatus
│   └── chatStore.ts                # chatHistory, refinementDiffs, activeKey
│
├── hooks/
│   ├── useSketchParser.ts          # Calls /api/parse-sketch, populates generationStore
│   ├── useCodeGenerator.ts         # SSE consumer for /api/generate-code
│   └── useRefiner.ts               # SSE consumer for /api/refine-code
│
├── styles/
│   └── globals.css                 # Tailwind directives, dark theme CSS variables
│
├── public/
│   └── og-image.png
│
├── ARCHITECTURE.md                 # This file
├── TASK_LIST.md                    # Execution task tracker
├── PROJECT_DESCRIPTION.md          # Original project manifest
├── USER_STORY_EXAMPLE.md           # User journey reference
├── .env.local                      # API keys (gitignored)
├── .env.example                    # Template (committed)
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Core Data Models

### `LogicGraph` — Output of AI Vision Parsing

```typescript
interface LogicNode {
  id: string;
  type: "container" | "button" | "input" | "text" | "icon" | "list" | "counter" | "unknown";
  label: string;
  boundingBox: { x: number; y: number; w: number; h: number };
  inferredComponent: string;  // e.g. "MedicineList", "DoseCounter"
}

interface LogicEdge {
  id: string;
  sourceId: string;
  targetId: string;
  annotation: string;         // text scribbled on/near the arrow
  inferredBehavior: string;   // e.g. "onClick: increment counter state"
  confidence: number;         // 0.0 – 1.0
}

interface LogicGraph {
  nodes: LogicNode[];
  edges: LogicEdge[];
  globalIntent: string;           // e.g. "Medication tracking dashboard"
  suggestedComponents: string[];
  aiReasoning: string;            // Transparency: explains how arrows were mapped
}
```

### `GeneratedProject` — Output of Code Synthesis

```typescript
interface CodeFile {
  path: string;     // e.g. "App.tsx", "components/MedicineList.tsx"
  content: string;
}

interface GeneratedProject {
  files: CodeFile[];
  entryPoint: string;                     // "App.tsx"
  dependencies: Record<string, string>;  // { "framer-motion": "^11.0.0" }
}
```

---

## AI Pipeline — Detailed Flow

### Step 1: Sketch Parsing (`/api/parse-sketch`)
- **Model:** Gemini 2.5 Flash
- **Input:** `{ imageBase64: string }`
- **Prompt role:** UI Topologist — extract nodes, edges, annotations, infer behaviors
- **Output:** `LogicGraph` (validated by Zod, 2-retry fallback on parse failure)
- **On success:** `LogicOverlay` renders glowing SVG connections over Excalidraw canvas

### Step 2: Code Generation (`/api/generate-code`)
- **Model:** Gemini 2.5 Pro
- **Input:** `{ imageBase64: string, logicGraph: LogicGraph }`
- **Why both?** Image provides visual layout fidelity; JSON provides semantic contract
- **Streaming:** SSE — each chunk is a partial `CodeFile` content delta
- **Output:** Complete `GeneratedProject` (files injected into Sandpack incrementally)

### Step 3: Refinement (`/api/refine-code`)
- **Model:** Gemini 2.5 Pro
- **Input:** `{ imageBase64: string, logicGraph: LogicGraph, currentFiles: CodeFile[], userMessage: string }`
- **Strategy:** Surgical patch — returns ONLY changed files, not the full project
- **Streaming:** SSE — patched files streamed, Sandpack `updateFile()` called per file
- **Speed target:** < 2 seconds for simple aesthetic changes

---

## Key UX Moments → Implementation Mapping

| Story Moment | Component | Implementation Detail |
|---|---|---|
| "Pulsing prompt: Draw your intent" | `WorkspaceCanvas` overlay | CSS `@keyframes pulse` on landing state |
| "Line glows neon when AI recognizes connection" | `LogicOverlay` | Absolute-positioned SVG over Excalidraw, animated stroke-dashoffset |
| "Semantic Scanner bar slides across" | `ScannerAnimation` | Framer Motion full-width gradient sweep on Generate trigger |
| "Code streams in sidebar" | `CodeViewer` | SSE events → append to `streamingFiles` in store → Shiki highlight |
| "Preview counter actually changes 0→1" | `PreviewPane` | Sandpack executes real generated React — state works natively |
| "AI surgically edits, preview refreshes <2s" | `useRefiner` | Only changed files sent to `sandpack.updateFile()` |
| "Key 1 fails silently, Key 2 takes over" | `StatusBar` | Shows "Using Key 2" indicator when failover activates |

---

## Sandbox Architecture

**Sandpack** is chosen over E2B for this project:

| Criterion | Sandpack | E2B |
|---|---|---|
| Cost | Free, fully client-side | Paid server containers |
| Cold start | 0ms | 2–5s |
| Tailwind support | ✅ via CDN template | ✅ |
| File mutation API | `updateFile()` per file | Full FS write |
| Best for | React/Tailwind previews | General runtimes |
| Fits free-tier goal | ✅ | ❌ |

---

## Deployment

**Vercel Free Tier** — all route handlers configured as **Edge Functions** to support long-lived SSE streaming (bypasses the 10s serverless timeout).

```
Vercel Edge Network
├── /canvas           → Static + Client bundle (Excalidraw, Sandpack, Zustand)
├── /api/parse-sketch → Edge Function (short, ~3s Gemini Flash call)
├── /api/generate-code→ Edge Function (long SSE stream, Gemini Pro)
└── /api/refine-code  → Edge Function (medium SSE stream, Gemini Pro)
```

No Clerk. No Neon. No external services beyond Gemini API.

---

## Gemini Model Selection Rationale

| Task | Model | Why |
|---|---|---|
| Sketch → LogicGraph | Gemini 2.5 Flash | Speed priority; structured JSON extraction is within Flash's capability |
| LogicGraph + Image → Code | Gemini 2.5 Pro | Complex multi-file code generation requiring deep spatial + semantic reasoning |
| Refinement patches | Gemini 2.5 Pro | Surgical edits require understanding existing code context + original visual intent |
| Failover for any task | Second API key, same model | Transparent to the route handler |
