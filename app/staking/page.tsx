"use client";

import React, { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Coins,
  Filter,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

// --- Mock Data: 模拟更丰富的历史记录 ---
const MOCK_HISTORY = [
  {
    id: 1,
    action: "Stake",
    asset: "Meter #1021",
    amount: "1 NFT",
    date: new Date("2024-03-15T10:30:00"),
    status: "Confirmed",
    hash: "0x3a...8f",
    gas: "0.002 MATIC",
  },
  {
    id: 2,
    action: "Claim",
    asset: "Protocol Rewards",
    amount: "45.20 RVI",
    date: new Date("2024-03-14T09:15:00"),
    status: "Confirmed",
    hash: "0x8b...2c",
    gas: "0.001 MATIC",
  },
  {
    id: 3,
    action: "Unstake",
    asset: "Meter #88",
    amount: "1 NFT",
    date: new Date("2024-03-10T14:20:00"),
    status: "Confirmed",
    hash: "0x1d...4a",
    gas: "0.003 MATIC",
  },
  {
    id: 4,
    action: "Stake",
    asset: "Meter #45",
    amount: "1 NFT",
    date: new Date("2024-03-05T11:00:00"),
    status: "Failed",
    hash: "0x9e...5b",
    gas: "0.002 MATIC",
  },
  {
    id: 5,
    action: "Stake",
    asset: "Meter #12",
    amount: "1 NFT",
    date: new Date("2024-03-01T08:45:00"),
    status: "Confirmed",
    hash: "0x7c...1d",
    gas: "0.002 MATIC",
  },
  {
    id: 6,
    action: "Claim",
    asset: "Protocol Rewards",
    amount: "12.50 RVI",
    date: new Date("2024-02-28T10:00:00"),
    status: "Confirmed",
    hash: "0x2a...4d",
    gas: "0.001 MATIC",
  },
];

export default function StakingPage() {
  const [isClaiming, setIsClaiming] = useState(false);
  const [filter, setFilter] = useState("All");

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
                  145.20{" "}
                  <span className="text-sm font-medium text-slate-500">
                    RVI
                  </span>
                </span>
              </div>
              <div className="h-10 w-px bg-emerald-200/50 mx-2 hidden sm:block"></div>
              <Button
                onClick={() => setIsClaiming(true)}
                disabled={isClaiming}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-200 transition-all"
              >
                {isClaiming ? "Claiming..." : "Claim Rewards"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 主体区域：全宽历史记录表 */}
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
                {["All", "Stakes", "Claims"].map((tab) => (
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
                  <th className="px-6 py-4 font-semibold text-right">Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_HISTORY.map((item) => (
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
                        {item.asset}
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
                      {item.gas}
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
                    <td className="px-6 py-4 text-right">
                      <a
                        href="#"
                        className="text-indigo-500 hover:text-indigo-700 font-mono text-xs hover:underline flex justify-end items-center gap-1"
                      >
                        {item.hash}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 表格底部 (分页占位) */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-slate-900"
            >
              Load More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
