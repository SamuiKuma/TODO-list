"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

interface XPNotificationProps {
  amount: number;
  onComplete: () => void;
}

export default function XPNotification({ amount, onComplete }: XPNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed top-24 right-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 transition-all duration-300 z-50 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <Zap className="w-6 h-6 text-yellow-300 animate-pulse" />
      <div>
        <div className="text-sm font-semibold">XP Earned!</div>
        <div className="text-xl font-bold">+{amount} XP</div>
      </div>
    </div>
  );
}
