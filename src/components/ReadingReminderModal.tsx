import React from 'react';
import { BookOpen, Clock, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { Lesson, Unit } from '../types';

interface ReadingReminderModalProps {
  isOpen: boolean;
  unit: Unit | null;
  lesson: Lesson | null;
  isExpiredPrompt?: boolean;
  onConfirmRead: () => void;
  onStartFiveMinuteReminder: () => void;
  onClose: () => void;
  onGoToStudentsBook: () => void;
}

export const ReadingReminderModal: React.FC<ReadingReminderModalProps> = ({
  isOpen,
  unit,
  lesson,
  isExpiredPrompt = false,
  onConfirmRead,
  onStartFiveMinuteReminder,
  onClose,
  onGoToStudentsBook,
}) => {
  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        id="modal-reading-reminder"
        className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-slate-200 p-6 sm:p-8 relative overflow-hidden text-center"
      >
        {/* Glow ambient */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-3xl bg-amber-50 border border-amber-200 shadow-sm flex items-center justify-center text-amber-600">
          <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
        </div>

        {/* Question */}
        <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-2">
          {unit ? `Unit ${unit.number} • ` : ''}{lesson.title}
        </span>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {isExpiredPrompt ? "5 daqiqa o'tdi! ⏰" : "Darsni o'qish eslatmasi 📚"}
        </h2>

        <p className="text-lg font-bold text-indigo-700 mt-2">
          "Birinchi mavzuni o‘qib bo‘ldingizmi?"
        </p>

        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Workbook mashqlarini mustaqil va tushunib yechish uchun avval Student's Book darsligidagi qoidalarni ko'rib chiqish tavsiya etiladi.
        </p>

        {/* Action Buttons: Exact User Requirements */}
        <div className="mt-8 space-y-3">
          {/* Button 1: Ha, o'qidim */}
          <button
            id="btn-confirm-read-yes"
            type="button"
            onClick={onConfirmRead}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transform active:scale-98 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-100" />
            <span>Ha, o‘qidim (Workbook'ga o'tish)</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </button>

          {/* Button 2: 5 daqiqadan keyin eslat */}
          <button
            id="btn-remind-in-5-min"
            type="button"
            onClick={onStartFiveMinuteReminder}
            className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Clock className="w-4 h-4 text-slate-600" />
            <span>5 daqiqadan keyin eslat (Taymer yoqish)</span>
          </button>

          {/* Quick link: Student's Book darsini hozir o'qish */}
          <button
            id="btn-read-students-book-now"
            type="button"
            onClick={onGoToStudentsBook}
            className="w-full py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            📖 Student's Book matnini hozir o'qish
          </button>
        </div>
      </div>
    </div>
  );
};
