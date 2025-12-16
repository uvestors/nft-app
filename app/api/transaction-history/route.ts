import { serializateUrl } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

// ... (接口定义保持不变) ...
interface PolygonscanTx {
  // ...
  tokenValue: string;
  from: string;
  to: string;
  timeStamp: string;
  hash: string;
  tokenID: string;
  gasPrice: string;
  gasUsed: string;
}

interface UserHistoryItem {
  id: string;
  action: "Stake" | "Unstake" | "Deposit" | "Transfer Out";
  asset: string;
  amount: string;
  date: string;
  hash: string;
  gasFee: string;
  status: "Confirmed" | "Failed";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "缺少 address 参数" }, { status: 400 });
  }

  const userAddress = address.toLowerCase();
  // 确保这里处理了 undefined 的情况，给个默认空字符串防止报错
  const stakingContract = (
    process.env.NEXT_PUBLIC_NFT_STAKING_ADDRESS || ""
  ).toLowerCase();

  if (!process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY) {
    return NextResponse.json({ error: "API KEY 未配置" }, { status: 500 });
  }

  // ✅ 修正点：在 V2 API 中，必须显式包含 module: "account"
  const url = serializateUrl(process.env.NEXT_PUBLIC_AMOY_API_URL!, {
    module: "account", // 👈 之前报错是因为少了这一行！
    action: "token1155tx", // 操作：查询 1155 交易
    chainid: "80002", // 👈 V2 必须：指定 Amoy 链 ID
    address: address,
    contractaddress: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
    apikey: process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY,
    page: 1,
    offset: 1000,
    sort: "desc",
  });

  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
    const data = await response.json();

    // V2 API 有时返回 status "0" 但 message 是 "No transactions found"，这也算正常
    if (data.status !== "1" && data.message !== "No transactions found") {
      console.error("Etherscan V2 API Error:", data);
      return NextResponse.json({ history: [] }); // 出错时返回空数组比报错更稳健
    }

    const rawTransactions: PolygonscanTx[] = data.result || [];

    const processedHistory: UserHistoryItem[] = rawTransactions
      .filter((tx) => tx.tokenValue !== "0")
      .map((tx) => {
        const txFrom = tx.from.toLowerCase();
        const txTo = tx.to.toLowerCase();
        let action: UserHistoryItem["action"];

        if (txFrom === userAddress && txTo === stakingContract) {
          action = "Stake";
        } else if (txFrom === stakingContract && txTo === userAddress) {
          action = "Unstake";
        }

        const timestampMs = parseInt(tx.timeStamp) * 1000;

        // 1. 获取 BigInt 类型的数值 (防止精度丢失)
        const gasUsed = BigInt(tx.gasUsed);
        const gasPrice = BigInt(tx.gasPrice);

        // 2. 计算总 Wei: Gas Used * Gas Price
        const feeInWei = gasUsed * gasPrice;

        // 3. 转换为 ETH/MATIC/POL (除以 10^18)
        // 为了保留小数位，我们先转为 Number 进行除法 (对于 UI 显示足够精确)
        // 如果想非常严谨，可以使用 viem 的 formatEther，但这里用原生 math 即可
        const feeInNative = Number(feeInWei) / 1e18;

        // 4. 格式化字符串，例如保留 6 位小数: "0.000420 POL"
        // 使用 Intl.NumberFormat 去掉末尾多余的0更优雅，或者直接 toFixed
        const formattedFee = `${feeInNative
          .toFixed(6)
          .replace(/\.?0+$/, "")} POL`;

        return {
          id: `${tx.hash}-${tx.tokenID}`,
          action: action,
          tokenId: `${tx.tokenID}`,
          amount: `${tx.tokenValue}`,
          date: new Date(timestampMs).toISOString(),
          hash: tx.hash,
          gasFee: formattedFee,
          status: "Confirmed",
        };
      });

    const finalHistory = processedHistory
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter((item) => !!item.action);

    return NextResponse.json(finalHistory);
  } catch (error) {
    console.error("API Proxy Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
