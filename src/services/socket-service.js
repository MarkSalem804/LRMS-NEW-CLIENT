import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
// const SOCKET_URL = import.meta.env.VITE_API_URL || "https://sdoic-ilearn.depedimuscity.com:5005";

let socket = null;

export const initializeSocket = (userData) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);

    // Send user info to server
    if (userData) {
      socket.emit("user-online", {
        userId: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const onOnlineUsersUpdate = (callback) => {
  if (socket) {
    socket.on("online-users-updated", callback);
  }
};

export const offOnlineUsersUpdate = () => {
  if (socket) {
    socket.off("online-users-updated");
  }
};
