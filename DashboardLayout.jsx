import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  GraduationCap, LayoutDashboard, Briefcase, FileText, BookOpen, Upload,
  Users, Building2, BarChart3, Megaphone, ClipboardList, Star, Settings,
  Bell, LogOut, Menu, X, ChevronDown, User, Search, Sun, Moon,
} from 'lucide-react';

const NAV_CONFIG = {
  student: [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/vacancies', icon: Search, label: 'Browse Vacancies' },
    { to: '/student/applications', icon: Briefcase, label: 'My Applications' },
    { to: '/student/logbook', icon: BookOpen, label: 'Weekly Logbook' },
    { to: '/student/documents', icon: Upload, label: 'Documents' },
  ],
  company: [
    { to: '/company/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/company/post-vacancy', icon: Briefcase, label: 'Post Vacancy' },
    { to: '/company/applications', icon: ClipboardList, label: 'Applications' },
    { to: '/company/evaluation', icon: Star, label: 'Evaluations' },
  ],
  supervisor: [
    { to: '/supervisor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/supervisor/students', icon: Users, label: 'My Students' },
    { to: '/supervisor/logbooks', icon: BookOpen, label: 'Logbook Review' },
  ],
  admin: [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Manage Users' },
    { to: '/admin/companies', icon: Building2, label: 'Companies & Vacancies' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports & Analytics' },
    { to: '/admin/announcements', icon: Megaphone, label: 'Announcements' },
  ],
};

const ROLE_LABELS = {
  student: 'Student Portal',
  company: 'Company Portal',
  supervisor: 'Supervisor Portal',
  admin: 'Admin Panel',
};

const ROLE_COLORS = {
  student: 'from-ttu-blue to-blue-700',
  company: 'from-emerald-700 to-emerald-600',
  supervisor: 'from-purple-700 to-purple-600',
  admin: 'from-ttu-red to-red-700',
};

function ThemeToggle({ className = '' }) {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`p-2 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ttu-blue focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
        dark
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${className}`}
    >
      {dark ? <Sun className="w-4.5 h-4.5 w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
    </button>
  );
}

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = NAV_CONFIG[user?.role] || [];
  const gradientClass = ROLE_COLORS[user?.role] || ROLE_COLORS.student;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const SidebarContent = () => (
    <div className={`flex flex-col h-full bg-gradient-to-b ${gradientClass}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/20">
        <div className="w-9 h-9 bg-ttu-gold rounded-full flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-ttu-blue" />
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight">TTU IMS</div>
          <div className="text-white/60 text-xs">{ROLE_LABELS[user?.role]}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-link ${active ? 'active' : ''}`}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Card */}
      <div className="px-3 py-4 border-t border-white/20">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10">
          <div className="w-8 h-8 bg-ttu-gold rounded-full flex items-center justify-center text-ttu-blue font-bold text-xs flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold truncate">{user?.name}</div>
            <div className="text-white/60 text-[10px] truncate capitalize">{user?.role}</div>
          </div>
          <button onClick={handleLogout} className="text-white/60 hover:text-white transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-60 flex-shrink-0 shadow-xl">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 flex-shrink-0">
            <SidebarContent />
          </div>
          <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white z-10">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 h-14 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 hidden sm:block">
              {navItems.find(n => n.to === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* Notifications Bell */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-ttu-red rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-7 h-7 bg-ttu-blue rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {initials}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block max-w-[120px] truncate">
                  {user?.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-20">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="text-xs font-semibold text-gray-800 dark:text-gray-100">{user?.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</div>
                  </div>
                  <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <User className="w-4 h-4" /> Profile
                  </a>
                  <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Settings className="w-4 h-4" /> Settings
                  </a>
                  <hr className="my-1 border-gray-100 dark:border-gray-700" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ttu-red hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
