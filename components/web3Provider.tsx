"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { injected, metaMask } from "wagmi/connectors";

// 使用 ConnectKit 提供的助手函数，但显式声明以避免自动导入所有钱包
const config = createConfig(
  getDefaultConfig({
    // 基础配置
    appName: "RVI App",
    chains: [polygonAmoy],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    connectors: [metaMask(), injected()],

    transports: {
      [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_POLYGON_RPC_URL),
    },
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
