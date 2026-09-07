import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy initialization of Gemini client
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAI;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', geminiAvailable: !!process.env.GEMINI_API_KEY });
});

// 1. Solve Workbook Exercises using Gemini
app.post('/api/gemini/solve', async (req, res) => {
  try {
    const { grade, unitTitle, lessonTitle, exercises } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Fallback pre-calculated answers if key is missing in environment
      return res.json({
        success: true,
        source: 'local_preset',
        solutions: exercises.map((ex: any) => ({
          exerciseId: ex.id,
          answers: ex.items.map((item: any) => ({
            itemId: item.id,
            answer: item.correctAnswer || item.answerKey || 'Answer',
            explanation: item.explanationUz || 'Javob qoidaga asosan to\'g\'ri tanlandi.',
          })),
        })),
      });
    }

    const prompt = `You are an expert English Language Teacher and Workbook Solver for school students in Uzbekistan (Grade ${grade}).
Unit: "${unitTitle}", Lesson: "${lessonTitle}".
Analyze the following workbook exercises and provide the exact correct answers for each blank/item, along with a simple, encouraging explanation in Uzbek suitable for a ${grade}-grade student.

Exercises to solve:
${JSON.stringify(exercises, null, 2)}

Return ONLY valid JSON matching this exact structure:
{
  "solutions": [
    {
      "exerciseId": "ex-1",
      "answers": [
        {
          "itemId": "item-1",
          "answer": "the exact fill-in word or choice letter/word",
          "explanation": "Short, clear Uzbek explanation (e.g., Nega bu javob? 'He' uchinchi shaxs bo'lgani uchun 'is' ishlatiladi)."
        }
      ]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const responseText = response.text?.trim() || '{}';
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      // Extract json block
      const match = responseText.match(/\{[\s\S]*\}/);
      data = match ? JSON.parse(match[0]) : { solutions: [] };
    }

    res.json({ success: true, source: 'gemini', ...data });
  } catch (error: any) {
    console.error('Error solving exercises with Gemini:', error);
    res.status(500).json({ error: error.message || 'Failed to solve exercises' });
  }
});

// 2. Explain specific answer in Uzbek ("Nega bu javob?")
app.post('/api/gemini/explain', async (req, res) => {
  try {
    const { question, answer, grade, context } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        explanation: `Ushbu mashqda to'g'ri javob: "${answer}". Bu ingliz tili grammatikasi qoidasiga mos keladi.`,
      });
    }

    const prompt = `You are a warm, supportive English teacher in Uzbekistan explaining a workbook answer to a Grade ${grade || '5'} student.
Context: ${context || 'English Workbook'}
Question: "${question}"
Correct Answer: "${answer}"

Task: Explain clearly and warmly in Uzbek (O'zbek tilida) why this answer is correct ("Nega bu javob?").
- For 1st to 4th grade: Keep it very simple, fun, using emojis.
- For 5th to 8th grade: Explain the specific grammar or vocabulary rule with a mini example.
- For 9th to 11th grade: Give a solid grammatical rule, context clues, and common exam tip.
Keep the explanation under 3-4 sentences. Do not use complex jargon.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });

    res.json({ explanation: response.text?.trim() });
  } catch (error: any) {
    console.error('Error explaining answer:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. AI Vision: Solve exercises from uploaded Workbook Image/Photo
app.post('/api/gemini/vision-solve', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', grade = 5 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        success: true,
        source: 'mock_demo',
        pageTitle: 'Workbook Unit Practice',
        detectedExercises: [
          {
            id: 'vision-ex-1',
            instruction: '1. Complete the sentences with the correct form of the verbs in brackets.',
            items: [
              { id: 'v1', question: '1. She usually ______ (walk) to school.', answer: 'walks', explanation: 'She uchinchi shaxs birlik bo\'lgani uchun fe\'lga -s qo\'shiladi (walks).' },
              { id: 'v2', question: '2. They ______ (not like) fast food.', answer: 'do not like', explanation: 'They ko\'plik bo\'lgani uchun Present Simple inkori \'do not like\' bo\'ladi.' },
              { id: 'v3', question: '3. Where ______ you ______ (live)?', answer: 'do / live', explanation: 'Savol tuzishda \'you\' oldidan \'do\' yordamchi fe\'li qo\'yiladi.' },
            ],
          },
          {
            id: 'vision-ex-2',
            instruction: '2. Match the words with their definitions.',
            items: [
              { id: 'v4', question: 'Library', answer: 'A place where books are kept', explanation: 'Library — kutubxona ma\'nosini bildiradi.' },
              { id: 'v5', question: 'Scientist', answer: 'A person who studies science', explanation: 'Scientist — olim demakdir.' },
            ],
          },
        ],
      });
    }

    // Clean base64 string if it has data url prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const prompt = `You are a high-level AI Vision Workbook Solver for school students in Uzbekistan (Grade ${grade}).
Look carefully at this uploaded English workbook page image:
1. Identify all exercise sections, instructions, and numbered questions.
2. Read the handwritten blanks, multiple choices, fill-in-the-gaps, or matching exercises.
3. Solve every question with 100% accurate English answers.
4. For each question, provide:
   - question text
   - the exact answer to be written into the blank
   - a concise Uzbek explanation ("Nega bu javob?")

Return ONLY a JSON object with this exact structure:
{
  "pageTitle": "Unit or Page topic detected from image",
  "detectedExercises": [
    {
      "id": "ex-1",
      "instruction": "Exercise instruction found in image",
      "items": [
        {
          "id": "item-1",
          "question": "Question sentence or item text",
          "answer": "Exact answer to write in workbook blank",
          "explanation": "Short Uzbek explanation for student"
        }
      ]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const responseText = response.text?.trim() || '{}';
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      const match = responseText.match(/\{[\s\S]*\}/);
      data = match ? JSON.parse(match[0]) : { detectedExercises: [] };
    }

    res.json({ success: true, source: 'gemini_vision', ...data });
  } catch (error: any) {
    console.error('Error in AI Vision solve:', error);
    res.status(500).json({ error: error.message || 'Vision analysis failed' });
  }
});

// 4. AI English Tutor Q&A Chatbot
app.post('/api/gemini/ask-tutor', async (req, res) => {
  try {
    const { query, studentName, grade, currentLesson } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        reply: `Salom ${studentName || 'o\'quvchim'}! "${query}" savolingiz juda ajoyib. Ingliz tilida bu qoida muntazam mashq qilish orqali oson o'zlashtiriladi!`,
      });
    }

    const prompt = `You are "Miss Madina" (or "Ustoz Bobur"), a friendly, encouraging AI English Teacher assisting a Uzbek student named "${studentName || 'Student'}" in Grade ${grade || '5'}.
Current Topic: "${currentLesson || 'English Workbook Lesson'}".
Student asked: "${query}".

Answer warmly and clearly in Uzbek (O'zbek tilida).
- Explain simply with 1-2 practical English examples.
- Encourage them with friendly praise.
- Keep response under 100 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.4,
      },
    });

    res.json({ reply: response.text?.trim() });
  } catch (error: any) {
    console.error('Error in tutor chat:', error);
    res.status(500).json({ error: error.message });
  }
});

// Vite middleware for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
