"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { Board as BoardType, Card, List as ListType, UserProgress, XP_VALUES, EGG_STAGES } from "@/types";
import ListComponent from "./List";
import CardItem from "./Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import XPNotification from "./XPNotification";
import DeleteZone from "./DeleteZone";

interface BoardProps {
  board: BoardType;
  setBoards: (boards: BoardType[] | ((prev: BoardType[]) => BoardType[])) => void;
  userProgress: UserProgress;
  setUserProgress: (progress: UserProgress | ((prev: UserProgress) => UserProgress)) => void;
}

export default function Board({ board, setBoards, userProgress, setUserProgress }: BoardProps) {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [xpNotifications, setXpNotifications] = useState<Array<{ id: string; amount: number }>>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = board.lists
      .flatMap((list) => list.cards)
      .find((card) => card.id === active.id);
    setActiveCard(card || null);
    setIsDragging(true);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setBoards((prevBoards) =>
      prevBoards.map((b) => {
        if (b.id !== board.id) return b;

        const activeList = b.lists.find((list) =>
          list.cards.some((card) => card.id === activeId)
        );
        const overList = b.lists.find(
          (list) =>
            list.id === overId || list.cards.some((card) => card.id === overId)
        );

        if (!activeList || !overList) return b;

        const activeCard = activeList.cards.find((card) => card.id === activeId);
        if (!activeCard) return b;

        if (activeList.id === overList.id) {
          const oldIndex = activeList.cards.findIndex(
            (card) => card.id === activeId
          );
          const newIndex = overList.cards.findIndex(
            (card) => card.id === overId
          );

          return {
            ...b,
            lists: b.lists.map((list) =>
              list.id === activeList.id
                ? {
                    ...list,
                    cards: arrayMove(list.cards, oldIndex, newIndex),
                  }
                : list
            ),
          };
        } else {
          return {
            ...b,
            lists: b.lists.map((list) => {
              if (list.id === activeList.id) {
                return {
                  ...list,
                  cards: list.cards.filter((card) => card.id !== activeId),
                };
              }
              if (list.id === overList.id) {
                const newIndex = list.cards.findIndex(
                  (card) => card.id === overId
                );
                const newCards = [...list.cards];
                newCards.splice(
                  newIndex >= 0 ? newIndex : list.cards.length,
                  0,
                  activeCard
                );
                return { ...list, cards: newCards };
              }
              return list;
            }),
          };
        }
      })
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Check if dropped on delete zone
    if (over && over.id === "delete-zone") {
      const cardId = active.id as string;
      
      // Remove the card from all lists
      setBoards((prevBoards) =>
        prevBoards.map((b) => {
          if (b.id !== board.id) return b;
          
          return {
            ...b,
            lists: b.lists.map((list) => ({
              ...list,
              cards: list.cards.filter((card) => card.id !== cardId),
            })),
          };
        })
      );
      
      console.log(`Card ${cardId} deleted via drag-to-delete`);
    }
    
    setActiveCard(null);
    setIsDragging(false);
  };

  const handleAddList = () => {
    if (newListTitle.trim()) {
      const newList: ListType = {
        id: crypto.randomUUID(),
        title: newListTitle,
        cards: [],
      };
      setBoards((prev) =>
        prev.map((b) =>
          b.id === board.id ? { ...b, lists: [...b.lists, newList] } : b
        )
      );
      setNewListTitle("");
      setIsAddingList(false);
    }
  };

  const awardXP = (amount: number) => {
    console.log(`Awarding ${amount} XP`);
    
    // Add visual notification
    const notificationId = crypto.randomUUID();
    setXpNotifications((prev) => [...prev, { id: notificationId, amount }]);
    
    setUserProgress((prev) => {
      const newTotalXP = prev.totalXP + amount;
      const newEggProgress = prev.eggProgress + amount;

      // Check for egg evolution
      let newEggStage = prev.eggStage;
      const nextStage = EGG_STAGES[prev.eggStage + 1];
      if (nextStage && newEggProgress >= nextStage.xpRequired) {
        newEggStage = prev.eggStage + 1;
        console.log(`🎉 Egg evolved to stage ${newEggStage}: ${EGG_STAGES[newEggStage].name} ${EGG_STAGES[newEggStage].emoji}`);
      }

      const updated = {
        ...prev,
        totalXP: newTotalXP,
        eggProgress: newEggProgress,
        eggStage: newEggStage,
      };
      
      console.log('Updated user progress:', updated);
      return updated;
    });
  };

  return (
    <div className="h-full p-6">
      {/* XP Notifications */}
      {xpNotifications.map((notification) => (
        <XPNotification
          key={notification.id}
          amount={notification.amount}
          onComplete={() => {
            setXpNotifications((prev) => prev.filter((n) => n.id !== notification.id));
          }}
        />
      ))}

      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white">{board.title}</h2>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 h-[calc(100vh-200px)] overflow-x-auto pb-4">
          {board.lists.map((list) => (
            <ListComponent
              key={list.id}
              list={list}
              boardId={board.id}
              setBoards={setBoards}
              userProgress={userProgress}
              setUserProgress={setUserProgress}
              awardXP={awardXP}
            />
          ))}

          {/* Add List Button */}
          <div className="flex-shrink-0 w-72">
            {isAddingList ? (
              <div className="bg-slate-800/60 rounded-lg p-3 space-y-2">
                <Input
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="Enter list title..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddList();
                    if (e.key === "Escape") {
                      setIsAddingList(false);
                      setNewListTitle("");
                    }
                  }}
                  autoFocus
                  className="bg-slate-700 border-slate-600"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddList}>
                    Add List
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsAddingList(false);
                      setNewListTitle("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setIsAddingList(true)}
                variant="outline"
                className="w-full h-full min-h-[100px] border-dashed border-2"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add List
              </Button>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="rotate-3 opacity-80">
              <CardItem card={activeCard} listId="" boardId="" setBoards={() => {}} isDragging />
            </div>
          ) : null}
        </DragOverlay>

        <DeleteZone isVisible={isDragging} />
      </DndContext>
    </div>
  );
}
