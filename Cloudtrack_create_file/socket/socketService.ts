"use client";

import { io, Socket } from "socket.io-client";
import { ENV_CONSTANT, LOCAL_STORAGE_KEYS } from "../constants";

let socket: Socket | null = null;
let isConnected = false;
let currentAuctionId: string | null = null;

export const connectSocket = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  const serverUrl = ENV_CONSTANT.BASE_URL;

  if (!token) {
    console.warn("Token missing — cannot connect socket");
    return;
  }

  if (socket && isConnected) return;

  socket = io(serverUrl, {
    transports: ["websocket"],
    query: { token },
  });

  socket.on("connect", () => {
    isConnected = true;
    console.log(" Socket connected");
  });

  socket.on("disconnect", () => {
    isConnected = false;
    currentAuctionId = null;
    console.log(" Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connect error:", err.message);
  });
};

export const disconnectSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
  isConnected = false;
};

export const joinAuction = (
  auctionId: string,
  callback?: (res: any) => void
) => {
  if (!socket || !isConnected) return;

  socket.emit("join-auction", { auctionId }, (response: any) => {
    if (response?.success) currentAuctionId = auctionId;
    callback?.(response);
  });
};

export const leaveAuction = () => {
  if (!socket || !currentAuctionId) return;
  socket.emit("leave_auction", { auctionId: currentAuctionId });
  currentAuctionId = null;
};

export const placeBid = (bidPrice: number, callback?: (res: any) => void) => {
  if (!socket || !currentAuctionId) return;

  socket.emit(
    "create_bid",
    { auctionId: currentAuctionId, bidPrice },
    callback
  );
};

//  Event Listeners
export const onNewBid = (callback: (data: any) => void) => {
  socket?.on("new_bid", callback);
};

export const onAuctionUpdate = (callback: (data: any) => void) => {
  socket?.on("auction-update", callback);
};
