# LogicLens — 2:45 Hackathon Demo Script

> **Target Length:** ~2 minutes 45 seconds
> **Pacing:** Upbeat, fast, and highly technical.
> **Total Word Count:** ~380 words (Comfortable speaking pace of ~140 wpm)

---

### [0:00 - 0:10] The Hook & Landing Page
*(Screen recording starts directly on the LogicLens Landing Page. Mouse is already moving towards the "Open Canvas" button).*

**Speaker:** 
"Have you ever sketched out a brilliant idea on a whiteboard, only to spend the next five hours translating it into React code? Welcome to LogicLens. It’s an AI-powered visual development engine that turns your rough sketches into functional, live applications instantly. Let’s jump into the canvas."

*(Click "Open Canvas". The Excalidraw UI loads).*

---

### [0:10 - 0:50] Drawing the Intent (Login Page)
*(Start drawing quickly: A large box for a mobile screen, a 'Login' title, two input boxes, a button, and a little arrow pointing from the button to a box that says "Dashboard" with a scribbled note: 'On click: route to dashboard').*

**Speaker:** 
"We’re going to draw a standard mobile login screen. But LogicLens doesn't just look at shapes—it understands *intent*. 
As I draw these input fields and a 'Sign In' button, I’m also going to draw an arrow pointing to a new view that says 'Dashboard', and scribble a note saying 'On Click: route to dashboard'. 
Most tools just generate static UI. LogicLens treats these arrows and notes as strict behavioral contracts. Let's hit Generate."

*(Click the Generate button. The right-hand panel opens and begins streaming code).*

---

### [0:50 - 1:40] Code Generation & Pipeline Explanation
*(Camera focuses on the right panel as code types itself out line-by-line. The Sandpack preview begins to boot up).*

**Speaker:** 
"Under the hood, this triggers our Dual-Model Edge Pipeline. First, we use Gemini 2.5 Flash to act as a Systems Architect—it scans the drawing in milliseconds and builds a structured semantic logic graph. 
Then, we pass *both* the original image and that logic graph into Gemini 2.5 Pro. By having the spatial layout from the image *and* the behavioral data from the JSON, Gemini Pro synthesizes an incredibly accurate, multi-file React application.
And there it is! A live, interactive app running entirely in a client-side Sandpack environment. The routing and state management actually work."

*(Click around the generated app in the Sandpack preview to prove it's interactive).*

---

### [1:40 - 2:15] Refinement Phase
*(Open the Refinement Chat drawer at the bottom. Type: "Make it dark themed and add a password visibility toggle").*

**Speaker:** 
"But what if we want to change it? Instead of regenerating the entire app and wasting tokens, we use our Surgical Refinement Chat. 
I’ll just ask it to make the app dark themed and add a password visibility toggle. 
Behind the scenes, Gemini Pro acts as a Code Reviewer. It looks at the current code, the original visual intent, and my prompt, then streams back targeted file patches. The preview updates in less than two seconds."

*(The preview instantly switches to dark mode with the new toggle).*

---

### [2:15 - 2:30] Paper & Upload Capability
*(Quickly drag-and-drop an image of a real-life hand-drawn paper sketch onto the Excalidraw canvas).*

**Speaker:** 
"And because we’re using Excalidraw backed by Gemini Vision, you aren't limited to digital drawing. You can take a photo of a literal napkin sketch, drag it onto the canvas, and LogicLens will parse the messy handwriting and generate the app exactly the same way."

---

### [2:30 - 2:45] Hosting & Wrap Up
*(Click the 'Export' button on the TopBar, then show a quick shot of the Vercel deployment URL).*

**Speaker:** 
"Once you're happy, you can export the whole project as a ZIP file, or push it straight to Vercel. In fact, this entire platform is completely serverless, utilizing Next.js Edge Functions and a seamless Dual-Key Failover system to handle API rate limits without breaking a sweat. 
This is LogicLens. Draw your intent. Watch it become code."

*(Fade to black).*
