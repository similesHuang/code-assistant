"use client";
import { useState } from "react";
import { MessageType } from "../components/types";
import httpRequest from "../utils/request";

const useModelContext = () => {
  const [context, setContext] = useState<MessageType[]>([]);

  
  const getDifyKnowledge = async (inputContent: string) => {
    try {
      const { records } = await httpRequest.post("/api/dify", {
        query: inputContent,
      });
      if (records && records.length > 0) {
        console.log("Dify 知识库查询结果：", records);
        return records;
      } else {
        setContext([]);
        return [];
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