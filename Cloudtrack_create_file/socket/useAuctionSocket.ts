"use client";

import {
  connectSocket,
  disconnectSocket,
  joinAuction,
  leaveAuction,
  placeBid,
  onNewBid,
  onAuctionUpdate,
} from "@/utils/services/socketService";
import { useEffect, useState } from "react";

interface TopBid {
  bidderName?: string;
  bidPricePerTon: number;
  rank?: number;
}

export const useAuctionSocket = () => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [topBids, setTopBids] = useState<TopBid[]>([]);

  const log = (msg: string) => {
    setMessages((prev) => [...prev, msg]);
  };

  useEffect(() => {
    connectSocket();
    setConnected(true);
    log(" Socket Connected");

    onNewBid((res) => {
      log(` New Bid: ₹${res.data?.bidPrice}`);
      if (res.data?.topBids) setTopBids(res.data.topBids);
    });

    onAuctionUpdate((data) => {
      log(` Auction Update: ${JSON.stringify(data)}`);
    });

    return () => {
      disconnectSocket();
      setConnected(false);
    };
  }, []);

  return {
    connected,
    messages,
    topBids,
    joinAuction,
    leaveAuction,
    placeBid,
  };
};
