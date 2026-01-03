import { useState } from 'react';
import { useConceptManager } from '../../hooks/useConceptManager';
import { Button } from '../../components/ui/Button';
import { ConceptForm } from './components/ConceptForm';
import { Plus, BookOpen, Link2, Filter, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import { Database } from '../../types/database.types';
import clsx from 'clsx';

type ConceptInsert = Database['public']['Tables']['math_concepts']['Insert'];

export function ConceptManager() {
  const { 
    concepts, loading, error, selectedGrade, setSelectedGrade, loadConcepts,
    addConcept, updateConcept, deleteConcept 
  } = useConceptManager();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConcept, setEditingConcept] = useState<Partial<ConceptInsert> | undefined>(undefined);

  const handleCreate = () => {
    setEditingConcept(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (concept: any) => {
    setEditingConcept(concept);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this concept?')) {
      await deleteConcept(id);
    }
  };

  const handleSave = async (data: ConceptInsert) => {
    if (editingConcept?.id) {
       await updateConcept(editingConcept.id as string, data);
    } else {
       await addConcept(data);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Knowledge Graph</h1>
          <p className="text-sm text-gray-500 mt-1">Manage math concepts and their relationships</p>
        </div>
        <Button variant="primary" className="gap-2 shadow-sm" onClick={handleCreate}>
          <Plus size={18} />
          Add Concept
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-2 flex flex-wrap items-center gap-3 shadow-sm">
        <div className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-500 border-r border-gray-100 mr-2">
          <Filter size={16} />
          <span>Filter by Grade:</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {[undefined, 6, 7, 8, 9].map((grade) => (
            <button
              key={grade ?? 'all'}
              onClick={() => setSelectedGrade(grade)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                selectedGrade === grade 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              {grade ? `Grade ${grade}` : 'All'}
            </button>
          ))}
        </div>
        <div className="ml-auto border-l border-gray-100 pl-2">
          <button 
            onClick={() => loadConcepts()} 
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-all active:rotate-180" 
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="flex flex-col items-center gap-3 animate-pulse">
            <RefreshCw size={32} className="animate-spin" />
            <span>Loading concepts...</span>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12 text-red-600 bg-red-50 rounded-xl border border-red-100">
            <span className="flex items-center gap-2 font-medium">Error: {error}</span>
        </div>
      ) : concepts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
            <BookOpen size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No concepts found</h3>
          <p className="text-gray-500 max-w-sm mb-6">Start building your knowledge graph to link lessons together.</p>
          <Button variant="outline" onClick={handleCreate} className="gap-2">
            <Plus size={16} />
            Add First Concept
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {concepts.map((concept) => (
            <div 
                key={concept.id} 
                className="group relative bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full hover:border-indigo-200"
            >
              {/* Quick Actions (Hover) */}
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0">
                <button 
                    onClick={(e) => { e.stopPropagation(); handleEdit(concept); }}
                    className="p-1.5 bg-white text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md shadow-sm border border-gray-200 transition-colors"
                >
                    <Pencil size={14} />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(concept.id); }}
                    className="p-1.5 bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md shadow-sm border border-gray-200 transition-colors"
                >
                    <Trash2 size={14} />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                    concept.grade === 9 ? 'bg-purple-100 text-purple-700' :
                    concept.grade === 8 ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                }`}>
                    Grade {concept.grade}
                </span>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">#{concept.id.slice(0,6)}</span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors line-clamp-1" title={concept.name}>
                {concept.name}
              </h3>
              
              {concept.definition && (
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                    {concept.definition}
                </p>
              )}

              {concept.tags && concept.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {concept.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-100">
                        {tag}
                    </span>
                  ))}
                  {concept.tags.length > 3 && (
                      <span className="px-1.5 text-xs text-gray-400">+{concept.tags.length - 3}</span>
                  )}
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                <Link2 size={14} className="mr-1.5" />
                <span>View relationships</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <ConceptForm 
            initialData={editingConcept}
            onSave={handleSave}
            onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
