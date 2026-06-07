import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard Layout
import DashboardLayout from './components/DashboardLayout';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import BrowseVacancies from './pages/student/BrowseVacancies';
import MyApplications from './pages/student/MyApplications';
import Logbook from './pages/student/Logbook';
import Documents from './pages/student/Documents';

// Company Pages
import CompanyDashboard from './pages/company/Dashboard';
import PostVacancy from './pages/company/PostVacancy';
import ManageApplications from './pages/company/ManageApplications';
import Evaluation from './pages/company/Evaluation';

// Supervisor Pages
import SupervisorDashboard from './pages/supervisor/Dashboard';
import MyStudents from './pages/supervisor/MyStudents';
import LogbookReview from './pages/supervisor/LogbookReview';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCompanies from './pages/admin/ManageCompanies';
import Reports from './pages/admin/Reports';
import Announcements from './pages/admin/Announcements';

// Notification Toast
function NotificationToast() {
  const { notification } = useAuth();
  if (!notification) return null;
  const colors = {
    success: 'bg-green-600',
    error: 'bg-ttu-red',
    info: 'bg-ttu-blue',
    warning: 'bg-amber-500',
  };
  return (
    <div className={`fixed top-4 right-4 z-[100] ${colors[notification.type] || colors.info} text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium animate-fadeIn max-w-sm`}>
      {notification.message}
    </div>
  );
}

// Protected Route
function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ttu-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    const redirects = { student: '/student/dashboard', company: '/company/dashboard', supervisor: '/supervisor/dashboard', admin: '/admin/dashboard' };
    return <Navigate to={redirects[user.role] || '/'} replace />;
  }
  return children;
}

// Role Dashboard Wrapper
function RoleLayout({ role, children }) {
  return (
    <ProtectedRoute requiredRole={role}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

// Auto redirect after login
function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Landing />;
  const redirects = { student: '/student/dashboard', company: '/company/dashboard', supervisor: '/supervisor/dashboard', admin: '/admin/dashboard' };
  return <Navigate to={redirects[user.role] || '/login'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <NotificationToast />
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student */}
            <Route path="/student/dashboard" element={<RoleLayout role="student"><StudentDashboard /></RoleLayout>} />
            <Route path="/student/vacancies" element={<RoleLayout role="student"><BrowseVacancies /></RoleLayout>} />
            <Route path="/student/applications" element={<RoleLayout role="student"><MyApplications /></RoleLayout>} />
            <Route path="/student/logbook" element={<RoleLayout role="student"><Logbook /></RoleLayout>} />
            <Route path="/student/documents" element={<RoleLayout role="student"><Documents /></RoleLayout>} />

            {/* Company */}
            <Route path="/company/dashboard" element={<RoleLayout role="company"><CompanyDashboard /></RoleLayout>} />
            <Route path="/company/post-vacancy" element={<RoleLayout role="company"><PostVacancy /></RoleLayout>} />
            <Route path="/company/applications" element={<RoleLayout role="company"><ManageApplications /></RoleLayout>} />
            <Route path="/company/evaluation" element={<RoleLayout role="company"><Evaluation /></RoleLayout>} />

            {/* Supervisor */}
            <Route path="/supervisor/dashboard" element={<RoleLayout role="supervisor"><SupervisorDashboard /></RoleLayout>} />
            <Route path="/supervisor/students" element={<RoleLayout role="supervisor"><MyStudents /></RoleLayout>} />
            <Route path="/supervisor/logbooks" element={<RoleLayout role="supervisor"><LogbookReview /></RoleLayout>} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<RoleLayout role="admin"><AdminDashboard /></RoleLayout>} />
            <Route path="/admin/users" element={<RoleLayout role="admin"><ManageUsers /></RoleLayout>} />
            <Route path="/admin/companies" element={<RoleLayout role="admin"><ManageCompanies /></RoleLayout>} />
            <Route path="/admin/reports" element={<RoleLayout role="admin"><Reports /></RoleLayout>} />
            <Route path="/admin/announcements" element={<RoleLayout role="admin"><Announcements /></RoleLayout>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
