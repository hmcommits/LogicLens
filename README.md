# LogicLens — Sketch to App, Instantly

LogicLens is an AI-powered visual development environment that instantly converts your rough whiteboard sketches and architectural diagrams into functional, production-ready React code. 

Built with Next.js 15, Excalidraw, Sandpack, and powered by Gemini 2.5 Flash and Pro, LogicLens offers a seamless visual-to-code pipeline running entirely in your browser.

## Features

- **Whiteboard Integration:** Draw UI wireframes or logic flowcharts directly on the integrated Excalidraw canvas.
- **Multimodal AI Pipeline:** 
  - *Phase 1 (Parse):* Gemini 2.5 Flash analyzes your drawing to extract a semantic logic graph and infer components.
  - *Phase 2 (Generate):* Gemini 2.5 Pro synthesizes a complete, multi-file React application based on the visual input and logic graph.
- **Live Code Preview:** The generated code is streamed in real-time and instantly mounted in an interactive Sandpack environment.
- **Dual-Key Failover:** Configured to accept two Gemini API keys for automatic failover in case of rate limits or quota exhaustion.

## Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- At least one valid [Google Gemini API Key](https://aistudio.google.com/app/apikey). (Two are recommended for the failover system).

## How to Run the Project Locally

### 1. Install Dependencies
Open your terminal in the root directory of the project and run:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the example environment file to create your local `.env` file:
```bash
cp .env.example .env.local
```
Then, open `.env.local` and add your Gemini API keys:
```env
GEMINI_API_KEY_1=your_first_gemini_api_key_here
GEMINI_API_KEY_2=your_second_gemini_api_key_here
```
*(If you only have one key, you can safely paste it into both variables).*

### 3. Start the Development Server
Run the Next.js development server:
```bash
npm run dev
```

### 4. Open the App
Open your web browser and navigate to:
[http://localhost:3000](http://localhost:3000)

## How to Use LogicLens

1. **Navigate to the Canvas:** Click the "Open Canvas" button on the landing page or navigate to `http://localhost:3000/canvas`.
2. **Sketch:** Use the built-in Excalidraw tools to draw a wireframe (e.g., a login form, a dashboard layout, or a simple calculator).
3. **Generate:** Click the "Generate" button in the top right. 
4. **Watch it Build:** LogicLens will scan your drawing, synthesize the React code in real-time on the right-hand panel, and finally boot up an interactive live preview of your new application.

## Technologies Used

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4, Framer Motion
- **Canvas Engine:** Excalidraw
- **AI Models:** Gemini 2.5 Flash (Vision Parsing) & Gemini 2.5 Pro (Code Generation)
- **Sandbox:** Sandpack (CodeSandbox)
- **State Management:** Zustand
