import { 
  ArrowLeft, Cloud, Save, 
  Wand2, SlidersHorizontal, Network, Search, FileText, ChevronDown, X, Lightbulb, Link2Off 
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLessonEditor } from '../../hooks/useLessonEditor';
import { TipTapEditor } from '../../components/ui/TipTapEditor';
import { useState } from 'react';

// Mock Data for Relationships (until connected to DB)
const conceptsDB = [
  { id: '101', name: "Hằng đẳng thức đáng nhớ", grade: "Lớp 8" },
  { id: '102', name: "Phân tích đa thức thành nhân tử", grade: "Lớp 8" },
  { id: '103', name: "Quy tắc chuyển vế", grade: "Lớp 7" },
  { id: '104', name: "Lũy thừa với số mũ tự nhiên", grade: "Lớp 7" },
];

export function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    title, setTitle,
    grade, setGrade,
    content, setContent,
    prerequisites, setPrerequisites,
    isGenerating, isSaving, status,
    generateContent, saveLesson
  } = useLessonEditor(id);

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Relationship Logic
  const filteredRelations = conceptsDB.filter(
    c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !prerequisites.has(c.id)
  );

  const addRelation = (relationId: string) => {
    const newSet = new Set(prerequisites);
    newSet.add(relationId);
    setPrerequisites(newSet);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const removeRelation = (relationId: string) => {
    const newSet = new Set(prerequisites);
    newSet.delete(relationId);
    setPrerequisites(newSet);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white animate-in fade-in zoom-in-95 duration-200">
      
      {/* Editor Top Bar */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white z-20 flex-shrink-0">
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors group" 
            title="Quay lại"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="h-6 w-px bg-gray-200"></div>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-bold text-gray-900 border-none outline-none focus:ring-0 w-full placeholder-gray-300 bg-transparent" 
            placeholder="Nhập tên bài học..."
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Cloud size={14} /> {status || 'Đã lưu tự động'}
          </span>
          <button 
            onClick={saveLesson} 
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition-all hover:shadow-md flex items-center gap-2 disabled:opacity-70"
          >
            {isSaving ? (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <Save size={18} />
            )}
            {isSaving ? "Đang lưu..." : "Lưu & Đóng"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Rich Text Editor Area */}
        <div className="flex-1 flex flex-col overflow-y-auto border-r border-gray-200 bg-gray-50/30">
          {/* Custom Toolbar (Visual only for now, mapped to TipTap internally if we refactor properly, but for now we use TipTap's own toolbar inside the component) */}
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-6 py-2.5 flex items-center gap-1 shadow-sm">
             {/* We can integrate specific actions here later. For now, we use a simplified placeholder or just let TipTap handle it. */}
             <div className="text-xs text-gray-400 italic">Editor Toolbar</div>
             
             <div className="flex-1"></div>
             <button 
                onClick={generateContent}
                disabled={isGenerating}
                className="text-xs text-indigo-600 font-semibold hover:bg-indigo-50 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors border border-transparent hover:border-indigo-100 disabled:opacity-50"
             >
               <Wand2 size={16} /> {isGenerating ? 'AI đang viết...' : 'Viết bằng AI'}
             </button>
          </div>

          <div className="flex-1 relative">
             <TipTapEditor content={content} onChange={setContent} className="min-h-full p-10 max-w-3xl mx-auto" />
          </div>
        </div>

        {/* RIGHT: Settings & Relationships Sidebar */}
        <div className="w-80 bg-white flex flex-col border-l border-gray-200 flex-shrink-0 shadow-[rgba(0,0,0,0.05)_0px_0px_10px] z-10">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal size={16} /> Cấu hình
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-8">
            {/* Chapter Settings */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Lớp</label>
              <div className="relative">
                <select 
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full text-sm border-gray-200 rounded-lg shadow-sm border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-gray-50 text-gray-700"
                >
                  <option value="8">Lớp 8</option>
                  <option value="9">Lớp 9</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            {/* RELATIONSHIPS MANAGER */}
            <div className="bg-white rounded-xl border border-indigo-100 shadow-sm p-4 relative overflow-visible">
              <div className="absolute -top-3 left-3 bg-white px-2">
                <label className="flex items-center gap-1.5 text-sm font-bold text-indigo-600">
                  <Network size={18} />
                  Bài học liên quan
                </label>
              </div>
              
              <p className="text-xs text-gray-500 mb-4 mt-2">Gắn thẻ các bài học cũ (Lớp 7, 8) để học sinh ôn tập trước.</p>
              
              {/* Search */}
              <div className="relative group mb-4">
                <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if(searchQuery) setShowDropdown(true) }}
                  // onBlur -> setTimeout to allow click
                  className="w-full text-sm border border-gray-200 rounded-lg pl-9 pr-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder-gray-400" 
                  placeholder="Tìm kiến thức cũ..." 
                />
                
                {/* Dropdown Results */}
                {showDropdown && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                    {filteredRelations.length > 0 ? (
                      filteredRelations.map(c => (
                        <div 
                          key={c.id}
                          onClick={() => addRelation(c.id)} 
                          className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-50 last:border-0 flex justify-between items-center group transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="text-gray-400 group-hover:text-indigo-500" size={16} />
                            <span className="text-sm text-gray-700 group-hover:text-indigo-700 font-medium">{c.name}</span>
                          </div>
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full group-hover:bg-white border group-hover:border-indigo-100">{c.grade}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-xs text-gray-400 text-center italic">Không tìm thấy</div>
                    )}
                  </div>
                )}
                {/* Overlay to close dropdown */}
                {showDropdown && <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowDropdown(false)} />}
              </div>

              {/* Selected List */}
              <div className="space-y-2">
                {prerequisites.size === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/50">
                    <Link2Off className="text-gray-300 mx-auto mb-1" size={30} />
                    <p className="text-xs text-gray-400 font-medium">Chưa có liên kết nào</p>
                  </div>
                ) : (
                  Array.from(prerequisites).map(id => {
                    const concept = conceptsDB.find(c => c.id === id); // In real app, this would be looked up properly
                    if (!concept) return null;
                    return (
                      <div key={id} className="flex items-center justify-between bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-2 text-sm group hover:border-indigo-300 transition-all">
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-gray-800 font-medium text-xs truncate w-40" title={concept.name}>{concept.name}</span>
                          <div className="flex items-center gap-1 mt-0.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${concept.grade === 'Lớp 8' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                              <span className="text-[10px] text-gray-400">{concept.grade}</span>
                          </div>
                        </div>
                        <button onClick={() => removeRelation(id)} className="text-gray-300 hover:text-red-500 hover:bg-red-50 rounded p-1 transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            {/* Extra Info */}
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
              <div className="flex gap-2">
                <Lightbulb className="text-yellow-600 flex-shrink-0" size={18} />
                <div>
                  <p className="text-xs font-bold text-yellow-800">Mẹo quản lý</p>
                  <p className="text-[11px] text-yellow-700 mt-1 leading-relaxed">Việc liên kết bài học giúp hệ thống gợi ý lộ trình ôn tập tự động.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
