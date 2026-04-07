"use client";

import { UserProgress, EGG_STAGES } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, RotateCcw } from "lucide-react";
import { useState } from "react";

interface EggDisplayProps {
  userProgress: UserProgress;
  setUserProgress: (progress: UserProgress | ((prev: UserProgress) => UserProgress)) => void;
}

export default function EggDisplay({ userProgress, setUserProgress }: EggDisplayProps) {
  const [isNaming, setIsNaming] = useState(false);
  const [newName, setNewName] = useState("");

  const currentStage = EGG_STAGES[userProgress.eggStage];
  const nextStage = EGG_STAGES[userProgress.eggStage + 1];
  const progress = nextStage
    ? ((userProgress.eggProgress - currentStage.xpRequired) /
        (nextStage.xpRequired - currentStage.xpRequired)) *
      100
    : 100;

  const handleNameCreature = () => {
    if (newName.trim()) {
      setUserProgress((prev) => ({
        ...prev,
        creatureName: newName.trim(),
      }));
      setNewName("");
      setIsNaming(false);
    }
  };

  const handleResetEgg = () => {
    if (confirm("Start a new egg? Your current creature will be remembered!")) {
      setUserProgress((prev) => ({
        ...prev,
        eggProgress: 0,
        eggStage: 0,
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          Your Creature
        </h3>
        <p className="text-sm text-slate-400">Complete tasks to help it grow!</p>
      </div>

      {/* Creature Display */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700">
        <div className="text-center">
          <div className="text-8xl mb-4 animate-bounce" style={{ animationDuration: "2s" }}>
            {currentStage.emoji}
          </div>
          <div className="text-xl font-bold text-white mb-1">
            {userProgress.creatureName || currentStage.name}
          </div>
          <div className="text-sm text-slate-400 mb-4">Stage: {currentStage.name}</div>

          {!userProgress.creatureName && userProgress.eggStage > 0 && (
            <div className="mb-4">
              {isNaming ? (
                <div className="space-y-2">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Name your creature..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleNameCreature();
                      if (e.key === "Escape") setIsNaming(false);
                    }}
                    autoFocus
                    className="bg-slate-700 border-slate-600 text-center"
                  />
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" onClick={handleNameCreature}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsNaming(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsNaming(true)}>
                  Name your creature
                </Button>
              )}
            </div>
          )}

          {/* Progress to next stage */}
          {nextStage && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Growth Progress</span>
                <span>
                  {userProgress.eggProgress - currentStage.xpRequired} /{" "}
                  {nextStage.xpRequired - currentStage.xpRequired}
                </span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Next: {nextStage.emoji} {nextStage.name}
              </p>
            </div>
          )}

          {/* Fully evolved */}
          {!nextStage && userProgress.eggStage === EGG_STAGES.length - 1 && (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-lg p-3">
                <p className="text-sm text-yellow-200">✨ Fully Evolved! ✨</p>
              </div>
              <Button size="sm" variant="outline" onClick={handleResetEgg} className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Start New Egg
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-slate-800/60 rounded-lg p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Total XP</span>
          <span className="text-white font-semibold">{userProgress.totalXP}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Tasks Completed</span>
          <span className="text-white font-semibold">{userProgress.tasksCompleted}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Creature XP</span>
          <span className="text-white font-semibold">{userProgress.eggProgress}</span>
        </div>
      </div>
    </div>
  );
}
