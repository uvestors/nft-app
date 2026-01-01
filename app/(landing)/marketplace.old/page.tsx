"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Zap,
  Wallet,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Lock,
  CreditCard,
  FileCheck,
  TrendingUp,
  Tag,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { postFetcher } from "@/utils/request/fetcher";

// --- 样式常量 ---
const SKY_GRADIENT = "bg-gradient-to-r from-cyan-400 to-sky-500";
const TEXT_GRADIENT =
  "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-600";
const BTN_GRADIENT =
  "bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500";
const OFFICIAL_WALLET = "0x85bd94b5882985de5d0bb5632e6f9dbaa725d413";

// --- Zod Schema ---
const formSchema = z.object({
  payment_tx_hash: z.string().min(10, "Please enter a valid transaction hash"),
});

type FormData = z.infer<typeof formSchema>;

export default function MarketplacePage() {
  const { isConnected, address } = useAccount();
  const { setOpen } = useModal();
  const router = useRouter();

  // 状态管理：IDLE (初始), SUBMITTING (提交Hash中), SUCCESS (提交成功)
  const [status, setStatus] = useState<"IDLE" | "SUBMITTING" | "SUCCESS">(
    "IDLE"
  );
  // 专门用于处理成功后的同步状态
  const [isSyncing, setIsSyncing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { payment_tx_hash: "" },
  });

  // --- 逻辑：自动监听钱包连接情况 ---
  useEffect(() => {
    // 只有在提交成功状态下，且用户刚刚连接了钱包，才自动触发同步
    if (status === "SUCCESS" && isConnected && address) {
      handleSyncRewards();
    }
  }, [isConnected, address, status]);

  // --- 处理奖励同步请求 ---
  const handleSyncRewards = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const payment_tx_hash = watch("payment_tx_hash");
      // 发送请求给后端，关联当前钱包与提交的记录
      await postFetcher([
        "/nft/claim",
        { payment_tx_hash, recipients: [address] },
      ]);
      toast.success("Rewards & Node NFT synced successfully!");
      // 延迟跳转到控制台
      setTimeout(() => router.push("/assets"), 300);
    } catch (error) {
      console.error("Sync Error:", error);
      toast.error("Manual sync failed. Please try again or contact support.");
    } finally {
      setIsSyncing(false);
    }
  };

  // --- 提交 Hash 逻辑 ---
  const onSubmit = async (formData: FormData) => {
    setStatus("SUBMITTING");
    try {
      await postFetcher(["/nft/verify", formData]);
      setStatus("SUCCESS");
      toast.success("Transaction submitted for verification!");
    } catch (error) {
      toast.error("Verification failed. Please check your Hash.");
      setStatus("IDLE");
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(OFFICIAL_WALLET);
    toast.success("Wallet Address Copied!");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center py-12 px-6 font-sans relative overflow-x-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[1200px] h-[800px] bg-sky-200/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 顶部导航 */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        <div
          className={`text-3xl font-black tracking-tighter cursor-pointer ${TEXT_GRADIENT}`}
          onClick={() => router.push("/")}
        >
          RVI
        </div>
        {isConnected && (
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-100 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></div>
            <span className="text-xs font-mono text-slate-600 font-bold">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
        )}
      </div>

      <div className="max-w-6xl w-full z-10 mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* 左侧信息栏 */}
        <div className="flex flex-col justify-center space-y-8 animate-in fade-in slide-in-from-left-8 duration-700 lg:sticky lg:top-24">
          <div className="text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-100 text-sky-600 text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              Batch #1 Live
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Acquire <br />
              <span className={TEXT_GRADIENT}>Industrial Node</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-md leading-relaxed">
              Direct transfer purchase. Submit hash to receive NFT airdrop
              immediately upon verification.
            </p>
          </div>

          {/* APY 卡片 */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 lg:p-8 shadow-xl shadow-sky-100/50">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
              <div className="p-2 bg-sky-50 rounded-xl text-sky-500">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">
                Staking Yields
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-sky-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center text-sky-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Monthly</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      30 Days lock
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold text-sky-500">12% APY</span>
              </div>
              <div
                className={`relative flex items-center justify-between p-4 rounded-2xl ${SKY_GRADIENT} text-white shadow-lg`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <Zap className="w-6 h-6 fill-white" />
                  </div>
                  <div>
                    <p className="text-base font-black text-white">Quarterly</p>
                    <p className="text-[10px] text-white/80 font-medium">
                      90 Days lock
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-black text-white relative z-10">
                  18% APY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧交互表单 */}
        <div className="relative z-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(14,165,233,0.15)] border border-slate-100 p-8 lg:p-10 relative overflow-hidden">
            {/* 价格展示 (始终显示) */}
            <div className="flex flex-col gap-8 mb-8 relative z-10">
              <div className="border-b border-slate-100 pb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-sky-500" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Unit Price
                  </p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-6xl font-black text-slate-900 tracking-tighter">
                    0.1
                  </p>
                  <span className="text-3xl font-bold text-slate-400">
                    USDC
                  </span>
                </div>
              </div>
            </div>

            {status === "SUCCESS" ? (
              /* --- 成功后的奖励领取面板 --- */
              <div className="text-center py-10 animate-in zoom-in duration-300">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-25"></div>
                  <div className="relative w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
                    <FileCheck className="w-12 h-12" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  Proof Submitted!
                </h3>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm">
                  We have received your hash. Verify your identity by connecting
                  your wallet to claim node rewards.
                </p>

                <div className="space-y-4">
                  {!isConnected ? (
                    <Button
                      onClick={() => setOpen(true)}
                      className={`w-full h-16 rounded-2xl font-bold text-lg text-white shadow-lg ${BTN_GRADIENT} flex items-center justify-center gap-2`}
                    >
                      <Wallet className="w-5 h-5" />
                      Connect Wallet to Sync
                    </Button>
                  ) : (
                    <Button
                      disabled={isSyncing}
                      onClick={handleSyncRewards}
                      className="w-full h-16 rounded-2xl bg-slate-900 text-white font-bold text-lg flex items-center justify-center gap-2"
                    >
                      {isSyncing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Syncing Rewards...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 text-yellow-400" />
                          Manual Sync Rewards
                        </>
                      )}
                    </Button>
                  )}

                  {isConnected && (
                    <div className="flex justify-center gap-2 text-[10px] text-sky-500 font-bold items-center bg-sky-50 py-2 px-4 rounded-full w-fit mx-auto">
                      <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse"></div>
                      Wallet Linked: {address?.slice(0, 6)}...
                      {address?.slice(-4)}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* --- 初始提交 Hash 表单 --- */
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8 relative z-10"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      1. Transfer to Official Wallet
                    </span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      Polygon Network
                    </span>
                  </div>
                  <div
                    onClick={handleCopyAddress}
                    className="group relative flex items-center gap-4 bg-slate-50/80 border border-slate-200 rounded-2xl p-4 cursor-pointer hover:border-sky-400 transition-all duration-300"
                  >
                    <CreditCard className="w-6 h-6 text-slate-400 group-hover:text-sky-500 transition-colors" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[10px] font-bold text-slate-400 mb-0.5">
                        USDC Address
                      </p>
                      <p className="text-sm font-mono font-bold text-slate-700 truncate">
                        {OFFICIAL_WALLET}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      2. Submit Proof
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Input
                      {...register("payment_tx_hash")}
                      placeholder="Paste Transaction Hash (0x...)"
                      className={`h-14 rounded-2xl border-slate-200 bg-slate-50/50 transition-all ${
                        errors.payment_tx_hash
                          ? "border-red-400 focus:ring-red-50"
                          : "focus:ring-sky-100"
                      }`}
                    />
                    {errors.payment_tx_hash && (
                      <p className="text-xs font-bold text-red-500 px-1">
                        {errors.payment_tx_hash.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={status === "SUBMITTING"}
                    className={`w-full h-16 rounded-2xl font-bold text-lg text-white ${BTN_GRADIENT}`}
                  >
                    {status === "SUBMITTING" ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        I Have Sent USDC{" "}
                        <ArrowRight className="ml-2 w-5 h-5 opacity-80" />
                      </span>
                    )}
                  </Button>
                </div>

                <div className="flex justify-center gap-6 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-sky-500 cursor-help">
                    <ShieldCheck className="w-3.5 h-3.5" /> Manual Verify
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-sky-500 cursor-pointer">
                    <ExternalLink className="w-3.5 h-3.5" /> Support
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
