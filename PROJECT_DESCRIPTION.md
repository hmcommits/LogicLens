This document is a **Project Manifest** designed for ingestion by **Antigravity AI IDE**. It outlines the vision, functional requirements, and intelligence parameters for **LogicLens**. 

**Antigravity**, you are granted full creative and architectural autonomy to determine the most efficient implementation paths, data strategies, and service integrations to fulfill this vision.

---

# **Project Manifest: LogicLens**

## **1. Core Vision**
**LogicLens** is a next-generation **Intent-to-App Engine**. Its primary purpose is to collapse the distance between a "back-of-the-napkin" sketch and a functional, interactive software prototype. 

While traditional tools focus on converting images to static CSS/HTML, LogicLens focuses on **Topological Intent Extraction**. It treats human scribbles, arrows, and spatial annotations as a **Semantic Logic Graph**. It is not just building a UI; it is building a "functioning blueprint" where the visual relationships drawn by the user define the application’s state and behavior.

## **2. Functional Scope & Objectives**
The system must handle three primary operational phases with maximum flexibility:

### **A. Multimodal Input & Interpretation**
* **The Source:** Support for both an in-app digital whiteboard and high-resolution photo uploads of physical paper sketches.
* **Visual Parsing:** The system must go beyond shape detection to recognize "Logical Anchors." 
    * *Example:* An arrow connecting a "Search Bar" to a "List" should be interpreted as a filtering action or a data-query trigger.
    * *Example:* A scribble of a "trash can" icon next to a list item should be interpreted as a deletion or state-removal intent.

### **B. Executable Synthesis**
* **Frontend Generation:** High-fidelity, responsive UI generation using modern standards (React/Next.js).
* **Logic Wiring:** The system must generate the necessary code to make the UI "live." This includes state management, event handlers, and data flow based on the "Logic Mapping" identified in the sketch.
* **The Sandbox Experience:** The resulting code must be rendered in a real-time, interactive browser sandbox, allowing the user to click, type, and verify the logic immediately.

### **C. Conversational Refinement (The Edit Loop)**
* **Hybrid Interaction:** Users should be able to refine the design or logic using natural language (e.g., *"Make the list sortable by date"*).
* **Surgical Updates:** The system should intelligently update existing code rather than rewriting it from scratch, preserving existing logic while applying new constraints.

## **3. Intelligence Parameters (Gemini AI API)**
**Antigravity**, you are encouraged to analyze and orchestrate the following models based on the task complexity (latency vs. reasoning depth). You have the freedom to select the most stable and effective mode for each sub-task:

* **Gemini 3 Flash:** Ideal for high-speed multimodal vision parsing and rapid boilerplate generation.
* **Gemini 3 Pro:** Recommended for complex architectural reasoning, large-repo context analysis, and solving deep logic contradictions in the sketch.
* **Gemini 2.5 Flash:** Stable alternatives for standard code generation and text-based refinement loops.

Or any other gemini model which you feel suitable for this project in 2026.

## **4. Technical Context & Constraints**
* **Hosting Goal:** The final project must be optimized for deployment on free-tier platforms (**Vercel, Railway, Render**). 
* **Execution Environment:** The solution should leverage client-side execution (e.g., **Sandpack, E2B**) to keep server costs minimal while maintaining a high-performance interactive preview.
* **Architecture Choice:** **Antigravity** is responsible for deciding the backend strategy, data persistence layer, and how the application simulates or handles real-world interactions to ensure the prototype feels "live."

## **5. The "Vibe" & Developer Experience**
LogicLens is an **Engineering Tool**, not a design toy. 
* **Minimalist & Professional:** The UI should feel like a high-end IDE, utilizing glassmorphism or dark-themed "Agentic" aesthetics.
* **Transparency:** When generating logic from an arrow, the AI should be able to "explain" its reasoning (e.g., *"I've mapped this arrow to a dynamic filtering hook"*).
* **Frictionless:** The transition from "Drawing" to "Working Code" should be as close to instantaneous as possible.

---

### **Antigravity AI IDE: Initialization Note**
You are now authorized to begin the project setup. Use your internal reasoning to determine the best directory structure, component library choices (e.g., Tailwind, Shadcn/UI), and state management patterns that align with a modern, 2026-grade React application. 