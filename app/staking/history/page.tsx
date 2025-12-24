"use client";

import React, { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Coins,
  Download,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { useConnection } from "wagmi";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import useSWR from "swr";
import { serializateUrl } from "@/utils";
import { getFetcher } from "@/utils/request/fetcher";

interface HistoryItem {
  id: string;
  action: "Stake" | "Unstake" | "Deposit" | "Transfer Out";
  tokenId: string;
  amount: string;
  date: string;
  gasFee: string;
  status: "Confirmed" | "Failed";
  hash: string;
}

export default function StakingPage() {
  const [isClaiming, setIsClaiming] = useState(false);
  const [filter, setFilter] = useState("All");
  const { address } = useConnection();
  const { data: statData } = useSWR<{
    max_apy: number;
    total_rewards: number;
  }>(
    serializateUrl("/staking/stats", { user_address: address }),
    address ? getFetcher : null
  );

  const { data: historyData = [], isLoading: isHistoryLoading } = useQuery<
    HistoryItem[]
  >({
    queryKey: ["transactionHistory", address],
    queryFn: async () => {
      const response = await fetch(
        `/api/transaction-history?address=${address}`
      );
      if (!response.ok) throw new Error("Failed to fetch history");
      const data = await response.json();
      return data;
    },
    enabled: !!address,
  });

  const filteredHistory = historyData.filter((item) => {
    if (filter === "All") return true;
    if (filter === "Stakes") return item.action === "Stake";
    if (filter === "Unstakes") return item.action === "Unstake";
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20">
      {/* 1. 顶部收益面板：这是此页面唯一的“写操作”区域 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Staking History
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track your earnings and transaction logs.
              </p>
            </div>

            {/* 收益卡片：强调金钱 */}
            <div className="flex items-center gap-5 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 rounded-2xl border border-emerald-100 shadow-sm">
              <div className="flex flex-col">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1">
                  Unclaimed Yield
                </span>
                <span className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Coins className="w-6 h-6 text-emerald-500" />
                  {statData?.total_rewards || 0}
                  <span className="text-sm font-medium text-slate-500">
                    USDC
                  </span>
                </span>
              </div>
              <div className="h-10 w-px bg-emerald-200/50 mx-2 hidden sm:block"></div>
              <Link href="/staking">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-200 transition-all"
                >
                  {isClaiming ? "Claiming..." : "Claim Rewards"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 主体区域：全宽历史记录表 */}
      {!isHistoryLoading ? (
        <div className="container mx-auto px-6 py-10">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
            {/* 表格头部工具栏 */}
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900">Transaction Logs</h3>
              </div>

              <div className="flex items-center gap-3">
                {/* 过滤器 */}
                <div className="flex p-1 bg-gray-100 rounded-lg">
                  {["All", "Stakes", "Unstakes"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                        filter === tab
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-gray-500 hover:text-slate-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* 导出按钮 (装饰性) */}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2 text-gray-600 hidden sm:flex"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>

            {/* 数据表格 */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Asset / Details</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Time</th>
                    <th className="px-6 py-4 font-semibold">Gas Fee</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredHistory.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/40 transition-colors group"
                    >
                      {/* Type Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2.5 rounded-full border ${
                              item.action === "Stake"
                                ? "bg-blue-50 border-blue-100 text-blue-600"
                                : item.action === "Unstake"
                                ? "bg-orange-50 border-orange-100 text-orange-600"
                                : "bg-emerald-50 border-emerald-100 text-emerald-600"
                            }`}
                          >
                            {item.action === "Stake" && (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                            {item.action === "Unstake" && (
                              <ArrowDownLeft className="w-4 h-4" />
                            )}
                            {item.action === "Claim" && (
                              <Coins className="w-4 h-4" />
                            )}
                          </div>
                          <span className="font-semibold text-slate-700">
                            {item.action}
                          </span>
                        </div>
                      </td>

                      {/* Asset Column */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">
                          Meter #{item.tokenId}
                        </div>
                      </td>

                      {/* Amount Column */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs">
                          {item.amount}
                        </span>
                      </td>

                      {/* Date Column */}
                      <td className="px-6 py-4 text-gray-500">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700">
                            {dayjs(item.date).format("MMM DD, YYYY")}
                          </span>
                          <span className="text-xs">
                            {dayjs(item.date).format("HH:mm:ss")}
                          </span>
                        </div>
                      </td>

                      {/* Gas Column (Optional Detail) */}
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {item.gasFee}
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {item.status === "Confirmed" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span
                            className={`text-xs font-bold ${
                              item.status === "Confirmed"
                                ? "text-emerald-700"
                                : "text-red-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </td>

                      {/* Hash Column */}
                      <td className="px-6 py-4">
                        <Link
                          target="_blank"
                          href={`https://amoy.polygonscan.com/tx/${item.hash}`}
                          className="text-indigo-500 hover:text-indigo-700 font-mono hover:underline"
                        >
                          <Eye />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 表格底部 (分页占位) */}
            {/* <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-slate-900"
            >
              Load More
            </Button>
          </div> */}
          </div>
        </div>
      ) : (
        <div className="flex min-h-40 items-center justify-center">
          <Spinner className="size-16" />
        </div>
      )}
    </div>
  );
}
