import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Bell, Settings, ChevronRight } from 'lucide-react';
import React from 'react';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Simple Breadcrumb Logic
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const crumbs = [{ label: "Danh sách Lớp", path: "/" }];

    if (path.includes('/editor')) {
      crumbs.push({ label: "Soạn thảo bài học", path: path });
    } else if (path.includes('/settings')) {
       crumbs.push({ label: "Cấu hình", path: "/settings" });
    } else if (path.includes('/concepts')) {
       crumbs.push({ label: "Knowledge Graph", path: "/concepts" });
    }

    return (
      <nav className="flex items-center text-sm text-gray-500">
        {crumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight size={14} className="mx-2 text-gray-400" />}
            {idx === crumbs.length - 1 ? (
              <span className="font-bold text-gray-800">{crumb.label}</span>
            ) : (
              <span 
                onClick={() => navigate(crumb.path)} 
                className="hover:text-indigo-600 cursor-pointer transition-colors"
              >
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen flex font-sans">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 shadow-sm sticky top-0 z-10">
          {getBreadcrumbs()}
          
          <div className="flex gap-3">
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors">
              <Bell size={20} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-auto">
             <Outlet />
        </main>
      </div>
    </div>
  );
}
