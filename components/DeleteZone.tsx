"use client";

import { useDroppable } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";

interface DeleteZoneProps {
  isVisible: boolean;
}

export default function DeleteZone({ isVisible }: DeleteZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "delete-zone",
  });

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-center pb-8 pointer-events-none z-50">
      <div
        ref={setNodeRef}
        className={`pointer-events-auto transition-all duration-300 ${
          isOver
            ? "scale-110 bg-red-500/90 shadow-2xl shadow-red-500/50"
            : "bg-red-600/80 backdrop-blur-sm"
        } rounded-2xl p-8 border-4 border-red-400 flex flex-col items-center justify-center gap-3 min-w-[280px] animate-pulse`}
      >
        <Trash2
          className={`transition-all duration-300 ${
            isOver ? "w-16 h-16 text-white" : "w-12 h-12 text-red-100"
          }`}
        />
        <p
          className={`font-bold transition-all duration-300 ${
            isOver ? "text-2xl text-white" : "text-xl text-red-100"
          }`}
        >
          {isOver ? "Release to Delete" : "Drop Here to Delete"}
        </p>
        {isOver && (
          <div className="absolute inset-0 rounded-2xl border-4 border-white animate-ping opacity-50" />
        )}
      </div>
    </div>
  );
}
