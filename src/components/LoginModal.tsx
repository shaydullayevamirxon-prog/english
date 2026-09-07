import React, { useState } from 'react';
import { GradeNumber } from '../types';
import { Sparkles, GraduationCap, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSubmit: (firstName: string, lastName: string, grade: GradeNumber) => void;
  initialFirstName?: string;
  initialLastName?: string;
  initialGrade?: GradeNumber;
  isFirstTime?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialFirstName = '',
  initialLastName = '',
  initialGrade = 5,
  isFirstTime = false,
}) => {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [selectedGrade, setSelectedGrade] = useState<GradeNumber>(initialGrade);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('Iltimos, ismingizni kiriting');
      return;
    }
    if (!lastName.trim()) {
      setError('Iltimos, familiyangizni kiriting');
      return;
    }
    setError('');
    onSubmit(firstName.trim(), lastName.trim(), selectedGrade);
  };

  const grades: GradeNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        id="modal-login-container"
        className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-slate-200 p-6 sm:p-8 relative overflow-hidden"
      >
        {/* Subtle top ambient glow */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />

        {/* Header with playful illustration badge */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-3xl bg-indigo-50 border border-indigo-100 shadow-sm flex items-center justify-center text-indigo-600">
            <GraduationCap className="w-9 h-9 sm:w-11 sm:h-11" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {isFirstTime ? "Xush kelibsiz! 👋" : "O'quvchi Profili"}
          </h2>
          <p className="text-slate-500 text-sm mt-1.5 max-w-sm mx-auto">
            Ingliz tili darsliklari, Student's Book va Workbook mashqlarini AI bilan oson yechish platformasi
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ismingiz <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-login-firstname"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Masalan: Ali"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Familiyangiz <span className="text-rose-500">*</span>
            </label>
            <input
              id="input-login-lastname"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Masalan: Karimov"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Sinfingizni tanlang (1-11)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {grades.map((g) => (
                <button
                  key={g}
                  type="button"
                  id={`btn-login-grade-${g}`}
                  onClick={() => setSelectedGrade(g)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                    selectedGrade === g
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{g}-sinf</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3">
            <button
              id="btn-login-submit"
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transform active:scale-98 transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Kirish va Boshlash</span>
            </button>
          </div>

          {!isFirstTime && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Bekor qilish
            </button>
          )}
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            1-11-sinf maktab darsliklari va AI yechish kafolati
          </p>
        </div>
      </div>
    </div>
  );
};
