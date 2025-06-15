"use client";

import {
  AppstoreFilled,
  ArrowUpOutlined,
  AudioOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { Affix, Button, Input } from "antd";
import { useState } from "react";
import CodeEditor from "../components/CodeEditor";
import CodePreview from "./CodePreview";

const mockData = `const CodeEditor = ()=>{
     return <></>
};
export default CodeEditor;`;

const ChatBot = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "system-1",
      content:
        "我是AI聊天助手，我可以帮你生成代码并在右侧预览。请输入你的需求。",
      type: "system",
    },
    {
      id: "use_1",
      content: "你是谁",
      type: "user",
    },
    {
      id: "assistant",
      content: "以上代码实现了",
      type: "assistant",
      isFile: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isCoding, setIsCoding] = useState(false);
  const [selectedTab, setSelectedTab] = useState("code");
  const [loading, setLoading] = useState(false);

  const tabs = [
    {
      key: "code",
      label: "代码",
      componennt: <CodeEditor />,
    },
    {
      key: "preview",
      label: "预览",
      component: <CodePreview />,
    },
  ];
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, content: inputValue, type: "user" },
      ]);
      // 模拟AI回复
      setLoading(true);
      setTimeout(() => {
        const newMessage: MessageType = {
          id: `assistant-${Date.now()}`,
          content: `这是关于 "${inputValue}" 的代码示例。`,
          type: "assistant",
          isFile: true,
          file: {
            content: mockData,
            name: "chat.tsx",
            language: "javascript",
          },
        };
        setMessages((prev) => [...prev, newMessage]);
        setLoading(false);
        setIsCoding(true);
      }, 300);
      setInputValue("");
    }
  };

  return (
    <div
      className={`flex ${isCoding ? "w-full" : "w-[50%]"}`}
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div
        className={!isCoding ? "w-full" : "w-1/2"}
        style={{ transition: "width 0.5s ease-in-out" }}
      >
        <div
          className="w-full flex flex-col"
          style={{ maxHeight: "calc(100vh - 204px)", overflowY: "scroll" }}
        >
          {messages?.map((messages) => {
            if (messages.type === "system" || messages?.type === "assistant") {
              return (
                <div key={messages?.id} className="p-[12px]">
                  {messages?.content}
                </div>
              );
            }
            return (
              <div key={messages?.id} className="text-right p-[12px]">
                {messages?.content}
              </div>
            );
          })}
        </div>
        <Affix offsetBottom={0} style={{zIndex:2,background:'white'}} >
           <div
          className="w-[100%] border border-gray-200 p-[12px] flex items-center flex-col"
          style={{ borderRadius: "6px" }}
        >
          <Input
            style={{ border: 0, boxShadow: "none" }}
            placeholder="发消息、输入 @ 选择技能/选择文件"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
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
                disabled={inputValue.trim() === ""}
                onClick={handleSendMessage}
              ></Button>
            </div>
          </div>
        </div>
        </Affix>
      </div>
      {isCoding && <div    className={`
        w-1/2 h-full
        transform transition-all duration-500 ease-out
        ${isCoding 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
      `}
    >
        <div className="p-4 h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold">代码编辑器</h3>
          <Button 
            type="text" 
            onClick={() => setIsCoding(false)}
            className="text-white hover:bg-red-600"
          >
            ✕
          </Button>
        </div>
        {/* 其他内容 */}
      </div>
      </div>}
    </div>
  );
};
export default ChatBot;
