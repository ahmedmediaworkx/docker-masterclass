import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle, Sparkles, AlertCircle, Settings, Sliders, Printer } from 'lucide-react';
import { Slide } from '../types';
import { jsPDF } from 'jspdf';
import { VisualDiagrams } from './VisualDiagrams';

interface PdfExportModalProps {
  slides: Slide[];
  currentIdx: number;
  onClose: () => void;
}

type ThemePreset = 'cyber-dark' | 'clean-light' | 'editorial';

function SlidePrintLayout({ slide, includeQuizAnswers }: { slide: Slide; includeQuizAnswers: boolean }) {
  return (
    <div id="slide-print-section-root" className="hidden print:block bg-white text-slate-800 p-12 min-h-screen">
      {/* Printable Header */}
      <div className="flex justify-between items-center border-b border-slate-300 pb-4 mb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-blue-600 font-bold block">
            DOCKER MASTERCLASS SERIES // HANDOUT SLIDE
          </span>
          <span className="text-xs font-sans text-slate-500 block uppercase mt-0.5">
            Instructor: Ahmed Wael (Cloud Engineer & System Admin)
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-400 block">
            SLIDE {slide.id} // {slide.category.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-sans font-bold text-slate-900 leading-tight">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className="text-blue-600 text-sm font-mono uppercase tracking-wider mt-1">
            {slide.subtitle}
          </p>
        )}
        <div className="h-0.5 w-16 bg-blue-500 mt-4"></div>
      </div>

      {/* Main Content Areas */}
      <div className="space-y-6 text-sm">
        {/* Paragraphs if any */}
        {slide.contentParagraphs && slide.contentParagraphs.length > 0 && (
          <div className="space-y-3 text-slate-700 leading-relaxed font-sans">
            {slide.contentParagraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        )}

        {/* Analogy details if any */}
        {slide.analogy && (
          <div className="border border-slate-200 bg-slate-50 p-5 rounded-none space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <span className="text-xs font-mono font-bold tracking-widest uppercase">
                🐚 JARGON-FREE ANALOGY: {slide.analogy.title.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4 bg-slate-100 p-4 rounded-none border border-slate-200">
                <span className="text-[8px] text-blue-600 font-mono uppercase tracking-widest font-semibold block">CONCEPT:</span>
                <span className="text-slate-900 font-mono font-bold text-sm mt-1 block">{slide.analogy.jargonWord}</span>
              </div>
              <div className="md:col-span-8 p-4 rounded-none leading-relaxed font-sans text-xs border bg-white border-slate-200">
                <p className="mb-2"><strong>Analogy:</strong> {slide.analogy.simpleAnalogy}</p>
                <p className="font-mono text-[11px] text-slate-500 border-t border-slate-100 pt-2 mt-2">
                  <span className="text-slate-700 font-sans font-semibold uppercase tracking-widest block text-[8px] mb-1">TECHNICAL REALITY:</span> {slide.analogy.technicalReality}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bullets if any */}
        {slide.bullets && slide.bullets.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slide.bullets.map((bullet, idx) => {
              const parts = bullet.split(':');
              const title = parts[0];
              const desc = parts.slice(1).join(':');

              return (
                <li key={idx} className="p-4 border border-slate-200 bg-slate-50 rounded-none space-y-1 list-none">
                  <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-blue-600 block font-semibold">
                    🧊 {title}
                  </span>
                  {desc && (
                    <p className="text-xs leading-relaxed text-slate-600">
                      {desc.trim()}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Comparison Data if any */}
        {slide.type === 'comparison' && slide.comparisonData && (
          <div className="overflow-x-auto border border-slate-200 rounded-none bg-white">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[9px] font-mono uppercase text-slate-700 tracking-widest">
                  <th className="p-3">Key Attribute</th>
                  <th className="p-3">Virtual Machine (VM)</th>
                  <th className="p-3">Docker Container</th>
                  <th className="p-3 text-center">Winner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {slide.comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900 uppercase font-sans">{row.feature}</td>
                    <td className="p-3 leading-relaxed text-slate-600">{row.vm}</td>
                    <td className="p-3 leading-relaxed text-slate-600">{row.container}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[9px] font-bold uppercase tracking-wider rounded-none">
                        {row.winner}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Diagram details if diagramId exists */}
        {slide.diagramId && (
          <div className="border border-slate-200 p-4 rounded-none bg-slate-50 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-blue-600 block font-bold mb-2">
              📊 REFERENCE VISUAL ARCHITECTURE DIAGRAM
            </span>
            <div className="bg-white border border-slate-200 rounded-none p-4">
              <VisualDiagrams diagramId={slide.diagramId} />
            </div>
          </div>
        )}

        {/* Lab details if any */}
        {slide.type === 'lab' && slide.labDetails && (
          <div className="space-y-4">
            <div className="bg-slate-100 border border-slate-200 p-4 flex flex-wrap justify-between gap-3 text-xs font-mono uppercase text-slate-700">
              <span>Difficulty: <strong className="text-blue-600">{slide.labDetails.difficulty}</strong></span>
              <span>Est. Time: <strong className="text-blue-600">{slide.labDetails.timeEstimate}</strong></span>
              <span>Prereqs: <strong className="text-blue-600">{slide.labDetails.prerequisites}</strong></span>
            </div>
            <div className="space-y-4">
              {slide.labDetails.steps.map((step, idx) => (
                <div key={idx} className="border border-slate-200 bg-white p-4 rounded-none space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold block">
                    STEP {idx + 1}: {step.title}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.instruction}</p>
                  
                  <div className="space-y-1 pt-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Execute Command:</span>
                    <pre className="p-3 bg-slate-900 text-sky-400 font-mono text-xs overflow-x-auto rounded-none border border-slate-800">
                      <code>{step.command}</code>
                    </pre>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Expected Console Output:</span>
                    <pre className="p-3 bg-slate-950 text-slate-400 font-mono text-[10px] whitespace-pre-wrap overflow-x-auto rounded-none border border-slate-900 leading-normal">
                      <code>{step.expectedOutput}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cheat Sheet details if any */}
        {slide.type === 'cheatsheet' && slide.cheatSheetDetails && (
          <div className="space-y-4">
            <div className="border border-slate-200 bg-slate-50 p-4 rounded-none">
              <h4 className="text-slate-900 font-bold text-xs uppercase font-mono">{slide.cheatSheetDetails.categoryName}</h4>
              <p className="text-xs text-slate-500 mt-1">{slide.cheatSheetDetails.description}</p>
            </div>
            <div className="space-y-4">
              {slide.cheatSheetDetails.commands.map((cmd, idx) => (
                <div key={idx} className="border border-slate-200 bg-white p-4 rounded-none space-y-3">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <span className="font-mono text-sm font-bold text-slate-900">{cmd.command}</span>
                    <span className="text-[10px] font-mono text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-none">CMD REFERENCE</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{cmd.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">SYNTAX:</span>
                      <code className="block p-2 bg-slate-100 border border-slate-200 text-slate-800 font-mono text-[11px] rounded-none">{cmd.syntax}</code>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">PRACTICAL EXAMPLE:</span>
                      <code className="block p-2 bg-slate-100 border border-slate-200 text-slate-800 font-mono text-[11px] rounded-none">{cmd.example}</code>
                    </div>
                  </div>

                  {cmd.flags && cmd.flags.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100 mt-2">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">CONTROL FLAGS & SPECIFIERS:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cmd.flags.map((flagObj, fIdx) => (
                          <div key={fIdx} className="p-2 bg-slate-50 border border-slate-100 rounded-none flex gap-2 text-xs">
                            <span className="font-mono text-blue-600 font-bold bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-none">{flagObj.flag}</span>
                            <span className="text-slate-600 text-[11px] font-sans leading-tight">{flagObj.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiz details if any */}
        {slide.type === 'interactive-quiz' && slide.quizDetails && (
          <div className="space-y-4">
            <div className="border border-slate-200 bg-slate-50 p-4 rounded-none">
              <h4 className="text-slate-900 font-bold text-xs uppercase font-mono">{slide.quizDetails.title || "Module Evaluation Quiz"}</h4>
              <p className="text-xs text-slate-500 mt-1">Review the conceptual assessments below to cement your containerization knowledge.</p>
            </div>
            <div className="space-y-4">
              {slide.quizDetails.questions.map((q, idx) => (
                <div key={idx} className="border border-slate-200 bg-white p-4 rounded-none space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-blue-600 font-bold block">
                    QUESTION {idx + 1} OF {slide.quizDetails!.questions.length}
                  </span>
                  <p className="text-sm text-slate-800 font-bold leading-relaxed">{q.question}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === q.correctAnswerIndex;
                      return (
                        <div key={oIdx} className={`p-3 border text-xs flex gap-2 items-center rounded-none ${
                          isCorrect && includeQuizAnswers
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}>
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            isCorrect && includeQuizAnswers
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-300 text-slate-600'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="font-sans text-[11px]">{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {includeQuizAnswers && (
                    <div className="p-3 bg-blue-50 border border-blue-100 text-blue-900 text-xs rounded-none mt-2 leading-relaxed">
                      <strong className="font-mono text-[9px] text-blue-700 uppercase tracking-widest block mb-1">EDUCATIONAL EXPLANATION & KEY:</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Printable Footer */}
      <div className="border-t border-slate-200 mt-12 pt-4 flex justify-between items-center text-[9px] font-mono uppercase text-slate-400">
        <span>Santy.io Masterclass Handouts</span>
        <span>Generated: {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export function PdfExportModal({ slides, currentIdx, onClose }: PdfExportModalProps) {
  const [exportMode, setExportMode] = useState<'handbook' | 'slide'>('slide');
  const [range, setRange] = useState<'all' | 'current' | 'range'>('all');
  const [startSlide, setStartSlide] = useState<number>(1);
  const [endSlide, setEndSlide] = useState<number>(slides.length);
  const [theme, setTheme] = useState<ThemePreset>('cyber-dark');
  const [includeQuizAnswers, setIncludeQuizAnswers] = useState<boolean>(true);
  
  const [exporting, setExporting] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [progressPct, setProgressPct] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);

  const handlePrintSlide = () => {
    window.print();
  };

  const handleExport = async () => {
    setExporting(true);
    setSuccess(false);
    setProgressPct(5);
    setProgressMsg('Initializing PDF Document Engine...');

    setTimeout(() => {
      try {
        // 1. Filter slides based on selection range
        let selectedSlides: Slide[] = [];
        if (range === 'all') {
          selectedSlides = slides;
        } else if (range === 'current') {
          selectedSlides = [slides[currentIdx]];
        } else {
          const start = Math.max(1, startSlide) - 1;
          const end = Math.min(slides.length, endSlide);
          selectedSlides = slides.slice(start, end);
        }

        if (selectedSlides.length === 0) {
          throw new Error('No slides selected for PDF generation.');
        }

        // 2. Setup jsPDF A4 Document (Portrait, mm, [210, 297])
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const totalSlides = selectedSlides.length;
        const pageW = 210;
        const pageH = 297;
        const marginL = 20;
        const marginR = 20;
        const printW = pageW - marginL - marginR; // 170mm

        // Color Presets configuration
        const colors = {
          'cyber-dark': {
            bg: [1, 9, 21], // #010915
            cardBg: [12, 35, 54], // #0c2336
            textMain: [255, 255, 255],
            textSub: [150, 150, 150],
            accent: [36, 150, 237], // #2496ed / Cyber Blue
            secondaryAccent: [0, 240, 255], // #00f0ff / Neon Cyan
            borders: [17, 58, 93], // #113a5d
          },
          'clean-light': {
            bg: [255, 255, 255],
            cardBg: [243, 244, 246], // light gray
            textMain: [17, 24, 39], // dark charcoal
            textSub: [75, 85, 99],
            accent: [29, 78, 216], // Darker blue
            secondaryAccent: [3, 105, 161],
            borders: [229, 231, 235],
          },
          'editorial': {
            bg: [252, 251, 247], // warm paper off-white
            cardBg: [244, 241, 234], // slightly darker paper
            textMain: [30, 30, 30],
            textSub: [110, 105, 95],
            accent: [194, 65, 12], // warm terracotta/orange
            secondaryAccent: [120, 113, 108],
            borders: [217, 212, 202],
          }
        }[theme];

        // 3. Document Title Page (Only when exporting multi-page/all)
        if (range !== 'current' && selectedSlides.length > 2) {
          setProgressMsg('Generating Book Title Cover...');
          setProgressPct(15);

          // Fill Background
          doc.setFillColor(colors.bg[0], colors.bg[1], colors.bg[2]);
          doc.rect(0, 0, pageW, pageH, 'F');

          // Large Accent Stripe
          doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
          doc.rect(marginL, 80, 4, 110, 'F');

          // Title Headings
          doc.setTextColor(colors.secondaryAccent[0], colors.secondaryAccent[1], colors.secondaryAccent[2]);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(11);
          doc.text('DOCKER MASTERCLASS SERIES // STUDY COMPANION', marginL + 10, 90);

          doc.setTextColor(colors.textMain[0], colors.textMain[1], colors.textMain[2]);
          doc.setFontSize(32);
          const titleLines = doc.splitTextToSize('Docker Interactive\nLearning Deck', printW - 15);
          doc.text(titleLines, marginL + 10, 105);

          doc.setTextColor(colors.textSub[0], colors.textSub[1], colors.textSub[2]);
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(11);
          const descText = 'A comprehensive, interactive handbook covering containerization principles, structural systems, command lines, hands-on lab operations, and architectural best practices.';
          const descLines = doc.splitTextToSize(descText, printW - 15);
          doc.text(descLines, marginL + 10, 140);

          // Metadata Banner at the bottom
          doc.setDrawColor(colors.borders[0], colors.borders[1], colors.borders[2]);
          doc.setLineWidth(0.3);
          doc.line(marginL, 220, pageW - marginR, 220);

          doc.setTextColor(colors.secondaryAccent[0], colors.secondaryAccent[1], colors.secondaryAccent[2]);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(9);
          doc.text('COURSE INSTRUCTOR', marginL, 230);
          doc.setTextColor(colors.textMain[0], colors.textMain[1], colors.textMain[2]);
          doc.setFont('Helvetica', 'normal');
          doc.text('Ahmed Wael (Cloud Engineer & System Admin)', marginL, 235);

          doc.setTextColor(colors.secondaryAccent[0], colors.secondaryAccent[1], colors.secondaryAccent[2]);
          doc.setFont('Helvetica', 'bold');
          doc.text('GENERATION DATE', pageW - marginR - 60, 230);
          doc.setTextColor(colors.textMain[0], colors.textMain[1], colors.textMain[2]);
          doc.setFont('Helvetica', 'normal');
          doc.text(new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }), pageW - marginR - 60, 235);

          // Footer info
          doc.setTextColor(colors.textSub[0], colors.textSub[1], colors.textSub[2]);
          doc.setFontSize(8);
          doc.text('Generated via Santy.io CMS Platform. Copyright © 2026. All rights reserved.', marginL, 270);

          doc.addPage();
        }

        // 4. Slide Rendering Loop
        selectedSlides.forEach((slide, sIdx) => {
          const rawPct = 15 + Math.floor((sIdx / totalSlides) * 80);
          setProgressPct(rawPct);
          setProgressMsg(`Formatting Slide [${sIdx + 1}/${totalSlides}]: ${slide.title.substring(0, 25)}...`);

          // Background Fill for the slide page
          doc.setFillColor(colors.bg[0], colors.bg[1], colors.bg[2]);
          doc.rect(0, 0, pageW, pageH, 'F');

          // Slide Header
          doc.setDrawColor(colors.borders[0], colors.borders[1], colors.borders[2]);
          doc.setLineWidth(0.2);
          doc.line(marginL, 20, pageW - marginR, 20);

          doc.setTextColor(colors.secondaryAccent[0], colors.secondaryAccent[1], colors.secondaryAccent[2]);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(8);
          doc.text(`SLIDE COMPONENT [${sIdx + 1} of ${totalSlides}] // CHAPTER: ${slide.category.toUpperCase()}`, marginL, 16);

          // Slide Title
          doc.setTextColor(colors.textMain[0], colors.textMain[1], colors.textMain[2]);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(18);
          const titleWrapped = doc.splitTextToSize(slide.title, printW);
          doc.text(titleWrapped, marginL, 30);
          
          let curY = 32 + (titleWrapped.length * 7);

          // Optional Subtitle
          if (slide.subtitle) {
            doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(10);
            const subtitleLines = doc.splitTextToSize(slide.subtitle, printW);
            doc.text(subtitleLines, marginL, curY);
            curY += 4 + (subtitleLines.length * 4);
          }

          curY += 4;

          // Render Slide Content based on Slide Type
          if (slide.type === 'comparison' && slide.comparisonData) {
            // Draw comparison data as a high-fidelity table
            doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
            doc.rect(marginL, curY, printW, 8, 'F');
            
            doc.setDrawColor(colors.borders[0], colors.borders[1], colors.borders[2]);
            doc.rect(marginL, curY, printW, 8);

            // Table Headers
            doc.setTextColor(colors.secondaryAccent[0], colors.secondaryAccent[1], colors.secondaryAccent[2]);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(8);
            doc.text('FEATURE / COMPONENT', marginL + 4, curY + 5);
            doc.text('VIRTUAL MACHINES (VM)', marginL + 55, curY + 5);
            doc.text('DOCKER CONTAINERS', marginL + 115, curY + 5);

            curY += 8;

            slide.comparisonData.forEach((row) => {
              doc.setFont('Helvetica', 'normal');
              doc.setFontSize(8);
              doc.setTextColor(colors.textMain[0], colors.textMain[1], colors.textMain[2]);

              // Calculate heights for multi-line text wrapping in table columns
              const col1Lines = doc.splitTextToSize(row.feature, 48);
              const col2Lines = doc.splitTextToSize(row.vm, 55);
              const col3Lines = doc.splitTextToSize(row.container, 50);

              const rowHeight = Math.max(col1Lines.length, col2Lines.length, col3Lines.length) * 4 + 4;

              // Draw cell borders/background
              doc.setDrawColor(colors.borders[0], colors.borders[1], colors.borders[2]);
              doc.rect(marginL, curY, printW, rowHeight);

              // Render text inside columns
              doc.text(col1Lines, marginL + 4, curY + 4);
              doc.text(col2Lines, marginL + 55, curY + 4);
              doc.text(col3Lines, marginL + 115, curY + 4);

              curY += rowHeight;
            });

          } else if (slide.type === 'cheatsheet' && slide.cheatSheetDetails) {
            // Commands cheatsheet block
            const details = slide.cheatSheetDetails;
            doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(10);
            doc.text(`${details.categoryName.toUpperCase()}: ${details.description}`, marginL, curY);
            curY += 6;

            details.commands.slice(0, 5).forEach((cmd) => {
              // Command command box (dark code segment background)
              doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
              doc.setDrawColor(colors.borders[0], colors.borders[1], colors.borders[2]);
              doc.rect(marginL, curY, printW, 14, 'FD');

              doc.setTextColor(colors.secondaryAccent[0], colors.secondaryAccent[1], colors.secondaryAccent[2]);
              doc.setFont('Courier', 'bold');
              doc.setFontSize(9);
              doc.text(`$ ${cmd.command}`, marginL + 4, curY + 5);

              doc.setTextColor(colors.textSub[0], colors.textSub[1], colors.textSub[2]);
              doc.setFont('Courier', 'normal');
              doc.setFontSize(8);
              doc.text(`Syntax: ${cmd.syntax}`, marginL + 4, curY + 10);

              curY += 16;

              // Command description
              doc.setTextColor(colors.textMain[0], colors.textMain[1], colors.textMain[2]);
              doc.setFont('Helvetica', 'normal');
              doc.setFontSize(8);
              const cmdDesc = doc.splitTextToSize(`Action: ${cmd.description} // e.g. ${cmd.example}`, printW - 4);
              doc.text(cmdDesc, marginL + 2, curY);
              curY += (cmdDesc.length * 4) + 4;
            });

          } else if (slide.type === 'lab' && slide.labDetails) {
            // Lab sheet rendering
            const lab = slide.labDetails;
            doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
            doc.rect(marginL, curY, printW, 10, 'F');
            doc.setDrawColor(colors.borders[0], colors.borders[1], colors.borders[2]);
            doc.rect(marginL, curY, printW, 10);

            doc.setTextColor(colors.secondaryAccent[0], colors.secondaryAccent[1], colors.secondaryAccent[2]);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(9);
            doc.text(`LAB CONFIGURATION: ${lab.labId} [${lab.difficulty}]`, marginL + 4, curY + 65 / 10);
            doc.setTextColor(colors.textMain[0], colors.textMain[1], colors.textMain[2]);
            doc.text(`Time: ${lab.timeEstimate}`, pageW - marginR - 35, curY + 6.5);

            curY += 13;

            // Render first 3 steps to fit perfectly on A4
            lab.steps.slice(0, 3).forEach((step, idx) => {
              doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
              doc.setFont('Helvetica', 'bold');
              doc.setFontSize(9);
              doc.text(`Step ${idx + 1}: ${step.title}`, marginL, curY);
              curY += 4;

              doc.setTextColor(colors.textMain[0], colors.textMain[1], colors.textMain[2]);
              doc.setFont('Helvetica', 'normal');
              doc.setFontSize(8);
              const instructionLines = doc.splitTextToSize(step.instruction, printW);
              doc.text(instructionLines, marginL, curY);
              curY += (instructionLines.length * 3.5) + 2;

              // Terminal code command line
              doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
              doc.setDrawColor(colors.borders[0], colors.borders[1], colors.borders[2]);
              doc.rect(marginL, curY, printW, 7, 'FD');

              doc.setTextColor(255, 255, 255);
              doc.setFont('Courier', 'bold');
              doc.setFontSize(8.5);
              doc.text(`$ ${step.command}`, marginL + 4, curY + 4.5);
              curY += 9;
            });

          } else if (slide.type === 'interactive-quiz' && slide.quizDetails) {
            // Interactive practice Quiz Layout
            const quiz = slide.quizDetails;
            doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(10);
            doc.text(`PRACTICE DRILL: ${quiz.title}`, marginL, curY);
            curY += 7;

            quiz.questions.slice(0, 2).forEach((q, qIdx) => {
              doc.setTextColor(colors.textMain[0], colors.textMain[1], colors.textMain[2]);
              doc.setFont('Helvetica', 'bold');
              doc.setFontSize(9);
              const qText = doc.splitTextToSize(`Q${qIdx + 1}: ${q.question}`, printW);
              doc.text(qText, marginL, curY);
              curY += (qText.length * 4) + 2;

              q.options.forEach((opt, oIdx) => {
                const isCorrect = oIdx === q.correctAnswerIndex;
                if (isCorrect && includeQuizAnswers) {
                  doc.setTextColor(0, 200, 100);
                  doc.setFont('Helvetica', 'bold');
                  doc.text(`[X] ${opt}  (Correct Answer)`, marginL + 4, curY);
                } else {
                  doc.setTextColor(colors.textSub[0], colors.textSub[1], colors.textSub[2]);
                  doc.setFont('Helvetica', 'normal');
                  doc.text(`[ ] ${opt}`, marginL + 4, curY);
                }
                curY += 4.5;
              });

              if (includeQuizAnswers) {
                curY += 1.5;
                doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
                doc.setFont('Helvetica', 'normal');
                doc.setFontSize(7.5);
                const expl = doc.splitTextToSize(`Note: ${q.explanation}`, printW - 8);
                doc.text(expl, marginL + 4, curY);
                curY += (expl.length * 3.5) + 3;
              }
              curY += 2;
            });

          } else if (slide.type === 'glossary' && slide.analogy) {
            // Glossary Analogy boxes
            const analogy = slide.analogy;
            doc.setDrawColor(colors.borders[0], colors.borders[1], colors.borders[2]);
            doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
            doc.rect(marginL, curY, printW, 60, 'FD');

            doc.setTextColor(colors.secondaryAccent[0], colors.secondaryAccent[1], colors.secondaryAccent[2]);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(11);
            doc.text(`THE ANALOGY: ${analogy.title.toUpperCase()}`, marginL + 6, curY + 7);

            doc.setTextColor(colors.textMain[0], colors.textMain[1], colors.textMain[2]);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(9.5);
            doc.text(`Technical Jargon: "${analogy.jargonWord}"`, marginL + 6, curY + 14);

            doc.setDrawColor(colors.borders[0], colors.borders[1], colors.borders[2]);
            doc.line(marginL + 6, curY + 17, marginL + printW - 6, curY + 17);

            // Simple Analogy text
            doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.text('Simple Everyday Analogy:', marginL + 6, curY + 23);

            doc.setTextColor(colors.textMain[0], colors.textMain[1], colors.textMain[2]);
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(8);
            const analogyLines = doc.splitTextToSize(analogy.simpleAnalogy, printW - 12);
            doc.text(analogyLines, marginL + 6, curY + 27);

            const nextYOffset = curY + 28 + (analogyLines.length * 3.5);

            // Technical reality text
            doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.text('Technical Under-the-Hood Reality:', marginL + 6, nextYOffset + 2);

            doc.setTextColor(colors.textMain[0], colors.textMain[1], colors.textMain[2]);
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(8);
            const technicalLines = doc.splitTextToSize(analogy.technicalReality, printW - 12);
            doc.text(technicalLines, marginL + 6, nextYOffset + 6);

            curY += 66;

          } else {
            // General structure (Title & Text content paragraphs or bullet points)
            if (slide.contentParagraphs && slide.contentParagraphs.length > 0) {
              slide.contentParagraphs.forEach((paragraph) => {
                doc.setTextColor(colors.textMain[0], colors.textMain[1], colors.textMain[2]);
                doc.setFont('Helvetica', 'normal');
                doc.setFontSize(9);
                const paragraphWrapped = doc.splitTextToSize(paragraph, printW);
                doc.text(paragraphWrapped, marginL, curY);
                curY += (paragraphWrapped.length * 4) + 4;
              });
            }

            if (slide.bullets && slide.bullets.length > 0) {
              slide.bullets.forEach((bullet) => {
                doc.setTextColor(colors.secondaryAccent[0], colors.secondaryAccent[1], colors.secondaryAccent[2]);
                doc.setFont('Helvetica', 'bold');
                doc.setFontSize(9);
                doc.text('▪', marginL, curY);

                doc.setTextColor(colors.textMain[0], colors.textMain[1], colors.textMain[2]);
                doc.setFont('Helvetica', 'normal');
                const bulletWrapped = doc.splitTextToSize(bullet, printW - 5);
                doc.text(bulletWrapped, marginL + 4, curY);
                curY += (bulletWrapped.length * 4) + 3;
              });
            }
          }

          // Render optional Speaker Lecture Note Box at slide bottom
          if (slide.speakerNotes && curY < (pageH - 60)) {
            const bottomY = pageH - 45;
            doc.setDrawColor(colors.borders[0], colors.borders[1], colors.borders[2]);
            doc.setLineWidth(0.15);
            doc.line(marginL, bottomY - 3, pageW - marginR, bottomY - 3);

            doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.text('LECTURER NOTES // HIGHLIGHTS:', marginL, bottomY + 1.5);

            doc.setTextColor(colors.textSub[0], colors.textSub[1], colors.textSub[2]);
            doc.setFont('Helvetica', 'italic');
            doc.setFontSize(7.5);
            const notesWrapped = doc.splitTextToSize(slide.speakerNotes, printW);
            doc.text(notesWrapped, marginL, bottomY + 5.5);
          }

          // Slide Footer decoration
          doc.setDrawColor(colors.borders[0], colors.borders[1], colors.borders[2]);
          doc.setLineWidth(0.2);
          doc.line(marginL, pageH - 15, pageW - marginR, pageH - 15);

          doc.setTextColor(colors.textSub[0], colors.textSub[1], colors.textSub[2]);
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.text('Docker Masterclass Hub — Ahmed Wael', marginL, pageH - 11);
          doc.text(`Page ${sIdx + 1} of ${totalSlides}`, pageW - marginR - 20, pageH - 11);

          // Add clean divider or add page for next slide
          if (sIdx < totalSlides - 1) {
            doc.addPage();
          }
        });

        // 5. Save & Trigger PDF File Download
        setProgressMsg('Compressing PDF streams...');
        setProgressPct(95);
        
        const fileName = `Docker_Masterclass_${range === 'current' ? `Slide_${selectedSlides[0].id}` : 'Complete_Companion'}.pdf`;
        doc.save(fileName);

        setProgressPct(100);
        setProgressMsg('PDF Compiled Successfully!');
        setSuccess(true);
      } catch (err: any) {
        console.error(err);
        alert(err.message || 'Failed to construct PDF Document.');
        setExporting(false);
      }
    }, 600);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide everything on screen except the print section */
          body > *:not(#slide-print-section-root) {
            display: none !important;
          }
          
          #slide-print-section-root {
            display: block !important;
            background: white !important;
            color: #000000 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 15mm !important;
            box-sizing: border-box !important;
          }

          /* Print color adjust setup to preserve colored labels */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Redefine dark container cards for printing */
          .liquid-glass, .liquid-glass-intense {
            background: #f8fafc !important;
            border: 1.5px solid #cbd5e0 !important;
            color: #0f172a !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
          }

          /* Hide corner graphics in printed layout */
          .corner-box::before, .corner-box::after, .corner-box-bottom::before, .corner-box-bottom::after {
            display: none !important;
          }

          /* Hide interactive elements and buttons in print */
          button, nav, .no-print, .print-hidden {
            display: none !important;
          }

          /* Restyle titles and subtitles for perfect contrast */
          h1, h2, h3, h4, h5, h6 {
            color: #0f172a !important;
          }
          
          span, p, li, td, th {
            color: #334155 !important;
          }

          /* Force background colors on badges and boxes to print beautifully */
          .bg-[#181818], .bg-[#010915], .bg-[#0c2336], .bg-[#010a17], .bg-[#020f1f], .bg-[#010915]/60, .bg-[#010915]/50 {
            background-color: #f1f5f9 !important;
            color: #1e293b !important;
            border-color: #cbd5e0 !important;
          }

          /* Diagrams: Swap neon labels/borders for clear blues/slates */
          .text-[#00f0ff], .text-[#2496ed], .text-cyan-400 {
            color: #1d4ed8 !important;
          }

          /* Tables */
          table {
            border-collapse: collapse !important;
            width: 100% !important;
          }

          th, td {
            border: 1px solid #cbd5e0 !important;
            padding: 8px !important;
          }

          th {
            background-color: #f1f5f9 !important;
          }
        }
      `}} />

      <SlidePrintLayout slide={slides[currentIdx]} includeQuizAnswers={includeQuizAnswers} />

      <div className="fixed inset-0 bg-[#010915]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 print:hidden">
        {/* Outer Glow container card */}
        <div className="relative w-full max-w-lg bg-[#020f1f]/95 border-2 border-[#113a5d] p-6 shadow-[0_0_50px_rgba(36,150,237,0.15)] overflow-hidden">
          
          {/* Glow corners */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00f0ff]" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00f0ff]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00f0ff]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00f0ff]" />

          {/* Header */}
          <div className="flex justify-between items-start mb-4 border-b border-[#113a5d]/40 pb-4">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#00f0ff]" />
              <div>
                <h3 className="text-white text-xs font-mono uppercase tracking-[0.16em] font-bold">
                  Export Slide & Handbook
                </h3>
                <p className="text-[9px] text-[#969696] font-mono uppercase mt-0.5">High-Fidelity PDF Publisher</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={exporting && !success}
              className="text-[#969696] hover:text-white transition-colors cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Export Mode Tab Selector */}
          <div className="grid grid-cols-2 gap-2 mb-5 border-b border-[#113a5d]/40 pb-4">
            <button
              type="button"
              onClick={() => setExportMode('handbook')}
              className={`py-2 px-3 border text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                exportMode === 'handbook'
                  ? 'bg-[#2496ed]/20 border-[#2496ed] text-white shadow-[0_0_8px_rgba(36,150,237,0.2)]'
                  : 'bg-[#010915] border-[#113a5d]/30 text-[#969696] hover:border-[#2496ed]/50 hover:text-white'
              }`}
            >
              <span>📚</span> Handbook Book (jsPDF)
            </button>
            <button
              type="button"
              onClick={() => setExportMode('slide')}
              className={`py-2 px-3 border text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                exportMode === 'slide'
                  ? 'bg-[#2496ed]/20 border-[#2496ed] text-white shadow-[0_0_8px_rgba(36,150,237,0.2)]'
                  : 'bg-[#010915] border-[#113a5d]/30 text-[#969696] hover:border-[#2496ed]/50 hover:text-white'
              }`}
            >
              <span>🖥️</span> Download Slide (Print-CSS)
            </button>
          </div>

          {/* Dynamic States */}
          {!exporting && !success ? (
            exportMode === 'slide' ? (
              <div className="space-y-5">
                {/* Active Slide Details block */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#00f0ff] tracking-widest block">Active Slide Info</span>
                  <div className="bg-[#010a17] border border-[#113a5d] p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-cyan-400">SLIDE CATEGORY:</span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-white bg-[#113a5d] px-2 py-0.5">{slides[currentIdx].category}</span>
                    </div>
                    <div className="h-px bg-[#113a5d]/30" />
                    <h4 className="text-white text-xs font-mono uppercase tracking-wide leading-tight">
                      {slides[currentIdx].title}
                    </h4>
                    {slides[currentIdx].subtitle && (
                      <p className="text-[#969696] text-[10px] italic">
                        {slides[currentIdx].subtitle}
                      </p>
                    )}
                    {slides[currentIdx].diagramId && (
                      <div className="flex items-center gap-1.5 pt-1 text-[9px] font-mono uppercase text-emerald-400">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        INCLUDES DIAGRAM: {slides[currentIdx].diagramId}
                      </div>
                    )}
                  </div>

                  {/* Informative description */}
                  <div className="p-3.5 bg-[#010915] border border-[#113a5d]/60 text-[#969696] text-[10px] leading-relaxed font-sans uppercase">
                    <span className="font-mono text-[9px] text-[#2496ed] font-bold block mb-1">PRO-LEVEL FORMATTING ACTIVE</span>
                    Generates a clean, A4-scaled physical or digital PDF version of the active slide. Utilizes browser print-CSS rules to render layout, diagram geometries, and typographic hierarchies perfectly.
                  </div>
                </div>

                {/* Quiz Toggle option */}
                <div className="bg-[#010a17] border border-[#113a5d] p-3 flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-mono uppercase text-white tracking-wide">Include Quiz Solution Keys</span>
                    <span className="text-[8px] font-mono text-[#969696] uppercase font-sans">Inject answer explanations and reviews</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeQuizAnswers}
                      onChange={(e) => setIncludeQuizAnswers(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#020f1f] border border-[#113a5d] peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-[#00f0ff] after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-[#113a5d] after:border-[#113a5d] after:border after:h-[14px] after:w-[14px] after:transition-all peer-checked:after:bg-[#00f0ff] peer-checked:border-[#2496ed]" />
                  </label>
                </div>

                {/* Print trigger button */}
                <button
                  type="button"
                  onClick={handlePrintSlide}
                  className="w-full py-3.5 bg-[#2496ed] hover:bg-[#1d82ce] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] text-white font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#00f0ff]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save Slide to PDF</span>
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Range Selection Box */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#00f0ff] tracking-widest block">1. Select Document Range</span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRange('all')}
                  className={`py-2.5 border text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    range === 'all'
                      ? 'bg-[#2496ed]/20 border-[#2496ed] text-white shadow-[0_0_8px_rgba(36,150,237,0.2)]'
                      : 'bg-[#010915] border-[#113a5d] text-[#969696] hover:border-[#2496ed]/50 hover:text-white'
                  }`}
                >
                  All Slides ({slides.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRange('current')}
                  className={`py-2.5 border text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    range === 'current'
                      ? 'bg-[#2496ed]/20 border-[#2496ed] text-white shadow-[0_0_8px_rgba(36,150,237,0.2)]'
                      : 'bg-[#010915] border-[#113a5d] text-[#969696] hover:border-[#2496ed]/50 hover:text-white'
                  }`}
                >
                  Current Slide
                </button>
                <button
                  type="button"
                  onClick={() => setRange('range')}
                  className={`py-2.5 border text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    range === 'range'
                      ? 'bg-[#2496ed]/20 border-[#2496ed] text-white shadow-[0_0_8px_rgba(36,150,237,0.2)]'
                      : 'bg-[#010915] border-[#113a5d] text-[#969696] hover:border-[#2496ed]/50 hover:text-white'
                  }`}
                >
                  Custom Range
                </button>
              </div>

              {/* Custom Range sliders */}
              {range === 'range' && (
                <div className="mt-3 bg-[#010a17] border border-[#113a5d] p-3 flex items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-[#969696] uppercase">From</span>
                    <input
                      type="number"
                      min={1}
                      max={slides.length}
                      value={startSlide}
                      onChange={(e) => setStartSlide(Math.min(slides.length, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-16 bg-[#020f1f] border border-[#113a5d] text-white text-[11px] font-mono text-center py-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-[#969696] uppercase">To</span>
                    <input
                      type="number"
                      min={1}
                      max={slides.length}
                      value={endSlide}
                      onChange={(e) => setEndSlide(Math.min(slides.length, Math.max(1, parseInt(e.target.value) || slides.length)))}
                      className="w-16 bg-[#020f1f] border border-[#113a5d] text-white text-[11px] font-mono text-center py-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Aesthetic Theme presets selection */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#00f0ff] tracking-widest block">2. Publisher Style Theme</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('cyber-dark')}
                  className={`py-2 px-1 border text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    theme === 'cyber-dark'
                      ? 'bg-[#2496ed]/20 border-[#2496ed] text-white shadow-[0_0_8px_rgba(36,150,237,0.2)]'
                      : 'bg-[#010915] border-[#113a5d] text-[#969696] hover:border-[#2496ed]/50 hover:text-white'
                  }`}
                >
                  🌑 Cyber Dark
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('clean-light')}
                  className={`py-2 px-1 border text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    theme === 'clean-light'
                      ? 'bg-[#2496ed]/20 border-[#2496ed] text-white shadow-[0_0_8px_rgba(36,150,237,0.2)]'
                      : 'bg-[#010915] border-[#113a5d] text-[#969696] hover:border-[#2496ed]/50 hover:text-white'
                  }`}
                >
                  ☀️ Clean Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('editorial')}
                  className={`py-2 px-1 border text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    theme === 'editorial'
                      ? 'bg-[#2496ed]/20 border-[#2496ed] text-white shadow-[0_0_8px_rgba(36,150,237,0.2)]'
                      : 'bg-[#010915] border-[#113a5d] text-[#969696] hover:border-[#2496ed]/50 hover:text-white'
                  }`}
                >
                  📜 Editorial Warm
                </button>
              </div>
            </div>

            {/* Quiz Toggle option */}
            <div className="bg-[#010a17] border border-[#113a5d] p-3 flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-mono uppercase text-white tracking-wide">Include Quiz Answer Keys</span>
                <span className="text-[8px] font-mono text-[#969696] uppercase">Inject solution reviews and notes</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeQuizAnswers}
                  onChange={(e) => setIncludeQuizAnswers(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#020f1f] border border-[#113a5d] peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-[#00f0ff] after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-[#113a5d] after:border-[#113a5d] after:border after:h-[14px] after:w-[14px] after:transition-all peer-checked:after:bg-[#00f0ff] peer-checked:border-[#2496ed]" />
              </label>
            </div>

            {/* Launch PDF Generation Trigger */}
            <button
              onClick={handleExport}
              className="w-full py-3.5 bg-[#2496ed] hover:bg-[#1d82ce] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] text-white font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#00f0ff]"
            >
              <Download className="w-4 h-4" />
              <span>Compile & Download PDF</span>
            </button>
          </div>
        )
      ) : exporting && !success ? (
          /* Live Export Compilation State Screen */
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              {/* Rotating cyber spinner */}
              <div className="w-16 h-16 border-4 border-[#113a5d] border-t-[#00f0ff] rounded-full animate-spin" />
              <Sparkles className="w-6 h-6 text-[#00f0ff] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>

            <div className="space-y-2 w-full px-4">
              <h4 className="text-white text-xs font-mono uppercase tracking-[0.14em]">
                Compiling PDF Presentation
              </h4>
              <p className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">
                {progressMsg}
              </p>

              {/* Custom cyber progress bar */}
              <div className="w-full bg-[#010915] border border-[#113a5d] h-2 p-[1px] mt-4">
                <div
                  className="bg-gradient-to-r from-[#2496ed] to-[#00f0ff] h-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-[#969696]">{progressPct}% Complete</span>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-5 animate-scaleUp">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h4 className="text-white text-sm font-mono uppercase tracking-[0.16em] font-bold">
                Export Operation Complete!
              </h4>
              <p className="text-[10px] text-[#969696] font-sans">
                Your Docker Masterclass companion PDF has been compiled successfully and is downloading now.
              </p>
            </div>

            <div className="flex gap-2 w-full pt-2">
              <button
                onClick={() => {
                  setSuccess(false);
                  setExporting(false);
                }}
                className="flex-1 py-2 bg-[#0c2336] hover:bg-[#113a5d] border border-[#113a5d] text-white font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer"
              >
                Export Another
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 bg-[#2496ed] hover:bg-[#1d82ce] border border-[#00f0ff] text-white font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer"
              >
                Return to Course
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
    </>
  );
}
