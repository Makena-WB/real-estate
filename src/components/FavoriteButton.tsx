"use client";
import { useState } from "react";
import { Heart } from "lucide-react";

export function FavoriteButton({ listingId, isFavorited }: { listingId: string; isFavorited: boolean }) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [loading, setLoading] = useState(false);

  // Debug: log the current favorited state
  console.log("FavoriteButton:", { listingId, favorited });

  const toggleFavorite = async () => {
    setLoading(true);
    const res = await fetch("/api/favorites", {
      method: favorited ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });
    if (res.ok) setFavorited(!favorited);
    setLoading(false);
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors duration-200 ${
        favorited ? "text-red-500" : "text-blue-600"
      }`}
      aria-label={favorited ? "Unfavorite" : "Favorite"}
    >
      <Heart
        className="w-4 h-4"
        fill={favorited ? "currentColor" : "none"}
      />
    </button>
  );
}