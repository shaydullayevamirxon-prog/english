import { Exercise } from '../types';

export interface SolveResponse {
  success: boolean;
  source?: string;
  solutions: {
    exerciseId: string;
    answers: {
      itemId: string;
      answer: string;
      explanation: string;
    }[];
  }[];
}

export interface ExplainResponse {
  explanation: string;
}

export interface VisionSolveResponse {
  success: boolean;
  source?: string;
  pageTitle?: string;
  detectedExercises: {
    id: string;
    instruction: string;
    items: {
      id: string;
      question: string;
      answer: string;
      explanation: string;
    }[];
  }[];
}

export interface TutorResponse {
  reply: string;
}

export async function solveWorkbookExercises(
  grade: number,
  unitTitle: string,
  lessonTitle: string,
  exercises: Exercise[]
): Promise<SolveResponse> {
  try {
    const res = await fetch('/api/gemini/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grade, unitTitle, lessonTitle, exercises }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('API solve failed, falling back to local preset answers:', err);
    // Fallback if backend is temporarily disconnected
    return {
      success: true,
      source: 'local_fallback',
      solutions: exercises.map((ex) => ({
        exerciseId: ex.id,
        answers: ex.items.map((item) => ({
          itemId: item.id,
          answer: item.correctAnswer,
          explanation: item.explanationUz,
        })),
      })),
    };
  }
}

export async function explainAnswer(
  question: string,
  answer: string,
  grade: number,
  context?: string
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer, grade, context }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data: ExplainResponse = await res.json();
    return data.explanation;
  } catch (err) {
    console.warn('API explain failed:', err);
    return `Bu savolda to'g'ri javob: "${answer}". Bu ingliz tili qoidasiga to'la mos keladi.`;
  }
}

export async function solveVisionImage(
  imageBase64: string,
  grade: number,
  mimeType: string = 'image/jpeg'
): Promise<VisionSolveResponse> {
  try {
    const res = await fetch('/api/gemini/vision-solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, grade, mimeType }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error('Vision solve error:', err);
    throw err;
  }
}

export async function askAiTutor(
  query: string,
  studentName: string,
  grade: number,
  currentLesson?: string
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/ask-tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, studentName, grade, currentLesson }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data: TutorResponse = await res.json();
    return data.reply;
  } catch (err) {
    console.warn('Tutor chat failed:', err);
    return `Salom ${studentName}! Bu qoidani tushunish uchun avval mashqlarni birma-bir ko'rib chiqing. Siz albatta uddalaysiz!`;
  }
}
