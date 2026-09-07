import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  GradeNumber,
  BookType,
  Unit,
  Lesson,
  GradeCurriculum,
  ReminderState,
} from './types';
import {
  getStoredUserProfile,
  createInitialUserProfile,
  saveUserProfile,
  addXpToUser,
  markLessonCompleted,
  markExerciseSolved,
  getCustomCurriculum,
  saveCustomCurriculum,
} from './services/storageService';

// Subcomponents
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { GradeSelector } from './components/GradeSelector';
import { BookSelector } from './components/BookSelector';
import { UnitLessonList } from './components/UnitLessonList';
import { StudentsBookReader } from './components/StudentsBookReader';
import { WorkbookSolver } from './components/WorkbookSolver';
import { ReadingReminderModal } from './components/ReadingReminderModal';
import { WorkbookTransitionModal } from './components/WorkbookTransitionModal';
import { ExplanationModal } from './components/ExplanationModal';
import { AiVisionScanner } from './components/AiVisionScanner';
import { AdminPanel } from './components/AdminPanel';
import { ProgressDashboard } from './components/ProgressDashboard';
import { VocabularyTrainer } from './components/VocabularyTrainer';

type ViewMode =
  | 'dashboard'
  | 'grade_select'
  | 'book_select'
  | 'unit_lessons'
  | 'reading_students_book'
  | 'workbook_solver'
  | 'ai_vision'
  | 'admin'
  | 'progress'
  | 'vocabulary';

export default function App() {
  // 1. User Profile State
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUserProfile());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 2. Curriculum State
  const [curricula, setCurricula] = useState<GradeCurriculum[]>(() => getCustomCurriculum());

  // 3. Navigation & Selection State
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedGrade, setSelectedGrade] = useState<GradeNumber>(user ? user.currentGrade : 5);
  const [selectedBookType, setSelectedBookType] = useState<BookType>('students_book');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // 4. Modals State
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isExpiredReminderPrompt, setIsExpiredReminderPrompt] = useState(false);
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);

  // 5. Explanation Modal State
  const [explanationModal, setExplanationModal] = useState<{
    isOpen: boolean;
    question: string;
    answer: string;
    explanation: string;
    grade: number;
  }>({
    isOpen: false,
    question: '',
    answer: '',
    explanation: '',
    grade: 5,
  });

  // 6. 5-Minute Reminder Countdown State
  const [reminder, setReminder] = useState<ReminderState | null>(null);

  // Ensure default user if not logged in
  useEffect(() => {
    if (!user) {
      setIsLoginModalOpen(true);
    }
  }, [user]);

  // Handle 5-minute timer countdown
  useEffect(() => {
    if (!reminder || !reminder.isActive) return;

    const interval = setInterval(() => {
      setReminder((prev) => {
        if (!prev || !prev.isActive) return null;
        if (prev.timeLeft <= 1) {
          clearInterval(interval);
          // Trigger reminder notification modal!
          setIsExpiredReminderPrompt(true);
          setIsReminderModalOpen(true);
          return { ...prev, isActive: false, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [reminder?.isActive]);

  // Handler: Login / Profile setup
  const handleLoginSubmit = (firstName: string, lastName: string, grade: GradeNumber) => {
    const newProfile = createInitialUserProfile(firstName, lastName, grade);
    setUser(newProfile);
    setSelectedGrade(grade);
    setIsLoginModalOpen(false);
    setCurrentView('dashboard');
  };

  // Handler: Select Grade
  const handleSelectGrade = (grade: GradeNumber) => {
    setSelectedGrade(grade);
    if (user) {
      const updated = { ...user, currentGrade: grade };
      setUser(updated);
      saveUserProfile(updated);
    }
    setCurrentView('book_select');
  };

  // Handler: Select Book (Student's Book vs Workbook)
  const handleSelectBook = (bookType: BookType) => {
    setSelectedBookType(bookType);
    setCurrentView('unit_lessons');
  };

  // Handler: Select Lesson from list
  const handleSelectLesson = (unit: Unit, lesson: Lesson) => {
    setSelectedUnit(unit);
    setSelectedLesson(lesson);

    if (selectedBookType === 'students_book') {
      setCurrentView('reading_students_book');
    } else {
      // User clicked a lesson in Workbook!
      // Requirement 4: Ask "Birinchi mavzuni o'qib bo'ldingizmi?" before workbook
      setIsExpiredReminderPrompt(false);
      setIsReminderModalOpen(true);
    }
  };

  // Handler: "Ha, o'qidim" in reminder modal
  const handleConfirmRead = () => {
    setIsReminderModalOpen(false);
    // Requirement 5: Display "Endi Workbook bilan ishlaymiz!" modal
    setIsTransitionModalOpen(true);
  };

  // Handler: "5 daqiqadan keyin eslat" in reminder modal
  const handleStartFiveMinuteReminder = () => {
    if (!selectedLesson || !selectedUnit) return;
    setIsReminderModalOpen(false);
    // Start 5-minute (300 seconds) timer
    setReminder({
      isActive: true,
      timeLeft: 300, // 5 minutes
      unitId: selectedUnit.id,
      lessonId: selectedLesson.id,
    });
    // Direct them to read Student's Book in the meantime
    setSelectedBookType('students_book');
    setCurrentView('reading_students_book');
  };

  // Handler: Finish reading in Student's Book -> open transition to Workbook
  const handleFinishReading = () => {
    if (user && selectedLesson) {
      const updated = markLessonCompleted(user, selectedLesson.id);
      setUser(updated);
    }
    // Show celebration transition: "Endi Workbook bilan ishlaymiz!"
    setIsTransitionModalOpen(true);
  };

  // Handler: Proceed from Transition Modal into Workbook page
  const handleProceedToWorkbook = () => {
    setIsTransitionModalOpen(false);
    setSelectedBookType('workbook');
    setCurrentView('workbook_solver');
  };

  // Handler: Save answers from Workbook Solver
  const handleSaveWorkbookAnswers = (exerciseId: string, answers: Record<string, string>) => {
    if (!user) return;
    const updated = markExerciseSolved(user, exerciseId, answers);
    setUser(updated);
  };

  // Handler: Open Explanation ("Nega bu javob?")
  const handleOpenExplanation = (
    question: string,
    answer: string,
    explanation: string,
    grade: number
  ) => {
    setExplanationModal({
      isOpen: true,
      question,
      answer,
      explanation,
      grade,
    });
  };

  // Handler: Add XP
  const handleAwardXp = (amount: number) => {
    if (!user) return;
    const updated = addXpToUser(user, amount);
    setUser(updated);
  };

  // Handler: Update curricula in Admin Panel
  const handleUpdateCurricula = (newCurricula: GradeCurriculum[]) => {
    setCurricula(newCurricula);
    saveCustomCurriculum(newCurricula);
  };

  const currentCurriculum = curricula.find((c) => c.grade === selectedGrade) || curricula[4]; // Default 5th grade

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Global Navigation Bar */}
      {user && (
        <Navbar
          user={user}
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view as ViewMode)}
          onSelectGrade={handleSelectGrade}
          reminder={reminder}
          onOpenReminderModal={() => {
            setIsExpiredReminderPrompt(false);
            setIsReminderModalOpen(true);
          }}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
        />
      )}

      {/* 2. Main Content Area */}
      <main className="flex-1">
        {/* Dashboard: Grade Cards selection (1-11) */}
        {(currentView === 'dashboard' || currentView === 'grade_select') && user && (
          <GradeSelector
            curricula={curricula}
            user={user}
            onSelectGrade={handleSelectGrade}
          />
        )}

        {/* Book Selector: 📘 Student's Book vs 📕 Workbook */}
        {currentView === 'book_select' && (
          <BookSelector
            curriculum={currentCurriculum}
            onSelectBook={handleSelectBook}
            onBackToGrades={() => setCurrentView('grade_select')}
          />
        )}

        {/* Units and Lessons List */}
        {currentView === 'unit_lessons' && user && (
          <UnitLessonList
            curriculum={currentCurriculum}
            bookType={selectedBookType}
            user={user}
            onSelectLesson={handleSelectLesson}
            onBackToBooks={() => setCurrentView('book_select')}
            onChangeBookType={(type) => setSelectedBookType(type)}
            onOpenVocabTrainer={() => setCurrentView('vocabulary')}
          />
        )}

        {/* Student's Book Reader */}
        {currentView === 'reading_students_book' && selectedUnit && selectedLesson && (
          <StudentsBookReader
            curriculum={currentCurriculum}
            unit={selectedUnit}
            lesson={selectedLesson}
            onBackToLessons={() => setCurrentView('unit_lessons')}
            onFinishReading={handleFinishReading}
            onOpenVocabTrainer={() => setCurrentView('vocabulary')}
          />
        )}

        {/* Workbook Solver Page */}
        {currentView === 'workbook_solver' && selectedUnit && selectedLesson && user && (
          <WorkbookSolver
            curriculum={currentCurriculum}
            unit={selectedUnit}
            lesson={selectedLesson}
            userAnswers={user.userAnswers}
            onSaveAnswers={handleSaveWorkbookAnswers}
            onOpenExplanation={handleOpenExplanation}
            onBackToLessons={() => setCurrentView('unit_lessons')}
            onGoToStudentsBook={() => {
              setSelectedBookType('students_book');
              setCurrentView('reading_students_book');
            }}
          />
        )}

        {/* AI Vision Scanner */}
        {currentView === 'ai_vision' && user && (
          <AiVisionScanner
            user={user}
            onBack={() => setCurrentView('dashboard')}
            onAwardXp={handleAwardXp}
            onOpenExplanation={handleOpenExplanation}
          />
        )}

        {/* Admin Panel */}
        {currentView === 'admin' && (
          <AdminPanel
            curricula={curricula}
            onUpdateCurricula={handleUpdateCurricula}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {/* Progress & Achievements Dashboard */}
        {currentView === 'progress' && user && (
          <ProgressDashboard
            user={user}
            curricula={curricula}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {/* Vocabulary & Flashcards Trainer */}
        {currentView === 'vocabulary' && user && (
          <VocabularyTrainer
            user={user}
            curricula={curricula}
            selectedGrade={selectedGrade}
            initialUnitId={selectedUnit?.id}
            onBack={() => setCurrentView('dashboard')}
            onAddXp={handleAwardXp}
          />
        )}
      </main>

      {/* 3. Global Modals */}

      {/* Login & Onboarding Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSubmit={handleLoginSubmit}
        initialFirstName={user?.firstName || ''}
        initialLastName={user?.lastName || ''}
        initialGrade={user?.currentGrade || 5}
        isFirstTime={!user}
      />

      {/* Reading Reminder Modal ("Birinchi mavzuni o'qib bo'ldingizmi?") */}
      <ReadingReminderModal
        isOpen={isReminderModalOpen}
        unit={selectedUnit}
        lesson={selectedLesson}
        isExpiredPrompt={isExpiredReminderPrompt}
        onConfirmRead={handleConfirmRead}
        onStartFiveMinuteReminder={handleStartFiveMinuteReminder}
        onClose={() => setIsReminderModalOpen(false)}
        onGoToStudentsBook={() => {
          setIsReminderModalOpen(false);
          setSelectedBookType('students_book');
          setCurrentView('reading_students_book');
        }}
      />

      {/* Workbook Transition Modal ("Endi Workbook bilan ishlaymiz!") */}
      <WorkbookTransitionModal
        isOpen={isTransitionModalOpen}
        onProceed={handleProceedToWorkbook}
        lessonTitle={selectedLesson?.title || ''}
        workbookPageNumber={selectedLesson?.workbookPageNumber || 1}
      />

      {/* Explanation Modal ("Nega bu javob?") */}
      <ExplanationModal
        isOpen={explanationModal.isOpen}
        question={explanationModal.question}
        answer={explanationModal.answer}
        initialExplanation={explanationModal.explanation}
        grade={explanationModal.grade}
        studentName={user?.firstName || 'O\'quvchi'}
        onClose={() => setExplanationModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>📘 AI English Learning + Workbook Solver • 1-11 sinf</span>
          <span>Google Gemini 3.8 Flash bilan jihozlangan</span>
        </div>
      </footer>
    </div>
  );
}
