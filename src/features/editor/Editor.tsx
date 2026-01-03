import { 
  ArrowLeft, Cloud, Save, 
  Wand2, Network, Search, FileText, ChevronDown, X, Link2Off,
  Code, Eye, LayoutTemplate, Bot, Settings as SettingsIcon, Send
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLessonEditor } from '../../hooks/useLessonEditor';
import { useState, useEffect } from 'react';

// TipTap Imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { EditorToolbar } from './components/EditorToolbar';

// Mock Data for Relationships
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
    customCss, setCustomCss,
    prerequisites, setPrerequisites,
    isSaving, status,
    saveLesson,
    generateContent, isGenerating
  } = useLessonEditor(id);

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [activeTab, setActiveTab] = useState<'settings' | 'ai'>('settings');
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Hello! I am your Lesson Assistant. How can I help you write this lesson today?' }
  ]);

  // Initialize TipTap Editor directly here
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Sync content updates from Hook -> Editor (only when content changes externally, e.g. initial load)
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content && !editor.isFocused) {
        // Only set if not focused to avoid cursor jumping
        editor.commands.setContent(content);
    }
  }, [content, editor]);


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

// AI Chat Logic
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    // 1. Add User Message immediately
    const userMsg = { role: 'user' as const, text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    
    // 2. Prepare History for Gemini (map 'ai' -> 'model')
    const history = chatMessages.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: m.text
    }));

    // 3. Call API
    try {
        const { DEFAULT_GEMINI_KEY } = await import('../../constants');
        const apiKey = localStorage.getItem('gemini_api_key') || DEFAULT_GEMINI_KEY;
        // Use dynamic import or pass function via props if needed, but for now direct import
        const { chatWithGemini } = await import('../../services/ai/gemini');
        
        // Show temporary loading indicator or just wait
        const responseText = await chatWithGemini(apiKey, history as any, userMsg.text); // Cast history for now or fix types

        // 4. Add AI Response
        setChatMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    } catch (error) {
        console.error("Chat Error:", error);
        setChatMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error connecting to Gemini. Please check your API Key." }]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white animate-in fade-in zoom-in-95 duration-200">
      
      {/* 1. TOP BAR: Navigation & Actions */}
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
           {/* View Mode Toggle */}
           <div className="bg-gray-100 p-1 rounded-lg flex gap-1 mr-2">
            <button 
              onClick={() => setViewMode('visual')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'visual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              title="Visual Editor"
            >
              <LayoutTemplate size={18} />
            </button>
            <button 
              onClick={() => setViewMode('code')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'code' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              title="Code Editor (HTML/CSS)"
            >
              <Code size={18} />
            </button>
          </div>

          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Cloud size={14} /> {status || 'Đã lưu'}
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
        {/* 2. MAIN EDITOR AREA (Left/Center) */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200 bg-gray-50/30">
          
          {viewMode === 'visual' ? (
            <>
              {/* Visual Toolbar - Sticky Header */}
              <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-6 py-2 flex items-center justify-between shadow-sm">
                 <div className="flex items-center gap-2">
                    <EditorToolbar editor={editor} />
                 </div>
                 
                 {/* Quick AI Action (Optional) */}
                 <button 
                    className="text-xs text-indigo-600 font-semibold hover:bg-indigo-50 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors border border-transparent hover:border-indigo-100"
                    onClick={() => setActiveTab('ai')} // Open AI tab
                 >
                   <Wand2 size={16} /> Ask AI
                 </button>
              </div>

               {/* Editor Content */}
              <style>{customCss}</style>
              <div className="flex-1 overflow-y-auto cursor-text" onClick={() => editor?.chain().focus().run()}>
                 <div className="max-w-3xl mx-auto py-12 px-8 min-h-full bg-white shadow-sm my-4 rounded-xl">
                    <EditorContent editor={editor} className="prose prose-lg max-w-none focus:outline-none" />
                 </div>
              </div>
            </>
          ) : (
            // Code Editor Mode
            <div className="editor-code-mode h-full flex flex-col">
                <div className="flex-1 flex min-h-0">
                    {/* HTML Panel */}
                    <div className="editor-code-mode__panel flex-1 flex flex-col border-r border-gray-200">
                        <div className="editor-code-mode__header bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                            <span className="font-mono text-xs font-bold text-gray-500">HTML CONTENT</span>
                            <Eye size={14} className="text-gray-400" />
                        </div>
                        <textarea 
                            className="editor-code-mode__textarea flex-1 p-4 font-mono text-sm resize-none focus:outline-none"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter HTML content here..."
                            spellCheck={false}
                        />
                    </div>
                    
                    {/* CSS Panel */}
                    <div className="editor-code-mode__panel flex-1 flex flex-col">
                        <div className="editor-code-mode__header bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                            <span className="font-mono text-xs font-bold text-gray-500">CUSTOM CSS</span>
                            <Code size={14} className="text-gray-400" />
                        </div>
                         <textarea 
                            className="editor-code-mode__textarea editor-code-mode__textarea--css flex-1 p-4 font-mono text-sm resize-none focus:outline-none text-blue-600"
                            value={customCss}
                            onChange={(e) => setCustomCss(e.target.value)}
                            placeholder=".my-class { color: red; }"
                            spellCheck={false}
                        />
                    </div>
                </div>
            </div>
          )}
        </div>

        {/* 3. SETTINGS & AI SIDEBAR (Right) */}
        <div className="w-80 bg-white flex flex-col border-l border-gray-200 flex-shrink-0 shadow-lg z-30">
          
          {/* Sidebar Tabs */}
          <div className="flex border-b border-gray-200">
            <button 
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'settings' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
                <SettingsIcon size={16} /> Cấu hình
            </button>
            <button 
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'ai' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
                <Bot size={16} /> Trợ lý AI
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50/30">
            {activeTab === 'settings' ? (
                // SETTINGS PANEL
                <div className="p-5 space-y-8">
                    {/* Chapter Settings */}
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Lớp</label>
                    <div className="relative">
                        <select 
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg shadow-sm border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white text-gray-700"
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
                    
                    {/* Search Input for Relations */}
                    <div className="relative group mb-4">
                        <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => { if(searchQuery) setShowDropdown(true) }}
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
                            const concept = conceptsDB.find(c => c.id === id);
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
                </div>
            ) : (
                // AI ASSISTANT PANEL
                <div className="editor-chat">
                    {/* Chat History */}
                    <div className="editor-chat__history">
                        {chatMessages.map((msg, idx) => (
                             <div key={idx} className={`editor-chat__message ${msg.role === 'user' ? 'editor-chat__message--user' : 'editor-chat__message--ai'}`}>
                                <div className={`editor-chat__bubble ${msg.role === 'user' ? 'editor-chat__bubble--user' : 'editor-chat__bubble--ai'}`}>
                                   {msg.text}
                                </div>
                             </div>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <div className="editor-chat__input-area">
                        <div className="relative">
                            <textarea 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
                                placeholder="Gõ yêu cầu của bạn..."
                                className="editor-chat__textarea"
                            />
                            <button 
                                onClick={handleSendMessage}
                                disabled={!chatInput.trim()}
                                className="editor-chat__send-btn"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center mt-2">AI có thể mắc lỗi. Vui lòng kiểm tra lại.</p>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
