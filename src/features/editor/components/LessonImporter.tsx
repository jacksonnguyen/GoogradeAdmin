import { useRef, useState } from 'react';
import { Upload, Download, Info, AlertCircle } from 'lucide-react';
import DOMPurify from 'dompurify';

export interface ImportedLessonData {
  title: string;
  grade: string;
  type: 'theory' | 'practice';
  content: string;
  custom_css?: string;
}

interface LessonImporterProps {
  onImport: (data: ImportedLessonData) => void;
}

export function LessonImporter({ onImport }: LessonImporterProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadTemplate = () => {
    const template: ImportedLessonData = {
      title: "Bài học mẫu",
      grade: "8",
      type: "theory",
      content: "<h2>Tiêu đề bài học</h2><p>Nội dung bài học...</p>",
      custom_css: ".highlight { color: red; }"
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
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
        const json = JSON.parse(event.target?.result as string);
        
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
          custom_css: cleanCss
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
    <div className="lesson-importer">
      <div className="lesson-importer__actions">
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
          className="lesson-importer__btn lesson-importer__btn--primary"
          title="Import JSON"
        >
          <Upload size={18} />
          <span>Import</span>
        </button>

        {/* Info Toggle */}
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className={`lesson-importer__btn lesson-importer__btn--icon ${showInfo ? 'active' : ''}`}
          title="Hướng dẫn & Template"
        >
          <Info size={18} />
        </button>
      </div>

      {error && (
        <div className="lesson-importer__error">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Info Popover */}
      {showInfo && (
        <div className="lesson-importer__popover">
          <div className="lesson-importer__popover-header">
            <h4>Hướng dẫn Import</h4>
            <button onClick={() => setShowInfo(false)}><span className="sr-only">Close</span>✕</button>
          </div>
          <div className="lesson-importer__popover-body">
            <p>Hỗ trợ file <code>.json</code> với cấu trúc:</p>
            <pre>
{`{
  "title": "Tên bài",
  "grade": "8",
  "content": "HTML...",
  "custom_css": "CS..."
}`}
            </pre>
            <button 
              onClick={handleDownloadTemplate}
              className="lesson-importer__download-btn"
            >
              <Download size={14} /> Tải file mẫu
            </button>
          </div>
          {/* Backdrop to close */}
          <div className="lesson-importer__backdrop" onClick={() => setShowInfo(false)}></div>
        </div>
      )}
    </div>
  );
}
