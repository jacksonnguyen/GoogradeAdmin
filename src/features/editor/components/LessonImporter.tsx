import { useRef, useState } from 'react';
import { Upload, Download, Info, AlertCircle } from 'lucide-react';
import DOMPurify from 'dompurify';
import { QuizData } from '../../../types/quiz';

export interface ImportedLessonData {
  title: string;
  grade: string;
  type: 'theory' | 'practice';
  content: string;
  custom_css?: string;
  quiz_data?: QuizData;
  concepts?: string[]; // List of concept IDs or Names
}

interface LessonImporterProps {
  onImport: (data: ImportedLessonData) => void;
}

export function LessonImporter({ onImport }: LessonImporterProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadTemplate = () => {
    // Template string with comments for better user guidance
    const templateString = `{
  "title": "Bài học mẫu", // Tiêu đề hiển thị (Bắt buộc)
  "grade": "8",       // Khối lớp (8, 9)
  "type": "theory",   // Loại bài: "theory" hoặc "practice"
  "content": "<h2>Tiêu đề bài học</h2><p>Nội dung bài học...</p>", // Nội dung HTML
  "custom_css": ".highlight { color: red; }", // CSS tùy chỉnh
  "concepts": ["101", "102"], // Danh sách ID khái niệm
  "quiz_data": {
    "settings": {
       "passingScore": 80,
       "shuffleQuestions": false,
       "timeLimit": 15
    },
    "questions": [
        {
          "id": "q1",
          "type": "multichoice",
          "question": "Câu hỏi trắc nghiệm?",
          "points": 1,
          "options": [
              { "id": "o1", "text": "Đúng", "isCorrect": true },
              { "id": "o2", "text": "Sai", "isCorrect": false }
          ]
        },
        {
          "id": "q2",
          "type": "match",
          "question": "Nối cặp tương ứng",
          "points": 1,
          "pairs": [
            { "id": "p1", "left": "A", "right": "1" },
            { "id": "p2", "left": "B", "right": "2" }
          ]
        },
        {
          "id": "q3",
          "type": "sort",
          "question": "Sắp xếp theo thứ tự",
          "points": 1,
          "items": [
            { "id": "i1", "content": "Bước 1", "order": 0 },
            { "id": "i2", "content": "Bước 2", "order": 1 }
          ]
        },
        {
          "id": "q4",
          "type": "short_answer",
          "question": "Câu trả lời ngắn?",
          "points": 1,
          "correctAnswers": ["Đáp án", "đáp án"],
          "caseSensitive": true
        },
        {
          "id": "q5",
          "type": "fill_blank",
          "question": "Điền vào chỗ trống",
          "points": 1,
          "content": "Thủ đô của [Vietnam] là [Hanoi]",
          "blanks": [
            { "id": "b1", "answer": "Vietnam" },
            { "id": "b2", "answer": "Hanoi" }
          ]
        },
        {
          "id": "q6",
          "type": "click_order",
          "question": "Chọn từ theo thứ tự",
          "points": 1,
          "items": [
            { "id": "c1", "content": "Tôi", "order": 0 },
            { "id": "c2", "content": "đi", "order": 1 },
            { "id": "c3", "content": "học", "order": 2 }
          ]
        }
    ]
  }
}`;

    const blob = new Blob([templateString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "lesson_template.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowInfo(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        let jsonString = event.target?.result as string;
        // Strip comments (// and /* */) before parsing
        jsonString = jsonString.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
        
        const json = JSON.parse(jsonString);
        
        // Basic Validation
        if (!json.title || !json.content) {
          setError("File thiếu 'title' hoặc 'content'. Vui lòng dùng mẫu chuẩn.");
          return;
        }

        // Sanitize content
        const cleanContent = DOMPurify.sanitize(json.content);
        const cleanCss = DOMPurify.sanitize(json.custom_css || "");

        onImport({
          title: json.title,
          grade: json.grade || "8",
          type: json.type || "theory",
          content: cleanContent,
          custom_css: cleanCss,
          quiz_data: json.quiz_data || [],
          concepts: json.concepts || []
        });

      } catch (err) {
        console.error(err);
        setError("Lỗi định dạng JSON. Vui lòng kiểm tra lại file.");
      } finally {
        // Clear value so same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        {/* Hidden Input */}
        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
        />

        {/* Import Button */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm active:scale-95"
          title="Import JSON"
        >
          <Upload size={16} />
          <span>Import</span>
        </button>

        {/* Info Toggle */}
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className={`p-1.5 rounded-lg transition-colors ${showInfo ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          title="Hướng dẫn & Template"
        >
          <Info size={18} />
        </button>
      </div>

      {error && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-red-50 text-red-600 p-3 rounded-lg text-xs shadow-lg border border-red-100 flex gap-2 items-start z-50 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={14} className="mt-0.5 shrink-0" /> 
          <span>{error}</span>
        </div>
      )}

      {/* Info Popover */}
      {showInfo && (
        <>
          {/* Backdrop (Invisible, for closing) */}
          <div className="fixed inset-0 z-40" onClick={() => setShowInfo(false)}></div>
          
          <div className="absolute right-0 top-full mt-2 w-[400px] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h4 className="font-semibold text-gray-700 text-sm">Hướng dẫn Import</h4>
              <button onClick={() => setShowInfo(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="sr-only">Close</span>✕
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600">Hỗ trợ file <code>.json</code> với cấu trúc:</p>
              <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <pre className="text-xs font-mono text-gray-300 leading-relaxed">
{`{
  "title": "Tên bài", // Tiêu đề hiển thị (Bắt buộc)
  "grade": "8",       // Khối lớp (8, 9)
  "type": "theory",   // Loại bài: "theory" hoặc "practice"
  "content": "...",   // Nội dung HTML (chỉ dùng cho theory)
  "custom_css": "...",// CSS tùy chỉnh cho bài học
  "concepts": ["101"],// Danh sách ID khái niệm liên quan
  "quiz_data": {      // Dữ liệu bài tập (chỉ dùng cho practice hoặc lý thuyết có câu hỏi)
    "settings": { ... },
    "questions": [
      { "type": "multichoice", ... }, // Trắc nghiệm
      { "type": "match", ... },       // Nối cặp
      { "type": "sort", ... },        // Sắp xếp
      { "type": "short_answer", ... },// Điền từ ngắn
      { "type": "fill_blank", ... }   // Điền khuyết
    ]
  }
}`}
                </pre>
              </div>
              
              <button 
                onClick={handleDownloadTemplate}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm hover:shadow active:scale-[0.98]"
              >
                <Download size={16} /> Tải file mẫu chuẩn
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
