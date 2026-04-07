"use client";

import { Board } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, LayoutDashboard, Trash2 } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  boards: Board[];
  setBoards: (boards: Board[] | ((prev: Board[]) => Board[])) => void;
  activeBoardId: string | null;
  setActiveBoardId: (id: string) => void;
}

export default function Sidebar({
  boards,
  setBoards,
  activeBoardId,
  setActiveBoardId,
}: SidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  const handleCreateBoard = () => {
    if (newBoardTitle.trim()) {
      const newBoard: Board = {
        id: crypto.randomUUID(),
        title: newBoardTitle,
        lists: [],
      };
      setBoards((prev) => [...prev, newBoard]);
      setActiveBoardId(newBoard.id);
      setNewBoardTitle("");
      setIsCreating(false);
    }
  };

  const handleDeleteBoard = (boardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this board?")) {
      setBoards((prev) => prev.filter((b) => b.id !== boardId));
      if (activeBoardId === boardId && boards.length > 1) {
        const nextBoard = boards.find((b) => b.id !== boardId);
        if (nextBoard) setActiveBoardId(nextBoard.id);
      }
    }
  };

  return (
    <aside className="w-64 bg-slate-900/95 backdrop-blur-sm border-r border-slate-700 flex flex-col relative z-40">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5" />
          Boards
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {boards.map((board) => (
          <button
            key={board.id}
            onClick={() => setActiveBoardId(board.id)}
            className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center justify-between group transition-colors ${
              activeBoardId === board.id
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span className="truncate">{board.title}</span>
            {boards.length > 1 && (
              <Trash2
                className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                onClick={(e) => handleDeleteBoard(board.id, e)}
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-700">
        {isCreating ? (
          <div className="space-y-2">
            <Input
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              placeholder="Board name..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateBoard();
                if (e.key === "Escape") {
                  setIsCreating(false);
                  setNewBoardTitle("");
                }
              }}
              autoFocus
              className="bg-slate-800 border-slate-600"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCreateBoard}>
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsCreating(false);
                  setNewBoardTitle("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsCreating(true)}
            className="w-full justify-start"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Board
          </Button>
        )}
      </div>
    </aside>
  );
}
