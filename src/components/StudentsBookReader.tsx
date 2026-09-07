import React, { useState } from 'react';
import { Unit, Lesson, GradeCurriculum } from '../types';
import { BookOpen, Volume2, ArrowLeft, ArrowRight, CheckCircle2, Sparkles, MessageSquare, Lightbulb, Bookmark, Brain } from 'lucide-react';

interface StudentsBookReaderProps {
  curriculum: GradeCurriculum;
  unit: Unit;
  lesson: Lesson;
  onBackToLessons: () => void;
  onFinishReading: () => void;
  onOpenVocabTrainer?: () => void;
}

export const StudentsBookReader: React.FC<StudentsBookReaderProps> = ({
  curriculum,
  unit,
  lesson,
  onBackToLessons,
  onFinishReading,
  onOpenVocabTrainer,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const { readingContent } = lesson;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          id="btn-back-from-reading"
          onClick={onBackToLessons}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Darslar ro'yxatiga qaytish</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-extrabold text-xs flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>📘 Student's Book • {curriculum.name}</span>
          </span>
        </div>
      </div>

      {/* Book Page Sheet Container (Mimics authentic textbook aesthetic) */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Textbook Header Ribbon */}
        <div className="bg-indigo-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1">
              <span>Unit {unit.number}: {unit.title}</span>
              <span>•</span>
              <span>Lesson {lesson.number}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {lesson.title}
            </h1>
            <p className="text-indigo-200 text-xs sm:text-sm font-medium mt-1">
              {lesson.titleUz}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 self-start sm:self-auto">
            <button
              id="btn-speak-lesson-title"
              onClick={() => speakText(lesson.title + '. ' + readingContent.readingPassage)}
              className={`p-3 rounded-2xl font-bold text-xs flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-400 text-amber-950 animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
              }`}
              title="Matnni inglizcha ovozda eshitish"
            >
              <Volume2 className="w-5 h-5" />
              <span>{isPlayingAudio ? 'O\'qilmoqda...' : 'Ovozli tinglash'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* 1. Vocabulary Section */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  1. New Words (Yangi so'zlar)
                </h2>
              </div>
              {onOpenVocabTrainer && (
                <button
                  type="button"
                  onClick={onOpenVocabTrainer}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors cursor-pointer"
                  title="Flashcard orqali so'zlarni yodlash"
                >
                  <Brain className="w-3.5 h-3.5 text-amber-600" />
                  <span>So'z yodlash (Flashcards)</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {readingContent.vocabulary.map((vocab, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setActiveWordIndex(index);
                    speakText(vocab.en);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                    activeWordIndex === index
                      ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                      : 'border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                      {vocab.en}
                    </span>
                    <Volume2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  {vocab.phonetic && (
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {vocab.phonetic}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-indigo-600 block mt-0.5">
                    {vocab.uz}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Reading Passage */}
          <div className="bg-amber-50/60 rounded-2xl p-6 sm:p-7 border border-amber-200/70">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-700" />
                <h2 className="text-base sm:text-lg font-bold text-amber-950">
                  2. Reading Text (O'qish matni)
                </h2>
              </div>
              <button
                onClick={() => speakText(readingContent.readingPassage)}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>O'qib berish</span>
              </button>
            </div>

            <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-serif whitespace-pre-line">
              {readingContent.readingPassage}
            </p>
          </div>

          {/* 3. Grammar Box */}
          <div className="bg-indigo-50/60 rounded-2xl p-6 sm:p-7 border border-indigo-100">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base sm:text-lg font-bold text-indigo-950">
                3. Grammar Focus (Grammatika qoidasi): {readingContent.grammarRule.title}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {readingContent.grammarRule.explanationUz}
            </p>

            <div className="mt-4 pt-3 border-t border-indigo-100">
              <span className="text-xs font-bold text-indigo-900 block mb-2">Misollar:</span>
              <div className="space-y-1.5">
                {readingContent.grammarRule.examples.map((ex, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 font-semibold bg-white p-2.5 rounded-xl border border-indigo-100 shadow-2xs">
                    <span className="text-indigo-500">👉</span>
                    <span>{ex}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Dialogue (if exists) */}
          {readingContent.dialogue && (
            <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-slate-700" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  4. Dialogue Practice (Suhbat)
                </h2>
              </div>
              <div className="space-y-2">
                {readingContent.dialogue.map((d, index) => (
                  <div key={index} className="flex items-start gap-3 text-xs sm:text-sm p-2.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                    <span className="font-bold text-indigo-600 min-w-[70px]">{d.speaker}:</span>
                    <span className="text-slate-800 font-medium">{d.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Big Action Button to Complete Reading and Switch to Workbook */}
          <div className="pt-6 border-t border-slate-100">
            <button
              id="btn-finish-reading-and-solve"
              onClick={onFinishReading}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transform active:scale-98 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-6 h-6 text-emerald-200" />
              <span>Men darsni o'qib bo'ldim ➔ Endi Workbook bilan ishlaymiz!</span>
              <ArrowRight className="w-5 h-5 ml-auto" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
