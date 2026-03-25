"use client";

import { useEffect, useState } from "react";

interface UrgencyCountdownProps {
  hours?: number;
}

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export function UrgencyCountdown({ hours = 24 }: UrgencyCountdownProps) {
  const [remainingMs, setRemainingMs] = useState(hours * 60 * 60 * 1000);

  useEffect(() => {
    const initialEnd = Date.now() + hours * 60 * 60 * 1000;

    const tick = () => {
      setRemainingMs(Math.max(0, initialEnd - Date.now()));
    };

    tick();
    const timer = setInterval(tick, 1000);

    return () => clearInterval(timer);
  }, [hours]);

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase text-rose-700">à¦¸à§€à¦®à¦¿à¦¤ à¦¸à¦®à§Ÿà§‡à¦° à¦…à¦«à¦¾à¦°</p>
      <p className="mt-2 text-3xl font-black text-rose-800">{formatTime(remainingMs)}</p>
      <p className="mt-2 text-sm text-rose-700">à¦Ÿà¦¾à¦‡à¦®à¦¾à¦° à¦¶à§‡à¦· à¦¹à¦²à§‡ à¦®à§‚à¦²à§à¦¯ à¦†à¦—à§‡à¦° à¦…à¦¬à¦¸à§à¦¥à¦¾à§Ÿ à¦«à¦¿à¦°à§‡ à¦¯à¦¾à¦¬à§‡à¥¤</p>
    </div>
  );
}

