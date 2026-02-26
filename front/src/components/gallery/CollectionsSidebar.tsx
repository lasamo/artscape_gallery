import React, { useState } from "react";
import { Collection } from "@/types/gallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderOpen, Plus, Trash2 } from "lucide-react";

interface CollectionsSidebarProps {
  collections: Collection[];
  selectedCollection: string | null;
  onSelect: (id: string | null) => void;
  onAdd: (name: string, description?: string) => void;
  onDelete: (id: string) => void;
  paintingCounts: Record<string, number>;
}

export const CollectionsSidebar: React.FC<CollectionsSidebarProps> = ({
  collections, selectedCollection, onSelect, onAdd, onDelete, paintingCounts,
}) => {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const handleAdd = () => {
    if (newName.trim()) {
      onAdd(newName.trim());
      setNewName("");
      setAdding(false);
    }
  };

  return (
    <aside className="w-60 shrink-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Collections
        </h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setAdding(!adding)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {adding && (
        <div className="mb-3 flex gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name..."
            className="h-8 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            autoFocus
          />
          <Button size="sm" className="h-8" onClick={handleAdd}>Add</Button>
        </div>
      )}

      <div className="space-y-1">
        <button
          onClick={() => onSelect(null)}
          className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
            selectedCollection === null
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <FolderOpen className="h-4 w-4" />
          All Paintings
        </button>

        {collections.map((c) => (
          <div key={c.id} className="group flex items-center">
            <button
              onClick={() => onSelect(c.id)}
              className={`flex flex-1 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                selectedCollection === c.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <FolderOpen className="h-4 w-4" />
              <span className="flex-1 text-left truncate">{c.name}</span>
              <span className="text-xs opacity-60">{paintingCounts[c.id] || 0}</span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDelete(c.id)}
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </aside>
  );
};
