import React, { useState, useEffect } from 'react';
import { Unit, Lesson, GradeCurriculum, ExerciseItem, Exercise } from '../types';
import { solveWorkbookExercises } from '../services/geminiService';
import { Sparkles, Edit3, HelpCircle, CheckCircle2, RotateCcw, Volume2, ArrowLeft, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WorkbookSolverProps {
  curriculum: GradeCurriculum;
  unit: Unit;
  lesson: Lesson;
  userAnswers: Record<string, Record<string, string>>;
  onSaveAnswers: (exerciseId: string, answers: Record<string, string>) => void;
  onOpenExplanation: (question: string, answer: string, explanation: string, grade: number) => void;
  onBackToLessons: () => void;
  onGoToStudentsBook: () => void;
}

export const WorkbookSolver: React.FC<WorkbookSolverProps> = ({
  curriculum,
  unit,
  lesson,
  userAnswers,
  onSaveAnswers,
  onOpenExplanation,
  onBackToLessons,
  onGoToStudentsBook,
}) => {
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, Record<string, string>>>({});
  const [isAiSolving, setIsAiSolving] = useState(false);
  const [hasAiSolved, setHasAiSolved] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'exercise_1' | 'exercise_2'>('all');

  // Load existing user answers
  useEffect(() => {
    const initial: Record<string, Record<string, string>> = {};
    lesson.workbookExercises.forEach((ex) => {
      initial[ex.id] = userAnswers[ex.id] || {};
    });
    setCurrentAnswers(initial);
    // If all exercises already have answers, mark as solved
    const allAnswered = lesson.workbookExercises.every((ex) =>
      ex.items.every((item) => userAnswers[ex.id]?.[item.id])
    );
    if (allAnswered && lesson.workbookExercises.length > 0) {
      setHasAiSolved(true);
    }
  }, [lesson, userAnswers]);

  // Handle student typing in a blank
  const handleInputChange = (exerciseId: string, itemId: string, value: string) => {
    setCurrentAnswers((prev) => {
      const next = {
        ...prev,
        [exerciseId]: {
          ...(prev[exerciseId] || {}),
          [itemId]: value,
        },
      };
      onSaveAnswers(exerciseId, next[exerciseId]);
      return next;
    });
  };

  // Big "✏️ Ishlash" Action with Gemini AI
  const handleAiSolve = async () => {
    setIsAiSolving(true);
    try {
      const response = await solveWorkbookExercises(
        curriculum.grade,
        unit.title,
        lesson.title,
        lesson.workbookExercises
      );

      const newAnswers: Record<string, Record<string, string>> = { ...currentAnswers };

      if (response && response.solutions) {
        response.solutions.forEach((sol) => {
          if (!newAnswers[sol.exerciseId]) {
            newAnswers[sol.exerciseId] = {};
          }
          sol.answers.forEach((ans) => {
            newAnswers[sol.exerciseId][ans.itemId] = ans.answer;
          });
          onSaveAnswers(sol.exerciseId, newAnswers[sol.exerciseId]);
        });
      } else {
        // Fallback to preset correct answers
        lesson.workbookExercises.forEach((ex) => {
          if (!newAnswers[ex.id]) newAnswers[ex.id] = {};
          ex.items.forEach((item) => {
            newAnswers[ex.id][item.id] = item.correctAnswer;
          });
          onSaveAnswers(ex.id, newAnswers[ex.id]);
        });
      }

      setCurrentAnswers(newAnswers);
      setHasAiSolved(true);

      // Celebration confetti!
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    } catch (error) {
      console.error('AI Solve failed:', error);
      // Fallback answers
      const fallback: Record<string, Record<string, string>> = {};
      lesson.workbookExercises.forEach((ex) => {
        fallback[ex.id] = {};
        ex.items.forEach((item) => {
          fallback[ex.id][item.id] = item.correctAnswer;
        });
        onSaveAnswers(ex.id, fallback[ex.id]);
      });
      setCurrentAnswers(fallback);
      setHasAiSolved(true);
    } finally {
      setIsAiSolving(false);
    }
  };

  const handleReset = () => {
    const empty: Record<string, Record<string, string>> = {};
    lesson.workbookExercises.forEach((ex) => {
      empty[ex.id] = {};
      onSaveAnswers(ex.id, {});
    });
    setCurrentAnswers(empty);
    setHasAiSolved(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            id="btn-back-from-workbook"
            onClick={onBackToLessons}
            className="w-9 h-9 rounded-full sm:rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-700 font-bold text-xs bg-white shadow-xs transition-colors"
            title="Darslarga qaytish"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <h2 className="font-bold text-lg text-slate-800 tracking-tight italic">
            📕 Workbook - Sahifa {lesson.workbookPageNumber}
          </h2>

          <button
            id="btn-switch-to-reader-from-wb"
            onClick={onGoToStudentsBook}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Student's Book darsi</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {hasAiSolved && (
            <button
              id="btn-reset-workbook"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs transition-colors"
              title="Javoblarni tozalab, qayta mustaqil ishlash"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tozalash</span>
            </button>
          )}

          <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100 uppercase tracking-wide flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{hasAiSolved ? 'Tahlil qilindi' : 'Tayyor'}</span>
          </div>
        </div>
      </div>

      {/* Hero Solver Action Bar in Vibrant Palette Indigo Theme */}
      <div className="bg-indigo-900 rounded-[32px] p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow & ambient pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-6 -bottom-6 text-8xl opacity-10 rotate-12 pointer-events-none">📖</div>

        <div className="relative z-10 max-w-lg">
          <span className="text-xs font-extrabold uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-indigo-200 border border-indigo-700/50">
            Unit {unit.number} • Workbook Solver
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
            {lesson.title}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1.5 leading-relaxed">
            Quyidagi mashqlarni o'zingiz yozishingiz yoki <strong className="text-white">"✏️ Ishlash (AI Solver)"</strong> tugmasi orqali daftarning ustiga to'g'ri javoblarni yozdirishingiz mumkin.
          </p>
        </div>

        {/* Big "✏️ Ishlash" Button */}
        <div className="relative z-10 self-stretch md:self-auto">
          <button
            id="btn-big-ai-solve"
            onClick={handleAiSolve}
            disabled={isAiSolving}
            className={`w-full md:w-auto px-8 sm:px-10 py-4 rounded-2xl font-bold text-base sm:text-lg shadow-xl shadow-indigo-950/30 flex items-center justify-center gap-3 transition-all transform active:scale-95 cursor-pointer ${
              isAiSolving
                ? 'bg-amber-400 text-amber-950 animate-pulse cursor-wait'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/30 hover:scale-105'
            }`}
          >
            {isAiSolving ? (
              <>
                <Sparkles className="w-6 h-6 animate-spin text-amber-700" />
                <span>AI mashqlarni yechmoqda...</span>
              </>
            ) : hasAiSolved ? (
              <>
                <span className="text-2xl">✏️</span>
                <span>Qayta yechish (AI Solver)</span>
              </>
            ) : (
              <>
                <span className="text-2xl">✏️</span>
                <span>Ishlash (AI Solver)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Authentic Workbook Page Sheet Container */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 sm:p-10 relative flex flex-col">
        
        <div className="bg-slate-50 p-4 sm:p-8 rounded-2xl flex justify-center items-start overflow-hidden border border-slate-200/60">
          <div className="w-full max-w-3xl bg-white shadow-xl rounded-sm border border-slate-300 p-6 sm:p-10 relative flex flex-col gap-6 font-serif">
            
            {/* Page Header */}
            <div className="border-b-2 border-slate-100 pb-4 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-black tracking-widest text-slate-400 uppercase font-sans">
                  WORKBOOK • UNIT {unit.number}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
                  Lesson {lesson.number}: {lesson.title}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                PAGE {lesson.workbookPageNumber}
              </span>
            </div>

            {/* Exercises List inside the Workbook Page */}
            <div className="space-y-8 mt-2">
              {lesson.workbookExercises.map((exercise) => {
                const isExerciseSolved = exercise.items.every(
                  (item) => currentAnswers[exercise.id]?.[item.id]
                );

                return (
                  <div
                    key={exercise.id}
                    id={`workbook-exercise-${exercise.id}`}
                    className="relative bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs"
                  >
                    {/* Exercise Instruction */}
                    <div className="flex items-start justify-between gap-4 mb-4 pb-2 border-b border-slate-100">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 font-sans">
                          {exercise.instruction}
                        </h4>
                        {exercise.hintUz && (
                          <p className="text-xs text-indigo-600 font-medium font-sans mt-1">
                            💡 Maslahat: {exercise.hintUz}
                          </p>
                        )}
                      </div>
                      {isExerciseSolved && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs border border-emerald-100 font-sans flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Bajarildi
                        </span>
                      )}
                    </div>

                    {/* Items in Exercise */}
                    <div className="space-y-6 text-slate-700 leading-relaxed text-base sm:text-lg italic font-serif">
                      {exercise.items.map((item, index) => {
                        const studentAnswer = currentAnswers[exercise.id]?.[item.id] || '';
                        const isFilled = studentAnswer.trim().length > 0;

                        return (
                          <div
                            key={item.id}
                            id={`exercise-item-${item.id}`}
                            className="relative flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50/70 transition-colors"
                          >
                            {/* Question sentence with handwritten ink answer */}
                            <div className="flex-1 flex flex-wrap items-center gap-2">
                              <span className="font-bold text-slate-400 not-italic font-sans text-sm w-5">{index + 1}.</span>
                              {item.preText && <span>{item.preText}</span>}

                              {/* Authentic blue ink handwritten answer */}
                              <div className="relative inline-flex items-center">
                                <input
                                  type="text"
                                  id={`input-answer-${item.id}`}
                                  value={studentAnswer}
                                  onChange={(e) => handleInputChange(exercise.id, item.id, e.target.value)}
                                  placeholder="________"
                                  className={`inline-block border-b-2 px-2 text-center font-handwriting text-xl sm:text-2xl font-bold min-w-[110px] max-w-[210px] focus:outline-none transition-all ${
                                    isFilled
                                      ? 'text-blue-600 border-slate-400 bg-blue-50/40 translate-y-0.5'
                                      : 'text-slate-700 border-slate-300 hover:border-slate-400 focus:border-indigo-500 bg-transparent'
                                  }`}
                                />
                                {isFilled && (
                                  <span className="absolute -top-2.5 -right-2 text-[10px] text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-1 font-mono not-italic">
                                    ✍️
                                  </span>
                                )}
                              </div>

                              {item.postText && <span>{item.postText}</span>}

                              {/* Multiple Choice Options */}
                              {item.options && (
                                <div className="w-full mt-2 flex flex-wrap gap-2 pt-2 border-t border-slate-100 not-italic font-sans">
                                  <span className="text-xs font-bold text-slate-400">Variantlar:</span>
                                  {item.options.map((opt) => (
                                    <button
                                      key={opt}
                                      type="button"
                                      onClick={() => handleInputChange(exercise.id, item.id, opt)}
                                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                                        studentAnswer.toLowerCase() === opt.toLowerCase()
                                          ? 'bg-indigo-600 text-white shadow-xs scale-105'
                                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                                      }`}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* "Nega bu javob?" circular explanation button from Vibrant Palette */}
                            {isFilled && (
                              <button
                                id={`btn-why-answer-${item.id}`}
                                type="button"
                                onClick={() =>
                                  onOpenExplanation(
                                    item.question,
                                    studentAnswer || item.correctAnswer,
                                    item.explanationUz,
                                    curriculum.grade
                                  )
                                }
                                className="w-8 h-8 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-full text-xs font-bold flex items-center justify-center hover:scale-110 shadow-xs transition-all not-italic font-sans shrink-0 cursor-pointer"
                                title="Nega bu javob? AI qoidali tushuntirishini ko'rish"
                              >
                                ?
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Page Footer */}
            <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-400 font-sans">
              📘 O'zbekiston Milliy Dasturi va CEFR standartlariga moslashtirilgan
            </div>

          </div>
        </div>

        {/* Companion AI Explanation summary card from Vibrant Palette theme */}
        <div className="mt-6 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-lg shadow-indigo-200 shadow-md">
              🤖
            </div>
            <div>
              <h4 className="font-bold text-sm text-indigo-900">AI Grammar & Solver Yordamchisi</h4>
              <p className="text-xs text-indigo-700 italic">
                Savollar yonidagi <strong>"?"</strong> tugmasini bosib, nega aynan shu javob to'g'ri ekanligini o'rganing.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white text-indigo-600 text-xs font-bold rounded-lg border border-indigo-200 shadow-xs">
              Gemini 3.8 Flash
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
