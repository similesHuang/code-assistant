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
import { useGlobalDispatch, useGlobalStore } from "../hooks/GlobalProvider";
import { MessageType } from "./types";

const mockData = `const CodeEditor = ()=>{
     return <></>
};
export default CodeEditor;`;

const ChatBot = () => {
 
  const  dispatch = useGlobalDispatch();
  const  {messages} = useGlobalStore();
  const [inputValue, setInputValue] = useState("");
  const handleSendMessage = () => {
  
  };

  return (
    <div
      className={`flex w-[50%] p-4`}
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div
     
        style={{ transition: "width 0.5s ease-in-out",width:'100%' }}
      >
        <div
          className="w-full flex flex-col"
          style={{ maxHeight: "calc(100vh - 204px)", overflowY: "scroll" }}
        >
          {messages?.map((messages:MessageType) => {
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
     
    </div>
  );
};
export default ChatBot;
