import React, { useState } from 'react';
import { Check, X, Award, RotateCcw, ShieldCheck, BookOpen } from 'lucide-react';
import { QuizDetail, QuizQuestion } from '../types';

interface QuizWidgetProps {
  quizDetails: QuizDetail;
}

export const QuizWidget: React.FC<QuizWidgetProps> = ({ quizDetails }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(quizDetails.questions.length).fill(null));

  const activeQuestion: QuizQuestion = quizDetails.questions[currentIdx];

  const handleOptionSelect = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;

    setIsAnswered(true);
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentIdx] = selectedOption;
    setUserAnswers(updatedAnswers);

    if (selectedOption === activeQuestion.correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentIdx < quizDetails.questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setShowCertificate(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowCertificate(false);
    setUserAnswers(new Array(quizDetails.questions.length).fill(null));
  };

  const getRankAndDescription = (finalScore: number) => {
    const percentage = (finalScore / quizDetails.questions.length) * 100;
    if (percentage === 100) {
      return {
        rank: 'Master Container Architect',
        desc: 'Incredible! You possess total mastery over container runtimes, namespaces, volumes, and deployment architectures.',
        colorClass: 'text-amber-400 bg-amber-950/20 border-amber-800',
        badge: '🏆'
      };
    } else if (percentage >= 75) {
      return {
        rank: 'Senior Kubernetes Sailor',
        desc: 'Great job! You clearly understand how Docker isolates applications and know how to orchestrate multi-container services.',
        colorClass: 'text-emerald-400 bg-emerald-950/20 border-emerald-800',
        badge: '⚓'
      };
    } else if (percentage >= 50) {
      return {
        rank: 'Apprentice Dock Worker',
        desc: 'Passed! You understand the foundational differences between VMs and Docker. A bit more practice with the commands and you will be sailing.',
        colorClass: 'text-cyan-400 bg-cyan-950/20 border-cyan-800',
        badge: '🔧'
      };
    } else {
      return {
        rank: 'Cabin Boy (Deck Swabber)',
        desc: 'Keep learning! Review the jargon-free analogies and spend a little more time experimenting in our guided interactive labs.',
        colorClass: 'text-rose-400 bg-rose-950/20 border-rose-800',
        badge: '🧹'
      };
    }
  };

  const rankInfo = getRankAndDescription(score);

  if (showCertificate) {
    return (
      <div className="bg-[#010915] border-2 border-[#113a5d] rounded-none p-8 max-w-2xl mx-auto text-center space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex justify-center">
          <div className="relative">
            <Award className="w-16 h-16 text-[#2496ed] animate-bounce" />
            <span className="absolute -top-1 -right-2 text-2xl">{rankInfo.badge}</span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-[0.16em] text-[#00f0ff] uppercase font-bold block">
            🫧 MASTERCLASS GRADUATE 🐳
          </span>
          <h4 className="text-[#ffffff] font-medium text-2xl uppercase tracking-tight">
            Docker & Containerization Certificate
          </h4>
          <p className="text-[#969696] text-xs max-w-md mx-auto leading-relaxed">
            This certifies that you have completed all modules, interactive terminals, and successfully passed the diagnostic evaluation.
          </p>
        </div>

        {/* Certificate Credential info */}
        <div className={`border rounded-none p-6 ${rankInfo.colorClass} text-center space-y-2`}>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest block opacity-75">Achieved Rank:</span>
          <h5 className="font-mono text-[#ffffff] text-lg font-medium tracking-wider uppercase">{rankInfo.rank}</h5>
          <p className="text-xs leading-relaxed max-w-md mx-auto pt-1">{rankInfo.desc}</p>
        </div>

        {/* Score tracker */}
        <div className="flex justify-center items-center gap-6 text-sm font-mono text-[#969696] border-y border-[#113a5d]/60 py-4">
          <div className="text-center">
            <span className="block text-[#969696] text-[8px] uppercase tracking-wider">TOTAL SCORE</span>
            <span className="text-lg font-bold text-[#ffffff]">{score} / {quizDetails.questions.length}</span>
          </div>
          <div className="h-8 w-px bg-[#113a5d]/60"></div>
          <div className="text-center">
            <span className="block text-[#969696] text-[8px] uppercase tracking-wider">PERCENTAGE</span>
            <span className="text-lg font-bold text-[#ffffff]">{(score / quizDetails.questions.length) * 100}%</span>
          </div>
          <div className="h-8 w-px bg-[#113a5d]/60"></div>
          <div className="text-center">
            <span className="block text-[#969696] text-[8px] uppercase tracking-wider">VERIFIED ID</span>
            <span className="text-xs font-mono text-[#2496ed] font-bold">#DKR-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
        </div>

        <div className="pt-4 flex justify-center gap-4">
          <button
            onClick={handleResetQuiz}
            className="flex items-center gap-2 px-6 py-3 bg-[#2496ed] hover:bg-[#1d82ce] text-white font-mono text-xs rounded-none font-bold uppercase tracking-[0.14em] transition-all cursor-pointer shadow-[0_0_10px_rgba(36,150,237,0.3)]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            TRY QUIZ AGAIN ⚓
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#031321]/75 border border-[#113a5d] rounded-none p-6 space-y-6 shadow-2xl max-w-2xl mx-auto backdrop-blur-md">
      {/* Quiz Header */}
      <div className="flex justify-between items-center pb-4 border-b border-[#113a5d]/60 flex-col sm:flex-row gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#2496ed]" />
          <h5 className="font-bold text-xs text-[#ffffff] font-mono uppercase tracking-[0.14em]">
            {quizDetails.title.toUpperCase()}
          </h5>
        </div>
        <span className="text-xs font-mono text-[#969696] uppercase tracking-wider">
          Question <strong className="text-[#ffffff]">{currentIdx + 1}</strong> of {quizDetails.questions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#010915] h-1 rounded-none overflow-hidden">
        <div
          className="bg-[#2496ed] h-full transition-all duration-300 shadow-[0_0_6px_rgba(36,150,237,0.5)]"
          style={{ width: `${((currentIdx + 1) / quizDetails.questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Text */}
      <div className="space-y-2">
        <h4 className="text-[#ffffff] font-medium text-md leading-relaxed">
          {activeQuestion.question}
        </h4>
      </div>

      {/* Options Cards */}
      <div className="grid grid-cols-1 gap-3">
        {activeQuestion.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === activeQuestion.correctAnswerIndex;
          
          let cardStyle = 'bg-[#010915]/60 border-[#113a5d]/70 text-[#c2d6e8] hover:border-[#00f0ff] hover:text-[#ffffff]';
          if (isSelected) {
            cardStyle = 'bg-[#0c2336] border-2 border-[#2496ed] text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.15)]';
          }
          if (isAnswered) {
            if (isCorrect) {
              cardStyle = 'bg-emerald-950/20 border-2 border-emerald-500 text-emerald-400 font-bold';
            } else if (isSelected) {
              cardStyle = 'bg-red-950/20 border-2 border-red-500 text-red-400 font-bold';
            } else {
              cardStyle = 'bg-[#010915]/10 border-[#113a5d]/20 text-[#c2d6e8]/30 opacity-40';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              disabled={isAnswered}
              className={`p-4 rounded-none border text-left text-xs transition-all flex items-start gap-3.5 w-full cursor-pointer disabled:cursor-not-allowed ${cardStyle}`}
            >
              <div className="mt-0.5 shrink-0">
                {isAnswered && isCorrect ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : isAnswered && isSelected ? (
                  <X className="w-4 h-4 text-red-400" />
                ) : (
                  <span className={`w-5 h-5 rounded-none flex items-center justify-center font-mono text-[9px] font-bold border ${
                    isSelected ? 'bg-[#2496ed] border-[#2496ed] text-white' : 'border-[#113a5d]/60 text-[#969696]'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                )}
              </div>
              <span className="leading-relaxed">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Answer feedback section */}
      {isAnswered && (
        <div className="bg-[#010915] border border-[#113a5d] p-5 rounded-none space-y-2 animate-fadeIn shadow-2xl">
          <div className="flex items-center gap-2">
            {selectedOption === activeQuestion.correctAnswerIndex ? (
              <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5 font-mono uppercase tracking-[0.14em] bg-emerald-950/40 px-2.5 py-1 border border-emerald-800">
                <ShieldCheck className="w-4 h-4" /> CORRECT! 🐠
              </span>
            ) : (
              <span className="text-red-400 font-bold text-xs flex items-center gap-1.5 font-mono uppercase tracking-[0.14em] bg-red-950/40 px-2.5 py-1 border border-red-800">
                <X className="w-4 h-4" /> INCORRECT 🫧
              </span>
            )}
          </div>
          <p className="text-[#969696] text-xs leading-relaxed">
            {activeQuestion.explanation}
          </p>
        </div>
      )}

      {/* Navigation and Submit Buttons */}
      <div className="pt-4 border-t border-[#113a5d]/60 flex justify-end gap-3 mt-4">
        {!isAnswered ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            className="px-6 py-3 bg-[#2496ed] hover:bg-[#1d82ce] disabled:opacity-40 text-white font-mono text-xs rounded-none font-bold uppercase tracking-[0.14em] transition-all cursor-pointer shadow-[0_0_8px_rgba(36,150,237,0.3)]"
          >
            SUBMIT ANSWER
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-6 py-3 bg-[#0c2336] border border-[#113a5d] hover:bg-[#2496ed] text-white font-mono text-xs rounded-none font-bold uppercase tracking-[0.14em] transition-all cursor-pointer"
          >
            {currentIdx < quizDetails.questions.length - 1 ? 'NEXT QUESTION ➡️' : 'FINISH QUIZ 🏆'}
          </button>
        )}
      </div>
    </div>
  );
};
