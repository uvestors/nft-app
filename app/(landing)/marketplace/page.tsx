"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";
import { useRouter } from "next/navigation";
import {
  Zap,
  Check,
  Loader2,
  Wallet,
  ArrowRight,
  ShieldCheck,
  Globe,
  ExternalLink,
  Minus,
  Plus,
  TrendingUp,
  Clock,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ✨ 定义新的【纯净天蓝】渐变色
// 从 亮青色 (Cyan-400) 到 天空蓝 (Sky-500)
// 整体色调更亮、更轻盈
const SKY_GRADIENT = "bg-gradient-to-r from-cyan-400 to-sky-500";
const SKY_GRADIENT_HOVER = "hover:from-cyan-300 hover:to-sky-400";
const TEXT_GRADIENT =
  "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-600";

export default function MarketplacePage() {
  const { isConnected, address } = useAccount();
  const { setOpen } = useModal();
  const router = useRouter();

  // --- 状态管理 ---
  const [step, setStep] = useState<"IDLE" | "PENDDING" | "MINTING" | "SUCCESS">(
    "IDLE"
  );
  const [quantity, setQuantity] = useState(1);

  // 常量与计算
  const PRICE_PER_UNIT = 500;
  const totalPrice = quantity * PRICE_PER_UNIT;

  // 数量操作
  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  // 购买逻辑
  const handlePurchase = async () => {
    try {
      setStep("PENDDING");
      setTimeout(() => {
        setStep("SUCCESS");
        setTimeout(() => router.push("/assets"), 1500);
      }, 1500);
    } catch (e) {
      console.error(e);
      setStep("IDLE");
    }
  };

  return (
    // ✨ 背景改为极淡的纯白色/米色，更干净
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 font-sans relative overflow-hidden pt-30">
      {/* ✨ 背景氛围光：改为极淡的天蓝色 */}
      <div className="absolute top-[-30%] left-[-20%] w-[800px] h-[800px] bg-sky-200/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-30%] right-[-20%] w-[800px] h-[800px] bg-cyan-200/20 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mt-16 lg:mt-0 z-10">
        {/* === 左侧区域：营销文案 + 收益预览 === */}
        <div className="order-2 lg:order-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          {/* 顶部标签: 天蓝风格 */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-100 text-sky-600 text-xs font-bold uppercase tracking-wider shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            Batch #1 Live
          </div>

          {/* 大标题 */}
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Acquire <br />
            <span className={TEXT_GRADIENT}>Industrial Node</span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed max-w-md font-medium">
            Purchase NFT ownership of physical smart meters. Instant settlement
            via USDT on Polygon.
          </p>

          {/* ✨✨✨ 收益预览模块 (天蓝系) ✨✨✨ */}
          {/* 边框更细，阴影更淡 */}
          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl shadow-sky-100/50 max-w-lg relative overflow-hidden">
            <div className="flex items-center gap-2 mb-5 relative z-10">
              <div className="p-2 bg-sky-50 rounded-xl">
                <TrendingUp className="w-5 h-5 text-sky-500" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                Unlock Staking Rewards
              </h3>
            </div>

            <div className="space-y-3 relative z-10">
              {/* Tier 1 */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-sky-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm group-hover:text-sky-500 transition-colors">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-700">
                      Flexible
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      No lock-up
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-slate-600">
                    8% APY
                  </span>
                </div>
              </div>
              {/* Tier 2 */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-sky-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900">
                      Monthly
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      30 Days lock
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-sky-500">
                    12% APY
                  </span>
                </div>
              </div>

              {/* Tier 3 (Max Yield) - 天蓝渐变背景 */}
              <div
                className={`relative flex items-center justify-between p-4 rounded-2xl ${SKY_GRADIENT} text-white shadow-lg shadow-sky-200/50 transform scale-[1.02]`}
              >
                {/* 装饰噪音更通透 */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>

                <div className="absolute -top-3 right-4 bg-white text-xs font-black px-3 py-1 rounded-full text-sky-600 shadow-sm">
                  MAX YIELD
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <Zap className="w-6 h-6 fill-white" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">Quarterly</p>
                    <p className="text-xs text-white/80 font-medium">
                      90 Days lock
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">
                    18% APY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === 右侧区域：交易卡片 === */}
        <div className="order-1 lg:order-2">
          {/* 卡片阴影改为极淡的天蓝色 */}
          <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(14,165,233,0.15)] border border-white/80 p-4 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500 z-20">
            <div className="bg-white/60 rounded-[2.5rem] p-8 md:p-10 border border-slate-50">
              {/* NFT 预览图 - 天蓝调 */}
              <div className="aspect-[16/9] bg-gradient-to-tr from-slate-50 to-sky-50 rounded-3xl mb-8 flex items-center justify-center relative overflow-hidden shadow-inner border border-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-multiply grayscale"></div>

                {/* 闪电图标 - 天蓝渐变 */}
                <Zap
                  className={`w-24 h-24 drop-shadow-xl relative z-10 text-transparent fill-current bg-clip-text bg-gradient-to-br from-cyan-300 to-sky-500`}
                />

                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-slate-900 text-xs font-bold px-4 py-2 rounded-full shadow-sm border border-white text-sky-900">
                  Batch #1
                </div>
              </div>

              {/* 数量选择器 */}
              <div className="bg-white/80 border border-white rounded-2xl p-5 shadow-sm mb-8 flex items-center justify-between backdrop-blur-sm">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                    Quantity
                  </p>
                  <p className="text-slate-900 font-black text-2xl">
                    x {quantity} Nodes
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-full border border-slate-100">
                  <button
                    onClick={handleDecrement}
                    className="w-10 h-10 rounded-full bg-white hover:bg-slate-50 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
                  >
                    <Minus className="w-5 h-5 text-slate-600" />
                  </button>
                  <span className="w-8 text-center font-bold text-slate-900 text-xl">
                    {quantity}
                  </span>
                  {/* 加号按钮使用天蓝渐变 */}
                  <button
                    onClick={handleIncrement}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg hover:scale-105 text-white ${SKY_GRADIENT}`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 价格总计 */}
              <div className="flex justify-between items-end mb-8 px-2">
                <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">
                  Total Cost
                </div>
                <div className="text-4xl font-black text-slate-900 tracking-tighter">
                  {totalPrice.toLocaleString()}{" "}
                  <span className="text-xl font-bold text-slate-400">USDT</span>
                </div>
              </div>

              {/* 按钮区域 */}
              {!isConnected ? (
                // 未连接 - 改为较浅的天蓝色，不再是深黑
                <Button
                  size="lg"
                  onClick={() => setOpen(true)}
                  className="w-full h-16 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-lg shadow-lg shadow-sky-200/50 transition-all hover:-translate-y-1"
                >
                  <Wallet className="w-6 h-6 mr-2" />
                  Connect Wallet
                </Button>
              ) : (
                // 支付按钮 - 天蓝渐变
                <Button
                  size="lg"
                  onClick={handlePurchase}
                  disabled={step !== "IDLE"}
                  className={`w-full h-16 rounded-2xl font-bold text-lg shadow-xl transition-all hover:-translate-y-1 ${
                    step === "SUCCESS"
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200/50"
                      : `${SKY_GRADIENT} ${SKY_GRADIENT_HOVER} text-white shadow-sky-300/50`
                  }`}
                >
                  {step === "IDLE" && (
                    <span className="flex items-center text-xl">
                      Pay {totalPrice.toLocaleString()} USDT{" "}
                      <ArrowRight className="ml-2 w-6 h-6 opacity-90" />
                    </span>
                  )}
                  {step === "APPROVING" && (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />{" "}
                      Approving...
                    </>
                  )}
                  {step === "MINTING" && (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />{" "}
                      Minting...
                    </>
                  )}
                  {step === "SUCCESS" && (
                    <>
                      <Check className="w-6 h-6 mr-2" /> Success!
                    </>
                  )}
                </Button>
              )}

              {/* 底部信任链接 */}
              <div className="flex items-center justify-center gap-6 pt-6 opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-sky-600 cursor-pointer transition-colors">
                  <ShieldCheck className="w-4 h-4" /> Audited Contract
                </div>
                <div className="w-px h-3 bg-slate-200"></div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-sky-600 cursor-pointer transition-colors">
                  <ExternalLink className="w-4 h-4" /> View on PolygonScan
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
