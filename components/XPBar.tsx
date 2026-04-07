"use client";

import { UserProgress } from "@/types";
import { Zap } from "lucide-react";

interface XPBarProps {
  userProgress: UserProgress;
}

export default function XPBar({ userProgress }: XPBarProps) {
  const xpForNextLevel = userProgress.level * 100;
  const xpProgress = (userProgress.currentXP / xpForNextLevel) * 100;

  return (
    <div className="flex items-center gap-3 bg-slate-800/60 px-4 py-2 rounded-lg min-w-[200px]">
      <Zap className="w-5 h-5 text-yellow-400" />
      <div className="flex-1">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>XP</span>
          <span>
            {userProgress.currentXP} / {xpForNextLevel}
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
