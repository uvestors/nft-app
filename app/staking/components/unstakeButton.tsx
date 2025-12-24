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

    write({
      address: STAKING_ADDRESS,
      abi: STAKING_ABI,
      functionName: "unstake",
      args: [BigInt(tokenId), 1n],
    });
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
