import React from 'react';
import { GradeCurriculum, BookType } from '../types';
import { BookOpen, Edit3, ArrowLeft, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

interface BookSelectorProps {
  curriculum: GradeCurriculum;
  onSelectBook: (bookType: BookType) => void;
  onBackToGrades: () => void;
}

export const BookSelector: React.FC<BookSelectorProps> = ({
  curriculum,
  onSelectBook,
  onBackToGrades,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <button
        id="btn-back-to-grades"
        onClick={onBackToGrades}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Boshqa sinfni tanlash</span>
      </button>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
          <span className="text-sm">{curriculum.icon}</span>
          <span>{curriculum.name} — Ingliz Tili</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Kitobni tanlang
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Student's Book orqali yangi mavzuni o'qing, so'ngra Workbook daftari bilan mashqlarni AI yordamida bajaring!
        </p>
      </div>

      {/* Two Main Book Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* 1. Student's Book Card */}
        <div
          id="card-students-book"
          onClick={() => onSelectBook('students_book')}
          className="group relative rounded-[28px] bg-white border border-slate-200 hover:border-indigo-500 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col justify-between"
        >
          {/* Top banner tag */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-bold flex items-center gap-1.5">
            <span>📘 O'qish Kitobi</span>
          </div>

          <div>
            {/* Book Cover Illustration */}
            <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-6 bg-gradient-to-tr from-indigo-800 via-indigo-600 to-sky-500 p-6 flex flex-col justify-between shadow-inner text-white group-hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg">
                  {curriculum.name}
                </span>
                <span className="text-2xl">📘</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight leading-tight">
                  Student's Book
                </h3>
                <p className="text-xs text-indigo-100 mt-1 font-medium">
                  {curriculum.studentsBookTitle}
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-indigo-200 border-t border-white/20 pt-2">
                <span>CEFR {curriculum.cefrLevel}</span>
                <span>Barcha mavzular</span>
              </div>
            </div>

            <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              📘 Student's Book (Darslik)
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Mavzular, yangi so'zlar (vocabulary), qoidalar (grammar), qiziqarli o'qish matnlari va dialoglar.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                <span>Interaktiv audio talaffuz va lug'atlar</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                <span>Har bir dars uchun o'zbekcha qoidalar</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                <span>Darsni o'qish uchun 5 daqiqalik timer</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <button
              id="btn-open-students-book"
              type="button"
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Darslikni ochish</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
          </div>
        </div>

        {/* 2. Workbook Card */}
        <div
          id="card-workbook"
          onClick={() => onSelectBook('workbook')}
          className="group relative rounded-[28px] bg-white border border-slate-200 hover:border-indigo-500 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col justify-between"
        >
          {/* Top banner tag */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>AI Solver Mavjud</span>
          </div>

          <div>
            {/* Book Cover Illustration */}
            <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-6 bg-gradient-to-tr from-indigo-900 via-indigo-700 to-purple-600 p-6 flex flex-col justify-between shadow-inner text-white group-hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg">
                  {curriculum.name}
                </span>
                <span className="text-2xl">📕</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight leading-tight">
                  Workbook (Ish daftari)
                </h3>
                <p className="text-xs text-indigo-200 mt-1 font-medium">
                  {curriculum.workbookTitle}
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-indigo-300 border-t border-white/20 pt-2">
                <span>Bo'sh joylar & Mashqlar</span>
                <span>AI Auto-Solver</span>
              </div>
            </div>

            <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              📕 Workbook (Mashqlar daftari)
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Haqiqiy kitob varag'i ko'rinishida bo'sh joylarni to'ldirish, testlar va "✏️ Ishlash" tugmasi orqali AI bilan yechish.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>"✏️ Ishlash" tugmasi orqali sahifa ustiga yozish</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>"💡 Nega bu javob?" tushuntirish tizimi</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Har bir yechilgan mashq uchun XP va ball</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <button
              id="btn-open-workbook"
              type="button"
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Workbook sahifasini ochish</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
