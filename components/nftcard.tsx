"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { resolveIPFS } from "@/utils/ipfs";
import { CONTRACT_ADDRESS } from "@/config/contracts";
import { TransferButton } from "./transferButton"; // ✅ 确保这里引入了 TransferButton

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: { trait_type: string; value: string | number }[];
}

export const NFTCard = ({
  tokenUri,
  tokenId,
}: {
  tokenUri: string | undefined;
  tokenId: number;
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const httpUri = tokenUri ? resolveIPFS(tokenUri) : null;

  const {
    data: metadata,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["nft-metadata", httpUri],
    queryFn: async () => {
      if (!httpUri) return null;
      const proxyUrl = `/api/metadata?url=${encodeURIComponent(httpUri)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<NFTMetadata>;
    },
    enabled: !!httpUri,
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });

  const nftExplorerUrl = `https://amoy.polygonscan.com/token/${CONTRACT_ADDRESS}?a=${tokenId}`;

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const truncatedAddress = `${CONTRACT_ADDRESS.slice(
    0,
    6
  )}...${CONTRACT_ADDRESS.slice(-4)}`;

  if (isLoading || !metadata) {
    return (
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
        <div className="animate-pulse flex flex-col h-full space-y-4">
          <div className="w-full h-3/5 bg-gray-200 rounded-xl" />
          <div className="space-y-3">
            <div className="h-5 w-3/4 bg-gray-100 rounded-md" />
            <div className="h-4 w-1/2 bg-gray-100 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="aspect-[3/4] w-full flex flex-col items-center justify-center rounded-2xl bg-gray-50 border border-gray-200 text-gray-400">
        <span className="mb-3 text-3xl opacity-50">⚠️</span>
        <span className="text-sm font-medium text-gray-500">Data Error</span>
      </div>
    );
  }

  const imageUrl = resolveIPFS(metadata.image);

  return (
    <div className="group relative flex flex-col aspect-[3/4] w-full overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
      {/* 图片区域 */}
      <div className="relative h-[55%] w-full overflow-hidden bg-gray-50 border-b border-gray-100/50">
        <Image
          src={imageUrl}
          alt={metadata.name}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority={tokenId <= 8}
        />
        <div className="absolute top-3 right-3 z-10 flex h-7 min-w-[2.5rem] items-center justify-center rounded-full bg-white/90 px-2.5 backdrop-blur-md border border-gray-200/50 text-xs font-bold text-gray-700 shadow-sm">
          #{tokenId}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex h-[45%] flex-col justify-between p-5 bg-white">
        <div className="flex-1 min-h-0 flex flex-col gap-1">
          <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-1">
            {metadata.name}
          </h3>
          <p className="text-sm leading-relaxed text-gray-500 font-medium line-clamp-2">
            {metadata.description}
          </p>

          {/* 操作按钮区 */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {/* 1. 复制合约地址按钮 */}
            <div
              onClick={handleCopyAddress}
              className="w-fit flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 hover:border-gray-200 transition-colors group/addr"
              title="Copy Contract Address"
            >
              {isCopied ? (
                <svg
                  className="w-3 h-3 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3 h-3 text-gray-400 group-hover/addr:text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
              <span
                className={`text-[10px] font-mono font-medium ${
                  isCopied
                    ? "text-green-600"
                    : "text-gray-400 group-hover/addr:text-gray-600"
                }`}
              >
                {truncatedAddress}
              </span>
            </div>

            {/* 2. 链上查看按钮 */}
            <a
              href={nftExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-[10px] font-medium text-indigo-600 hover:bg-indigo-100 transition-colors"
              title="View on PolygonScan"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>

            {/* 3. ✅ 转账按钮 (核心修改) */}
            {/* 传递 tokenId 给按钮，让它知道要转哪个电表 */}
            <div className="ml-auto">
              {" "}
              {/* ml-auto 把它推到最右边 */}
              <TransferButton tokenId={tokenId} />
            </div>
          </div>
        </div>

        {/* 底部属性栏 */}
        {metadata.attributes && metadata.attributes.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
            <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
              {metadata.attributes[0].trait_type}
            </span>
            <span className="max-w-[60%] truncate font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100/50 text-xs">
              {metadata.attributes[0].value}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
