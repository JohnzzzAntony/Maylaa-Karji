"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  size = 14,
  className,
  showValue = false,
  count,
}: {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  count?: number;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, rating - (i - 1)));
          return (
            <div key={i} className="relative" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-muted-foreground/30" fill="currentColor" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star size={size} className="text-gold" fill="currentColor" />
              </div>
            </div>
          );
        })}
      </div>
      {showValue && <span className="text-xs font-medium text-foreground">{rating.toFixed(1)}</span>}
      {count !== undefined && <span className="text-xs text-muted-foreground">({count})</span>}
    </div>
  );
}
