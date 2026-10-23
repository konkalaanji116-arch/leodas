import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { MASCOT_IMAGES } from '../data/thalapathyData';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isPlainPassword, setIsPlainPassword] = useState(false);
  const [colorTheme, setColorTheme] = useState<'burgundy' | 'plain'>('burgundy');
  const [error, setError] = useState('');
  const [isDogCheering, setIsDogCheering] = useState(false);

  // Handle Login submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name, Nanba!');
      return;
    }
    if (!password) {
      setError('Please enter password or use #800517');
      return;
    }

    soundManager.playBark();
    setTimeout(() => soundManager.playWhistle(), 200);
    onLogin(name.trim());
  };

  const handleUsePresetPassword = () => {
    setPassword('#800517');
    setError('');
  };

  const togglePasswordVisibility = () => {
    setIsPlainPassword(prev => !prev);
  };

  const toggleColorTheme = () => {
    setColorTheme(prev => (prev === 'burgundy' ? 'plain' : 'burgundy'));
  };

  const handlePuppyTap = () => {
    setIsDogCheering(true);
    soundManager.playBark();
    setTimeout(() => setIsDogCheering(false), 1500);
  };

  const isBurgundy = colorTheme === 'burgundy';

  return (
    <div className={`min-h-screen relative flex items-center justify-center p-4 transition-colors duration-500 overflow-hidden ${
      isBurgundy ? 'bg-gradient-to-br from-neutral-950 via-[#40020a] to-[#800517]' : 'bg-neutral-900'
    } text-white`}>
      {/* Animated Floating Ambient Stickers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-8 left-8 text-3xl sm:text-4xl animate-float-slow opacity-60">
          🐾
        </div>
        <div className="absolute top-20 right-12 text-3xl sm:text-4xl animate-float-opposite opacity-60">
          👑
        </div>
        <div className="absolute bottom-16 left-12 text-3xl sm:text-4xl animate-float-opposite opacity-60">
          🕶️
        </div>
        <div className="absolute bottom-12 right-16 text-3xl sm:text-4xl animate-float-slow opacity-60">
          🐶
        </div>
        <div className="absolute top-1/2 left-4 text-2xl animate-float-slow opacity-40">
          🔥
        </div>
        <div className="absolute top-1/3 right-6 text-2xl animate-float-opposite opacity-40">
          ☕
        </div>

        {/* Ambient Cinema Watermarks */}
        <div className="absolute -bottom-10 -left-10 text-9xl font-black text-white/[0.03]">
          THALAPATHY
        </div>
        <div className="absolute -top-10 -right-10 text-9xl font-black text-white/[0.03]">
          DOGGIE
        </div>
      </div>

      <div className="relative w-full max-w-md bg-neutral-900/90 backdrop-blur-xl border-2 border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 animate-fade-in z-10">
        
        {/* Top Floating Animated Dog & Thalapathy Mascot Hero */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#800517] animate-ping" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1">
              Thalapathy &amp; Doggie Fan Arena
            </span>
          </div>

          <button
            type="button"
            onClick={toggleColorTheme}
            className="text-xs px-2.5 py-1 rounded-full border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Toggle theme styling: #800517 vs Plain"
          >
            <span>Theme:</span>
            <span className={isBurgundy ? 'text-[#ff6b81] font-bold' : 'text-neutral-400 font-bold'}>
              {isBurgundy ? '#800517' : 'Plain'}
            </span>
          </button>
        </div>

        {/* Mascot Avatar Card with Cute Dog in Sunglasses & Thalapathy Crown */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            {/* Clickable animated puppy image */}
            <div
              onClick={handlePuppyTap}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden mx-auto border-3 border-amber-400/80 shadow-xl shadow-red-950 cursor-pointer transition-transform group ${
                isDogCheering ? 'scale-110 rotate-3 ring-4 ring-amber-300' : 'hover:scale-105 animate-float-slow'
              }`}
              title="Tap puppy for a cheerful bark!"
            >
              <img
                src={MASCOT_IMAGES.dogWithShades}
                alt="Cute puppy in aviators"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Dog Speech Bubble */}
            <div
              onClick={handlePuppyTap}
              className="absolute -top-3 -right-6 px-2.5 py-1 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-black uppercase tracking-wider shadow-md animate-bounce cursor-pointer flex items-center gap-1 border border-amber-200"
            >
              <span>Woof! Nanba</span>
              <span>🐾</span>
            </div>

            {/* Thalapathy Crown Badge */}
            <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-[#800517] border-2 border-amber-400 flex items-center justify-center text-sm shadow-md animate-pulse">
              👑
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-3">
            Thalapathy Vijay <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-amber-100">&amp; Pet Arena</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            2-Option Friendship Quiz &bull; Mass Dialogues &bull; Cute Pups
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center justify-between">
              <span>Your Name (Nanba / Nanbi)</span>
              <span className="text-[10px] text-amber-300">🐶 Quiz Creator</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Vijay, Anji, Sanjay, Priya..."
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#800517] focus:border-[#800517] transition-all text-sm font-medium"
              autoFocus
            />
          </div>

          {/* Password Field with #800517 styling and Plain/Masked toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <span>Password</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#800517] text-white font-mono font-bold border border-red-500/40">
                  #800517
                </span>
              </label>

              {/* Plain vs Masked Toggle (and vice versa) */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-xs font-medium text-amber-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                {isPlainPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Switch to Hidden</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Switch to Plain</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type={isPlainPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter password (or use #800517)"
                style={{
                  color: isPlainPassword ? (isBurgundy ? '#ff758c' : '#ffffff') : '#ff4d6d',
                  borderColor: password === '#800517' ? '#800517' : undefined
                }}
                className={`w-full px-4 py-3 pr-12 rounded-xl bg-neutral-950 border ${
                  password === '#800517'
                    ? 'border-[#800517] ring-2 ring-[#800517]/50'
                    : 'border-neutral-700 focus:border-[#800517] focus:ring-2 focus:ring-[#800517]'
                } placeholder-neutral-500 focus:outline-none transition-all font-mono text-sm`}
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 cursor-pointer"
                aria-label={isPlainPassword ? 'Hide password' : 'Show plain password'}
              >
                {isPlainPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Quick #800517 Autofill / Quick-code Pill */}
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-neutral-400">
                Mode: <span className="font-semibold text-white">{isPlainPassword ? 'Plain Text' : 'Masked (Dots)'}</span>
              </span>
              <button
                type="button"
                onClick={handleUsePresetPassword}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-200 hover:text-white bg-[#800517] hover:bg-red-700 border border-red-500/50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                Fill #800517
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-600 text-red-200 text-xs font-medium flex items-center gap-2 animate-bounce">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl font-black text-white bg-gradient-to-r from-[#800517] via-red-600 to-amber-600 hover:from-red-700 hover:to-amber-500 active:scale-[0.99] transition-all shadow-xl shadow-red-950/80 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Enter Fan &amp; Doggie Arena</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer mass quote & puppy paw */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span className="italic">&ldquo;Bloody Sweet!&rdquo; — Leo</span>
          <span className="flex items-center gap-1 font-mono text-[#ff758c]">
            <span>🐾</span> #800517
          </span>
        </div>
      </div>
    </div>
  );
};
