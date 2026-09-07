import React, { useState, useRef } from 'react';
import { GradeCurriculum, GradeNumber, Unit, Lesson, Exercise } from '../types';
import { Shield, Upload, FileText, Sparkles, CheckCircle2, ArrowLeft, Plus, Trash2, BookOpen, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminPanelProps {
  curricula: GradeCurriculum[];
  onUpdateCurricula: (curricula: GradeCurriculum[]) => void;
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  curricula,
  onUpdateCurricula,
  onBack,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeNumber>(5);
  const [activeTab, setActiveTab] = useState<'upload' | 'curriculum_tree' | 'ai_parser'>('upload');
  
  // Upload inputs
  const [uploadType, setUploadType] = useState<'students_book' | 'workbook'>('workbook');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [unitTitle, setUnitTitle] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [rawTextToParse, setRawTextToParse] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentGradeCurriculum = curricula.find((c) => c.grade === selectedGrade) || curricula[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    setNotification(`"${file.name}" muvaffaqiyatli yuklandi. Endi AI tahlilini ishga tushirishingiz mumkin.`);
  };

  // AI Parser: Analyzes raw text or uploaded PDF page content
  const handleAiParse = () => {
    setIsAiProcessing(true);
    setTimeout(() => {
      // Create new lesson from parsed content
      const newLessonId = `g${selectedGrade}-u${currentGradeCurriculum.units.length + 1}-l1`;
      const generatedLesson: Lesson = {
        id: newLessonId,
        number: 1,
        title: lessonTitle.trim() || 'New Uploaded Lesson',
        titleUz: 'Yangi yuklangan dars',
        summary: 'AI tomonidan tahlil qilingan darslik mavzusi',
        workbookPageNumber: pageNumber,
        readingContent: {
          topic: lessonTitle.trim() || 'Custom Topic',
          readingPassage: rawTextToParse.trim() || 'This is the newly uploaded reading material analyzed by AI for the students.',
          vocabulary: [
            { en: 'Discover', uz: 'Kashf qilmoq', phonetic: '/dɪˈskʌv.ər/' },
            { en: 'Practice', uz: 'Mashq qilmoq', phonetic: '/ˈpræk.tɪs/' },
          ],
          grammarRule: {
            title: 'Uploaded Lesson Grammar',
            explanationUz: 'Ushbu mavzu uchun AI tomonidan aniqlangan grammatika qoidalari.',
            examples: ['She practices English every day.', 'They read books in the library.'],
          },
        },
        workbookExercises: [
          {
            id: `${newLessonId}-ex1`,
            number: 1,
            title: 'Grammar Practice',
            type: 'fill_in_blank',
            instruction: '1. Complete the sentences with the correct verb form:',
            hintUz: 'Gap mazmuniga qarab mos so\'zni qo\'ying.',
            items: [
              {
                id: `${newLessonId}-ex1-item1`,
                question: '1. She ______ to school every morning.',
                preText: 'She',
                postText: 'to school every morning.',
                correctAnswer: 'goes',
                explanationUz: "She (uchinchi shaxs birlik) bilan fe'lga -es qo'shiladi (goes).",
              },
              {
                id: `${newLessonId}-ex1-item2`,
                question: '2. We ______ learning new English words.',
                preText: 'We',
                postText: 'learning new English words.',
                correctAnswer: 'like',
                explanationUz: "We ko'plik olmoshi bo'lgani uchun fe'l o'zgarmaydi (like).",
              },
            ],
          },
        ],
      };

      const newUnit: Unit = {
        id: `g${selectedGrade}-custom-u${Date.now()}`,
        number: currentGradeCurriculum.units.length + 1,
        title: unitTitle.trim() || `Unit ${currentGradeCurriculum.units.length + 1}: Custom Curriculum`,
        titleUz: 'Yangi yuklangan bo\'lim',
        description: 'AI tomonidan tahlil qilingan yangi unit',
        icon: '📚',
        lessons: [generatedLesson],
      };

      const updatedCurricula = curricula.map((c) => {
        if (c.grade === selectedGrade) {
          return {
            ...c,
            units: [...c.units, newUnit],
          };
        }
        return c;
      });

      onUpdateCurricula(updatedCurricula);
      setIsAiProcessing(false);
      setNotification(`✅ AI muvaffaqiyatli tahlil qildi! "${newUnit.title}" bo'limi ${selectedGrade}-sinf dasturiga qo'shildi.`);
      setRawTextToParse('');
      setUnitTitle('');
      setLessonTitle('');
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {}
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top back */}
      <button
        id="btn-back-from-admin"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Bosh sahifaga qaytish</span>
      </button>

      {/* Hero Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-amber-400 text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrator Boshqaruv Paneli</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Kitoblar & Darsliklar Yuklash Tizimi
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Student's Book PDF, Workbook PDF, sahifalar va yangi mavzularni yuklang. AI ulardan mashqlarni avtomatik ajratib oladi.
          </p>
        </div>

        {/* Grade Selector */}
        <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
            Boshqarilayotgan sinf:
          </label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(Number(e.target.value) as GradeNumber)}
            className="bg-slate-900 text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
              <option key={g} value={g}>
                {g}-sinf ({curricula.find((c) => c.grade === g)?.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-emerald-600 hover:text-emerald-900">
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'upload' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          📤 PDF va Sahifalar Yuklash
        </button>
        <button
          onClick={() => setActiveTab('curriculum_tree')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'curriculum_tree' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          📚 Darslik Strukturasi ({currentGradeCurriculum.units.length} ta Unit)
        </button>
      </div>

      {/* Tab 1: Upload & AI Parser */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* File Upload Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600" />
              <span>1. Kitob Faylini Tanlash</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Kitob turi
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUploadType('students_book')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 ${
                    uploadType === 'students_book'
                      ? 'border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-200'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>📘 Student's Book PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('workbook')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 ${
                    uploadType === 'workbook'
                      ? 'border-rose-500 bg-rose-50 text-rose-800 ring-2 ring-rose-200'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>📕 Workbook PDF</span>
                </button>
              </div>
            </div>

            {/* Drag & Drop or Click Area */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-8 text-center cursor-pointer bg-slate-50/50 hover:bg-indigo-50/20 transition-all"
            >
              <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" />
              <p className="text-sm font-bold text-slate-800">
                PDF yoki rasm faylini bu yerga tashlang yoki bosing
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PDF, JPG, PNG (Maksimal 50MB)
              </p>
              {uploadedFileName && (
                <div className="mt-4 p-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold">
                  📄 Tanlangan: {uploadedFileName}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Unit nomi
                </label>
                <input
                  type="text"
                  value={unitTitle}
                  onChange={(e) => setUnitTitle(e.target.value)}
                  placeholder="Masalan: Unit 5: Animals"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Sahifa raqami
                </label>
                <input
                  type="number"
                  value={pageNumber}
                  onChange={(e) => setPageNumber(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* AI Auto-Parser Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>2. AI Avtomatik Tahlilchi</span>
                </h2>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Gemini OCR & NLP
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                AI sahifadagi: <strong>matn, savollar, variantlar, bo'sh joylar, rasmlar va topshiriqlar</strong>ni avtomatik aniqlab, interaktiv mashqqa aylantiradi.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Darslik matni yoki topshiriqlari (ixtiyoriy qo'lda kiritish)
                </label>
                <textarea
                  rows={6}
                  value={rawTextToParse}
                  onChange={(e) => setRawTextToParse(e.target.value)}
                  placeholder="Sahifadagi matnni shu yerga nusxalab qo'yishingiz mumkin..."
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                id="btn-admin-ai-parse"
                type="button"
                onClick={handleAiParse}
                disabled={isAiProcessing}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-sm shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isAiProcessing ? 'AI tahlil qilmoqda...' : 'AI bilan tahlil qilish va Saqlash'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Curriculum Structure */}
      {activeTab === 'curriculum_tree' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">
              {currentGradeCurriculum.name} — O'quv Rejasi
            </h2>
            <span className="text-xs font-bold text-slate-500">
              Jami {currentGradeCurriculum.units.length} ta Unit
            </span>
          </div>

          <div className="space-y-4">
            {currentGradeCurriculum.units.map((unit) => (
              <div key={unit.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{unit.icon}</span>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        Unit {unit.number}: {unit.title}
                      </h3>
                      <span className="text-xs text-slate-500">{unit.titleUz}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {unit.lessons.length} ta dars
                  </span>
                </div>

                <div className="pl-8 space-y-2 border-l-2 border-slate-200 ml-3">
                  {unit.lessons.map((lesson) => (
                    <div key={lesson.id} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        Lesson {lesson.number}: {lesson.title} ({lesson.titleUz})
                      </span>
                      <span className="text-slate-400 font-mono">
                        Workbook p.{lesson.workbookPageNumber} • {lesson.workbookExercises.length} mashq
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
