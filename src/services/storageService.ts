import { UserProfile, GradeNumber, BookType, GradeCurriculum, Badge } from '../types';
import { INITIAL_CURRICULUM } from '../data/curriculumData';

const USER_STORAGE_KEY = 'ai_english_user_profile_v1';
const CURRICULUM_STORAGE_KEY = 'ai_english_curriculum_custom_v2';

export const ALL_BADGES: Badge[] = [
  { id: 'first_login', name: 'New Student', nameUz: 'Yangi O\'quvchi', description: 'Platformaga muvaffaqiyatli a\'zo bo\'ldi', icon: '🌱' },
  { id: 'first_lesson', name: 'First Lesson Read', nameUz: 'Birinchi Dars', description: 'Student\'s Book darsini to\'liq o\'qib chiqdi', icon: '📖' },
  { id: 'first_workbook', name: 'Workbook Solver', nameUz: 'Mashqlar Ustasi', description: 'Workbook sahifasidagi barcha mashqlarni yechdi', icon: '✏️' },
  { id: 'vocab_master', name: 'Word Master', nameUz: 'Lug\'at Bilimdoni', description: 'Flashcards orqali so\'zlarni muvaffaqiyatli yodladi', icon: '🧠' },
  { id: 'ai_vision_user', name: 'AI Vision Scout', nameUz: 'AI Vision Kashfiyotchisi', description: 'Kameradan yoki rasmdan varaq yuklab yechdi', icon: '📸' },
  { id: 'streak_3', name: '3-Day Fire Streak', nameUz: '3 Kunlik Qat\'iyat', description: 'Ketma-ket 3 kun dars bajardi', icon: '🔥' },
  { id: 'streak_7', name: 'Weekly Champion', nameUz: 'Haftalik Chempion', description: 'Ketma-ket 7 kunlik streak to\'pladi', icon: '⚡' },
  { id: 'xp_500', name: 'Grammar Master', nameUz: 'Grammatika Bilimdoni', description: '500 dan ortiq XP to\'pladi', icon: '⭐' },
  { id: 'xp_1000', name: 'Top English Scholar', nameUz: 'Oliy Maktab Yulduzi', description: '1000 dan ortiq XP to\'pladi', icon: '🏆' },
];

export function getStoredUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
}

export function createInitialUserProfile(firstName: string, lastName: string, grade: GradeNumber = 5): UserProfile {
  const today = new Date().toISOString().split('T')[0];
  const newProfile: UserProfile = {
    id: 'user_' + Date.now(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    currentGrade: grade,
    xp: 150, // Welcome bonus
    streakDays: 1,
    lastActiveDate: today,
    completedLessons: [],
    solvedExercises: {},
    userAnswers: {},
    dailyGoalXP: 50,
    todayXP: 25,
    badges: ['first_login'],
    avatarColor: 'from-blue-500 to-indigo-600',
    lastStudied: {
      grade: grade,
      bookType: 'students_book',
      unitId: `g${grade}-u1`,
      lessonId: `g${grade}-u1-l1`,
    },
  };
  saveUserProfile(newProfile);
  return newProfile;
}

export function addXpToUser(profile: UserProfile, amount: number): UserProfile {
  const updated = {
    ...profile,
    xp: profile.xp + amount,
    todayXP: profile.todayXP + amount,
  };

  // Check badges
  const newBadges = [...updated.badges];
  if (updated.xp >= 500 && !newBadges.includes('xp_500')) {
    newBadges.push('xp_500');
  }
  if (updated.xp >= 1000 && !newBadges.includes('xp_1000')) {
    newBadges.push('xp_1000');
  }

  updated.badges = newBadges;
  saveUserProfile(updated);
  return updated;
}

export function markLessonCompleted(profile: UserProfile, lessonId: string): UserProfile {
  if (profile.completedLessons.includes(lessonId)) return profile;

  const newCompleted = [...profile.completedLessons, lessonId];
  const newBadges = [...profile.badges];
  if (!newBadges.includes('first_lesson')) {
    newBadges.push('first_lesson');
  }

  const updated: UserProfile = {
    ...profile,
    completedLessons: newCompleted,
    badges: newBadges,
    xp: profile.xp + 30, // 30 XP for finishing reading lesson
    todayXP: profile.todayXP + 30,
  };
  saveUserProfile(updated);
  return updated;
}

export function markExerciseSolved(
  profile: UserProfile,
  exerciseId: string,
  answers: Record<string, string>
): UserProfile {
  const newSolved = { ...profile.solvedExercises, [exerciseId]: true };
  const newAnswers = {
    ...profile.userAnswers,
    [exerciseId]: { ...(profile.userAnswers[exerciseId] || {}), ...answers },
  };

  const newBadges = [...profile.badges];
  if (!newBadges.includes('first_workbook')) {
    newBadges.push('first_workbook');
  }

  const updated: UserProfile = {
    ...profile,
    solvedExercises: newSolved,
    userAnswers: newAnswers,
    xp: profile.xp + 25,
    todayXP: profile.todayXP + 25,
    badges: newBadges,
  };
  saveUserProfile(updated);
  return updated;
}

export function getCustomCurriculum(): GradeCurriculum[] {
  try {
    const raw = localStorage.getItem(CURRICULUM_STORAGE_KEY);
    if (!raw) return INITIAL_CURRICULUM;
    const parsed = JSON.parse(raw);
    return parsed && Array.isArray(parsed) ? parsed : INITIAL_CURRICULUM;
  } catch {
    return INITIAL_CURRICULUM;
  }
}

export function saveCustomCurriculum(curriculum: GradeCurriculum[]): void {
  try {
    localStorage.setItem(CURRICULUM_STORAGE_KEY, JSON.stringify(curriculum));
  } catch (e) {
    console.error('Failed to save curriculum', e);
  }
}
