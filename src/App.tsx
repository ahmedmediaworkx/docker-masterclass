import { useState, useEffect } from 'react';
import {
  BookOpen,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bookmark,
  Layers,
  Award,
  Search,
  Sparkles,
  Play,
  Lightbulb,
  FileCode,
  FileText,
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
  Flame,
  Gauge,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { slides as staticSlides } from './slidesData';
import { Slide, SlideCategory } from './types';
import { VisualDiagrams } from './components/VisualDiagrams';
import { TerminalSimulator } from './components/TerminalSimulator';
import { CheatSheetDetailsView } from './components/CheatSheetDetailsView';
import { QuizWidget } from './components/QuizWidget';
import { ParticleSystem } from './components/ParticleSystem';
import { ResourcesView } from './components/ResourcesView';
import { StudyMotivationCenter } from './components/StudyMotivationCenter';

// Removed Firebase and dynamic database sync for client-only static production setup
import { InstructorModal } from './components/InstructorModal';
import { PdfExportModal } from './components/PdfExportModal';

export default function App() {
  const slides = staticSlides; // fully static slides data source

  const [showInstructor, setShowInstructor] = useState<boolean>(false);
  const [showPdfExport, setShowPdfExport] = useState<boolean>(false);

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [jargonFreeMode, setJargonFreeMode] = useState<boolean>(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(true);
  const [showShortcuts, setShowShortcuts] = useState<boolean>(false);
  const [showMatrix, setShowMatrix] = useState<boolean>(false);
  const [bookmarkedSlides, setBookmarkedSlides] = useState<number[]>([]);
  const [completedLabs, setCompletedLabs] = useState<string[]>([]);
  const [sidebarSearch, setSidebarSearch] = useState<string>('');
  const [flashcardMode, setFlashcardMode] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const currentSlide: Slide = slides[currentIdx] || staticSlides[0];

  // Load bookmarks and completed labs from localStorage if available
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('docker-bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarkedSlides(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error(e);
      }
    }
    const savedLabs = localStorage.getItem('docker-completed-labs');
    if (savedLabs) {
      try {
        setCompletedLabs(JSON.parse(savedLabs));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Reset revealed state on slide change
  useEffect(() => {
    setIsRevealed(false);
  }, [currentIdx]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid hotkeys when user is typing in terminal input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        if (flashcardMode && !isRevealed) {
          setIsRevealed(true);
        } else {
          handleNext();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key.toLowerCase() === 'j') {
        setJargonFreeMode((prev) => !prev);
      } else if (e.key.toLowerCase() === 's') {
        setShowSpeakerNotes((prev) => !prev);
      } else if (e.key.toLowerCase() === 'm') {
        setShowMatrix((prev) => !prev);
      } else if (e.key.toLowerCase() === 'f') {
        setFlashcardMode((prev) => !prev);
      } else if (e.key.toLowerCase() === 'b') {
        toggleBookmark(currentSlide.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, currentSlide, flashcardMode, isRevealed]);

  const handleNext = () => {
    if (currentIdx < slides.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const selectSlide = (id: number) => {
    const idx = slides.findIndex((s) => s.id === id);
    if (idx !== -1) {
      setCurrentIdx(idx);
      setShowMatrix(false);
    }
  };

  const toggleBookmark = (id: number) => {
    let updated: number[];
    if (bookmarkedSlides.includes(id)) {
      updated = bookmarkedSlides.filter((bId) => bId !== id);
    } else {
      updated = [...bookmarkedSlides, id];
    }
    setBookmarkedSlides(updated);
    localStorage.setItem('docker-bookmarks', JSON.stringify(updated));
  };

  const handleLabCompleted = (labId: string) => {
    if (!completedLabs.includes(labId)) {
      const updated = [...completedLabs, labId];
      setCompletedLabs(updated);
      localStorage.setItem('docker-completed-labs', JSON.stringify(updated));
    }
  };

  // Group slides by Category for rendering chapters
  const categories: { name: SlideCategory; label: string }[] = [
    { name: 'Introduction', label: '01. INTRO' },
    { name: 'VMs vs Containers', label: '02. ARCHITECTURE' },
    { name: 'Docker Jargon-Free', label: '03. ANALOGIES' },
    { name: 'Terminology', label: '04. TERMINOLOGY' },
    { name: 'Hands-on Labs', label: '05. LABS' },
    { name: 'Cheat Sheet', label: '06. CHEAT SHEET' },
    { name: 'Summary & Best Practices', label: '07. BEST PRACTICES' },
    { name: 'Resources', label: '08. RESOURCES' }
  ];

  // Search slides inside sidebar
  const filteredSlides = slides.filter(
    (slide) =>
      slide.title.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
      slide.category.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
      (slide.subtitle && slide.subtitle.toLowerCase().includes(sidebarSearch.toLowerCase()))
  );

  // Check if current slide should have an Editorial "White-Canvas" light band context
  // Overridden to false to enforce the full immersive deep-sea dark theme requested by the user
  const isEditorialLightContext = false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#010a15] via-[#02182c] to-[#010912] text-[#ffffff] flex flex-col font-sans selection:bg-[#2496ed] selection:text-[#ffffff] relative overflow-hidden">
      
      {/* 60-FPS Background Interactive Spark Particle System */}
      <ParticleSystem />

      {/* Persistent Glassmorphic Study Flow & Gamification Companion */}
      <StudyMotivationCenter
        currentIdx={currentIdx}
        slidesCount={slides.length}
        bookmarkedSlides={bookmarkedSlides}
        completedLabs={completedLabs}
        activeSlideTitle={currentSlide.title}
      />

      {/* 1. Header Bar (Cinematic Navigation) */}
      <header className="bg-[#010915]/85 border-b border-[#113a5d]/65 backdrop-blur-md px-6 py-4 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            title="Toggle Navigation Menu"
            className="p-1.5 hover:bg-[#0c2336]/60 border border-transparent hover:border-[#113a5d]/60 rounded-none text-[#969696] hover:text-[#00f0ff] transition-all cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
          
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ 
                y: [0, -3, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex items-center justify-center bg-[#2496ed]/10 border border-[#2496ed]/30 p-1.5 shadow-[0_0_15px_rgba(36,150,237,0.15)]"
            >
              <span className="text-xl">🐳</span>
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xs font-bold uppercase tracking-[0.18em] text-white flex items-center gap-1">
                DOCKER DEEP SEA
              </h1>
              <p className="text-[8px] text-[#00f0ff] font-mono uppercase tracking-[0.25em] mt-0.5">
                Masterclass
              </p>
            </div>
          </div>
        </div>

        {/* Major Chapter Quick Jumper Tabs (Horizontal) - Marine Glassmorphic Sliding Layout */}
        <div className="hidden xl:flex items-center gap-1 text-xs relative">
          {categories.map((cat) => {
            const isActiveCategory = currentSlide.category === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  const firstSlideOfCat = slides.find((s) => s.category === cat.name);
                  if (firstSlideOfCat) selectSlide(firstSlideOfCat.id);
                }}
                className={`relative px-4 py-2.5 rounded-none font-mono text-[10px] tracking-[0.14em] uppercase transition-all duration-300 select-none cursor-pointer ${
                  isActiveCategory
                    ? 'text-sky-300 font-semibold drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                    : 'text-[#969696] hover:text-[#ffffff]'
                }`}
              >
                <span className="relative z-10">{cat.label}</span>
                
                {/* Underline and background pill transitions */}
                {isActiveCategory && (
                  <>
                    {/* Glassmorphic Liquid Capsule Background sliding to active */}
                    <motion.div
                      layoutId="active-category-pill"
                      className="absolute inset-0 bg-[#2496ed]/10 border-x border-[#00f0ff]/30 backdrop-blur-[2px]"
                      transition={{ type: 'spring', stiffness: 220, damping: 25 }}
                    />
                    
                    {/* Liquid Sea Underline sliding to active */}
                    <motion.div
                      layoutId="active-category-underline"
                      className="absolute bottom-0 left-2 right-2 h-[3px] bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-400 shadow-[0_1px_8px_rgba(0,240,255,0.8)]"
                      transition={{ type: 'spring', stiffness: 220, damping: 25 }}
                      style={{ borderRadius: '9999px' }}
                    >
                      {/* Fluid water droplet aesthetic at the center of the underline */}
                      <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-200 animate-pulse shadow-[0_0_6px_rgba(0,240,255,1)]" />
                    </motion.div>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-2">
          {/* Simple dynamic icon-based buttons for a highly clean look */}
          <motion.button
            whileHover={{ scale: 1.1, y: -1, color: "#ffffff", borderColor: "#2496ed" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInstructor(true)}
            className="p-2 bg-[#0c2336]/50 hover:bg-[#0c2336] text-[#969696] border border-[#113a5d]/50 rounded-none transition-all cursor-pointer flex items-center justify-center"
            title="Instructor Info"
          >
            <GraduationCap className="w-4 h-4 text-[#00f0ff]" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, y: -1, color: "#ffffff", borderColor: "#2496ed" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPdfExport(true)}
            className="p-2 bg-[#0c2336]/50 hover:bg-[#0c2336] text-[#969696] border border-[#113a5d]/50 rounded-none transition-all cursor-pointer flex items-center justify-center"
            title="Export Companion PDF"
          >
            <FileText className="w-4 h-4 text-[#00f0ff]" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, y: -1, color: "#ffffff", borderColor: "#2496ed" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMatrix(true)}
            className="p-2 bg-[#0c2336]/50 hover:bg-[#0c2336] text-[#969696] border border-[#113a5d]/50 rounded-none transition-all cursor-pointer flex items-center justify-center"
            title="Course Matrix"
          >
            <Layers className="w-4 h-4 text-sky-400" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, y: -1, color: "#ffffff", borderColor: "#2496ed" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowShortcuts(true)}
            className="p-2 bg-[#0c2336]/50 hover:bg-[#0c2336] text-[#969696] border border-[#113a5d]/50 rounded-none transition-all cursor-pointer flex items-center justify-center"
            title="Hotkeys (Shift + /)"
          >
            <HelpCircle className="w-4 h-4" />
          </motion.button>
        </div>
      </header>

      {/* 2. Main Flex Layout */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* 2.1 Sidebar Panel */}
        {isSidebarOpen && (
          <aside className="w-80 bg-[#010915]/95 border-r border-[#113a5d]/70 flex flex-col shrink-0 z-20 absolute md:relative h-[calc(100vh-77px)] shadow-2xl backdrop-blur-md">
            {/* Search filter */}
            <div className="p-4 border-b border-[#113a5d]/70 bg-[#010915]/95 sticky top-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#969696] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  placeholder="SEARCH TOPICS..."
                  className="w-full bg-[#0c2336] text-[#ffffff] border border-[#113a5d] rounded-none pl-8 pr-4 py-2 text-[10px] placeholder:text-[#969696]/60 focus:border-[#2496ed] focus:outline-none transition-all font-mono uppercase tracking-wider"
                />
                {sidebarSearch && (
                  <button
                    onClick={() => setSidebarSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#969696] hover:text-[#ffffff]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Slide Index List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-[#010915]">
              {filteredSlides.map((slide) => {
                const isSelected = slide.id === currentSlide.id;
                const isBookmarked = bookmarkedSlides.includes(slide.id);
                const hasInteractiveLab = slide.type === 'lab';
                const hasQuiz = slide.type === 'interactive-quiz';
                const isLabDone = hasInteractiveLab && slide.labDetails && completedLabs.includes(slide.labDetails.labId);

                return (
                  <button
                    key={slide.id}
                    onClick={() => selectSlide(slide.id)}
                    className={`w-full text-left p-3 rounded-none transition-all flex items-start gap-3 border ${
                      isSelected
                        ? 'bg-[#0c2336] border-l-4 border-l-[#2496ed] border-y-[#113a5d]/70 border-r-[#113a5d]/70'
                        : 'border-transparent hover:bg-[#0c2336]/30'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-none font-mono text-[10px] flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#2496ed] text-[#ffffff]' : 'bg-[#0c2336] text-[#969696]'
                    }`}>
                      {slide.id < 10 ? `0${slide.id}` : slide.id}
                    </span>
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className={`text-[8px] uppercase font-mono tracking-[0.14em] truncate block ${
                          isSelected ? 'text-[#00f0ff]' : 'text-[#969696]'
                        }`}>
                          {slide.category}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          {isBookmarked && <Bookmark className="w-2.5 h-2.5 text-[#2496ed] fill-[#2496ed]" />}
                          {isLabDone && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />}
                          {hasInteractiveLab && !isLabDone && <Terminal className="w-2.5 h-2.5 text-[#2496ed]" />}
                          {hasQuiz && <Award className="w-2.5 h-2.5 text-[#fff200]" />}
                        </div>
                      </div>
                      <h4 className={`text-xs uppercase tracking-tight font-sans truncate ${isSelected ? 'text-[#ffffff] font-medium' : 'text-[#969696] hover:text-[#ffffff]'}`}>
                        {slide.title}
                      </h4>
                    </div>
                  </button>
                );
              })}
              {filteredSlides.length === 0 && (
                <div className="text-center py-8 text-xs text-[#969696] font-mono">
                  NO SLIDES FOUND
                </div>
              )}
            </div>

            {/* Sidebar Footer stats */}
            <div className="p-4 border-t border-[#113a5d]/70 bg-[#010915] text-[9px] font-mono text-[#969696] flex justify-between items-center uppercase tracking-widest">
              <span>🫧 LABS: {completedLabs.length} / 8</span>
              <span>⚓ BOOKMARKS: {bookmarkedSlides.length}</span>
            </div>
          </aside>
        )}

        {/* 2.2 Central Display Area */}
        <main className={`flex-1 flex flex-col justify-between overflow-y-auto p-4 md:p-8 xl:p-12 space-y-6 relative transition-colors duration-300 ${
          isEditorialLightContext ? 'bg-[#ffffff] text-[#181818]' : 'bg-transparent text-[#ffffff]'
        }`}>
          
          {/* Subtle upper track styling indicator */}
          <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.16em] relative z-20">
            <span className={`${isEditorialLightContext ? 'text-[#2496ed]' : 'text-[#2496ed]'} font-bold flex items-center gap-2`}>
              <span className="w-1.5 h-1.5 bg-[#2496ed] animate-pulse"></span>
              MODULE {slides.indexOf(currentSlide) + 1} // {currentSlide.category}
            </span>
            <span className={isEditorialLightContext ? 'text-[#181818]' : 'text-[#969696]'}>
              SLIDE {currentSlide.id} OF {slides.length}
            </span>
          </div>

          {/* Progress bar line */}
          <div className="w-full bg-[#303030]/20 h-0.5 rounded-none overflow-hidden relative z-20">
            <div
              className="bg-[#2496ed] h-full transition-all duration-500"
              style={{ width: `${(currentSlide.id / slides.length) * 100}%` }}
            ></div>
          </div>

          {/* Cinematic Top Hero Image on Title slide */}
          {currentSlide.type === 'title' && (
            <div className="w-full h-48 md:h-64 overflow-hidden relative border border-[#113a5d] rounded-none shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=1200&auto=format&fit=crop"
                alt="Docker Shipping Container Vessel"
                className="w-full h-full object-cover object-center contrast-110 saturate-110 group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#010a15] via-[#010a15]/40 to-transparent"></div>
              <div className="absolute bottom-4 left-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#00f0ff] font-bold bg-[#010a15]/90 border border-[#113a5d] px-2.5 py-1 flex items-center gap-1.5">
                  <span>🫧</span> INTERACTIVE LABS & REFERENCE ARCHITECTURE ⚓
                </span>
              </div>
            </div>
          )}

          {/* Subtle ocean fluid wave sweep backdrop overlay on slide change */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`wave-sweep-${currentSlide.id}`}
              initial={{ opacity: 0, y: "40%" }}
              animate={{ 
                opacity: [0, 0.08, 0.04, 0], 
                y: ["40%", "0%", "-40%"] 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.95, ease: "easeInOut" }}
              className={`absolute inset-0 pointer-events-none z-10 select-none origin-bottom mix-blend-screen bg-gradient-to-t ${
                isEditorialLightContext 
                  ? 'from-sky-100/30 via-cyan-50/10 to-transparent' 
                  : 'from-[#2496ed]/12 via-[#00f0ff]/5 to-transparent'
              }`}
            >
              <svg className="absolute bottom-0 left-0 w-full h-24 text-cyan-400/5 fill-current" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path d="M0,160C180,186.7,360,213,540,202.7C720,192,900,144,1080,128C1260,112,1440,128,1440,128L1440,320L1260,320C1080,320,900,320,720,320C540,320,360,320,180,320L0,320Z"></path>
              </svg>
            </motion.div>
          </AnimatePresence>

          {/* Core Content Presentation Block */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ 
                opacity: 0, 
                y: 12
              }}
              animate={{ 
                opacity: 1,
                y: 0
              }}
              exit={{ 
                opacity: 0,
                y: -12
              }}
              transition={{ 
                duration: 0.35, 
                ease: [0.215, 0.610, 0.355, 1.000] // Decelerating cubic bezier for premium fluid feeling
              }}
              className="flex-1 flex flex-col justify-center max-w-5xl w-full mx-auto relative z-20"
            >
            <div className={`p-6 md:p-10 space-y-6 rounded-none relative border ${
              isEditorialLightContext 
                ? 'bg-[#ffffff] border-[#d2d2d2]' 
                : 'liquid-glass corner-box'
            }`}>
              {/* Bottom corner edge elements */}
              {!isEditorialLightContext && <div className="corner-box-bottom" />}
              
              {/* Bookmark clicker on active slide */}
              <button
                onClick={() => toggleBookmark(currentSlide.id)}
                className={`absolute top-6 right-6 p-2 rounded-none transition-colors z-10 border ${
                  isEditorialLightContext
                    ? 'bg-white hover:bg-[#f7f7f7] border-[#d2d2d2] text-[#181818]'
                    : 'bg-[#010915] hover:bg-[#0c2336] border-[#113a5d] text-[#969696] hover:text-[#ffffff]'
                } cursor-pointer`}
                title="Bookmark slide (B)"
              >
                <Bookmark className={`w-4 h-4 ${bookmarkedSlides.includes(currentSlide.id) ? 'text-[#2496ed] fill-[#2496ed]' : ''}`} />
              </button>

              {/* Title Section (Luxury Editorial Style) */}
              <div className="mb-6">
                <div className="flex items-baseline gap-4 md:gap-6">
                  <h1 className="text-4xl md:text-6xl font-mono tracking-tight text-[#00f0ff] leading-none select-none drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                    {currentSlide.id < 10 ? `0${currentSlide.id}` : currentSlide.id}
                  </h1>
                  <div className="space-y-1">
                    <h2 className={`text-xl md:text-3xl uppercase tracking-tight leading-tight ${
                      isEditorialLightContext ? 'text-[#181818]' : 'text-[#ffffff]'
                    } font-medium`}>
                      {currentSlide.title}
                    </h2>
                    {currentSlide.subtitle && (
                      <p className="text-[#00f0ff] text-[10px] md:text-xs font-mono uppercase tracking-[0.16em]">
                        {currentSlide.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <div className="h-[1px] w-24 bg-[#2496ed] mt-4"></div>
              </div>

              {/* DYNAMIC CONTENT TYPE RENDERERS */}
              <div className="space-y-6">
                {flashcardMode && !isRevealed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    onClick={() => setIsRevealed(true)}
                    className="group relative cursor-pointer overflow-hidden border border-dashed border-[#113a5d] hover:border-[#00f0ff]/80 bg-[#010915]/80 p-8 md:p-12 text-center transition-all duration-300 shadow-[0_0_20px_rgba(36,150,237,0.05)] hover:shadow-[0_0_35px_rgba(0,240,255,0.2)] flex flex-col items-center justify-center min-h-[340px] select-none"
                  >
                    {/* Corner decorative indicators */}
                    <div className="absolute top-3 left-3 text-[9px] font-mono text-[#113a5d] group-hover:text-[#00f0ff] transition-colors uppercase tracking-wider">⚡ STNDBY // STUDY.LOG</div>
                    <div className="absolute top-3 right-3 text-[9px] font-mono text-[#113a5d] group-hover:text-[#00f0ff] transition-colors uppercase tracking-wider">CARD ID-{(currentSlide.id < 10) ? `0${currentSlide.id}` : currentSlide.id}</div>
                    
                    {/* Glowing background blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2496ed]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00f0ff]/10 transition-colors duration-500" />
                    
                    <div className="relative z-10 space-y-6 max-w-lg mx-auto">
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#2496ed] to-[#00f0ff] opacity-40 blur-sm group-hover:opacity-100 group-hover:blur animate-pulse transition-all duration-500" />
                          <div className="relative bg-[#020f1f] border border-[#113a5d] group-hover:border-[#00f0ff] p-5 rounded-full transition-colors duration-300">
                            <EyeOff className="w-8 h-8 text-[#00f0ff] animate-bounce" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#00f0ff] font-bold block">
                          🎴 FLASHCARD ACTIVE
                        </span>
                        <h3 className="text-[#ffffff] text-lg md:text-xl font-mono uppercase tracking-wide font-semibold">
                          Recall details for:
                        </h3>
                        <p className="text-base md:text-lg text-[#00f0ff] font-bold underline decoration-dotted underline-offset-4 font-mono uppercase tracking-wider">
                          {currentSlide.title}
                        </p>
                        <p className="text-xs text-[#969696] leading-relaxed max-w-md mx-auto pt-2 font-sans">
                          Test your memory! Explain this concept or identify key terminal commands/terminology in your mind, then click anywhere on this card or press Spacebar to flip.
                        </p>
                      </div>

                      <div className="pt-4">
                        <span className="inline-block px-6 py-3 bg-[#2496ed]/10 border border-[#2496ed] text-[#2496ed] font-mono text-xs uppercase tracking-widest transition-all duration-300 group-hover:bg-[#2496ed] group-hover:text-white group-hover:shadow-[0_0_15px_rgba(36,150,237,0.4)]">
                          CLICK TO FLIP CARD 🔄
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {flashcardMode && isRevealed && (
                      <div className="flex justify-between items-center bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-4 py-2.5 mb-4 relative overflow-hidden transition-all">
                        <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff] uppercase tracking-wider">
                          <Eye className="w-3.5 h-3.5 text-[#00f0ff] animate-pulse" />
                          <span>✨ Flashcard Answer Revealed</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsRevealed(false)}
                          className="px-3 py-1 bg-[#010915] hover:bg-[#0c2336] border border-[#113a5d] text-[#00f0ff] hover:text-[#ffffff] text-[9px] font-mono uppercase tracking-widest transition-all cursor-pointer"
                        >
                          🙈 Mask Slide Again
                        </button>
                      </div>
                    )}

                    {/* 1. Title Slide Layout */}
                    {currentSlide.type === 'title' && (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-2">
                        <div className="md:col-span-7 space-y-4">
                          {currentSlide.contentParagraphs?.map((p, idx) => (
                            <p key={idx} className={`text-sm md:text-base leading-relaxed font-sans ${
                              isEditorialLightContext ? 'text-[#181818]' : 'text-[#c2d6e8]'
                            }`}>
                              {p}
                            </p>
                          ))}
                          <div className="flex flex-wrap gap-2 pt-2">
                            <span className="px-3 py-1.5 bg-[#0c2336]/60 border border-[#113a5d] text-xs font-mono rounded-none uppercase tracking-wider text-[#00f0ff] flex items-center gap-1.5">
                              <span>🐙</span> Jargon-free Analogies
                            </span>
                            <span className="px-3 py-1.5 bg-[#0c2336]/60 border border-[#113a5d] text-xs font-mono rounded-none uppercase tracking-wider text-[#00f0ff] flex items-center gap-1.5">
                              <span>🐳</span> 5 Comprehensive Labs
                            </span>
                            <span className="px-3 py-1.5 bg-[#0c2336]/60 border border-[#113a5d] text-xs font-mono rounded-none uppercase tracking-wider text-[#00f0ff] flex items-center gap-1.5">
                              <span>⚓</span> Command Cheat Sheets
                            </span>
                          </div>
                        </div>

                        <div className="md:col-span-5 border border-[#113a5d] bg-[#010915]/60 p-6 rounded-none flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden group shadow-[0_0_15px_rgba(36,150,237,0.1)]">
                          <Terminal className="w-8 h-8 text-[#00f0ff]" />
                          <div className="space-y-1">
                            <h4 className="font-mono text-[10px] text-[#ffffff] font-bold uppercase tracking-widest">🫧 Tutorial Sandbox ⚓</h4>
                            <p className="text-xs text-[#969696]">Jump directly to our interactive lab environment.</p>
                          </div>
                          <button
                            onClick={() => selectSlide(17)} // Jump to Lab 1
                            className="w-full py-3 bg-[#2496ed] hover:bg-[#1d82ce] text-[#ffffff] font-mono text-xs uppercase tracking-[0.14em] rounded-none transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            LAUNCH LABS 🐳
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 2. Text / Analogy Slide Layout */}
                    {currentSlide.type === 'text-content' && (
                      <div className="space-y-6">
                        {/* Analogy toggle header if exists */}
                        {currentSlide.analogy && (
                          <div className={`border p-5 space-y-4 rounded-none ${
                            isEditorialLightContext 
                              ? 'bg-[#f7f7f7] border-[#d2d2d2] text-[#181818]' 
                              : 'bg-[#010915] border-[#113a5d] text-[#ffffff] shadow-[0_0_12px_rgba(0,240,255,0.04)]'
                          }`}>
                            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
                              <div className="flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-[#00f0ff]" />
                                <h4 className="font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
                                  <span>🐚</span> {currentSlide.analogy.title}
                                </h4>
                              </div>
                              
                              <button
                                onClick={() => setJargonFreeMode((prev) => !prev)}
                                className={`px-4 py-2 rounded-none text-[10px] font-mono uppercase tracking-[0.14em] transition-all border cursor-pointer ${
                                  jargonFreeMode
                                    ? 'bg-[#2496ed] text-[#ffffff] border-[#2496ed] shadow-[0_0_8px_rgba(36,150,237,0.4)]'
                                    : 'bg-[#0c2336] border-[#113a5d] text-[#969696] hover:text-[#ffffff]'
                                }`}
                                title="Shortcut (J)"
                              >
                                {jargonFreeMode ? '🫧 ANALOGY ACTIVE' : '🔓 UNLOCK JARGON-FREE'}
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                              <div className="md:col-span-4 bg-[#0c2336] text-[#ffffff] p-4 rounded-none flex flex-col justify-between border border-[#113a5d]">
                                <span className="text-[8px] text-[#00f0ff] font-mono uppercase tracking-widest font-semibold">🐳 CONCEPT:</span>
                                <span className="text-[#00f0ff] font-mono font-bold text-sm mt-1">{currentSlide.analogy.jargonWord}</span>
                              </div>
                              <div className={`md:col-span-8 p-4 rounded-none leading-relaxed font-sans text-xs md:text-sm border ${
                                isEditorialLightContext 
                                  ? 'bg-white border-[#d2d2d2]' 
                                  : 'bg-[#010915]/60 border-[#113a5d]'
                              }`}>
                                {jargonFreeMode ? (
                                  <p>{currentSlide.analogy.simpleAnalogy}</p>
                                ) : (
                                  <p className="font-mono text-[11px] text-[#c2d6e8]">
                                    <span className="text-[#00f0ff] uppercase tracking-widest block text-[8px] mb-1 font-semibold">TECHNICAL EXPLANATION:</span> {currentSlide.analogy.technicalReality}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Bullet Points in 2-up design grid */}
                        {currentSlide.bullets && (
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentSlide.bullets.map((bullet, idx) => {
                              const parts = bullet.split(':');
                              const title = parts[0];
                              const desc = parts.slice(1).join(':');

                              return (
                                <li key={idx} className={`p-4 border rounded-none space-y-1 ${
                                  isEditorialLightContext 
                                    ? 'bg-[#f7f7f7] border-[#d2d2d2]' 
                                    : 'bg-[#010915]/50 border-[#113a5d] shadow-[0_0_10px_rgba(0,240,255,0.03)]'
                                }`}>
                                  <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#00f0ff] block font-semibold flex items-center gap-1.5">
                                    <span>🧊</span> {title}
                                  </span>
                                  {desc && (
                                    <p className={`text-xs leading-relaxed ${
                                      isEditorialLightContext ? 'text-[#181818]' : 'text-[#c2d6e8]'
                                    }`}>
                                      {desc.trim()}
                                    </p>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}

                        {/* Associated visual diagram if exists */}
                        {currentSlide.diagramId && <VisualDiagrams diagramId={currentSlide.diagramId} />}
                      </div>
                    )}

                    {/* 3. Comparison Grid Slide Layout */}
                    {currentSlide.type === 'comparison' && currentSlide.comparisonData && (
                      <div className="overflow-x-auto border border-[#113a5d] rounded-none bg-[#010915]">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-[#0c2336] border-b border-[#113a5d] text-[9px] font-mono uppercase text-[#00f0ff] tracking-widest">
                              <th className="p-4">Key Attribute</th>
                              <th className="p-4 text-cyan-400">Virtual Machine (VM)</th>
                              <th className="p-4 text-[#2496ed]">Docker Container</th>
                              <th className="p-4 text-center">Winner</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#113a5d]/70 text-[#c2d6e8]">
                            {currentSlide.comparisonData.map((row, idx) => (
                              <tr key={idx} className="hover:bg-[#0c2336]/40 transition-colors">
                                <td className="p-4 font-bold text-[#ffffff] uppercase font-sans">{row.feature}</td>
                                <td className="p-4 leading-relaxed text-slate-300">{row.vm}</td>
                                <td className="p-4 leading-relaxed text-slate-300">{row.container}</td>
                                <td className="p-4 text-center">
                                  <span className={`px-3 py-1 rounded-none font-mono text-[9px] font-bold uppercase tracking-wider ${
                                    row.winner === 'Container'
                                      ? 'bg-[#2496ed] text-[#ffffff] shadow-[0_0_8px_rgba(36,150,237,0.3)]'
                                      : row.winner === 'VM'
                                      ? 'bg-cyan-800 text-[#ffffff]'
                                      : 'bg-[#0c2336] text-[#969696]'
                                  }`}>
                                    {row.winner}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* 4. Interactive Diagram Showcase slide Layout */}
                    {currentSlide.type === 'diagram' && currentSlide.diagramId && (
                      <div className="space-y-4">
                        <VisualDiagrams diagramId={currentSlide.diagramId} />
                        {currentSlide.bullets && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                            {currentSlide.bullets.map((b, bIdx) => (
                              <div key={bIdx} className={`p-4 border rounded-none leading-relaxed ${
                                isEditorialLightContext 
                                  ? 'bg-[#f7f7f7] border-[#d2d2d2] text-[#181818]' 
                                  : 'bg-[#010915]/60 border-[#113a5d] text-[#c2d6e8]'
                              }`}>
                                {b}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 5. Interactive Laboratory Terminal Sandbox Layout */}
                    {currentSlide.type === 'lab' && currentSlide.labDetails && (
                      <TerminalSimulator
                        labDetails={currentSlide.labDetails}
                        onLabComplete={() => handleLabCompleted(currentSlide.labDetails!.labId)}
                      />
                    )}

                    {/* 6. Fully Documented Commands Cheat-sheet Layout */}
                    {currentSlide.type === 'cheatsheet' && currentSlide.cheatSheetDetails && (
                      <CheatSheetDetailsView initialCategory={currentSlide.cheatSheetDetails.categoryName} />
                    )}

                    {/* 7. Interactive Quiz Layout */}
                    {currentSlide.type === 'interactive-quiz' && currentSlide.quizDetails && (
                      <QuizWidget quizDetails={currentSlide.quizDetails} />
                    )}

                    {/* 8. Curated Production Resources Layout */}
                    {currentSlide.type === 'resources' && (
                      <ResourcesView />
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

          {/* 3. Footer controls */}
          <footer className="pt-6 border-t border-[#113a5d]/60 flex flex-col md:flex-row justify-between items-center gap-4 max-w-5xl w-full mx-auto relative z-20">
            {/* Left Nav Controls */}
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className={`px-4 py-3 border disabled:opacity-35 text-xs font-mono uppercase tracking-[0.14em] rounded-none transition-all flex items-center gap-1.5 ${
                  isEditorialLightContext
                    ? 'bg-white hover:bg-[#f7f7f7] border-[#d2d2d2] text-[#181818] disabled:hover:bg-white'
                    : 'bg-[#010915] hover:bg-[#0c2336] border-[#113a5d] text-[#ffffff] disabled:hover:bg-[#010915]'
                } cursor-pointer`}
                title="Keyboard: Left Arrow"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>⬅️ PREV</span>
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentIdx === slides.length - 1}
                className="px-6 py-3 bg-[#2496ed] hover:bg-[#1d82ce] disabled:opacity-35 disabled:hover:bg-[#2496ed] text-[#ffffff] font-mono uppercase tracking-[0.14em] rounded-none text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(36,150,237,0.3)]"
                title="Keyboard: Right Arrow or Space"
              >
                NEXT MODULE ➡️
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick action toggles */}
            <div className="flex flex-wrap gap-2 text-xs justify-center md:justify-end">
              <button
                onClick={() => setFlashcardMode((prev) => !prev)}
                className={`px-4 py-2.5 border rounded-none font-mono text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                  flashcardMode
                    ? 'bg-[#00f0ff] border-[#00f0ff] text-[#010915] font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)] hover:bg-[#00d0dd]'
                    : isEditorialLightContext
                    ? 'bg-white border-[#d2d2d2] text-[#181818] hover:bg-[#f7f7f7]'
                    : 'bg-[#010915] border-[#113a5d] text-[#00f0ff] hover:text-[#ffffff] hover:bg-[#0c2336]'
                } cursor-pointer`}
                title="Toggle Flashcard Mode (F)"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>🎴 FLASHCARDS: {flashcardMode ? 'ON (STUDY)' : 'OFF'}</span>
              </button>

              <button
                onClick={() => setShowSpeakerNotes((prev) => !prev)}
                className={`px-4 py-2.5 border rounded-none font-mono text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                  showSpeakerNotes
                    ? 'bg-[#2496ed] border-[#2496ed] text-white shadow-[0_0_10px_rgba(36,150,237,0.4)]'
                    : isEditorialLightContext
                    ? 'bg-white border-[#d2d2d2] text-[#181818] hover:bg-[#f7f7f7]'
                    : 'bg-[#010915] border-[#113a5d] text-[#00f0ff] hover:text-[#ffffff] hover:bg-[#0c2336]'
                } cursor-pointer`}
                title="Toggle Speaker Notes (S)"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>SPEAKER TRACKS: {showSpeakerNotes ? '🔊 ON' : '🔇 OFF'}</span>
              </button>
            </div>
          </footer>

          {/* 4. Collapsible Presentation Companion Talk Tracks */}
          {showSpeakerNotes && currentSlide.speakerNotes && (
            <div className={`max-w-5xl w-full mx-auto border p-5 space-y-2 z-10 rounded-none ${
              isEditorialLightContext
                ? 'bg-[#f7f7f7] border-[#d2d2d2] text-[#181818]'
                : 'bg-[#0c2336]/30 border-[#113a5d]/60 text-[#c2d6e8] backdrop-blur-md'
            }`}>
              <div className="flex items-center gap-2 border-b border-[#113a5d]/30 pb-2">
                <FileCode className="w-4 h-4 text-[#00f0ff]" />
                <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-[#00f0ff]">
                  🫧 SPEAKER COMPANION TALK TRACKS (EDUCATIONAL PROMPT) 🐙
                </span>
              </div>
              <p className={`text-xs leading-relaxed italic font-sans`}>
                "{currentSlide.speakerNotes}"
              </p>
            </div>
          )}

        </main>
      </div>

      {/* 5. MODAL 1: Keyboard shortcuts guide */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#010915] border border-[#113a5d] rounded-none p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowShortcuts(false)}
              className="absolute top-4 right-4 p-1 text-[#969696] hover:text-[#ffffff] hover:bg-[#0c2336]"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="space-y-1">
              <h4 className="text-[#ffffff] font-medium text-sm uppercase tracking-widest font-mono">Keyboard Navigation</h4>
              <p className="text-[11px] text-[#969696]">Instantly fly through the luxury-precision deck.</p>
            </div>

            <div className="divide-y divide-[#113a5d]/70 text-[10px] font-mono text-[#969696]">
              <div className="flex justify-between py-2">
                <span>NEXT MODULE</span>
                <span className="px-2 py-0.5 bg-[#0c2336] text-[#00f0ff] rounded-none border border-[#113a5d]">RIGHT ARROW / SPACE</span>
              </div>
              <div className="flex justify-between py-2">
                <span>PREV MODULE</span>
                <span className="px-2 py-0.5 bg-[#0c2336] text-[#00f0ff] rounded-none border border-[#113a5d]">LEFT ARROW</span>
              </div>
              <div className="flex justify-between py-2">
                <span>SPEAKER TALK TRACK</span>
                <span className="px-2 py-0.5 bg-[#0c2336] text-[#00f0ff] rounded-none border border-[#113a5d]">S</span>
              </div>
              <div className="flex justify-between py-2">
                <span>JARGON-FREE MODE</span>
                <span className="px-2 py-0.5 bg-[#0c2336] text-[#00f0ff] rounded-none border border-[#113a5d]">J</span>
              </div>
              <div className="flex justify-between py-2">
                <span>FLASHCARD MODE</span>
                <span className="px-2 py-0.5 bg-[#0c2336] text-[#00f0ff] rounded-none border border-[#113a5d]">F</span>
              </div>
              <div className="flex justify-between py-2">
                <span>BOOKMARK ACTIVE</span>
                <span className="px-2 py-0.5 bg-[#0c2336] text-[#00f0ff] rounded-none border border-[#113a5d]">B</span>
              </div>
              <div className="flex justify-between py-2">
                <span>CURRICULUM MATRIX</span>
                <span className="px-2 py-0.5 bg-[#0c2336] text-[#00f0ff] rounded-none border border-[#113a5d]">M</span>
              </div>
            </div>

            <button
              onClick={() => setShowShortcuts(false)}
              className="w-full py-3 bg-[#2496ed] hover:bg-[#1d82ce] text-white font-medium uppercase tracking-[0.14em] font-mono text-xs rounded-none transition-all cursor-pointer"
            >
              CLOSE GUIDE
            </button>
          </div>
        </div>
      )}

      {/* 6. MODAL 2: Slide Matrix Dashboard (Curriculum Overview) */}
      {showMatrix && (
        <div className="fixed inset-0 bg-[#010915]/98 z-50 p-6 md:p-12 overflow-y-auto flex flex-col justify-between backdrop-blur-md">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#113a5d] pb-4">
              <div className="space-y-1">
                <h3 className="text-[#ffffff] font-medium text-lg md:text-xl uppercase tracking-widest flex items-center gap-3">
                  <Layers className="w-5 h-5 text-[#00f0ff]" />
                  Curriculum Matrix Dashboard 🗺️
                </h3>
                <p className="text-xs text-[#969696]">
                  A high-level inspection grid showing all {slides.length} slides in sequential order. Click on any slide card to jump.
                </p>
              </div>

              <button
                onClick={() => setShowMatrix(false)}
                className="px-4 py-2 bg-[#0c2336] border border-[#113a5d] hover:bg-[#2496ed] hover:border-[#2496ed] text-[#ffffff] rounded-none transition-all font-mono text-xs flex items-center gap-2 cursor-pointer uppercase tracking-[0.14em]"
                title="Press Esc or Click to return"
              >
                <X className="w-4 h-4" />
                <span>EXIT MATRIX 🗺️</span>
              </button>
            </div>

            {/* Matrix grid cells */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {slides.map((slide) => {
                const isSelected = slide.id === currentSlide.id;
                const isBookmarked = bookmarkedSlides.includes(slide.id);
                const isLab = slide.type === 'lab';
                const isLabDone = isLab && slide.labDetails && completedLabs.includes(slide.labDetails.labId);
                const isQuiz = slide.type === 'interactive-quiz';

                return (
                  <button
                    key={slide.id}
                    onClick={() => selectSlide(slide.id)}
                    className={`p-4 text-left rounded-none border flex flex-col justify-between h-32 relative group transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#0c2336] border-2 border-[#2496ed] scale-[1.02] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                        : 'bg-[#010915] border-[#113a5d]/70 hover:border-[#00f0ff] hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className={`w-6 h-6 rounded-none font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#2496ed] text-[#ffffff]' : 'bg-[#0c2336] text-[#969696]'
                      }`}>
                        {slide.id < 10 ? `0${slide.id}` : slide.id}
                      </span>
                      <div className="flex items-center gap-1 text-[10px]">
                        {isBookmarked && <Bookmark className="w-3 h-3 text-[#2496ed] fill-[#2496ed]" />}
                        {isLabDone && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {isLab && !isLabDone && <Terminal className="w-3 h-3 text-[#2496ed]" />}
                        {isQuiz && <Award className="w-3 h-3 text-[#fff200]" />}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className={`text-[8px] uppercase tracking-widest font-mono block ${
                        isSelected ? 'text-[#00f0ff] font-bold' : 'text-[#969696]'
                      }`}>
                        {slide.category}
                      </span>
                      <h4 className={`text-[11px] font-medium uppercase tracking-tight line-clamp-2 leading-snug ${
                        isSelected ? 'text-[#ffffff] font-medium' : 'text-[#969696]'
                      }`}>
                        {slide.title}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#113a5d]/60 pt-6 mt-8 flex justify-center text-[9px] font-mono text-[#969696] uppercase tracking-widest">
            COURSESYLLABUS • ALL RIGHTS RESERVED • ⚓ DOCKER & CONTAINERS MASTERCLASS 2026 🌊
          </div>
        </div>
      )}



      {/* 9. About Instructor Overlay */}
      {showInstructor && (
        <InstructorModal
          onClose={() => setShowInstructor(false)}
        />
      )}

      {/* 10. PDF Export overlay */}
      {showPdfExport && (
        <PdfExportModal
          slides={slides}
          currentIdx={currentIdx}
          onClose={() => setShowPdfExport(false)}
        />
      )}

    </div>
  );
}
