import { io } from "socket.io-client";

let socketinstance = null;

export function initializeSocket(project_id) {
  if (socketinstance && socketinstance.connected) return socketinstance; // ✅ Only reuse if connected

  console.log("🔄 Initializing WebSocket...");

  socketinstance = io(import.meta.env.VITE_API_URL, {
    auth: { token: localStorage.getItem("token") },
    query: { project_id },
    reconnection: true, // ✅ Enable automatic reconnection
    reconnectionAttempts: 5, // Retry 5 times before failing
    reconnectionDelay: 2000, // Wait 2 seconds between retries
  });

  socketinstance.on("connect", () => {
    console.log("✅ Connected to WebSocket");
  });

  socketinstance.on("disconnect", () => {
    console.warn("⚠️ Disconnected from WebSocket");
  });

  return socketinstance;
}

export const sendMessage = (eventName, data) => {
  if (!socketinstance) {
    console.error("Socket not initialized");
    return;
  }
  socketinstance.emit(eventName, data);
};

export const receiveMessage = (eventName, cb) => {
  if (!socketinstance) {
    console.error("Socket not initialized");
    return;
  }
  socketinstance.off(eventName); // Remove old listener to prevent duplicates
  socketinstance.on(eventName, cb);
};

export const disconnectSocket = () => {
  if (socketinstance) {
    socketinstance.disconnect();
    socketinstance = null;
  }
};
