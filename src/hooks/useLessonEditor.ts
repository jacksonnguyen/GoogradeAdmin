import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateLessonContent } from '../services/ai/gemini';
import { LessonService } from '../services/database/lessons';

export function useLessonEditor(lessonId?: string) {
  const navigate = useNavigate();
  
  // State
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState('8');
  const [content, setContent] = useState('');
  const [prerequisites, setPrerequisites] = useState<Set<string>>(new Set());
  
  // Initialize from localStorage ONLY
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  
  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState('');

  // We no longer sync 'apiKey' back to localStorage here effectively, 
  // because we want Settings to be the source of truth. 
  // But strictly speaking, if we want to ensure we have the latest:
  useEffect(() => {
    const key = localStorage.getItem('gemini_api_key');
    if (key) setApiKey(key);
  }, []);

  // Load Initial Data
  useEffect(() => {
    if (lessonId) {
      loadLesson(lessonId);
    }
  }, [lessonId]);

  async function loadLesson(id: string) {
    try {
      const lesson = await LessonService.getById(id);
      if (lesson) {
        setTitle(lesson.title);
        setContent(lesson.content || '');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error loading lesson');
    }
  }

  // Handlers
  const generateContent = async () => {
    // Re-check localStorage just in case it changed since mount
    const currentKey = localStorage.getItem('gemini_api_key'); 
    
    if (!currentKey) {
        alert("Please set your Gemini API Key in Settings first.");
        return;
    }
    if (!title) {
        alert("Please enter a topic");
        return;
    }

    setIsGenerating(true);
    setStatus('Generating content...');
    try {
      const generatedHtml = await generateLessonContent({
        apiKey: currentKey,
        topic: title,
        grade,
        type: 'theory'
      });
      setContent(generatedHtml);
      setStatus('Content generated!');
    } catch (error) {
      console.error(error);
      setStatus('Generation failed');
      alert("Failed to generate content. Check API Key in Settings.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveLesson = async () => {
    if (!title) {
        alert('Topic title is required');
        return;
    }
    
    setIsSaving(true);
    setStatus('Saving...');
    
    try {
        const lessonData = {
            title: title,
            content: content,
            type: 'theory' as const,
            updated_at: new Date().toISOString()
        };

        if (lessonId) {
            await LessonService.update(lessonId, lessonData);
        } else {
            await LessonService.create({
                ...lessonData,
                unit_id: null,
                is_published: false
            });
        }
        setStatus('Saved successfully!');
        navigate('/');
    } catch (err) {
        console.error(err);
        setStatus('Failed to save');
    } finally {
        setIsSaving(false);
    }
  };

  return {
    // Data
    title, setTitle,
    grade, setGrade,
    content, setContent,
    prerequisites, setPrerequisites,
    // We don't expose setApiKey anymore to the Editor
    
    // UI Status
    isGenerating,
    isSaving,
    status,

    // Actions
    generateContent,
    saveLesson
  };
}
