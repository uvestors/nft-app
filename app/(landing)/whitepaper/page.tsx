import React from "react";
import { ArrowLeft, Download, FileText, ChevronRight } from "lucide-react";
import DownloadPDF from "@/components/download/pdf";
import Link from "next/link";

// --- 样式常量 ---
const TEXT_GRADIENT =
  "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-600";

export default function WhitepaperPage() {
  // ---------------------------------------------------------------------------
  // 路由处理逻辑
  // ---------------------------------------------------------------------------
  // 在真实的 Next.js 项目中，请取消下方注释并删除模拟的 mockRouter：
  // import { useRouter } from "next/navigation";
  // const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900">
      {/* --- 顶部导航栏 (修复版) --- 
        1. 外层：负责固定定位(fixed)、背景色、毛玻璃效果、下边框。宽度强制 w-full 铺满屏幕。
      */}
      <div className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-50">
        {/* 2. 内层：负责限制内容宽度(max-w-screen-2xl)、居中(mx-auto)、高度(h-16)和 Flex 布局。
         */}
        <div className="max-w-screen-2xl mx-auto h-16 px-4 lg:px-8 flex items-center justify-between">
          {/* 左侧 Logo 区 */}
          <div className="flex items-center gap-4">
            <Link href="/introduce">
              <button
                type="button"
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors group cursor-pointer"
                aria-label="Go Back"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
            </Link>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xl font-black tracking-tighter ${TEXT_GRADIENT}`}
              >
                RVI
              </span>
              <span className="hidden sm:inline text-sm font-bold text-slate-400">
                /
              </span>
              <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                Whitepaper V1.0
              </span>
            </div>
          </div>
          <DownloadPDF filename="rvi-whitepaper.pdf">
            <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          </DownloadPDF>
        </div>
      </div>

      {/* 主阅读区 - 居中单栏布局 */}
      {/* pt-24 是为了防止内容被 fixed 的 header 遮挡 (header高度16 + 额外间距) */}
      <div className="pt-24 pb-24 px-6 md:px-12 max-w-3xl mx-auto">
        {/* 文档头部 */}
        <header className="mb-16 border-b border-slate-200 pb-12">
          <div className="mb-6 inline-flex items-center gap-2 text-sky-600 bg-sky-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3 h-3" /> Technical Documentation
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-[1.15]">
            RVI Network: Decentralizing the{" "}
            <span className={TEXT_GRADIENT}>Energy Data Layer</span>
          </h1>
          <p className="text-xl leading-relaxed text-slate-500 font-medium">
            A protocol for cryptographically validating real-world energy
            consumption via Trusted Execution Environments (TEE) and
            Zero-Knowledge Proofs.
          </p>
          <div className="flex items-center gap-4 mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Version 1.0.1</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span>Last Updated: Oct 2026</span>
          </div>
        </header>

        {/* 正文内容 - 纯净文档流 */}
        <article className="prose prose-slate prose-lg max-w-none font-medium">
          {/* 1. Abstract */}
          <section className="mb-16">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-sky-500 text-lg opacity-50">01.</span>{" "}
              Abstract
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              The global energy transition is hindered by a lack of verifiable
              data. Current grids rely on centralized silos where consumption
              data is opaque and verifiable only by monopoly providers. This
              leads to inefficiencies in grid balancing and a lack of trust in
              carbon credit markets.
            </p>
            <p className="text-slate-600 leading-relaxed">
              RVI Network introduces a novel consensus mechanism for validating
              real-world energy consumption data. By leveraging trusted hardware
              execution environments (TEE) and decentralized ledger technology,
              we solve the "Oracle Problem" for the energy sector, turning
              energy data into a composable, trustless asset.
            </p>
          </section>

          {/* 2. Architecture */}
          <section className="mb-16">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-sky-500 text-lg opacity-50">02.</span>{" "}
              System Architecture
            </h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              The RVI protocol consists of three primary layers designed to
              ensure data integrity from the physical edge to the on-chain
              application layer.
            </p>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Layer 1: The Hardware Edge
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                RVI Smart Meter Nodes act as the physical anchor of the network.
                Each device is equipped with a Secure Element (ATECC608A) that
                generates a unique public-private key pair during manufacturing.
                This ensures that data cannot be spoofed by software emulators.
              </p>

              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Layer 2: Proof of Physical Work (PoPW)
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Raw data is batched and verified using zk-SNARKs to prove that
                the computation (energy measurement) was performed correctly
                without revealing the underlying granular user data, ensuring
                privacy compliance (GDPR).
              </p>
            </div>
          </section>

          {/* 3. Tokenomics */}
          <section className="mb-16">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-sky-500 text-lg opacity-50">03.</span>{" "}
              Tokenomics
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              The $RVI token is the native utility token designed to align
              incentives between hardware operators, validators, and data
              consumers. The model utilizes a disinflationary emission schedule
              similar to Bitcoin, with a "halving" event occurring every 24
              months.
            </p>

            <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-6 marker:text-sky-500">
              <li>
                <strong>Mining Rewards (40%):</strong> Distributed to active
                nodes based on uptime and data quality scores.
              </li>
              <li>
                <strong>Treasury (20%):</strong> Reserved for ecosystem grants,
                partnerships, and liquidity provision.
              </li>
              <li>
                <strong>Team & Investors (15%):</strong> Subject to a 4-year
                vesting schedule with a 1-year cliff.
              </li>
              <li>
                <strong>Public Sale (25%):</strong> Distributed to early
                community members and node operators.
              </li>
            </ul>
          </section>

          {/* 4. Governance */}
          <section className="mb-16">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-sky-500 text-lg opacity-50">04.</span>{" "}
              Governance
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              RVI transitions to a DAO structure in Phase 3. Token holders will
              vote on critical protocol parameters, including:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm font-bold text-slate-700">
                Reward Emission Rates
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm font-bold text-slate-700">
                Hardware Whitelist Criteria
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm font-bold text-slate-700">
                Data Marketplace Fees
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm font-bold text-slate-700">
                Treasury Allocations
              </div>
            </div>
          </section>
        </article>

        {/* 底部导航 */}
        <div className="mt-24 pt-12 border-t border-slate-200 flex justify-between items-center">
          <div className="text-sm font-bold text-slate-400">
            © 2026 RVI Network
          </div>
          <Link href="/marketplace">
            <button
              type="button"
              className="flex items-center gap-2 text-sky-600 font-bold hover:text-sky-700 transition-colors"
            >
              Go to Marketplace <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
