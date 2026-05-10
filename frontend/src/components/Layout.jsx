import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, List, PlusSquare, Settings, 
  LogOut, BarChart2, Menu, Bell, Search, 
  ChevronRight, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ErrorBoundary from './ErrorBoundary';
import { useState } from 'react';

export default function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/audits', label: 'Audit Reports', icon: <List size={20} /> },
    { path: '/analytics', label: 'Analytics', icon: <BarChart2 size={20} /> },
    { path: '/audits/new', label: 'Initiate Audit', icon: <PlusSquare size={20} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 glass-card border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="h-24 flex items-center px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Sparkles className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter">TOOL‑24</h1>
              <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">Enterprise AI</div>
            </div>
          </div>
        </div>

        <nav className="px-4 py-4 space-y-1.5 flex-1 overflow-y-auto">
          <div className="px-4 mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Main Navigation</span>
          </div>
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              onClick={() => setIsSidebarOpen(false)} 
              className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                isActive(item.path) 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3.5 font-bold text-sm">
                <span className={isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 transition-colors'}>
                  {item.icon}
                </span>
                {item.label}
              </div>
              {isActive(item.path) && <ChevronRight size={14} className="text-white/70" />}
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 font-black shadow-sm border border-slate-200">
                {(user?.username || 'JD').substring(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-sm font-bold text-slate-900 truncate">{user?.username || 'Guest Developer'}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Level 3 Access</div>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-rose-600 text-xs font-black uppercase tracking-widest rounded-xl border border-rose-100 hover:bg-rose-50 transition-all"
            >
              <LogOut size={14} />
              Logout Session
            </button>
          </div>
          <div className="text-center">
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">© 2026 Relanto Interns</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 sm:px-10 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-xl">
                <Search size={18} className="text-slate-400" />
              </div>
              <span className="text-sm font-bold text-slate-400">Global Command Center</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
              <Settings size={20} />
            </button>
            <div className="ml-2 w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-slate-200 cursor-pointer hover:scale-105 transition-transform">
              {(user?.username || 'J').substring(0, 1).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 sm:p-10 relative">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
