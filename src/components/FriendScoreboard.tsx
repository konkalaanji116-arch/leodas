import React, { useState } from 'react';
import { QuizData, QuizAttempt } from '../types';
import { getQuizAttempts, getSavedQuizzes, decodeQuizFromUrl } from '../utils/quizStorage';
import { Trophy, Users, Play, Plus, Trash2, Search, ArrowRight, ExternalLink } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { MASCOT_IMAGES } from '../data/thalapathyData';

interface FriendScoreboardProps {
  currentQuiz: QuizData;
  onSelectQuiz: (quiz: QuizData) => void;
  onCreateNew: () => void;
  onPlayQuiz: (quiz: QuizData) => void;
  onDeleteQuiz: (id: string) => void;
}

export const FriendScoreboard: React.FC<FriendScoreboardProps> = ({
  currentQuiz,
  onSelectQuiz,
  onCreateNew,
  onPlayQuiz,
  onDeleteQuiz
}) => {
  const [pasteInput, setPasteInput] = useState('');
  const [parseError, setParseError] = useState('');

  const allQuizzes = getSavedQuizzes();
  const attempts = getQuizAttempts(currentQuiz.id);

  const handleLoadExternalQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    setParseError('');
    const input = pasteInput.trim();
    if (!input) return;

    let encodedStr = input;
    if (input.includes('#quiz=')) {
      encodedStr = input.split('#quiz=')[1];
    } else if (input.includes('?quiz=')) {
      encodedStr = input.split('?quiz=')[1];
    }

    const decoded = decodeQuizFromUrl(encodedStr);
    if (decoded && decoded.questions && decoded.questions.length > 0) {
      soundManager.playCorrect();
      setTimeout(() => soundManager.playBark(), 200);
      onPlayQuiz(decoded);
    } else {
      soundManager.playWrong();
      setParseError('Could not decode quiz! Make sure you copied the valid Thalapathy quiz link.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8 animate-fade-in">
      {/* Top Hero Section with Cute Dog Mascot */}
      <div className="bg-gradient-to-r from-neutral-900 via-[#800517] to-neutral-900 rounded-3xl p-6 sm:p-8 border-2 border-red-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div
              onClick={() => soundManager.playBark()}
              className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-lg cursor-pointer hover:scale-105 transition-transform animate-float-slow bg-neutral-950"
              title="Tap for Woof!"
            >
              <img
                src={MASCOT_IMAGES.dogWithShades}
                alt="Shades Puppy Mascot"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <span>🐾</span>
                  <span>Friendship Leaderboard</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Friends Who Know You
              </h2>
              <p className="text-xs text-neutral-300 mt-0.5">
                Active Quiz: <span className="font-bold text-white">{currentQuiz.title}</span> ({currentQuiz.questions.length} questions)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCreateNew}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Create New Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Friend Attempt Results */}
      <section className="bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Friend Attempts ({attempts.length})
            </h3>
          </div>
          <span className="text-xs text-amber-300/80 flex items-center gap-1 font-semibold">
            <span>🐶 Pup Certified</span>
          </span>
        </div>

        {attempts.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-neutral-800 rounded-2xl">
            <span className="text-4xl block mb-2 animate-bounce">🐕</span>
            <p className="text-neutral-200 text-sm font-bold">No friends have taken this quiz yet!</p>
            <p className="text-neutral-400 text-xs mt-1 max-w-sm mx-auto">
              Share your 2-choice quiz on WhatsApp with friends to find out who has the ultimate Thalapathy bond!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/80">
            {attempts.map(att => {
              const pct = Math.round((att.score / att.total) * 100);
              let tier = 'Bloody Sweet 👑🐾';
              let badgeColor = 'text-amber-400 bg-amber-950/40 border-amber-500/30';
              if (pct < 50) {
                tier = 'Need Chai Time ☕🐶';
                badgeColor = 'text-red-400 bg-red-950/40 border-red-500/30';
              } else if (pct < 80) {
                tier = 'Solid Nanba 🕶️✨';
                badgeColor = 'text-blue-400 bg-blue-950/40 border-blue-500/30';
              }

              return (
                <div key={att.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#800517] text-white flex items-center justify-center font-bold text-sm shadow">
                      {att.friendName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{att.friendName}</h4>
                      <p className="text-[11px] text-neutral-400">
                        {new Date(att.completedAt).toLocaleDateString()} • {new Date(att.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-bold ${badgeColor}`}>
                      {tier}
                    </span>
                    <div className="text-right">
                      <div className="text-base font-black text-white">
                        {att.score} / {att.total}
                      </div>
                      <div className="text-[10px] text-amber-300 font-mono font-semibold">
                        {pct}% Match
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Paste / Play Friend's Quiz via Link */}
      <section className="bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-6 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>Take a Friend&apos;s Quiz</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-amber-300 font-mono">
            Paste Link
          </span>
        </h3>
        <p className="text-xs text-neutral-400">
          Did a friend send you their Thalapathy 2-option quiz link? Paste it below to play:
        </p>

        <form onSubmit={handleLoadExternalQuiz} className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={pasteInput}
            onChange={e => {
              setPasteInput(e.target.value);
              if (parseError) setParseError('');
            }}
            placeholder="Paste friend's quiz link or code here..."
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-[#800517] text-xs font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#800517] hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Play</span>
          </button>
        </form>

        {parseError && (
          <p className="text-xs text-red-400 font-medium">{parseError}</p>
        )}
      </section>

      {/* Saved Quizzes Manager */}
      <section className="bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-6 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          My Saved Quizzes ({allQuizzes.length})
        </h3>

        <div className="space-y-2">
          {allQuizzes.map(quiz => {
            const isCurrent = quiz.id === currentQuiz.id;
            return (
              <div
                key={quiz.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isCurrent ? 'bg-[#800517]/25 border-[#800517]' : 'bg-neutral-950 border-neutral-800'
                }`}
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    {quiz.title}
                    {isCurrent && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#800517] text-white uppercase font-mono">
                        Active
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {quiz.questions.length} questions • Created by {quiz.creatorName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!isCurrent && (
                    <button
                      onClick={() => onSelectQuiz(quiz)}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
                    >
                      Select
                    </button>
                  )}
                  <button
                    onClick={() => onPlayQuiz(quiz)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 transition-colors"
                    title="Play quiz"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                  {allQuizzes.length > 1 && (
                    <button
                      onClick={() => onDeleteQuiz(quiz.id)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 hover:text-red-400 text-neutral-500 transition-colors"
                      title="Delete quiz"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
