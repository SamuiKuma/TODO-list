"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card as CardType, Board } from "@/types";
import { CheckCircle2, Circle, Calendar, AlignLeft, CheckSquare, MessageSquare, Tag, GripVertical, Repeat } from "lucide-react";
import { format, isPast } from "date-fns";
import { useState } from "react";
import CardModal from "./CardModal";

interface CardItemProps {
  card: CardType;
  listId: string;
  boardId: string;
  setBoards: (boards: Board[] | ((prev: Board[]) => Board[])) => void;
  onComplete?: (cardId: string) => void;
  onDelete?: (cardId: string) => void;
  isDragging?: boolean;
}

export default function CardItem({
  card,
  listId,
  boardId,
  setBoards,
  onComplete,
  onDelete,
  isDragging = false,
}: CardItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const totalChecklistItems = card.checklists?.reduce(
    (acc, checklist) => acc + checklist.items.length,
    0
  ) || 0;
  const completedChecklistItems = card.checklists?.reduce(
    (acc, checklist) => acc + checklist.items.filter((item) => item.completed).length,
    0
  ) || 0;

  const isDueDatePassed = card.dueDate && isPast(new Date(card.dueDate)) && !card.completed;

  if (isDragging) {
    return (
      <div className="bg-slate-700 rounded-lg p-3 shadow-lg cursor-grabbing">
        <h4 className="text-sm font-medium text-white mb-2">{card.title}</h4>
      </div>
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={`bg-slate-700 rounded-lg p-3 shadow-md hover:bg-slate-600 transition-colors border ${
          card.completed
            ? "border-green-500/50 bg-slate-700/50"
            : "border-transparent"
        }`}
      >
        <div className="flex items-start gap-2 mb-2">
          <button
            {...listeners}
            className="flex-shrink-0 mt-0.5 cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComplete?.(card.id);
            }}
            className="flex-shrink-0 mt-0.5"
          >
            {card.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <Circle className="w-5 h-5 text-slate-400 hover:text-slate-300" />
            )}
          </button>
          <h4
            onClick={() => setIsModalOpen(true)}
            className={`text-sm font-medium flex-1 cursor-pointer ${
              card.completed ? "text-slate-400 line-through" : "text-white"
            }`}
          >
            {card.title}
          </h4>
        </div>

        {/* Labels */}
        {card.labels && card.labels.length > 0 && (
          <div 
            className="flex flex-wrap gap-1 mb-2 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            {card.labels.map((label) => (
              <span
                key={label.id}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: label.color }}
              >
                {label.text}
              </span>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div 
          className="flex flex-wrap gap-2 text-xs text-slate-400 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          {card.description && (
            <div className="flex items-center gap-1">
              <AlignLeft className="w-3 h-3" />
            </div>
          )}
          {card.dueDate && (
            <div
              className={`flex items-center gap-1 ${
                isDueDatePassed ? "text-red-400" : ""
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(card.dueDate), "MMM d")}</span>
            </div>
          )}
          {card.recurrence && card.recurrence !== "none" && (
            <div className="flex items-center gap-1 text-blue-400">
              <Repeat className="w-3 h-3" />
              <span className="capitalize">{card.recurrence}</span>
            </div>
          )}
          {totalChecklistItems > 0 && (
            <div className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3" />
              <span>
                {completedChecklistItems}/{totalChecklistItems}
              </span>
            </div>
          )}
          {card.comments && card.comments.length > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{card.comments.length}</span>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <CardModal
          card={card}
          listId={listId}
          boardId={boardId}
          setBoards={setBoards}
          onClose={() => setIsModalOpen(false)}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
