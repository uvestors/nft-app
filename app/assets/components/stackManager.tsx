import { Spinner } from "@/components/ui/spinner";
import {
  CONTRACT_ADDRESS,
  METER_ABI,
  STAKING_ABI,
  STAKING_ADDRESS,
} from "@/config/contracts";
// 1. 引入 useQueryClient
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Lock, Unlock } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

interface StakeManagerProps {
  tokenId: string;
  isStaked: boolean;
  isApproved: boolean;
  isCheckingApproval: boolean;
  refetchStakingData: () => void;
}

const StakeManager = ({
  tokenId,
  isStaked,
  isApproved,
  isCheckingApproval,
  refetchStakingData,
}: StakeManagerProps) => {
  const { address } = useAccount();
  // 2. 获取 queryClient 实例
  const queryClient = useQueryClient();

  const {
    writeContract: write,
    data: hash,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // 状态副作用处理
  useEffect(() => {
    if (isConfirmed) {
      // 1. 立即刷新详情页的链上数据，实现即时UI更新
      refetchStakingData();

      // 2. 延迟刷新列表数据，以等待 Polygonscan API 索引更新
      const timer = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["ownedTokens"] });
      }, 5000); // 可以适当增加延迟时间

      return () => clearTimeout(timer);
    }

    if (writeError) {
      toast.error(`Transaction Failed: ${writeError.message}`);
    }
  }, [isConfirmed, writeError, queryClient, refetchStakingData]);

  const handleAction = () => {
    if (!tokenId || !address) return;

    if (isStaked) {
      write({
        address: STAKING_ADDRESS,
        abi: STAKING_ABI,
        functionName: "unstake",
        args: [BigInt(tokenId), 1n],
      });
      return;
    }

    if (!isApproved) {
      toast.info("Please approve the staking contract first.");
      write({
        address: CONTRACT_ADDRESS,
        abi: METER_ABI,
        functionName: "setApprovalForAll",
        args: [STAKING_ADDRESS, true],
      });
    } else {
      write({
        address: STAKING_ADDRESS,
        abi: STAKING_ABI,
        functionName: "stake",
        args: [BigInt(tokenId), 1n],
      });
    }
  };

  const isLoading = isWritePending || isConfirming || isCheckingApproval;

  let buttonText = isStaked ? "Unstake Asset" : "Stake Asset";
  if (!isStaked && !isApproved && !isCheckingApproval)
    buttonText = "Approve Access";
  if (isLoading) buttonText = isConfirming ? "Confirming..." : "Processing...";

  return (
    <button
      onClick={handleAction}
      disabled={isLoading}
      className={clsx(
        "flex-1 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold text-white shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-70",
        isStaked
          ? "bg-red-600 hover:bg-red-700"
          : !isApproved
          ? "bg-indigo-600 hover:bg-indigo-700"
          : "bg-blue-600 hover:bg-blue-700"
      )}
    >
      {isLoading && <Spinner className="size-4 text-white/80 animate-spin" />}
      {!isLoading && (
        <>
          {isStaked ? (
            <Unlock className="w-4 h-4" />
          ) : (
            <Lock className="w-4 h-4" />
          )}
        </>
      )}
      {buttonText}
    </button>
  );
};

export default StakeManager;
