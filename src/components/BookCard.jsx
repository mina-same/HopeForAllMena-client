import React, { useState } from "react"; // Added React import
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Star, ShoppingCart, Eye, Heart } from "lucide-react";
import { Link, navigate } from "gatsby-plugin-react-i18next";

export function BookCard({
  id,
  title,
  author,
  price,
  originalPrice,
  rating,
  reviews,
  image,
  badge,
  isNew,
  onAddToCart,
}) {
  const [isLoved, setIsLoved] = useState(false);

  const handleOrderClick = () => {
    navigate("/order");
  };

  const handleQuickView = (e) => { // Added e parameter
    e.preventDefault();
    navigate(`/book/${id}`);
  };

  const handleLoveToggle = (e) => { // Added e parameter
    e.preventDefault();
    setIsLoved(!isLoved);
  };

  return (
    <div className="group relative bg-gradient-card rounded-xl border border-border p-4 hover:shadow-book transition-all duration-500 hover:-translate-y-2 flex flex-col min-h-[420px]">
      {badge && (
        <Badge className="absolute top-2 left-2 z-10 bg-[#2194D1] text-[#2194D1]-foreground">
          {badge}
        </Badge>
      )}
      {isNew && (
        <Badge className="absolute top-2 right-2 z-10 bg-success text-success-foreground">
          New
        </Badge>
      )}

      {/* Image with hover icons */}
      <div className="aspect-[3/4] mb-4 relative overflow-hidden rounded-xl bg-surface group/image shadow-card">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay with icons */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handleQuickView}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#2194D1] hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleLoveToggle}
            className={`w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-all duration-200 shadow-lg ${isLoved ? "bg-red-500 text-white" : "bg-white/90 text-red-500 hover:bg-white"
              }`}
            aria-label={isLoved ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-4 h-4 ${isLoved ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      {/* Book details */}
      <Link to={`/book/${id}`} className="block flex-1">
        <div className="space-y-2 flex-1 min-h-[96px]">
          <h3 className="font-semibold text-sm line-clamp-2 leading-snug tracking-tight group-hover:text-[#2194D1] transition-colors duration-300">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground">{author}</p>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 transition-colors duration-200 ${i < Math.floor(rating) ? "fill-[#2194D1] text-[#2194D1]" : "text-muted-foreground"
                  }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({reviews})</span>
          </div>
        </div>
      </Link>

      {/* Price */}
      {false && (
        <div />
      )}

      {/* Always visible Order Now button */}
      <Button
        variant="default"
        size="sm"
        className="w-full mt-3 transform group-hover:translate-y-[-2px] transition-all duration-300 shadow-card"
        onClick={handleOrderClick}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Order Now
      </Button>
    </div>
  );
}