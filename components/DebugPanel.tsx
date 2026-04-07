"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [storageData, setStorageData] = useState<{ [key: string]: any }>({});

  const refreshStorage = () => {
    if (typeof window !== "undefined") {
      const data: { [key: string]: any } = {};
      const keys = ["boards", "userProgress"];
      
      keys.forEach((key) => {
        const item = window.localStorage.getItem(key);
        if (item) {
          try {
            data[key] = JSON.parse(item);
          } catch (e) {
            data[key] = item;
          }
        }
      });
      
      setStorageData(data);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshStorage();
      const interval = setInterval(refreshStorage, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const clearStorage = () => {
    if (confirm("Clear all localStorage data? This will reset your progress.")) {
      window.localStorage.clear();
      refreshStorage();
      window.location.reload();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-slate-800 text-white px-3 py-2 rounded-lg text-xs hover:bg-slate-700 z-50 shadow-lg"
      >
        🐛 Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg p-4 max-w-md max-h-96 overflow-auto z-50 shadow-2xl">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-bold">Debug Panel</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <div className="text-slate-400 mb-1">localStorage Contents:</div>
          <pre className="bg-slate-900 text-green-400 p-2 rounded overflow-auto max-h-48">
            {JSON.stringify(storageData, null, 2)}
          </pre>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={refreshStorage} variant="outline">
            Refresh
          </Button>
          <Button size="sm" onClick={clearStorage} variant="destructive">
            Clear Storage
          </Button>
        </div>
      </div>
    </div>
  );
}
