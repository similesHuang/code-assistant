import { NextRequest, NextResponse } from "next/server";
import httpRequest from "@/app/utils/request";
import { getBaseUrl } from "@/app/utils";

export async function POST(request: NextRequest) {
  // 读取环境变量
  const apiKey = process.env.dify_api_key;
  const { query } = await request.json();
  const payload = {
    retrieval_model: {
      search_method: "keyword_search",
      reranking_enable: false,
      reranking_mode: null,
      reranking_model: {
        reranking_provider_name: "",
        reranking_model_name: "",
      },
      weights: null,
      top_k: 1,
      score_threshold_enabled: false,
      score_threshold: null,
    },
  };
  const baseUrl = getBaseUrl();
  
  try {
    const {records} = await httpRequest.post(
      "http://localhost/v1/datasets/e97782ab-32ba-468d-b6db-8f7b49d98854/retrieve",
      {
        query,
        ...payload,
      },
      {
        headers: {
           Authorization: `Bearer ${apiKey}`,
        },
      }
    );
     if (records && records.length > 0) {
        // 根据知识库获取模版名称
        const match = records[0]?.segment?.content?.match(
          /"name"\s*:\s*"([^"]+)"/
        );
        const name = match ? match[1] : "";
        if (name) {
          const {result} = await httpRequest?.post(`${baseUrl}/api/infra`, {
            prompt: name,
          });
          return  NextResponse.json({data:{
            code:result?.content[0]?.text,
            templateName: name,
          },status:200})
        }
      } else {
        return NextResponse.json({
          data: "没有相关知识库内容",
          status:200
        })
      }
  } catch (err) {
    return NextResponse.json(
      { error: "Error fetching Dify knowledge base", details: String(err) },
      { status: 500 }
    );
  }
};
