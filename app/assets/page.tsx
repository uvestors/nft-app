"use client";

import React, { useMemo, useState, useRef } from "react";
import { useAccount, useConnection } from "wagmi"; // 推荐使用 useAccount 获取地址
import { useQuery } from "@tanstack/react-query";
import { Layers, ShieldCheck, Wallet, Box, Loader2 } from "lucide-react";

// 引入你现有的组件
import NFTCard1 from "@/components/nftcard1";
import AssetsDetails from "./components/assetsDetails"; // 确保路径正确
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

// 定义 Token 数据结构 (根据你之前的代码推断)
interface TokenMetadata {
  tokenId: string;
  name?: string;
  description?: string;
  image?: string;
  status: "Held" | "Staked" | "Mixed"; // 确保这里涵盖后端返回的状态
  imageType?: string;
  color?: string;
  balance?: string;
}

// --- 子组件：Dashboard 统计头部 ---
const DashboardHeader = ({
  totalCount,
  stakedCount,
  isLoading,
}: {
  totalCount: number;
  stakedCount: number;
  isLoading: boolean;
}) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* 左侧标题 */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              My Portfolio
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage your industrial smart meter assets and staking yields.
            </p>
          </div>

          {/* 右侧数据卡片 */}
          <div className="flex flex-wrap items-center gap-4">
            {/* 卡片 1: 总持有 */}
            <div className="flex min-w-[140px] items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="p-2.5 bg-blue-100 text-blue-600 rounded-full">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Total Assets
                </div>
                <div className="text-xl font-bold text-slate-900 leading-none mt-0.5">
                  {isLoading ? "-" : totalCount}
                </div>
              </div>
            </div>

            {/* 卡片 2: 质押中 */}
            <div className="flex min-w-[140px] items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="p-2.5 bg-purple-100 text-purple-600 rounded-full">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Staked
                </div>
                <div className="text-xl font-bold text-slate-900 leading-none mt-0.5">
                  {isLoading ? "-" : stakedCount}
                </div>
              </div>
            </div>

            {/* 卡片 3: 收益预估 (占位符，增加氛围感) */}
            {/* <div className="hidden lg:flex min-w-[140px] items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 opacity-60">
              <div className="p-2.5 bg-green-100 text-green-600 rounded-full">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Est. Yield
                </div>
                <div className="text-xl font-bold text-slate-900 leading-none mt-0.5">
                  --
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 主页面组件 ---
function AssetsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const activeTokenRef = useRef<TokenMetadata | null>(null);
  const { address, isConnected } = useConnection();

  // 数据获取逻辑
  const { data: ownedTokens = [], isLoading } = useQuery({
    queryKey: ["ownedTokens", address],
    queryFn: async () => {
      if (!address) return [];
      const response = await fetch(`/api/owned-tokens?address=${address}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      return data as TokenMetadata[];
    },
    enabled: !!address, // 只有有地址时才请求
    staleTime: 1000 * 10, // 10秒内数据不视为过期
  });

  // 使用 useMemo 计算统计数据，避免重复计算
  const stats = useMemo(() => {
    const total = ownedTokens.length;
    // 假设后端返回的状态是 "Staked" 或 "STAKED"
    const staked = ownedTokens.filter(
      (t) => t.status?.toUpperCase() === "STAKED"
    ).length;
    return { total, staked };
  }, [ownedTokens]);

  // 处理弹窗打开
  const handleToggle = (data: TokenMetadata) => {
    activeTokenRef.current = data;
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* 1. 弹窗组件 (逻辑层，隐藏在 DOM 中) */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="hidden" />
        </DialogTrigger>
        <DialogContent className="w-full sm:max-w-4xl p-2 min-h-[400px] overflow-hidden rounded-2xl">
          {/* 为了无障碍访问，必须包含 Header，但可以视觉隐藏 */}
          <DialogHeader className="sr-only">
            <DialogTitle>Asset Details</DialogTitle>
            <DialogDescription>
              View detailed information about your asset.
            </DialogDescription>
          </DialogHeader>
          <AssetsDetails data={activeTokenRef.current} />
        </DialogContent>
      </Dialog>

      {/* 2. 统计头部 (Dashboard Header) */}
      <DashboardHeader
        totalCount={stats.total}
        stakedCount={stats.staked}
        isLoading={isLoading}
      />

      {/* 3. 资产列表主体 */}
      <div className="container mx-auto px-6 py-12">
        {/* 标题行 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Your Assets</h2>
          <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
            {ownedTokens.length} items
          </span>
        </div>

        {/* 列表内容 */}
        {!isConnected ? (
          // 状态 A: 未连接钱包
          <div className="flex flex-col items-center justify-center py-24 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <Wallet className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Wallet Not Connected
            </h3>
            <p className="text-slate-500 mt-2 max-w-sm text-center">
              Please connect your wallet in the top right corner to view your
              Real World Assets.
            </p>
          </div>
        ) : isLoading ? (
          // 状态 B: 加载中
          <div className="flex flex-col items-center justify-center py-32">
            <Spinner className="size-10 text-indigo-600 mb-4" />
            <p className="text-sm font-medium text-slate-500 animate-pulse">
              Syncing with blockchain...
            </p>
          </div>
        ) : ownedTokens.length === 0 ? (
          // 状态 C: 已连接但无资产
          <div className="flex flex-col items-center justify-center py-24 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <Box className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              No Assets Found
            </h3>
            <p className="text-slate-500 mt-2">
              You don't own any RWA tokens yet.
            </p>
          </div>
        ) : (
          // 状态 D: 展示列表
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ownedTokens.map((item, index) => (
              <NFTCard1
                key={`${item.tokenId}-${index}`}
                data={item}
                onClick={handleToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AssetsPage;
