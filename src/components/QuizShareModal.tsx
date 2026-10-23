import React, { useState } from 'react';
import { QuizData } from '../types';
import { encodeQuizToUrl } from '../utils/quizStorage';
import { soundManager } from '../utils/audio';
import { X, Copy, Check, MessageSquare, Share2, Sparkles, Link2 } from 'lucide-react';
import { MASCOT_IMAGES } from '../data/thalapathyData';

interface QuizShareModalProps {
  quiz: QuizData;
  onClose: () => void;
}

export const QuizShareModal: React.FC<QuizShareModalProps> = ({ quiz, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Generate URL with encoded quiz payload in URL hash
  const encodedPayload = encodeQuizToUrl(quiz);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const shareableUrl = `${baseUrl}#quiz=${encodedPayload}`;

  const challengeText = `👑 Thalapathy Vijay & Doggie Challenge! 🐶\nHow well do you really know ${quiz.creatorName}? Take this 2-choice friendship quiz and prove your bond, Nanba!\n\nTake Quiz here:\n${shareableUrl}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl);
      soundManager.playCorrect();
      soundManager.playBark();
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const handleCopyChallengeText = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(challengeText);
      soundManager.playCorrect();
      soundManager.playBark();
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2200);
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(challengeText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border-2 border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-left overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#800517]/30 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-md animate-float-slow bg-neutral-950">
            <img
              src={MASCOT_IMAGES.crownPuppy}
              alt="Mascot Pup"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
              <span>🐾</span>
              <span>Share Thalapathy Quiz</span>
            </span>
            <h3 className="text-xl font-black text-white">
              Challenge Your Friends!
            </h3>
          </div>
        </div>

        <p className="text-xs text-neutral-400 mt-1 mb-5">
          Share this link with friends so they can answer your 2-option questions and see how well they know you!
        </p>

        {/* Shareable Link Box */}
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5 text-red-400" />
              Direct Quiz Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2.5 rounded-xl bg-[#800517] hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition-colors cursor-pointer shadow"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleWhatsAppShare}
              className="py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleCopyChallengeText}
              className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedText ? 'Copied Invite' : 'Copy Invite'}</span>
            </button>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-[#800517]/20 border border-[#800517]/40 text-[11px] text-neutral-300 flex items-start gap-2">
            <span className="text-base shrink-0">🐶</span>
            <div>
              <p className="font-semibold text-white mb-0.5">Paw-some Nanba Bond:</p>
              When your friends open this link, they will see your 2-choice questions. Once they finish, their scores are saved and you can see who knows you best!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
