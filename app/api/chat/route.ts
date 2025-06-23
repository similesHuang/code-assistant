import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await openai.chat.completions.create({
          model: "qwen-plus",
          messages: (await request.json()).messages,
          stream: true,
        });

      
        for await (const chunk of completion) {
          const content = chunk.choices?.[0]?.delta?.content || "";
          controller.enqueue(new TextEncoder().encode(content)); // 无data:前缀
        }

      } catch (err) {
       
        controller.enqueue(new TextEncoder().encode(`[ERROR] ${String(err)}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no" 
    },
  });
}