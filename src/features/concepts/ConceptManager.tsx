import { useConceptManager } from '../../hooks/useConceptManager';
import { Button } from '../../components/ui/Button';
import { Plus, BookOpen, Link2, Filter, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

export function ConceptManager() {
  const { concepts, loading, error, selectedGrade, setSelectedGrade, refresh } = useConceptManager();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Knowledge Graph</h1>
          <p className="page-header__subtitle">Manage math concepts and their relationships</p>
        </div>
        <Button variant="primary" className="gap-2">
          <Plus size={20} />
          Add Concept
        </Button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="filter-bar__label">
          <Filter size={18} />
          <span>Filter by Grade:</span>
        </div>
        <div className="filter-bar__options">
          {[undefined, 6, 7, 8, 9].map((grade) => (
            <button
              key={grade ?? 'all'}
              onClick={() => setSelectedGrade(grade)}
              className={clsx(
                'filter-bar__btn',
                selectedGrade === grade && 'filter-bar__btn--active'
              )}
            >
              {grade ? `Grade ${grade}` : 'All'}
            </button>
          ))}
        </div>
        <button onClick={refresh} className="btn--ghost p-2" title="Refresh">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-text-light">Loading concepts...</div>
      ) : error ? (
        <div className="text-center py-12 text-danger">{error}</div>
      ) : concepts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">
            <BookOpen size={32} className="text-text-light" />
          </div>
          <h3 className="empty-state__title">No concepts found</h3>
          <p className="empty-state__desc">Start building your knowledge graph by adding concepts.</p>
          <Button variant="outline">Add First Concept</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {concepts.map((concept) => (
            <div key={concept.id} className="concept-card group">
              <div className="concept-card__header">
                <span className="concept-card__badge">Grade {concept.grade}</span>
                <span className="concept-card__id">{concept.id}</span>
              </div>
              
              <h3 className="concept-card__title">{concept.name}</h3>
              
              {concept.definition && (
                <p className="concept-card__desc">{concept.definition}</p>
              )}

              {concept.tags && concept.tags.length > 0 && (
                <div className="concept-card__tags">
                  {concept.tags.map((tag, i) => (
                    <span key={i} className="concept-card__tag">{tag}</span>
                  ))}
                </div>
              )}

              <div className="concept-card__footer">
                <Link2 size={14} />
                <span>View relationships</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
