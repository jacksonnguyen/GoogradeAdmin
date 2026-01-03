import { useNavigate, useParams } from 'react-router-dom';
import { Search, ChevronDown, PlusCircle, Link2Off, Edit3 } from 'lucide-react';
import { useState } from 'react';

// Mock Data matching the design
const groupLessonsData = [
  {
    id: 1,
    title: "Căn bậc hai",
    chapter: "Chương 1",
    status: "published", // published, draft
    lastEdited: "Hôm qua bởi Admin",
    relations: ["LT", "ST"] // Initials for linked lessons
  },
  {
    id: 2,
    title: "Hàm số bậc nhất",
    chapter: "Chương 2",
    status: "draft",
    lastEdited: "2 phút trước",
    relations: []
  }
];

export function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative max-w-sm w-full group">
          <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm" 
            placeholder="Tìm kiếm bài học..." 
          />
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <select className="appearance-none border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm text-gray-600 bg-white focus:outline-none focus:border-indigo-500 shadow-sm cursor-pointer hover:border-gray-300">
              <option>Tất cả các chương</option>
              <option>Chương 1: Đại số</option>
              <option>Chương 2: Hình học</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={20} />
          </div>
          
          <button onClick={() => navigate('/editor')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm flex items-center gap-2 transition-all hover:shadow-indigo-200">
            <PlusCircle size={18} /> Tạo bài mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 w-16 text-center">#</th>
              <th className="px-6 py-4">Tên Bài Giảng</th>
              <th className="px-6 py-4">Chương</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Liên kết (Bài cũ)</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {groupLessonsData.map((lesson, idx) => (
              <tr 
                key={lesson.id} 
                onClick={() => navigate(`/editor/${lesson.id}`)}
                className="hover:bg-indigo-50/40 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4 text-center text-gray-400">0{idx + 1}</td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors text-base">{lesson.title}</span>
                  <p className="text-[11px] text-gray-400 mt-1">Sửa lần cuối: {lesson.lastEdited}</p>
                </td>
                <td className="px-6 py-4 text-gray-600"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{lesson.chapter}</span></td>
                <td className="px-6 py-4">
                  {lesson.status === 'published' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-[11px] font-bold border border-green-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Đã xuất bản
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-full text-[11px] font-bold border border-yellow-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Bản nháp
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {lesson.relations.length > 0 ? (
                    <div className="flex -space-x-2 overflow-hidden">
                      {lesson.relations.map((r, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-sm ${i % 2 === 0 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                          {r}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic text-xs flex items-center gap-1">
                      <Link2Off size={14} /> Chưa liên kết
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors">
                    <Edit3 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
