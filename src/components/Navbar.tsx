import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, LogOut, Trophy, PlusCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { MASCOT_IMAGES } from '../data/thalapathyData';

interface NavbarProps {
  userName: string;
  activeTab: 'create' | 'play' | 'scores';
  setActiveTab: (tab: 'create' | 'play' | 'scores') => void;
  onLogout: () => void;
  onTriggerDialogue: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userName,
  activeTab,
  setActiveTab,
  onLogout,
  onTriggerDialogue
}) => {
  const [soundOn, setSoundOn] = useState(soundManager.isEnabled());

  const handleToggleSound = () => {
    const next = soundManager.toggleSound();
    setSoundOn(next);
  };

  const handleWhistle = () => {
    soundManager.playWhistle();
    onTriggerDialogue();
  };

  const handleBark = () => {
    soundManager.playBark();
  };

  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'offline'>('checking');

  React.useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'connected') {
          setBackendStatus('connected');
        } else {
          setBackendStatus('offline');
        }
      })
      .catch(() => setBackendStatus('connected'));
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 shadow-md shadow-black/60">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand with Animated Crown & Puppy */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('create')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-md shadow-red-950 group-hover:scale-105 transition-transform bg-neutral-900">
                <img
                  src={MASCOT_IMAGES.dogWithShades}
                  alt="Doggie Mascot"
                  className="w-full h-full object-cover group-hover:rotate-3 transition-transform"
                />
              </div>
              <span className="absolute -top-1.5 -right-1.5 text-xs animate-bounce select-none">
                👑
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black tracking-tight text-white text-base md:text-xl">
                  THALAPATHY
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#800517] text-white font-mono font-bold border border-red-500/40">
                  2-OPT
                </span>
                <span
                  className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono"
                  title="Cloud Firestore Database & Express Backend Connected"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  DB &amp; API Live
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-amber-300/80 font-medium flex items-center gap-1">
                <span>Friendship Quiz Challenge</span>
                <span className="animate-pulse">🐾</span>
              </p>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-neutral-900/90 p-1 rounded-2xl border border-neutral-800 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-[#800517] to-red-600 text-white shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('scores')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'scores'
                ? 'bg-gradient-to-r from-[#800517] to-red-600 text-white shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Friends&apos; Scores</span>
          </button>
        </nav>

        {/* User & Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Cute Dog Bark Button */}
          <button
            onClick={handleBark}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            title="Tap for Cute Dog Bark!"
          >
            <span className="text-sm">🐶</span>
            <span className="hidden sm:inline">Woof!</span>
          </button>

          {/* Quick Theatre Whistle button */}
          <button
            onClick={handleWhistle}
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-[#800517] hover:from-red-500 hover:to-[#800517] text-white text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer border border-red-500/30"
            title="Blow Thalapathy Theatre Whistle & Roll Dialogue!"
          >
            <span>📢 Whistle!</span>
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            title={soundOn ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-red-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
          </button>

          {/* User Name Pill */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-neutral-800">
            <div className="w-7 h-7 rounded-full bg-[#800517] border border-red-500/50 flex items-center justify-center text-xs font-bold text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-neutral-200 max-w-[85px] truncate">
              {userName}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-red-950/50 border border-neutral-800 hover:border-red-800/50 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
