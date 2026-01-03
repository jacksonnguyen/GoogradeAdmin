import { useState, useCallback, useEffect } from 'react';
import { ConceptService } from '../services/database/concepts';
import { Database } from '../types/database.types';

type Concept = Database['public']['Tables']['math_concepts']['Row'];
type ConceptInsert = Database['public']['Tables']['math_concepts']['Insert'];
type ConceptUpdate = Database['public']['Tables']['math_concepts']['Update'];
type RelationshipInsert = Database['public']['Tables']['concept_relationships']['Insert'];

export function useConceptManager() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [selectedGrade, setSelectedGrade] = useState<number | undefined>();

  const loadConcepts = useCallback(async (grade?: number) => {
    setLoading(true);
    setError(null);
    try {
      // Use arg if provided, otherwise use state
      const gradeToUse = grade !== undefined ? grade : selectedGrade;
      const data = await ConceptService.getAll(gradeToUse);
      setConcepts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedGrade]);

  const addConcept = async (concept: ConceptInsert) => {
    try {
      const newConcept = await ConceptService.create(concept);
      setConcepts(prev => [...prev, newConcept]);
      return newConcept;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create concept');
      throw err;
    }
  };

  const updateConcept = async (id: string, updates: ConceptUpdate) => {
    try {
      const updated = await ConceptService.update(id, updates);
      setConcepts(prev => prev.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update concept');
      throw err;
    }
  };

  const deleteConcept = async (id: string) => {
    try {
      await ConceptService.delete(id);
      setConcepts(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete concept');
      throw err;
    }
  };

  // Relationship helpers
  const addRelationship = async (rel: RelationshipInsert) => {
      try {
          await ConceptService.addRelationship(rel);
      } catch (err) {
          throw err;
      }
  };

  const removeRelationship = async (id: number) => {
      try {
          await ConceptService.removeRelationship(id);
      } catch (err) {
          throw err;
      }
  };

  // Initial load
  useEffect(() => {
    loadConcepts();
  }, [loadConcepts]);

  return {
    concepts,
    loading,
    error,
    selectedGrade,
    setSelectedGrade,
    loadConcepts,
    addConcept,
    updateConcept,
    deleteConcept,
    addRelationship,
    removeRelationship
  };
}
