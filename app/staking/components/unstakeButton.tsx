import { Button } from "@/components/ui/button";
import {
  CONTRACT_ADDRESS,
  METER_ABI,
  STAKING_ABI,
  STAKING_ADDRESS,
} from "@/config/contracts";
import { postFetcher } from "@/utils/request/fetcher";
import React from "react";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import {
  useConnection,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

const UnstakeButton = ({
  isApproved,
  refetchStakingData,
  isCheckingApproval,
  tokenId,
  planId,
}) => {
  const { address } = useConnection();
  const { trigger } = useSWRMutation("/staking/unstake", postFetcher, {
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

  const { data: simulateData, error: simulateError } = useSimulateContract({
    address: STAKING_ADDRESS,
    abi: STAKING_ABI,
    functionName: "unstake",
    args: tokenId ? [BigInt(tokenId), 1n] : undefined,
    query: {
      enabled: !!address && !!tokenId, // 只有在有地址和ID时才运行模拟
    },
  });

  React.useEffect(() => {
    // 优先显示模拟阶段的错误
    const currentError = writeError || simulateError;
    if (currentError) {
      console.error("Unstake Error Details:", currentError);

      // 提取核心错误信息，防止 [Object object]
      const errorMessage =
        currentError.shortMessage ||
        currentError.cause?.message ||
        currentError.message;

      // 如果报错包含 'reverted', 通常说明是合约逻辑不通过（如锁定期未到）
      if (errorMessage.includes("reverted")) {
        toast.error(`Contract Error: ${errorMessage}`);
      } else {
        toast.error(`Transaction Failed: ${errorMessage}`);
      }
    }
  }, [simulateError, writeError]);

  React.useEffect(() => {
    if (isConfirmed) {
      toast.success(`Unstake Meter #${tokenId} successful`);

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
  }, [isConfirmed, writeError, hash]);

  const handleClick = () => {
    if (!tokenId || !address) return;

    // try {
    //   write(simulateData!.request);
    // } catch (error) {
    //   console.log("error", error);
    // }

    try {
      write({
        address: STAKING_ADDRESS,
        abi: STAKING_ABI,
        functionName: "unstake",
        args: [BigInt(tokenId), 1n],
      });
    } catch (error) {
      console.log("Unstake error", error);
    }
  };

  const isLoading = isWritePending || isConfirming || isCheckingApproval;

  let buttonText = "Confirm Withdrawal";
  if (!isApproved && !isCheckingApproval) buttonText = "Approve Access";
  if (isLoading) buttonText = isConfirming ? "Confirming..." : "Processing...";

  return (
    <Button
      className="w-full h-14 text-base bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-200"
      onClick={handleClick}
      disabled={isLoading}
    >
      {buttonText}
    </Button>
  );
};

export default UnstakeButton;
