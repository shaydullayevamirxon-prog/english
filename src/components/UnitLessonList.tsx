import React from 'react';
import { GradeCurriculum, BookType, Unit, Lesson, UserProfile } from '../types';
import { BookOpen, Edit3, ArrowLeft, CheckCircle2, Circle, Clock, Lock, Sparkles, ChevronRight } from 'lucide-react';

interface UnitLessonListProps {
  curriculum: GradeCurriculum;
  bookType: BookType;
  user: UserProfile;
  onSelectLesson: (unit: Unit, lesson: Lesson) => void;
  onBackToBooks: () => void;
  onChangeBookType: (type: BookType) => void;
}

export const UnitLessonList: React.FC<UnitLessonListProps> = ({
  curriculum,
  bookType,
  user,
  onSelectLesson,
  onBackToBooks,
  onChangeBookType,
}) => {
  const isWorkbook = bookType === 'workbook';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Breadcrumb & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <button
          id="btn-back-to-books"
          onClick={onBackToBooks}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors self-start cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kitobni almashtirish</span>
        </button>

        {/* Tab switch between Student's Book and Workbook */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            id="tab-switch-students-book"
            onClick={() => onChangeBookType('students_book')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !isWorkbook
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📘 Student's Book</span>
          </button>
          <button
            id="tab-switch-workbook"
            onClick={() => onChangeBookType('workbook')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isWorkbook
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>📕 Workbook</span>
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{curriculum.icon}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
              {curriculum.name}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
              {isWorkbook ? '📕 Workbook (Ish daftari)' : '📘 Student\'s Book (Darslik)'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Mavzular va Darslar ro'yxati
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kerakli darsni tanlang. {isWorkbook ? 'Mavzuni o\'qib bo\'lgach, AI sizga Workbook mashqlarini yechib beradi.' : 'Avval mavzuni yaxshilab o\'qib chiqing.'}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 self-start md:self-auto">
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Jami Unitlar</span>
            <span className="text-lg font-bold text-slate-800">{curriculum.units.length} ta</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Bajarilgan</span>
            <span className="text-lg font-bold text-emerald-600">
              {curriculum.units.reduce((acc, u) => acc + u.lessons.filter(l => user.completedLessons.includes(l.id)).length, 0)} ta
            </span>
          </div>
        </div>
      </div>

      {/* Units & Lessons */}
      <div className="space-y-6">
        {curriculum.units.map((unit) => {
          const unitCompletedCount = unit.lessons.filter(l => user.completedLessons.includes(l.id)).length;
          const isUnitComplete = unitCompletedCount === unit.lessons.length && unit.lessons.length > 0;

          return (
            <div
              key={unit.id}
              id={`unit-block-${unit.id}`}
              className="bg-white rounded-[28px] border border-slate-200 overflow-hidden shadow-sm"
            >
              {/* Unit Title Bar */}
              <div className="p-5 sm:p-6 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-2xl">
                    {unit.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        Unit {unit.number}
                      </span>
                      {isUnitComplete && (
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3" /> Bajarildi
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {unit.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{unit.titleUz}</p>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-slate-500">
                    {unitCompletedCount}/{unit.lessons.length} dars
                  </span>
                </div>
              </div>

              {/* Lessons List in Unit */}
              <div className="divide-y divide-slate-100">
                {unit.lessons.map((lesson) => {
                  const isCompleted = user.completedLessons.includes(lesson.id);
                  const totalExercises = lesson.workbookExercises.length;
                  const solvedExercises = lesson.workbookExercises.filter(ex => user.solvedExercises[ex.id]).length;

                  return (
                    <div
                      key={lesson.id}
                      id={`lesson-item-${lesson.id}`}
                      onClick={() => onSelectLesson(unit, lesson)}
                      className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-colors ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : lesson.number}
                        </div>

                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-slate-500">{lesson.titleUz}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                            {isWorkbook ? (
                              <span>📝 Sahifa: {lesson.workbookPageNumber} • {totalExercises} ta mashq</span>
                            ) : (
                              <span>📖 O'qish matni & Yangi so'zlar</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isWorkbook && solvedExercises > 0 && (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                            {solvedExercises}/{totalExercises} yechilgan
                          </span>
                        )}
                        <button
                          id={`btn-start-lesson-${lesson.id}`}
                          type="button"
                          className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white"
                        >
                          <span>{isWorkbook ? 'Ishlash' : 'O\'qish'}</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
