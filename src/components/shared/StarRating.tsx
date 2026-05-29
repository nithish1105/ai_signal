import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
}

export default function StarRating({ rating, maxStars = 5, size = 16 }: StarRatingProps) {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    if (i <= Math.floor(rating)) {
      // Full Star
      stars.push(
        <Star 
          key={i} 
          size={size} 
          className="fill-amber-400 text-amber-400 shrink-0" 
        />
      );
    } else if (i - 0.5 <= rating) {
      // Half Star (using overlay representation)
      stars.push(
        <div key={i} className="relative shrink-0" style={{ width: size, height: size }}>
          <Star size={size} className="text-slate-700 shrink-0" />
          <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
            <Star size={size} className="fill-amber-400 text-amber-400 shrink-0" />
          </div>
        </div>
      );
    } else {
      // Empty Star
      stars.push(
        <Star 
          key={i} 
          size={size} 
          className="text-slate-700 shrink-0" 
        />
      );
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars}
      <span className="text-xs font-semibold text-slate-400 ml-1.5">{rating.toFixed(1)}</span>
    </div>
  );
}
