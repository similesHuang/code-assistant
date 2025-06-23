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
import useMdelContext from "../hooks/useModelContext";
import { get } from "http";
const ChatBot = () => {
  const dispatch = useGlobalDispatch();
  const { messages } = useGlobalStore();
  const [inputContent, setInputContent] = useState("");
  const [streamingContent, setStreamingContent] = useState(""); 
  const {getDifyKnowledge,context} = useMdelContext();

  const handleSendMessage = async () => {
    if (!inputContent.trim()) return;
    dispatch({
      type: "ADD_MESSAGE",
      payload: {
        id: Date.now().toString(),
        content: inputContent,
        roles: "user",
      },
    });
   
    const knowledge = await getDifyKnowledge(inputContent);
    
  
    const res = await httpRequest.post("/api/chat",{
        messages: [{ role: "user", content: inputContent }],
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
      setStreamingContent(result); // 实时渲染
    }
    console.log("流式响应结果：", result);
 
    dispatch({
      type: "ADD_MESSAGE",
      payload: {
        id: Date.now().toString() + "-assistant",
        content: result,
        roles: "assistant",
      },
    });

    // 清空
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
            if (msg?.roles !== "user") {
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
