import { useState, useEffect, useCallback } from 'react';
import { ConceptService } from '../services/database/concepts';
import { Database } from '../types/database.types';

type Concept = Database['public']['Tables']['math_concepts']['Row'];

export function useConceptManager() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConcepts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ConceptService.getAll(selectedGrade);
      setConcepts(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load concepts');
      setConcepts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedGrade]);

  useEffect(() => {
    loadConcepts();
  }, [loadConcepts]);

  return {
    concepts,
    loading,
    error,
    selectedGrade,
    setSelectedGrade,
    refresh: loadConcepts
  };
}
