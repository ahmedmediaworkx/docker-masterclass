import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Award,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Compass,
  Trophy,
  Anchor,
  Activity,
  Heart,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudyMotivationCenterProps {
  currentIdx: number;
  slidesCount: number;
  bookmarkedSlides: number[];
  completedLabs: string[];
  activeSlideTitle: string;
}

interface Achievement {
  id: string;
  title: string;
  desc: string;
  badge: string;
  unlocked: boolean;
}

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'award';
}

export const StudyMotivationCenter: React.FC<StudyMotivationCenterProps> = ({
  currentIdx,
  slidesCount,
  bookmarkedSlides,
  completedLabs,
  activeSlideTitle
}) => {
  // Persistence states
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('study-focus-xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [level, setLevel] = useState<number>(() => {
    const saved = localStorage.getItem('study-focus-level');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('study-focus-streak');
    return saved ? parseInt(saved, 10) : 1;
  });

  // UI Drawer State (default minimized for a cleaner look)
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Pomodoro Study Timer states (simplified to be super clean)
  const [timerMinutes, setTimerMinutes] = useState<number>(25);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');
  
  // Custom non-intrusive Toast state to replace annoying window.alert()
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sound Synthesizer via safe Web Audio API (No ScriptProcessors, no deprecations)
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioVolume, setAudioVolume] = useState<number>(0.3);

  // Simple Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first-dive', title: 'First Dive', desc: 'Read your first systems slide.', badge: '🤿', unlocked: false },
    { id: 'depth-explorer', title: 'Depth Explorer', desc: 'Explore at least 5 different modules.', badge: '🧭', unlocked: false },
    { id: 'dock-worker', title: 'Docker Deckhand', desc: 'Complete your first interactive diagnostic lab.', badge: '⚓', unlocked: false },
    { id: 'bookmark-captain', title: 'Curriculum Navigator', desc: 'Bookmark 3 or more slides for offline reference.', badge: '🔖', unlocked: false }
  ]);

  // Level Up Overlay Celebration State
  const [showLevelUpModal, setShowLevelUpModal] = useState<{ show: boolean; oldLevel: number; newLevel: number }>({
    show: false,
    oldLevel: 1,
    newLevel: 1,
  });

  // Perfect Level-Up System formulas
  const getXpNeededForLevel = (lvl: number): number => {
    if (lvl <= 1) return 0;
    let sum = 0;
    for (let i = 2; i <= lvl; i++) {
      sum += (i - 1) * 100;
    }
    return sum;
  };

  const getLevelFromXp = (currentXp: number): number => {
    let lvl = 1;
    while (currentXp >= getXpNeededForLevel(lvl + 1)) {
      lvl++;
    }
    return lvl;
  };

  const getLevelProgress = (currentXp: number, currentLvl: number) => {
    const currentLevelStart = getXpNeededForLevel(currentLvl);
    const nextLevelStart = getXpNeededForLevel(currentLvl + 1);
    const totalNeededForThisLevel = Math.max(100, nextLevelStart - currentLevelStart);
    const earnedInThisLevel = currentXp - currentLevelStart;
    const percentage = Math.min(100, Math.max(0, (earnedInThisLevel / totalNeededForThisLevel) * 100));
    return {
      earned: earnedInThisLevel,
      totalNeeded: totalNeededForThisLevel,
      percentage
    };
  };

  const getNauticalRank = (lvl: number): string => {
    if (lvl <= 1) return "Deckhand Cadet";
    if (lvl === 2) return "Submarine Navigator";
    if (lvl === 3) return "Deep Sea Explorer";
    if (lvl === 4) return "Engine Room Officer";
    if (lvl === 5) return "Container Fleet Captain";
    if (lvl === 6) return "Kubernetes Sea Lord";
    return "Ocean Arch-Commander";
  };

  // Play a beautiful cybernetic sea-chime using Web Audio API
  const playLevelChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 (uplifting major chord)
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.12);
        
        gainNode.gain.setValueAtTime(0, now + index * 0.12);
        gainNode.gain.linearRampToValueAtTime(0.12, now + index * 0.12 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 0.8);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(now + index * 0.12);
        osc.stop(now + index * 0.12 + 1);
      });
    } catch (err) {
      console.warn("Unable to play level chime:", err);
    }
  };

  // Audio nodes refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const humOscRef = useRef<OscillatorNode | null>(null);
  const modOscRef = useRef<OscillatorNode | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);

  const visitedSlides = useRef<Set<number>>(new Set<number>());
  const completedLabsCount = useRef<number>(completedLabs.length);

  // Persistence side-effects
  useEffect(() => {
    localStorage.setItem('study-focus-xp', xp.toString());
    localStorage.setItem('study-focus-level', level.toString());
  }, [xp, level]);

  // Helper to add toast notifications safely with a 2-second delay
  const addToast = (text: string, type: 'success' | 'info' | 'award' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setTimeout(() => {
      setToasts((prev) => [...prev, { id, text, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    }, 2000);
  };

  // Add XP and level up in-app with gorgeous interactive modal trigger
  const addXp = (amount: number) => {
    setXp((prevXp) => {
      const newXp = prevXp + amount;
      const targetLevel = getLevelFromXp(newXp);
      
      if (targetLevel > level) {
        setLevel(targetLevel);
        setShowLevelUpModal({ show: true, oldLevel: level, newLevel: targetLevel });
        playLevelChime();
        addToast(`🎉 LEVEL UP! You reached Level ${targetLevel}!`, 'success');
      } else {
        addToast(`+${amount} XP Gained ✨`, 'info');
      }
      return newXp;
    });
  };

  // Give XP on slide changes
  useEffect(() => {
    if (currentIdx !== undefined) {
      if (!visitedSlides.current.has(currentIdx)) {
        visitedSlides.current.add(currentIdx);
        if (currentIdx > 0) {
          addXp(15);
        }
      }
    }
  }, [currentIdx]);

  // Give XP on diagnostic lab completions
  useEffect(() => {
    if (completedLabs.length > completedLabsCount.current) {
      const diff = completedLabs.length - completedLabsCount.current;
      addXp(50 * diff);
      completedLabsCount.current = completedLabs.length;
      addToast(`⚓ Practical Lab Completed! Excellent!`, 'success');
    }
  }, [completedLabs]);

  // Handle achievement triggers
  useEffect(() => {
    let updated = false;
    const nextAchievements = achievements.map((ach) => {
      if (ach.unlocked) return ach;
      let shouldUnlock = false;

      if (ach.id === 'first-dive' && visitedSlides.current.size >= 1) shouldUnlock = true;
      if (ach.id === 'depth-explorer' && visitedSlides.current.size >= 5) shouldUnlock = true;
      if (ach.id === 'dock-worker' && completedLabs.length >= 1) shouldUnlock = true;
      if (ach.id === 'bookmark-captain' && bookmarkedSlides.length >= 3) shouldUnlock = true;

      if (shouldUnlock) {
        updated = true;
        addToast(`🏆 Unlocked: ${ach.title} ${ach.badge}`, 'award');
        return { ...ach, unlocked: true };
      }
      return ach;
    });

    if (updated) {
      setAchievements(nextAchievements);
    }
  }, [visitedSlides.current.size, completedLabs.length, bookmarkedSlides.length]);

  // Pomodoro timer core loop
  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning) {
      timer = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds((s) => s - 1);
        } else if (timerSeconds === 0) {
          if (timerMinutes > 0) {
            setTimerMinutes((m) => m - 1);
            setTimerSeconds(59);
          } else {
            // Timer finished
            setIsTimerRunning(false);
            if (timerMode === 'study') {
              addXp(100);
              setStreak((s) => {
                const ns = s + 1;
                localStorage.setItem('study-focus-streak', ns.toString());
                return ns;
              });
              addToast("🐳 Focus session complete! Time for a short break.", "success");
              setTimerMode('break');
              setTimerMinutes(5);
            } else {
              addToast("🫧 Break complete! Let's dive back into learning.", "info");
              setTimerMode('study');
              setTimerMinutes(25);
            }
          }
        }
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timerMinutes, timerSeconds, timerMode]);

  // Safe and ultra-light binaural audio hum (sound wave synth)
  const toggleAmbientSound = () => {
    if (!isAudioPlaying) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(audioVolume, ctx.currentTime);
        masterGain.connect(ctx.destination);
        mainGainRef.current = masterGain;

        // Sound source oscillator 1 (deep soothing sea wave hum)
        const humOsc = ctx.createOscillator();
        humOsc.type = 'sine';
        humOsc.frequency.setValueAtTime(120, ctx.currentTime);

        // Sound source oscillator 2 (frequency modulation for dynamic wave feeling)
        const modOsc = ctx.createOscillator();
        modOsc.type = 'sine';
        modOsc.frequency.setValueAtTime(0.2, ctx.currentTime); // slow wave rate

        const modGain = ctx.createGain();
        modGain.gain.setValueAtTime(10, ctx.currentTime);

        modOsc.connect(modGain);
        modGain.connect(humOsc.frequency);

        humOsc.connect(masterGain);

        humOsc.start();
        modOsc.start();

        humOscRef.current = humOsc;
        modOscRef.current = modOsc;
        setIsAudioPlaying(true);
        addToast("🔊 Soothing Sea Hum started. Focus enhanced!", "info");
      } catch (err) {
        console.warn("Could not start ambient synthesizer:", err);
      }
    } else {
      stopAmbientSound();
    }
  };

  const stopAmbientSound = () => {
    if (humOscRef.current) {
      try { humOscRef.current.stop(); } catch(e){}
      humOscRef.current = null;
    }
    if (modOscRef.current) {
      try { modOscRef.current.stop(); } catch(e){}
      modOscRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch(e){}
      audioCtxRef.current = null;
    }
    setIsAudioPlaying(false);
    addToast("🔇 Ambient Hum muted.", "info");
  };

  useEffect(() => {
    return () => {
      if (humOscRef.current || modOscRef.current) {
        stopAmbientSound();
      }
    };
  }, []);

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerMinutes(timerMode === 'study' ? 25 : 5);
    setTimerSeconds(0);
  };

  // Calculations for circular loader
  const maxSec = timerMode === 'study' ? 25 * 60 : 5 * 60;
  const currentSec = timerMinutes * 60 + timerSeconds;
  const percent = (currentSec / maxSec) * 100;

  const progress = getLevelProgress(xp, level);

  return (
    <>
      {/* 1. In-App Elegant Floating Toasts Portal */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col-reverse gap-2 pointer-events-none max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.18 } }}
              className={`p-3 border shadow-lg font-mono text-[11px] uppercase tracking-wider flex items-center gap-2 pointer-events-auto ${
                t.type === 'success'
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-400'
                  : t.type === 'award'
                  ? 'bg-amber-950/90 border-amber-500 text-amber-400'
                  : 'bg-sky-950/90 border-sky-500 text-sky-400'
              } backdrop-blur-md`}
            >
              <span>
                {t.type === 'success' ? '🐳' : t.type === 'award' ? '🏆' : '✨'}
              </span>
              <div className="flex-1 font-bold">{t.text}</div>
              <button
                onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
                className="hover:opacity-100 opacity-60 ml-2 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 2. Simplified Widget Panel */}
      <div className="fixed right-4 bottom-4 z-40 transition-all duration-300">
        <AnimatePresence initial={false}>
          {!isOpen ? (
            // Small floating quick-start circle trigger
            <motion.button
              layoutId="companion-box"
              onClick={() => setIsOpen(true)}
              className="w-12 h-12 bg-sky-950/90 hover:bg-sky-900/90 border border-sky-400/50 backdrop-blur-md flex flex-col items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all relative"
            >
              <span className="text-lg">🧘</span>
              <span className="absolute -top-1 -right-1 bg-sky-400 text-black text-[8px] font-bold px-1 py-0.5 rounded-none font-mono">
                L{level}
              </span>
            </motion.button>
          ) : (
            // Open state panel: super streamlined, easy, and completely glassmorphic
            <motion.div
              layoutId="companion-box"
              className="w-72 glass-panel p-4 flex flex-col gap-3 font-mono text-xs rounded-none"
            >
              {/* Header */}
              <div className="flex flex-col gap-1 border-b border-sky-500/20 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base animate-pulse">🐳</span>
                    <div>
                      <h4 className="font-bold text-[11px] text-white uppercase tracking-widest">
                        STUDY WORKSPACE
                      </h4>
                      <span className="text-[9px] text-sky-400/80 uppercase">
                        Level {level} • {getNauticalRank(level)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-sky-900/30 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Minimize Panel"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Micro level progress bar */}
                <div className="space-y-0.5 mt-1">
                  <div className="flex justify-between text-[8px] text-slate-400 font-mono">
                    <span>XP PROGRESS</span>
                    <span className="text-sky-300">{progress.earned} / {progress.totalNeeded} XP</span>
                  </div>
                  <div className="w-full bg-slate-950/80 h-1.5 border border-sky-500/20 rounded-none overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.percentage}%` }}
                      className="h-full bg-gradient-to-r from-sky-500 to-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.6)]"
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* Progress/Streak */}
              <div className="grid grid-cols-2 gap-2 bg-sky-950/20 border border-sky-500/10 p-2 text-center">
                <div>
                  <span className="text-[8px] text-slate-400 uppercase block">XP Total</span>
                  <span className="font-bold text-sky-400 text-sm">{xp} pts</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 uppercase block">Daily Streak</span>
                  <span className="font-bold text-amber-400 text-sm flex items-center gap-1 justify-center">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {streak}d
                  </span>
                </div>
              </div>

              {/* Focus Timer Circle & Controls */}
              <div className="flex items-center gap-3 bg-sky-950/30 border border-sky-500/10 p-2">
                <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      className="text-slate-700/30"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      className="text-sky-400"
                      strokeWidth="2.5"
                      strokeDasharray="151"
                      strokeDashoffset={151 - (151 * percent) / 100}
                      strokeLinecap="square"
                      stroke="currentColor"
                      fill="transparent"
                      style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-[9px] font-bold text-white">
                      {timerMinutes}:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                    </span>
                    <span className="text-[6px] text-sky-400 font-bold uppercase tracking-widest">
                      {timerMode}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-[8px]">
                    <span className="text-slate-400 font-bold uppercase">Focus Clock</span>
                    <span className="text-sky-400 uppercase font-bold">
                      {timerMode === 'study' ? '🔒 STUDY' : '🧘 BREAK'}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={`px-2 py-1 text-[8px] uppercase font-bold tracking-wider rounded-none flex items-center gap-1 transition-all cursor-pointer border ${
                        isTimerRunning
                          ? 'bg-red-950/40 border-red-500 text-red-400 hover:bg-red-900/30'
                          : 'bg-emerald-950/40 border-emerald-500 text-emerald-400 hover:bg-emerald-900/30'
                      }`}
                    >
                      {isTimerRunning ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                      <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
                    </button>
                    <button
                      onClick={resetTimer}
                      className="p-1 bg-sky-950/50 hover:bg-sky-900/50 border border-sky-500/20 text-slate-400 hover:text-white rounded-none cursor-pointer"
                      title="Reset Timer"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Minimal Audio controller */}
              <div className="flex items-center justify-between bg-sky-950/30 border border-sky-500/10 p-2">
                <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-sky-400" />
                  AMBIENT SOUND
                </span>
                <button
                  onClick={toggleAmbientSound}
                  className={`px-2 py-0.5 border text-[8px] uppercase font-bold rounded-none cursor-pointer ${
                    isAudioPlaying
                      ? 'bg-emerald-950/40 border-emerald-400 text-emerald-400'
                      : 'bg-sky-950/50 border-sky-500/20 text-slate-400 hover:text-white'
                  }`}
                >
                  {isAudioPlaying ? '🔊 WAVE ON' : '🔇 WAVE OFF'}
                </button>
              </div>

              {/* Simple Achievements display */}
              <div className="space-y-1.5">
                <span className="text-[8px] text-slate-400 uppercase block tracking-wider font-bold">
                  BADGES EARNED
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className={`h-8 border flex items-center justify-center text-base relative group transition-all cursor-help ${
                        ach.unlocked
                          ? 'bg-sky-950/30 border-sky-500 text-white'
                          : 'bg-black/45 border-slate-700/30 opacity-20'
                      }`}
                      title={`${ach.title}: ${ach.desc}`}
                    >
                      <span>{ach.badge}</span>
                      {ach.unlocked && (
                        <div className="absolute -top-1 -right-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 fill-emerald-950" />
                        </div>
                      )}

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col w-32 p-1 bg-slate-950 border border-sky-500 text-[8px] text-slate-300 z-50 text-center font-mono uppercase tracking-wider rounded-none">
                        <span className="font-bold text-white block pb-0.5 border-b border-sky-500/20 mb-0.5">{ach.title}</span>
                        <span>{ach.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Level Up Celebration Immersive Modal */}
      <AnimatePresence>
        {showLevelUpModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          >
            {/* Ambient glowing sea-sparkles particle background simulation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ 
                scale: 1, 
                y: 0, 
                opacity: 1,
                transition: { 
                  type: "spring",
                  damping: 15,
                  stiffness: 120
                }
              }}
              exit={{ scale: 0.9, y: -20, opacity: 0 }}
              className="relative w-full max-w-md bg-slate-900 border border-cyan-500/40 p-6 md:p-8 text-center font-mono shadow-[0_0_40px_rgba(36,150,237,0.25)] flex flex-col items-center gap-5"
            >
              {/* Golden circular badge with sparkles */}
              <div className="relative flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                  className="absolute inset-0 w-24 h-24 rounded-full border-2 border-dashed border-cyan-400/40"
                />
                <div className="w-20 h-20 rounded-full bg-cyan-950/60 border border-cyan-400 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                  <span className="text-3xl animate-bounce">🏆</span>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute -top-1 -right-1 text-yellow-400 text-lg"
                >
                  ✨
                </motion.div>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-100">
                  RANK PROMOTED!
                </h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                  Nautical System Calibration Complete
                </p>
              </div>

              {/* Progress visual comparison */}
              <div className="flex items-center gap-6 justify-center bg-slate-950/60 border border-sky-500/20 px-6 py-3 w-full">
                <div className="text-center">
                  <span className="text-[9px] text-slate-500 uppercase block">OLD RANK</span>
                  <span className="text-sm text-slate-400 font-bold">Lvl {showLevelUpModal.oldLevel}</span>
                </div>
                <div className="text-cyan-400 text-xl">➔</div>
                <div className="text-center">
                  <span className="text-[9px] text-cyan-400 uppercase block">NEW RANK</span>
                  <span className="text-lg text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">Lvl {showLevelUpModal.newLevel}</span>
                </div>
              </div>

              {/* Unlocked rewards display */}
              <div className="w-full text-left space-y-2 border-t border-slate-800 pt-4">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">UNLOCKED PRIVILEGES:</span>
                
                <div className="space-y-2 text-[11px] text-slate-300 uppercase">
                  <div className="flex items-center gap-2 bg-sky-950/20 border border-sky-500/10 p-2">
                    <span className="text-emerald-400 text-sm">🛡️</span>
                    <div>
                      <span className="font-bold text-white block">NEW TITLE ENGAGED</span>
                      <span className="text-[9px] text-sky-400">{getNauticalRank(showLevelUpModal.newLevel)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-sky-950/20 border border-sky-500/10 p-2">
                    <span className="text-emerald-400 text-sm">⚡</span>
                    <div>
                      <span className="font-bold text-white block">XP GAIN MULTIPLIER</span>
                      <span className="text-[9px] text-sky-400">Bonus systems synchronization calibrated</span>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowLevelUpModal({ ...showLevelUpModal, show: false })}
                className="w-full mt-2 py-3 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.2)] border-none"
              >
                ⚓ CONTINUE VOYAGE
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
