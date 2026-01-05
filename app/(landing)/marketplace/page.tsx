"use client";

import React, { useState } from "react";
import {
  Zap,
  Activity,
  ArrowRight,
  ShieldCheck,
  Info,
  CreditCard,
  Box as BoxIcon,
  Hash,
  X, // 引入 Hash 图标用于展示 Token ID
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import useSWRMutation from "swr/mutation";
import { getFetcher, postFetcher } from "@/utils/request/fetcher";
import useSWR from "swr";
import { ConnectKitButton } from "connectkit";
import { serializateUrl } from "@/utils";

// --- 类型定义 ---
interface ProductItem {
  id: string;
  token_id: string | number; // 确保包含 token_id
  name: string;
  description?: string;
  images?: string[];
  price_id: string;
  unit_amount: number;
  currency: string;
  metadata?: {
    model?: string;
    version?: string;
    [key: string]: any;
  };
  products: {
    prices: {
      id: string;
      unit_amount: number;
    }[];
  };
}

// --- 样式常量 ---
const TEXT_GRADIENT =
  "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-600";
const BTN_GRADIENT =
  "bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500";
const CARD_SHADOW = "shadow-[0_20px_60px_-15px_rgba(14,165,233,0.15)]";

// --- 工具函数：格式化货币 ---
export const formatCurrency = (value: number, currency: string = "USD") => {
  const num = value / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

export default function MarketplacePage() {
  // --- 状态管理 ---
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Web3 Hook ---
  const { isConnected, address } = useAccount();

  // --- API Hooks ---
  const {
    data: productData,
    isLoading,
    error,
  } = useSWR<{ items: ProductItem[] }>(
    serializateUrl("/nft/list", { status: "AVAILABLE" }),
    getFetcher
  );

  const products = productData?.items || [];

  const { trigger } = useSWRMutation<{ url: string }>(
    "/payment/checkout",
    postFetcher,
    {
      onSuccess({ url }) {
        toast.success("Redirecting to Stripe Gateway...");
        setIsProcessing(false);
        setSelectedProduct(null);
        window.location.href = url;
      },
      onError(err) {
        toast.error(err.message || "Checkout failed.");
        setIsProcessing(false);
      },
    }
  );

  // --- 事件处理 ---

  const handleOpenPurchaseModal = (item: ProductItem) => {
    setSelectedProduct(item);
  };

  const handleFinalCheckout = async () => {
    if (!selectedProduct || !address) return;

    setIsProcessing(true);
    toast.loading(`Initiating secure checkout for ${selectedProduct.name}...`);

    trigger({
      user_address: address,
      price_id: selectedProduct.products.prices[0]?.id,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center py-12 px-4 sm:px-6 font-sans relative overflow-x-hidden">
      {/* --- Hero 区域 --- */}
      <div className="max-w-4xl w-full z-10 mt-16 text-center space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-100 text-sky-600 text-xs font-bold uppercase tracking-wider shadow-sm mx-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          Public Sale Live
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
          Acquire <br />
          <span className={TEXT_GRADIENT}>Hardware Node</span>
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
          Direct purchase via credit card. Own the infrastructure that powers
          the RVI decentralized data network.
        </p>
      </div>

      {/* --- 产品列表网格 --- */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">
          Failed to load products.
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          No products available at the moment.
        </div>
      ) : (
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {products.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-[2rem] border border-slate-100 ${CARD_SHADOW} overflow-hidden flex flex-col relative group hover:-translate-y-1 transition-transform duration-300`}
            >
              {/* 卡片头部 / 图片区域 */}
              <div className="h-64 bg-slate-50 relative overflow-hidden p-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-blue-50 opacity-50"></div>

                {/* 产品图片 */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  {item.images && item.images[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-slate-100">
                      <Zap className="w-12 h-12 text-sky-400" />
                    </div>
                  )}
                </div>

                {/* --- Token ID 展示 (已修改颜色) --- */}
                <div className="absolute top-4 left-4 z-20">
                  {/* 修改点：背景改为深色 (slate-900)，带一点毛玻璃效果，与按钮形成对比 */}
                  <div className="bg-slate-900/90 backdrop-blur-md text-white font-black text-sm px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1 border border-white/10">
                    {/* 修改点：图标颜色改为天蓝色，作为点缀 */}
                    <Hash className="w-3.5 h-3.5 text-sky-400" />
                    <span>{item.token_id}</span>
                  </div>
                </div>

                {/* 版本徽章 */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="bg-white/90 backdrop-blur text-slate-800 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm border border-slate-100 uppercase tracking-wide">
                    {item.metadata?.version || "V1.0"}
                  </div>
                </div>
              </div>

              {/* 卡片主体 */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-sky-600 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2 min-h-[2.5em]">
                    {item.description ||
                      "High-precision decentralized validator node."}
                  </p>
                </div>

                {/* 特性标签 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                    <Activity className="w-3.5 h-3.5 text-sky-500" />
                    <span>High Uptime</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                    <span>Verified</span>
                  </div>
                </div>

                {/* 底部：价格与操作 */}
                <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Price
                    </p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">
                      {formatCurrency(
                        item.products.prices[0]?.unit_amount,
                        item.currency
                      )}
                    </p>
                  </div>

                  {isConnected ? (
                    <Button
                      onClick={() => handleOpenPurchaseModal(item)}
                      disabled={isProcessing}
                      // 这里的按钮保持原来的鲜艳渐变色
                      className={`h-12 px-6 rounded-xl font-bold text-sm text-white shadow-md shadow-sky-200/50 ${BTN_GRADIENT} transition-all hover:scale-105 active:scale-95`}
                    >
                      Buy Now
                    </Button>
                  ) : (
                    <div className="scale-90 origin-right">
                      <ConnectKitButton />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- 底部 Logo --- */}
      <div className="text-center pb-8 z-10">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4 opacity-70">
          Powered By
        </p>
        <div className="flex justify-center items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-1 font-bold text-slate-600">
            <CreditCard className="w-4 h-4" /> Stripe
          </div>
          <div className="w-px h-3 bg-slate-300"></div>
          <div className="flex items-center gap-1 font-bold text-slate-600">
            <ShieldCheck className="w-4 h-4" /> CertiK
          </div>
          <div className="w-px h-3 bg-slate-300"></div>
          <div className="flex items-center gap-1 font-bold text-slate-600">
            <BoxIcon className="w-4 h-4" /> Polygon
          </div>
        </div>
      </div>

      {/* --- 购买确认弹窗 --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* 关闭按钮 */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
              disabled={isProcessing}
            >
              <X className="w-5 h-5" />
            </button>

            {/* 弹窗头部 */}
            <div className="bg-slate-50/50 p-6 border-b border-slate-100">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm flex-shrink-0 p-2">
                  {selectedProduct.images && selectedProduct.images[0] ? (
                    <img
                      src={selectedProduct.images[0]}
                      alt=""
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <Zap className="w-6 h-6 text-sky-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    Confirm Purchase
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {/* 弹窗里的 Token ID 也同步修改为深色样式 */}
                    <span className="bg-slate-800 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                      <Hash className="w-3 h-3 text-sky-400" />{" "}
                      {selectedProduct.token_id}
                    </span>
                    <p className="text-sm text-slate-500 font-medium line-clamp-1">
                      {selectedProduct.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-100 w-fit">
                    <Info className="w-3 h-3" />
                    <span>Qty: 1 (Fixed)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 弹窗主体 */}
            <div className="p-6 space-y-6">
              {/* 钱包信息 */}
              <div className="bg-sky-50 rounded-xl p-3 flex items-start gap-3 border border-sky-100">
                <div className="bg-white p-1.5 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-sky-800">
                    Delivery Wallet
                  </p>
                  <p className="text-[10px] font-mono text-sky-600/80 break-all leading-tight">
                    {address}
                  </p>
                </div>
              </div>

              {/* 价格明细 */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                  <span>Item Price</span>
                  <span>
                    {formatCurrency(
                      selectedProduct.products.prices[0]?.unit_amount,
                      selectedProduct.currency
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                  <span>Quantity</span>
                  <span>x 1</span>
                </div>
                <div className="w-full h-px bg-slate-100 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">
                    Total Due
                  </span>
                  <div className="text-right">
                    <div className="text-2xl font-black text-sky-600 tracking-tight">
                      {formatCurrency(
                        selectedProduct.products.prices[0]?.unit_amount,
                        selectedProduct.currency
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 支付按钮 */}
              <Button
                onClick={handleFinalCheckout}
                disabled={isProcessing}
                className={`w-full h-14 rounded-xl font-bold text-lg text-white shadow-lg shadow-sky-200/50 ${BTN_GRADIENT} transition-all active:scale-[0.98]`}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2 text-base">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-base">
                    Pay Now <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>

            <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-medium">
                Secure payment via Stripe
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
