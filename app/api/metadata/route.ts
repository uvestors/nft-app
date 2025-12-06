import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 从 URL 参数中获取 ipfsUrl
  const searchParams = request.nextUrl.searchParams;
  const ipfsUrl = searchParams.get("url");

  if (!ipfsUrl) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 }
    );
  }

  // 检查认证密钥是否存在
  if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
    return NextResponse.json(
      { error: "Pinata JWT/Key not configured in environment variables." },
      { status: 500 }
    );
  }

  try {
    // 1. 服务端发起请求 (没有 CORS 限制)
    const response = await fetch(ipfsUrl, {
      method: "GET",
      headers: {
        // 🚀 核心修改：使用 Bearer Token 方式认证
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        accept: "application/json",
      },
      // 启用缓存以减少重复请求 Pinata (Next.js 13/14 默认行为)
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.statusText}`);
    }

    const data = await response.json();

    // 2. 将数据转发给前端
    return NextResponse.json(data);
  } catch (error) {
    console.error("IPFS Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}
