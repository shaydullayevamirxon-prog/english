import React from 'react';
import { Sparkles, Edit3, ArrowRight, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WorkbookTransitionModalProps {
  isOpen: boolean;
  onProceed: () => void;
  lessonTitle: string;
  workbookPageNumber: number;
}

export const WorkbookTransitionModal: React.FC<WorkbookTransitionModalProps> = ({
  isOpen,
  onProceed,
  lessonTitle,
  workbookPageNumber,
}) => {
  if (!isOpen) return null;

  const handleLaunch = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // Ignore
    }
    onProceed();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md animate-fade-in">
      <div 
        id="modal-workbook-transition"
        className="w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-slate-200 p-6 sm:p-8 text-center relative overflow-hidden"
      >
        {/* Decorative sparkles */}
        <div className="absolute top-3 left-3 text-amber-400">
          <Star className="w-5 h-5 fill-amber-400" />
        </div>
        <div className="absolute top-5 right-5 text-indigo-400">
          <Sparkles className="w-6 h-6" />
        </div>

        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-indigo-50 border border-indigo-100 shadow-sm flex items-center justify-center text-indigo-600">
          <Edit3 className="w-10 h-10 text-indigo-600" />
        </div>

        {/* Big required heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Ajoyib! 🎉
        </h2>
        
        <p className="text-xl sm:text-2xl font-bold text-indigo-600 mt-2">
          "Endi Workbook bilan ishlaymiz!"
        </p>

        <p className="text-xs sm:text-sm text-slate-600 mt-3">
          Siz darsni muvaffaqiyatli o'qib chiqdingiz. Endi <strong>{workbookPageNumber}-sahifadagi</strong> mashqlarni yechish vaqti keldi!
        </p>

        <div className="mt-4 p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs text-indigo-800 font-semibold">
          💡 Sahifadagi <strong className="text-indigo-600">"✏️ Ishlash"</strong> tugmasi orqali AI barcha mashqlarni sahifaning o'ziga yozib beradi.
        </div>

        <div className="mt-6">
          <button
            id="btn-proceed-to-workbook"
            type="button"
            onClick={handleLaunch}
            className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transform active:scale-98 transition-all cursor-pointer"
          >
            <span>Workbook sahifasini ochish</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
