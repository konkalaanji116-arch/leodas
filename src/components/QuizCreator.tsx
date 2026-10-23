import React, { useState } from 'react';
import { TwoOptionQuestion, QuizData } from '../types';
import { STARTER_TWO_OPTION_QUESTIONS, MASCOT_IMAGES } from '../data/thalapathyData';
import { Plus, Trash2, CheckCircle2, Share2, Sparkles, HelpCircle, Save, Play, RefreshCw } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface QuizCreatorProps {
  currentQuiz: QuizData;
  onSaveQuiz: (quiz: QuizData) => void;
  onOpenShareModal: (quiz: QuizData) => void;
  onPlayQuiz: (quiz: QuizData) => void;
}

export const QuizCreator: React.FC<QuizCreatorProps> = ({
  currentQuiz,
  onSaveQuiz,
  onOpenShareModal,
  onPlayQuiz
}) => {
  const [title, setTitle] = useState(currentQuiz.title);
  const [questions, setQuestions] = useState<TwoOptionQuestion[]>(currentQuiz.questions);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [savedNotice, setSavedNotice] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');
  const [cheerMsg, setCheerMsg] = useState('Create your quiz, Nanba!');

  // Add a new blank 2-option question
  const handleAddQuestion = () => {
    soundManager.playBark();
    const newQ: TwoOptionQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      question: '',
      optionA: '',
      optionB: '',
      correctOption: 0
    };
    const updated = [...questions, newQ];
    setQuestions(updated);
    setActiveQuestionIndex(updated.length - 1);
    setCheerMsg('Paw-some! New 2-choice question added! 🐾');
    setTimeout(() => setCheerMsg('Make it fun for your friends!'), 2000);
  };

  // Quick-add from starter bank
  const handleAddStarterQuestion = (starter: typeof STARTER_TWO_OPTION_QUESTIONS[0]) => {
    soundManager.playBark();
    const newQ: TwoOptionQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      question: starter.question,
      optionA: starter.optionA,
      optionB: starter.optionB,
      correctOption: starter.correctOption
    };
    const updated = [...questions, newQ];
    setQuestions(updated);
    setActiveQuestionIndex(updated.length - 1);
    setCheerMsg('Great pick! Friends will love this! 🐶✨');
  };

  // Delete a question
  const handleDeleteQuestion = (index: number) => {
    if (questions.length <= 1) {
      setErrorNotice('Quiz must have at least one 2-option question!');
      setTimeout(() => setErrorNotice(''), 3000);
      return;
    }
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
    if (activeQuestionIndex >= updated.length) {
      setActiveQuestionIndex(Math.max(0, updated.length - 1));
    }
  };

  // Update specific question field
  const handleUpdateQuestion = (field: keyof TwoOptionQuestion, value: any) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[activeQuestionIndex] = {
        ...copy[activeQuestionIndex],
        [field]: value
      };
      return copy;
    });
  };

  // Validate and Save
  const handleSave = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setErrorNotice(`Question #${i + 1} text is empty!`);
        setActiveQuestionIndex(i);
        return;
      }
      if (!q.optionA.trim() || !q.optionB.trim()) {
        setErrorNotice(`Both Option A and Option B must be filled for Question #${i + 1}!`);
        setActiveQuestionIndex(i);
        return;
      }
    }

    const updatedQuiz: QuizData = {
      ...currentQuiz,
      title: title.trim() || `How well do you know ${currentQuiz.creatorName}?`,
      questions
    };

    onSaveQuiz(updatedQuiz);
    soundManager.playWhistle();
    soundManager.playBark();
    setSavedNotice(true);
    setCheerMsg('Quiz Saved! Ready to share with friends! 👑🐾');
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const currentQ = questions[activeQuestionIndex] || questions[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner with Cute Puppy & Thalapathy Accents */}
      <div className="bg-neutral-900 border-2 border-red-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#800517]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3">
            {/* Animated Mascot Dog Companion */}
            <div
              onClick={() => {
                soundManager.playBark();
                setCheerMsg('Woof! You got this Nanba! 🐶🔥');
              }}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-lg cursor-pointer hover:scale-105 transition-transform animate-float-slow bg-neutral-950"
              title="Click cute pup for encouragement!"
            >
              <img
                src={MASCOT_IMAGES.crownPuppy}
                alt="Crown puppy"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#800517] text-white font-bold uppercase tracking-wider border border-red-500/40">
                  Thalapathy 2-Option Format
                </span>
                <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                  <span>🐾</span>
                  {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
                </span>
                <span className="text-[11px] text-neutral-400 italic">
                  &ldquo;{cheerMsg}&rdquo;
                </span>
              </div>

              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. How Well Do You Know Me? 🔥"
                className="text-xl md:text-2xl font-black text-white bg-transparent border-b border-neutral-700 focus:border-[#800517] focus:outline-none w-full max-w-lg py-1"
              />
              <p className="text-xs text-neutral-400 mt-1">
                Customize simple questions with strictly 2 choices, select your true answer, and challenge your friends!
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSave}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer border border-neutral-700 shadow"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Save Quiz</span>
            </button>

            <button
              onClick={() => {
                handleSave();
                onOpenShareModal({
                  ...currentQuiz,
                  title: title.trim() || currentQuiz.title,
                  questions
                });
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#800517] to-red-600 hover:from-red-700 hover:to-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-950/60 transition-all cursor-pointer active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Link</span>
            </button>

            <button
              onClick={() => {
                handleSave();
                onPlayQuiz({
                  ...currentQuiz,
                  title: title.trim() || currentQuiz.title,
                  questions
                });
              }}
              className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
              title="Test / Preview how friends see this quiz"
            >
              <Play className="w-4 h-4 text-amber-400" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {savedNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Quiz saved! Ready to challenge friends with 2-choice questions! 🐶👑</span>
          </div>
        )}

        {errorNotice && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/90 border border-red-500 text-red-200 text-xs font-bold flex items-center gap-2 animate-shake">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>{errorNotice}</span>
          </div>
        )}
      </div>

      {/* Main Editing Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Question Navigation List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
              <span>Questions</span>
              <span className="text-amber-400">({questions.length})</span>
            </span>
            <button
              onClick={handleAddQuestion}
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer bg-red-950/50 px-2 py-1 rounded-lg border border-red-800/40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const isActive = idx === activeQuestionIndex;
              return (
                <div
                  key={q.id || idx}
                  onClick={() => setActiveQuestionIndex(idx)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 group ${
                    isActive
                      ? 'bg-neutral-900 border-[#800517] ring-2 ring-[#800517]/50 shadow-md'
                      : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isActive ? 'bg-[#800517] text-white shadow' : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium text-neutral-200 truncate">
                      {q.question || `(Empty Question ${idx + 1})`}
                    </span>
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteQuestion(idx);
                    }}
                    className="p-1 rounded-md text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                    title="Delete question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Add from Starter Bank */}
          <div className="pt-3 border-t border-neutral-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-2 flex items-center gap-1">
              <span>🐶 Instant 2-Option Starters</span>
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {STARTER_TWO_OPTION_QUESTIONS.map((st, i) => (
                <button
                  key={i}
                  onClick={() => handleAddStarterQuestion(st)}
                  className="w-full text-left p-2 rounded-xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800 hover:border-red-900/50 text-[11px] text-neutral-300 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate pr-1">{st.question}</span>
                  <Plus className="w-3 h-3 text-amber-400 shrink-0 group-hover:scale-125 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Active Question Editor */}
        <div className="lg:col-span-8 bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-[#800517] text-white flex items-center justify-center text-xs font-black shadow">
                #{activeQuestionIndex + 1}
              </span>
              <span className="text-sm font-bold text-white">Customize 2-Option Question</span>
            </div>
            <span className="text-xs text-amber-300/80 font-mono font-semibold">Strictly 2 Choices</span>
          </div>

          {/* Question text */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
              Question Text
            </label>
            <textarea
              rows={2}
              value={currentQ.question}
              onChange={e => handleUpdateQuestion('question', e.target.value)}
              placeholder="e.g. If I could adopt a pet, would I pick a Golden Retriever or a Husky?"
              className="w-full px-4 py-3 rounded-2xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-[#800517] focus:ring-1 focus:ring-[#800517] text-sm resize-none"
            />
          </div>

          {/* The 2 Options (Option A and Option B) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                The Two Options (Click checkmark to set your true answer)
              </label>
              <span className="text-[11px] text-amber-300 font-bold">
                Your Answer: Option {currentQ.correctOption === 0 ? 'A' : 'B'}
              </span>
            </div>

            {/* Option A */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                currentQ.correctOption === 0
                  ? 'bg-[#800517]/25 border-[#800517] ring-2 ring-[#800517]/50 shadow-md'
                  : 'bg-neutral-950 border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-[#800517] text-white flex items-center justify-center text-[10px] font-black">
                    A
                  </span>
                  Option 1
                </span>
                <button
                  type="button"
                  onClick={() => handleUpdateQuestion('correctOption', 0)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    currentQ.correctOption === 0
                      ? 'bg-[#800517] text-white shadow'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{currentQ.correctOption === 0 ? 'Correct (My True Choice)' : 'Set as My Choice'}</span>
                </button>
              </div>
              <input
                type="text"
                value={currentQ.optionA}
                onChange={e => handleUpdateQuestion('optionA', e.target.value)}
                placeholder="e.g. Playful Golden Puppy 🐶🐾"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-[#800517] text-sm font-medium"
              />
            </div>

            {/* Option B */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                currentQ.correctOption === 1
                  ? 'bg-[#800517]/25 border-[#800517] ring-2 ring-[#800517]/50 shadow-md'
                  : 'bg-neutral-950 border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-[#800517] text-white flex items-center justify-center text-[10px] font-black">
                    B
                  </span>
                  Option 2
                </span>
                <button
                  type="button"
                  onClick={() => handleUpdateQuestion('correctOption', 1)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    currentQ.correctOption === 1
                      ? 'bg-[#800517] text-white shadow'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{currentQ.correctOption === 1 ? 'Correct (My True Choice)' : 'Set as My Choice'}</span>
                </button>
              </div>
              <input
                type="text"
                value={currentQ.optionB}
                onChange={e => handleUpdateQuestion('optionB', e.target.value)}
                placeholder="e.g. Chill Husky with blue eyes 🐺❄️"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-[#800517] text-sm font-medium"
              />
            </div>
          </div>

          {/* Navigation Controls between questions */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
            <button
              onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={activeQuestionIndex === 0}
              className="text-xs font-bold px-3 py-2 rounded-xl bg-neutral-800 text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-700 cursor-pointer"
            >
              &larr; Previous Question
            </button>

            <span className="text-xs text-neutral-400 font-mono">
              {activeQuestionIndex + 1} / {questions.length}
            </span>

            {activeQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => setActiveQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="text-xs font-bold px-3 py-2 rounded-xl bg-[#800517] text-white hover:bg-red-700 cursor-pointer"
              >
                Next Question &rarr;
              </button>
            ) : (
              <button
                onClick={handleAddQuestion}
                className="text-xs font-bold px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-[#800517] text-white flex items-center gap-1 cursor-pointer shadow"
              >
                <Plus className="w-3 h-3" />
                Add Another
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
