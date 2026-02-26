import React from "react";
import { Painting } from "@/types/gallery";

interface PaintingCardProps {
  painting: Painting;
  onClick: () => void;
}

export const PaintingCard: React.FC<PaintingCardProps> = ({ painting, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-lg bg-card text-left shadow-gallery transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={painting.imageUrl}
          alt={painting.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-display text-base font-semibold text-card-foreground line-clamp-1">
          {painting.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{painting.artist}</p>
        {painting.year && (
          <p className="mt-0.5 text-xs text-muted-foreground/70">{painting.year}</p>
        )}
      </div>
    </button>
  );
};
