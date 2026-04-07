"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Board, Card, List as ListType, UserProgress, XP_VALUES, RecurrenceType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import CardItem from "./Card";
import { isBefore, addDays, addWeeks, addMonths } from "date-fns";

// Helper function to calculate next due date for recurring tasks
function getNextDueDate(currentDueDate: string | undefined, recurrence: RecurrenceType): string | undefined {
  if (!currentDueDate || recurrence === "none") return currentDueDate;
  
  const currentDate = new Date(currentDueDate);
  
  switch (recurrence) {
    case "daily":
      return addDays(currentDate, 1).toISOString();
    case "weekly":
      return addWeeks(currentDate, 1).toISOString();
    case "monthly":
      return addMonths(currentDate, 1).toISOString();
    default:
      return currentDueDate;
  }
}

interface ListProps {
  list: ListType;
  boardId: string;
  setBoards: (boards: Board[] | ((prev: Board[]) => Board[])) => void;
  userProgress: UserProgress;
  setUserProgress: (progress: UserProgress | ((prev: UserProgress) => UserProgress)) => void;
  awardXP: (amount: number) => void;
}

export default function ListComponent({
  list,
  boardId,
  setBoards,
  userProgress,
  setUserProgress,
  awardXP,
}: ListProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  
  const { setNodeRef } = useDroppable({
    id: list.id,
  });

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      const newCard: Card = {
        id: crypto.randomUUID(),
        title: newCardTitle,
        description: "",
        labels: [],
        checklists: [],
        comments: [],
        completed: false,
        xpValue: XP_VALUES.TASK_COMPLETE,
      };

      setBoards((prev) =>
        prev.map((board) =>
          board.id === boardId
            ? {
                ...board,
                lists: board.lists.map((l) =>
                  l.id === list.id
                    ? { ...l, cards: [...l.cards, newCard] }
                    : l
                ),
              }
            : board
        )
      );

      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };

  const handleDeleteList = () => {
    if (confirm(`Delete "${list.title}" list and all its cards?`)) {
      setBoards((prev) =>
        prev.map((board) =>
          board.id === boardId
            ? {
                ...board,
                lists: board.lists.filter((l) => l.id !== list.id),
              }
            : board
        )
      );
    }
  };

  const handleUpdateTitle = () => {
    if (editedTitle.trim()) {
      setBoards((prev) =>
        prev.map((board) =>
          board.id === boardId
            ? {
                ...board,
                lists: board.lists.map((l) =>
                  l.id === list.id ? { ...l, title: editedTitle } : l
                ),
              }
            : board
        )
      );
      setIsEditingTitle(false);
    }
  };

  const handleCompleteCard = (cardId: string) => {
    let xpToAward = 0;
    let shouldIncrementTasks = false;
    let recurringCard: Card | null = null;
    
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map((l) =>
                l.id === list.id
                  ? {
                      ...l,
                      cards: l.cards.map((card) => {
                        if (card.id === cardId) {
                          const wasCompleted = card.completed;
                          const isCompleting = !wasCompleted;

                          if (isCompleting) {
                            let xpEarned = card.xpValue || XP_VALUES.TASK_COMPLETE;

                            // Bonus for completing before due date
                            if (card.dueDate && isBefore(new Date(), new Date(card.dueDate))) {
                              xpEarned += XP_VALUES.TASK_BEFORE_DUE_DATE;
                            }

                            xpToAward = xpEarned;
                            shouldIncrementTasks = true;

                            // Check if all cards in list are completed for bonus
                            const allCardsInList = l.cards.map((c) =>
                              c.id === cardId ? { ...c, completed: true } : c
                            );
                            const allCompleted = allCardsInList.every((c) => c.completed);
                            if (allCompleted && allCardsInList.length > 1) {
                              xpToAward += XP_VALUES.LIST_COMPLETE;
                              console.log('List completed! Bonus XP awarded');
                            }

                            // If task is recurring, prepare a new instance
                            if (card.recurrence && card.recurrence !== "none") {
                              recurringCard = {
                                ...card,
                                id: crypto.randomUUID(),
                                completed: false,
                                completedAt: undefined,
                                dueDate: getNextDueDate(card.dueDate, card.recurrence),
                                lastRecurredAt: new Date().toISOString(),
                                // Reset checklists
                                checklists: card.checklists?.map((checklist) => ({
                                  ...checklist,
                                  items: checklist.items.map((item) => ({
                                    ...item,
                                    completed: false,
                                  })),
                                })),
                              };
                            }

                            return {
                              ...card,
                              completed: true,
                              completedAt: new Date().toISOString(),
                            };
                          } else {
                            return { ...card, completed: false, completedAt: undefined };
                          }
                        }
                        return card;
                      }),
                    }
                  : l
              ),
            }
          : board
      )
    );
    
    // Award XP and increment tasks after state update
    if (xpToAward > 0) {
      awardXP(xpToAward);
    }
    if (shouldIncrementTasks) {
      setUserProgress((prev) => ({
        ...prev,
        tasksCompleted: prev.tasksCompleted + 1,
      }));
    }

    // Add the recurring task after a short delay to ensure state is updated
    if (recurringCard) {
      setTimeout(() => {
        setBoards((prev) =>
          prev.map((board) =>
            board.id === boardId
              ? {
                  ...board,
                  lists: board.lists.map((l) =>
                    l.id === list.id
                      ? { ...l, cards: [...l.cards, recurringCard!] }
                      : l
                  ),
                }
              : board
          )
        );
      }, 100);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map((l) =>
                l.id === list.id
                  ? {
                      ...l,
                      cards: l.cards.filter((card) => card.id !== cardId),
                    }
                  : l
              ),
            }
          : board
      )
    );
  };

  return (
    <div className="flex-shrink-0 w-72">
      <div className="bg-slate-800/60 rounded-lg p-3 h-full flex flex-col max-h-full">
        {/* List Header */}
        <div className="flex items-center justify-between mb-3">
          {isEditingTitle ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleUpdateTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUpdateTitle();
                if (e.key === "Escape") {
                  setEditedTitle(list.title);
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
              className="h-8 text-sm bg-slate-700 border-slate-600"
            />
          ) : (
            <h3
              className="font-semibold text-white truncate cursor-pointer hover:text-cyan-400"
              onClick={() => setIsEditingTitle(true)}
            >
              {list.title}
            </h3>
          )}
          <button
            onClick={handleDeleteList}
            className="text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Cards */}
        <div 
          ref={setNodeRef}
          className="flex-1 overflow-y-auto scrollbar-thin space-y-2 mb-3 min-h-[100px]"
        >
          <SortableContext 
            items={list.cards.map((card) => card.id)}
            strategy={verticalListSortingStrategy}
          >
            {list.cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                listId={list.id}
                boardId={boardId}
                setBoards={setBoards}
                onComplete={handleCompleteCard}
                onDelete={handleDeleteCard}
              />
            ))}
          </SortableContext>
        </div>

        {/* Add Card */}
        {isAddingCard ? (
          <div className="space-y-2">
            <Input
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Enter card title..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCard();
                if (e.key === "Escape") {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }
              }}
              autoFocus
              className="bg-slate-700 border-slate-600 text-sm"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddCard}>
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsAddingCard(true)}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Card
          </Button>
        )}
      </div>
    </div>
  );
}
