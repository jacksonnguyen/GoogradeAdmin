import { supabase } from './client';
import { Database } from '../../types/database.types';

type Lesson = Database['public']['Tables']['lessons']['Row'];
type LessonInsert = Database['public']['Tables']['lessons']['Insert'];
type LessonUpdate = Database['public']['Tables']['lessons']['Update'];

export const LessonService = {
  async getAll() {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Lesson[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id) // UUID check in backend
      .single();
    
    if (error) throw error;
    return data as Lesson;
  },

  async create(lesson: LessonInsert) {
    const { data, error } = await supabase
      .from('lessons')
      // @ts-ignore: Supabase types can be tricky with strict mode, forcing insert
      .insert(lesson)
      .select()
      .single();
    
    if (error) throw error;
    return data as Lesson;
  },

  async update(id: string, updates: LessonUpdate) {
    const { data, error } = await supabase
      .from('lessons')
      // @ts-ignore: Supabase types can be tricky with strict mode
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Lesson;
  }
};
