"use client";

import React, { useState } from "react";
import useSWR from "swr";
import {
  History,
  ExternalLink,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Coins,
} from "lucide-react";
import { useConnection } from "wagmi";
import { getFetcher } from "@/utils/request/fetcher";
import { serializateUrl } from "@/utils";
import dayjs from "dayjs";

interface ClaimHistoryItem {
  id: string;
  amount: string;
  tx_hash: string;
  claimed_at: string;
}

interface ClaimHistoryResponse {
  items: ClaimHistoryItem[];
  total: number;
}

const RewardsPage = () => {
  const [page, setPage] = useState(1);
  const pageSize = 100;
  const { address } = useConnection();

  const { data, isLoading } = useSWR<{
    total: number;
    data: ClaimHistoryResponse;
  }>(
    address
      ? serializateUrl("/staking/claims", {
          user_address: address,
          size: pageSize,
          page,
        })
      : null,
    getFetcher
  );

  const historyData = data;
  const totalItems = historyData?.total || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // 工具：处理地址截断
  const shortenHash = (hash: string) => {
    if (!hash) return "--";
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  console.log("render", data);

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 font-sans text-slate-900 px-6 py-10 mx-auto container">
      {/* --- 顶部 Header --- */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Rewards History
          </h1>
          <p className="mt-1 text-slate-500">
            Track your earnings and claim transaction logs.
          </p>
        </div>

        {/* 顶部卡片 (可选，保持和截图一致的风格) */}
        <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
          <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
            <Coins size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">
              Total Transactions
            </div>
            <div className="text-xl font-bold text-slate-900">
              {totalItems} Claims
            </div>
          </div>
        </div>
      </div>

      {/* --- 主要内容区：表格卡片 --- */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* 卡片标题栏 */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <History className="text-slate-400" size={20} />
            <h2 className="font-semibold text-slate-800">Transaction Logs</h2>
          </div>
          {/* 这里可以放 Export 按钮等 */}
        </div>
        {/* 表格内容 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Amount (USDC)</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 w-24 bg-slate-200 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : historyData?.items.length === 0 ? (
                // Empty State
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No reward history found.
                  </td>
                </tr>
              ) : (
                // Data Rows
                historyData?.items.map((item) => (
                  <tr
                    key={item.id}
                    className="group transition-colors hover:bg-slate-50"
                  >
                    {/* Type Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <Coins size={16} />
                        </div>
                        <span className="font-medium text-slate-700">
                          Claim Reward
                        </span>
                      </div>
                    </td>

                    {/* Amount Column */}
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      + {item.amount}
                    </td>

                    {/* Time Column */}
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex flex-col">
                        <span className="text-slate-700">
                          {dayjs(item.claimed_at).format("MMM DD, YYYY")}
                        </span>
                        <span className="text-xs text-slate-400">
                          {dayjs(item.claimed_at).format("HH:mm:ss")}
                        </span>
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-100">
                        <CheckCircle2 size={12} />
                        Confirmed
                      </div>
                    </td>

                    {/* Hash Column */}
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`https://amoy.polygonscan.com/tx/0x${item.tx_hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        <span className="font-mono">
                          {shortenHash(item.tx_hash)}
                        </span>
                        <ExternalLink size={14} />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- 分页 Footer --- */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(page * pageSize, totalItems)}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-slate-700">
              Page {page} of {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
