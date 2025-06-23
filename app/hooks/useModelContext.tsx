"use client";
import { useState } from "react";
import { MessageType } from "../components/types";
import httpRequest from "../utils/request";
import Item from "antd/es/list/Item";
const useModelContext = () => {
  const [context, setContext] = useState<MessageType[]>([]);

  const getDifyKnowledge = async (inputContent: string) => {
    setContext([
      {
        id: Date.now().toString(),
        content: inputContent,
        roles: "user",
      }
    ]);
    try {
      const { records } = await httpRequest.post("/api/dify", {
        query: inputContent,
      });
      if (records && records.length > 0) {
        // 根据知识库获取模版名称
        const match = records[0]?.segment?.content?.match(
          /"name"\s*:\s*"([^"]+)"/
        );
        const name = match ? match[1] : "";
        if (name) {
          const {result} = await httpRequest?.post("/api/infra", {
            prompt: name,
          });
          return  result?.content[0]?.text ?? '';
        }
      } else {
        return ''
      }
    } catch (err) {
      setContext([]);
      return [];
    }
  };

  return {
    context,
    setContext,
    getDifyKnowledge,
  };
};

export default useModelContext;
