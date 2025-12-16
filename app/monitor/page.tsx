"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Zap,
  Activity,
  Wifi,
  Thermometer,
  Cpu,
  Clock,
  Battery,
  AlertCircle,
  CheckCircle2,
  Server,
  Loader2,
  Settings, // ✨ 新增: 设置图标
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ScriptableContext,
} from "chart.js";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { useAccount, useConnection } from "wagmi"; // ✨ 修正: 通常 address 来自 useAccount
import { useRouter } from "next/navigation"; // ✨ 新增: 用于跳转
import { Button } from "@/components/ui/button"; // ✨ 新增: 引入按钮组件

// --- Chart.js 注册 ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- 核心算法 ---
const getMeterBaseStats = (tokenId: number) => {
  const seed = tokenId * 999;
  return {
    basePower: 30 + (seed % 20),
    baseVoltage: 215 + (seed % 25),
    efficiency: 85 + (seed % 14),
    temp: 35 + (seed % 25),
    firmware: `v2.${tokenId % 4}.${Math.floor(seed % 9)}`,
    cpuLoad: 10 + (seed % 40),
    isUnstable: tokenId % 7 === 0,
    maxCapacity: 48 + (seed % 5), // ✨ 新增: 每台设备的最大负载警戒线
  };
};

// 生成时间轴标签 (1H)
const generateLabels = () => {
  const labels = [];
  for (let i = 12; i >= 0; i--) {
    labels.push(
      dayjs()
        .subtract(i * 3, "second")
        .format("HH:mm:ss")
    );
  }
  return labels;
};

// 定义接口 (根据你的 useQuery 推断)
interface TokenMetadata {
  tokenId: string;
}

export default function DashboardPage() {
  const { address } = useConnection(); // 使用 wagmi 标准 hook
  const router = useRouter(); // ✨ 路由跳转
  const [selectedTokenId, setSelectedTokenId] = useState<string>("");
  const [timeRange, setTimeRange] = useState<"1H" | "24H" | "7D">("1H"); // ✨ 新增: 时间状态
  const [secondsAgo, setSecondsAgo] = useState(0); // ✨ 新增: Sync 计时器

  // --- 1. 获取真实拥有的 NFT 列表 ---
  const { data: ownedTokens = [], isLoading } = useQuery({
    queryKey: ["ownedTokens", address],
    queryFn: async () => {
      if (!address) return [];
      const response = await fetch(`/api/owned-tokens?address=${address}`);
      if (!response.ok) return []; // 防止 API 报错崩页面
      const data = await response.json();
      return data;
    },
    enabled: !!address,
  });

  // 默认选中第一个
  useEffect(() => {
    if (ownedTokens.length > 0 && !selectedTokenId) {
      setSelectedTokenId(ownedTokens[0].tokenId);
    }
  }, [ownedTokens, selectedTokenId]);

  // --- 2. 计算设备特征 ---
  const deviceStats = useMemo(() => {
    if (!selectedTokenId) return null;
    return getMeterBaseStats(Number(selectedTokenId));
  }, [selectedTokenId]);

  // --- 3. 状态管理 ---
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  const [liveData, setLiveData] = useState({
    power: 0,
    voltage: 0,
    usage: 0,
    frequency: 60,
  });

  // ✨ 新增: Sync 计时器逻辑 (只在 1H 模式下跳动)
  useEffect(() => {
    if (timeRange !== "1H") return;
    const timer = setInterval(() => {
      setSecondsAgo((prev) => (prev + 1) % 4); // 0 -> 1 -> 2 -> 3 -> 0
    }, 1000);
    return () => clearInterval(timer);
  }, [timeRange]);

  // --- 4. 核心逻辑：数据流模拟 (包含时间切换逻辑) ---
  useEffect(() => {
    if (!deviceStats) return;

    let interval: NodeJS.Timeout;

    // ➤ 模式 A: 1H (实时直播模式 - 保持你原有的逻辑)
    if (timeRange === "1H") {
      const initialDataPoints = Array.from({ length: 13 }, () =>
        (deviceStats.basePower + (Math.random() * 4 - 2)).toFixed(2)
      );

      // 初始化图表 (✨ 加入警戒线)
      setChartData({
        labels: generateLabels(),
        datasets: [
          {
            fill: true,
            label: "Real-time Power (kW)",
            data: initialDataPoints,
            borderColor: "rgb(79, 70, 229)",
            backgroundColor: (context: ScriptableContext<"line">) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 400);
              gradient.addColorStop(0, "rgba(79, 70, 229, 0.2)");
              gradient.addColorStop(1, "rgba(79, 70, 229, 0)");
              return gradient;
            },
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: "#fff",
            pointBorderColor: "rgb(79, 70, 229)",
            pointBorderWidth: 2,
            order: 1, // 图层顺序
          },
          // ✨ 新增: 警戒线 Dataset
          {
            label: "Max Capacity",
            data: Array(13).fill(deviceStats.maxCapacity),
            borderColor: "rgba(239, 68, 68, 0.5)", // 红色虚线
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
            order: 0,
          },
        ],
      });

      // 启动实时更新
      interval = setInterval(() => {
        const randomFluctuation = Math.random() * 2 - 1;
        const newPower = deviceStats.basePower + randomFluctuation;
        const newVoltage = deviceStats.baseVoltage + Math.random() * 1 - 0.5;

        setLiveData({
          power: newPower,
          voltage: newVoltage,
          usage: deviceStats.basePower * 8 + Math.random(),
          frequency: 59.9 + Math.random() * 0.2,
        });

        setSecondsAgo(0); // 重置 Sync 时间

        setChartData((prev: any) => {
          const newLabels = [
            ...prev.labels.slice(1),
            dayjs().format("HH:mm:ss"),
          ];
          const newData = [
            ...prev.datasets[0].data.slice(1),
            newPower.toFixed(2),
          ];

          return {
            ...prev,
            labels: newLabels,
            datasets: [
              { ...prev.datasets[0], data: newData },
              // 保持警戒线不动
              {
                ...prev.datasets[1],
                data: Array(13).fill(deviceStats.maxCapacity),
              },
            ],
          };
        });
      }, 3000);
    }
    // ➤ 模式 B: 24H (模拟日内趋势)
    else if (timeRange === "24H") {
      const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
      const data = labels.map((_, i) => {
        // 简单模拟: 白天(8-20点)高，晚上低
        const factor = i > 8 && i < 20 ? 1.1 : 0.8;
        return (deviceStats.basePower * factor + Math.random() * 5).toFixed(2);
      });

      setChartData({
        labels,
        datasets: [
          {
            fill: true,
            label: "24H Trend (kW)",
            data,
            borderColor: "rgb(16, 185, 129)", // Emerald
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            tension: 0.4,
            pointRadius: 2,
            order: 1,
          },
          {
            label: "Max Capacity",
            data: Array(24).fill(deviceStats.maxCapacity),
            borderColor: "rgba(239, 68, 68, 0.5)",
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
            order: 0,
          },
        ],
      });
      setLiveData((prev) => ({ ...prev, power: deviceStats.basePower })); // 停止跳动
    }
    // ➤ 模式 C: 7D (模拟周趋势)
    else {
      const labels = Array.from({ length: 7 }, (_, i) =>
        dayjs()
          .subtract(6 - i, "day")
          .format("MM/DD")
      );
      const data = labels.map(() =>
        (deviceStats.basePower * (0.9 + Math.random() * 0.3)).toFixed(2)
      );

      setChartData({
        labels,
        datasets: [
          {
            fill: true,
            label: "7D Trend (kW)",
            data,
            borderColor: "rgb(249, 115, 22)", // Orange
            backgroundColor: "rgba(249, 115, 22, 0.1)",
            tension: 0.3,
            pointRadius: 4,
            order: 1,
          },
          {
            label: "Max Capacity",
            data: Array(7).fill(deviceStats.maxCapacity),
            borderColor: "rgba(239, 68, 68, 0.5)",
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
            order: 0,
          },
        ],
      });
      setLiveData((prev) => ({ ...prev, power: deviceStats.basePower }));
    }

    return () => clearInterval(interval);
  }, [deviceStats, timeRange]);

  // 图表配置
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1e293b",
        bodyColor: "#475569",
        borderColor: "#e2e8f0",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          display: timeRange !== "1H", // 1H时不显示X轴文字以免拥挤
          color: "#94a3b8",
          font: { size: 10 },
        },
      },
      y: {
        grid: { color: "#f1f5f9", borderDash: [5, 5] },
        ticks: { color: "#94a3b8", font: { size: 10 } },
        min: 0,
        // 拉高 Y 轴上限，确保警戒线可见
        max: deviceStats ? Math.ceil(deviceStats.maxCapacity + 10) : 100,
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
    animation: { duration: timeRange === "1H" ? 0 : 500 }, // 1H无动画
  };

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20">
      {/* 顶部 Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Live Monitor
                </h1>
                {/* 仅在 1H 模式显示呼吸灯 */}
                {timeRange === "1H" && (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Real-time industrial data stream from Polygon Amoy.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-600">
                Device:
              </label>
              {isLoading ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading Assets...
                </div>
              ) : ownedTokens.length > 0 ? (
                <select
                  value={selectedTokenId}
                  onChange={(e) => setSelectedTokenId(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 min-w-[150px] font-medium shadow-sm"
                >
                  {ownedTokens.map((item) => (
                    <option key={item.tokenId} value={item.tokenId}>
                      Meter #{item.tokenId}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium">
                  No Meters Found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {deviceStats ? (
        <div className="container mx-auto px-6 py-10 space-y-8">
          {/* 1. KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
              title="Current Power"
              value={`${
                timeRange === "1H"
                  ? liveData.power.toFixed(2)
                  : deviceStats.basePower.toFixed(2)
              } kW`}
              change={timeRange === "1H" ? "+1.2%" : "--"}
              icon={<Zap className="w-5 h-5 text-indigo-600" />}
              trend="up"
            />
            <KpiCard
              title="Daily Usage"
              value={`${liveData.usage.toFixed(1)} kWh`}
              change="+0.8%"
              icon={<Activity className="w-5 h-5 text-emerald-600" />}
              trend="down"
            />
            <KpiCard
              title="Voltage"
              value={`${liveData.voltage.toFixed(1)} V`}
              change="Stable"
              icon={<Battery className="w-5 h-5 text-orange-600" />}
              trend={deviceStats.isUnstable ? "down" : "neutral"}
            />
            <KpiCard
              title="Grid Frequency"
              value={`${liveData.frequency.toFixed(2)} Hz`}
              change="Optimal"
              icon={<Server className="w-5 h-5 text-blue-600" />}
              trend="neutral"
            />
          </div>

          {/* 2. 主图表区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Power Consumption Load
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    Device ID: #{selectedTokenId} • Stream:{" "}
                    {timeRange === "1H" ? "Live" : "Historical"}
                  </p>
                </div>

                {/* ✨ 新增: 时间维度切换按钮 */}
                <div className="flex items-center gap-4">
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    {(["1H", "24H", "7D"] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                          timeRange === range
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                  {/* Active Load 标签只在 1H 显示 */}
                  {timeRange === "1H" && (
                    <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-gray-100">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                      Active Load (kW)
                    </div>
                  )}
                </div>
              </div>
              <div className="h-[350px] w-full">
                {/* 加上 timeRange key 以便切换时重绘动画 */}
                <Line
                  key={`${selectedTokenId}-${timeRange}`}
                  options={chartOptions}
                  data={chartData}
                />
              </div>
            </div>

            {/* 3. 设备状态面板 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 mb-6">
                Device Status
              </h3>

              <div className="space-y-6 flex-1">
                <StatusRow
                  icon={<Wifi className="w-4 h-4" />}
                  label="Connectivity"
                  value={deviceStats.isUnstable ? "Weak (3G)" : "Online (5G)"}
                  status={deviceStats.isUnstable ? "warning" : "good"}
                />
                <StatusRow
                  icon={<Cpu className="w-4 h-4" />}
                  label="CPU Load"
                  value={`${deviceStats.cpuLoad}%`}
                  status="good"
                />
                <StatusRow
                  icon={<Thermometer className="w-4 h-4" />}
                  label="Core Temp"
                  value={`${deviceStats.temp}°C`}
                  status={deviceStats.temp > 55 ? "warning" : "good"}
                />
                {/* ✨ 优化: 真实的 Last Sync 动画 */}
                <StatusRow
                  icon={<Clock className="w-4 h-4" />}
                  label="Last Sync"
                  value={
                    timeRange === "1H"
                      ? secondsAgo === 0
                        ? "Just now"
                        : `${secondsAgo}s ago`
                      : "Archived"
                  }
                  status="neutral"
                />
                <StatusRow
                  icon={<Server className="w-4 h-4" />}
                  label="Firmware"
                  value={deviceStats.firmware}
                  status="neutral"
                />
              </div>

              {/* ✨ 新增: Manage Asset 操作区域 */}
              <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                <div
                  className={`p-4 rounded-lg border flex items-start gap-3 ${
                    deviceStats.isUnstable
                      ? "bg-orange-50 border-orange-100"
                      : "bg-indigo-50 border-indigo-100"
                  }`}
                >
                  <Activity
                    className={`w-5 h-5 mt-0.5 ${
                      deviceStats.isUnstable
                        ? "text-orange-600"
                        : "text-indigo-600"
                    }`}
                  />
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        deviceStats.isUnstable
                          ? "text-orange-900"
                          : "text-indigo-900"
                      }`}
                    >
                      {deviceStats.isUnstable
                        ? "Maintenance Required"
                        : "Efficiency Insight"}
                    </h4>
                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        deviceStats.isUnstable
                          ? "text-orange-700"
                          : "text-indigo-700"
                      }`}
                    >
                      Meter #{selectedTokenId} is operating at{" "}
                      {deviceStats.efficiency}% efficiency.
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2 h-10 shadow-md shadow-slate-200"
                  onClick={() => router.push(`/assets`)}
                >
                  <Settings className="w-4 h-4" />
                  Manage Meter #{selectedTokenId}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-6 py-20 text-center">
          {isLoading ? (
            <p className="text-gray-500">Syncing with blockchain...</p>
          ) : (
            <p className="text-gray-500">No assets found to monitor.</p>
          )}
        </div>
      )}
    </div>
  );
}

// --- 子组件 (样式保持不变) ---
function KpiCard({ title, value, change, icon, trend }: any) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
          {icon}
        </div>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${
            trend === "up"
              ? "bg-emerald-50 text-emerald-600"
              : trend === "down"
              ? "bg-slate-100 text-slate-600"
              : "bg-orange-50 text-orange-600"
          }`}
        >
          {change}
        </span>
      </div>
      <div>
        <h4 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
          {title}
        </h4>
        <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
          {value}
        </span>
      </div>
    </div>
  );
}

function StatusRow({ icon, label, value, status }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3 text-gray-500">
        <div className="text-slate-400 group-hover:text-indigo-500 transition-colors">
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-slate-900 tabular-nums">
          {value}
        </span>
        {status === "good" && (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        )}
        {status === "warning" && (
          <AlertCircle className="w-4 h-4 text-orange-400" />
        )}
      </div>
    </div>
  );
}
