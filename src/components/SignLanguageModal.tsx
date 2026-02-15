import { signLanguagePhrases } from "@/data/mockData";
import { X, HandMetal } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SignLanguageModal = ({ open, onClose }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl p-5 space-y-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HandMetal className="w-6 h-6 text-accent" />
            <h3 className="font-display font-bold text-lg text-foreground">Sign Language Guide</h3>
          </div>
          <button onClick={onClose} aria-label="Close sign language guide" className="p-2 rounded-lg hover:bg-muted min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">Common railway phrases in Indian Sign Language</p>

        <div className="space-y-3">
          {signLanguagePhrases.map((item, i) => (
            <div key={i} className="bg-muted rounded-xl p-4 space-y-1">
              <p className="font-semibold text-foreground">{item.phrase}</p>
              <p className="text-sm text-muted-foreground">{item.hindi}</p>
              <div className="mt-2 bg-secondary rounded-lg h-20 flex items-center justify-center">
                <span className="text-4xl">🤟</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignLanguageModal;
