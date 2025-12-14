import ArtPlaceholder from "@/components/artPlaceholder";
import { Spinner } from "@/components/ui/spinner";
import {
  CONTRACT_ADDRESS,
  METER_ABI,
  STAKING_ADDRESS,
} from "@/config/contracts";
import { serializateUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import StakeManager from "./stackManager";
import { useMemo } from "react";

interface AssetsDetailsProps {
  data: TokenMetadata | null;
  onClose?: () => void; // 用于在操作成功后关闭 Dialog
}

const AssetsDetails = ({ data, onClose }: AssetsDetailsProps) => {
  const tokenId = data?.tokenId;
  const { address } = useAccount();

  // 1. Authoritative staked status from blockchain (Single Source of Truth)
  const { data: stakedBalance, refetch: refetchStakedStatus } = useReadContract(
    {
      address: CONTRACT_ADDRESS,
      abi: METER_ABI,
      functionName: "balanceOf",
      args: [STAKING_ADDRESS, BigInt(tokenId!)],
      query: { enabled: !!tokenId },
    }
  );
  const isStaked = useMemo(() => (stakedBalance ?? 0n) > 0n, [stakedBalance]);

  // 2. Authoritative approval status from blockchain
  const {
    data: isApproved,
    isLoading: isCheckingApproval,
    refetch: refetchApproval,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: METER_ABI,
    functionName: "isApprovedForAll",
    args: [address!, STAKING_ADDRESS],
    query: { enabled: !!address && !isStaked }, // Only check if not staked
  });

  // 读取合约
  const { data: uriResults, isLoading: isContractsLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: METER_ABI,
    functionName: "uri",
    args: [BigInt(tokenId!)],
    query: { enabled: !!tokenId },
  });

  // 读取 NFT
  const {
    data: selectedNft,
    isLoading: isNftLoading,
    isError,
  } = useQuery<NftMetadata | null>({
    queryKey: ["nft-metadata", tokenId],
    queryFn: async () => {
      const metadataUrl = (uriResults as string).replace(
        "ipfs://",
        "https://ipfs.io/ipfs/"
      );

      const response = await fetch(metadataUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch NFT metadata");
      }
      const result = (await response.json()) as NftMetadata;
      return {
        ...result,
        tokenId: tokenId,
      };
    },
    enabled: !!uriResults,
  });

  if (isContractsLoading || isNftLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="size-16" />
      </div>
    );
  }

  if (isError || !selectedNft) {
    return (
      <div className="flex h-full items-center justify-center">
        未能找到 NFT 详情。
      </div>
    );
  }

  return (
    <div className="grid h-full md:grid-cols-2">
      {data != null && (
        <div className="relative aspect-square bg-gray-50 md:aspect-auto md:border-r border-gray-100">
          <ArtPlaceholder type={data.imageType} color={data.color} />
          <div className="absolute bottom-4 left-4">
            <div
              className={clsx(
                isStaked // Use real-time on-chain status
                  ? "bg-[#2563eb]"
                  : "bg-black",
                "flex items-center gap-1.5 text-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider shadow-lg backdrop-blur-sm bg-opacity-90"
              )}
            >
              {isStaked && ( // Use real-time on-chain status
                <Sparkles size={10} fill="currentColor" />
              )}
              {isStaked ? "STAKED" : "HELD"}
            </div>
          </div>
        </div>
      )}

      {selectedNft != null && (
        <div className="flex h-full flex-col p-6 md:p-8">
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
                Genesis Collection
              </span>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {selectedNft.name || (
                <span>
                  Meter NFT <span className="text-slate-400">#{tokenId}</span>
                </span>
              )}
            </h3>
            <div className="text-sm font-medium leading-7 text-slate-500">
              {selectedNft.description ||
                "No description available for this asset."}
            </div>
          </div>
          {selectedNft.attributes && selectedNft.attributes.length > 0 && (
            <div className="mb-8 space-y-4">
              <h4 className="text-sm font-medium leading-none text-gray-900">
                Properties
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {selectedNft.attributes.map((attr, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col space-y-1 rounded-md border bg-gray-50/50 p-3"
                  >
                    <span className="text-xs font-medium uppercase text-gray-500">
                      {attr.trait_type}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {attr.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-auto flex items-center justify-end gap-4 border-t pt-6">
            <StakeManager
              tokenId={tokenId!}
              isStaked={isStaked}
              isApproved={isApproved ?? false}
              isCheckingApproval={isCheckingApproval}
              refetchStakingData={() => {
                refetchStakedStatus();
                refetchApproval();
              }}
            />
            <Link
              target="_blank"
              href={serializateUrl(
                `https://amoy.polygonscan.com/token/${CONTRACT_ADDRESS}`,
                { a: data!.tokenId }
              )}
            >
              <button className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50">
                <ExternalLink className="mr-2 w-4 h-4" />
                Polygonscan
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetsDetails;
