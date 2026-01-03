import { useState } from 'react';
import { Search, FileText, X, Link2Off, Network } from 'lucide-react';

interface Concept {
  id: string;
  name: string;
  grade: string;
}

interface RelationshipManagerProps {
  conceptsDB: Concept[];
  prerequisites: Set<string>;
  onAddRelation: (id: string) => void;
  onRemoveRelation: (id: string) => void;
}

export function RelationshipManager({
  conceptsDB,
  prerequisites,
  onAddRelation,
  onRemoveRelation
}: RelationshipManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredRelations = conceptsDB.filter(
    c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !prerequisites.has(c.id)
  );

  const handleAddRelation = (id: string) => {
    onAddRelation(id);
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <div className="relation-manager">
      <div className="relation-manager__header">
        <label className="relation-manager__title">
          <Network size={18} />
          Bài học liên quan
        </label>
      </div>
      
      <p className="relation-manager__desc">
        Gắn thẻ các bài học cũ (Lớp 7, 8) để học sinh ôn tập trước.
      </p>
      
      {/* Search Input */}
      <div className="relation-manager__search">
        <Search className="relation-manager__search-icon" size={18} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => { if(searchQuery) setShowDropdown(true) }}
          className="relation-manager__search-input" 
          placeholder="Tìm kiến thức cũ..." 
        />
        
        {/* Dropdown Results */}
        {showDropdown && searchQuery && (
          <div className="relation-manager__dropdown">
            {filteredRelations.length > 0 ? (
              filteredRelations.map(c => (
                <div 
                  key={c.id}
                  onClick={() => handleAddRelation(c.id)} 
                  className="relation-manager__dropdown-item"
                >
                  <div className="relation-manager__dropdown-content">
                    <FileText size={16} />
                    <span>{c.name}</span>
                  </div>
                  <span className="relation-manager__dropdown-badge">{c.grade}</span>
                </div>
              ))
            ) : (
              <div className="relation-manager__dropdown-empty">Không tìm thấy</div>
            )}
          </div>
        )}
        {showDropdown && <div className="relation-manager__backdrop" onClick={() => setShowDropdown(false)} />}
      </div>

      {/* Selected List */}
      <div className="relation-manager__list">
        {prerequisites.size === 0 ? (
          <div className="relation-manager__empty">
            <Link2Off size={30} />
            <p>Chưa có liên kết nào</p>
          </div>
        ) : (
          Array.from(prerequisites).map(id => {
            const concept = conceptsDB.find(c => c.id === id);
            if (!concept) return null;
            return (
              <div key={id} className="relation-manager__item">
                <div className="relation-manager__item-info">
                  <span className="relation-manager__item-name" title={concept.name}>{concept.name}</span>
                  <div className="relation-manager__item-grade">
                    <span className={`relation-manager__dot ${concept.grade === 'Lớp 8' ? 'relation-manager__dot--green' : 'relation-manager__dot--orange'}`}></span>
                    <span>{concept.grade}</span>
                  </div>
                </div>
                <button onClick={() => onRemoveRelation(id)} className="relation-manager__remove-btn">
                  <X size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
