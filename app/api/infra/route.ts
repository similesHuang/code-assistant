import { NextRequest,NextResponse } from "next/server";
import {sseConnectServer} from 'client-connect-server'
export async function POST(request: NextRequest) {
   try {
    const { prompt } = await request.json();
    const client = await sseConnectServer("http://localhost:3001/sse");
    const tools = await client?.listTools();
    // 返回数据给前端
    return NextResponse.json({ tools });
  } catch (error) {
    // 错误处理
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}