import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { LessonService } from '../../services/database/lessons';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Calendar } from 'lucide-react';

export function Dashboard() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadLessons();
  }, []);

  async function loadLessons() {
    try {
      setLoading(true);
      const data = await LessonService.getAll();
      setLessons(data || []);
    } catch (error) {
      console.error('Failed to load lessons:', error);
      // Fallback for demo if no DB connection
      setLessons([]); 
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-text mb-2">Dashboard</h1>
           <p className="text-text-light">Manage your curriculum content</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/editor')} className="gap-2">
            <Plus size={20} />
            New Lesson
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-light">Loading content...</div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-border border-dashed">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-text-light" />
            </div>
            <h3 className="text-xl font-bold mb-2">No lessons found</h3>
            <p className="text-text-light mb-6">Get started by creating your first AI-generated lesson.</p>
            <Button variant="outline" onClick={() => navigate('/editor')}>Create Lesson</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
                <div key={lesson.id} className="card hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate(`/editor/${lesson.id}`)}>
                    <div className="flex justify-between items-start mb-4">
                        <div className={`px-2 py-1 rounded text-xs font-bold ${lesson.type === 'theory' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {lesson.type?.toUpperCase() || 'THEORY'}
                        </div>
                        <span className="text-text-light text-sm flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(lesson.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{lesson.title}</h3>
                    <p className="text-text-light text-sm mb-4 line-clamp-3">
                        {lesson.content ? lesson.content.replace(/<[^>]*>/g, '').slice(0, 100) + '...' : 'No content'}
                    </p>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
