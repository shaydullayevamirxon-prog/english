import React, { useState, useMemo } from 'react';
import { GradeCurriculum, GradeNumber, UserProfile } from '../types';
import {
  Volume2,
  RotateCw,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Brain,
  Search,
  BookOpen,
  Award,
  Layers,
  HelpCircle,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VocabularyTrainerProps {
  user: UserProfile;
  curricula: GradeCurriculum[];
  selectedGrade: GradeNumber;
  initialUnitId?: string;
  onBack: () => void;
  onAddXp: (amount: number) => void;
}

interface VocabItem {
  id: string;
  en: string;
  uz: string;
  phonetic?: string;
  lessonTitle: string;
  unitTitle: string;
  grade: number;
}

export const VocabularyTrainer: React.FC<VocabularyTrainerProps> = ({
  user,
  curricula,
  selectedGrade,
  initialUnitId,
  onBack,
  onAddXp,
}) => {
  const [currentGrade, setCurrentGrade] = useState<GradeNumber>(selectedGrade);
  const [selectedUnitId, setSelectedUnitId] = useState<string>(initialUnitId || 'all');
  const [activeTab, setActiveTab] = useState<'flashcards' | 'quiz' | 'list'>('flashcards');

  // Flashcards state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredWordIds, setMasteredWordIds] = useState<Set<string>>(() => new Set());
  const [needsReviewIds, setNeedsReviewIds] = useState<Set<string>>(() => new Set());

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Search in list
  const [searchQuery, setSearchQuery] = useState('');

  // Find curriculum for current grade
  const currentCurriculum = useMemo(() => {
    return curricula.find((c) => c.grade === currentGrade) || curricula[0];
  }, [curricula, currentGrade]);

  // Extract all vocabulary words based on current grade and unit
  const allVocabWords = useMemo<VocabItem[]>(() => {
    if (!currentCurriculum) return [];
    const list: VocabItem[] = [];

    currentCurriculum.units.forEach((unit) => {
      if (selectedUnitId !== 'all' && unit.id !== selectedUnitId) return;

      unit.lessons.forEach((lesson) => {
        lesson.readingContent.vocabulary.forEach((word, idx) => {
          list.push({
            id: `${unit.id}-${lesson.id}-${idx}`,
            en: word.en,
            uz: word.uz,
            phonetic: word.phonetic,
            lessonTitle: lesson.title,
            unitTitle: unit.titleUz || unit.title,
            grade: currentGrade,
          });
        });
      });
    });

    return list;
  }, [currentCurriculum, selectedUnitId, currentGrade]);

  // Pronunciation TTS
  const speak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; // Clear pace for students
      window.speechSynthesis.speak(utterance);
    }
  };

  // Current flashcard word
  const currentCard = allVocabWords[currentIndex];

  // Handle next/prev card
  const handleNextCard = () => {
    setIsFlipped(false);
    if (currentIndex < allVocabWords.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(allVocabWords.length - 1);
    }
  };

  // Mark as Mastered
  const handleMarkMastered = () => {
    if (!currentCard) return;
    setMasteredWordIds((prev) => new Set(prev).add(currentCard.id));
    setNeedsReviewIds((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });

    onAddXp(10);
    try {
      confetti({ particleCount: 20, spread: 45, origin: { y: 0.8 } });
    } catch {
      // Ignore
    }
    handleNextCard();
  };

  // Mark as Needs Review
  const handleMarkReview = () => {
    if (!currentCard) return;
    setNeedsReviewIds((prev) => new Set(prev).add(currentCard.id));
    setMasteredWordIds((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    handleNextCard();
  };

  // Quiz questions generation
  const currentQuizWord = allVocabWords[quizIndex];
  const quizOptions = useMemo(() => {
    if (!currentQuizWord || allVocabWords.length < 2) return [];

    const correct = currentQuizWord.uz;
    const others = allVocabWords
      .filter((w) => w.uz !== correct)
      .map((w) => w.uz);

    // Shuffle and pick 3 wrong answers
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [correct, ...shuffledOthers];
    return options.sort(() => 0.5 - Math.random());
  }, [currentQuizWord, allVocabWords]);

  const handleQuizAnswer = (option: string) => {
    if (quizSelectedAnswer !== null || !currentQuizWord) return;

    setQuizSelectedAnswer(option);
    if (option === currentQuizWord.uz) {
      setQuizScore((prev) => prev + 1);
      onAddXp(15);
      try {
        confetti({ particleCount: 30, spread: 60 });
      } catch {
        // Ignore
      }
    }
  };

  const handleNextQuizQuestion = () => {
    setQuizSelectedAnswer(null);
    if (quizIndex < allVocabWords.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setQuizSelectedAnswer(null);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  // Filtered list words
  const filteredListWords = useMemo(() => {
    if (!searchQuery.trim()) return allVocabWords;
    const q = searchQuery.toLowerCase();
    return allVocabWords.filter(
      (w) => w.en.toLowerCase().includes(q) || w.uz.toLowerCase().includes(q)
    );
  }, [allVocabWords, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          id="btn-back-from-vocab"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Orqaga qaytish</span>
        </button>

        {/* Grade Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Sinf:</label>
          <select
            id="select-vocab-grade"
            value={currentGrade}
            onChange={(e) => {
              const g = Number(e.target.value) as GradeNumber;
              setCurrentGrade(g);
              setSelectedUnitId('all');
              setCurrentIndex(0);
              setQuizIndex(0);
              setQuizCompleted(false);
            }}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-indigo-900 shadow-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
          >
            {curricula.map((c) => (
              <option key={c.grade} value={c.grade}>
                {c.grade}-sinf
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-indigo-900 rounded-[32px] p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/10 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-bold text-xs uppercase tracking-wider mb-2">
              <Brain className="w-3.5 h-3.5" />
              <span>Smart Vocabulary Trainer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Ingliz tili so'zlarini oson yodlash 🧠
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl">
              {currentGrade}-sinf darsligidagi barcha so'zlarni interaktiv kartochkalar, to'g'ri audio talaffuz va testlar orqali yodlang.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20">
            <div className="text-center px-2">
              <span className="block text-2xl font-bold text-amber-400">
                {allVocabWords.length}
              </span>
              <span className="text-[10px] text-indigo-200 uppercase font-semibold">
                Jami so'zlar
              </span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-2">
              <span className="block text-2xl font-bold text-emerald-300">
                {masteredWordIds.size}
              </span>
              <span className="text-[10px] text-indigo-200 uppercase font-semibold">
                Yodlandi
              </span>
            </div>
          </div>
        </div>

        {/* Unit Filter Pills */}
        <div className="mt-6 pt-4 border-t border-indigo-800/80 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => {
              setSelectedUnitId('all');
              setCurrentIndex(0);
              setQuizIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedUnitId === 'all'
                ? 'bg-white text-indigo-950 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            🌟 Barcha bo'limlar
          </button>
          {currentCurriculum.units.map((u) => (
            <button
              key={u.id}
              onClick={() => {
                setSelectedUnitId(u.id);
                setCurrentIndex(0);
                setQuizIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedUnitId === u.id
                  ? 'bg-white text-indigo-950 shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {u.icon} Unit {u.number}: {u.titleUz || u.title}
            </button>
          ))}
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl mb-8 max-w-md mx-auto border border-slate-200">
        <button
          id="tab-vocab-flashcards"
          onClick={() => setActiveTab('flashcards')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'flashcards'
              ? 'bg-white text-indigo-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>🎴 Flashcards</span>
        </button>

        <button
          id="tab-vocab-quiz"
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-white text-indigo-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>🎯 Test (Quiz)</span>
        </button>

        <button
          id="tab-vocab-list"
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'list'
              ? 'bg-white text-indigo-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>📖 Lug'at ro'yxati</span>
        </button>
      </div>

      {/* 1. FLASHCARDS TAB */}
      {activeTab === 'flashcards' && (
        <div className="max-w-xl mx-auto">
          {allVocabWords.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <p className="text-slate-500 font-bold">Ushbu bo'limda so'zlar topilmadi.</p>
            </div>
          ) : (
            <div>
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3 px-2">
                <span>
                  So'z {currentIndex + 1} / {allVocabWords.length}
                </span>
                <span className="text-indigo-600">
                  {currentCard.unitTitle} • {currentCard.lessonTitle}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-200 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / allVocabWords.length) * 100}%`,
                  }}
                />
              </div>

              {/* Big Interactive 3D Flip Card */}
              <div
                id="flashcard-box"
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full min-h-[320px] bg-white rounded-[32px] border-2 border-slate-200 hover:border-indigo-400 shadow-xl shadow-slate-200/50 p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden transition-all duration-300 group"
              >
                {/* Flip indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Aylantirish uchun bosing</span>
                </div>

                {/* Status indicator if mastered */}
                {masteredWordIds.has(currentCard.id) && (
                  <div className="absolute top-4 left-4 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Yodlandi</span>
                  </div>
                )}

                {/* Card Front (English) */}
                {!isFlipped ? (
                  <div className="animate-fade-in flex flex-col items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Inglizcha so'z
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                      {currentCard.en}
                    </h2>
                    {currentCard.phonetic && (
                      <p className="text-sm font-mono text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl mb-6">
                        {currentCard.phonetic}
                      </p>
                    )}
                    <button
                      id="btn-flashcard-audio"
                      type="button"
                      onClick={(e) => speak(currentCard.en, e)}
                      className="px-5 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-2 border border-indigo-100 transition-all cursor-pointer shadow-xs"
                      title="Talaffuzni eshitish"
                    >
                      <Volume2 className="w-4 h-4 text-indigo-600" />
                      <span>Talaffuzni eshitish</span>
                    </button>
                  </div>
                ) : (
                  /* Card Back (Uzbek translation) */
                  <div className="animate-fade-in flex flex-col items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
                      O'zbekcha ma'nosi
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                      {currentCard.uz}
                    </h2>
                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 max-w-sm">
                      <p className="font-semibold">
                        Inglizcha: <span className="font-bold text-slate-900">{currentCard.en}</span>
                      </p>
                      <p className="mt-1 text-slate-600">
                        {currentCard.lessonTitle} darsidan o'rganilayotgan faol so'z.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Review vs Mastered */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6">
                <button
                  id="btn-vocab-review"
                  type="button"
                  onClick={handleMarkReview}
                  className="py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-slate-500" />
                  <span>Qaytadan takrorlash</span>
                </button>

                <button
                  id="btn-vocab-mastered"
                  type="button"
                  onClick={handleMarkMastered}
                  className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Yodladim! (+10 XP)</span>
                </button>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                <button
                  id="btn-prev-card"
                  onClick={handlePrevCard}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Oldingi so'z</span>
                </button>
                <button
                  id="btn-next-card"
                  onClick={handleNextCard}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Keyingi so'z</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. QUIZ TAB */}
      {activeTab === 'quiz' && (
        <div className="max-w-xl mx-auto">
          {allVocabWords.length < 2 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
              <p className="text-slate-500 font-bold">Test uchun kamida 2 ta so'z bo'lishi kerak.</p>
            </div>
          ) : quizCompleted ? (
            <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-slate-200 text-center shadow-lg">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-3xl mb-4">
                🏆
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Ajoyib natija!</h2>
              <p className="text-sm text-slate-600 mt-2">
                Siz {allVocabWords.length} ta savoldan{' '}
                <strong className="text-indigo-600">{quizScore}</strong> tasiga to'g'ri javob berdingiz!
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={handleRestartQuiz}
                  className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 cursor-pointer"
                >
                  Qaytadan boshlash
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-4">
                <span>
                  Savol {quizIndex + 1} / {allVocabWords.length}
                </span>
                <span className="text-amber-600 font-bold">Ball: {quizScore}</span>
              </div>

              {/* Question */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center mb-6">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Ushbu so'zning o'zbekcha tarjimasi qaysi?
                </span>
                <h3 className="text-3xl font-black text-slate-900 my-2">
                  {currentQuizWord.en}
                </h3>
                <button
                  onClick={() => speak(currentQuizWord.en)}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Eshitish</span>
                </button>
              </div>

              {/* 4 Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {quizOptions.map((opt, idx) => {
                  const isChosen = quizSelectedAnswer === opt;
                  const isCorrect = opt === currentQuizWord.uz;
                  let btnClasses =
                    'p-4 rounded-2xl border text-sm font-bold transition-all text-left flex items-center justify-between cursor-pointer ';

                  if (quizSelectedAnswer === null) {
                    btnClasses += 'bg-slate-50 hover:bg-indigo-50 border-slate-200 hover:border-indigo-300 text-slate-800';
                  } else if (isCorrect) {
                    btnClasses += 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs';
                  } else if (isChosen && !isCorrect) {
                    btnClasses += 'bg-rose-50 border-rose-400 text-rose-800';
                  } else {
                    btnClasses += 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(opt)}
                      disabled={quizSelectedAnswer !== null}
                      className={btnClasses}
                    >
                      <span>{opt}</span>
                      {quizSelectedAnswer !== null && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Next Question */}
              {quizSelectedAnswer !== null && (
                <button
                  onClick={handleNextQuizQuestion}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {quizIndex < allVocabWords.length - 1 ? 'Keyingi savol' : 'Natijani ko\'rish'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. VOCABULARY LIST TAB */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200 shadow-sm">
          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="So'z qidirish (inglizcha yoki o'zbekcha)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredListWords.map((word) => (
              <div
                key={word.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{word.en}</h4>
                    {word.phonetic && (
                      <span className="text-[10px] font-mono text-slate-500">
                        {word.phonetic}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-indigo-700 font-semibold mt-0.5">
                    {word.uz}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => speak(word.en)}
                  className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors cursor-pointer"
                  title="Talaffuzini eshitish"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {filteredListWords.length === 0 && (
            <p className="text-center py-8 text-xs text-slate-400 font-bold">
              Mos so'zlar topilmadi.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
