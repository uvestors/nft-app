"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
//0x1d586bbc7147de00047261c1cc189d3b00ccdd1f
//0x1d586bbc7147de00047261c1cc189d3b00ccdd1f

const config = createConfig(
  getDefaultConfig({
    // 你的应用名称
    appName: "RWA Demo App",
    // 配置支持的链，这里只用 Amoy
    chains: [polygonAmoy],
    transports: {
      // 使用默认的 RPC 节点，生产环境建议用 Alchemy/Infura
      [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_POLYGON_RPC_URL),
    },
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "", // 可选，去 WalletConnect 申请
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider mode="dark">{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
