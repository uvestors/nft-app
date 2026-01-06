"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  ArrowRight,
  Download,
  Box as BoxIcon,
  Zap,
  Cpu,
  Loader2,
  Store,
  LayoutGrid,
  Info,
  ExternalLink,
  Calendar,
  Tag,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { getFetcher } from "@/utils/request/fetcher";

// --- Shared Style Constants ---
const TEXT_GRADIENT =
  "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-600";
const BTN_GRADIENT =
  "bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500";
const CARD_SHADOW = "shadow-[0_20px_60px_-15px_rgba(14,165,233,0.15)]";

// --- Mock Data (作为 Fallback) ---
const ORDER_DETAILS = {
  date: new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
  item: "Industrial Meter Node (Genesis Edition)",
  // 默认 fallback 数据
  unitPrice: 29900, // 分 (cents)
  quantity: 1,
  currency: "USD",
  id: "0x7X99...28B1",
};

function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // 获取订单详情
  const { data } = useSWR(
    sessionId ? `/orders/${sessionId}` : null,
    getFetcher
  );

  const [stripeReceiptUrl, setStripeReceiptUrl] = useState<string | null>(null);

  // 解析需要展示的数据 (优先使用 API 数据)
  const displayData = {
    date: data?.created_at
      ? new Date(data.created_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : ORDER_DETAILS.date,
    // quantity: data?.metadata?.quantity
    //   ? parseInt(data.metadata.quantity)
    //   : ORDER_DETAILS.quantity,
    quantity: 1,
    amountTotal:
      data?.amount_total || ORDER_DETAILS.unitPrice * ORDER_DETAILS.quantity,
    // 如果没有明确的单价，用总价除以数量
    get unitPrice() {
      return this.amountTotal / this.quantity;
    },
  };

  useEffect(() => {
    if (data?.receipt_url) {
      setStripeReceiptUrl(data.receipt_url);
    }
  }, [data]);

  const handleReceiptAction = () => {
    if (stripeReceiptUrl) {
      window.open(stripeReceiptUrl, "_blank");
    } else {
      window.print();
    }
  };

  // 简单的格式化辅助函数
  const formatPrice = (amountInCents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amountInCents / 100);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center py-12 px-6 font-sans relative overflow-x-hidden selection:bg-sky-100 selection:text-sky-900 print:bg-white print:p-0">
      <Toaster position="bottom-center" />

      {/* --- Background Decorations (打印时隐藏) --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 print:hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-[100px] opacity-50 mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[100px] opacity-50 mix-blend-multiply"></div>
      </div>

      <div className="max-w-2xl w-full z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 print:animate-none print:w-full print:max-w-none">
        {/* --- Success Icon Header (打印时隐藏) --- */}
        <div className="text-center mb-10 print:hidden">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-[30px] opacity-20 animate-pulse"></div>
            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-green-200/50 flex items-center justify-center relative z-10 ring-4 ring-green-50">
              <CheckCircle2 className="w-12 h-12 text-green-500 drop-shadow-sm" />
            </div>
            {/* Decorative particles */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-sky-400 rounded-full animate-bounce delay-100"></div>
            <div className="absolute -bottom-1 -left-3 w-3 h-3 bg-cyan-300 rounded-full animate-bounce delay-300"></div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Payment Successful
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
            Your payment has been processed. We are now initializing the minting
            process for your node.
          </p>
        </div>

        {/* --- Main Receipt Card (打印核心区域) --- */}
        <div
          className={`bg-white rounded-[2rem] border border-slate-100 ${CARD_SHADOW} overflow-hidden mb-8 print:shadow-none print:border print:rounded-none print:mb-0`}
        >
          {/* Top: Header (Changed: Removed Hash, Added Date) */}
          <div className="bg-slate-50/50 p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 print:bg-white print:border-b-2 print:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Order Date
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-lg font-bold text-slate-900 font-mono tracking-tight">
                  {displayData.date}
                </span>
              </div>
            </div>
            <div className="print:hidden">
              <button
                onClick={handleReceiptAction}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm w-full justify-center md:w-auto"
              >
                {stripeReceiptUrl ? (
                  <>
                    <ExternalLink className="w-4 h-4" /> View Stripe Receipt
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download Receipt
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Middle: Item Details */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-5 mb-8">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-200 flex-shrink-0 print:border print:border-slate-200 print:shadow-none print:text-slate-800">
                <Zap className="w-8 h-8" />
              </div>

              {/* Product Info */}
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
                      {ORDER_DETAILS.item}
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-100 text-[10px] font-bold text-sky-700 uppercase tracking-wider print:bg-white print:border-slate-300 print:text-slate-700">
                        <Cpu className="w-3 h-3" /> Hardware V1
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700 uppercase tracking-wider print:bg-white print:border-slate-300 print:text-slate-700">
                        <BoxIcon className="w-3 h-3" /> Polygon
                      </span>
                    </div>
                  </div>
                  {/* Desktop Total Price */}
                  <div className="text-right hidden sm:block print:block">
                    <p className="text-2xl font-black text-slate-900 tracking-tight">
                      {formatPrice(displayData.amountTotal)}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Paid via Stripe
                    </p>
                  </div>
                </div>

                {/* New: Unit Price & Quantity Row */}
                <div className="flex items-center gap-4 py-3 border-t border-dashed border-slate-200 w-full mt-1">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-medium text-slate-500">
                      Unit Price:
                    </span>
                    <span className="text-sm font-bold text-slate-700">
                      {formatPrice(displayData.unitPrice)}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-slate-200"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">
                      Qty:
                    </span>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                      x{displayData.quantity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Total Price (Visible only on small screens) */}
              <div className="sm:hidden flex justify-between items-center w-full pt-2 border-t border-slate-100 print:hidden">
                <span className="text-sm font-bold text-slate-500">
                  Total Paid
                </span>
                <span className="text-xl font-black text-slate-900">
                  {formatPrice(displayData.amountTotal)}
                </span>
              </div>
            </div>

            {/* Minting Status Banner (打印时隐藏) */}
            <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100 relative overflow-hidden print:hidden">
              {/* Animated Background Shimmer */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_2s_infinite]"></div>

              <div className="relative z-10 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm text-sky-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    Minting in Progress...
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    Your payment is confirmed. The system is now generating your
                    NFT Node on the blockchain.
                  </p>
                  <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-bold text-sky-600">
                    <Info className="w-3 h-3" />
                    <span>
                      This usually takes 1-3 minutes. You can leave this page.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 打印时的额外底部信息 */}
            <div className="hidden print:block mt-8 pt-8 border-t border-slate-200 text-center">
              <p className="text-sm text-slate-500">
                Thank you for your business.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Generated on {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Footer Bar (打印时隐藏) */}
          <div className="bg-slate-50/80 p-4 border-t border-slate-100 text-center print:hidden">
            <p className="text-[10px] text-slate-400 font-medium">
              A confirmation email has been sent to your registered address.
            </p>
          </div>
        </div>

        {/* --- Action Buttons (打印时隐藏) --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden">
          <button
            className="w-full sm:w-auto h-12 px-6 rounded-xl bg-transparent hover:bg-slate-100 text-slate-500 font-bold transition-all flex items-center justify-center gap-2"
            onClick={() => (window.location.href = "/marketplace")}
          >
            <Store className="w-4 h-4" /> Back to Market
          </button>

          <button
            className={`w-full sm:w-auto h-12 px-8 rounded-xl font-bold text-white shadow-lg shadow-sky-200/50 ${BTN_GRADIENT} transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2`}
            onClick={() => (window.location.href = "/assets")}
          >
            View My Assets <LayoutGrid className="w-4 h-4 opacity-80" />
          </button>
        </div>
      </div>

      {/* Tailwind Custom Animation Config */}
      <style>
        {`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media print {
            body { background: white; }
            @page { margin: 0; }
        }
        `}
      </style>
    </div>
  );
}

export default () => {
  return (
    <React.Suspense>
      <PaymentSuccessPage />
    </React.Suspense>
  );
};
