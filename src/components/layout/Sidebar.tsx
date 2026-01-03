import { NavLink } from 'react-router-dom';
import { LayoutGrid, GraduationCap, Settings as SettingsIcon, Link2 } from 'lucide-react';
import clsx from 'clsx';

export function Sidebar() {
  const initialGroups = [
    { id: 1, name: 'Lớp 9A', color: 'green' },
    { id: 2, name: 'Lớp 9B (Nâng cao)', color: 'blue' }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-20 shadow-sm font-sans h-screen fixed left-0 top-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white mr-3 shadow-md">
          <GraduationCap size={20} />
        </div>
        <span className="font-bold text-gray-800 text-lg tracking-tight">Content Mgr</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <div className="px-3 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Quản lý lớp học</div>
        
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => clsx(
            "w-full flex items-center px-3 py-2.5 rounded-lg font-medium transition-colors group",
            isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <LayoutGrid size={20} className="mr-3 group-[.active]:text-indigo-600 text-gray-400 group-hover:text-indigo-600" />
          Danh sách Lớp
        </NavLink>

        <NavLink 
          to="/concepts" 
          className={({ isActive }) => clsx(
            "w-full flex items-center px-3 py-2.5 rounded-lg font-medium transition-colors group",
            isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <Link2 size={20} className="mr-3 group-[.active]:text-indigo-600 text-gray-400 group-hover:text-indigo-600" />
          Knowledge Graph
        </NavLink>

        <div className="px-3 mt-8 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Truy cập nhanh</div>
        {initialGroups.map(group => (
          <button 
            key={group.id}
            className="w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors group text-gray-600 hover:bg-gray-50"
          >
            <span className={`w-2 h-2 rounded-full mr-3 group-hover:scale-110 transition-transform ${group.color === 'green' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
            {group.name}
          </button>
        ))}

        <div className="px-3 mt-8 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Hệ thống</div>
        <NavLink 
          to="/settings" 
          className={({ isActive }) => clsx(
            "w-full flex items-center px-3 py-2.5 rounded-lg font-medium transition-colors group",
            isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <SettingsIcon size={20} className="mr-3 group-[.active]:text-indigo-600 text-gray-400 group-hover:text-indigo-600" />
          Cấu hình
        </NavLink>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">A</div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">Admin Content</p>
            <p className="text-[11px] text-gray-500 truncate">Giáo viên chủ nhiệm</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
