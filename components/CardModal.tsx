"use client";

import { Card, Board, Label, Checklist, ChecklistItem, Comment, RecurrenceType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  X,
  Calendar,
  Tag,
  AlignLeft,
  CheckSquare,
  MessageSquare,
  Plus,
  Trash2,
  Circle,
  CheckCircle2,
  Repeat,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

interface CardModalProps {
  card: Card;
  listId: string;
  boardId: string;
  setBoards: (boards: Board[] | ((prev: Board[]) => Board[])) => void;
  onClose: () => void;
  onComplete?: (cardId: string) => void;
  onDelete?: (cardId: string) => void;
}

export default function CardModal({
  card,
  listId,
  boardId,
  setBoards,
  onClose,
  onComplete,
  onDelete,
}: CardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newLabelText, setNewLabelText] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#3b82f6");
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [dueDate, setDueDate] = useState(card.dueDate || "");
  const [recurrence, setRecurrence] = useState<RecurrenceType>(card.recurrence || "none");
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [newComment, setNewComment] = useState("");

  const updateCard = (updates: Partial<Card>) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.id === listId
                  ? {
                      ...list,
                      cards: list.cards.map((c) =>
                        c.id === card.id ? { ...c, ...updates } : c
                      ),
                    }
                  : list
              ),
            }
          : board
      )
    );
  };

  const handleAddLabel = () => {
    if (newLabelText.trim()) {
      const newLabel: Label = {
        id: crypto.randomUUID(),
        text: newLabelText,
        color: newLabelColor,
      };
      updateCard({ labels: [...(card.labels || []), newLabel] });
      setNewLabelText("");
      setIsAddingLabel(false);
    }
  };

  const handleRemoveLabel = (labelId: string) => {
    updateCard({ labels: card.labels?.filter((l) => l.id !== labelId) });
  };

  const handleAddChecklist = () => {
    if (newChecklistTitle.trim()) {
      const newChecklist: Checklist = {
        id: crypto.randomUUID(),
        title: newChecklistTitle,
        items: [],
      };
      updateCard({ checklists: [...(card.checklists || []), newChecklist] });
      setNewChecklistTitle("");
      setIsAddingChecklist(false);
    }
  };

  const handleAddChecklistItem = (checklistId: string, itemText: string) => {
    if (itemText.trim()) {
      const newItem: ChecklistItem = {
        id: crypto.randomUUID(),
        text: itemText,
        completed: false,
      };
      updateCard({
        checklists: card.checklists?.map((checklist) =>
          checklist.id === checklistId
            ? { ...checklist, items: [...checklist.items, newItem] }
            : checklist
        ),
      });
    }
  };

  const handleToggleChecklistItem = (checklistId: string, itemId: string) => {
    updateCard({
      checklists: card.checklists?.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              items: checklist.items.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            }
          : checklist
      ),
    });
  };

  const handleDeleteChecklist = (checklistId: string) => {
    updateCard({
      checklists: card.checklists?.filter((c) => c.id !== checklistId),
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: crypto.randomUUID(),
        text: newComment,
        createdAt: new Date().toISOString(),
      };
      updateCard({ comments: [...(card.comments || []), comment] });
      setNewComment("");
    }
  };

  const handleDeleteCard = () => {
    if (confirm("Delete this card?")) {
      onDelete?.(card.id);
      onClose();
    }
  };

  const labelColors = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
    "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
    "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
    "#ec4899", "#f43f5e",
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-start justify-between">
          <div className="flex-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => updateCard({ title })}
              className="text-xl font-semibold bg-transparent border-none px-0 focus:ring-0 text-white"
            />
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-3">
            <Button
              size="sm"
              variant={card.completed ? "secondary" : "default"}
              onClick={() => onComplete?.(card.id)}
            >
              {card.completed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 mr-2" />
                  Mark Complete
                </>
              )}
            </Button>
            <Button size="sm" variant="destructive" onClick={handleDeleteCard}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>

          {/* Labels */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Labels
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {card.labels?.map((label) => (
                <span
                  key={label.id}
                  className="px-3 py-1 rounded-full text-sm flex items-center gap-2 text-white"
                  style={{ backgroundColor: label.color }}
                >
                  {label.text}
                  <button
                    onClick={() => handleRemoveLabel(label.id)}
                    className="hover:text-red-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            {isAddingLabel ? (
              <div className="space-y-2 bg-slate-700 p-3 rounded-lg">
                <Input
                  value={newLabelText}
                  onChange={(e) => setNewLabelText(e.target.value)}
                  placeholder="Label text..."
                  className="bg-slate-600 border-slate-500"
                />
                <div className="flex gap-2 flex-wrap">
                  {labelColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewLabelColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newLabelColor === color ? "border-white" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddLabel}>
                    Add
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAddingLabel(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsAddingLabel(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Label
              </Button>
            )}
          </div>

          {/* Due Date */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Due Date
            </h3>
            <Input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                updateCard({ dueDate: e.target.value });
              }}
              className="bg-slate-700 border-slate-600 max-w-xs"
            />
          </div>

          {/* Recurrence */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Repeat className="w-4 h-4" />
              Recurrence
            </h3>
            <select
              value={recurrence}
              onChange={(e) => {
                const newRecurrence = e.target.value as RecurrenceType;
                setRecurrence(newRecurrence);
                updateCard({ recurrence: newRecurrence });
              }}
              className="bg-slate-700 border-slate-600 rounded-lg px-3 py-2 text-white max-w-xs"
            >
              <option value="none">Does not repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            {recurrence !== "none" && (
              <p className="text-sm text-slate-400 mt-2">
                This task will automatically recreate when completed
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <AlignLeft className="w-4 h-4" />
              Description
            </h3>
            {isEditingDescription ? (
              <div className="space-y-2">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a more detailed description..."
                  rows={4}
                  className="bg-slate-700 border-slate-600"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      updateCard({ description });
                      setIsEditingDescription(false);
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setDescription(card.description || "");
                      setIsEditingDescription(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingDescription(true)}
                className="bg-slate-700 rounded-lg p-3 min-h-[80px] cursor-pointer hover:bg-slate-600 text-slate-300"
              >
                {description || "Add a more detailed description..."}
              </div>
            )}
          </div>

          {/* Checklists */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              Checklists
            </h3>
            <div className="space-y-4 mb-3">
              {card.checklists?.map((checklist) => (
                <ChecklistComponent
                  key={checklist.id}
                  checklist={checklist}
                  onToggleItem={(itemId) => handleToggleChecklistItem(checklist.id, itemId)}
                  onAddItem={(text) => handleAddChecklistItem(checklist.id, text)}
                  onDelete={() => handleDeleteChecklist(checklist.id)}
                />
              ))}
            </div>
            {isAddingChecklist ? (
              <div className="space-y-2 bg-slate-700 p-3 rounded-lg">
                <Input
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                  placeholder="Checklist title..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddChecklist();
                    if (e.key === "Escape") setIsAddingChecklist(false);
                  }}
                  autoFocus
                  className="bg-slate-600 border-slate-500"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddChecklist}>
                    Add
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAddingChecklist(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsAddingChecklist(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Checklist
              </Button>
            )}
          </div>

          {/* Comments */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comments
            </h3>
            <div className="space-y-3 mb-3">
              {card.comments?.map((comment) => (
                <div key={comment.id} className="bg-slate-700 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">
                    {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                  <div className="text-sm text-white">{comment.text}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={2}
                className="bg-slate-700 border-slate-600"
              />
              <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                Add Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistComponent({
  checklist,
  onToggleItem,
  onAddItem,
  onDelete,
}: {
  checklist: Checklist;
  onToggleItem: (itemId: string) => void;
  onAddItem: (text: string) => void;
  onDelete: () => void;
}) {
  const [newItemText, setNewItemText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const completedCount = checklist.items.filter((item) => item.completed).length;
  const totalCount = checklist.items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAdd = () => {
    if (newItemText.trim()) {
      onAddItem(newItemText);
      setNewItemText("");
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-white">{checklist.title}</h4>
        <button onClick={onDelete} className="text-slate-400 hover:text-red-400">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {totalCount > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>{Math.round(progress)}%</span>
            <span>
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2 mb-3">
        {checklist.items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <button onClick={() => onToggleItem(item.id)} className="flex-shrink-0">
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <Circle className="w-5 h-5 text-slate-400 hover:text-slate-300" />
              )}
            </button>
            <span
              className={`text-sm flex-1 ${
                item.completed ? "line-through text-slate-400" : "text-white"
              }`}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="space-y-2">
          <Input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add an item..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") {
                setIsAdding(false);
                setNewItemText("");
              }
            }}
            autoFocus
            className="bg-slate-600 border-slate-500 text-sm"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd}>
              Add
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setNewItemText("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button size="sm" variant="ghost" onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      )}
    </div>
  );
}
