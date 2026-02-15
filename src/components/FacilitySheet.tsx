import { Facility, facilityIcons } from "@/data/mockData";
import { X, Star, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  facility: Facility | null;
  onClose: () => void;
}

const crowdLabel = { low: "Not Crowded", medium: "Moderate", high: "Very Crowded" };
const crowdColor = { low: "crowd-green", medium: "crowd-yellow", high: "crowd-red" };

const tags = ["Clean", "Crowded", "No Water", "Well-Maintained", "Smelly", "Safe"];

const FacilitySheet = ({ facility, onClose }: Props) => {
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (!facility) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-card rounded-t-2xl border-t border-border shadow-2xl animate-slide-up p-5 space-y-4 max-h-[70vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{facilityIcons[facility.type]}</span>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">{facility.name}</h3>
              <p className="text-sm text-muted-foreground">{facility.description}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close facility details" className="p-2 rounded-lg hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Crowd Density */}
        <div className="flex items-center gap-3">
          <div className={cn("w-3 h-3 rounded-full", crowdColor[facility.crowdLevel])} />
          <span className="text-sm font-medium text-foreground">{crowdLabel[facility.crowdLevel]}</span>
          {facility.accessible && (
            <span className="ml-auto text-xs bg-transit-sky/15 text-transit-sky px-2 py-1 rounded-md font-medium">♿ Accessible</span>
          )}
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Rate this facility</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                aria-label={`Rate ${s} stars`}
                className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Star className={cn("w-7 h-7 transition-colors", s <= rating ? "fill-transit-saffron text-transit-saffron" : "text-border")} />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Tags */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Quick feedback</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setSelectedTags((prev) =>
                    prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                  )
                }
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all min-h-[44px]",
                  selectedTags.includes(tag)
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3 rounded-xl font-semibold min-h-[48px] hover:opacity-90 transition-opacity">
          <ThumbsUp className="w-4 h-4" />
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default FacilitySheet;
