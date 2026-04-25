import { type NextRequest } from "next/server";
import { getStreamingClient } from "@/lib/ai/geminiClient";
import { buildRefinePrompt, buildImagePart } from "@/lib/ai/prompts";
import { type LogicGraph } from "@/lib/schemas/logicGraph";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  function send(data: object): Uint8Array {
    return encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
  }

  let keyIndex: 1 | 2 = 1;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { imageBase64, logicGraph, currentFiles, userMessage, mimeType = "image/png" } =
          await request.json() as {
            imageBase64: string;
            logicGraph: LogicGraph;
            currentFiles: Array<{ path: string; content: string }>;
            userMessage: string;
            mimeType?: "image/png" | "image/jpeg";
          };

        if (!imageBase64 || !logicGraph || !currentFiles || !userMessage) {
          controller.enqueue(send({ type: "error", message: "Missing required fields" }));
          controller.close();
          return;
        }

        const prompt = buildRefinePrompt(logicGraph, currentFiles, userMessage);
        const imagePart = buildImagePart(imageBase64, mimeType);

        const tryRefine = async (kIdx: 1 | 2) => {
          keyIndex = kIdx;
          const client = getStreamingClient(kIdx);
          const model = client.getGenerativeModel({ model: "gemini-2.5-pro-preview-03-25" });
          return model.generateContentStream([prompt, imagePart]);
        };

        let streamResult;
        try {
          streamResult = await tryRefine(1);
        } catch (err) {
          const msg = (err as Error).message?.toLowerCase() ?? "";
          if (msg.includes("quota") || msg.includes("429") || msg.includes("rate") || msg.includes("overloaded")) {
            controller.enqueue(send({ type: "key-switch", keyIndex: 2 }));
            streamResult = await tryRefine(2);
          } else {
            throw err;
          }
        }

        controller.enqueue(send({ type: "key-active", keyIndex }));

        let buffer = "";
        for await (const chunk of streamResult.stream) {
          const text = chunk.text();
          buffer += text;
          controller.enqueue(send({ type: "chunk", text }));
        }

        try {
          const cleaned = buffer
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();
          const patchedFiles = JSON.parse(cleaned) as Array<{ path: string; content: string }>;
          controller.enqueue(send({ type: "done", patchedFiles }));
        } catch {
          controller.enqueue(send({ type: "done-raw", text: buffer }));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[refine-code]", message);
        controller.enqueue(send({ type: "error", message }));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
