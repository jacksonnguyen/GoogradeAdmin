import { useState } from 'react';
import { Database } from '../../../types/database.types';
import { Button } from '../../../components/ui/Button';
import { X } from 'lucide-react';

type ConceptInsert = Database['public']['Tables']['math_concepts']['Insert'];

interface ConceptFormProps {
  initialData?: Partial<ConceptInsert>;
  onSave: (data: ConceptInsert) => Promise<void>;
  onCancel: () => void;
}

export function ConceptForm({ initialData, onSave, onCancel }: ConceptFormProps) {
  const [formData, setFormData] = useState<Partial<ConceptInsert>>({
    name: '',
    definition: '',
    grade: 8,
    tags: [],
    ...initialData
  });
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setSaving(true);
    try {
      await onSave(formData as ConceptInsert);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tagInput.trim()]
    }));
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tagToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-semibold text-gray-800">
                    {initialData?.id ? 'Edit Concept' : 'Add New Concept'}
                </h3>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Concept Name *</label>
                    <input 
                        type="text" 
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Linear Equations"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                        <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.grade}
                            onChange={e => setFormData({...formData, grade: Number(e.target.value)})}
                        >
                            {[6, 7, 8, 9].map(g => <option key={g} value={g}>Grade {g}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Definition / Summary</label>
                    <textarea 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                        value={formData.definition || ''}
                        onChange={e => setFormData({...formData, definition: e.target.value})}
                        placeholder="Brief explanation of the concept..."
                    />
                </div>

                {/* Tags Management */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <div className="flex gap-2 mb-2">
                        <input 
                            type="text" 
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 outline-none text-sm"
                            placeholder="Add tag..."
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        />
                        <button 
                            type="button" 
                            onClick={handleAddTag}
                            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.tags?.map((tag, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md">
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-900"><X size={12} /></button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                    <Button variant="ghost" onClick={onCancel} type="button">Cancel</Button>
                    <Button variant="primary" type="submit" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Concept'}
                    </Button>
                </div>
            </form>
        </div>
    </div>
  );
}
