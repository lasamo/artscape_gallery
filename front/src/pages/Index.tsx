import React, { useState, useEffect } from "react";
import { Painting, Collection } from "@/types/gallery";
import { getPaintings, getCollections, addPainting, deletePainting, updatePainting, addCollection, deleteCollection } from "@/store/galleryStore";
import { PaintingCard } from "@/components/gallery/PaintingCard";
import { AddPaintingDialog } from "@/components/gallery/AddPaintingDialog";
import { CollectionsSidebar } from "@/components/gallery/CollectionsSidebar";
import { PaintingDetailDialog } from "@/components/gallery/PaintingDetailDialog";
import { Button } from "@/components/ui/button";
import { Plus, Image as ImageIcon } from "lucide-react";

const GalleryPage = () => {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [detailPainting, setDetailPainting] = useState<Painting | null>(null);

  const reload = () => {
    setPaintings(getPaintings());
    setCollections(getCollections());
  };

  useEffect(() => { reload(); }, []);

  const filtered = selectedCollection
    ? paintings.filter((p) => p.collectionId === selectedCollection)
    : paintings;

  const handleAdd = (data: Omit<Painting, "id" | "createdAt">) => {
    addPainting(data);
    reload();
    setAddOpen(false);
  };

  const handleDelete = (id: string) => {
    deletePainting(id);
    reload();
    setDetailPainting(null);
  };

  const handleUpdate = (id: string, updates: Partial<Painting>) => {
    updatePainting(id, updates);
    reload();
    const updated = getPaintings().find(p => p.id === id);
    if (updated) setDetailPainting(updated);
  };

  const handleAddCollection = (name: string, description?: string) => {
    addCollection({ name, description });
    reload();
  };

  const handleDeleteCollection = (id: string) => {
    deleteCollection(id);
    if (selectedCollection === id) setSelectedCollection(null);
    reload();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-6 w-6 text-primary" />
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Art Gallery
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setAddOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Painting
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex gap-6 px-6 py-8">
        {/* Sidebar */}
        <CollectionsSidebar
          collections={collections}
          selectedCollection={selectedCollection}
          onSelect={setSelectedCollection}
          onAdd={handleAddCollection}
          onDelete={handleDeleteCollection}
          paintingCounts={collections.reduce((acc, c) => {
            acc[c.id] = paintings.filter((p) => p.collectionId === c.id).length;
            return acc;
          }, {} as Record<string, number>)}
        />

        {/* Main content */}
        <main className="flex-1">
          <div className="mb-6">
            <h2 className="font-display text-xl font-medium text-foreground">
              {selectedCollection
                ? collections.find((c) => c.id === selectedCollection)?.name || "Collection"
                : "All Paintings"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "painting" : "paintings"}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ImageIcon className="mb-4 h-16 w-16 text-muted-foreground/30" />
              <h3 className="font-display text-lg text-muted-foreground">No paintings yet</h3>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Add your first painting to start building your gallery
              </p>
              <Button onClick={() => setAddOpen(true)} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Add Painting
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((painting) => (
                <PaintingCard
                  key={painting.id}
                  painting={painting}
                  onClick={() => setDetailPainting(painting)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <AddPaintingDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={handleAdd}
        collections={collections}
      />

      <PaintingDetailDialog
        painting={detailPainting}
        onClose={() => setDetailPainting(null)}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        collections={collections}
      />
    </div>
  );
};

export default GalleryPage;
