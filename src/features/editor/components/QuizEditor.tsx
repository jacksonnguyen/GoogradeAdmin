import { QuizData, QuizQuestion, QuestionType } from '../../../types/quiz';
import { Plus, Trash2, GripVertical, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { QuestionEditor } from './QuestionEditor';

interface QuizEditorProps {
  quizData: QuizData | null;
  onChange: (data: QuizData) => void;
}

export function QuizEditor({ quizData, onChange }: QuizEditorProps) {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  const questions = quizData?.questions || [];

  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion: QuizQuestion = {
      id: crypto.randomUUID(),
      type,
      question: "Câu hỏi mới",
      points: 1,
      ...(type === 'multichoice' && {
        options: [
          { id: crypto.randomUUID(), text: "Phương án A", isCorrect: true },
          { id: crypto.randomUUID(), text: "Phương án B", isCorrect: false },
        ]
      }),
      ...(type === 'short_answer' && { correctAnswers: [] }),
      ...(type === 'fill_blank' && { content: "Nội dung [đáp án]...", blanks: [] }),
      ...(type === 'sort' && { items: [] }),
      ...(type === 'match' && { pairs: [] }),
      ...(type === 'click_order' && { items: [] }),
    } as QuizQuestion;

    const newData: QuizData = {
      questions: [...questions, newQuestion],
      settings: quizData?.settings || { passingScore: 80, shuffleQuestions: false }
    };
    
    onChange(newData);
    setActiveQuestionId(newQuestion.id);
  };

  const handleRemoveQuestion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Xóa câu hỏi này?")) return;
    
    const newData = {
      ...quizData,
      questions: questions.filter(q => q.id !== id),
      settings: quizData?.settings || { passingScore: 80, shuffleQuestions: false }
    };
    onChange(newData);
    if (activeQuestionId === id) setActiveQuestionId(null);
  };

  const handleQuestionUpdate = (updatedQuestion: QuizQuestion) => {
    const newData = {
      ...quizData,
      questions: questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q),
      settings: quizData?.settings || { passingScore: 80, shuffleQuestions: false }
    };
    onChange(newData as QuizData);
  };

  const activeQuestion = questions.find(q => q.id === activeQuestionId);

  return (
    <div className="quiz-editor">
      {/* Sidebar: Question List */}
      <div className="quiz-editor__sidebar">
        <div className="quiz-editor__header">
          <h3>Danh sách câu hỏi</h3>
          <span className="quiz-editor__count">{questions.length} câu</span>
        </div>

        <div className="quiz-editor__list">
          {questions.map((q, idx) => (
            <div 
              key={q.id} 
              className={`quiz-editor__item ${activeQuestionId === q.id ? 'active' : ''}`}
              onClick={() => setActiveQuestionId(q.id)}
            >
              <div className="quiz-editor__item-grip">
                <GripVertical size={14} className="text-gray-300" />
              </div>
              <div className="quiz-editor__item-content">
                <span className="quiz-editor__item-idx">Câu {idx + 1} ({q.type})</span>
                <span className="quiz-editor__item-text">{q.question}</span>
              </div>
              <button 
                className="quiz-editor__item-delete"
                onClick={(e) => handleRemoveQuestion(q.id, e)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          
          {/* Add Button Dropdown could go here, simplified for now */}
          <div className="quiz-editor__add-actions">
            <button onClick={() => handleAddQuestion('multichoice')} className="quiz-editor__add-btn">
              <Plus size={16} /> Trắc nghiệm
            </button>
            <button onClick={() => handleAddQuestion('short_answer')} className="quiz-editor__add-btn">
              <Plus size={16} /> Điền từ
            </button>
            <div className="w-full h-px bg-gray-100 my-1"></div>
            <button onClick={() => handleAddQuestion('sort')} className="quiz-editor__add-btn">
              <Plus size={16} /> Sắp xếp
            </button>
            <button onClick={() => handleAddQuestion('match')} className="quiz-editor__add-btn">
              <Plus size={16} /> Nối cặp
            </button>
            <button onClick={() => handleAddQuestion('click_order')} className="quiz-editor__add-btn">
              <Plus size={16} /> Thứ tự từ
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Question Detail Editor */}
      <div className="quiz-editor__main">
        {activeQuestion ? (
          <QuestionEditor 
            question={activeQuestion}
            onChange={handleQuestionUpdate}
          />
        ) : (
          <div className="quiz-editor__empty">
            <div className="quiz-editor__empty-icon">
              <CheckCircle2 size={48} />
            </div>
            <h3>Chọn hoặc tạo câu hỏi mới</h3>
            <p>Bắt đầu xây dựng bộ câu hỏi cho bài học này.</p>
          </div>
        )}
      </div>
    </div>
  );
}
