export type GradeNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type BookType = 'students_book' | 'workbook';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  currentGrade: GradeNumber;
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessons: string[]; // lesson ids
  solvedExercises: Record<string, boolean>; // exerciseId -> completed
  userAnswers: Record<string, Record<string, string>>; // exerciseId -> { itemId: answer }
  dailyGoalXP: number;
  todayXP: number;
  badges: string[];
  avatarColor: string;
  lastStudied?: {
    grade: GradeNumber;
    bookType: BookType;
    unitId: string;
    lessonId: string;
  };
}

export interface ExerciseItem {
  id: string;
  question: string;
  preText?: string;
  postText?: string;
  correctAnswer: string;
  options?: string[]; // for multiple choice
  explanationUz: string;
  blankLength?: number;
  userAnswer?: string;
  matchTarget?: string; // for matching exercises
}

export type ExerciseType = 'fill_in_blank' | 'multiple_choice' | 'sentence_scramble' | 'matching' | 'true_false';

export interface Exercise {
  id: string;
  number: number;
  title: string;
  instruction: string;
  type: ExerciseType;
  items: ExerciseItem[];
  hintUz?: string;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  titleUz: string;
  summary: string;
  // Student's book content
  readingContent: {
    topic: string;
    vocabulary: { en: string; uz: string; phonetic?: string }[];
    grammarRule: { title: string; explanationUz: string; examples: string[] };
    readingPassage: string;
    dialogue?: { speaker: string; text: string }[];
  };
  // Workbook content
  workbookPageNumber: number;
  workbookExercises: Exercise[];
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  titleUz: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export interface GradeCurriculum {
  grade: GradeNumber;
  name: string;
  subtitle: string;
  cefrLevel: string;
  color: string;
  accentColor: string;
  icon: string;
  studentsBookTitle: string;
  workbookTitle: string;
  studentsBookCover: string;
  workbookCover: string;
  units: Unit[];
}

export interface Badge {
  id: string;
  name: string;
  nameUz: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface ReminderState {
  isActive: boolean;
  timeLeft: number; // in seconds
  lessonId: string;
  lessonTitle: string;
  grade: GradeNumber;
}

export interface VisionDetectedItem {
  id: string;
  question: string;
  answer: string;
  explanation: string;
}

export interface VisionDetectedExercise {
  id: string;
  instruction: string;
  items: VisionDetectedItem[];
}
