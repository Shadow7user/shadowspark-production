import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: SocketIOServer | null = null;

export function initializeSocket(httpServer: HTTPServer): SocketIOServer {
  if (io) return io;

  io = new SocketIOServer(httpServer, {
    path: "/api/socketio",
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
    });

    // Join a room for stats updates
    socket.on("join-stats", () => {
      socket.join("stats-room");
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

export function emitStatsUpdate(stats: {
  messagesProcessed: number;
  activeChatbots: number;
  avgResponseTime: number;
  platformUptime: number;
  leadsGenerated: number;
}) {
  if (io) {
    io.to("stats-room").emit("stats-update", stats);
  }
}
