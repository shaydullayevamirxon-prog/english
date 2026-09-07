import React, { useState } from 'react';
import { HelpCircle, X, Volume2, Sparkles, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { explainAnswer, askAiTutor } from '../services/geminiService';

interface ExplanationModalProps {
  isOpen: boolean;
  question: string;
  answer: string;
  initialExplanation: string;
  grade: number;
  studentName: string;
  onClose: () => void;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  isOpen,
  question,
  answer,
  initialExplanation,
  grade,
  studentName,
  onClose,
}) => {
  const [explanation, setExplanation] = useState(initialExplanation);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'tutor'; text: string }[]>([]);
  const [isAskingTutor, setIsAskingTutor] = useState(false);

  // Sync state when props change
  React.useEffect(() => {
    setExplanation(initialExplanation);
    setChatMessages([]);
    setUserQuery('');
  }, [initialExplanation, question, answer]);

  if (!isOpen) return null;

  const speak = (text: string, lang = 'en-US') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const handleAskDeeper = async () => {
    setIsLoadingMore(true);
    try {
      const detailed = await explainAnswer(question, answer, grade, 'Detailed grammar breakdown');
      setExplanation(detailed);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const q = userQuery.trim();
    setUserQuery('');
    setChatMessages((prev) => [...prev, { role: 'user', text: q }]);
    setIsAskingTutor(true);

    try {
      const reply = await askAiTutor(
        `Question: "${question}", Answer: "${answer}". Student query: "${q}"`,
        studentName,
        grade,
        'Workbook explanation'
      );
      setChatMessages((prev) => [...prev, { role: 'tutor', text: reply }]);
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'tutor', text: "Kechirasiz, aloqada xatolik yuz berdi. Iltimos qaytadan urinib ko'ring." },
      ]);
    } finally {
      setIsAskingTutor(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        id="modal-ai-explanation"
        className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-slate-200 p-6 sm:p-7 relative overflow-hidden"
      >
        {/* Close button */}
        <button
          id="btn-close-explanation"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-xl shadow-xs">
            💡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                AI Grammar Tutor
              </span>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                {grade}-sinfga moslashtirilgan
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Nega bu javob?
            </h3>
          </div>
        </div>

        {/* Question & Answer Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Savol / Gap:
          </div>
          <p className="text-slate-800 font-semibold text-sm leading-relaxed mb-3">
            {question}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">To'g'ri javob:</span>
              <span className="text-base font-bold text-blue-600 bg-blue-50/60 px-2.5 py-0.5 rounded-lg border border-slate-300 font-handwriting">
                {answer}
              </span>
            </div>
            <button
              onClick={() => speak(answer)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              title="Talaffuzini eshitish"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Uzbek Explanation Box */}
        <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>O'zbekcha tushuntirish:</span>
            </span>
            <button
              id="btn-re-explain"
              onClick={handleAskDeeper}
              disabled={isLoadingMore}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
            >
              {isLoadingMore ? "Yuklanmoqda..." : "Batafsilroq qoida"}
            </button>
          </div>

          <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line font-medium">
            {explanation}
          </p>
        </div>

        {/* AI Tutor Chat Box */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tushunmadingizmi? Ustoz Madinadan so'rang:</span>
          </div>

          {/* Chat history */}
          {chatMessages.length > 0 && (
            <div className="max-h-36 overflow-y-auto space-y-2 mb-3 pr-1 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white ml-6'
                      : 'bg-slate-100 text-slate-800 mr-6'
                  }`}
                >
                  <span className="font-bold block text-[10px] opacity-75 mb-0.5">
                    {msg.role === 'user' ? 'Siz' : 'Ustoz Madina'}:
                  </span>
                  <span>{msg.text}</span>
                </div>
              ))}
              {isAskingTutor && (
                <div className="p-2 rounded-xl bg-slate-100 text-slate-500 mr-6 text-xs italic animate-pulse">
                  Ustoz javob yozmoqda...
                </div>
              )}
            </div>
          )}

          {/* Chat input */}
          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              id="input-tutor-query"
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Qo'shimcha savolingizni yozing..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            <button
              id="btn-send-tutor-query"
              type="submit"
              disabled={isAskingTutor || !userQuery.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Footer OK */}
        <div className="mt-5 pt-3">
          <button
            id="btn-understand-explanation"
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-indigo-200"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Tushundim, rahmat!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
