import { supabase } from './client';
import { Database } from '../../types/database.types';

type Concept = Database['public']['Tables']['math_concepts']['Row'];

export const ConceptService = {
  // Get all concepts (optionally filter by grade)
  async getAll(grade?: number) {
    let query = supabase
      .from('math_concepts')
      .select('*')
      .order('grade', { ascending: true })
      .order('id', { ascending: true });
    
    if (grade) {
      query = query.eq('grade', grade);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Concept[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('math_concepts')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Concept;
  },

  // Trace back prerequisites (Recursive query simulation via relationships)
  async getPrerequisites(conceptId: string) {
    const { data, error } = await supabase
      .from('concept_relationships')
      .select(`
        *,
        source:math_concepts!source_id(*),
        target:math_concepts!target_id(*)
      `)
      .eq('source_id', conceptId)
      .eq('relationship_type', 'requires');
      
    if (error) throw error;
    return data;
  }
};
