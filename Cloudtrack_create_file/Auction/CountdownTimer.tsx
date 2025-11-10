"use client";

import { useEffect, useState, useMemo } from "react";

interface CountdownTimerProps {
  auctionTime: string | number;
}

export function CountdownTimer({ auctionTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Calculate end time based on input type (date string or minutes)
  const endTime = useMemo(() => {
    if (typeof auctionTime === 'string') {
      // If it's a date string, parse it directly
      return new Date(auctionTime).getTime();
    } else if (typeof auctionTime === 'number') {
      // If it's a number, treat it as minutes from now
      return Date.now() + (auctionTime * 60 * 1000);
    }
    return 0;
  }, [auctionTime]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      let diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      // Convert to hours, minutes, seconds
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff %= 1000 * 60 * 60;
      const minutes = Math.floor(diff / (1000 * 60));
      diff %= 1000 * 60;
      const seconds = Math.floor(diff / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const pad = (n: number) => String(n).padStart(2, "0");
  const { hours, minutes, seconds } = timeLeft;

  // Don't render anything if time is invalid
  if (endTime <= 0) return null;

  return (
    <div className="grid grid-flow-col gap-2 text-center auto-cols-max px-4 py-2 rounded-xl border border-[#CFF5EB]">
      <TimeUnit value={pad(hours)} label="hrs" />
      <Separator />
      <TimeUnit value={pad(minutes)} label="min" />
      <Separator />
      <TimeUnit value={pad(seconds)} label="sec" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-mono text-xl font-semibold">{value}</span>
      <span className="text-xs text-[#4B4B4B]">{label}</span>
    </div>
  );
}

function Separator() {
  return (
    <span className="font-mono text-2xl font-semibold flex items-center">
      :
    </span>
  );
}
