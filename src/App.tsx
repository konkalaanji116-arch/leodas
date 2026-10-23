/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { DialogueBanner } from './components/DialogueBanner';
import { QuizCreator } from './components/QuizCreator';
import { QuizPlayer } from './components/QuizPlayer';
import { QuizShareModal } from './components/QuizShareModal';
import { FriendScoreboard } from './components/FriendScoreboard';
import { QuizData, DialogueItem } from './types';
import {
  getCurrentUser,
  saveCurrentUser,
  clearCurrentUser,
  getSavedQuizzes,
  saveQuiz,
  deleteQuiz,
  fetchQuizzesFromFirestore,
  createDefaultQuizForUser,
  decodeQuizFromUrl
} from './utils/quizStorage';
import { THALAPATHY_DIALOGUES, MASCOT_IMAGES } from './data/thalapathyData';
import { soundManager } from './utils/audio';

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'play' | 'scores'>('create');
  const [activeQuiz, setActiveQuiz] = useState<QuizData | null>(null);
  const [shareModalQuiz, setShareModalQuiz] = useState<QuizData | null>(null);
  const [activeModalDialogue, setActiveModalDialogue] = useState<DialogueItem | null>(null);
  const [incomingSharedQuiz, setIncomingSharedQuiz] = useState<QuizData | null>(null);

  // Initialize from storage or URL
  useEffect(() => {
    // 1. Check if URL contains a shared quiz
    const hash = window.location.hash;
    const search = window.location.search;
    let quizParam = '';

    if (hash && hash.includes('quiz=')) {
      quizParam = hash.split('quiz=')[1];
    } else if (search && search.includes('quiz=')) {
      const params = new URLSearchParams(search);
      quizParam = params.get('quiz') || '';
    }

    if (quizParam) {
      const decoded = decodeQuizFromUrl(quizParam);
      if (decoded) {
        setIncomingSharedQuiz(decoded);
        setActiveQuiz(decoded);
        setActiveTab('play');
      }
    }

    // 2. Check current logged-in user
    const savedUser = getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
      loadUserQuizzes(savedUser);
    }
  }, []);

  const loadUserQuizzes = async (userName: string) => {
    const quizzes = getSavedQuizzes();
    if (quizzes.length > 0) {
      setActiveQuiz(quizzes[0]);
    } else {
      const defaultQuiz = createDefaultQuizForUser(userName);
      setActiveQuiz(defaultQuiz);
    }

    try {
      const remote = await fetchQuizzesFromFirestore();
      if (remote && remote.length > 0) {
        setActiveQuiz(remote[0]);
      }
    } catch {}
  };

  const handleLogin = (name: string) => {
    saveCurrentUser(name);
    setCurrentUser(name);
    loadUserQuizzes(name);
  };

  const handleLogout = () => {
    clearCurrentUser();
    setCurrentUser(null);
    setActiveQuiz(null);
  };

  const handleSaveQuiz = (updatedQuiz: QuizData) => {
    saveQuiz(updatedQuiz);
    setActiveQuiz(updatedQuiz);
  };

  const handleCreateNewQuiz = () => {
    const creator = currentUser || 'Thalapathy Fan';
    const newQuiz = createDefaultQuizForUser(creator);
    setActiveQuiz(newQuiz);
    setActiveTab('create');
  };

  const handleDeleteQuiz = (id: string) => {
    deleteQuiz(id);
    const remaining = getSavedQuizzes();
    if (remaining.length > 0) {
      setActiveQuiz(remaining[0]);
    } else if (currentUser) {
      const fresh = createDefaultQuizForUser(currentUser);
      setActiveQuiz(fresh);
    }
  };

  const handleTriggerRandomDialogue = () => {
    const random = THALAPATHY_DIALOGUES[Math.floor(Math.random() * THALAPATHY_DIALOGUES.length)];
    setActiveModalDialogue(random);
  };

  // If a friend opened a direct quiz link without logging in, allow playing directly!
  if (!currentUser && incomingSharedQuiz) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white selection:bg-[#800517] selection:text-white">
        <DialogueBanner
          currentModalDialogue={activeModalDialogue}
          onCloseModal={() => setActiveModalDialogue(null)}
        />
        <header className="bg-neutral-900/80 border-b border-neutral-800 py-3 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">👑</span>
              <span className="font-extrabold text-sm tracking-tight text-white">
                Thalapathy <span className="text-red-400">Quiz Challenge</span>
              </span>
            </div>
            <button
              onClick={() => {
                setIncomingSharedQuiz(null);
                window.location.hash = '';
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#800517] text-white hover:bg-red-700 font-bold transition-colors"
            >
              Log In / Create Quiz
            </button>
          </div>
        </header>

        <main className="py-6">
          <QuizPlayer
            quiz={incomingSharedQuiz}
            currentUser={null}
            onCreateNewQuiz={() => {
              setIncomingSharedQuiz(null);
              window.location.hash = '';
            }}
          />
        </main>
      </div>
    );
  }

  // If not logged in, render the clean LoginScreen with Name and Password (#800517 & plain toggle)
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-[#800517] selection:text-white flex flex-col font-sans">
      {/* Top dialogue ticker & reaction modal */}
      <DialogueBanner
        currentModalDialogue={activeModalDialogue}
        onCloseModal={() => setActiveModalDialogue(null)}
      />

      {/* Main Navbar */}
      <Navbar
        userName={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onTriggerDialogue={handleTriggerRandomDialogue}
      />

      {/* Main Content Area based on Tab */}
      <main className="flex-1 py-4">
        {activeTab === 'create' && activeQuiz && (
          <QuizCreator
            currentQuiz={activeQuiz}
            onSaveQuiz={handleSaveQuiz}
            onOpenShareModal={(q) => setShareModalQuiz(q)}
            onPlayQuiz={(q) => {
              setActiveQuiz(q);
              setActiveTab('play');
            }}
          />
        )}

        {activeTab === 'play' && activeQuiz && (
          <QuizPlayer
            quiz={activeQuiz}
            currentUser={currentUser}
            onCreateNewQuiz={handleCreateNewQuiz}
          />
        )}

        {activeTab === 'scores' && activeQuiz && (
          <FriendScoreboard
            currentQuiz={activeQuiz}
            onSelectQuiz={(q) => setActiveQuiz(q)}
            onCreateNew={handleCreateNewQuiz}
            onPlayQuiz={(q) => {
              setActiveQuiz(q);
              setActiveTab('play');
            }}
            onDeleteQuiz={handleDeleteQuiz}
          />
        )}
      </main>

      {/* Share Modal */}
      {shareModalQuiz && (
        <QuizShareModal
          quiz={shareModalQuiz}
          onClose={() => setShareModalQuiz(null)}
        />
      )}

      {/* Floating Interactive Doggie Mascot Widget */}
      <div className="fixed bottom-4 right-4 z-30 flex items-center gap-2 select-none">
        <button
          onClick={() => {
            soundManager.playBark();
          }}
          className="group relative p-1 rounded-2xl bg-neutral-900 border-2 border-amber-400/80 shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          title="Tap your buddy for a happy Woof!"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-950">
            <img
              src={MASCOT_IMAGES.dogWithShades}
              alt="Mascot"
              className="w-full h-full object-cover group-hover:rotate-6 transition-transform"
            />
          </div>
          <span className="text-xs font-black text-amber-300 pr-2 hidden sm:inline">
            Woof! 🐾
          </span>
          <span className="absolute -top-2 -left-2 text-xs">👑</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-neutral-900 text-center text-xs text-neutral-500 bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#800517]" />
            <span className="text-neutral-400 font-medium flex items-center gap-1.5">
              <span>Thalapathy Vijay &amp; Cute Doggie Edition</span>
              <span>🐾</span>
              <span className="text-amber-400 font-mono">#800517</span>
            </span>
          </div>
          <p className="italic text-neutral-400">
            &ldquo;Kill them with your success, bury them with your smile.&rdquo; &bull; Woof! 🐶
          </p>
        </div>
      </footer>
    </div>
  );
}
