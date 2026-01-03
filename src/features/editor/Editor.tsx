import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { TipTapEditor } from '../../components/ui/TipTapEditor';
import { Save, ArrowLeft } from 'lucide-react';
import { useLessonEditor } from '../../hooks/useLessonEditor';

export function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    topic, setTopic,
    grade, setGrade,
    content, setContent,
    isGenerating, isSaving, status,
    generateContent, saveLesson
  } = useLessonEditor(id);

  return (
    <div>
      <div className="editor-header">
        <Button variant="ghost" onClick={() => navigate('/')} className="p-2">
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h2 className="editor-header__title">{id ? 'Edit Lesson' : 'New Lesson'}</h2>
          {status && <span className="editor-header__status">{status}</span>}
        </div>
      </div>

      <div className="editor-form">


        <div className="editor-form__grid">
          <div>
            <label className="form__label">Lesson Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Pythagorean Theorem"
              className="form__input"
            />
          </div>
          <div>
            <label className="form__label">Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="form__input cursor-pointer"
            >
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
            </select>
          </div>
        </div>

        <div className="editor-form__actions">
          <Button
            variant="outline"
            onClick={generateContent}
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? 'Generating...' : <><span>✨</span> Ask AI to generate lesson</>}
          </Button>
          <Button
            variant="primary"
            onClick={saveLesson}
            disabled={isSaving}
            className="gap-2"
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save Lesson'}
          </Button>
        </div>
      </div>

      <TipTapEditor content={content} onChange={setContent} />
    </div>
  );
}
