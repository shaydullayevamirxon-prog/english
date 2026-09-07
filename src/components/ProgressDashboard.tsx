import React from 'react';
import { UserProfile, GradeCurriculum } from '../types';
import { ALL_BADGES } from '../services/storageService';
import { Award, Flame, Star, CheckCircle2, Trophy, ArrowLeft, Target, Sparkles, BookOpen } from 'lucide-react';

interface ProgressDashboardProps {
  user: UserProfile;
  curricula: GradeCurriculum[];
  onBack: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  user,
  curricula,
  onBack,
}) => {
  // Calculate level based on XP
  const level = Math.floor(user.xp / 100) + 1;
  const nextLevelXp = level * 100;
  const currentLevelProgress = user.xp % 100;

  // Solved exercise count
  const totalSolvedExercises = Object.keys(user.solvedExercises).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <button
        id="btn-back-from-progress"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Bosh sahifaga qaytish</span>
      </button>

      {/* Profile Header */}
      <div className="bg-indigo-900 rounded-[32px] p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/10 backdrop-blur-md p-1 flex items-center justify-center text-2xl sm:text-3xl font-bold border border-white/20 shadow-lg text-white">
            {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-amber-950 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Level {level} O'quvchi
              </span>
              <span className="text-xs text-indigo-200 font-bold">
                {user.currentGrade}-sinf
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-white">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-xs text-indigo-200 mt-0.5 font-medium">
              Ingliz tili bilimdonligi va Workbook natijalari
            </p>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[240px]">
          <div className="flex justify-between text-xs font-bold mb-1.5 text-white">
            <span>Level {level}</span>
            <span>{user.xp} / {nextLevelXp} XP</span>
          </div>
          <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${currentLevelProgress}%` }}
            />
          </div>
          <span className="text-[10px] text-indigo-200 block mt-1.5 text-center">
            Keyingi darajaga: {100 - currentLevelProgress} XP qoldi
          </span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        
        {/* Metric 1: Total XP */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-2xl">
            ⭐
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">Jami Ball</span>
            <span className="text-2xl font-bold text-slate-900">{user.xp} XP</span>
            <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
              +{user.todayXP} XP bugun
            </span>
          </div>
        </div>

        {/* Metric 2: Streak */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center text-2xl">
            🔥
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">Ketma-ketlik</span>
            <span className="text-2xl font-bold text-slate-900">{user.streakDays} kun</span>
            <span className="text-[11px] text-orange-600 font-bold block mt-0.5">
              Streak davom etmoqda!
            </span>
          </div>
        </div>

        {/* Metric 3: Exercises */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-2xl">
            ✅
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">Yechilgan mashqlar</span>
            <span className="text-2xl font-bold text-slate-900">{totalSolvedExercises} ta</span>
            <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
              {user.completedLessons.length} ta dars tugatildi
            </span>
          </div>
        </div>

      </div>

      {/* Badges Collection */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-900">
              Yutuqlar va Medallar (Badges)
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {user.badges.length}/{ALL_BADGES.length} ochilgan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = user.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? 'border-amber-300 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 opacity-60 grayscale'
                }`}
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-3xl shadow-xs mb-2">
                  {badge.icon}
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  {badge.nameUz}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {badge.description}
                </p>
                <div className="mt-3">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isUnlocked ? 'Ochilgan ⭐' : 'Qulflangan 🔒'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
