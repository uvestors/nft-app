"use client";

import { useState, useEffect } from "react";
import {
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { ConnectKitButton } from "connectkit";
import {
  CONTRACT_ADDRESS,
  METER_ABI,
  STAKING_ADDRESS,
  STAKING_ABI,
} from "@/config/contracts";

// 定义检测范围: ID 1 到 100
const tokenIds = Array.from({ length: 100 }, (_, i) => i + 1);

// --------------------------------------------------------------------
// 子组件：单行质押操作
// --------------------------------------------------------------------
const StakingItem = ({
  tokenId,
  walletBal,
  stakedBal,
  isApproved,
  onStake,
  onUnstake,
  isPending,
}: {
  tokenId: number;
  walletBal: bigint;
  stakedBal: bigint;
  isApproved: boolean;
  onStake: (id: number, amount: number) => void;
  onUnstake: (id: number, amount: number) => void;
  isPending: boolean;
}) => {
  const [amount, setAmount] = useState(1);

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:shadow-md">
      {/* 信息区 */}
      <div className="flex flex-col gap-1 w-full sm:w-1/3">
        <span className="font-bold text-gray-800 text-lg">
          Meter #{tokenId}
        </span>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Wallet:{" "}
            <strong className="text-gray-900">{walletBal.toString()}</strong>
          </span>
          <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
            Staked:{" "}
            <strong className="text-indigo-900">{stakedBal.toString()}</strong>
          </span>
        </div>
      </div>

      {/* 操作区 */}
      <div className="flex items-center gap-2 w-full sm:w-2/3 justify-end">
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
          className="border border-gray-300 rounded-lg px-3 py-2 w-20 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Stake 按钮 */}
        <button
          onClick={() => onStake(tokenId, amount)}
          disabled={!isApproved || walletBal < BigInt(amount) || isPending}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            !isApproved || walletBal < BigInt(amount)
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Stake
        </button>

        {/* Unstake 按钮 */}
        <button
          onClick={() => onUnstake(tokenId, amount)}
          disabled={stakedBal < BigInt(amount) || isPending}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            stakedBal < BigInt(amount)
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          }`}
        >
          Unstake
        </button>
      </div>
    </div>
  );
};

// --------------------------------------------------------------------
// 主页面组件
// --------------------------------------------------------------------
export default function StakingPage() {
  // ✅ Fix 1: 添加 mounted 状态
  const [mounted, setMounted] = useState(false);

  // ✅ Fix 2: 在组件挂载后设置为 true
  useEffect(() => {
    setMounted(true);
  }, []);

  const { address, isConnected } = useAccount();

  // 1. 批量读取：钱包余额
  const { data: walletResults, isLoading: isWalletLoading } = useReadContracts({
    contracts: tokenIds.map((id) => ({
      address: CONTRACT_ADDRESS,
      abi: METER_ABI,
      functionName: "balanceOf",
      args: [address!, BigInt(id)],
    })),
    query: { enabled: !!address },
  });

  // 2. 批量读取：质押池余额
  const { data: stakedResults, isLoading: isStakedLoading } = useReadContracts({
    contracts: tokenIds.map((id) => ({
      address: STAKING_ADDRESS,
      abi: STAKING_ABI,
      functionName: "getStakedBalance",
      args: [address!, BigInt(id)],
    })),
    query: { enabled: !!address },
  });

  // 3. 读取全局授权状态
  const { data: isApproved } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: METER_ABI,
    functionName: "isApprovedForAll",
    args: [address!, STAKING_ADDRESS],
    query: { enabled: !!address },
  });

  // 4. 写合约逻辑
  const { mutateAsync: writeContractAsync, isPending } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}`>();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // --- 数据处理 ---
  const activeItems = tokenIds
    .map((id, index) => {
      const wBal = walletResults?.[index]?.result as bigint | undefined;
      const sBal = stakedResults?.[index]?.result as bigint | undefined;
      return {
        id,
        walletBal: wBal || 0n,
        stakedBal: sBal || 0n,
      };
    })
    .filter((item) => item.walletBal > 0n || item.stakedBal > 0n);

  // --- 操作处理 ---
  const handleApprove = async () => {
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: METER_ABI,
        functionName: "setApprovalForAll",
        args: [STAKING_ADDRESS, true],
      });
      setTxHash(hash);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStake = async (id: number, amount: number) => {
    try {
      const hash = await writeContractAsync({
        address: STAKING_ADDRESS,
        abi: STAKING_ABI,
        functionName: "stake",
        args: [BigInt(id), BigInt(amount)],
      });
      setTxHash(hash);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnstake = async (id: number, amount: number) => {
    try {
      const hash = await writeContractAsync({
        address: STAKING_ADDRESS,
        abi: STAKING_ABI,
        functionName: "unstake",
        args: [BigInt(id), BigInt(amount)],
      });
      setTxHash(hash);
    } catch (e) {
      console.error(e);
    }
  };

  // ✅ Fix 3: 解决 Hydration Error
  // 如果还没挂载，返回一个简单的 Loading 占位，防止服务端和客户端 HTML 不匹配
  if (!mounted) {
    return (
      <main className="min-h-screen bg-gray-50 pb-20">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="container mx-auto px-6 h-16 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              RWA Staking Pool 🏦
            </h1>
            {/* 这里的按钮通常是安全的，但为了稳妥起见，加载时可以只渲染空壳 */}
          </div>
        </header>
        <div className="container mx-auto px-6 py-20 text-center text-gray-400 animate-pulse">
          Loading dApp...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            RWA Staking Pool 🏦
          </h1>
          <ConnectKitButton />
        </div>
      </header>

      <div className="container mx-auto px-6 py-10 max-w-4xl">
        {/* 全局状态通知区 */}
        {isConfirming && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 flex items-center justify-center animate-pulse">
            Transaction is confirming on chain... ⏳
          </div>
        )}
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center justify-center">
            Transaction Successful! The list will update shortly. ✅
          </div>
        )}

        {/* 主内容 */}
        {!isConnected ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">
              Please connect wallet to manage your staked assets
            </p>
            <ConnectKitButton />
          </div>
        ) : isWalletLoading || isStakedLoading ? (
          <div className="text-center py-20">Loading assets...</div>
        ) : (
          <div className="space-y-6">
            {/* 1. 全局授权卡片 */}
            {!isApproved && (
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
                <div>
                  <h3 className="font-bold text-yellow-800 text-lg">
                    ⚠️ Setup Required
                  </h3>
                  <p className="text-yellow-700 text-sm">
                    You must approve the Staking Contract to move your NFTs
                    before staking.
                  </p>
                </div>
                <button
                  onClick={handleApprove}
                  disabled={isPending}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl transition-all shadow-sm whitespace-nowrap"
                >
                  {isPending ? "Approving..." : "Enable Staking (Approve All)"}
                </button>
              </div>
            )}

            {/* 2. 列表区域 */}
            {activeItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <p className="text-gray-500">
                  You don't own or stake any Meter NFTs yet.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {activeItems.map((item) => (
                  <StakingItem
                    key={item.id}
                    tokenId={item.id}
                    walletBal={item.walletBal}
                    stakedBal={item.stakedBal}
                    isApproved={!!isApproved}
                    onStake={handleStake}
                    onUnstake={handleUnstake}
                    isPending={isPending}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
