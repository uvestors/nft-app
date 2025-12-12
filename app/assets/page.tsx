"use client";

import { useReadContracts } from "wagmi";
import { CONTRACT_ADDRESS, METER_ABI } from "@/config/contracts";
import { NFTCard } from "@/components/nftcard";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";

// 生成 1 到 100 的数组: [1, 2, ..., 100]
const tokenIds = Array.from({ length: 10 }, (_, i) => i + 1);

export default function Home() {
  // 核心魔法：使用 wagmi 的 useReadContracts 批量读取数据
  // 它会把 100 个请求打包，高效读取每个 Token 的 URI
  const { data: uriResults, isLoading: isContractLoading } = useReadContracts({
    contracts: tokenIds.map((id) => ({
      address: CONTRACT_ADDRESS,
      abi: METER_ABI,
      functionName: "uri",
      args: [BigInt(id)], // 注意：合约参数需要是 BigInt
    })),
  });

  return (
    <main className="min-h-screen">
      {/* 主要内容区 */}
      <section className="container mx-auto px-6 py-12 md:px-12 md:py-16">
        {/* 页面标题区 */}
        <div className="mb-12 max-w-2xl">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Tokenized <br />
            <span className="text-indigo-600">Real World Assets</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Live monitoring of 100 industrial smart meters on Polygon Amoy.
            <br className="hidden sm:block" />
            Transparent, verifiable, and on-chain.
          </p>
        </div>

        {/* 加载状态 (浅色) */}
        {isContractLoading ? (
          <div className="flex h-64 w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              <p className="text-sm font-medium text-gray-400">
                Syncing with Blockchain...
              </p>
            </div>
          </div>
        ) : (
          // 网格布局 (稍微加宽一点间距)
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {tokenIds.map((id, index) => {
              const uriResult = uriResults?.[index];
              const tokenUri = uriResult?.result as string | undefined;

              if (uriResult?.status !== "success" || !tokenUri) return null;

              return <NFTCard key={id} tokenId={id} tokenUri={tokenUri} />;
            })}
          </div>
        )}
      </section>
    </main>
  );
}
