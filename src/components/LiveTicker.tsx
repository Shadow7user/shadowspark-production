"use client";
import { useEffect, useState } from "react";
import { Activity, MessageSquare, Bot, Clock, Shield } from "lucide-react";
import { io, Socket } from "socket.io-client";

interface Stats {
  messagesProcessed: number;
  activeChatbots: number;
  avgResponseTime: number;
  platformUptime: number;
  leadsGenerated: number;
}

const defaultStats: Stats = {
  messagesProcessed: 847,
  activeChatbots: 24,
  avgResponseTime: 1.2,
  platformUptime: 99.9,
  leadsGenerated: 0,
};

function TickerContent({ stats }: Readonly<{ stats: Stats }>) {
  const tickerItems = [
    {
      icon: MessageSquare,
      value: stats.messagesProcessed,
      text: "messages processed today",
      fixed: false,
    },
    {
      icon: Bot,
      value: stats.activeChatbots,
      text: "active chatbots running",
      fixed: false,
    },
    {
      icon: Clock,
      value: stats.avgResponseTime,
      text: "avg response time",
      unit: "s",
      fixed: true,
    },
    {
      icon: Shield,
      value: stats.platformUptime,
      text: "platform uptime",
      unit: "%",
      fixed: true,
    },
  ];

  return (
    <div className="flex items-center justify-center gap-8 overflow-x-auto text-sm">
      <div className="flex shrink-0 items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-emerald-400 font-medium">Live</span>
      </div>
      {tickerItems.map((item) => (
        <div
          key={item.text}
          className="flex shrink-0 items-center gap-2 text-slate-400"
        >
          <item.icon size={14} className="text-[#d4a843]" />
          <span className="font-semibold text-white tabular-nums">
            {item.fixed ? item.value.toFixed(1) : item.value.toLocaleString()}
            {item.unit ?? ""}
          </span>
          <span className="hidden sm:inline">{item.text}</span>
        </div>
      ))}
      <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1">
        <Activity size={12} className="text-emerald-400" />
        <span className="text-xs font-medium text-emerald-400">
          All Systems Operational
        </span>
      </div>
    </div>
  );
}

function TickerSkeleton() {
  return (
    <div className="flex items-center justify-center gap-8 text-sm">
      <div className="flex h-4 w-20 animate-pulse rounded bg-slate-700/50" />
      <div className="hidden sm:flex gap-8">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-700/50" />
        <div className="h-4 w-28 animate-pulse rounded bg-slate-700/50" />
        <div className="h-4 w-20 animate-pulse rounded bg-slate-700/50" />
        <div className="h-4 w-24 animate-pulse rounded bg-slate-700/50" />
      </div>
    </div>
  );
}

export default function LiveTicker() {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [socketConnected, setSocketConnected] = useState(false);
  const [leads, setLeads] = useState(0);

  // 3G optimization: Delay rendering for slow connections
  // Shows skeleton first, then loads real-time data
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Socket.io connection for real-time stats
  useEffect(() => {
    let socket: Socket | null = null;

    const connectSocket = () => {
      // Connect to the Socket.io server
      const socketUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000";

      socket = io(socketUrl, {
        path: "/api/socketio",
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000, // 10s timeout for slow 3G connections
      });

      socket.on("connect", () => {
        console.log("Socket connected:", socket?.id);
        setSocketConnected(true);
        // Join the stats room
        socket?.emit("join-stats");
      });

      socket.on("stats-update", (newStats: Stats) => {
        console.log("Received stats update:", newStats);
        setStats(newStats);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        setSocketConnected(false);
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setSocketConnected(false);
      });
    };

    // Only connect on client-side
    if (typeof window !== "undefined") {
      connectSocket();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Fallback: If socket fails, use periodic polling
  useEffect(() => {
    if (socketConnected) return;

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
          if (data.leadsGenerated != null) setLeads(data.leadsGenerated);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    // Initial fetch
    fetchStats();

    // Fallback polling every 30 seconds if WebSocket fails
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [socketConnected]);


  return (
    <div className="border-y border-white/5 bg-[#0f1521]/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        {isVisible ? <TickerContent stats={stats} /> : <TickerSkeleton />}
      </div>
      <div className="text-cyan-400 animate-pulse text-lg font-semibold">
        Leads Generated: {leads}
      </div>
    </div>
  );
}
