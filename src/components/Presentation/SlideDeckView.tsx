/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Meru University of Science and Technology (MUST)
 * 10-Minute Presentation Slide Deck Component with Speaker Notes & Timer
 */

import React, { useState, useEffect } from 'react';
import { PRESENTATION_SLIDES } from '../../data/slidesContent';
import {
  Presentation,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
  User,
  Clock,
  Download,
  GraduationCap,
} from 'lucide-react';

export const SlideDeckView: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // 10-minute presentation countdown timer (600 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeLeft]);

  const slide = PRESENTATION_SLIDES[currentSlideIndex];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentSlideIndex < PRESENTATION_SLIDES.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handleDownloadSlidesOutline = () => {
    const content = PRESENTATION_SLIDES.map(
      (s) =>
        `SLIDE ${s.id}: ${s.title}\nSubtitle: ${s.subtitle}\nPresenter: ${s.presenter} (${s.regNo}) [Time: ${s.allocatedTime}]\n\nKey Points:\n${s.bulletPoints
          .map((b) => `- ${b}`)
          .join('\n')}\n\nSpeaker Notes:\n${s.speakerNotes}\n\n------------------------------------\n`
    ).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'GROUP_02_Diabetes_Risk_Screening_Slides_Script.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`max-w-7xl mx-auto px-4 py-8 space-y-6 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto max-w-none' : ''
      }`}
    >
      {/* Top Presentation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>CDS 3301 Mini-Project Defense</span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                Slide {slide.id} of {PRESENTATION_SLIDES.length}
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Assigned Presenter: <strong className="text-slate-200">{slide.presenter}</strong>
            </div>
          </div>
        </div>

        {/* 10-Minute Presentation Timer Controls */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <Clock className="w-4 h-4 text-purple-400" />
          <div className="font-mono text-base font-bold text-white tracking-wider">
            {formatTimer(timeLeft)}
          </div>
          <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="p-1 rounded-md text-slate-400 hover:text-white transition"
              title={timerRunning ? 'Pause Timer' : 'Start 10:00 Timer'}
            >
              {timerRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => {
                setTimerRunning(false);
                setTimeLeft(600);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white transition"
              title="Reset Timer to 10:00"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              showSpeakerNotes
                ? 'bg-purple-950/70 border-purple-500/50 text-purple-200'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Speaker Notes</span>
          </button>

          <button
            onClick={handleDownloadSlidesOutline}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Download slide script outline"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Script</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Presentation Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Slide Card (16:9 Aspect Ratio Look) */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[480px] flex flex-col justify-between">
        {/* Background Institutional Watermark */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-purple-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Slide Header */}
        <div className="space-y-3 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono">
                {slide.taskTag}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">Meru University of Science and Technology</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-slate-300 font-semibold bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>{slide.presenter}</span>
              </span>
              <span className="text-slate-500 font-mono">{slide.allocatedTime}</span>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight pt-2">
            {slide.title}
          </h2>
          <p className="text-sm md:text-base text-purple-300/90 font-medium">
            {slide.subtitle}
          </p>
        </div>

        {/* Slide Body: Bullet Points */}
        <div className="my-8 relative z-10">
          <ul className="space-y-4 text-xs md:text-sm lg:text-base text-slate-200">
            {slide.bulletPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 leading-relaxed">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 mt-2 shadow-sm shadow-emerald-400/50" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Slide Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 relative z-10 text-xs text-slate-400">
          <div>
            <span>Group 2: CDS 3301 Machine Learning</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="font-mono text-xs text-slate-300">
              {currentSlideIndex + 1} / {PRESENTATION_SLIDES.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentSlideIndex === PRESENTATION_SLIDES.length - 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Speaker Notes Drawer (Crucial for Each Member to Rehearse) */}
      {showSpeakerNotes && (
        <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Speaker Script for {slide.presenter} ({slide.regNo})</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Target Speaking Time: {slide.allocatedTime}
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-300 italic leading-relaxed pt-1 bg-slate-950 p-4 rounded-xl border border-slate-800">
            "{slide.speakerNotes}"
          </p>
        </div>
      )}
    </div>
  );
};
