import { NextRequest, NextResponse } from "next/server";
import httpRequest from "@/app/utils/request";
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

  try {
    const res = await httpRequest.post(
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

    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json(
      { error: "Error fetching Dify knowledge base", details: String(err) },
      { status: 500 }
    );
  }
};
