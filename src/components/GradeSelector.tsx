import React from 'react';
import { GradeCurriculum, GradeNumber, UserProfile } from '../types';
import { Sparkles, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';

interface GradeSelectorProps {
  curricula: GradeCurriculum[];
  user: UserProfile;
  onSelectGrade: (grade: GradeNumber) => void;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({
  curricula,
  user,
  onSelectGrade,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title section */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>O'zbekiston Maktab Dasturi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Sinfingizni tanlang
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          1-sinfdan 11-sinfgacha Student's Book va Workbook kitoblari, mavzular hamda AI yordamida mashqlarni yechish
        </p>
      </div>

      {/* Grade Cards Grid (1 to 11) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {curricula.map((curriculum) => {
          const isCurrent = user.currentGrade === curriculum.grade;
          const totalUnits = curriculum.units.length;
          const totalLessons = curriculum.units.reduce((acc, u) => acc + u.lessons.length, 0);

          return (
            <div
              key={curriculum.grade}
              id={`card-grade-${curriculum.grade}`}
              onClick={() => onSelectGrade(curriculum.grade)}
              className={`group relative rounded-[28px] bg-white border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden ${
                isCurrent
                  ? 'border-indigo-600 ring-2 ring-indigo-200 shadow-md'
                  : 'border-slate-200 hover:border-indigo-300 shadow-xs'
              }`}
            >
              {/* Background gradient hint */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${curriculum.color} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`}
              />

              <div>
                {/* Header with grade icon and CEFR badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 group-hover:scale-105 transition-all flex items-center justify-center text-3xl shadow-xs">
                    {curriculum.icon}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] border border-slate-200">
                      {curriculum.cefrLevel}
                    </span>
                    {isCurrent && (
                      <span className="mt-1 flex items-center gap-1 text-[10px] font-bold text-indigo-600">
                        <CheckCircle2 className="w-3 h-3" /> Hozirgi sinf
                      </span>
                    )}
                  </div>
                </div>

                {/* Grade Title and Subtitle */}
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {curriculum.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium line-clamp-1">
                  {curriculum.subtitle}
                </p>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-semibold">Bo'limlar</span>
                    <span className="font-bold text-slate-800">{totalUnits} ta Unit</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-semibold">Darslar</span>
                    <span className="font-bold text-slate-800">{totalLessons} ta dars</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="mt-5 pt-3">
                <div className="w-full py-2.5 px-4 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-700 font-bold text-xs flex items-center justify-between transition-all">
                  <span>Darsliklarga o'tish</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
