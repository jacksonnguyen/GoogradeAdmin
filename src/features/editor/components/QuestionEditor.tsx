import { QuizQuestion } from "../../../types/quiz";
import { Trash2, Plus, Check, X, ArrowUp, ArrowDown, Ban } from "lucide-react";

interface QuestionEditorProps {
  question: QuizQuestion;
  onChange: (updated: QuizQuestion) => void;
}

export function QuestionEditor({ question, onChange }: QuestionEditorProps) {
  
  const handleQuestionChange = (text: string) => {
    onChange({ ...question, question: text });
  };

  const handlePointsChange = (points: number) => {
    onChange({ ...question, points });
  };

  // --- MULTICHOICE LOGIC ---
  const handleOptionChange = (id: string, text: string) => {
    if (question.type !== 'multichoice') return;
    const newOptions = question.options.map(opt => 
      opt.id === id ? { ...opt, text } : opt
    );
    onChange({ ...question, options: newOptions });
  };

  const handleCorrectSelect = (id: string) => {
    if (question.type !== 'multichoice') return;
    // Single choice logic for now (could be multi-select if needed)
    const newOptions = question.options.map(opt => ({
      ...opt,
      isCorrect: opt.id === id
    }));
    onChange({ ...question, options: newOptions });
  };

  const addOption = () => {
    if (question.type !== 'multichoice') return;
    const newOpt = { id: crypto.randomUUID(), text: `Lựa chọn ${question.options.length + 1}`, isCorrect: false };
    onChange({ ...question, options: [...question.options, newOpt] });
  };

  const removeOption = (id: string) => {
    if (question.type !== 'multichoice') return;
    if (question.options.length <= 2) return; // Minimum 2 options
    onChange({ ...question, options: question.options.filter(o => o.id !== id) });
  };
  // -------------------------

  // --- SHORT ANSWER LOGIC ---
  const addShortAnswer = () => {
    if (question.type !== 'short_answer') return;
    onChange({ ...question, correctAnswers: [...question.correctAnswers, ""] });
  };

  const removeShortAnswer = (idx: number) => {
    if (question.type !== 'short_answer') return;
    onChange({ ...question, correctAnswers: question.correctAnswers.filter((_, i) => i !== idx) });
  };

  const updateShortAnswer = (idx: number, val: string) => {
    if (question.type !== 'short_answer') return;
    const newAnswers = [...question.correctAnswers];
    newAnswers[idx] = val;
    onChange({ ...question, correctAnswers: newAnswers });
  };
  // --------------------------

  // --- FILL BLANK LOGIC ---
  const handleFillContentChange = (content: string) => {
    if (question.type !== 'fill_blank') return;
    
    // Auto-detect blanks in brackets [answer]
    const matches = content.match(/\[(.*?)\]/g);
    const blanks = matches ? matches.map(m => ({
      id: crypto.randomUUID(),
      answer: m.slice(1, -1)
    })) : [];
    
    onChange({ ...question, content, blanks });
  };
  // ------------------------

  // --- SORT LOGIC ---
  const addSortItem = () => {
    if (question.type !== 'sort') return;
    const newItem = { id: crypto.randomUUID(), content: `Mục ${question.items.length + 1}`, order: question.items.length };
    onChange({ ...question, items: [...question.items, newItem] });
  };

  const removeSortItem = (id: string) => {
    if (question.type !== 'sort') return;
    onChange({ ...question, items: question.items.filter(i => i.id !== id) });
  };

  const updateSortItem = (id: string, content: string) => {
    if (question.type !== 'sort') return;
    onChange({ ...question, items: question.items.map(i => i.id === id ? { ...i, content } : i) });
  };

  const moveSortItem = (idx: number, direction: 'up' | 'down') => {
    if (question.type !== 'sort') return;
    const newItems = [...question.items];
    if (direction === 'up' && idx > 0) {
        [newItems[idx], newItems[idx - 1]] = [newItems[idx - 1], newItems[idx]];
    } else if (direction === 'down' && idx < newItems.length - 1) {
        [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
    }
    // Update order property
    const ordered = newItems.map((item, index) => ({ ...item, order: index }));
    onChange({ ...question, items: ordered });
  };

  const toggleSortDistractor = (id: string) => {
    if (question.type !== 'sort') return;
    onChange({ ...question, items: question.items.map(i => i.id === id ? { ...i, isDistractor: !i.isDistractor } : i) });
  };
  // ------------------

  // --- MATCH LOGIC ---
  const addPair = () => {
    if (question.type !== 'match') return;
    const newPair = { id: crypto.randomUUID(), left: "", right: "" };
    onChange({ ...question, pairs: [...question.pairs, newPair] });
  };

  const removePair = (id: string) => {
    if (question.type !== 'match') return;
    onChange({ ...question, pairs: question.pairs.filter(p => p.id !== id) });
  };

  const updatePair = (id: string, field: 'left' | 'right', val: string) => {
    if (question.type !== 'match') return;
    onChange({ ...question, pairs: question.pairs.map(p => p.id === id ? { ...p, [field]: val } : p) });
  };
  // -------------------

  // --- CLICK ORDER LOGIC (Same as Sort essentially) ---
  const addClickItem = () => {
    if (question.type !== 'click_order') return;
    const newItem = { id: crypto.randomUUID(), content: `Từ ${question.items.length + 1}`, order: question.items.length };
    onChange({ ...question, items: [...question.items, newItem] });
  };

  const removeClickItem = (id: string) => {
    if (question.type !== 'click_order') return;
    onChange({ ...question, items: question.items.filter(i => i.id !== id) });
  };

  const updateClickItem = (id: string, content: string) => {
    if (question.type !== 'click_order') return;
    onChange({ ...question, items: question.items.map(i => i.id === id ? { ...i, content } : i) });
  };

  const moveClickItem = (idx: number, direction: 'up' | 'down') => {
    if (question.type !== 'click_order') return;
    const newItems = [...question.items];
    if (direction === 'up' && idx > 0) {
        [newItems[idx], newItems[idx - 1]] = [newItems[idx - 1], newItems[idx]];
    } else if (direction === 'down' && idx < newItems.length - 1) {
        [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
    }
    const ordered = newItems.map((item, index) => ({ ...item, order: index }));
    onChange({ ...question, items: ordered });
  };

  const toggleClickDistractor = (id: string) => {
    if (question.type !== 'click_order') return;
    onChange({ ...question, items: question.items.map(i => i.id === id ? { ...i, isDistractor: !i.isDistractor } : i) });
  };
  // --------------------------------------------------


  return (
    <div className="question-editor">
      {/* Header: Common Fields */}
      <div className="question-editor__header">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 mb-1">Nội dung câu hỏi</label>
          <textarea 
            value={question.question}
            onChange={(e) => handleQuestionChange(e.target.value)}
            className="w-full text-lg font-medium border-none p-0 focus:ring-0 resize-none bg-transparent placeholder-gray-300"
            rows={2}
            placeholder="Nhập câu hỏi tại đây..."
          />
        </div>
        <div className="ml-4 border-l border-gray-200 pl-4">
             <label className="block text-xs font-semibold text-gray-500 mb-1">Điểm số</label>
             <input 
               type="number" 
               min="1"
               value={question.points}
               onChange={(e) => handlePointsChange(Number(e.target.value))}
               className="w-16 text-center border border-gray-200 rounded p-1 text-sm font-semibold text-indigo-600 focus:border-indigo-500 outline-none"
             />
        </div>
      </div>

      <div className="question-editor__body">
        {question.type === 'multichoice' && (
          <div className="space-y-3">
             <label className="block text-sm font-medium text-gray-700">Các lựa chọn (Click chọn đáp án đúng)</label>
             <div className="space-y-2">
               {question.options.map((opt, idx) => (
                 <div key={opt.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${opt.isCorrect ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <button 
                      onClick={() => handleCorrectSelect(opt.id)}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${opt.isCorrect ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 text-transparent hover:border-gray-400'}`}
                      title="Đặt làm đáp án đúng"
                    >
                      <Check size={14} />
                    </button>
                    
                    <span className="text-gray-400 text-xs font-mono w-4">{String.fromCharCode(65 + idx)}.</span>
                    
                    <input 
                      type="text" 
                      value={opt.text}
                      onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0 text-gray-800 placeholder-gray-400"
                      placeholder={`Nhập lựa chọn ${idx + 1}`}
                    />

                    <button 
                      onClick={() => removeOption(opt.id)}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                 </div>
               ))}
             </div>
             <button 
               onClick={addOption}
               className="text-sm text-indigo-600 font-medium flex items-center gap-1 hover:text-indigo-800 transition-colors mt-2"
             >
               <Plus size={16} /> Thêm lựa chọn
             </button>
          </div>
        )}

        {question.type === 'short_answer' && (
           <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Các đáp án chấp nhận được</label>
                  <p className="text-xs text-gray-500 mb-3">Học sinh trả lời đúng một trong các đáp án này sẽ được điểm.</p>
                  
                  <div className="space-y-2">
                    {question.correctAnswers.map((ans, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input 
                                type="text" 
                                value={ans} 
                                onChange={(e) => updateShortAnswer(idx, e.target.value)}
                                className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder={`Đáp án đúng ${idx + 1}`}
                            />
                            <button onClick={() => removeShortAnswer(idx)} className="text-gray-400 hover:text-red-500">
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                  </div>
                  
                  <button onClick={addShortAnswer} className="mt-3 text-sm text-indigo-600 font-medium flex items-center gap-1 hover:text-indigo-800">
                    <Plus size={16} /> Thêm đáp án chấp nhận
                  </button>
               </div>
           </div>
        )}

        {question.type === 'fill_blank' && (
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Nội dung đoạn văn</label>
                <p className="text-xs text-gray-500 mb-2">Sử dụng cặp ngoặc vuông <code>[đáp án]</code> để tạo chỗ trống.</p>
                
                <textarea 
                    value={question.content}
                    onChange={(e) => handleFillContentChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-4 text-sm font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none"
                    rows={8}
                    placeholder="Ví dụ: Thủ đô của Việt Nam là [Hà Nội]."
                />

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Các từ cần điền ({question.blanks.length})</h4>
                    <div className="flex flex-wrap gap-2">
                        {question.blanks.map((blank, idx) => (
                            <span key={blank.id} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-medium border border-indigo-200">
                                {idx + 1}. {blank.answer}
                            </span>
                        ))}
                        {question.blanks.length === 0 && (
                            <span className="text-gray-400 text-xs italic">Chưa có chỗ trống nào. Hãy thêm [từ] vào nội dung.</span>
                        )}
                    </div>
                </div>
            </div>
        )}

        {question.type === 'sort' && (
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Thứ tự đúng</label>
                <div className="space-y-2">
                    {question.items.map((item, idx) => (
                        <div key={item.id} className={`flex items-center gap-3 p-3 border rounded-lg group transition-colors ${item.isDistractor ? 'bg-red-50 border-red-200 opacity-75' : 'bg-white border-gray-200 hover:border-indigo-300'}`}>
                            <div className="flex flex-col gap-1">
                                <button 
                                    onClick={() => moveSortItem(idx, 'up')}
                                    disabled={idx === 0}
                                    className="text-gray-300 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-300"
                                >
                                    <ArrowUp size={14} />
                                </button>
                                <button 
                                    onClick={() => moveSortItem(idx, 'down')}
                                    disabled={idx === question.items.length - 1}
                                    className="text-gray-300 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-300"
                                >
                                    <ArrowDown size={14} />
                                </button>
                            </div>
                            
                            <span className={`text-xs font-mono font-bold w-6 text-center ${item.isDistractor ? 'text-red-400 line-through' : 'text-gray-400'}`}>{idx + 1}</span>

                            <input 
                                type="text" 
                                value={item.content}
                                onChange={(e) => updateSortItem(item.id, e.target.value)}
                                className={`flex-1 bg-transparent border-none text-sm focus:ring-0 p-0 ${item.isDistractor ? 'text-red-600' : 'text-gray-900'}`}
                                placeholder="Nội dung mục..."
                            />

                            <button 
                                onClick={() => toggleSortDistractor(item.id)}
                                className={`p-1.5 rounded hover:bg-black/5 transition-colors ${item.isDistractor ? 'text-red-500 bg-red-100' : 'text-gray-300 hover:text-gray-600'}`}
                                title={item.isDistractor ? "Đang là phương án sai (Distractor)" : "Đặt làm phương án sai"}
                            >
                                <Ban size={16} />
                            </button>

                            <button onClick={() => removeSortItem(item.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
                <button onClick={addSortItem} className="mt-2 text-sm text-indigo-600 font-medium flex items-center gap-1 hover:text-indigo-800">
                    <Plus size={16} /> Thêm mục
                </button>
            </div>
        )}

        {question.type === 'match' && (
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Các cặp nối (Trái - Phải)</label>
                <div className="space-y-2">
                    {question.pairs.map((pair, idx) => (
                        <div key={pair.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg group hover:border-indigo-300 transition-colors">
                            <span className="text-gray-400 text-xs font-bold w-6 text-center">{idx + 1}</span>
                            
                            <div className="flex-1 flex items-center gap-2">
                                <input 
                                    type="text" 
                                    value={pair.left}
                                    onChange={(e) => updatePair(pair.id, 'left', e.target.value)}
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Vế trái..."
                                />
                                <span className="text-gray-400">↔</span>
                                <input 
                                    type="text" 
                                    value={pair.right}
                                    onChange={(e) => updatePair(pair.id, 'right', e.target.value)}
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Vế phải..."
                                />
                            </div>

                            <button onClick={() => removePair(pair.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
                <button onClick={addPair} className="mt-2 text-sm text-indigo-600 font-medium flex items-center gap-1 hover:text-indigo-800">
                    <Plus size={16} /> Thêm cặp
                </button>
            </div>
        )}

        {question.type === 'click_order' && (
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Thứ tự đúng của câu/từ</label>
                <p className="text-xs text-gray-500 mb-2">Nhập các từ hoặc cụm từ theo đúng thứ tự. Học sinh sẽ phải click chọn theo thứ tự này.</p>
                <div className="space-y-2">
                    {question.items.map((item, idx) => (
                        <div key={item.id} className={`flex items-center gap-3 p-3 border rounded-lg group transition-colors ${item.isDistractor ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 hover:border-indigo-300'}`}>
                            <div className="flex flex-col gap-1">
                                <button 
                                    onClick={() => moveClickItem(idx, 'up')}
                                    disabled={idx === 0}
                                    className="text-gray-300 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-300"
                                >
                                    <ArrowUp size={14} />
                                </button>
                                <button 
                                    onClick={() => moveClickItem(idx, 'down')}
                                    disabled={idx === question.items.length - 1}
                                    className="text-gray-300 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-300"
                                >
                                    <ArrowDown size={14} />
                                </button>
                            </div>
                            
                            <span className={`px-2 py-1 rounded text-xs font-bold border min-w-[24px] text-center ${item.isDistractor ? 'bg-red-100 text-red-600 border-red-200 line-through decoration-red-400' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`}>
                                {idx + 1}
                            </span>

                            <input 
                                type="text" 
                                value={item.content}
                                onChange={(e) => updateClickItem(item.id, e.target.value)}
                                className={`flex-1 bg-transparent border-none text-sm focus:ring-0 p-0 ${item.isDistractor ? 'text-red-600' : 'text-gray-900'}`}
                                placeholder="Nhập từ/cụm từ..."
                            />

                            <button 
                                onClick={() => toggleClickDistractor(item.id)}
                                className={`p-1.5 rounded hover:bg-black/5 transition-colors ${item.isDistractor ? 'text-red-500 bg-red-100' : 'text-gray-300 hover:text-gray-600'}`}
                                title={item.isDistractor ? "Đang là từ nhiễu (Distractor)" : "Đặt làm từ nhiễu"}
                            >
                                <Ban size={16} />
                            </button>

                            <button onClick={() => removeClickItem(item.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
                <button onClick={addClickItem} className="mt-2 text-sm text-indigo-600 font-medium flex items-center gap-1 hover:text-indigo-800">
                    <Plus size={16} /> Thêm từ
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
