import React, { useState } from 'react';
import { QuizData, QuizAttempt, TwoOptionQuestion } from '../types';
import { soundManager } from '../utils/audio';
import { saveQuizAttempt } from '../utils/quizStorage';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Trophy, Sparkles, RotateCcw, PlusCircle, Share2, ArrowRight } from 'lucide-react';
import { THALAPATHY_DIALOGUES, MASCOT_IMAGES } from '../data/thalapathyData';

interface QuizPlayerProps {
  quiz: QuizData;
  currentUser: string | null;
  onFinishQuiz?: () => void;
  onCreateNewQuiz: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({
  quiz,
  currentUser,
  onCreateNewQuiz
}) => {
  const [friendName, setFriendName] = useState(currentUser || '');
  const [hasStarted, setHasStarted] = useState(Boolean(currentUser));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<0 | 1 | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; selected: 0 | 1; isCorrect: boolean }[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [feedbackDialogue, setFeedbackDialogue] = useState<string | null>(null);
  const [reactionMascotMood, setReactionMascotMood] = useState<'normal' | 'happy' | 'sad'>('normal');

  const totalQuestions = quiz.questions.length;
  const currentQuestion: TwoOptionQuestion | undefined = quiz.questions[currentIndex];

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim()) return;
    soundManager.playBark();
    setTimeout(() => soundManager.playWhistle(), 150);
    setHasStarted(true);
  };

  const handleSelectOption = (optionIndex: 0 | 1) => {
    if (selectedOption !== null || !currentQuestion) return;

    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === currentQuestion.correctOption;

    if (isCorrect) {
      soundManager.playCorrect();
      setTimeout(() => soundManager.playBark(), 200);
      setScore(prev => prev + 1);
      setReactionMascotMood('happy');
      const randomDialogue = [
        'Bloody Sweet! 🔥 Paw-some choice!',
        'Vaathi Coming! 🕶️ Doggie Approved! 🐾',
        'Verithanam! 👑 100% Bond!',
        'All is Well! ✨ Pure Nanba energy!'
      ][Math.floor(Math.random() * 4)];
      setFeedbackDialogue(randomDialogue);
    } else {
      soundManager.playWrong();
      setReactionMascotMood('sad');
      setFeedbackDialogue('Aww! Ketta payan sir! 🐶 Try next one!');
    }

    const recordedAnswer = {
      questionId: currentQuestion.id,
      selected: optionIndex,
      isCorrect
    };
    const updatedAnswers = [...answers, recordedAnswer];
    setAnswers(updatedAnswers);

    // Pause briefly to show reaction, then advance
    setTimeout(() => {
      setSelectedOption(null);
      setFeedbackDialogue(null);
      setReactionMascotMood('normal');

      if (currentIndex + 1 < totalQuestions) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // Quiz completed
        finishQuiz(updatedAnswers);
      }
    }, 1250);
  };

  const finishQuiz = (finalAnswers: typeof answers) => {
    const finalScore = finalAnswers.filter(a => a.isCorrect).length;
    setIsFinished(true);
    soundManager.playCelebration();
    setTimeout(() => soundManager.playBark(), 400);

    // Fire confetti for celebration
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#800517', '#ff4d6d', '#ffd166', '#f59e0b', '#ffffff']
      });
    } catch {}

    // Save attempt in localStorage
    const attempt: QuizAttempt = {
      id: `att-${Date.now()}`,
      quizId: quiz.id,
      friendName: friendName.trim() || 'Anonymous Nanba',
      score: finalScore,
      total: totalQuestions,
      answers: finalAnswers,
      completedAt: Date.now()
    };
    saveQuizAttempt(attempt);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setAnswers([]);
    setIsFinished(false);
    setFeedbackDialogue(null);
    setReactionMascotMood('normal');
  };

  // If friend hasn't entered their name yet
  if (!hasStarted) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-neutral-900 border-2 border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#800517]/30 rounded-full blur-2xl pointer-events-none" />

          {/* Cute Doggie with Crown Header */}
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 mx-auto shadow-xl shadow-red-950 animate-float-slow bg-neutral-950">
              <img
                src={MASCOT_IMAGES.crownPuppy}
                alt="Crown puppy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 text-sm px-1.5 py-0.5 rounded-full bg-[#800517] text-white font-black border border-amber-300">
              🐾
            </div>
          </div>

          <h2 className="text-2xl font-black text-white">
            {quiz.title}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 mb-6">
            Created by <span className="text-red-400 font-bold">{quiz.creatorName}</span>. Test your friendship bond with this 2-choice Thalapathy challenge!
          </p>

          <form onSubmit={handleStart} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2 text-left flex items-center justify-between">
                <span>Enter Your Name (Friend / Nanba)</span>
                <span className="text-amber-400 text-[10px]">🐶 Player</span>
              </label>
              <input
                type="text"
                value={friendName}
                onChange={e => setFriendName(e.target.value)}
                placeholder="e.g. Karthik, Sneha, Rahul..."
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-[#800517] focus:ring-1 focus:ring-[#800517] text-sm"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#800517] via-red-600 to-amber-600 hover:from-red-700 hover:to-amber-500 transition-all shadow-lg shadow-red-950/60 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start 2-Choice Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Quiz Finished State
  if (isFinished) {
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    let badgeText = 'Bloody Sweet! Ultimate Thalapathy & Doggo Bond 👑🐾';
    let badgeColor = 'text-amber-400 border-amber-500/40 bg-amber-950/40';

    if (percentage < 50) {
      badgeText = 'Ketta payan sir! Need more tea & dog walks ☕🐶';
      badgeColor = 'text-red-400 border-red-500/40 bg-red-950/40';
    } else if (percentage < 80) {
      badgeText = 'All is Well! Solid Friendship Level 🕶️🐕';
      badgeColor = 'text-blue-400 border-blue-500/40 bg-blue-950/40';
    }

    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
        <div className="bg-neutral-900 border-2 border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#800517]/30 rounded-full blur-3xl pointer-events-none" />

          {/* Mascot Celebration */}
          <div className="relative inline-block mb-3">
            <div className="w-24 h-24 rounded-3xl overflow-hidden mx-auto border-3 border-amber-400 shadow-xl shadow-red-950 animate-bounce bg-neutral-950">
              <img
                src={MASCOT_IMAGES.dogWithShades}
                alt="Celebration puppy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-2 -right-2 text-2xl animate-spin">
              ✨
            </div>
          </div>

          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-3 ${badgeColor}`}>
            {badgeText}
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {friendName}&apos;s Final Score
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            on <span className="text-white font-semibold">{quiz.creatorName}&apos;s</span> 2-option quiz
          </p>

          {/* Big Score Display */}
          <div className="my-5 p-6 rounded-2xl bg-neutral-950/80 border border-neutral-800">
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-amber-100">
              {score} / {totalQuestions}
            </div>
            <div className="text-xs uppercase tracking-widest text-amber-300 font-bold mt-1.5 flex items-center justify-center gap-1">
              <span>🐾</span>
              <span>{percentage}% Friendship Accuracy</span>
              <span>🐾</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={onCreateNewQuiz}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#800517] via-red-600 to-amber-600 hover:from-red-700 hover:to-amber-500 transition-all shadow-lg shadow-red-950/60 flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create My Own Quiz to Challenge Back!</span>
            </button>

            <button
              onClick={restartQuiz}
              className="w-full py-3 px-4 rounded-xl font-semibold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry This Quiz</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Question In-Progress
  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* Companion & Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Animated Puppy Helper */}
          <div
            onClick={() => soundManager.playBark()}
            className={`w-11 h-11 rounded-xl overflow-hidden border-2 border-amber-400 shrink-0 cursor-pointer shadow-md transition-transform ${
              reactionMascotMood === 'happy'
                ? 'scale-125 rotate-6'
                : reactionMascotMood === 'sad'
                ? 'rotate-[-8deg] opacity-70'
                : 'animate-float-slow hover:scale-105'
            }`}
            title="Your companion puppy! Tap for a bark"
          >
            <img
              src={MASCOT_IMAGES.crownPuppy}
              alt="Companion"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
              <span>Question {currentIndex + 1} of {totalQuestions}</span>
              <span className="text-amber-300">🐾</span>
            </span>
            <p className="text-[11px] text-neutral-400">
              Quiz by <span className="text-white font-bold">{quiz.creatorName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-300 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center gap-1">
            <span>Score:</span>
            <span className="text-amber-300 font-mono">{score}</span>
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-[#800517] via-red-500 to-amber-400 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <div className="flex items-center justify-between mb-4">
          <span className="px-2.5 py-0.5 rounded-full bg-[#800517]/40 border border-[#800517] text-red-300 text-[10px] font-mono font-bold uppercase">
            2-Option Choice
          </span>
          <span className="text-xs text-amber-300/80 font-bold flex items-center gap-1">
            <span>Pick One</span>
            <span>👇</span>
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white leading-snug mb-8 min-h-[55px] flex items-center">
          {currentQuestion?.question}
        </h3>

        {/* The Two Big Option Buttons */}
        <div className="space-y-4">
          {/* Option A */}
          <button
            onClick={() => handleSelectOption(0)}
            disabled={selectedOption !== null}
            className={`w-full p-5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer font-bold ${
              selectedOption === null
                ? 'bg-neutral-950 hover:bg-neutral-850 border-neutral-800 hover:border-red-600/80 hover:scale-[1.01]'
                : selectedOption === 0
                ? currentQuestion?.correctOption === 0
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50'
                  : 'bg-red-950/90 border-red-500 text-red-200'
                : currentQuestion?.correctOption === 0
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-neutral-950/50 border-neutral-800 opacity-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-neutral-800 text-white flex items-center justify-center text-xs font-black shrink-0 border border-neutral-700">
                A
              </span>
              <span className="text-base sm:text-lg text-white">
                {currentQuestion?.optionA}
              </span>
            </div>

            {selectedOption !== null && currentQuestion?.correctOption === 0 && (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 animate-bounce" />
            )}
            {selectedOption === 0 && currentQuestion?.correctOption !== 0 && (
              <XCircle className="w-6 h-6 text-red-400 shrink-0" />
            )}
          </button>

          {/* Option B */}
          <button
            onClick={() => handleSelectOption(1)}
            disabled={selectedOption !== null}
            className={`w-full p-5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer font-bold ${
              selectedOption === null
                ? 'bg-neutral-950 hover:bg-neutral-850 border-neutral-800 hover:border-red-600/80 hover:scale-[1.01]'
                : selectedOption === 1
                ? currentQuestion?.correctOption === 1
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50'
                  : 'bg-red-950/90 border-red-500 text-red-200'
                : currentQuestion?.correctOption === 1
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-neutral-950/50 border-neutral-800 opacity-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-neutral-800 text-white flex items-center justify-center text-xs font-black shrink-0 border border-neutral-700">
                B
              </span>
              <span className="text-base sm:text-lg text-white">
                {currentQuestion?.optionB}
              </span>
            </div>

            {selectedOption !== null && currentQuestion?.correctOption === 1 && (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 animate-bounce" />
            )}
            {selectedOption === 1 && currentQuestion?.correctOption !== 1 && (
              <XCircle className="w-6 h-6 text-red-400 shrink-0" />
            )}
          </button>
        </div>

        {/* Reaction Dialogue Toast with Animated Mascot Voice */}
        {feedbackDialogue && (
          <div className="mt-6 p-3 rounded-xl bg-gradient-to-r from-[#800517] to-red-600 text-white text-center font-black text-sm animate-bounce shadow-xl flex items-center justify-center gap-2 border border-amber-400/40">
            <span>🐾</span>
            <span>{feedbackDialogue}</span>
            <span>🔥</span>
          </div>
        )}
      </div>
    </div>
  );
};
