import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ShieldCheck, Sparkles, Volume2, ArrowRight, UserCheck, KeyRound, Plus, Users } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { MASCOT_IMAGES } from '../data/thalapathyData';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

const DEFAULT_MEMBERS: Record<string, string> = {
  shoaib: '19',
  bharath: '04',
  anji: '07',
  vijay: '22',
  leo: '99'
};

const STORAGE_MEMBERS_KEY = 'thalapathy_member_passwords_v1';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isPlainPassword, setIsPlainPassword] = useState(false);
  const [colorTheme, setColorTheme] = useState<'burgundy' | 'plain'>('burgundy');
  const [error, setError] = useState('');
  const [isDogCheering, setIsDogCheering] = useState(false);
  const [memberPasswords, setMemberPasswords] = useState<Record<string, string>>(DEFAULT_MEMBERS);
  const [showMemberDirectory, setShowMemberDirectory] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPass, setNewMemberPass] = useState('');

  // Load custom members from localStorage if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_MEMBERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMemberPasswords({ ...DEFAULT_MEMBERS, ...parsed });
      }
    } catch {}
  }, []);

  const saveNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberPass.trim()) return;
    const cleanName = newMemberName.trim().toLowerCase();
    const updated = { ...memberPasswords, [cleanName]: newMemberPass.trim() };
    setMemberPasswords(updated);
    try {
      localStorage.setItem(STORAGE_MEMBERS_KEY, JSON.stringify(updated));
    } catch {}
    setName(newMemberName.trim());
    setPassword(newMemberPass.trim());
    setNewMemberName('');
    setNewMemberPass('');
    soundManager.playBark();
  };

  // Handle Login submission with member-specific password verification
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter your name, Nanba!');
      return;
    }
    if (!password) {
      setError('Please enter your password!');
      return;
    }

    const cleanKey = trimmedName.toLowerCase();
    const expectedPassword = memberPasswords[cleanKey];

    // Check member-specific password
    if (expectedPassword) {
      if (password !== expectedPassword && password !== '#800517') {
        setError(`Incorrect password for ${trimmedName}! Assigned password is "${expectedPassword}".`);
        soundManager.playWrong();
        return;
      }
    } else {
      // New member registering
      const updated = { ...memberPasswords, [cleanKey]: password };
      setMemberPasswords(updated);
      try {
        localStorage.setItem(STORAGE_MEMBERS_KEY, JSON.stringify(updated));
      } catch {}
    }

    soundManager.playBark();
    setTimeout(() => soundManager.playWhistle(), 200);
    onLogin(trimmedName);
  };

  const handleSelectMember = (memberName: string, memberPass: string) => {
    setName(memberName.charAt(0).toUpperCase() + memberName.slice(1));
    setPassword(memberPass);
    setError('');
    soundManager.playPunch();
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
  const detectedExpectedPass = memberPasswords[name.trim().toLowerCase()];

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
          LEO
        </div>
      </div>

      <div className="relative w-full max-w-md bg-neutral-900/90 backdrop-blur-xl border-2 border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 animate-fade-in z-10">
        
        {/* Top Floating Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#800517] animate-ping" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1">
              Member Authentication
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowMemberDirectory(prev => !prev)}
              className="text-[11px] px-2.5 py-1 rounded-full border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-amber-300 transition-colors flex items-center gap-1 cursor-pointer font-bold"
              title="View member passwords"
            >
              <Users className="w-3 h-3" />
              <span>Members</span>
            </button>

            <button
              type="button"
              onClick={toggleColorTheme}
              className="text-xs px-2 py-1 rounded-full border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors flex items-center gap-1 cursor-pointer"
              title="Toggle theme styling: #800517 vs Plain"
            >
              <span className={isBurgundy ? 'text-[#ff6b81] font-bold' : 'text-neutral-400 font-bold'}>
                {isBurgundy ? '#800517' : 'Plain'}
              </span>
            </button>
          </div>
        </div>

        {/* Mascot Avatar Card with Cute Dog & Thalapathy Crown */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div
              onClick={handlePuppyTap}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden mx-auto border-3 border-amber-400/80 shadow-xl shadow-red-950 cursor-pointer transition-transform group ${
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

            {/* Speech Bubble */}
            <div
              onClick={handlePuppyTap}
              className="absolute -top-3 -right-6 px-2.5 py-1 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-black uppercase tracking-wider shadow-md animate-bounce cursor-pointer flex items-center gap-1 border border-amber-200"
            >
              <span>Woof! Nanba</span>
              <span>🐾</span>
            </div>

            {/* Crown */}
            <div className="absolute -bottom-2 -left-2 w-7 h-7 rounded-full bg-[#800517] border-2 border-amber-400 flex items-center justify-center text-xs shadow-md animate-pulse">
              👑
            </div>
          </div>

          {/* Simple Clean Title: THALAPATHY */}
          <h1 className="text-3xl sm:text-4xl font-black tracking-widest text-white mt-3 font-serif">
            THALAPATHY
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            2-Option Friendship Quiz &bull; Mass Member Passcodes
          </p>
        </div>

        {/* Quick Member Passcode Pills (Shoaib: 19, Bharath: 04, etc.) */}
        <div className="mb-4 p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2 flex items-center justify-between">
            <span>Quick Select Member:</span>
            <span className="text-amber-400 font-mono">Separate Passwords</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleSelectMember('Shoaib', '19')}
              className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                name.toLowerCase() === 'shoaib'
                  ? 'bg-[#800517] border-red-500 text-white shadow'
                  : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white'
              }`}
            >
              <span>Shoaib</span>
              <span className="font-mono text-[10px] text-amber-300">(19)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectMember('Bharath', '04')}
              className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                name.toLowerCase() === 'bharath'
                  ? 'bg-[#800517] border-red-500 text-white shadow'
                  : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white'
              }`}
            >
              <span>Bharath</span>
              <span className="font-mono text-[10px] text-amber-300">(04)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectMember('Anji', '07')}
              className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                name.toLowerCase() === 'anji'
                  ? 'bg-[#800517] border-red-500 text-white shadow'
                  : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white'
              }`}
            >
              <span>Anji</span>
              <span className="font-mono text-[10px] text-amber-300">(07)</span>
            </button>
          </div>
        </div>

        {/* Member Directory Modal / Accordion */}
        {showMemberDirectory && (
          <div className="mb-4 p-3.5 rounded-2xl bg-neutral-950 border border-amber-500/40 text-xs animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" />
                Member Passwords Directory
              </span>
              <span className="text-[10px] text-neutral-400">Tap to fill</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto pr-1">
              {Object.entries(memberPasswords).map(([memName, memPass]) => (
                <div
                  key={memName}
                  onClick={() => handleSelectMember(memName, memPass)}
                  className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-red-500 flex items-center justify-between cursor-pointer"
                >
                  <span className="capitalize font-semibold text-white">{memName}</span>
                  <span className="font-mono font-bold text-amber-300">{memPass}</span>
                </div>
              ))}
            </div>

            {/* Add Custom Member Form */}
            <form onSubmit={saveNewMember} className="mt-2.5 pt-2 border-t border-neutral-800 flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Name"
                value={newMemberName}
                onChange={e => setNewMemberName(e.target.value)}
                className="w-1/2 px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-xs"
              />
              <input
                type="text"
                placeholder="Passcode"
                value={newMemberPass}
                onChange={e => setNewMemberPass(e.target.value)}
                className="w-1/3 px-2 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-xs font-mono"
              />
              <button
                type="submit"
                className="p-1 rounded-lg bg-[#800517] hover:bg-red-700 text-white font-bold cursor-pointer"
                title="Add member"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center justify-between">
              <span>Your Name (Member)</span>
              {detectedExpectedPass && (
                <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  Passcode: {detectedExpectedPass}
                </span>
              )}
            </label>
            <input
              type="text"
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Shoaib, Bharath, Anji..."
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#800517] focus:border-[#800517] transition-all text-sm font-medium"
              autoFocus
            />
          </div>

          {/* Password Field with Plain/Masked toggle & #800517 styling */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <span>Password</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#800517] text-white font-mono font-bold border border-red-500/40">
                  {detectedExpectedPass ? `Code: ${detectedExpectedPass}` : '#800517'}
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
                placeholder={detectedExpectedPass ? `Enter passcode (${detectedExpectedPass})` : 'Enter password'}
                style={{
                  color: isPlainPassword ? (isBurgundy ? '#ff758c' : '#ffffff') : '#ff4d6d',
                  borderColor: password === '#800517' || password === detectedExpectedPass ? '#800517' : undefined
                }}
                className={`w-full px-4 py-3 pr-12 rounded-xl bg-neutral-950 border ${
                  password === '#800517' || password === detectedExpectedPass
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

            {/* Quick Autofill / Mode Pill */}
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
            <span>Enter THALAPATHY Arena</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer mass quote */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span className="italic font-serif">&ldquo;Bloody Sweet!&rdquo;</span>
          <span className="flex items-center gap-1 font-mono text-[#ff758c]">
            <span>🐾</span> #800517
          </span>
        </div>
      </div>
    </div>
  );
};
