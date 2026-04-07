"use client";

import { useEffect, useState } from "react";
import Board from "@/components/Board";
import EggDisplay from "@/components/EggDisplay";
import XPBar from "@/components/XPBar";
import Sidebar from "@/components/Sidebar";
import DebugPanel from "@/components/DebugPanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Board as BoardType, UserProgress } from "@/types";
import { Trophy, Sparkles } from "lucide-react";

export default function Home() {
  const [boards, setBoards] = useLocalStorage<BoardType[]>("boards", []);
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>("userProgress", {
    totalXP: 0,
    currentXP: 0,
    level: 1,
    eggProgress: 0,
    eggStage: 0,
    creatureName: "",
    tasksCompleted: 0,
  });
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (boards.length === 0) {
      const defaultBoard: BoardType = {
        id: crypto.randomUUID(),
        title: "My First Board",
        lists: [
          {
            id: crypto.randomUUID(),
            title: "To Do",
            cards: [],
          },
          {
            id: crypto.randomUUID(),
            title: "In Progress",
            cards: [],
          },
          {
            id: crypto.randomUUID(),
            title: "Done",
            cards: [],
          },
        ],
      };
      setBoards([defaultBoard]);
      setActiveBoardId(defaultBoard.id);
    } else if (!activeBoardId) {
      setActiveBoardId(boards[0].id);
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const activeBoard = boards.find((b) => b.id === activeBoardId);

  return (
    <div className="flex h-screen overflow-hidden">
      <DebugPanel />
      <Sidebar
        boards={boards}
        setBoards={setBoards}
        activeBoardId={activeBoardId}
        setActiveBoardId={setActiveBoardId}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-cyan-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">TaskQuest</h1>
                <p className="text-sm text-slate-400">Complete tasks, hatch creatures!</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-slate-800/60 px-4 py-2 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <div className="text-sm">
                  <div className="text-slate-400">Level</div>
                  <div className="text-white font-bold">{userProgress.level}</div>
                </div>
              </div>
              <XPBar userProgress={userProgress} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            {activeBoard ? (
              <Board
                board={activeBoard}
                setBoards={setBoards}
                userProgress={userProgress}
                setUserProgress={setUserProgress}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                No board selected
              </div>
            )}
          </div>
          
          <div className="w-80 border-l border-slate-700 bg-slate-900/30 p-6">
            <EggDisplay
              userProgress={userProgress}
              setUserProgress={setUserProgress}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
