import { Button } from "@/components/ui/button";
import {
  CONTRACT_ADDRESS,
  METER_ABI,
  STAKING_ABI,
  STAKING_ADDRESS,
} from "@/config/contracts";
import { postFetcher } from "@/utils/request/fetcher";
import { Loader2, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react"; // 引入图标
import React from "react";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import {
  useConnection,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

const StakeButton = ({
  isApproved,
  refetchStakingData,
  isCheckingApproval,
  tokenId,
  planId,
}) => {
  const { address } = useConnection();
  const { trigger } = useSWRMutation("/staking/stake", postFetcher, {
    onSuccess() {
      refetchStakingData();
    },
  });

  const {
    mutateAsync: write,
    data: hash,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  React.useEffect(() => {
    if (isConfirmed) {
      toast.success(`Stake Meter #${tokenId} successful`);
      trigger({
        user_address: address,
        token_id: tokenId,
        plan_id: planId,
        tx_hash: hash,
      });
    }

    if (writeError) {
      toast.error(`Transaction Failed: ${writeError.message}`);
    }
  }, [isConfirmed, writeError, hash, tokenId, address, planId, trigger]);

  const handleClick = () => {
    if (!tokenId || !address) return;

    // debug log
    console.log("Debug Stake:", {
      isApprovedProp: isApproved, // 如果这里打印 true，但交易挂了，说明 isApproved 算错了
      stakingContract: STAKING_ADDRESS,
      tokenId: tokenId,
    });

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

  // 根据状态决定按钮文案和图标
  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {isConfirming ? "Confirming..." : "Processing..."}
        </>
      );
    }

    if (!isApproved) {
      return (
        <>
          <ShieldCheck className="mr-2 h-5 w-5" />
          Approve Access
        </>
      );
    }

    return (
      <>
        <LockKeyhole className="mr-2 h-5 w-5" />
        Stake Asset Now
      </>
    );
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      // 样式优化：
      // 1. h-12: 更高的按钮，增加点击区域
      // 2. w-full: 填满容器宽度
      // 3. rounded-xl: 更柔和的圆角，匹配 iOS/现代风格
      // 4. shadow-lg: 增加层次感
      // 5. bg-indigo-600: 匹配 Modal 的主题色
      className={`
        w-full h-12 text-base font-semibold rounded-xl transition-all duration-200
        ${
          !isApproved && !isLoading
            ? "bg-slate-800 hover:bg-slate-700 text-white shadow-slate-500/20" // Approve 状态用深色，显得稳重
            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30 shadow-lg hover:shadow-indigo-500/50 hover:-translate-y-0.5" // Stake 状态用主色，带悬浮上浮效果
        }
        ${isLoading ? "opacity-80 cursor-not-allowed" : ""}
      `}
    >
      {getButtonContent()}
    </Button>
  );
};

export default StakeButton;
