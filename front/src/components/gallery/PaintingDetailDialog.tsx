import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Painting, Collection } from "@/types/gallery";
import { Trash2, Save, StickyNote } from "lucide-react";

interface PaintingDetailDialogProps {
  painting: Painting | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Painting>) => void;
  collections: Collection[];
}

export const PaintingDetailDialog: React.FC<PaintingDetailDialogProps> = ({
  painting, onClose, onDelete, onUpdate, collections,
}) => {
  const [notes, setNotes] = useState("");
  const [editingNotes, setEditingNotes] = useState(false);

  React.useEffect(() => {
    if (painting) {
      setNotes(painting.notes || "");
      setEditingNotes(false);
    }
  }, [painting]);

  if (!painting) return null;

  const saveNotes = () => {
    onUpdate(painting.id, { notes });
    setEditingNotes(false);
  };

  return (
    <Dialog open={!!painting} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="bg-charcoal flex items-center justify-center p-4 min-h-[300px]">
            <img
              src={painting.imageUrl}
              alt={painting.title}
              className="max-h-[500px] w-auto object-contain painting-frame"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col">
            <h2 className="font-display text-2xl font-bold text-foreground">{painting.title}</h2>
            <p className="mt-1 text-base text-muted-foreground">{painting.artist}</p>
            {painting.year && (
              <p className="text-sm text-muted-foreground/70">{painting.year}</p>
            )}

            {painting.description && (
              <p className="mt-4 text-sm text-foreground/80 leading-relaxed">
                {painting.description}
              </p>
            )}

            {/* Collection */}
            <div className="mt-4">
              <Label className="text-xs text-muted-foreground">Collection</Label>
              <Select
                value={painting.collectionId || "none"}
                onValueChange={(v) => onUpdate(painting.id, { collectionId: v === "none" ? undefined : v })}
              >
                <SelectTrigger className="mt-1 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {collections.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="mt-4 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <StickyNote className="h-3.5 w-3.5 text-primary" />
                <Label className="text-xs text-muted-foreground">Personal Notes</Label>
              </div>
              {editingNotes ? (
                <div className="space-y-2">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="text-sm"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveNotes} className="gap-1">
                      <Save className="h-3 w-3" /> Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setNotes(painting.notes || ""); setEditingNotes(false); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setEditingNotes(true)}
                  className="w-full rounded-md border border-dashed border-border p-3 text-left text-sm text-muted-foreground hover:border-primary/40 transition-colors min-h-[60px]"
                >
                  {painting.notes || "Click to add notes..."}
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-border">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(painting.id)}
                className="gap-1"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
