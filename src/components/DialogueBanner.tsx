import React, { useState, useEffect } from 'react';
import { THALAPATHY_DIALOGUES, MASCOT_IMAGES } from '../data/thalapathyData';
import { DialogueItem } from '../types';
import { Sparkles, X, Volume2, Share2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface DialogueBannerProps {
  currentModalDialogue: DialogueItem | null;
  onCloseModal: () => void;
}

export const DialogueBanner: React.FC<DialogueBannerProps> = ({
  currentModalDialogue,
  onCloseModal
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate dialogues every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % THALAPATHY_DIALOGUES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activeDialogue = THALAPATHY_DIALOGUES[currentIndex];

  const handleCopyQuote = (quote: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`"${quote}" — Thalapathy Vijay`);
    }
  };

  return (
    <>
      {/* Top Floating Ticker with Cute Paw & Dialogue */}
      <div className="bg-gradient-to-r from-neutral-950 via-[#800517] to-neutral-950 border-b border-red-900/40 text-xs py-2 px-4 shadow-inner">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="px-2 py-0.5 rounded bg-black/50 text-amber-300 font-bold uppercase tracking-wider text-[10px] shrink-0 border border-amber-500/30 flex items-center gap-1">
              <span>🐾</span>
              <span>MASS DIALOGUE</span>
            </span>
            <div className="truncate font-medium text-white flex items-center gap-2">
              <span className="italic font-serif">&ldquo;{activeDialogue.quote}&rdquo;</span>
              <span className="text-amber-200 text-[11px] shrink-0">— {activeDialogue.movie}</span>
            </div>
          </div>
          <button
            onClick={() => setCurrentIndex(prev => (prev + 1) % THALAPATHY_DIALOGUES.length)}
            className="text-[11px] text-red-200 hover:text-white shrink-0 underline decoration-red-400 cursor-pointer hidden sm:block"
          >
            Next Quote &rarr;
          </button>
        </div>
      </div>

      {/* Modal for Instant Mass Punch & Puppy Reaction */}
      {currentModalDialogue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-[#800517] via-neutral-900 to-black border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-950/80 text-center overflow-hidden">
            {/* Background cinematic glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#800517]/40 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={onCloseModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-neutral-400 hover:text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Mascot Crown Puppy */}
            <div className="relative inline-block mb-3">
              <div
                onClick={() => soundManager.playBark()}
                className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 mx-auto shadow-xl cursor-pointer hover:scale-105 transition-transform animate-float-slow bg-neutral-950"
                title="Tap for Woof!"
              >
                <img
                  src={MASCOT_IMAGES.crownPuppy}
                  alt="Mascot Puppy"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 text-xs px-1.5 py-0.5 rounded-full bg-[#800517] border border-amber-300 text-white font-bold">
                👑
              </span>
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-amber-300 font-mono text-xs uppercase tracking-widest font-bold mb-3 block">
              THALAPATHY MASS MOMENT 💥
            </div>

            <div className="my-3">
              <h3 className="text-2xl sm:text-3xl font-black text-white font-serif tracking-tight leading-snug">
                &ldquo;{currentModalDialogue.quote}&rdquo;
              </h3>
              {currentModalDialogue.transliteration && currentModalDialogue.transliteration !== currentModalDialogue.quote && (
                <p className="text-sm text-neutral-300 mt-2 italic">
                  {currentModalDialogue.transliteration}
                </p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-amber-300 font-semibold">
                🎬 {currentModalDialogue.movie}
              </span>
              <button
                onClick={() => handleCopyQuote(currentModalDialogue.quote)}
                className="text-xs px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                Copy Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
