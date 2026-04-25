import { type NextRequest } from "next/server";
import { getStreamingClient } from "@/lib/ai/geminiClient";
import { buildCodeGenPrompt, buildImagePart } from "@/lib/ai/prompts";
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
        const { imageBase64, logicGraph, mimeType = "image/png" } = await request.json() as {
          imageBase64: string;
          logicGraph: LogicGraph;
          mimeType?: "image/png" | "image/jpeg";
        };

        if (!imageBase64 || !logicGraph) {
          controller.enqueue(send({ type: "error", message: "imageBase64 and logicGraph are required" }));
          controller.close();
          return;
        }

        const prompt = buildCodeGenPrompt(logicGraph);
        const imagePart = buildImagePart(imageBase64, mimeType);

        const tryGenerate = async (kIdx: 1 | 2) => {
          keyIndex = kIdx;
          const client = getStreamingClient(kIdx);
          const model = client.getGenerativeModel({ model: "gemini-2.5-pro-preview-03-25" });
          return model.generateContentStream([prompt, imagePart]);
        };

        let streamResult;
        try {
          streamResult = await tryGenerate(1);
        } catch (err) {
          const msg = (err as Error).message?.toLowerCase() ?? "";
          if (msg.includes("quota") || msg.includes("429") || msg.includes("rate") || msg.includes("overloaded")) {
            controller.enqueue(send({ type: "key-switch", keyIndex: 2 }));
            streamResult = await tryGenerate(2);
          } else {
            throw err;
          }
        }

        // Signal which key is active
        controller.enqueue(send({ type: "key-active", keyIndex }));

        // Stream raw text chunks
        let buffer = "";
        for await (const chunk of streamResult.stream) {
          const text = chunk.text();
          buffer += text;
          controller.enqueue(send({ type: "chunk", text }));
        }

        // Parse the complete buffer as JSON file array
        try {
          const cleaned = buffer
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();
          const files = JSON.parse(cleaned) as Array<{ path: string; content: string }>;
          controller.enqueue(send({ type: "done", files }));
        } catch {
          controller.enqueue(send({ type: "done-raw", text: buffer }));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[generate-code]", message);
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
