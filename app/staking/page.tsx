"use client";

import React, { useState } from "react";
import {
  Activity,
  Zap,
  Layers,
  Check,
  Coins,
  ArrowUpRight,
  Lock,
  X,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { useConnection, useReadContract } from "wagmi";
import useSWR from "swr";
import { getFetcher, postFetcher } from "@/utils/request/fetcher";
import {
  CONTRACT_ADDRESS,
  METER_ABI,
  STAKING_ADDRESS,
} from "@/config/contracts";
import dayjs from "dayjs";
import StakeButton from "./components/stakeButton";
import UnstakeButton from "./components/unstakeButton";
import { serializateUrl } from "@/utils";

export const formatCurrency = (value: number | string) => {
  const num = Number(value);

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 10, // 最多保留 10 位小数
    useGrouping: false, // 不使用千分位逗号（可选，Crypto通常为了复制方便不加逗号）
  }).format(num);
};

const gradients = [
  // 暖色系 (Warm)
  "from-red-100 to-orange-100",
  "from-amber-100 to-yellow-100",
  "from-yellow-100 to-lime-100",
  "from-rose-100 to-red-100",
  "from-stone-100 to-orange-100", // 暖灰色调

  // 自然/绿色系 (Nature/Green)
  "from-lime-100 to-green-100",
  "from-green-100 to-emerald-100",
  "from-teal-100 to-cyan-100",
  "from-emerald-100 to-lime-100",

  // 冷色/海洋系 (Cool/Ocean)
  "from-sky-100 to-blue-100",
  "from-slate-100 to-zinc-100", // 冷灰色调
  "from-cyan-100 to-blue-100",

  // 梦幻/紫色系 (Dreamy/Purple)
  "from-indigo-100 to-violet-100",
  "from-violet-100 to-fuchsia-100",
  "from-fuchsia-100 to-rose-100",
];

const StakingPage = () => {
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [stakingPeriod, setStakingPeriod] = useState(7);

  const { address } = useConnection();

  const { data: periods } = useSWR<NFTData[]>("/staking/plans", getFetcher);
  const { data: statData } = useSWR<{
    max_apy: number;
    total_rewards: number;
  }>(
    serializateUrl("/staking/stats", { user_address: address }),
    address ? getFetcher : null
  );
  const planId = periods?.find((p) => p.lock_days === stakingPeriod)?.id;

  // 数据获取逻辑
  const { data, mutate: refetchAssets } = useSWR(
    ["/staking/assets", { user_address: address }],
    address ? getFetcher<{ available: NFTData[]; staked: NFTData[] }> : null
  );

  const availableAssets = data?.available;
  const stakedAssets = data?.staked || [];
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(null);

  const toggleSelection = (id) => {
    if (selectedAssetIds.includes(id)) {
      setSelectedAssetIds(selectedAssetIds.filter((itemId) => itemId !== id));
    } else {
      setSelectedAssetIds([...selectedAssetIds, id]);
    }
  };

  const {
    data: isApproved,
    isLoading: isCheckingApproval,
    refetch: refetchApproval,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: METER_ABI,
    functionName: "isApprovedForAll",
    args: [address!, STAKING_ADDRESS],
    query: { enabled: !!address }, // Only check if not staked
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 2. Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl mb-12 group bg-white">
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-linear-to-br from-indigo-50 via-white to-violet-50"></div>

          <div className="relative z-10 p-8 md:p-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
            {/* --- 左侧区域：文案精简 (占比 ~45%) --- */}
            <div className="w-full lg:w-[45%] shrink-0">
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                <span className="text-indigo-700 text-[10px] font-bold uppercase tracking-widest">
                  Protocol V2.5
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight text-slate-900">
                Yield Maximized. <br />
                <span className="text-indigo-600">RWA Asset Staking</span>
              </h1>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-sm">
                Stake Industrial IoT NFTs to earn real-time rewards.
              </p>
            </div>

            {/* --- 右侧区域：数据卡片 (占比 ~55%) --- */}
            <div className="w-full lg:w-[55%] flex gap-4 h-full">
              {/* 1. Max APR 卡片 */}
              <div className="flex-[1] bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-w-[110px]">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Max APR
                </p>
                <div className="flex items-center gap-1 mt-auto">
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {statData?.max_apy || 0}%
                  </span>
                  <Zap size={16} className="text-amber-500 fill-amber-500" />
                </div>
              </div>

              {/* 2. Total Rewards 卡片 */}
              <div className="flex-[2.5] bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-w-[240px]">
                {/* 标题栏：USDC 高亮显示 */}
                <div className="flex justify-between items-center mb-1">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    Pending Rewards
                  </p>
                  {/* ✨ USDC 高亮优化：深色背景 + 白色文字 + 阴影 */}
                </div>

                {/* 内容栏：数字和按钮在同一行 */}
                <div className="flex justify-between items-end gap-3 mt-auto w-full">
                  {/* 数字：大字体 + 截断保护 */}
                  <div className="flex items-end gap-2">
                    <span
                      className="text-3xl font-extrabold text-slate-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis"
                      title={String(statData?.total_rewards)}
                    >
                      {statData?.total_rewards || 0}
                    </span>
                    <span className="text-[10px] mb-2 font-black bg-indigo-600 text-white px-2 py-0.5 rounded-md shadow-md shadow-indigo-200 tracking-wide">
                      USDC
                    </span>
                  </div>

                  {/* 按钮：深色按钮 */}
                  <button
                    disabled={
                      !statData?.total_rewards || statData?.total_rewards <= 0
                    }
                    className="shrink-0 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95"
                  >
                    Claim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 3. Main Content: Double Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left Column: Active Staking */}
          <div className="bg-white rounded-3xl border border-slate-200 flex flex-col h-full min-h-[600px] shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <Lock size={20} className="text-indigo-600" />
                  Active Staking
                </h2>
                <p className="text-sm text-slate-500 mt-1.5">
                  Assets locked in pool ({stakedAssets.length})
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {stakedAssets.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <Layers size={40} className="mb-4 opacity-20" />
                  <p className="font-medium text-slate-400">No assets staked</p>
                </div>
              ) : (
                stakedAssets.map((item, index) => {
                  const randomColor = gradients[index % gradients.length];

                  return (
                    <div
                      key={item.id}
                      className="group bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 transition-all duration-300 flex items-center gap-5 hover:shadow-md"
                    >
                      <div
                        className={`relative w-20 h-20 rounded-xl bg-linear-to-br ${randomColor} border border-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center`}
                      >
                        <Activity
                          className="text-slate-600/50 group-hover:text-indigo-600/60 transition-colors"
                          size={28}
                        />
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-indigo-600 rounded text-[9px] font-bold text-white uppercase">
                          Staked
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-lg truncate group-hover:text-indigo-600 transition-colors">
                          NFT #{item.token_id}
                        </h3>
                        <div className="flex flex-col gap-1 mt-2">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                              <Calendar size={12} className="text-indigo-400" />
                              Period:{" "}
                              <span className="text-indigo-600">
                                {item.lock_days} Days
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                              <Coins size={12} className="text-amber-500" />
                              Yield:{" "}
                              <span className="text-emerald-600">
                                {formatCurrency(item.earnings)} USDC
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {dayjs(item.start_time).format("YYYY-MM-DD")} -{" "}
                          {dayjs(item.end_time).format("YYYY-MM-DD")}
                        </div>
                      </div>

                      <button
                        onClick={() => setShowUnstakeModal(item.token_id)}
                        className="text-xs font-bold text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
                      >
                        Unstake
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Refactored Flow */}
          <div className="space-y-6">
            {/* 3.1 Step 1: Select Staking Period (Now Isolated) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px]">
                      1
                    </span>
                    Choose Lock Period
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Longer lock period = Higher rewards
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {periods?.map((p) => (
                  <button
                    key={p.lock_days}
                    onClick={() => setStakingPeriod(p.lock_days)}
                    className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all group ${
                      stakingPeriod === p.lock_days
                        ? "bg-indigo-50 border-indigo-600"
                        : "bg-slate-50 border-slate-100 hover:border-indigo-200"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                        stakingPeriod === p.lock_days
                          ? "text-indigo-600"
                          : "text-slate-400"
                      }`}
                    >
                      {p.lock_days} Days
                    </span>
                    <span
                      className={`text-xl font-black ${
                        stakingPeriod === p.lock_days
                          ? "text-indigo-700"
                          : "text-slate-700"
                      }`}
                    >
                      {p.apy_rate}%
                    </span>
                    {stakingPeriod === p.lock_days && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 3.2 Step 2: Select Assets */}
            <div className="bg-white rounded-3xl border border-slate-200 flex flex-col min-h-[480px] shadow-sm relative overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px]">
                    2
                  </span>
                  Select NFTs to Stake
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Available in wallet ({availableAssets?.length})
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar pb-32">
                {availableAssets?.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                    <p>Wallet empty</p>
                  </div>
                ) : (
                  availableAssets?.map((item, index) => {
                    const randomColor = gradients[index % gradients.length];

                    return (
                      <div
                        key={item.token_id}
                        onClick={() => toggleSelection(item.token_id)}
                        className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 border flex items-center gap-4 group
                                        ${
                                          selectedAssetIds.includes(
                                            item.token_id
                                          )
                                            ? "bg-indigo-50/50 border-indigo-200"
                                            : "bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50/50"
                                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0
                                        ${
                                          selectedAssetIds.includes(
                                            item.token_id
                                          )
                                            ? "bg-indigo-600 border-indigo-600"
                                            : "border-slate-300 group-hover:border-indigo-400"
                                        }`}
                        >
                          {selectedAssetIds.includes(item.token_id) && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>

                        <div
                          className={`relative w-12 h-12 rounded-xl bg-linear-to-br ${randomColor} border border-slate-200/50 flex-shrink-0 flex items-center justify-center`}
                        >
                          <Layers className="text-slate-400/60" size={20} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-bold text-sm truncate ${
                              selectedAssetIds.includes(item.token_id)
                                ? "text-indigo-700"
                                : "text-slate-800"
                            }`}
                          >
                            NFT #{item.token_id}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            Meter Token
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Action Bar inside the card but sticky at bottom */}
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-10">
                <div className="bg-white/80 backdrop-blur-md border border-indigo-100 rounded-2xl p-4 shadow-xl shadow-indigo-500/10 flex items-center justify-between gap-4 ring-1 ring-slate-900/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Selected Assets
                    </span>
                    <span className="text-slate-900 font-bold text-lg leading-tight">
                      {selectedAssetIds.length}{" "}
                      <span className="text-indigo-600">
                        / {stakingPeriod}d Lock
                      </span>
                    </span>
                  </div>
                  <button
                    onClick={() => setShowStakeModal(true)}
                    disabled={selectedAssetIds.length === 0}
                    className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg hover:-translate-y-0.5
                                    ${
                                      selectedAssetIds.length > 0
                                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30"
                                        : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200"
                                    }`}
                  >
                    Stake Now
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- Modals --- */}

      {/* Stake Confirmation Modal */}
      {showStakeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowStakeModal(false)}
          ></div>
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Stake Confirmation
              </h3>
              <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Selected Items:</span>
                  <span className="font-bold text-slate-900">
                    {selectedAssetIds.length} Assets
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Lock-up Period:</span>
                  <span className="font-bold text-indigo-600">
                    {stakingPeriod} Days
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Expected APY:</span>
                  <span className="font-bold text-emerald-600">
                    {stakingPeriod}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                By confirming, you agree that these assets will be locked until
                the period ends. Early redemption is not supported in V2.5.
              </p>
              <div className="space-y-3">
                <StakeButton
                  isApproved={isApproved}
                  isCheckingApproval={isCheckingApproval}
                  tokenId={selectedAssetIds[0]}
                  planId={planId}
                  refetchStakingData={() => {
                    refetchApproval();
                    refetchAssets();
                    setShowStakeModal(false);
                    setSelectedAssetIds([]);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unstake Confirmation Modal */}
      {showUnstakeModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowUnstakeModal(null)}
          ></div>
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <X size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Unstake Asset?
              </h3>
              <p className="text-slate-500 leading-relaxed mb-8">
                Are you sure you want to unstake this asset? Your accumulated
                rewards for this period might be forfeited.
              </p>
              <div className="space-y-3">
                <UnstakeButton
                  isApproved={isApproved}
                  isCheckingApproval={isCheckingApproval}
                  tokenId={showUnstakeModal}
                  planId={planId}
                  refetchStakingData={() => {
                    refetchApproval();
                    refetchAssets();
                    setShowUnstakeModal(null);
                  }}
                />
                <button
                  onClick={() => setShowUnstakeModal(null)}
                  className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl font-bold transition-all"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 70, 229, 0.2);
        }
      `}</style>
    </div>
  );
};

export default StakingPage;
