import { serializateUrl } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

// 样式池逻辑保持不变
let pool: number[] = [];
function getUniqueFromPool() {
  if (pool.length === 0) {
    pool = [0, 1, 2, 3, 4, 5];
    pool.sort(() => Math.random() - 0.5);
  }
  return pool.pop();
}

const STYLE_POOL = [
  { imageType: "cube", color: "from-slate-800 to-slate-600" },
  { imageType: "wave", color: "from-indigo-900 via-purple-900 to-indigo-900" },
  { imageType: "prism", color: "from-fuchsia-500 via-cyan-500 to-blue-500" },
  { imageType: "gradient", color: "from-orange-400 via-pink-500 to-blue-600" },
  { imageType: "circle", color: "from-emerald-400 to-cyan-600" },
  { imageType: "dark", color: "from-gray-900 via-purple-900 to-black" },
];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const address = searchParams.get("address");

  // 获取环境变量中的合约地址并转为小写，防止大小写不匹配
  const STAKING_CONTRACT =
    process.env.NEXT_PUBLIC_NFT_STAKING_ADDRESS?.toLowerCase();
  const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
  const API_KEY = process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY;

  if (!address || !API_KEY || !STAKING_CONTRACT) {
    console.error(
      "Missing Config: Check env vars for Staking/NFT address or API Key"
    );
    return NextResponse.json(
      { error: "Missing address or API configuration" },
      { status: 400 }
    );
  }

  const userAddress = address.toLowerCase();

  // 构造 Polygonscan API 请求
  const url = serializateUrl(process.env.NEXT_PUBLIC_AMOY_API_URL!, {
    module: "account",
    action: "token1155tx",
    chainid: "80002",
    contractaddress: NFT_CONTRACT,
    address: address, // 查询该用户相关的所有转账
    apikey: API_KEY,
  });

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "1" && data.message !== "No transactions found") {
      console.log("Request error or empty:", data);
      return NextResponse.json(
        { error: data.message, ownedTokens: [] },
        { status: 400 }
      );
    }

    // 使用 Map 记录每个 Token ID 的详细状态
    // Key: TokenID => Value: { held: bigint, staked: bigint }
    const tokenLedger = new Map<number, { held: bigint; staked: bigint }>();

    const transactions = data.result || [];

    for (const tx of transactions) {
      const tokenId = Number(tx.tokenID);
      const amount = BigInt(tx.tokenValue);
      const from = tx.from.toLowerCase();
      const to = tx.to.toLowerCase();

      // 初始化 Map 数据
      if (!tokenLedger.has(tokenId)) {
        tokenLedger.set(tokenId, { held: 0n, staked: 0n });
      }
      const record = tokenLedger.get(tokenId)!;

      // === 逻辑核心 ===

      // 1. 用户收到 NFT (Incoming)
      if (to === userAddress) {
        record.held += amount; // 钱包余额增加

        // 如果是从“质押合约”转回来的（解押），则扣除质押余额
        if (from === STAKING_CONTRACT) {
          record.staked -= amount;
        }
      }

      // 2. 用户送出 NFT (Outgoing)
      else if (from === userAddress) {
        record.held -= amount; // 钱包余额减少

        // 如果是转给“质押合约”（质押），则增加质押余额
        if (to === STAKING_CONTRACT) {
          record.staked += amount;
        }
      }
    }

    // === 筛选结果 ===
    const ownedTokens = [];

    // 对 Token ID 进行排序，保证列表顺序稳定
    const sortedIds = Array.from(tokenLedger.keys()).sort((a, b) => a - b);

    for (const id of sortedIds) {
      const record = tokenLedger.get(id)!;

      // 只要 钱包余额 > 0 或者 质押余额 > 0，就算拥有
      if (record.held > 0n || record.staked > 0n) {
        // 随机样式分配
        const index = getUniqueFromPool();
        const style = STYLE_POOL[index!];

        // 判断当前主要状态 (用于前端可能的展示，虽然你目前的 Card 还没用到)
        let status = "Held";
        if (record.staked > 0n && record.held === 0n) status = "Staked";
        else if (record.staked > 0n && record.held > 0n) status = "Mixed"; // 既有持仓也有质押

        ownedTokens.push({
          tokenId: id,
          imageType: style.imageType,
          color: style.color,
          status: status, // 将状态传回前端，方便后续扩展 UI
          balance: (record.held + record.staked).toString(), // 总余额
        });
      }
    }

    return NextResponse.json(ownedTokens);
  } catch (error) {
    console.error("Polygonscan Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch asset list" },
      { status: 500 }
    );
  }
}
