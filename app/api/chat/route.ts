import { MessageType } from "@/app/components/types";
import { getBaseUrl } from "@/app/utils";
import httpRequest from "@/app/utils/request";
import { NextRequest } from "next/server";
import OpenAI from "openai";


export async function POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  });
  const baseUrl = getBaseUrl();
  const {messages,inputContent}= await request.json();
  const context:MessageType[] = [].concat(messages);
  
  const stream = new ReadableStream({
  
    async start(controller) {
      const encoder = new TextEncoder();
      
      try {
        if(inputContent){
          controller.enqueue(encoder.encode(`正在检索知识库  \n`));
          
          const {status,data}= await httpRequest.post(`${baseUrl}/api/dify`,{
            query:inputContent
          })
       
          if(status==200){
            controller.enqueue(encoder.encode(`检索到${data?.templateName}模版  \n`));
            context.push({
               role:'assistant',
               content:data?.code || `没有检索到相关模版代码，请检查输入内容是否正确`,
            })
          }

        }

        const completion = await openai.chat.completions.create({
          model: "qwen-plus",
          messages: context?.map((msg)=>({
            content: msg.content,
            role: msg.role,
          })),
          stream: true,
        });

        for await (const chunk of completion) {
          const content = chunk.choices?.[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(content)); 
        }

      } catch (err) {
        controller.enqueue(encoder.encode(`[ERROR] ${String(err)}`));
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