import React from 'react';
import { UserProfile, GradeNumber, ReminderState } from '../types';
import { BookOpen, Flame, Award, Camera, Shield, User, Clock, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  currentView: string;
  onNavigate: (view: string) => void;
  onSelectGrade: (grade: GradeNumber) => void;
  reminder: ReminderState | null;
  onOpenReminderModal: () => void;
  onOpenLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentView,
  onNavigate,
  onSelectGrade,
  reminder,
  onOpenReminderModal,
  onOpenLoginModal,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Back button */}
          <div className="flex items-center gap-3">
            {currentView !== 'dashboard' && currentView !== 'grade_select' && (
              <button
                id="btn-back-nav"
                onClick={() => onNavigate('dashboard')}
                className="w-9 h-9 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center border border-slate-200"
                title="Bosh sahifaga qaytish"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <button
              id="btn-brand-logo"
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg text-white group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg sm:text-xl tracking-tight text-indigo-900">EnglishUp</span>
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wide">
                    1-11 SINF
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">AI English Learning & Workbook Solver</p>
              </div>
            </button>
          </div>

          {/* Quick Stats: Grade Pill, XP, Streak, Timer */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* 5-minute Reminder countdown badge if active */}
            {reminder && reminder.isActive && (
              <button
                id="btn-active-reminder-timer"
                onClick={onOpenReminderModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-500/30 animate-pulse hover:bg-amber-600 transition-colors"
                title="5 daqiqalik dars o'qish eslatmasi"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(reminder.timeLeft)}</span>
              </button>
            )}

            {/* Grade Badge */}
            <button
              id="btn-change-grade-pill"
              onClick={() => onNavigate('grade_select')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-sm text-slate-700 transition-colors"
            >
              <span>{user.currentGrade}-sinf</span>
            </button>

            {/* Streak Counter */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-orange-50 border border-orange-100 text-orange-800 font-bold text-xs"
              title={`${user.streakDays} kunlik ketma-ket streak`}
            >
              <span className="text-base">🔥</span>
              <span className="hidden sm:inline font-bold uppercase text-[10px] tracking-wider text-orange-800">Streak:</span>
              <span className="font-extrabold">{user.streakDays} kun</span>
            </div>

            {/* XP Points */}
            <button
              id="btn-nav-xp"
              onClick={() => onNavigate('progress')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-600 font-bold text-xs hover:bg-amber-100 transition-colors"
            >
              <span className="text-amber-500 font-bold">⭐ {user.xp} XP</span>
            </button>

            {/* Navigation Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 ml-1">
              {/* AI Vision Scanner Button */}
              <button
                id="btn-nav-vision"
                onClick={() => onNavigate('ai_vision')}
                className={`p-2 sm:px-3 sm:py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
                  currentView === 'ai_vision'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100'
                }`}
                title="AI Vision orqali kitob rasmini yechish"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden md:inline">AI Vision</span>
              </button>

              {/* Progress & Badges */}
              <button
                id="btn-nav-progress"
                onClick={() => onNavigate('progress')}
                className={`p-2 sm:px-3 sm:py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
                  currentView === 'progress'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
                title="Yutuqlar va Natijalar"
              >
                <Award className="w-4 h-4" />
                <span className="hidden lg:inline">Yutuqlar</span>
              </button>

              {/* Admin Panel */}
              <button
                id="btn-nav-admin"
                onClick={() => onNavigate('admin')}
                className={`p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors ${
                  currentView === 'admin' ? 'bg-slate-200 text-slate-900' : ''
                }`}
                title="Admin Panel (Kitoblar va mashqlar yuklash)"
              >
                <Shield className="w-4 h-4" />
              </button>

              {/* User Profile Pill */}
              <button
                id="btn-nav-user-profile"
                onClick={onOpenLoginModal}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-all cursor-pointer"
                title="Foydalanuvchi profilini o'zgartirish"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-400 border-2 border-white shadow-xs overflow-hidden flex items-center justify-center text-white font-bold text-xs">
                  {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden xl:block">
                  <h4 className="font-bold text-xs text-indigo-900 leading-tight">
                    {user.firstName} {user.lastName ? user.lastName[0] + '.' : ''}
                  </h4>
                  <p className="text-[10px] text-indigo-600 font-medium">
                    {user.currentGrade}-sinf
                  </p>
                </div>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
