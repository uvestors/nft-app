"use client";

import React from "react";
import {
  ShieldCheck,
  FileText,
  Scale,
  Cpu,
  Globe,
  Lock,
  ArrowRight,
  BookOpen,
  FileCheck,
  ChevronRight,
  Download,
  Zap,
} from "lucide-react";
import Link from "next/link";
import DownloadPDF from "@/components/download/pdf";

// --- 模拟 UI 组件 (为了单文件运行，实际项目中可使用 shadcn/ui) ---
const Button = ({
  children,
  className,
  variant = "primary",
  onClick,
  ...props
}: any) => {
  const baseStyle =
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95";

  const variants = {
    primary:
      "bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white shadow-lg shadow-sky-200/50",
    outline:
      "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-600 hover:border-sky-200 hover:text-sky-600",
    ghost: "hover:bg-slate-100 text-slate-700",
    secondary: "bg-slate-900 text-white hover:bg-slate-800",
  };

  const variantStyles =
    variants[variant as keyof typeof variants] || variants.primary;

  return (
    <button
      className={`${baseStyle} ${variantStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// --- 样式常量 ---
const TEXT_GRADIENT =
  "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-600";
const CARD_SHADOW = "shadow-[0_20px_60px_-15px_rgba(14,165,233,0.15)]";

export default function NFTIntroPage() {
  // --- 模拟路由 (在实际 Next.js 项目中请使用 import { useRouter } from 'next/navigation') ---
  const router = {
    push: (path: string) => {
      console.log(`[Router] Navigating to: ${path}`);
      // 仅用于演示交互
      if (path === "/marketplace") {
        alert("跳转演示：正在前往 Marketplace 页面...");
      }
    },
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center py-12 px-6 font-sans relative overflow-x-hidden">
      {/* 背景装饰 (与 Marketplace 一致) */}
      <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[1200px] h-[800px] bg-sky-200/20 rounded-full blur-[120px] pointer-events-none"></div>
      {/* Hero 区域 */}
      <div className="max-w-4xl w-full z-10 mt-20 text-center space-y-6 mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-100 text-sky-600 text-xs font-bold uppercase tracking-wider shadow-sm mx-auto">
          <FileText className="w-3 h-3" />
          RWA Standard V1
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
          Utility-First <br />
          <span className={TEXT_GRADIENT}>Hardware Assets</span>
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
          The RVI NFT is not just a collectible. It is a cryptographic license
          bound to physical industrial nodes, granting ownership rights to
          network data validation rewards.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link href="/marketplace">
            <Button className="h-14 px-10 rounded-full font-bold text-lg transition-transform hover:scale-[1.02]">
              Acquire Node NFT{" "}
              <ChevronRight className="w-5 h-5 ml-1 opacity-80" />
            </Button>
          </Link>
          <Link href="/whitepaper">
            <Button
              variant="outline"
              className="h-14 px-10 rounded-full font-bold gap-2"
            >
              Read Whitepaper <BookOpen className="w-4 h-4 opacity-70" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 核心特性 (Features) */}
      <div className="max-w-6xl w-full z-10 grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {[
          {
            icon: Cpu,
            title: "Proof of Hardware",
            desc: "Each NFT is cryptographically paired with a physical Smart Meter ID. It serves as the immutable ownership title for the hardware device.",
          },
          {
            icon: Globe,
            title: "Network Rewards",
            desc: "Holders automatically qualify for the Validator Program. Earn $RVI tokens by contributing bandwidth and validating energy data.",
          },
          {
            icon: Lock,
            title: "Transferable License",
            desc: "Unlike traditional hardware licenses, your Node NFT provides liquid ownership that can be instantly transferred or sold on secondary markets.",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-[0_10px_40px_-10px_rgba(14,165,233,0.1)] transition-all duration-300 group cursor-default"
          >
            <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-sky-500 group-hover:text-white">
              <feature.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
              {feature.title}
            </h3>
            <p className="text-slate-500 leading-relaxed font-medium text-sm">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 法律与合规性 (Legal & Compliance) */}
      <div className="max-w-5xl w-full z-10 mb-24">
        <div
          className={`bg-white rounded-[2.5rem] border border-slate-100 ${CARD_SHADOW} overflow-hidden flex flex-col md:flex-row relative group`}
        >
          {/* 左侧：视觉区 */}
          <div className="bg-slate-900 p-10 md:w-5/12 flex flex-col justify-between text-white relative overflow-hidden">
            {/* 装饰背景 */}
            <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-sky-500/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 mb-6 shadow-inner">
                <Scale className="w-8 h-8 text-sky-400" />
              </div>
              <h2 className="text-3xl font-black leading-tight mb-4">
                Legal & <br />
                <span className="text-sky-400">Compliance</span>
              </h2>
              <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-xs">
                The RVI ecosystem is built on a robust legal framework ensuring
                long-term sustainability and asset security.
              </p>
            </div>

            <div className="mt-12 relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                <ShieldCheck className="w-3 h-3" /> Audited Partners
              </div>
              <div className="flex items-center gap-4">
                {/* 模拟 Logo */}
                <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> CertiK
                </div>
                <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> Hacken
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：详细条款 */}
          <div className="p-10 md:w-7/12 flex flex-col justify-center">
            <div className="space-y-8">
              <div className="flex gap-4 group/item">
                <div className="mt-1 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover/item:bg-sky-50 transition-colors">
                  <FileCheck className="w-5 h-5 text-slate-400 group-hover/item:text-sky-500 transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 text-base">
                    Utility Token Classification
                  </h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Legal opinion confirms RVI Node NFTs function as "software
                    licenses" and "access keys" to the network, distinct from
                    financial securities.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group/item">
                <div className="mt-1 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover/item:bg-sky-50 transition-colors">
                  <Globe className="w-5 h-5 text-slate-400 group-hover/item:text-sky-500 transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 text-base">
                    Global KYC/AML Standards
                  </h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    While the NFT is permissionless to hold, claiming mining
                    rewards requires Identity Verification (KYC) to comply with
                    international regulations.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group/item">
                <div className="mt-1 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover/item:bg-sky-50 transition-colors">
                  <FileText className="w-5 h-5 text-slate-400 group-hover/item:text-sky-500 transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 text-base">
                    Hardware Warranty
                  </h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    The NFT acts as your digital warranty card. 2-year
                    manufacturer warranty is linked directly to the token ID
                    on-chain.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full w-fit">
                Last Review: Oct 2024
              </span>
              <DownloadPDF filename="rvi-legal-opinion.pdf">
                <button className="text-sky-600 font-bold text-sm hover:text-sky-700 flex items-center gap-1 group/link">
                  View Legal Opinion{" "}
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </button>
              </DownloadPDF>
            </div>
          </div>
        </div>
      </div>

      {/* 技术文档 (Docs) */}
      <div className="max-w-4xl w-full z-10 text-center mb-24">
        <h2 className="text-3xl font-black text-slate-900 mb-8">
          Technical Documentation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-sky-300 transition-all hover:shadow-lg cursor-pointer text-left relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-sky-50 rounded-bl-[100%] transition-transform duration-500 group-hover:scale-110"></div>
            <BookOpen className="w-8 h-8 text-slate-900 mb-6 relative z-10" />
            <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">
              Whitepaper V2.0
            </h3>
            <p className="text-sm text-slate-500 font-medium mb-6 relative z-10 pr-10">
              Comprehensive overview of the consensus mechanism, tokenomics, and
              hardware specifications.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 relative z-10">
              <Download className="w-4 h-4" /> PDF (4.2MB)
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-sky-300 transition-all hover:shadow-lg cursor-pointer text-left relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-slate-50 rounded-bl-[100%] transition-transform duration-500 group-hover:scale-110"></div>
            <FileText className="w-8 h-8 text-slate-900 mb-6 relative z-10" />
            <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">
              Tokenomics One-Pager
            </h3>
            <p className="text-sm text-slate-500 font-medium mb-6 relative z-10 pr-10">
              Quick breakdown of token distribution, vesting schedules, and
              reward emission curves.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 relative z-10">
              <Download className="w-4 h-4" /> PDF (1.1MB)
            </div>
          </div>
        </div>
      </div>

      {/* 底部 CTA */}
      <div className="w-full bg-slate-900 text-white py-20 px-6 mt-auto rounded-t-[3rem] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-sky-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Ready to Join the Network?
          </h2>
          <p className="text-slate-400 font-medium text-lg max-w-lg mx-auto">
            Secure your spot in the decentralized energy grid. <br />
            Genesis batch NFTs are strictly limited.
          </p>
          <div className="pt-4">
            <Link href="/marketplace">
              <Button className="h-16 px-12 rounded-full font-bold text-slate-900 bg-white hover:bg-sky-50 hover:scale-105 transition-all text-lg shadow-xl shadow-white/10">
                Go to Marketplace
              </Button>
            </Link>
          </div>

          <div className="pt-12 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600 font-bold border-t border-slate-800 mt-12">
            <p>© 2024 RVI Network. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span className="hover:text-slate-400 cursor-pointer">
                Privacy Policy
              </span>
              <span className="hover:text-slate-400 cursor-pointer">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
