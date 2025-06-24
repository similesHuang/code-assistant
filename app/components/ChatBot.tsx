"use client";
import {
  AppstoreFilled,
  ArrowUpOutlined,
  AudioOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { Affix, Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useGlobalDispatch, useGlobalStore } from "../hooks/GlobalProvider";
import { MessageType } from "./types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown-light.css";
import httpRequest from "../utils/request";
import renderTemplate from "../script/renderTemplate";


const ChatBot:React.FC<{
  setCode: (value: string) => void;
}> = ({
  setCode,
}) => {
  const dispatch = useGlobalDispatch();
  const { messages } = useGlobalStore();
  const [inputContent, setInputContent] = useState("");
  const [streamingContent, setStreamingContent] = useState(""); 


  const handleSendMessage = async () => {
    if (!inputContent.trim()) return;
    dispatch({
      type: "ADD_MESSAGE",
      payload: {
        id: Date.now().toString(),
        content: inputContent,
        role: "user",
      },
    });
   
    const res = await httpRequest.post("/api/chat",{
        messages: [
          {
            role: "system",
            content: `你是一个前端react智能助手，你需要根据用户输入的内容以及知识库提供的模版代码，生成符合用户需求的业务组件`,
          },
          {
            role:'system',
            content:'谨记，你只能修改模版代码中带有注释// TODO: 部分对应的代码模块，其他代码不允许修改',
          },
          {
            role:'system',
            content:'你需要根据用户输入的内容，检索知识库中相关的模版代码以及mock数据，将模版代码完整的返回给用户',
          },
          { role: "user", 
            content: inputContent 
          },  
        ],
        inputContent
      }, {
      headers: { "Content-Type": "application/json" },
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let result = "";
    while (true) {
      const readResult = await reader?.read();
      if (!readResult) break;
      const { done, value } = readResult;
      if (done) break;
      // 解析 SSE 格式
      const chunk = decoder.decode(value, { stream: true });
      result += chunk;;
      setStreamingContent(result); 
      setCode(renderTemplate(result)); 
      console.log("Streaming content:", renderTemplate(result));
    }
    dispatch({
      type: "ADD_MESSAGE",
      payload: {
        id: Date.now().toString(),
        content: result,
        role: "assistant",
      },
    });

    setStreamingContent("");
    setInputContent(""); 
  };
 
  useEffect(() => {}, []);

  return (
    <div
      className={`flex w-[50%] p-4`}
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div style={{ transition: "width 0.5s ease-in-out", width: "100%" }}>
        <div
          className="w-full flex flex-col"
          style={{ height: "calc(100vh - 124px)", overflowY: "scroll" }}
        >
          {messages?.map((msg: MessageType) => {
            if (msg?.role !== "user") {
              return (
                <div
                  key={msg?.id}
                  className="p-[12px] text-justify markdown-body"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {msg?.content || ""}
                  </ReactMarkdown>
                </div>
              );
            }
            return (
              <div key={msg?.id} className="text-right p-[12px]">
                <span
                  className="px-[16px] py-[9px] text-justify"
                  style={{ background: "#f5f5f5", borderRadius: 4 }}
                >
                  {msg?.content}
                </span>
              </div>
            );
          })}
          {streamingContent && (
            <div className="p-[12px] text-justify markdown-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {streamingContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <Affix offsetBottom={0} style={{ zIndex: 2, background: "white" }}>
          <div
            className="w-[100%] border border-gray-200 p-[12px] flex items-center flex-col"
            style={{ borderRadius: "6px" }}
          >
            <Input
              style={{ border: 0, boxShadow: "none" }}
              placeholder="发消息、输入 @ 选择技能/选择文件"
              value={inputContent}
              onChange={(e) => {
                setInputContent(e.target.value);
              }}
              onPressEnter={handleSendMessage}
            ></Input>
            <div className="flex items-center justify-between w-full mt-[12px]">
              <div>
                <Button icon={<PaperClipOutlined />} className="mr-[12px]">
                  上传文件
                </Button>
                <Button icon={<AppstoreFilled />}>MCP服务</Button>
              </div>

              <div>
                <Button
                  icon={<AudioOutlined />}
                  shape="circle"
                  className="mr-[12px]"
                ></Button>

                <Button
                  icon={<ArrowUpOutlined />}
                  shape="circle"
                  type="primary"
                  disabled={inputContent.trim() === ""}
                  onClick={handleSendMessage}
                ></Button>
              </div>
            </div>
          </div>
        </Affix>
      </div>
    </div>
  );
};
export default ChatBot;
