import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Library, PlusCircle } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const initialGroups = [
    { 
      id: 1, 
      name: 'Lớp 9A', 
      desc: 'Chương trình chuẩn • 2023-2024', 
      lessons: 12, 
      color: 'green'
    },
    { 
      id: 2, 
      name: 'Lớp 9B (Nâng cao)', 
      desc: 'Chương trình chuyên Toán', 
      lessons: 15, 
      color: 'blue'
    }
  ];

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Danh sách Lớp học</h2>
          <p className="text-gray-500 mt-1 text-sm">Chọn lớp để quản lý nội dung bài giảng và tài nguyên.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 transition-all hover:shadow-indigo-200 hover:shadow-md cursor-pointer">
          <Plus size={18} /> Thêm lớp mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {initialGroups.map(group => (
          <div 
            key={group.id}
            onClick={() => navigate(`/group/${group.id}`)} 
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-300 cursor-pointer transition-all group duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${group.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                {/* Fixed Icon for now as GraduationCap is generic */}
                <Library size={24} />
              </div>
              <ArrowRight size={20} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{group.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{group.desc}</p>
            <div className="flex items-center gap-4 text-xs font-medium text-gray-500 border-t border-gray-50 pt-4">
              <span className="flex items-center gap-1"><Library size={14} /> {group.lessons} Bài giảng</span>
            </div>
          </div>
        ))}

        {/* Add Card */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 cursor-pointer transition-all h-full min-h-[180px]">
          <PlusCircle size={32} className="mb-2" />
          <span className="text-sm font-medium">Tạo lớp học mới</span>
        </div>
      </div>
    </div>
  );
}
