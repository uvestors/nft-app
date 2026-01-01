"use client";

import React, { useState } from "react";
import {
  Wallet,
  CreditCard,
  Zap,
  CheckCircle2,
  X,
  Activity,
  Wifi,
  Cpu,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Plus,
  Minus,
  Info,
  Box as BoxIcon, // 避免命名冲突
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAccount } from "wagmi"; // 建议使用 useAccount 替代 useConnection (视版本而定)
import useSWRMutation from "swr/mutation";
import { getFetcher, postFetcher } from "@/utils/request/fetcher";
import useSWR from "swr";
import { ConnectKitButton } from "connectkit";

// --- 类型定义 ---
interface ProductItem {
  id: string;
  name: string;
  price_id: string;
  unit_amount: number;
  currency: string;
  // 其他可能返回的字段
}

// --- 样式常量 ---
const TEXT_GRADIENT =
  "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-600";
const BTN_GRADIENT =
  "bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500";
const CARD_SHADOW = "shadow-[0_20px_60px_-15px_rgba(14,165,233,0.15)]";

// --- 核心项目静态数据 (视觉展示用) ---
const PRODUCT_STATIC = {
  title: "Industrial Meter Node",
  subtitle: "Batch #1 Genesis Edition",
  description:
    "High-precision decentralized energy data validator. Deployed on the RVI Network to secure grid transactions and earn node rewards.",
  price: 299.0,
  features: [
    "Validator Node License",
    "Real-time Data Consensus",
    "Plug-and-Play Hardware",
    "RVI Genesis Airdrop Eligibility",
    "Enterprise-Grade Security",
  ],
  specs: [
    { label: "Protocol", value: "LoRaWAN / 5G", icon: Wifi },
    { label: "Efficiency", value: "< 5W Power", icon: Zap },
    { label: "Uptime", value: "99.99% SLA", icon: Activity },
  ],
  gradient: "from-sky-500 to-blue-600",
};

// --- 工具函数：格式化货币 ---
export const formatCurrency = (value: number | string) => {
  if (!value) value = 0;
  const num = Number(value) / 100; // Stripe 金额通常以分为单位
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 10,
    useGrouping: false,
  }).format(num);
};

export default function MarketplacePage() {
  // --- 状态管理 ---
  const [showConnectModal, setShowConnectModal] = useState(false); // 控制旧的钱包弹窗
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null
  ); // 控制购买弹窗
  const [quantity, setQuantity] = useState(1); // 购买数量
  const [isProcessing, setIsProcessing] = useState(false); // 支付加载状态

  // --- Web3 Hooks ---
  const { isConnected, address } = useAccount();

  // --- API Hooks ---
  // 1. 获取产品列表
  const { data: productData } = useSWR<{ items: ProductItem[] }>(
    "/payment/products",
    getFetcher
  );
  const products = productData?.items || [];

  // 2. 发起支付请求
  const { trigger } = useSWRMutation<{ url: string }>(
    "/payment/checkout",
    postFetcher,
    {
      onSuccess({ url }) {
        toast.success("Redirecting to Stripe Gateway...");
        setIsProcessing(false);
        setSelectedProduct(null); // 关闭弹窗
        window.location.href = url; // 跳转支付
      },
      onError(err) {
        toast.error(err.message || "Checkout failed.");
        setIsProcessing(false);
      },
    }
  );

  // --- 事件处理 ---

  // 1. 打开购买确认弹窗
  const handleOpenPurchaseModal = (item: ProductItem) => {
    setSelectedProduct(item);
    setQuantity(1); // 每次打开重置为 1
  };

  // 2. 调整数量
  const updateQuantity = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta))); // 限制 1 - 10 个
  };

  // 3. 最终确认支付 (调用后端)
  const handleFinalCheckout = async () => {
    if (!selectedProduct || !address) return;

    setIsProcessing(true);
    toast.loading(`Initiating secure checkout for ${quantity} items...`);

    // 调用后端接口
    trigger({
      user_address: address,
      product: {
        price: selectedProduct.price_id,
        quantity: quantity,
      },
    });
  };

  // 4. 连接钱包回调 (用于旧弹窗)
  const handleConnectWallet = () => {
    setTimeout(() => {
      setShowConnectModal(false);
      toast.success("Wallet Connected Successfully");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center py-12 px-6 font-sans relative overflow-x-hidden">
      {/* --- 顶部 Hero 区域 --- */}
      <div className="max-w-4xl w-full z-10 mt-16 text-center space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-100 text-sky-600 text-xs font-bold uppercase tracking-wider shadow-sm mx-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          Public Sale Live
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
          Acquire <br />
          <span className={TEXT_GRADIENT}>Hardware Node</span>
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
          Direct purchase via credit card. Own the infrastructure that powers
          the RVI decentralized data network.
        </p>
      </div>

      {/* --- 商品列表区域 --- */}
      {products.map((item) => (
        <div
          className="max-w-5xl w-full z-10 animate-in fade-in zoom-in-95 duration-700 delay-100 mb-20"
          key={item.id}
        >
          <div
            className={`bg-white rounded-[2.5rem] border border-slate-100 ${CARD_SHADOW} overflow-hidden flex flex-col lg:flex-row relative group`}
          >
            {/* 左侧：视觉展示区 (使用静态数据渲染视觉，因为这些数据数据库里可能没有) */}
            <div
              className={`lg:w-5/12 bg-linear-to-br ${PRODUCT_STATIC.gradient} p-10 flex flex-col justify-between text-white relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
              <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-white/10 rounded-full blur-[80px]"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-5 h-5 text-sky-200" />
                  <span className="font-mono text-xs font-bold text-sky-100 tracking-widest uppercase">
                    Model: RVI-M1
                  </span>
                </div>
                <h2 className="text-3xl font-black leading-tight tracking-tight">
                  {PRODUCT_STATIC.title}
                </h2>
                <p className="text-sky-100 font-medium text-sm mt-2 opacity-90">
                  {PRODUCT_STATIC.subtitle}
                </p>
              </div>

              <div className="flex-1 flex items-center justify-center py-12 relative z-10">
                <div className="relative group-hover:scale-105 transition-transform duration-500 ease-out">
                  <div className="absolute inset-0 bg-sky-400 rounded-full blur-[40px] opacity-40 animate-pulse"></div>
                  <div className="w-48 h-48 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 flex items-center justify-center shadow-2xl relative">
                    <Zap className="w-20 h-20 text-white drop-shadow-[0_4px_20px_rgba(255,255,255,0.4)]" />
                    <div className="absolute -bottom-4 -right-4 bg-white text-sky-600 text-xs font-black px-3 py-1 rounded-full shadow-lg">
                      V1.0
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 relative z-10">
                {PRODUCT_STATIC.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="bg-sky-900/20 rounded-xl p-3 backdrop-blur-sm border border-white/10 text-center hover:bg-sky-900/30 transition-colors"
                  >
                    <spec.icon className="w-4 h-4 mx-auto mb-2 text-sky-200" />
                    <p className="text-[10px] uppercase text-sky-200/70 font-bold mb-0.5">
                      {spec.label}
                    </p>
                    <p className="text-xs font-bold text-white">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧：详情与购买区 */}
            <div className="lg:w-7/12 p-8 lg:p-12 flex flex-col relative">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-sky-500" />
                    Node Specifications
                  </h3>
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-green-700 uppercase">
                      In Stock
                    </span>
                  </div>
                </div>

                <p className="text-slate-500 leading-relaxed mb-8 font-medium">
                  {PRODUCT_STATIC.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PRODUCT_STATIC.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-sm font-bold text-slate-700 group/item"
                    >
                      <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                      <span className="group-hover/item:text-slate-900 transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 价格与操作区 */}
              <div className="mt-auto pt-8 border-t border-slate-100">
                <div className="flex flex-col md:flex-row items-end md:items-center gap-6 justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Unit Price
                    </p>
                    <div className="flex items-baseline gap-1">
                      {/* 这里使用真实 API 价格 */}
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">
                        {formatCurrency(item.unit_amount)}
                      </span>
                      {/* 货币符号已经包含在 formatCurrency 中，或者你可以额外显示 */}
                      {/* <span className="text-lg font-bold text-slate-400">USD</span> */}
                    </div>
                  </div>
                  <div className="w-full md:w-auto flex flex-col gap-3">
                    {/* 根据钱包连接状态显示不同按钮 */}
                    {isConnected ? (
                      <Button
                        onClick={() => handleOpenPurchaseModal(item)} // 点击打开弹窗
                        disabled={isProcessing}
                        className={`
                          h-16 px-8 rounded-2xl font-bold text-lg text-white shadow-lg 
                          shadow-sky-200/50 ${BTN_GRADIENT}
                          transform transition-all hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto min-w-[200px]
                        `}
                      >
                        Buy Now{" "}
                        <ArrowRight className="w-5 h-5 opacity-80 ml-2" />
                      </Button>
                    ) : (
                      // 如果未连接，直接显示 ConnectKit 按钮，或者你可以自定义
                      <div className="min-w-[200px] h-16 [&>button]:w-full [&>button]:h-full [&>button]:rounded-2xl [&>button]:text-lg [&>button]:font-bold">
                        <ConnectKitButton />
                      </div>
                    )}

                    <div
                      className={`text-[10px] text-center md:text-right font-medium flex items-center justify-center md:justify-end gap-1.5 h-4 transition-colors duration-300 ${
                        isConnected ? "text-slate-400" : "text-amber-500"
                      }`}
                    >
                      {isConnected ? (
                        <span className="text-sky-600 flex items-center gap-1 animate-in fade-in">
                          <ShieldCheck className="w-3 h-3" />
                          Receiver: {address?.slice(0, 6)}...
                          {address?.slice(-4)}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 animate-pulse">
                          <AlertCircle className="w-3 h-3" />
                          Wallet required to receive NFT
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* --- 底部 Logo --- */}
      <div className="mt-8 text-center pb-8 z-10">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4 opacity-70">
          Powered By
        </p>
        <div className="flex justify-center items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-1 font-bold text-slate-600">
            <CreditCard className="w-5 h-5" /> Stripe
          </div>
          <div className="w-px h-4 bg-slate-300"></div>
          <div className="flex items-center gap-1 font-bold text-slate-600">
            <ShieldCheck className="w-5 h-5" /> CertiK
          </div>
          <div className="w-px h-4 bg-slate-300"></div>
          <div className="flex items-center gap-1 font-bold text-slate-600">
            <BoxIcon className="w-5 h-5" /> Polygon
          </div>
        </div>
      </div>

      {/* ======================================================= */}
      {/* 🆕 购买确认弹窗 (包含数量选择) */}
      {/* ======================================================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg relative border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* 关闭按钮 */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
              disabled={isProcessing}
            >
              <X className="w-5 h-5" />
            </button>

            {/* 弹窗头部：商品信息 */}
            <div className="bg-slate-50/50 p-6 border-b border-slate-100">
              <div className="flex gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-200 flex-shrink-0">
                  <Zap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
                    Confirm Purchase
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    You are purchasing{" "}
                    <span className="text-sky-600 font-bold">
                      {selectedProduct.name || "Meter Node NFT"}
                    </span>
                    .
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100 w-fit">
                    <Info className="w-3 h-3" />
                    <span>Instant delivery to wallet</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 弹窗主体：数量选择与计算 */}
            <div className="p-8 space-y-8">
              {/* 数量选择器 */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Quantity
                </label>
                <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-2 border border-slate-100">
                  <button
                    onClick={() => updateQuantity(-1)}
                    className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 hover:text-sky-600 hover:border-sky-100 transition-all active:scale-95 disabled:opacity-50"
                    disabled={quantity <= 1 || isProcessing}
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <span className="text-2xl font-black text-slate-900 w-16 text-center tabular-nums">
                    {quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(1)}
                    className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 hover:text-sky-600 hover:border-sky-100 transition-all active:scale-95 disabled:opacity-50"
                    disabled={quantity >= 10 || isProcessing}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 价格明细 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                  <span>Price per item</span>
                  <span>{formatCurrency(selectedProduct.unit_amount)}</span>
                </div>
                <div className="w-full h-px bg-slate-100"></div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">
                    Total Due
                  </span>
                  <div className="text-right">
                    <div className="text-3xl font-black text-sky-600 tracking-tight">
                      {/* 动态计算总价 */}
                      {formatCurrency(selectedProduct.unit_amount * quantity)}
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      {selectedProduct.currency.toUpperCase() || "USD"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 确认支付按钮 */}
              <Button
                onClick={handleFinalCheckout}
                disabled={isProcessing}
                className={`w-full h-16 rounded-2xl font-bold text-lg text-white shadow-xl shadow-sky-200/50 ${BTN_GRADIENT} transition-all hover:scale-[1.02] active:scale-[0.98]`}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Redirecting to Stripe...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Proceed to Checkout <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </div>

            {/* 底部安全文案 */}
            <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3 h-3" />
                Secure payment processed by Stripe. NFT sent to{" "}
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 旧的连接钱包弹窗 (如果你还想保留手动控制的话，否则可以删除) */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full relative border border-slate-100">
            <button
              onClick={() => setShowConnectModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 bg-slate-50 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-5 pt-2">
              <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto text-sky-500 mb-4 shadow-sm rotate-3">
                <Wallet className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  Connect Wallet
                </h3>
                <p className="text-sm text-slate-500 px-2 leading-relaxed font-medium">
                  To ensure you receive the NFT Node immediately after payment,
                  please verify your wallet address.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleConnectWallet}
                  className="w-full h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-orange-500 border-2 border-white"></div>
                  Connect MetaMask
                </Button>
                <Button
                  onClick={handleConnectWallet}
                  variant="outline"
                  className="w-full h-14 rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-bold flex items-center justify-center gap-3 text-slate-600"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white"></div>
                  WalletConnect
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
