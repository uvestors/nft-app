"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useConnection } from "wagmi";
import { useModal } from "connectkit";
import { useRouter } from "next/navigation";
import {
  Zap,
  Wallet,
  Mail,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Lock, // 新增图标，增强安全性暗示
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const { isConnected, isConnecting } = useConnection();
  const { setOpen } = useModal();
  const router = useRouter();

  // --- 状态管理 ---
  const [viewState, setViewState] = useState<"SELECT" | "EMAIL">("SELECT");
  const [emailStep, setEmailStep] = useState<"INPUT" | "OTP">("INPUT");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 1. 自动跳转逻辑 (优化: 恢复逻辑并增加挂载检查)
  //   useEffect(() => {
  //     // 情况 A: 钱包已连接
  //     if (isConnected) {
  //       router.replace("/dashboard");
  //     }
  //     // 情况 B: 之前用 Email 登录过
  //     const storedEmail = localStorage.getItem("rvi_user_email");
  //     if (storedEmail && !isConnected) {
  //       router.replace("/dashboard");
  //     }
  //   }, [isConnected, router]);

  // 2. 钱包连接处理
  const handleWalletConnect = () => {
    setOpen(true);
  };

  // 3. Email 流程处理

  // 步骤 A: 发送验证码
  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // 模拟 API 请求延迟
    setTimeout(() => {
      setIsLoading(false);
      setEmailStep("OTP");
    }, 1000);
  };

  // 步骤 B: 验证登录
  const handleVerifyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;

    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("rvi_user_email", email);
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  // 重置流程
  const goBack = () => {
    if (emailStep === "OTP") {
      setEmailStep("INPUT");
      setOtp(""); // 返回时清空验证码，防止混淆
    } else {
      setViewState("SELECT");
      setEmailStep("INPUT");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-cyan-100 selection:text-cyan-900">
      {/* 背景装饰: 调整为更接近官网的清爽风格 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-cyan-100/40 to-blue-100/40 rounded-full blur-[100px] opacity-70"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-pink-100/30 to-purple-100/30 rounded-full blur-[100px] opacity-60"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2rem] p-8 md:p-10 text-center transition-all duration-500 min-h-[520px] flex flex-col justify-center">
          {/* Logo: 增加呼吸灯效果 */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-8 group hover:scale-105 transition-transform duration-300">
            <Zap className="w-8 h-8 text-white fill-white group-hover:animate-pulse" />
          </div>

          {/* 标题: 使用官网同款渐变字 */}
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
              RVI
            </span>
          </h1>
          <p className="text-slate-500 mb-10 text-sm font-medium">
            Access the industrial energy marketplace.
          </p>

          {/* === 视图 A: 选择登录方式 === */}
          {viewState === "SELECT" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* 方式 1: 钱包 */}
              <Button
                size="lg"
                onClick={handleWalletConnect}
                disabled={isConnecting}
                className="w-full h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
              >
                {/* 按钮微光效果 */}
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>

                {isConnecting ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Wallet className="w-5 h-5 mr-2 group-hover:text-cyan-400 transition-colors" />
                )}
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>

              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
                  <span className="bg-white/50 backdrop-blur-sm px-3 text-slate-400">
                    Or
                  </span>
                </div>
              </div>

              {/* 方式 2: Email */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => setViewState("EMAIL")}
                className="w-full h-14 rounded-xl border-2 border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/50 text-slate-600 hover:text-cyan-700 font-bold text-lg transition-all"
              >
                <Mail className="w-5 h-5 mr-2" />
                Continue with Email
              </Button>
            </div>
          )}

          {/* === 视图 B: Email 流程 === */}
          {viewState === "EMAIL" && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-300">
              {/* 子步骤 1: 输入邮箱 */}
              {emailStep === "INPUT" && (
                <form onSubmit={handleSendCode} className="space-y-5">
                  <div className="text-left space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 ml-1 block uppercase tracking-wide">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="name@company.com"
                      required
                      autoFocus // 优化: 自动聚焦
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl border-slate-200 focus:border-cyan-500 focus:ring-cyan-100 bg-slate-50/50"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold shadow-lg shadow-cyan-200/50 transition-all hover:scale-[1.02]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Send Code"
                    )}
                  </Button>
                </form>
              )}

              {/* 子步骤 2: 输入验证码 (OTP) */}
              {emailStep === "OTP" && (
                <form onSubmit={handleVerifyLogin} className="space-y-5">
                  <div className="text-left space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-500 ml-1 block uppercase tracking-wide">
                        Verification Code
                      </label>
                      <span
                        className="text-[10px] font-bold text-cyan-600 hover:text-cyan-700 cursor-pointer bg-cyan-50 px-2 py-1 rounded-md transition-colors"
                        onClick={() => setEmailStep("INPUT")}
                      >
                        Change Email
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="1 2 3 4 5 6"
                        className="h-12 rounded-xl border-slate-200 focus:border-cyan-500 focus:ring-cyan-100 bg-slate-50/50 text-center text-xl tracking-[0.5em] font-bold text-slate-800 pl-10"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        autoFocus // 优化: 自动聚焦
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 text-center">
                      Code sent to{" "}
                      <span className="font-bold text-slate-600">{email}</span>
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-200 transition-all hover:scale-[1.02]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Log In"
                    )}
                  </Button>
                </form>
              )}

              {/* 统一返回按钮 */}
              <button
                type="button"
                onClick={goBack}
                disabled={isLoading}
                className="flex items-center justify-center w-full text-xs text-slate-400 hover:text-slate-600 font-bold mt-8 gap-1.5 transition-colors group"
              >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Back to options
              </button>
            </div>
          )}
        </div>

        {/* 底部信任标 */}
        <div className="mt-8 flex justify-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-[10px] font-bold text-slate-400 tracking-[0.15em] uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Secure
          </span>
          <span className="text-[10px] font-bold text-slate-400 tracking-[0.15em] uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Audited
          </span>
        </div>
      </div>
    </div>
  );
}
