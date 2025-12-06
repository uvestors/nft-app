"use client";

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useConnection,
  type BaseError,
  useReadContract,
} from "wagmi";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS, METER_ABI } from "@/config/contracts";

export const TransferButton = ({ tokenId }: { tokenId: number }) => {
  // 1. 获取当前账户地址 (使用 useConnection 而不是 useConnection)
  const { address, isConnected } = useConnection();

  // 2. 检查是否已授权给 OPERATOR_ADDRESS
  const { data: isApprovedForAll } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: METER_ABI,
    functionName: "isApprovedForAll",
    args: [address!, CONTRACT_ADDRESS],
    query: {
      enabled: !!address && isConnected,
      initialData: false,
    },
  });

  console.log(isApprovedForAll);

  // 2. 使用 mutateAsync 并重命名为 writeContractAsync
  // 这样可以使用 await 等待签名完成，且不报错
  const { mutateAsync: writeContractAsync, isPending: isWritePending } =
    useWriteContract();

  // 3. 本地状态存储 txHash 用于监听上链状态
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  // 4. 监听交易上链确认
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  // 🔄 监听并打印日志：确认阶段
  useEffect(() => {
    if (isConfirming) {
      console.log(`[Transfer #${tokenId}] 3. 正在链上确认中 (Mining)...`);
    }
    if (isConfirmed) {
      console.log(`[Transfer #${tokenId}] ✅ 交易成功确认！资产已转移。`);
    }
  }, [isConfirming, isConfirmed, tokenId]);

  const handleTransfer = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log(`[Transfer #${tokenId}] 0. 用户点击发送按钮`);

    if (!isConnected || !address) {
      console.warn("未检测到钱包连接");
      alert("请先连接钱包！");
      return;
    }

    const recipient = prompt(
      `转移电表 #${tokenId}\n请输入接收方钱包地址 (0x...):`
    );

    if (!recipient) {
      console.log("用户取消输入");
      return;
    }

    if (!recipient.startsWith("0x") || recipient.length !== 42) {
      alert("地址格式错误！必须是 0x 开头的以太坊地址。");
      return;
    }

    console.log(`准备将 #${tokenId} 发送给 ${recipient}`);

    try {
      console.log(
        `[Transfer #${tokenId}] 1. 请求已发送，等待钱包签名...`,
        address,
        recipient
      );

      // ✅ 核心改造：使用 await writeContractAsync
      // 这里的参数结构与原来一致，但移除了第二个参数的回调对象
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: METER_ABI,
        functionName: "safeTransferFrom",
        args: [
          address, // from
          recipient as `0x${string}`, // to
          BigInt(tokenId), // id (必须转为 BigInt)
          BigInt(1), // amount
          "0x", // data
        ],
      });

      // 只有用户在钱包点击确认签名后，才会执行到这里
      console.log(`[Transfer #${tokenId}] 2. 交易已提交！Tx Hash:`, hash);
      console.log(`🔗 查看交易: https://amoy.polygonscan.com/tx/${hash}`);

      // 设置 Hash，触发 useWaitForTransactionReceipt 开始监听上链
      setTxHash(hash);
    } catch (err) {
      // ❌ 捕获错误：用户拒绝签名 或 网络错误
      console.error(`[Transfer #${tokenId}] ❌ 写入失败/用户拒绝:`, err);
      const error = err as BaseError;
      alert(`交易失败: ${error.shortMessage || error.message}`);
    }
  };

  // --- 状态渲染逻辑 ---

  if (isConfirmed) {
    return (
      <div
        className="flex items-center justify-center w-7 h-7 rounded-md bg-green-50 border border-green-200 text-green-600"
        title="Transfer Successful"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    );
  }

  // 合并等待状态：要么正在签名(WritePending)，要么正在确认(Confirming)
  if (isWritePending || isConfirming) {
    return (
      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-indigo-50 border border-indigo-200 cursor-wait">
        <svg
          className="w-4 h-4 text-indigo-600 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <button
      onClick={handleTransfer}
      className="flex items-center justify-center w-fit px-2 py-1 gap-1 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200 group/btn"
      title="Transfer Asset"
    >
      <span className="text-[10px] font-medium">Send</span>
      <svg
        className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
    </button>
  );
};
