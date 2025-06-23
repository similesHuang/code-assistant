"use client";
import { useEffect, useState } from "react";
import ChatBot from "./components/ChatBot";
import { Segmented } from "antd";
import CodeEditor from "./components/CodeEditor";
import CodePreview from "./components/CodePreview";
import httpRequest from "./utils/request";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("editor");
  const [code, setCode] = useState('');
  
  const renderTabContent = () => {
    if (selectedTab === "editor") {
      return <CodeEditor code={code} setCode={setCode}></CodeEditor>;
    } else if (selectedTab === "preview") {
      return <CodePreview code={code}></CodePreview>;
    }
    return null;
  };

  const getDifyKnowledge = async () => {
    try {
      const { records } = await httpRequest.post("/api/dify", {
        query: "左树右表",
      });
      console.log("Dify knowledge base response:", records);
    } catch (err) {
      console.error("Error fetching Dify knowledge base:", err);
    }
  };
  useEffect(() => {
    getDifyKnowledge();
  }, []);
  return (
    <div className="flex w-full">
      <ChatBot></ChatBot>
      <div className="flex-1 p-4">
        <Segmented
          onChange={(value) => setSelectedTab(value as string)}
          options={[
            {
              label: "组件编辑",
              value: "editor",
            },
            {
              label: "组件预览",
              value: "preview",
            },
          ]}
        ></Segmented>
        <div className="py-2"></div>
        {renderTabContent()}
      </div>
    </div>
  );
}
