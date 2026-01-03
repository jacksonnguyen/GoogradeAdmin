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
  },

  // CRUD Operations
  async create(concept: Database['public']['Tables']['math_concepts']['Insert']) {
    const { data, error } = await supabase
      .from('math_concepts')
      .insert(concept)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Database['public']['Tables']['math_concepts']['Update']) {
    const { data, error } = await supabase
      .from('math_concepts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('math_concepts')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Relationship Management
  async addRelationship(relationship: Database['public']['Tables']['concept_relationships']['Insert']) {
    const { data, error } = await supabase
      .from('concept_relationships')
      .insert(relationship)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async removeRelationship(id: number) {
    const { error } = await supabase
      .from('concept_relationships')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
  
  async getRelationships(conceptId: string) {
     const { data, error } = await supabase
      .from('concept_relationships')
      .select('*')
      .or(`source_id.eq.${conceptId},target_id.eq.${conceptId}`);
     if (error) throw error;
     return data;
  }
};
