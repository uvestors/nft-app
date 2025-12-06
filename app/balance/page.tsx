"use client";

import { useReadContracts, useConnection } from "wagmi"; // 1. 引入 useAccount
import { CONTRACT_ADDRESS, METER_ABI } from "@/config/contracts";
import { NFTCard } from "@/components/nftcard";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";

// 恢复检测范围为 1 到 100 (或者你可以改回 4)
const tokenIds = Array.from({ length: 10 }, (_, i) => i + 1);

export default function Home() {
  // 1. 获取当前连接的钱包地址
  const { address, isConnected } = useConnection();

  // 2. 读取 URI (保持不变，获取所有图的信息)
  const { data: uriResults, isLoading: isUriLoading } = useReadContracts({
    contracts: tokenIds.map((id) => ({
      address: CONTRACT_ADDRESS,
      abi: METER_ABI,
      functionName: "uri",
      args: [BigInt(id)],
    })),
  });

  // 3. 新增：读取当前用户的余额 (检查所有权)
  const { data: balanceResults, isLoading: isBalanceLoading } =
    useReadContracts({
      contracts: tokenIds.map((id) => ({
        address: CONTRACT_ADDRESS,
        abi: METER_ABI,
        functionName: "balanceOf",
        // 参数：[用户地址, TokenID]
        args: [address!, BigInt(id)],
      })),
      query: {
        // 只有当用户连接了钱包，且有地址时才查询余额
        enabled: !!address,
      },
    });

  // 4. 合并数据并筛选拥有者
  // 我们只渲染那些 balance > 0 的 NFT
  const ownedNFTs = tokenIds
    .map((id, index) => {
      const uri = uriResults?.[index]?.result as string | undefined;
      const balance = balanceResults?.[index]?.result as bigint | undefined;

      // 如果没有余额数据(未连接) 或者 余额为0，则标记为不显示
      const isOwned = balance ? balance > 0n : false;

      return { id, uri, isOwned };
    })
    .filter((item) => item.isOwned); // 👈 核心筛选步骤

  const isLoading = isUriLoading || (isConnected && isBalanceLoading);

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6 md:px-12">
          <Link href="/" className="cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                R
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                My <span className="text-indigo-600">Assets</span>
              </span>
            </div>
          </Link>
          <ul>
            <li>
              <Link href="/balance">balance</Link>
            </li>
          </ul>
        </div>
      </header>

      <section className="container mx-auto px-6 py-12 md:px-12 md:py-16">
        <div className="mb-12 max-w-2xl">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            My Meter <br />
            <span className="text-indigo-600">Collection</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Viewing assets owned by:{" "}
            {isConnected ? (
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                {address}
              </span>
            ) : (
              "Guest"
            )}
          </p>
        </div>

        {/* 状态处理逻辑 */}
        {!isConnected ? (
          // 状态 A: 未连接钱包
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="mb-4 text-lg">
              Please connect your wallet to view your assets
            </p>
            <ConnectKitButton />
          </div>
        ) : isLoading ? (
          // 状态 B: 加载中
          <div className="flex h-64 w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              <p className="text-sm font-medium text-gray-400">
                Checking ownership...
              </p>
            </div>
          </div>
        ) : ownedNFTs.length === 0 ? (
          // 状态 C: 已连接但没有 NFT
          <div className="flex h-64 w-full items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-500">You don't own any Meter NFTs yet.</p>
          </div>
        ) : (
          // 状态 D: 显示列表
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {ownedNFTs.map((item) => (
              <NFTCard
                key={item.id}
                tokenId={item.id}
                tokenUri={item.uri || ""}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
